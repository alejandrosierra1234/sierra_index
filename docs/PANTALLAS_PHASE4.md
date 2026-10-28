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

El backend de esta fase vive solo en memoria y escucha únicamente en `127.0.0.1`. No es un servicio cloud ni conserva datos al reiniciar.

## Compartir pantalla en vivo

`js/signage-live-share.js` implementa el emisor y receptor WebRTC. La captura se solicita exclusivamente después de pulsar **Compartir mi pantalla**, mediante el selector nativo del navegador. SIERRA no elige silenciosamente una pantalla, ventana o pestaña.

- El administrador ve un aviso persistente mientras comparte y una acción **Dejar de compartir**.
- Si el usuario detiene la captura desde el navegador, se cierra la sesión.
- El reproductor identifica el contenido como **Pantalla compartida en vivo**.
- Al terminar, vuelve al contenido publicado o programado.
- Audio está desactivado en este corte.
- La señalización oferta/respuesta WebRTC está probada localmente. No se ha validado video entre redes NAT ni televisiones físicas.

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
3. Implementar la limpieza programada de sesiones y señales vencidas.
4. Completar rotación y emisión de credenciales desde funciones de servidor.
5. Implementar funciones HTTP para iniciar/reclamar vinculación, manifest, heartbeat, URLs firmadas y revocación. El `service_role` permanece solo en servidor.
6. Aplicar límites, antivirus o cuarentena, retención y eliminación de medios.
7. Implementar señalización WebRTC con TTL y rate limit.
8. Elegir/provisionar TURN y definir límite de gasto y egreso.
9. Configurar alertas, respaldo y recuperación.

No se deben enviar claves por chat ni incluirlas en el repositorio.

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
- Integración fase 4: 23 aserciones para vinculación, secreto, carga, enlace, publicación cruzada, lista/horario, señalización WebRTC y revocación.
- Migración `update60.sql`: 10 aserciones locales de bucket privado, rutas, digests, sesión única y señales permitidas.
- E2E Chromium entre dos páginas: aprobado para vincular, cargar PNG, publicar y reproducir sin login administrativo.

## Ejecución local reproducible

```bash
SIGNAGE_LOCAL_PORT=8877 node tests/signage/local-backend.cjs
```

- Reproductor: `http://127.0.0.1:8877/signage-player.html`
- Panel de integración local: `http://127.0.0.1:8877/tests/signage/phase1-visual.html?reset=1&backend=1`

El token administrativo usado por ese arnés es fijo, sintético y limitado al proceso local. No representa una credencial válida para Supabase ni debe reutilizarse fuera de pruebas.
