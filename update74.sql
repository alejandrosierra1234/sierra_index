-- Keep collaborative memo editing responsive under concurrent users and large
-- legacy Yjs histories. Read-only polls no longer serialize on a document row;
-- history is returned in bounded pages and compacted after the client catches up.
begin;

create or replace function public.communication_list()
returns jsonb language plpgsql stable security definer set search_path='' as $$
declare v_can_read boolean;v_can_write boolean;v_result jsonb;
begin
  v_can_read:=coalesce(public.index_account_active(),false)
    and coalesce(public.authorize('communications','read'),false);
  if not v_can_read then return '[]'::jsonb;end if;
  v_can_write:=coalesce(public.authorize('communications','write'),false);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id',d.id,'source_id',d.source_id,'title',d.title,'kind',d.kind,
    'metadata',d.metadata,
    'role',case when not v_can_write then 'viewer' when d.owner_id=auth.uid() then 'owner' else 'editor' end,
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
  into v_result
  from public.communication_documents d
  left join public.profiles owner on owner.id=d.owner_id;
  return v_result;
end $$;

create or replace function public.communication_sync(
  p_id uuid,p_after bigint default -1,p_nonce uuid default null,p_update text default null,
  p_session uuid default null,p_awareness text default null,p_title text default null,
  p_kind text default null,p_metadata jsonb default null
)
returns jsonb language plpgsql security definer set search_path='' as $$
declare
  d public.communication_documents;v_role text;v_updates jsonb:='[]'::jsonb;v_presence jsonb;
  v_delivered bigint;v_pending_count bigint:=0;v_pending_bytes bigint:=0;v_return_snapshot boolean;
begin
  -- Only writers need to serialize revision allocation. Presence/read polls must
  -- never queue behind each other merely to inspect the same document.
  if p_update is null then
    select * into d from public.communication_documents where id=p_id;
  else
    select * into d from public.communication_documents where id=p_id for update;
  end if;

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
    else
      select * into d from public.communication_documents where id=p_id;
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
  delete from public.communication_presence
  where document_id=p_id and seen_at<now()-interval '15 seconds';

  select count(*),coalesce(sum(octet_length(u.payload)),0)
  into v_pending_count,v_pending_bytes
  from public.communication_updates u
  where u.document_id=p_id and u.revision>d.snapshot_revision;

  v_return_snapshot:=p_after<d.snapshot_revision or p_after<0;
  if v_return_snapshot then
    -- A snapshot can already be several MB. Send updates on following pages so
    -- one response cannot grow to the full, unbounded document history.
    v_delivered:=d.snapshot_revision;
  else
    with pending as (
      select u.revision,u.payload,
        row_number() over(order by u.revision) as row_number,
        sum(octet_length(u.payload)) over(order by u.revision) as running_bytes
      from public.communication_updates u
      where u.document_id=p_id and u.revision>greatest(p_after,d.snapshot_revision)
    ), chosen as (
      select revision,payload from pending
      where row_number=1 or running_bytes<=1048576
      order by revision limit 32
    )
    select coalesce(jsonb_agg(jsonb_build_object(
      'revision',revision,'payload',encode(payload,'base64')) order by revision),'[]'::jsonb),
      max(revision)
    into v_updates,v_delivered from chosen;
    v_delivered:=coalesce(v_delivered,least(d.revision,greatest(p_after,d.snapshot_revision)));
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'user_id',p.user_id,'name',a.full_name,'session_id',p.session_id,
    'awareness',p.awareness,'seen_at',p.seen_at
  ) order by p.seen_at desc),'[]'::jsonb)
  into v_presence from public.communication_presence p
  join public.profiles a on a.id=p.user_id
  where p.document_id=p_id and a.account_status='active';

  return jsonb_build_object(
    'role',v_role,'revision',v_delivered,'latest_revision',d.revision,
    'snapshot_revision',d.snapshot_revision,
    'snapshot',case when v_return_snapshot then encode(d.snapshot,'base64') end,
    'updates',v_updates,'has_more',v_delivered<d.revision,
    'checkpoint_recommended',v_pending_count>=20 or v_pending_bytes>=1048576,
    'presence',v_presence
  );
end $$;

revoke all on function public.communication_list(),
  public.communication_sync(uuid,bigint,uuid,text,uuid,text,text,text,jsonb)
from public,anon;
grant execute on function public.communication_list(),
  public.communication_sync(uuid,bigint,uuid,text,uuid,text,text,text,jsonb)
to authenticated;

insert into public.index_security_migrations(version) values(74) on conflict do nothing;
commit;
