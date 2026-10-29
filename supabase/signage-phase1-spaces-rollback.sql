-- Rollback conservador para update64.sql. Requiere ventana aprobada.
-- No borra espacios ni asignaciones: deshabilita la API nueva y deja objetos inertes.
begin;
revoke execute on function public.signage_space_save(uuid,uuid,uuid,text,timestamptz),
 public.signage_device_update(uuid,uuid,text,uuid,bigint) from authenticated;
notify pgrst,'reload schema';
commit;
