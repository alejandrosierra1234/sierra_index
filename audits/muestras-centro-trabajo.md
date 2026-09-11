# Centro de Muestras · trabajo por colecciones

El Centro pasa de un listado de solicitudes a una bandeja de trabajo compartida.

## Organización

- **Mi trabajo:** colecciones con referencias en las que los permisos y la etapa permiten actuar. Muestra selección/costing para Ventas, preparación/salida/recepción para PD y aprobación del packing list para Ventas. Los borradores vacíos no ocupan esta bandeja.
- **Colecciones:** incluye borradores, trabajo en curso e históricos visibles para el usuario. Cada registro muestra nombre, cliente/destino, cantidad de referencias, responsable comercial, fecha requerida y siguiente paso.
- **Inventario:** entradas claras a telas y prendas, con regreso al Centro. Mantiene el inventario por lote y unidad instalado anteriormente.
- **Seguimiento:** salidas, entregas y cierres; acceso secundario a solicitudes individuales anteriores sin colección. Los faltantes aparecen en contexto de su colección.

La búsqueda consulta cliente, nombre, folio, responsable, país y guía. La paginación ocurre en servidor y conserva un total exacto; no se calculan cantidades usando una lista parcial de muestras. Las fechas vencidas se priorizan en trabajo y colecciones. Al volver de una colección, se conserva la vista y búsqueda.

## Claridad y controles

Una acción por fila abre la colección y su etapa para continuar con datos actuales. Las acciones de aprobación o despacho no se ejecutan desde un resumen potencialmente antiguo. Cada fila distingue al responsable de la colección del equipo al que corresponde actuar. No se asignaron personas de PD por su nombre ni se inventaron responsables operativos.

Los detalles de faltantes, precios pendientes, lotes por asignar y etiquetas pendientes vienen de datos del servidor. La consulta respeta RLS y no modifica muestras, precios ni inventario. Los errores se muestran como errores con reintento; no se presentan como una bandeja vacía. Las respuestas antiguas de búsqueda se descartan.

## Validación

Pruebas SQL de conteos (82 referencias), roles, borradores vacíos, búsqueda, paginación y RLS; pruebas DOM de jerarquía, iconos existentes, escape de contenido, bloqueos y respuestas fuera de orden. Revisión visual con casos de selección, revisión comercial, preparación y salida. La consulta se instala como `update37.sql` sin cambiar saldos ni estados existentes.

La validación operativa con cuentas reales de Ventas y PD sigue dependiendo de verificar sus permisos y cargar existencias físicas. El historial individual conserva un límite visible de 80 registros recientes; las colecciones usan paginación sin ese recorte.
