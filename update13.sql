-- ══════════════════════════════════════════════════════════════
-- COLECCIONES — rediseño como espacio de trabajo propio
--
-- Ya no es un "carrito": cada colección (borrador o enviada) tiene su
-- propio nombre editable, categorías internas para agrupar muestras,
-- y un hilo de comentarios — igual que un producto ya tenía. Cualquier
-- colaborador de la colección (dueño, invitado, o alguien con
-- autoridad amplia de customer_service/warehouse) puede administrar
-- todo esto vía is_collection_member(), definida en update12.sql.
--
-- Ejecutar DESPUÉS de update12.sql. Idempotente.
-- ══════════════════════════════════════════════════════════════

-- 1. Categorías — carpetas dentro de una colección para agrupar muestras
--    ("Tops", "Bottoms", "Prioridad alta"…). Puramente organizativas.
create table if not exists collection_categories (
  id            uuid primary key default gen_random_uuid(),
  collection_id uuid references sample_collections(id) on delete cascade not null,
  name          text not null,
  created_by    uuid references profiles(id),
  created_at    timestamptz default now()
);
alter table collection_categories enable row level security;

drop policy if exists "authenticated can view categories" on collection_categories;
create policy "authenticated can view categories"
  on collection_categories for select using (auth.uid() is not null);

drop policy if exists "members can create categories" on collection_categories;
create policy "members can create categories"
  on collection_categories for insert with check (is_collection_member(collection_id));

drop policy if exists "members can rename categories" on collection_categories;
create policy "members can rename categories"
  on collection_categories for update using (is_collection_member(collection_id));

drop policy if exists "members can delete categories" on collection_categories;
create policy "members can delete categories"
  on collection_categories for delete using (is_collection_member(collection_id));

-- Each sample can optionally sit in one category of its own collection.
alter table samples add column if not exists category_id uuid references collection_categories(id) on delete set null;

-- Moving an item between categories needs to bypass the samples UPDATE
-- policy (which only allows the requester or manage_status/dispatch) so
-- that ANY collection collaborator — not just whoever added the item —
-- can reorganize it.
create or replace function set_item_category(
  p_sample_id   uuid,
  p_category_id uuid default null
) returns void language plpgsql security definer as $$
declare v_collection uuid;
begin
  select collection_id into v_collection from samples where id = p_sample_id;
  if v_collection is null then raise exception 'item not found'; end if;
  if not is_collection_member(v_collection) then raise exception 'not authorized on this collection'; end if;
  if p_category_id is not null and not exists (
    select 1 from collection_categories where id = p_category_id and collection_id = v_collection
  ) then
    raise exception 'category does not belong to this collection';
  end if;
  update samples set category_id = p_category_id where id = p_sample_id;
end;
$$;

-- 2. Rename a collection at any point in its life (draft or already
--    submitted) — any collaborator, not just the original requester.
create or replace function rename_collection(p_id uuid, p_name text)
returns void language plpgsql security definer as $$
begin
  if not is_collection_member(p_id) then raise exception 'not authorized on this collection'; end if;
  update sample_collections set name = nullif(btrim(p_name), ''), updated_at = now() where id = p_id;
end;
$$;

-- 3. Comments — a discussion thread per collection, same shape as the
--    existing product_comments (update3.sql), gated by collection
--    membership instead of a role check.
create table if not exists collection_comments (
  id            uuid primary key default gen_random_uuid(),
  collection_id uuid references sample_collections(id) on delete cascade not null,
  user_id       uuid references profiles(id) on delete cascade,
  comment       text not null,
  created_at    timestamptz default now()
);
alter table collection_comments enable row level security;

drop policy if exists "authenticated can view collection comments" on collection_comments;
create policy "authenticated can view collection comments"
  on collection_comments for select using (auth.uid() is not null);

drop policy if exists "members can add collection comments" on collection_comments;
create policy "members can add collection comments"
  on collection_comments for insert with check (user_id = auth.uid() and is_collection_member(collection_id));

drop policy if exists "members can delete collection comments" on collection_comments;
create policy "members can delete collection comments"
  on collection_comments for delete using (
    user_id = auth.uid()
    or authorize('customer_service','manage_status')
    or authorize('platform','admin')
  );
