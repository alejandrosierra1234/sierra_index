-- Account removal keeps historical authorship; Auth credentials are removed separately.
begin;
alter table public.profiles add column if not exists access_deleted_at timestamptz;
alter table public.profiles drop constraint if exists profiles_removed_access_check;
alter table public.profiles add constraint profiles_removed_access_check check(access_deleted_at is null or account_status='disabled');
create or replace function public.prepare_index_account_removal(p_user uuid,p_email text)
returns void language plpgsql security definer set search_path=public,pg_temp as $$
begin
 if not public.authorize('platform','admin') or p_user=auth.uid() then
  raise exception 'Otro administrador debe gestionar esta cuenta.';
 end if;
 perform pg_advisory_xact_lock(hashtext('index-access:'||p_user::text));
 perform 1 from profiles where id=p_user for update;
 if not exists(select 1 from profiles where id=p_user and lower(email)=lower(trim(p_email))) then
  raise exception 'El correo de confirmación no coincide.';
 end if;
 if exists(select 1 from capability_grants where user_id=p_user and domain='platform'
  and capability='admin' and resource_id is null and (expires_at is null or expires_at>now())) then
  raise exception 'Retira primero el permiso de administrador de esta cuenta.';
 end if;
 if exists(select 1 from communication_documents where owner_id=p_user) then
  raise exception 'Esta cuenta posee comunicados compartidos. Conserva su cuenta hasta resolver la propiedad de esos documentos.';
 end if;
 update profiles set account_status='disabled' where id=p_user;
 delete from capability_grants where user_id=p_user;
end;
$$;
revoke all on function public.prepare_index_account_removal(uuid,text) from public,anon;
grant execute on function public.prepare_index_account_removal(uuid,text) to authenticated;
insert into public.index_security_migrations(version) values(44) on conflict do nothing;
notify pgrst,'reload schema';
commit;
