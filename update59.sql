-- SIERRA Señalización: autorización, modelo versionado y contrato de sincronización.
-- Aplicar después de update58.sql. No contiene datos de producción ni secretos.
begin;

alter table public.capability_grants drop constraint if exists capability_grants_domain_check;
alter table public.capability_grants add constraint capability_grants_domain_check check(domain in
 ('fiber','yarn','fabric','chemicals','garment','warehouse','warehouse_fiber','warehouse_yarn',
  'warehouse_fabric','warehouse_chemicals','warehouse_garment','customer_service','talento_humano',
  'communications','processes','academy','signage','platform'));

alter table public.capability_grants drop constraint if exists capability_grants_capability_check;
alter table public.capability_grants add constraint capability_grants_capability_check check(capability in
 ('read','write','delete','publish','dispatch','manage_status','approve','operate','manage_devices','grant','admin'));

create or replace function public.set_index_access(p_user uuid,p_domain text,p_caps text[])
returns void language plpgsql security definer set search_path=public,pg_temp as $$
begin
  if not public.authorize('platform','admin') then raise exception 'not authorized'; end if;
  if p_user=auth.uid() then raise exception 'Use another administrator to change your access'; end if;
  if not exists(select 1 from profiles where id=p_user) then raise exception 'Unknown account'; end if;
  if p_domain is null or p_domain not in ('fiber','yarn','fabric','chemicals','garment','warehouse',
    'warehouse_fiber','warehouse_yarn','warehouse_fabric','warehouse_chemicals','warehouse_garment',
    'customer_service','talento_humano','communications','processes','academy','signage','platform') then
    raise exception 'Invalid domain';
  end if;
  if p_caps is null or not p_caps <@ array['read','write','delete','publish','dispatch','manage_status',
    'approve','operate','manage_devices','grant','admin']::text[]
    or ('admin'=any(p_caps) and p_domain<>'platform') then raise exception 'Invalid capabilities'; end if;
  if p_domain in ('communications','processes','academy') and (not p_caps <@ array['read','write']::text[]
    or ('write'=any(p_caps) and not 'read'=any(p_caps))) then raise exception 'Invalid module access'; end if;
  if p_domain='signage' and (not p_caps <@ array['read','write','approve','publish','operate','manage_devices']::text[]
    or (p_caps && array['write','approve','publish','operate','manage_devices']::text[] and not 'read'=any(p_caps))) then
    raise exception 'Invalid signage access';
  end if;
  perform pg_advisory_xact_lock(hashtext('index-access:'||p_user::text));
  delete from capability_grants where user_id=p_user and domain=p_domain and resource_id is null;
  insert into capability_grants(user_id,domain,capability,granted_by)
    select p_user,p_domain,c,auth.uid() from (select distinct unnest(p_caps) c) q;
end;
$$;
revoke all on function public.set_index_access(uuid,text,text[]) from public,anon;
grant execute on function public.set_index_access(uuid,text,text[]) to authenticated;

create or replace function public.set_signage_access(p_user uuid,p_workspace uuid,p_caps text[])
returns void language plpgsql security definer set search_path=public,pg_temp as $$
begin
  if not public.authorize('platform','admin') then raise insufficient_privilege using message='Signage grant denied'; end if;
  if p_user=auth.uid() then raise exception 'Use another administrator to change your access'; end if;
  if not exists(select 1 from profiles where id=p_user) then raise exception 'Unknown account'; end if;
  if not exists(select 1 from signage_workspaces where id=p_workspace) then raise exception 'Unknown signage workspace'; end if;
  if p_caps is null or not p_caps <@ array['read','write','approve','publish','operate','manage_devices']::text[]
    or (p_caps && array['write','approve','publish','operate','manage_devices']::text[] and not 'read'=any(p_caps)) then
    raise exception 'Invalid signage access';
  end if;
  perform pg_advisory_xact_lock(hashtext('signage-access:'||p_user::text||':'||p_workspace::text));
  delete from capability_grants where user_id=p_user and domain='signage' and resource_id=p_workspace;
  insert into capability_grants(user_id,domain,capability,resource_id,granted_by)
    select p_user,'signage',c,p_workspace,auth.uid() from (select distinct unnest(p_caps) c) q;
end;
$$;

create table public.signage_workspaces(
  id uuid primary key default gen_random_uuid(),
  name text not null check(length(trim(name)) between 1 and 120),
  timezone text not null check(length(timezone) between 1 and 80),
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.signage_sites(
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.signage_workspaces(id) on delete cascade,
  name text not null check(length(trim(name)) between 1 and 120),
  timezone text not null check(length(timezone) between 1 and 80),
  state text not null default 'active' check(state in ('active','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(workspace_id,name),
  unique(id,workspace_id)
);

create table public.signage_content_items(
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.signage_workspaces(id) on delete cascade,
  title text not null check(length(trim(title)) between 3 and 120),
  status text not null default 'draft' check(status in ('draft','in_review','approved','archived')),
  current_revision bigint not null default 0 check(current_revision>=0),
  created_by uuid not null references public.profiles(id),
  updated_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(id,workspace_id)
);

create table public.signage_content_versions(
  content_id uuid not null references public.signage_content_items(id) on delete cascade,
  workspace_id uuid not null references public.signage_workspaces(id) on delete cascade,
  revision bigint not null check(revision>0),
  snapshot jsonb not null check(jsonb_typeof(snapshot)='object' and pg_column_size(snapshot)<=262144),
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  primary key(content_id,revision),
  foreign key(content_id,workspace_id) references public.signage_content_items(id,workspace_id) on delete cascade,
  unique(content_id,revision,workspace_id)
);

create table public.signage_playlists(
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.signage_workspaces(id) on delete cascade,
  name text not null check(length(trim(name)) between 3 and 80),
  current_revision bigint not null default 0 check(current_revision>=0),
  created_by uuid not null references public.profiles(id),
  updated_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(id,workspace_id)
);

create table public.signage_playlist_versions(
  playlist_id uuid not null,
  workspace_id uuid not null references public.signage_workspaces(id) on delete cascade,
  revision bigint not null check(revision>0),
  entries jsonb not null check(jsonb_typeof(entries)='array' and jsonb_array_length(entries) between 1 and 50 and pg_column_size(entries)<=131072),
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  primary key(playlist_id,revision),
  foreign key(playlist_id,workspace_id) references public.signage_playlists(id,workspace_id) on delete cascade,
  unique(playlist_id,revision,workspace_id)
);

create table public.signage_devices(
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.signage_workspaces(id) on delete cascade,
  site_id uuid not null,
  name text not null check(length(trim(name)) between 1 and 120),
  state text not null default 'active' check(state in ('pending','active','revoked','archived')),
  revision bigint not null default 0 check(revision>=0),
  active_publication_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(workspace_id,name),
  unique(id,workspace_id),
  foreign key(site_id,workspace_id) references public.signage_sites(id,workspace_id)
);

create table public.signage_device_credentials(
  id uuid primary key default gen_random_uuid(),
  device_id uuid not null,
  workspace_id uuid not null references public.signage_workspaces(id) on delete cascade,
  fingerprint text not null check(length(fingerprint) between 16 and 128),
  issued_at timestamptz not null default now(),
  revoked_at timestamptz,
  revoked_by uuid references public.profiles(id),
  revoke_reason text check(revoke_reason is null or length(revoke_reason)<=500),
  foreign key(device_id,workspace_id) references public.signage_devices(id,workspace_id) on delete cascade,
  unique(device_id,fingerprint)
);

create table public.signage_schedules(
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.signage_workspaces(id) on delete cascade,
  device_id uuid not null,
  playlist_id uuid not null,
  playlist_revision bigint not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null check(ends_at>starts_at),
  priority smallint not null default 0 check(priority between 0 and 9),
  enabled boolean not null default true,
  revision bigint not null default 1 check(revision>0),
  created_by uuid not null references public.profiles(id),
  updated_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key(device_id,workspace_id) references public.signage_devices(id,workspace_id) on delete cascade,
  foreign key(playlist_id,playlist_revision,workspace_id) references public.signage_playlist_versions(playlist_id,revision,workspace_id)
);

create table public.signage_publications(
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.signage_workspaces(id) on delete cascade,
  device_id uuid not null,
  version bigint not null check(version>0),
  content_id uuid not null references public.signage_content_items(id),
  content_revision bigint not null,
  snapshot jsonb not null check(jsonb_typeof(snapshot)='object' and pg_column_size(snapshot)<=262144),
  kind text not null default 'publish' check(kind in ('publish','rollback')),
  rollback_of uuid references public.signage_publications(id),
  published_by uuid not null references public.profiles(id),
  published_at timestamptz not null default now(),
  foreign key(device_id,workspace_id) references public.signage_devices(id,workspace_id) on delete cascade,
  foreign key(content_id,content_revision,workspace_id) references public.signage_content_versions(content_id,revision,workspace_id),
  unique(device_id,version)
);

alter table public.signage_devices add constraint signage_devices_active_publication_fk
  foreign key(active_publication_id) references public.signage_publications(id);

create table public.signage_audit(
  id bigint generated always as identity primary key,
  workspace_id uuid not null references public.signage_workspaces(id) on delete cascade,
  actor_id uuid references public.profiles(id),
  event_type text not null check(length(event_type) between 1 and 80),
  entity_type text not null check(length(entity_type) between 1 and 80),
  entity_id uuid,
  details jsonb not null default '{}'::jsonb check(jsonb_typeof(details)='object'),
  created_at timestamptz not null default now()
);

create index signage_sites_workspace_idx on public.signage_sites(workspace_id);
create index signage_content_workspace_idx on public.signage_content_items(workspace_id,updated_at desc);
create index signage_devices_workspace_idx on public.signage_devices(workspace_id,site_id);
create index signage_schedules_device_window_idx on public.signage_schedules(device_id,starts_at,ends_at) where enabled;
create index signage_publications_device_idx on public.signage_publications(device_id,version desc);
create index signage_audit_workspace_idx on public.signage_audit(workspace_id,created_at desc);

create or replace function public.signage_can(p_workspace uuid,p_capability text)
returns boolean language sql stable security definer set search_path=public,pg_temp as $$
 select coalesce(public.authorize('signage',p_capability,p_workspace),false)
$$;

alter table public.signage_workspaces enable row level security;
alter table public.signage_sites enable row level security;
alter table public.signage_content_items enable row level security;
alter table public.signage_content_versions enable row level security;
alter table public.signage_playlists enable row level security;
alter table public.signage_playlist_versions enable row level security;
alter table public.signage_devices enable row level security;
alter table public.signage_device_credentials enable row level security;
alter table public.signage_schedules enable row level security;
alter table public.signage_publications enable row level security;
alter table public.signage_audit enable row level security;

create policy signage_workspace_read on public.signage_workspaces for select to authenticated
 using(public.signage_can(id,'read'));
create policy signage_site_read on public.signage_sites for select to authenticated
 using(public.signage_can(workspace_id,'read'));
create policy signage_content_read on public.signage_content_items for select to authenticated
 using(public.signage_can(workspace_id,'read'));
create policy signage_content_version_read on public.signage_content_versions for select to authenticated
 using(public.signage_can(workspace_id,'read'));
create policy signage_playlist_read on public.signage_playlists for select to authenticated
 using(public.signage_can(workspace_id,'read'));
create policy signage_playlist_version_read on public.signage_playlist_versions for select to authenticated
 using(public.signage_can(workspace_id,'read'));
create policy signage_device_read on public.signage_devices for select to authenticated
 using(public.signage_can(workspace_id,'read'));
create policy signage_schedule_read on public.signage_schedules for select to authenticated
 using(public.signage_can(workspace_id,'read'));
create policy signage_publication_read on public.signage_publications for select to authenticated
 using(public.signage_can(workspace_id,'read'));
create policy signage_audit_read on public.signage_audit for select to authenticated
 using(public.signage_can(workspace_id,'read'));
-- Las credenciales nunca son legibles por clientes autenticados; solo RPC de revocación y servicio de sincronización.

revoke all on public.signage_workspaces,public.signage_sites,public.signage_content_items,
 public.signage_content_versions,public.signage_devices,public.signage_device_credentials,
 public.signage_playlists,public.signage_playlist_versions,public.signage_schedules,
 public.signage_publications,public.signage_audit from public,anon,authenticated;

create or replace function public.signage_workspace_snapshot(p_workspace uuid)
returns jsonb language plpgsql stable security definer set search_path='' as $$
begin
 if not public.signage_can(p_workspace,'read') then raise insufficient_privilege using message='Signage access denied'; end if;
 return jsonb_build_object(
  'workspace',(select to_jsonb(w) from public.signage_workspaces w where w.id=p_workspace),
  'sites',coalesce((select jsonb_agg(to_jsonb(s) order by s.name) from public.signage_sites s where s.workspace_id=p_workspace),'[]'::jsonb),
  'devices',coalesce((select jsonb_agg(to_jsonb(d) order by d.name) from public.signage_devices d where d.workspace_id=p_workspace),'[]'::jsonb),
  'contents',coalesce((select jsonb_agg(to_jsonb(c) order by c.updated_at desc) from public.signage_content_items c where c.workspace_id=p_workspace),'[]'::jsonb),
  'playlists',coalesce((select jsonb_agg(to_jsonb(l) order by l.updated_at desc) from public.signage_playlists l where l.workspace_id=p_workspace),'[]'::jsonb),
  'schedules',coalesce((select jsonb_agg(to_jsonb(s) order by s.starts_at desc) from public.signage_schedules s where s.workspace_id=p_workspace),'[]'::jsonb),
  'publications',coalesce((select jsonb_agg(to_jsonb(p) order by p.published_at desc) from public.signage_publications p where p.workspace_id=p_workspace),'[]'::jsonb)
 );
end;
$$;

create or replace function public.signage_content_save(p_workspace uuid,p_content uuid,p_snapshot jsonb,p_expected_revision bigint)
returns jsonb language plpgsql security definer set search_path='' as $$
declare v_item public.signage_content_items; v_id uuid:=coalesce(p_content,gen_random_uuid()); v_revision bigint; v_title text;
begin
 if not public.signage_can(p_workspace,'read') or not public.signage_can(p_workspace,'write') then
  raise insufficient_privilege using message='Signage write denied';
 end if;
 if p_snapshot is null or jsonb_typeof(p_snapshot)<>'object' or pg_column_size(p_snapshot)>262144 then
  raise exception 'Invalid content snapshot' using errcode='22023';
 end if;
 v_title:=trim(coalesce(p_snapshot->>'title',''));
 if length(v_title) not between 3 and 80 or coalesce(p_snapshot->>'type','message') not in ('message','image','video')
   or length(trim(coalesce(p_snapshot->>'body',''))) > 240
   or (coalesce(p_snapshot->>'type','message')='message' and length(trim(coalesce(p_snapshot->>'body',''))) < 1)
   or coalesce(p_snapshot->>'theme','') not in ('neutral','teal','blue')
   or (coalesce(p_snapshot->>'type','message') in ('image','video') and (
     coalesce(p_snapshot->>'mediaUrl','') !~ '^https://[^[:space:]@]+.*$'
     or p_snapshot->>'mediaUrl' ~ '^https://[^/]*@'
     or length(trim(coalesce(p_snapshot->>'alt',''))) not between 1 and 180
     or (p_snapshot->>'type'='image' and lower(split_part(p_snapshot->>'mediaUrl','?',1)) !~ '\.(jpg|jpeg|png|webp|gif)$')
     or (p_snapshot->>'type'='video' and lower(split_part(p_snapshot->>'mediaUrl','?',1)) !~ '\.(mp4|webm)$')
   )) then
  raise exception 'Invalid content fields' using errcode='22023';
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
  insert into public.signage_content_items(id,workspace_id,title,current_revision,created_by,updated_by)
   values(v_id,p_workspace,v_title,v_revision,auth.uid(),auth.uid());
 end if;
 insert into public.signage_content_versions(content_id,workspace_id,revision,snapshot,created_by)
  values(v_id,p_workspace,v_revision,p_snapshot,auth.uid());
 insert into public.signage_audit(workspace_id,actor_id,event_type,entity_type,entity_id,details)
  values(p_workspace,auth.uid(),'content.saved','content',v_id,jsonb_build_object('revision',v_revision));
 return jsonb_build_object('id',v_id,'revision',v_revision,'snapshot',p_snapshot);
end;
$$;

create or replace function public.signage_content_approve(p_workspace uuid,p_content uuid,p_expected_revision bigint)
returns jsonb language plpgsql security definer set search_path='' as $$
declare v_item public.signage_content_items;
begin
 if not public.signage_can(p_workspace,'read') or not public.signage_can(p_workspace,'approve') then
  raise insufficient_privilege using message='Signage approval denied';
 end if;
 select * into v_item from public.signage_content_items where id=p_content for update;
 if not found or v_item.workspace_id<>p_workspace then raise insufficient_privilege using message='Content access denied'; end if;
 if p_expected_revision is distinct from v_item.current_revision then raise exception 'Content changed; reload' using errcode='40001'; end if;
 if v_item.status='archived' then raise exception 'Archived content cannot be approved' using errcode='55000'; end if;
 update public.signage_content_items set status='approved',updated_by=auth.uid(),updated_at=now() where id=p_content;
 insert into public.signage_audit(workspace_id,actor_id,event_type,entity_type,entity_id,details)
  values(p_workspace,auth.uid(),'content.approved','content',p_content,jsonb_build_object('revision',v_item.current_revision));
 return jsonb_build_object('id',p_content,'revision',v_item.current_revision,'status','approved');
end;
$$;

create or replace function public.signage_playlist_save(p_workspace uuid,p_playlist uuid,p_name text,p_entries jsonb,p_expected_revision bigint)
returns jsonb language plpgsql security definer set search_path='' as $$
declare v_list public.signage_playlists; v_id uuid:=coalesce(p_playlist,gen_random_uuid()); v_revision bigint; v_name text:=trim(coalesce(p_name,''));
begin
 if not public.signage_can(p_workspace,'read') or not public.signage_can(p_workspace,'write') then
  raise insufficient_privilege using message='Signage playlist write denied';
 end if;
 if length(v_name) not between 3 and 80 or p_entries is null or jsonb_typeof(p_entries)<>'array' then
  raise exception 'Invalid playlist' using errcode='22023';
 end if;
 if jsonb_array_length(p_entries) not between 1 and 50 or pg_column_size(p_entries)>131072
   or exists(select 1 from jsonb_array_elements(p_entries) e where jsonb_typeof(e)<>'object'
     or not case when coalesce(e->>'contentId','') ~ '^[0-9a-fA-F-]{36}$' then
       exists(select 1 from public.signage_content_items c where c.id=(e->>'contentId')::uuid and c.workspace_id=p_workspace) else false end
     or not case when coalesce(e->>'durationSeconds','') ~ '^[0-9]+$' then
       (e->>'durationSeconds')::integer between 5 and 3600 else false end) then
  raise exception 'Invalid playlist' using errcode='22023';
 end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('signage-playlist:'||v_id::text,0));
 select * into v_list from public.signage_playlists where id=v_id for update;
 if found then
  if v_list.workspace_id<>p_workspace then raise insufficient_privilege using message='Workspace isolation violation'; end if;
  if p_expected_revision is distinct from v_list.current_revision then raise exception 'Playlist changed; reload' using errcode='40001'; end if;
  v_revision:=v_list.current_revision+1;
  update public.signage_playlists set name=v_name,current_revision=v_revision,updated_by=auth.uid(),updated_at=now() where id=v_id;
 else
  if coalesce(p_expected_revision,0)<>0 then raise exception 'Playlist does not exist' using errcode='40001'; end if;
  v_revision:=1;
  insert into public.signage_playlists(id,workspace_id,name,current_revision,created_by,updated_by)
   values(v_id,p_workspace,v_name,v_revision,auth.uid(),auth.uid());
 end if;
 insert into public.signage_playlist_versions(playlist_id,workspace_id,revision,entries,created_by)
  values(v_id,p_workspace,v_revision,p_entries,auth.uid());
 insert into public.signage_audit(workspace_id,actor_id,event_type,entity_type,entity_id,details)
  values(p_workspace,auth.uid(),'playlist.saved','playlist',v_id,jsonb_build_object('revision',v_revision));
 return jsonb_build_object('id',v_id,'revision',v_revision,'name',v_name,'entries',p_entries);
end;
$$;

create or replace function public.signage_schedule_save(p_workspace uuid,p_schedule uuid,p_device uuid,p_playlist uuid,p_starts_at timestamptz,p_ends_at timestamptz,p_priority integer,p_expected_revision bigint)
returns jsonb language plpgsql security definer set search_path='' as $$
declare v_schedule public.signage_schedules; v_list public.signage_playlists; v_id uuid:=coalesce(p_schedule,gen_random_uuid()); v_revision bigint;
begin
 if not public.signage_can(p_workspace,'read') or not public.signage_can(p_workspace,'operate') then
  raise insufficient_privilege using message='Signage scheduling denied';
 end if;
 if p_starts_at is null or p_ends_at is null or p_ends_at<=p_starts_at or p_priority is null or p_priority not between 0 and 9 then
  raise exception 'Invalid schedule' using errcode='22023';
 end if;
 if not exists(select 1 from public.signage_devices d where d.id=p_device and d.workspace_id=p_workspace and d.state='active') then
  raise insufficient_privilege using message='Device access denied';
 end if;
 select * into v_list from public.signage_playlists where id=p_playlist and workspace_id=p_workspace;
 if not found then raise insufficient_privilege using message='Playlist access denied'; end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('signage-schedule:'||v_id::text,0));
 select * into v_schedule from public.signage_schedules where id=v_id for update;
 if found then
  if v_schedule.workspace_id<>p_workspace then raise insufficient_privilege using message='Workspace isolation violation'; end if;
  if p_expected_revision is distinct from v_schedule.revision then raise exception 'Schedule changed; reload' using errcode='40001'; end if;
  v_revision:=v_schedule.revision+1;
  update public.signage_schedules set device_id=p_device,playlist_id=p_playlist,playlist_revision=v_list.current_revision,
   starts_at=p_starts_at,ends_at=p_ends_at,priority=p_priority,revision=v_revision,updated_by=auth.uid(),updated_at=now() where id=v_id;
 else
  if coalesce(p_expected_revision,0)<>0 then raise exception 'Schedule does not exist' using errcode='40001'; end if;
  v_revision:=1;
  insert into public.signage_schedules(id,workspace_id,device_id,playlist_id,playlist_revision,starts_at,ends_at,priority,created_by,updated_by)
   values(v_id,p_workspace,p_device,p_playlist,v_list.current_revision,p_starts_at,p_ends_at,p_priority,auth.uid(),auth.uid());
 end if;
 insert into public.signage_audit(workspace_id,actor_id,event_type,entity_type,entity_id,details)
  values(p_workspace,auth.uid(),'schedule.saved','schedule',v_id,jsonb_build_object('revision',v_revision,'priority',p_priority));
 return jsonb_build_object('id',v_id,'revision',v_revision,'playlist_revision',v_list.current_revision);
end;
$$;

create or replace function public.signage_publish(p_workspace uuid,p_device uuid,p_content uuid,p_expected_device_revision bigint)
returns jsonb language plpgsql security definer set search_path='' as $$
declare v_device public.signage_devices; v_content public.signage_content_items; v_snapshot jsonb; v_version bigint; v_publication uuid;
begin
 if not public.signage_can(p_workspace,'read') or not public.signage_can(p_workspace,'publish') then
  raise insufficient_privilege using message='Signage publish denied';
 end if;
 select * into v_device from public.signage_devices where id=p_device for update;
 if not found or v_device.workspace_id<>p_workspace then raise insufficient_privilege using message='Device access denied'; end if;
 if v_device.state<>'active' then raise exception 'Device is not active' using errcode='55000'; end if;
 if p_expected_device_revision is distinct from v_device.revision then raise exception 'Device changed; reload' using errcode='40001'; end if;
 select * into v_content from public.signage_content_items where id=p_content;
 if not found or v_content.workspace_id<>p_workspace then raise insufficient_privilege using message='Content access denied'; end if;
 if v_content.status<>'approved' then raise exception 'Content is not approved' using errcode='55000'; end if;
 select snapshot into v_snapshot from public.signage_content_versions where content_id=p_content and revision=v_content.current_revision;
 select coalesce(max(version),0)+1 into v_version from public.signage_publications where device_id=p_device;
 insert into public.signage_publications(workspace_id,device_id,version,content_id,content_revision,snapshot,published_by)
  values(p_workspace,p_device,v_version,p_content,v_content.current_revision,v_snapshot,auth.uid()) returning id into v_publication;
 update public.signage_devices set active_publication_id=v_publication,revision=revision+1,updated_at=now() where id=p_device;
 insert into public.signage_audit(workspace_id,actor_id,event_type,entity_type,entity_id,details)
  values(p_workspace,auth.uid(),'device.published','device',p_device,jsonb_build_object('publication_id',v_publication,'version',v_version));
 return jsonb_build_object('publication_id',v_publication,'version',v_version,'device_revision',v_device.revision+1);
end;
$$;

create or replace function public.signage_rollback(p_workspace uuid,p_device uuid,p_target_publication uuid,p_expected_device_revision bigint)
returns jsonb language plpgsql security definer set search_path='' as $$
declare v_device public.signage_devices; v_target public.signage_publications; v_version bigint; v_publication uuid;
begin
 if not public.signage_can(p_workspace,'read') or not public.signage_can(p_workspace,'publish') then
  raise insufficient_privilege using message='Signage rollback denied';
 end if;
 select * into v_device from public.signage_devices where id=p_device for update;
 if not found or v_device.workspace_id<>p_workspace then raise insufficient_privilege using message='Device access denied'; end if;
 if v_device.state<>'active' then raise exception 'Device is not active' using errcode='55000'; end if;
 if p_expected_device_revision is distinct from v_device.revision then raise exception 'Device changed; reload' using errcode='40001'; end if;
 select * into v_target from public.signage_publications where id=p_target_publication;
 if not found or v_target.workspace_id<>p_workspace or v_target.device_id<>p_device then
  raise insufficient_privilege using message='Rollback target denied';
 end if;
 select coalesce(max(version),0)+1 into v_version from public.signage_publications where device_id=p_device;
 insert into public.signage_publications(workspace_id,device_id,version,content_id,content_revision,snapshot,kind,rollback_of,published_by)
  values(p_workspace,p_device,v_version,v_target.content_id,v_target.content_revision,v_target.snapshot,'rollback',v_target.id,auth.uid())
  returning id into v_publication;
 update public.signage_devices set active_publication_id=v_publication,revision=revision+1,updated_at=now() where id=p_device;
 insert into public.signage_audit(workspace_id,actor_id,event_type,entity_type,entity_id,details)
  values(p_workspace,auth.uid(),'device.rolled_back','device',p_device,jsonb_build_object('publication_id',v_publication,'rollback_of',v_target.id,'version',v_version));
 return jsonb_build_object('publication_id',v_publication,'version',v_version,'device_revision',v_device.revision+1,'rollback_of',v_target.id);
end;
$$;

create or replace function public.signage_device_revoke(p_workspace uuid,p_device uuid,p_reason text)
returns void language plpgsql security definer set search_path='' as $$
begin
 if not public.signage_can(p_workspace,'read') or not public.signage_can(p_workspace,'manage_devices') then
  raise insufficient_privilege using message='Signage device management denied';
 end if;
 if length(trim(coalesce(p_reason,''))) not between 3 and 500 then raise exception 'Revocation reason required' using errcode='22023'; end if;
 update public.signage_devices set state='revoked',revision=revision+1,updated_at=now() where id=p_device and workspace_id=p_workspace;
 if not found then raise insufficient_privilege using message='Device access denied'; end if;
 update public.signage_device_credentials set revoked_at=coalesce(revoked_at,now()),revoked_by=coalesce(revoked_by,auth.uid()),
  revoke_reason=coalesce(revoke_reason,trim(p_reason)) where device_id=p_device and workspace_id=p_workspace and revoked_at is null;
 insert into public.signage_audit(workspace_id,actor_id,event_type,entity_type,entity_id,details)
  values(p_workspace,auth.uid(),'device.revoked','device',p_device,jsonb_build_object('reason',trim(p_reason)));
end;
$$;

-- Límite servidor/reproductor: el servicio real autentica un token secreto y resuelve el id de credencial.
-- Esta función no recibe ni almacena secretos y jamás se expone a anon/authenticated.
create or replace function public.signage_device_manifest_service(p_device uuid,p_credential uuid)
returns jsonb language plpgsql stable security definer set search_path='' as $$
declare v_device public.signage_devices; v_credential public.signage_device_credentials; v_publication public.signage_publications; v_schedules jsonb;
begin
 select * into v_credential from public.signage_device_credentials where id=p_credential and device_id=p_device;
 select * into v_device from public.signage_devices where id=p_device;
 if not found or v_credential.id is null or v_credential.revoked_at is not null or v_device.state<>'active'
   or v_credential.workspace_id<>v_device.workspace_id then
  raise insufficient_privilege using message='Device credential denied';
 end if;
 select coalesce(jsonb_agg(jsonb_build_object('id',q.id,'starts_at',q.starts_at,'ends_at',q.ends_at,
  'priority',q.priority,'playlist_id',q.playlist_id,'playlist_revision',q.playlist_revision,'entries',q.entries)
  order by q.priority desc,q.starts_at desc,q.id asc),'[]'::jsonb) into v_schedules
 from (select s.id,s.starts_at,s.ends_at,s.priority,s.playlist_id,s.playlist_revision,v.entries
  from public.signage_schedules s join public.signage_playlist_versions v
   on v.playlist_id=s.playlist_id and v.revision=s.playlist_revision and v.workspace_id=s.workspace_id
  where s.device_id=p_device and s.enabled and s.ends_at>now() order by s.starts_at asc limit 100) q;
 if v_device.active_publication_id is null then
  return jsonb_build_object('schema_version',1,'device_id',p_device,'device_revision',v_device.revision,'state','no-content','schedules',v_schedules);
 end if;
 select * into v_publication from public.signage_publications where id=v_device.active_publication_id;
 return jsonb_build_object('schema_version',1,'device_id',p_device,'device_revision',v_device.revision,'state','ready',
  'publication_id',v_publication.id,'publication_version',v_publication.version,'content_id',v_publication.content_id,
  'content_revision',v_publication.content_revision,'published_at',v_publication.published_at,'snapshot',v_publication.snapshot,'schedules',v_schedules);
end;
$$;

revoke all on function public.set_signage_access(uuid,uuid,text[]),public.signage_can(uuid,text),public.signage_workspace_snapshot(uuid),
 public.signage_content_save(uuid,uuid,jsonb,bigint),public.signage_content_approve(uuid,uuid,bigint),public.signage_publish(uuid,uuid,uuid,bigint),
 public.signage_playlist_save(uuid,uuid,text,jsonb,bigint),public.signage_schedule_save(uuid,uuid,uuid,uuid,timestamptz,timestamptz,integer,bigint),
 public.signage_rollback(uuid,uuid,uuid,bigint),public.signage_device_revoke(uuid,uuid,text),
 public.signage_device_manifest_service(uuid,uuid) from public,anon,authenticated;
grant execute on function public.set_signage_access(uuid,uuid,text[]),public.signage_can(uuid,text),public.signage_workspace_snapshot(uuid),
 public.signage_content_save(uuid,uuid,jsonb,bigint),public.signage_content_approve(uuid,uuid,bigint),public.signage_publish(uuid,uuid,uuid,bigint),
 public.signage_playlist_save(uuid,uuid,text,jsonb,bigint),public.signage_schedule_save(uuid,uuid,uuid,uuid,timestamptz,timestamptz,integer,bigint),
 public.signage_rollback(uuid,uuid,uuid,bigint),public.signage_device_revoke(uuid,uuid,text) to authenticated;
grant execute on function public.signage_device_manifest_service(uuid,uuid) to service_role;

insert into public.index_security_migrations(version) values(59) on conflict do nothing;
notify pgrst,'reload schema';
commit;
