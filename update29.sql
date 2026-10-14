-- ══════════════════════════════════════════════════════════════
-- TALENTO HUMANO — HRIS Foundation
--
-- Evolves the employee directory + badge system (update19/24/26/27/28)
-- into a multi-company administrative HRIS backbone. Explicitly
-- excludes payroll: no salary, tax, deduction, bonus, overtime-pay or
-- bank/payment data is added anywhere in this file.
--
-- Reuses existing sources of truth instead of duplicating them:
--   - countries / companies / sites (update19, update28)              → org tree
--   - capability_grants + authorize() (samples_schema.sql, update11)  → permission engine
--   - employee_reporting_relationships (update26)                     → manager chain
--   - employee_movements (update24)                                   → change history
--   - profiles.employee_id / account_type (update27)                  → Index↔employee link
--
-- New in this migration:
--   1. Company lifecycle fields (status, logo) + employees.company_id
--      (a stable FK derived from site_id, replacing reliance on the
--      free-text employees.company/country columns for anything
--      security- or query-relevant — those text columns are left in
--      place, untouched, for backward compatibility).
--   2. departments / positions as first-class, company-or-global
--      scoped entities (job descriptions live on the position, not
--      the employee).
--   3. employment_periods — supports rehire (multiple periods per
--      employee) without ever fabricating history that isn't known.
--   4. employee_movements gains optional structured before/after FKs
--      (company/department/position/manager) alongside its existing
--      generic field/previous_value/new_value columns.
--   5. Vacation subsystem (policies, balances, requests) — an
--      administrative time-off tracker, NOT payroll.
--   6. Recognitions.
--   7. Company-scoped + manager-scoped read/write via new helper
--      functions layered on top of the existing authorize() capability
--      engine (capability_grants.resource_id = company_id is the
--      scoping mechanism — no parallel role table introduced).
--   8. A minimal audit log for the two employee fields not already
--      covered by employee_movements / reporting relationships
--      (photo, status).
--
-- Idempotent. Safe to run multiple times. Run in Supabase > SQL Editor.
-- ══════════════════════════════════════════════════════════════

-- ────────────────────────────────────────────────────────────────
-- 1. COMPANY LIFECYCLE + STABLE COMPANY LINK ON EMPLOYEES
-- ────────────────────────────────────────────────────────────────

alter table companies add column if not exists status text not null default 'active'
  check (status in ('active', 'inactive'));
alter table companies add column if not exists logo_url text;

-- Stable FK, derived from site_id (never edited directly by hand).
-- Existing employees.company / employees.country free-text columns
-- (update21.sql) are left untouched for backward compatibility with
-- any code still reading them.
alter table employees add column if not exists company_id uuid references companies(id) on delete restrict;

create or replace function sync_employee_company_id() returns trigger
language plpgsql as $$
begin
  select s.company_id into new.company_id from sites s where s.id = new.site_id;
  return new;
end;
$$;

drop trigger if exists trg_sync_employee_company_id on employees;
create trigger trg_sync_employee_company_id
  before insert or update of site_id on employees
  for each row execute function sync_employee_company_id();

update employees e set company_id = s.company_id
from sites s
where e.site_id = s.id and e.company_id is distinct from s.company_id;

-- ────────────────────────────────────────────────────────────────
-- 2. DEPARTMENTS — normalized, company-scoped or global (company_id
--    null = a SIERRA-wide department available to every company).
-- ────────────────────────────────────────────────────────────────

create table if not exists departments (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade, -- null = global
  name text not null,
  code text,
  is_active boolean not null default true,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists departments_scope_name_key
  on departments (coalesce(company_id, '00000000-0000-0000-0000-000000000000'::uuid), lower(trim(name)));

alter table employees add column if not exists department_id uuid references departments(id) on delete set null;

-- Backfill: one department per distinct (company, department text) pair
-- already present on employees today.
insert into departments (company_id, name)
select distinct e.company_id, trim(e.department)
from employees e
where e.department is not null and trim(e.department) <> ''
on conflict do nothing;

update employees e
set department_id = d.id
from departments d
where e.department_id is null
  and e.department is not null and trim(e.department) <> ''
  and d.company_id is not distinct from e.company_id
  and lower(trim(d.name)) = lower(trim(e.department));

-- ────────────────────────────────────────────────────────────────
-- 3. POSITIONS — job description lives here, not on the employee.
-- ────────────────────────────────────────────────────────────────

create table if not exists positions (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,     -- null = global position template
  department_id uuid references departments(id) on delete set null,
  reports_to_position_id uuid references positions(id) on delete set null,
  title text not null,
  org_level integer,                       -- lower = higher in the hierarchy; informational only
  objective text,
  responsibilities text,
  competencies text,
  requirements text,
  job_description_url text,                -- link to a stored/generated PDF, if any
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint positions_no_self_report check (id is distinct from reports_to_position_id)
);

create unique index if not exists positions_scope_title_key
  on positions (coalesce(company_id, '00000000-0000-0000-0000-000000000000'::uuid),
                coalesce(department_id, '00000000-0000-0000-0000-000000000000'::uuid),
                lower(trim(title)));

alter table employees add column if not exists position_id uuid references positions(id) on delete set null;

insert into positions (company_id, department_id, title)
select distinct e.company_id, e.department_id, trim(e.position)
from employees e
where e.position is not null and trim(e.position) <> ''
on conflict do nothing;

update employees e
set position_id = p.id
from positions p
where e.position_id is null
  and e.position is not null and trim(e.position) <> ''
  and p.company_id is not distinct from e.company_id
  and p.department_id is not distinct from e.department_id
  and lower(trim(p.title)) = lower(trim(e.position));

-- ────────────────────────────────────────────────────────────────
-- 4. EMPLOYMENT PERIODS — supports rehire (multiple stints per
--    employee) without inventing dates that aren't known.
-- ────────────────────────────────────────────────────────────────

create table if not exists employment_periods (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid references employees(id) on delete cascade not null,
  company_id uuid references companies(id) on delete restrict not null,
  site_id uuid references sites(id) on delete restrict not null,

  start_date date not null,
  end_date date,                           -- null while the period is open
  is_current boolean not null default true,

  period_status text not null default 'active' check (period_status in ('active', 'ended')),

  termination_category text check (termination_category in (
    'resignation', 'termination', 'end_of_contract', 'retirement', 'other'
  )),
  termination_reason text,
  notes text,

  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint employment_periods_valid_range check (end_date is null or end_date >= start_date),
  constraint employment_periods_end_requires_ended check (
    (period_status = 'active' and end_date is null)
    or (period_status = 'ended')
  )
);

create unique index if not exists employment_periods_one_current
  on employment_periods(employee_id) where is_current;
create index if not exists employment_periods_employee_idx on employment_periods(employee_id, start_date desc);

-- Backfill exactly one period per existing employee from what is
-- actually known (hire_date, or the record's own creation date as a
-- last resort) and its current status. Termination date is only ever
-- set from a real, previously-recorded 'departure' movement — never
-- guessed.
insert into employment_periods (employee_id, company_id, site_id, start_date, end_date, is_current, period_status, notes)
select
  e.id,
  e.company_id,
  e.site_id,
  coalesce(e.hire_date, e.created_at::date),
  case when e.employee_status = 'terminated' then dep.effective_date else null end,
  e.employee_status <> 'terminated',
  case when e.employee_status = 'terminated' then 'ended' else 'active' end,
  case when e.employee_status = 'terminated' and dep.effective_date is null
       then 'Migrado automáticamente: baja registrada sin fecha histórica exacta.'
       else null end
from employees e
left join lateral (
  select m.effective_date
  from employee_movements m
  where m.employee_id = e.id and m.movement_type = 'departure' and m.status = 'applied'
  order by m.effective_date desc limit 1
) dep on true
where not exists (select 1 from employment_periods ep where ep.employee_id = e.id);

-- ────────────────────────────────────────────────────────────────
-- 5. EMPLOYEE_MOVEMENTS — optional structured before/after references,
--    additive alongside the existing generic field/previous_value/
--    new_value columns (update24.sql). Nothing existing is removed.
-- ────────────────────────────────────────────────────────────────

alter table employee_movements add column if not exists previous_company_id uuid references companies(id) on delete set null;
alter table employee_movements add column if not exists new_company_id uuid references companies(id) on delete set null;
alter table employee_movements add column if not exists previous_department_id uuid references departments(id) on delete set null;
alter table employee_movements add column if not exists new_department_id uuid references departments(id) on delete set null;
alter table employee_movements add column if not exists previous_position_id uuid references positions(id) on delete set null;
alter table employee_movements add column if not exists new_position_id uuid references positions(id) on delete set null;
alter table employee_movements add column if not exists previous_manager_id uuid references employees(id) on delete set null;
alter table employee_movements add column if not exists new_manager_id uuid references employees(id) on delete set null;
alter table employee_movements add column if not exists employment_period_id uuid references employment_periods(id) on delete set null;

-- ────────────────────────────────────────────────────────────────
-- 6. VACATION SUBSYSTEM — administrative time-off, not payroll.
--    Policies may be scoped by country and/or company; an employee's
--    applicable policy resolves company-first, then country, so
--    different legal regimes are never hardcoded.
-- ────────────────────────────────────────────────────────────────

create table if not exists vacation_policies (
  id uuid primary key default gen_random_uuid(),
  country_id uuid references countries(id) on delete cascade,
  company_id uuid references companies(id) on delete cascade,   -- null = country-wide default
  name text not null,
  annual_days numeric(5,2) not null check (annual_days >= 0),
  accrual_method text not null default 'annual_grant' check (accrual_method in ('annual_grant', 'monthly_accrual')),
  carryover_max_days numeric(5,2),
  is_active boolean not null default true,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint vacation_policies_scope check (country_id is not null or company_id is not null)
);

create table if not exists vacation_balances (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid references employees(id) on delete cascade not null,
  policy_id uuid references vacation_policies(id) on delete restrict not null,
  period_year integer not null,
  entitled_days numeric(5,2) not null default 0,
  used_days numeric(5,2) not null default 0,
  adjustment_days numeric(5,2) not null default 0,   -- manual HR correction, always with a note
  adjustment_note text,
  updated_by uuid references profiles(id) on delete set null,
  updated_at timestamptz not null default now(),

  unique (employee_id, period_year)
);

create table if not exists vacation_requests (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid references employees(id) on delete cascade not null,
  start_date date not null,
  end_date date not null,
  requested_days numeric(5,2) not null check (requested_days > 0),
  comment text,

  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'cancelled')),
  decided_by uuid references profiles(id) on delete set null,
  decided_at timestamptz,
  decision_note text,

  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint vacation_requests_valid_range check (end_date >= start_date)
);

create index if not exists vacation_requests_employee_idx on vacation_requests(employee_id, start_date desc);

-- Immutable decision trail (never overwrite — every status change appends).
create table if not exists vacation_request_decisions (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references vacation_requests(id) on delete cascade not null,
  status text not null check (status in ('pending', 'approved', 'rejected', 'cancelled')),
  note text,
  decided_by uuid references profiles(id) on delete set null,
  decided_at timestamptz not null default now()
);

create or replace function log_vacation_request_decision() returns trigger
language plpgsql security definer as $$
begin
  if tg_op = 'INSERT' or old.status is distinct from new.status then
    insert into vacation_request_decisions (request_id, status, note, decided_by)
      values (new.id, new.status, new.decision_note, auth.uid());
  end if;
  return new;
end;
$$;

drop trigger if exists trg_log_vacation_decision on vacation_requests;
create trigger trg_log_vacation_decision
  after insert or update of status on vacation_requests
  for each row execute function log_vacation_request_decision();

-- Boleta de vacaciones — a generated document reference, not a
-- duplicate of the request. balance_before/after are snapshotted at
-- generation time so the printed record never drifts.
create table if not exists vacation_documents (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references vacation_requests(id) on delete cascade not null,
  balance_before numeric(5,2),
  balance_after numeric(5,2),
  generated_by uuid references profiles(id) on delete set null,
  generated_at timestamptz not null default now()
);

-- ────────────────────────────────────────────────────────────────
-- 7. RECOGNITIONS
-- ────────────────────────────────────────────────────────────────

create table if not exists recognitions (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid references employees(id) on delete cascade not null,
  recognition_type text not null,
  title text not null,
  description text,
  recognition_date date not null default current_date,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists recognitions_employee_idx on recognitions(employee_id, recognition_date desc);

-- ────────────────────────────────────────────────────────────────
-- 8. MINIMAL AUDIT LOG — only for the employee fields not already
--    captured by employee_movements (position/department/company/
--    manager) or employee_reporting_relationships (manager). Covers
--    photo and status, which had no audit trail before.
-- ────────────────────────────────────────────────────────────────

create table if not exists employee_audit_log (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid references employees(id) on delete cascade not null,
  field text not null,
  previous_value text,
  new_value text,
  actor uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists employee_audit_log_employee_idx on employee_audit_log(employee_id, created_at desc);

create or replace function log_employee_field_changes() returns trigger
language plpgsql security definer as $$
begin
  if old.photo_url is distinct from new.photo_url then
    insert into employee_audit_log (employee_id, field, previous_value, new_value, actor)
      values (new.id, 'photo_url', old.photo_url, new.photo_url, auth.uid());
  end if;
  if old.employee_status is distinct from new.employee_status then
    insert into employee_audit_log (employee_id, field, previous_value, new_value, actor)
      values (new.id, 'employee_status', old.employee_status, new.employee_status, auth.uid());
  end if;
  return new;
end;
$$;

drop trigger if exists trg_log_employee_field_changes on employees;
create trigger trg_log_employee_field_changes
  after update of photo_url, employee_status on employees
  for each row execute function log_employee_field_changes();

-- ────────────────────────────────────────────────────────────────
-- 9. PERMISSION HELPERS — layered on the existing authorize()
--    capability engine. Company scope = a capability_grants row with
--    domain='talento_humano' and resource_id = that company's id
--    (resource_id null, per the existing convention, still means
--    "every company" — i.e. Global HR). No parallel roles table.
-- ────────────────────────────────────────────────────────────────

create or replace function user_has_company_scope(p_company_id uuid, p_capability text)
returns boolean language sql security definer stable as $$
  select authorize('talento_humano', p_capability, p_company_id);
$$;

-- Is auth.uid()'s linked employee an ancestor (any depth, current
-- relationships only) in the immediate-manager chain of p_employee_id?
create or replace function is_manager_of(p_employee_id uuid)
returns boolean language plpgsql security definer stable as $$
declare
  v_manager_employee_id uuid;
  v_current uuid := p_employee_id;
  v_depth int := 0;
begin
  select employee_id into v_manager_employee_id from profiles where id = auth.uid();
  if v_manager_employee_id is null then return false; end if;

  loop
    v_depth := v_depth + 1;
    if v_depth > 50 then return false; end if;

    select r.manager_employee_id into v_current
    from employee_reporting_relationships r
    where r.employee_id = v_current
      and r.relationship_type = 'immediate_manager'
      and r.is_current;

    if v_current is null then return false; end if;
    if v_current = v_manager_employee_id then return true; end if;
  end loop;
end;
$$;

create or replace function is_self_employee(p_employee_id uuid)
returns boolean language sql security definer stable as $$
  select exists (select 1 from profiles where id = auth.uid() and employee_id = p_employee_id);
$$;

create or replace function can_view_employee(p_employee_id uuid)
returns boolean language plpgsql security definer stable as $$
declare
  v_company_id uuid;
begin
  if authorize('platform', 'admin') or authorize('talento_humano', 'read') then return true; end if;
  if is_self_employee(p_employee_id) or is_manager_of(p_employee_id) then return true; end if;

  select company_id into v_company_id from employees where id = p_employee_id;
  if v_company_id is not null and user_has_company_scope(v_company_id, 'read') then return true; end if;

  return false;
end;
$$;

create or replace function can_manage_employee(p_employee_id uuid)
returns boolean language plpgsql security definer stable as $$
declare
  v_company_id uuid;
begin
  if authorize('platform', 'admin') or authorize('talento_humano', 'write') then return true; end if;

  select company_id into v_company_id from employees where id = p_employee_id;
  if v_company_id is not null and user_has_company_scope(v_company_id, 'write') then return true; end if;

  return false;
end;
$$;

-- ────────────────────────────────────────────────────────────────
-- 10. ROW LEVEL SECURITY
-- ────────────────────────────────────────────────────────────────

alter table departments enable row level security;
alter table positions enable row level security;
alter table employment_periods enable row level security;
alter table vacation_policies enable row level security;
alter table vacation_balances enable row level security;
alter table vacation_requests enable row level security;
alter table vacation_request_decisions enable row level security;
alter table vacation_documents enable row level security;
alter table recognitions enable row level security;
alter table employee_audit_log enable row level security;

-- DEPARTMENTS / POSITIONS: read open to any authenticated user
-- (organizational data — same visibility tier as companies/sites);
-- write requires platform admin, global talento_humano write, or
-- write scope on that specific company (global/company_id null
-- entities remain admin/global-only, mirroring companies/sites).
drop policy if exists "authenticated can view departments" on departments;
create policy "authenticated can view departments"
  on departments for select using (auth.uid() is not null);

drop policy if exists "scoped write departments" on departments;
create policy "scoped write departments"
  on departments for all using (
    authorize('platform', 'admin')
    or authorize('talento_humano', 'write')
    or (company_id is not null and user_has_company_scope(company_id, 'write'))
  ) with check (
    authorize('platform', 'admin')
    or authorize('talento_humano', 'write')
    or (company_id is not null and user_has_company_scope(company_id, 'write'))
  );

drop policy if exists "authenticated can view positions" on positions;
create policy "authenticated can view positions"
  on positions for select using (auth.uid() is not null);

drop policy if exists "scoped write positions" on positions;
create policy "scoped write positions"
  on positions for all using (
    authorize('platform', 'admin')
    or authorize('talento_humano', 'write')
    or (company_id is not null and user_has_company_scope(company_id, 'write'))
  ) with check (
    authorize('platform', 'admin')
    or authorize('talento_humano', 'write')
    or (company_id is not null and user_has_company_scope(company_id, 'write'))
  );

-- EMPLOYEES: replace the blanket talento_humano policies (update19,
-- widened in update27) with the scoped helper. Global grants, self,
-- and manager access all keep working exactly as before — this only
-- ADDS company-scoped and manager access, it removes no prior access.
drop policy if exists "talento_humano read employees" on employees;
create policy "talento_humano read employees"
  on employees for select using (can_view_employee(id));

drop policy if exists "talento_humano write employees" on employees;
create policy "talento_humano write employees"
  on employees for insert with check (
    authorize('platform', 'admin')
    or authorize('talento_humano', 'write')
    or (company_id is not null and user_has_company_scope(company_id, 'write'))
  );

drop policy if exists "talento_humano update employees" on employees;
create policy "talento_humano update employees"
  on employees for update using (can_manage_employee(id));

drop policy if exists "talento_humano delete employees" on employees;
create policy "talento_humano delete employees"
  on employees for delete using (can_manage_employee(id));

-- EMPLOYMENT_PERIODS
drop policy if exists "read employment periods" on employment_periods;
create policy "read employment periods"
  on employment_periods for select using (can_view_employee(employee_id));

drop policy if exists "write employment periods" on employment_periods;
create policy "write employment periods"
  on employment_periods for all using (can_manage_employee(employee_id))
  with check (can_manage_employee(employee_id));

-- RECOGNITIONS
drop policy if exists "read recognitions" on recognitions;
create policy "read recognitions"
  on recognitions for select using (can_view_employee(employee_id));

drop policy if exists "write recognitions" on recognitions;
create policy "write recognitions"
  on recognitions for all using (can_manage_employee(employee_id))
  with check (can_manage_employee(employee_id));

-- EMPLOYEE_AUDIT_LOG: read-only to those who can manage the employee
-- (administrative/audit data — never exposed to the general reader).
drop policy if exists "read employee audit log" on employee_audit_log;
create policy "read employee audit log"
  on employee_audit_log for select using (can_manage_employee(employee_id));

-- VACATION_POLICIES: read open to authenticated (needed to compute
-- balances/requests client-side); write scoped like departments.
drop policy if exists "authenticated can view vacation policies" on vacation_policies;
create policy "authenticated can view vacation policies"
  on vacation_policies for select using (auth.uid() is not null);

drop policy if exists "scoped write vacation policies" on vacation_policies;
create policy "scoped write vacation policies"
  on vacation_policies for all using (
    authorize('platform', 'admin')
    or authorize('talento_humano', 'write')
    or (company_id is not null and user_has_company_scope(company_id, 'write'))
  ) with check (
    authorize('platform', 'admin')
    or authorize('talento_humano', 'write')
    or (company_id is not null and user_has_company_scope(company_id, 'write'))
  );

-- VACATION_BALANCES: viewable by self/manager/HR scope; only HR scope
-- (never the employee) can write balances.
drop policy if exists "read vacation balances" on vacation_balances;
create policy "read vacation balances"
  on vacation_balances for select using (can_view_employee(employee_id));

drop policy if exists "write vacation balances" on vacation_balances;
create policy "write vacation balances"
  on vacation_balances for all using (can_manage_employee(employee_id))
  with check (can_manage_employee(employee_id));

-- VACATION_REQUESTS: employee can create/read/cancel their own;
-- manager can read + decide on direct reports; HR scope has full
-- control. Employees may only ever insert requests for themselves.
drop policy if exists "read vacation requests" on vacation_requests;
create policy "read vacation requests"
  on vacation_requests for select using (can_view_employee(employee_id));

drop policy if exists "employee create own vacation request" on vacation_requests;
create policy "employee create own vacation request"
  on vacation_requests for insert with check (
    is_self_employee(employee_id) or can_manage_employee(employee_id)
  );

drop policy if exists "decide or cancel vacation request" on vacation_requests;
create policy "decide or cancel vacation request"
  on vacation_requests for update using (
    can_manage_employee(employee_id)
    or is_manager_of(employee_id)
    or (is_self_employee(employee_id) and status = 'pending')
  );

-- VACATION_REQUEST_DECISIONS: immutable trail, readable wherever the
-- parent request is readable.
drop policy if exists "read vacation decisions" on vacation_request_decisions;
create policy "read vacation decisions"
  on vacation_request_decisions for select using (
    exists (select 1 from vacation_requests r where r.id = request_id and can_view_employee(r.employee_id))
  );

-- VACATION_DOCUMENTS
drop policy if exists "read vacation documents" on vacation_documents;
create policy "read vacation documents"
  on vacation_documents for select using (
    exists (select 1 from vacation_requests r where r.id = request_id and can_view_employee(r.employee_id))
  );

drop policy if exists "generate vacation documents" on vacation_documents;
create policy "generate vacation documents"
  on vacation_documents for insert with check (
    exists (select 1 from vacation_requests r where r.id = request_id and can_manage_employee(r.employee_id))
  );

comment on table departments is 'HRIS foundation: normalized department per company (or global when company_id is null). Talento Humano only — not payroll.';
comment on table positions is 'HRIS foundation: job description and org placement live on the position, never duplicated per employee. Talento Humano only — not payroll.';
comment on table employment_periods is 'One row per employment stint; multiple rows support rehire. Never fabricate start/end dates — leave null and note when unknown.';
comment on table vacation_policies is 'Administrative time-off entitlement rules, scoped by country and/or company. Explicitly not payroll: no pay-out amounts are modeled here.';
comment on column employees.company_id is 'Stable FK to companies, kept in sync from site_id by trg_sync_employee_company_id. Prefer this over the legacy free-text employees.company/country columns (update21.sql) for any query or security logic.';
