-- SIERRA Pantallas: espacios, nombres y asignación de dispositivos.
-- Aplicar después de update63.sql únicamente tras preflight y aprobación.
-- No mueve ni renombra dispositivos existentes; space_id inicia NULL.
begin;

create table public.signage_spaces(
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.signage_workspaces(id) on delete cascade,
  site_id uuid not null,
  name text not null check(length(trim(name)) between 2 and 80),
  state text not null default 'active' check(state in ('active','archived')),
  sort_order integer not null default 0 check(sort_order between 0 and 10000),
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key(site_id,workspace_id) references public.signage_sites(id,workspace_id),
  unique(id,workspace_id),
  unique(site_id,name)
);

alter table public.signage_spaces enable row level security;
create policy signage_space_read on public.signage_spaces for select to authenticated
 using(public.signage_can(workspace_id,'read'));
revoke all on public.signage_spaces from public,anon,authenticated;
grant select on public.signage_spaces to authenticated;
grant all on public.signage_spaces to service_role;
create index signage_spaces_workspace_site_idx on public.signage_spaces(workspace_id,site_id,sort_order,name);

alter table public.signage_devices add column if not exists space_id uuid;
alter table public.signage_devices add constraint signage_devices_space_fk
 foreign key(space_id,workspace_id) references public.signage_spaces(id,workspace_id);
create index signage_devices_space_idx on public.signage_devices(workspace_id,space_id,name);

create or replace function public.signage_space_save(
 p_workspace uuid,p_space uuid,p_site uuid,p_name text,p_expected_updated_at timestamptz default null)
returns jsonb language plpgsql security definer set search_path='' as $$
declare v_space public.signage_spaces; v_name text:=trim(coalesce(p_name,'')); v_id uuid:=coalesce(p_space,gen_random_uuid());
begin
 if not public.signage_can(p_workspace,'read') or not public.signage_can(p_workspace,'manage_devices') then
  raise insufficient_privilege using message='Signage space denied';
 end if;
 if length(v_name) not between 2 and 80 then raise exception 'Invalid space name' using errcode='22023'; end if;
 if not exists(select 1 from public.signage_sites s where s.id=p_site and s.workspace_id=p_workspace and s.state='active') then
  raise insufficient_privilege using message='Site denied';
 end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('signage-space:'||p_workspace::text||':'||lower(v_name),0));
 select * into v_space from public.signage_spaces where id=v_id for update;
 if found then
  if v_space.workspace_id<>p_workspace or v_space.site_id<>p_site then raise insufficient_privilege using message='Space access denied'; end if;
  if p_expected_updated_at is null or v_space.updated_at<>p_expected_updated_at then raise exception 'Space changed; reload' using errcode='40001'; end if;
  update public.signage_spaces set name=v_name,updated_at=now() where id=v_id returning * into v_space;
 else
  if p_space is not null or p_expected_updated_at is not null then raise exception 'Space does not exist' using errcode='40001'; end if;
  insert into public.signage_spaces(id,workspace_id,site_id,name,created_by) values(v_id,p_workspace,p_site,v_name,auth.uid()) returning * into v_space;
 end if;
 insert into public.signage_audit(workspace_id,actor_id,event_type,entity_type,entity_id,details)
 values(p_workspace,auth.uid(),case when p_space is null then 'space.created' else 'space.updated' end,'space',v_id,jsonb_build_object('name',v_name,'site_id',p_site));
 return to_jsonb(v_space);
end;
$$;

create or replace function public.signage_device_update(
 p_workspace uuid,p_device uuid,p_name text,p_space uuid,p_expected_device_revision bigint)
returns jsonb language plpgsql security definer set search_path='' as $$
declare v_device public.signage_devices; v_space public.signage_spaces; v_name text:=trim(coalesce(p_name,''));
begin
 if not public.signage_can(p_workspace,'read') or not public.signage_can(p_workspace,'manage_devices') then
  raise insufficient_privilege using message='Signage device update denied';
 end if;
 if length(v_name) not between 3 and 80 then raise exception 'Invalid device name' using errcode='22023'; end if;
 select * into v_device from public.signage_devices where id=p_device for update;
 if not found or v_device.workspace_id<>p_workspace then raise insufficient_privilege using message='Device access denied'; end if;
 if v_device.state<>'active' then raise exception 'Device is not active' using errcode='55000'; end if;
 if p_expected_device_revision is distinct from v_device.revision then raise exception 'Device changed; reload' using errcode='40001'; end if;
 if p_space is not null then
  select * into v_space from public.signage_spaces where id=p_space and workspace_id=p_workspace and state='active';
  if not found or v_space.site_id<>v_device.site_id then raise insufficient_privilege using message='Space access denied'; end if;
 end if;
 update public.signage_devices set name=v_name,space_id=p_space,revision=revision+1,updated_at=now()
 where id=p_device returning * into v_device;
 insert into public.signage_audit(workspace_id,actor_id,event_type,entity_type,entity_id,details)
 values(p_workspace,auth.uid(),'device.updated','device',p_device,jsonb_build_object('name',v_name,'space_id',p_space));
 return to_jsonb(v_device);
end;
$$;

-- Refuerza el límite de confianza: la RPC también restringe medios remotos a
-- la selección pública SIERRA. Los uploads privados continúan usando asset ID.
create or replace function public.signage_content_save(p_workspace uuid,p_content uuid,p_snapshot jsonb,p_expected_revision bigint)
returns jsonb language plpgsql security definer set search_path='' as $$
declare v_item public.signage_content_items; v_id uuid:=coalesce(p_content,gen_random_uuid()); v_revision bigint; v_title text; v_type text; v_asset uuid; v_asset_text text; v_media_url text;
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
  v_asset_text:=trim(coalesce(p_snapshot->>'mediaAssetId',''));
  v_media_url:=trim(coalesce(p_snapshot->>'mediaUrl',''));
  if v_asset_text<>'' then
   if v_media_url<>'' or v_asset_text !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' then
    raise exception 'Invalid media reference' using errcode='22023';
   end if;
   v_asset:=v_asset_text::uuid;
   if not exists(select 1 from public.signage_media_assets a where a.id=v_asset and a.workspace_id=p_workspace and a.state='ready'
    and ((v_type='image' and a.content_type like 'image/%') or (v_type='video' and a.content_type like 'video/%'))) then
    raise exception 'Media asset denied' using errcode='42501';
   end if;
  elsif not (
   (v_type='video' and v_media_url in (
    'https://cdn.prod.website-files.com/673e5aab9ab2686aa6660ed3%2F67448935dfb12aa5cb9c86e9_video-cortado-transcode.mp4',
    'https://cdn.prod.website-files.com/673e5aab9ab2686aa6660ed3%2F673f497adb654923cf8ff63e_homepage2%20%281%29-transcode.mp4'
   ))
   or (v_type='image' and v_media_url='https://cdn.prod.website-files.com/673e5aab9ab2686aa6660ed3/673f7b62650c2610524db19f_DSC09322-Enhanced-NR%20(1).jpg')
  ) then
   raise exception 'Media source denied' using errcode='42501';
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

create or replace function public.signage_workspace_snapshot(p_workspace uuid)
returns jsonb language plpgsql stable security definer set search_path='' as $$
begin
 if not public.signage_can(p_workspace,'read') then raise insufficient_privilege using message='Signage access denied'; end if;
 return jsonb_build_object(
  'workspace',(select to_jsonb(w) from public.signage_workspaces w where w.id=p_workspace),
  'sites',coalesce((select jsonb_agg(to_jsonb(s) order by s.name) from public.signage_sites s where s.workspace_id=p_workspace),'[]'::jsonb),
  'spaces',coalesce((select jsonb_agg(to_jsonb(s) order by s.sort_order,s.name) from public.signage_spaces s where s.workspace_id=p_workspace and s.state='active'),'[]'::jsonb),
  'devices',coalesce((select jsonb_agg(to_jsonb(d) order by d.name) from public.signage_devices d where d.workspace_id=p_workspace),'[]'::jsonb),
  'contents',coalesce((select jsonb_agg(to_jsonb(c) order by c.updated_at desc) from public.signage_content_items c where c.workspace_id=p_workspace),'[]'::jsonb),
  'playlists',coalesce((select jsonb_agg(to_jsonb(l) order by l.updated_at desc) from public.signage_playlists l where l.workspace_id=p_workspace),'[]'::jsonb),
  'schedules',coalesce((select jsonb_agg(to_jsonb(s) order by s.starts_at desc) from public.signage_schedules s where s.workspace_id=p_workspace),'[]'::jsonb),
  'publications',coalesce((select jsonb_agg(to_jsonb(p) order by p.published_at desc) from public.signage_publications p where p.workspace_id=p_workspace),'[]'::jsonb)
 );
end;
$$;

revoke all on function public.signage_space_save(uuid,uuid,uuid,text,timestamptz),
 public.signage_device_update(uuid,uuid,text,uuid,bigint) from public,anon,authenticated;
grant execute on function public.signage_space_save(uuid,uuid,uuid,text,timestamptz),
 public.signage_device_update(uuid,uuid,text,uuid,bigint) to authenticated;

insert into public.index_security_migrations(version) values(64) on conflict do nothing;
notify pgrst,'reload schema';
commit;
