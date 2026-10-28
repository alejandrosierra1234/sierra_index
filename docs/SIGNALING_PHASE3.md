# SIERRA Index — Señalización digital, fase 3

## Corte funcional entregado

La fase 3 amplía el mismo módulo y repositorio local de fase 1; no crea un modelo alterno. Migra automáticamente el estado local de esquema 1 a esquema 3 y conserva la clave `sierra_signage_phase1_v1` para no abandonar datos existentes.

Permite en un navegador de prueba:

- Registrar perfiles de pantalla de prueba con nombre, planta, orientación y resolución declarada.
- Identificar cada perfil como `local-test` y `not-linked`; el alta no genera credenciales, códigos ni emparejamiento.
- Crear mensajes, imágenes HTTPS (`JPG`, `JPEG`, `PNG`, `WebP`, `GIF`) y videos HTTPS (`MP4`, `WebM`).
- Exigir descripción accesible para multimedia, rechazar HTTP, credenciales embebidas y extensiones fuera del corte.
- Crear listas ordenadas de hasta 50 entradas, con duración entre 5 y 3,600 segundos.
- Asignar ventanas absolutas a una pantalla sintética con prioridad de 0 a 9.
- Resolver conflictos por prioridad descendente, inicio más reciente y después ID ascendente.
- Rotar una lista con base en segundos transcurridos desde el inicio del horario.
- Conservar el último contenido reproducido correctamente y usarlo si el medio programado falla.
- Recuperar la última copia local completa si el JSON principal de `localStorage` queda corrupto.

## Límites honestos

- Texto, configuración, listas y horarios viven en `localStorage` del navegador actual.
- Las imágenes y videos son referencias remotas: no se descargan, no se cachean y requieren red, CORS/origen disponible y codec admitido por ese navegador.
- El fallback local solo ayuda cuando ya existe otro contenido válido en el mismo navegador. No equivale a caché multimedia, manifiesto firmado, publicación atómica remota ni offline universal.
- El reloj usado es el del navegador; no hay NTP ni comprobación de deriva de dispositivo.
- No existe telemetría, prueba física de imagen, emparejamiento, TV real o compatibilidad Smart TV validada.
- “Agregar pantalla de prueba” crea únicamente un perfil en `localStorage`. “Vincular una TV real” permanece explícitamente fuera del corte y requiere servicio central, identidad de dispositivo y un protocolo seguro.
- El módulo continúa restringido temporalmente a `platform.admin`. Las capacidades y RLS de `update59.sql` siguen sin aplicarse a un servicio.

## Coherencia con fase 2

La migración no aplicada `update59.sql` se alineó con el esquema local:

- Snapshots `message`, `image` y `video`, con la misma paleta y límites iniciales.
- Listas y revisiones inmutables.
- Horarios que fijan la revisión de lista usada.
- Capacidad `write` para listas y `operate` para horarios.
- Manifiesto interno con ventanas no vencidas y orden determinista.

El `credential_id` del arnés continúa siendo un adaptador sintético; no es un secreto. La UI no llama a Supabase ni afirma que estas tablas existan en nube.

## Pruebas reproducibles

```bash
cd tests/signage
npm ci
npm test
```

Resultados finales:

| Comprobación | Resultado |
|---|---|
| Fase 1 | 24 aserciones pasadas. |
| Fase 2 SQL | 47 aserciones pasadas. |
| Fase 3 | 44 aserciones pasadas, incluidas validación, permiso, no mutación, duplicados, auditoría y distinción de pantallas vinculadas. |
| Alta en Chromium local | Pasó: registrar perfil vertical, distinguirlo como no vinculado y conservarlo tras recargar. |
| Navegador Chromium local | Pasó: crear imagen, crear lista, programar, persistir, abrir reproductor, detectar fallo remoto y recuperar mensaje válido. |
| Seguridad, perfil, comunicaciones y muestras | Regresiones pasadas. |
| `git diff --check` | Pasó. |

El E2E usa `https://example.invalid/synthetic.png` intencionalmente: verifica de forma determinista la ruta de error sin depender de datos reales ni de un proveedor externo.

## Qué funcionaría realmente al publicar solo estos archivos

Si se autorizara integrar el paquete estático sin aplicar SQL, un administrador de plataforma podría usar en su navegador el panel, contenido, listas, horarios y reproductor local. Los datos permanecerían solo en ese perfil/navegador; otra computadora, usuario o TV no los vería. Los medios HTTPS intentarían cargarse directamente desde su origen. No aparecería mágicamente un panel cloud, sincronización multiusuario ni entrega a pantallas.

## Archivos del corte

- `js/signage-phase1.js`: modelo local migrado, validaciones, resolución y UI.
- `css/signage-phase1.css`: formularios, programación y reproductor multimedia responsive.
- `tests/signage/phase3.cjs`: pruebas puras del corte.
- `tests/signage/package.json`: incluye fase 3 en `npm test`.
- `update59.sql`: contrato servidor alineado, todavía no aplicado.
- `docs/SIGNAGE_SYNC_CONTRACT.md`: manifiesto y límites actualizados.
- `.github/workflows/deploy.yml`: cambio local visible para ejecutar las tres fases antes de un despliegue futuro; no se ejecutó.

## Próxima puerta

El siguiente salto útil requiere un entorno real. Antes de hacerlo se debe autorizar explícitamente:

1. Proyecto Supabase **no productivo** exacto.
2. Rol o credencial temporal permitida, sin compartir secretos en código.
3. Aplicación concreta de `update59.sql` revisada y su respaldo previo.
4. Responsable, ventana, comprobaciones posteriores y procedimiento de rollback.
5. Storage privado de prueba, límites, CORS y política de eliminación.
6. Endpoint de dispositivo con emisión/rotación/revocación de token y rate limiting.

Merge, push, GitHub Pages, producción y televisiones reales conservan puertas separadas.
