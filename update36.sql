-- Product feedback and explicitly published QR cards. No catalogue-wide publication.
begin;
create table if not exists sample_product_feedback (
 id uuid primary key default gen_random_uuid(), product_id uuid not null references products(id),
 customer text not null, version_label text not null, comment text not null,
 snapshot jsonb not null, status text not null default 'open' check(status in ('open','reviewing','development','closed')),
 resolution text, successor_product_id uuid references products(id), revision integer not null default 1,
 created_by uuid not null references auth.users(id), created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists sample_public_cards (
 product_id uuid primary key references products(id), card_id uuid not null unique default gen_random_uuid(),
 content jsonb not null, active boolean not null default false, revision integer not null default 1,
 published_by uuid not null references auth.users(id), published_at timestamptz not null default now()
);
create table if not exists sample_public_card_versions (
 product_id uuid not null references products(id),revision integer not null,content jsonb not null,
 created_at timestamptz not null default now(),primary key(product_id,revision)
);
alter table sample_public_card_versions enable row level security;
revoke all on sample_public_card_versions from public,anon,authenticated;
create table if not exists sample_public_requests (
 id uuid primary key default gen_random_uuid(), product_id uuid not null references products(id),
 card_revision integer not null, name text not null, email text not null, company text not null, country text not null,
 message text not null default '', status text not null default 'new' check(status in ('new','contacted','closed')),
 handled_by uuid references auth.users(id), created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create or replace function sample_product_can(p_product uuid,p_write boolean default false)
returns boolean language sql stable security definer set search_path=public,pg_temp as $$
select auth.uid() is not null and exists(select 1 from products p where p.id=p_product and p.division in ('fabric','garment') and (
 authorize('platform','admin') or authorize('customer_service',case when p_write then 'write' else 'read' end)
 or authorize(p.division,case when p_write then 'write' else 'read' end)
 or authorize('warehouse','dispatch') or authorize('warehouse_'||p.division,'dispatch')
));
$$;
alter table sample_product_feedback enable row level security;
alter table sample_public_cards enable row level security;
alter table sample_public_requests enable row level security;
drop policy if exists sample_feedback_read on sample_product_feedback;
create policy sample_feedback_read on sample_product_feedback for select to authenticated using(sample_product_can(product_id));
drop policy if exists sample_card_read on sample_public_cards;
create policy sample_card_read on sample_public_cards for select to authenticated using(sample_product_can(product_id));
drop policy if exists sample_request_read on sample_public_requests;
create policy sample_request_read on sample_public_requests for select to authenticated using(authorize('customer_service','read') or authorize('platform','admin'));
revoke all on sample_product_feedback,sample_public_cards,sample_public_requests from public,anon,authenticated;
grant select on sample_product_feedback,sample_public_cards,sample_public_requests to authenticated;

create or replace function record_sample_feedback(p_product uuid,p_customer text,p_version text,p_comment text)
returns uuid language plpgsql security definer set search_path=public,pg_temp as $$
declare result uuid; snap jsonb;
begin
 if not sample_product_can(p_product,true) then raise exception 'No tienes permiso para registrar observaciones'; end if;
 if nullif(trim(p_customer),'') is null or nullif(trim(p_version),'') is null or nullif(trim(p_comment),'') is null or length(p_comment)>5000 then raise exception 'Completa cliente, versión y comentario (máximo 5000 caracteres)'; end if;
 select jsonb_build_object('name',name,'code',code,'specs',specs) into snap from products where id=p_product;
 insert into sample_product_feedback(product_id,customer,version_label,comment,snapshot,created_by) values(p_product,trim(p_customer),trim(p_version),trim(p_comment),snap,auth.uid()) returning id into result;
 return result;
end;
$$;
create or replace function resolve_sample_feedback(p_id uuid,p_revision integer,p_status text,p_resolution text,p_successor uuid default null)
returns void language plpgsql security definer set search_path=public,pg_temp as $$
declare f sample_product_feedback; div text;
begin
 select * into f from sample_product_feedback where id=p_id for update;
 if not found then raise exception 'Observación no encontrada'; end if;
 select division into div from products where id=f.product_id;
 if auth.uid() is null or not(authorize('platform','admin') or authorize(div,'write')) then raise exception 'El responsable de desarrollos debe resolver la observación'; end if;
 if f.revision<>p_revision then raise exception 'La observación cambió. Actualiza antes de continuar.'; end if;
 if nullif(trim(p_resolution),'') is null then raise exception 'Registra la decisión de PD'; end if;
 if p_successor=f.product_id then raise exception 'Selecciona un desarrollo sucesor distinto'; end if;
 update sample_product_feedback set status=p_status,resolution=trim(p_resolution),successor_product_id=p_successor,revision=revision+1,updated_at=now() where id=p_id;
end;
$$;
create or replace function publish_sample_card(p_product uuid,p_active boolean)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare p products; result sample_public_cards; body jsonb;
begin
 select * into p from products where id=p_product;
 if auth.uid() is null or not(authorize('platform','admin') or authorize(p.division,'write')) then raise exception 'No tienes permiso para publicar fichas'; end if;
 if p.division not in ('fabric','garment') then raise exception 'Esta ficha corresponde a telas y prendas'; end if;
 body:=jsonb_build_object('id',p.id,'name',p.name,'code',p.code,'division',p.division,'image_url',to_jsonb(p)->>'image_url','specs',jsonb_strip_nulls(jsonb_build_object('Composition',p.specs->>'Composition','Color',p.specs->>'Color','Width',p.specs->>'Width','GSM',p.specs->>'GSM')));
 insert into sample_public_cards(product_id,content,active,published_by) values(p.id,body,p_active,auth.uid()) on conflict(product_id) do update set content=excluded.content,active=excluded.active,revision=sample_public_cards.revision+1,published_by=auth.uid(),published_at=now() returning * into result;
 insert into sample_public_card_versions(product_id,revision,content) values(result.product_id,result.revision,result.content) on conflict do nothing;
 return to_jsonb(result);
end;
$$;
create or replace function get_sample_public_card(p_product uuid,p_revision integer default null)
returns jsonb language sql stable security definer set search_path=public,pg_temp as $$
select v.content || jsonb_build_object('card_id',c.card_id,'revision',v.revision) from sample_public_cards c join sample_public_card_versions v on v.product_id=c.product_id and v.revision=coalesce(p_revision,c.revision) where c.product_id=p_product and c.active;
$$;
create or replace function request_sample_public_card(p_card uuid,p_name text,p_email text,p_company text,p_country text,p_message text,p_website text default '',p_revision integer default null)
returns void language plpgsql security definer set search_path=public,pg_temp as $$
declare card sample_public_cards;
begin
 if coalesce(p_website,'')<>'' then return; end if;
 select * into card from sample_public_cards where card_id=p_card and active for update;
 if not found then raise exception 'La ficha ya no está disponible'; end if;
 if not exists(select 1 from sample_public_card_versions where product_id=card.product_id and revision=coalesce(p_revision,card.revision)) then raise exception 'La versión de la ficha no está disponible'; end if;
 if length(trim(coalesce(p_name,''))) not between 2 and 150 or length(trim(coalesce(p_company,''))) not between 2 and 200 or length(trim(coalesce(p_country,''))) not between 2 and 100 or length(coalesce(p_message,''))>3000 or length(coalesce(p_email,''))>254 or coalesce(p_email,'') !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then raise exception 'Revisa tus datos de contacto'; end if;
 if exists(select 1 from sample_public_requests where product_id=card.product_id and lower(email)=lower(trim(p_email)) and created_at>now()-interval '24 hours') then return; end if;
 if (select count(*) from sample_public_requests where product_id=card.product_id and created_at>now()-interval '24 hours')>=100 then raise exception 'No podemos recibir más solicitudes para esta ficha hoy. Inténtalo mañana.'; end if;
 insert into sample_public_requests(product_id,card_revision,name,email,company,country,message) values(card.product_id,coalesce(p_revision,card.revision),trim(p_name),lower(trim(p_email)),trim(p_company),trim(p_country),trim(coalesce(p_message,'')));
end;
$$;
create or replace function handle_sample_public_request(p_id uuid,p_status text)
returns void language plpgsql security definer set search_path=public,pg_temp as $$
begin
 if auth.uid() is null or not(authorize('customer_service','write') or authorize('platform','admin')) then raise exception 'Ventas administra las solicitudes'; end if;
 update sample_public_requests set status=p_status,handled_by=auth.uid(),updated_at=now() where id=p_id;
 if not found then raise exception 'Solicitud no encontrada'; end if;
end;
$$;
revoke all on function sample_product_can(uuid,boolean),record_sample_feedback(uuid,text,text,text),resolve_sample_feedback(uuid,integer,text,text,uuid),publish_sample_card(uuid,boolean),get_sample_public_card(uuid,integer),request_sample_public_card(uuid,text,text,text,text,text,text,integer),handle_sample_public_request(uuid,text) from public;
grant execute on function sample_product_can(uuid,boolean),record_sample_feedback(uuid,text,text,text),resolve_sample_feedback(uuid,integer,text,text,uuid),publish_sample_card(uuid,boolean),handle_sample_public_request(uuid,text) to authenticated;
grant execute on function get_sample_public_card(uuid,integer),request_sample_public_card(uuid,text,text,text,text,text,text,integer) to anon,authenticated;
-- An anonymous browser must never fetch the complete private specs JSON.
revoke select on products from public,anon;
grant select on products to authenticated;
notify pgrst,'reload schema';
commit;
