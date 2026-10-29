# SIERRA Index — Pantallas, integración local del contrato Edge

## Resultado comprobado

El módulo se muestra como **Pantallas**. El identificador interno `signage` y la clave de almacenamiento anterior se conservan para no romper rutas, permisos ni datos ya creados.

El corte local permite probar el recorrido completo con dos navegadores independientes:

1. El reproductor sin login abre `signage-player.html` y genera un código de seis dígitos, válido una vez durante cinco minutos.
2. El administrador abre Pantallas, pulsa **Agregar pantalla** y reclama el código.
3. El secreto de dispositivo se entrega únicamente al reproductor. El backend local conserva solo su hash.
4. El administrador agrega un mensaje, enlace HTTPS, imagen o video. Los archivos se validan por MIME declarado y firma binaria.
5. Al elegir qué mostrar, el reproductor recibe la nueva revisión en su siguiente sincronización.
6. Listas y horarios pueden sustituir la publicación manual de forma determinista.
7. Revocar la pantalla invalida el secreto y el reproductor deja de sincronizar.
8. El reproductor conserva el último manifiesto y una copia de los medios recibidos en Cache Storage; una revocación borra ambos.

El arnés de prueba usa exactamente el mismo núcleo HTTP y normalizador de manifiestos
que la función Edge desplegable. La persistencia del adaptador de prueba vive solo en
memoria y escucha únicamente en `127.0.0.1`: no es un servicio cloud ni conserva
datos al reiniciar.

## Compartir pantalla en vivo

`js/signage-live-share.js` implementa el emisor y receptor WebRTC. La captura se solicita exclusivamente después de pulsar **Compartir mi pantalla**, mediante el selector nativo del navegador. SIERRA no elige silenciosamente una pantalla, ventana o pestaña.

- El administrador ve un aviso persistente mientras comparte y una acción **Dejar de compartir**.
- Si el usuario detiene la captura desde el navegador, se cierra la sesión.
- El reproductor identifica el contenido como **Pantalla compartida en vivo**.
- Al terminar, vuelve al contenido publicado o programado.
- Audio está desactivado en este corte.
- La señalización oferta/respuesta WebRTC está probada localmente. No se ha validado video entre redes NAT ni televisiones físicas.
- El diagnóstico aislado con un `RTCPeerConnection` y canal de datos, sin código de
  Pantallas, también terminó la recolección ICE sin candidatos en Chromium 154 del
  ejecutor. Esto identifica una limitación de red/navegador del entorno de prueba,
  no demuestra compatibilidad RTP. El código conserva candidatos tardíos para TURN.

Para operación por internet se debe configurar ICE/TURN. Sin TURN no se puede garantizar conexión entre redes corporativas. El costo variable se debe estimar como:

`GB retransmitidos por TURN × tarifa de egreso + horas/mes del servicio + observabilidad`

## Archivos y enlaces

- Imágenes: PNG, JPEG, WebP y GIF; máximo local 10 MB.
- Videos: MP4 y WebM; máximo local 50 MB.
- El backend compara MIME y firma binaria y rechaza discrepancias.
- Los archivos se sirven con `X-Content-Type-Options: nosniff`.
- Los enlaces deben ser HTTPS y no pueden incluir credenciales.
- Un enlace se muestra como tarjeta segura. No se inserta automáticamente en `iframe`, porque `X-Frame-Options`, CSP, cookies y autoplay dependen del sitio externo.

## Decisión de alojamiento

SIERRA Index se mantiene en GitHub Pages y el backend de Pantallas se prepara para
Supabase Edge. No se desarrollará ni configurará una migración a Vercel.

## Piloto mínimo: mensajes entre dos clientes

El piloto mínimo no necesita verificador multimedia ni TURN: permite vincular un
reproductor desde otro navegador, publicar únicamente mensajes de texto y comprobar
su recepción. No habilita archivos, compartir pantalla ni prueba una televisión
física.

Target identificado por configuración pública del repositorio:
`vhyddogeemohtqijohry` (`https://vhyddogeemohtqijohry.supabase.co`). Esta referencia
no constituye autorización para modificar el proyecto.

Acciones propuestas, todavía no ejecutadas:

1. Ejecutar `supabase/signage-preflight.sql` en modo de solo lectura y revisar
   colisiones, RLS, grants, bucket y migraciones existentes.
2. Confirmar respaldo y ventana de cambio del proyecto activo.
3. Aplicar, en orden, las versiones revisadas de `update59.sql`, `update60.sql` y
   `update62.sql`. Los permisos de Pantallas viven en
   `public.signage_access_grants`; no se reemplazan constraints compartidos ni
   `set_index_access`.
4. Crear un workspace y una sede de piloto con identificadores aprobados, sin datos
   personales ni fixtures de producción.
5. Desplegar `supabase/functions/signage-api` y configurar únicamente los orígenes
   exactos de GitHub Pages y un `SIGNAGE_PAIRING_PEPPER` generado en el gestor de
   secretos del proyecto. Las claves automáticas de Supabase permanecen en servidor.
6. Publicar en `js/signage-config.js` solo la URL pública de la función y los UUID de
   workspace/sede del piloto; nunca claves o secretos.
7. Probar vinculación, publicación, recepción, revocación y aislamiento con dos
   cuentas/clientes autorizados antes de habilitar archivos o vivo.

Si el piloto debe detenerse, `supabase/signage-safe-disable.sql` revoca la ejecución
administrativa, invalida credenciales de dispositivos y detiene sesiones en vivo sin
borrar tablas, auditoría, publicaciones ni archivos. El rollback de esquema debe
prepararse después del preflight para no eliminar objetos o datos preexistentes.

## Infraestructura real pendiente de autorización

No existe un proyecto Supabase de prueba enlazado en `supabase/config.toml`. El frontend conoce un proyecto existente, pero esta fase no lo usa ni lo modifica.

Solo existe el proyecto activo de Index. Operar en cloud requiere aprobación
específica del target, scripts y ventana de cambio. El piloto de mensajes puede
prescindir de servicios externos; las capacidades completas requieren además:

1. Aplicar `update59.sql`, después de revisión y respaldo.
2. Revisar y aplicar `update60.sql`, que prepara el bucket privado `signage-media`, activos, sesiones de vinculación, digest/vencimiento de credenciales y señalización WebRTC. No reutiliza `product-images`.
3. Configurar la limpieza programada de sesiones y señales vencidas.
4. Desplegar y probar la emisión y revocación de credenciales preparada en Edge; la rotación periódica sigue pendiente.
5. Desplegar las funciones HTTP preparadas para vinculación, manifiesto, heartbeat, URLs firmadas y revocación. El `service_role` permanece solo en servidor.
6. Para archivos, conectar un verificador aprobado para hash, tipo,
   antivirus/cuarentena, retención y eliminación de medios.
7. Para compartir pantalla entre redes, desplegar la señalización WebRTC preparada y
   conectarla a credenciales ICE efímeras.
8. Para conectividad robusta entre redes NAT/corporativas, elegir/provisionar TURN y
   definir límite de gasto y egreso.
9. Configurar alertas, respaldo y recuperación.

No se deben enviar claves por chat ni incluirlas en el repositorio.

## Adaptador Edge preparado localmente

`supabase/functions/signage-api/index.ts` es un adaptador desplegable, pero **no está
desplegado ni conectado a un proyecto**. Su núcleo comprobable vive en
`supabase/functions/_shared/signage-api-core.mjs`. Implementa:

- JWT de administrador separado del token opaco por reproductor;
- aislamiento obligatorio por `X-Signage-Workspace` y capacidad en servidor;
- vinculación de un solo uso, entrega única del secreto y revocación;
- manifiesto reservado a `service_role`, heartbeat y límites de frecuencia durables;
- contenido, listas, horarios, aprobación, publicación y rollback mediante RPC con
  la identidad del usuario, sin reducir autorización a botones ocultos;
- preparación de cargas firmadas al bucket privado `signage-media`;
- denegación segura mientras no exista verificador de tipo, hash y malware;
- sesiones y señales WebRTC limitadas al workspace y dispositivo;
- denegación segura de transmisión en vivo mientras no exista proveedor ICE/TURN.

`update62.sql` agrega las operaciones atómicas, heartbeat y rate limiting requeridos.
Está preparado para revisión y no se ha aplicado.

Configuración requerida al desplegar en el proyecto autorizado:

- automáticas de Supabase: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`;
- `SIGNAGE_CORS_ORIGINS`: orígenes exactos permitidos, separados por coma;
- `SIGNAGE_PAIRING_PEPPER`: secreto exclusivo de servidor para proteger los códigos
  cortos de vinculación frente a lectura o fuerza bruta de la base;
- `SIGNAGE_MEDIA_VERIFIER_URL` y `SIGNAGE_MEDIA_VERIFIER_TOKEN`: servicio aprobado de
  verificación. Sin ambos, completar una carga responde `MEDIA_VERIFIER_NOT_CONFIGURED`;
- `SIGNAGE_ICE_CONFIG_URL` y `SIGNAGE_ICE_CONFIG_TOKEN`: proveedor que emita
  credenciales ICE efímeras. Sin ambos, iniciar vivo responde `LIVE_NOT_CONFIGURED`.

No se deben colocar credenciales TURN estáticas en el frontend. El costo y proveedor
de verificación/TURN siguen siendo decisiones comerciales pendientes.

## Pruebas

```bash
cd tests/signage
npm ci
npm test
```

Resultados del corte:

- Fase 1: aprobada.
- SQL/RLS de fase 2: 47 aserciones.
- Multimedia/programación de fase 3: 44 aserciones.
- Integración fase 4: 25 aserciones para vinculación, secreto, carga, enlace, publicación cruzada, lista/horario, señalización WebRTC, revocación y caché durable.
- Migraciones `update60.sql` y `update62.sql`: 17 aserciones locales de bucket privado, rutas, digests, medios privados, sesión única, heartbeat y rate limiting.
- Contrato Edge estático: 49 aserciones de autenticación separada, aislamiento,
  vinculación, administración, manifiesto, carga firmada, validación y denegaciones
  seguras.
- Handler Edge real con adaptador sintético: 20 aserciones para configuración
  pública, vinculación, rechazo de borrador, aprobación/publicación, manifiesto
  normalizado, imágenes/videos firmados, enlaces, horarios, heartbeat, denegación
  segura de servicios ausentes y revocación transaccional.
- Total estándar: 226 aserciones aprobadas en siete suites.
- E2E Chromium entre dos páginas: aprobado para vincular, cargar PNG, publicar,
  reproducir sin login, aplicar un horario y recuperar manifiesto/imagen con API y
  ruta de medios bloqueadas. También comprobó el heartbeat periódico y el uso de la
  configuración ICE del runtime. La oferta/respuesta WebRTC pasó; el entorno no
  expuso candidatos ICE, por lo que el video RTP quedó explícitamente no verificado.

## Ejecución local reproducible

```bash
SIGNAGE_LOCAL_PORT=8877 node tests/signage/edge-harness.mjs
```

- Reproductor: `http://127.0.0.1:8877/signage-player.html`
- Panel de integración local: `http://127.0.0.1:8877/tests/signage/phase1-visual.html?reset=1&backend=1`

El token administrativo usado por ese arnés es fijo, sintético y limitado al proceso
local. No representa una credencial válida para Supabase ni debe reutilizarse fuera
de pruebas. El adaptador de datos es sintético, pero las rutas HTTP, el núcleo del
handler y la normalización del manifiesto son los mismos que usa la función Edge.

## Estado de aceptación

El porcentaje representa criterios funcionales aprobados, no tiempo ni operación en
producción:

1. Flujo comprensible agregar → elegir → mostrar: aprobado localmente.
2. Vinculación segura y revocación: aprobado con el handler Edge real bajo arnés.
3. Administración entre dos clientes: aprobada localmente.
4. Imágenes y videos: contrato y validación aprobados localmente; falta verificador
   desplegado.
5. Listas y programación: aprobadas localmente.
6. Enlaces HTTPS con fallback: aprobados localmente.
7. Compartir pantalla: parcial; oferta/respuesta aprobada, video RTP no verificado y
   TURN no desplegado.
8. Recuperación con último contenido válido: aprobada en Chromium.
9. Permisos y seguridad backend: parcial; SQL, handler y denegaciones pasan localmente,
   pero no se han validado RLS ni funciones en el Supabase activo.
10. Televisión física: no ejecutado.

Resultado: 7 de 10 criterios aprobados localmente (70%). Backend live: no habilitado.
Operación física: 0 de 3 comprobaciones (vinculación cloud, reproducción en TV y vivo
entre redes).
