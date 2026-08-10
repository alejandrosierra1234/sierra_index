-- ══════════════════════════════════════════════════════════════
-- YARN LABEL CREATOR — atomic Yarn ID generator
-- Run this in the Supabase SQL Editor
--
-- Mirrors the existing next_sample_id() / next_collection_id()
-- pattern (samples_schema.sql): a sequence + a thin function that
-- reads it. No new tables — the Yarn Inventory record IS the
-- products row (division = 'yarn'); this only gives it a unique,
-- human-readable, barcode-safe identifier: YRN-000001, YRN-000002…
-- ══════════════════════════════════════════════════════════════

create sequence if not exists yarn_id_seq start 1;

-- If yarn products already carry manually-typed "YRN-######" codes,
-- start the sequence after the highest one so next_yarn_id() never
-- collides with existing inventory.
do $$
declare max_n integer;
begin
  select coalesce(max((regexp_match(code, '^YRN-(\d+)$'))[1]::int), 0)
    into max_n
    from products
   where division = 'yarn' and code ~ '^YRN-\d+$';
  if max_n > 0 then
    perform setval('yarn_id_seq', max_n, true);
  end if;
end $$;

create or replace function next_yarn_id()
returns text language plpgsql as $$
begin
  return 'YRN-' || lpad(nextval('yarn_id_seq')::text, 6, '0');
end;
$$;
