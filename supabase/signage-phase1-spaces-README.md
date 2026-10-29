# Pantallas — activación de espacios (fase 1)

Este paquete añade organización por espacios y edición de nombre/asignación de una pantalla. No activa videowall, subida arbitraria de medios ni compartir pantalla.

## Orden de revisión y activación

1. Confirmar un respaldo recuperable del proyecto objetivo fuera de este paquete.
2. Ejecutar `signage-phase1-spaces-preflight.sql` en modo de lectura y comprobar que las migraciones 59, 60, 62 y 63 existen; la 64 no debe existir antes de la primera aplicación.
3. Revisar y aplicar `update64.sql` una sola vez.
4. Desplegar los tres archivos de Edge revisados con `verify_jwt=false`:
   - `supabase/functions/signage-api/index.ts`
   - `supabase/functions/_shared/signage-api-core.mjs`
   - `supabase/functions/_shared/signage-manifest.mjs`
5. Verificar lectura de espacios, creación, renombrado/asignación y rechazo sin sesión/capacidad antes de publicar el frontend.

## Efectos y permisos

- Crea `public.signage_spaces` con RLS. `authenticated` solo recibe `SELECT`, sujeto a `signage_can(workspace_id,'read')`; `service_role` conserva acceso operativo.
- Añade `signage_devices.space_id` nullable. Los dispositivos existentes permanecen sin espacio y no se renombran ni se detienen.
- Añade dos RPC `SECURITY DEFINER` con `search_path=''`, ejecutables solo por `authenticated`. Ambas vuelven a comprobar `read` + `manage_devices`, workspace, sitio y revisión esperada.
- No cambia buckets, secretos, CORS, credenciales de reproductor, contenido, publicaciones, horarios, RLS de otras tablas ni grants globales.
- Edge y `signage_content_save` limitan multimedia remota sin upload a las mismas tres URLs públicas SIERRA revisadas y obligan a que cada URL coincida con su tipo declarado (`video` para MP4, `image` para JPEG). La comprobación en SQL evita que una llamada autenticada directa a la RPC eluda la allowlist. No convierte el bucket privado en público.

## Rollback conservador

Ante un fallo, restaurar primero el bundle Edge y el frontend anteriores. Ejecutar `signage-phase1-spaces-rollback.sql` solo para revocar el uso de los RPC nuevos. No elimina la columna, la tabla ni datos, y conserva intencionalmente el endurecimiento de URLs remotas en `signage_content_save`; revertir esa protección o borrar datos requiere una revisión y autorización separadas.
