# Catálogo: explorar, comparar y formar una colección

El catálogo anterior concentraba navegación de vista, categorías, búsqueda, filtros, orden, agrupación, columnas y acciones administrativas en niveles visuales equivalentes. Las tarjetas duplicaban controles de selección y no ofrecían una comparación consistente. Buscar reconstruía el campo activo sin restaurar el foco.

## Cambio aplicado

- Búsqueda como entrada principal; filtros y orden junto a ella. Agrupación, columnas, importación, escaneo y archivo dentro de Opciones.
- Cambio Tarjetas/Tabla junto al número de resultados; filtros aplicados removibles individualmente.
- Tarjeta con identidad, composición, especificaciones por división y acción de agregar muestra. Una sola casilla accesible de selección. Botones para abrir ficha mediante teclado.
- Misma posición para los atributos de telas; imágenes ausentes se declaran y la región se reduce cuando toda la cuadrícula carece de imágenes.
- Selección con una acción para agregar a colección y comparación de 2–4 referencias. Conservación de selección entre filtros y al cerrar comparación.
- Ficha rápida con atributos, acciones con iconos y acceso explícito a ficha completa/inventario.
- Estado del desarrollo identificado como tal, sin inventar disponibilidad física. Sin cambios de permisos ni reglas de despacho.
- Tabla inicial con menos columnas secundarias; preferencias previamente guardadas respetadas.
- Búsqueda conserva foco/cursor. Codificación de apóstrofes en las acciones de producto.

## Validación

Suite tests/samples completa y comprobaciones de sintaxis/comunicados aprobadas. Regresiones nuevas para selección, comparación, habilitación de acciones, contenido escapado, filtros y foco/cursor. Fixture visual reproducible `node tests/samples/catalog-preview.cjs` usando renderizadores y CSS reales con datos sintéticos. Revisión local en navegador de tarjetas, selección y comparación. La sesión autenticada de producción no se revisó visualmente en esta pasada.

## Límites operativos

La calidad de fotografías y datos técnicos debe gobernarse en PD; la UI no sustituye registros incompletos. El inventario físico permanece en la ficha completa y su módulo; no se presenta el estado de desarrollo como saldo de almacén. Comparar permite decidir referencias, pero no sustituye la revisión de costing o packing list de la colección.
