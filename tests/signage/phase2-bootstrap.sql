create schema if not exists auth;
do $$ begin
 create role anon nologin;
exception when duplicate_object then null; end $$;
do $$ begin
 create role authenticated nologin;
exception when duplicate_object then null; end $$;
do $$ begin
 create role service_role nologin bypassrls;
exception when duplicate_object then null; end $$;

create or replace function auth.uid() returns uuid language sql stable as $$
 select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid
$$;
create or replace function auth.role() returns text language sql stable as $$
 select nullif(current_setting('request.jwt.claim.role',true),'')
$$;

create table public.profiles(
 id uuid primary key,
 role text not null default 'user',
 account_status text not null default 'active'
);
create table public.capability_grants(
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references public.profiles(id),
 domain text not null constraint capability_grants_domain_check check(domain in ('platform','academy')),
 capability text not null constraint capability_grants_capability_check check(capability in ('read','write','grant','admin')),
 resource_id uuid,
 granted_by uuid references public.profiles(id),
 expires_at timestamptz,
 created_at timestamptz not null default now()
);
create unique index capability_grants_unique on public.capability_grants
 (user_id,domain,capability,coalesce(resource_id,'00000000-0000-0000-0000-000000000000'::uuid));
create table public.index_security_migrations(version integer primary key,applied_at timestamptz not null default now());

create or replace function public.index_account_active()
returns boolean language sql stable security definer set search_path=public,pg_temp as $$
 select exists(select 1 from public.profiles where id=auth.uid() and account_status='active')
$$;
create or replace function public.authorize(p_domain text,p_capability text,p_resource_id uuid default null)
returns boolean language sql stable security definer set search_path=public,pg_temp as $$
 select public.index_account_active() and exists(
  select 1 from public.capability_grants g where g.user_id=auth.uid()
   and (g.expires_at is null or g.expires_at>now())
   and ((g.domain='platform' and g.capability='admin' and g.resource_id is null)
    or (g.domain=p_domain and g.capability=p_capability
      and (g.resource_id is null or g.resource_id=p_resource_id))))
$$;

grant usage on schema public,auth to anon,authenticated,service_role;
grant execute on function auth.uid(),auth.role(),public.index_account_active(),public.authorize(text,text,uuid) to authenticated,service_role;
