-- SIERRA Academia: shared editor access and authenticated live presence.
-- Apply after update60.sql.
-- Diploma list/save are module-wide in update58: every account with Academia
-- read/write access works on the same durable documents.
begin;

create table if not exists public.academy_presence (
  diploma_id text not null references public.academy_diplomas(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  session_id text not null check(length(session_id) between 8 and 100),
  seen_at timestamptz not null default now(),
  primary key(diploma_id,user_id,session_id)
);

alter table public.academy_presence enable row level security;
revoke all on public.academy_presence from public,anon,authenticated;

create or replace function public.academy_presence_sync(
  p_diploma_id text,
  p_session_id text,
  p_active boolean default true
)
returns jsonb language plpgsql security definer set search_path='' as $$
declare result jsonb;
begin
  if not coalesce(public.authorize('academy','read'),false)
     or not coalesce(public.authorize('academy','write'),false) then
    raise exception 'Access denied' using errcode='42501';
  end if;
  if p_session_id is null or length(trim(p_session_id)) not between 8 and 100 then
    raise exception 'Invalid presence session' using errcode='22023';
  end if;
  if not exists(select 1 from public.academy_diplomas where id=p_diploma_id) then
    raise exception 'Diploma not found' using errcode='P0002';
  end if;

  delete from public.academy_presence where seen_at<now()-interval '25 seconds';

  if coalesce(p_active,true) then
    insert into public.academy_presence(diploma_id,user_id,session_id,seen_at)
    values(p_diploma_id,auth.uid(),trim(p_session_id),now())
    on conflict(diploma_id,user_id,session_id) do update set seen_at=excluded.seen_at;
  else
    delete from public.academy_presence
    where diploma_id=p_diploma_id and user_id=auth.uid() and session_id=trim(p_session_id);
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'userId',active.user_id,'name',account.full_name,'email',account.email,
    'avatar',account.avatar_url,'seenAt',active.seen_at
  ) order by active.seen_at desc),'[]'::jsonb)
  into result
  from (
    select user_id,max(seen_at) seen_at from public.academy_presence
    where diploma_id=p_diploma_id group by user_id
  ) active
  join public.profiles account on account.id=active.user_id
  where account.account_status='active';

  return result;
end;
$$;

revoke all on function public.academy_presence_sync(text,text,boolean) from public,anon;
grant execute on function public.academy_presence_sync(text,text,boolean) to authenticated;

insert into public.index_security_migrations(version) values(61) on conflict do nothing;
notify pgrst,'reload schema';
commit;
