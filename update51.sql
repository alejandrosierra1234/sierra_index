-- Immutable approved policies and atomic revision creation. Apply after update50.sql.
begin;
lock table public.policy_documents in share row exclusive mode;

create table if not exists public.policy_publications (
  policy_id text not null references public.policy_documents(id) on delete restrict,
  version_no integer not null check(version_no between 1 and 9999),
  version_label text not null check(version_label ~ '^[1-9][0-9]{0,3}\.0$'),
  snapshot jsonb not null check(jsonb_typeof(snapshot)='object' and pg_column_size(snapshot)<=8388608),
  approved_by uuid references public.profiles(id),
  approved_at timestamptz not null,
  created_at timestamptz not null default now(),
  primary key(policy_id,version_no),
  unique(policy_id,version_label)
);
create table if not exists public.policy_version_operations (
  policy_id text not null references public.policy_documents(id) on delete restrict,
  operation_id text not null check(length(operation_id) between 1 and 200),
  actor_id uuid not null references public.profiles(id),
  source_revision bigint not null,
  result_revision bigint not null,
  version_no integer not null,
  created_at timestamptz not null default now(),
  primary key(policy_id,operation_id)
);
alter table public.policy_publications enable row level security;
alter table public.policy_version_operations enable row level security;
revoke all on public.policy_publications,public.policy_version_operations from public,anon,authenticated;

-- Preserve every approval already in production before enforcing immutability.
insert into public.policy_publications(policy_id,version_no,version_label,snapshot,approved_by,approved_at,created_at)
select d.id,
  case when coalesce(d.snapshot->>'version','') ~ '^[1-9][0-9]{0,3}(\.0)?$'
    then split_part(d.snapshot->>'version','.',1)::integer else 1 end,
  case when coalesce(d.snapshot->>'version','') ~ '^[1-9][0-9]{0,3}(\.0)?$'
    then split_part(d.snapshot->>'version','.',1)||'.0' else '1.0' end,
  (d.snapshot-'comments'-'versions'-'_revision') || jsonb_build_object(
    'version',case when coalesce(d.snapshot->>'version','') ~ '^[1-9][0-9]{0,3}(\.0)?$'
      then split_part(d.snapshot->>'version','.',1)||'.0' else '1.0' end),
  case when coalesce(d.snapshot->>'approvedBy','') ~ '^[0-9a-fA-F-]{36}$' then (d.snapshot->>'approvedBy')::uuid else d.updated_by end,
  coalesce(case when coalesce(d.snapshot->>'approvedAt','')<>'' then (d.snapshot->>'approvedAt')::timestamptz end,d.updated_at),d.updated_at
from public.policy_documents d where d.snapshot->>'status'='Aprobada'
  or (d.snapshot->>'status'='Archivada' and exists(select 1 from public.policy_code_registry r where r.policy_id=d.id))
on conflict(policy_id,version_no) do nothing;

with canonical as (
 select d.id,p.version_label from public.policy_documents d join lateral (
  select version_label from public.policy_publications where policy_id=d.id order by version_no desc limit 1
 ) p on true where d.snapshot->>'version' is distinct from p.version_label
), updated as (
 update public.policy_documents d set snapshot=d.snapshot||jsonb_build_object('version',c.version_label),revision=d.revision+1,updated_at=now()
 from canonical c where d.id=c.id returning d.*
)
insert into public.policy_revisions(policy_id,revision,snapshot,actor_id)
select id,revision,snapshot,null from updated on conflict do nothing;

create or replace function public.policy_document_version_guard()
returns trigger language plpgsql set search_path='' as $$
declare old_status text:=coalesce(old.snapshot->>'status',''); new_status text:=coalesce(new.snapshot->>'status','');
 published boolean; next_version integer; action text:=coalesce(current_setting('app.policy_version_action',true),'');
begin
 select exists(select 1 from public.policy_publications p where p.policy_id=old.id) into published;
 if (old_status='Aprobada' or (old_status='Archivada' and published)) and action<>'new-version' then
   if new_status not in (old_status,case when old_status='Aprobada' then 'Archivada' else 'Aprobada' end)
      or (new.snapshot-'status'-'updatedAt') is distinct from (old.snapshot-'status'-'updatedAt') then
     raise exception 'La versión aprobada es inmutable. Usa Crear nueva versión para modificarla.' using errcode='22023';
   end if;
 end if;
 select coalesce(max(p.version_no),0)+1 into next_version from public.policy_publications p where p.policy_id=old.id;
 if new_status='Aprobada' and old_status not in ('Aprobada','Archivada') then
   new.snapshot:=new.snapshot||jsonb_build_object('version',next_version||'.0','approvedAt',now()::text,'approvedBy',auth.uid()::text);
 elsif new_status not in ('Aprobada','Archivada') then
   new.snapshot:=new.snapshot||jsonb_build_object('version',next_version||'.0','approvedAt',null,'approvedBy',null);
 end if;
 return new;
end; $$;
revoke all on function public.policy_document_version_guard() from public,anon,authenticated;

create or replace function public.policy_capture_publication()
returns trigger language plpgsql set search_path='' as $$
declare version_number integer;
begin
 if new.snapshot->>'status'='Aprobada' and (tg_op='INSERT' or old.snapshot->>'status' is distinct from 'Aprobada') then
   version_number:=split_part(new.snapshot->>'version','.',1)::integer;
   insert into public.policy_publications(policy_id,version_no,version_label,snapshot,approved_by,approved_at)
   values(new.id,version_number,version_number||'.0',new.snapshot-'comments'-'versions'-'_revision',
     case when coalesce(new.snapshot->>'approvedBy','') ~ '^[0-9a-fA-F-]{36}$' then (new.snapshot->>'approvedBy')::uuid else auth.uid() end,
     coalesce((new.snapshot->>'approvedAt')::timestamptz,now()))
   on conflict(policy_id,version_no) do nothing;
 end if;
 return new;
end; $$;
revoke all on function public.policy_capture_publication() from public,anon,authenticated;

drop trigger if exists policy_document_version_guard on public.policy_documents;
create trigger policy_document_version_guard before update on public.policy_documents
for each row execute function public.policy_document_version_guard();
drop trigger if exists policy_capture_publication on public.policy_documents;
create trigger policy_capture_publication after insert or update on public.policy_documents
for each row execute function public.policy_capture_publication();

create or replace function public.policy_create_version(p_policy_id text,p_revision bigint,p_operation_id text)
returns jsonb language plpgsql security definer set search_path='' as $$
declare d public.policy_documents; operation public.policy_version_operations; next_version integer;
begin
 if not coalesce(public.authorize('communications','write'),false) or not coalesce(public.authorize('communications','read'),false) then raise exception 'Access denied' using errcode='42501';end if;
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

create or replace function public.policy_publication_list(p_policy_id text)
returns jsonb language plpgsql stable security definer set search_path='' as $$
begin
 if not coalesce(public.authorize('communications','read'),false) then raise exception 'Access denied' using errcode='42501';end if;
 if not exists(select 1 from public.policy_documents where id=p_policy_id) then raise exception 'Política no encontrada' using errcode='P0002';end if;
 return (select coalesce(jsonb_agg(jsonb_build_object(
   'id','publication-'||p.version_no,'published',true,'versionNo',p.version_no,'versionLabel',p.version_label,
   'createdAt',p.approved_at,'snapshot',p.snapshot)||public.policy_comment_author(p.approved_by,null)
   order by p.version_no desc),'[]'::jsonb) from public.policy_publications p where p.policy_id=p_policy_id);
end; $$;

create or replace function public.policy_set_archived(p_policy_id text,p_revision bigint,p_archived boolean)
returns jsonb language plpgsql security definer set search_path='' as $$
declare d public.policy_documents; desired text:=case when p_archived then 'Archivada' else 'Aprobada' end;
begin
 if not coalesce(public.authorize('communications','write'),false) or not coalesce(public.authorize('communications','read'),false) then raise exception 'Access denied' using errcode='42501';end if;
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

create or replace function public.policy_numbering_catalog()
returns jsonb language plpgsql stable security definer set search_path='' as $$
begin
 if not coalesce(public.authorize('communications','read'),false) then raise exception 'Access denied' using errcode='42501';end if;
 return jsonb_build_object('version',51,'areas',(select jsonb_agg(jsonb_build_object('code',code,'name',name) order by code) from public.policy_areas),
 'companies',(select jsonb_agg(jsonb_build_object('id',c.id,'name',c.name,'countryCode',p.code,'countryName',p.name,'companyCode',cc.code) order by c.name)
 from public.companies c join public.countries p on p.id=c.country_id left join public.policy_company_codes cc on cc.company_id=c.id));
end; $$;

revoke all on function public.policy_create_version(text,bigint,text),public.policy_publication_list(text),public.policy_set_archived(text,bigint,boolean) from public,anon;
grant execute on function public.policy_create_version(text,bigint,text),public.policy_publication_list(text),public.policy_set_archived(text,bigint,boolean) to authenticated;
insert into public.index_security_migrations(version) values(51) on conflict do nothing;
notify pgrst,'reload schema';
commit;
