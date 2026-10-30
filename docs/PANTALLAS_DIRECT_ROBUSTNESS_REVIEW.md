# Pantallas — robustez del piloto directo

Estado: **corte local revisable; no publicado**.  
Base desplegada preservada: `81798adb6862922269ac8fc6945f8f375c6963a5`.  
Resultado físico disponible: Alejandro reportó que compartir Mac→iPad funcionó “rebien”. Es evidencia del recorrido probado por el usuario, no una medición independiente de RTP ni garantía para otras redes.

## Qué cambia

- conserva una sola captura y un solo destino;
- ante un corte breve espera antes de intervenir y realiza como máximo dos reinicios ICE dentro de la misma sesión;
- nunca vuelve a llamar `getDisplayMedia` durante recuperación;
- cada oferta/respuesta/candidato lleva una generación; señales viejas o duplicadas no pueden sustituir el estado actual;
- una recarga del receptor se identifica y solicita una oferta nueva sin iniciar otra captura;
- candidatos recibidos antes de la oferta se ponen en espera hasta tener descripción remota;
- una respuesta cuya confirmación de red se perdió se reenvía desde el mismo contenido preparado;
- conexión recuperada no equivale a video: exige `bytesSent` y `framesEncoded` crecientes en el emisor **y** un acuse de la misma generación con `bytesReceived` y `framesDecoded` del receptor antes de volver a mostrar “Video confirmado”;
- una interrupción del polling se muestra sin terminar prematuramente un video que puede seguir fluyendo;
- al agotar la recuperación, detiene pistas y sesión; no queda un cargador infinito;
- detener desde SIERRA, el indicador nativo o al cerrar la página conserva el flujo existente de regreso al contenido previo.

No se reinicia una transmisión detenida, no se solicita captura sin gesto y no se cambia `liveEnabled:false`.

## Compatibilidad y dependencias

No requiere SQL, tablas, RLS, grants, secretos, buckets, servicios ni credenciales nuevos. Sí requiere redesplegar la función Edge existente para admitir una cuarta señal autenticada, `media`, además de `offer`, `answer` y `candidate`. `media` solo acepta generación, identificador efímero del receptor y contadores enteros positivos de bytes/cuadros; conserva la autorización actual por sesión, workspace y dispositivo. Todos los payloads permanecen bajo el límite actual de 64 KiB.

Archivos del corte:

- `js/signage-live-share.js` — generaciones, recuperación acotada, reenvío y verificación de medios;
- `js/signage-phase1.js` — estados operativos breves y acción de detener siempre disponible;
- `js/signage-player.js` — estados del receptor sin controles muertos;
- `supabase/functions/_shared/signage-api-core.mjs` y `supabase/functions/signage-api/index.ts` — validación y transporte del acuse `media`, sin permisos nuevos;
- `tests/signage/phase9-live.mjs` — interrupción, reinicio ICE, duplicados, orden invertido y respuesta perdida;
- `tests/signage/phase4-browser.cjs` — texto del piloto actualizado.

## Riesgos residuales

- Una ruta P2P puede seguir fallando en otra red aunque funcionara en la combinación probada.
- Dos recuperaciones son un límite de seguridad, no continuidad garantizada.
- El refresh del receptor se simula localmente; falta validarlo físicamente en iPad.
- Las métricas prueban movimiento de bytes/cuadros, no que la televisión esté en la entrada correcta.
- Sigue siendo un solo destino; no prueba fanout, veinte pantallas ni videowall.

## Aceptación local

- [x] Recuperación usa el stream existente y no pide permiso otra vez.
- [x] Máximo de intentos definido; sin bucle infinito.
- [x] Respuesta perdida se reintenta; señales duplicadas, antiguas o reordenadas no duplican la sesión.
- [x] Receptor recargado obtiene la generación vigente.
- [x] Video se vuelve a confirmar solo con contadores RTP crecientes del emisor y cuadros decodificados del receptor en la misma generación.
- [x] Cancelación y detención liberan tracks y no resucitan la sesión.
- [x] Error de señalización se distingue de pérdida real de video.
- [ ] Recuperación física Mac→iPad tras apagar/encender Wi‑Fi brevemente.
- [ ] Refresh/bloqueo físico del iPad durante una sesión.
- [ ] Detención desde SIERRA y desde el indicador nativo con regreso visual al contenido previo.
- [ ] Sesión sostenida de 15–30 minutos sin congelación.

Evidencia ejecutada sobre este corte:

- `npm test`: 497 aserciones de Pantallas pasaron; 39 cubren la máquina de estados WebRTC y 97 el contrato Edge.
- `npm run test:browser`: pasó vinculación, carga, reproducción cruzada y recuperación durable. El executor intercambió oferta/respuesta pero no expuso candidatos ICE, por lo que RTP quedó `SKIP` localmente.
- La evidencia física complementaria es exclusivamente el reporte de Alejandro sobre el piloto publicado; recuperación y refresh aún no se han probado en su iPad.

## Lista física mínima

1. Iniciar desde el enlace piloto y confirmar imagen en movimiento.
2. Interrumpir Wi‑Fi del iPad durante 2–3 segundos y restaurarlo. Debe indicar recuperación y volver a confirmar imagen sin selector de captura nuevo.
3. Recargar el reproductor una vez. Debe retomar la sesión o fallar con mensaje terminal, nunca permanecer cargando indefinidamente.
4. Detener desde **Dejar de compartir** y comprobar el regreso del contenido anterior.
5. Repetir y detener desde el indicador nativo de macOS; debe producir el mismo regreso.
6. Mantener 15–30 minutos y registrar solo resultado, no direcciones ICE ni imágenes capturadas.

La promoción fuera del enlace experimental requiere que estas pruebas físicas pasen en la combinación real y que Alejandro apruebe un paquete de publicación separado.
