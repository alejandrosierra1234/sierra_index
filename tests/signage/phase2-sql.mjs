import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PGlite } from '@electric-sql/pglite'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '../..')
const db = new PGlite()
const ids = {
  admin: '10000000-0000-4000-8000-000000000001',
  editor: '10000000-0000-4000-8000-000000000002',
  publisher: '10000000-0000-4000-8000-000000000003',
  approver: '10000000-0000-4000-8000-000000000004',
  operator: '10000000-0000-4000-8000-000000000005',
  outsider: '10000000-0000-4000-8000-000000000006',
  workspaceA: '20000000-0000-4000-8000-000000000001',
  workspaceB: '20000000-0000-4000-8000-000000000002',
  siteA: '30000000-0000-4000-8000-000000000001',
  siteB: '30000000-0000-4000-8000-000000000002',
  deviceA: '40000000-0000-4000-8000-000000000001',
  deviceB: '40000000-0000-4000-8000-000000000002',
  credentialA: '50000000-0000-4000-8000-000000000001',
  credentialB: '50000000-0000-4000-8000-000000000002',
  contentA: '60000000-0000-4000-8000-000000000001',
  contentB: '60000000-0000-4000-8000-000000000002',
  contentMedia: '60000000-0000-4000-8000-000000000003',
  contentLink: '60000000-0000-4000-8000-000000000004',
  playlistA: '70000000-0000-4000-8000-000000000001',
  scheduleA: '80000000-0000-4000-8000-000000000001',
}
let assertions = 0
const check = (value, message) => { assert.ok(value, message); assertions += 1 }
const eq = (actual, expected, message) => { assert.equal(actual, expected, message); assertions += 1 }
const expectSqlState = async (fn, code, message) => {
  await assert.rejects(fn, error => error?.cause?.code === code || error?.code === code, message)
  assertions += 1
}
const setActor = async (id, role = 'authenticated') => {
  await db.exec('reset role')
  await db.query("select set_config('request.jwt.claim.sub',$1,false),set_config('request.jwt.claim.role',$2,false)",[id,role])
  await db.exec(`set role ${role}`)
}
const asOwner = async () => { await db.exec('reset role') }

await db.exec(await fs.readFile(path.join(here, 'phase2-bootstrap.sql'), 'utf8'))
await db.exec(await fs.readFile(path.join(root, 'update59.sql'), 'utf8'))

await db.query(`insert into public.profiles(id,role,account_status) values
 ($1,'admin','active'),($2,'user','active'),($3,'user','active'),($4,'user','active'),($5,'user','active'),($6,'user','active')`,
 [ids.admin,ids.editor,ids.publisher,ids.approver,ids.operator,ids.outsider])
await db.query(`insert into public.signage_workspaces(id,name,timezone,created_by) values
 ($1,'Workspace sintético A','America/Mexico_City',$3),($2,'Workspace sintético B','America/Bogota',$3)`,
 [ids.workspaceA,ids.workspaceB,ids.admin])
await db.query(`insert into public.signage_sites(id,workspace_id,name,timezone) values
 ($1,$2,'Planta sintética A','America/Mexico_City'),($3,$4,'Planta sintética B','America/Bogota')`,
 [ids.siteA,ids.workspaceA,ids.siteB,ids.workspaceB])
await db.query(`insert into public.signage_devices(id,workspace_id,site_id,name,state) values
 ($1,$2,$3,'Pantalla sintética A','active'),($4,$5,$6,'Pantalla sintética B','active')`,
 [ids.deviceA,ids.workspaceA,ids.siteA,ids.deviceB,ids.workspaceB,ids.siteB])
await db.query(`insert into public.signage_device_credentials(id,device_id,workspace_id,fingerprint) values
 ($1,$2,$3,'synthetic-fingerprint-a-0001'),($4,$5,$6,'synthetic-fingerprint-b-0001')`,
 [ids.credentialA,ids.deviceA,ids.workspaceA,ids.credentialB,ids.deviceB,ids.workspaceB])
await expectSqlState(() => db.query(`insert into public.signage_devices(id,workspace_id,site_id,name,state)
 values('40000000-0000-4000-8000-000000000099',$1,$2,'Cruce sintético','active')`,
 [ids.workspaceA,ids.siteB]),'23503','composite foreign key rejects cross-workspace site')
await db.query(`insert into public.capability_grants(user_id,domain,capability,resource_id,granted_by) values
 ($1,'platform','admin',null,$1),
 ($2,'signage','read',$7,$1),($2,'signage','write',$7,$1),
 ($3,'signage','read',$7,$1),($3,'signage','publish',$7,$1),
 ($4,'signage','read',$7,$1),($4,'signage','approve',$7,$1),
 ($5,'signage','read',$7,$1),($5,'signage','operate',$7,$1),($5,'signage','manage_devices',$7,$1),
 ($6,'signage','read',$8,$1)`,
 [ids.admin,ids.editor,ids.publisher,ids.approver,ids.operator,ids.outsider,ids.workspaceA,ids.workspaceB])

await setActor(ids.editor)
let saved = await db.query(`select public.signage_content_save($1,$2,$3::jsonb,0) result`,[
 ids.workspaceA,ids.contentA,JSON.stringify({title:'Mensaje sintético uno',body:'Contenido controlado.',theme:'blue'})])
eq(saved.rows[0].result.revision,1,'editor creates revision 1')
await expectSqlState(() => db.query(`select public.signage_content_save($1,$2,$3::jsonb,0)`,[
 ids.workspaceA,ids.contentA,JSON.stringify({title:'Mensaje sintético dos',body:'Conflicto.',theme:'blue'})]),'40001','stale content revision denied')
await expectSqlState(() => db.query(`select public.signage_content_save($1,$2,$3::jsonb,0)`,[
 ids.workspaceB,ids.contentB,JSON.stringify({title:'Contenido externo',body:'No autorizado.',theme:'neutral'})]),'42501','workspace isolation on content')
await expectSqlState(() => db.query(`select public.signage_publish($1,$2,$3,0)`,[ids.workspaceA,ids.deviceA,ids.contentA]),'42501','editor cannot publish')

await setActor(ids.publisher)
await expectSqlState(() => db.query(`select public.signage_content_approve($1,$2,1)`,[ids.workspaceA,ids.contentA]),'42501','publisher cannot approve')
await expectSqlState(() => db.query(`select public.signage_publish($1,$2,$3,0)`,[ids.workspaceA,ids.deviceA,ids.contentA]),'55000','draft content cannot be published')
await setActor(ids.approver)
let approval = await db.query(`select public.signage_content_approve($1,$2,1) result`,[ids.workspaceA,ids.contentA])
eq(approval.rows[0].result.status,'approved','approver can approve exact revision')
await setActor(ids.publisher)
let published1 = await db.query(`select public.signage_publish($1,$2,$3,0) result`,[ids.workspaceA,ids.deviceA,ids.contentA])
eq(published1.rows[0].result.version,1,'first publication is version 1')
await expectSqlState(() => db.query(`select public.signage_publish($1,$2,$3,0)`,[ids.workspaceA,ids.deviceA,ids.contentA]),'40001','stale device revision denied')
await expectSqlState(() => db.query(`select public.signage_publish($1,$2,$3,0)`,[ids.workspaceA,ids.deviceB,ids.contentA]),'42501','cross-workspace device denied')

await setActor(ids.editor)
saved = await db.query(`select public.signage_content_save($1,$2,$3::jsonb,1) result`,[
 ids.workspaceA,ids.contentA,JSON.stringify({title:'Mensaje sintético actualizado',body:'Versión dos.',theme:'teal'})])
eq(saved.rows[0].result.revision,2,'content revision increments')

await setActor(ids.publisher)
await expectSqlState(() => db.query(`select public.signage_publish($1,$2,$3,1)`,[ids.workspaceA,ids.deviceA,ids.contentA]),'55000','editing resets approval')
await setActor(ids.approver)
await db.query(`select public.signage_content_approve($1,$2,2)`,[ids.workspaceA,ids.contentA])
await setActor(ids.publisher)
let published2 = await db.query(`select public.signage_publish($1,$2,$3,1) result`,[ids.workspaceA,ids.deviceA,ids.contentA])
eq(published2.rows[0].result.version,2,'second publication is version 2')
let rollback = await db.query(`select public.signage_rollback($1,$2,$3,2) result`,[
 ids.workspaceA,ids.deviceA,published1.rows[0].result.publication_id])
eq(rollback.rows[0].result.version,3,'rollback creates version 3')
eq(rollback.rows[0].result.rollback_of,published1.rows[0].result.publication_id,'rollback references immutable target')

await asOwner()
let immutable = await db.query(`select version,content_revision,kind from public.signage_publications where device_id=$1 order by version`,[ids.deviceA])
eq(immutable.rows.length,3,'publication history remains immutable')
eq(immutable.rows[0].content_revision,1,'first publication keeps content revision 1')
eq(immutable.rows[1].content_revision,2,'second publication keeps content revision 2')
eq(immutable.rows[2].kind,'rollback','rollback is explicit history')

await setActor(ids.editor)
await expectSqlState(() => db.query(`select public.signage_content_save($1,$2,$3::jsonb,0)`,[
 ids.workspaceA,ids.contentMedia,JSON.stringify({type:'image',title:'Imagen insegura',body:'',theme:'blue',mediaUrl:'http://example.invalid/test.png',alt:'Prueba'})]),'22023','server rejects insecure media URL')
let media = await db.query(`select public.signage_content_save($1,$2,$3::jsonb,0) result`,[
 ids.workspaceA,ids.contentMedia,JSON.stringify({type:'image',title:'Imagen sintética',body:'Texto de apoyo.',theme:'blue',mediaUrl:'https://example.invalid/test.webp',alt:'Patrón sintético'})])
eq(media.rows[0].result.revision,1,'server accepts aligned image snapshot')
await expectSqlState(() => db.query(`select public.signage_content_save($1,$2,$3::jsonb,0)`,[
 ids.workspaceA,ids.contentLink,JSON.stringify({type:'link',title:'Enlace inseguro',body:'',theme:'neutral',url:'http://example.invalid'})]),'22023','server rejects non-HTTPS link')
let link = await db.query(`select public.signage_content_save($1,$2,$3::jsonb,0) result`,[
 ids.workspaceA,ids.contentLink,JSON.stringify({type:'link',title:'Enlace seguro',body:'Tarjeta segura.',theme:'neutral',url:'https://example.invalid/pantallas'})])
eq(link.rows[0].result.revision,1,'server accepts safe link card snapshot')
let playlistResult = await db.query(`select public.signage_playlist_save($1,$2,'Lista SQL sintética',$3::jsonb,0) result`,[
 ids.workspaceA,ids.playlistA,JSON.stringify([{contentId:ids.contentA,durationSeconds:15},{contentId:ids.contentMedia,durationSeconds:20}])])
eq(playlistResult.rows[0].result.revision,1,'playlist version 1 saved')
await expectSqlState(() => db.query(`select public.signage_playlist_save($1,null,'Lista inválida',$2::jsonb,0)`,[
 ids.workspaceA,JSON.stringify({not:'an array'})]),'22023','server rejects non-array playlist cleanly')
await expectSqlState(() => db.query(`select public.signage_playlist_save($1,$2,'Lista inválida',$3::jsonb,1)`,[
 ids.workspaceA,ids.playlistA,JSON.stringify([{contentId:ids.contentA,durationSeconds:2}])]),'22023','server rejects invalid playlist duration')

await setActor(ids.operator)
let scheduled = await db.query(`select public.signage_schedule_save($1,$2,$3,$4,$5,$6,8,0) result`,[
 ids.workspaceA,ids.scheduleA,ids.deviceA,ids.playlistA,'2030-04-05T10:00:00Z','2030-04-05T11:00:00Z'])
eq(scheduled.rows[0].result.playlist_revision,1,'schedule pins playlist revision')
await expectSqlState(() => db.query(`select public.signage_schedule_save($1,null,$2,$3,$4,$5,1,0)`,[
 ids.workspaceB,ids.deviceA,ids.playlistA,'2030-04-05T10:00:00Z','2030-04-05T11:00:00Z']), '42501','schedule cannot cross workspace')
await setActor(ids.admin,'service_role')
let scheduledManifest = await db.query(`select public.signage_device_manifest_service($1,$2) result`,[ids.deviceA,ids.credentialA])
eq(scheduledManifest.rows[0].result.schedules.length,1,'manifest carries pinned schedule contract')

await setActor(ids.outsider)
await expectSqlState(() => db.query(`select public.signage_workspace_snapshot($1)`,[ids.workspaceA]),'42501','reader in workspace B cannot read A')
await expectSqlState(() => db.query(`select public.set_signage_access($1,$2,array['read'])`,[ids.editor,ids.workspaceB]),'42501','non-admin cannot assign workspace grants')
await setActor(ids.admin)
await db.query(`select public.set_signage_access($1,$2,array['read'])`,[ids.outsider,ids.workspaceA])
await setActor(ids.outsider)
let temporaryGrant = await db.query(`select public.signage_workspace_snapshot($1) result`,[ids.workspaceA])
eq(temporaryGrant.rows[0].result.workspace.id,ids.workspaceA,'platform admin can assign scoped signage access')
await setActor(ids.admin)
await db.query(`select public.set_signage_access($1,$2,array[]::text[])`,[ids.outsider,ids.workspaceA])
await setActor(ids.outsider)
await expectSqlState(() => db.query(`select public.signage_workspace_snapshot($1)`,[ids.workspaceA]),'42501','empty assignment revokes scoped access')
await asOwner()
await db.exec('grant select on public.signage_workspaces to authenticated')
await setActor(ids.outsider)
let rls = await db.query('select id from public.signage_workspaces order by id')
eq(rls.rows.length,1,'RLS exposes one authorized workspace in local validation')
eq(rls.rows[0].id,ids.workspaceB,'RLS isolates workspace rows')
await asOwner()
await db.exec('revoke select on public.signage_workspaces from authenticated')

await setActor(ids.operator)
await expectSqlState(() => db.query(`select public.signage_publish($1,$2,$3,3)`,[ids.workspaceA,ids.deviceA,ids.contentA]),'42501','operator cannot publish')

await setActor(ids.publisher)
await expectSqlState(() => db.query(`select public.signage_device_revoke($1,$2,'Revocación sintética')`,[ids.workspaceA,ids.deviceA]),'42501','publisher cannot revoke device')

await setActor(ids.operator)
await db.query(`select public.signage_device_revoke($1,$2,'Revocación sintética controlada')`,[ids.workspaceA,ids.deviceA])
await asOwner()
let revoked = await db.query(`select state,(select revoked_at is not null from public.signage_device_credentials where id=$2) credential_revoked from public.signage_devices where id=$1`,[ids.deviceA,ids.credentialA])
eq(revoked.rows[0].state,'revoked','device is revoked')
check(revoked.rows[0].credential_revoked,'credential is revoked atomically')

await setActor(ids.publisher)
await expectSqlState(() => db.query(`select public.signage_publish($1,$2,$3,4)`,[ids.workspaceA,ids.deviceA,ids.contentA]),'55000','revoked device cannot receive publication')
await setActor(ids.outsider)
await expectSqlState(() => db.query(`select public.signage_device_manifest_service($1,$2)`,[ids.deviceB,ids.credentialB]),'42501','authenticated caller cannot invoke service manifest')
await setActor(ids.admin,'service_role')
await expectSqlState(() => db.query(`select public.signage_device_manifest_service($1,$2)`,[ids.deviceA,ids.credentialA]),'42501','revoked credential cannot synchronize')
let manifest = await db.query(`select public.signage_device_manifest_service($1,$2) result`,[ids.deviceB,ids.credentialB])
eq(manifest.rows[0].result.state,'no-content','active unassigned device gets no-content manifest')

await asOwner()
let migration = await db.query('select version from public.index_security_migrations where version=59')
eq(migration.rows.length,1,'migration 59 recorded')
let audit = await db.query(`select event_type from public.signage_audit where workspace_id=$1 order by id`,[ids.workspaceA])
check(audit.rows.some(row => row.event_type==='device.rolled_back'),'rollback is audited')
check(audit.rows.some(row => row.event_type==='device.revoked'),'revocation is audited')

console.log(`signage phase2 SQL: ${assertions} assertions passed`)
await db.close()
