import { createClient } from 'npm:@supabase/supabase-js@2'
import * as pdfLib from 'npm:pdf-lib@1.17.1'
import { createVacationPdf } from '../_shared/vacation-pdf.js'

const BOARD_ID = '7729506932'
const STATUS_COLUMN_ID = 'estado8'
const OUTPUT_COLUMN_ID = 'file_mm824tqy'
const TARGET_STATUS = 'Finalizado'
const COLUMNS = Object.freeze({
  dni:'n_mero__1', code:'short_textpir5roep', requestDate:'fecha__1', timeType:'selecci_n_m_ltiple',
  fullDates:'intervalo_de_fechas__1', partialDates:'intervalo_de_fechas1__1', partialTime:'selecci_n__nica__1',
  requestedDays:'f_rmula2', status:'estado8', department:'estado_10', manager:'personas__1', hr:'personas7__1',
  observations:'texto__1', managerSignature:'file_mm3a6972', employeeSignature:'file_mm3aqbzz', output:'file_mm824tqy',
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

async function mondayRequest(token:string, query:string, variables:Record<string,unknown>) {
  const response = await fetch('https://api.monday.com/v2', { method:'POST', headers:mondayHeaders(token), body:JSON.stringify({ query, variables }), signal:AbortSignal.timeout(20000) })
  const payload = await response.json().catch(() => null)
  if (!response.ok || payload?.errors?.length) throw new Error(payload?.errors?.map((error:any) => error.message).join(' - ') || `Monday respondió ${response.status}.`)
  return payload?.data
}

function column(item:any, id:string) { return (item?.column_values || []).find((entry:any) => entry?.id === id) }
function columnText(item:any, id:string) { return clean(column(item,id)?.text) }
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
function nextDate(value:string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return ''
  const date = new Date(`${value}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + 1)
  return date.toISOString().slice(0,10)
}
function folio(requestDate:string, code:string, itemId:string) {
  const date = requestDate.replaceAll('-','').slice(2)
  return [date, clean(code) || itemId].filter(Boolean).join('-')
}

async function fetchItem(token:string, itemId:string) {
  const data = await mondayRequest(token, `query ($ids:[ID!]!, $columns:[String!]) {
    items(ids:$ids) {
      id name board { id }
      column_values(ids:$columns) {
        id type text value
        ... on FileValue { files { ... on FileAssetValue { asset { id name url public_url file_extension } } } }
      }
    }
  }`, { ids:[itemId], columns:ITEM_COLUMNS })
  return data?.items?.[0] || null
}

async function companyIdentity() {
  const url = Deno.env.get('SUPABASE_URL') || ''
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
  if (!url || !key) return { name:'Northern Textiles, S.A. de C.V.', logoUrl:'' }
  const client = createClient(url, key, { auth:{ persistSession:false, autoRefreshToken:false } })
  let result = await client.from('companies').select('name, legal_name, code, logo_url').eq('code','NT').limit(1).maybeSingle()
  if (result.error || !result.data) result = await client.from('companies').select('name, legal_name, code, logo_url').ilike('name','%Northern Textiles%').limit(1).maybeSingle()
  const company:any = result.data || {}
  return { name:company.legal_name || company.name || 'Northern Textiles, S.A. de C.V.', logoUrl:company.logo_url || '' }
}

async function fetchImage(url:string, token='') {
  if (!url) return null
  const response = await fetch(url, { headers:token ? { Authorization:token } : {}, signal:AbortSignal.timeout(15000) })
  if (!response.ok) return null
  const mime = clean(response.headers.get('content-type')).split(';')[0].toLowerCase()
  if (!['image/png','image/jpeg','image/jpg'].includes(mime)) return null
  return { bytes:new Uint8Array(await response.arrayBuffer()), mime }
}

async function firstImageAsset(assets:any[], token:string) {
  const asset = assets.find(entry => /\.(?:png|jpe?g)$/i.test(entry?.name || '') || /^(?:png|jpe?g)$/i.test(entry?.file_extension || ''))
  return asset ? fetchImage(asset.public_url || asset.url || '', token) : null
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
  const outputName = `boleta-vacaciones-${itemId}.pdf`
  if (columnFiles(item,COLUMNS.output).some((asset:any) => clean(asset?.name) === outputName)) return { skipped:true, reason:'La boleta ya existe.' }

  const identity = await companyIdentity()
  const timeType = columnText(item,COLUMNS.timeType)
  const full = parseTimeline(item,COLUMNS.fullDates)
  const partial = parseTimeline(item,COLUMNS.partialDates)
  const period = normalize(timeType).includes('parcial') ? partial : full
  const requestDate = columnText(item,COLUMNS.requestDate)
  const code = columnText(item,COLUMNS.code)
  const employeeName = clean(item.name)
  const manager = columnText(item,COLUMNS.manager)
  const hr = columnText(item,COLUMNS.hr)
  const data = {
    companyName:identity.name,
    folio:folio(requestDate, code, itemId),
    employeeCode:code,
    requestDate,
    employeeName,
    identification:columnText(item,COLUMNS.dni),
    department:columnText(item,COLUMNS.department),
    site:'Northern Textiles',
    timeType,
    startDate:period.from,
    endDate:period.to,
    returnDate:nextDate(period.to),
    requestedDays:columnText(item,COLUMNS.requestedDays),
    status:columnText(item,COLUMNS.status),
    partialTime:normalize(timeType).includes('parcial') ? columnText(item,COLUMNS.partialTime) : '',
    managerApproval:manager ? `Aprobado - ${manager}` : 'Aprobado',
    hrApproval:hr ? `Finalizado - ${hr}` : TARGET_STATUS,
    observations:columnText(item,COLUMNS.observations),
  }
  const [logo, employeeSignature, managerSignature] = await Promise.all([
    fetchImage(identity.logoUrl),
    firstImageAsset(columnFiles(item,COLUMNS.employeeSignature), token),
    firstImageAsset(columnFiles(item,COLUMNS.managerSignature), token),
  ])
  const bytes = await createVacationPdf(pdfLib, data, { logo, employeeSignature, managerSignature })
  await uploadPdf(token, itemId, outputName, bytes)
  await addUpdate(token, itemId, `<b>Boleta de vacaciones generada</b><br>SIERRA Index creó ORIGINAL y COPIA en una hoja carta y adjuntó el PDF en la columna Boleta.`)
  return { ok:true, itemId, fileName:outputName, employee:safeFileToken(employeeName) }
}

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers:cors })
  if (req.method !== 'POST') return json({ error:'Método no permitido.' }, 405)
  const body = await req.json().catch(() => null)
  const expectedSecret = Deno.env.get('MONDAY_VACATIONS_WEBHOOK_SECRET') || ''
  const suppliedSecret = new URL(req.url).searchParams.get('secret') || ''
  if (!expectedSecret || suppliedSecret !== expectedSecret) return json({ error:'Webhook no autorizado.' }, 401)
  if (body?.challenge) return json({ challenge:body.challenge })
  const event = body?.event
  const label = clean(event?.value?.label?.text || event?.value?.label)
  if (clean(event?.boardId) !== BOARD_ID || clean(event?.columnId) !== STATUS_COLUMN_ID || normalize(label) !== normalize(TARGET_STATUS)) {
    return json({ ok:true, skipped:true })
  }
  const token = Deno.env.get('MONDAY_API_TOKEN') || ''
  if (!token) return json({ error:'Falta configurar MONDAY_API_TOKEN.' }, 500)
  const task = processEvent(event, token).catch(async error => {
    console.error('monday vacation webhook:', error)
    const itemId = clean(event?.pulseId || event?.itemId)
    if (/^\d+$/.test(itemId)) await addUpdate(token, itemId, `<b>No se pudo generar la boleta</b><br>${clean(error?.message || error)}`).catch(() => {})
  })
  const runtime = (globalThis as any).EdgeRuntime
  if (runtime?.waitUntil) runtime.waitUntil(task)
  else await task
  return json({ ok:true, queued:true })
})

export { COLUMNS, BOARD_ID, STATUS_COLUMN_ID, OUTPUT_COLUMN_ID, TARGET_STATUS, parseTimeline, nextDate, folio, processEvent }
