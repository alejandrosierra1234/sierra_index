-- ============================================
-- SIERRA INDEX — Update 6: Multiple images
-- Run in Supabase > SQL Editor
-- ============================================

alter table products
  add column if not exists image_urls text[] default '{}';

-- Migrate existing single image_url into the array
update products
  set image_urls = array[image_url]
  where image_url is not null
    and (image_urls is null or array_length(image_urls, 1) is null);
