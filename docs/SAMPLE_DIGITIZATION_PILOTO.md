# Piloto de 100 etiquetas reales — pendiente

No hay etiquetas reales disponibles en esta entrega. Los resultados sintéticos solo verifican funcionamiento; no autorizan el procesamiento masivo de las 4,000 muestras.

Preparar 100 etiquetas representativas sin seleccionar solo las fáciles: formatos/mills distintos, español e inglés, tipografía pequeña, orientación, reflejos/sombras, deterioro, información incompleta y composición multifibra. Incluir pares de foto repetida, mismo desarrollo con variante legítima y muestras distintas de técnica parecida. No publicar imágenes ni verdad de referencia en GitHub.

Un responsable textil prepara la referencia con campos presentes, valores exactos, unidad y `unreadable` cuando no puede leerse. Una segunda persona verifica los campos críticos. Separar una parte de calibración de otra de evaluación congelada: no reportar precisión sobre los mismos ejemplos usados para ajustar reglas sin identificarlo.

Formato del evaluador local: arreglo JSON con `image` (ruta relativa), `synthetic: false`, `expected` (campo → valor esperado). Mantener manifest e imágenes en almacenamiento corporativo privado. Ejecutar `evaluate.py` con modelos/configuración congelados y guardar el reporte fuera del repo. El evaluador siempre deja `pilot_passed: false`; la aprobación es humana, no depende de un umbral oculto.

Registrar por etiqueta: identificador, formato, dispositivo, colaborador, inicio/fin de captura, tiempo OCR, inicio/fin de revisión, campos corregidos/omitidos, error, candidatos de duplicación y decisión final. Medir exactitud por campo, cobertura (campos esperados extraídos), errores de unidad, falsos positivos/negativos de duplicación, tasa de intervención y tiempo total de operador. El dashboard solo calcula coincidencia por campo validado: medir aparte campos omitidos y tiempos de captura/corrección.

IT registra consumo RSS pico, CPU, disco/modelos, bytes originales/procesados, transferencia y comportamiento tras corte de red, cierre del navegador y reinicio del servicio. Repetir al menos una sesión en macOS y otra en Windows/servidor objetivo. Ensayar un volumen mayor a 4,000 con datos sintéticos antes de producción; verificar paginación, memoria estable y recuperación sin duplicar trabajos.

Criterios de aceptación a acordar antes del piloto: precisión/cobertura mínima por campo crítico, máximo de errores críticos, tolerancia de duplicados y tiempo aceptable por muestra. El equipo textil decide los números con su riesgo operativo. No se ha inventado una meta corporativa. Si se aprueba, conservar lote, modelos/configuración/versiones y reporte como baseline; ampliar primero de forma gradual, manteniendo revisión de excepciones.
