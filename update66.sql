-- Pantallas premium: presentaciones PDF procesadas localmente y control de diapositivas.
-- El PDF original nunca se almacena. Cada diapositiva debe ser un PNG verificado del bucket privado existente.
-- Preparada para revisión; NO aplicar sin autorización específica.
begin;

do $$ begin
 if to_regclass('public.signage_experiences') is null or to_regclass('public.signage_media_assets') is null then
  raise exception 'Pantallas premium schema 65 and media schema 60 are required';
 end if;
 if not exists(select 1 from public.index_security_migrations where version=65) then
  raise exception 'Migration 65 must be recorded first';
 end if;
 if exists(select 1 from public.index_security_migrations where version=66) then
  raise exception 'Migration 66 is already recorded';
 end if;
end $$;

alter table public.signage_experiences drop constraint if exists signage_experiences_kind_check;
alter table public.signage_experiences add constraint signage_experiences_kind_check check(kind in ('welcome','presentation'));
alter table public.signage_experience_sessions
 add column current_slide integer not null default 0 check(current_slide between 0 and 49),
 add column control_revision bigint not null default 0 check(control_revision>=0);

create or replace function public.signage_presentation_save(
 p_workspace uuid,p_experience uuid,p_name text,p_slides jsonb,p_expected_updated_at timestamptz)
returns jsonb language plpgsql security definer set search_path='' as $$
declare
 v_row public.signage_experiences; v_id uuid:=coalesce(p_experience,gen_random_uuid());
 v_name text:=trim(coalesce(p_name,'')); v_slide jsonb; v_asset uuid; v_count integer; v_ordinal bigint;
begin
 if not public.signage_can(p_workspace,'read') or not public.signage_can(p_workspace,'write') then
  raise insufficient_privilege using message='Signage presentation write denied';
 end if;
 if jsonb_typeof(p_slides)<>'array' then raise exception 'Invalid presentation slides' using errcode='22023'; end if;
 v_count:=jsonb_array_length(p_slides);
 if length(v_name) not between 2 and 100 or v_count not between 1 and 50 or pg_column_size(p_slides)>262144 then
  raise exception 'Invalid presentation' using errcode='22023';
 end if;
 for v_slide,v_ordinal in select value,ordinality from jsonb_array_elements(p_slides) with ordinality loop
  if jsonb_typeof(v_slide)<>'object' or (v_slide-'mediaAssetId'-'alt'-'width'-'height'-'index')<>'{}'::jsonb
    or coalesce(v_slide->>'mediaAssetId','') !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
    or length(trim(coalesce(v_slide->>'alt',''))) not between 1 and 180
    or coalesce(v_slide->>'width','') !~ '^[0-9]{1,4}$' or coalesce(v_slide->>'height','') !~ '^[0-9]{1,4}$' or coalesce(v_slide->>'index','') !~ '^[0-9]{1,2}$'
    or coalesce((v_slide->>'width')::integer,0) not between 1 and 1920
    or coalesce((v_slide->>'height')::integer,0) not between 1 and 1920
    or (v_slide->>'index')::integer<>v_ordinal-1 then
   raise exception 'Invalid presentation slide' using errcode='22023';
  end if;
  v_asset:=(v_slide->>'mediaAssetId')::uuid;
  if not exists(select 1 from public.signage_media_assets a where a.id=v_asset and a.workspace_id=p_workspace and a.state='ready' and a.content_type='image/png') then
   raise insufficient_privilege using message='Presentation slide asset denied';
  end if;
 end loop;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('signage-experience:'||v_id::text,0));
 select * into v_row from public.signage_experiences where id=v_id for update;
 if found then
  if v_row.workspace_id<>p_workspace or v_row.kind<>'presentation' then raise insufficient_privilege using message='Presentation scope denied'; end if;
  if p_expected_updated_at is null or v_row.updated_at<>p_expected_updated_at then raise exception 'Experience changed' using errcode='40001'; end if;
  update public.signage_experiences set name=v_name,snapshot=jsonb_build_object('slides',p_slides,'pageCount',v_count),updated_by=auth.uid(),updated_at=now() where id=v_id returning * into v_row;
 else
  insert into public.signage_experiences(id,workspace_id,kind,name,snapshot,created_by,updated_by)
   values(v_id,p_workspace,'presentation',v_name,jsonb_build_object('slides',p_slides,'pageCount',v_count),auth.uid(),auth.uid()) returning * into v_row;
 end if;
 insert into public.signage_audit(workspace_id,actor_id,event_type,entity_type,entity_id,details)
  values(p_workspace,auth.uid(),'presentation.saved','experience',v_row.id,jsonb_build_object('slide_count',v_count));
 return to_jsonb(v_row);
end; $$;

create or replace function public.signage_experience_step(
 p_workspace uuid,p_session uuid,p_target_slide integer,p_expected_control_revision bigint)
returns jsonb language plpgsql security definer set search_path='' as $$
declare
 v_session public.signage_experience_sessions; v_experience public.signage_experiences;
 v_devices uuid[]; v_count integer;
begin
 if not public.signage_can(p_workspace,'read') or not public.signage_can(p_workspace,'publish') then
  raise insufficient_privilege using message='Signage presentation control denied';
 end if;
 select * into v_session from public.signage_experience_sessions where id=p_session for update;
 if not found or v_session.workspace_id<>p_workspace or v_session.state<>'active' or v_session.expires_at<=now() then
  raise exception 'Presentation session not active' using errcode='55000';
 end if;
 select * into v_experience from public.signage_experiences where id=v_session.experience_id and workspace_id=p_workspace;
 if not found or v_experience.kind<>'presentation' then raise exception 'Presentation session required' using errcode='22023'; end if;
 v_count:=jsonb_array_length(v_experience.snapshot->'slides');
 if p_target_slide<0 or p_target_slide>=v_count then raise exception 'Slide outside presentation' using errcode='22023'; end if;
 if p_expected_control_revision is null or p_expected_control_revision<>v_session.control_revision then
  raise exception 'Presentation changed; reload' using errcode='40001';
 end if;
 update public.signage_experience_sessions set current_slide=p_target_slide,control_revision=control_revision+1
  where id=p_session returning * into v_session;
 select coalesce(array_agg(device_id order by device_id),'{}'::uuid[]) into v_devices from public.signage_experience_destinations where session_id=p_session;
 update public.signage_devices set revision=revision+1,updated_at=now() where workspace_id=p_workspace and id=any(v_devices);
 insert into public.signage_audit(workspace_id,actor_id,event_type,entity_type,entity_id,details)
  values(p_workspace,auth.uid(),'presentation.slide_changed','experience_session',p_session,jsonb_build_object('slide',p_target_slide,'control_revision',v_session.control_revision));
 return jsonb_build_object('session',to_jsonb(v_session),'destinations',v_devices,'slide_count',v_count);
end; $$;

create or replace function public.signage_device_manifest_service(p_device uuid,p_credential uuid)
returns jsonb language plpgsql stable security definer set search_path='' as $$
declare v_device public.signage_devices; v_credential public.signage_device_credentials; v_publication public.signage_publications; v_schedules jsonb; v_session public.signage_experience_sessions; v_experience public.signage_experiences; v_experience_snapshot jsonb;
begin
 select * into v_credential from public.signage_device_credentials where id=p_credential and device_id=p_device;
 select * into v_device from public.signage_devices where id=p_device;
 if not found or v_credential.id is null or v_credential.revoked_at is not null or v_device.state<>'active' or v_credential.workspace_id<>v_device.workspace_id then raise insufficient_privilege using message='Device credential denied'; end if;
 select s.* into v_session from public.signage_experience_sessions s join public.signage_experience_destinations d on d.session_id=s.id and d.device_id=p_device where s.workspace_id=v_device.workspace_id and s.state='active' and s.starts_at<=now() and s.expires_at>now() order by s.starts_at desc,s.id desc limit 1;
 if found then
  select * into v_experience from public.signage_experiences where id=v_session.experience_id;
  if v_experience.kind='presentation' then
   v_experience_snapshot:=jsonb_build_object('type','presentation','title',v_experience.name,'slideIndex',v_session.current_slide,'slideCount',jsonb_array_length(v_experience.snapshot->'slides'),'controlRevision',v_session.control_revision,'slide',v_experience.snapshot->'slides'->v_session.current_slide);
  else
   v_experience_snapshot:=v_experience.snapshot||jsonb_build_object('type','welcome','title',v_experience.name);
  end if;
  return jsonb_build_object('schema_version',1,'device_id',p_device,'device_revision',v_device.revision,'state','experience','output_paused',v_device.output_paused,'experience_session_id',v_session.id,'experience_expires_at',v_session.expires_at,'experience_snapshot',v_experience_snapshot);
 end if;
 if v_device.output_paused then return jsonb_build_object('schema_version',1,'device_id',p_device,'device_revision',v_device.revision,'state','stopped','output_paused',true,'schedules','[]'::jsonb); end if;
 select coalesce(jsonb_agg(jsonb_build_object('id',q.id,'starts_at',q.starts_at,'ends_at',q.ends_at,'priority',q.priority,'playlist_id',q.playlist_id,'playlist_revision',q.playlist_revision,'entries',q.entries) order by q.priority desc,q.starts_at desc,q.id asc),'[]'::jsonb) into v_schedules from (select s.id,s.starts_at,s.ends_at,s.priority,s.playlist_id,s.playlist_revision,v.entries from public.signage_schedules s join public.signage_playlist_versions v on v.playlist_id=s.playlist_id and v.revision=s.playlist_revision and v.workspace_id=s.workspace_id where s.device_id=p_device and s.enabled and s.ends_at>now() order by s.starts_at asc limit 100) q;
 if v_device.active_publication_id is null then return jsonb_build_object('schema_version',1,'device_id',p_device,'device_revision',v_device.revision,'state','no-content','output_paused',false,'schedules',v_schedules); end if;
 select * into v_publication from public.signage_publications where id=v_device.active_publication_id;
 return jsonb_build_object('schema_version',1,'device_id',p_device,'device_revision',v_device.revision,'state','ready','output_paused',false,'publication_id',v_publication.id,'publication_version',v_publication.version,'content_id',v_publication.content_id,'content_revision',v_publication.content_revision,'published_at',v_publication.published_at,'snapshot',v_publication.snapshot,'schedules',v_schedules);
end; $$;

revoke all on function public.signage_presentation_save(uuid,uuid,text,jsonb,timestamptz),public.signage_experience_step(uuid,uuid,integer,bigint) from public,anon,authenticated;
grant execute on function public.signage_presentation_save(uuid,uuid,text,jsonb,timestamptz),public.signage_experience_step(uuid,uuid,integer,bigint) to authenticated;
revoke all on function public.signage_device_manifest_service(uuid,uuid) from public,anon,authenticated;
grant execute on function public.signage_device_manifest_service(uuid,uuid) to service_role;

insert into public.index_security_migrations(version) values(66);
notify pgrst,'reload schema';
commit;
