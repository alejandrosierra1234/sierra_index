const fs=require('node:fs'),assert=require('node:assert/strict');
const {transformSync}=require('../../js/collaboration/node_modules/esbuild');
const {PGlite}=require('../../js/collaboration/node_modules/@electric-sql/pglite');
const {JSDOM}=require('../communications/node_modules/jsdom');
const vm=require('node:vm');
const root=__dirname+'/../..',mod={exports:{}};
new Function('module','exports',transformSync(fs.readFileSync(root+'/supabase/functions/_shared/create-manual-account.ts','utf8'),{loader:'ts',format:'cjs'}).code)(mod,mod.exports);
const actor='00000000-0000-4000-8000-000000000001',uid='00000000-0000-4000-8000-000000000002';
(async()=>{
 let allowed=true,confirmed=false,status='active',prepareError=null,deleteError=null,calls=[];
 const client=(_,key)=>key==='service'?{
  from:()=>({select:()=>({eq:()=>({single:async()=>({data:{email:'user@test.local',account_status:status}})})}),update:()=>({eq:async()=>{calls.push('finish');return{}}})}),
  auth:{resetPasswordForEmail:async(email,o)=>{calls.push(['recovery',email,o]);return{}},admin:{
   getUserById:async()=>({data:{user:{id:uid,email:'user@test.local',email_confirmed_at:confirmed?'today':null}}}),
   inviteUserByEmail:async(email,o)=>{calls.push(['invite',email,o]);return{}},
   deleteUser:async(id,soft)=>{calls.push(['delete',id,soft]);return{error:deleteError}}
  }}
 }:{auth:{getUser:async()=>({data:{user:{id:actor}}})},rpc:async(name)=>name==='authorize'?{data:allowed}:(calls.push('prepare'),{error:prepareError})};
 const handler=mod.exports.createManualAccountHandler(client,{SUPABASE_ANON_KEY:'anon',SUPABASE_SERVICE_ROLE_KEY:'service'});
 const send=(action,extra={})=>handler(new Request('https://test.local',{method:'POST',headers:{Authorization:'Bearer test'},body:JSON.stringify({action,user_id:uid,...extra})}));
 allowed=false;assert.equal((await send('resend')).status,403);assert.equal(calls.length,0);allowed=true;
 assert.equal((await send('delete',{user_id:actor})).status,403);
 assert.equal((await send('resend',{email:'attacker@test.local'})).status,200);
 assert.equal(calls[0][1],'user@test.local');assert.match(calls[0][2].redirectTo,/\/auth.html$/);
 confirmed=true;assert.equal((await send('resend')).status,200);assert.equal(calls[1][0],'recovery');
 status='disabled';assert.equal((await send('resend')).status,409);status='active';
 assert.equal((await send('delete',{confirm_email:'wrong@test.local'})).status,400);
 calls=[];prepareError={message:'Protected owner'};assert.equal((await send('delete',{confirm_email:'user@test.local'})).status,409);assert.deepEqual(calls,['prepare']);
 prepareError=null;deleteError={message:'Unavailable'};calls=[];assert.equal((await send('delete',{confirm_email:'user@test.local'})).status,502);assert.deepEqual(calls,['prepare',['delete',uid,true]]);
 deleteError=null;calls=[];assert.equal((await send('delete',{confirm_email:'user@test.local'})).status,200);assert.deepEqual(calls,['prepare',['delete',uid,true],'finish']);
 const source=fs.readFileSync(root+'/index.html','utf8');
 const dom=new JSDOM('<body></body>',{runScripts:'outside-only'}),w=dom.window;
 w.HTMLDialogElement.prototype.showModal=function(){this.open=true};
 w.HTMLDialogElement.prototype.close=function(){this.open=false;this.onclose?.()};
 w.me={id:actor};w.can=()=>true;w.loadGrants=async()=>true;w.siIcon=()=>'';w.esc=s=>s;w.toast=()=>{};w.showUserManagement=async()=>{};
 const sent=[];let resolveSend;
 w.sb={functions:{invoke:async(name,{body})=>{sent.push({name,body});return await new Promise(resolve=>{resolveSend=resolve})}}};
 vm.runInContext(source.slice(source.indexOf('let _teamGrants = null'),source.indexOf('function teamAccessDomainChanged')),dom.getInternalVMContext());
 vm.runInContext(`_teamAccounts=[{id:'${uid}',email:'user@test.local',full_name:'User'}]`,dom.getInternalVMContext());
 await w.openTeamAccountAction(uid,'resend');const first=w.submitTeamAccountAction();await Promise.resolve();await w.submitTeamAccountAction();
 assert.equal(sent.length,1);assert.equal(sent[0].body.action,'resend');resolveSend({data:{ok:true,kind:'invitation'}});await first;
 await w.openTeamAccountAction(uid,'delete');assert.ok(w.document.getElementById('team-confirm-email'));await w.submitTeamAccountAction();assert.equal(sent.length,1);
 w.document.getElementById('team-confirm-email').value='user@test.local';
 w.loadGrants=async()=>{w.me={id:'changed-account'};return true};await w.submitTeamAccountAction();assert.equal(sent.length,1);
 dom.window.close();
 const db=new PGlite();
 try {
  await db.exec(`create role anon;create role authenticated;create schema auth;
   create function auth.uid() returns uuid language sql as $$select '${actor}'::uuid$$;
   create table profiles(id uuid primary key,email text,account_status text);
   create table capability_grants(user_id uuid,domain text,capability text,resource_id uuid,expires_at timestamptz);
   create table communication_documents(owner_id uuid references profiles(id));
   create table index_security_migrations(version int primary key);
   create function authorize(text,text) returns boolean language sql as $$select exists(select 1 from capability_grants where user_id=auth.uid() and capability='admin')$$;
   insert into profiles values('${actor}','admin@test.local','active'),('${uid}','user@test.local','active');
   insert into capability_grants values('${actor}','platform','admin',null,null),('${uid}','communications','write',null,null);`);
  await db.exec(fs.readFileSync(root+'/update44.sql','utf8'));
  const remove=()=>db.query('select prepare_index_account_removal($1,$2)',[uid,'user@test.local']);
  await assert.rejects(db.query('select prepare_index_account_removal($1,$2)',[actor,'admin@test.local']));
  await assert.rejects(db.query('select prepare_index_account_removal($1,$2)',[uid,'wrong@test.local']));
  await db.exec(`insert into communication_documents values('${uid}')`);await assert.rejects(remove());
  assert.equal((await db.query('select account_status from profiles where id=$1',[uid])).rows[0].account_status,'active');
  await db.exec(`delete from communication_documents;insert into capability_grants values('${uid}','platform','admin',null,null)`);await assert.rejects(remove());
  await db.exec(`delete from capability_grants where user_id='${uid}' and domain='platform'`);await remove();
  assert.equal((await db.query('select account_status from profiles where id=$1',[uid])).rows[0].account_status,'disabled');
  assert.equal((await db.query('select * from capability_grants where user_id=$1',[uid])).rows.length,0);
  await db.exec(`update profiles set access_deleted_at=now() where id='${uid}'`);
  await assert.rejects(db.exec(`update profiles set account_status='active' where id='${uid}'`));
  await db.exec('set role anon');await assert.rejects(remove());
 } finally {await db.close()}
 console.log('PASS: account action authorization, authoritative recipient, invitation/recovery, self/admin/owner protection, fail-closed removal and historical retention');
})().catch(e=>{console.error(e);process.exitCode=1});
