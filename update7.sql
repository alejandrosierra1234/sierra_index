-- ============================================
-- SIERRA INDEX — Update 7: Profile avatars + RLS
-- Run in Supabase > SQL Editor
-- ============================================

-- Add avatar_url to profiles
alter table profiles
  add column if not exists avatar_url text;

-- Fix profiles RLS: users read only their own row,
-- editors can read all (needed for "requested by" in requests table)
drop policy if exists "Users can view own profile" on profiles;
drop policy if exists "Editors can view all profiles" on profiles;

create policy "Users can view own profile"
  on profiles for select
  using (id = auth.uid());

create policy "Editors can view all profiles"
  on profiles for select
  using (exists (select 1 from profiles where id = auth.uid() and role = 'editor'));

-- Users can update their own profile (name, avatar)
drop policy if exists "Users can update own profile" on profiles;
create policy "Users can update own profile"
  on profiles for update
  using (id = auth.uid());

-- Storage: allow authenticated users to upload their own avatar
create policy "Users can upload own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images'
    and auth.role() = 'authenticated'
  );
