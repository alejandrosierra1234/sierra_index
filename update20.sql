-- ============================================
-- Add company field to products (lots)
-- ============================================

alter table products add column if not exists company text;
