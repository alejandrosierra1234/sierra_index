-- Muestras: governed collections. Additive migration; existing records opt in.
-- Run as one transaction. No account assignments or inventory balances are changed.
begin;
alter table capability_grants drop constraint if exists capability_grants_domain_check;
alter table capability_grants add constraint capability_grants_domain_check check(domain in ('fiber','yarn','fabric','chemicals','garment','warehouse','customer_service','platform','warehouse_fabric','warehouse_garment'));
alter table public.collection_collaborators add column if not exists role text not null default 'contributor';
alter table public.collection_collaborators add column if not exists capabilities jsonb;

alter table public.sample_collections add column if not exists deadline date;
alter table public.samples add column if not exists price_unit text;
alter table public.samples add column if not exists released_product jsonb;

create table if not exists public.sample_workflow_settings (singleton boolean primary key default true check(singleton), auto_enable boolean not null default false);
alter table sample_workflow_settings enable row level security;
insert into sample_workflow_settings(singleton) values(true) on conflict do nothing;
revoke all on sample_workflow_settings from public,anon,authenticated;

create table if not exists public.sample_workflows (
  collection_id uuid primary key references public.sample_collections(id) on delete cascade,
  destination_kind text not null check(destination_kind in ('client','brand','internal')),
  brief text not null default '',
  destination_country text not null default '',
  configured boolean not null default false,
  costing_required boolean not null default false,
  label_title text not null default '',
  label_show_price boolean not null default false,
  stage text not null default 'selection' check(stage in ('selection','preparing','packing_review','packed','shipped','delivered','unfulfilled')),
  revision integer not null default 1,
  approved_revision integer,
  approved_by uuid references auth.users(id),
  approved_at timestamptz,
  packing_id uuid,
  tracking text,
  updated_at timestamptz not null default now()
);
create table if not exists public.sample_packing_lists (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references public.sample_collections(id),
  revision integer not null,
  content jsonb not null,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  unique(collection_id,revision)
);
create table if not exists public.sample_workflow_events (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references public.sample_collections(id),
  action text not null,
  revision integer not null,
  actor uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  detail jsonb not null default '{}'
);

create or replace function public.sample_workflow_can(p_collection uuid,p_cap text)
returns boolean language sql stable security definer set search_path=public,pg_temp as $$
select auth.uid() is not null and (
  authorize('platform','admin')
  or (p_cap in ('read','sales','select','people') and exists(select 1 from sample_collections c where c.id=p_collection and c.requested_by=auth.uid()))
  or (p_cap in ('read','sales','select','people') and authorize('customer_service','manage_status'))
  or (p_cap='read' and exists(select 1 from collection_collaborators c where c.collection_id=p_collection and c.user_id=auth.uid()))
  or exists(select 1 from collection_collaborators c where c.collection_id=p_collection and c.user_id=auth.uid() and (
    (p_cap in ('sales','select','people') and c.role='collection_manager')
    or (p_cap='sales' and c.role='commercial_editor')
    or (p_cap='select' and c.role in ('contributor','technical_editor','commercial_editor'))
    or (c.role='custom' and case p_cap when 'sales' then c.capabilities->>'edit_pricing' when 'select' then c.capabilities->>'manage_samples' when 'people' then c.capabilities->>'manage_people' end='true')
  ))
  or (p_cap in ('read','pd') and exists(select 1 from samples where collection_id=p_collection)
    and not exists(select 1 from samples s left join products p on p.id=s.product_id where s.collection_id=p_collection
      and not (authorize('warehouse','dispatch') or authorize('warehouse_'||coalesce(p.division,'unknown'),'dispatch'))))
);
$$;

alter table sample_workflows enable row level security;
alter table sample_packing_lists enable row level security;
alter table sample_workflow_events enable row level security;
drop policy if exists workflow_read on sample_workflows;
create policy workflow_read on sample_workflows for select to authenticated using(sample_workflow_can(collection_id,'read'));
drop policy if exists packing_read on sample_packing_lists;
create policy packing_read on sample_packing_lists for select to authenticated using(sample_workflow_can(collection_id,'read'));
drop policy if exists workflow_events_read on sample_workflow_events;
create policy workflow_events_read on sample_workflow_events for select to authenticated using(sample_workflow_can(collection_id,'read'));
drop policy if exists governed_sample_update on samples;
create policy governed_sample_update on samples for update to authenticated using(exists(select 1 from sample_workflows where collection_id=samples.collection_id) and (sample_workflow_can(collection_id,'sales') or sample_workflow_can(collection_id,'select') or sample_workflow_can(collection_id,'pd'))) with check(exists(select 1 from sample_workflows where collection_id=samples.collection_id));
grant select on sample_workflows,sample_packing_lists,sample_workflow_events to authenticated;
revoke insert,update,delete on sample_workflows,sample_packing_lists,sample_workflow_events from anon,authenticated;

create or replace function public.configure_sample_workflow(p_collection uuid,p_revision integer,p_destination text,p_costing boolean,p_brief text,p_label_title text default '',p_label_show_price boolean default false,p_country text default '')
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare w sample_workflows; c sample_collections;
begin
  if not sample_workflow_can(p_collection,'sales') then raise exception 'Solo Ventas puede definir el flujo'; end if;
  select * into c from sample_collections where id=p_collection for update;
  if not found then raise exception 'Colección no encontrada'; end if;
  select * into w from sample_workflows where collection_id=p_collection for update;
  if found then
    if w.revision<>p_revision then raise exception 'La colección cambió. Actualiza antes de guardar.'; end if;
    if w.stage<>'selection' then raise exception 'Reabre la selección antes de cambiar las condiciones'; end if;
  elsif c.status not in ('draft','requested','approved') then
    raise exception 'Una colección ya preparada debe conservar su flujo anterior';
  end if;
  if exists(select 1 from samples s left join products p on p.id=s.product_id where s.collection_id=p_collection and coalesce(p.division,'') not in ('fabric','garment')) then
    raise exception 'Este flujo corresponde a telas y prendas';
  end if;
  insert into sample_workflows(collection_id,destination_kind,costing_required,brief,configured,label_title,label_show_price,destination_country)
  values(p_collection,p_destination,coalesce(p_costing,false),coalesce(p_brief,''),true,left(coalesce(p_label_title,''),150),coalesce(p_label_show_price,false),left(trim(coalesce(p_country,'')),100))
  on conflict(collection_id) do update set destination_country=excluded.destination_country,label_title=excluded.label_title,label_show_price=excluded.label_show_price,configured=true,destination_kind=excluded.destination_kind,costing_required=excluded.costing_required,brief=excluded.brief,revision=sample_workflows.revision+1,updated_at=now()
  returning * into w;
  insert into sample_workflow_events(collection_id,action,revision,actor) values(p_collection,'configure',w.revision,auth.uid());
  return to_jsonb(w);
end;
$$;

-- Direct edits and legacy RPCs obey the same stage/role rules.
create or replace function public.guard_sample_workflow_item()
returns trigger language plpgsql security definer set search_path=public,pg_temp as $$
declare cid uuid; w sample_workflows; material boolean; commercial boolean; operational boolean; stock_changed boolean:=false;
begin
  cid:=case when tg_op='DELETE' then old.collection_id else new.collection_id end;
  if tg_op='UPDATE' and old.collection_id is distinct from new.collection_id and exists(select 1 from sample_workflows where collection_id=old.collection_id) then raise exception 'No se puede mover una muestra fuera de su colección'; end if;
  select * into w from sample_workflows where collection_id=cid for update;
  if not found then return case when tg_op='DELETE' then old else new end; end if;
  if tg_op='UPDATE' and old.requested_by is distinct from new.requested_by then raise exception 'No se puede cambiar el solicitante'; end if;
  if auth.uid() is null then raise exception 'Inicia sesión para modificar muestras'; end if;
  material:=tg_op<>'UPDATE'; commercial:=false; operational:=false;
  if tg_op='UPDATE' then
    if old.released_product is distinct from new.released_product and coalesce(current_setting('sierra.workflow_action',true),'')<>'release' then raise exception 'La ficha liberada no se modifica directamente'; end if;
    stock_changed:=old.stock_id is distinct from new.stock_id;
    material:=row(old.product_id,old.sample_type,old.quantity,old.notes,old.category_id) is distinct from row(new.product_id,new.sample_type,new.quantity,new.notes,new.category_id);
    commercial:=row(old.price,old.price_currency,old.price_unit,old.moq,old.price_valid_until,old.price_notes) is distinct from row(new.price,new.price_currency,new.price_unit,new.moq,new.price_valid_until,new.price_notes);
    operational:=row(old.verified,old.excluded,old.exclusion_reason,old.label_printed_at,old.sticker_printed_at) is distinct from row(new.verified,new.excluded,new.exclusion_reason,new.label_printed_at,new.sticker_printed_at);
    if new.status is distinct from old.status and new.status<>(case w.stage when 'selection' then 'draft' when 'preparing' then 'preparing' when 'packing_review' then 'ready' when 'packed' then 'ready' when 'shipped' then 'shipped' when 'unfulfilled' then 'archived' else 'delivered' end) then
      -- Submitting a draft does not release preparation.
      if not(w.stage='selection' and old.status='draft' and new.status='requested' and sample_workflow_can(cid,'sales')) then raise exception 'Usa la siguiente acción de la colección'; end if;
    end if;
  end if;
  if material and (w.stage<>'selection' or not sample_workflow_can(cid,'select')) then raise exception 'La selección está cerrada o no tienes permiso para editarla'; end if;
  if commercial and (w.stage<>'selection' or not sample_workflow_can(cid,'sales')) then raise exception 'Solo Ventas puede cambiar el costing durante la selección'; end if;
  if operational and not(coalesce(current_setting('sierra.workflow_action',true),'')='reopen' and sample_workflow_can(cid,'sales')) and (w.stage not in ('preparing','packing_review','packed') or not sample_workflow_can(cid,'pd')) then raise exception 'PD puede verificar y etiquetar después de la liberación'; end if;
  if stock_changed and not ((w.stage='selection' and sample_workflow_can(cid,'select')) or (w.stage in ('preparing','packing_review','packed') and sample_workflow_can(cid,'pd'))) then raise exception 'No puedes cambiar el lote en esta etapa'; end if;
  if (operational or stock_changed) and w.stage in ('packing_review','packed') then
    update sample_workflows set stage='preparing',approved_revision=null,approved_by=null,approved_at=null,packing_id=null where collection_id=cid;
  end if;
  if tg_op='UPDATE' then
    if commercial then new.sticker_printed_at:=null; end if;
    if material or stock_changed then new.label_printed_at:=null; new.sticker_printed_at:=null; new.verified:=false; end if;
  end if;
  if material or commercial or operational or stock_changed then
    update sample_workflows set revision=revision+1,updated_at=now() where collection_id=cid;
  end if;
  return case when tg_op='DELETE' then old else new end;
end;
$$;
drop trigger if exists sample_workflow_item_guard on samples;
create trigger sample_workflow_item_guard before insert or update or delete on samples for each row execute function guard_sample_workflow_item();

create or replace function public.guard_sample_workflow_collection()
returns trigger language plpgsql security definer set search_path=public,pg_temp as $$
declare w sample_workflows;
begin
  select * into w from sample_workflows where collection_id=old.id for update;
  if not found then return new; end if;
  if old.requested_by is distinct from new.requested_by then raise exception 'No se puede cambiar el solicitante'; end if;
  if row(old.recipient,old.address,old.customer,old.delivery_method) is distinct from row(new.recipient,new.address,new.customer,new.delivery_method) then
    if w.stage<>'selection' or not sample_workflow_can(old.id,'sales') then raise exception 'Reabre la selección para cambiar el destinatario'; end if;
    update sample_workflows set revision=revision+1,updated_at=now() where collection_id=old.id;
  end if;
  if new.status is distinct from old.status and new.status<>(case w.stage when 'selection' then 'draft' when 'preparing' then 'preparing' when 'packing_review' then 'ready' when 'packed' then 'ready' when 'shipped' then 'shipped' when 'unfulfilled' then 'archived' else 'delivered' end) then
    if not(w.stage='selection' and old.status='draft' and new.status='requested' and sample_workflow_can(old.id,'sales')) then raise exception 'Usa la siguiente acción del flujo de Muestras'; end if;
  end if;
  return new;
end;
$$;
drop trigger if exists sample_workflow_collection_guard on sample_collections;
create trigger sample_workflow_collection_guard before update on sample_collections for each row execute function guard_sample_workflow_collection();


create or replace function public.guard_sample_workflow_movement()
returns trigger language plpgsql security definer set search_path=public,pg_temp as $$
declare cid uuid;
begin
  cid:=new.collection_id;
  if cid is null and new.sample_id is not null then select collection_id into cid from samples where id=new.sample_id; end if;
  if exists(select 1 from sample_workflows where collection_id=cid) then raise exception 'Usa el inventario por lote desde el flujo de la colección'; end if;
  return new;
end;
$$;
drop trigger if exists sample_workflow_movement_guard on inventory_movements;
create trigger sample_workflow_movement_guard before insert on inventory_movements for each row execute function guard_sample_workflow_movement();

-- Avoid recursive collaborator policies and prevent self-escalation through legacy RPCs.
create or replace function public.guard_sample_workflow_collaborator()
returns trigger language plpgsql security definer set search_path=public,pg_temp as $$
declare cid uuid;
begin
  cid:=case when tg_op='DELETE' then old.collection_id else new.collection_id end;
  if not sample_workflow_can(cid,'people') then raise exception 'Solo el responsable comercial puede administrar colaboradores'; end if;
  if tg_op='UPDATE' and row(old.collection_id,old.user_id) is distinct from row(new.collection_id,new.user_id) then raise exception 'No se puede cambiar la identidad del colaborador'; end if;
  return case when tg_op='DELETE' then old else new end;
end;
$$;
drop trigger if exists sample_workflow_collaborator_guard on collection_collaborators;
create trigger sample_workflow_collaborator_guard before insert or update or delete on collection_collaborators for each row execute function guard_sample_workflow_collaborator();
drop policy if exists "collection managers can update collaborator roles" on collection_collaborators;
create policy "collection managers can update collaborator roles" on collection_collaborators for update to authenticated using(sample_workflow_can(collection_id,'people')) with check(sample_workflow_can(collection_id,'people'));

create or replace function public.sample_workflow_action(p_collection uuid,p_revision integer,p_action text,p_tracking text default null)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare w sample_workflows; c sample_collections; r record; st record; need numeric; held numeric; take_qty numeric; pack uuid; body jsonb; next_stage text;
begin
  if auth.uid() is null then raise exception 'Inicia sesión'; end if;
  select * into c from sample_collections where id=p_collection for update;
  select * into w from sample_workflows where collection_id=p_collection for update;
  if not found then raise exception 'Configura el flujo de la colección'; end if;
  if w.revision<>p_revision then raise exception 'Otro integrante cambió la colección. Actualiza antes de continuar.'; end if;
  if not sample_workflow_can(p_collection,case when p_action in ('release','approve','reopen') then 'sales' else 'pd' end) then raise exception 'No tienes permiso para esta acción'; end if;
  perform set_config('sierra.workflow_action',p_action,true);
  next_stage:=w.stage;
  if p_action='release' then
    if w.stage<>'selection' then raise exception 'La selección ya fue liberada'; end if;
    if nullif(trim(w.destination_country),'') is null then raise exception 'Indica el país de destino'; end if;
    if not w.configured then raise exception 'Confirma el destino y las condiciones de costing'; end if;
    if not exists(select 1 from samples where collection_id=p_collection) then raise exception 'Agrega muestras antes de liberar'; end if;
    if nullif(trim(c.recipient),'') is null then raise exception 'Completa el destinatario'; end if;
    if exists(select 1 from samples where collection_id=p_collection and (quantity is null or quantity<=0)) then raise exception 'Revisa las cantidades'; end if;
    if (w.costing_required or w.label_show_price) and exists(select 1 from samples where collection_id=p_collection and (price is null or price<0 or nullif(price_currency,'') is null or price_unit not in ('piece','m','yd') or price_unit is null or (price_valid_until is not null and price_valid_until<current_date))) then raise exception 'Completa el costing y revisa su vigencia antes de liberar'; end if;
    update samples s set released_product=(select jsonb_build_object('name',p.name,'code',p.code,'division',p.division,'specs',p.specs) from products p where p.id=s.product_id) where s.collection_id=p_collection;
    next_stage:='preparing';
  elsif p_action='pack' then
    if w.stage<>'preparing' then raise exception 'El paquete ya está registrado o todavía no está en preparación'; end if;
    if not exists(select 1 from samples where collection_id=p_collection and not coalesce(excluded,false)) then raise exception 'No se puede crear un paquete vacío'; end if;
    if exists(select 1 from samples where collection_id=p_collection and ((not coalesce(verified,false) and not coalesce(excluded,false)) or (excluded and nullif(trim(exclusion_reason),'') is null))) then raise exception 'Verifica las muestras e indica el motivo de cada faltante'; end if;
    if exists(select 1 from samples where collection_id=p_collection and not coalesce(excluded,false) and (label_printed_at is null or (w.label_show_price and sticker_printed_at is null))) then raise exception 'Imprime las etiquetas pendientes antes de cerrar el paquete'; end if;
    -- Reserve the exact physical lot selected for every included sample.
    for r in select * from samples where collection_id=p_collection order by id loop
      for st in select stock_id,sum(case movement_type when 'reserved' then qty when 'released' then -qty when 'dispatched' then -qty else 0 end) as held from sample_stock_events where sample_id=r.id group by stock_id loop
        if st.held>0 then perform sample_stock_move(st.stock_id,'released',st.held,'Revisión de packing list',p_collection,r.id); end if;
      end loop;
      if coalesce(r.excluded,false) then continue; end if;
      select s.* into st from sample_stock s join inventory_locations l on l.id=s.location_id where s.id=r.stock_id and s.product_id=r.product_id and s.format=r.sample_type and l.active for update of s;
      if not found then raise exception 'Selecciona el lote físico de % antes de empacar',r.sample_id; end if;
      if st.qty-st.reserved<r.quantity then raise exception 'Faltan existencias del lote de %. Registra la preparación o un faltante.',r.sample_id; end if;
      perform sample_stock_move(st.id,'reserved',r.quantity,'Packing list',p_collection,r.id);
    end loop;
    select jsonb_build_object('reference',c.collection_id,'customer',c.customer,'recipient',c.recipient,'address',c.address,'destination_kind',w.destination_kind,'country',w.destination_country,'items',jsonb_agg(jsonb_build_object('id',s.id,'sample_id',s.sample_id,'product_id',s.product_id,'name',coalesce(s.released_product->>'name',p.name),'code',coalesce(s.released_product->>'code',p.code),'format',s.sample_type,'quantity',s.quantity,'excluded',coalesce(s.excluded,false),'reason',s.exclusion_reason,'color',stock.color,'lot',stock.lot,'unit',stock.unit) order by s.created_at,s.id)) into body from samples s left join products p on p.id=s.product_id left join sample_stock stock on stock.id=s.stock_id where s.collection_id=p_collection;
    insert into sample_packing_lists(collection_id,revision,content,created_by) values(p_collection,w.revision+1,body,auth.uid()) returning id into pack;
    next_stage:=case when w.destination_kind='internal' then 'packed' else 'packing_review' end;
  elsif p_action='approve' then
    if w.stage<>'packing_review' or w.packing_id is null then raise exception 'No hay un packing list pendiente'; end if;
    next_stage:='packed';
  elsif p_action='ship' then
    if w.stage<>'packed' or w.packing_id is null then raise exception 'Registra el packing list y completa la aprobación antes de salir'; end if;
    if w.destination_kind<>'internal' and w.approved_revision is null then raise exception 'Ventas debe aprobar el packing list'; end if;
    if nullif(trim(p_tracking),'') is null then raise exception 'Registra la guía o referencia de entrega'; end if;
    for r in select s.id,s.quantity,s.sample_id from samples s where s.collection_id=p_collection and not coalesce(s.excluded,false) order by s.id loop
      held:=0;
      for st in select stock_id,sum(case movement_type when 'reserved' then qty when 'released' then -qty when 'dispatched' then -qty else 0 end) as held from sample_stock_events where sample_id=r.id group by stock_id loop
        if st.held>0 then
          perform sample_stock_move(st.stock_id,'dispatched',st.held,'Salida · '||p_tracking,p_collection,r.id);
          held:=held+st.held;
        end if;
      end loop;
      if held<>r.quantity then raise exception 'La reserva de % no coincide con el paquete. Concilia antes de salir.',r.sample_id; end if;
    end loop;
    next_stage:='shipped';
  elsif p_action='close_unfulfilled' then
    if w.stage<>'preparing' or not exists(select 1 from samples where collection_id=p_collection) or exists(select 1 from samples where collection_id=p_collection and (not coalesce(excluded,false) or nullif(trim(exclusion_reason),'') is null)) then raise exception 'Explica el faltante de todas las muestras antes de cerrar sin surtido'; end if;
    for st in select stock_id,sample_id,sum(case movement_type when 'reserved' then qty when 'released' then -qty when 'dispatched' then -qty else 0 end) as held from sample_stock_events where collection_id=p_collection group by stock_id,sample_id loop
      if st.held>0 then perform sample_stock_move(st.stock_id,'released',st.held,'Cierre sin surtido',p_collection,st.sample_id); end if;
    end loop;
    next_stage:='unfulfilled';
  elsif p_action='deliver' then
    if w.stage<>'shipped' then raise exception 'Confirma primero la salida'; end if;
    next_stage:='delivered';
  elsif p_action='reopen' then
    if w.stage not in ('preparing','packing_review','packed') then raise exception 'No se puede reabrir esta etapa'; end if;
    for st in select stock_id,sample_id,sum(case movement_type when 'reserved' then qty when 'released' then -qty when 'dispatched' then -qty else 0 end) as held from sample_stock_events where collection_id=p_collection group by stock_id,sample_id loop
      if st.held>0 then perform sample_stock_move(st.stock_id,'released',st.held,'Selección reabierta',p_collection,st.sample_id); end if;
    end loop;
    update samples set verified=false,excluded=false,exclusion_reason=null,label_printed_at=null,sticker_printed_at=null where collection_id=p_collection;
    next_stage:='selection';
  else raise exception 'Acción desconocida'; end if;
  update sample_workflows set stage=next_stage,revision=revision+1,updated_at=now(),
    packing_id=case when p_action='pack' then pack when p_action='reopen' then null else packing_id end,
    approved_revision=case when p_action='approve' then w.revision when p_action in ('pack','reopen') then null else approved_revision end,
    approved_by=case when p_action='approve' then auth.uid() when p_action in ('pack','reopen') then null else approved_by end,
    approved_at=case when p_action='approve' then now() when p_action in ('pack','reopen') then null else approved_at end,
    tracking=case when p_action='ship' then trim(p_tracking) else tracking end
    where collection_id=p_collection returning * into w;
  update sample_collections set status=case next_stage when 'selection' then 'draft' when 'preparing' then 'preparing' when 'packing_review' then 'ready' when 'packed' then 'ready' when 'shipped' then 'shipped' when 'unfulfilled' then 'archived' else 'delivered' end,updated_at=now() where id=p_collection;
  update samples set status=case next_stage when 'selection' then 'draft' when 'preparing' then 'preparing' when 'packing_review' then 'ready' when 'packed' then 'ready' when 'shipped' then 'shipped' when 'unfulfilled' then 'archived' else 'delivered' end,updated_at=now() where collection_id=p_collection and not coalesce(excluded,false);
  insert into sample_workflow_events(collection_id,action,revision,actor,detail) values(p_collection,p_action,w.revision,auth.uid(),jsonb_build_object('packing_id',w.packing_id,'stage',w.stage));
  perform set_config('sierra.workflow_action','',true);
  return to_jsonb(w);
end;
$$;
revoke all on function sample_workflow_can(uuid,text),configure_sample_workflow(uuid,integer,text,boolean,text,text,boolean,text),sample_workflow_action(uuid,integer,text,text) from public,anon;
grant execute on function sample_workflow_can(uuid,text),configure_sample_workflow(uuid,integer,text,boolean,text,text,boolean,text),sample_workflow_action(uuid,integer,text,text) to authenticated;

create or replace function public.start_sample_workflow()
returns trigger language plpgsql security definer set search_path=public,pg_temp as $$
begin
  if exists(select 1 from sample_workflow_settings where auto_enable) and new.collection_id is not null and exists(select 1 from sample_collections where id=new.collection_id and status='draft')
    and exists(select 1 from products where id=new.product_id and division in ('fabric','garment'))
    and not exists(select 1 from samples s left join products p on p.id=s.product_id where s.collection_id=new.collection_id and coalesce(p.division,'') not in ('fabric','garment')) then
    insert into sample_workflows(collection_id,destination_kind) values(new.collection_id,'client') on conflict do nothing;
  end if;
  return new;
end;
$$;
drop trigger if exists start_sample_workflow on samples;
create trigger start_sample_workflow after insert on samples for each row execute function start_sample_workflow();
create or replace function assign_sample_stock(p_sample uuid,p_stock uuid,p_revision integer,p_quantity numeric)
returns void language plpgsql security definer set search_path=public,pg_temp as $$
declare s samples; st sample_stock; w sample_workflows;
begin
 select * into s from samples where id=p_sample;
 select * into w from sample_workflows where collection_id=s.collection_id for update;
 if not found or w.revision<>p_revision then raise exception 'La selección cambió; actualiza antes de elegir el lote'; end if;
 if not ((w.stage='selection' and sample_workflow_can(s.collection_id,'select')) or (w.stage in ('preparing','packing_review','packed') and sample_workflow_can(s.collection_id,'pd'))) then raise exception 'No puedes asignar inventario en esta etapa'; end if;
 select * into st from sample_stock where id=p_stock and product_id=s.product_id and format=s.sample_type;
 if not found then raise exception 'El lote no corresponde a esta muestra y formato'; end if;
 if p_quantity is null or p_quantity<=0 or (st.unit='piece' and p_quantity<>trunc(p_quantity)) then raise exception 'Revisa la cantidad y la unidad'; end if;
 if w.stage<>'selection' and p_quantity<>s.quantity then raise exception 'Reabre la selección para cambiar la cantidad solicitada'; end if;
 update samples set stock_id=p_stock,quantity=p_quantity where id=p_sample;
end;
$$;
revoke all on function assign_sample_stock(uuid,uuid,integer,numeric) from public,anon;
grant execute on function assign_sample_stock(uuid,uuid,integer,numeric) to authenticated;
create or replace function mark_sample_preparation(p_sample uuid,p_revision integer,p_verified boolean,p_reason text default null)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare s samples;w sample_workflows;
begin
 select * into s from samples where id=p_sample;
 select * into w from sample_workflows where collection_id=s.collection_id for update;
 if not found or w.revision<>p_revision then raise exception 'La colección cambió. Actualiza antes de verificar.'; end if;
 if not sample_workflow_can(s.collection_id,'pd') or w.stage<>'preparing' then raise exception 'PD verifica durante la preparación'; end if;
 if not p_verified and nullif(trim(p_reason),'') is null then raise exception 'Explica por qué no se incluye la muestra'; end if;
 update samples set verified=p_verified,excluded=not p_verified,exclusion_reason=case when p_verified then null else trim(p_reason) end where id=p_sample;
 select * into w from sample_workflows where collection_id=s.collection_id;
 insert into sample_workflow_events(collection_id,action,revision,actor,detail) values(s.collection_id,case when p_verified then 'verified' else 'excluded' end,w.revision,auth.uid(),jsonb_build_object('sample_id',s.sample_id,'reason',p_reason));
 return to_jsonb(w);
end;
$$;
revoke all on function mark_sample_preparation(uuid,integer,boolean,text) from public,anon;
grant execute on function mark_sample_preparation(uuid,integer,boolean,text) to authenticated;
create or replace function save_sample_costing(p_sample uuid,p_revision integer,p_price numeric,p_unit text,p_moq text,p_valid_until date)
returns void language plpgsql security definer set search_path=public,pg_temp as $$
declare s samples;w sample_workflows;
begin
 select * into s from samples where id=p_sample;
 select * into w from sample_workflows where collection_id=s.collection_id for update;
 if not found or w.revision<>p_revision then raise exception 'La colección cambió. Actualiza antes de guardar el costing.'; end if;
 if w.stage<>'selection' or not sample_workflow_can(s.collection_id,'sales') then raise exception 'Ventas edita el costing durante la selección'; end if;
 if p_price is not null and (p_price<0 or p_unit is null or p_unit not in ('piece','m','yd')) then raise exception 'Revisa precio y unidad'; end if;
 update samples set price=p_price,price_currency='USD',price_unit=p_unit,moq=p_moq,price_valid_until=p_valid_until where id=p_sample;
end;
$$;
revoke all on function save_sample_costing(uuid,integer,numeric,text,text,date) from public,anon;
grant execute on function save_sample_costing(uuid,integer,numeric,text,text,date) to authenticated;
create or replace function get_sample_workflow_view(p_collection uuid)
returns jsonb language sql stable security invoker set search_path=public,pg_temp as $$
select jsonb_build_object('workflow',(select to_jsonb(w) from sample_workflows w where collection_id=p_collection),
 'items',(select coalesce(jsonb_agg(to_jsonb(s)||jsonb_build_object('products',jsonb_build_object('name',p.name,'code',p.code,'division',p.division)) order by s.created_at,s.id),'[]'::jsonb) from samples s left join products p on p.id=s.product_id where s.collection_id=p_collection))
where sample_workflow_can(p_collection,'read');
$$;
revoke all on function get_sample_workflow_view(uuid) from public,anon;
grant execute on function get_sample_workflow_view(uuid) to authenticated;
notify pgrst,'reload schema';
commit;
