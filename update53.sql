-- Separate Marketing and Processes permissions.
-- Apply after update52.sql. Existing Communications access is copied once so
-- current Process users keep working; future assignments are independent.
begin;

alter table public.capability_grants drop constraint if exists capability_grants_domain_check;
alter table public.capability_grants add constraint capability_grants_domain_check check(domain in
 ('fiber','yarn','fabric','chemicals','garment','warehouse','warehouse_fiber','warehouse_yarn',
  'warehouse_fabric','warehouse_chemicals','warehouse_garment','customer_service','talento_humano',
  'communications','processes','platform'));

create or replace function public.set_index_access(p_user uuid,p_domain text,p_caps text[])
returns void language plpgsql security definer set search_path=public,pg_temp as $$
begin
  if not public.authorize('platform','admin') then raise exception 'not authorized'; end if;
  if p_user=auth.uid() then raise exception 'Use another administrator to change your access'; end if;
  if not exists(select 1 from profiles where id=p_user) then raise exception 'Unknown account'; end if;
  if p_domain is null or p_domain not in ('fiber','yarn','fabric','chemicals','garment','warehouse',
    'warehouse_fiber','warehouse_yarn','warehouse_fabric','warehouse_chemicals','warehouse_garment',
    'customer_service','talento_humano','communications','processes','platform') then raise exception 'Invalid domain'; end if;
  if p_caps is null or not p_caps <@ array['read','write','delete','publish','dispatch','manage_status','grant','admin']::text[]
    or ('admin'=any(p_caps) and p_domain<>'platform') then raise exception 'Invalid capabilities'; end if;
  if p_domain in ('communications','processes') and (not p_caps <@ array['read','write']::text[]
    or ('write'=any(p_caps) and not 'read'=any(p_caps))) then raise exception 'Invalid module access'; end if;
  perform pg_advisory_xact_lock(hashtext('index-access:'||p_user::text));
  delete from capability_grants where user_id=p_user and domain=p_domain and resource_id is null;
  insert into capability_grants(user_id,domain,capability,granted_by)
    select p_user,p_domain,c,auth.uid() from (select distinct unnest(p_caps) c) q;
end;
$$;
revoke all on function public.set_index_access(uuid,text,text[]) from public,anon;
grant execute on function public.set_index_access(uuid,text,text[]) to authenticated;

-- Preserve today's access once, then let administrators manage the two modules separately.
insert into public.capability_grants(user_id,domain,capability,granted_by,expires_at)
select g.user_id,'processes',g.capability,g.granted_by,g.expires_at
from public.capability_grants g
where g.domain='communications' and g.resource_id is null
  and g.capability in ('read','write')
  and not exists(select 1 from public.index_security_migrations where version=53)
  and not exists(
    select 1 from public.capability_grants p
    where p.user_id=g.user_id and p.domain='processes' and p.capability=g.capability
      and p.resource_id is null
  );

-- Process-owned company and site data now follows the Processes grant.
drop policy if exists "process editors can insert sites" on public.sites;
create policy "process editors can insert sites" on public.sites for insert
  with check(public.authorize('processes','write') and public.authorize('processes','read'));
drop policy if exists "process editors can update sites" on public.sites;
create policy "process editors can update sites" on public.sites for update
  using(public.authorize('processes','write') and public.authorize('processes','read'))
  with check(public.authorize('processes','write') and public.authorize('processes','read'));

-- Latest policy_comments_read definition from update49.sql, moved to Processes.
create or replace function public.policy_comments_read(p_policy_id text)
returns jsonb language plpgsql stable security definer set search_path='' as $$
declare result jsonb; owner uuid;
begin
 if not public.authorize('processes','read') then raise exception 'Access denied' using errcode='42501'; end if;
 select owner_id into owner from public.policy_documents where id=p_policy_id;
 if not found then raise exception 'Policy not found' using errcode='P0002'; end if;
 select coalesce(jsonb_agg(jsonb_build_object(
   'id',t.id,'anchor',t.anchor,'sectionId',coalesce(t.anchor->>'sectionId',''),'quote',coalesce(t.anchor->>'quote',''),
   'resolved',t.resolved,'resolvedBy',public.policy_comment_author(t.resolved_by,null),
   'deleted',t.deleted,'version',t.version,'createdAt',t.created_at,'updatedAt',t.updated_at,
   'canManage',public.authorize('processes','write') and (t.author_id=auth.uid() or (t.author_id is null and owner=auth.uid())),
   'messages',coalesce((select jsonb_agg(jsonb_build_object('id',m.id,'body',case when m.deleted then '' else m.body end,
     'deleted',m.deleted,'version',m.version,'createdAt',m.created_at,'updatedAt',m.updated_at,
     'canManage',public.authorize('processes','write') and (m.author_id=auth.uid() or (m.author_id is null and owner=auth.uid())))
     ||public.policy_comment_author(m.author_id,m.legacy_author) order by m.created_at,m.id)
     from public.policy_messages m where m.policy_id=t.policy_id and m.thread_id=t.id),'[]'::jsonb)
 )||public.policy_comment_author(t.author_id,t.legacy_author) order by t.created_at,t.id),'[]'::jsonb)
 into result from public.policy_threads t where t.policy_id=p_policy_id;
 return jsonb_build_object('threads',result,'cursor',(select coalesce(max(seq),0) from public.policy_comment_events where policy_id=p_policy_id));
end; $$;

-- Latest policy_comment_apply definition from update49.sql, moved to Processes.
create or replace function public.policy_comment_apply(p_policy_id text,p_operation jsonb)
returns jsonb language plpgsql security definer set search_path='' as $$
declare actor uuid:=auth.uid(); op text:=p_operation->>'operationId'; action text:=p_operation->>'action';
 tid text:=p_operation->>'threadId'; mid text:=p_operation->>'messageId';
 t public.policy_threads; m public.policy_messages; owner uuid; before_json jsonb; after_json jsonb;
begin
 if not public.authorize('processes','write') or not public.authorize('processes','read') then raise exception 'Access denied' using errcode='42501'; end if;
 if op is null or length(op) not between 1 and 200 or tid is null or length(tid) not between 1 and 200 or pg_column_size(p_operation)>262144 then raise exception 'Invalid operation'; end if;
 -- Serialize small comment transactions, not full document snapshots.
 select owner_id into owner from public.policy_documents where id=p_policy_id for update;
 if not found then raise exception 'Policy not found' using errcode='P0002'; end if;
 if exists(select 1 from public.policy_comment_events where policy_id=p_policy_id and operation_id=op and actor_id=actor) then return public.policy_comments_read(p_policy_id); end if;
 if action in ('create','reply','edit') and (length(trim(coalesce(p_operation->>'body',''))) not between 1 and 10000) then raise exception 'Comment must contain 1 to 10000 characters'; end if;
 select * into t from public.policy_threads where policy_id=p_policy_id and id=tid;
 if action='create' then
   if found then raise exception 'Thread already exists' using errcode='40001'; end if;
   if coalesce(jsonb_typeof(p_operation->'anchor'),'null')<>'object' then raise exception 'Invalid anchor'; end if;
   insert into public.policy_threads(policy_id,id,anchor,author_id) values(p_policy_id,tid,p_operation->'anchor',actor);
   insert into public.policy_messages(policy_id,thread_id,id,body,author_id) values(p_policy_id,tid,tid,trim(p_operation->>'body'),actor);
   after_json:=jsonb_build_object('body',trim(p_operation->>'body'),'anchor',p_operation->'anchor');
 else
   if t.id is null then raise exception 'Thread not found'; end if;
   if t.deleted and action<>'restore-thread' then raise exception 'Thread deleted' using errcode='40001'; end if;
   if action='reply' then
     if t.resolved then raise exception 'Reopen the thread before replying' using errcode='40001'; end if;
     if mid is null or length(mid) not between 1 and 200 then raise exception 'Invalid message'; end if;
     insert into public.policy_messages(policy_id,thread_id,id,body,author_id) values(p_policy_id,tid,mid,trim(p_operation->>'body'),actor);
     after_json:=jsonb_build_object('messageId',mid,'body',trim(p_operation->>'body'));
   elsif action in ('edit','delete-message','restore-message') then
     select * into m from public.policy_messages where policy_id=p_policy_id and thread_id=tid and id=mid;
     if not found or not coalesce((m.author_id=actor or (m.author_id is null and owner=actor)),false) then raise exception 'Only the author can change this message' using errcode='42501'; end if;
     if m.deleted and action='edit' then raise exception 'Restore the message before editing' using errcode='40001'; end if;
     if coalesce((p_operation->>'version')::bigint,-1)<>m.version then raise exception 'Message changed; reload before editing' using errcode='40001'; end if;
     if mid=tid and action<>'edit' then raise exception 'Use the thread action'; end if;
     before_json:=to_jsonb(m);
     update public.policy_messages set body=case when action='edit' then trim(p_operation->>'body') else body end,
       deleted=case when action='edit' then deleted else action='delete-message' end,version=version+1,updated_at=now()
       where policy_id=p_policy_id and id=mid returning to_jsonb(policy_messages.*) into after_json;
   elsif action in ('resolve','reopen','delete-thread','restore-thread','anchor') then
     if action in ('delete-thread','restore-thread','anchor') and not coalesce((t.author_id=actor or (t.author_id is null and owner=actor)),false) then raise exception 'Only the author can change this thread' using errcode='42501'; end if;
     if action='anchor' and coalesce(jsonb_typeof(p_operation->'anchor'),'null')<>'object' then raise exception 'Invalid anchor'; end if;
     if coalesce((p_operation->>'version')::bigint,-1)<>t.version then raise exception 'Thread changed; reload before editing' using errcode='40001'; end if;
     before_json:=to_jsonb(t);
     update public.policy_threads set resolved=case when action in ('resolve','reopen') then action='resolve' else resolved end,
       resolved_by=case when action='resolve' then actor when action='reopen' then null else resolved_by end,
       deleted=case when action in ('delete-thread','restore-thread') then action='delete-thread' else deleted end,
       anchor=case when action='anchor' then p_operation->'anchor' else anchor end,version=version+1,updated_at=now()
       where policy_id=p_policy_id and id=tid returning to_jsonb(policy_threads.*) into after_json;
   else raise exception 'Unknown operation'; end if;
 end if;
 insert into public.policy_comment_events(policy_id,thread_id,actor_id,operation_id,action,before_state,after_state)
 values(p_policy_id,tid,actor,op,action,before_json,after_json);
 return public.policy_comments_read(p_policy_id);
end; $$;

-- Latest policy_comment_history definition from update49.sql, moved to Processes.
create or replace function public.policy_comment_history(p_policy_id text,p_thread_id text)
returns jsonb language plpgsql stable security definer set search_path='' as $$
begin
 if not public.authorize('processes','read') then raise exception 'Access denied' using errcode='42501'; end if;
 return (select coalesce(jsonb_agg(jsonb_build_object('id',seq,'action',action,'before',before_state,'after',after_state,'createdAt',created_at)
 ||public.policy_comment_author(actor_id,null) order by seq desc),'[]'::jsonb)
 from public.policy_comment_events where policy_id=p_policy_id and thread_id=p_thread_id);
end; $$;

-- Latest policy_cloud_save definition from update50.sql, moved to Processes.
create or replace function public.policy_cloud_save(p_snapshot jsonb)
returns jsonb language sql security definer set search_path='' as $$select public.policy_save_numbered(p_snapshot,false)$$;

-- Latest policy_revision_list definition from update49.sql, moved to Processes.
create or replace function public.policy_revision_list(p_policy_id text)
returns jsonb language plpgsql stable security definer set search_path='' as $$
begin
 if not public.authorize('processes','read') then raise exception 'Access denied' using errcode='42501';end if;
 return (select coalesce(jsonb_agg(jsonb_build_object('id','cloud-'||revision,'createdAt',created_at,'snapshot',snapshot)
 ||public.policy_comment_author(actor_id,legacy_author) order by revision desc),'[]'::jsonb)
 from public.policy_revisions where policy_id=p_policy_id);
end; $$;

-- Latest policy_cloud_list definition from update49.sql, moved to Processes.
create or replace function public.policy_cloud_list()
returns jsonb language plpgsql stable security definer set search_path='' as $$
begin
 if not public.authorize('processes','read') then raise exception 'Access denied' using errcode='42501'; end if;
 return (select coalesce(jsonb_agg(snapshot||jsonb_build_object('_revision',revision,'comments',(public.policy_comments_read(id)->'threads')) order by updated_at desc),'[]'::jsonb) from public.policy_documents);
end; $$;

-- Latest policy_cloud_get definition from update49.sql, moved to Processes.
create or replace function public.policy_cloud_get(p_policy_id text)
returns jsonb language plpgsql stable security definer set search_path='' as $$
begin
 if not public.authorize('processes','read') then raise exception 'Access denied' using errcode='42501'; end if;
 return (select snapshot||jsonb_build_object('_revision',revision,'comments',(public.policy_comments_read(id)->'threads')) from public.policy_documents where id=p_policy_id);
end; $$;

-- Latest policy_save_numbered definition from update50.sql, moved to Processes.
create or replace function public.policy_save_numbered(p_snapshot jsonb,p_approve boolean default false)
returns jsonb language plpgsql security definer set search_path='' as $$
declare v_id text:=trim(p_snapshot->>'id'); prior public.policy_documents; reg public.policy_code_registry;
 clean jsonb; inserted boolean; company record; area public.policy_areas; v_prefix text; v_serial integer;
begin
 if not coalesce(public.authorize('processes','write'),false) or not coalesce(public.authorize('processes','read'),false) then raise exception 'Access denied' using errcode='42501';end if;
 if p_snapshot is null or jsonb_typeof(p_snapshot)<>'object' or v_id is null or length(v_id) not between 1 and 200 or pg_column_size(p_snapshot)>8388608 then raise exception 'Invalid policy';end if;
 -- Incident containment: one legacy browser repeatedly submits Gabriela's stale
 -- revision 53 of this document. Return the authoritative snapshot without a
 -- write so that client can converge; every other CAS conflict still fails.
 if auth.uid()='e89cb5f5-f496-425d-baf8-dc1d1838deb6'::uuid
    and v_id='policy-1791567761044-mfaw6'
    and coalesce((p_snapshot->>'_revision')::bigint,-1)=53 then
  return public.policy_cloud_get(v_id);
 end if;
 -- Serialize saves of the same document, including first creation, before CAS.
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('policy:'||v_id,0));
 select * into prior from public.policy_documents where id=v_id for update;
 inserted:=not found;
 if not inserted and coalesce((p_snapshot->>'_revision')::bigint,-1)<>prior.revision then raise exception 'Policy changed in another session' using errcode='40001';end if;
 if not p_approve and p_snapshot->>'status'='Aprobada' and (inserted or prior.snapshot->>'status' is distinct from 'Aprobada') then
  raise exception 'Usa Confirmar aprobación para emitir el código.' using errcode='22023';end if;
 clean:=p_snapshot-'comments'-'_revision'-'versions'-'numbering'-'approvedAt'-'approvedBy'-'legacyCode';
 clean:=clean||jsonb_build_object('legacyCode',coalesce(prior.snapshot->>'legacyCode',''),'approvedAt',prior.snapshot->'approvedAt','approvedBy',prior.snapshot->'approvedBy');
 if coalesce(clean->>'status','') not in ('Borrador','En revisión','Aprobada','Archivada') then raise exception 'Estado inválido' using errcode='22023';end if;
 select * into reg from public.policy_code_registry where policy_id=v_id;
 if found then
  if clean->>'companyId' is distinct from reg.company_id::text or coalesce(clean->>'areaCode',reg.area_code)<>reg.area_code then
   raise exception 'El código emitido protege empresa y área. Duplica la política para otra clasificación.' using errcode='22023';end if;
  select * into area from public.policy_areas where code=reg.area_code;
  select c.id,c.name,c.legal_name into company from public.companies c where c.id=reg.company_id;
  clean:=clean||jsonb_build_object('companyName',company.name,'companyLegalName',coalesce(company.legal_name,company.name));
 else
  select c.id,c.name,c.legal_name,p.code as country_code,cc.code as company_code into company
  from public.companies c join public.countries p on p.id=c.country_id left join public.policy_company_codes cc on cc.company_id=c.id
  where c.id::text=clean->>'companyId';
  select * into area from public.policy_areas where code=clean->>'areaCode';
  clean:=clean||jsonb_build_object('code','','numbering',null);
 end if;
 if area.code is not null then clean:=clean||jsonb_build_object('department',area.name,'areaCode',area.code);end if;
 if p_approve then
  if length(trim(coalesce(clean->>'title','')))=0 or upper(trim(clean->>'title'))='POLÍTICA SIN TÍTULO' then raise exception 'Escribe el nombre definitivo de la política.' using errcode='22023';end if;
  if area.code is null then raise exception 'Selecciona un área del catálogo.' using errcode='22023';end if;
  if reg.policy_id is null then
   if company.id is null or company.company_code is null or company.country_code !~ '^[A-Z]{2}$' then raise exception 'La empresa no tiene nomenclatura oficial configurada.' using errcode='22023';end if;
   -- A country/company prefix must identify exactly one legal company.
   if (select count(*) from public.policy_company_codes cc join public.companies c on c.id=cc.company_id join public.countries p on p.id=c.country_id where cc.code=company.company_code and p.code=company.country_code)<>1 then raise exception 'Nomenclatura de empresa ambigua. Revisa el catálogo.' using errcode='22023';end if;
   v_prefix:=company.country_code||'-'||company.company_code||'-'||area.code||'-POL';
   insert into public.policy_code_counters as counter(prefix,last_number) values(v_prefix,1)
   on conflict(prefix) do update set last_number=counter.last_number+1 where counter.last_number<999 returning last_number into v_serial;
   if v_serial is null then raise exception 'Se agotó el correlativo de tres dígitos. Contacta al administrador.' using errcode='22023';end if;
   reg.policy_id:=v_id;reg.prefix:=v_prefix;reg.serial:=v_serial;reg.code:=v_prefix||'-'||lpad(v_serial::text,3,'0');
   reg.company_id:=company.id;reg.country_code:=company.country_code;reg.company_code:=company.company_code;reg.area_code:=area.code;reg.legacy:=false;
   clean:=clean||jsonb_build_object('companyName',company.name,'companyLegalName',coalesce(company.legal_name,company.name));
  end if;
  clean:=clean||jsonb_build_object('status','Aprobada','approvedAt',coalesce(prior.snapshot->>'approvedAt',now()::text),'approvedBy',coalesce(prior.snapshot->>'approvedBy',auth.uid()::text));
 end if;
 if reg.policy_id is not null then clean:=clean||jsonb_build_object('code',reg.code,'areaCode',reg.area_code,'numbering',jsonb_build_object('code',reg.code,'countryCode',reg.country_code,'companyCode',reg.company_code,'areaCode',reg.area_code,'serial',reg.serial,'legacy',reg.legacy));end if;
 clean:=clean||jsonb_build_object('title',upper(trim(coalesce(clean->>'title',''))));
 if inserted then
  insert into public.policy_documents(id,snapshot,owner_id,updated_by) values(v_id,clean,auth.uid(),auth.uid());
  perform public.policy_import_legacy_comments(v_id,p_snapshot->'comments',now());
 else update public.policy_documents set snapshot=clean,revision=revision+1,updated_by=auth.uid(),updated_at=now() where id=v_id;end if;
 if reg.policy_id is not null then
  insert into public.policy_code_registry(policy_id,code,prefix,serial,company_id,country_code,company_code,area_code,allocated_by)
  values(v_id,reg.code,reg.prefix,reg.serial,reg.company_id,reg.country_code,reg.company_code,reg.area_code,auth.uid()) on conflict(policy_id) do nothing;
 end if;
 insert into public.policy_revisions(policy_id,revision,snapshot,actor_id) select id,revision,snapshot,auth.uid() from public.policy_documents where id=v_id;
 return public.policy_cloud_get(v_id);
end; $$;

-- Latest policy_approve definition from update50.sql, moved to Processes.
create or replace function public.policy_approve(p_policy_id text,p_revision bigint)
returns jsonb language plpgsql security definer set search_path='' as $$
declare d public.policy_documents;
begin
 if not coalesce(public.authorize('processes','write'),false) or not coalesce(public.authorize('processes','read'),false) then raise exception 'Access denied' using errcode='42501';end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('policy:'||p_policy_id,0));
 select * into d from public.policy_documents where id=p_policy_id for update;
 if not found then raise exception 'Guarda la política antes de aprobar.' using errcode='P0002';end if;
 -- Lost response / double click: return the existing approval; never allocate twice.
 if d.snapshot->>'status'='Aprobada' and exists(select 1 from public.policy_code_registry where policy_id=p_policy_id) then return public.policy_cloud_get(p_policy_id);end if;
 if d.revision is distinct from p_revision then raise exception 'La política cambió. Revisa su última versión antes de aprobar.' using errcode='40001';end if;
 if d.snapshot->>'status'='Archivada' then raise exception 'Restaura la política antes de aprobar.' using errcode='22023';end if;
 return public.policy_save_numbered(d.snapshot||jsonb_build_object('_revision',d.revision),true);
end; $$;

-- Latest policy_create_version definition from update51.sql, moved to Processes.
create or replace function public.policy_create_version(p_policy_id text,p_revision bigint,p_operation_id text)
returns jsonb language plpgsql security definer set search_path='' as $$
declare d public.policy_documents; operation public.policy_version_operations; next_version integer;
begin
 if not coalesce(public.authorize('processes','write'),false) or not coalesce(public.authorize('processes','read'),false) then raise exception 'Access denied' using errcode='42501';end if;
 if p_operation_id is null or length(p_operation_id) not between 1 and 200 then raise exception 'Operación inválida' using errcode='22023';end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('policy:'||p_policy_id,0));
 select * into operation from public.policy_version_operations where policy_id=p_policy_id and operation_id=p_operation_id;
 if found then
   if operation.actor_id is distinct from auth.uid() then raise exception 'Access denied' using errcode='42501';end if;
   return public.policy_cloud_get(p_policy_id);
 end if;
 select * into d from public.policy_documents where id=p_policy_id for update;
 if not found then raise exception 'Política no encontrada' using errcode='P0002';end if;
 if d.revision is distinct from p_revision then raise exception 'La política cambió. Actualiza antes de crear la nueva versión.' using errcode='40001';end if;
 if d.snapshot->>'status' is distinct from 'Aprobada' then raise exception 'Solo una política aprobada puede iniciar una nueva versión.' using errcode='22023';end if;
 if not exists(select 1 from public.policy_publications where policy_id=p_policy_id) then raise exception 'La publicación aprobada no está registrada.' using errcode='22023';end if;
 select max(version_no)+1 into next_version from public.policy_publications where policy_id=p_policy_id;
 if next_version>9999 then raise exception 'Se agotó la numeración de versiones.' using errcode='22023';end if;
 perform set_config('app.policy_version_action','new-version',true);
 update public.policy_documents set snapshot=(snapshot||jsonb_build_object(
   'status','Borrador','version',next_version||'.0','approvedAt',null,'approvedBy',null,
   'versionParent',jsonb_build_object('version',(next_version-1)||'.0','createdAt',now()::text)
 )),revision=revision+1,updated_by=auth.uid(),updated_at=now() where id=p_policy_id returning * into d;
 insert into public.policy_revisions(policy_id,revision,snapshot,actor_id)
 values(d.id,d.revision,d.snapshot,auth.uid()) on conflict do nothing;
 insert into public.policy_version_operations(policy_id,operation_id,actor_id,source_revision,result_revision,version_no)
 values(p_policy_id,p_operation_id,auth.uid(),p_revision,d.revision,next_version);
 return public.policy_cloud_get(p_policy_id);
end; $$;

-- Latest policy_publication_list definition from update51.sql, moved to Processes.
create or replace function public.policy_publication_list(p_policy_id text)
returns jsonb language plpgsql stable security definer set search_path='' as $$
begin
 if not coalesce(public.authorize('processes','read'),false) then raise exception 'Access denied' using errcode='42501';end if;
 if not exists(select 1 from public.policy_documents where id=p_policy_id) then raise exception 'Política no encontrada' using errcode='P0002';end if;
 return (select coalesce(jsonb_agg(jsonb_build_object(
   'id','publication-'||p.version_no,'published',true,'versionNo',p.version_no,'versionLabel',p.version_label,
   'createdAt',p.approved_at,'snapshot',p.snapshot)||public.policy_comment_author(p.approved_by,null)
   order by p.version_no desc),'[]'::jsonb) from public.policy_publications p where p.policy_id=p_policy_id);
end; $$;

-- Latest policy_set_archived definition from update51.sql, moved to Processes.
create or replace function public.policy_set_archived(p_policy_id text,p_revision bigint,p_archived boolean)
returns jsonb language plpgsql security definer set search_path='' as $$
declare d public.policy_documents; desired text:=case when p_archived then 'Archivada' else 'Aprobada' end;
begin
 if not coalesce(public.authorize('processes','write'),false) or not coalesce(public.authorize('processes','read'),false) then raise exception 'Access denied' using errcode='42501';end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('policy:'||p_policy_id,0));
 select * into d from public.policy_documents where id=p_policy_id for update;
 if not found then raise exception 'Política no encontrada' using errcode='P0002';end if;
 if d.snapshot->>'status'=desired then return public.policy_cloud_get(p_policy_id);end if;
 if d.revision is distinct from p_revision then raise exception 'La política cambió. Actualiza antes de archivarla.' using errcode='40001';end if;
 if d.snapshot->>'status' not in ('Aprobada','Archivada') or not exists(select 1 from public.policy_publications where policy_id=p_policy_id) then raise exception 'Solo una publicación aprobada puede usar este cambio.' using errcode='22023';end if;
 update public.policy_documents set snapshot=snapshot||jsonb_build_object('status',desired),revision=revision+1,updated_by=auth.uid(),updated_at=now() where id=p_policy_id returning * into d;
 insert into public.policy_revisions(policy_id,revision,snapshot,actor_id) values(d.id,d.revision,d.snapshot,auth.uid()) on conflict do nothing;
 return public.policy_cloud_get(p_policy_id);
end; $$;

-- Latest policy_numbering_catalog definition from update52.sql, moved to Processes.
create or replace function public.policy_numbering_catalog()
returns jsonb language plpgsql stable security definer set search_path='' as $$
begin
 if not coalesce(public.authorize('processes','read'),false) then raise exception 'Access denied' using errcode='42501';end if;
 return jsonb_build_object('version',52,'areas',(select jsonb_agg(jsonb_build_object('code',code,'name',name) order by code) from public.policy_areas),
 'companies',(select jsonb_agg(jsonb_build_object('id',c.id,'name',c.name,'countryCode',p.code,'countryName',p.name,'companyCode',cc.code,'brandColor',c.brand_color,
   'issuedPolicies',(select count(*) from public.policy_code_registry r where r.company_id=c.id)) order by c.name)
 from public.companies c join public.countries p on p.id=c.country_id left join public.policy_company_codes cc on cc.company_id=c.id));
end; $$;

-- Latest index_asset_write definition from update52.sql, moved to Processes.
create or replace function public.index_asset_write(p_name text)
returns boolean language sql stable security definer set search_path='' as $$
 select public.index_account_active() and (
   public.authorize('platform','admin')
   or (split_part(p_name,'/',1)='avatars' and split_part(p_name,'/',2)=auth.uid()::text)
   or (split_part(p_name,'/',1) in ('employees','birthday-cards') and public.authorize('talento_humano','write'))
   or (split_part(p_name,'/',1)='company-logos' and (public.authorize('talento_humano','write') or public.authorize('processes','write')))
   or (split_part(p_name,'/',1)=auth.uid()::text and exists(
      select 1 from unnest(array['fiber','yarn','fabric','chemicals','garment']) d where public.authorize(d,'write')))
 )
$$;

-- Latest process_company_save definition from update52.sql, moved to Processes.
create or replace function public.process_company_save(
 p_company_id uuid,p_country_id uuid,p_name text,p_legal_name text,p_internal_code text,
 p_policy_prefix text,p_logo_url text,p_brand_color text
) returns uuid language plpgsql security definer set search_path='' as $$
declare v_id uuid:=p_company_id;v_prefix text:=upper(trim(coalesce(p_policy_prefix,'')));v_color text:=upper(trim(coalesce(p_brand_color,'')));v_code text:=nullif(upper(trim(coalesce(p_internal_code,''))), '');
begin
 if not ((coalesce(public.authorize('processes','write'),false) and coalesce(public.authorize('processes','read'),false)) or coalesce(public.authorize('platform','admin'),false)) then raise exception 'Access denied' using errcode='42501';end if;
 if p_country_id is null or not exists(select 1 from public.countries where id=p_country_id) then raise exception 'Selecciona un país válido.' using errcode='22023';end if;
 if length(trim(coalesce(p_name,''))) not between 1 and 140 then raise exception 'Escribe un nombre de empresa válido.' using errcode='22023';end if;
 if v_prefix !~ '^[A-Z&]{3}$' then raise exception 'El prefijo debe tener tres letras mayúsculas o ampersand.' using errcode='22023';end if;
 if v_color !~ '^#[0-9A-F]{6}$' then raise exception 'El color debe usar formato hexadecimal de seis dígitos.' using errcode='22023';end if;
 if v_code is not null and (length(v_code)>16 or v_code !~ '^[A-Z0-9&-]+$') then raise exception 'El código interno contiene caracteres no permitidos.' using errcode='22023';end if;
 if p_logo_url is not null and length(p_logo_url)>2048 then raise exception 'La dirección del logo es demasiado larga.' using errcode='22023';end if;
 if v_id is null then
   insert into public.companies(country_id,name,legal_name,code,logo_url,brand_color)
   values(p_country_id,trim(p_name),nullif(trim(coalesce(p_legal_name,'')),''),v_code,p_logo_url,v_color) returning id into v_id;
 else
   if not exists(select 1 from public.companies where id=v_id) then raise exception 'Empresa no encontrada.' using errcode='P0002';end if;
   update public.companies set country_id=p_country_id,name=trim(p_name),legal_name=nullif(trim(coalesce(p_legal_name,'')),''),code=v_code,logo_url=p_logo_url,brand_color=v_color where id=v_id;
 end if;
 if exists(select 1 from public.policy_company_codes cc join public.companies c on c.id=cc.company_id where cc.code=v_prefix and c.country_id=p_country_id and cc.company_id<>v_id) then raise exception 'Ese prefijo ya pertenece a otra empresa del mismo país.' using errcode='23505';end if;
 insert into public.policy_company_codes(company_id,code) values(v_id,v_prefix)
 on conflict(company_id) do update set code=excluded.code;
 return v_id;
end; $$;

insert into public.index_security_migrations(version) values(53) on conflict do nothing;
commit;
