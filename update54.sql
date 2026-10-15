-- Policy content images. Apply after update53.sql.
-- Editors may write only below their own account folder and only in the
-- dedicated policy-content subtree. Existing private-bucket read rules remain.
begin;

create or replace function public.index_asset_write(p_name text)
returns boolean language sql stable security definer set search_path='' as $$
 select public.index_account_active() and (
   public.authorize('platform','admin')
   or (split_part(p_name,'/',1)='avatars' and split_part(p_name,'/',2)=auth.uid()::text)
   or (split_part(p_name,'/',1) in ('employees','birthday-cards') and public.authorize('talento_humano','write'))
   or (split_part(p_name,'/',1)='company-logos' and (public.authorize('talento_humano','write') or public.authorize('processes','write')))
   or (split_part(p_name,'/',1)=auth.uid()::text and split_part(p_name,'/',2)='policy-content'
     and public.authorize('processes','read') and public.authorize('processes','write'))
   or (split_part(p_name,'/',1)=auth.uid()::text and exists(
      select 1 from unnest(array['fiber','yarn','fabric','chemicals','garment']) d where public.authorize(d,'write')))
 )
$$;
revoke all on function public.index_asset_write(text) from public;
grant execute on function public.index_asset_write(text) to authenticated;

insert into public.index_security_migrations(version) values(54) on conflict do nothing;
notify pgrst,'reload schema';
commit;
