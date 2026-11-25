# Sample Digitization — arquitectura, alcance y evidencia

Implementación nativa en el módulo Muestras de INDEX, en rama independiente. Estado: Supabase y worker macOS desplegados con autorización; piloto real pendiente. No se declara apta para digitalizar las 4,000 muestras todavía.

## Inspección y reutilización

Base inspeccionada: `8f6c4e5`, rama predeterminada `claude/basic-website-html-qexj5j`. Se leyeron AGENTS.md, contrato AUTHORIZATION V2, estructura de index.html, módulos sample-center/workflow/stock/development/experience, esquema inicial y migraciones de muestras/permisos, integraciones y pruebas existentes. Tras inspección y pruebas, se aplicaron dos migraciones aditivas y una Edge Function al proyecto INDEX con autorización explícita.

El frontend es HTML/JS estático con Supabase JS y shell común. Se reutilizan `showSampleTool`, Muestras, `samplesSharedTools`, `can`, `sb`, `esc`, notificaciones y botones/tipografías de INDEX, así como `appLang` para español/inglés. No se agrega framework, aplicación independiente ni servicio de reconocimiento de pago.

`products` es el catálogo (`code`, `division`, `specs`); `samples` representa renglones de solicitudes/colecciones y `sample_stock` las existencias físicas. Los resultados de OCR **no son** ninguna de esas entidades. Se agregan registros de ingreso `digitization_jobs`, con vínculo opcional a `products.id` verificado por división. Se preservan claves existentes `Composition`, `Construction`, `GSM`, `Width`, `Color`. No se inventan cantidades, movimientos de inventario ni nuevos productos. La posterior promoción a PD/PDI HUB debe ser una acción explícita y transaccional, no un efecto del reconocimiento.

## Decisiones

- PostgreSQL como cola compartida, Storage privado como transporte, worker Python saliente. Evita servicio local HTTP, certificados por estación, acceso desde una web HTTPS a localhost y exposición en LAN/internet. Costo por consulta OCR: ninguno; infraestructura existente sigue teniendo sus costos.
- PaddleOCR 3.3.2 / PaddlePaddle 3.2.2 CPU, detector móvil PP-OCRv5 + reconocedor latino multilingüe, orientación de documento/línea. Modelo de servidor probado como comparación local; móvil elegido por menor latencia observada. Tesseract no se incorpora sin corpus real que demuestre ventaja; añadir un segundo motor ahora multiplicaría instalación y calibración.
- Recorte/perspectiva: detección conservadora de cuadrilátero con OpenCV; si la geometría no cumple criterios, se conserva el encuadre. Imagen original intacta; procesada con límites de resolución y orientación. Los polígonos apuntan a la imagen exacta que PaddleOCR procesó. Curvatura de telas/etiquetas no se corrige con un modelo de dewarping en esta versión.
- Parser determinista, alias bilingües y plantillas de marcadores literales. Evidencia por índices de líneas, valor original y normalizado. La confianza de interpretación es un score de reglas, **no una probabilidad calibrada**. Reglas numéricas para composición, unidades, rangos, nomenclaturas permitidas y contradicciones. No se asigna fecha ISO a una fecha ambigua.
- Ollama evaluado y diferido: no hay corpus complejo etiquetado con el que demostrar mejoras, y la salida generativa exige otra validación de evidencia. Ningún LLM forma parte del camino operativo.
- Duplicados: hash exacto por lote idempotente, reutilización de OCR para mismo archivo en otro lote de la misma división, texto idéntico, código coincidente, dHash (distancia <=6) y firma técnica de al menos tres campos. Son candidatos; ninguno fusiona o elimina muestras. Una variante legítima se valida con nota del revisor. Las comparaciones se limitan a los primeros 10,000 registros procesados de la división; revisar esta estrategia al superar ese volumen.
- Exportación CSV con protección frente a fórmulas; XLSX OOXML con cadenas inline (sin evaluación de fórmulas) y JSON con evidencia completa. No se agregan dependencias JS de terceros. Exportación paginada de datos; las imágenes no se cargan.

## Seguridad y recuperación

La sesión y capacidades existentes gobiernan cada RPC. SELECT tiene RLS por división. Clientes no tienen UPDATE/INSERT directo sobre registros ni capacidad de reclamar trabajos/finalizar OCR. La clave service_role permanece en el entorno interno de la Edge Function. El Mac utiliza un token revocable limitado al protocolo del worker, guardado localmente con permisos 0600. Las políticas restrictivas de Storage impiden que políticas antiguas de otro bucket expongan o muten evidencia. Se usan descargas autenticadas y URLs blob revocables, no URLs públicas persistentes.

Un hash por lote evita trabajos repetidos. Creación -> carga -> `ready` evita reclamar objetos inexistentes. Un cierre entre esos pasos se recupera desde IndexedDB y comprobación de hash. Los rechazos permanentes de subida se conservan con error por archivo y no bloquean las demás imágenes; los fallos transitorios detienen el envío sin descartar la cola. Se puede reintentar tras reabrir INDEX y se intenta continuar al recuperar conexión. Un cambio de cuenta interrumpe la importación y conserva los pendientes en la cuenta original. Cuota local acotada a 100 entradas; importación espera al llegar a 20. Solo se lee un archivo a la vez. La selección de 4,000 nombres no decodifica 4,000 imágenes. ZIP valida límites, métodos, tamaños declarados/efectivos, CRC, rutas y enlaces simbólicos; rechaza archivos no imagen, ZIP64, multipart y cifrados. Máximo ZIP 256 MiB y expansión 512 MiB: dividir archivos grandes en grupos o seleccionar carpeta.

Captura por navegador con `getUserMedia`: operador puede continuar sin esperar al OCR. Confirmación visual/sonora, contador y bloqueo heurístico de imagen repetida. Auto-captura por estabilidad y calidad es experimental y opt-in. El auto-recorte ocurre en el worker; en cámara se delimita mediante encuadre manual. No se promete detección automática universal de etiquetas ni detección perfecta de reflejos. HEIC depende del decoder pillow-heif del host; los navegadores pueden no mostrar el original, pero sí el JPEG procesado.

Auditoría append-only desde cliente: cambios de campos, notas, actor, fecha y resultados anteriores al reprocesamiento. El resultado inicial queda inmutable a la edición del colaborador. Las correcciones cambian campos y marcan intervención humana, sin entrenar modelos. Advertencias mostradas corresponden al resultado automático original: una validación humana requiere nota y puede resolverlas; no existe revalidación automática completa de campos corregidos en esta versión.

## Pruebas ejecutadas el 24 de noviembre de 2026

- PostgreSQL con PGlite: aislamiento de división, cuenta suspendida, almacenamiento, no escritura directa, privilegios de worker, idempotencia, pause/resume, leases expirados, cancelación, stale completion, revisión, revisiones optimistas y auditoría.
- 10 casos deterministas del parser: inglés/español, múltiples fibras, suma incorrecta, fibras desconocidas, unidades, contradicciones, plantilla, evidencia adyacente y abstención ante texto sin etiqueta.
- Volumen de cola: 4,001 registros sintéticos insertados en PGlite; límite global de cuatro asignaciones comprobado, métricas y candidatos duplicados verificados. No equivale a procesar 4,001 fotografías ni a un ensayo sostenido de memoria/red.
- Navegador: 4,001 PNG sintéticos mínimos enviados contra un backend de prueba, con cola pendiente no mayor de 21 y temporizador de UI activo. Pruebas de rechazo individual, reintento tras reabrir IndexedDB, caída de red y cambio de cuenta durante subida y lectura/hash. No es una prueba de reconocimiento de 4,001 etiquetas ni de transferencia real a Supabase.
- CSV/XLSX/ZIP: cadenas seguras y archivos inválidos/no imagen rechazados.
- Playwright con fixture sintético y CSS real de INDEX: captura/revisión a 320, 375, 768, 1024 y 1440 px; foco resalta la evidencia; outbox permanece al reabrir IndexedDB; sin overflow horizontal. No equivale a probar teléfonos físicos ni la integración remota.
- Regresión: workflow, centro, catálogo, quickview, etiquetas y privacidad pasan. `tests/samples/experience.cjs` falla `Hanger !== Yardas` tanto en esta rama como en el checkout limpio de la base; no lo introduce este cambio. `tests/security/access.cjs` pasa.
- Auditoría visual SIERRA sin patrones de acento adherido al borde.
- PaddleOCR real en macOS ARM64: siete imágenes sintéticas (limpia, rotada, pequeña, iluminación reducida, desenfocada, dañada, español). Sin excepciones. Código de desarrollo: 6/7 coincidencias exactas; composición, GSM, ancho y color: 7/7 cada uno. Estos resultados históricos comparaban detectores con reconocimiento por defecto; el despliegue fija explícitamente el reconocedor latino móvil y debe recalibrarse en el piloto. Latencias históricas de la corrida con detector móvil: aproximadamente 1.3–3.0 segundos por imagen, sin incluir instalación/carga inicial/subida. Detector servidor: 11.8 s y móvil: 2.0 s en una comparación de una imagen. Esto **no mide la precisión en etiquetas de SIERRA** ni justifica extrapolar productividad al lote real.

## Pendientes antes de la carga masiva

1. Integración remota comprobada con una imagen sintética: carga privada, reclamación, OCR real, imagen procesada y resultado Needs Review. Ampliar pruebas con cuentas operativas y dispositivos reales.
2. Probar instalación nativa/servicio y contenedor en equipos corporativos Windows/Linux; macOS tiene instalación nativa launchd e inferencia real comprobadas.
3. Piloto de 100 etiquetas reales con verdad de referencia independiente; calibrar OCR, interpretación, perspectiva, nomenclaturas, reflejos, desenfoque y similitud visual. Ensayar al menos 4,001 trabajos sintéticos/fotografías de prueba con cierres de navegador y caídas de worker antes de la carga real.
4. Validar cámara y permisos de iOS/Android; comprobar lectura de HEIC y comportamiento de carpetas/ZIP por navegador.
5. Medir RSS/CPU/disco/red y tiempos de captura/corrección. El dashboard mide segundos OCR y productividad por lote/actor; no mide tiempo activo exacto del colaborador. No hay métricas ficticias para esos datos.
6. La configuración avanzada es JSON restringido a admin, no un constructor visual de reglas. Retención automática, almacenamiento NAS/S3 alternativo, entrenamiento, Ollama y promoción automática a inventario no están activados.

## Costos y conservación

No hay cobro por reconocimiento ni dependencia de cuenta ChatGPT. Existen consumo eléctrico, equipo, disco, backups, transferencia y cuotas Supabase. Ejemplo aritmético, no factura: 4,000 originales de 2 MiB son ~7.8 GiB; procesadas de 0.5 MiB agregan ~2 GiB. Si los originales son 10 MiB, ocupan ~39 GiB. No comprimir destructivamente originales para ahorrar; elegir resolución adecuada durante captura y medir bytes reales en piloto. Descargar originales en revisión consume transferencia adicional.

Alternativa futura de menor costo: archivo en NAS corporativo cifrado con manifiesto de hashes en Supabase y proxy autenticado de lectura. No se eligió ahora porque añade disponibilidad, backup, certificados, servicio entrante y autorización de archivos. Retención conserva todo por defecto; una política de archivado/borrado requiere decisión de negocio y ensayo con referencias/auditoría. No se presupuestan tarifas actuales sin revisar el plan contratado.

## Fuentes técnicas y licencias

[PaddleOCR 3.3 — pipeline](https://www.paddleocr.ai/v3.3.0/en/version3.x/pipeline_usage/OCR.html), [PaddleOCR 3.3.2 Apache-2.0](https://github.com/PaddlePaddle/PaddleOCR/blob/v3.3.2/LICENSE), [PaddlePaddle 3.2.2 Apache-2.0](https://github.com/PaddlePaddle/Paddle/blob/v3.2.2/LICENSE), [Supabase Storage/RLS](https://supabase.com/docs/guides/storage/security/access-control). Conservar avisos de los paquetes al redistribuir: OpenCV Apache-2.0, Pillow HPND, httpx BSD-3-Clause, pillow-heif BSD-3-Clause y licencias de sus bibliotecas binarias (incluido libheif). El lockfile registra versiones del entorno comprobado; el inventario de licencias transitivas y binarios de cada instalador debe acompañar la distribución corporativa.


## Revisión de duplicados — reglas 2.0

El OCR finaliza en Needs Review. Compartir desarrollo, texto o aspecto solo propone candidatos. La revisión calcula evidencia con los campos actuales, dentro de la división y permisos del colaborador, mostrando hasta 30 resultados por prioridad. El rango interno es un orden de señales, **no una probabilidad**. Se conservan originales, no se fusiona ni borra información y no se cambian estados históricos con la migración.

Señales: SHA-256 idéntico, texto OCR idéntico, código de desarrollo, identificador de muestra, tres o más campos técnicos coincidentes y distancia dHash. Los hashes visuales casi uniformes se excluyen. Para campos se exige OCR ≥0.85 e interpretación ≥0.90, o corrección humana; conflictos quedan pendientes. GSM y ancho se comparan solo con unidades canónicas verificables; una corrección que invalida esa normalización queda fuera de esa señal. Código compartido con color/lote/identificador/acabado diferente propone variante. Identificador compartido con datos contradictorios exige atención especial.

En Configuración → Reglas y plantillas avanzadas, administradores pueden añadir `"duplicates":{"visual_distance":4,"gsm_percent":5,"width_cm":2}`. Límites efectivos: distancia 0–8 bits, GSM 0–10%, ancho 0–5 cm. Son valores iniciales conservadores, pendientes de calibración real. Se aplican al consultar candidatos; no requieren reiniciar PaddleOCR.

`digitization_duplicate_decide` exige permiso de escritura, lectura del candidato, motivo y versiones vigentes de ambos registros. Cada decisión conserva evidencia, versión de reglas, actor, estado previo y relación en `digitization_events`. Las decisiones se muestran como vigentes solo si ambas revisiones coinciden; los cambios posteriores exigen revisar la relación otra vez. Fotografías/muestras repetidas marcan Duplicate; variante, distintas o pendiente restablecen Needs Review. Validar campos sigue siendo una acción independiente.

Limitaciones: dHash no reconoce identidad física ni garantiza coincidencias bajo recortes o perspectivas distintos. Los pares sin señales comunes pueden no aparecer. La consulta evalúa registros procesados de la división; para crecimientos muy superiores al piloto se debe medir su latencia e introducir índices de candidatos si procede. El piloto debe evaluar falsos positivos y negativos sobre pares conocidos, incluidos los que no aparezcan en la lista. Las pruebas sintéticas validan lógica y permisos, no precisión comercial.
