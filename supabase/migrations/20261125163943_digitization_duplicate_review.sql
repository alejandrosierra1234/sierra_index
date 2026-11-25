begin;
create index digitization_event_review_lookup on public.digitization_events(job_id,action,id desc);
-- Evidence only: matching development/appearance is never physical identity.
create function public.digitization_duplicate_evidence(a jsonb,b jsonb,ha text,hb text,ra jsonb,rb jsonb,cfg jsonb default '{}') returns jsonb
language plpgsql immutable set search_path=public,pg_temp as $$
declare k text; av text; bv text; fa jsonb; fb jsonb; trusted boolean; matches text[]='{}'; differences text[]='{}'; uncertain text[]='{}'; signals text[]='{}'; technical int=0; distance int; kind text; rank int=0;
 visual_limit int=4; gsm_limit numeric=5; width_limit numeric=2;
begin
 if jsonb_typeof(cfg->'visual_distance')='number' then visual_limit=greatest(0,least(8,(cfg->>'visual_distance')::numeric))::int; end if;
 if jsonb_typeof(cfg->'gsm_percent')='number' then gsm_limit=greatest(0,least(10,(cfg->>'gsm_percent')::numeric)); end if;
 if jsonb_typeof(cfg->'width_cm')='number' then width_limit=greatest(0,least(5,(cfg->>'width_cm')::numeric)); end if;
 foreach k in array array['Development Code','Sample ID','Style Number','Color','Color Code','Lot Number','Batch Number','Composition','Construction','GSM','Width','Yarn Count','Yarn Type','Mill','Finishing Process'] loop
  fa=a->k; fb=b->k;
  av=lower(regexp_replace(trim(coalesce(fa->>'value','')),'\s+',' ','g')); bv=lower(regexp_replace(trim(coalesce(fb->>'value','')),'\s+',' ','g'));
  if av='' or bv='' then continue; end if;
  trusted=(fa->>'human_corrected'='true' or (jsonb_typeof(fa->'ocr_confidence')='number' and (fa->>'ocr_confidence')::numeric>=0.85 and jsonb_typeof(fa->'interpretation_confidence')='number' and (fa->>'interpretation_confidence')::numeric>=0.9))
      and (fb->>'human_corrected'='true' or (jsonb_typeof(fb->'ocr_confidence')='number' and (fb->>'ocr_confidence')::numeric>=0.85 and jsonb_typeof(fb->'interpretation_confidence')='number' and (fb->>'interpretation_confidence')::numeric>=0.9));
  if not coalesce(trusted,false) or fa ? 'conflicts' or fb ? 'conflicts' then uncertain=array_append(uncertain,k); continue; end if;
  -- Compare canonical units only; do not guess units from bare numbers.
  if k in ('GSM','Width') then
   if jsonb_typeof(fa#>'{normalized,value}') is distinct from 'number' or jsonb_typeof(fb#>'{normalized,value}') is distinct from 'number'
    or fa#>>'{normalized,unit}' is distinct from (case when k='GSM' then 'g/m²' else 'cm' end)
    or fb#>>'{normalized,unit}' is distinct from (case when k='GSM' then 'g/m²' else 'cm' end) then
    uncertain=array_append(uncertain,k);continue;
   end if;
   if (k='GSM' and abs((fa#>>'{normalized,value}')::numeric-(fb#>>'{normalized,value}')::numeric)<=greatest(abs((fa#>>'{normalized,value}')::numeric),abs((fb#>>'{normalized,value}')::numeric))*gsm_limit/100)
   or (k='Width' and abs((fa#>>'{normalized,value}')::numeric-(fb#>>'{normalized,value}')::numeric)<=width_limit) then av=bv;
   else differences=array_append(differences,k);continue;end if;
  end if;
  if av=bv then matches=array_append(matches,k);if k in ('Composition','Construction','GSM','Width','Yarn Count','Yarn Type') then technical=technical+1;end if;
  else differences=array_append(differences,k);end if;
 end loop;
 if ha<>'' and ha=hb then signals=array_append(signals,'identical_file');kind='same_photo';rank=100;end if;
 if ra->>'text_fingerprint'<>'' and ra->>'text_fingerprint'=rb->>'text_fingerprint' then signals=array_append(signals,'identical_text');end if;
 if 'Development Code'=any(matches) then signals=array_append(signals,'same_development');end if;
 if 'Sample ID'=any(matches) then signals=array_append(signals,'same_sample_id');end if;
 if technical>=3 then signals=array_append(signals,'similar_technical_fields');end if;
 if ra->>'dhash' ~ '^[a-f0-9]{16}$' and rb->>'dhash' ~ '^[a-f0-9]{16}$' then
  -- Flat images have low-information hashes and are not useful duplicate evidence.
  if bit_count(('x'||(ra->>'dhash'))::bit(64)) between 8 and 56 and bit_count(('x'||(rb->>'dhash'))::bit(64)) between 8 and 56 then
   distance=bit_count(('x'||(ra->>'dhash'))::bit(64) # ('x'||(rb->>'dhash'))::bit(64));
   if distance<=visual_limit then signals=array_append(signals,'visually_similar');end if;
  end if;
 end if;
 if cardinality(signals)=0 then return null;end if;
 if kind is null then
  if 'Sample ID'=any(matches) then
   if differences && array['Development Code','Color','Color Code','Lot Number','Batch Number'] then kind='conflicting_identity';rank=90;
   else kind='possible_same_sample';rank=85;end if;
  elsif 'Development Code'=any(matches) then
   if differences && array['Sample ID','Color','Color Code','Lot Number','Batch Number','Finishing Process'] then kind='possible_variant';rank=75;
   else kind='same_development';rank=60;end if;
  elsif 'identical_text'=any(signals) then kind='same_label_text';rank=70;
  elsif technical>=3 then kind='similar_specification';rank=40;
  else kind='similar_photo';rank=20;end if;
 end if;
 return jsonb_build_object('category',kind,'rank',rank,'signals',signals,'matching_fields',matches,'different_fields',differences,'uncertain_fields',uncertain,'visual_distance',distance,'rule_version','2.0');
end $$;
revoke all on function public.digitization_duplicate_evidence(jsonb,jsonb,text,text,jsonb,jsonb,jsonb) from public,anon,authenticated;
grant execute on function public.digitization_duplicate_evidence(jsonb,jsonb,text,text,jsonb,jsonb,jsonb) to service_role;

create function public.digitization_duplicate_candidates(p_id uuid,p_limit integer default 30) returns jsonb
language plpgsql stable security definer set search_path=public,pg_temp as $$
declare j digitization_jobs; output jsonb; cfg jsonb;
begin
 select * into j from digitization_jobs where id=p_id;
 if not found or auth.uid() is null or not digitization_can(j.batch_id,'read') then raise insufficient_privilege;end if;
 select config->'duplicates' into cfg from digitization_settings where id;
 select coalesce(jsonb_agg(to_jsonb(c)),'[]') into output from (
  select q.id,q.filename,q.batch_id,q.revision,q.status,e.evidence,
   (select ev.detail from digitization_events ev where ev.job_id=j.id and ev.action='duplicate_review' and ev.detail->>'target_id'=q.id::text
    and (ev.detail->>'source_revision')::int=j.revision and (ev.detail->>'target_revision')::int=q.revision order by ev.id desc limit 1) as decision
  from digitization_jobs q join digitization_batches b on b.id=q.batch_id
  cross join lateral (select digitization_duplicate_evidence(j.fields,q.fields,j.sha256,q.sha256,j.result,q.result,cfg) evidence) e
  where q.id<>j.id and q.result is not null and q.status in ('Needs Review','Validated','Duplicate')
   and b.division=(select division from digitization_batches where id=j.batch_id) and digitization_can(q.batch_id,'read') and e.evidence is not null
  order by (e.evidence->>'rank')::int desc,q.id limit greatest(1,least(coalesce(p_limit,30),100))
 ) c;
 return output;
end $$;
revoke all on function public.digitization_duplicate_candidates(uuid,integer) from public,anon;
grant execute on function public.digitization_duplicate_candidates(uuid,integer) to authenticated;

create function public.digitization_duplicate_decide(p_id uuid,p_revision integer,p_target uuid,p_target_revision integer,p_decision text,p_note text) returns void
language plpgsql security definer set search_path=public,pg_temp as $$
declare j digitization_jobs; q digitization_jobs; evidence jsonb; cfg jsonb;
begin
 if p_id=p_target then raise exception 'Cannot compare a record to itself';end if;
 -- Consistent pair lock order prevents reciprocal reviews from deadlocking.
 perform id from digitization_jobs where id in (p_id,p_target) order by id for update;
 select * into j from digitization_jobs where id=p_id;select * into q from digitization_jobs where id=p_target;
 if j.id is null or q.id is null or auth.uid() is null or not digitization_can(j.batch_id,'read') or not digitization_can(j.batch_id,'write') or not digitization_can(q.batch_id,'read')
 or (select division from digitization_batches where id=j.batch_id)<>(select division from digitization_batches where id=q.batch_id) then raise insufficient_privilege;end if;
 if j.revision is distinct from p_revision or q.revision is distinct from p_target_revision then raise exception 'Record changed. Refresh before deciding.';end if;
 if j.status not in ('Needs Review','Validated','Duplicate') or q.status not in ('Needs Review','Validated','Duplicate') then raise exception 'Review unavailable';end if;
 if p_decision not in ('same_photo','same_sample','variant','distinct','pending') or p_decision is null or length(trim(coalesce(p_note,'')))=0 or length(p_note)>4000 then raise exception 'Decision and review note required';end if;
 select config->'duplicates' into cfg from digitization_settings where id;
 evidence=digitization_duplicate_evidence(j.fields,q.fields,j.sha256,q.sha256,j.result,q.result,cfg);
 if evidence is null then raise exception 'No matching evidence; refresh candidates';end if;
 update digitization_jobs set status=case when p_decision in ('same_photo','same_sample') then 'Duplicate' else 'Needs Review' end,
 duplicate_of=case when p_decision in ('same_photo','same_sample') then q.id else null end,
 validated_at=null,validated_by=null,revision=revision+1 where id=j.id;
 insert into digitization_events(job_id,actor,action,detail) values(j.id,auth.uid(),'duplicate_review',jsonb_build_object('target_id',q.id,'decision',p_decision,'note',p_note,'evidence',evidence,'source_revision',j.revision+1,'target_revision',q.revision,'previous_status',j.status,'previous_duplicate_of',j.duplicate_of));
end $$;
revoke all on function public.digitization_duplicate_decide(uuid,integer,uuid,integer,text,text) from public,anon;
grant execute on function public.digitization_duplicate_decide(uuid,integer,uuid,integer,text,text) to authenticated;

-- All OCR results require review; live comparisons use current corrected fields.
create or replace function public.digitization_finish(p_id uuid,p_lease uuid,p_result jsonb,p_error text default null) returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
declare j digitization_jobs; dupe uuid; candidates jsonb; begin
 select * into j from digitization_jobs where id=p_id and lease=p_lease and status='Processing' and lease_until>now() for update;
 if not found then return false; end if;
 candidates='[]'::jsonb; dupe=null;
 if p_result is not null then p_result=jsonb_set(p_result,'{duplicate_candidates}',candidates); end if;
 update digitization_jobs set status=case when p_error is not null then 'Failed' else 'Needs Review' end,
 result=p_result,fields=coalesce(p_result->'fields','{}'),warnings=coalesce(p_result->'warnings','[]'),error=left(p_error,2000),duplicate_of=dupe,
 processed_path=case when p_result is not null then j.batch_id::text||'/'||j.id::text||'/processed-'||p_lease::text||'.jpg' end,
 processed_at=now(),lease=null,lease_until=null,revision=revision+1 where id=p_id;
 insert into digitization_events(job_id,action,detail) values(p_id,'processed',jsonb_build_object('attempt',j.attempts,'error',left(p_error,2000),'lease',p_lease)); return true;
end $$;

commit;
