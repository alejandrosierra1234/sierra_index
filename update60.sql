-- SIERRA Pantallas: medios privados, vinculación, heartbeat y señalización WebRTC.
-- Aplicar después de update59.sql únicamente en el proyecto y ventana aprobados.
-- No genera secretos: las Edge Functions deben generar tokens, guardar solo digest SHA-256
-- y entregar el valor original una sola vez al reproductor reclamante.
begin;

create table public.signage_media_assets(
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.signage_workspaces(id) on delete cascade,
  storage_path text not null check(storage_path ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}/[^/]+$'),
  original_name text not null check(length(original_name) between 1 and 180),
  content_type text not null check(content_type in ('image/png','image/jpeg','image/webp','image/gif','video/mp4','video/webm')),
  byte_size bigint not null check(byte_size between 1 and 52428800),
  sha256 text not null check(sha256 ~ '^[0-9a-f]{64}$'),
  state text not null default 'pending' check(state in ('pending','ready','quarantined','deleted')),
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  expires_at timestamptz,
  unique(workspace_id,storage_path),
  unique(id,workspace_id)
);

create table public.signage_pairing_sessions(
  id uuid primary key default gen_random_uuid(),
  code_digest text not null unique check(code_digest ~ '^[0-9a-f]{64}$'),
  claim_digest text not null unique check(claim_digest ~ '^[0-9a-f]{64}$'),
  expires_at timestamptz not null check(expires_at>created_at),
  attempt_count smallint not null default 0 check(attempt_count between 0 and 10),
  device_id uuid references public.signage_devices(id) on delete set null,
  claimed_by uuid references public.profiles(id),
  claimed_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  check((claimed_at is null and device_id is null and claimed_by is null) or
        (claimed_at is not null and device_id is not null and claimed_by is not null)),
  check(delivered_at is null or claimed_at is not null)
);

alter table public.signage_device_credentials
  add column token_digest text,
  add column expires_at timestamptz,
  add column last_seen_at timestamptz,
  add column last_ip inet,
  add constraint signage_device_credentials_token_digest_check
    check(token_digest is null or token_digest ~ '^[0-9a-f]{64}$');
create unique index signage_device_credentials_token_digest_idx
  on public.signage_device_credentials(token_digest) where token_digest is not null and revoked_at is null;

create table public.signage_live_sessions(
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.signage_workspaces(id) on delete cascade,
  device_id uuid not null,
  state text not null default 'active' check(state in ('active','stopped','expired','failed')),
  started_by uuid not null references public.profiles(id),
  started_at timestamptz not null default now(),
  expires_at timestamptz not null check(expires_at>started_at and expires_at<=started_at+interval '8 hours'),
  stopped_at timestamptz,
  foreign key(device_id,workspace_id) references public.signage_devices(id,workspace_id) on delete cascade
);
create unique index signage_one_live_session_per_device on public.signage_live_sessions(device_id) where state='active';

create table public.signage_live_signals(
  id bigint generated always as identity primary key,
  session_id uuid not null references public.signage_live_sessions(id) on delete cascade,
  sender text not null check(sender in ('admin','device')),
  kind text not null check(kind in ('offer','answer','candidate')),
  payload jsonb not null check(jsonb_typeof(payload)='object' and pg_column_size(payload)<=65536),
  created_at timestamptz not null default now()
);
create index signage_live_signals_poll_idx on public.signage_live_signals(session_id,id);

alter table public.signage_media_assets enable row level security;
alter table public.signage_pairing_sessions enable row level security;
alter table public.signage_live_sessions enable row level security;
alter table public.signage_live_signals enable row level security;
create policy signage_media_read on public.signage_media_assets for select to authenticated
  using(public.signage_can(workspace_id,'read'));
create policy signage_live_session_read on public.signage_live_sessions for select to authenticated
  using(public.signage_can(workspace_id,'read'));

revoke all on public.signage_media_assets,public.signage_pairing_sessions,
 public.signage_live_sessions,public.signage_live_signals from public,anon,authenticated;
grant select on public.signage_media_assets,public.signage_live_sessions to authenticated;
grant all on public.signage_media_assets,public.signage_pairing_sessions,
 public.signage_live_sessions,public.signage_live_signals to service_role;
grant usage,select on sequence public.signage_live_signals_id_seq to service_role;

-- Bucket privado. Las cargas y descargas se entregan mediante URLs firmadas de corta vida;
-- no se concede acceso directo a anon ni se reutiliza product-images.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('signage-media','signage-media',false,52428800,
 array['image/png','image/jpeg','image/webp','image/gif','video/mp4','video/webm'])
on conflict(id) do update set public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;

insert into public.index_security_migrations(version) values(60) on conflict do nothing;
notify pgrst,'reload schema';
commit;
