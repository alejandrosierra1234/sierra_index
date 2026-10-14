-- ══════════════════════════════════════════════════════════════
-- EMPRESAS — logo legal para cartas responsivas de gafete
--
-- El logo pertenece a la entidad empleadora y no al shell SIERRA.
-- Pride Denim Mills ya existía en el seed inicial con una razón social
-- incompleta; se normaliza sin reemplazar su UUID ni relaciones.
-- Idempotente. Ejecutar después de update28.sql.
-- ══════════════════════════════════════════════════════════════

alter table companies add column if not exists logo_url text;

update companies
set name = 'Pride Denim Mills, S.A.',
    legal_name = 'Pride Denim Mills, S.A.',
    code = coalesce(code, 'PDM')
where id = (
  select id from companies
  where lower(trim(name)) in ('pride denim mills', 'pride denim mills, s.a.')
     or code = 'PDM'
  order by created_at asc
  limit 1
);

insert into companies (country_id, name, legal_name, code)
select id, 'Pride Denim Mills, S.A.', 'Pride Denim Mills, S.A.', 'PDM'
from countries
where code = 'NI'
  and not exists (
    select 1 from companies
    where lower(trim(name)) in ('pride denim mills', 'pride denim mills, s.a.')
       or code = 'PDM'
  );

comment on column companies.logo_url is
  'Logo de la entidad legal usado en documentos laborales, incluida la carta responsiva de entrega de gafete.';
