-- ── ROLES: admin / editor / user (vendedor kept for backwards compat)

-- Add email to profiles so admin can see who is who
alter table profiles add column if not exists email text;

-- Relax role constraint to allow admin + user
alter table profiles drop constraint if exists profiles_role_check;
alter table profiles add constraint profiles_role_check
  check (role in ('admin', 'editor', 'user', 'vendedor'));

-- Security-definer helpers (avoids RLS recursion)
create or replace function is_admin() returns boolean
  language plpgsql security definer stable as $$
  begin return exists (select 1 from profiles where id = auth.uid() and role = 'admin'); end; $$;

create or replace function is_editor_or_above() returns boolean
  language plpgsql security definer stable as $$
  begin return exists (select 1 from profiles where id = auth.uid() and role in ('admin','editor')); end; $$;

-- ── PROFILES RLS ──────────────────────────────────────────────
drop policy if exists "Users can view own profile"         on profiles;
drop policy if exists "Editors can view all profiles"      on profiles;
drop policy if exists "Admin and editors can view all profiles" on profiles;
drop policy if exists "Users can update own profile"       on profiles;
drop policy if exists "Admin can update any profile"       on profiles;

-- Anyone authenticated can see profiles (needed for comments author names)
create policy "Authenticated can view profiles" on profiles
  for select using (auth.role() = 'authenticated');

-- Users update own profile; admin updates any
create policy "Users can update own profile" on profiles
  for update using (id = auth.uid());

create policy "Admin can update any profile" on profiles
  for update using (is_admin());

-- ── LOGIN LOGS RLS ────────────────────────────────────────────
drop policy if exists "Editors can view all login logs" on login_logs;
drop policy if exists "Admin can view all login logs"   on login_logs;

create policy "Admin can view all login logs" on login_logs
  for select using (is_admin());

-- ── PRODUCTS RLS (editor + admin can insert/update/delete) ────
drop policy if exists "Editors can insert products"  on products;
drop policy if exists "Editors can update products"  on products;
drop policy if exists "Editors can delete products"  on products;

create policy "Editors can insert products" on products
  for insert with check (is_editor_or_above());

create policy "Editors can update products" on products
  for update using (is_editor_or_above());

create policy "Editors can delete products" on products
  for delete using (is_editor_or_above());

-- ── SET YOUR ACCOUNT AS ADMIN ─────────────────────────────────
-- Run this separately after the above (replace with your email):
-- update profiles set role = 'admin'
--   where id = (select id from auth.users where email = 'alejotorres.chuy@gmail.com');
