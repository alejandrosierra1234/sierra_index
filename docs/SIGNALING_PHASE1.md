# SIERRA Index — Señalización digital, fase 1

## Corte entregado

Esta fase integra un módulo funcional de **Señalización** para administradores de plataforma. Permite crear mensajes de texto sintéticos, publicarlos localmente en dos pantallas sintéticas, abrir un reproductor controlado, restaurar la publicación anterior y revisar actividad local.

## Límites explícitos

- Persistencia: `localStorage` del navegador (`sierra_signage_phase1_v1`).
- Autorización: acceso temporal restringido a `platform.admin` ya verificado por Index; no existe todavía dominio `signage` ni RLS propios.
- No hay Supabase, sincronización remota, emparejamiento, telemetría, manifiestos, descarga de activos, offline real ni televisiones conectadas.
- “Sin telemetría” es el único estado operacional; el módulo no afirma que una TV esté encendida o mostrando contenido.
- Solo contenido textual controlado. Imágenes, video, documentos, programación y grupos quedan para fases posteriores.

## Revisión manual local

1. Iniciar SIERRA Index en un servidor estático local.
2. Ingresar con una cuenta local/autorizada que ya tenga `platform.admin` en el entorno de prueba.
3. Abrir el selector de módulos y entrar a **Señalización**.
4. Crear una pieza de texto; comprobar validaciones y persistencia tras recargar.
5. Publicarla en una pantalla sintética y abrir el reproductor.
6. Publicar otra pieza y usar **Rollback**.
7. Confirmar que la actividad indica explícitamente que es historial local.

## Pruebas

```bash
node tests/signage/phase1.cjs
```

## Registro de ejecución

- Fecha: 2026-10-28.
- Revisión base: `e554e06a025050dd9288b3b450dab14c358344c4`.
- Rama local: `work`; no se creó commit, push, merge ni despliegue.
- Archivos de producto: `index.html`, `js/signage-phase1.js`, `css/signage-phase1.css`.
- Verificación y evidencia: `tests/signage/phase1.cjs`, `tests/signage/phase1-visual.html`, `artifacts/signage-phase1/*.png`.
- Documentación: este archivo.

### Comandos y resultados

| Comprobación | Resultado |
|---|---|
| `node --check js/signage-phase1.js` | Pasó. |
| `node tests/signage/phase1.cjs` | Pasó: 24 aserciones. |
| Flujo Chromium/Playwright local | Pasó: crear, publicar, abrir reproductor y conservar tras recarga. |
| `node tests/security/access.cjs` | Pasó. |
| `node tests/security/profile.cjs` | Pasó. |
| `node tests/communications/management.cjs` | Pasó: 45 comprobaciones. |
| `node tests/samples/ui.cjs` | Pasó. |
| `git diff --check` | Pasó. |

La primera invocación directa de Chromium no pudo crear/usar correctamente su perfil headless dentro del sandbox. Se cambió a Playwright Core temporal usando el Chromium del entorno; no se añadió esa dependencia al producto. La inspección móvil descubrió que la tabla expandía el ancho del grid; se corrigió con contención `min-width:0` y se verificó `scrollWidth` de página igual al viewport, manteniendo scroll interno en la tabla.

### Criterios de aceptación

| Criterio | Estado | Evidencia/límite |
|---|---|---|
| El módulo aparece solo a `platform.admin`. | Pasó localmente | `moduleAccessible` usa `access: () => isAdmin()`; hereda Authorization V2. No se validó con un backend real. |
| Crear contenido textual con errores asociados. | Pasó | Prueba pura y flujo de navegador. |
| Persistir contenido y publicaciones tras recarga. | Pasó | `localStorage` y flujo de navegador local. |
| Publicar por pantalla y reproducir la versión activa. | Pasó | Pantallas sintéticas y reproductor local. |
| Rollback de publicación anterior. | Pasó | Prueba pura; control visible tras segunda publicación. |
| No afirmar telemetría, nube u offline. | Pasó | Banner, estado “Sin telemetría” y documentación. |
| Claro, oscuro y móvil sin overflow de página. | Pasó en arnés | Capturas y métricas del navegador; la tabla conserva scroll interno. |
| E2E con autenticación/Supabase real. | No verificado | No se usaron credenciales ni servicios reales. |
| RLS, dominio `signage`, sincronización y emparejamiento. | No implementado | Requiere fase servidor separada. |
| Televisión física y recuperación offline. | No verificado | Requiere inventario, hardware y entorno autorizado. |

### Riesgos restantes

- `localStorage` no es una fuente de verdad multiusuario, auditable ni protegida contra manipulación local.
- `platform.admin` es una compuerta temporal demasiado amplia; no reemplaza capacidades `signage` separadas.
- No existe control de concurrencia, manifiesto firmado, hash de activos ni entrega remota.
- Los perfiles de pantalla son declaraciones sintéticas, no compatibilidad comprobada.
- El acceso a la guía Webflow oficial continúa bloqueado por HTTP 403; la fase usa el skill y sistema local verificados.

## Próxima puerta

Antes de persistencia cloud o dispositivos reales se requiere autorizar y revisar: migración de dominio/capacidades `signage`, RLS, tablas versionadas, API del reproductor, storage privado, modelo de emparejamiento y entorno no productivo con credenciales separadas.

La siguiente fase local puede preparar esos archivos y pruebas sin aplicarlos. Para ejecutarlos contra un servicio se debe autorizar de forma explícita: **proyecto Supabase no productivo exacto, credencial/rol permitido, migraciones concretas a aplicar, ventana, responsable y procedimiento de rollback**. Producción y despliegue siguen fuera de alcance.
