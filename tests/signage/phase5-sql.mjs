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

const admin='10000000-0000-4000-8000-000000000001', workspace='20000000-0000-4000-8000-000000000001', site='30000000-0000-4000-8000-000000000001', device='40000000-0000-4000-8000-000000000001'
await db.query(`insert into public.profiles(id,role) values($1,'admin')`,[admin])
await db.query(`insert into public.signage_workspaces(id,name,timezone,created_by) values($1,'Prueba','UTC',$2)`,[workspace,admin])
await db.query(`insert into public.signage_sites(id,workspace_id,name,timezone) values($1,$2,'Planta','UTC')`,[site,workspace])
await db.query(`insert into public.signage_devices(id,workspace_id,site_id,name,state) values($1,$2,$3,'Pantalla','active')`,[device,workspace,site])

const bucket = await db.query(`select public,file_size_limit from storage.buckets where id='signage-media'`)
assert.equal(bucket.rows[0].public,false); assertions += 1
assert.equal(Number(bucket.rows[0].file_size_limit),52428800); assertions += 1
await expectSqlState(() => db.query(`insert into public.signage_media_assets(workspace_id,storage_path,original_name,content_type,byte_size,sha256,created_by) values($1,'bad/path.png','x.png','image/png',10,repeat('a',64),$2)`,[workspace,admin]),'23514','asset path must be workspace scoped')
await db.query(`insert into public.signage_media_assets(workspace_id,storage_path,original_name,content_type,byte_size,sha256,created_by) values($1::uuid,$1::text||'/50000000-0000-4000-8000-000000000001/test.png','test.png','image/png',10,repeat('a',64),$2)`,[workspace,admin]); assertions += 1
await expectSqlState(() => db.query(`insert into public.signage_pairing_sessions(code_digest,claim_digest,expires_at) values('short','short',now()+interval '5 minutes')`),'23514','pairing digests must be SHA-256')
await db.query(`insert into public.signage_pairing_sessions(code_digest,claim_digest,expires_at) values(repeat('a',64),repeat('b',64),now()+interval '5 minutes')`); assertions += 1
await db.query(`insert into public.signage_live_sessions(id,workspace_id,device_id,started_by,expires_at) values('60000000-0000-4000-8000-000000000001',$1,$2,$3,now()+interval '1 hour')`,[workspace,device,admin]); assertions += 1
await expectSqlState(() => db.query(`insert into public.signage_live_sessions(id,workspace_id,device_id,started_by,expires_at) values('60000000-0000-4000-8000-000000000002',$1,$2,$3,now()+interval '1 hour')`,[workspace,device,admin]),'23505','only one active live session is allowed per device')
await expectSqlState(() => db.query(`insert into public.signage_live_signals(session_id,sender,kind,payload) values('60000000-0000-4000-8000-000000000001','admin','script','{}')`),'23514','signal kinds are constrained')
ok((await db.query(`select exists(select 1 from public.index_security_migrations where version=60) applied`)).rows[0].applied,'migration 60 is recorded')
console.log(`Pantallas phase5 SQL: ${assertions} assertions passed`)
