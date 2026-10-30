-- Show the shared Communications library in the primary memo index.
-- Document bodies remain available only through communication_sync.
begin;

create or replace function public.communication_list()
returns jsonb language sql stable security definer set search_path='' as $$
 select case when not coalesce(public.index_account_active(),false) then '[]'::jsonb else
   coalesce(jsonb_agg(jsonb_build_object(
     'id',d.id,'source_id',d.source_id,'title',d.title,'kind',d.kind,
     'role',public.communication_role(d.id),'updated_at',d.updated_at,
     'owner_id',d.owner_id,'owner_name',owner.full_name,
     'presence',coalesce((
       select jsonb_agg(jsonb_build_object(
         'user_id',p.user_id,'name',active_profile.full_name,'session_id',p.session_id,
         'awareness',p.awareness,'seen_at',p.seen_at
       ) order by p.seen_at desc)
       from public.communication_presence p
       join public.profiles active_profile on active_profile.id=p.user_id
       where p.document_id=d.id
         and p.seen_at>=now()-interval '15 seconds'
         and active_profile.account_status='active'
     ),'[]'::jsonb)
   ) order by d.updated_at desc),'[]'::jsonb) end
 from public.communication_documents d
 left join public.profiles owner on owner.id=d.owner_id
$$;

revoke all on function public.communication_list() from public,anon;
grant execute on function public.communication_list() to authenticated;

insert into public.index_security_migrations(version) values(67) on conflict do nothing;
notify pgrst,'reload schema';
commit;
