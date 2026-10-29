import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PGlite } from '@electric-sql/pglite'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '../..')
const db = new PGlite()
let assertions = 0
const ok = (value, message) => { assert.ok(value, message); assertions += 1 }
const expectSqlState = async (fn, code, message) => { await assert.rejects(fn, error => error?.cause?.code === code || error?.code === code, message); assertions += 1 }

await db.exec(await fs.readFile(path.join(here, 'phase2-bootstrap.sql'), 'utf8'))
await db.exec(await fs.readFile(path.join(root, 'update59.sql'), 'utf8'))
await db.exec(`create schema storage;
 create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
 grant usage on schema storage to anon,authenticated,service_role;
 grant select,insert,update on storage.buckets to service_role;`)
await db.exec(await fs.readFile(path.join(root, 'update60.sql'), 'utf8'))
await db.exec(await fs.readFile(path.join(root, 'update62.sql'), 'utf8'))
await db.exec(await fs.readFile(path.join(root, 'update63.sql'), 'utf8'))

const admin='10000000-0000-4000-8000-000000000001', workspace='20000000-0000-4000-8000-000000000001', site='30000000-0000-4000-8000-000000000001', device='40000000-0000-4000-8000-000000000001', asset='50000000-0000-4000-8000-000000000001'
await db.query(`insert into public.profiles(id,role) values($1,'admin')`,[admin])
await db.query(`insert into public.capability_grants(user_id,domain,capability,resource_id,granted_by) values($1,'platform','admin',null,$1)`,[admin])
await db.query(`insert into public.signage_workspaces(id,name,timezone,created_by) values($1,'Prueba','UTC',$2)`,[workspace,admin])
await db.query(`insert into public.signage_access_grants(user_id,workspace_id,capability,granted_by) select $1,$2,cap,$1 from unnest(array['read','write','approve','publish','operate','manage_devices']) cap`,[admin,workspace])
await db.query(`insert into public.signage_sites(id,workspace_id,name,timezone) values($1,$2,'Planta','UTC')`,[site,workspace])
await db.query(`insert into public.signage_devices(id,workspace_id,site_id,name,state,revision,output_paused) values($1,$2,$3,'Pantalla','active',8,true)`,[device,workspace,site])
await db.exec(await fs.readFile(path.join(root, 'update64.sql'), 'utf8'))
await db.exec(await fs.readFile(path.join(root, 'update65.sql'), 'utf8'))
const preservedInstallState=await db.query(`select revision,output_paused,space_id from public.signage_devices where id=$1`,[device])
assert.equal(Number(preservedInstallState.rows[0].revision),8,'migration 64 preserves the existing device revision'); assertions += 1
assert.equal(preservedInstallState.rows[0].output_paused,true,'migration 64 preserves an existing paused output'); assertions += 1
assert.equal(preservedInstallState.rows[0].space_id,null,'migration 64 does not assign an existing device silently'); assertions += 1
await db.query(`update public.signage_devices set revision=0,output_paused=false where id=$1`,[device])

const bucket = await db.query(`select public,file_size_limit from storage.buckets where id='signage-media'`)
assert.equal(bucket.rows[0].public,false); assertions += 1
assert.equal(Number(bucket.rows[0].file_size_limit),52428800); assertions += 1
await expectSqlState(() => db.query(`insert into public.signage_media_assets(workspace_id,storage_path,original_name,content_type,byte_size,sha256,created_by) values($1,'bad/path.png','x.png','image/png',10,repeat('a',64),$2)`,[workspace,admin]),'23514','asset path must be workspace scoped')
await db.query(`insert into public.signage_media_assets(id,workspace_id,storage_path,original_name,content_type,byte_size,sha256,state,created_by) values($3,$1::uuid,$1::text||'/50000000-0000-4000-8000-000000000001/test.png','test.png','image/png',10,repeat('a',64),'ready',$2)`,[workspace,admin,asset]); assertions += 1
await expectSqlState(() => db.query(`insert into public.signage_pairing_sessions(code_digest,claim_digest,expires_at) values('short','short',now()+interval '5 minutes')`),'23514','pairing digests must be SHA-256')
await db.query(`insert into public.signage_pairing_sessions(code_digest,claim_digest,expires_at) values(repeat('a',64),repeat('b',64),now()+interval '5 minutes')`); assertions += 1
await db.query(`insert into public.signage_live_sessions(id,workspace_id,device_id,started_by,expires_at) values('60000000-0000-4000-8000-000000000001',$1,$2,$3,now()+interval '1 hour')`,[workspace,device,admin]); assertions += 1
await expectSqlState(() => db.query(`insert into public.signage_live_sessions(id,workspace_id,device_id,started_by,expires_at) values('60000000-0000-4000-8000-000000000002',$1,$2,$3,now()+interval '1 hour')`,[workspace,device,admin]),'23505','only one active live session is allowed per device')
await expectSqlState(() => db.query(`insert into public.signage_live_signals(session_id,sender,kind,payload) values('60000000-0000-4000-8000-000000000001','admin','script','{}')`),'23514','signal kinds are constrained')
ok((await db.query(`select exists(select 1 from public.index_security_migrations where version=60) applied`)).rows[0].applied,'migration 60 is recorded')
ok((await db.query(`select exists(select 1 from public.index_security_migrations where version=62) applied`)).rows[0].applied,'migration 62 is recorded')
ok((await db.query(`select exists(select 1 from public.index_security_migrations where version=63) applied`)).rows[0].applied,'migration 63 is recorded')
ok((await db.query(`select exists(select 1 from public.index_security_migrations where version=64) applied`)).rows[0].applied,'migration 64 is recorded')
ok((await db.query(`select exists(select 1 from public.index_security_migrations where version=65) applied`)).rows[0].applied,'migration 65 is recorded')
assert.equal((await db.query(`select has_function_privilege('anon','public.signage_space_save(uuid,uuid,uuid,text,timestamptz)','execute') allowed`)).rows[0].allowed,false); assertions += 1
assert.equal((await db.query(`select has_function_privilege('authenticated','public.signage_space_save(uuid,uuid,uuid,text,timestamptz)','execute') allowed`)).rows[0].allowed,true); assertions += 1
assert.equal((await db.query(`select relrowsecurity from pg_class where oid='public.signage_spaces'::regclass`)).rows[0].relrowsecurity,true); assertions += 1
assert.equal((await db.query(`select relrowsecurity from pg_class where oid='public.signage_experience_sessions'::regclass`)).rows[0].relrowsecurity,true); assertions += 1
assert.equal((await db.query(`select has_function_privilege('anon','public.signage_experience_start(uuid,uuid,uuid[],integer)','execute') allowed`)).rows[0].allowed,false); assertions += 1
assert.equal((await db.query(`select has_function_privilege('authenticated','public.signage_experience_start(uuid,uuid,uuid[],integer)','execute') allowed`)).rows[0].allowed,true); assertions += 1
assert.equal((await db.query(`select has_table_privilege('authenticated','public.signage_experience_sessions','insert') allowed`)).rows[0].allowed,false); assertions += 1
assert.match((await db.query(`select pg_get_functiondef('public.signage_experience_start(uuid,uuid,uuid[],integer)'::regprocedure) definition`)).rows[0].definition,/FOR UPDATE/i); assertions += 1
assert.equal((await db.query(`select public.signage_rate_limit_service(repeat('c',64),2,60) allowed`)).rows[0].allowed,true); assertions += 1
assert.equal((await db.query(`select public.signage_rate_limit_service(repeat('c',64),2,60) allowed`)).rows[0].allowed,true); assertions += 1
assert.equal((await db.query(`select public.signage_rate_limit_service(repeat('c',64),2,60) allowed`)).rows[0].allowed,false); assertions += 1
await db.query(`insert into public.signage_pairing_sessions(code_digest,claim_digest,expires_at) values(repeat('c',64),repeat('d',64),now()+interval '5 minutes')`)
const paired = await db.query(`select public.signage_pairing_claim_service(repeat('c',64),$1,$2,'Pantalla vinculada',$3) result`,[workspace,site,admin])
assert.equal(paired.rows[0].result.state,'claimed'); assertions += 1
await expectSqlState(() => db.query(`select public.signage_pairing_claim_service(repeat('c',64),$1,$2,'Pantalla repetida',$3)`,[workspace,site,admin]),'42501','a pairing code is claimed only once')
const delivered = await db.query(`select public.signage_pairing_deliver_service(repeat('d',64),repeat('e',64),'fingerprint-synthetic-0001',now()+interval '1 year') result`)
assert.equal(delivered.rows[0].result.state,'paired'); assertions += 1
await expectSqlState(() => db.query(`select public.signage_pairing_deliver_service(repeat('d',64),repeat('f',64),'fingerprint-synthetic-0002',now()+interval '1 year')`),'42501','pairing credentials are delivered only once')
await db.query(`insert into public.signage_device_credentials(id,device_id,workspace_id,fingerprint) values('70000000-0000-4000-8000-000000000001',$1,$2,'pending-test-credential')`,[device,workspace])
await db.query(`insert into public.signage_device_heartbeats(device_id,workspace_id,credential_id,status,errors) values($1,$2,'70000000-0000-4000-8000-000000000001','playing','[]')`,[device,workspace]); assertions += 1
await expectSqlState(() => db.query(`insert into public.signage_device_heartbeats(device_id,workspace_id,credential_id,status,errors) values('40000000-0000-4000-8000-000000000099',$1,'70000000-0000-4000-8000-000000000001','playing','[]')`,[workspace]),'23503','heartbeat device must belong to workspace')
await db.query("select set_config('request.jwt.claim.sub',$1,false),set_config('request.jwt.claim.role','authenticated',false)",[admin])
await db.exec('set role authenticated')
const spaceSaved=await db.query(`select public.signage_space_save($1,null,$2,'Sala sintética',null) result`,[workspace,site])
const spaceId=spaceSaved.rows[0].result.id;assert.equal(spaceSaved.rows[0].result.name,'Sala sintética');assertions += 1
const deviceUpdated=await db.query(`select public.signage_device_update($1,$2,'Pantalla norte',$3,0) result`,[workspace,device,spaceId])
assert.equal(deviceUpdated.rows[0].result.space_id,spaceId);assertions += 1
await expectSqlState(()=>db.query(`select public.signage_device_update($1,$2,'Pantalla repetida',$3,0)`,[workspace,device,spaceId]),'40001','device updates require the current revision')
const welcome=await db.query(`select public.signage_experience_save($1,null,'Bienvenida sintética',$2::jsonb,null) result`,[workspace,JSON.stringify({template:'essential',displayName:'Invitado de muestra',subtitle:'Visita de prueba'})])
assert.equal(welcome.rows[0].result.snapshot.displayName,'Invitado de muestra');assertions += 1
await db.exec('reset role');await db.query(`insert into public.profiles(id,role) values('10000000-0000-4000-8000-000000000099','operator')`)
await db.query("select set_config('request.jwt.claim.sub','10000000-0000-4000-8000-000000000099',false),set_config('request.jwt.claim.role','authenticated',false)");await db.exec('set role authenticated')
await expectSqlState(()=>db.query(`select public.signage_experience_save($1,null,'Fuera de alcance',$2::jsonb,null)`,[workspace,JSON.stringify({template:'essential',displayName:'Otro espacio',subtitle:''})]),'42501','experience writes cannot cross workspace scope')
await db.exec('reset role');await db.query("select set_config('request.jwt.claim.sub',$1,false),set_config('request.jwt.claim.role','authenticated',false)",[admin]);await db.exec('set role authenticated')
const startedWelcome=await db.query(`select public.signage_experience_start($1,$2,array[$3::uuid],30) result`,[workspace,welcome.rows[0].result.id,device])
assert.equal(startedWelcome.rows[0].result.destinations[0],device);assertions += 1
await db.exec('reset role');await db.exec('set role service_role')
let welcomeManifest=await db.query(`select public.signage_device_manifest_service($1,'70000000-0000-4000-8000-000000000001') result`,[device])
assert.equal(welcomeManifest.rows[0].result.state,'experience');assertions += 1
assert.equal(welcomeManifest.rows[0].result.experience_snapshot.displayName,'Invitado de muestra');assertions += 1
await db.exec('reset role');await db.query("select set_config('request.jwt.claim.sub',$1,false),set_config('request.jwt.claim.role','authenticated',false)",[admin]);await db.exec('set role authenticated')
await db.query(`select public.signage_experience_finish($1,$2)`,[workspace,startedWelcome.rows[0].result.session.id])
await db.exec('reset role');await db.exec('set role service_role')
welcomeManifest=await db.query(`select public.signage_device_manifest_service($1,'70000000-0000-4000-8000-000000000001') result`,[device])
assert.notEqual(welcomeManifest.rows[0].result.state,'experience');assertions += 1
await db.exec('reset role');await db.query("select set_config('request.jwt.claim.sub',$1,false),set_config('request.jwt.claim.role','authenticated',false)",[admin]);await db.exec('set role authenticated')
const expiringWelcome=await db.query(`select public.signage_experience_start($1,$2,array[$3::uuid],1) result`,[workspace,welcome.rows[0].result.id,device])
await db.exec('reset role')
await db.query(`update public.signage_experience_sessions set expires_at=now()-interval '1 second' where id=$1`,[expiringWelcome.rows[0].result.session.id])
await db.exec('set role service_role')
welcomeManifest=await db.query(`select public.signage_device_manifest_service($1,'70000000-0000-4000-8000-000000000001') result`,[device])
assert.notEqual(welcomeManifest.rows[0].result.state,'experience','server expiry restores the prior output without a controller');assertions += 1
await db.exec('reset role');await db.query("select set_config('request.jwt.claim.sub',$1,false),set_config('request.jwt.claim.role','authenticated',false)",[admin]);await db.exec('set role authenticated')
const savedPrivateMedia = await db.query(`select public.signage_content_save($1,null,$2::jsonb,0) result`,[workspace,JSON.stringify({type:'image',title:'Imagen privada',body:'',theme:'neutral',alt:'Imagen sintética',mediaAssetId:asset})])
assert.equal(savedPrivateMedia.rows[0].result.snapshot.mediaAssetId,asset); assertions += 1
const curatedMediaUrl='https://cdn.prod.website-files.com/673e5aab9ab2686aa6660ed3%2F67448935dfb12aa5cb9c86e9_video-cortado-transcode.mp4'
const savedCuratedMedia=await db.query(`select public.signage_content_save($1,null,$2::jsonb,0) result`,[workspace,JSON.stringify({type:'video',title:'Proceso SIERRA',body:'',theme:'neutral',alt:'Proceso industrial SIERRA',mediaUrl:curatedMediaUrl})])
assert.equal(savedCuratedMedia.rows[0].result.snapshot.mediaUrl,curatedMediaUrl); assertions += 1
await expectSqlState(()=>db.query(`select public.signage_content_save($1,null,$2::jsonb,0)`,[workspace,JSON.stringify({type:'video',title:'Video externo',body:'',theme:'neutral',alt:'Fuente externa sintética',mediaUrl:'https://example.invalid/arbitrary.mp4'})]),'42501','direct RPC rejects arbitrary remote media outside the curated allowlist')
await expectSqlState(()=>db.query(`select public.signage_content_save($1,null,$2::jsonb,0)`,[workspace,JSON.stringify({type:'image',title:'Video mal declarado',body:'',theme:'neutral',alt:'Tipo sintético incorrecto',mediaUrl:curatedMediaUrl})]),'42501','direct RPC rejects a curated video URL declared as an image')
const curatedImageUrl='https://cdn.prod.website-files.com/673e5aab9ab2686aa6660ed3/673f7b62650c2610524db19f_DSC09322-Enhanced-NR%20(1).jpg'
await expectSqlState(()=>db.query(`select public.signage_content_save($1,null,$2::jsonb,0)`,[workspace,JSON.stringify({type:'video',title:'Imagen mal declarada',body:'',theme:'neutral',alt:'Tipo sintético incorrecto',mediaUrl:curatedImageUrl})]),'42501','direct RPC rejects a curated image URL declared as a video')
await expectSqlState(()=>db.query(`select public.signage_content_save($1,null,$2::jsonb,0)`,[workspace,JSON.stringify({type:'image',title:'Referencia ambigua',body:'',theme:'neutral',alt:'Referencia sintética',mediaAssetId:asset,mediaUrl:'https://example.invalid/arbitrary.png'})]),'22023','direct RPC rejects snapshots that combine a private asset with a remote URL')
const message = await db.query(`select public.signage_content_save($1,null,$2::jsonb,0) result`,[workspace,JSON.stringify({type:'message',title:'Mensaje de parada',body:'Contenido sintético',theme:'neutral'})])
const contentId=message.rows[0].result.id
await db.query(`select public.signage_content_approve($1,$2,1)`,[workspace,contentId])
await db.exec('reset role')
let deviceRevision=Number((await db.query(`select revision from public.signage_devices where id=$1`,[device])).rows[0].revision)
await db.exec('set role authenticated')
const published=await db.query(`select public.signage_publish($1,$2,$3,$4) result`,[workspace,device,contentId,deviceRevision])
assert.equal(published.rows[0].result.output_paused,false); assertions += 1
deviceRevision=Number(published.rows[0].result.device_revision)
const stopped=await db.query(`select public.signage_stop_output($1,$2,$3) result`,[workspace,device,deviceRevision])
assert.equal(stopped.rows[0].result.output_paused,true); assertions += 1
assert.equal(stopped.rows[0].result.live_sessions_stopped,1); assertions += 1
await expectSqlState(()=>db.query(`select public.signage_stop_output($1,$2,1)`,[workspace,'40000000-0000-4000-8000-000000000099']),'42501','stop cannot cross device scope')
await db.exec('reset role')
await db.exec('set role service_role')
const stoppedManifest=await db.query(`select public.signage_device_manifest_service($1,'70000000-0000-4000-8000-000000000001') result`,[device])
assert.equal(stoppedManifest.rows[0].result.state,'stopped'); assertions += 1
assert.deepEqual(stoppedManifest.rows[0].result.schedules,[]); assertions += 1
await db.exec('reset role')
await db.exec('set role authenticated')
deviceRevision=Number(stopped.rows[0].result.revision)
const resumed=await db.query(`select public.signage_publish($1,$2,$3,$4) result`,[workspace,device,contentId,deviceRevision])
assert.equal(resumed.rows[0].result.output_paused,false); assertions += 1
await db.exec('reset role')
const preserved=await db.query(`select d.state,d.output_paused,count(c.id) credentials,count(p.id) publications from public.signage_devices d left join public.signage_device_credentials c on c.device_id=d.id left join public.signage_publications p on p.device_id=d.id where d.id=$1 group by d.state,d.output_paused`,[device])
assert.equal(preserved.rows[0].state,'active'); assertions += 1
assert.equal(Number(preserved.rows[0].credentials)>0,true); assertions += 1
assert.equal(Number(preserved.rows[0].publications)>=2,true); assertions += 1
console.log(`Pantallas phase5 SQL: ${assertions} assertions passed`)
