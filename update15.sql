-- ══════════════════════════════════════════════════════════════
-- COLECCIONES — fecha límite (deadline)
--
-- Adds an optional deadline to a collection, settable by any member
-- (owner or invited collaborator) at any point — not just at
-- submission — via the same is_collection_member() authorization
-- already used for rename_collection/categories.
--
-- Run AFTER update12.sql (defines is_collection_member). Idempotent.
-- ══════════════════════════════════════════════════════════════

alter table sample_collections add column if not exists deadline date;

create or replace function set_collection_deadline(p_id uuid, p_deadline date)
returns void language plpgsql security definer as $$
begin
  if not is_collection_member(p_id) then raise exception 'not authorized on this collection'; end if;
  update sample_collections set deadline = p_deadline, updated_at = now() where id = p_id;
end;
$$;
