-- SIERRA Pantallas: parada persistente y dirigida de un reproductor.
-- Aplicar después de update62.sql únicamente en el proyecto y ventana aprobados.
-- No revoca credenciales, no elimina contenido y no deshabilita horarios.
begin;

alter table public.signage_devices
  add column if not exists output_paused boolean not null default false;

create or replace function public.signage_stop_output(p_workspace uuid,p_device uuid,p_expected_device_revision bigint)
returns jsonb language plpgsql security definer set search_path='' as $$
declare v_device public.signage_devices; v_stopped integer:=0;
begin
 if not public.signage_can(p_workspace,'read') or not public.signage_can(p_workspace,'publish') then
  raise insufficient_privilege using message='Signage stop denied';
 end if;
 select * into v_device from public.signage_devices where id=p_device for update;
 if not found or v_device.workspace_id<>p_workspace then raise insufficient_privilege using message='Device access denied'; end if;
 if v_device.state<>'active' then raise exception 'Device is not active' using errcode='55000'; end if;
 if p_expected_device_revision is distinct from v_device.revision then raise exception 'Device changed; reload' using errcode='40001'; end if;

 update public.signage_live_sessions set state='stopped',stopped_at=coalesce(stopped_at,now())
  where device_id=p_device and workspace_id=p_workspace and state='active';
 get diagnostics v_stopped=row_count;

 if not v_device.output_paused then
  update public.signage_devices set output_paused=true,revision=revision+1,updated_at=now() where id=p_device;
  insert into public.signage_audit(workspace_id,actor_id,event_type,entity_type,entity_id,details)
   values(p_workspace,auth.uid(),'device.output_stopped','device',p_device,
    jsonb_build_object('active_publication_id',v_device.active_publication_id,'live_sessions_stopped',v_stopped));
  return jsonb_build_object('id',p_device,'output_paused',true,'revision',v_device.revision+1,'live_sessions_stopped',v_stopped);
 end if;
 return jsonb_build_object('id',p_device,'output_paused',true,'revision',v_device.revision,'live_sessions_stopped',v_stopped);
end;
$$;

create or replace function public.signage_publish(p_workspace uuid,p_device uuid,p_content uuid,p_expected_device_revision bigint)
returns jsonb language plpgsql security definer set search_path='' as $$
declare v_device public.signage_devices; v_content public.signage_content_items; v_snapshot jsonb; v_version bigint; v_publication uuid;
begin
 if not public.signage_can(p_workspace,'read') or not public.signage_can(p_workspace,'publish') then raise insufficient_privilege using message='Signage publish denied'; end if;
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
 update public.signage_devices set active_publication_id=v_publication,output_paused=false,revision=revision+1,updated_at=now() where id=p_device;
 insert into public.signage_audit(workspace_id,actor_id,event_type,entity_type,entity_id,details)
  values(p_workspace,auth.uid(),'device.published','device',p_device,jsonb_build_object('publication_id',v_publication,'version',v_version,'resumed',v_device.output_paused));
 return jsonb_build_object('publication_id',v_publication,'version',v_version,'device_revision',v_device.revision+1,'output_paused',false);
end;
$$;

create or replace function public.signage_rollback(p_workspace uuid,p_device uuid,p_target_publication uuid,p_expected_device_revision bigint)
returns jsonb language plpgsql security definer set search_path='' as $$
declare v_device public.signage_devices; v_target public.signage_publications; v_version bigint; v_publication uuid;
begin
 if not public.signage_can(p_workspace,'read') or not public.signage_can(p_workspace,'publish') then raise insufficient_privilege using message='Signage rollback denied'; end if;
 select * into v_device from public.signage_devices where id=p_device for update;
 if not found or v_device.workspace_id<>p_workspace then raise insufficient_privilege using message='Device access denied'; end if;
 if v_device.state<>'active' then raise exception 'Device is not active' using errcode='55000'; end if;
 if p_expected_device_revision is distinct from v_device.revision then raise exception 'Device changed; reload' using errcode='40001'; end if;
 select * into v_target from public.signage_publications where id=p_target_publication;
 if not found or v_target.workspace_id<>p_workspace or v_target.device_id<>p_device then raise insufficient_privilege using message='Rollback target denied'; end if;
 select coalesce(max(version),0)+1 into v_version from public.signage_publications where device_id=p_device;
 insert into public.signage_publications(workspace_id,device_id,version,content_id,content_revision,snapshot,kind,rollback_of,published_by)
  values(p_workspace,p_device,v_version,v_target.content_id,v_target.content_revision,v_target.snapshot,'rollback',v_target.id,auth.uid()) returning id into v_publication;
 update public.signage_devices set active_publication_id=v_publication,output_paused=false,revision=revision+1,updated_at=now() where id=p_device;
 insert into public.signage_audit(workspace_id,actor_id,event_type,entity_type,entity_id,details)
  values(p_workspace,auth.uid(),'device.rolled_back','device',p_device,jsonb_build_object('publication_id',v_publication,'rollback_of',v_target.id,'version',v_version,'resumed',v_device.output_paused));
 return jsonb_build_object('publication_id',v_publication,'version',v_version,'device_revision',v_device.revision+1,'rollback_of',v_target.id,'output_paused',false);
end;
$$;

create or replace function public.signage_device_manifest_service(p_device uuid,p_credential uuid)
returns jsonb language plpgsql stable security definer set search_path='' as $$
declare v_device public.signage_devices; v_credential public.signage_device_credentials; v_publication public.signage_publications; v_schedules jsonb;
begin
 select * into v_credential from public.signage_device_credentials where id=p_credential and device_id=p_device;
 select * into v_device from public.signage_devices where id=p_device;
 if not found or v_credential.id is null or v_credential.revoked_at is not null or v_device.state<>'active' or v_credential.workspace_id<>v_device.workspace_id then
  raise insufficient_privilege using message='Device credential denied';
 end if;
 if v_device.output_paused then
  return jsonb_build_object('schema_version',1,'device_id',p_device,'device_revision',v_device.revision,'state','stopped','output_paused',true,'schedules','[]'::jsonb);
 end if;
 select coalesce(jsonb_agg(jsonb_build_object('id',q.id,'starts_at',q.starts_at,'ends_at',q.ends_at,'priority',q.priority,'playlist_id',q.playlist_id,'playlist_revision',q.playlist_revision,'entries',q.entries) order by q.priority desc,q.starts_at desc,q.id asc),'[]'::jsonb) into v_schedules
 from (select s.id,s.starts_at,s.ends_at,s.priority,s.playlist_id,s.playlist_revision,v.entries from public.signage_schedules s join public.signage_playlist_versions v on v.playlist_id=s.playlist_id and v.revision=s.playlist_revision and v.workspace_id=s.workspace_id where s.device_id=p_device and s.enabled and s.ends_at>now() order by s.starts_at asc limit 100) q;
 if v_device.active_publication_id is null then return jsonb_build_object('schema_version',1,'device_id',p_device,'device_revision',v_device.revision,'state','no-content','output_paused',false,'schedules',v_schedules); end if;
 select * into v_publication from public.signage_publications where id=v_device.active_publication_id;
 return jsonb_build_object('schema_version',1,'device_id',p_device,'device_revision',v_device.revision,'state','ready','output_paused',false,
  'publication_id',v_publication.id,'publication_version',v_publication.version,'content_id',v_publication.content_id,'content_revision',v_publication.content_revision,'published_at',v_publication.published_at,'snapshot',v_publication.snapshot,'schedules',v_schedules);
end;
$$;

revoke all on function public.signage_stop_output(uuid,uuid,bigint) from public,anon,authenticated;
grant execute on function public.signage_stop_output(uuid,uuid,bigint) to authenticated;
revoke all on function public.signage_device_manifest_service(uuid,uuid) from public,anon,authenticated;
grant execute on function public.signage_device_manifest_service(uuid,uuid) to service_role;

insert into public.index_security_migrations(version) values(63) on conflict do nothing;
notify pgrst,'reload schema';
commit;
