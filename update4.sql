-- ============================================
-- SIERRA INDEX — Update 4: Storage policies
-- Run in Supabase > SQL Editor
-- Also go to Storage > product-images bucket >
-- make it Public (toggle "Public bucket" ON)
-- ============================================

-- Allow authenticated users (editors) to upload product images
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

-- Allow authenticated users to upload
create policy "Authenticated users can upload product images"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images'
    and auth.role() = 'authenticated'
  );

-- Allow public read (so image URLs work without auth)
create policy "Public read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Allow editors to delete images
create policy "Editors can delete product images"
  on storage.objects for delete
  using (
    bucket_id = 'product-images'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'editor')
  );
