-- Colecciones: reparar guardado de nombre desde el board colaborativo.
-- Idempotente. Reafirma el RPC usado por el editor de nombre, con
-- search_path explícito y permiso para usuarios autenticados.

create or replace function public.rename_collection(p_id uuid, p_name text)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not public.is_collection_member(p_id) then
    raise exception 'not authorized on this collection';
  end if;

  update public.sample_collections
     set name = nullif(btrim(coalesce(p_name, '')), ''),
         updated_at = now()
   where id = p_id;
end;
$$;

grant execute on function public.rename_collection(uuid, text) to authenticated;
