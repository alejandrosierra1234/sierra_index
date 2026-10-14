-- Policy comments: atomic operations, trusted authors, immutable audit, document CAS.
-- Apply after update48.sql. Re-runnable, transactional; legacy snapshots are retained.
begin;
create table if not exists public.policy_threads (
  policy_id text not null references public.policy_documents(id) on delete cascade,
  id text not null, anchor jsonb not null default '{}',
  author_id uuid references public.profiles(id), legacy_author jsonb,
  resolved boolean not null default false, resolved_by uuid references public.profiles(id),
  deleted boolean not null default false, version bigint not null default 1,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  primary key(policy_id,id)
);
create table if not exists public.policy_messages (
  policy_id text not null, thread_id text not null, id text not null,
  author_id uuid references public.profiles(id), legacy_author jsonb,
  body text not null, deleted boolean not null default false, version bigint not null default 1,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  primary key(policy_id,id),
  foreign key(policy_id,thread_id) references public.policy_threads(policy_id,id) on delete cascade
);
create table if not exists public.policy_comment_events (
  seq bigint generated always as identity primary key,
  policy_id text not null references public.policy_documents(id) on delete cascade,
  thread_id text not null, actor_id uuid references public.profiles(id),
  operation_id text not null, action text not null,
  before_state jsonb, after_state jsonb, created_at timestamptz not null default now(),
  unique(policy_id,operation_id)
);
create index if not exists policy_comment_events_document on public.policy_comment_events(policy_id,seq);
alter table public.policy_threads enable row level security;
alter table public.policy_messages enable row level security;
alter table public.policy_comment_events enable row level security;
revoke all on public.policy_threads,public.policy_messages,public.policy_comment_events from public,anon,authenticated;

-- Legacy authors cannot be retroactively authenticated. Preserve their attribution
-- with a visible legacy flag; only the document owner may manage migrated entries.
create or replace function public.policy_legacy_date(p_value text,p_fallback timestamptz)
returns timestamptz language plpgsql stable set search_path='' as $legacy_date$
begin
  return coalesce(p_value::timestamptz,p_fallback);
exception when others then
  return p_fallback;
end;
$legacy_date$;
revoke all on function public.policy_legacy_date(text,timestamptz) from public,anon,authenticated;
create or replace function public.policy_import_legacy_comments(p_id text,p_comments jsonb,p_created timestamptz)
returns void language plpgsql security definer set search_path='' as $$
declare c jsonb; r jsonb; tid text; rid text;
begin
    for c in select value from jsonb_array_elements(coalesce(p_comments,'[]')) loop
      tid:=coalesce(nullif(c->>'id',''),'legacy-'||md5(c::text));
      insert into public.policy_threads(policy_id,id,anchor,legacy_author,resolved,created_at)
      values(p_id,tid,jsonb_build_object('sectionId',coalesce(c->>'sectionId',''),'quote',coalesce(c->>'quote',''),'legacy',true),
        c - 'body' - 'replies',coalesce((c->>'resolved')::boolean,false),public.policy_legacy_date(c->>'createdAt',p_created)) on conflict do nothing;
      insert into public.policy_messages(policy_id,thread_id,id,body,legacy_author,created_at)
      values(p_id,tid,tid,coalesce(c->>'body',''),c - 'body' - 'replies',public.policy_legacy_date(c->>'createdAt',p_created)) on conflict do nothing;
      for r in select value from jsonb_array_elements(coalesce(c->'replies','[]')) loop
        rid:=coalesce(nullif(r->>'id',''),'legacy-reply-'||md5(r::text));
        insert into public.policy_messages(policy_id,thread_id,id,body,legacy_author,created_at)
        values(p_id,tid,rid,coalesce(r->>'body',''),r - 'body',public.policy_legacy_date(r->>'createdAt',p_created)) on conflict do nothing;
      end loop;
      insert into public.policy_comment_events(policy_id,thread_id,operation_id,action,after_state)
      values(p_id,tid,'migration:'||tid,'migrated',c) on conflict do nothing;
    end loop;
end; $$;
revoke all on function public.policy_import_legacy_comments(text,jsonb,timestamptz) from public,anon,authenticated;
do $$declare d record;begin
 for d in select id,snapshot,created_at from public.policy_documents loop
 perform public.policy_import_legacy_comments(d.id,d.snapshot->'comments',d.created_at);
 end loop;
end; $$;

create table if not exists public.policy_revisions (
 policy_id text not null references public.policy_documents(id) on delete cascade,
 revision bigint not null, snapshot jsonb not null, actor_id uuid references public.profiles(id),
 created_at timestamptz not null default now(),primary key(policy_id,revision)
);
alter table public.policy_revisions add column if not exists legacy_author jsonb;
alter table public.policy_revisions enable row level security;
revoke all on public.policy_revisions from public,anon,authenticated;
insert into public.policy_revisions(policy_id,revision,snapshot,actor_id,created_at)
 select id,revision,snapshot-'comments'-'versions',updated_by,updated_at from public.policy_documents on conflict do nothing;
insert into public.policy_revisions(policy_id,revision,snapshot,legacy_author,created_at)
 select d.id,-1000000+v.ordinality,v.value->'snapshot',v.value-'snapshot',public.policy_legacy_date(v.value->>'createdAt',d.created_at)
 from public.policy_documents d cross join lateral jsonb_array_elements(coalesce(d.snapshot->'versions','[]')) with ordinality v
 where jsonb_typeof(v.value->'snapshot')='object' on conflict do nothing;

create or replace function public.policy_comment_author(p_id uuid,p_legacy jsonb)
returns jsonb language sql stable security definer set search_path='' as $$
 select case when p_id is null then jsonb_build_object('authorId','','authorName',coalesce(p_legacy->>'authorName','Comentario anterior'),
 'authorAvatar',coalesce(p_legacy->>'authorAvatar',''),'legacy',true)
 else coalesce((select jsonb_build_object('authorId',id,'authorName',full_name,'authorAvatar',avatar_url,'legacy',false)
 from public.profiles where id=p_id),'{}'::jsonb) end
$$;
revoke all on function public.policy_comment_author(uuid,jsonb) from public,anon,authenticated;

create or replace function public.policy_comments_read(p_policy_id text)
returns jsonb language plpgsql stable security definer set search_path='' as $$
declare result jsonb; owner uuid;
begin
 if not public.authorize('communications','read') then raise exception 'Access denied' using errcode='42501'; end if;
 select owner_id into owner from public.policy_documents where id=p_policy_id;
 if not found then raise exception 'Policy not found' using errcode='P0002'; end if;
 select coalesce(jsonb_agg(jsonb_build_object(
   'id',t.id,'anchor',t.anchor,'sectionId',coalesce(t.anchor->>'sectionId',''),'quote',coalesce(t.anchor->>'quote',''),
   'resolved',t.resolved,'resolvedBy',public.policy_comment_author(t.resolved_by,null),
   'deleted',t.deleted,'version',t.version,'createdAt',t.created_at,'updatedAt',t.updated_at,
   'canManage',public.authorize('communications','write') and (t.author_id=auth.uid() or (t.author_id is null and owner=auth.uid())),
   'messages',coalesce((select jsonb_agg(jsonb_build_object('id',m.id,'body',case when m.deleted then '' else m.body end,
     'deleted',m.deleted,'version',m.version,'createdAt',m.created_at,'updatedAt',m.updated_at,
     'canManage',public.authorize('communications','write') and (m.author_id=auth.uid() or (m.author_id is null and owner=auth.uid())))
     ||public.policy_comment_author(m.author_id,m.legacy_author) order by m.created_at,m.id)
     from public.policy_messages m where m.policy_id=t.policy_id and m.thread_id=t.id),'[]'::jsonb)
 )||public.policy_comment_author(t.author_id,t.legacy_author) order by t.created_at,t.id),'[]'::jsonb)
 into result from public.policy_threads t where t.policy_id=p_policy_id;
 return jsonb_build_object('threads',result,'cursor',(select coalesce(max(seq),0) from public.policy_comment_events where policy_id=p_policy_id));
end; $$;

create or replace function public.policy_comment_apply(p_policy_id text,p_operation jsonb)
returns jsonb language plpgsql security definer set search_path='' as $$
declare actor uuid:=auth.uid(); op text:=p_operation->>'operationId'; action text:=p_operation->>'action';
 tid text:=p_operation->>'threadId'; mid text:=p_operation->>'messageId';
 t public.policy_threads; m public.policy_messages; owner uuid; before_json jsonb; after_json jsonb;
begin
 if not public.authorize('communications','write') or not public.authorize('communications','read') then raise exception 'Access denied' using errcode='42501'; end if;
 if op is null or length(op) not between 1 and 200 or tid is null or length(tid) not between 1 and 200 or pg_column_size(p_operation)>262144 then raise exception 'Invalid operation'; end if;
 -- Serialize small comment transactions, not full document snapshots.
 select owner_id into owner from public.policy_documents where id=p_policy_id for update;
 if not found then raise exception 'Policy not found' using errcode='P0002'; end if;
 if exists(select 1 from public.policy_comment_events where policy_id=p_policy_id and operation_id=op and actor_id=actor) then return public.policy_comments_read(p_policy_id); end if;
 if action in ('create','reply','edit') and (length(trim(coalesce(p_operation->>'body',''))) not between 1 and 10000) then raise exception 'Comment must contain 1 to 10000 characters'; end if;
 select * into t from public.policy_threads where policy_id=p_policy_id and id=tid;
 if action='create' then
   if found then raise exception 'Thread already exists' using errcode='40001'; end if;
   if coalesce(jsonb_typeof(p_operation->'anchor'),'null')<>'object' then raise exception 'Invalid anchor'; end if;
   insert into public.policy_threads(policy_id,id,anchor,author_id) values(p_policy_id,tid,p_operation->'anchor',actor);
   insert into public.policy_messages(policy_id,thread_id,id,body,author_id) values(p_policy_id,tid,tid,trim(p_operation->>'body'),actor);
   after_json:=jsonb_build_object('body',trim(p_operation->>'body'),'anchor',p_operation->'anchor');
 else
   if t.id is null then raise exception 'Thread not found'; end if;
   if t.deleted and action<>'restore-thread' then raise exception 'Thread deleted' using errcode='40001'; end if;
   if action='reply' then
     if t.resolved then raise exception 'Reopen the thread before replying' using errcode='40001'; end if;
     if mid is null or length(mid) not between 1 and 200 then raise exception 'Invalid message'; end if;
     insert into public.policy_messages(policy_id,thread_id,id,body,author_id) values(p_policy_id,tid,mid,trim(p_operation->>'body'),actor);
     after_json:=jsonb_build_object('messageId',mid,'body',trim(p_operation->>'body'));
   elsif action in ('edit','delete-message','restore-message') then
     select * into m from public.policy_messages where policy_id=p_policy_id and thread_id=tid and id=mid;
     if not found or not coalesce((m.author_id=actor or (m.author_id is null and owner=actor)),false) then raise exception 'Only the author can change this message' using errcode='42501'; end if;
     if m.deleted and action='edit' then raise exception 'Restore the message before editing' using errcode='40001'; end if;
     if coalesce((p_operation->>'version')::bigint,-1)<>m.version then raise exception 'Message changed; reload before editing' using errcode='40001'; end if;
     if mid=tid and action<>'edit' then raise exception 'Use the thread action'; end if;
     before_json:=to_jsonb(m);
     update public.policy_messages set body=case when action='edit' then trim(p_operation->>'body') else body end,
       deleted=case when action='edit' then deleted else action='delete-message' end,version=version+1,updated_at=now()
       where policy_id=p_policy_id and id=mid returning to_jsonb(policy_messages.*) into after_json;
   elsif action in ('resolve','reopen','delete-thread','restore-thread','anchor') then
     if action in ('delete-thread','restore-thread','anchor') and not coalesce((t.author_id=actor or (t.author_id is null and owner=actor)),false) then raise exception 'Only the author can change this thread' using errcode='42501'; end if;
     if action='anchor' and coalesce(jsonb_typeof(p_operation->'anchor'),'null')<>'object' then raise exception 'Invalid anchor'; end if;
     if coalesce((p_operation->>'version')::bigint,-1)<>t.version then raise exception 'Thread changed; reload before editing' using errcode='40001'; end if;
     before_json:=to_jsonb(t);
     update public.policy_threads set resolved=case when action in ('resolve','reopen') then action='resolve' else resolved end,
       resolved_by=case when action='resolve' then actor when action='reopen' then null else resolved_by end,
       deleted=case when action in ('delete-thread','restore-thread') then action='delete-thread' else deleted end,
       anchor=case when action='anchor' then p_operation->'anchor' else anchor end,version=version+1,updated_at=now()
       where policy_id=p_policy_id and id=tid returning to_jsonb(policy_threads.*) into after_json;
   else raise exception 'Unknown operation'; end if;
 end if;
 insert into public.policy_comment_events(policy_id,thread_id,actor_id,operation_id,action,before_state,after_state)
 values(p_policy_id,tid,actor,op,action,before_json,after_json);
 return public.policy_comments_read(p_policy_id);
end; $$;

create or replace function public.policy_comment_history(p_policy_id text,p_thread_id text)
returns jsonb language plpgsql stable security definer set search_path='' as $$
begin
 if not public.authorize('communications','read') then raise exception 'Access denied' using errcode='42501'; end if;
 return (select coalesce(jsonb_agg(jsonb_build_object('id',seq,'action',action,'before',before_state,'after',after_state,'createdAt',created_at)
 ||public.policy_comment_author(actor_id,null) order by seq desc),'[]'::jsonb)
 from public.policy_comment_events where policy_id=p_policy_id and thread_id=p_thread_id);
end; $$;

-- A content save cannot touch comments. Reject stale snapshots, including old clients.
create or replace function public.policy_cloud_save(p_snapshot jsonb)
returns jsonb language plpgsql security definer set search_path='' as $$
declare v_id text:=trim(p_snapshot->>'id'); current_row public.policy_documents; clean jsonb;
begin
 if not public.authorize('communications','write') then raise exception 'Access denied' using errcode='42501'; end if;
 if p_snapshot is null or jsonb_typeof(p_snapshot)<>'object' or v_id is null or length(v_id) not between 1 and 200 or pg_column_size(p_snapshot)>8388608 then raise exception 'Invalid policy'; end if;
 clean:=p_snapshot - 'comments' - '_revision' - 'versions';
 insert into public.policy_documents(id,snapshot,owner_id,updated_by) values(v_id,clean,auth.uid(),auth.uid()) on conflict do nothing;
 if found then
   perform public.policy_import_legacy_comments(v_id,p_snapshot->'comments',now());
 else
   select * into current_row from public.policy_documents where id=v_id for update;
   if coalesce((p_snapshot->>'_revision')::bigint,-1)<>current_row.revision then raise exception 'Policy changed in another session' using errcode='40001'; end if;
   update public.policy_documents set snapshot=clean,revision=revision+1,updated_by=auth.uid(),updated_at=now() where id=v_id;
 end if;
 insert into public.policy_revisions(policy_id,revision,snapshot,actor_id)
 select id,revision,snapshot,auth.uid() from public.policy_documents where id=v_id on conflict do nothing;
 return (select snapshot||jsonb_build_object('_revision',revision,'comments',(public.policy_comments_read(id)->'threads')) from public.policy_documents where id=v_id);
end; $$;
create or replace function public.policy_revision_list(p_policy_id text)
returns jsonb language plpgsql stable security definer set search_path='' as $$
begin
 if not public.authorize('communications','read') then raise exception 'Access denied' using errcode='42501';end if;
 return (select coalesce(jsonb_agg(jsonb_build_object('id','cloud-'||revision,'createdAt',created_at,'snapshot',snapshot)
 ||public.policy_comment_author(actor_id,legacy_author) order by revision desc),'[]'::jsonb)
 from public.policy_revisions where policy_id=p_policy_id);
end; $$;
-- The policy library archives documents. Hard deletion would destroy the audit.
create or replace function public.policy_cloud_delete(p_id text)
returns void language plpgsql security definer set search_path='' as $$
begin
 raise exception 'Archive the policy to preserve its audit history' using errcode='42501';
end; $$;
create or replace function public.policy_cloud_list()
returns jsonb language plpgsql stable security definer set search_path='' as $$
begin
 if not public.authorize('communications','read') then raise exception 'Access denied' using errcode='42501'; end if;
 return (select coalesce(jsonb_agg(snapshot||jsonb_build_object('_revision',revision,'comments',(public.policy_comments_read(id)->'threads')) order by updated_at desc),'[]'::jsonb) from public.policy_documents);
end; $$;
create or replace function public.policy_cloud_get(p_policy_id text)
returns jsonb language plpgsql stable security definer set search_path='' as $$
begin
 if not public.authorize('communications','read') then raise exception 'Access denied' using errcode='42501'; end if;
 return (select snapshot||jsonb_build_object('_revision',revision,'comments',(public.policy_comments_read(id)->'threads')) from public.policy_documents where id=p_policy_id);
end; $$;
revoke all on function public.policy_comments_read(text),public.policy_comment_apply(text,jsonb),public.policy_comment_history(text,text),public.policy_cloud_get(text),public.policy_revision_list(text) from public,anon;
grant execute on function public.policy_comments_read(text),public.policy_comment_apply(text,jsonb),public.policy_comment_history(text,text),public.policy_cloud_get(text),public.policy_revision_list(text) to authenticated;
insert into public.index_security_migrations(version) values(49) on conflict do nothing;
notify pgrst,'reload schema';
commit;
