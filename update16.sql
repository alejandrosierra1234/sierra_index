-- ══════════════════════════════════════════════════════════════
-- ALMACÉN POR DIVISIÓN
--
-- Each division now has its own separate physical sample warehouse
-- (confirmed by the business owner), but every dispatch/inventory
-- action — verify_sample, exclude_sample, update_collection_status,
-- update_sample_status, can_adjust_location, and the RLS policies
-- that mirror them — only ever checked one shared 'warehouse' domain.
-- Someone dispatching for the Fiber warehouse could touch Fabric
-- samples just as freely.
--
-- Adds five new domains (warehouse_fiber/yarn/fabric/chemicals/garment)
-- and rewrites every warehouse-gated check to require the dispatching
-- division's own domain — derived from the sample's product, or (for
-- collection-level actions) any sample in the collection. Collections
-- are meant to stay single-division going forward (business decision:
-- a client order spanning divisions should be split into one
-- collection per division, not dispatched as one mixed shipment).
--
-- Backward compatible on purpose: every check still also accepts the
-- old broad 'warehouse' domain grant, so nobody loses access the
-- moment this runs. Existing 'warehouse' grants should be reviewed in
-- Team and re-issued as the specific warehouse_<division> once this
-- is live — see the note this mirrors in update15's platform fix.
--
-- Idempotent. Run in the Supabase SQL Editor.
-- ══════════════════════════════════════════════════════════════

alter table capability_grants drop constraint if exists capability_grants_domain_check;
alter table capability_grants add constraint capability_grants_domain_check
  check (domain in
    ('fiber','yarn','fabric','chemicals','garment',
     'warehouse_fiber','warehouse_yarn','warehouse_fabric','warehouse_chemicals','warehouse_garment',
     'warehouse','customer_service','talento_humano','platform'));

-- Single place that answers "can this user dispatch for this division's
-- warehouse" — new per-division domain OR the legacy broad grant OR admin.
create or replace function authorize_warehouse(p_division text)
returns boolean language plpgsql security definer stable as $$
begin
  if p_division is null then return authorize('warehouse','dispatch') or authorize('platform','admin'); end if;
  return authorize('warehouse_' || p_division, 'dispatch')
      or authorize('warehouse', 'dispatch')
      or authorize('platform', 'admin');
end;
$$;

-- 1. RLS policies — samples/sample_collections/collection_collaborators

drop policy if exists "editors can update sample status" on samples;
create policy "editors can update sample status"
  on samples for update using (
    requested_by = auth.uid()
    or authorize('customer_service','manage_status')
    or authorize_warehouse((select division from products where id = samples.product_id))
  );

drop policy if exists "users can request samples" on samples;
create policy "users can request samples"
  on samples for insert with check (
    requested_by = auth.uid()
    or authorize('customer_service','write')
    or authorize_warehouse((select division from products where id = product_id))
  );

drop policy if exists "editors can update collections" on sample_collections;
create policy "editors can update collections"
  on sample_collections for update using (
    requested_by = auth.uid()
    or authorize('customer_service','manage_status')
    or exists (
      select 1 from samples s join products p on p.id = s.product_id
      where s.collection_id = sample_collections.id and authorize_warehouse(p.division)
    )
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
    or exists (
      select 1 from samples s join products p on p.id = s.product_id
      where s.collection_id = collection_id and authorize_warehouse(p.division)
    )
  );

-- 2. RPCs

create or replace function verify_sample(
  p_id uuid, p_user_id uuid, p_user_name text
) returns void language plpgsql security definer as $$
declare
  v_actor uuid := coalesce(auth.uid(), p_user_id);
  v_name  text;
  v_division text;
begin
  select p.division into v_division from samples s join products p on p.id = s.product_id where s.id = p_id;
  if auth.uid() is not null and not authorize_warehouse(v_division) then
    raise exception 'not authorized: warehouse/dispatch required for division %', coalesce(v_division, 'unknown');
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
  v_division text;
begin
  select p.division into v_division from samples s join products p on p.id = s.product_id where s.id = p_id;
  if auth.uid() is not null and not authorize_warehouse(v_division) then
    raise exception 'not authorized: warehouse/dispatch required for division %', coalesce(v_division, 'unknown');
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
  v_authorized boolean;
begin
  select requested_by into v_requester from sample_collections where id = p_id;
  select exists (
    select 1 from samples s join products p on p.id = s.product_id
    where s.collection_id = p_id and authorize_warehouse(p.division)
  ) into v_authorized;
  if auth.uid() is not null
     and v_actor <> v_requester
     and not authorize('customer_service','manage_status')
     and not v_authorized then
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
  v_division text;
begin
  select requested_by into v_requester from samples where id = p_id;
  select p.division into v_division from samples s join products p on p.id = s.product_id where s.id = p_id;
  if auth.uid() is not null
     and v_actor <> v_requester
     and not authorize('customer_service','manage_status')
     and not authorize_warehouse(v_division) then
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

-- 3. Inventory locations — can_adjust_location already checks the
--    location's own owner_domain (which may already be a specific
--    division); this just makes the warehouse-wide fallback
--    division-aware too instead of a blanket bypass.
create or replace function can_adjust_location(p_location uuid)
returns boolean language plpgsql security definer stable as $$
declare v_domain text;
begin
  select owner_domain into v_domain from inventory_locations where id = p_location;
  if v_domain is null then return false; end if;
  return authorize(v_domain, 'write')
      or authorize_warehouse(case when v_domain in ('fiber','yarn','fabric','chemicals','garment') then v_domain else null end)
      or authorize('platform', 'admin');
end;
$$;
