-- READ ONLY: ejecutar manualmente antes de autorizar Pantallas en el proyecto activo.
-- No contiene DDL ni mutaciones.
select version,applied_at from public.index_security_migrations where version in (58,59,60,61,62) order by version;
select c.relkind,n.nspname,c.relname from pg_class c join pg_namespace n on n.oid=c.relnamespace
 where (n.nspname='public' and c.relname like 'signage\_%' escape '\')
    or (n.nspname='storage' and c.relname='buckets') order by 2,3;
select conname,pg_get_constraintdef(oid) definition from pg_constraint
 where conrelid='public.capability_grants'::regclass order by conname;
select pg_get_functiondef('public.set_index_access(uuid,text,text[])'::regprocedure) set_index_access_definition;
select id,name,public,file_size_limit,allowed_mime_types from storage.buckets where id='signage-media';
select routine_name,security_type from information_schema.routines
 where routine_schema='public' and routine_name like 'signage\_%' escape '\' order by routine_name;
select schemaname,tablename,policyname,roles,cmd,qual,with_check from pg_policies
 where schemaname='public' and tablename like 'signage\_%' escape '\' order by tablename,policyname;
select grantee,table_schema,table_name,privilege_type from information_schema.role_table_grants
 where table_schema='public' and table_name like 'signage\_%' escape '\' order by table_name,grantee,privilege_type;
