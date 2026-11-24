-- Additive migration; requires INDEX authorization v2 and products. Rehearse before production.
begin;
create table public.digitization_settings (
 id boolean primary key default true check(id), revision integer not null default 1,
 config jsonb not null default '{"concurrency":1,"ocr_threshold":0.85,"interpretation_threshold":0.9,"required":["Development Code"],"ranges":{"GSM":[20,1500],"Width":[1,400]},"aliases":{},"templates":[],"max_bytes":20971520,"max_pixels":24000000,"blur_threshold":70,"glare_threshold":0.2,"retention_days":0}',
 updated_at timestamptz not null default now()
);
insert into public.digitization_settings(id) values(true);
create table public.digitization_batches (
 id uuid primary key default gen_random_uuid(), name text not null check(length(name) between 1 and 160),
 division text not null check(division in ('fabric','yarn','fiber','garment','chemicals')),
 created_by uuid not null references auth.users, created_at timestamptz not null default now(), paused boolean not null default false
);
create table public.digitization_jobs (
 id uuid primary key, batch_id uuid not null references public.digitization_batches,
 created_by uuid not null references auth.users, captured_at timestamptz not null default now(),
 filename text not null, sha256 text not null check(sha256 ~ '^[a-f0-9]{64}$'), original_path text not null unique,
 processed_path text, status text not null default 'Pending' check(status in ('Pending','Processing','Needs Review','Validated','Duplicate','Failed','Cancelled','Rejected')),
 ready boolean not null default false, attempts integer not null default 0, revision integer not null default 1,
 lease uuid, lease_until timestamptz, processed_at timestamptz, validated_at timestamptz, validated_by uuid references auth.users,
 result jsonb, fields jsonb not null default '{}', warnings jsonb not null default '[]', error text,
 product_id uuid references public.products, duplicate_of uuid references public.digitization_jobs,
 unique(batch_id,sha256)
);
create index digitization_queue on public.digitization_jobs(status,lease_until,captured_at) where ready;
create index digitization_batch on public.digitization_jobs(batch_id,captured_at,id);
create index digitization_hash on public.digitization_jobs(sha256);
create table public.digitization_events (
 id bigint generated always as identity primary key, job_id uuid references public.digitization_jobs,
 actor uuid references auth.users, action text not null, at timestamptz not null default now(), detail jsonb not null default '{}'
);
create table public.digitization_workers (
 id text primary key, seen_at timestamptz not null default now(), version text not null, detail jsonb not null default '{}'
);
alter table public.digitization_settings enable row level security;
alter table public.digitization_batches enable row level security;
alter table public.digitization_jobs enable row level security;
alter table public.digitization_events enable row level security;
alter table public.digitization_workers enable row level security;
-- Helpers are invokers; authoritative capability checks are the existing INDEX authorize().
create function public.digitization_can(p_batch uuid,p_cap text) returns boolean language sql stable security invoker set search_path=public,pg_temp as $$
 select exists(select 1 from digitization_batches b where b.id=p_batch and authorize(b.division,p_cap));
$$;
create policy digitization_batches_read on public.digitization_batches for select to authenticated using(authorize(division,'read'));
create policy digitization_jobs_read on public.digitization_jobs for select to authenticated using(digitization_can(batch_id,'read'));
create policy digitization_events_read on public.digitization_events for select to authenticated using(exists(select 1 from digitization_jobs j where j.id=job_id and digitization_can(j.batch_id,'read')));
create policy digitization_settings_read on public.digitization_settings for select to authenticated using(index_account_active());
create policy digitization_workers_read on public.digitization_workers for select to authenticated using(index_account_active());
grant select on public.digitization_batches,public.digitization_jobs,public.digitization_events,public.digitization_settings,public.digitization_workers to authenticated;
grant all on public.digitization_batches,public.digitization_jobs,public.digitization_events,public.digitization_settings,public.digitization_workers to service_role;
grant usage,select on sequence public.digitization_events_id_seq to service_role;
-- All mutations pass through explicit checks. No direct client UPDATE privilege.
create function public.digitization_batch(p_name text,p_division text) returns uuid language plpgsql security definer set search_path=public,pg_temp as $$
declare v uuid; begin
 if auth.uid() is null or not authorize(p_division,'write') or not authorize(p_division,'read') then raise insufficient_privilege; end if;
 insert into digitization_batches(name,division,created_by) values(p_name,p_division,auth.uid()) returning id into v; return v;
end $$;
create function public.digitization_enqueue(p_id uuid,p_batch uuid,p_hash text,p_filename text) returns public.digitization_jobs language plpgsql security definer set search_path=public,pg_temp as $$
declare j digitization_jobs; begin
 if auth.uid() is null or not digitization_can(p_batch,'write') or not digitization_can(p_batch,'read') then raise insufficient_privilege; end if;
 insert into digitization_jobs(id,batch_id,created_by,filename,sha256,original_path)
 values(p_id,p_batch,auth.uid(),left(p_filename,255),p_hash,p_batch::text||'/'||p_id::text||'/original')
 on conflict(batch_id,sha256) do nothing;
 select * into j from digitization_jobs where batch_id=p_batch and sha256=p_hash; return j;
end $$;
create function public.digitization_action(p_id uuid,p_revision integer,p_action text,p_fields jsonb default null,p_note text default '',p_product uuid default null) returns void language plpgsql security definer set search_path=public,pg_temp as $$
declare j digitization_jobs; field record; begin
 select * into strict j from digitization_jobs where id=p_id for update;
 if auth.uid() is null or not digitization_can(j.batch_id,'read') or not digitization_can(j.batch_id,'write') then raise insufficient_privilege; end if;
 if j.revision<>p_revision then raise exception 'Record changed. Refresh before saving.'; end if;
 if p_action='ready' then
  if j.status<>'Pending' then raise exception 'Invalid state'; end if;
  if not exists(select 1 from storage.objects where bucket_id='sample-digitization' and name=j.original_path) then raise exception 'Upload missing'; end if;
  update digitization_jobs set ready=true where id=p_id;
 elsif p_action in ('validate','save','reject','duplicate') then
  if j.status not in ('Needs Review','Validated','Duplicate','Rejected') then raise exception 'Review unavailable'; end if;
  if p_fields is null or jsonb_typeof(p_fields)<>'object' or octet_length(p_fields::text)>100000 then raise exception 'Invalid fields'; end if;
  for field in select key,value from jsonb_each(p_fields) loop
   if jsonb_typeof(field.value)<>'object' or jsonb_typeof(field.value->'value') is distinct from 'string' or length(field.key)>100 then raise exception 'Invalid field value'; end if;
  end loop;
  if p_action in ('validate','reject','duplicate') and length(trim(p_note))=0 then raise exception 'Review note required'; end if;
  if p_product is not null and not exists(select 1 from products p join digitization_batches b on b.id=j.batch_id where p.id=p_product and p.division=b.division and authorize(p.division,'read')) then raise exception 'Product not accessible in this division'; end if;
  update digitization_jobs set fields=p_fields,product_id=p_product,
   status=case p_action when 'validate' then 'Validated' when 'reject' then 'Rejected' when 'duplicate' then 'Duplicate' else 'Needs Review' end,
   validated_at=case when p_action='validate' then now() end,validated_by=case when p_action='validate' then auth.uid() end where id=p_id;
 elsif p_action='retry' then
  if j.status not in ('Failed','Needs Review','Duplicate','Rejected','Cancelled') then raise exception 'Retry unavailable'; end if;
  update digitization_jobs set status='Pending',error=null,lease=null,lease_until=null,validated_at=null,validated_by=null where id=p_id;
 elsif p_action='cancel' then
  if j.status not in ('Pending','Processing','Failed') then raise exception 'Cancel unavailable'; end if;
  update digitization_jobs set status='Cancelled',lease=null,lease_until=null where id=p_id;
 else raise exception 'Unknown action'; end if;
 update digitization_jobs set revision=revision+1 where id=p_id;
 insert into digitization_events(job_id,actor,action,detail) values(p_id,auth.uid(),p_action,jsonb_build_object('before',j.fields,'after',p_fields,'note',left(p_note,4000),'result_before',case when p_action='retry' then j.result end));
end $$;
create function public.digitization_pause(p_batch uuid,p_paused boolean) returns void language plpgsql security definer set search_path=public,pg_temp as $$
begin
 if auth.uid() is null or not digitization_can(p_batch,'read') or not digitization_can(p_batch,'write') then raise insufficient_privilege; end if;
 update digitization_batches set paused=p_paused where id=p_batch;
 insert into digitization_events(actor,action,detail) values(auth.uid(),'batch_pause',jsonb_build_object('batch',p_batch,'paused',p_paused));
end $$;
create function public.digitization_configure(p_config jsonb,p_revision integer) returns void language plpgsql security definer set search_path=public,pg_temp as $$
begin
 if auth.uid() is null or not authorize('platform','admin') then raise insufficient_privilege; end if;
 if jsonb_typeof(p_config)<>'object' or octet_length(p_config::text)>100000 or (p_config->>'concurrency')::int not between 1 and 4
 or (p_config->>'ocr_threshold')::numeric not between 0 and 1 or (p_config->>'interpretation_threshold')::numeric not between 0 and 1
 or jsonb_typeof(p_config->'required')<>'array' or jsonb_typeof(p_config->'aliases')<>'object' or jsonb_typeof(p_config->'templates')<>'array'
 or (p_config->>'max_bytes')::int not between 1024 and 20971520 or (p_config->>'max_pixels')::int not between 100000 and 24000000
 or coalesce((p_config->>'retention_days')::int,0)<>0
 or jsonb_typeof(p_config->'ranges') is distinct from 'object'
 or not p_config ?& array['concurrency','ocr_threshold','interpretation_threshold','required','aliases','templates','max_bytes','max_pixels'] then raise exception 'Invalid configuration'; end if;
 if exists(select 1 from jsonb_each(p_config->'aliases') a where jsonb_typeof(a.value)<>'array') or exists(select 1 from jsonb_each(p_config->'ranges') a where jsonb_typeof(a.value)<>'array' or jsonb_array_length(a.value)<>2) then raise exception 'Invalid aliases/ranges'; end if;
 update digitization_settings set config=p_config,revision=revision+1,updated_at=now() where id and revision=p_revision;
 if not found then raise exception 'Configuration changed'; end if;
 insert into digitization_events(actor,action,detail) values(auth.uid(),'configure',p_config);
end $$;
-- Worker RPCs are service_role ONLY. Lease fencing rejects stale/duplicate completion.
create function public.digitization_claim() returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare j digitization_jobs; cfg jsonb; begin
 select config into cfg from digitization_settings where id;
 perform pg_advisory_xact_lock(hashtext('digitization_claim'));
 if (select count(*) from digitization_jobs where status='Processing' and lease_until>now()) >= (cfg->>'concurrency')::int then return null; end if;
 select q.* into j from digitization_jobs q join digitization_batches b on b.id=q.batch_id
 where q.ready and not b.paused and (q.status='Pending' or (q.status='Processing' and q.lease_until<now()))
 order by q.captured_at for update of q skip locked limit 1;
 if not found then return null; end if;
 update digitization_jobs set status='Processing',lease=gen_random_uuid(),lease_until=now()+interval '5 minutes',attempts=attempts+1,revision=revision+1 where id=j.id returning * into j;
 return jsonb_build_object('job',to_jsonb(j),'config',cfg,'config_revision',(select revision from digitization_settings where id));
end $$;
create function public.digitization_renew(p_id uuid,p_lease uuid) returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
begin update digitization_jobs set lease_until=now()+interval '5 minutes' where id=p_id and lease=p_lease and status='Processing' and lease_until>now(); return found; end $$;
create function public.digitization_finish(p_id uuid,p_lease uuid,p_result jsonb,p_error text default null) returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
declare j digitization_jobs; dupe uuid; candidates jsonb; begin
 select * into j from digitization_jobs where id=p_id and lease=p_lease and status='Processing' and lease_until>now() for update;
 if not found then return false; end if;
 select coalesce(jsonb_agg(jsonb_build_object('id',candidate.id,'signals',candidate.signals)),'[]') into candidates from (
 select q.id,array_remove(array[
 case when q.sha256=j.sha256 then 'identical_file' end,
 case when p_result->>'text_fingerprint'<>'' and q.result->>'text_fingerprint'=p_result->>'text_fingerprint' then 'identical_text' end,
 case when p_result->'fields'->'Development Code'->>'value'<>'' and q.fields->'Development Code'->>'value'=p_result->'fields'->'Development Code'->>'value' then 'same_development' end,
 case when p_result->>'technical_fingerprint'<>'' and q.result->>'technical_fingerprint'=p_result->>'technical_fingerprint' then 'similar_technical_fields' end,
 case when p_result->>'dhash' ~ '^[a-f0-9]{16}$' and q.result->>'dhash' ~ '^[a-f0-9]{16}$' then
  case when bit_count(('x'||(q.result->>'dhash'))::bit(64) # ('x'||(p_result->>'dhash'))::bit(64))<=6 then 'visually_similar' end end
 ],null) as signals
 from digitization_jobs q join digitization_batches b on b.id=q.batch_id join digitization_batches current_batch on current_batch.id=j.batch_id
 where q.id<>p_id and b.division=current_batch.division and q.processed_at is not null order by q.captured_at limit 10000
 ) candidate where cardinality(candidate.signals)>0;
 dupe=(candidates->0->>'id')::uuid;
 if p_result is not null then p_result=jsonb_set(p_result,'{duplicate_candidates}',candidates); end if;
 update digitization_jobs set status=case when p_error is not null then 'Failed' when dupe is not null then 'Duplicate' else 'Needs Review' end,
 result=p_result,fields=coalesce(p_result->'fields','{}'),warnings=coalesce(p_result->'warnings','[]'),error=left(p_error,2000),duplicate_of=dupe,
 processed_path=case when p_result is not null then j.batch_id::text||'/'||j.id::text||'/processed-'||p_lease::text||'.jpg' end,
 processed_at=now(),lease=null,lease_until=null,revision=revision+1 where id=p_id;
 insert into digitization_events(job_id,action,detail) values(p_id,'processed',jsonb_build_object('attempt',j.attempts,'error',left(p_error,2000),'lease',p_lease)); return true;
end $$;
revoke all on function public.digitization_claim(),public.digitization_renew(uuid,uuid),public.digitization_finish(uuid,uuid,jsonb,text) from public,anon,authenticated;
grant execute on function public.digitization_claim(),public.digitization_renew(uuid,uuid),public.digitization_finish(uuid,uuid,jsonb,text) to service_role;
revoke all on function public.digitization_can(uuid,text),public.digitization_batch(text,text),public.digitization_enqueue(uuid,uuid,text,text),public.digitization_action(uuid,integer,text,jsonb,text,uuid),public.digitization_pause(uuid,boolean),public.digitization_configure(jsonb,integer) from public,anon;
grant execute on function public.digitization_can(uuid,text),public.digitization_batch(text,text),public.digitization_enqueue(uuid,uuid,text,text),public.digitization_action(uuid,integer,text,jsonb,text,uuid),public.digitization_pause(uuid,boolean),public.digitization_configure(jsonb,integer) to authenticated;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('sample-digitization','sample-digitization',false,20971520,array['image/jpeg','image/png','image/webp','image/heic','image/heif','application/octet-stream']);
create policy digitization_image_read on storage.objects for select to authenticated using(bucket_id='sample-digitization' and exists(select 1 from public.digitization_jobs j where (j.original_path=name or j.processed_path=name) and public.digitization_can(j.batch_id,'read')));
create policy digitization_image_insert on storage.objects for insert to authenticated with check(bucket_id='sample-digitization' and exists(select 1 from public.digitization_jobs j where j.original_path=name and j.created_by=auth.uid() and not j.ready and j.status='Pending' and public.digitization_can(j.batch_id,'write')));
-- Defense in depth: unrelated permissive legacy storage policies must not expose this bucket.
create policy digitization_storage_boundary on storage.objects as restrictive for all to authenticated
 using(bucket_id<>'sample-digitization' or exists(select 1 from public.digitization_jobs j where (j.original_path=name or j.processed_path=name) and public.digitization_can(j.batch_id,'read')))
 with check(bucket_id<>'sample-digitization' or exists(select 1 from public.digitization_jobs j where j.original_path=name and j.created_by=auth.uid() and not j.ready and j.status='Pending' and public.digitization_can(j.batch_id,'write')));
create policy digitization_storage_anon_boundary on storage.objects as restrictive for all to anon using(bucket_id<>'sample-digitization') with check(bucket_id<>'sample-digitization');
-- Anonymous and legacy UPDATE/DELETE policies cannot mutate digitization evidence.
create policy digitization_storage_no_update on storage.objects as restrictive for update to authenticated using(bucket_id<>'sample-digitization') with check(bucket_id<>'sample-digitization');
create policy digitization_storage_no_delete on storage.objects as restrictive for delete to authenticated using(bucket_id<>'sample-digitization');
create function public.digitization_metrics(p_batch uuid) returns jsonb language sql stable security invoker set search_path=public,pg_temp as $$
 with jobs as (select * from digitization_jobs where batch_id=p_batch),
 timings as (select avg((result->>'elapsed_seconds')::numeric) as average_seconds,count(*) as processed from jobs where result->>'elapsed_seconds' is not null and (result->>'elapsed_seconds')::numeric>0),
 accuracy as (select f.key,count(*) as reviewed,count(*) filter(where f.value->>'value'=j.result->'fields'->f.key->>'value') as unchanged
 from jobs j cross join lateral jsonb_each(j.fields) f where j.status='Validated' group by f.key),
 productivity as (select created_by,count(*) as captured,count(*) filter(where status='Validated') as validated from jobs group by created_by)
 select jsonb_build_object('timing',(select to_jsonb(t) from timings t),'accuracy',coalesce((select jsonb_agg(to_jsonb(a)) from accuracy a),'[]'),
 'productivity',coalesce((select jsonb_agg(to_jsonb(p)) from productivity p),'[]'),
 'pending',(select count(*) from jobs where status in ('Pending','Processing')),
 'intervention_rate',case when (select count(*) from jobs where processed_at is not null)>0 then 1.0 else null end);
$$;
revoke all on function public.digitization_metrics(uuid) from public,anon;
grant execute on function public.digitization_metrics(uuid) to authenticated;

create function public.digitization_cached(p_id uuid) returns jsonb language sql stable security definer set search_path=public,pg_temp as $$
 select jsonb_build_object('id',q.id,'result',q.result,'processed_path',q.processed_path)
 from digitization_jobs j join digitization_batches b on b.id=j.batch_id
 join digitization_jobs q on q.sha256=j.sha256 and q.id<>j.id
 join digitization_batches other on other.id=q.batch_id and other.division=b.division
 where j.id=p_id and j.attempts=1 and q.result is not null and q.processed_path is not null and q.status not in ('Failed','Rejected','Cancelled')
 order by q.processed_at limit 1;
$$;
revoke all on function public.digitization_cached(uuid) from public,anon,authenticated;
grant execute on function public.digitization_cached(uuid) to service_role;

commit;
