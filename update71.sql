-- Durable, team-wide Communications library and private media.
-- Apply after update70.sql. The cloud document is authoritative; browser storage
-- remains only as an automatic recovery/import source.
begin;

alter table public.communication_documents
  add column if not exists metadata jsonb not null default '{}'::jsonb;

alter table public.communication_documents
  drop constraint if exists communication_documents_metadata_check;
alter table public.communication_documents
  add constraint communication_documents_metadata_check
  check (jsonb_typeof(metadata)='object' and octet_length(metadata::text)<=65536);

alter table public.communication_documents
  drop constraint if exists communication_documents_kind_check;
alter table public.communication_documents
  add constraint communication_documents_kind_check
  check (kind in ('memo','circular','aviso','convocatoria','infographic','orgchart'));

create index if not exists communication_documents_updated_idx
  on public.communication_documents(updated_at desc,id);

create or replace function public.communication_role(p_id uuid)
returns text language sql stable security definer set search_path='' as $$
 select case
   when not coalesce(public.index_account_active(),false) then null
   when not coalesce(public.authorize('communications','read'),false) then null
   when not coalesce(public.authorize('communications','write'),false) then 'viewer'
   when d.owner_id=auth.uid() then 'owner'
   else 'editor'
 end
 from public.communication_documents d
 where d.id=p_id
$$;

drop function if exists public.communication_create(text,text,text,text);
create function public.communication_create(
  p_source text,p_title text,p_kind text,p_snapshot text,p_metadata jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path='' as $$
declare v_id uuid;
begin
 if not coalesce(public.authorize('communications','read'),false)
   or not coalesce(public.authorize('communications','write'),false) then
   raise insufficient_privilege using message='Communications editing access required';
 end if;
 if p_kind not in ('memo','circular','aviso','convocatoria','infographic','orgchart') then
   raise exception 'Invalid communication kind';
 end if;
 if jsonb_typeof(coalesce(p_metadata,'{}'::jsonb))<>'object'
   or octet_length(coalesce(p_metadata,'{}'::jsonb)::text)>65536 then
   raise exception 'Invalid communication metadata';
 end if;
 insert into public.communication_documents(owner_id,source_id,title,kind,snapshot,metadata)
 values(auth.uid(),p_source,left(coalesce(nullif(trim(p_title),''),'Comunicado'),500),p_kind,
   decode(p_snapshot,'base64'),coalesce(p_metadata,'{}'::jsonb))
 on conflict(owner_id,source_id) do nothing returning id into v_id;
 if v_id is null then
   select id into v_id from public.communication_documents
   where owner_id=auth.uid() and source_id=p_source;
 end if;
 return v_id;
end $$;

-- Idempotent recovery path for legacy browser drafts. Existing collaborative
-- documents are never overwritten; only missing source IDs are inserted.
create or replace function public.communication_import(
  p_source text,p_title text,p_kind text,p_snapshot text,p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path='' as $$
declare v_id uuid;v_created boolean:=false;
begin
 if not coalesce(public.authorize('communications','read'),false)
   or not coalesce(public.authorize('communications','write'),false) then
   raise insufficient_privilege using message='Communications editing access required';
 end if;
 if p_kind not in ('memo','circular','aviso','convocatoria') then
   raise exception 'Invalid communication kind';
 end if;
 if jsonb_typeof(coalesce(p_metadata,'{}'::jsonb))<>'object'
   or octet_length(coalesce(p_metadata,'{}'::jsonb)::text)>65536 then
   raise exception 'Invalid communication metadata';
 end if;
 insert into public.communication_documents(owner_id,source_id,title,kind,snapshot,metadata)
 values(auth.uid(),p_source,left(coalesce(nullif(trim(p_title),''),'Comunicado'),500),p_kind,
   decode(p_snapshot,'base64'),coalesce(p_metadata,'{}'::jsonb))
 on conflict(owner_id,source_id) do nothing returning id into v_id;
 if v_id is not null then v_created:=true;
 else select id into v_id from public.communication_documents
   where owner_id=auth.uid() and source_id=p_source;
 end if;
 return jsonb_build_object('id',v_id,'created',v_created);
end $$;

create or replace function public.communication_catalog(
  p_id uuid,p_title text,p_kind text,p_metadata jsonb default '{}'::jsonb
)
returns boolean language plpgsql security definer set search_path='' as $$
begin
 if coalesce(public.communication_role(p_id),'') not in ('owner','editor') then
   raise insufficient_privilege using message='Communications is read only';
 end if;
 if p_kind not in ('memo','circular','aviso','convocatoria','infographic','orgchart') then
   raise exception 'Invalid communication kind';
 end if;
 if jsonb_typeof(coalesce(p_metadata,'{}'::jsonb))<>'object'
   or octet_length(coalesce(p_metadata,'{}'::jsonb)::text)>65536 then
   raise exception 'Invalid communication metadata';
 end if;
 update public.communication_documents set
   title=left(coalesce(nullif(trim(p_title),''),title),500),
   kind=p_kind,metadata=coalesce(p_metadata,'{}'::jsonb)
 where id=p_id;
 return found;
end $$;

create or replace function public.communication_list()
returns jsonb language sql stable security definer set search_path='' as $$
 select case
   when not coalesce(public.index_account_active(),false)
     or not coalesce(public.authorize('communications','read'),false) then '[]'::jsonb
   else coalesce(jsonb_agg(jsonb_build_object(
     'id',d.id,'source_id',d.source_id,'title',d.title,'kind',d.kind,
     'metadata',d.metadata,'role',public.communication_role(d.id),
     'revision',d.revision,'snapshot_revision',d.snapshot_revision,
     'created_at',d.created_at,'updated_at',d.updated_at,
     'owner_id',d.owner_id,'owner_name',owner.full_name,
     'presence',coalesce((
       select jsonb_agg(jsonb_build_object(
         'user_id',p.user_id,'name',active_profile.full_name,'session_id',p.session_id,
         'awareness',p.awareness,'seen_at',p.seen_at
       ) order by p.seen_at desc)
       from public.communication_presence p
       join public.profiles active_profile on active_profile.id=p.user_id
       where p.document_id=d.id and p.seen_at>=now()-interval '15 seconds'
         and active_profile.account_status='active'
     ),'[]'::jsonb)
   ) order by d.updated_at desc),'[]'::jsonb)
 end
 from public.communication_documents d
 left join public.profiles owner on owner.id=d.owner_id
$$;

drop function if exists public.communication_sync(uuid,bigint,uuid,text,uuid,text);
create function public.communication_sync(
  p_id uuid,p_after bigint default -1,p_nonce uuid default null,p_update text default null,
  p_session uuid default null,p_awareness text default null,p_title text default null,
  p_kind text default null,p_metadata jsonb default null
)
returns jsonb language plpgsql security definer set search_path='' as $$
declare d public.communication_documents;v_role text;v_updates jsonb;v_presence jsonb;
begin
 select * into d from public.communication_documents where id=p_id for update;
 v_role:=public.communication_role(p_id);
 if v_role is null then raise insufficient_privilege using message='Communications access denied';end if;
 if p_update is not null then
   if v_role not in ('owner','editor') then raise insufficient_privilege using message='Communications is read only';end if;
   if p_nonce is null then raise exception 'Missing update id';end if;
   if p_metadata is not null and (jsonb_typeof(p_metadata)<>'object' or octet_length(p_metadata::text)>65536) then
     raise exception 'Invalid communication metadata';
   end if;
   if p_kind is not null and p_kind not in ('memo','circular','aviso','convocatoria','infographic','orgchart') then
     raise exception 'Invalid communication kind';
   end if;
   if not exists(select 1 from public.communication_updates where document_id=p_id and nonce=p_nonce) then
     update public.communication_documents set revision=revision+1,updated_at=now(),
       title=case when nullif(trim(p_title),'') is null then title else left(trim(p_title),500) end,
       kind=coalesce(p_kind,kind),metadata=coalesce(p_metadata,metadata)
     where id=p_id returning * into d;
     insert into public.communication_updates(document_id,revision,nonce,actor_id,payload)
       values(p_id,d.revision,p_nonce,auth.uid(),decode(p_update,'base64'));
   end if;
 end if;
 if p_session is not null then
   if p_awareness is null then
     delete from public.communication_presence
       where document_id=p_id and user_id=auth.uid() and session_id=p_session;
   else
     insert into public.communication_presence(document_id,user_id,session_id,awareness)
       values(p_id,auth.uid(),p_session,p_awareness)
       on conflict(document_id,user_id,session_id)
       do update set awareness=excluded.awareness,seen_at=now();
   end if;
 end if;
 delete from public.communication_presence where document_id=p_id and seen_at<now()-interval '15 seconds';
 select coalesce(jsonb_agg(jsonb_build_object('revision',u.revision,'payload',encode(u.payload,'base64')) order by u.revision),'[]')
 into v_updates from public.communication_updates u
 where u.document_id=p_id and u.revision>greatest(p_after,d.snapshot_revision);
 select coalesce(jsonb_agg(jsonb_build_object(
   'user_id',p.user_id,'name',a.full_name,'session_id',p.session_id,
   'awareness',p.awareness,'seen_at',p.seen_at
 ) order by p.seen_at desc),'[]')
 into v_presence from public.communication_presence p
 join public.profiles a on a.id=p.user_id
 where p.document_id=p_id and a.account_status='active';
 return jsonb_build_object('role',v_role,'revision',d.revision,'snapshot_revision',d.snapshot_revision,
   'snapshot',case when p_after<d.snapshot_revision or p_after<0 then encode(d.snapshot,'base64') end,
   'updates',v_updates,'presence',v_presence);
end $$;

revoke all on function public.communication_role(uuid) from public,anon,authenticated;
revoke all on function public.communication_create(text,text,text,text,jsonb),
 public.communication_import(text,text,text,text,jsonb),
 public.communication_catalog(uuid,text,text,jsonb),public.communication_list(),
 public.communication_sync(uuid,bigint,uuid,text,uuid,text,text,text,jsonb)
 from public,anon;
grant execute on function public.communication_create(text,text,text,text,jsonb),
 public.communication_import(text,text,text,text,jsonb),
 public.communication_catalog(uuid,text,text,jsonb),public.communication_list(),
 public.communication_sync(uuid,bigint,uuid,text,uuid,text,text,text,jsonb)
 to authenticated;

-- Communication media lives in the existing private product-images bucket.
-- Storage operations keep using the API; these helpers only authorize the path.
create or replace function public.index_asset_read(p_name text)
returns boolean language sql stable security definer set search_path='' as $$
 select (
   split_part(p_name,'/',1) not in ('employees','avatars','birthday-cards','company-logos','newsletter','communications')
   and exists(select 1 from public.sample_public_cards c
     join public.sample_public_card_versions v on v.product_id=c.product_id
     where c.active and public.index_asset_path(v.content->>'image_url')=p_name)
 ) or (public.index_account_active() and (
   public.authorize('platform','admin')
   or (split_part(p_name,'/',1)='communications' and public.authorize('communications','read'))
   or (split_part(p_name,'/',1)='newsletter' and public.authorize('communications','read'))
   or (split_part(p_name,'/',1)='avatars' and split_part(p_name,'/',2)=auth.uid()::text)
   or (split_part(p_name,'/',1) in ('employees','birthday-cards','company-logos','avatars')
     and public.authorize('talento_humano','read'))
   or exists(select 1 from public.products p where public.authorize(p.division,'read',p.id)
     and (coalesce(p.lifecycle,'available') not in ('draft','development') or public.authorize(p.division,'write',p.id))
     and (public.index_asset_path(p.image_url)=p_name or exists(
       select 1 from jsonb_array_elements_text(coalesce(nullif(to_jsonb(p)->'image_urls','null'::jsonb),'[]'::jsonb)) u
       where public.index_asset_path(u)=p_name)))
   or (split_part(p_name,'/',1)=auth.uid()::text)
 ))
$$;

create or replace function public.index_asset_write(p_name text)
returns boolean language sql stable security definer set search_path='' as $$
 select public.index_account_active() and (
   public.authorize('platform','admin')
   or (split_part(p_name,'/',1)='communications' and public.authorize('communications','write'))
   or (split_part(p_name,'/',1)='newsletter' and public.authorize('communications','write'))
   or (split_part(p_name,'/',1)='avatars' and split_part(p_name,'/',2)=auth.uid()::text)
   or (split_part(p_name,'/',1) in ('employees','birthday-cards','company-logos') and public.authorize('talento_humano','write'))
   or (split_part(p_name,'/',1)=auth.uid()::text and exists(
      select 1 from unnest(array['fiber','yarn','fabric','chemicals','garment']) d where public.authorize(d,'write')))
 )
$$;

revoke all on function public.index_asset_read(text),public.index_asset_write(text) from public;
grant execute on function public.index_asset_read(text) to anon,authenticated;
grant execute on function public.index_asset_write(text) to authenticated;

insert into public.index_security_migrations(version) values(71) on conflict do nothing;
notify pgrst,'reload schema';
commit;
