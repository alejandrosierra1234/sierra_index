# Etiquetas Brother y Zebra

El selector **Formato de impresión**, fijo bajo el encabezado de Etiqueta de tela y del creador de hilo, recuerda la elección en este navegador. No cambia los datos, campos ocultos, textos personalizados o configuración guardada del producto.

- **Brother QL-800:** conserva los formatos técnicos de 62 mm de ancho y su longitud actual; hilo mantiene 62 × 100 mm y el sticker comercial Brother, 62 × 40 mm.
- **Zebra ZD421:** etiqueta vertical de **2 pulgadas de ancho × 3 de alto**, es decir **50,8 × 76,2 mm**, con 2 mm de margen interior. Texto negro, logo monocromático, QR de 18 mm y código de barras vectorial. El editor técnico usa los mismos campos/resolvedores; PD usa la ficha liberada y el lote físico como antes.

La elección aparece en el editor técnico y antes de preparar etiquetas de muestras, hilo y precio. En el diálogo del sistema selecciona la impresora correspondiente, el papel con estas dimensiones, escala 100% y sin encabezados ni pies. El controlador de Zebra debe tener configurado el tipo de medio instalado (separación/gap o marca negra). El perfil web no instala controladores, selecciona un dispositivo USB ni envía ZPL directamente.

La vista previa y la impresión técnica comparten el renderizador. En Zebra no se recorta ni se reduce automáticamente el contenido: si excede la etiqueta, la impresión se bloquea con un mensaje para corregir los campos. Las etiquetas PD esperan al QR antes de habilitar Imprimir / Guardar PDF. La opción PDF usa el mismo tamaño de página.

## Verificación realizada

- Pruebas de campos/configuración intactos al cambiar de impresora; dimensiones Brother conservadas.
- Página Zebra de 50,8 × 76,2 mm, dos copias independientes, sin transformaciones de reducción y bloqueo de desbordamiento.
- Revisión visual local de etiquetas técnica y PD con título de colección, composición, lote, color, ancho, gramaje, formato/cantidad, precio, MOQ, vigencia, QR y barras. Cajas medidas: 192 × 288 píxeles CSS, sin desbordamiento (corresponden a 50,8 × 76,2 mm a 96 CSS px/in).
- Fixture reproducible: `node tests/samples/label-preview.cjs`.

**Pendiente en sitio:** primera impresión física y lectura con el escáner de PD. No se ha tenido acceso a la impresora; la oscuridad, velocidad, calibración y márgenes del controlador deben comprobarse en esa prueba. La ZD421 existe con resoluciones 203/300 dpi; la salida en mm y SVG no requiere escoger resolución en la aplicación.

Fuentes oficiales: [ZD421](https://www.zebra.com/us/en/products/printers/desktop/zd400-series/zd421.html), [especificaciones de medios](https://docs.zebra.com/us/en/printers/desktop/zd421-and-zd621-desktop-printers-user-guide/media/general-media-and-print-specifications.html), [Brother QL-800 / DK-2205](https://support.brother.com/g/b/colist.aspx?c=ca&cao=roll&lang=en&prod=lpql800eus).

La selección muestra **Brother · 62 mm** y **Zebra · 2 × 3 pulgadas** simultáneamente, sin abrir pestañas ni desplazarse por los campos. El botón de impresión técnica identifica la impresora elegida. Si la aplicación estaba abierta antes de la actualización, guarda los cambios y recarga para cargar los nuevos controles.
