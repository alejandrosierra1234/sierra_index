# SIERRA Index — Señalización digital, fase 2

## Corte entregado

Esta fase preparó el backend revisable en PostgreSQL local para el corte de fase 1. La migración aún no aplicada se mantiene alineada con fase 3: dominio `signage`, capacidades separadas, aislamiento por workspace, modelo multisitio, contenido y listas versionados, horarios, publicaciones inmutables, aprobación, rollback, revocación, auditoría y manifiesto interno.

`update59.sql` **no fue aplicado a Supabase**. El arnés de `tests/signage/phase2-sql.mjs` crea un PostgreSQL embebido efímero, ejecuta la migración y usa únicamente identidades y registros sintéticos.

## Arquitectura del corte

| Límite | Entrega actual | Servicio real pendiente |
|---|---|---|
| Panel | Fase 1 local, limitado temporalmente a `platform.admin`. | Adaptador Supabase y UI por capacidades `signage`. |
| API | RPC SQL revisables para snapshot, guardar, aprobar, publicar, rollback, revocar y asignar permisos. | Exposición en proyecto no productivo, observabilidad, rate limits y pruebas E2E. |
| Persistencia | PostgreSQL embebido solo durante pruebas. | Supabase no productivo autorizado y después producción con puerta separada. |
| Reproductor | Contrato de manifiesto v1, probado llamando la frontera interna. | Endpoint TLS, token secreto con hash/rotación, caché/offline y reproductor real. |

El `credential_id` del arnés es un adaptador de prueba: no es secreto. La función de manifiesto está revocada para `anon` y `authenticated`; un servicio futuro deberá autenticar un token y llamar como rol de servicio. No hay sincronización remota fingida.

## Permisos y separación

- `read`: ver un workspace asignado y su snapshot.
- `write`: crear o revisar contenido; requiere también `read`.
- `approve`: aprobar una revisión exacta; requiere también `read`.
- `publish`: publicar o hacer rollback; requiere también `read` y una pieza aprobada.
- `operate`: reservado para operación futura; no concede publicación.
- `manage_devices`: revocar dispositivo y credenciales; requiere también `read`.
- `platform.admin`: asigna/revoca paquetes por workspace mediante `set_signage_access`; el cambio queda sujeto al trigger de auditoría de grants existente.

Guardar una nueva revisión devuelve la pieza a `draft`. Publicar exige `approved`. Aprobar y publicar son capacidades distintas verificadas en servidor. Revocar un dispositivo invalida sus credenciales activas en la misma transacción.

## Archivos

- `update59.sql`: migración preparada, tablas, constraints, RLS y RPC.
- `docs/SIGNAGE_SYNC_CONTRACT.md`: contrato reproductor/API y límites.
- `tests/signage/phase2-bootstrap.sql`: precondiciones mínimas sintéticas equivalentes a Authorization V2.
- `tests/signage/phase2-sql.mjs`: pruebas locales de migración y seguridad.
- `tests/signage/package.json` y `package-lock.json`: dependencia fijada de PGlite solo para pruebas.
- `.github/workflows/deploy.yml`: ejecuta ambas fases de señalización antes de un despliegue futuro.

## Registro de ejecución

- Fecha: 2026-10-28.
- Revisión base: `e554e06a025050dd9288b3b450dab14c358344c4`.
- Rama local: `work`; no se creó commit, push, merge ni despliegue.
- Cambios preexistentes al inicio: únicamente el corte local de fase 1; se conservaron.
- Instalación local: `npm install --ignore-scripts --no-audit --no-fund --cache /tmp/sierra-npm-cache` en `tests/signage`; no se añadió dependencia al producto.

## Criterios de aceptación

| Criterio | Estado | Evidencia/límite |
|---|---|---|
| La migración ejecuta completa en PostgreSQL local. | Pasó | PGlite ejecuta bootstrap y `update59.sql` desde cero. |
| Denegación por rol ocurre en servidor. | Pasó | Editor no publica; publisher no aprueba/revoca; operador no publica; no admin no asigna grants. |
| Aislamiento multitenant por workspace. | Pasó | RPC deniega workspace ajeno y una concesión temporal local de `SELECT` confirma filtrado RLS. La concesión existe solo en el arnés y se revoca. |
| Permiso por workspace puede asignarse y revocarse atómicamente. | Pasó | `set_signage_access`, incluida asignación vacía como revocación. |
| Guardar crea revisiones inmutables con control optimista. | Pasó | Revisión obsoleta produce `40001`; la nueva revisión no cambia publicaciones previas. |
| Aprobación separada de publicación. | Pasó | Borrador no publica; solo `approve` aprueba; editar reinicia a `draft`. |
| Publicación y rollback conservan historial monotónico. | Pasó | Versiones 1, 2 y rollback 3; `rollback_of` y snapshots conservados. |
| Revocación bloquea publicación y sincronización. | Pasó | Dispositivo y credencial se revocan; manifiesto devuelve `42501`. |
| Clientes autenticados no invocan el límite de servicio. | Pasó | EXECUTE revocado; solo `service_role`. |
| Supabase real, E2E HTTP y credenciales productivas. | No verificado | Deliberadamente fuera de alcance. |
| Multimedia, horarios, grupos, offline y TV física. | No implementado | Requieren cortes posteriores e inventario. |

### Comandos y resultados finales

| Comprobación | Resultado |
|---|---|
| `npm ci && npm test` en `tests/signage` | Pasó: fase 1 con 24 aserciones; fase 2 SQL con 45; fase 3 con 29. |
| `node tests/security/access.cjs` | Pasó. |
| `node tests/security/profile.cjs` | Pasó. |
| `node tests/communications/management.cjs` | Pasó: 45 comprobaciones. |
| `node tests/samples/ui.cjs` | Pasó. |
| `git diff --check` | Pasó. |

## Riesgos y decisiones abiertas

- La migración requiere revisión humana y respaldo antes de cualquier entorno; todavía no se ha comprobado contra la versión/configuración exacta de Supabase.
- La UI de fase 1 sigue usando `localStorage` y `platform.admin`; conectarla ahora implicaría fingir un backend que no existe. El próximo adaptador debe usar `get_my_access` y las RPC, sin fallback de rol.
- Falta decidir si la aprobación exige dos personas distintas. El modelo separa capacidades, pero un administrador con ambas puede aprobar y publicar.
- `operate` está reservado pero no tiene RPC mutante en este corte.
- El manifiesto incluye referencias multimedia y horarios, pero aún no resuelve hash/firma, expiración, descarga atómica ni offline.
- No se conoce el inventario de TVs/reproductores; no se afirma compatibilidad.

## Preparación para revisión y visualización

La rama destino observada es `claude/basic-website-html-qexj5j`. `.github/workflows/deploy.yml` se activa con `push` a esa rama, ejecuta pruebas y despliega GitHub Pages si pasan. Por ello, un merge/push autorizado puede publicar automáticamente; debe revisarse esa consecuencia antes de ejecutarlo.

Conjunto listo para revisión: fase 1 (`index.html`, `css/signage-phase1.css`, `js/signage-phase1.js`, pruebas, documentación y capturas) más fase 2 (`update59.sql`, contratos, arnés SQL y lockfile). Para que Alejandro lo vea tras autorización: revisar diff, crear commit en rama de trabajo, abrir/autorizar integración a la rama destino, confirmar que el workflow pasó y usar la URL que el propio job de Pages entregue. No existe todavía una URL nueva publicada.

## Próxima fase local posible

Sin ampliar permisos puede construirse un adaptador de panel contra una interfaz inyectable y un servidor HTTP local sintético que reproduzca los contratos RPC, además de programación básica versionada. Conectar Supabase real exige autorización previa del proyecto no productivo exacto, rol/credencial, migración concreta, responsable, respaldo y rollback. El reproductor físico, producción, merge y despliegue siguen requiriendo puertas separadas.
