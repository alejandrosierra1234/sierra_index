# Pantallas — corte local de presentaciones PDF

Estado: **solo local, no instalado ni publicado**.

## Resultado funcional del corte

- El administrador elige un PDF de hasta 25 MB y 50 páginas.
- El navegador verifica extensión, MIME y estructura real (`%PDF`/`%%EOF`), rechaza contraseña, scripts o acciones activas y procesa con PDF.js local, sin CDN ni conversor externo.
- El PDF original permanece en memoria en el navegador y no se sube. Cada página se rasteriza a PNG, con un borde máximo de 1920 px y un presupuesto total de 80 Mi-píxeles.
- La interfaz muestra una previsualización fiel, miniaturas, progreso, error y reintento. Una transferencia interrumpida conserva las diapositivas ya verificadas para no repetirlas.
- Guardar preparada no publica. Mostrar ahora crea una sesión temporal para uno o varios destinos.
- Anterior y Siguiente usan un índice absoluto y `control_revision` (CAS). Dos administradores reconstruyen la misma diapositiva; una revisión obsoleta se rechaza y obliga a refrescar.
- El reproductor recibe únicamente la diapositiva activa con URL privada firmada. La última diapositiva válida queda en la caché existente para una pérdida temporal de red.
- Finalizar o vencer la sesión retira la prioridad temporal y restaura la bienvenida, publicación, horario o reposo anterior. No se sobrescribe la programación.
- PowerPoint y Keynote no se anuncian ni simulan como compatibles.

## Paquete Supabase pendiente de autorización

### SQL `update66.sql`

Dependencias: migraciones 60 (medios privados) y 65 (experiencias/sesiones).

Cambios de esquema:

- amplía `signage_experiences.kind` de `welcome` a `welcome | presentation`;
- añade a `signage_experience_sessions`:
  - `current_slide integer not null default 0`, rango 0–49;
  - `control_revision bigint not null default 0`;
- crea `signage_presentation_save(...)`;
- crea `signage_experience_step(...)`;
- reemplaza `signage_device_manifest_service(...)` para devolver solo la diapositiva activa.

Seguridad:

- no crea tablas, bucket, políticas RLS, secretos ni credenciales;
- no concede escrituras directas sobre tablas;
- las nuevas RPC son `SECURITY DEFINER SET search_path=''`, vuelven a comprobar `read + write` o `read + publish`, cuenta, activos, estado, límites y revisión;
- `PUBLIC` y `anon` no pueden ejecutarlas; `authenticated` recibe solo `EXECUTE`;
- cada diapositiva debe pertenecer a la misma cuenta, estar `ready` y ser `image/png` en el bucket privado existente;
- el manifiesto de servicio sigue limitado a `service_role`; nunca llega al cliente administrador.

Impacto en datos existentes: se añaden valores predeterminados a sesiones existentes. No se cambia contenido, programación, sesiones activas, dispositivos ni archivos. Instalar no inicia una presentación.

Rollback seguro: restaurar el bundle Edge anterior y el frontend anterior. Las dos columnas pueden permanecer inertes. No borrar columnas, funciones, activos ni sesiones sin una autorización separada.

### Edge Function `signage-api`

Archivos:

- `supabase/functions/signage-api/index.ts`
- `supabase/functions/_shared/signage-api-core.mjs`
- `supabase/functions/_shared/signage-manifest.mjs`

Rutas nuevas:

- `POST /admin/presentations` — permiso `write`;
- `GET /admin/experiences/:id` — permiso `read`, firma vistas previas por 5 minutos;
- `POST /admin/experience-sessions/:id/step` — permiso `publish`, CAS por `controlRevision`.

Rutas existentes reutilizadas: firma/carga/finalización de PNG, inicio/final de experiencia, manifiesto, heartbeat. No cambia CORS, secretos, `verify_jwt=false`, ICE/TURN ni media verifier.

## Verificación local

- PDF.js real abre un PDF sintético; el procesador cubre corrupto, extensión engañosa, contraseña, acciones activas, exceso de páginas y cancelación.
- PGlite aplica 59/60/62/63/64/65/66 y prueba permisos, cuenta, activo PNG, CAS, límites, manifiesto, finalización y retorno.
- El mismo handler Edge usado por la función valida rutas, permisos y errores.
- Chromium E2E usa dos contextos administrativos y un reproductor sintético: procesa dos páginas, sube solo dos PNG, avanza, reconecta, reproduce desde caché sin red y finaliza.
- Capturas locales revisadas: escritorio 1440×900, tablet 1024×900, móvil 390×844 y `prefers-reduced-motion: reduce`.

## Límites pendientes

- No hubo instalación SQL, despliegue Edge, push, merge ni prueba con Supabase real.
- No hubo prueba física en iPad/TV ni con documentos privados.
- El navegador puede quedarse sin memoria antes de los límites teóricos en hardware antiguo; el presupuesto de píxeles falla de forma segura y conserva el original local.
- PDFs con fuentes o gráficos poco comunes requieren una matriz de compatibilidad física posterior.
- La caché conserva la última imagen válida, no convierte este flujo en reproducción offline universal.
