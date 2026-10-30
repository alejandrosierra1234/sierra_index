-- Admit SIERRA infographics into the secured collaborative Communications store.
begin;

alter table public.communication_documents
  drop constraint if exists communication_documents_kind_check;
alter table public.communication_documents
  add constraint communication_documents_kind_check
  check (kind in ('memo','circular','aviso','convocatoria','infographic'));

insert into public.index_security_migrations(version) values(68) on conflict do nothing;
notify pgrst,'reload schema';
commit;
