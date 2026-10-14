-- ══════════════════════════════════════════════════════════════
-- ACCOUNT ↔ COLLABORATOR ARCHITECTURE
--
-- Establishes: Collaborator (employees, Talento Humano source of truth)
--              → optional Index Account (profiles) → Roles & Permissions
--
-- Before: `profiles` (Index accounts) and `employees` (Talento Humano /
-- Colaboradores) were two unrelated directories of people, matched only
-- by eyeballing names/emails in the UI.
--
-- After: `profiles.employee_id` is a proper FK into `employees`, and
-- `profiles.account_type` explicitly classifies every account as
-- 'employee' (must be linked), 'system_admin' (intentionally NOT linked
-- — the platform-owner exception), or 'external' (also not linked —
-- vendors/contractors with Index access but no HR record).
--
-- Additive and idempotent. Nothing is dropped. Run in Supabase > SQL
-- Editor. Safe to run multiple times.
-- ══════════════════════════════════════════════════════════════

-- ── 1. SCHEMA: account classification + collaborator link ──────

alter table profiles add column if not exists employee_id uuid references employees(id) on delete restrict;
alter table profiles add column if not exists account_type text;
alter table profiles add column if not exists account_status text not null default 'active';

alter table profiles drop constraint if exists profiles_account_type_check;
alter table profiles add constraint profiles_account_type_check
  check (account_type is null or account_type in ('employee', 'system_admin', 'external'));

alter table profiles drop constraint if exists profiles_account_status_check;
alter table profiles add constraint profiles_account_status_check
  check (account_status in ('pending', 'active', 'suspended', 'disabled'));

-- SECURITY CONSTRAINT (spec §6/§7): a null employee_id must never imply
-- admin, and an 'employee' account must always be linked. Enforced here,
-- not just in the client:
--   employee        → employee_id required
--   system_admin /
--   external        → employee_id must stay null (the admin/external
--                      exception is an explicit account_type, never an
--                      inferred one)
--   null (legacy,
--   not yet
--   classified)      → unconstrained, pending migration review
alter table profiles drop constraint if exists profiles_account_type_link_check;
alter table profiles add constraint profiles_account_type_link_check
  check (
    account_type is null
    or (account_type = 'employee' and employee_id is not null)
    or (account_type in ('system_admin', 'external') and employee_id is null)
  );

-- One collaborator → at most one Index account (spec §3/§7).
create unique index if not exists profiles_employee_id_unique
  on profiles(employee_id) where employee_id is not null;

comment on column profiles.employee_id is 'FK to employees (Talento Humano / Colaboradores). Single source of truth for HR identity — never duplicate name/company/site/department/photo onto profiles.';
comment on column profiles.account_type is 'employee (requires employee_id) | system_admin (platform-owner exception, no collaborator link) | external (vendor/contractor, no collaborator link) | null = legacy account pending migration review.';
comment on column profiles.account_status is 'Index account lifecycle: pending | active | suspended | disabled. Independent of employees.employee_status — see account_migration_review / UI for the cross-check.';

-- ── 2. MIGRATION REVIEW QUEUE (spec §8/§9) ──────────────────────
-- Legacy accounts that can't be linked automatically and safely land
-- here for a human to confirm — never auto-linked on a name guess.

create table if not exists account_migration_review (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  suggested_employee_id uuid references employees(id) on delete set null,
  match_confidence text not null check (match_confidence in ('probable', 'none')),
  matched_on text,
  status text not null default 'pending' check (status in ('pending', 'linked', 'dismissed')),
  created_at timestamptz default now(),
  resolved_by uuid references profiles(id) on delete set null,
  resolved_at timestamptz,
  unique(profile_id)
);

alter table account_migration_review enable row level security;
drop policy if exists "platform admins manage migration review" on account_migration_review;
create policy "platform admins manage migration review"
  on account_migration_review for all
  using (authorize('platform', 'admin'))
  with check (authorize('platform', 'admin'));

-- ── 3. ONE-TIME DATA MIGRATION (idempotent — only touches rows that ──
--       haven't been classified yet, i.e. account_type is still null) ─

-- 3a. Exact match: unambiguous corporate-email match, employee not
--     already linked to someone else. Safe to link automatically.
update profiles p
set employee_id = e.id, account_type = 'employee'
from employees e
where p.account_type is null
  and p.email is not null and e.email is not null
  and lower(trim(p.email)) = lower(trim(e.email))
  and not exists (select 1 from profiles p3 where p3.employee_id = e.id)
  and (select count(*) from employees e2 where lower(trim(e2.email)) = lower(trim(p.email))) = 1
  and (select count(*) from profiles p2 where lower(trim(p2.email)) = lower(trim(p.email))) = 1;

-- 3b. The one intentional exception: the existing platform administrator
--     account (Alejandro Torres). Preserved as-is — same auth user, same
--     grants — just explicitly classified as system_admin with no
--     collaborator link, instead of an accidental "null employee_id".
--     This is a one-time data-migration statement, not a runtime
--     name/email check — the exception lives in account_type, not in
--     application logic.
update profiles
set account_type = 'system_admin', employee_id = null
where account_type is null
  and (
    lower(trim(full_name)) = 'alejandro torres'
    or lower(trim(email)) = 'alejotorres.chuy@gmail.com'
  );

-- 3c. Everything else that still isn't classified goes to the review
--     queue instead of being silently linked. A same-name collaborator
--     not already linked is surfaced as "probable" (needs confirmation);
--     no candidate at all is "none" (flagged, left unlinked).
insert into account_migration_review (profile_id, suggested_employee_id, match_confidence, matched_on)
select p.id, best.employee_id,
       case when best.employee_id is not null then 'probable' else 'none' end,
       case when best.employee_id is not null then 'name' else null end
from profiles p
left join lateral (
  select e.id as employee_id
  from employees e
  where not exists (select 1 from profiles p2 where p2.employee_id = e.id)
    and (
      lower(trim(p.full_name)) = lower(trim(e.first_name || ' ' || e.last_name))
      or lower(coalesce(p.full_name, '')) ilike '%' || lower(e.first_name) || '%' || lower(e.last_name) || '%'
    )
  limit 1
) best on true
where p.account_type is null
  and not exists (select 1 from account_migration_review r where r.profile_id = p.id)
on conflict (profile_id) do nothing;

-- ── 4. PROTECT PRIVILEGED PROFILE FIELDS (spec §21/§22) ─────────
-- RLS's "Admin can update any profile" / "Users can update own profile"
-- policies (update9.sql) are row-level only — they don't stop a user
-- from writing role/account_type/employee_id/account_status on their
-- OWN row. This closes that gap with a column-level guard:
--   - a request coming through PostgREST as an authenticated, non-admin
--     user can never change these four columns on ANY row (their own
--     included);
--   - account_type = 'system_admin' can never be entered or left via
--     the app AT ALL (even by a platform admin) — only via direct
--     database access (SQL editor / migration), which is exactly how
--     the Alejandro Torres exception above was created;
--   - server-side contexts with no end-user JWT (service-role edge
--     functions, the SQL editor) are unaffected — auth.uid() is null
--     there, and those callers are already fully trusted (service-role
--     bypasses RLS entirely; this only adds a trigger-level guard for
--     the authenticated/anon roles PostgREST uses).
create or replace function protect_profile_privileged_fields()
returns trigger language plpgsql security definer as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    return new; -- trusted server-side context (service role / SQL editor)
  end if;

  if (old.account_type is distinct from new.account_type and (old.account_type = 'system_admin' or new.account_type = 'system_admin')) then
    raise exception 'system_admin account_type can only be assigned or changed via direct database access';
  end if;

  if authorize('platform', 'admin') then
    return new; -- platform admins may still manage role/employee_id/account_status for OTHER accounts
  end if;

  if new.role is distinct from old.role
     or new.account_type is distinct from old.account_type
     or new.employee_id is distinct from old.employee_id
     or new.account_status is distinct from old.account_status then
    raise exception 'not authorized to modify privileged profile fields';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_protect_profile_privileged_fields on profiles;
create trigger trg_protect_profile_privileged_fields
  before update on profiles
  for each row execute function protect_profile_privileged_fields();

-- ── 5. EMPLOYEES RLS: platform admins may browse Colaboradores to ──
--       create/manage Index access, and any account may read its OWN
--       linked collaborator record — without opening the whole table
--       to every authenticated Index user (spec §23).
drop policy if exists "talento_humano read employees" on employees;
create policy "talento_humano read employees"
  on employees for select using (
    authorize('talento_humano', 'read')
    or authorize('platform', 'admin')
    or id = (select employee_id from profiles where id = auth.uid())
  );

-- ── 6. Make the row-level admin gate capability-aware ────────────
-- "Admin can update any profile" (update9.sql) used is_admin(), which
-- only recognizes the legacy profiles.role = 'admin' flag — a platform
-- admin who only holds a capability_grants row (no legacy role) could
-- see the Equipo management controls but have every write on someone
-- else's profile silently rejected by RLS. authorize('platform','admin')
-- is a strict superset (it already falls back to the legacy role check
-- internally), so this is additive, not a behavior change for existing
-- legacy admins.
drop policy if exists "Admin can update any profile" on profiles;
create policy "Admin can update any profile" on profiles
  for update using (authorize('platform', 'admin'));
-- "Users can update own profile" stays row-level only; the trigger
-- above is the column-level backstop that makes both policies safe for
-- role/account_type/employee_id/account_status.
