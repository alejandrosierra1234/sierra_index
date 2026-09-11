begin;
alter table sample_collections add column if not exists sample_space text check(sample_space in ('textiles','yarn','chemicals','fiber','mixed'));
create or replace function sample_space_for_division(d text) returns text language sql immutable set search_path=public,pg_temp as $$ select case when d in ('fabric','garment') then 'textiles' when d in ('yarn','chemicals','fiber') then d else null end $$;
update sample_collections c set sample_space=x.space from (
 select s.collection_id,case when count(distinct sample_space_for_division(p.division))=1 then min(sample_space_for_division(p.division)) else 'mixed' end space
 from samples s join products p on p.id=s.product_id group by s.collection_id
) x where c.id=x.collection_id and c.sample_space is null;
-- Serialize the first selection on the collection row; concurrent teams cannot mix workspaces.
create or replace function guard_sample_space() returns trigger language plpgsql security definer set search_path=public,pg_temp as $$
declare target text; actual text;
begin
 if new.collection_id is null then return new; end if;
 if TG_OP='UPDATE' then if new.collection_id is not distinct from old.collection_id and new.product_id is not distinct from old.product_id then return new; end if; end if;
 select sample_space into target from sample_collections where id=new.collection_id for update;
 select sample_space_for_division(division) into actual from products where id=new.product_id;
 if actual is null then raise exception 'La referencia no tiene un espacio de muestras válido'; end if;
 if target is null then update sample_collections set sample_space=actual where id=new.collection_id;
 elsif target<>actual then raise exception 'Esta colección pertenece a otro espacio. Crea una colección para este equipo.'; end if;
 return new;
end $$;
drop trigger if exists samples_space_guard on samples;
create trigger samples_space_guard before insert or update of collection_id,product_id on samples for each row execute function guard_sample_space();
create or replace function guard_collection_sample_space() returns trigger language plpgsql security definer set search_path=public,pg_temp as $$
begin
 if new.sample_space is distinct from old.sample_space and old.sample_space is not null
 and exists(select 1 from samples where collection_id=old.id) then
 raise exception 'El equipo de una colección con referencias no puede cambiarse'; end if;
 return new;
end $$;
drop trigger if exists collection_sample_space_guard on sample_collections;
create trigger collection_sample_space_guard before update of sample_space on sample_collections for each row execute function guard_collection_sample_space();
create or replace function create_sample_collection(p_space text) returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare result jsonb;
begin
 if auth.uid() is null or p_space not in ('textiles','yarn','chemicals','fiber') or p_space is null then raise exception 'Selecciona un espacio de muestras'; end if;
 if not (authorize('customer_service','read') or authorize('platform','admin')) then raise exception 'No tienes permiso para crear colecciones'; end if;
 result:=create_draft_collection();
 update sample_collections set sample_space=p_space where id=(result->>'collection_id')::uuid;
 return result;
end $$;
revoke all on function create_sample_collection(text) from public,anon;
grant execute on function create_sample_collection(text) to authenticated;
-- Keep the old four-argument endpoint working for already-open browser tabs.
create or replace function sample_center_scoped(p_view text default 'work',p_search text default '',p_offset integer default 0,p_limit integer default 30,p_space text default '')
returns jsonb language sql stable security invoker set search_path=public,pg_temp as $$
with summary as (
 select c.id,c.sample_space,c.collection_id,c.name,c.customer,c.recipient,c.requested_by,c.deadline,c.status,c.updated_at,
 coalesce(pr.full_name,'Sin responsable identificado') as owner_name,
 w.stage,w.destination_kind,w.destination_country,w.configured,w.costing_required,w.label_show_price,w.tracking,
 sample_workflow_can(c.id,'sales') as can_sales,sample_workflow_can(c.id,'select') as can_select,sample_workflow_can(c.id,'pd') as can_pd,
 a.item_count,a.fabric_count,a.garment_count,a.pending_prices,a.pending_preparation,a.pending_labels,a.pending_stock,a.missing_count,
 (w.collection_id is not null) as governed
 from sample_collections c left join profiles pr on pr.id=c.requested_by
 left join sample_workflows w on w.collection_id=c.id
 cross join lateral (
  select count(*)::int item_count,
   count(*) filter(where p.division='fabric')::int fabric_count,
   count(*) filter(where p.division='garment')::int garment_count,
   count(*) filter(where s.price is null or s.price<0 or nullif(s.price_currency,'') is null or s.price_unit is null or s.price_unit not in ('piece','m','yd') or s.price_valid_until<current_date)::int pending_prices,
   count(*) filter(where not coalesce(s.verified,false) and not coalesce(s.excluded,false))::int pending_preparation,
   count(*) filter(where not coalesce(s.excluded,false) and (s.label_printed_at is null or (coalesce(w.label_show_price,false) and s.sticker_printed_at is null)))::int pending_labels,
   count(*) filter(where not coalesce(s.excluded,false) and s.stock_id is null)::int pending_stock,
   count(*) filter(where coalesce(s.excluded,false))::int missing_count
  from samples s left join products p on p.id=s.product_id where s.collection_id=c.id
 ) a
 where auth.uid() is not null and (coalesce(p_space,'')='' or c.sample_space=p_space or (p_space='unassigned' and c.sample_space is null))
), classified as (
 select *,case when governed then
  case when stage='selection' then (can_sales or can_select) and item_count>0
       when stage in ('preparing','packed','shipped') then can_pd
       when stage='packing_review' then can_sales else false end
  else status in ('draft','requested','approved','preparing','ready') and item_count>0 and (can_sales or can_pd or can_select) end actionable,
 case when governed then stage in ('shipped','delivered','unfulfilled') else status in ('shipped','picked_up','delivered','returned','damaged','archived') end tracked
 from summary
), filtered as (
 select * from classified where
 (p_view='collections' or (p_view='work' and actionable) or (p_view='tracking' and tracked))
 and (nullif(trim(p_search),'') is null or concat_ws(' ',name,collection_id,customer,recipient,owner_name,destination_country,tracking) ilike '%'||trim(p_search)||'%')
), page as (
 select * from filtered order by
 case when p_view='tracking' then 1 when deadline<current_date then 0 else 1 end,
 case when p_view<>'tracking' then deadline end asc nulls last,updated_at desc nulls last,id
 limit greatest(1,least(coalesce(p_limit,30),100)) offset greatest(coalesce(p_offset,0),0)
)
select jsonb_build_object('rows',coalesce((select jsonb_agg(to_jsonb(page)) from page),'[]'::jsonb),
 'total',(select count(*) from filtered),
 'counts',jsonb_build_object('work',(select count(*) from classified where actionable),'collections',(select count(*) from classified),'tracking',(select count(*) from classified where tracked)))
$$;
revoke all on function sample_center_scoped(text,text,integer,integer,text) from public,anon;
grant execute on function sample_center_scoped(text,text,integer,integer,text) to authenticated;
notify pgrst,'reload schema';
commit;
