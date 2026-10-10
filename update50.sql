-- Policy numbering. Apply after 49. Allocation and approval are one transaction.
begin;
create table if not exists public.policy_areas (
 code text primary key check(code ~ '^[0-9]{3}$'), name text not null unique
);
insert into public.policy_areas(code,name) values
 ('001','Talento Humano'),('002','Finanzas'),('003','Compras'),('004','Logística'),
 ('005','Ventas'),('006','Mercadeo'),('007','IT'),('008','Administración'),
 ('009','Créditos y Cobros'),('010','Auditoría Interna'),('011','Ambiente, salud y seguridad'),
 ('012','Control Interno'),('013','Calidad') on conflict do nothing;
create table if not exists public.policy_company_codes (
 company_id uuid primary key references public.companies(id) on delete restrict,
 code text not null check(code ~ '^[A-Z&]{3}$')
);
-- Exact official aliases from BASE DE CODIGOS; do not reuse the badge code.
insert into public.policy_company_codes(company_id,code)
select c.id,m.code from public.companies c join (values
 ('hilos y algodón','H&A'),('hilos y algodón, s.a.','H&A'),
 ('honduras spinning mills','HSM'),('hsm','HSM'),
 ('northern textiles','N&T'),('northern spinning','N&S'),
 ('pride yarn','P&Y'),('pride denim mills','PDM'),('pride denim mills, s.a.','PDM'),
 ('pride chemicals','PCH'),('lake city park s.a.','LCP'),('sierra','SIE')
) m(name,code) on lower(trim(c.name))=m.name on conflict do nothing;
create table if not exists public.policy_code_counters (
 prefix text primary key, last_number integer not null check(last_number between 1 and 999)
);
create table if not exists public.policy_code_registry (
 policy_id text primary key references public.policy_documents(id) on delete restrict,
 code text not null unique check(code ~ '^[A-Z]{2}-[A-Z&]{3}-[0-9]{3}-POL-[0-9]{3}$'),
 prefix text not null, serial integer not null check(serial between 1 and 999),
 company_id uuid not null references public.companies(id) on delete restrict,
 country_code text not null, company_code text not null, area_code text not null references public.policy_areas(code),
 allocated_at timestamptz not null default now(), allocated_by uuid references public.profiles(id),
 legacy boolean not null default false, unique(prefix,serial),
 check(code=prefix||'-'||lpad(serial::text,3,'0')),
 check(prefix=country_code||'-'||company_code||'-'||area_code||'-POL')
);
alter table public.policy_areas enable row level security;
alter table public.policy_company_codes enable row level security;
alter table public.policy_code_counters enable row level security;
alter table public.policy_code_registry enable row level security;
revoke all on public.policy_areas,public.policy_company_codes,public.policy_code_counters,public.policy_code_registry from public,anon,authenticated;

-- Abort on ambiguous historical codes, mismatched companies/countries or unknown areas.
-- Never silently renumber a code which may already have circulated.
do $$
begin
 if exists(select 1 from public.policy_documents d
  left join public.companies c on c.id::text=d.snapshot->>'companyId'
  left join public.countries country on country.id=c.country_id
  left join public.policy_company_codes cc on cc.company_id=c.id
  left join public.policy_areas a on a.code=split_part(d.snapshot->>'code','-',3)
  where d.snapshot->>'code' ~ '^[A-Z]{2}-[A-Z&]{3}-[0-9]{3}-POL-[0-9]{3}$'
  and (c.id is null or country.code is distinct from split_part(d.snapshot->>'code','-',1)
   or cc.code is distinct from split_part(d.snapshot->>'code','-',2) or a.code is null
   or split_part(d.snapshot->>'code','-',5)='000')) then
  raise exception 'Historical policy code mismatch. Review before migrating.';
 end if;
end; $$;
insert into public.policy_code_registry(policy_id,code,prefix,serial,company_id,country_code,company_code,area_code,legacy)
select d.id,d.snapshot->>'code',regexp_replace(d.snapshot->>'code','-[0-9]{3}$',''),
 split_part(d.snapshot->>'code','-',5)::integer,c.id,country.code,cc.code,split_part(d.snapshot->>'code','-',3),true
from public.policy_documents d join public.companies c on c.id::text=d.snapshot->>'companyId'
join public.countries country on country.id=c.country_id join public.policy_company_codes cc on cc.company_id=c.id
where d.snapshot->>'code' ~ '^[A-Z]{2}-[A-Z&]{3}-[0-9]{3}-POL-[0-9]{3}$'
on conflict(policy_id) do nothing;
insert into public.policy_code_counters(prefix,last_number)
select prefix,max(serial) from public.policy_code_registry group by prefix
on conflict(prefix) do update set last_number=greatest(policy_code_counters.last_number,excluded.last_number);

-- Keep old references in the snapshot and immutable revision history.
with prepared as (
 select d.id,(d.snapshot - 'numbering') || jsonb_build_object(
  'code',coalesce(r.code,''),'areaCode',coalesce(r.area_code,d.snapshot->>'areaCode',''),
  'legacyCode',coalesce(d.snapshot->>'legacyCode',case when r.code is null then d.snapshot->>'code' else '' end,''),
  'numbering',case when r.code is null then null else jsonb_build_object('code',r.code,'countryCode',r.country_code,'companyCode',r.company_code,'areaCode',r.area_code,'serial',r.serial,'legacy',r.legacy) end
 ) as snapshot from public.policy_documents d left join public.policy_code_registry r on r.policy_id=d.id
), updated as (
 update public.policy_documents d set snapshot=p.snapshot,revision=d.revision+1,updated_at=now()
 from prepared p where d.id=p.id and d.snapshot is distinct from p.snapshot returning d.*
)
insert into public.policy_revisions(policy_id,revision,snapshot,actor_id)
select id,revision,snapshot,null from updated on conflict do nothing;

create or replace function public.policy_numbering_catalog()
returns jsonb language plpgsql stable security definer set search_path='' as $$
begin
 if not coalesce(public.authorize('communications','read'),false) then raise exception 'Access denied' using errcode='42501';end if;
 return jsonb_build_object('version',50,'areas',(select jsonb_agg(jsonb_build_object('code',code,'name',name) order by code) from public.policy_areas),
 'companies',(select jsonb_agg(jsonb_build_object('id',c.id,'name',c.name,'countryCode',p.code,'countryName',p.name,'companyCode',cc.code) order by c.name)
 from public.companies c join public.countries p on p.id=c.country_id left join public.policy_company_codes cc on cc.company_id=c.id));
end; $$;

create or replace function public.policy_save_numbered(p_snapshot jsonb,p_approve boolean default false)
returns jsonb language plpgsql security definer set search_path='' as $$
declare v_id text:=trim(p_snapshot->>'id'); prior public.policy_documents; reg public.policy_code_registry;
 clean jsonb; inserted boolean; company record; area public.policy_areas; v_prefix text; v_serial integer;
begin
 if not coalesce(public.authorize('communications','write'),false) or not coalesce(public.authorize('communications','read'),false) then raise exception 'Access denied' using errcode='42501';end if;
 if p_snapshot is null or jsonb_typeof(p_snapshot)<>'object' or v_id is null or length(v_id) not between 1 and 200 or pg_column_size(p_snapshot)>8388608 then raise exception 'Invalid policy';end if;
 -- Serialize saves of the same document, including first creation, before CAS.
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('policy:'||v_id,0));
 select * into prior from public.policy_documents where id=v_id for update;
 inserted:=not found;
 if not inserted and coalesce((p_snapshot->>'_revision')::bigint,-1)<>prior.revision then raise exception 'Policy changed in another session' using errcode='40001';end if;
 if not p_approve and p_snapshot->>'status'='Aprobada' and (inserted or prior.snapshot->>'status' is distinct from 'Aprobada') then
  raise exception 'Usa Confirmar aprobación para emitir el código.' using errcode='22023';end if;
 clean:=p_snapshot-'comments'-'_revision'-'versions'-'numbering'-'approvedAt'-'approvedBy'-'legacyCode';
 clean:=clean||jsonb_build_object('legacyCode',coalesce(prior.snapshot->>'legacyCode',''),'approvedAt',prior.snapshot->'approvedAt','approvedBy',prior.snapshot->'approvedBy');
 if coalesce(clean->>'status','') not in ('Borrador','En revisión','Aprobada','Archivada') then raise exception 'Estado inválido' using errcode='22023';end if;
 select * into reg from public.policy_code_registry where policy_id=v_id;
 if found then
  if clean->>'companyId' is distinct from reg.company_id::text or coalesce(clean->>'areaCode',reg.area_code)<>reg.area_code then
   raise exception 'El código emitido protege empresa y área. Duplica la política para otra clasificación.' using errcode='22023';end if;
  select * into area from public.policy_areas where code=reg.area_code;
  select c.id,c.name,c.legal_name into company from public.companies c where c.id=reg.company_id;
  clean:=clean||jsonb_build_object('companyName',company.name,'companyLegalName',coalesce(company.legal_name,company.name));
 else
  select c.id,c.name,c.legal_name,p.code as country_code,cc.code as company_code into company
  from public.companies c join public.countries p on p.id=c.country_id left join public.policy_company_codes cc on cc.company_id=c.id
  where c.id::text=clean->>'companyId';
  select * into area from public.policy_areas where code=clean->>'areaCode';
  clean:=clean||jsonb_build_object('code','','numbering',null);
 end if;
 if area.code is not null then clean:=clean||jsonb_build_object('department',area.name,'areaCode',area.code);end if;
 if p_approve then
  if length(trim(coalesce(clean->>'title','')))=0 or upper(trim(clean->>'title'))='POLÍTICA SIN TÍTULO' then raise exception 'Escribe el nombre definitivo de la política.' using errcode='22023';end if;
  if area.code is null then raise exception 'Selecciona un área del catálogo.' using errcode='22023';end if;
  if reg.policy_id is null then
   if company.id is null or company.company_code is null or company.country_code !~ '^[A-Z]{2}$' then raise exception 'La empresa no tiene nomenclatura oficial configurada.' using errcode='22023';end if;
   -- A country/company prefix must identify exactly one legal company.
   if (select count(*) from public.policy_company_codes cc join public.companies c on c.id=cc.company_id join public.countries p on p.id=c.country_id where cc.code=company.company_code and p.code=company.country_code)<>1 then raise exception 'Nomenclatura de empresa ambigua. Revisa el catálogo.' using errcode='22023';end if;
   v_prefix:=company.country_code||'-'||company.company_code||'-'||area.code||'-POL';
   insert into public.policy_code_counters as counter(prefix,last_number) values(v_prefix,1)
   on conflict(prefix) do update set last_number=counter.last_number+1 where counter.last_number<999 returning last_number into v_serial;
   if v_serial is null then raise exception 'Se agotó el correlativo de tres dígitos. Contacta al administrador.' using errcode='22023';end if;
   reg.policy_id:=v_id;reg.prefix:=v_prefix;reg.serial:=v_serial;reg.code:=v_prefix||'-'||lpad(v_serial::text,3,'0');
   reg.company_id:=company.id;reg.country_code:=company.country_code;reg.company_code:=company.company_code;reg.area_code:=area.code;reg.legacy:=false;
   clean:=clean||jsonb_build_object('companyName',company.name,'companyLegalName',coalesce(company.legal_name,company.name));
  end if;
  clean:=clean||jsonb_build_object('status','Aprobada','approvedAt',coalesce(prior.snapshot->>'approvedAt',now()::text),'approvedBy',coalesce(prior.snapshot->>'approvedBy',auth.uid()::text));
 end if;
 if reg.policy_id is not null then clean:=clean||jsonb_build_object('code',reg.code,'areaCode',reg.area_code,'numbering',jsonb_build_object('code',reg.code,'countryCode',reg.country_code,'companyCode',reg.company_code,'areaCode',reg.area_code,'serial',reg.serial,'legacy',reg.legacy));end if;
 clean:=clean||jsonb_build_object('title',upper(trim(coalesce(clean->>'title',''))));
 if inserted then
  insert into public.policy_documents(id,snapshot,owner_id,updated_by) values(v_id,clean,auth.uid(),auth.uid());
  perform public.policy_import_legacy_comments(v_id,p_snapshot->'comments',now());
 else update public.policy_documents set snapshot=clean,revision=revision+1,updated_by=auth.uid(),updated_at=now() where id=v_id;end if;
 if reg.policy_id is not null then
  insert into public.policy_code_registry(policy_id,code,prefix,serial,company_id,country_code,company_code,area_code,allocated_by)
  values(v_id,reg.code,reg.prefix,reg.serial,reg.company_id,reg.country_code,reg.company_code,reg.area_code,auth.uid()) on conflict(policy_id) do nothing;
 end if;
 insert into public.policy_revisions(policy_id,revision,snapshot,actor_id) select id,revision,snapshot,auth.uid() from public.policy_documents where id=v_id;
 return public.policy_cloud_get(v_id);
end; $$;
create or replace function public.policy_cloud_save(p_snapshot jsonb)
returns jsonb language sql security definer set search_path='' as $$select public.policy_save_numbered(p_snapshot,false)$$;
create or replace function public.policy_approve(p_policy_id text,p_revision bigint)
returns jsonb language plpgsql security definer set search_path='' as $$
declare d public.policy_documents;
begin
 if not coalesce(public.authorize('communications','write'),false) or not coalesce(public.authorize('communications','read'),false) then raise exception 'Access denied' using errcode='42501';end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('policy:'||p_policy_id,0));
 select * into d from public.policy_documents where id=p_policy_id for update;
 if not found then raise exception 'Guarda la política antes de aprobar.' using errcode='P0002';end if;
 -- Lost response / double click: return the existing approval; never allocate twice.
 if d.snapshot->>'status'='Aprobada' and exists(select 1 from public.policy_code_registry where policy_id=p_policy_id) then return public.policy_cloud_get(p_policy_id);end if;
 if d.revision is distinct from p_revision then raise exception 'La política cambió. Revisa su última versión antes de aprobar.' using errcode='40001';end if;
 if d.snapshot->>'status'='Archivada' then raise exception 'Restaura la política antes de aprobar.' using errcode='22023';end if;
 return public.policy_save_numbered(d.snapshot||jsonb_build_object('_revision',d.revision),true);
end; $$;
revoke all on function public.policy_save_numbered(jsonb,boolean) from public,anon,authenticated;
revoke all on function public.policy_numbering_catalog(),public.policy_approve(text,bigint) from public,anon;
grant execute on function public.policy_numbering_catalog(),public.policy_approve(text,bigint) to authenticated;
insert into public.index_security_migrations(version) values(50) on conflict do nothing;
notify pgrst,'reload schema';
commit;
