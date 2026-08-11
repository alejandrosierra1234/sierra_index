-- ══════════════════════════════════════════════════════════════
-- YARN LABEL CREATOR — opaque, non-sequential Record ID
-- Run this in the Supabase SQL Editor
--
-- Replaces next_yarn_id() (update22.sql), which minted sequential,
-- human-readable "YRN-000001" style codes. The physical yarn label
-- now carries a barcode + opaque 8-character Record ID instead: an
-- identifier that is unique, immutable, and deliberately non-semantic
-- (never a count, date, plant, or sequence a scanned sample could be
-- reverse-engineered from).
--
-- The database, not the client, is the final authority on uniqueness:
-- next_yarn_record_id() generates a candidate, checks it against
-- existing yarn codes, and retries on the (very unlikely) collision —
-- the same guarantee a unique index gives, made explicit so the
-- generator itself never has to trust a client-side assumption.
-- ══════════════════════════════════════════════════════════════

-- Alphabet excludes visually ambiguous characters (I, O, 0, 1) so a
-- printed/scanned code is never misread.
-- Scoped to division = 'yarn' only — other divisions (fabric, fiber,
-- garment) keep their own existing code schemes and are not touched.
create unique index if not exists products_code_yarn_unique
  on products (code)
  where division = 'yarn';

create or replace function generate_opaque_yarn_code()
returns text language plpgsql as $$
declare
  alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  out_code text := '';
  i int;
begin
  for i in 1..8 loop
    out_code := out_code || substr(alphabet, (floor(random() * length(alphabet)))::int + 1, 1);
  end loop;
  return out_code;
end;
$$;

create or replace function next_yarn_record_id()
returns text language plpgsql as $$
declare
  candidate text;
  tries int := 0;
begin
  loop
    candidate := generate_opaque_yarn_code();
    tries := tries + 1;
    if not exists (select 1 from products where division = 'yarn' and code = candidate) then
      return candidate;
    end if;
    if tries > 50 then
      raise exception 'Could not generate a unique yarn record ID after % attempts', tries;
    end if;
  end loop;
end;
$$;

-- next_yarn_id()/yarn_id_seq (update22.sql) are left in place rather
-- than dropped — existing "YRN-######" codes already printed on
-- physical inventory remain valid, permanent identifiers for the
-- records that carry them (§19: a Record ID is immutable once
-- assigned). Only *new* yarn records generated from this point on use
-- next_yarn_record_id().
