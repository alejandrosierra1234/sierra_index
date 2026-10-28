const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const SHA256 = /^[0-9a-f]{64}$/
const MIME = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'])

export class ApiError extends Error {
  constructor(status, code, message) { super(message); this.status = status; this.code = code }
}

const response = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), {
  status, headers: { ...JSON_HEADERS, ...headers },
})
const clean = (value, max = 200) => String(value || '').trim().slice(0, max)
const id = (value, label = 'identificador') => {
  const result = clean(value, 80)
  if (!UUID.test(result)) throw new ApiError(400, 'INVALID_ID', `El ${label} no es válido.`)
  return result
}
const bearer = req => {
  const value = req.headers.get('Authorization') || ''
  return value.startsWith('Bearer ') ? value.slice(7).trim() : ''
}
async function jsonBody(req, limit = 65536) {
  const length = Number(req.headers.get('content-length') || 0)
  if (length > limit) throw new ApiError(413, 'BODY_TOO_LARGE', 'La solicitud supera el límite permitido.')
  const text = await req.text()
  if (new TextEncoder().encode(text).length > limit) throw new ApiError(413, 'BODY_TOO_LARGE', 'La solicitud supera el límite permitido.')
  try { return text ? JSON.parse(text) : {} } catch { throw new ApiError(400, 'INVALID_JSON', 'La solicitud no contiene JSON válido.') }
}
function workspace(req, body = {}) {
  return id(req.headers.get('X-Signage-Workspace') || body.workspaceId, 'espacio de trabajo')
}
function clientIp(req) {
  return clean((req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || '').split(',')[0], 64) || 'unknown'
}
async function signalBody(req) {
  const signal = await jsonBody(req)
  if (!['offer', 'answer', 'candidate'].includes(signal?.type) || !signal?.payload || typeof signal.payload !== 'object') {
    throw new ApiError(400, 'INVALID_SIGNAL', 'La señal WebRTC no es válida.')
  }
  return signal
}

export function createSignageHandler(adapter, options = {}) {
  const prefix = options.prefix || '/signage-api'
  const corsOrigins = new Set(options.corsOrigins || [])
  const corsFor = req => {
    const origin = req.headers.get('Origin') || ''
    if (!origin) return {}
    if (!corsOrigins.has(origin)) throw new ApiError(403, 'ORIGIN_DENIED', 'Este origen no está autorizado.')
    return { 'Access-Control-Allow-Origin': origin, Vary: 'Origin', 'Access-Control-Allow-Headers': 'authorization, content-type, x-device-id, x-signage-workspace', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS' }
  }
  const admin = async (req, workspaceId, capability) => {
    const token = bearer(req)
    if (!token) throw new ApiError(401, 'ADMIN_AUTH_REQUIRED', 'Inicia sesión para continuar.')
    return adapter.authorizeAdmin(token, workspaceId, capability)
  }
  const device = async req => {
    const token = bearer(req)
    if (!token) throw new ApiError(401, 'DEVICE_AUTH_REQUIRED', 'La credencial del reproductor es obligatoria.')
    const deviceId = id(req.headers.get('X-Device-Id'), 'dispositivo')
    return adapter.authorizeDevice(deviceId, token)
  }

  return async req => {
    let cors = {}
    try {
      cors = corsFor(req)
      if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors })
      const url = new URL(req.url)
      let path = url.pathname
      const marker = path.indexOf(prefix)
      if (marker >= 0) path = path.slice(marker + prefix.length) || '/'

      if (req.method === 'GET' && path === '/health') return response({ ok: true, service: 'sierra-pantallas', storage: 'private', liveConfigured: await adapter.liveConfigured() }, 200, cors)
      if (req.method === 'GET' && path === '/player/runtime') return response(await adapter.playerRuntime(await device(req)), 200, cors)

      if (req.method === 'POST' && path === '/player/pairings') {
        await adapter.rateLimit(`pair-start:${clientIp(req)}`, 10, 60)
        return response(await adapter.createPairing(), 201, cors)
      }
      const pairingPoll = path.match(/^\/player\/pairings\/([^/]+)$/)
      if (req.method === 'GET' && pairingPoll) {
        await adapter.rateLimit(`pair-poll:${clientIp(req)}`, 120, 60)
        return response(await adapter.deliverPairing(clean(decodeURIComponent(pairingPoll[1]), 256)), 200, cors)
      }
      if (req.method === 'POST' && path === '/admin/pairings/claim') {
        const body = await jsonBody(req)
        const workspaceId = workspace(req, body)
        const actor = await admin(req, workspaceId, 'manage_devices')
        await adapter.rateLimit(`pair-claim-user:${actor.id}`, 10, 60)
        await adapter.rateLimit(`pair-claim-ip:${clientIp(req)}`, 30, 60)
        const name = clean(body.name, 120), code = clean(body.code, 6)
        if (!/^\d{6}$/.test(code)) throw new ApiError(400, 'INVALID_PAIRING_CODE', 'Escribe el código de seis dígitos.')
        if (!name) throw new ApiError(400, 'INVALID_DEVICE_NAME', 'Escribe un nombre para la pantalla.')
        return response(await adapter.claimPairing({ code, workspaceId, siteId: id(body.siteId, 'planta'), name, actorId: actor.id }), 201, cors)
      }
      const revoke = path.match(/^\/admin\/devices\/([^/]+)\/revoke$/)
      if (req.method === 'POST' && revoke) {
        const body = await jsonBody(req), workspaceId = workspace(req, body)
        const actor = await admin(req, workspaceId, 'manage_devices')
        const reason = clean(body.reason, 500)
        if (reason.length < 3) throw new ApiError(400, 'REASON_REQUIRED', 'Explica brevemente por qué se revoca la pantalla.')
        await adapter.revokeDevice({ workspaceId, deviceId: id(revoke[1], 'dispositivo'), reason, actorId: actor.id })
        return response({ state: 'revoked' }, 200, cors)
      }
      if (req.method === 'GET' && path === '/admin/devices') {
        const workspaceId = workspace(req), actor = await admin(req, workspaceId, 'read')
        return response(await adapter.listDevices({ workspaceId, actor }), 200, cors)
      }
      if (path === '/admin/content') {
        const body = req.method === 'POST' ? await jsonBody(req, 300000) : {}
        const workspaceId = workspace(req, body)
        const actor = await admin(req, workspaceId, req.method === 'POST' ? 'write' : 'read')
        if (req.method === 'GET') return response(await adapter.listContent({ workspaceId, actor }), 200, cors)
        if (req.method === 'POST') return response(await adapter.saveContent({ workspaceId, actor, content: body }), 201, cors)
      }
      const approve = path.match(/^\/admin\/content\/([^/]+)\/approve$/)
      if (req.method === 'POST' && approve) {
        const body = await jsonBody(req), workspaceId = workspace(req, body), actor = await admin(req, workspaceId, 'approve')
        return response(await adapter.approveContent({ workspaceId, actor, contentId: id(approve[1], 'contenido'), expectedRevision: body.expectedRevision }), 200, cors)
      }
      const publish = path.match(/^\/admin\/devices\/([^/]+)\/publish$/)
      if (req.method === 'POST' && publish) {
        const body = await jsonBody(req), workspaceId = workspace(req, body), actor = await admin(req, workspaceId, 'publish')
        return response(await adapter.publish({ workspaceId, actor, deviceId: id(publish[1], 'dispositivo'), contentId: id(body.contentId, 'contenido'), expectedRevision: body.expectedRevision }), 201, cors)
      }
      const rollback = path.match(/^\/admin\/devices\/([^/]+)\/rollback$/)
      if (req.method === 'POST' && rollback) {
        const body = await jsonBody(req), workspaceId = workspace(req, body), actor = await admin(req, workspaceId, 'publish')
        return response(await adapter.rollback({ workspaceId, actor, deviceId: id(rollback[1], 'dispositivo'), publicationId: id(body.publicationId, 'publicación'), expectedRevision: body.expectedRevision }), 201, cors)
      }
      if (req.method === 'POST' && path === '/admin/playlists') {
        const body = await jsonBody(req, 160000), workspaceId = workspace(req, body), actor = await admin(req, workspaceId, 'write')
        return response(await adapter.savePlaylist({ workspaceId, actor, playlist: body }), 201, cors)
      }
      if (req.method === 'POST' && path === '/admin/schedules') {
        const body = await jsonBody(req), workspaceId = workspace(req, body), actor = await admin(req, workspaceId, 'operate')
        return response(await adapter.saveSchedule({ workspaceId, actor, schedule: body }), 201, cors)
      }
      if (req.method === 'GET' && path === '/player/manifest') {
        const identity = await device(req)
        const result = await adapter.manifest(identity)
        return response(result, 200, { ...cors, ETag: `"device-${result.device_revision || 0}"` })
      }
      if (req.method === 'POST' && path === '/player/heartbeat') {
        const identity = await device(req), body = await jsonBody(req, 16384)
        return response(await adapter.heartbeat(identity, {
          playerVersion: clean(body.playerVersion, 40), status: clean(body.status, 40),
          lastManifestRevision: Number.isSafeInteger(body.lastManifestRevision) ? body.lastManifestRevision : null,
          storageFreeBytes: Number.isSafeInteger(body.storageFreeBytes) && body.storageFreeBytes >= 0 ? body.storageFreeBytes : null,
          errors: Array.isArray(body.errors) ? body.errors.slice(0, 20).map(item => clean(item, 500)) : [],
        }), 202, cors)
      }
      if (req.method === 'POST' && path === '/admin/uploads/sign') {
        const body = await jsonBody(req), workspaceId = workspace(req, body), actor = await admin(req, workspaceId, 'write')
        const type = clean(body.contentType, 100), size = Number(body.byteSize), sha256 = clean(body.sha256, 64).toLowerCase(), name = clean(body.fileName, 180)
        if (!MIME.has(type)) throw new ApiError(415, 'MEDIA_TYPE_DENIED', 'Ese formato de archivo no está permitido.')
        if (!Number.isSafeInteger(size) || size < 1 || size > 52428800) throw new ApiError(413, 'MEDIA_SIZE_DENIED', 'El archivo debe pesar entre 1 byte y 50 MB.')
        if (!SHA256.test(sha256)) throw new ApiError(400, 'MEDIA_HASH_REQUIRED', 'Se requiere el SHA-256 del archivo.')
        if (!name || /[\\/\0]/.test(name)) throw new ApiError(400, 'INVALID_FILE_NAME', 'El nombre del archivo no es válido.')
        return response(await adapter.signUpload({ workspaceId, actorId: actor.id, name, type, size, sha256 }), 201, cors)
      }
      const completeUpload = path.match(/^\/admin\/uploads\/([^/]+)\/complete$/)
      if (req.method === 'POST' && completeUpload) {
        const body = await jsonBody(req), workspaceId = workspace(req, body)
        await admin(req, workspaceId, 'write')
        return response(await adapter.completeUpload({ workspaceId, assetId: id(completeUpload[1], 'archivo') }), 200, cors)
      }

      if (req.method === 'POST' && path === '/admin/live-sessions') {
        const body = await jsonBody(req), workspaceId = workspace(req, body), actor = await admin(req, workspaceId, 'operate')
        if (!(await adapter.liveConfigured())) throw new ApiError(503, 'LIVE_NOT_CONFIGURED', 'La transmisión en vivo requiere configurar ICE/TURN.')
        return response(await adapter.startLive({ workspaceId, deviceId: id(body.deviceId, 'dispositivo'), actorId: actor.id }), 201, cors)
      }
      const liveStop = path.match(/^\/admin\/live-sessions\/([^/]+)\/stop$/)
      if (req.method === 'POST' && liveStop) {
        const body = await jsonBody(req), workspaceId = workspace(req, body)
        await admin(req, workspaceId, 'operate')
        return response(await adapter.stopLive({ workspaceId, sessionId: id(liveStop[1], 'transmisión') }), 200, cors)
      }
      const adminSignals = path.match(/^\/admin\/live-sessions\/([^/]+)\/signals$/)
      if (adminSignals) {
        const workspaceId = workspace(req, {})
        await admin(req, workspaceId, 'operate')
        if (req.method === 'GET') return response(await adapter.receiveSignals({ workspaceId, sessionId: id(adminSignals[1], 'transmisión'), sender: 'admin', after: Number(url.searchParams.get('after')) || 0 }), 200, cors)
        if (req.method === 'POST') return response(await adapter.sendSignal({ workspaceId, sessionId: id(adminSignals[1], 'transmisión'), sender: 'admin', signal: await signalBody(req) }), 201, cors)
      }
      const playerSignals = path.match(/^\/player\/live-sessions\/([^/]+)\/signals$/)
      if (playerSignals) {
        const identity = await device(req), sessionId = id(playerSignals[1], 'transmisión')
        if (req.method === 'GET') return response(await adapter.receiveSignals({ identity, sessionId, sender: 'device', after: Number(url.searchParams.get('after')) || 0 }), 200, cors)
        if (req.method === 'POST') return response(await adapter.sendSignal({ identity, sessionId, sender: 'device', signal: await signalBody(req) }), 201, cors)
      }
      throw new ApiError(404, 'NOT_FOUND', 'La ruta solicitada no existe.')
    } catch (error) {
      const status = Number(error?.status) || 500
      const safe = error instanceof ApiError
      if (!safe) console.error('signage-api', error)
      return response({ code: safe ? error.code || 'REQUEST_DENIED' : 'INTERNAL_ERROR', message: safe ? error.message : 'No se pudo completar la solicitud.' }, status, cors)
    }
  }
}
