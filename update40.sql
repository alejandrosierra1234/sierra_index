-- Authorization v2. Apply after update39 as one transaction.
-- No legacy editor/dispatcher fallback. Existing explicit grants survive.
begin;
create table if not exists public.index_security_migrations(version integer primary key,applied_at timestamptz not null default now());
revoke all on public.index_security_migrations from public,anon,authenticated;
alter table public.capability_grants drop constraint if exists capability_grants_domain_check;
alter table public.capability_grants add constraint capability_grants_domain_check check(domain in
 ('fiber','yarn','fabric','chemicals','garment','warehouse','warehouse_fiber','warehouse_yarn',
  'warehouse_fabric','warehouse_chemicals','warehouse_garment','customer_service','talento_humano','platform'));

create or replace function public.index_account_active()
returns boolean language sql stable security definer set search_path=public,pg_temp as $$
  select exists(select 1 from public.profiles where id=auth.uid() and account_status='active');
$$;

-- Preserve platform administration explicitly, never via a role fallback.
insert into public.capability_grants(user_id,domain,capability)
select p.id,'platform',c.capability from public.profiles p
cross join (values ('admin'),('grant'),('read')) c(capability)
where p.role='admin' and p.account_status='active'
  and not exists(select 1 from index_security_migrations where version=40)
  and not exists(select 1 from public.capability_grants g
    where g.user_id=p.id and g.domain='platform' and g.capability=c.capability
      and g.resource_id is null and (g.expires_at is null or g.expires_at>now()));

create or replace function public.authorize(p_domain text,p_capability text,p_resource_id uuid default null)
returns boolean language sql stable security definer set search_path=public,pg_temp as $$
  select public.index_account_active() and exists(
    select 1 from public.capability_grants g where g.user_id=auth.uid()
    and (g.expires_at is null or g.expires_at>now())
    and ((g.domain='platform' and g.capability='admin' and g.resource_id is null)
      or (g.domain=p_domain and g.capability=p_capability
        and (g.resource_id is null or g.resource_id=p_resource_id))));
$$;

create or replace function public.get_my_access()
returns jsonb language sql stable security definer set search_path=public,pg_temp as $$
  select jsonb_build_object('version',2,'active',public.index_account_active(),
    'grants',coalesce((select jsonb_agg(jsonb_build_object('domain',g.domain,
      'capability',g.capability,'resource_id',g.resource_id,'expires_at',g.expires_at))
      from public.capability_grants g where g.user_id=auth.uid()
      and public.index_account_active() and (g.expires_at is null or g.expires_at>now())),'[]'::jsonb));
$$;
revoke all on function public.get_my_access() from public,anon;
grant execute on function public.get_my_access() to authenticated;

-- A single atomic assignment, also used for revocation. No partial successes.
create or replace function public.set_index_access(p_user uuid,p_domain text,p_caps text[])
returns void language plpgsql security definer set search_path=public,pg_temp as $$
begin
  if not public.authorize('platform','admin') then raise exception 'not authorized'; end if;
  if p_user=auth.uid() then raise exception 'Use another administrator to change your access'; end if;
  if not exists(select 1 from profiles where id=p_user) then raise exception 'Unknown account'; end if;
  if p_domain not in ('fiber','yarn','fabric','chemicals','garment','warehouse',
    'warehouse_fiber','warehouse_yarn','warehouse_fabric','warehouse_chemicals','warehouse_garment',
    'customer_service','talento_humano','platform') then raise exception 'Invalid domain'; end if;
  if p_caps is null or not p_caps <@ array['read','write','delete','publish','dispatch','manage_status','grant','admin']::text[]
    or ('admin'=any(p_caps) and p_domain<>'platform') then raise exception 'Invalid capabilities'; end if;
  perform pg_advisory_xact_lock(hashtext('index-access:'||p_user::text));
  delete from capability_grants where user_id=p_user and domain=p_domain and resource_id is null;
  insert into capability_grants(user_id,domain,capability,granted_by)
    select p_user,p_domain,c,auth.uid() from (select distinct unnest(p_caps) c) q;
end;
$$;
revoke all on function public.set_index_access(uuid,text,text[]) from public,anon;
grant execute on function public.set_index_access(uuid,text,text[]) to authenticated;

-- Changes must use the audited transaction; direct grants cannot bypass it.
revoke insert,update,delete on public.capability_grants from public,authenticated,anon;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path=public,pg_temp as $$
 select public.authorize('platform','admin');
$$;
-- Context-free legacy helper must never confer cross-domain editing.
create or replace function public.is_editor_or_above()
returns boolean language sql stable security definer set search_path=public,pg_temp as $$
 select public.authorize('platform','admin');
$$;

-- Restrictive policies combine with every legacy permissive policy via AND.
do $$
declare t record;
begin
  for t in select tablename from pg_tables where schemaname='public' loop
    execute format('alter table public.%I enable row level security',t.tablename);
    execute format('drop policy if exists index_active_account on public.%I',t.tablename);
    execute format('create policy index_active_account on public.%I as restrictive for all to authenticated using (public.index_account_active()) with check (public.index_account_active())',t.tablename);
  end loop;
end $$;

-- Every Data API operation, including SECURITY DEFINER RPCs, checks suspension.
-- Public cards remain reachable only through their deliberately public RPCs.
create or replace function public.index_check_request()
returns void language plpgsql security definer set search_path=public,pg_temp as $$
begin
 if auth.role()='service_role' then return; end if;
 if auth.role()='anon' and current_setting('request.path',true) in
   ('/rpc/get_sample_public_card','/rpc/request_sample_public_card') then return; end if;
 if not public.index_account_active() then raise insufficient_privilege using message='Account inactive or unauthenticated'; end if;
end;
$$;
grant execute on function public.index_check_request() to anon,authenticated,service_role;
alter role authenticator set pgrst.db_pre_request='public.index_check_request';
notify pgrst,'reload config';

revoke all on all tables in schema public from anon;
drop policy if exists index_profile_read on profiles;
create policy index_profile_read on profiles as restrictive for select to authenticated
 using(id=auth.uid() or authorize('platform','read') or authorize('talento_humano','read'));

create or replace function public.index_can_read_collection(p_id uuid)
returns boolean language sql stable security definer set search_path=public,pg_temp as $$
 select public.index_account_active() and (
   public.authorize('customer_service','read',p_id)
   or exists(select 1 from sample_collections where id=p_id and requested_by=auth.uid())
   or exists(select 1 from collection_collaborators where collection_id=p_id and user_id=auth.uid())
   or exists(select 1 from samples s join products p on p.id=s.product_id
     where s.collection_id=p_id and (public.authorize('warehouse','read')
       or public.authorize('warehouse_'||p.division,'read'))));
$$;

drop policy if exists index_product_read on products;
create policy index_product_read on products as restrictive for select to authenticated
 using (authorize(division,'read',id) and (coalesce(lifecycle,'available') not in ('draft','development') or authorize(division,'write',id)));
drop policy if exists index_product_insert on products;
create policy index_product_insert on products as restrictive for insert to authenticated with check(authorize(division,'write'));
drop policy if exists index_product_update on products;
create policy index_product_update on products as restrictive for update to authenticated using(authorize(division,'write')) with check(authorize(division,'write'));
drop policy if exists index_product_delete on products;
create policy index_product_delete on products as restrictive for delete to authenticated using(authorize(division,'delete'));
-- Capability grants also need a positive policy (old role policies alone deny new editors).
drop policy if exists index_product_capabilities on products;
create policy index_product_capabilities on products for all to authenticated using(authorize(division,'read')) with check(authorize(division,'write'));

drop policy if exists index_collection_read on sample_collections;
create policy index_collection_read on sample_collections as restrictive for select to authenticated using(index_can_read_collection(id));
drop policy if exists index_sample_read on samples;
create policy index_sample_read on samples as restrictive for select to authenticated
 using(requested_by=auth.uid() or index_can_read_collection(collection_id));
drop policy if exists index_collaborator_read on collection_collaborators;
create policy index_collaborator_read on collection_collaborators as restrictive for select to authenticated using(index_can_read_collection(collection_id));

do $$
declare t text;
begin
 foreach t in array array['collection_comments','collection_categories'] loop
  execute format('drop policy if exists index_collection_read on public.%I',t);
  execute format('create policy index_collection_read on public.%I as restrictive for select to authenticated using (index_can_read_collection(collection_id))',t);
 end loop;
 foreach t in array array['product_comments','product_events'] loop
  execute format('drop policy if exists index_product_read on public.%I',t);
  execute format('create policy index_product_read on public.%I as restrictive for select to authenticated using (exists(select 1 from public.products p where p.id=product_id))',t);
 end loop;
end $$;
drop policy if exists index_sample_event_read on sample_events;
create policy index_sample_event_read on sample_events as restrictive for select to authenticated
 using(exists(select 1 from samples s where s.id=sample_events.sample_id));
drop policy if exists index_link_read on product_links;
create policy index_link_read on product_links as restrictive for select to authenticated
 using(exists(select 1 from products p where p.id=source_id) and exists(select 1 from products p where p.id=target_id));

create or replace function public.index_inventory_access(p_product uuid,p_location uuid)
returns boolean language sql stable security definer set search_path=public,pg_temp as $$
 select public.index_account_active() and (
 public.authorize('warehouse','read') or public.authorize('warehouse','dispatch')
 or exists(select 1 from products p where p.id=p_product and
   (public.authorize(p.division,'read') or public.authorize('warehouse_'||p.division,'read') or public.authorize('warehouse_'||p.division,'dispatch')))
 or exists(select 1 from inventory_locations l where l.id=p_location and public.authorize(l.owner_domain,'read')));
$$;
drop policy if exists index_inventory_read on inventory_locations;
create policy index_inventory_read on inventory_locations as restrictive for select to authenticated
 using(authorize(owner_domain,'read') or authorize('warehouse','read') or authorize('warehouse','dispatch')
   or exists(select 1 from inventory_stock s where s.location_id=inventory_locations.id)
   or exists(select 1 from sample_stock s where s.location_id=inventory_locations.id));
do $$
declare t text;
begin
 foreach t in array array['inventory_stock','inventory_movements','sample_stock'] loop
  execute format('drop policy if exists index_inventory_read on public.%I',t);
  execute format('create policy index_inventory_read on public.%I as restrictive for select to authenticated using (index_inventory_access(product_id,location_id))',t);
 end loop;
end $$;
drop policy if exists index_inventory_read on sample_stock_events;
create policy index_inventory_read on sample_stock_events as restrictive for select to authenticated
 using(exists(select 1 from sample_stock s where s.id=stock_id));

-- Cloning is a read operation on the source, even though the new owner is the caller.
create or replace function public.clone_collection_to_draft(p_source_id uuid)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare
 v_uid uuid:=auth.uid(); v_src sample_collections%rowtype;
 v_ref text; v_new_id uuid; r record; v_sample_id text;
begin
 if not public.index_can_read_collection(p_source_id) then raise insufficient_privilege using message='Collection access denied'; end if;
 select * into v_src from sample_collections where id=p_source_id;
 if v_src.id is null then raise exception 'source collection not found'; end if;
 v_ref:=next_collection_id();
 insert into sample_collections(collection_id,name,customer,status,requested_by)
 values(v_ref,'Copy of '||coalesce(v_src.name,v_src.collection_id),v_src.customer,'draft',v_uid) returning id into v_new_id;
 for r in select product_id,sample_type,quantity from samples where collection_id=p_source_id loop
  v_sample_id:=next_sample_id();
  insert into samples(sample_id,product_id,sample_type,quantity,status,requested_by,collection_id)
  values(v_sample_id,r.product_id,r.sample_type,r.quantity,'draft',v_uid,v_new_id);
 end loop;
 return jsonb_build_object('collection_id',v_new_id,'collection_ref',v_ref);
end;
$$;

-- Preserve existing authenticated function access, remove anonymous defaults.
do $$
declare f record; allowed boolean;
begin
 for f in select oid,oid::regprocedure signature from pg_proc where pronamespace='public'::regnamespace and prokind='f' loop
  allowed:=has_function_privilege('authenticated',f.oid,'execute');
  execute format('revoke execute on function %s from public,anon',f.signature);
  if allowed then execute format('grant execute on function %s to authenticated',f.signature); end if;
 end loop;
end $$;
grant execute on function public.index_check_request() to anon;
grant execute on function public.get_sample_public_card(uuid,integer) to anon;
-- The request RPC signature is resolved by name to preserve its published contract.
do $$
declare f record;
begin
 for f in select oid::regprocedure signature from pg_proc where pronamespace='public'::regnamespace and proname='request_sample_public_card' loop
  execute format('grant execute on function %s to anon',f.signature);
 end loop;
 -- Obsolete creation RPCs accept a client-supplied actor. Current UI uses the space-aware API.
 for f in select oid::regprocedure signature from pg_proc where pronamespace='public'::regnamespace
  and (proname='create_sample' or (proname='create_sample_collection' and pronargs>1)) loop
  execute format('revoke execute on function %s from authenticated',f.signature);
 end loop;
end $$;
insert into public.index_security_migrations(version) values(40) on conflict do nothing;
notify pgrst,'reload schema';
commit;
