-- Manual accounts. Independent of the optional collaboration migration 41.
begin;
-- Preserve retired relationships for administrative audit, not runtime access.
create table if not exists public.index_retired_account_links(
 profile_id uuid primary key,employee_id uuid,account_type text,retired_at timestamptz not null default now()
);
alter table public.index_retired_account_links enable row level security;
revoke all on public.index_retired_account_links from public,anon,authenticated;
insert into public.index_retired_account_links(profile_id,employee_id,account_type)
 select id,employee_id,account_type from public.profiles where employee_id is not null
 on conflict(profile_id) do nothing;

alter table public.profiles drop constraint if exists profiles_account_type_link_check;
alter table public.profiles drop constraint if exists profiles_account_type_check;
update public.profiles set employee_id=null,account_type='manual';
alter table public.profiles alter column account_type set default 'manual';
alter table public.profiles alter column account_type set not null;
alter table public.profiles add constraint profiles_account_type_check check(account_type='manual');
alter table public.profiles add constraint profiles_account_type_link_check check(employee_id is null);
comment on column public.profiles.employee_id is 'Retired. Must remain null; Index accounts are independent of HR records.';
comment on column public.profiles.account_type is 'Manual account. Authorization comes exclusively from explicit capability grants.';

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path='' as $$
begin
 insert into public.profiles(id,email,full_name,role,account_type,employee_id,account_status)
 values(new.id,new.email,coalesce(nullif(trim(new.raw_user_meta_data->>'full_name'),''),split_part(new.email,'@',1)),
 'user','manual',null,'active');
 return new;
end $$;
revoke all on function public.handle_new_user() from public,anon,authenticated;

-- The previous review queue is retained for history, with no app-facing linking workflow.
revoke all on public.account_migration_review from public,anon,authenticated;
insert into public.index_security_migrations(version) values(42) on conflict do nothing;
commit;
