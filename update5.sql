-- ============================================
-- SIERRA INDEX — Update 5: Add image_url column
-- Run in Supabase > SQL Editor
-- ============================================

alter table products
  add column if not exists image_url text;
