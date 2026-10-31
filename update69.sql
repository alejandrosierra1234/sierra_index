-- SIERRA Times collaborative issues. Apply after update68.sql.
begin;

create table if not exists public.newsletter_issues(
  id uuid primary key,
  issue_month date not null,
  title text not null check(char_length(title) between 1 and 500),
  state text not null default 'working' check(state in ('working','final')),
  payload jsonb not null default '{}'::jsonb,
  owner_id uuid not null default auth.uid() references auth.users(id),
  updated_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  finalized_at timestamptz
);

create index if not exists newsletter_issues_month_idx on public.newsletter_issues(issue_month desc,updated_at desc);
alter table public.newsletter_issues enable row level security;
revoke all on public.newsletter_issues from public,anon;
grant select,insert,update on public.newsletter_issues to authenticated;

drop policy if exists newsletter_issues_read on public.newsletter_issues;
create policy newsletter_issues_read on public.newsletter_issues for select to authenticated
  using(public.authorize('communications','read'));
drop policy if exists newsletter_issues_create on public.newsletter_issues;
create policy newsletter_issues_create on public.newsletter_issues for insert to authenticated
  with check(public.authorize('communications','read') and public.authorize('communications','write')
    and owner_id=auth.uid() and updated_by=auth.uid());
drop policy if exists newsletter_issues_update on public.newsletter_issues;
create policy newsletter_issues_update on public.newsletter_issues for update to authenticated
  using(public.authorize('communications','read') and public.authorize('communications','write'))
  with check(public.authorize('communications','read') and public.authorize('communications','write') and updated_by=auth.uid());

create or replace function public.newsletter_issue_guard()
returns trigger language plpgsql security definer set search_path='' as $$
begin
  if old.state='final' then
    raise exception 'Finished newsletter issues are immutable. Create a correction copy.' using errcode='42501';
  end if;
  new.owner_id=old.owner_id;new.created_at=old.created_at;new.updated_at=now();
  if new.state='final' and old.state<>'final' then new.finalized_at=coalesce(new.finalized_at,now()); end if;
  return new;
end $$;

drop trigger if exists newsletter_issue_guard_trigger on public.newsletter_issues;
create trigger newsletter_issue_guard_trigger before update on public.newsletter_issues
for each row execute function public.newsletter_issue_guard();

do $$
begin
  if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime'
    and schemaname='public' and tablename='newsletter_issues')
  then alter publication supabase_realtime add table public.newsletter_issues; end if;
end $$;

insert into public.index_security_migrations(version) values(69) on conflict do nothing;
notify pgrst,'reload schema';
commit;
