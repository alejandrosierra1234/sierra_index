# Webhook de vacaciones — Northern Textiles

Esta integración recibe los cambios del tablero de Monday `7729506932` y genera una boleta PDF cuando la columna **Estado** (`estado8`) cambia a **Finalizado**. El PDF se carga en la columna **Boleta** (`file_mm824tqy`) del mismo elemento.

## Flujo

1. Monday notifica el cambio de estado.
2. La función vuelve a consultar el elemento y confirma que su estado actual es `Finalizado`.
3. Extrae los datos directamente de las columnas del tablero; no consulta una base de colaboradores.
4. Obtiene el nombre y logo de Northern Textiles desde `companies` usando el código `NT`.
5. Genera un PDF vectorial con ORIGINAL y COPIA en una hoja carta.
6. Sube el archivo a la columna `Boleta`.

La función es idempotente: si ya existe `boleta-vacaciones-<item-id>.pdf`, no vuelve a generarlo.

## Variables protegidas

Configurar como secretos de la función, nunca en Git:

- `MONDAY_API_TOKEN`: token con acceso de lectura y escritura al tablero.
- `MONDAY_VACATIONS_WEBHOOK_SECRET`: valor aleatorio usado en la URL para autenticar las llamadas de Monday.

Supabase proporciona automáticamente `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` a la función desplegada.

## Despliegue

```bash
supabase secrets set \
  MONDAY_API_TOKEN="..." \
  MONDAY_VACATIONS_WEBHOOK_SECRET="..." \
  --project-ref vhyddogeemohtqijohry

supabase functions deploy monday-vacation-webhook \
  --project-ref vhyddogeemohtqijohry \
  --no-verify-jwt
```

URL del receptor:

```text
https://vhyddogeemohtqijohry.supabase.co/functions/v1/monday-vacation-webhook?secret=<MONDAY_VACATIONS_WEBHOOK_SECRET>
```

El webhook debe ser de tipo `change_status_column_value`, limitado a `estado8` y al índice `7` (`Finalizado`). Monday enviará primero un `challenge`; la función ya implementa la respuesta requerida.

## Mapeo del tablero

| Dato | Columna |
| --- | --- |
| Nombre | `name` |
| DNI | `n_mero__1` |
| Código | `short_textpir5roep` |
| Fecha de solicitud | `fecha__1` |
| Tipo de tiempo | `selecci_n_m_ltiple` |
| Días completos | `intervalo_de_fechas__1` |
| Tiempo parcial | `intervalo_de_fechas1__1` |
| Horario parcial | `selecci_n__nica__1` |
| Total de días | `f_rmula2` |
| Estado | `estado8` |
| Área | `estado_10` |
| Jefe inmediato | `personas__1` |
| RR. HH. | `personas7__1` |
| Comentario | `texto__1` |
| Firma de jefe inmediato | `file_mm3a6972` |
| Firma de colaborador | `file_mm3aqbzz` |
| Boleta generada | `file_mm824tqy` |

