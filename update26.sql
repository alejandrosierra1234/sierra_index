-- ══════════════════════════════════════════════════════════════
-- TALENTO HUMANO — Organización (reporting-relationship data model)
--
-- Adds the real organizational-chart backbone: a dedicated, historized
-- reporting-relationship table (never a mutable "manager" text field),
-- plus a review queue for the legacy `supervisor_name` free-text values
-- introduced in update24.sql.
--
-- No payroll, salary, compensation or financial data is added or read
-- by anything in this file.
--
-- Depends on update19.sql (employees, sites, authorize()) and
-- update24.sql (employees.supervisor_name). Apply after both.
--
-- Idempotent. Run in Supabase > SQL Editor.
-- ══════════════════════════════════════════════════════════════

-- ── 1. REPORTING RELATIONSHIPS ──
-- The employee and manager are always referenced by their real employee
-- id (never by name, never by the visible employee_code). Only one
-- relationship type is active today ('immediate_manager'); the check
-- constraint already reserves the future types called for in the spec
-- so they can be turned on later without a schema change.
create table if not exists employee_reporting_relationships (
  id uuid primary key default gen_random_uuid(),

  employee_id uuid references employees(id) on delete cascade not null,
  manager_employee_id uuid references employees(id) on delete cascade not null,

  relationship_type text not null default 'immediate_manager' check (relationship_type in (
    'immediate_manager', 'functional_manager', 'temporary_manager', 'dotted_line'
  )),

  effective_from date not null default current_date,
  effective_to date,
  is_current boolean not null default true,

  -- Site the relationship was recorded under — a context stamp (same
  -- convention as employee_movements.site_id), not a duplicate of the
  -- employee entity. Company is intentionally NOT duplicated here:
  -- employees.company already carries it and cross-company checks read
  -- that column directly, so it can never drift out of sync.
  site_id uuid references sites(id) on delete restrict,

  reason text,
  note text,

  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_by uuid references profiles(id) on delete set null,
  updated_at timestamptz not null default now(),

  constraint reporting_relationship_no_self_report check (employee_id <> manager_employee_id),
  constraint reporting_relationship_valid_range check (effective_to is null or effective_to >= effective_from)
);

-- Exactly one *current* relationship of a given type per employee.
create unique index if not exists reporting_relationships_one_current
  on employee_reporting_relationships(employee_id, relationship_type)
  where is_current;

create index if not exists reporting_relationships_employee_idx on employee_reporting_relationships(employee_id);
create index if not exists reporting_relationships_manager_idx on employee_reporting_relationships(manager_employee_id);
create index if not exists reporting_relationships_current_idx on employee_reporting_relationships(relationship_type, is_current) where is_current;
create index if not exists reporting_relationships_site_idx on employee_reporting_relationships(site_id);

drop trigger if exists trg_reporting_relationships_updated_at on employee_reporting_relationships;
create or replace function reporting_relationships_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
create trigger trg_reporting_relationships_updated_at
  before update on employee_reporting_relationships
  for each row execute function reporting_relationships_set_updated_at();

-- ── 2. CYCLE + SELF-REPORT GUARD (trusted, DB-level — never rely on the
--    UI alone). Self-report is already blocked by the check constraint
--    above; this trigger additionally rejects any new/updated *current*
--    edge that would create a cycle (the new manager is, directly or
--    transitively, already a report of the employee). Bounded walk
--    (10,000 hops) so a data anomaly can never hang the transaction. ──
create or replace function reporting_relationship_guard_cycle()
returns trigger language plpgsql as $$
declare
  visited uuid[] := array[]::uuid[];
  current_id uuid;
  hops int := 0;
begin
  if not new.is_current then
    return new;
  end if;
  current_id := new.manager_employee_id;
  loop
    hops := hops + 1;
    if hops > 10000 then
      raise exception 'reporting relationship guard: hop limit exceeded (possible existing cycle)';
    end if;
    if current_id is null then
      exit;
    end if;
    if current_id = new.employee_id then
      raise exception 'circular reporting relationship: % already appears above % in the chain', new.employee_id, new.manager_employee_id;
    end if;
    if current_id = any(visited) then
      exit; -- already-known cycle elsewhere in the graph; not this edge's fault
    end if;
    visited := array_append(visited, current_id);
    select err.manager_employee_id into current_id
      from employee_reporting_relationships err
      where err.employee_id = current_id
        and err.relationship_type = new.relationship_type
        and err.is_current
      limit 1;
  end loop;
  return new;
end;
$$;

drop trigger if exists trg_reporting_relationship_guard_cycle on employee_reporting_relationships;
create trigger trg_reporting_relationship_guard_cycle
  before insert or update on employee_reporting_relationships
  for each row execute function reporting_relationship_guard_cycle();

-- ── 3. AUTO-CLOSE THE PREVIOUS CURRENT RELATIONSHIP ── A manager change
--    is always "insert a new current row"; the previous one is preserved
--    as history, never overwritten. This trigger does that close-out
--    automatically so the unique index above never conflicts and the
--    call site never has to (and can't forget to) do it in two steps.
create or replace function reporting_relationship_close_previous()
returns trigger language plpgsql as $$
begin
  if new.is_current then
    update employee_reporting_relationships
      set is_current = false,
          effective_to = case when new.effective_from > effective_from then new.effective_from - 1 else effective_to end,
          updated_by = new.created_by,
          updated_at = now()
      where employee_id = new.employee_id
        and relationship_type = new.relationship_type
        and is_current
        and id <> new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_reporting_relationship_close_previous on employee_reporting_relationships;
create trigger trg_reporting_relationship_close_previous
  before insert on employee_reporting_relationships
  for each row execute function reporting_relationship_close_previous();

-- ── 4. ACTIVATE DUE (FUTURE-DATED) RELATIONSHIPS ── Callable by any
--    talento_humano write user (SECURITY DEFINER only to bypass RLS on
--    the read-then-write, not to escalate who may call it). The client
--    calls this whenever the Organización workspace loads so a
--    future-dated manager change becomes current exactly once its
--    effective date arrives, without a server cron. ──
create or replace function activate_due_reporting_relationships()
returns int language plpgsql security definer as $$
declare
  n int;
begin
  if not authorize('talento_humano', 'write') then
    raise exception 'not authorized';
  end if;
  with due as (
    select id from employee_reporting_relationships
    where not is_current
      and effective_to is null
      and effective_from <= current_date
  )
  update employee_reporting_relationships r
    set is_current = true
    from due
    where r.id = due.id;
  get diagnostics n = row_count;
  return n;
end;
$$;

-- ── 5. LEGACY SUPERVISOR REVIEW QUEUE ── `employees.supervisor_name`
--    (update24.sql) is preserved forever — nothing here deletes or
--    overwrites it. This table records, per employee, what happened
--    when the system tried to resolve that free-text name into a real
--    employee_id: matched (and which relationship row resulted),
--    ambiguous (more than one same-site active employee shares the
--    name — listed as candidates, nothing auto-selected), or unmatched
--    (no candidate found). A human resolves ambiguous/unmatched rows;
--    the system never guesses. ──
create table if not exists employee_supervisor_review (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid references employees(id) on delete cascade not null,
  legacy_supervisor_name text not null,

  match_status text not null default 'unmatched' check (match_status in (
    'unmatched', 'ambiguous', 'resolved', 'dismissed'
  )),
  candidate_employee_ids uuid[] not null default array[]::uuid[],

  resolved_manager_employee_id uuid references employees(id) on delete set null,
  resolved_relationship_id uuid references employee_reporting_relationships(id) on delete set null,
  resolved_by uuid references profiles(id) on delete set null,
  resolved_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique(employee_id, legacy_supervisor_name)
);

create index if not exists employee_supervisor_review_status_idx on employee_supervisor_review(match_status);

drop trigger if exists trg_supervisor_review_updated_at on employee_supervisor_review;
create trigger trg_supervisor_review_updated_at
  before update on employee_supervisor_review
  for each row execute function reporting_relationships_set_updated_at();

-- ── 6. ONE-TIME CONTROLLED LEGACY MAPPING ── Run once after this file
--    (safe to re-run — idempotent, `on conflict do nothing`, and skips
--    any employee that already has a current immediate-manager
--    relationship or an existing review row for that exact name).
--    Matching rule: case-insensitive, trimmed full-name match against
--    *other active employees*. Exactly one match → controlled mapping,
--    inserted as a real relationship. Zero or 2+ matches → queued for
--    human review, nothing invented.
--        select migrate_legacy_supervisors();
create or replace function migrate_legacy_supervisors()
returns table(matched int, ambiguous int, unmatched int) language plpgsql security definer as $$
declare
  rec record;
  candidates uuid[];
  new_rel_id uuid;
  n_matched int := 0;
  n_ambiguous int := 0;
  n_unmatched int := 0;
begin
  if not authorize('talento_humano', 'write') then
    raise exception 'not authorized';
  end if;

  for rec in
    select e.id as employee_id, trim(e.supervisor_name) as supervisor_name
    from employees e
    where e.supervisor_name is not null and trim(e.supervisor_name) <> ''
      and not exists (
        select 1 from employee_reporting_relationships r
        where r.employee_id = e.id and r.relationship_type = 'immediate_manager' and r.is_current
      )
      and not exists (
        select 1 from employee_supervisor_review q
        where q.employee_id = e.id and q.legacy_supervisor_name = trim(e.supervisor_name)
      )
  loop
    select array_agg(m.id) into candidates
    from employees m
    where m.id <> rec.employee_id
      and m.employee_status = 'active'
      and lower(trim(m.first_name || ' ' || m.last_name)) = lower(rec.supervisor_name);

    if candidates is null or array_length(candidates, 1) is null then
      insert into employee_supervisor_review (employee_id, legacy_supervisor_name, match_status, candidate_employee_ids)
      values (rec.employee_id, rec.supervisor_name, 'unmatched', array[]::uuid[])
      on conflict (employee_id, legacy_supervisor_name) do nothing;
      n_unmatched := n_unmatched + 1;
    elsif array_length(candidates, 1) = 1 then
      begin
        insert into employee_reporting_relationships (employee_id, manager_employee_id, relationship_type, effective_from, is_current, site_id, reason)
        values (rec.employee_id, candidates[1], 'immediate_manager', current_date, true,
                (select site_id from employees where id = rec.employee_id), 'Migrado desde supervisor_name (coincidencia única)')
        returning id into new_rel_id;
        insert into employee_supervisor_review (employee_id, legacy_supervisor_name, match_status, candidate_employee_ids, resolved_manager_employee_id, resolved_relationship_id, resolved_at)
        values (rec.employee_id, rec.supervisor_name, 'resolved', candidates, candidates[1], new_rel_id, now())
        on conflict (employee_id, legacy_supervisor_name) do nothing;
        n_matched := n_matched + 1;
      exception when others then
        -- Would-be self-report/cycle or another guard tripped — never invent
        -- a relationship through a workaround; queue it for a human instead.
        insert into employee_supervisor_review (employee_id, legacy_supervisor_name, match_status, candidate_employee_ids)
        values (rec.employee_id, rec.supervisor_name, 'ambiguous', candidates)
        on conflict (employee_id, legacy_supervisor_name) do nothing;
        n_ambiguous := n_ambiguous + 1;
      end;
    else
      insert into employee_supervisor_review (employee_id, legacy_supervisor_name, match_status, candidate_employee_ids)
      values (rec.employee_id, rec.supervisor_name, 'ambiguous', candidates)
      on conflict (employee_id, legacy_supervisor_name) do nothing;
      n_ambiguous := n_ambiguous + 1;
    end if;
  end loop;

  return query select n_matched, n_ambiguous, n_unmatched;
end;
$$;

-- ══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY — same talento_humano gate as the rest of the
-- module (see update19.sql / AUTHORIZATION.md).
-- ══════════════════════════════════════════════════════════════

alter table employee_reporting_relationships enable row level security;
alter table employee_supervisor_review enable row level security;

drop policy if exists "talento_humano read reporting relationships" on employee_reporting_relationships;
create policy "talento_humano read reporting relationships"
  on employee_reporting_relationships for select using (authorize('talento_humano', 'read'));

drop policy if exists "talento_humano write reporting relationships" on employee_reporting_relationships;
create policy "talento_humano write reporting relationships"
  on employee_reporting_relationships for insert with check (authorize('talento_humano', 'write'));

drop policy if exists "talento_humano update reporting relationships" on employee_reporting_relationships;
create policy "talento_humano update reporting relationships"
  on employee_reporting_relationships for update using (authorize('talento_humano', 'write'));

drop policy if exists "talento_humano read supervisor review" on employee_supervisor_review;
create policy "talento_humano read supervisor review"
  on employee_supervisor_review for select using (authorize('talento_humano', 'read'));

drop policy if exists "talento_humano write supervisor review" on employee_supervisor_review;
create policy "talento_humano write supervisor review"
  on employee_supervisor_review for insert with check (authorize('talento_humano', 'write'));

drop policy if exists "talento_humano update supervisor review" on employee_supervisor_review;
create policy "talento_humano update supervisor review"
  on employee_supervisor_review for update using (authorize('talento_humano', 'write'));

-- ══════════════════════════════════════════════════════════════
-- VERIFICATION — run after applying the file above.
-- ══════════════════════════════════════════════════════════════
-- 1) Tables + RLS exist:
--      select tablename, rowsecurity from pg_tables
--      where tablename in ('employee_reporting_relationships','employee_supervisor_review');
-- 2) One-time legacy migration (safe to re-run):
--      select * from migrate_legacy_supervisors();
-- 3) Review queue contents (what needs a human):
--      select * from employee_supervisor_review where match_status in ('unmatched','ambiguous');
-- 4) Self-report / cycle guard sanity check (expect an error, not a row):
--      insert into employee_reporting_relationships (employee_id, manager_employee_id)
--      values ('00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000');
-- 5) Activate any future-dated relationships whose date has arrived
--    (the client also calls this on every Organización load):
--      select activate_due_reporting_relationships();
