const {PGlite}=require('../samples/node_modules/@electric-sql/pglite');
const fs=require('node:fs');const assert=require('node:assert/strict');
(async()=>{
 const db=new PGlite();const id=n=>`00000000-0000-0000-0000-${String(n).padStart(12,'0')}`;
 await db.exec(`create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create schema storage;
 create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('test.uid',true),'')::uuid$$;
 create function index_account_active() returns boolean language sql stable as $$select current_setting('test.active',true)='yes'$$;
 create function authorize(d text,c text,r uuid default null) returns boolean language sql stable as $$select index_account_active() and (current_setting('test.cap',true)='admin' or (d=current_setting('test.div',true) and (c='read' or c=current_setting('test.cap',true))))$$;
 create table products(id uuid primary key,division text);create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
 create table storage.objects(id uuid primary key default gen_random_uuid(),bucket_id text,name text);alter table storage.objects enable row level security;
 grant usage on schema public,auth,storage to authenticated,anon,service_role;grant select,insert on storage.objects to authenticated;grant execute on all functions in schema auth to authenticated,anon,service_role;
 insert into auth.users values('${id(1)}'),('${id(2)}');`);
 const migration=fs.readdirSync('../../supabase/migrations'.replace('../..',require('path').join(__dirname,'../..'))).find(x=>x.endsWith('_sample_digitization.sql'));
 await db.exec('alter default privileges in schema public grant all on tables to anon,authenticated');
 await db.exec(fs.readFileSync(require('path').join(__dirname,'../../supabase/migrations',migration),'utf8'));
 await db.exec(fs.readFileSync(require('path').join(__dirname,'../../supabase/migrations/20261124225636_digitization_worker_gateway.sql'),'utf8'));
 async function as(user,division='fabric',cap='write',active='yes'){await db.exec('reset role');await db.query("select set_config('test.uid',$1,false),set_config('test.div',$2,false),set_config('test.cap',$3,false),set_config('test.active',$4,false)",[user,division,cap,active]);await db.exec('set role authenticated')}
 async function rpc(name,args=[]){return (await db.query(`select to_jsonb(${name}(${args.map((_,i)=>'$'+(i+1)).join(',')})) as v`,args)).rows[0].v}
 await as(id(1));await assert.rejects(db.exec('select * from digitization_worker_credentials'),/permission denied/);const batch=await rpc('digitization_batch',['Pilot','fabric']);
 const j=await rpc('digitization_enqueue',[id(10),batch,'a'.repeat(64),'synthetic.png']);assert.equal(j.status,'Pending');
 const same=await rpc('digitization_enqueue',[id(11),batch,'a'.repeat(64),'same.png']);assert.equal(same.id,j.id);
 await assert.rejects(rpc('digitization_action',[j.id,1,'ready']),/Upload missing/);
 await db.query('insert into storage.objects(bucket_id,name) values($1,$2)',['sample-digitization',j.original_path]);
 await rpc('digitization_action',[j.id,1,'ready']);
 await assert.rejects(db.exec("update digitization_jobs set status='Validated'"),/permission denied/);
 await assert.rejects(rpc('digitization_claim'),/permission denied/);
 await as(id(2),'yarn');assert.equal((await db.query('select * from digitization_jobs')).rows.length,0);
 await assert.rejects(rpc('digitization_action',[j.id,2,'cancel']),/insufficient_privilege|permission denied/);
 assert.equal((await db.query('select * from storage.objects')).rows.length,0);
 await as(id(1));await rpc('digitization_pause',[batch,true]);await db.exec('reset role;set role service_role');assert.equal(await rpc('digitization_claim'),null);
 await as(id(1));await rpc('digitization_pause',[batch,false]);await db.exec('reset role;set role service_role');
 const claim=await rpc('digitization_claim');assert.equal(claim.job.id,j.id);assert.equal(await rpc('digitization_claim'),null);
 assert.equal(await rpc('digitization_finish',[j.id,id(99),{},null]),false);
 const result={fields:{'Development Code':{value:'SYNTHETIC-1',original:'SYNTHETIC-1'}},warnings:[],text_fingerprint:'test',elapsed_seconds:2};
 assert.equal(await rpc('digitization_finish',[j.id,claim.job.lease,result,null]),true);
 assert.equal(await rpc('digitization_finish',[j.id,claim.job.lease,result,null]),false);
 await as(id(1));let row=(await db.query('select * from digitization_jobs')).rows[0];assert.equal(row.status,'Needs Review');
 await assert.rejects(rpc('digitization_action',[j.id,row.revision,'validate',result.fields,'']),/note required/);
 await rpc('digitization_action',[j.id,row.revision,'validate',result.fields,'Verified synthetic evidence']);
 await assert.rejects(rpc('digitization_action',[j.id,row.revision,'save',{}]),/Record changed/);
 row=(await db.query('select * from digitization_jobs')).rows[0];assert.equal(row.status,'Validated');assert.equal(row.validated_by,id(1));
 await as(id(1),'fabric','write','no');assert.equal((await db.query('select * from digitization_jobs')).rows.length,0);await assert.rejects(rpc('digitization_batch',['Forbidden','fabric']));
 await as(id(1));const j2=await rpc('digitization_enqueue',[id(12),batch,'b'.repeat(64),'recovery.png']);await db.query('insert into storage.objects(bucket_id,name) values($1,$2)',['sample-digitization',j2.original_path]);await rpc('digitization_action',[j2.id,1,'ready']);
 await db.exec('reset role;set role service_role');const lease1=await rpc('digitization_claim');await db.exec("update digitization_jobs set lease_until=now()-interval '1 minute' where status='Processing'");const lease2=await rpc('digitization_claim');assert.notEqual(lease1.job.lease,lease2.job.lease);assert.equal(await rpc('digitization_finish',[j2.id,lease1.job.lease,result,null]),false);
 await as(id(1));await rpc('digitization_action',[j2.id,lease2.job.revision,'cancel']);await db.exec('reset role;set role service_role');assert.equal(await rpc('digitization_finish',[j2.id,lease2.job.lease,result,null]),false);

 await db.exec('reset role;set role service_role');
 await db.query(`insert into digitization_jobs(id,batch_id,created_by,filename,sha256,original_path,ready)
 select gen_random_uuid(),$1,$2,'SYNTHETIC-'||n,md5(n::text)||md5(n::text),'synthetic-bulk/'||n,true from generate_series(1,4001) n`,[batch,id(1)]);
 assert.equal((await db.query("select count(*)::int as n from digitization_jobs where filename like 'SYNTHETIC-%'")).rows[0].n,4001);
 await db.exec("update digitization_settings set config=jsonb_set(config,'{concurrency}','4')");
 const assigned=[];for(let n=0;n<4;n++)assigned.push(await rpc('digitization_claim'));assert.equal(new Set(assigned.map(x=>x.job.id)).size,4);assert.equal(await rpc('digitization_claim'),null);
 for(const c of assigned)assert.equal(await rpc('digitization_finish',[c.job.id,c.job.lease,{...result,dhash:'0000000000000000'},null]),true);
 await as(id(1));const metrics=await rpc('digitization_metrics',[batch]);assert.equal(Number(metrics.pending),3997);assert.equal(metrics.accuracy[0].reviewed,1);
 console.log('PASS: 4,001 synthetic queued records, global concurrency=4, metrics and duplicate candidates');
 console.log('PASS: RLS, private storage, hash idempotency, review, stale revisions, suspension, pause, leases and cancellation');await db.close();
})().catch(e=>{console.error(e);process.exit(1)});
