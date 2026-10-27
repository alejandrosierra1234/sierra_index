-- SIERRA Academia: permission domain and durable two-sided diploma documents.
-- Apply after update57.sql.
begin;

alter table public.capability_grants drop constraint if exists capability_grants_domain_check;
alter table public.capability_grants add constraint capability_grants_domain_check check(domain in
 ('fiber','yarn','fabric','chemicals','garment','warehouse','warehouse_fiber','warehouse_yarn',
  'warehouse_fabric','warehouse_chemicals','warehouse_garment','customer_service','talento_humano',
  'communications','processes','academy','platform'));

create or replace function public.set_index_access(p_user uuid,p_domain text,p_caps text[])
returns void language plpgsql security definer set search_path=public,pg_temp as $$
begin
  if not public.authorize('platform','admin') then raise exception 'not authorized'; end if;
  if p_user=auth.uid() then raise exception 'Use another administrator to change your access'; end if;
  if not exists(select 1 from profiles where id=p_user) then raise exception 'Unknown account'; end if;
  if p_domain is null or p_domain not in ('fiber','yarn','fabric','chemicals','garment','warehouse',
    'warehouse_fiber','warehouse_yarn','warehouse_fabric','warehouse_chemicals','warehouse_garment',
    'customer_service','talento_humano','communications','processes','academy','platform') then raise exception 'Invalid domain'; end if;
  if p_caps is null or not p_caps <@ array['read','write','delete','publish','dispatch','manage_status','grant','admin']::text[]
    or ('admin'=any(p_caps) and p_domain<>'platform') then raise exception 'Invalid capabilities'; end if;
  if p_domain in ('communications','processes','academy') and (not p_caps <@ array['read','write']::text[]
    or ('write'=any(p_caps) and not 'read'=any(p_caps))) then raise exception 'Invalid module access'; end if;
  perform pg_advisory_xact_lock(hashtext('index-access:'||p_user::text));
  delete from capability_grants where user_id=p_user and domain=p_domain and resource_id is null;
  insert into capability_grants(user_id,domain,capability,granted_by)
    select p_user,p_domain,c,auth.uid() from (select distinct unnest(p_caps) c) q;
end;
$$;
revoke all on function public.set_index_access(uuid,text,text[]) from public,anon;
grant execute on function public.set_index_access(uuid,text,text[]) to authenticated;

create table if not exists public.academy_diplomas(
  id text primary key check(length(id) between 1 and 200),
  snapshot jsonb not null check(jsonb_typeof(snapshot)='object'),
  owner_id uuid not null references public.profiles(id),
  updated_by uuid not null references public.profiles(id),
  revision bigint not null default 0 check(revision>=0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.academy_diplomas enable row level security;
revoke all on table public.academy_diplomas from public,anon,authenticated;

create or replace function public.academy_diploma_list()
returns jsonb language plpgsql stable security definer set search_path='' as $$
begin
  if not coalesce(public.authorize('academy','read'),false) then
    raise exception 'Access denied' using errcode='42501';
  end if;
  return (select coalesce(jsonb_agg(snapshot||jsonb_build_object('_revision',revision)
    order by updated_at desc),'[]'::jsonb) from public.academy_diplomas);
end;
$$;

create or replace function public.academy_diploma_save(p_snapshot jsonb)
returns jsonb language plpgsql security definer set search_path='' as $$
declare
  v_id text:=trim(p_snapshot->>'id');
  clean jsonb;
  prior public.academy_diplomas;
begin
  if not coalesce(public.authorize('academy','write'),false)
     or not coalesce(public.authorize('academy','read'),false) then
    raise exception 'Access denied' using errcode='42501';
  end if;
  if p_snapshot is null or jsonb_typeof(p_snapshot)<>'object' or v_id is null
     or length(v_id) not between 1 and 200 or pg_column_size(p_snapshot)>8388608 then
    raise exception 'Invalid diploma' using errcode='22023';
  end if;
  if coalesce(p_snapshot->>'status','') not in ('Borrador','Archivado') then
    raise exception 'Invalid diploma status' using errcode='22023';
  end if;
  if jsonb_array_length(coalesce(p_snapshot->'signers','[]'::jsonb))>4
     or jsonb_array_length(coalesce(p_snapshot->'contents','[]'::jsonb))>14 then
    raise exception 'Diploma exceeds layout limits' using errcode='22023';
  end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('academy:'||v_id,0));
  select * into prior from public.academy_diplomas where id=v_id for update;
  clean:=p_snapshot-'_revision';
  if found then
    update public.academy_diplomas set snapshot=clean,updated_by=auth.uid(),revision=revision+1,updated_at=now()
      where id=v_id;
  else
    insert into public.academy_diplomas(id,snapshot,owner_id,updated_by)
      values(v_id,clean,auth.uid(),auth.uid());
  end if;
  return (select snapshot||jsonb_build_object('_revision',revision)
    from public.academy_diplomas where id=v_id);
end;
$$;

revoke all on function public.academy_diploma_list(),public.academy_diploma_save(jsonb) from public,anon;
grant execute on function public.academy_diploma_list(),public.academy_diploma_save(jsonb) to authenticated;

-- Talent users receive matching Academia access once; it remains independently manageable afterwards.
insert into public.capability_grants(user_id,domain,capability,granted_by,expires_at)
select g.user_id,'academy',g.capability,g.granted_by,g.expires_at
from public.capability_grants g
where g.domain='talento_humano' and g.resource_id is null
  and g.capability in ('read','write')
  and not exists(select 1 from public.index_security_migrations where version=58)
  and not exists(select 1 from public.capability_grants a where a.user_id=g.user_id
    and a.domain='academy' and a.capability=g.capability and a.resource_id is null);

insert into public.index_security_migrations(version) values(58) on conflict do nothing;
notify pgrst,'reload schema';
commit;
