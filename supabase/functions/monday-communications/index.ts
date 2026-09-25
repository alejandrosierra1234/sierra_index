import { createClient } from 'npm:@supabase/supabase-js@2'

type ColumnMap = Record<string, string | string[]>

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-user-authorization, x-client-info, apikey, content-type',
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
  correlativo: ['Correlativo'],
  priority: ['Prioridad'],
  deadline: ['Fecha requerida de envío', 'Fecha requerida', 'Entrega', 'Fecha límite'],
  country: ['¿A qué país aplica?', 'País', 'Country'],
  company: ['¿A qué empresas o plantas aplica?', 'Empresa', 'Empresa / planta', 'Empresa/planta'],
  plant: ['¿A qué empresas o plantas aplica?', 'Planta', 'Empresa / planta', 'Empresa/planta'],
  department: ['¿Qué área(s) emiten el memorándum?', 'Departamento', 'Área', 'Area'],
  authorities: ['Autoridad(es) requerida(s)'],
  authorityTitles: ['Cargo(s) de autoridad'],
  signatures: ['Firma(s) PNG'],
  audience: ['¿A quién va dirigido?', 'Audiencia', 'Dirigido a', 'Destinatario'],
  specificRecipients: ['¿A quiénes específicamente?'],
  objective: ['Objetivo del comunicado'],
  requiredInfo: ['Puntos clave obligatorios'],
  actionRequired: ['¿Los destinatarios deben realizar alguna acción?'],
  action: ['¿Qué deben hacer?'],
  effectiveDate: ['¿Cuándo entra en vigencia?'],
  attachments: ['Archivos de referencia'],
  sierraId: ['SIERRA Index ID'],
  editorUrl: ['Editor SIERRA Index'],
  finalPdf: ['PDF final'],
  syncStatus: ['Estado de sincronización'],
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

function splitList(value: string) {
  return [...new Set(String(value || '').split(/\n+|\s*[;|]\s*|\s+·\s+/).map(part => part.replace(/^[-•]\s*/, '').trim()).filter(Boolean))]
}

function parseKind(value: string, memoOnly = false) {
  if (memoOnly) return 'memo'
  const n = normalize(value)
  if (n.includes('convoc')) return 'convocatoria'
  if (n.includes('aviso')) return 'aviso'
  if (n.includes('memo')) return 'memo'
  return 'circular'
}

function mondayHeaders(token: string) {
  return { Authorization: token, 'Content-Type': 'application/json', 'API-Version': '2025-04' }
}

function supabaseClientKey() {
  const publishableKeys = Deno.env.get('SUPABASE_PUBLISHABLE_KEYS') || ''
  try {
    const parsed = JSON.parse(publishableKeys)
    const first = Object.values(parsed).find(value => typeof value === 'string')
    if (first) return String(first)
  } catch {
    // Older projects only expose the legacy anon key.
  }
  return Deno.env.get('SUPABASE_ANON_KEY') || ''
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
  const authorization = req.headers.get('x-user-authorization') || req.headers.get('Authorization') || ''
  return authorizeToken(authorization, env)
}

async function authorizeToken(authorization: string, env: Record<string, string>) {
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
      SUPABASE_ANON_KEY: supabaseClientKey(),
      MONDAY_API_TOKEN: Deno.env.get('MONDAY_API_TOKEN') || '',
      MONDAY_COMMUNICATIONS_BOARD_ID: Deno.env.get('MONDAY_COMMUNICATIONS_BOARD_ID') || '',
      MONDAY_COMMUNICATIONS_GROUP_ID: Deno.env.get('MONDAY_COMMUNICATIONS_GROUP_ID') || '',
      MONDAY_COMMUNICATIONS_STATUS_COLUMN_ID: Deno.env.get('MONDAY_COMMUNICATIONS_STATUS_COLUMN_ID') || '',
      MONDAY_COMMUNICATIONS_CLAIM_STATUS: Deno.env.get('MONDAY_COMMUNICATIONS_CLAIM_STATUS') || 'En diseño',
      MONDAY_COMMUNICATIONS_COLUMN_MAP: Deno.env.get('MONDAY_COMMUNICATIONS_COLUMN_MAP') || '',
      MONDAY_COMMUNICATIONS_MEMO_ONLY: Deno.env.get('MONDAY_COMMUNICATIONS_MEMO_ONLY') || '',
    }
    let body: any
    try { body = await req.json() } catch { return json({ error: 'Solicitud no válida.' }, 400) }
    const bodyToken = typeof body?._auth_token === 'string' ? body._auth_token : ''
    delete body?._auth_token
    const auth = await authorizeToken(bodyToken ? `Bearer ${bodyToken}` : (req.headers.get('x-user-authorization') || req.headers.get('Authorization') || ''), env)
    if (auth.error) return auth.error
    const action = body?.action || 'list'
    if (!env.MONDAY_API_TOKEN || !/^\d+$/.test(env.MONDAY_COMMUNICATIONS_BOARD_ID)) {
      return json({ error: 'Falta configurar MONDAY_API_TOKEN y MONDAY_COMMUNICATIONS_BOARD_ID en Supabase.' })
    }

    if (action === 'claim' || action === 'sync_draft') {
      if (!auth.canWrite) return json({ error: 'Necesitas permiso de edición en Comunicaciones.' }, 403)
      const itemId = String(body?.item_id || '')
      if (!/^\d+$/.test(itemId)) return json({ error: 'Solicitud de Monday no válida.' }, 400)
      if (action === 'claim' && env.MONDAY_COMMUNICATIONS_STATUS_COLUMN_ID) {
        await mondayRequest(env.MONDAY_API_TOKEN, `mutation ($board: ID!, $item: ID!, $column: String!, $value: String!) {
          change_simple_column_value(board_id: $board, item_id: $item, column_id: $column, value: $value) { id }
        }`, {
          board: env.MONDAY_COMMUNICATIONS_BOARD_ID,
          item: itemId,
          column: env.MONDAY_COMMUNICATIONS_STATUS_COLUMN_ID,
          value: env.MONDAY_COMMUNICATIONS_CLAIM_STATUS,
        })
      }
      if (action === 'sync_draft') {
        const schema = await mondayRequest(env.MONDAY_API_TOKEN, `query ($board: [ID!]) { boards(ids: $board) { columns { id title type } } }`, { board: [env.MONDAY_COMMUNICATIONS_BOARD_ID] })
        const columns = schema?.boards?.[0]?.columns || []
        const byTitle = (title: string) => columns.find((column: any) => normalize(column?.title) === normalize(title))
        const writes: any[] = [
          { column: byTitle('SIERRA Index ID'), value: String(body?.sierra_id || ''), complex: false },
          { column: byTitle('Editor SIERRA Index'), value: { url: String(body?.editor_url || ''), text: 'Abrir editor SIERRA Index' }, complex: true },
          { column: byTitle('Estado de sincronización'), value: 'Sincronizado', complex: false },
        ].filter(write => write.column && (write.complex ? write.value.url : write.value))
        for (const write of writes) {
          if (write.complex) await mondayRequest(env.MONDAY_API_TOKEN, `mutation ($board: ID!, $item: ID!, $column: String!, $value: JSON!) { change_column_value(board_id: $board, item_id: $item, column_id: $column, value: $value) { id } }`, { board: env.MONDAY_COMMUNICATIONS_BOARD_ID, item: itemId, column: write.column.id, value: JSON.stringify(write.value) })
          else await mondayRequest(env.MONDAY_API_TOKEN, `mutation ($board: ID!, $item: ID!, $column: String!, $value: String!) { change_simple_column_value(board_id: $board, item_id: $item, column_id: $column, value: $value) { id } }`, { board: env.MONDAY_COMMUNICATIONS_BOARD_ID, item: itemId, column: write.column.id, value: write.value })
        }
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
      const memoOnly = ['1', 'true', 'yes', 'si', 'sí'].includes(normalize(env.MONDAY_COMMUNICATIONS_MEMO_ONLY))
      const details = get('details')
      const summary = get('summary') || details.split(/\n+/).find(Boolean)?.slice(0, 220) || ''
      return {
        id: String(item.id),
        name: String(item.name || 'Solicitud sin título'),
        url: item.url || '',
        updated_at: item.updated_at || '',
        status: get('status'),
        kind: parseKind(type, memoOnly),
        type,
        requester: get('requester'),
        email: get('email'),
        correlativo: get('correlativo'),
        priority: get('priority'),
        deadline: get('deadline'),
        country: get('country'),
        company: get('company'),
        plant: get('plant'),
        department: get('department'),
        issuingAreas: splitList(get('department')),
        authorities: splitList(get('authorities')),
        authorityTitles: splitList(get('authorityTitles')),
        signatures: splitList(get('signatures')),
        audience: get('audience'),
        specificRecipients: get('specificRecipients'),
        objective: get('objective'),
        requiredInfo: get('requiredInfo'),
        actionRequired: get('actionRequired'),
        action: get('action'),
        effectiveDate: get('effectiveDate'),
        attachments: splitList(get('attachments')).map(name => ({ name, url: '' })),
        summary,
        details,
        channel: get('channel'),
      }
    })
    return json({ ok: true, board: { id: String(board?.id || ''), name: board?.name || 'Monday' }, requests })
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'No se pudo consultar Monday.' })
  }
})
