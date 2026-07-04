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
drop policy if exists "authenticated can view samples" on samples;
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
drop policy if exists "authenticated can view events" on sample_events;
create policy "authenticated can view events"
  on sample_events for select using (auth.uid() is not null);

drop policy if exists "authenticated can add events" on sample_events;
create policy "authenticated can add events"
  on sample_events for insert with check (created_by = auth.uid());

-- notifications: users only see their own
drop policy if exists "users own notifications select" on notifications;
create policy "users own notifications select"
  on notifications for select using (user_id = auth.uid());

drop policy if exists "users own notifications update" on notifications;
create policy "users own notifications update"
  on notifications for update using (user_id = auth.uid());

drop policy if exists "system can insert notifications" on notifications;
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
  p_user_name    text,
  p_name         text default null
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

  insert into sample_collections (collection_id, name, customer, priority, delivery_method, recipient, address, notes, status, requested_by)
    values (v_collection_ref, p_name, p_customer, p_priority, p_delivery, p_recipient, p_address, p_notes, 'requested', p_user_id)
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

-- ══════════════════════════════════════════════════════════════
-- DISPATCH — naming, collaborators, and pack-verification workflow
-- ("despachador" scans/confirms every item before the shipping
-- guide can print; missing items are excluded with a reason;
-- printing notifies everyone involved with what shipped and what didn't)
-- ══════════════════════════════════════════════════════════════

-- 1. New role: dispatcher (warehouse/packing staff, distinct from editor)
alter table profiles drop constraint if exists profiles_role_check;
alter table profiles add constraint profiles_role_check
  check (role in ('admin','editor','user','vendedor','dispatcher'));

-- 2. Collections get an optional human-readable name
alter table sample_collections add column if not exists name text;

-- 3. Collaborators — people invited to help build/track a collection
create table if not exists collection_collaborators (
  id             uuid primary key default gen_random_uuid(),
  collection_id  uuid references sample_collections(id) on delete cascade not null,
  user_id        uuid references profiles(id) not null,
  added_by       uuid references profiles(id),
  created_at     timestamptz default now(),
  unique (collection_id, user_id)
);
alter table collection_collaborators enable row level security;

drop policy if exists "authenticated can view collaborators" on collection_collaborators;
create policy "authenticated can view collaborators"
  on collection_collaborators for select using (auth.uid() is not null);

drop policy if exists "collection members can invite collaborators" on collection_collaborators;
create policy "collection members can invite collaborators"
  on collection_collaborators for insert with check (
    exists (
      select 1 from sample_collections c
      where c.id = collection_id and (
        c.requested_by = auth.uid()
        or exists (select 1 from collection_collaborators cc where cc.collection_id = c.id and cc.user_id = auth.uid())
      )
    )
    or exists (select 1 from profiles where id = auth.uid() and role in ('admin','editor','dispatcher'))
  );

drop policy if exists "members can remove collaborators" on collection_collaborators;
create policy "members can remove collaborators"
  on collection_collaborators for delete using (
    added_by = auth.uid() or user_id = auth.uid()
    or exists (select 1 from profiles where id = auth.uid() and role in ('admin','editor'))
  );

-- 4. Per-sample dispatch/verification state
alter table samples add column if not exists verified boolean default false;
alter table samples add column if not exists verified_by uuid references profiles(id);
alter table samples add column if not exists verified_at timestamptz;
alter table samples add column if not exists excluded boolean default false;
alter table samples add column if not exists exclusion_reason text;

-- 5. Dispatchers (and editors/admins) can update samples & collections —
-- extend the existing update policies to include the new role.
drop policy if exists "editors can update sample status" on samples;
create policy "editors can update sample status"
  on samples for update using (
    requested_by = auth.uid() or
    exists (select 1 from profiles where id = auth.uid() and role in ('admin','editor','dispatcher'))
  );

drop policy if exists "editors can update collections" on sample_collections;
create policy "editors can update collections"
  on sample_collections for update using (
    requested_by = auth.uid() or
    exists (select 1 from profiles where id = auth.uid() and role in ('admin','editor','dispatcher'))
  );

-- Collaborators and the requester can also add samples to a collection
-- that's still open (dispatcher-added items reuse this same insert policy).
drop policy if exists "users can request samples" on samples;
create policy "users can request samples"
  on samples for insert with check (
    requested_by = auth.uid()
    or exists (select 1 from profiles where id = auth.uid() and role in ('admin','editor','dispatcher'))
  );

-- 6. Mark one sample verified (scanned present) during dispatch
create or replace function verify_sample(
  p_id uuid, p_user_id uuid, p_user_name text
) returns void language plpgsql security definer as $$
begin
  update samples set verified = true, verified_by = p_user_id, verified_at = now(), excluded = false, exclusion_reason = null
  where id = p_id;
  insert into sample_events (sample_id, event_type, event_label, event_data, created_by)
    values (p_id, 'verified', 'Verified by ' || p_user_name, '{}'::jsonb, p_user_id);
end;
$$;

-- 7. Exclude a sample from the shipment with a mandatory reason
create or replace function exclude_sample(
  p_id uuid, p_reason text, p_user_id uuid, p_user_name text
) returns void language plpgsql security definer as $$
begin
  update samples set excluded = true, exclusion_reason = p_reason, verified = false
  where id = p_id;
  insert into sample_events (sample_id, event_type, event_label, event_data, created_by)
    values (p_id, 'excluded', p_user_name || ' excluded this item: ' || p_reason, jsonb_build_object('reason', p_reason), p_user_id);
end;
$$;

-- ══════════════════════════════════════════════════════════════
-- CAPABILITY-BASED AUTHORIZATION (Platform Owner + Data Owners)
--
-- Replaces role-string checks with grants of (capability, domain):
--   Domains:      fiber | yarn | fabric | chemicals | garment
--                 warehouse (physical samples / dispatch)
--                 customer_service (requests & collections lifecycle)
--                 platform (users, grants, audit, analytics)
--   Capabilities: read | write | delete | publish | dispatch
--                 manage_status | grant | admin
--
-- A "Data Owner" holds `grant` (plus working capabilities) on a domain.
-- The "Platform Owner" holds `admin` + `grant` on `platform`.
--
-- Everything below is idempotent and BACKWARD COMPATIBLE:
-- authorize() falls back to the legacy profiles.role mapping, so users
-- keep exactly their current access until grants are managed explicitly.
-- ══════════════════════════════════════════════════════════════

-- 1. Grants table
create table if not exists capability_grants (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references profiles(id) on delete cascade not null,
  domain      text not null check (domain in
                ('fiber','yarn','fabric','chemicals','garment',
                 'warehouse','customer_service','platform')),
  capability  text not null check (capability in
                ('read','write','delete','publish','dispatch',
                 'manage_status','grant','admin')),
  resource_id uuid,                                -- null = whole domain
  granted_by  uuid references profiles(id),
  expires_at  timestamptz,                         -- null = permanent
  created_at  timestamptz default now()
);

-- unique across nullable resource_id (coalesce to a sentinel uuid)
create unique index if not exists capability_grants_unique
  on capability_grants (user_id, domain, capability,
      coalesce(resource_id, '00000000-0000-0000-0000-000000000000'::uuid));

-- 2. Append-only audit of every grant / revoke
create table if not exists grant_audit (
  id         uuid primary key default gen_random_uuid(),
  action     text not null,          -- granted | revoked
  user_id    uuid,
  domain     text,
  capability text,
  resource_id uuid,
  actor      uuid,                   -- who performed the change (auth.uid())
  created_at timestamptz default now()
);

create or replace function log_grant_change() returns trigger
language plpgsql security definer as $$
begin
  if tg_op = 'INSERT' then
    insert into grant_audit (action, user_id, domain, capability, resource_id, actor)
      values ('granted', new.user_id, new.domain, new.capability, new.resource_id, auth.uid());
    return new;
  else
    insert into grant_audit (action, user_id, domain, capability, resource_id, actor)
      values ('revoked', old.user_id, old.domain, old.capability, old.resource_id, auth.uid());
    return old;
  end if;
end;
$$;

drop trigger if exists trg_grant_audit on capability_grants;
create trigger trg_grant_audit
  after insert or delete on capability_grants
  for each row execute function log_grant_change();

-- 3. THE single authority function. Every RLS policy and RPC calls this.
--    security definer so it can read capability_grants/profiles regardless
--    of the caller's RLS visibility. Actor is ALWAYS auth.uid() — never a
--    client-supplied parameter.
create or replace function authorize(
  p_domain      text,
  p_capability  text,
  p_resource_id uuid default null
) returns boolean language plpgsql security definer stable as $$
declare
  v_uid  uuid := auth.uid();
  v_role text;
begin
  if v_uid is null then return false; end if;

  -- explicit capability grant (domain-wide or resource-scoped, unexpired)
  if exists (
    select 1 from capability_grants g
    where g.user_id = v_uid
      and g.domain = p_domain
      and g.capability = p_capability
      and (g.resource_id is null or g.resource_id = p_resource_id)
      and (g.expires_at is null or g.expires_at > now())
  ) then return true; end if;

  -- LEGACY FALLBACK — mirrors the old role model so nothing breaks while
  -- grants are being adopted. Remove this block in the deprecation phase.
  select role into v_role from profiles where id = v_uid;
  if v_role = 'admin' then return true; end if;
  if v_role = 'editor' then
    return p_domain <> 'platform'
       and p_capability in ('read','write','delete','publish','manage_status');
  end if;
  if v_role = 'dispatcher' then
    return (p_domain = 'warehouse' and p_capability in ('read','dispatch'))
        or (p_domain = 'customer_service' and p_capability in ('read','manage_status'))
        or (p_capability = 'read' and p_domain in ('fiber','yarn','fabric','chemicals','garment'));
  end if;
  return false;
end;
$$;

-- 4. RLS for the grants table itself
alter table capability_grants enable row level security;
alter table grant_audit enable row level security;

drop policy if exists "users see own grants" on capability_grants;
create policy "users see own grants"
  on capability_grants for select using (
    user_id = auth.uid()
    or authorize('platform','admin')
    or authorize(domain,'grant')
  );

drop policy if exists "platform admins and data owners can grant" on capability_grants;
create policy "platform admins and data owners can grant"
  on capability_grants for insert with check (
    authorize('platform','admin')
    or (authorize(domain,'grant') and capability <> 'admin')
  );

drop policy if exists "platform admins and data owners can revoke" on capability_grants;
create policy "platform admins and data owners can revoke"
  on capability_grants for delete using (
    authorize('platform','admin')
    or (authorize(domain,'grant') and capability <> 'admin')
  );

drop policy if exists "platform admins can read audit" on grant_audit;
create policy "platform admins can read audit"
  on grant_audit for select using (authorize('platform','admin'));

-- 5. AUTOMATIC MIGRATION of existing users (idempotent: on conflict skip).
--    admin      → platform owner bundle (admin + grant on platform)
--    editor     → editor bundle on every division + customer_service
--    dispatcher → warehouse dispatcher bundle + read on divisions
--    user/vendedor → no grants (baseline authenticated access unchanged)
insert into capability_grants (user_id, domain, capability, granted_by)
select p.id, 'platform', c.cap, p.id
from profiles p, (values ('admin'),('grant')) as c(cap)
where p.role = 'admin'
on conflict do nothing;

insert into capability_grants (user_id, domain, capability, granted_by)
select p.id, d.dom, c.cap, p.id
from profiles p,
     (values ('fiber'),('yarn'),('fabric'),('chemicals'),('garment')) as d(dom),
     (values ('read'),('write'),('delete'),('publish')) as c(cap)
where p.role in ('admin','editor')
on conflict do nothing;

insert into capability_grants (user_id, domain, capability, granted_by)
select p.id, 'customer_service', c.cap, p.id
from profiles p, (values ('read'),('write'),('manage_status')) as c(cap)
where p.role in ('admin','editor')
on conflict do nothing;

insert into capability_grants (user_id, domain, capability, granted_by)
select p.id, 'warehouse', c.cap, p.id
from profiles p, (values ('read'),('dispatch')) as c(cap)
where p.role in ('admin','dispatcher')
on conflict do nothing;

insert into capability_grants (user_id, domain, capability, granted_by)
select p.id, d.dom, 'read', p.id
from profiles p,
     (values ('fiber'),('yarn'),('fabric'),('chemicals'),('garment')) as d(dom)
where p.role = 'dispatcher'
on conflict do nothing;

-- Migrate collection collaborators into resource-scoped grants
-- (collection_collaborators stays as the live invite mechanism for now;
-- these grants make the new model aware of existing memberships).
insert into capability_grants (user_id, domain, capability, resource_id, granted_by)
select cc.user_id, 'customer_service', c.cap, cc.collection_id, cc.added_by
from collection_collaborators cc, (values ('read'),('write')) as c(cap)
on conflict do nothing;

-- 6. Rewrite RLS policies to route through authorize()
--    (same names as before so drop-if-exists stays idempotent)
drop policy if exists "editors can update sample status" on samples;
create policy "editors can update sample status"
  on samples for update using (
    requested_by = auth.uid()
    or authorize('customer_service','manage_status')
    or authorize('warehouse','dispatch')
  );

drop policy if exists "users can request samples" on samples;
create policy "users can request samples"
  on samples for insert with check (
    requested_by = auth.uid()
    or authorize('customer_service','write')
    or authorize('warehouse','dispatch')
  );

drop policy if exists "editors can update collections" on sample_collections;
create policy "editors can update collections"
  on sample_collections for update using (
    requested_by = auth.uid()
    or authorize('customer_service','manage_status')
    or authorize('warehouse','dispatch')
  );

drop policy if exists "collection members can invite collaborators" on collection_collaborators;
create policy "collection members can invite collaborators"
  on collection_collaborators for insert with check (
    exists (
      select 1 from sample_collections c
      where c.id = collection_id and (
        c.requested_by = auth.uid()
        or exists (select 1 from collection_collaborators cc where cc.collection_id = c.id and cc.user_id = auth.uid())
      )
    )
    or authorize('customer_service','write')
    or authorize('warehouse','dispatch')
  );

drop policy if exists "members can remove collaborators" on collection_collaborators;
create policy "members can remove collaborators"
  on collection_collaborators for delete using (
    added_by = auth.uid() or user_id = auth.uid()
    or authorize('customer_service','manage_status')
    or authorize('platform','admin')
  );

-- 7. HARDEN RPCs — actor is auth.uid() (client-supplied p_user_id is only a
--    fallback for SQL-editor testing where auth.uid() is null); display name
--    comes from profiles, not the client. authorize() is enforced inside,
--    since security definer bypasses RLS.

create or replace function verify_sample(
  p_id uuid, p_user_id uuid, p_user_name text
) returns void language plpgsql security definer as $$
declare
  v_actor uuid := coalesce(auth.uid(), p_user_id);
  v_name  text;
begin
  if auth.uid() is not null and not authorize('warehouse','dispatch') then
    raise exception 'not authorized: warehouse/dispatch required';
  end if;
  select coalesce(full_name, p_user_name) into v_name from profiles where id = v_actor;
  v_name := coalesce(v_name, p_user_name, 'Unknown');
  update samples set verified = true, verified_by = v_actor, verified_at = now(), excluded = false, exclusion_reason = null
  where id = p_id;
  insert into sample_events (sample_id, event_type, event_label, event_data, created_by)
    values (p_id, 'verified', 'Verified by ' || v_name, '{}'::jsonb, v_actor);
end;
$$;

create or replace function exclude_sample(
  p_id uuid, p_reason text, p_user_id uuid, p_user_name text
) returns void language plpgsql security definer as $$
declare
  v_actor uuid := coalesce(auth.uid(), p_user_id);
  v_name  text;
begin
  if auth.uid() is not null and not authorize('warehouse','dispatch') then
    raise exception 'not authorized: warehouse/dispatch required';
  end if;
  select coalesce(full_name, p_user_name) into v_name from profiles where id = v_actor;
  v_name := coalesce(v_name, p_user_name, 'Unknown');
  update samples set excluded = true, exclusion_reason = p_reason, verified = false
  where id = p_id;
  insert into sample_events (sample_id, event_type, event_label, event_data, created_by)
    values (p_id, 'excluded', v_name || ' excluded this item: ' || p_reason, jsonb_build_object('reason', p_reason), v_actor);
end;
$$;

create or replace function update_collection_status(
  p_id        uuid,
  p_status    text,
  p_user_id   uuid,
  p_user_name text
) returns void language plpgsql security definer as $$
declare
  v_actor uuid := coalesce(auth.uid(), p_user_id);
  v_name  text;
  v_label text;
  v_requester uuid;
begin
  select requested_by into v_requester from sample_collections where id = p_id;
  if auth.uid() is not null
     and v_actor <> v_requester
     and not authorize('customer_service','manage_status')
     and not authorize('warehouse','dispatch') then
    raise exception 'not authorized: manage_status or dispatch required';
  end if;
  select coalesce(full_name, p_user_name) into v_name from profiles where id = v_actor;
  v_name := coalesce(v_name, p_user_name, 'Unknown');
  update sample_collections set status = p_status, updated_at = now() where id = p_id;
  update samples set status = p_status, updated_at = now() where collection_id = p_id;
  v_label := case p_status
    when 'approved'   then 'Approved by ' || v_name
    when 'preparing'  then 'Preparation started by ' || v_name
    when 'ready'      then 'Marked ready by ' || v_name
    when 'picked_up'  then 'Picked up by ' || v_name
    when 'shipped'    then 'Shipped by ' || v_name
    when 'delivered'  then 'Delivered — confirmed by ' || v_name
    when 'returned'   then 'Returned to sample library'
    when 'damaged'    then 'Marked as damaged'
    when 'archived'   then 'Archived by ' || v_name
    else 'Status updated by ' || v_name
  end;
  insert into sample_events (sample_id, event_type, event_label, event_data, created_by)
    select id, 'status_change', v_label, jsonb_build_object('status', p_status), v_actor
    from samples where collection_id = p_id;
end;
$$;

create or replace function update_sample_status(
  p_id        uuid,
  p_status    text,
  p_user_id   uuid,
  p_user_name text
) returns void language plpgsql security definer as $$
declare
  v_actor uuid := coalesce(auth.uid(), p_user_id);
  v_name  text;
  v_label text;
  v_requester uuid;
begin
  select requested_by into v_requester from samples where id = p_id;
  if auth.uid() is not null
     and v_actor <> v_requester
     and not authorize('customer_service','manage_status')
     and not authorize('warehouse','dispatch') then
    raise exception 'not authorized: manage_status or dispatch required';
  end if;
  select coalesce(full_name, p_user_name) into v_name from profiles where id = v_actor;
  v_name := coalesce(v_name, p_user_name, 'Unknown');
  update samples set status = p_status, updated_at = now(),
    approved_by = case when p_status = 'approved' then v_actor else approved_by end
  where id = p_id;
  v_label := case p_status
    when 'approved'   then 'Approved by ' || v_name
    when 'preparing'  then 'Preparation started by ' || v_name
    when 'ready'      then 'Marked ready by ' || v_name
    when 'picked_up'  then 'Picked up by ' || v_name
    when 'shipped'    then 'Shipped by ' || v_name
    when 'delivered'  then 'Delivered — confirmed by ' || v_name
    when 'returned'   then 'Returned to sample library'
    when 'damaged'    then 'Marked as damaged'
    when 'archived'   then 'Archived by ' || v_name
    else 'Status updated by ' || v_name
  end;
  insert into sample_events (sample_id, event_type, event_label, event_data, created_by)
    values (p_id, 'status_change', v_label, jsonb_build_object('status', p_status), v_actor);
end;
$$;

-- ══════════════════════════════════════════════════════════════
-- PRODUCT LIFECYCLE
--   draft → development → available → reserved → discontinued → archived
--   draft/development: internal (division editors) only
--   discontinued:      searchable internally, not requestable
--   archived:          read-only
--   public page:       never exposes draft or archived
-- ══════════════════════════════════════════════════════════════

alter table products add column if not exists lifecycle text default 'available';
update products set lifecycle = 'available' where lifecycle is null;
alter table products drop constraint if exists products_lifecycle_check;
alter table products add constraint products_lifecycle_check
  check (lifecycle in ('draft','development','available','reserved','discontinued','archived'));

-- Product activity history (mirrors sample_events)
create table if not exists product_events (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid references products(id) on delete cascade not null,
  event_type  text not null,        -- lifecycle_change | note
  event_label text not null,        -- "Status changed to Available by Bella"
  event_data  jsonb default '{}',
  created_by  uuid references profiles(id),
  created_at  timestamptz default now()
);
alter table product_events enable row level security;

drop policy if exists "authenticated can view product events" on product_events;
create policy "authenticated can view product events"
  on product_events for select using (auth.uid() is not null);

-- inserts happen only through the RPC below (security definer)

-- Change a product's lifecycle status; requires write on the product's
-- division. Records the change in product_events. Archived products can
-- only be brought back by someone with write on the division (same check).
create or replace function set_product_lifecycle(
  p_id     uuid,
  p_status text
) returns void language plpgsql security definer as $$
declare
  v_actor    uuid := auth.uid();
  v_name     text;
  v_division text;
  v_old      text;
begin
  if p_status not in ('draft','development','available','reserved','discontinued','archived') then
    raise exception 'invalid lifecycle status: %', p_status;
  end if;
  select division, coalesce(lifecycle,'available') into v_division, v_old from products where id = p_id;
  if v_division is null then raise exception 'product not found'; end if;
  if v_actor is not null and not authorize(v_division, 'write') then
    raise exception 'not authorized: write on % required', v_division;
  end if;
  select full_name into v_name from profiles where id = v_actor;
  v_name := coalesce(v_name, 'System');
  update products set lifecycle = p_status where id = p_id;
  insert into product_events (product_id, event_type, event_label, event_data, created_by)
    values (p_id, 'lifecycle_change',
      'Status changed from ' || initcap(replace(v_old,'_',' ')) || ' to ' || initcap(replace(p_status,'_',' ')) || ' by ' || v_name,
      jsonb_build_object('from', v_old, 'to', p_status), v_actor);
end;
$$;

-- NOTE (public exposure): the products SELECT policies live in the Supabase
-- dashboard, not in this file. To enforce draft/archived hiding at the DB
-- level for anonymous readers, replace the anon select policy with:
--   using ( auth.uid() is not null
--           or coalesce(lifecycle,'available') not in ('draft','archived') )
-- The app also enforces this on the public page client-side.

-- ══════════════════════════════════════════════════════════════
-- PRODUCT DATA QUALITY — DB-level backstops for the client-side
-- validation in the product editor (duplicate SKU / barcode).
-- Wrapped in DO blocks: if existing data already contains duplicates,
-- the index is skipped with a notice instead of failing the migration —
-- clean up the listed duplicates and re-run.
-- ══════════════════════════════════════════════════════════════

do $$
begin
  if exists (
    select lower(code) from products
    where code is not null and code <> ''
    group by lower(code) having count(*) > 1
  ) then
    raise notice 'products_code_unique skipped: duplicate codes exist. Find them with:
      select code, count(*) from products where code is not null group by code having count(*) > 1;';
  else
    create unique index if not exists products_code_unique
      on products (lower(code)) where code is not null and code <> '';
  end if;
end $$;

do $$
begin
  if exists (
    select specs->>'barcode' from products
    where specs->>'barcode' is not null and specs->>'barcode' <> ''
    group by specs->>'barcode' having count(*) > 1
  ) then
    raise notice 'products_barcode_unique skipped: duplicate barcodes exist.';
  else
    create unique index if not exists products_barcode_unique
      on products ((specs->>'barcode')) where specs->>'barcode' is not null and specs->>'barcode' <> '';
  end if;
end $$;

-- ══════════════════════════════════════════════════════════════
-- AUDIT CORE — activity log, version history, audit trail
--
-- Generic by design: any entity participates by writing rows with its
-- (entity_type, entity_id, domain). Nothing here is product-specific.
--   activity_events  — what/who/when/old→new for every important action
--   entity_versions  — immutable full snapshots, monotonic version_no
-- (a separate version_changes table is intentionally omitted: diffs are
-- derived from adjacent snapshots, so storing them would denormalize)
--
-- Visibility (Part 8): platform admins see everything; data owners see
-- their domain; the actor sees their own events; anonymous sees nothing.
-- ══════════════════════════════════════════════════════════════

create table if not exists activity_events (
  id          uuid primary key default gen_random_uuid(),
  entity_type text not null,          -- product | collection | sample | user | …
  entity_id   text not null,          -- uuid or natural key, stored as text
  domain      text not null,          -- authorization domain for visibility
  event_type  text not null,          -- created | edited | status_changed | …
  summary     text not null,          -- human line: "Changed GSM"
  changes     jsonb default '[]',     -- [{field, from, to}]
  metadata    jsonb default '{}',
  actor       uuid references profiles(id),
  created_at  timestamptz default now()
);
create index if not exists activity_events_entity_idx
  on activity_events (entity_type, entity_id, created_at desc);
create index if not exists activity_events_domain_idx
  on activity_events (domain, created_at desc);

create table if not exists entity_versions (
  id            uuid primary key default gen_random_uuid(),
  entity_type   text not null,
  entity_id     text not null,
  domain        text not null,
  version_no    integer not null,
  snapshot      jsonb not null,       -- complete entity state at save time
  reason        text,                 -- optional change reason
  restored_from integer,              -- version_no this was restored from
  actor         uuid references profiles(id),
  created_at    timestamptz default now(),
  unique (entity_type, entity_id, version_no)
);
create index if not exists entity_versions_entity_idx
  on entity_versions (entity_type, entity_id, version_no desc);

alter table activity_events enable row level security;
alter table entity_versions enable row level security;

drop policy if exists "audit visibility" on activity_events;
create policy "audit visibility"
  on activity_events for select using (
    actor = auth.uid()
    or authorize('platform','admin')
    or authorize(domain,'read')
  );

drop policy if exists "version visibility" on entity_versions;
create policy "version visibility"
  on entity_versions for select using (
    actor = auth.uid()
    or authorize('platform','admin')
    or authorize(domain,'read')
  );

-- Writes go through the RPCs below (security definer), never direct.

create or replace function log_activity(
  p_entity_type text,
  p_entity_id   text,
  p_domain      text,
  p_event_type  text,
  p_summary     text,
  p_changes     jsonb default '[]',
  p_metadata    jsonb default '{}'
) returns uuid language plpgsql security definer as $$
declare v_id uuid;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  insert into activity_events (entity_type, entity_id, domain, event_type, summary, changes, metadata, actor)
    values (p_entity_type, p_entity_id, p_domain, p_event_type, p_summary,
            coalesce(p_changes,'[]'::jsonb), coalesce(p_metadata,'{}'::jsonb), auth.uid())
    returning id into v_id;
  return v_id;
end;
$$;

-- Atomically appends the next immutable version. History is never
-- deleted or rewritten; restores append a new version that points back
-- via restored_from.
create or replace function save_entity_version(
  p_entity_type   text,
  p_entity_id     text,
  p_domain        text,
  p_snapshot      jsonb,
  p_reason        text default null,
  p_restored_from integer default null
) returns integer language plpgsql security definer as $$
declare v_no integer;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  -- serialize concurrent saves of the same entity so version_no stays gapless
  perform pg_advisory_xact_lock(hashtext(p_entity_type || ':' || p_entity_id));
  select coalesce(max(version_no), 0) + 1 into v_no
    from entity_versions
    where entity_type = p_entity_type and entity_id = p_entity_id;
  insert into entity_versions (entity_type, entity_id, domain, version_no, snapshot, reason, restored_from, actor)
    values (p_entity_type, p_entity_id, p_domain, v_no, p_snapshot, p_reason, p_restored_from, auth.uid());
  return v_no;
end;
$$;

-- ══════════════════════════════════════════════════════════════
-- PRODUCT KNOWLEDGE GRAPH — typed relationships between products
--
-- One row per link. Symmetric types (alternative, compatible, related,
-- collection) read the same from both sides; directional types (uses,
-- produces, replacement) show their inverse label when viewed from the
-- target ("Uses" ↔ "Used by"). Division-agnostic by design: any product
-- can link to any product, so future divisions need no changes here.
-- ══════════════════════════════════════════════════════════════

create table if not exists product_links (
  id         uuid primary key default gen_random_uuid(),
  source_id  uuid references products(id) on delete cascade not null,
  target_id  uuid references products(id) on delete cascade not null,
  link_type  text not null check (link_type in
    ('uses','produces','alternative','replacement','compatible','collection','related')),
  created_by uuid references profiles(id),
  created_at timestamptz default now(),
  check (source_id <> target_id),
  unique (source_id, target_id, link_type)
);
create index if not exists product_links_source_idx on product_links (source_id);
create index if not exists product_links_target_idx on product_links (target_id);

alter table product_links enable row level security;

drop policy if exists "authenticated can view links" on product_links;
create policy "authenticated can view links"
  on product_links for select using (auth.uid() is not null);

-- Linking requires write on either endpoint's division
drop policy if exists "editors can create links" on product_links;
create policy "editors can create links"
  on product_links for insert with check (
    exists (select 1 from products where id = source_id and authorize(division,'write'))
    or exists (select 1 from products where id = target_id and authorize(division,'write'))
  );

drop policy if exists "editors can remove links" on product_links;
create policy "editors can remove links"
  on product_links for delete using (
    exists (select 1 from products where id = source_id and authorize(division,'write'))
    or exists (select 1 from products where id = target_id and authorize(division,'write'))
  );

-- ══════════════════════════════════════════════════════════════
-- SAMPLE OPERATIONS — multi-location physical sample inventory
--
-- Not ERP inventory: this tracks physical marketing/development samples.
-- inventory_locations — each with an owning authorization domain
-- inventory_stock     — qty/reserved/min per (product, location, format)
-- inventory_movements — append-only; NOTHING changes stock silently
-- move_inventory()    — the single transactional write path (row-locked,
--                       negative stock impossible, authorization inside)
-- Collections reserve stock on creation, dispatch consumes it, cancel
-- releases it. Low stock triggers notification-center alerts.
-- ══════════════════════════════════════════════════════════════

create table if not exists inventory_locations (
  id           uuid primary key default gen_random_uuid(),
  key          text unique not null,
  name         text not null,
  owner_label  text not null,          -- displayed owner
  owner_domain text not null,          -- authorization domain that manages it
  active       boolean default true,
  created_at   timestamptz default now()
);

insert into inventory_locations (key, name, owner_label, owner_domain) values
  ('guatemala', 'Guatemala Marketing Sample Library', 'Marketing Sample Library', 'customer_service'),
  ('northern',  'Northern Textiles Sample Warehouse', 'Sample Warehouse',         'warehouse'),
  ('pride',     'Pride Chemicals Sample Center',      'Chemical Operations',      'chemicals')
on conflict (key) do nothing;

create table if not exists inventory_stock (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid references products(id) on delete cascade not null,
  location_id uuid references inventory_locations(id) on delete cascade not null,
  format      text not null,           -- Hanger, Swatch, Cone, Bottle …
  qty         integer not null default 0 check (qty >= 0),
  reserved    integer not null default 0 check (reserved >= 0),
  min_qty     integer not null default 0 check (min_qty >= 0),
  updated_at  timestamptz default now(),
  unique (product_id, location_id, format),
  check (reserved <= qty)
);
create index if not exists inventory_stock_product_idx on inventory_stock (product_id);
create index if not exists inventory_stock_low_idx on inventory_stock (location_id)
  where min_qty > 0;

create table if not exists inventory_movements (
  id            uuid primary key default gen_random_uuid(),
  product_id    uuid references products(id) on delete cascade not null,
  location_id   uuid references inventory_locations(id) not null,
  format        text not null,
  movement_type text not null check (movement_type in
    ('received','produced','transferred_in','transferred_out','reserved',
     'released','picked','dispatched','returned','disposed','adjustment')),
  qty           integer not null check (qty > 0),
  reason        text,
  notes         text,
  collection_id uuid references sample_collections(id) on delete set null,
  sample_id     uuid references samples(id) on delete set null,
  actor         uuid references profiles(id),
  created_at    timestamptz default now()
);
create index if not exists inventory_movements_product_idx
  on inventory_movements (product_id, created_at desc);
create index if not exists inventory_movements_sample_idx
  on inventory_movements (sample_id) where sample_id is not null;
create index if not exists inventory_movements_recent_idx
  on inventory_movements (movement_type, created_at desc);

alter table inventory_locations enable row level security;
alter table inventory_stock enable row level security;
alter table inventory_movements enable row level security;

drop policy if exists "authenticated can view locations" on inventory_locations;
create policy "authenticated can view locations"
  on inventory_locations for select using (auth.uid() is not null);
drop policy if exists "authenticated can view stock" on inventory_stock;
create policy "authenticated can view stock"
  on inventory_stock for select using (auth.uid() is not null);
drop policy if exists "authenticated can view movements" on inventory_movements;
create policy "authenticated can view movements"
  on inventory_movements for select using (auth.uid() is not null);
-- all writes go through the RPCs below

-- Can this user adjust inventory at this location?
create or replace function can_adjust_location(p_location uuid)
returns boolean language plpgsql security definer stable as $$
declare v_domain text;
begin
  select owner_domain into v_domain from inventory_locations where id = p_location;
  if v_domain is null then return false; end if;
  return authorize(v_domain, 'write')
      or authorize('warehouse', 'dispatch')
      or authorize('platform', 'admin');
end;
$$;

-- THE single transactional write path for stock. Row-locked; check
-- constraints make negative stock or over-reservation impossible even
-- under concurrency. Every call appends a movement — no silent changes.
create or replace function move_inventory(
  p_product    uuid,
  p_location   uuid,
  p_format     text,
  p_type       text,
  p_qty        integer,
  p_reason     text default null,
  p_notes      text default null,
  p_collection uuid default null,
  p_sample     uuid default null,
  p_min_qty    integer default null   -- optionally (re)configure minimum
) returns jsonb language plpgsql security definer as $$
declare
  v_stock inventory_stock%rowtype;
  v_available integer;
begin
  if auth.uid() is not null and not can_adjust_location(p_location) then
    raise exception 'not authorized to adjust inventory at this location';
  end if;
  if p_qty is null or p_qty <= 0 then raise exception 'quantity must be positive'; end if;

  insert into inventory_stock (product_id, location_id, format)
    values (p_product, p_location, p_format)
    on conflict (product_id, location_id, format) do nothing;
  select * into v_stock from inventory_stock
    where product_id = p_product and location_id = p_location and format = p_format
    for update;

  if p_type in ('received','produced','returned','transferred_in') then
    update inventory_stock set qty = qty + p_qty, updated_at = now() where id = v_stock.id;
  elsif p_type in ('disposed','transferred_out') then
    update inventory_stock set qty = qty - p_qty, updated_at = now() where id = v_stock.id;
  elsif p_type = 'adjustment' then
    -- adjustment sets an explicit delta via reason '+'/'-' — callers pass
    -- p_reason starting with 'set:' to set absolute qty
    if p_reason like 'set:%' then
      update inventory_stock set qty = greatest(p_qty, reserved), updated_at = now() where id = v_stock.id;
    else
      update inventory_stock set qty = qty + p_qty, updated_at = now() where id = v_stock.id;
    end if;
  elsif p_type = 'reserved' then
    update inventory_stock set reserved = reserved + p_qty, updated_at = now() where id = v_stock.id;
  elsif p_type = 'released' then
    update inventory_stock set reserved = greatest(reserved - p_qty, 0), updated_at = now() where id = v_stock.id;
  elsif p_type in ('picked','dispatched') then
    update inventory_stock set qty = qty - p_qty, reserved = greatest(reserved - p_qty, 0), updated_at = now() where id = v_stock.id;
  else
    raise exception 'unknown movement type: %', p_type;
  end if;

  if p_min_qty is not null then
    update inventory_stock set min_qty = p_min_qty where id = v_stock.id;
  end if;

  insert into inventory_movements (product_id, location_id, format, movement_type, qty, reason, notes, collection_id, sample_id, actor)
    values (p_product, p_location, p_format, p_type, p_qty, p_reason, p_notes, p_collection, p_sample, auth.uid());

  -- Low-stock alert into the notification center for the location's managers
  select qty - reserved into v_available from inventory_stock where id = v_stock.id;
  if exists (select 1 from inventory_stock s where s.id = v_stock.id and s.min_qty > 0 and (s.qty - s.reserved) <= s.min_qty) then
    insert into notifications (user_id, type, title, body, resource_type, resource_id)
    select distinct g.user_id, 'low_inventory',
      'Low inventory: ' || coalesce((select name from products where id = p_product), 'product'),
      p_format || ' at ' || (select name from inventory_locations where id = p_location)
        || ' is at ' || v_available || ' (minimum ' || (select min_qty from inventory_stock where id = v_stock.id) || ')',
      'product', p_product::text
    from capability_grants g
    join inventory_locations l on l.id = p_location
    where g.domain = l.owner_domain and g.capability = 'write' and g.resource_id is null
      and not exists (
        select 1 from notifications n
        where n.user_id = g.user_id and n.type = 'low_inventory'
          and n.resource_id = p_product::text and n.read = false
          and n.created_at > now() - interval '1 day'
      );
  end if;

  return (select jsonb_build_object('qty', qty, 'reserved', reserved, 'available', qty - reserved, 'min_qty', min_qty)
          from inventory_stock where id = v_stock.id);
end;
$$;

-- Transfer between locations: one transaction, two movements
create or replace function transfer_inventory(
  p_product  uuid, p_from uuid, p_to uuid, p_format text, p_qty integer,
  p_reason text default null, p_notes text default null
) returns void language plpgsql security definer as $$
begin
  perform move_inventory(p_product, p_from, p_format, 'transferred_out', p_qty, p_reason, p_notes);
  perform move_inventory(p_product, p_to,   p_format, 'transferred_in',  p_qty, p_reason, p_notes);
end;
$$;

-- PART 5 — collection lifecycle integration.
-- Reserve: for each sample in the collection, reserve stock at the first
-- active location with enough availability (skips samples with no stock —
-- inventory adoption can be gradual, workflows never break).
create or replace function reserve_collection_inventory(p_collection uuid)
returns void language plpgsql security definer as $$
declare
  r record; v_loc uuid;
begin
  for r in select s.id, s.product_id, s.sample_type, coalesce(s.quantity,1) as qty
           from samples s where s.collection_id = p_collection loop
    -- already reserved for this sample?
    continue when exists (select 1 from inventory_movements m
      where m.sample_id = r.id and m.movement_type = 'reserved');
    select st.location_id into v_loc
      from inventory_stock st
      join inventory_locations l on l.id = st.location_id and l.active
      where st.product_id = r.product_id and st.format = r.sample_type
        and (st.qty - st.reserved) >= r.qty
      order by l.created_at limit 1;
    if v_loc is not null then
      perform move_inventory(r.product_id, v_loc, r.sample_type, 'reserved', r.qty,
        'Collection reservation', null, p_collection, r.id);
    end if;
  end loop;
end;
$$;

-- Release every open reservation of the collection (cancel path)
create or replace function release_collection_inventory(p_collection uuid)
returns void language plpgsql security definer as $$
declare r record;
begin
  for r in
    select m.product_id, m.location_id, m.format, m.qty, m.sample_id
    from inventory_movements m
    where m.collection_id = p_collection and m.movement_type = 'reserved'
      and not exists (select 1 from inventory_movements x
        where x.sample_id = m.sample_id and x.movement_type in ('released','dispatched'))
  loop
    perform move_inventory(r.product_id, r.location_id, r.format, 'released', r.qty,
      'Collection cancelled', null, p_collection, r.sample_id);
  end loop;
end;
$$;

-- Dispatch: consume reservations of verified samples; release excluded ones
create or replace function dispatch_collection_inventory(p_collection uuid)
returns void language plpgsql security definer as $$
declare r record;
begin
  for r in
    select m.product_id, m.location_id, m.format, m.qty, m.sample_id, s.excluded
    from inventory_movements m
    join samples s on s.id = m.sample_id
    where m.collection_id = p_collection and m.movement_type = 'reserved'
      and not exists (select 1 from inventory_movements x
        where x.sample_id = m.sample_id and x.movement_type in ('released','dispatched'))
  loop
    if r.excluded then
      perform move_inventory(r.product_id, r.location_id, r.format, 'released', r.qty,
        'Excluded at dispatch', null, p_collection, r.sample_id);
    else
      perform move_inventory(r.product_id, r.location_id, r.format, 'dispatched', r.qty,
        'Collection dispatched', null, p_collection, r.sample_id);
    end if;
  end loop;
end;
$$;

-- ══════════════════════════════════════════════════════════════
-- PRICING & LABELS — Customer Service owns pricing; Sample Warehouse
-- prints, never types prices. Pricing lives on the collection item
-- (samples), NEVER on the base product. Pricing changes are recorded
-- in activity_events (customer_service domain) = pricing history.
-- Label/sticker prints are tracked per sample for dispatch gating.
-- ══════════════════════════════════════════════════════════════

alter table samples add column if not exists price numeric check (price is null or price >= 0);
alter table samples add column if not exists price_currency text default 'USD';
alter table samples add column if not exists moq text;
alter table samples add column if not exists price_valid_until date;
alter table samples add column if not exists price_notes text;
alter table samples add column if not exists label_printed_at timestamptz;
alter table samples add column if not exists sticker_printed_at timestamptz;
alter table sample_collections add column if not exists pricing_notes text;
