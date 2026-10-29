-- ROLLBACK OPERATIVO PREPARADO; NO EJECUTAR SIN APROBACIÓN ESPECÍFICA.
-- Detiene Pantallas sin borrar tablas, auditoría, publicaciones ni objetos Storage.
begin;
revoke execute on function public.set_signage_access(uuid,uuid,text[]),public.signage_workspace_snapshot(uuid),
 public.signage_content_save(uuid,uuid,jsonb,bigint),public.signage_content_approve(uuid,uuid,bigint),
 public.signage_publish(uuid,uuid,uuid,bigint),public.signage_playlist_save(uuid,uuid,text,jsonb,bigint),
 public.signage_schedule_save(uuid,uuid,uuid,uuid,timestamptz,timestamptz,integer,bigint),
 public.signage_rollback(uuid,uuid,uuid,bigint),public.signage_device_revoke(uuid,uuid,text) from authenticated;
update public.signage_device_credentials set revoked_at=coalesce(revoked_at,now()),revoke_reason=coalesce(revoke_reason,'Rollback operativo de Pantallas') where revoked_at is null;
update public.signage_devices set state='revoked',revision=revision+1,updated_at=now() where state='active';
update public.signage_live_sessions set state='stopped',stopped_at=coalesce(stopped_at,now()) where state='active';
insert into public.signage_audit(workspace_id,event_type,entity_type,details)
 select id,'system.disabled','workspace',jsonb_build_object('mode','safe-disable') from public.signage_workspaces;
notify pgrst,'reload schema';
commit;
