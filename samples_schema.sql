-- ══════════════════════════════════════════════════════════════
-- SIERRA INDEX — Sample Intelligence Platform Schema
-- Run this in the Supabase SQL Editor
-- ══════════════════════════════════════════════════════════════

-- 1. Sequence for unique, incrementing sample numbers
create sequence if not exists sample_seq start 1;

-- 2. Function that atomically generates the next SMP-YYYY-NNNNNN
create or replace function next_sample_id()
returns text language plpgsql as $$
begin
  return 'SMP-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('sample_seq')::text, 6, '0');
end;
$$;

-- 3. Main samples table (one row per physical sample)
create table if not exists samples (
  id              uuid primary key default gen_random_uuid(),
  sample_id       text unique not null,            -- SMP-2026-000001
  product_id      uuid references products(id) on delete set null,
  sample_type     text not null,                   -- Hanger, Yard, Cone, Skein …
  quantity        integer default 1,
  customer        text,
  destination     text,
  reason          text,
  notes           text,
  status          text default 'requested',        -- see lifecycle below
  requested_by    uuid references auth.users(id),
  approved_by     uuid references auth.users(id),
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- 3b. requested_by only had a FK to auth.users, so PostgREST couldn't
-- resolve the `profiles!requested_by(...)` embeds the app queries with
-- (error PGRST200: "Could not find a relationship between 'samples' and
-- 'profiles'"). Add an explicit FK to profiles(id) so the embed works —
-- safe because every profiles.id is itself a valid auth.users.id.
alter table samples drop constraint if exists samples_requested_by_profiles_fkey;
alter table samples
  add constraint samples_requested_by_profiles_fkey
  foreign key (requested_by) references profiles(id);

-- 4. Immutable event timeline (one row per event, never edited)
create table if not exists sample_events (
  id          uuid primary key default gen_random_uuid(),
  sample_id   uuid references samples(id) on delete cascade not null,
  event_type  text not null,      -- status_change | label_generated | note_added
  event_label text not null,      -- human-readable: "Approved by Bella"
  event_data  jsonb default '{}',
  created_by  uuid references auth.users(id),
  created_at  timestamptz default now()
);

-- 5. Notifications
create table if not exists notifications (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users(id) not null,
  type            text not null,    -- sample_approved | sample_shipped | etc.
  title           text not null,
  body            text,
  resource_type   text,             -- sample | product
  resource_id     text,
  read            boolean default false,
  created_at      timestamptz default now()
);

-- 6. Row Level Security
alter table samples enable row level security;
alter table sample_events enable row level security;
alter table notifications enable row level security;

-- samples: all authenticated users can read; own inserts; editors can update any
create policy "authenticated can view samples"
  on samples for select using (auth.uid() is not null);

create policy "users can request samples"
  on samples for insert with check (requested_by = auth.uid());

create policy "editors can update sample status"
  on samples for update using (
    requested_by = auth.uid() or
    exists (select 1 from profiles where id = auth.uid() and role in ('admin','editor'))
  );

-- sample_events: authenticated read; insert allowed for authenticated
create policy "authenticated can view events"
  on sample_events for select using (auth.uid() is not null);

create policy "authenticated can add events"
  on sample_events for insert with check (created_by = auth.uid());

-- notifications: users only see their own
create policy "users own notifications select"
  on notifications for select using (user_id = auth.uid());

create policy "users own notifications update"
  on notifications for update using (user_id = auth.uid());

create policy "system can insert notifications"
  on notifications for insert with check (true);

-- 7. Function to insert a sample + its first timeline event atomically
create or replace function create_sample(
  p_product_id  uuid,
  p_sample_type text,
  p_quantity    integer,
  p_customer    text,
  p_destination text,
  p_reason      text,
  p_notes       text,
  p_user_id     uuid,
  p_user_name   text
) returns jsonb language plpgsql security definer as $$
declare
  v_sample_id   text;
  v_id          uuid;
begin
  v_sample_id := next_sample_id();
  insert into samples (sample_id, product_id, sample_type, quantity, customer, destination, reason, notes, status, requested_by)
    values (v_sample_id, p_product_id, p_sample_type, p_quantity, p_customer, p_destination, p_reason, p_notes, 'requested', p_user_id)
    returning id into v_id;
  insert into sample_events (sample_id, event_type, event_label, event_data, created_by)
    values (v_id, 'status_change', 'Requested by ' || p_user_name, '{"status":"requested"}'::jsonb, p_user_id);
  return jsonb_build_object('id', v_id, 'sample_id', v_sample_id);
end;
$$;

-- 8. Function to update sample status + insert timeline event
create or replace function update_sample_status(
  p_id        uuid,
  p_status    text,
  p_user_id   uuid,
  p_user_name text
) returns void language plpgsql security definer as $$
declare
  v_label text;
begin
  update samples set status = p_status, updated_at = now(),
    approved_by = case when p_status = 'approved' then p_user_id else approved_by end
  where id = p_id;
  v_label := case p_status
    when 'approved'   then 'Approved by ' || p_user_name
    when 'preparing'  then 'Preparation started by ' || p_user_name
    when 'ready'      then 'Marked ready by ' || p_user_name
    when 'picked_up'  then 'Picked up by ' || p_user_name
    when 'shipped'    then 'Shipped by ' || p_user_name
    when 'delivered'  then 'Delivered — confirmed by ' || p_user_name
    when 'returned'   then 'Returned to sample library'
    when 'damaged'    then 'Marked as damaged'
    when 'archived'   then 'Archived by ' || p_user_name
    else 'Status updated by ' || p_user_name
  end;
  insert into sample_events (sample_id, event_type, event_label, event_data, created_by)
    values (p_id, 'status_change', v_label, jsonb_build_object('status', p_status), p_user_id);
end;
$$;

-- ══════════════════════════════════════════════════════════════
-- COLLECTIONS — grouping several samples into one physical package
-- ("I need 30 fabric swatches, pack them together, ship via DHL")
-- ══════════════════════════════════════════════════════════════

create sequence if not exists collection_seq start 1;

create or replace function next_collection_id()
returns text language plpgsql as $$
begin
  return 'COL-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('collection_seq')::text, 6, '0');
end;
$$;

create table if not exists sample_collections (
  id              uuid primary key default gen_random_uuid(),
  collection_id   text unique not null,           -- COL-2026-000001
  customer        text,
  priority        text default 'normal',           -- normal | urgent
  delivery_method text default 'Pickup',            -- Pickup | DHL | FedEx | Courier
  recipient       text,
  address         text,
  notes           text,
  status          text default 'requested',        -- mirrors sample lifecycle
  requested_by    uuid references profiles(id),
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

alter table sample_collections enable row level security;

drop policy if exists "authenticated can view collections" on sample_collections;
create policy "authenticated can view collections"
  on sample_collections for select using (auth.uid() is not null);

drop policy if exists "users can create collections" on sample_collections;
create policy "users can create collections"
  on sample_collections for insert with check (requested_by = auth.uid());

drop policy if exists "editors can update collections" on sample_collections;
create policy "editors can update collections"
  on sample_collections for update using (
    requested_by = auth.uid() or
    exists (select 1 from profiles where id = auth.uid() and role in ('admin','editor'))
  );

-- Each individual sample can belong to a collection (nullable — a single,
-- ad-hoc sample request doesn't require one).
alter table samples add column if not exists collection_id uuid references sample_collections(id) on delete set null;

-- Atomically creates a collection + every sample in it + their first
-- timeline event. p_items is a jsonb array of {product_id, sample_type, quantity}.
create or replace function create_sample_collection(
  p_items        jsonb,
  p_customer     text,
  p_priority     text,
  p_delivery     text,
  p_recipient    text,
  p_address      text,
  p_notes        text,
  p_user_id      uuid,
  p_user_name    text
) returns jsonb language plpgsql security definer as $$
declare
  v_collection_ref text;
  v_col_id         uuid;
  v_item           jsonb;
  v_sample_id      text;
  v_sample_uuid    uuid;
  v_destination    text;
  v_reason         text;
  v_created        jsonb := '[]'::jsonb;
begin
  v_collection_ref := next_collection_id();
  v_destination := case when p_delivery = 'Pickup' then 'Pickup · ' || p_recipient
                        else p_delivery || ' → ' || p_address || ' · Attn: ' || p_recipient end;
  v_reason := case when p_priority = 'urgent' then 'Urgent request' else 'Sample request' end;

  insert into sample_collections (collection_id, customer, priority, delivery_method, recipient, address, notes, status, requested_by)
    values (v_collection_ref, p_customer, p_priority, p_delivery, p_recipient, p_address, p_notes, 'requested', p_user_id)
    returning id into v_col_id;

  for v_item in select * from jsonb_array_elements(p_items) loop
    v_sample_id := next_sample_id();
    insert into samples (sample_id, product_id, sample_type, quantity, customer, destination, reason, notes, status, requested_by, collection_id)
      values (
        v_sample_id, (v_item->>'product_id')::uuid, v_item->>'sample_type',
        coalesce((v_item->>'quantity')::integer, 1), p_customer, v_destination, v_reason, p_notes,
        'requested', p_user_id, v_col_id
      )
      returning id into v_sample_uuid;
    insert into sample_events (sample_id, event_type, event_label, event_data, created_by)
      values (v_sample_uuid, 'status_change', 'Requested by ' || p_user_name, '{"status":"requested"}'::jsonb, p_user_id);
    v_created := v_created || jsonb_build_object('id', v_sample_uuid, 'sample_id', v_sample_id);
  end loop;

  return jsonb_build_object('collection_id', v_col_id, 'collection_ref', v_collection_ref, 'items', v_created);
end;
$$;

-- Updates a collection's status and cascades it to every sample inside it,
-- logging one timeline event per sample (so per-sample history stays intact).
create or replace function update_collection_status(
  p_id        uuid,
  p_status    text,
  p_user_id   uuid,
  p_user_name text
) returns void language plpgsql security definer as $$
declare v_label text;
begin
  update sample_collections set status = p_status, updated_at = now() where id = p_id;
  update samples set status = p_status, updated_at = now() where collection_id = p_id;
  v_label := case p_status
    when 'approved'   then 'Approved by ' || p_user_name
    when 'preparing'  then 'Preparation started by ' || p_user_name
    when 'ready'      then 'Marked ready by ' || p_user_name
    when 'picked_up'  then 'Picked up by ' || p_user_name
    when 'shipped'    then 'Shipped by ' || p_user_name
    when 'delivered'  then 'Delivered — confirmed by ' || p_user_name
    when 'returned'   then 'Returned to sample library'
    when 'damaged'    then 'Marked as damaged'
    when 'archived'   then 'Archived by ' || p_user_name
    else 'Status updated by ' || p_user_name
  end;
  insert into sample_events (sample_id, event_type, event_label, event_data, created_by)
    select id, 'status_change', v_label, jsonb_build_object('status', p_status), p_user_id
    from samples where collection_id = p_id;
end;
$$;
