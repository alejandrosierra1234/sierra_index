-- ══════════════════════════════════════════════════════════════
-- MUESTRAS — colecciones colaborativas en borrador ("draft")
--
-- Hoy sampleCart vive solo en localStorage: nadie más puede verlo,
-- y sample_collections únicamente existe una vez que se envía el
-- pedido (create_sample_collection es atómico). Esto hace imposible
-- construir una colección en equipo durante varios días antes de
-- enviarla — el escenario de Servicio al Cliente preparando una
-- visita de cliente.
--
-- Esta migración introduce el estado 'draft': una sample_collections
-- persistida desde el primer producto agregado, editable por el
-- dueño y cualquier colaborador invitado (collection_collaborators
-- ya soporta invitar sobre una colección existente, sin importar su
-- status), y que solo se convierte en 'requested' al enviarla.
--
-- No requiere cambios de esquema: status no tiene CHECK constraint.
-- Ejecutar en Supabase > SQL Editor. Idempotente.
-- ══════════════════════════════════════════════════════════════

-- Shared authorization check: is this user allowed to read/edit this
-- collection's draft? (owner, invited collaborator, or someone holding
-- broad customer_service/warehouse authority.)
create or replace function is_collection_member(p_collection uuid)
returns boolean language plpgsql security definer stable as $$
declare v_uid uuid := auth.uid();
begin
  if v_uid is null then return false; end if;
  return exists (
    select 1 from sample_collections c
    where c.id = p_collection and (
      c.requested_by = v_uid
      or exists (select 1 from collection_collaborators cc where cc.collection_id = c.id and cc.user_id = v_uid)
    )
  ) or authorize('customer_service','write') or authorize('warehouse','dispatch');
end;
$$;

-- Creates an empty draft collection. Called the first time a user adds a
-- product to their cart.
create or replace function create_draft_collection(
  p_name     text default null,
  p_customer text default null
) returns jsonb language plpgsql security definer as $$
declare
  v_uid uuid := auth.uid();
  v_ref text;
  v_id  uuid;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  v_ref := next_collection_id();
  insert into sample_collections (collection_id, name, customer, status, requested_by)
    values (v_ref, p_name, p_customer, 'draft', v_uid)
    returning id into v_id;
  return jsonb_build_object('collection_id', v_id, 'collection_ref', v_ref);
end;
$$;

-- Adds one product to a draft collection.
create or replace function add_draft_item(
  p_collection_id uuid,
  p_product_id    uuid,
  p_sample_type   text,
  p_quantity      integer default 1
) returns jsonb language plpgsql security definer as $$
declare
  v_uid       uuid := auth.uid();
  v_status    text;
  v_sample_id text;
  v_id        uuid;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  select status into v_status from sample_collections where id = p_collection_id;
  if v_status is null then raise exception 'collection not found'; end if;
  if v_status <> 'draft' then raise exception 'this collection was already submitted'; end if;
  if not is_collection_member(p_collection_id) then raise exception 'not authorized on this collection'; end if;

  v_sample_id := next_sample_id();
  insert into samples (sample_id, product_id, sample_type, quantity, status, requested_by, collection_id)
    values (v_sample_id, p_product_id, p_sample_type, coalesce(p_quantity, 1), 'draft', v_uid, p_collection_id)
    returning id into v_id;
  return jsonb_build_object('id', v_id, 'sample_id', v_sample_id);
end;
$$;

-- Edits a draft item's type/quantity (any collaborator, not just whoever added it).
create or replace function update_draft_item(
  p_id          uuid,
  p_sample_type text default null,
  p_quantity    integer default null
) returns void language plpgsql security definer as $$
declare
  v_collection uuid;
  v_status     text;
begin
  select collection_id into v_collection from samples where id = p_id;
  if v_collection is null then raise exception 'item not found'; end if;
  select status into v_status from sample_collections where id = v_collection;
  if v_status <> 'draft' then raise exception 'this collection was already submitted'; end if;
  if not is_collection_member(v_collection) then raise exception 'not authorized on this collection'; end if;
  update samples set
    sample_type = coalesce(p_sample_type, sample_type),
    quantity    = coalesce(p_quantity, quantity),
    updated_at  = now()
  where id = p_id;
end;
$$;

-- Removes an item from a draft.
create or replace function remove_draft_item(p_id uuid)
returns void language plpgsql security definer as $$
declare
  v_collection uuid;
  v_status     text;
begin
  select collection_id into v_collection from samples where id = p_id;
  if v_collection is null then return; end if;
  select status into v_status from sample_collections where id = v_collection;
  if v_status <> 'draft' then raise exception 'this collection was already submitted'; end if;
  if not is_collection_member(v_collection) then raise exception 'not authorized on this collection'; end if;
  delete from samples where id = p_id;
end;
$$;

-- Abandons a draft entirely (its items go with it).
create or replace function discard_draft_collection(p_id uuid)
returns void language plpgsql security definer as $$
declare v_status text;
begin
  select status into v_status from sample_collections where id = p_id;
  if v_status is null then return; end if;
  if v_status <> 'draft' then raise exception 'only draft collections can be discarded'; end if;
  if not is_collection_member(p_id) then raise exception 'not authorized on this collection'; end if;
  delete from samples where collection_id = p_id;
  delete from sample_collections where id = p_id;
end;
$$;

-- Fills in delivery details and submits the draft — the ONLY place a
-- draft becomes 'requested'. Mirrors create_sample_collection's fields
-- and event logging, but on an already-existing collection + samples.
create or replace function submit_draft_collection(
  p_id        uuid,
  p_customer  text,
  p_priority  text,
  p_delivery  text,
  p_recipient text,
  p_address   text,
  p_notes     text,
  p_name      text default null
) returns jsonb language plpgsql security definer as $$
declare
  v_uid         uuid := auth.uid();
  v_name        text;
  v_status      text;
  v_ref         text;
  v_count       integer;
  v_destination text;
  v_reason      text;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  select status, collection_id into v_status, v_ref from sample_collections where id = p_id;
  if v_status is null then raise exception 'collection not found'; end if;
  if v_status <> 'draft' then raise exception 'this collection was already submitted'; end if;
  if not is_collection_member(p_id) then raise exception 'not authorized on this collection'; end if;

  select count(*) into v_count from samples where collection_id = p_id and status = 'draft';
  if v_count = 0 then raise exception 'this collection is empty'; end if;
  if p_recipient is null or btrim(p_recipient) = '' then raise exception 'recipient is required'; end if;

  select coalesce(full_name, 'User') into v_name from profiles where id = v_uid;
  v_destination := case when p_delivery = 'Pickup' then 'Pickup · ' || p_recipient
                        else p_delivery || ' → ' || p_address || ' · Attn: ' || p_recipient end;
  v_reason := case when p_priority = 'urgent' then 'Urgent request' else 'Sample request' end;

  update sample_collections set
    name = coalesce(p_name, name), customer = p_customer, priority = p_priority,
    delivery_method = p_delivery, recipient = p_recipient, address = p_address,
    notes = p_notes, status = 'requested', updated_at = now()
  where id = p_id;

  with updated as (
    update samples set
      customer = p_customer, destination = v_destination, reason = v_reason,
      notes = p_notes, status = 'requested', updated_at = now()
    where collection_id = p_id and status = 'draft'
    returning id, sample_id
  )
  insert into sample_events (sample_id, event_type, event_label, event_data, created_by)
    select id, 'status_change', 'Requested by ' || v_name, '{"status":"requested"}'::jsonb, v_uid
    from updated;

  return jsonb_build_object(
    'collection_id', p_id, 'collection_ref', v_ref,
    'items', (select coalesce(jsonb_agg(jsonb_build_object('id', id, 'sample_id', sample_id)), '[]'::jsonb)
              from samples where collection_id = p_id and status = 'requested')
  );
end;
$$;

-- "Start from an existing collection" — copies every item of a past
-- collection into a brand-new draft the caller owns, so a recurring
-- customer visit doesn't mean rebuilding the list from scratch.
create or replace function clone_collection_to_draft(p_source_id uuid)
returns jsonb language plpgsql security definer as $$
declare
  v_uid    uuid := auth.uid();
  v_src    sample_collections%rowtype;
  v_ref    text;
  v_new_id uuid;
  r        record;
  v_sample_id text;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  select * into v_src from sample_collections where id = p_source_id;
  if v_src.id is null then raise exception 'source collection not found'; end if;

  v_ref := next_collection_id();
  insert into sample_collections (collection_id, name, customer, status, requested_by)
    values (v_ref, 'Copy of ' || coalesce(v_src.name, v_src.collection_id), v_src.customer, 'draft', v_uid)
    returning id into v_new_id;

  for r in select product_id, sample_type, quantity from samples where collection_id = p_source_id loop
    v_sample_id := next_sample_id();
    insert into samples (sample_id, product_id, sample_type, quantity, status, requested_by, collection_id)
      values (v_sample_id, r.product_id, r.sample_type, r.quantity, 'draft', v_uid, v_new_id);
  end loop;

  return jsonb_build_object('collection_id', v_new_id, 'collection_ref', v_ref);
end;
$$;
