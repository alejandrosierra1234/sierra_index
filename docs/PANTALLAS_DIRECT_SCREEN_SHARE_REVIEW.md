# Pantallas — revisión del corte local «Compartir computadora»

Estado: **implementado y probado localmente; deshabilitado en producción**. La experiencia normal conserva `liveEnabled: false`; el paquete añade una entrada de piloto separada que exige `?pantallasLivePilot=direct`.
Base: `6a13e42951de24caacf3268646f5f37821b66749`.  
Fecha de revisión: 2026-10-30.

## Resultado acotado

Este corte integra una sesión WebRTC directa entre un navegador administrador y **una** pantalla vinculada. Reutiliza la señalización y las tablas de sesiones existentes en Supabase; no agrega SQL, credenciales, proveedores ni permisos. No es videowall y no replica una captura hacia varios destinos.

La interfaz solo declara éxito después de dos comprobaciones diferentes:

1. El emisor alcanza un estado WebRTC conectado y `getStats()` reporta bytes o cuadros de video salientes.
2. El reproductor recibe una pista, el elemento de video carga datos (`readyState >= 2`) y WebRTC reporta bytes recibidos y cuadros decodificados.

Una oferta/respuesta SDP por sí sola ya no se presenta como transmisión exitosa.

## Recorrido integrado

1. En **Espacios**, una pantalla vinculada ofrece `Compartir computadora` cuando la función está habilitada.
2. El panel lateral identifica el único destino y explica que es una sesión directa, no un videowall.
3. `Elegir ventana o pantalla` abre el selector nativo del navegador. SIERRA no simula, reemplaza ni evita ese consentimiento.
4. Cancelar el selector no crea una sesión central y no captura nada.
5. Durante la conexión, la interfaz diferencia captura activa, señalización, conexión y video confirmado.
6. `Dejar de compartir`, el control nativo del navegador, una pérdida sostenida de conexión o cerrar/navegar fuera de la página detienen las pistas locales y solicitan detener la sesión central.
7. El reproductor limpia el video y vuelve al contenido anterior conservado por el manifiesto. No revoca la pantalla ni borra contenido o programación.
8. Si la captura local se detiene pero la confirmación remota falla, la interfaz lo dice y pide revisar el estado del destino; no informa un regreso confirmado.

## Compatibilidad y límites reales

- Emisor: navegador de escritorio en contexto HTTPS con `navigator.mediaDevices.getDisplayMedia`. El selector y las superficies disponibles dependen del sistema operativo y el navegador.
- Receptor: reproductor Pantallas en un navegador con WebRTC y video `playsinline`. Si el autoplay silencioso es rechazado, aparece una acción real para iniciar la reproducción; no se declara error ni éxito antes del gesto. Un iPad puede actuar como receptor; este corte no promete captura de pantalla desde iPad/iPhone.
- Modo directo: usa candidatos ICE que los dos navegadores puedan intercambiar sin relay. Puede funcionar en ciertas redes y fallar en otras por NAT, firewall o políticas corporativas.
- Un destino: una sesión, una pantalla. Varios destinos requerirían fan-out del emisor o SFU; no se habilitan en este corte.
- Videowall: es una función espacial diferente y no se implementa aquí.
- Audio: deshabilitado deliberadamente en este corte.
- No se promete sincronía perfecta, compatibilidad universal de Smart TV ni operación entre redes distintas.

## Evidencia local

- Estado del emisor: conexión, bytes de video, cancelación, parada `keepalive` y fallo de parada remota cubiertos con dobles deterministas.
- Estado del receptor: el evento `track` no basta; la prueba confirma que no se anuncia video hasta `loadeddata`.
- E2E Chromium: vinculación, contenido previo, sesión directa fallida, limpieza de todas las pistas, cierre de la sesión de señalización y regreso al contenido anterior.
- El error directo resume cantidades y tipos de rutas ICE locales/remotas, sin conservar direcciones IP, SDP, tokens ni candidatos crudos. La sesión conserva solo métricas sanitizadas de bytes, cuadros, pérdida, RTT y tipos de candidato seleccionados.
- QA visual: panel revisado en 1440×900, 1024×900, 390×844 y `prefers-reduced-motion: reduce`.
- Transporte real en este executor: **no verificado**. Chromium produjo cero candidatos ICE en todas las variantes probadas; oferta y respuesta se intercambiaron, pero no hubo RTP. Esto es una limitación del entorno de ejecución y no demuestra que TURN sea obligatorio en las redes de SIERRA.

La configuración declara `iceTransportPolicy: all`, agrega la pista antes de negociar, registra eventos antes de `setLocalDescription` y conserva únicamente estado de gathering y conteos sanitizados. Por tanto, el resultado de cero rutas en el executor está aislado de un modo `relay-only` accidental.

Vercel no es una dependencia de este corte. Aunque su plataforma admite servidores WebSocket, eso duplicaría la señalización que ya ofrece Supabase y no aporta TURN/SFU por sí mismo. Además, Vercel Hobby está limitado a uso personal no comercial, por lo que no se presupone como solución gratuita corporativa para SIERRA.

## Entrada ejecutable del piloto

Desplegar solamente Edge no permite probar el recorrido: también se necesita el frontend de este paquete. Una vez revisados y publicados ambos, el operador debe iniciar sesión normalmente y abrir explícitamente:

`https://alejandrosierra1234.github.io/sierra_index/?pantallasLivePilot=direct`

Después entra a **Pantallas → Espacios**. Solo las pantallas vinculadas muestran `Probar compartir computadora`. La navegación normal, sin ese parámetro exacto, no muestra la función. El parámetro no concede permisos: el backend sigue exigiendo el JWT del administrador, la capacidad `operate`, el workspace configurado y la credencial limitada del reproductor.

El panel identifica por nombre un único destino, marca la prueba como experimental y exige el gesto `Elegir ventana o pantalla`. No inicia captura al abrir el enlace o el panel. El consentimiento continúa siendo el selector nativo del navegador.

## Prueba física mínima antes de habilitación general

La activación debe conservar `liveEnabled: false` hasta completar esta prueba controlada:

1. Desplegar primero el Edge revisado, sin modificar SQL, secretos ni permisos.
2. Publicar el frontend con `livePilotEnabled: true` y `liveEnabled: false`.
3. En la misma red, abrir SIERRA Index en una Mac compatible y el reproductor ya vinculado en el iPad/TV.
4. Elegir una ventana con movimiento visible. Confirmar en el emisor `Video confirmado` y verificar visualmente movimiento en el receptor; no basta con ver `Conectada`.
5. Detener desde `Dejar de compartir` y comprobar que el receptor vuelve al contenido previo.
6. Repetir y detener desde el indicador nativo de captura del navegador.
7. Repetir en redes distintas. Si la interfaz muestra que no pudo confirmar video directo, esa prueba concreta justifica evaluar un relay TURN; no se contrata ni configura como parte de este paquete.

No deben usarse contenidos, sesiones o pantallas reales ajenos al piloto para esta validación.

## Orden de una activación posterior

1. Revisar y desplegar `signage-api` con sus cuatro archivos importados: `index.ts`, `signage-api-core.mjs`, `signage-manifest.mjs` y `signage-media-verify.mjs`; `verify_jwt=false` se conserva porque el reproductor usa token opaco y la función autoriza internamente.
2. Verificar `/health`, CORS, denegación sin credenciales y creación/señalización/parada con identidad piloto autorizada.
3. Publicar el frontend con la experiencia normal oculta y únicamente la URL explícita de piloto disponible.
4. Si el piloto falla, volver al Edge y frontend anteriores; no hay datos que revertir ni migración que deshacer.
5. Cambiar `liveEnabled` a `true` y retirar la entrada experimental únicamente tras la prueba Mac→iPad/TV.

El cambio Edge amplía la disponibilidad de sesiones autorizadas al modo directo sin TURN; no amplía roles, RLS, grants, tablas, buckets ni CORS. La función sigue exigiendo la capacidad `operate` del workspace y el token limitado del dispositivo.

## Criterios de aceptación

- [x] La captura solo inicia desde un gesto explícito y el permiso es nativo.
- [x] Cancelar no crea sesión ni deja pistas activas.
- [x] Solo una pantalla vinculada puede ser destino en este corte.
- [x] Oferta/respuesta no se confunde con video confirmado.
- [x] La parada local siempre detiene las pistas, incluso si el backend no responde.
- [x] El reproductor vuelve al contenido anterior al terminar la sesión.
- [x] Cerrar o abandonar la página intenta una parada central con `keepalive`.
- [x] Fallos directos explican que la red puede requerir relay sin venderlo como certeza.
- [x] Flujo y errores pasan pruebas sintéticas y E2E local.
- [x] La ruta normal oculta el piloto y el parámetro exacto muestra una acción marcada como experimental.
- [ ] RTP real Mac→iPad/TV confirmado en la red de SIERRA.
- [ ] Operación en redes distintas confirmada o necesidad de TURN demostrada.

