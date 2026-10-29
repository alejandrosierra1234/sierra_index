# Pantallas + SIERRA tvOS — especificación de experiencia premium

Estado: propuesta funcional y visual para revisión. No habilita capacidades nuevas, no modifica Supabase y no controla pantallas reales.

## 1. Tesis de producto

Pantallas es el centro de control de experiencias visuales de SIERRA. Debe permitir preparar, revisar, mostrar, cambiar y finalizar una experiencia sin que la persona operadora tenga que entender reproductores, manifiestos o revisiones técnicas.

SIERRA tvOS es la experiencia que ve la audiencia. No es el panel administrativo agrandado: se lee a 2–4 metros, mantiene un protagonista visual y elimina cualquier control que no pueda operarse desde el dispositivo o un control realmente vinculado.

La experiencia premium no depende de decorar más la interfaz. Depende de cinco comportamientos consistentes:

1. Una intención principal por vista.
2. Preparar nunca publica por accidente.
3. La previsualización representa el destino y el reemplazo con honestidad.
4. Cada orden devuelve resultado por pantalla.
5. Toda sesión temporal termina de forma segura y regresa a una salida conocida.

## 2. Arquitectura de información

Navegación cotidiana del módulo:

- **Espacios:** reconocer salas, pantallas, salida actual y estado reportado.
- **Contenido:** biblioteca SIERRA y contenido propio aprobado.
- **Sesiones:** experiencias preparadas, activas y finalizadas.

Actividad, diagnóstico, permisos y configuración son funciones secundarias. No se convierten en cuatro destinos principales adicionales hasta que tengan tareas frecuentes y completas.

El panel **Mostrar en…** es único y se reutiliza al comenzar desde un espacio, una pantalla, un contenido o una sesión.

## 3. Modelo común

| Objeto | Responsabilidad | Regla de integridad |
|---|---|---|
| Espacio | Lugar comprensible: recepción, sala, lobby | Pertenece a una sede y no transmite por sí mismo. |
| Pantalla | Destino estable vinculado | Nombre y espacio pueden cambiar sin revocar su identidad. |
| Contenido | Imagen, video, mensaje o presentación preparada | Conserva versión, procedencia, clasificación y vigencia. |
| Experiencia | Plantilla reusable: bienvenida, presentación, ambiente | Es un borrador hasta que una sesión la use. |
| Sesión | Ejecución temporal de una experiencia | Tiene anfitrión, destinos, inicio, caducidad y política de regreso. |
| Destino | Pantalla o selección explícita | Varias pantallas duplican; nunca forman un videowall implícito. |
| Estado deseado | Orden de la persona operadora | No se presenta como reproducción confirmada. |
| Estado reportado | Último reporte del reproductor | No prueba que el panel físico esté encendido ni visible. |

Clasificación de contenido:

- interno;
- aprobado para clientes;
- público institucional;
- temporal de visitante.

La clasificación determina quién puede seleccionarlo, en qué espacios puede mostrarse y cuánto tiempo debe conservarse.

## 4. Recorrido estrella

### 4.1 Preparar una bienvenida

1. En Espacios, elegir **Preparar bienvenida**.
2. Seleccionar una plantilla SIERRA aprobada.
3. Introducir nombre de muestra, organización o motivo, sin datos reales en el prototipo.
4. Elegir la sala y revisar las pantallas que recibirá la experiencia.
5. Definir vigencia y salida de regreso.
6. Revisar una previsualización fiel al aspecto del destino.
7. Guardar como preparada o elegir **Mostrar ahora**.

La vista de preparación conserva datos si se cierra o se vuelve atrás. Cancelar no publica. Los campos se validan en línea; no se usan `alert`, `confirm` ni `prompt` del navegador.

### 4.2 Mostrar y dirigir

Al publicar, el panel mantiene visible:

- experiencia activa;
- destinos y resultado individual;
- hora de vencimiento;
- salida de regreso;
- acciones **Cambiar contenido** y **Finalizar**.

Pasar de bienvenida a video o presentación crea una nueva orden dentro de la misma sesión. No crea otra sesión ni pierde el contexto del cliente.

### 4.3 Finalizar

Finalizar requiere una confirmación de página que nombre la sesión y los destinos afectados. Después:

1. la sesión pasa a finalizada;
2. cada destino vuelve al contenido anterior, al horario vigente o al ambiente SIERRA según la política elegida;
3. el resultado se informa por pantalla;
4. los datos temporales dejan de aparecer en la salida;
5. el historial conserva auditoría sin exponer información innecesaria.

## 5. SIERRA tvOS

### Modos

**Ambiente pasivo**

- Medios SIERRA autorizados, título mínimo y sin botones muertos.
- Poster o imagen segura cuando autoplay o video fallen.
- Sin carrusel interactivo si no existe mando, touch o control vinculado.

**Reproducción dirigida**

- El contenido ocupa el protagonismo.
- Imágenes y videos propios no reciben overlays de marca no solicitados.
- Mensajes y bienvenidas sí usan el lenguaje visual SIERRA OS.

**Sesión temporal**

- Bienvenida, presentación, pizarrón o dinámica.
- Caduca y vuelve a la salida configurada.
- Mantiene el último contenido válido ante una descarga interrumpida.

**Catálogo interactivo**

- Solo existe cuando hay una capacidad de entrada comprobada.
- El foco tiene icono, texto y escala máxima sugerida de 1.04.
- Un control desde Index es válido; una TV pasiva no muestra controles aparentes.

### Lenguaje visual

La guía sierraOS vigente es experimental y requiere prueba física. El candidato usa:

- lienzo neutral `#F5F5F5`, superficie de trabajo blanca y contexto `#F1FCFB`;
- texto principal `#2B2B2B`, secundario `#444`, teal SIERRA `#16CDBE` y teal legible `#007D73`;
- títulos de salida de 72–96 px, secciones de 32–48 px, cuerpo de 20–24 px;
- área segura de 48–72 px;
- una señal dominante y poco texto simultáneo;
- logotipo oficial y medios autorizados, no wordmarks recreados ni imágenes conceptuales presentadas como documentales.

## 6. Motion e interacción

Motion funcional propuesto:

- respuesta de control: 160 ms;
- cambio de vista o panel: 240 ms;
- foco: escala máxima 1.04 únicamente cuando aporta ubicación;
- publicación: progreso por etapas sin porcentaje inventado;
- transición de salida: crossfade moderado solo después de descargar y validar la nueva pieza;
- `prefers-reduced-motion`: elimina desplazamientos y escalas, conserva cambios de estado instantáneos y foco visible.

No se animan métricas decorativas, fondos sin función ni confirmaciones. El contenido no salta durante cargas: miniaturas, proporciones y paneles reservan su espacio.

## 7. Estados obligatorios

| Estado | Comportamiento |
|---|---|
| Vacío | Explica la siguiente acción válida y no inyecta demos en una cuenta conectada. |
| Preparando | Conserva entradas y permite volver sin pérdida. |
| Cargando | Usa estructura estable y mensaje de etapa; nunca spinner indefinido. |
| Éxito | Nombra qué ocurrió y en qué destinos. |
| Parcial | Separa éxitos de fallas y permite reintentar solo las fallidas. |
| Offline | Conserva último contenido válido y muestra cuándo fue el último reporte. |
| Conflicto | No sobrescribe una revisión más reciente; ofrece actualizar y revisar. |
| Error de medio | Mantiene título/poster de la pieza seleccionada y una salida segura. |
| Sesión vencida | Retira datos temporales y ejecuta la política de regreso. |

## 8. Seguridad y privacidad

- Todas las decisiones de acceso se validan en servidor y por workspace.
- Preparar y publicar son permisos distintos.
- Un QR de visitante es temporal, ligado a una sesión y nunca controla pantallas globalmente.
- Datos de clientes tienen vigencia y retención mínima explícita.
- Logos o archivos de visitante pasan revisión, tamaño, tipo real y moderación antes de mostrarse.
- Los reproductores usan credenciales por dispositivo, revocables y sin sesión administrativa.
- URLs firmadas caducan; el reproductor conserva una copia válida solo dentro de su política de caché.
- Ningún secreto, token de pairing o credencial TURN llega a archivos públicos permanentes.

## 9. Capacidades futuras, no simuladas como operativas

### Presentaciones

Primera versión: PDF procesado a diapositivas seguras, controlado desde Index o tablet. PowerPoint y Keynote requieren una conversión explícita antes de prometer soporte.

### Pizarrón

El lienzo vive en Index/tablet; la TV es una superficie pasiva. Incluye deshacer, borrar, autosave, recuperación, exportación y finalización.

### Dinámicas originales

Sesión con código/QR, anfitrión, respuestas móviles y resultados. No copia nombre, recursos, apariencia ni marca de Kahoot. Necesita límites, moderación, privacidad y retención.

### Videowall

Es un destino físico calibrado, no una selección múltiple. Requiere topología, marco, resolución y sincronización probada en hardware.

### Compartir computadora

El código de piloto directo está preparado localmente, pero sigue sin prueba RTP física. No se habilita como producto hasta comprobar captura, recepción, detención, pérdida de red y regreso en dispositivos reales.

## 10. Fases y criterios de aceptación

### Fase P1 — bienvenida y ambiente

- Plantillas aprobadas.
- Preparar, previsualizar, mostrar, cambiar y finalizar.
- Caducidad y regreso automático.
- Resultado individual por pantalla.

Aceptación: una persona nueva completa el recorrido estrella sin explicación, sin publicar durante la preparación y sin dejar datos temporales tras finalizar.

### Fase P2 — presentaciones y control remoto

- PDF procesado.
- Navegación desde Index/tablet.
- Descarga preventiva y recuperación.

Aceptación: avanzar, retroceder y reconectar sin perder la sesión ni la salida anterior.

### Fase P3 — pizarrón

- Lienzo versionado, autosave y TV pasiva.

Aceptación: recuperar tras recarga y cerrar sin afectar otras pantallas.

### Fase P4 — dinámicas

- Participantes temporales, moderación y resultados.

Aceptación: ningún participante puede acceder a biblioteca, espacios o controles fuera de su sesión.

### Fase P5 — escala especializada

- Videowall y compartir computadora a múltiples destinos.
- Evaluación de SFU/controlador solo tras medición real.

Aceptación: tolerancia de sincronía definida y demostrada en hardware objetivo.

## 11. Dependencias breves

1. Acordar clasificación y retención de contenido para clientes.
2. Definir política de regreso predeterminada por espacio.
3. Confirmar capacidades de entrada de cada pantalla: pasiva, mando o touch.
4. Definir formatos imprescindibles de presentaciones.
5. Probar el piloto WebRTC directo Mac → iPad/TV antes de decidir TURN.
6. Realizar QA de sierraOS en distancia, luz y hardware reales; las medidas actuales son candidatas de la guía experimental.

## 12. Evidencia de diseño

- Skill del repositorio: `.claude/skills/ui-product-design/SKILL.md` y referencias asociadas.
- Sistema SIERRA: `.claude/skills/ui-product-design/references/SIERRA_DESIGN_SYSTEM.md`.
- Guía oficial: `https://sierra-0102a3.webflow.io/style-guide#sierra-os`.
- Prototipo local: `docs/prototypes/pantallas-premium-experience.html`.
