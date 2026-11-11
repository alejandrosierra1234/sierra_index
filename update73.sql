-- Keep the shared Communications history ordered after archive, restore and
-- trash actions. Apply after update72.sql.
begin;

create or replace function public.communication_catalog(
  p_id uuid,p_title text,p_kind text,p_metadata jsonb default '{}'::jsonb
)
returns boolean language plpgsql security definer set search_path='' as $$
begin
 if coalesce(public.communication_role(p_id),'') not in ('owner','editor') then
   raise insufficient_privilege using message='Communications is read only';
 end if;
 if p_kind not in ('memo','circular','aviso','convocatoria','infographic','orgchart') then
   raise exception 'Invalid communication kind';
 end if;
 if jsonb_typeof(coalesce(p_metadata,'{}'::jsonb))<>'object'
   or octet_length(coalesce(p_metadata,'{}'::jsonb)::text)>65536 then
   raise exception 'Invalid communication metadata';
 end if;
 update public.communication_documents set
   title=left(coalesce(nullif(trim(p_title),''),title),500),
   kind=p_kind,metadata=coalesce(p_metadata,'{}'::jsonb),updated_at=now()
 where id=p_id;
 return found;
end $$;

revoke all on function public.communication_catalog(uuid,text,text,jsonb) from public,anon;
grant execute on function public.communication_catalog(uuid,text,text,jsonb) to authenticated;

insert into public.index_security_migrations(version) values(73) on conflict do nothing;
notify pgrst,'reload schema';
commit;
