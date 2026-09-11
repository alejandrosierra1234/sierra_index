begin;
-- Work queue summaries respect the existing collection and sample RLS policies.
create or replace function sample_center(p_view text default 'work',p_search text default '',p_offset integer default 0,p_limit integer default 30)
returns jsonb language sql stable security invoker set search_path=public,pg_temp as $$
with summary as (
 select c.id,c.collection_id,c.name,c.customer,c.recipient,c.requested_by,c.deadline,c.status,c.updated_at,
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
 where auth.uid() is not null
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
revoke all on function sample_center(text,text,integer,integer) from public,anon;
grant execute on function sample_center(text,text,integer,integer) to authenticated;
notify pgrst,'reload schema';
commit;
