-- ══════════════════════════════════════════════════════════════
-- MÓDULOS + ACCESO: Talento Humano (Creador de Gafetes) y
-- Servicio al Cliente (Catálogo + Muestras, ya existente).
--
-- Añade el dominio 'talento_humano' al sistema de capability_grants
-- ya existente (ver AUTHORIZATION.md) y la tabla de gafetes de
-- empleados. Idempotente — se puede correr varias veces.
-- Ejecutar en Supabase > SQL Editor.
-- ══════════════════════════════════════════════════════════════

-- 1. Nuevo dominio 'talento_humano' en capability_grants
alter table capability_grants drop constraint if exists capability_grants_domain_check;
alter table capability_grants add constraint capability_grants_domain_check
  check (domain in
    ('fiber','yarn','fabric','chemicals','garment',
     'warehouse','customer_service','talento_humano','platform'));

-- 2. authorize(): el fallback legacy ya cubre 'talento_humano' porque
--    solo excluye 'platform' explícitamente (editor -> read/write en
--    cualquier otro dominio). No se requiere cambio en la función.

-- 3. Gafetes de empleados (Módulo Talento Humano)
create table if not exists employee_badges (
  id            uuid primary key default gen_random_uuid(),
  full_name     text not null,
  position      text,
  department    text,
  employee_code text,
  photo_url     text,
  created_by    uuid references profiles(id),
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

alter table employee_badges enable row level security;

drop policy if exists "talento_humano read" on employee_badges;
create policy "talento_humano read"
  on employee_badges for select using (authorize('talento_humano','read'));

drop policy if exists "talento_humano write" on employee_badges;
create policy "talento_humano write"
  on employee_badges for insert with check (authorize('talento_humano','write'));

drop policy if exists "talento_humano update" on employee_badges;
create policy "talento_humano update"
  on employee_badges for update using (authorize('talento_humano','write'));

drop policy if exists "talento_humano delete" on employee_badges;
create policy "talento_humano delete"
  on employee_badges for delete using (authorize('talento_humano','write'));

-- Photos are stored in the existing 'product-images' bucket, under the
-- 'badges/' prefix — no new storage bucket or policy needed.
