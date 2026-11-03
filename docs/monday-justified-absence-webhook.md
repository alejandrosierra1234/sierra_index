# Boleta de inasistencia justificada — Pride Yarn

El creador manual vive en `inasistencia-justificada.html`. No consulta ni guarda datos: permite completar la boleta, revisar el resultado e imprimir ORIGINAL y COPIA en una hoja carta horizontal.

La integración automática recibe los cambios del tablero de Monday `18400606831` y genera el mismo tipo de boleta cuando **Estado** (`estado8`) cambia a **Finalizado**. El PDF se carga en **Archivo** (`file_mkwhv1s1`) del mismo elemento.

## Flujo

1. Monday notifica el cambio de estado.
2. La función vuelve a consultar el elemento y confirma el tablero y el estado actual.
3. Extrae los datos de las columnas, el logotipo de Pride Yarn y la firma del colaborador.
4. Genera un PDF vectorial con ORIGINAL y COPIA.
5. Carga el PDF en la columna `Archivo` y agrega una actualización al elemento.

La función es idempotente: si ya existe `boleta-inasistencia-justificada-<item-id>.pdf`, no vuelve a generarlo.

## Variables protegidas

- `MONDAY_API_TOKEN`: token con lectura y escritura en el tablero.
- `MONDAY_ABSENCE_WEBHOOK_SECRET`: secreto opcional para rotación. La primera activación compara SHA-256 contra un hash versionado; el valor original solo existe en la URL privada guardada por Monday.

Supabase proporciona `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` a la función desplegada.

## Despliegue

```bash
supabase secrets set \
  MONDAY_API_TOKEN="..." \
  MONDAY_ABSENCE_WEBHOOK_SECRET="..." \
  --project-ref vhyddogeemohtqijohry

supabase functions deploy monday-justified-absence-webhook \
  --project-ref vhyddogeemohtqijohry \
  --no-verify-jwt
```

URL del receptor:

```text
https://vhyddogeemohtqijohry.supabase.co/functions/v1/monday-justified-absence-webhook?secret=<MONDAY_ABSENCE_WEBHOOK_SECRET>
```

En Monday, configurar un webhook `change_status_column_value` para `estado8`, limitado a la etiqueta `Finalizado`. La función responde automáticamente al `challenge` inicial.

## Mapeo del tablero

| Dato | Columna |
| --- | --- |
| Nombre | `name` |
| DPI | `n_mero__1` |
| Correo | `correo_electr_nico_mkmvqc1m` |
| Constancia | `cargar_archivo__1` |
| Fecha de solicitud | `fecha__1` |
| Tipo de tiempo | `selecci_n_m_ltiple` |
| Fechas completas | `intervalo_de_fechas__1` |
| Fechas parciales | `intervalo_de_fechas1__1` |
| Duración parcial | `selecci_n__nica__1` |
| Total equivalente | `f_rmula2` |
| Concepto | `selecci_n__nica0__1` |
| Beneficio específico | `selecci_n__nica3__1` |
| Estado | `estado8` |
| Área | `estado_10` |
| Comentarios | `long_text_mkp04aw8` |
| Firma del colaborador | `firma__1` |
| Gerente de área | `personas__1` |
| RR. HH. | `personas7__1` |
| Comentario de RR. HH. | `texto__1` |
| Solicitud en tiempo | `f_rmula41__1` |
| Fecha de cierre | `fecha_mkmvab8h` |
| PDF generado | `file_mkwhv1s1` |

## Estado de activación

- El creador manual y la función `monday-justified-absence-webhook` están listos.
- La función está desplegada en el proyecto Supabase `vhyddogeemohtqijohry` con validación propia del secreto del webhook.
- El webhook de Monday está activo con el ID `662236187`: escucha `change_status_column_value` en `estado8` y se limita a la etiqueta `Finalizado` (índice `5`).

## Pendientes operativos

- Configurar el logotipo de Pride Yarn en `companies.logo_url`; el registro actual usa el nombre legal `Pride Yarn S. de R.L.` y no tiene logotipo.
- Validar una solicitud real de tiempo completo y otra de tiempo parcial antes de usarlo como flujo oficial.
