-- Authenticated live presence for the Processes policy editor.
-- Presence is RPC-only so account names always come from server profiles and
-- anonymous/public Realtime channels never expose who is viewing a policy.
begin;

create table if not exists public.policy_presence (
  policy_id text not null references public.policy_documents(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  seen_at timestamptz not null default now(),
  primary key(policy_id,user_id)
);

alter table public.policy_presence enable row level security;
revoke all on public.policy_presence from public,anon,authenticated;

create or replace function public.policy_presence_touch(p_policy_id text)
returns jsonb language plpgsql security definer set search_path='' as $$
declare result jsonb;
begin
  if not public.authorize('communications','read') then
    raise exception 'Access denied' using errcode='42501';
  end if;
  if not exists(select 1 from public.policy_documents where id=p_policy_id) then
    raise exception 'Policy not found' using errcode='P0002';
  end if;

  insert into public.policy_presence(policy_id,user_id,seen_at)
  values(p_policy_id,auth.uid(),now())
  on conflict(policy_id,user_id) do update set seen_at=excluded.seen_at;

  delete from public.policy_presence
  where seen_at<now()-interval '20 seconds';

  select coalesce(jsonb_agg(jsonb_build_object(
    'userId',presence.user_id,
    'name',account.full_name,
    'email',account.email,
    'avatar',account.avatar_url,
    'seenAt',presence.seen_at
  ) order by presence.seen_at desc),'[]'::jsonb)
  into result
  from public.policy_presence presence
  join public.profiles account on account.id=presence.user_id
  where presence.policy_id=p_policy_id and account.account_status='active';

  return result;
end;
$$;

revoke all on function public.policy_presence_touch(text) from public,anon;
grant execute on function public.policy_presence_touch(text) to authenticated;

insert into public.index_security_migrations(version) values(48) on conflict do nothing;
notify pgrst,'reload schema';
commit;
