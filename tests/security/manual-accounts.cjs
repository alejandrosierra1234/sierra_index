const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.join(__dirname,'../..');
const {JSDOM}=require('../communications/node_modules/jsdom');
const {transformSync}=require('../../js/collaboration/node_modules/esbuild');
const {PGlite}=require('../../js/collaboration/node_modules/@electric-sql/pglite');
const source=fs.readFileSync(path.join(root,'index.html'),'utf8');
const moduleObject={exports:{}};
const handlerSource=fs.readFileSync(path.join(root,'supabase/functions/_shared/create-manual-account.ts'),'utf8');
new Function('module','exports',transformSync(handlerSource,{loader:'ts',format:'cjs'}).code)(moduleObject,moduleObject.exports);

(async()=>{
 let authorized=true,valid=true,ready=true,invites=[];
 const createClient=(_url,key)=>key==='service'?{
  from:table=>{assert.equal(table,'index_security_migrations');return{select:()=>({eq:()=>({maybeSingle:async()=>({data:ready?{version:42}:null})})})};},
  auth:{admin:{inviteUserByEmail:async(email,options)=>{invites.push({email,options});return{data:{user:{id:'new-id',email}}};}}}
 }:{auth:{getUser:async()=>({data:{user:valid?{id:'admin'}:null}})},rpc:async()=>({data:authorized})};
 const handler=moduleObject.exports.createManualAccountHandler(createClient,{SUPABASE_URL:'https://test.local',SUPABASE_ANON_KEY:'anon',SUPABASE_SERVICE_ROLE_KEY:'service'});
 const send=body=>handler(new Request('https://test.local',{method:'POST',headers:{Authorization:'Bearer test','Content-Type':'application/json'},body:JSON.stringify(body)}));
 const account={email:'NEW@example.test',full_name:'New User'};
 authorized=false;assert.equal((await send(account)).status,403);assert.equal(invites.length,0);
 authorized=true;valid=false;assert.equal((await send(account)).status,401);valid=true;
 assert.equal((await send({...account,role:'admin'})).status,400);
 assert.equal((await send({...account,employee_id:'person'})).status,400);
 ready=false;assert.equal((await send(account)).status,503);assert.equal(invites.length,0);ready=true;
 assert.equal((await send(account)).status,200);assert.equal(invites[0].email,'new@example.test');assert.deepEqual(invites[0].options,{redirectTo:'https://alejandrosierra1234.github.io/sierra_index/auth.html',data:{full_name:'New User',role:'user'}});

 const dom=new JSDOM('<div id="m-create-user"><div id="cu-eyebrow"></div><div id="cu-title"></div><div id="cu-modal-body"></div><div class="modal-ftr"></div></div>',{url:'https://test.local',runScripts:'outside-only'}),w=dom.window;
 w.me={id:'admin'};w.loadGrants=async()=>true;w.can=()=>true;w.tx=(key)=>key;w.toast=()=>{};w.Audit={log:()=>{}};w.closeModal=()=>{};w.showUserManagement=async()=>{};
 const bodies=[];w.sb={from:()=>{throw Error('Account creation must not query HR')},functions:{invoke:async(name,args)=>{assert.equal(name,'create-index-account');bodies.push(args.body);return{data:{user:{id:'new-id'}}};}}};
 vm.runInContext(source.slice(source.indexOf('/* Manual Index accounts'),source.indexOf('async function teamRoleChanged')),dom.getInternalVMContext());
 await w.openCreateUserModal();assert.equal(w.document.querySelectorAll('input').length,2);assert.equal(w.document.getElementById('cu-role'),null);
 w.document.getElementById('cu-name').value='New User';w.document.getElementById('cu-email').value='new@example.test';await w.submitCreateUser();
 assert.deepEqual(JSON.parse(JSON.stringify(bodies)),[{email:'new@example.test',full_name:'New User'}]);dom.window.close();

 const db=new PGlite();
 try{
  await db.exec(`create role anon;create role authenticated;create schema auth;
   create table public.profiles(id uuid primary key,email text,full_name text,role text,employee_id uuid,account_type text,account_status text);
   create table public.capability_grants(user_id uuid,domain text,capability text);
   create table public.account_migration_review(id int);
   create table public.index_security_migrations(version int primary key);
   create table auth.users(id uuid primary key,email text,raw_user_meta_data jsonb);
   insert into profiles values('00000000-0000-4000-8000-000000000001','owner@test.local','Owner','admin','00000000-0000-4000-8000-000000000002','employee','active');
   insert into capability_grants values('00000000-0000-4000-8000-000000000001','platform','admin');`);
  await db.exec(fs.readFileSync(path.join(root,'update42.sql'),'utf8'));
  await db.exec("create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();");
  await db.exec(`insert into auth.users values('00000000-0000-4000-8000-000000000003','new@test.local','{"full_name":"Manual Name","role":"admin","employee_id":"malicious"}')`);
  const rows=(await db.query('select * from profiles order by id')).rows;
  assert.equal(rows[0].role,'admin');assert.equal(rows[0].employee_id,null);assert.equal(rows[1].full_name,'Manual Name');assert.equal(rows[1].role,'user');assert.equal(rows[1].account_type,'manual');
  assert.equal((await db.query('select * from capability_grants')).rows.length,1);
  assert.equal((await db.query('select * from index_retired_account_links')).rows.length,1);
  await assert.rejects(db.exec("update profiles set employee_id='00000000-0000-4000-8000-000000000002'"));
  await db.exec('set role authenticated');await assert.rejects(db.query('select * from index_retired_account_links'),e=>e.code==='42501');
 }finally{await db.close();}
 console.log('PASS: manual account UI, server authorization, no HR dependency, no role injection, migration preserves grants and retires links');
})().catch(error=>{console.error(error);process.exitCode=1});
