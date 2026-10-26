-- Global Communications activity for the library. Apply after update56.sql.
-- Only current presence (15 seconds) is returned; document content remains behind communication_sync.
begin;

create or replace function public.communication_list()
returns jsonb language sql stable security definer set search_path='' as $$
 select case when not coalesce(public.index_account_active(),false) then '[]'::jsonb else
   coalesce(jsonb_agg(jsonb_build_object(
     'id',d.id,'title',d.title,'kind',d.kind,'role',public.communication_role(d.id),
     'updated_at',d.updated_at,'owner_id',d.owner_id,
     'presence',coalesce((
       select jsonb_agg(jsonb_build_object(
         'user_id',p.user_id,'name',a.full_name,'session_id',p.session_id,
         'awareness',p.awareness,'seen_at',p.seen_at
       ) order by p.seen_at desc)
       from public.communication_presence p
       join public.profiles a on a.id=p.user_id
       where p.document_id=d.id
         and p.seen_at>=now()-interval '15 seconds'
         and a.account_status='active'
     ),'[]'::jsonb)
   ) order by d.updated_at desc),'[]'::jsonb) end
 from public.communication_documents d
$$;

revoke all on function public.communication_list() from public,anon;
grant execute on function public.communication_list() to authenticated;

insert into public.index_security_migrations(version) values(57) on conflict do nothing;
notify pgrst,'reload schema';
commit;
