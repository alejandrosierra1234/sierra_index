import { createClient } from 'npm:@supabase/supabase-js@2'
import * as pdfLib from 'npm:pdf-lib@1.17.1'
import { Resvg, initWasm } from 'npm:@resvg/resvg-wasm@2.6.2'
import { createJustifiedAbsencePdf } from '../_shared/justified-absence-pdf.js'

const BOARD_ID = '18400606831'
const STATUS_COLUMN_ID = 'estado8'
const OUTPUT_COLUMN_ID = 'file_mkwhv1s1'
const TARGET_STATUS = 'Finalizado'
const WEBHOOK_SECRET_SHA256 = '29722206fbe477ae733df01a866879e76101e8e1eab54e814338d16fae5860de'
const COLUMNS = Object.freeze({
  identification:'n_mero__1', email:'correo_electr_nico_mkmvqc1m', evidence:'cargar_archivo__1', requestDate:'fecha__1',
  timeType:'selecci_n_m_ltiple', fullDates:'intervalo_de_fechas__1', partialDates:'intervalo_de_fechas1__1',
  partialTime:'selecci_n__nica__1', totalDays:'f_rmula2', reason:'selecci_n__nica0__1', specificReason:'selecci_n__nica3__1',
  status:'estado8', department:'estado_10', comments:'long_text_mkp04aw8', employeeSignature:'firma__1',
  manager:'personas__1', hr:'personas7__1', hrComment:'texto__1', onTime:'f_rmula41__1', approvalDate:'fecha_mkmvab8h',
  output:'file_mkwhv1s1',
})
const ITEM_COLUMNS = Object.values(COLUMNS)
const cors = {
  'Access-Control-Allow-Origin':'*',
  'Access-Control-Allow-Headers':'authorization, content-type',
  'Access-Control-Allow-Methods':'POST, OPTIONS',
}
const json = (body:unknown, status=200) => new Response(JSON.stringify(body), { status, headers:{ ...cors, 'Content-Type':'application/json' } })
const clean = (value:unknown) => String(value ?? '').trim()
const normalize = (value:unknown) => clean(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
const safeFileToken = (value:unknown) => normalize(value).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'colaborador'
const mondayHeaders = (token:string) => ({ Authorization:token, 'Content-Type':'application/json', 'API-Version':'2025-04' })

async function sha256Hex(value:string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2,'0')).join('')
}
async function webhookAuthorized(suppliedSecret:string) {
  if (!suppliedSecret) return false
  const environmentSecret = Deno.env.get('MONDAY_ABSENCE_WEBHOOK_SECRET') || ''
  if (environmentSecret) return suppliedSecret === environmentSecret
  return (await sha256Hex(suppliedSecret)) === WEBHOOK_SECRET_SHA256
}

async function mondayRequest(token:string, query:string, variables:Record<string,unknown>) {
  const response = await fetch('https://api.monday.com/v2', { method:'POST', headers:mondayHeaders(token), body:JSON.stringify({ query, variables }), signal:AbortSignal.timeout(20000) })
  const payload = await response.json().catch(() => null)
  if (!response.ok || payload?.errors?.length) throw new Error(payload?.errors?.map((error:any) => error.message).join(' - ') || `Monday respondió ${response.status}.`)
  return payload?.data
}

function column(item:any, id:string) { return (item?.column_values || []).find((entry:any) => entry?.id === id) }
function columnText(item:any, id:string) {
  const source = column(item,id)
  return clean(source?.display_value ?? source?.text)
}
function columnFiles(item:any, id:string) {
  return (column(item,id)?.files || []).map((entry:any) => entry?.asset).filter(Boolean)
}
function parseTimeline(item:any, id:string) {
  const source = column(item,id)
  try {
    const value = JSON.parse(source?.value || '{}')
    if (value?.from || value?.to) return { from:clean(value.from), to:clean(value.to || value.from) }
  } catch { /* monday also exposes a formatted text fallback */ }
  const dates = clean(source?.text).match(/\d{4}-\d{2}-\d{2}/g) || []
  return { from:dates[0] || '', to:dates[1] || dates[0] || '' }
}
function eventDate(value:unknown) {
  const date = new Date(clean(value))
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-CA', { timeZone:'America/Guatemala', year:'numeric', month:'2-digit', day:'2-digit' }).format(date)
}
function folio(requestDate:string, identification:string, itemId:string) {
  const date = requestDate.replaceAll('-','').slice(2)
  const idTail = clean(identification).replace(/\D/g,'').slice(-6)
  return ['IJ', date, idTail || itemId].filter(Boolean).join('-')
}
function combinedReason(item:any) {
  const reason = columnText(item,COLUMNS.reason)
  const specific = columnText(item,COLUMNS.specificReason)
  return specific && normalize(reason) === 'sujeto a aprobacion' ? `${reason}: ${specific}` : (specific || reason)
}
function evidenceLabel(item:any) {
  const files = columnFiles(item,COLUMNS.evidence)
  if (!files.length) return 'Sin constancia adjunta'
  return files.length === 1 ? '1 constancia adjunta' : `${files.length} constancias adjuntas`
}
function onTimeLabel(value:string) {
  if (value.includes('🏳️')) return 'Sí'
  if (value.includes('🚩')) return 'Fuera de tiempo'
  return value
}

async function fetchItem(token:string, itemId:string) {
  const data = await mondayRequest(token, `query ($ids:[ID!]!, $columns:[String!]) {
    items(ids:$ids) {
      id name created_at board { id }
      column_values(ids:$columns) {
        id type text value
        ... on FormulaValue { display_value }
        ... on FileValue { files { ... on FileAssetValue { asset { id name url public_url file_extension } } } }
      }
    }
  }`, { ids:[itemId], columns:ITEM_COLUMNS })
  return data?.items?.[0] || null
}

async function companyIdentity() {
  const url = Deno.env.get('SUPABASE_URL') || ''
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
  if (!url || !key) return { name:'Pride Yarn', logoUrl:'' }
  const client = createClient(url, key, { auth:{ persistSession:false, autoRefreshToken:false } })
  let result = await client.from('companies').select('name, legal_name, code, logo_url').eq('code','P&Y').limit(1).maybeSingle()
  if (result.error || !result.data) result = await client.from('companies').select('name, legal_name, code, logo_url').ilike('name','%Pride Yarn%').limit(1).maybeSingle()
  const company:any = result.data || {}
  return { name:company.legal_name || company.name || 'Pride Yarn', logoUrl:company.logo_url || '' }
}

let resvgInitialization:Promise<void> | null = null
async function svgToPng(bytes:Uint8Array) {
  if (!resvgInitialization) resvgInitialization = initWasm(fetch('https://unpkg.com/@resvg/resvg-wasm@2.6.2/index_bg.wasm'))
  await resvgInitialization
  const renderer = new Resvg(bytes, { fitTo:{ mode:'width', value:1200 }, font:{ loadSystemFonts:false } })
  try { return renderer.render().asPng() } finally { renderer.free() }
}
async function pdfImage(bytes:Uint8Array, mime:string, source='') {
  const normalizedMime = clean(mime).split(';')[0].toLowerCase()
  if (normalizedMime === 'image/svg+xml' || /\.svg(?:$|[?#])/i.test(source)) return { bytes:await svgToPng(bytes), mime:'image/png' }
  if (!['image/png','image/jpeg','image/jpg'].includes(normalizedMime)) return null
  return { bytes, mime:normalizedMime }
}
async function fetchImage(url:string, token='') {
  if (!url) return null
  const response = await fetch(url, { headers:token ? { Authorization:token } : {}, signal:AbortSignal.timeout(15000) })
  if (!response.ok) return null
  return pdfImage(new Uint8Array(await response.arrayBuffer()), response.headers.get('content-type') || '', url)
}
function storageLocation(url:string) {
  try {
    const parsed = new URL(url)
    const match = parsed.pathname.match(/\/storage\/v1\/object\/(?:public|sign)\/([^/]+)\/(.+)$/)
    return match ? { bucket:decodeURIComponent(match[1]), path:decodeURIComponent(match[2]) } : null
  } catch { return null }
}
async function fetchCompanyLogo(url:string) {
  const direct = await fetchImage(url).catch(() => null)
  if (direct) return direct
  const location = storageLocation(url)
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
  if (!location || !supabaseUrl || !serviceKey) return null
  const client = createClient(supabaseUrl, serviceKey, { auth:{ persistSession:false, autoRefreshToken:false } })
  const { data, error } = await client.storage.from(location.bucket).download(location.path)
  if (error || !data) return null
  return pdfImage(new Uint8Array(await data.arrayBuffer()), data.type || '', location.path)
}

async function uploadPdf(token:string, itemId:string, fileName:string, bytes:Uint8Array) {
  const query = `mutation ($file:File!) { add_file_to_column(item_id:${itemId}, column_id:"${OUTPUT_COLUMN_ID}", file:$file) { id name } }`
  const form = new FormData()
  form.append('query', query)
  form.append('variables[file]', new Blob([bytes], { type:'application/pdf' }), fileName)
  const response = await fetch('https://api.monday.com/v2/file', { method:'POST', headers:{ Authorization:token, 'API-Version':'2025-04' }, body:form, signal:AbortSignal.timeout(30000) })
  const payload = await response.json().catch(() => null)
  if (!response.ok || payload?.errors?.length) throw new Error(payload?.errors?.map((error:any) => error.message).join(' - ') || `No se pudo subir la boleta (${response.status}).`)
  return payload?.data?.add_file_to_column
}
async function addUpdate(token:string, itemId:string, message:string) {
  await mondayRequest(token, `mutation ($item:ID!, $body:String!) { create_update(item_id:$item, body:$body) { id } }`, { item:itemId, body:message })
}

async function processEvent(event:any, token:string) {
  const itemId = clean(event?.pulseId || event?.itemId)
  if (!/^\d+$/.test(itemId)) throw new Error('El webhook no incluyó un elemento válido.')
  const item = await fetchItem(token, itemId)
  if (!item || clean(item.board?.id) !== BOARD_ID) throw new Error('El elemento no pertenece al tablero configurado.')
  if (normalize(columnText(item,COLUMNS.status)) !== normalize(TARGET_STATUS)) return { skipped:true, reason:'El estado actual ya no es Finalizado.' }
  const outputName = `boleta-inasistencia-justificada-${itemId}.pdf`
  if (columnFiles(item,COLUMNS.output).some((asset:any) => clean(asset?.name) === outputName)) return { skipped:true, reason:'La boleta ya existe.' }

  const identity = await companyIdentity()
  const timeType = columnText(item,COLUMNS.timeType)
  const full = parseTimeline(item,COLUMNS.fullDates)
  const partial = parseTimeline(item,COLUMNS.partialDates)
  const period = normalize(timeType).includes('parcial') ? partial : full
  const requestDate = columnText(item,COLUMNS.requestDate) || eventDate(item.created_at)
  const signatureAsset = columnFiles(item,COLUMNS.employeeSignature)[0]
  const comments = [columnText(item,COLUMNS.comments), columnText(item,COLUMNS.hrComment)].filter(Boolean).join(' · ')
  const data = {
    companyName:identity.name,
    folio:folio(requestDate, columnText(item,COLUMNS.identification), itemId),
    requestDate,
    employeeName:clean(item.name),
    identification:columnText(item,COLUMNS.identification),
    email:columnText(item,COLUMNS.email),
    department:columnText(item,COLUMNS.department),
    reason:combinedReason(item),
    timeType,
    partialTime:normalize(timeType).includes('parcial') ? columnText(item,COLUMNS.partialTime) : 'No aplica',
    startDate:period.from,
    endDate:period.to,
    totalDays:columnText(item,COLUMNS.totalDays),
    evidence:evidenceLabel(item),
    manager:columnText(item,COLUMNS.manager) || 'Pendiente',
    hr:columnText(item,COLUMNS.hr) || 'Pendiente',
    approvalDate:columnText(item,COLUMNS.approvalDate) || eventDate(event?.triggerTime || event?.triggered_at) || requestDate,
    status:columnText(item,COLUMNS.status),
    onTime:onTimeLabel(columnText(item,COLUMNS.onTime)),
    comments,
  }
  const [logo, employeeSignature] = await Promise.all([
    fetchCompanyLogo(identity.logoUrl),
    fetchImage(signatureAsset?.public_url || signatureAsset?.url || '', token).catch(() => null),
  ])
  const bytes = await createJustifiedAbsencePdf(pdfLib, data, { logo, employeeSignature })
  await uploadPdf(token, itemId, outputName, bytes)
  await addUpdate(token, itemId, '<b>Boleta de inasistencia justificada generada</b><br>SIERRA Index creó ORIGINAL y COPIA en una hoja carta y adjuntó el PDF en la columna Archivo.')
  return { ok:true, itemId, fileName:outputName, employee:safeFileToken(item.name) }
}

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers:cors })
  if (req.method !== 'POST') return json({ error:'Método no permitido.' }, 405)
  const body = await req.json().catch(() => null)
  const suppliedSecret = new URL(req.url).searchParams.get('secret') || ''
  if (!(await webhookAuthorized(suppliedSecret))) return json({ error:'Webhook no autorizado.' }, 401)
  if (body?.challenge) return json({ challenge:body.challenge })
  const event = body?.event
  const label = clean(event?.value?.label?.text || event?.value?.label)
  if (clean(event?.boardId) !== BOARD_ID || clean(event?.columnId) !== STATUS_COLUMN_ID || normalize(label) !== normalize(TARGET_STATUS)) return json({ ok:true, skipped:true })
  const token = Deno.env.get('MONDAY_API_TOKEN') || ''
  if (!token) return json({ error:'Falta configurar MONDAY_API_TOKEN.' }, 500)
  const task = processEvent(event, token).catch(async error => {
    console.error('monday justified absence webhook:', error)
    const itemId = clean(event?.pulseId || event?.itemId)
    if (/^\d+$/.test(itemId)) await addUpdate(token, itemId, `<b>No se pudo generar la boleta</b><br>${clean(error?.message || error)}`).catch(() => {})
  })
  const runtime = (globalThis as any).EdgeRuntime
  if (runtime?.waitUntil) runtime.waitUntil(task)
  else await task
  return json({ ok:true, queued:true })
})

export { COLUMNS, BOARD_ID, STATUS_COLUMN_ID, OUTPUT_COLUMN_ID, TARGET_STATUS, WEBHOOK_SECRET_SHA256, parseTimeline, eventDate, folio, combinedReason, evidenceLabel, onTimeLabel, processEvent }
