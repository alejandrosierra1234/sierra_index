-- ══════════════════════════════════════════════════════════════
-- ORGANIZATIONAL MASTER DATA — stable codes + admin-managed naming
--
-- Companies/sites already exist as the single source of truth for
-- organizational naming (see update19.sql: countries → companies →
-- sites → employees). This migration:
--
--   1. Adds a stable `code` to companies (mirrors the `internal_code`
--      pattern already used on sites) so relationships and future
--      renames never depend on the display name.
--   2. Corrects the seeded company/site display name from
--      "Northern Spinning" to "Northern Textiles" — a plain UPDATE by
--      id/code, not a delete+reinsert, so employees, badges, and
--      capability grants pointing at this company/site are untouched.
--      badge_issuances.snapshot is intentionally NOT touched — it is
--      an immutable historical record of what a badge said at print
--      time and must keep reading whatever name was current then.
--   3. Adds admin-only write RLS on companies/sites so renaming
--      organizational data is enforced at the database, not just by
--      hiding the edit button in the UI.
--
-- Idempotent. Run in Supabase > SQL Editor.
-- ══════════════════════════════════════════════════════════════

-- 1. Stable short code on companies (independent of display name).
alter table companies add column if not exists code text;
create unique index if not exists companies_code_key on companies (code) where code is not null;

-- 2. Correct the display name. Matched by the CURRENT name because no
--    code exists yet on this row; every migration after this one
--    should match by `code = 'NT'` instead, never by name.
update companies
  set name = 'Northern Textiles',
      legal_name = 'Northern Textiles, S.A. de C.V.',
      code = 'NT'
  where name = 'Northern Spinning';

update sites
  set name = 'Northern Textiles'
  where company_id = (select id from companies where code = 'NT')
    and name = 'Northern Spinning';

-- 3. Admin-only write access on organizational master data. Read
--    access for all authenticated users is already granted in
--    update19.sql and is unchanged here.
drop policy if exists "platform admin can insert companies" on companies;
create policy "platform admin can insert companies"
  on companies for insert with check (authorize('platform', 'admin'));

drop policy if exists "platform admin can update companies" on companies;
create policy "platform admin can update companies"
  on companies for update using (authorize('platform', 'admin'));

drop policy if exists "platform admin can delete companies" on companies;
create policy "platform admin can delete companies"
  on companies for delete using (authorize('platform', 'admin'));

drop policy if exists "platform admin can insert sites" on sites;
create policy "platform admin can insert sites"
  on sites for insert with check (authorize('platform', 'admin'));

drop policy if exists "platform admin can update sites" on sites;
create policy "platform admin can update sites"
  on sites for update using (authorize('platform', 'admin'));

drop policy if exists "platform admin can delete sites" on sites;
create policy "platform admin can delete sites"
  on sites for delete using (authorize('platform', 'admin'));
