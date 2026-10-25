-- Team-wide collaborative communications. Apply after update54.sql.
-- Every active account with Communications read access can discover and read
-- every cloud communication. Communications editors can edit and comment;
-- module viewers remain read-only. Existing owners and document IDs remain.
begin;

create or replace function public.communication_role(p_id uuid)
returns text language sql stable security definer set search_path='' as $$
 select case
   when not coalesce(public.authorize('communications','read'),false) then null
   when not coalesce(public.authorize('communications','write'),false) then 'viewer'
   when d.owner_id=auth.uid() then 'owner'
   else 'editor'
 end
 from public.communication_documents d
 where d.id=p_id
$$;

create or replace function public.communication_list()
returns jsonb language sql stable security definer set search_path='' as $$
 select case when not coalesce(public.authorize('communications','read'),false) then '[]'::jsonb else
   coalesce(jsonb_agg(jsonb_build_object(
     'id',d.id,'title',d.title,'kind',d.kind,'role',public.communication_role(d.id),
     'updated_at',d.updated_at,'owner_id',d.owner_id
   ) order by d.updated_at desc),'[]'::jsonb) end
 from public.communication_documents d
$$;

create or replace function public.communication_sync(p_id uuid,p_after bigint default -1,
  p_nonce uuid default null,p_update text default null,p_session uuid default null,p_awareness text default null)
returns jsonb language plpgsql security definer set search_path='' as $$
declare d public.communication_documents;v_role text;v_updates jsonb;v_presence jsonb;
begin
 select * into d from public.communication_documents where id=p_id for update;
 v_role:=public.communication_role(p_id);
 if v_role is null then raise exception 'Access denied' using errcode='42501';end if;
 if p_update is not null then
   if v_role not in ('owner','editor') then raise exception 'Read only' using errcode='42501';end if;
   if p_nonce is null then raise exception 'Missing update id';end if;
   if not exists(select 1 from public.communication_updates where document_id=p_id and nonce=p_nonce) then
     update public.communication_documents set revision=revision+1,updated_at=now() where id=p_id returning * into d;
     insert into public.communication_updates(document_id,revision,nonce,actor_id,payload)
       values(p_id,d.revision,p_nonce,auth.uid(),decode(p_update,'base64'));
   end if;
 end if;
 if p_session is not null and p_awareness is not null then
   insert into public.communication_presence(document_id,user_id,session_id,awareness)
     values(p_id,auth.uid(),p_session,p_awareness) on conflict(document_id,user_id,session_id)
     do update set awareness=excluded.awareness,seen_at=now();
 end if;
 delete from public.communication_presence where document_id=p_id and seen_at<now()-interval '20 seconds';
 select coalesce(jsonb_agg(jsonb_build_object('revision',u.revision,'payload',encode(u.payload,'base64')) order by u.revision),'[]')
 into v_updates from public.communication_updates u where u.document_id=p_id and u.revision>greatest(p_after,d.snapshot_revision);
 select coalesce(jsonb_agg(jsonb_build_object('user_id',p.user_id,'name',a.full_name,'session_id',p.session_id,'awareness',p.awareness)),'[]')
 into v_presence from public.communication_presence p join public.profiles a on a.id=p.user_id
 where p.document_id=p_id and a.account_status='active';
 return jsonb_build_object('role',v_role,'revision',d.revision,'snapshot_revision',d.snapshot_revision,
   'snapshot',case when p_after<d.snapshot_revision or p_after<0 then encode(d.snapshot,'base64') end,
   'updates',v_updates,'presence',v_presence);
end $$;

revoke all on function public.communication_role(uuid) from public,anon,authenticated;
revoke all on function public.communication_list(),public.communication_sync(uuid,bigint,uuid,text,uuid,text) from public,anon;
grant execute on function public.communication_list(),public.communication_sync(uuid,bigint,uuid,text,uuid,text) to authenticated;

insert into public.index_security_migrations(version) values(55) on conflict do nothing;
notify pgrst,'reload schema';
commit;
