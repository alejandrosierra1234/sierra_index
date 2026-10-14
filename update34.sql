-- Physical Fabric/Garment inventory. Separate from legacy inventory for other divisions.
begin;
create table if not exists sample_stock (
 id uuid primary key default gen_random_uuid(),product_id uuid not null references products(id),
 location_id uuid not null references inventory_locations(id),format text not null,color text not null default '',lot text not null default '',
 unit text not null check(unit in ('piece','m','yd')),qty numeric(14,3) not null default 0 check(qty>=0),reserved numeric(14,3) not null default 0 check(reserved>=0 and reserved<=qty),
 updated_at timestamptz not null default now(),unique(product_id,location_id,format,color,lot,unit)
);
create table if not exists sample_stock_events (
 id uuid primary key default gen_random_uuid(),stock_id uuid not null references sample_stock(id),movement_type text not null,
 qty numeric(14,3) not null,reason text not null,collection_id uuid references sample_collections(id),sample_id uuid references samples(id),
 actor uuid not null references auth.users(id),created_at timestamptz not null default now()
);
insert into inventory_locations(key,name,owner_label,owner_domain) values
 ('nt_development_rolls','Northern Textiles · Rollos de desarrollo','PD · Northern Textiles','warehouse'),
 ('nt_sample_hangers','Northern Textiles · Hangers','PD · Northern Textiles','warehouse'),
 ('nt_sample_garments','Northern Textiles · Prendas','PD · Northern Textiles','warehouse') on conflict(key) do nothing;
alter table samples alter column quantity type numeric(14,3);
alter table samples add column if not exists stock_id uuid references sample_stock(id);
create or replace function sample_stock_can(p_product uuid)
returns boolean language sql stable security definer set search_path=public,pg_temp as $$
select auth.uid() is not null and exists(select 1 from products p where p.id=p_product and p.division in ('fabric','garment') and (authorize('platform','admin') or authorize('warehouse','dispatch') or authorize('warehouse_'||p.division,'dispatch')));
$$;
alter table sample_stock enable row level security;
alter table sample_stock_events enable row level security;
drop policy if exists sample_stock_read on sample_stock;
create policy sample_stock_read on sample_stock for select to authenticated using(auth.uid() is not null);
drop policy if exists sample_stock_event_read on sample_stock_events;
create policy sample_stock_event_read on sample_stock_events for select to authenticated using(auth.uid() is not null);
revoke all on sample_stock,sample_stock_events from public,anon,authenticated;
grant select on sample_stock,sample_stock_events to authenticated;
create or replace function adjust_sample_stock(p_product uuid,p_location uuid,p_format text,p_color text,p_lot text,p_unit text,p_qty numeric,p_reason text,p_stock uuid default null,p_expected timestamptz default null)
returns uuid language plpgsql security definer set search_path=public,pg_temp as $$
declare st sample_stock; delta numeric; result uuid;
begin
 if not sample_stock_can(p_product) then raise exception 'PD administra las existencias físicas'; end if;
 if p_qty is null or p_qty<0 or p_qty>99999999999 or nullif(trim(p_reason),'') is null then raise exception 'Indica una cantidad válida y el motivo'; end if;
 if p_qty<>round(p_qty,3) then raise exception 'Usa como máximo tres decimales'; end if;
 if (p_format='Yard' and p_unit<>'yd') or (p_format='Meter' and p_unit<>'m') or (p_format in ('Hanger','Swatch','Prototype','Mock-up','Fit Sample','Salesman Sample') and p_unit<>'piece') then raise exception 'El formato y la unidad no coinciden'; end if;
 if p_unit='piece' and p_qty<>trunc(p_qty) then raise exception 'Las piezas deben ser enteras'; end if;
 if not exists(select 1 from inventory_locations where id=p_location and active) then raise exception 'Ubicación no disponible'; end if;
 if nullif(trim(p_format),'') is null then raise exception 'Indica el formato'; end if;
 if p_stock is null then
   insert into sample_stock(product_id,location_id,format,color,lot,unit,qty) values(p_product,p_location,trim(p_format),trim(coalesce(p_color,'')),trim(coalesce(p_lot,'')),p_unit,p_qty) returning id into result;
   delta:=p_qty;
 else
   select * into st from sample_stock where id=p_stock and product_id=p_product for update;
   if not found then raise exception 'Existencia no encontrada'; end if;
   if st.updated_at is distinct from p_expected then raise exception 'La existencia cambió. Actualiza antes de corregirla.'; end if;
   if row(st.location_id,st.format,st.color,st.lot,st.unit) is distinct from row(p_location,trim(p_format),trim(coalesce(p_color,'')),trim(coalesce(p_lot,'')),p_unit) then raise exception 'La identidad del lote no se modifica al corregir el conteo'; end if;
   if p_qty<st.reserved then raise exception 'El conteo no puede quedar por debajo de las reservas'; end if;
   delta:=p_qty-st.qty;result:=st.id;
   update sample_stock set qty=p_qty,updated_at=now() where id=st.id;
 end if;
 if delta<>0 then insert into sample_stock_events(stock_id,movement_type,qty,reason,actor) values(result,'adjustment',delta,trim(p_reason),auth.uid()); end if;
 return result;
end;
$$;
create or replace function sample_stock_move(p_stock uuid,p_type text,p_qty numeric,p_reason text,p_collection uuid,p_sample uuid)
returns void language plpgsql security definer set search_path=public,pg_temp as $$
declare st sample_stock;
begin
 select * into st from sample_stock where id=p_stock for update;
 if not found or p_qty<=0 or p_type not in ('reserved','released','dispatched') then raise exception 'Movimiento inválido'; end if;
 if (p_type='reserved' and st.qty-st.reserved<p_qty) or (p_type in ('released','dispatched') and st.reserved<p_qty) or (p_type='dispatched' and st.qty<p_qty) then raise exception 'La existencia cambió; actualiza y reintenta'; end if;
 update sample_stock set qty=qty-case when p_type='dispatched' then p_qty else 0 end,reserved=reserved+case when p_type='reserved' then p_qty else -p_qty end,updated_at=now() where id=st.id;
 insert into sample_stock_events(stock_id,movement_type,qty,reason,collection_id,sample_id,actor) values(st.id,p_type,p_qty,p_reason,p_collection,p_sample,auth.uid());
end;
$$;
revoke all on function sample_stock_move(uuid,text,numeric,text,uuid,uuid) from public,anon,authenticated;
revoke all on function sample_stock_can(uuid),adjust_sample_stock(uuid,uuid,text,text,text,text,numeric,text,uuid,timestamptz) from public,anon;
grant execute on function sample_stock_can(uuid),adjust_sample_stock(uuid,uuid,text,text,text,text,numeric,text,uuid,timestamptz) to authenticated;
create or replace function produce_sample_hangers(p_source uuid,p_expected timestamptz,p_length numeric,p_pieces integer)
returns uuid language plpgsql security definer set search_path=public,pg_temp as $$
declare src sample_stock; target uuid; location uuid;
begin
 select * into src from sample_stock where id=p_source for update;
 if not found or not sample_stock_can(src.product_id) then raise exception 'PD registra la preparación de hangers'; end if;
 if src.updated_at is distinct from p_expected then raise exception 'El rollo cambió. Actualiza antes de registrar el corte.'; end if;
 if src.unit not in ('m','yd') or p_length is null or p_length<=0 or p_length<>round(p_length,3) or p_length>src.qty-src.reserved or p_pieces is null or p_pieces<1 then raise exception 'Revisa longitud consumida, unidad y cantidad de hangers'; end if;
 select id into location from inventory_locations where key='nt_sample_hangers' and active;
 if location is null then raise exception 'El almacén de hangers no está disponible'; end if;
 update sample_stock set qty=qty-p_length,updated_at=now() where id=src.id;
 insert into sample_stock(product_id,location_id,format,color,lot,unit,qty) values(src.product_id,location,'Hanger',src.color,src.lot,'piece',p_pieces)
 on conflict(product_id,location_id,format,color,lot,unit) do update set qty=sample_stock.qty+excluded.qty,updated_at=now() returning id into target;
 insert into sample_stock_events(stock_id,movement_type,qty,reason,actor) values
  (src.id,'consumed',-p_length,'Preparación de '||p_pieces||' hangers · destino '||target,auth.uid()),
  (target,'produced',p_pieces,'Consumo '||p_length||' '||src.unit||' · origen '||src.id,auth.uid());
 return target;
end;
$$;
revoke all on function produce_sample_hangers(uuid,timestamptz,numeric,integer) from public,anon;
grant execute on function produce_sample_hangers(uuid,timestamptz,numeric,integer) to authenticated;
notify pgrst,'reload schema';
commit;
