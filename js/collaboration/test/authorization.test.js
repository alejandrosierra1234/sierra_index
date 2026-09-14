import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';

test('database enforces private membership, read-only, revocation, suspension and checkpoint CAS',async()=>{
  const db=new PGlite();
  try {
    await db.exec(`
      create role anon;create role authenticated;
      create schema auth;
      create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
      create function auth.role() returns text language sql stable as $$select current_user::text$$;
      create table public.profiles(id uuid primary key,email text,full_name text,account_status text);
      create table public.capability_grants(user_id uuid,domain text,capability text,resource_id uuid,expires_at timestamptz,granted_by uuid);
      create table public.index_security_migrations(version integer primary key,applied_at timestamptz default now());
      create function public.index_account_active() returns boolean language sql stable security definer as $$
        select exists(select 1 from public.profiles where id=auth.uid() and account_status='active')$$;
      insert into profiles values
        ('00000000-0000-4000-8000-000000000001','owner@test.local','Owner','active'),
        ('00000000-0000-4000-8000-000000000002','editor@test.local','Editor','active'),
        ('00000000-0000-4000-8000-000000000003','viewer@test.local','Viewer','active'),
        ('00000000-0000-4000-8000-000000000004','stranger@test.local','Stranger','active');
    `);
    const authorization=await readFile(new URL('../../../update40.sql',import.meta.url),'utf8');
    await db.exec(authorization.slice(authorization.indexOf('create or replace function public.authorize('),authorization.indexOf('create or replace function public.get_my_access(')));
    await db.exec(`insert into capability_grants(user_id,domain,capability)
      select id,'communications','read' from profiles;
      insert into capability_grants(user_id,domain,capability)
      select id,'communications','write' from profiles where email<>'viewer@test.local';`);
    const migration=await readFile(new URL('../../../update43.sql',import.meta.url),'utf8');
    await db.exec(migration);
    await db.exec(await readFile(new URL('../../../update41.sql',import.meta.url),'utf8'));
    await db.exec(migration);
    const account=async number=>{await db.exec(`reset role;set request.jwt.claim.sub='00000000-0000-4000-8000-00000000000${number}';set role authenticated;`);};
    const query=async(sql,args=[]) => (await db.query(sql,args)).rows[0];
    const denied=async(sql,args=[])=>assert.rejects(db.query(sql,args),error=>error.code==='42501');
    await account(1);
    const{id}=await query("select communication_create('memo-one','Private','memo','AQ==') as id");
    await db.query('select communication_share($1,$2,$3)',[id,'editor@test.local','editor']);
    await db.query('select communication_share($1,$2,$3)',[id,'viewer@test.local','viewer']);
    await denied('select * from communication_documents');
    await denied('insert into communication_members values($1,$2,$3,$2,now())',[id,'00000000-0000-4000-8000-000000000004','editor']);
    await account(4);
    assert.deepEqual((await query('select communication_list() as docs')).docs,[]);
    await denied('select communication_sync($1)',[id]);
    await denied('select communication_access($1)',[id]);
    await denied('select communication_share($1,$2,$3)',[id,'stranger@test.local','editor']);
    await account(3);
    assert.equal((await query('select communication_sync($1) as result',[id])).result.role,'viewer');
    await denied('select communication_sync($1,-1,$2,$3)',[id,crypto.randomUUID(),'Ag==']);
    await denied('select communication_checkpoint($1,0,$2,$3)',[id,'Ag==','Changed']);
    await account(2);
    const nonce=crypto.randomUUID();
    const updated=await query('select communication_sync($1,-1,$2,$3) as result',[id,nonce,'Ag==']);
    assert.equal(updated.result.revision,1);
    assert.equal((await query('select communication_sync($1,-1,$2,$3) as result',[id,nonce,'Ag=='])).result.revision,1);
    assert.equal((await query('select communication_checkpoint($1,0,$2,$3) as ok',[id,'Ag==','Changed'])).ok,false);
    assert.equal((await query('select communication_checkpoint($1,1,$2,$3) as ok',[id,'Ag==','Changed'])).ok,true);
    await account(1);
    await db.query('select communication_share($1,$2,null)',[id,'editor@test.local']);
    await account(2);
    await denied('select communication_sync($1)',[id]);
    await denied('select communication_sync($1,-1,$2,$3)',[id,crypto.randomUUID(),'Ag==']);
    await db.exec("reset role;update profiles set account_status='suspended' where email='viewer@test.local'");
    await account(3);await denied('select communication_sync($1)',[id]);
    await denied("select communication_create('memo-x','X','memo','AQ==')");
    await account(1);await db.query('select communication_share($1,$2,null)',[id,'viewer@test.local']);
    // HR access cannot substitute for the module grant, even for the document owner.
    await db.exec(`reset role;delete from capability_grants where user_id='00000000-0000-4000-8000-000000000001';
      insert into capability_grants(user_id,domain,capability) values('00000000-0000-4000-8000-000000000001','talento_humano','write');`);
    await account(1);
    assert.deepEqual((await query('select communication_list() as docs')).docs,[]);
    await denied('select communication_sync($1)',[id]);
    await denied("select communication_create('no-permission','No','memo','AQ==')");
    await denied('select communication_share($1,$2,$3)',[id,'editor@test.local','editor']);
    await db.exec(`reset role;insert into capability_grants(user_id,domain,capability) values('00000000-0000-4000-8000-000000000001','communications','read');`);
    await account(1);
    assert.equal((await query('select communication_sync($1) as result',[id])).result.role,'viewer');
    await denied('select communication_sync($1,-1,$2,$3)',[id,crypto.randomUUID(),'Ag==']);
    await denied('select communication_checkpoint($1,1,$2,$3)',[id,'Ag==','Changed']);
    await denied('select communication_share($1,$2,$3)',[id,'editor@test.local','editor']);
    // Global module access does not confer membership in someone else's document.
    await db.exec(`reset role;insert into capability_grants(user_id,domain,capability) values('00000000-0000-4000-8000-000000000004','platform','admin');`);
    await account(4);await denied('select communication_sync($1)',[id]);
    await db.query("select set_index_access($1,'communications',array['read','write'])",['00000000-0000-4000-8000-000000000001']);
    await account(1);assert.equal((await query('select communication_sync($1) as result',[id])).result.role,'owner');
    await db.exec(`reset role;update capability_grants set expires_at=now()-interval '1 minute' where domain='communications' and user_id='00000000-0000-4000-8000-000000000001';`);
    await account(1);await denied('select communication_sync($1)',[id]);
    await db.exec('reset role;set role anon');
    await denied('select communication_list()');await denied('select * from communication_documents');
  }finally{await db.close();}
});
