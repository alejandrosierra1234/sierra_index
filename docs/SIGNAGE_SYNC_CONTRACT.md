# SIERRA Index — contrato de sincronización de señalización, fase 2

## Estado y límite

Este documento define el límite entre API y reproductor. `update59.sql` es una migración **preparada para revisión, no aplicada**. Las pruebas usan PostgreSQL embebido y datos sintéticos. No existe todavía servicio HTTP, Supabase real, token secreto, almacenamiento de multimedia, descarga offline ni TV conectada.

`signage_device_manifest_service(device_id, credential_id)` es la frontera interna que un servicio real podría invocar **después** de autenticar un token de alta entropía. El `credential_id` del arnés local no es un secreto ni un mecanismo de autenticación productivo. La función está revocada para `anon` y `authenticated` y reservada a `service_role`.

## Respuesta de manifiesto v1

- `schema_version`: `1`.
- `device_id` y `device_revision`: identidad y control monotónico de cambio.
- `state`: `no-content` o `ready`.
- Cuando está listo: `publication_id`, `publication_version`, `content_id`, `content_revision`, `published_at` y `snapshot` inmutable.
- `schedules`: hasta 100 ventanas no vencidas con prioridad, inicio, fin, revisión fijada de lista y entradas ordenadas. La elección activa usa prioridad descendente, inicio más reciente y luego ID ascendente.
- La publicación guarda una copia del contenido; editar después no altera lo ya publicado.
- El servidor exige estado `approved`; guardar una revisión nueva devuelve la pieza a `draft`. `approve` y `publish` son capacidades independientes.
- Rollback crea una publicación nueva con versión mayor y `rollback_of`; nunca reescribe historial.
- Una credencial o dispositivo revocado recibe denegación, no el último manifiesto.

## Secuencia futura propuesta

1. El reproductor presenta un token por TLS al servicio de dispositivos.
2. El servicio compara un hash resistente y con tiempo constante, comprueba caducidad/revocación y resuelve `credential_id`.
3. El servicio llama al límite interno y devuelve el manifiesto con `ETag` derivado de `device_revision`.
4. El reproductor valida esquema, límites y hashes de activos antes de activar una descarga completa.
5. El reproductor conserva el último manifiesto válido hasta recibir y validar atómicamente uno más nuevo.

La fase 3 local admite mensajes y referencias HTTPS a JPG/JPEG, PNG, WebP, GIF, MP4 y WebM. Esas URLs no se descargan ni cachean: dependen del origen y del codec del navegador. Un servicio real deberá migrar los activos a almacenamiento privado, usar URLs de duración corta, declarar tipo/tamaño/hash, aplicar protección SSRF y activar la caché solo tras verificación completa.

## Errores contractuales

| Condición | Resultado esperado |
|---|---|
| Credencial desconocida, revocada o de otro dispositivo | `42501`; no revelar cuál validación falló. |
| Dispositivo revocado | `42501`. |
| Sin publicación | Manifiesto v1 con `state=no-content`. |
| Revisión concurrente de contenido o dispositivo | `40001`; el panel debe recargar antes de reintentar. |
| Contenido o dispositivo de otro workspace | `42501`. |

## Servicio real pendiente

Antes de conectar infraestructura faltan: endpoint autenticado, emisión/rotación de tokens, hash de credenciales, rate limiting, registro seguro, almacenamiento privado, firma o integridad de manifiestos, telemetría mínima, expiración, pruebas contra Supabase no productivo y revisión de operación. Ninguna de esas capacidades se simula como existente.
