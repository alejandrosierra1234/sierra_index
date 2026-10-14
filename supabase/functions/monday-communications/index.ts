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
  authorityEmails: ['Correo(s) de autoridad', 'Correos de autoridad', 'Correo de autoridad'],
  signatures: ['Firma(s) PNG'],
  audience: ['¿A quién va dirigido?', 'Audiencia', 'Dirigido a', 'Destinatario'],
  specificRecipients: ['¿A quiénes específicamente?'],
  aiDraft: ['Borrador IA del memorándum', 'ELIMINAR — Borrador IA del memorándum'],
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

const emailKey = (value: unknown) => String(value || '').trim().toLowerCase()
const escapeHtml = (value: unknown) => String(value || '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character] || character))
const cleanMemoToken = (value: unknown, fallback = '') => {
  const text = String(value || '').trim()
  return /^\[(?:correlativo|tema|asunto)\]$/i.test(normalize(text)) ? fallback : text || fallback
}
const validEmail = (value: unknown) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim())
const uniqueEmails = (values: unknown[]) => [...new Set(values.map(emailKey).filter(validEmail))]

function columnValue(item: any, title: string) {
  return (item?.column_values || []).find((value: any) => normalize(value?.column?.title) === normalize(title))
}

function columnValueText(item: any, title: string) {
  return String(columnValue(item, title)?.text || '').trim()
}

function parseDecisions(value: string) {
  try {
    const parsed = JSON.parse(value || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch { return [] }
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

const wait = (milliseconds: number) => new Promise(resolve => setTimeout(resolve, milliseconds))

async function mondayRequest(token: string, query: string, variables: Record<string, unknown>, options: { safeToRetry?: boolean } = {}) {
  const isRead = /^\s*query\b/i.test(query)
  const attempts = isRead || options.safeToRetry ? 3 : 1
  let lastError: any
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch('https://api.monday.com/v2', {
        method: 'POST',
        headers: mondayHeaders(token),
        body: JSON.stringify({ query, variables }),
        signal: AbortSignal.timeout(15000),
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok || payload?.errors?.length) {
        const message = payload?.errors?.map((error: any) => error?.message).filter(Boolean).join(' · ') || 'Monday no respondió correctamente.'
        const error: any = new Error(message)
        error.retryable = response.status === 429 || response.status >= 500
        throw error
      }
      return payload?.data
    } catch (error: any) {
      lastError = error
      const retryable = error?.retryable || error?.name === 'TimeoutError' || error?.name === 'AbortError' || error instanceof TypeError
      if (!retryable || attempt === attempts) break
      await wait(250 * (2 ** (attempt - 1)))
    }
  }
  throw lastError || new Error('Monday no respondió correctamente.')
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
  if (readError || writeError) return { error: json({ error: 'No se pudieron verificar tus permisos.' }, 403) }
  return { user: identity.user, canRead: canRead === true, canWrite: canWrite === true }
}

async function reviewContext(token: string, versionId: string, auth: any) {
  if (!/^\d+$/.test(versionId)) throw new Error('La versión solicitada no es válida.')
  const data = await mondayRequest(token, `query ($ids: [ID!]!) {
    items(ids: $ids) {
      id name board { id } parent_item { id }
      column_values {
        id type text value column { title }
        ... on FileValue { files { ... on FileAssetValue { asset { id name public_url url } } } }
      }
      updates(limit: 50) { id body created_at creator { name } }
    }
  }`, { ids: [versionId] })
  const item = data?.items?.[0]
  if (!item) throw new Error('No se encontró esta versión.')
  const required = splitList(columnValueText(item, 'Autorizadores requeridos')).map(emailKey).filter(Boolean)
  const requester = emailKey(columnValueText(item, 'Correo del solicitante'))
  const caller = emailKey(auth.user?.email)
  const isApprover = required.includes(caller)
  const isRequester = Boolean(requester && requester === caller)
  if (!isApprover && !isRequester && !auth.canRead) {
    const denied: any = new Error('Esta versión no está asignada a tu correo.')
    denied.status = 403
    throw denied
  }
  return { item, required, requester, caller, isApprover, isRequester }
}

async function boardColumns(token: string, boardId: string) {
  const data = await mondayRequest(token, `query ($ids: [ID!]) { boards(ids: $ids) { columns { id title type } } }`, { ids: [boardId] })
  return data?.boards?.[0]?.columns || []
}

function schemaColumn(columns: any[], title: string) {
  return columns.find(column => normalize(column?.title) === normalize(title))
}

async function setSimple(token: string, boardId: string, itemId: string, columnId: string | undefined, value: string) {
  if (!columnId) return
  await mondayRequest(token, `mutation ($board: ID!, $item: ID!, $column: String!, $value: String!) {
    change_simple_column_value(board_id: $board, item_id: $item, column_id: $column, value: $value) { id }
  }`, { board: boardId, item: itemId, column: columnId, value }, { safeToRetry: true })
}

async function setColumnsByTitle(token: string, boardId: string, itemId: string, columns: any[], entries: Record<string, unknown>) {
  const values: Record<string, unknown> = {}
  for (const [title, value] of Object.entries(entries)) {
    if (value === undefined || value === null) continue
    const column = schemaColumn(columns, title)
    if (column?.id) values[column.id] = value
  }
  if (!Object.keys(values).length) return
  await mondayRequest(token, `mutation ($board: ID!, $item: ID!, $values: JSON!) {
    change_multiple_column_values(board_id: $board, item_id: $item, column_values: $values) { id }
  }`, { board: boardId, item: itemId, values: JSON.stringify(values) }, { safeToRetry: true })
}

async function addUpdate(token: string, itemId: string, body: string) {
  await mondayRequest(token, `mutation ($item: ID!, $body: String!) { create_update(item_id: $item, body: $body) { id } }`, { item: itemId, body })
}

function reviewEmailHtml(payload: any) {
  const pendingApprovers = Array.isArray(payload?.pending_approvers) ? payload.pending_approvers : []
  const rows = [
    ['Correlativo', payload.folio],
    ['Tema', payload.memo_subject],
    ['Versión', payload.version_label],
    ['Aprobadores pendientes', pendingApprovers.join(', ') || 'No registrados'],
  ].map(([label, value]) => `<tr><td style="padding:6px 10px;color:#555;border-bottom:1px solid #eee">${escapeHtml(label)}</td><td style="padding:6px 10px;border-bottom:1px solid #eee">${escapeHtml(value)}</td></tr>`).join('')
  const summary = String(payload.summary || '').trim()
  return `<div style="font-family:Arial,sans-serif;color:#171717;line-height:1.45"><h2 style="margin:0 0 12px">Versión lista para revisión</h2><p>Se registró una nueva versión de memorándum en SIERRA Index.</p><table style="border-collapse:collapse;margin:14px 0">${rows}</table>${summary ? `<p><b>Resumen de cambios</b><br>${escapeHtml(summary).replace(/\n/g, '<br>')}</p>` : ''}${payload.review_url ? `<p><a href="${escapeHtml(payload.review_url)}" style="display:inline-block;background:#007d73;color:#fff;text-decoration:none;padding:10px 14px;border-radius:6px">Abrir revisión</a></p><p style="font-size:12px;color:#666">Enlace directo: ${escapeHtml(payload.review_url)}</p>` : ''}</div>`
}

async function sendReviewEmail(env: Record<string, string>, body: any) {
  const apiKey = env.RESEND_API_KEY
  if (!apiKey) return { sent: 0, skipped: true, reason: 'Falta configurar RESEND_API_KEY.' }
  const recipients = uniqueEmails(Array.isArray(body?.recipients) ? body.recipients : [])
  if (!recipients.length) return { sent: 0, skipped: true, reason: 'No hay destinatarios de correo válidos.' }
  const from = env.MEMO_REVIEW_EMAIL_FROM || 'SIERRA Index <noreply@sierratextiles.com>'
  const replyTo = validEmail(body?.requester_email) ? emailKey(body.requester_email) : undefined
  const subject = `Revisión de memo ${cleanMemoToken(body?.folio, 'sin correlativo')} · ${cleanMemoToken(body?.memo_subject, 'sin tema')}`
  const html = reviewEmailHtml(body)
  const text = [
    'Versión lista para revisión',
    `Correlativo: ${cleanMemoToken(body?.folio, 'sin correlativo')}`,
    `Tema: ${cleanMemoToken(body?.memo_subject, 'sin tema')}`,
    `Versión: ${cleanMemoToken(body?.version_label, '')}`,
    `Aprobadores pendientes: ${uniqueEmails(Array.isArray(body?.pending_approvers) ? body.pending_approvers : []).join(', ') || 'No registrados'}`,
    body?.summary ? `Resumen de cambios:\n${String(body.summary).trim()}` : '',
    body?.review_url ? `Abrir revisión: ${body.review_url}` : '',
  ].filter(Boolean).join('\n\n')
  let sent = 0
  for (const to of recipients) {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [to], subject, html, text, ...(replyTo ? { reply_to: replyTo } : {}) }),
    })
    const payload = await response.json().catch(() => null)
    if (!response.ok) throw new Error(payload?.message || payload?.error || 'No se pudo enviar el correo de revisión.')
    sent += 1
  }
  return { sent, skipped: false }
}

const operationMarker = (operationId: string) => operationId ? `<!--sierra-operation:${escapeHtml(operationId)}-->` : ''
const hasOperation = (item: any, operationId: string) => Boolean(operationId && (item?.updates || []).some((update: any) => String(update?.body || '').includes(operationMarker(operationId))))

function reviewPayload(context: any) {
  const item = context.item
  const decisions = parseDecisions(columnValueText(item, 'Decisiones individuales'))
  const pdfColumn: any = columnValue(item, 'PDF para revisión')
  const pdf = (pdfColumn?.files || []).map((file: any) => file?.asset).find(Boolean)
  const byEmail = new Map(decisions.map((decision: any) => [emailKey(decision.email), decision]))
  const pending = context.required.filter((email: string) => byEmail.get(email)?.decision !== 'Aprobado')
  return {
    id: String(item.id), name: item.name || 'Versión para revisión',
    version: columnValueText(item, 'Versión'), status: columnValueText(item, 'Estado de revisión') || 'En revisión',
    summary: columnValueText(item, 'Resumen de cambios'),
    pdf: pdf ? { name: pdf.name || 'PDF para revisión', url: pdf.public_url || pdf.url || '' } : null,
    requiredApprovers: context.required, decisions, pendingApprovers: pending,
    canDecide: context.isApprover, callerEmail: context.caller,
    comments: (item.updates || []).map((update: any) => ({ id: String(update.id), body: String(update.body || ''), createdAt: update.created_at, author: update.creator?.name || 'Usuario' })),
  }
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
      RESEND_API_KEY: Deno.env.get('RESEND_API_KEY') || '',
      MEMO_REVIEW_EMAIL_FROM: Deno.env.get('MEMO_REVIEW_EMAIL_FROM') || '',
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

    if (action === 'review_notify') {
      if (!auth.canWrite) return json({ error: 'Necesitas permiso de edición en Comunicaciones.' }, 403)
      return json({ ok: true, email: await sendReviewEmail(env, body) })
    }

    if (['review_get', 'review_comment', 'review_decide'].includes(action)) {
      const versionId = String(body?.version_id || '')
      let context = await reviewContext(env.MONDAY_API_TOKEN, versionId, auth)
      if (action === 'review_get') return json({ ok: true, review: reviewPayload(context) })

      const comment = String(body?.comment || '').trim().slice(0, 5000)
      const operationId = String(body?.operation_id || '').trim().slice(0, 100)
      if ((action === 'review_comment' || action === 'review_decide') && !/^[a-zA-Z0-9-]{16,100}$/.test(operationId)) {
        return json({ error: 'La operación no tiene un identificador seguro. Recarga la versión e inténtalo nuevamente.' }, 400)
      }
      const repeatedDecision = action === 'review_decide' && parseDecisions(columnValueText(context.item, 'Decisiones individuales')).some((entry: any) => entry?.operationId === operationId)
      if (hasOperation(context.item, operationId) || repeatedDecision) {
        return json({ ok: true, duplicate: true, review: reviewPayload(context) })
      }
      const actorName = String(auth.user?.user_metadata?.full_name || auth.user?.user_metadata?.name || auth.user?.email || 'Usuario')
      const versionLabel = columnValueText(context.item, 'Versión')
      const sourceItemId = columnValueText(context.item, 'Item original ID')
      const hasSource = /^\d+$/.test(sourceItemId)
      const sourceColumns = hasSource ? await boardColumns(env.MONDAY_API_TOKEN, env.MONDAY_COMMUNICATIONS_BOARD_ID) : []
      if (action === 'review_comment') {
        if (!comment) return json({ error: 'Escribe un comentario antes de enviarlo.' }, 400)
        await addUpdate(env.MONDAY_API_TOKEN, versionId, `<b>Comentario desde SIERRA Index</b><br>${escapeHtml(actorName)} · ${escapeHtml(auth.user?.email)}<br><br>${escapeHtml(comment).replace(/\n/g, '<br>')}${operationMarker(operationId)}`)
        if (hasSource) {
          await setColumnsByTitle(env.MONDAY_API_TOKEN, env.MONDAY_COMMUNICATIONS_BOARD_ID, sourceItemId, sourceColumns, {
            'Versión actual': versionLabel,
            'Último comentario de revisión': `${actorName}: ${comment}`,
          })
          await addUpdate(env.MONDAY_API_TOKEN, sourceItemId, `<b>Comentario en revisión ${escapeHtml(versionLabel)}</b><br>${escapeHtml(actorName)} · ${escapeHtml(auth.user?.email)}<br><br>${escapeHtml(comment).replace(/\n/g, '<br>')}`)
        }
        context = await reviewContext(env.MONDAY_API_TOKEN, versionId, auth)
        return json({ ok: true, review: reviewPayload(context) })
      }

      if (!context.isApprover) return json({ error: 'Solo una autoridad asignada puede registrar una decisión.' }, 403)
      const decision = body?.decision === 'Aprobado' ? 'Aprobado' : body?.decision === 'Cambios solicitados' ? 'Cambios solicitados' : ''
      if (!decision) return json({ error: 'Selecciona una decisión válida.' }, 400)
      if (decision === 'Cambios solicitados' && !comment) return json({ error: 'Describe el cambio solicitado.' }, 400)

      const current = parseDecisions(columnValueText(context.item, 'Decisiones individuales'))
      const nextDecision = { email: context.caller, name: actorName, decision, comment, decidedAt: new Date().toISOString(), operationId }
      const decisions = [...current.filter((entry: any) => emailKey(entry?.email) !== context.caller), nextDecision]
      const latest = new Map(decisions.map((entry: any) => [emailKey(entry.email), entry]))
      const pending = context.required.filter((email: string) => latest.get(email)?.decision !== 'Aprobado')
      const anyChanges = [...latest.values()].some((entry: any) => entry?.decision === 'Cambios solicitados')
      const allApproved = context.required.length > 0 && pending.length === 0 && !anyChanges
      const versionStatus = anyChanges ? 'Cambios solicitados' : allApproved ? 'Aprobada' : 'En revisión'
      const sourceStatus = anyChanges ? 'Requiere ajustes' : allApproved ? 'Aprobado' : 'En revisión'

      const versionBoardId = String(context.item.board?.id || '')
      const versionColumns = await boardColumns(env.MONDAY_API_TOKEN, versionBoardId)
      await setSimple(env.MONDAY_API_TOKEN, versionBoardId, versionId, schemaColumn(versionColumns, 'Decisiones individuales')?.id, JSON.stringify(decisions))
      await setSimple(env.MONDAY_API_TOKEN, versionBoardId, versionId, schemaColumn(versionColumns, 'Pendientes de aprobación')?.id, pending.join('\n'))
      await setSimple(env.MONDAY_API_TOKEN, versionBoardId, versionId, schemaColumn(versionColumns, 'Estado de revisión')?.id, versionStatus)

      const parentId = String(context.item.parent_item?.id || '')
      if (/^\d+$/.test(parentId)) {
        const parentData = await mondayRequest(env.MONDAY_API_TOKEN, `query ($ids: [ID!]!) { items(ids: $ids) { id board { id } } }`, { ids: [parentId] })
        const parentBoardId = String(parentData?.items?.[0]?.board?.id || '')
        const parentColumns = parentBoardId ? await boardColumns(env.MONDAY_API_TOKEN, parentBoardId) : []
        await setSimple(env.MONDAY_API_TOKEN, parentBoardId, parentId, schemaColumn(parentColumns, 'Estado general')?.id, versionStatus === 'Aprobada' ? 'Aprobado' : versionStatus)
      }

      if (hasSource) {
        await setColumnsByTitle(env.MONDAY_API_TOKEN, env.MONDAY_COMMUNICATIONS_BOARD_ID, sourceItemId, sourceColumns, {
          'Estado de aprobación': sourceStatus,
          'Versión actual': versionLabel,
          'Aprobaciones': `${context.required.length - pending.length} de ${context.required.length}`,
          'Pendientes de aprobación': pending.join('\n'),
          'Última decisión': `${actorName} — ${decision}`,
          'Último comentario de revisión': comment || undefined,
          'Próximo recordatorio de revisión': anyChanges || allApproved ? '' : undefined,
        })
      }

      const decisionUpdate = `<b>${escapeHtml(decision)} · decisión individual</b><br>${escapeHtml(actorName)} · ${escapeHtml(context.caller)}<br>${escapeHtml(new Date().toLocaleString('es-GT', { timeZone: 'America/Guatemala' }))}${comment ? `<br><br>${escapeHtml(comment).replace(/\n/g, '<br>')}` : ''}<br><br>${pending.length ? `Pendientes: ${escapeHtml(pending.join(', '))}` : 'Todas las autoridades requeridas aprobaron esta versión.'}${operationMarker(operationId)}`
      await addUpdate(env.MONDAY_API_TOKEN, versionId, decisionUpdate)
      if (hasSource) await addUpdate(env.MONDAY_API_TOKEN, sourceItemId, `<b>Revisión ${escapeHtml(versionLabel)}</b><br>${decisionUpdate}`)
      context = await reviewContext(env.MONDAY_API_TOKEN, versionId, auth)
      return json({ ok: true, review: reviewPayload(context) })
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
    if (!auth.canRead) return json({ error: 'Necesitas acceso a Comunicaciones.' }, 403)
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
      const itemName = cleanMemoToken(item.name, 'Solicitud sin título')
      return {
        id: String(item.id),
        name: itemName,
        url: item.url || '',
        updated_at: item.updated_at || '',
        status: get('status'),
        kind: parseKind(type, memoOnly),
        type,
        requester: get('requester'),
        email: get('email'),
        correlativo: cleanMemoToken(get('correlativo'), String(item.id)),
        priority: get('priority'),
        deadline: get('deadline'),
        country: get('country'),
        company: get('company'),
        plant: get('plant'),
        department: get('department'),
        issuingAreas: splitList(get('department')),
        authorities: splitList(get('authorities')),
        authorityTitles: splitList(get('authorityTitles')),
        authorityEmails: splitList(get('authorityEmails')),
        signatures: splitList(get('signatures')),
        audience: get('audience'),
        specificRecipients: get('specificRecipients'),
        aiDraft: get('aiDraft'),
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
    return json({ error: error instanceof Error ? error.message : 'No se pudo consultar Monday.' }, Number((error as any)?.status) || 200)
  }
})
