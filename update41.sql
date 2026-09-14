-- Private collaborative communications. No changes to existing public media.
begin;

create table if not exists public.communication_documents (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id),
  title text not null check (length(title) between 1 and 500),
  kind text not null check (kind in ('memo','circular','aviso','convocatoria')),
  source_id text not null check (length(source_id) between 1 and 200),
  snapshot bytea not null check (octet_length(snapshot) <= 16777216),
  snapshot_revision bigint not null default 0,
  revision bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(owner_id, source_id)
);
create table if not exists public.communication_members (
  document_id uuid not null references public.communication_documents(id) on delete cascade,
  user_id uuid not null references public.profiles(id),
  role text not null check (role in ('viewer','editor')),
  granted_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  primary key(document_id,user_id)
);
create table if not exists public.communication_updates (
  document_id uuid not null references public.communication_documents(id) on delete cascade,
  revision bigint not null,
  nonce uuid not null,
  actor_id uuid not null references public.profiles(id),
  payload bytea not null check (octet_length(payload) between 1 and 16777216),
  primary key(document_id,revision),
  unique(document_id,nonce)
);
create table if not exists public.communication_presence (
  document_id uuid not null references public.communication_documents(id) on delete cascade,
  user_id uuid not null references public.profiles(id),
  session_id uuid not null,
  awareness text not null check (length(awareness) <= 12000),
  seen_at timestamptz not null default now(),
  primary key(document_id,user_id,session_id)
);
create table if not exists public.communication_access_audit (
  id bigint generated always as identity primary key,
  document_id uuid not null references public.communication_documents(id) on delete cascade,
  actor_id uuid not null,
  user_id uuid not null,
  role text,
  created_at timestamptz not null default now()
);

-- RPC-only tables: authenticated users cannot bypass the functions with REST.
alter table public.communication_documents enable row level security;
alter table public.communication_members enable row level security;
alter table public.communication_updates enable row level security;
alter table public.communication_presence enable row level security;
alter table public.communication_access_audit enable row level security;
revoke all on public.communication_documents,public.communication_members,
  public.communication_updates,public.communication_presence,
  public.communication_access_audit from public,anon,authenticated;

create or replace function public.communication_role(p_id uuid)
returns text language sql stable security definer set search_path = '' as $$
  select case when d.owner_id=auth.uid() then 'owner' else m.role end
  from public.communication_documents d
  left join public.communication_members m on m.document_id=d.id and m.user_id=auth.uid()
  where d.id=p_id and public.index_account_active()
$$;

create or replace function public.communication_create(p_source text,p_title text,p_kind text,p_snapshot text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare v_id uuid;
begin
  if not public.index_account_active() then raise exception 'Access denied' using errcode='42501'; end if;
  insert into public.communication_documents(owner_id,source_id,title,kind,snapshot)
    values(auth.uid(),p_source,p_title,p_kind,decode(p_snapshot,'base64'))
    on conflict(owner_id,source_id) do nothing returning id into v_id;
  if v_id is null then
    select id into v_id from public.communication_documents where owner_id=auth.uid() and source_id=p_source;
  end if;
  return v_id;
end $$;

create or replace function public.communication_list()
returns jsonb language sql stable security definer set search_path = '' as $$
  select coalesce(jsonb_agg(jsonb_build_object('id',d.id,'title',d.title,'kind',d.kind,
    'role',case when d.owner_id=auth.uid() then 'owner' else m.role end,
    'updated_at',d.updated_at) order by d.updated_at desc),'[]'::jsonb)
  from public.communication_documents d left join public.communication_members m
    on m.document_id=d.id and m.user_id=auth.uid()
  where public.index_account_active() and (d.owner_id=auth.uid() or m.user_id is not null)
$$;

create or replace function public.communication_access(p_id uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_role text; v_result jsonb;
begin
  v_role:=public.communication_role(p_id);
  if v_role is null then raise exception 'Access denied' using errcode='42501'; end if;
  select jsonb_agg(jsonb_build_object('id',p.id,'name',p.full_name,'email',p.email,'role',a.role)) into v_result
  from (select owner_id as user_id,'owner'::text as role from public.communication_documents where id=p_id
    union all select user_id,role from public.communication_members where document_id=p_id) a
  join public.profiles p on p.id=a.user_id;
  return jsonb_build_object('role',v_role,'members',v_result);
end $$;

create or replace function public.communication_share(p_id uuid,p_email text,p_role text)
returns void language plpgsql security definer set search_path = '' as $$
declare v_target uuid; v_owner uuid;
begin
  -- Sharing and sync lock the same row: revocation takes effect before the next read/write.
  select owner_id into v_owner from public.communication_documents where id=p_id for update;
  if not public.index_account_active() or v_owner is distinct from auth.uid() then
    raise exception 'Access denied' using errcode='42501'; end if;
  if p_role is not null and p_role not in ('viewer','editor') then raise exception 'Invalid role'; end if;
  select id into v_target from public.profiles where lower(email)=lower(trim(p_email))
    and (p_role is null or account_status='active');
  if v_target is null then raise exception 'No active account with that email'; end if;
  if v_target=v_owner then raise exception 'Owner access cannot be changed'; end if;
  if p_role is null then
    delete from public.communication_members where document_id=p_id and user_id=v_target;
  else
    insert into public.communication_members(document_id,user_id,role,granted_by)
      values(p_id,v_target,p_role,auth.uid()) on conflict(document_id,user_id)
      do update set role=excluded.role,granted_by=excluded.granted_by;
  end if;
  delete from public.communication_presence where document_id=p_id and user_id=v_target;
  insert into public.communication_access_audit(document_id,actor_id,user_id,role)
    values(p_id,auth.uid(),v_target,p_role);
end $$;

create or replace function public.communication_sync(p_id uuid,p_after bigint default -1,
  p_nonce uuid default null,p_update text default null,p_session uuid default null,p_awareness text default null)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare d public.communication_documents; v_role text; v_updates jsonb; v_presence jsonb;
begin
  select * into d from public.communication_documents where id=p_id for update;
  v_role:=public.communication_role(p_id);
  if v_role is null then raise exception 'Access denied' using errcode='42501'; end if;
  if p_update is not null then
    if v_role not in ('owner','editor') then raise exception 'Read only' using errcode='42501'; end if;
    if p_nonce is null then raise exception 'Missing update id'; end if;
    if not exists(select 1 from public.communication_updates where document_id=p_id and nonce=p_nonce) then
      update public.communication_documents set revision=revision+1,updated_at=now() where id=p_id returning * into d;
      insert into public.communication_updates(document_id,revision,nonce,actor_id,payload)
        values(p_id,d.revision,p_nonce,auth.uid(),decode(p_update,'base64'));
    end if;
  end if;
  if p_session is not null and p_awareness is not null then
    insert into public.communication_presence(document_id,user_id,session_id,awareness)
      values(p_id,auth.uid(),p_session,p_awareness) on conflict(document_id,user_id,session_id)
      do update set awareness=excluded.awareness,seen_at=now();
  end if;
  delete from public.communication_presence where document_id=p_id and seen_at<now()-interval '20 seconds';
  select coalesce(jsonb_agg(jsonb_build_object('revision',u.revision,'payload',encode(u.payload,'base64')) order by u.revision),'[]')
    into v_updates from public.communication_updates u where u.document_id=p_id and u.revision>greatest(p_after,d.snapshot_revision);
  select coalesce(jsonb_agg(jsonb_build_object('user_id',p.user_id,'name',a.full_name,'session_id',p.session_id,'awareness',p.awareness)),'[]')
    into v_presence from public.communication_presence p join public.profiles a on a.id=p.user_id
    where p.document_id=p_id and a.account_status='active' and (p.user_id=d.owner_id or exists(
      select 1 from public.communication_members m where m.document_id=p_id and m.user_id=p.user_id));
  return jsonb_build_object('role',v_role,'revision',d.revision,'snapshot_revision',d.snapshot_revision,
    'snapshot',case when p_after<d.snapshot_revision or p_after<0 then encode(d.snapshot,'base64') end,
    'updates',v_updates,'presence',v_presence);
end $$;

create or replace function public.communication_checkpoint(p_id uuid,p_revision bigint,p_snapshot text,p_title text)
returns boolean language plpgsql security definer set search_path = '' as $$
declare d public.communication_documents;
begin
  select * into d from public.communication_documents where id=p_id for update;
  if coalesce(public.communication_role(p_id),'') not in ('owner','editor') then
    raise exception 'Access denied' using errcode='42501'; end if;
  if d.revision<>p_revision then return false; end if;
  update public.communication_documents set snapshot=decode(p_snapshot,'base64'),snapshot_revision=p_revision,
    title=p_title where id=p_id;
  delete from public.communication_updates where document_id=p_id and revision<=p_revision;
  return true;
end $$;

revoke all on function public.communication_role(uuid) from public,anon,authenticated;
revoke all on function public.communication_create(text,text,text,text),public.communication_list(),
 public.communication_access(uuid),public.communication_share(uuid,text,text),
 public.communication_sync(uuid,bigint,uuid,text,uuid,text),public.communication_checkpoint(uuid,bigint,text,text) from public,anon;
grant execute on function public.communication_create(text,text,text,text),public.communication_list(),
 public.communication_access(uuid),public.communication_share(uuid,text,text),
 public.communication_sync(uuid,bigint,uuid,text,uuid,text),public.communication_checkpoint(uuid,bigint,text,text) to authenticated;

insert into public.index_security_migrations(version) values(41) on conflict do nothing;
commit;
