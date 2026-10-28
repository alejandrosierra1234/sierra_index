# SIERRA Index — Pantallas, fase 4 local

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

El backend de esta fase vive solo en memoria y escucha únicamente en `127.0.0.1`. No es un servicio cloud ni conserva datos al reiniciar.

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

## Infraestructura real pendiente de autorización

No existe un proyecto Supabase de prueba enlazado en `supabase/config.toml`. El frontend conoce un proyecto existente, pero esta fase no lo usa ni lo modifica.

Antes de operar en cloud se requiere autorización explícita para un proyecto no productivo concreto y estos cambios:

1. Aplicar `update59.sql`, después de revisión y respaldo.
2. Revisar y aplicar `update60.sql`, que prepara el bucket privado `signage-media`, activos, sesiones de vinculación, digest/vencimiento de credenciales y señalización WebRTC. No reutiliza `product-images`.
3. Configurar la limpieza programada de sesiones y señales vencidas.
4. Desplegar y probar la emisión y revocación de credenciales preparada en Edge; la rotación periódica sigue pendiente.
5. Desplegar las funciones HTTP preparadas para vinculación, manifiesto, heartbeat, URLs firmadas y revocación. El `service_role` permanece solo en servidor.
6. Conectar un verificador aprobado para hash, tipo, antivirus/cuarentena, retención y eliminación de medios.
7. Desplegar la señalización WebRTC preparada y conectarla a credenciales ICE efímeras.
8. Elegir/provisionar TURN y definir límite de gasto y egreso.
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

Configuración requerida al desplegar en un proyecto no productivo autorizado:

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
- Contrato Edge: 45 aserciones de autenticación separada, aislamiento, vinculación, administración, manifiesto, carga firmada, validación y denegaciones seguras.
- E2E Chromium entre dos páginas: aprobado para vincular, cargar PNG, publicar, reproducir sin login y recuperar manifiesto/imagen con API y ruta de medios bloqueadas. La oferta/respuesta WebRTC pasó; el entorno no expuso candidatos ICE, por lo que el video RTP quedó explícitamente no verificado.

## Ejecución local reproducible

```bash
SIGNAGE_LOCAL_PORT=8877 node tests/signage/local-backend.cjs
```

- Reproductor: `http://127.0.0.1:8877/signage-player.html`
- Panel de integración local: `http://127.0.0.1:8877/tests/signage/phase1-visual.html?reset=1&backend=1`

El token administrativo usado por ese arnés es fijo, sintético y limitado al proceso local. No representa una credencial válida para Supabase ni debe reutilizarse fuera de pruebas.
