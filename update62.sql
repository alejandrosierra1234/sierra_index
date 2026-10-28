-- SIERRA Pantallas: operaciones atómicas para la API Edge.
-- Preparada para revisión; NO aplicar sin autorizar un proyecto no productivo.
begin;

create table public.signage_device_heartbeats(
  device_id uuid primary key,
  workspace_id uuid not null references public.signage_workspaces(id) on delete cascade,
  credential_id uuid not null references public.signage_device_credentials(id) on delete cascade,
  player_version text check(player_version is null or length(player_version)<=40),
  status text check(status is null or length(status)<=40),
  last_manifest_revision bigint check(last_manifest_revision is null or last_manifest_revision>=0),
  storage_free_bytes bigint check(storage_free_bytes is null or storage_free_bytes>=0),
  errors jsonb not null default '[]'::jsonb check(jsonb_typeof(errors)='array' and jsonb_array_length(errors)<=20 and pg_column_size(errors)<=16384),
  received_at timestamptz not null default now(),
  foreign key(device_id,workspace_id) references public.signage_devices(id,workspace_id) on delete cascade
);

create table public.signage_rate_limits(
  bucket_digest text primary key check(bucket_digest ~ '^[0-9a-f]{64}$'),
  window_started_at timestamptz not null,
  request_count integer not null check(request_count>0),
  expires_at timestamptz not null check(expires_at>window_started_at)
);

alter table public.signage_device_heartbeats enable row level security;
alter table public.signage_rate_limits enable row level security;
create policy signage_heartbeat_read on public.signage_device_heartbeats for select to authenticated
  using(public.signage_can(workspace_id,'read'));
revoke all on public.signage_device_heartbeats,public.signage_rate_limits from public,anon,authenticated;
grant select on public.signage_device_heartbeats to authenticated;
grant all on public.signage_device_heartbeats,public.signage_rate_limits to service_role;

-- Sustituye la validación de contenido para que los medios privados se guarden
-- por identificador estable. La URL firmada se agrega al manifiesto en Edge y
-- nunca se persiste en una publicación.
create or replace function public.signage_content_save(p_workspace uuid,p_content uuid,p_snapshot jsonb,p_expected_revision bigint)
returns jsonb language plpgsql security definer set search_path='' as $$
declare v_item public.signage_content_items; v_id uuid:=coalesce(p_content,gen_random_uuid()); v_revision bigint; v_title text; v_type text; v_asset uuid;
begin
 if not public.signage_can(p_workspace,'read') or not public.signage_can(p_workspace,'write') then raise insufficient_privilege using message='Signage write denied'; end if;
 if p_snapshot is null or jsonb_typeof(p_snapshot)<>'object' or pg_column_size(p_snapshot)>262144 then raise exception 'Invalid content snapshot' using errcode='22023'; end if;
 v_title:=trim(coalesce(p_snapshot->>'title','')); v_type:=coalesce(p_snapshot->>'type','message');
 if length(v_title) not between 3 and 80 or v_type not in ('message','image','video','link')
   or length(trim(coalesce(p_snapshot->>'body',''))) > 240
   or (v_type='message' and length(trim(coalesce(p_snapshot->>'body',''))) < 1)
   or coalesce(p_snapshot->>'theme','') not in ('neutral','teal','blue')
   or (v_type in ('image','video') and length(trim(coalesce(p_snapshot->>'alt',''))) not between 1 and 180)
   or (v_type='link' and (coalesce(p_snapshot->>'url','') !~ '^https://[^[:space:]@]+.*$' or p_snapshot->>'url' ~ '^https://[^/]*@'))
 then raise exception 'Invalid content fields' using errcode='22023'; end if;
 if v_type in ('image','video') then
  if coalesce(p_snapshot->>'mediaAssetId','') ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' then
   v_asset:=(p_snapshot->>'mediaAssetId')::uuid;
   if not exists(select 1 from public.signage_media_assets a where a.id=v_asset and a.workspace_id=p_workspace and a.state='ready'
    and ((v_type='image' and a.content_type like 'image/%') or (v_type='video' and a.content_type like 'video/%'))) then
    raise exception 'Media asset denied' using errcode='42501';
   end if;
  elsif coalesce(p_snapshot->>'mediaUrl','') !~ '^https://[^[:space:]@]+.*$' or p_snapshot->>'mediaUrl' ~ '^https://[^/]*@'
    or (v_type='image' and lower(split_part(p_snapshot->>'mediaUrl','?',1)) !~ '\.(jpg|jpeg|png|webp|gif)$')
    or (v_type='video' and lower(split_part(p_snapshot->>'mediaUrl','?',1)) !~ '\.(mp4|webm)$') then
   raise exception 'Invalid media reference' using errcode='22023';
  end if;
 end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('signage-content:'||v_id::text,0));
 select * into v_item from public.signage_content_items where id=v_id for update;
 if found then
  if v_item.workspace_id<>p_workspace then raise insufficient_privilege using message='Workspace isolation violation'; end if;
  if p_expected_revision is distinct from v_item.current_revision then raise exception 'Content changed; reload' using errcode='40001'; end if;
  v_revision:=v_item.current_revision+1;
  update public.signage_content_items set title=v_title,status='draft',current_revision=v_revision,updated_by=auth.uid(),updated_at=now() where id=v_id;
 else
  if coalesce(p_expected_revision,0)<>0 then raise exception 'Content does not exist' using errcode='40001'; end if;
  v_revision:=1;
  insert into public.signage_content_items(id,workspace_id,title,current_revision,created_by,updated_by) values(v_id,p_workspace,v_title,v_revision,auth.uid(),auth.uid());
 end if;
 insert into public.signage_content_versions(content_id,workspace_id,revision,snapshot,created_by) values(v_id,p_workspace,v_revision,p_snapshot,auth.uid());
 insert into public.signage_audit(workspace_id,actor_id,event_type,entity_type,entity_id,details) values(p_workspace,auth.uid(),'content.saved','content',v_id,jsonb_build_object('revision',v_revision));
 return jsonb_build_object('id',v_id,'revision',v_revision,'snapshot',p_snapshot);
end;
$$;

create or replace function public.signage_rate_limit_service(p_bucket_digest text,p_limit integer,p_window_seconds integer)
returns boolean language plpgsql security definer set search_path='' as $$
declare v_row public.signage_rate_limits;
begin
 if p_bucket_digest !~ '^[0-9a-f]{64}$' or p_limit not between 1 and 1000 or p_window_seconds not between 1 and 3600 then
  raise exception 'Invalid rate limit input' using errcode='22023';
 end if;
 delete from public.signage_rate_limits where expires_at<now();
 insert into public.signage_rate_limits(bucket_digest,window_started_at,request_count,expires_at)
 values(p_bucket_digest,now(),1,now()+make_interval(secs=>p_window_seconds))
 on conflict(bucket_digest) do update set
  window_started_at=case when public.signage_rate_limits.expires_at<=now() then now() else public.signage_rate_limits.window_started_at end,
  request_count=case when public.signage_rate_limits.expires_at<=now() then 1 else public.signage_rate_limits.request_count+1 end,
  expires_at=case when public.signage_rate_limits.expires_at<=now() then now()+make_interval(secs=>p_window_seconds) else public.signage_rate_limits.expires_at end
 returning * into v_row;
 return v_row.request_count<=p_limit;
end;
$$;

create or replace function public.signage_pairing_claim_service(
 p_code_digest text,p_workspace uuid,p_site uuid,p_name text,p_actor uuid)
returns jsonb language plpgsql security definer set search_path='' as $$
declare v_pair public.signage_pairing_sessions; v_device uuid; v_credential uuid;
begin
 select * into v_pair from public.signage_pairing_sessions where code_digest=p_code_digest for update;
 if not found or v_pair.expires_at<=now() or v_pair.claimed_at is not null then
  raise exception 'Pairing denied' using errcode='42501';
 end if;
 update public.signage_pairing_sessions set attempt_count=attempt_count+1 where id=v_pair.id;
 if v_pair.attempt_count>=5 then raise exception 'Pairing denied' using errcode='42501'; end if;
 if not exists(select 1 from public.signage_sites where id=p_site and workspace_id=p_workspace and state='active') then
  raise exception 'Site denied' using errcode='42501';
 end if;
 insert into public.signage_devices(workspace_id,site_id,name,state)
 values(p_workspace,p_site,trim(p_name),'active') returning id into v_device;
 insert into public.signage_device_credentials(device_id,workspace_id,fingerprint)
 values(v_device,p_workspace,'pending:'||v_pair.id::text) returning id into v_credential;
 update public.signage_pairing_sessions set device_id=v_device,claimed_by=p_actor,claimed_at=now() where id=v_pair.id;
 insert into public.signage_audit(workspace_id,actor_id,event_type,entity_type,entity_id,details)
 values(p_workspace,p_actor,'device.paired','device',v_device,jsonb_build_object('pairing_id',v_pair.id));
 return jsonb_build_object('device_id',v_device,'credential_id',v_credential,'state','claimed');
end;
$$;

create or replace function public.signage_pairing_deliver_service(
 p_claim_digest text,p_token_digest text,p_fingerprint text,p_expires_at timestamptz)
returns jsonb language plpgsql security definer set search_path='' as $$
declare v_pair public.signage_pairing_sessions; v_credential public.signage_device_credentials;
begin
 select * into v_pair from public.signage_pairing_sessions where claim_digest=p_claim_digest for update;
 if not found or v_pair.expires_at<=now() then raise exception 'Pairing expired' using errcode='42501'; end if;
 if v_pair.claimed_at is null then return jsonb_build_object('state','pending','expires_at',v_pair.expires_at); end if;
 if v_pair.delivered_at is not null then raise exception 'Pairing consumed' using errcode='42501'; end if;
 select * into v_credential from public.signage_device_credentials
  where device_id=v_pair.device_id and token_digest is null and revoked_at is null for update;
 if not found then raise exception 'Pairing credential denied' using errcode='42501'; end if;
 update public.signage_device_credentials set token_digest=p_token_digest,fingerprint=p_fingerprint,expires_at=p_expires_at
  where id=v_credential.id;
 update public.signage_pairing_sessions set delivered_at=now() where id=v_pair.id;
 return jsonb_build_object('state','paired','device_id',v_pair.device_id,'credential_id',v_credential.id,'workspace_id',v_credential.workspace_id);
end;
$$;

revoke all on function public.signage_rate_limit_service(text,integer,integer),
 public.signage_pairing_claim_service(text,uuid,uuid,text,uuid),
 public.signage_pairing_deliver_service(text,text,text,timestamptz) from public,anon,authenticated;
grant execute on function public.signage_rate_limit_service(text,integer,integer),
 public.signage_pairing_claim_service(text,uuid,uuid,text,uuid),
 public.signage_pairing_deliver_service(text,text,text,timestamptz) to service_role;

insert into public.index_security_migrations(version) values(62) on conflict do nothing;
notify pgrst,'reload schema';
commit;
