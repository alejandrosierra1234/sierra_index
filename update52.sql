-- Company identity governance in Procesos. Apply after update51.sql.
begin;

alter table public.companies add column if not exists brand_color text;
update public.companies set brand_color=case
  when lower(name) like '%hilos y algodón%' then '#008C82'
  when lower(name) like '%amtex%' then '#009FFF'
  when lower(name) in ('hsm','honduras spinning mills') then '#8A9A00'
  when lower(name) like '%northern%' then '#16CDBE'
  when lower(name) like '%pride yarn%' then '#9E00CB'
  when lower(name) like '%pride denim%' then '#FF6B35'
  when lower(name)='sierra' then '#444444'
  else '#008C82' end
where brand_color is null or brand_color !~ '^#[0-9A-Fa-f]{6}$';
alter table public.companies alter column brand_color set default '#008C82';
alter table public.companies alter column brand_color set not null;
alter table public.companies drop constraint if exists companies_brand_color_check;
alter table public.companies add constraint companies_brand_color_check check(brand_color ~ '^#[0-9A-F]{6}$');
comment on column public.companies.brand_color is 'Color corporativo asignado a la empresa en formato hexadecimal RGB.';

-- Process editors may maintain sites from the relocated company workspace.
drop policy if exists "process editors can insert sites" on public.sites;
create policy "process editors can insert sites" on public.sites for insert
  with check(public.authorize('communications','write') and public.authorize('communications','read'));
drop policy if exists "process editors can update sites" on public.sites;
create policy "process editors can update sites" on public.sites for update
  using(public.authorize('communications','write') and public.authorize('communications','read'))
  with check(public.authorize('communications','write') and public.authorize('communications','read'));

-- Company logos are now governed from Procesos as well as Talento Humano.
create or replace function public.index_asset_write(p_name text)
returns boolean language sql stable security definer set search_path='' as $$
 select public.index_account_active() and (
   public.authorize('platform','admin')
   or (split_part(p_name,'/',1)='avatars' and split_part(p_name,'/',2)=auth.uid()::text)
   or (split_part(p_name,'/',1) in ('employees','birthday-cards') and public.authorize('talento_humano','write'))
   or (split_part(p_name,'/',1)='company-logos' and (public.authorize('talento_humano','write') or public.authorize('communications','write')))
   or (split_part(p_name,'/',1)=auth.uid()::text and exists(
      select 1 from unnest(array['fiber','yarn','fabric','chemicals','garment']) d where public.authorize(d,'write')))
 )
$$;
revoke all on function public.index_asset_write(text) from public;
grant execute on function public.index_asset_write(text) to authenticated;

-- One atomic, narrowly scoped write path for company identity and policy prefix.
create or replace function public.process_company_save(
 p_company_id uuid,p_country_id uuid,p_name text,p_legal_name text,p_internal_code text,
 p_policy_prefix text,p_logo_url text,p_brand_color text
) returns uuid language plpgsql security definer set search_path='' as $$
declare v_id uuid:=p_company_id;v_prefix text:=upper(trim(coalesce(p_policy_prefix,'')));v_color text:=upper(trim(coalesce(p_brand_color,'')));v_code text:=nullif(upper(trim(coalesce(p_internal_code,''))), '');
begin
 if not ((coalesce(public.authorize('communications','write'),false) and coalesce(public.authorize('communications','read'),false)) or coalesce(public.authorize('platform','admin'),false)) then raise exception 'Access denied' using errcode='42501';end if;
 if p_country_id is null or not exists(select 1 from public.countries where id=p_country_id) then raise exception 'Selecciona un país válido.' using errcode='22023';end if;
 if length(trim(coalesce(p_name,''))) not between 1 and 140 then raise exception 'Escribe un nombre de empresa válido.' using errcode='22023';end if;
 if v_prefix !~ '^[A-Z&]{3}$' then raise exception 'El prefijo debe tener tres letras mayúsculas o ampersand.' using errcode='22023';end if;
 if v_color !~ '^#[0-9A-F]{6}$' then raise exception 'El color debe usar formato hexadecimal de seis dígitos.' using errcode='22023';end if;
 if v_code is not null and (length(v_code)>16 or v_code !~ '^[A-Z0-9&-]+$') then raise exception 'El código interno contiene caracteres no permitidos.' using errcode='22023';end if;
 if p_logo_url is not null and length(p_logo_url)>2048 then raise exception 'La dirección del logo es demasiado larga.' using errcode='22023';end if;
 if v_id is null then
   insert into public.companies(country_id,name,legal_name,code,logo_url,brand_color)
   values(p_country_id,trim(p_name),nullif(trim(coalesce(p_legal_name,'')),''),v_code,p_logo_url,v_color) returning id into v_id;
 else
   if not exists(select 1 from public.companies where id=v_id) then raise exception 'Empresa no encontrada.' using errcode='P0002';end if;
   update public.companies set country_id=p_country_id,name=trim(p_name),legal_name=nullif(trim(coalesce(p_legal_name,'')),''),code=v_code,logo_url=p_logo_url,brand_color=v_color where id=v_id;
 end if;
 if exists(select 1 from public.policy_company_codes cc join public.companies c on c.id=cc.company_id where cc.code=v_prefix and c.country_id=p_country_id and cc.company_id<>v_id) then raise exception 'Ese prefijo ya pertenece a otra empresa del mismo país.' using errcode='23505';end if;
 insert into public.policy_company_codes(company_id,code) values(v_id,v_prefix)
 on conflict(company_id) do update set code=excluded.code;
 return v_id;
end; $$;
revoke all on function public.process_company_save(uuid,uuid,text,text,text,text,text,text) from public,anon;
grant execute on function public.process_company_save(uuid,uuid,text,text,text,text,text,text) to authenticated;

create or replace function public.policy_numbering_catalog()
returns jsonb language plpgsql stable security definer set search_path='' as $$
begin
 if not coalesce(public.authorize('communications','read'),false) then raise exception 'Access denied' using errcode='42501';end if;
 return jsonb_build_object('version',52,'areas',(select jsonb_agg(jsonb_build_object('code',code,'name',name) order by code) from public.policy_areas),
 'companies',(select jsonb_agg(jsonb_build_object('id',c.id,'name',c.name,'countryCode',p.code,'countryName',p.name,'companyCode',cc.code,'brandColor',c.brand_color,
   'issuedPolicies',(select count(*) from public.policy_code_registry r where r.company_id=c.id)) order by c.name)
 from public.companies c join public.countries p on p.id=c.country_id left join public.policy_company_codes cc on cc.company_id=c.id));
end; $$;

insert into public.index_security_migrations(version) values(52) on conflict do nothing;
notify pgrst,'reload schema';
commit;
