# Instalación y configuración — Sample Digitization

Estado: migraciones y gateway desplegados en INDEX el 2026-11-24 por autorización del propietario. Servicio nativo instalado y prueba sintética completa en el Mac elegido. El piloto real de 100 etiquetas continúa pendiente.

## Arquitectura y requisitos

INDEX sigue siendo una web estática. Su cliente autenticado escribe metadatos mediante RPC y sube originales a Storage privado. Un worker corporativo consulta Supabase mediante HTTPS saliente, ejecuta PaddleOCR CPU y devuelve resultado e imagen procesada. No hay puertos OCR, CORS adicional, túneles ni token de servidor en el navegador. Cerrar INDEX no detiene trabajos aceptados por Supabase; sí detiene subidas todavía pendientes en IndexedDB, que se reanudan al abrir el módulo con la misma cuenta.

Python 3.12 de 64 bits, conexión inicial para instalar paquetes/modelos, disco y RAM suficientes. macOS ARM64 fue ejecutado con PaddlePaddle 3.2.2 y PaddleOCR 3.3.2. Windows x64 y Linux tienen instalador/servicio, pero no se han ejecutado en esta entrega. Verificar la resolución del lockfile y los modelos en esos sistemas antes de distribuir. Comenzar con un worker y 4 hilos CPU; medir memoria residente y latencia en el piloto antes de aumentar concurrencia. El contenedor limita cada worker a 6 GB y 4 CPU: es un límite de despliegue, no una medición del consumo necesario.

## Preparación por IT

1. Crear o usar un proyecto **de ensayo autorizado** con las tablas actuales de INDEX y autorización V2. No se crea automáticamente un proyecto facturable ni una rama Supabase.
2. Revisar y aplicar `supabase/migrations/20261124210445_sample_digitization.sql` al ensayo. Esta es una migración aditiva que presupone las migraciones históricas hasta `update74.sql`; no ejecutar `supabase db reset` sobre producción ni tratar esta carpeta como historial completo. Mantener copia de seguridad y registrar la migración en el procedimiento vigente del equipo.
3. La migración crea bucket **privado** `sample-digitization`, tablas `digitization_*`, funciones y políticas. Probar con una cuenta sin permisos, una con `fabric/read`, otra con `fabric/read+write`, una cuenta de otra división y una suspendida. Verificar también que políticas heredadas de Storage no permiten acceder a este bucket: las políticas restrictivas incluidas protegen contra ese caso.
4. Servir esta rama de INDEX en un entorno HTTPS de ensayo con `SB_URL` y clave pública del proyecto de ensayo. Para instalaciones futuras, ensayar primero en staging; el despliegue actual fue autorizado explícitamente. No incluir secretos en archivos web ni en commits.
5. Aplicar también `20261124225636_digitization_worker_gateway.sql` y desplegar `sample-digitization-worker` con `verify_jwt=false`: la función verifica su propio Bearer opaco contra SHA-256 en `digitization_worker_credentials`. Generar un token aleatorio de 48 bytes, guardar solo su hash en esa tabla y el token en `.env` (modo 0600) como `OCR_WORKER_TOKEN`, junto con `SUPABASE_URL`. El Mac no necesita `service_role`. Revocar un equipo poniendo `active=false`. La función solo firma rutas derivadas del trabajo con lease vigente; no permite elegir objetos arbitrarios. `bootstrap_job_id` debe permanecer NULL en operación habitual.
6. IT instala Python 3.12 una vez y ejecuta `Install.command` (macOS), `Install.cmd` (Windows) o `python3 install-native.py` (Linux). El instalador crea venv, instala versiones bloqueadas y registra launchd, tarea programada o servicio systemd de usuario. El primer arranque descarga los modelos; el heartbeat aparece cuando están listos. El instalador registra un servicio de usuario: macOS/Windows requiere sesión de esa cuenta; Linux requiere una sesión o configuración de lingering hecha por IT. El registro launchd fue ejecutado y comprobado en el Mac elegido.
7. Alternativa corporativa: Docker Engine Linux + Compose, `docker compose up -d --build`. `Start.command` / `Start.cmd` automatizan este inicio si el runtime ya existe. Docker Desktop no es obligatorio y su posible licencia comercial no forma parte de la solución. La ruta nativa evita esa dependencia.
8. Comprobar heartbeat y un lote sintético desde INDEX antes de permitir etiquetas reales. El colaborador opera únicamente INDEX; no instala paquetes ni ejecuta comandos.

Los modelos usados son `PP-OCRv5_mobile_det`, `latin_PP-OCRv5_mobile_rec`, `PP-LCNet_x1_0_doc_ori` y `PP-LCNet_x1_0_textline_ori`. El cache predeterminado de PaddleX queda bajo la cuenta de servicio; `PADDLE_PDX_CACHE_HOME` permite reubicarlo. El contenedor conserva `/home/ocr/.paddlex` en un volumen. Después del provisionamiento, permitir solo HTTPS a Supabase; comprobar que el cache está completo antes de bloquear los hosters. Ninguna imagen se envía a los proveedores de modelos.

## Administración

- Equipo de INDEX: `read` de división permite consultar; `read` + `write` permite capturar, revisar, pausar y cancelar. Los permisos heredados por rol no se usan. Solo `platform/admin` modifica configuración.
- Configuración JSON versionada: `required`, `ranges`, `allowed_values`, `aliases`, `templates`, umbrales OCR/interpretación/calidad, límites de bytes/píxeles y `concurrency` (1–4). Plantillas: `{"name":"Mill A","contains":"MILL A","aliases":{"Development Code":["Reference"]}}`. Alias son texto literal, no código ni expresiones ejecutables. Conservar los campos obligatorios del objeto.
- `concurrency` limita asignaciones globales en DB. Para más de un proceso, IT inicia workers adicionales, por ejemplo `docker compose up -d --scale ocr=2`; cada proceso carga su modelo. La UI no crea procesos en el servidor. Mantener un proceso en equipos de poca memoria.
- La revisión humana es incondicional en esta versión. Los umbrales cambian advertencias, nunca validan registros automáticamente.
- Almacenamiento implementado: Supabase privado. Retención: conservar (`retention_days: 0`); no hay borrado automático. Un valor distinto no activa eliminación. Archivado externo corporativo se evalúa en el documento técnico, pero no está implementado.
- No se activa Ollama: las reglas cubren el camino inicial y cualquier resultado ambiguo queda para revisión. No hay conectores de pago.

## Operación técnica y recuperación

- PostgreSQL es la cola persistente. `FOR UPDATE SKIP LOCKED` y bloqueo de admisión aseguran asignaciones atómicas. Lease de 5 minutos, renovado cada 45 segundos; un reinicio recupera leases expirados. La finalización exige token y lease vigentes. Cancelar invalida el token; un worker tardío no revive el trabajo.
- Los rechazos permanentes durante subida se aíslan por archivo en IndexedDB; un fallo temporal de red conserva la cola pendiente. El evento online reanuda pendientes y el botón de reintento reactiva los rechazados. Cambiar de cuenta interrumpe la importación sin trasladar imágenes a la nueva cuenta.
- Una excepción de imagen crea `Failed` y el worker continúa. Interrupciones de red reintentan conexión; trabajo sin finalización vuelve a ser elegible al expirar su lease. Revisar fallos repetidos antes de reintentar masivamente.
- Fotografías procesadas llevan el token del intento en su nombre. Intentos cancelados pueden dejar objetos huérfanos: revisar contra `original_path`/`processed_path` antes de una limpieza administrativa. No hay limpieza destructiva automática.
- Desactivar: pausar lotes, parar el servicio y ocultar el enlace del cliente. No borrar tablas ni bucket para un rollback operativo. Las migraciones históricas de INDEX permanecen intactas.
- El instalador no reemplaza políticas de administración del equipo. Logs nativos en `ocr-data/` (macOS); systemd journal / registros del planificador en otros sistemas. Logs del worker incluyen identificadores y códigos, nunca texto OCR ni credenciales. Configurar rotación de logs por IT.

## Verificación reproducible

Desde la raíz del repo: `npm ci --prefix tests/samples`, `node tests/digitization/database.cjs`, `node tests/digitization/core.cjs`, `python3 tests/digitization/extraction_test.py`. Para UI: `npm ci --prefix tests/policy-pdf`, instalar Chromium de Playwright, generar fixtures con `tests/digitization/generate-fixtures.py` y ejecutar `node tests/digitization/browser.cjs`.

Para reconocimiento real: instalar `requirements.txt` en venv, generar fixtures, ejecutar `python services/sample-digitization/evaluate.py work/ocr-fixtures/suite.json --output work/ocr-fixtures/report.json`. El evaluador usa PaddleOCR real; el fixture de navegador simula únicamente las respuestas de DB para probar UI, no acredita integración desplegada.

## Instalación activa en este Mac

Runtime: `~/Documents/Codex/Services/SampleDigitization`; entorno y modelos propios, fuera del checkout. LaunchAgent: `~/Library/LaunchAgents/com.sierra.sample-digitization.plist`. Arranca con la sesión del usuario y se recupera ante fallos. Requiere Mac encendido, sesión iniciada, sin suspensión y conexión a Supabase. No abre puertos. La cola permanece en Supabase cuando el Mac está apagado. Revisión obligatoria durante el piloto.

El sondeo ocioso es cada 30 segundos. Esto consume invocaciones Edge y tráfico de control: no hay tarifa por OCR, pero las cuotas de infraestructura de Supabase siguen aplicando.
