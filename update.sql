-- ============================================
-- SIERRA INDEX — Update schema
-- Run in Supabase > SQL Editor
-- ============================================

-- Add new columns to products
alter table products add column if not exists lot text;
alter table products add column if not exists image_url text;
alter table products add column if not exists country text default 'Honduras';

-- Storage bucket for product images
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Storage policies
create policy "Editors can upload images"
on storage.objects for insert
with check (
  bucket_id = 'product-images'
  and auth.role() = 'authenticated'
  and exists (select 1 from profiles where id = auth.uid() and role = 'editor')
);

create policy "Authenticated users can view images"
on storage.objects for select
using (bucket_id = 'product-images' and auth.role() = 'authenticated');
