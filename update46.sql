-- Company logos are shared corporate identity assets.
-- Every active Sierra Index account may read them; HR/platform permissions
-- continue to control upload, replacement and deletion.
begin;

create or replace function public.index_asset_read(p_name text)
returns boolean language sql stable security definer set search_path='' as $$
 select (
   split_part(p_name,'/',1) not in ('employees','avatars','birthday-cards','company-logos')
   and exists(select 1 from public.sample_public_cards c
     join public.sample_public_card_versions v on v.product_id=c.product_id
     where c.active and public.index_asset_path(v.content->>'image_url')=p_name)
 ) or (public.index_account_active() and (
   public.authorize('platform','admin')
   or split_part(p_name,'/',1)='company-logos'
   or (split_part(p_name,'/',1)='avatars' and split_part(p_name,'/',2)=auth.uid()::text)
   or (split_part(p_name,'/',1) in ('employees','birthday-cards','avatars')
     and public.authorize('talento_humano','read'))
   or exists(select 1 from public.products p where public.authorize(p.division,'read',p.id)
     and (coalesce(p.lifecycle,'available') not in ('draft','development') or public.authorize(p.division,'write',p.id))
     and (public.index_asset_path(p.image_url)=p_name or exists(
       select 1 from jsonb_array_elements_text(coalesce(nullif(to_jsonb(p)->'image_urls','null'::jsonb),'[]'::jsonb)) u
       where public.index_asset_path(u)=p_name)))
   or (split_part(p_name,'/',1)=auth.uid()::text)
 ))
$$;

revoke all on function public.index_asset_read(text) from public;
grant execute on function public.index_asset_read(text) to anon,authenticated;

insert into public.index_security_migrations(version) values(46) on conflict do nothing;
notify pgrst,'reload schema';
commit;
