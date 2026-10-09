-- Cloud persistence for the Processes policy editor.
-- Policies remain available across browsers and are shared with the same
-- Communications audience used by the Processes module.
begin;

create table if not exists public.policy_documents (
  id text primary key check(length(id) between 1 and 200),
  snapshot jsonb not null check(jsonb_typeof(snapshot)='object' and pg_column_size(snapshot)<=8388608),
  owner_id uuid not null references public.profiles(id),
  updated_by uuid not null references public.profiles(id),
  revision bigint not null default 1 check(revision>0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.policy_documents enable row level security;
revoke all on public.policy_documents from public,anon,authenticated;

create or replace function public.policy_cloud_list()
returns jsonb language plpgsql stable security definer set search_path='' as $$
declare result jsonb;
begin
  if not public.authorize('communications','read') then raise exception 'Access denied' using errcode='42501'; end if;
  select coalesce(jsonb_agg(d.snapshot order by d.updated_at desc),'[]'::jsonb) into result
  from public.policy_documents d;
  return result;
end;
$$;

create or replace function public.policy_cloud_save(p_snapshot jsonb)
returns jsonb language plpgsql security definer set search_path='' as $$
declare v_id text; result jsonb;
begin
  if not public.authorize('communications','write') then raise exception 'Access denied' using errcode='42501'; end if;
  if p_snapshot is null or jsonb_typeof(p_snapshot)<>'object' then raise exception 'Invalid policy'; end if;
  v_id:=trim(p_snapshot->>'id');
  if v_id is null or length(v_id) not between 1 and 200 or pg_column_size(p_snapshot)>8388608 then
    raise exception 'Invalid policy';
  end if;
  insert into public.policy_documents as existing(id,snapshot,owner_id,updated_by)
  values(v_id,p_snapshot,auth.uid(),auth.uid())
  on conflict(id) do update set snapshot=excluded.snapshot,updated_by=auth.uid(),
    revision=existing.revision+1,updated_at=now()
  returning snapshot into result;
  return result;
end;
$$;

create or replace function public.policy_cloud_delete(p_id text)
returns void language plpgsql security definer set search_path='' as $$
begin
  if not public.authorize('communications','write') then raise exception 'Access denied' using errcode='42501'; end if;
  delete from public.policy_documents where id=p_id;
end;
$$;

revoke all on function public.policy_cloud_list(),public.policy_cloud_save(jsonb),public.policy_cloud_delete(text) from public,anon;
grant execute on function public.policy_cloud_list(),public.policy_cloud_save(jsonb),public.policy_cloud_delete(text) to authenticated;

insert into public.index_security_migrations(version) values(47) on conflict do nothing;
notify pgrst,'reload schema';
commit;
