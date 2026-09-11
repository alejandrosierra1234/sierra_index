# Muestras: operación de Ventas y PD

## Resultado esperado
Una colección compartida debe conservar lo solicitado, lo propuesto, lo costeado y lo empacado. Ventas debe conocer el contenido real antes de salir. Preparar no equivale a despachar. El inventario es el origen principal; un faltante puede requerir preparación desde un rollo o desarrollo, nunca una existencia ficticia.

## Operación confirmada
Northern Textiles produce en Naco, Quimistán. José dirige desarrollos; Ansuar los corre en máquinas; Rommel dirige Muestras; Elvis prepara hangers y yardas; Beberly desarrolla prendas. Todos pertenecen a PD. Existen almacenes de rollos y hangers; el de prendas está en formación.

Cristina Olmedo dirige Ventas Fabric y Alejandra Cardona coordina. Kevin, Jazmint, Leslie y Zucelly venden desde Guatemala a clientes en varios países y marcas estadounidenses. El origen de una solicitud no limita su destino ni los permisos del solicitante.

Marketing define plantillas y campos de marca; no debe transcribir precios ni elaborar etiquetas operativas una a una. Los nombres anteriores describen responsabilidades: no se deben asignar permisos por coincidencia de nombre sin verificar la cuenta.

## Tenemos / esperamos / necesitamos
| Área | Evidencia actual en código | Resultado necesario |
|---|---|---|
| Colecciones | Borradores persistidos, colaboradores, categorías | Brief compartido, responsable y fecha requerida; selección de Ventas o propuesta de PD, con revisión comercial |
| Costing | Precio, moneda, MOQ y vigencia por muestra | Costing opcional por colección; cuando sea obligatorio, liberar preparación y etiquetas únicamente después de completarlo |
| Permisos | Presets de colaboradores principalmente visuales | Las mismas reglas en servidor: lectura, selección, precios, preparación, aprobación y administración |
| Stock | Producto + formato + ubicación; cantidades enteras | Variante/color, lote, versión y unidad; metros/yardas fraccionarios; existencia física separada de disponibilidad y reserva |
| Preparación | Verificar o excluir renglones | Cantidad solicitada, preparada y faltante; motivo obligatorio, alternativa propuesta y responsable |
| Packing list | Guía generada a partir de datos mutables | Versión persistida del contenido real, incluidos/excluidos, autor y fecha; impresión reproducible |
| Aprobación | No hay compuerta comercial | Exigir aprobación de Ventas para cliente o marca. No exigirla para entrega interna Guatemala, pero siempre mostrar el packing list. Cambiar contenido invalida aprobación |
| Salida | Preparación consume inventario | Consumo al confirmar salida física, una sola vez, en transacción con estado e historial |
| Etiquetas | Etiqueta base y sticker de precio separados | Datos estructurados sin reescritura; plantilla estándar por defecto, campos comerciales opcionales; versión de etiqueta vinculada al contenido |
| QR | Debe verificarse destino y datos expuestos | Ficha publicada con lista explícita de campos y fotografía; excluir receta, costes internos y contactos privados; revocación y solicitud física |
| Retroalimentación | Comentarios de colección | Observaciones ligadas a producto y versión, cliente, evidencia, decisión PD y desarrollo sucesor |
| Colaboración | Varios miembros con escritura | Control de versiones para evitar pérdida silenciosa; actualización sin borrar cambios locales; registro de autor |

El contraste con Supabase encontró 30 colecciones y cero registros en inventory_stock. También faltaban columnas de roles de colaboradores que la interfaz esperaba. Esto impide prometer disponibilidad real hasta levantar y cargar el inventario físico.

## Flujo recomendado
1. **Definir:** destino (cliente, marca o equipo interno), brief, responsable, fecha de visita/recepción y si requiere costing. La fecha de despacho se calcula considerando transporte; no confundirla con la visita.
2. **Seleccionar:** Ventas elige referencias o PD propone. Mostrar stock y cuándo fue consultado. Distinguir sin existencias, preparación desde rollo y desarrollo nuevo.
3. **Liberar:** Ventas confirma selección; si aplica, completa precio, moneda, unidad y vigencia. La liberación congela esa versión comercial.
4. **Preparar:** PD imprime etiquetas desde esa información y verifica muestras físicas por código. Registra faltantes y motivos. Las sustituciones vuelven a revisión comercial.
5. **Revisar paquete:** crear packing list persistido. Ventas aprueba únicamente salidas a clientes o marcas. Una modificación material obliga a crear otra versión y aprobarla nuevamente.
6. **Despachar:** PD registra transportista/guía y salida física; inventario e historial cambian juntos. Entrega interna también exige contenido registrado.
7. **Cerrar y aprender:** confirmar recepción, registrar feedback por desarrollo y decidir si procede revisión. Conservar referencias a la versión entregada.

## Necesidades que conviene resolver explícitamente
- Un hanger y una yarda no son unidades intercambiables. Transformar rollo en muestras requiere consumo, rendimiento y merma, no una transferencia numérica directa.
- Una fila con cantidad cinco no equivale a cinco códigos únicos. Definir trazabilidad por pieza o lote y emitir identificadores acordes.
- Tela y prenda pueden compartir colección comercial, aunque se preparen en almacenes distintos. Consolidación no debe permitir que un permiso Fabric autorice movimientos Garment.
- Regla confirmada: cerrar con faltantes explicados, sin pendientes para otro paquete. Si no se incluye nada, cerrar sin despacho y sin packing list vacío. Otra solicitud se gestiona como una colección nueva.
- Costing necesita unidad (por yarda, metro, pieza), moneda, vigencia y condiciones; un número sin unidad puede comunicar un precio incorrecto.
- Evitar duplicar stock al devolver una muestra. Reingreso requiere verificación física y condición.
- Las reservas deben liberarse al cancelar y tener seguimiento de antigüedad. No bloquear stock indefinidamente por borradores abandonados.
- Los QR requieren una publicación explícita y revocable. Un ID difícil de adivinar no reemplaza permisos ni una lista de campos públicos.
- Solicitar muestra desde QR necesita bandeja de aceptación y protección frente a solicitudes automatizadas. Nunca debe reservar inventario por sí solo.
- No enviar correos o mensajes externos automáticamente sin definir destinatarios, consentimiento operativo y contenido. La trazabilidad interna es independiente.

## Interfaz
Una cabecera con destinatario, responsable, fecha y siguiente acción. Etapas compactas: Selección → Costing (si aplica) → Preparación → Packing list → Envío. Mostrar únicamente herramientas de la etapa activa. Usar iconos SVG consistentes con texto, nunca símbolos ambiguos como único nombre de acción.

Inventario y detalle técnico se abren a demanda. El packing list compara solicitado/empacado/faltante; no obliga a interpretar comentarios dispersos. Los errores permanecen junto a la acción y conservan datos. Las confirmaciones deben nombrar la colección y la consecuencia.

## Criterios de aceptación
- Un fallo del servidor no produce mensajes de éxito ni cambios locales aparentes.
- Dos usuarios no pueden aprobar versiones diferentes silenciosamente.
- Precio incompleto bloquea liberación cuando costing es obligatorio.
- Cero muestras incluidas no produce un paquete listo.
- Cliente/marca sin aprobación vigente no sale; entrega interna no solicita esa aprobación.
- Preparación no descuenta stock; salida lo descuenta una sola vez y no permite negativos.
- Ventas puede consultar e imprimir exactamente el contenido registrado por PD.
- Una cuenta de lectura no puede cambiar precios ni aprobar mediante llamada directa.
- QR no expone recetas ni datos privados aun consultándolo sin sesión.

## Fase dos
Acceso del cliente al catálogo autorizado y creación de sus propias colecciones. Mantener separado del catálogo interno y del costing confidencial. La ficha pública curada puede prepararse antes, sin abrir el catálogo completo.

## Alcance implementado y puesta en marcha

- Inventario físico por tela/prenda, formato, color, lote, ubicación y unidad. Metros y yardas admiten tres decimales; piezas enteras. Preparación de hangers consume longitud real declarada y registra cuántas piezas produjo, en una transacción.
- Colecciones con condiciones de destino, país, costing y etiqueta; liberación por Ventas, preparación por PD, packing list inmutable y aprobación externa. Entregas internas conservan packing list sin aprobación comercial.
- Reservas al cerrar el paquete, consumo al salir, reapertura con liberación y cierre con todos los faltantes explicados. Protección de revisiones en las acciones principales, costing y selección de lote.
- Etiqueta combinada con información técnica y comercial opcional, código de barras y QR a una versión publicada. Fichas públicas revocables, con campos permitidos; bandeja de solicitudes físicas sin reserva automática.
- Observaciones por producto con copia de su ficha, cliente, versión declarada y resolución de PD.
- Interfaz por etapa, detalles contraíbles, iconos existentes de Index y actualización de cifras de inventario cada diez segundos mientras la pantalla está visible.

### Límites operativos y siguiente inversión

La carga inicial requiere conteo real de rollos, hangers y prendas; no se han inventado saldos. Verificar las cuentas de cada persona y asignar permisos por función es una tarea de administración previa al uso del equipo.

El código de barras identifica el renglón de muestra y su cantidad, no serializa cada pieza idéntica. Si se necesita custodia individual, añadir unidades físicas serializadas y reimpresiones controladas. La preparación de prendas todavía no modela una orden de taller con consumo de tela, avíos, merma y tiempos: se registra su existencia terminada. No hay planificación automática de capacidad ni alertas de transporte.

El cierre actual excluye renglones completos; para suministrar menos unidades de un renglón debe reabrirse la selección y acordarse la cantidad. No se soportan paquetes parciales con saldos pendientes, conforme a la regla confirmada. Las devoluciones se registran como correcciones justificadas; un circuito específico de devolución y condición sería una mejora posterior.

El historial de observaciones copia la ficha al registrar el comentario; no infiere automáticamente qué versión recibió un cliente. El vínculo a un desarrollo sucesor existe en servidor, pero aún falta un selector dedicado en la interfaz. Conviene añadir una bandeja global de decisiones de PD y plazos de atención.

Las pruebas automatizadas cubren transacciones, permisos, concurrencia, faltantes, unidades fraccionarias, publicación pública y errores de interfaz. No sustituyen una prueba operativa con las cuentas reales de Ventas y PD y un inventario previamente conciliado. Las colecciones históricas ya preparadas conservan su circuito anterior; las nuevas de Fabric/Garment usan las reglas nuevas después de activar la configuración.
