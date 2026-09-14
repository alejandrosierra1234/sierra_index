-- Run inside the update40 rehearsal transaction instead of its final COMMIT.
-- Existing accounts are changed ONLY inside a transaction ending in ROLLBACK.
do $$
declare a uuid; u uuid; denied boolean:=false;
begin
 select id into strict a from profiles where role='admin' and account_status='active' limit 1;
 select id into strict u from profiles where role='editor' and account_status='active' limit 1;
 perform set_config('index.test_user',u::text,true);
 perform set_config('request.jwt.claim.sub',a::text,true);
 perform set_config('request.jwt.claims',jsonb_build_object('sub',a,'role','authenticated')::text,true);
 if not authorize('platform','admin') then raise exception 'Admin bootstrap failed'; end if;
 perform set_index_access(u,'fiber',array['read']);
 if (select count(*) from capability_grants where user_id=u and domain='fiber' and resource_id is null)<>1 then raise exception 'Atomic downgrade failed'; end if;
 delete from capability_grants where user_id=u;
 perform set_config('request.jwt.claim.sub',u::text,true);
 perform set_config('request.jwt.claims',jsonb_build_object('sub',u,'role','authenticated')::text,true);
 if authorize('fabric','write') or is_editor_or_above() then raise exception 'Legacy role bypass'; end if;
 insert into capability_grants(user_id,domain,capability,expires_at) values(u,'fabric','read',now()-interval '1 hour');
 if authorize('fabric','read') then raise exception 'Expired grant bypass'; end if;
 insert into capability_grants(user_id,domain,capability,resource_id) values(u,'fabric','read','00000000-0000-0000-0000-000000000001');
 if authorize('fabric','read') or not authorize('fabric','read','00000000-0000-0000-0000-000000000001') then raise exception 'Scope bypass'; end if;
 begin perform set_index_access(a,'platform',array['admin']); exception when others then denied:=true; end;
 if not denied then raise exception 'Grant escalation bypass'; end if;
end $$;
set local role authenticated;
do $$
declare denied boolean:=false;
begin
 if exists(select 1 from products) then raise exception 'Products leaked after revocation'; end if;
 if exists(select 1 from product_comments) then raise exception 'Comments leaked after revocation'; end if;
 if exists(select 1 from profiles where id<>auth.uid()) then raise exception 'Profiles leaked'; end if;
 begin
  insert into capability_grants(user_id,domain,capability) values(auth.uid(),'platform','admin');
 exception when insufficient_privilege then denied:=true;
 end;
 if not denied then raise exception 'Direct grant escalation'; end if;
end $$;
reset role;
select set_config('request.jwt.claim.sub','',true),set_config('request.jwt.claims','{}',true);
update profiles set account_status='suspended' where id=current_setting('index.test_user')::uuid;
select set_config('request.jwt.claim.sub',current_setting('index.test_user'),true),
 set_config('request.jwt.claims',jsonb_build_object('sub',current_setting('index.test_user'),'role','authenticated')::text,true);
set local role authenticated;
do $$
declare denied boolean:=false;
begin
 if index_account_active() or authorize('fabric','read','00000000-0000-0000-0000-000000000001') then raise exception 'Suspension bypass'; end if;
 if exists(select 1 from profiles) or exists(select 1 from samples) then raise exception 'Suspended RLS leak'; end if;
 begin perform index_check_request(); exception when insufficient_privilege then denied:=true; end;
 if not denied then raise exception 'Suspended RPC bypass'; end if;
 if (get_my_access()->>'active')::boolean then raise exception 'Suspended access snapshot'; end if;
end $$;
reset role;
select 'PASS: admin preserved; downgrade atomic; legacy, expired, cross-scope, revoked, suspended and escalation requests denied' as security_tests;
rollback;
