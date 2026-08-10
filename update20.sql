-- ══════════════════════════════════════════════════════════════
-- Update 20: Employee import "Needs Review" flag
--
-- Backs the safe-upsert import workflow (§7 of the badge management
-- spec): uploading a new employee database must NEVER silently delete
-- or overwrite employees missing from the latest file. Instead, any
-- existing employee whose employee_code is not present in the most
-- recent import is flagged for manual review — same principle as
-- badge issuances never being deleted on reprint.
--
-- review_reason mirrors the reasons listed in the spec: termination,
-- transfer, missing record, import problem, other.
--
-- Idempotent. Run in Supabase > SQL Editor, after update19.sql.
-- ══════════════════════════════════════════════════════════════

alter table employees add column if not exists needs_review boolean not null default false;
alter table employees add column if not exists review_reason text;

alter table employees drop constraint if exists employees_review_reason_check;
alter table employees add constraint employees_review_reason_check
  check (review_reason is null or review_reason in (
    'termination', 'transfer', 'missing_record', 'import_problem', 'other'
  ));

create index if not exists idx_employees_needs_review on employees(site_id, needs_review) where needs_review;
