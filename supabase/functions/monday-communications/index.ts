import { createClient } from 'npm:@supabase/supabase-js@2'

type ColumnMap = Record<string, string | string[]>

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } })

const normalize = (value: unknown) =>
  String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()

const asArray = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value : value ? [value] : []

const DEFAULT_COLUMNS: ColumnMap = {
  status: ['Estado', 'Status', 'Estado de solicitud'],
  type: ['Tipo de comunicado', 'Tipo', 'Formato'],
  requester: ['Solicitante', 'Nombre', 'Nombre del solicitante'],
  email: ['Correo', 'Email', 'Correo del solicitante'],
  priority: ['Prioridad'],
  deadline: ['Fecha requerida', 'Entrega', 'Fecha límite'],
  country: ['País', 'Country'],
  company: ['Empresa', 'Empresa / planta', 'Empresa/planta'],
  plant: ['Planta', 'Empresa / planta', 'Empresa/planta'],
  department: ['Departamento', 'Área', 'Area'],
  audience: ['Audiencia', 'Dirigido a', 'Destinatario'],
  summary: ['Bajada', 'Resumen', 'Mensaje corto'],
  details: ['Información', 'Descripción', 'Detalle', 'Contenido solicitado'],
  channel: ['Canal', 'Publicación'],
}

function readColumnMap(env: Record<string, string | undefined>) {
  let custom: ColumnMap = {}
  if (env.MONDAY_COMMUNICATIONS_COLUMN_MAP) {
    try { custom = JSON.parse(env.MONDAY_COMMUNICATIONS_COLUMN_MAP) } catch { custom = {} }
  }
  return { ...DEFAULT_COLUMNS, ...custom }
}

function columnText(item: any, names: string[]) {
  const wanted = new Set(names.map(normalize))
  const column = (item?.column_values || []).find((value: any) => wanted.has(normalize(value?.column?.title)) || wanted.has(normalize(value?.id)))
  return String(column?.text || '').trim()
}

function parseKind(value: string) {
  const n = normalize(value)
  if (n.includes('convoc')) return 'convocatoria'
  if (n.includes('aviso')) return 'aviso'
  if (n.includes('memo')) return 'memo'
  return 'circular'
}

function mondayHeaders(token: string) {
  return { Authorization: token, 'Content-Type': 'application/json', 'API-Version': '2025-04' }
}

async function mondayRequest(token: string, query: string, variables: Record<string, unknown>) {
  const response = await fetch('https://api.monday.com/v2', {
    method: 'POST',
    headers: mondayHeaders(token),
    body: JSON.stringify({ query, variables }),
  })
  const payload = await response.json().catch(() => null)
  if (!response.ok || payload?.errors?.length) {
    const message = payload?.errors?.map((error: any) => error?.message).filter(Boolean).join(' · ') || 'Monday no respondió correctamente.'
    throw new Error(message)
  }
  return payload?.data
}

async function authorizeCaller(req: Request, env: Record<string, string>) {
  const authorization = req.headers.get('Authorization') || ''
  if (!authorization.startsWith('Bearer ')) return { error: json({ error: 'Inicia sesión para continuar.' }, 401) }
  const caller = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const { data: identity, error: identityError } = await caller.auth.getUser()
  if (identityError || !identity?.user) return { error: json({ error: 'Sesión no válida.' }, 401) }
  const { data: canRead, error: readError } = await caller.rpc('authorize', { p_domain: 'communications', p_capability: 'read' })
  const { data: canWrite, error: writeError } = await caller.rpc('authorize', { p_domain: 'communications', p_capability: 'write' })
  if (readError || writeError || canRead !== true) return { error: json({ error: 'Necesitas acceso a Comunicaciones.' }, 403) }
  return { user: identity.user, canWrite: canWrite === true }
}

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (req.method !== 'POST') return json({ error: 'Método no permitido.' }, 405)

  try {
    const env = {
      SUPABASE_URL: Deno.env.get('SUPABASE_URL')!,
      SUPABASE_ANON_KEY: Deno.env.get('SUPABASE_ANON_KEY')!,
      MONDAY_API_TOKEN: Deno.env.get('MONDAY_API_TOKEN') || '',
      MONDAY_COMMUNICATIONS_BOARD_ID: Deno.env.get('MONDAY_COMMUNICATIONS_BOARD_ID') || '',
      MONDAY_COMMUNICATIONS_GROUP_ID: Deno.env.get('MONDAY_COMMUNICATIONS_GROUP_ID') || '',
      MONDAY_COMMUNICATIONS_STATUS_COLUMN_ID: Deno.env.get('MONDAY_COMMUNICATIONS_STATUS_COLUMN_ID') || '',
      MONDAY_COMMUNICATIONS_CLAIM_STATUS: Deno.env.get('MONDAY_COMMUNICATIONS_CLAIM_STATUS') || 'En diseño',
      MONDAY_COMMUNICATIONS_COLUMN_MAP: Deno.env.get('MONDAY_COMMUNICATIONS_COLUMN_MAP') || '',
    }
    const auth = await authorizeCaller(req, env)
    if (auth.error) return auth.error

    let body: any
    try { body = await req.json() } catch { return json({ error: 'Solicitud no válida.' }, 400) }
    const action = body?.action || 'list'
    if (!env.MONDAY_API_TOKEN || !/^\d+$/.test(env.MONDAY_COMMUNICATIONS_BOARD_ID)) {
      return json({ error: 'Falta configurar MONDAY_API_TOKEN y MONDAY_COMMUNICATIONS_BOARD_ID en Supabase.' }, 503)
    }

    if (action === 'claim') {
      if (!auth.canWrite) return json({ error: 'Necesitas permiso de edición en Comunicaciones.' }, 403)
      const itemId = String(body?.item_id || '')
      if (!/^\d+$/.test(itemId)) return json({ error: 'Solicitud de Monday no válida.' }, 400)
      if (env.MONDAY_COMMUNICATIONS_STATUS_COLUMN_ID) {
        await mondayRequest(env.MONDAY_API_TOKEN, `mutation ($board: ID!, $item: ID!, $column: String!, $value: String!) {
          change_simple_column_value(board_id: $board, item_id: $item, column_id: $column, value: $value) { id }
        }`, {
          board: env.MONDAY_COMMUNICATIONS_BOARD_ID,
          item: itemId,
          column: env.MONDAY_COMMUNICATIONS_STATUS_COLUMN_ID,
          value: env.MONDAY_COMMUNICATIONS_CLAIM_STATUS,
        })
      }
      return json({ ok: true })
    }

    if (action !== 'list') return json({ error: 'Acción no válida.' }, 400)
    const limit = Math.max(1, Math.min(Number(body?.limit) || 50, 100))
    const data = await mondayRequest(env.MONDAY_API_TOKEN, `query ($board: [ID!], $limit: Int!) {
      boards(ids: $board) {
        id
        name
        items_page(limit: $limit) {
          items {
            id
            name
            updated_at
            url
            group { id title }
            column_values { id type text value column { title } }
          }
        }
      }
    }`, { board: [env.MONDAY_COMMUNICATIONS_BOARD_ID], limit })

    const map = readColumnMap(env)
    const board = data?.boards?.[0]
    let items = board?.items_page?.items || []
    if (env.MONDAY_COMMUNICATIONS_GROUP_ID) items = items.filter((item: any) => item?.group?.id === env.MONDAY_COMMUNICATIONS_GROUP_ID)
    const requests = items.map((item: any) => {
      const get = (key: string) => columnText(item, asArray(map[key]))
      const type = get('type')
      const details = get('details')
      const summary = get('summary') || details.split(/\n+/).find(Boolean)?.slice(0, 220) || ''
      return {
        id: String(item.id),
        name: String(item.name || 'Solicitud sin título'),
        url: item.url || '',
        updated_at: item.updated_at || '',
        status: get('status'),
        kind: parseKind(type),
        type,
        requester: get('requester'),
        email: get('email'),
        priority: get('priority'),
        deadline: get('deadline'),
        country: get('country'),
        company: get('company'),
        plant: get('plant'),
        department: get('department'),
        audience: get('audience'),
        summary,
        details,
        channel: get('channel'),
      }
    })
    return json({ ok: true, board: { id: String(board?.id || ''), name: board?.name || 'Monday' }, requests })
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'No se pudo consultar Monday.' }, 502)
  }
})
