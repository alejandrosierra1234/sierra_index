# Muestras: revisión transversal de UI y UX

11 de septiembre de 2026. Alcance: navegación, catálogo, producto, selección, colección, costing, preparación, inventario, etiquetas, QR y seguimiento. Referencia: SIERRA_DESIGN_SYSTEM, especialmente §§12b, 24–28, 43–46 y 64.

## Decisión de arquitectura

Separar **espacios operativos**, con un motor compartido: Tela y Prendas, Hilo, Químicos y Fibra. Tela y Prendas comparten PD de Northern Textiles. No se presume que Fibra sea operada por el equipo de Hilo. El módulo Muestras funciona como entrada a esos espacios; no se duplican motores de inventario, catálogos ni permisos.

Quien tiene varias divisiones elige equipo explícitamente y mantiene ese contexto al navegar. Quien necesita una consulta transversal dispone de Todos los equipos. La división del catálogo sigue siendo visible dentro de cada espacio. Los permisos existentes siguen siendo la autoridad; elegir un espacio no concede acceso adicional.

Las colecciones reciben `sample_space` persistente. Se clasifican las existentes por sus referencias; los borradores vacíos anteriores permanecen en la vista general, identificados Por clasificar. Las históricas de varios equipos se conservan como tales. Las nuevas altas de muestras bloquean mezclas entre equipos en la base de datos, con bloqueo de la fila de colección para las selecciones simultáneas. Se permite Tela + Prendas. No se permite cambiar el equipo de una colección con referencias para evadir la restricción.

## Hallazgos y tratamiento

| Página / recorrido | Problema observado en código o interfaz | Cambio |
|---|---|---|
| Entrada y navegación | Cinco divisiones compiten; icono de auriculares identifica Muestras | Entrada por equipo, icono de paquete, árbol contextual, cambio de equipo explícito |
| Centro | Pestañas rellenas de turquesa, jerarquía propia, contadores sin contexto de equipo | Pestañas de navegación con subrayado, superficies neutras, consulta y contadores por espacio en SQL |
| Catálogo | El cambio de catálogo puede perder el contexto operativo | Sincroniza el equipo con la división seleccionada; conserva componentes existentes de catálogo |
| Selección y colección | Rechaza Tela + Prendas aunque comparten PD | Agrupación por espacio, búsqueda limitada al equipo, control equivalente en base de datos |
| Detalle de colección | Entrega completa siempre abierta; demasiadas herramientas simultáneas | Entrega contraíble con destinatario resumido; etiquetas opcionales bajo una sección secundaria |
| Contenido y costing | Formato y categoría usan selects del sistema; controles de cantidad poco identificables | Control Sierra compartido, iconos de modos de vista, nombres accesibles por referencia en cantidad y eliminación |
| Colaboradores | Selector nativo de roles; riesgo al reemplazar eventos de permisos | Adaptación que conserva el select como fuente de valor, su handler y opciones deshabilitadas |
| Preparación | Cola antigua de Tela/Prendas compite con el nuevo flujo; hueco de navegación para PD | Centro accesible también a usuarios de despacho; elimina entrada duplicada en esas dos divisiones |
| Existencias de colección | Cada referencia sin lote se abre simultáneamente | Referencias contraíbles, tablas y espacios consistentes |
| Inventario físico | Estilos propios y acciones de inventario mezclados visualmente | Ritmo y controles comunes; entradas y correcciones secundarias contraíbles; continúa actualizando saldos |
| Inventarios anteriores / Insights | Selects antiguos y contexto general poco evidente | Selects Sierra en la superficie de muestras; Insights identificado como general |
| Etiquetas / producto | Controles nuevos y antiguos con distintas respuestas a teclado y selección | Adaptación de controles heredados en editores; apariencia neutra; no se modifica la composición impresa |
| QR / feedback | Acceso de QR aparece incluso en equipos sin ese flujo | Acceso contextual a Tela/Prendas o vista general; conserva ficha pública y feedback vinculados al producto |
| Seguimiento | Listas de todos los equipos sin separación | Consulta por espacio, iconos de etapa, estados semánticos, continuidad del packing list y su aprobación |

## Sistema visual aplicado

- Aeonik y tokens existentes; no se agrega una biblioteca de iconos.
- Iconos del registro `siIcon` y marcas de división existentes. La guía reconoce que la migración oficial a Flaticon aún no está completada; no se mezclan familias nuevas.
- Controles operativos de 36 px, iconos de 16 px, espacios de 8/16/24 px.
- Selección y hover neutros. Color de división solo en identidad; estados usan tokens semánticos; acción principal conserva el acento Sierra.
- Dropdowns basados en `pdSelect`, con roles de lista, opciones deshabilitadas, flechas, Escape, cierre y recuperación del foco. Se preservan los valores y eventos originales.
- Acciones de volver, copiar, QR, preparar, imprimir y eliminar con iconos reconocibles. Los controles que pueden confundirse identifican su referencia.

## Verificación

Pruebas de SQL con PGlite: separación de espacios, Tela + Prendas, rechazo de mezcla, bloqueo del cambio de equipo, borradores previos, RLS y falta de acceso anónimo. Se conservan las pruebas de costing, reserva, aprobación externa, despacho único, faltantes y fichas QR.

Pruebas DOM: valores y handlers originales de dropdowns, opciones deshabilitadas, teclas, Escape/foco y renderizado dinámico. Pruebas del Centro: estados, permisos, búsqueda, paginación, respuestas obsoletas, iconos y texto escapado. Suite de Comunicados ejecutada por el cambio del archivo compartido.

La migración 38 se ensayó con rollback y después se aplicó en Supabase. No crea saldos, no asigna responsabilidades a cuentas y no despacha colecciones.

## Límites operativos que el diseño no sustituye

La validación con la sesión administrativa y pruebas automatizadas no equivale a una sesión real con Ventas y PD. Falta cargar inventario fiable y confirmar las cuentas y permisos de las personas; no se inventan datos. La ficha QR no habilita todavía el catálogo colaborativo de autoservicio para clientes de fase dos. Los recorridos históricos de Hilo, Fibra y Químicos conservan sus reglas actuales de operación; la gobernanza nueva de PD sigue correspondiendo a Tela/Prendas.
