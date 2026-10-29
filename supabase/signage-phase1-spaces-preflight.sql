-- READ ONLY. Run against the explicitly selected SIERRA Index project before update64.sql.
-- Expected pilot target: vhyddogeemohtqijohry. This script does not prove backup availability.

select current_database() as database_name, current_setting('server_version') as server_version, now() as checked_at;

select version, applied_at
from public.index_security_migrations
where version between 59 and 64
order by version;

select n.nspname as schema_name, c.relname, c.relkind, c.relrowsecurity
from pg_class c
join pg_namespace n on n.oid=c.relnamespace
where n.nspname='public'
  and c.relname in ('signage_spaces','signage_devices','signage_sites','signage_audit')
order by c.relname;

select conname, conrelid::regclass as relation, pg_get_constraintdef(oid) as definition
from pg_constraint
where conname in ('signage_devices_space_fk','signage_spaces_pkey','signage_spaces_site_id_name_key')
order by conname;

select p.proname, pg_get_function_identity_arguments(p.oid) as arguments,
       p.prosecdef as security_definer, p.proconfig
from pg_proc p
join pg_namespace n on n.oid=p.pronamespace
where n.nspname='public'
  and p.proname in ('signage_space_save','signage_device_update','signage_workspace_snapshot')
order by p.proname;

select count(*) as active_devices
from public.signage_devices
where state='active';

select column_name, data_type, is_nullable
from information_schema.columns
where table_schema='public' and table_name='signage_devices' and column_name='space_id';

select grantee, table_name, privilege_type
from information_schema.role_table_grants
where table_schema='public' and table_name='signage_spaces'
order by grantee, privilege_type;

select schemaname, tablename, policyname, roles, cmd, qual, with_check
from pg_policies
where schemaname='public' and tablename='signage_spaces'
order by policyname;
