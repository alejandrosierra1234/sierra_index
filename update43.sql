-- Independent Communications permissions. Apply after 40 and again after 41
-- if collaboration is installed later. No automatic grants or document deletion.
begin;
alter table public.capability_grants drop constraint if exists capability_grants_domain_check;
alter table public.capability_grants add constraint capability_grants_domain_check check(domain in
 ('fiber','yarn','fabric','chemicals','garment','warehouse','warehouse_fiber','warehouse_yarn',
  'warehouse_fabric','warehouse_chemicals','warehouse_garment','customer_service','talento_humano','communications','platform'));

create or replace function public.set_index_access(p_user uuid,p_domain text,p_caps text[])
returns void language plpgsql security definer set search_path=public,pg_temp as $$
begin
  if not public.authorize('platform','admin') then raise exception 'not authorized'; end if;
  if p_user=auth.uid() then raise exception 'Use another administrator to change your access'; end if;
  if not exists(select 1 from profiles where id=p_user) then raise exception 'Unknown account'; end if;
  if p_domain is null or p_domain not in ('fiber','yarn','fabric','chemicals','garment','warehouse',
    'warehouse_fiber','warehouse_yarn','warehouse_fabric','warehouse_chemicals','warehouse_garment',
    'customer_service','talento_humano','communications','platform') then raise exception 'Invalid domain'; end if;
  if p_caps is null or not p_caps <@ array['read','write','delete','publish','dispatch','manage_status','grant','admin']::text[]
    or ('admin'=any(p_caps) and p_domain<>'platform') then raise exception 'Invalid capabilities'; end if;
  if p_domain='communications' and (not p_caps <@ array['read','write']::text[]
    or ('write'=any(p_caps) and not 'read'=any(p_caps))) then raise exception 'Invalid Communications access'; end if;
  perform pg_advisory_xact_lock(hashtext('index-access:'||p_user::text));
  delete from capability_grants where user_id=p_user and domain=p_domain and resource_id is null;
  insert into capability_grants(user_id,domain,capability,granted_by)
    select p_user,p_domain,c,auth.uid() from (select distinct unnest(p_caps) c) q;
end;
$$;
revoke all on function public.set_index_access(uuid,text,text[]) from public,anon;
grant execute on function public.set_index_access(uuid,text,text[]) to authenticated;

-- Install the same guard for current and future collaboration RPCs. PostgREST
-- runs this before SECURITY DEFINER calls, which otherwise bypass table RLS.
create or replace function public.index_check_request()
returns void language plpgsql security definer set search_path=public,pg_temp as $$
declare v_path text:=current_setting('request.path',true);
begin
 if auth.role()='service_role' then return; end if;
 if auth.role()='anon' and v_path in ('/rpc/get_sample_public_card','/rpc/request_sample_public_card') then return; end if;
 if not public.index_account_active() then raise insufficient_privilege using message='Account inactive or unauthenticated'; end if;
 if v_path like '/rpc/communication\_%' escape '\' then
   if not public.authorize('communications','read') then raise insufficient_privilege using message='Communications access denied'; end if;
   if v_path in ('/rpc/communication_create','/rpc/communication_share','/rpc/communication_checkpoint')
     and not public.authorize('communications','write') then
     raise insufficient_privilege using message='Communications is read only'; end if;
 end if;
end;
$$;

-- Enforce module access inside each document RPC as well, including sync writes.
do $migration$
begin
 if to_regclass('public.communication_documents') is not null then
 execute $ddl$
create or replace function public.communication_role(p_id uuid)
returns text language sql stable security definer set search_path='' as $body$
 select case when not public.authorize('communications','write') then 'viewer'
   when d.owner_id=auth.uid() then 'owner' else m.role end
 from public.communication_documents d
 left join public.communication_members m on m.document_id=d.id and m.user_id=auth.uid()
 where d.id=p_id and public.authorize('communications','read')
   and (d.owner_id=auth.uid() or m.user_id is not null)
$body$;
 $ddl$;
 execute $ddl$
create or replace function public.communication_create(p_source text,p_title text,p_kind text,p_snapshot text)
returns uuid language plpgsql security definer set search_path='' as $body$
declare v_id uuid;
begin
 if not public.authorize('communications','read') or not public.authorize('communications','write') then
   raise insufficient_privilege using message='Communications editing access required'; end if;
 insert into public.communication_documents(owner_id,source_id,title,kind,snapshot)
 values(auth.uid(),p_source,p_title,p_kind,decode(p_snapshot,'base64'))
 on conflict(owner_id,source_id) do nothing returning id into v_id;
 if v_id is null then select id into v_id from public.communication_documents where owner_id=auth.uid() and source_id=p_source; end if;
 return v_id;
end $body$;
 $ddl$;
 execute $ddl$
create or replace function public.communication_list()
returns jsonb language sql stable security definer set search_path='' as $body$
 select coalesce(jsonb_agg(jsonb_build_object('id',d.id,'title',d.title,'kind',d.kind,
   'role',public.communication_role(d.id),'updated_at',d.updated_at) order by d.updated_at desc),'[]'::jsonb)
 from public.communication_documents d where public.communication_role(d.id) is not null
$body$;
 $ddl$;
 execute $ddl$
create or replace function public.communication_share(p_id uuid,p_email text,p_role text)
returns void language plpgsql security definer set search_path='' as $body$
declare v_target uuid; v_owner uuid;
begin
 select owner_id into v_owner from public.communication_documents where id=p_id for update;
 if v_owner is distinct from auth.uid() or coalesce(public.communication_role(p_id),'')<>'owner' then
   raise insufficient_privilege using message='Access denied'; end if;
 if p_role is not null and p_role not in ('viewer','editor') then raise exception 'Invalid role'; end if;
 select id into v_target from public.profiles where lower(email)=lower(trim(p_email)) and (p_role is null or account_status='active');
 if v_target is null then raise exception 'No active account with that email'; end if;
 if v_target=v_owner then raise exception 'Owner access cannot be changed'; end if;
 if p_role is not null and not exists(select 1 from public.capability_grants g where g.user_id=v_target
   and g.resource_id is null and (g.expires_at is null or g.expires_at>now())
   and ((g.domain='platform' and g.capability='admin') or (g.domain='communications' and g.capability='read'))) then
   raise exception 'The recipient needs Communications access from an Index administrator'; end if;
 if p_role is null then delete from public.communication_members where document_id=p_id and user_id=v_target;
 else insert into public.communication_members(document_id,user_id,role,granted_by)
   values(p_id,v_target,p_role,auth.uid()) on conflict(document_id,user_id) do update set role=excluded.role,granted_by=excluded.granted_by; end if;
 delete from public.communication_presence where document_id=p_id and user_id=v_target;
 insert into public.communication_access_audit(document_id,actor_id,user_id,role) values(p_id,auth.uid(),v_target,p_role);
end $body$;
 $ddl$;
 end if;
end $migration$;

insert into public.index_security_migrations(version) values(43) on conflict do nothing;
notify pgrst,'reload schema';
commit;
