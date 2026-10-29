-- Pantallas premium: prepared experiences and temporary sessions.
-- Sessions overlay the existing publication/schedule and never replace it.
begin;

do $$ begin
 if to_regclass('public.signage_workspaces') is null or to_regclass('public.signage_devices') is null then
  raise exception 'Pantallas base schema is required';
 end if;
 if exists(select 1 from public.index_security_migrations where version=65) then
  raise exception 'Migration 65 is already recorded';
 end if;
end $$;

create table public.signage_experiences(
 id uuid primary key default gen_random_uuid(),
 workspace_id uuid not null references public.signage_workspaces(id) on delete cascade,
 kind text not null check(kind in ('welcome')),
 name text not null check(length(trim(name)) between 2 and 100),
 snapshot jsonb not null,
 state text not null default 'prepared' check(state in ('prepared','archived')),
 created_by uuid not null,
 updated_by uuid not null,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 unique(id,workspace_id)
);

create table public.signage_experience_sessions(
 id uuid primary key default gen_random_uuid(),
 workspace_id uuid not null references public.signage_workspaces(id) on delete cascade,
 experience_id uuid not null,
 state text not null default 'active' check(state in ('active','ended')),
 starts_at timestamptz not null default now(),
 expires_at timestamptz not null,
 ended_at timestamptz,
 created_by uuid not null,
 ended_by uuid,
 created_at timestamptz not null default now(),
 foreign key(experience_id,workspace_id) references public.signage_experiences(id,workspace_id)
);

create table public.signage_experience_destinations(
 session_id uuid not null references public.signage_experience_sessions(id) on delete cascade,
 workspace_id uuid not null references public.signage_workspaces(id) on delete cascade,
 device_id uuid not null,
 accepted_at timestamptz not null default now(),
 primary key(session_id,device_id),
 foreign key(device_id,workspace_id) references public.signage_devices(id,workspace_id) on delete cascade
);

create index signage_experiences_workspace_idx on public.signage_experiences(workspace_id,updated_at desc);
create index signage_experience_sessions_workspace_idx on public.signage_experience_sessions(workspace_id,state,expires_at desc);
create index signage_experience_destinations_device_idx on public.signage_experience_destinations(device_id,session_id);

alter table public.signage_experiences enable row level security;
alter table public.signage_experience_sessions enable row level security;
alter table public.signage_experience_destinations enable row level security;
create policy signage_experience_read on public.signage_experiences for select to authenticated using(public.signage_can(workspace_id,'read'));
create policy signage_experience_session_read on public.signage_experience_sessions for select to authenticated using(public.signage_can(workspace_id,'read'));
create policy signage_experience_destination_read on public.signage_experience_destinations for select to authenticated using(public.signage_can(workspace_id,'read'));
revoke all on public.signage_experiences,public.signage_experience_sessions,public.signage_experience_destinations from public,anon,authenticated;
grant select on public.signage_experiences,public.signage_experience_sessions,public.signage_experience_destinations to authenticated;
grant all on public.signage_experiences,public.signage_experience_sessions,public.signage_experience_destinations to service_role;

create or replace function public.signage_experience_save(p_workspace uuid,p_experience uuid,p_name text,p_snapshot jsonb,p_expected_updated_at timestamptz)
returns jsonb language plpgsql security definer set search_path='' as $$
declare v_row public.signage_experiences; v_id uuid:=coalesce(p_experience,gen_random_uuid()); v_name text:=trim(coalesce(p_name,'')); v_display text; v_subtitle text; v_template text;
begin
 if not public.signage_can(p_workspace,'read') or not public.signage_can(p_workspace,'write') then raise insufficient_privilege using message='Signage experience write denied'; end if;
 v_display:=trim(coalesce(p_snapshot->>'displayName','')); v_subtitle:=trim(coalesce(p_snapshot->>'subtitle','')); v_template:=coalesce(p_snapshot->>'template','essential');
 if length(v_name) not between 2 and 100 or length(v_display) not between 1 and 60 or length(v_subtitle)>90 or v_template not in ('essential','event') then raise exception 'Invalid welcome experience'; end if;
 if (p_snapshot-'displayName'-'subtitle'-'template') <> '{}'::jsonb then raise exception 'Unsupported welcome fields'; end if;
 select * into v_row from public.signage_experiences where id=v_id for update;
 if found then
  if v_row.workspace_id<>p_workspace or (p_expected_updated_at is not null and v_row.updated_at<>p_expected_updated_at) then raise exception 'Experience changed'; end if;
  update public.signage_experiences set name=v_name,snapshot=jsonb_build_object('template',v_template,'displayName',v_display,'subtitle',v_subtitle),updated_by=auth.uid(),updated_at=now() where id=v_id returning * into v_row;
 else
  insert into public.signage_experiences(id,workspace_id,kind,name,snapshot,created_by,updated_by) values(v_id,p_workspace,'welcome',v_name,jsonb_build_object('template',v_template,'displayName',v_display,'subtitle',v_subtitle),auth.uid(),auth.uid()) returning * into v_row;
 end if;
 insert into public.signage_audit(workspace_id,actor_id,event_type,entity_type,entity_id,details) values(p_workspace,auth.uid(),'experience.saved','experience',v_row.id,jsonb_build_object('kind','welcome'));
 return to_jsonb(v_row);
end; $$;

create or replace function public.signage_experience_start(p_workspace uuid,p_experience uuid,p_devices uuid[],p_duration_minutes integer)
returns jsonb language plpgsql security definer set search_path='' as $$
declare v_experience public.signage_experiences; v_session public.signage_experience_sessions; v_count integer; v_unique integer;
begin
 if not public.signage_can(p_workspace,'read') or not public.signage_can(p_workspace,'publish') then raise insufficient_privilege using message='Signage experience publish denied'; end if;
 if p_duration_minutes not between 1 and 480 or coalesce(array_length(p_devices,1),0) not between 1 and 20 then raise exception 'Invalid experience duration or destinations'; end if;
 select count(*),count(distinct value) into v_count,v_unique from unnest(p_devices) value;
 if v_count<>v_unique then raise exception 'Duplicate experience destination'; end if;
 select * into v_experience from public.signage_experiences where id=p_experience and workspace_id=p_workspace and state='prepared';
 if not found then raise exception 'Experience not available'; end if;
 perform 1 from public.signage_devices d where d.workspace_id=p_workspace and d.id=any(p_devices) order by d.id for update;
 if (select count(*) from public.signage_devices d where d.workspace_id=p_workspace and d.state='active' and d.id=any(p_devices))<>v_count then raise exception 'Experience destination denied'; end if;
 if exists(select 1 from public.signage_experience_sessions s join public.signage_experience_destinations d on d.session_id=s.id where s.workspace_id=p_workspace and s.state='active' and s.expires_at>now() and d.device_id=any(p_devices)) then raise exception 'A destination already has an active experience'; end if;
 insert into public.signage_experience_sessions(workspace_id,experience_id,expires_at,created_by) values(p_workspace,p_experience,now()+make_interval(mins=>p_duration_minutes),auth.uid()) returning * into v_session;
 insert into public.signage_experience_destinations(session_id,workspace_id,device_id) select v_session.id,p_workspace,value from unnest(p_devices) value;
 update public.signage_devices set revision=revision+1,updated_at=now() where workspace_id=p_workspace and id=any(p_devices);
 insert into public.signage_audit(workspace_id,actor_id,event_type,entity_type,entity_id,details) values(p_workspace,auth.uid(),'experience.started','experience_session',v_session.id,jsonb_build_object('experience_id',p_experience,'destination_count',v_count,'expires_at',v_session.expires_at));
 return jsonb_build_object('session',to_jsonb(v_session),'destinations',p_devices);
end; $$;

create or replace function public.signage_experience_finish(p_workspace uuid,p_session uuid)
returns jsonb language plpgsql security definer set search_path='' as $$
declare v_session public.signage_experience_sessions; v_devices uuid[];
begin
 if not public.signage_can(p_workspace,'read') or not public.signage_can(p_workspace,'publish') then raise insufficient_privilege using message='Signage experience publish denied'; end if;
 select * into v_session from public.signage_experience_sessions where id=p_session for update;
 if not found or v_session.workspace_id<>p_workspace then raise exception 'Experience session not found'; end if;
 select array_agg(device_id) into v_devices from public.signage_experience_destinations where session_id=p_session;
 if v_session.state='active' then
  update public.signage_experience_sessions set state='ended',ended_at=now(),ended_by=auth.uid() where id=p_session returning * into v_session;
  update public.signage_devices set revision=revision+1,updated_at=now() where workspace_id=p_workspace and id=any(v_devices);
  insert into public.signage_audit(workspace_id,actor_id,event_type,entity_type,entity_id,details) values(p_workspace,auth.uid(),'experience.ended','experience_session',p_session,jsonb_build_object('destination_count',coalesce(array_length(v_devices,1),0)));
 end if;
 return jsonb_build_object('session',to_jsonb(v_session),'destinations',coalesce(v_devices,'{}'::uuid[]));
end; $$;

create or replace function public.signage_device_manifest_service(p_device uuid,p_credential uuid)
returns jsonb language plpgsql stable security definer set search_path='' as $$
declare v_device public.signage_devices; v_credential public.signage_device_credentials; v_publication public.signage_publications; v_schedules jsonb; v_session public.signage_experience_sessions; v_experience public.signage_experiences;
begin
 select * into v_credential from public.signage_device_credentials where id=p_credential and device_id=p_device;
 select * into v_device from public.signage_devices where id=p_device;
 if not found or v_credential.id is null or v_credential.revoked_at is not null or v_device.state<>'active' or v_credential.workspace_id<>v_device.workspace_id then raise insufficient_privilege using message='Device credential denied'; end if;
 select s.* into v_session from public.signage_experience_sessions s join public.signage_experience_destinations d on d.session_id=s.id and d.device_id=p_device where s.workspace_id=v_device.workspace_id and s.state='active' and s.starts_at<=now() and s.expires_at>now() order by s.starts_at desc,s.id desc limit 1;
 if found then
  select * into v_experience from public.signage_experiences where id=v_session.experience_id;
  return jsonb_build_object('schema_version',1,'device_id',p_device,'device_revision',v_device.revision,'state','experience','output_paused',v_device.output_paused,'experience_session_id',v_session.id,'experience_expires_at',v_session.expires_at,'experience_snapshot',v_experience.snapshot||jsonb_build_object('type','welcome','title',v_experience.name));
 end if;
 if v_device.output_paused then return jsonb_build_object('schema_version',1,'device_id',p_device,'device_revision',v_device.revision,'state','stopped','output_paused',true,'schedules','[]'::jsonb); end if;
 select coalesce(jsonb_agg(jsonb_build_object('id',q.id,'starts_at',q.starts_at,'ends_at',q.ends_at,'priority',q.priority,'playlist_id',q.playlist_id,'playlist_revision',q.playlist_revision,'entries',q.entries) order by q.priority desc,q.starts_at desc,q.id asc),'[]'::jsonb) into v_schedules from (select s.id,s.starts_at,s.ends_at,s.priority,s.playlist_id,s.playlist_revision,v.entries from public.signage_schedules s join public.signage_playlist_versions v on v.playlist_id=s.playlist_id and v.revision=s.playlist_revision and v.workspace_id=s.workspace_id where s.device_id=p_device and s.enabled and s.ends_at>now() order by s.starts_at asc limit 100) q;
 if v_device.active_publication_id is null then return jsonb_build_object('schema_version',1,'device_id',p_device,'device_revision',v_device.revision,'state','no-content','output_paused',false,'schedules',v_schedules); end if;
 select * into v_publication from public.signage_publications where id=v_device.active_publication_id;
 return jsonb_build_object('schema_version',1,'device_id',p_device,'device_revision',v_device.revision,'state','ready','output_paused',false,'publication_id',v_publication.id,'publication_version',v_publication.version,'content_id',v_publication.content_id,'content_revision',v_publication.content_revision,'published_at',v_publication.published_at,'snapshot',v_publication.snapshot,'schedules',v_schedules);
end; $$;

revoke all on function public.signage_experience_save(uuid,uuid,text,jsonb,timestamptz),public.signage_experience_start(uuid,uuid,uuid[],integer),public.signage_experience_finish(uuid,uuid) from public,anon,authenticated;
grant execute on function public.signage_experience_save(uuid,uuid,text,jsonb,timestamptz),public.signage_experience_start(uuid,uuid,uuid[],integer),public.signage_experience_finish(uuid,uuid) to authenticated;
revoke all on function public.signage_device_manifest_service(uuid,uuid) from public,anon,authenticated;
grant execute on function public.signage_device_manifest_service(uuid,uuid) to service_role;

insert into public.index_security_migrations(version) values(65);
notify pgrst,'reload schema';
commit;
