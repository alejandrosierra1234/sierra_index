# Auditoría de íconos — Comunicados

Fecha: 10 de septiembre de 2026. Alcance: biblioteca, selector de contenido, editores de bloques, formato, firma, vista previa, menús y documentos archivados/en papelera.

## Hallazgos y correcciones

| Ubicación | Hallazgo | Implementación |
| --- | --- | --- |
| Carga de imagen/firma | `upload` no existía; se dibujaba vacío | Incorporado al catálogo compartido; activación por Enter/Espacio |
| Acciones de registros | `more-horizontal` no existía; fallback de texto | `dots`, con nombre accesible y estado del menú |
| Párrafo e imagen | Documento y cámara no describían bien el bloque | `text-size` y `photo` |
| Organigrama, proceso y destacado | Personas, flecha y conversación eran ambiguos | `sitemap`, `route` y `layout-bottombar` |
| Encabezados de bloques | Sin continuidad con el selector | Mismo ícono en selector y encabezado de cada bloque visual |
| Mover/eliminar bloques | Flechas y cruces dependientes de la fuente | SVG `arrow-up`, `arrow-down`, `trash` y nombres accesibles |
| Personas y etapas | Botones de cruz sin nombre explícito | Papelera con “Eliminar persona”/“Eliminar etapa” |
| Tablas | Signos + y acciones sin pista visual | `plus` para agregar, `minus` para quitar fila/columna |
| Barra inferior | Acciones solo de texto y chevron tipográfico | Volver, descargar, deshacer y guardar con sus íconos; chevron SVG |
| Biblioteca y papelera | Destinos y menús sin referencias visuales | Documento, archivo y papelera; copiar/restaurar/imprimir/imagen en menús |
| Vista previa | Signos de zoom y ajuste inconsistentes | `minus`, `plus` y `maximize` |
| Formato de texto | Chevron tipográfico; quitar formato sin pista | Chevron SVG y `eraser`; B/I/U y A conservadas como convenciones tipográficas |

## Criterio de ubicación

- Ícono antes de la etiqueta en acciones y menús; chevron al final de los controles que abren opciones.
- Íconos solos únicamente en acciones compactas reconocibles, con nombre accesible y ayuda contextual.
- No añadir íconos decorativos a cada campo, dato o muestra de color.
- Mantener colores de marca en el selector de bloques y acciones neutras en el resto. No interpretar esos colores como estados editoriales.
- Usar exclusivamente `SI_ICON`/`siIcon`: SVG outline de Tabler, `currentColor`, decorativos para lectores de pantalla. Tamaño habitual: 16 px en acciones y 18 px en el selector.

## Validación

Suite de comunicaciones aprobada. Prueba adicional carga el catálogo real, verifica existencia de las claves usadas, renderiza todos los tipos de bloque y comprueba nombres de botones que solo muestran íconos. Revisión en Chrome del selector, barra inferior, vista previa y menú de descarga sobre fixture local del módulo. Los controles de formato conservan selección y las pruebas de exportación siguen aprobadas.

Origen de nuevos SVG: catálogo oficial [Tabler Icons](https://github.com/tabler/tabler-icons/tree/main/icons/outline), conforme a la biblioteca ya empleada por Index.
