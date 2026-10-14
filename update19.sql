-- ══════════════════════════════════════════════════════════════
-- ADMINISTRATIVE BADGE MANAGEMENT SYSTEM — Data Model
--
-- Complete ERP workflow for employee badge issuance:
-- Employee Master Data → Badge Readiness → Badge Issuance → Print/PDF → Audit History
--
-- Regional + Site context model — separate data dimensions:
-- Country → Legal Company → Site (Plant)
--
-- First complete implementation: Northern Spinning (Honduras)
--
-- Idempotent. Run in Supabase > SQL Editor.
-- ══════════════════════════════════════════════════════════════

-- 1. COUNTRIES
create table if not exists countries (
  id uuid primary key default gen_random_uuid(),
  code text unique not null, -- 'GT', 'SV', 'HN', 'NI'
  name text not null,
  created_at timestamptz default now()
);

insert into countries (code, name) values
  ('GT', 'Guatemala'),
  ('SV', 'El Salvador'),
  ('HN', 'Honduras'),
  ('NI', 'Nicaragua')
on conflict (code) do nothing;

-- 2. COMPANIES
create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  country_id uuid references countries(id) on delete restrict not null,
  name text not null,
  legal_name text,
  created_at timestamptz default now()
);

insert into companies (country_id, name, legal_name) values
  ((select id from countries where code = 'GT'), 'Hilos y Algodón', 'Hilos y Algodón, S.A.'),
  ((select id from countries where code = 'SV'), 'AMTEX', 'AMTEX, S.A.'),
  ((select id from countries where code = 'HN'), 'Pride Yarn', 'Pride Yarn S. de R.L.'),
  ((select id from countries where code = 'HN'), 'HSM', 'Honduras Spinning Mills, S.A. de C.V.'),
  ((select id from countries where code = 'HN'), 'Northern Spinning', 'Northern Spinning, S.A. de C.V.'),
  ((select id from countries where code = 'NI'), 'Pride Denim Mills', 'Pride Denim Mills')
on conflict do nothing;

-- 3. SITES (Plants / Operational locations)
create table if not exists sites (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete restrict not null,
  internal_code text not null, -- 'NT' for Northern Spinning, etc.
  name text not null,
  badge_color text, -- e.g. '#FF6B35' — company color for badge physical identification
  -- Future: address, phone, manager, etc.
  created_at timestamptz default now(),
  unique(company_id, internal_code)
);

-- Northern Spinning as first implementation
insert into sites (company_id, internal_code, name, badge_color) values
  ((select id from companies where name = 'Northern Spinning'), 'NT', 'Northern Spinning', null)
on conflict do nothing;

-- 4. EMPLOYEES — Master source of truth
create table if not exists employees (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references sites(id) on delete restrict not null,

  -- Official identifiers
  employee_code text not null, -- official correlative from HR system (required for badge barcode)
  first_name text not null,
  last_name text not null,

  -- Organization
  department text,
  position text,

  -- Identification
  identification_type text, -- 'cedula', 'pasaporte', 'carnet', etc.
  identification_number text, -- national ID number (unique per country/type)

  -- Contact & Emergency
  phone text,
  email text,
  emergency_contact_name text,
  emergency_contact_phone text,
  emergency_contact_relationship text,

  -- Medical (sensitive)
  blood_type text, -- 'O+', 'A-', etc.
  health_conditions text, -- e.g. "diabetic, allergic to penicillin"

  -- Photo
  photo_url text,
  photo_crop jsonb default '{}', -- { "x": 0.1, "y": 0.2, "width": 0.8, "height": 0.8 }

  -- Status
  employee_status text not null default 'active' check (employee_status in (
    'active', 'inactive', 'terminated', 'on_leave', 'transferred'
  )),

  -- Audit
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  unique(site_id, employee_code)
);

-- 5. BADGE TEMPLATES — Site-level configuration
-- Stores template settings, dimensions, static copy, etc.
create table if not exists badge_templates (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references sites(id) on delete restrict not null,
  name text not null default 'Standard',

  -- Physical dimensions (mm)
  width_mm real default 85.6,
  height_mm real default 53.98,

  -- Safe margins for printing
  margin_top_mm real default 3,
  margin_bottom_mm real default 3,
  margin_left_mm real default 3,
  margin_right_mm real default 3,

  -- Static copy (back side)
  static_copy text,
  static_copy_small text, -- legal/disclaimers

  -- Front side settings
  logo_url text, -- SIERRA logo

  -- Back side barcode settings
  barcode_format text default 'CODE128', -- CODE128, CODE39, etc.

  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  unique(site_id, is_active) -- only one active template per site
);

-- 6. BADGE ISSUANCES — Audit trail
-- Tracks every badge printed/issued with full snapshot
create table if not exists badge_issuances (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid references employees(id) on delete restrict not null,

  -- Status lifecycle
  status text not null default 'draft' check (status in (
    'draft', 'ready_to_print', 'printed', 'delivered', 'expired', 'cancelled', 'reprinted'
  )),

  -- Snapshot of employee data at time of issuance
  -- (employee data may change; history must remain accurate)
  snapshot jsonb not null default '{}', -- { "first_name": "...", "last_name": "...", ... }

  -- Template version & company color used
  template_id uuid references badge_templates(id) on delete set null,
  company_color text, -- color used for this badge's print

  -- Physical printing
  printed_at timestamptz,
  printed_by uuid references profiles(id) on delete set null,

  -- Delivery
  delivered_at timestamptz,
  delivered_by uuid references profiles(id) on delete set null,

  -- Reprint tracking
  is_reprint boolean default false,
  reprint_reason text, -- 'lost', 'damaged', 'data_correction', 'photo_update', 'other'
  original_issuance_id uuid references badge_issuances(id) on delete set null,

  -- Cancellation
  cancelled_at timestamptz,
  cancelled_by uuid references profiles(id) on delete set null,
  cancellation_reason text,

  -- Audit
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 7. BADGE EVENTS — Complete audit log
create table if not exists badge_events (
  id uuid primary key default gen_random_uuid(),
  issuance_id uuid references badge_issuances(id) on delete cascade not null,
  event_type text not null, -- 'created', 'ready_to_print', 'printed', 'reprinted', 'delivered', 'expired', 'cancelled'
  event_label text,
  event_data jsonb default '{}',
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz default now()
);

-- 8. EMPLOYEE IMPORTS — Track import operations
create table if not exists employee_imports (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references sites(id) on delete restrict not null,
  import_file_name text,
  row_count integer,
  -- Results summary
  created_count integer default 0,
  updated_count integer default 0,
  unchanged_count integer default 0,
  needs_review_count integer default 0,
  error_count integer default 0,
  status text default 'pending' check (status in ('pending', 'completed', 'failed')),
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz default now(),
  completed_at timestamptz
);

-- 9. EMPLOYEE IMPORT RESULTS — Per-row validation results
create table if not exists employee_import_results (
  id uuid primary key default gen_random_uuid(),
  import_id uuid references employee_imports(id) on delete cascade not null,
  row_number integer,
  employee_code text,
  first_name text,
  last_name text,
  action text, -- 'create', 'update', 'unchanged', 'review', 'error'
  issues jsonb default '[]', -- [{ "level": "error|warning|info", "field": "...", "message": "..." }]
  created_at timestamptz default now()
);

-- 10. USER SITE PREFERENCES
alter table profiles add column if not exists default_site_id uuid references sites(id) on delete set null;

-- ══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ══════════════════════════════════════════════════════════════

alter table countries enable row level security;
alter table companies enable row level security;
alter table sites enable row level security;
alter table employees enable row level security;
alter table badge_templates enable row level security;
alter table badge_issuances enable row level security;
alter table badge_events enable row level security;
alter table employee_imports enable row level security;
alter table employee_import_results enable row level security;

-- COUNTRIES: read-only for all authenticated
create policy "authenticated can view countries"
  on countries for select using (auth.uid() is not null);

-- COMPANIES: read-only for all authenticated
create policy "authenticated can view companies"
  on companies for select using (auth.uid() is not null);

-- SITES: read-only for all authenticated
create policy "authenticated can view sites"
  on sites for select using (auth.uid() is not null);

-- EMPLOYEES: talento_humano role can read/write
drop policy if exists "talento_humano read employees" on employees;
create policy "talento_humano read employees"
  on employees for select using (authorize('talento_humano', 'read'));

drop policy if exists "talento_humano write employees" on employees;
create policy "talento_humano write employees"
  on employees for insert with check (authorize('talento_humano', 'write'));

drop policy if exists "talento_humano update employees" on employees;
create policy "talento_humano update employees"
  on employees for update using (authorize('talento_humano', 'write'));

drop policy if exists "talento_humano delete employees" on employees;
create policy "talento_humano delete employees"
  on employees for delete using (authorize('talento_humano', 'write'));

-- BADGE_TEMPLATES: talento_humano can manage
drop policy if exists "talento_humano read templates" on badge_templates;
create policy "talento_humano read templates"
  on badge_templates for select using (authorize('talento_humano', 'read'));

drop policy if exists "talento_humano write templates" on badge_templates;
create policy "talento_humano write templates"
  on badge_templates for insert with check (authorize('talento_humano', 'write'));

drop policy if exists "talento_humano update templates" on badge_templates;
create policy "talento_humano update templates"
  on badge_templates for update using (authorize('talento_humano', 'write'));

-- BADGE_ISSUANCES: talento_humano full control
drop policy if exists "talento_humano read issuances" on badge_issuances;
create policy "talento_humano read issuances"
  on badge_issuances for select using (authorize('talento_humano', 'read'));

drop policy if exists "talento_humano write issuances" on badge_issuances;
create policy "talento_humano write issuances"
  on badge_issuances for insert with check (authorize('talento_humano', 'write'));

drop policy if exists "talento_humano update issuances" on badge_issuances;
create policy "talento_humano update issuances"
  on badge_issuances for update using (authorize('talento_humano', 'write'));

-- BADGE_EVENTS: talento_humano read
drop policy if exists "talento_humano read events" on badge_events;
create policy "talento_humano read events"
  on badge_events for select using (authorize('talento_humano', 'read'));

drop policy if exists "talento_humano write events" on badge_events;
create policy "talento_humano write events"
  on badge_events for insert with check (authorize('talento_humano', 'write'));

-- EMPLOYEE_IMPORTS: talento_humano full control
drop policy if exists "talento_humano read imports" on employee_imports;
create policy "talento_humano read imports"
  on employee_imports for select using (authorize('talento_humano', 'read'));

drop policy if exists "talento_humano write imports" on employee_imports;
create policy "talento_humano write imports"
  on employee_imports for insert with check (authorize('talento_humano', 'write'));

drop policy if exists "talento_humano update imports" on employee_imports;
create policy "talento_humano update imports"
  on employee_imports for update using (authorize('talento_humano', 'write'));

-- EMPLOYEE_IMPORT_RESULTS: talento_humano full control
drop policy if exists "talento_humano read import results" on employee_import_results;
create policy "talento_humano read import results"
  on employee_import_results for select using (authorize('talento_humano', 'read'));

drop policy if exists "talento_humano write import results" on employee_import_results;
create policy "talento_humano write import results"
  on employee_import_results for insert with check (authorize('talento_humano', 'write'));
