-- ============================================
-- Add company + country fields directly to employees
-- (independent of the site → company → country chain,
--  so a single employee record can carry its own values)
-- ============================================

alter table employees add column if not exists company text;
alter table employees add column if not exists country text;
