-- ============================================
-- SIERRA INDEX — Update 18: Default module / division preference
--
-- Backs the Account Mega Menu's "Defaults" section (Global Top Bar
-- redesign). Mirrors the existing ui_language column (update7.sql-era
-- pattern): a plain nullable preference on the user's own profile row,
-- read on login as a routing fallback (lower priority than the deep
-- link / session-route restore already in enterApp()) and written by
-- the account menu's Defaults picker.
--
-- No new RLS policy needed — "Users can update own profile"
-- (id = auth.uid()) from update7.sql already covers updates to these
-- new columns on the caller's own row.
-- ============================================

alter table profiles add column if not exists default_module text;
alter table profiles add column if not exists default_division text;

alter table profiles drop constraint if exists profiles_default_module_check;
alter table profiles add constraint profiles_default_module_check
  check (default_module is null or default_module in ('samples', 'talento_humano', 'administracion'));

alter table profiles drop constraint if exists profiles_default_division_check;
alter table profiles add constraint profiles_default_division_check
  check (default_division is null or default_division in ('fiber', 'yarn', 'fabric', 'chemicals', 'garment'));
