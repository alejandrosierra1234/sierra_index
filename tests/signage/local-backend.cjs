const http = require('node:http')
const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')

const ADMIN_TOKEN = 'local-admin-test-token'
const MAX_IMAGE_BYTES = 10 * 1024 * 1024
const MAX_VIDEO_BYTES = 50 * 1024 * 1024
const PAIRING_TTL_MS = 5 * 60 * 1000
const root = path.resolve(__dirname, '../..')

function id(prefix) { return `${prefix}-${crypto.randomUUID()}` }
function token() { return crypto.randomBytes(32).toString('base64url') }
function hash(value) { return crypto.createHash('sha256').update(value).digest('hex') }
function clean(value, max = 120) { return String(value || '').replace(/\s+/g, ' ').trim().slice(0, max) }
function json(res, status, value) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' })
  res.end(JSON.stringify(value))
}
function fail(res, status, message, code = 'SIGNAGE_LOCAL_ERROR') { json(res, status, { message, code }) }
async function body(req, limit = 1024 * 1024) {
  const chunks = []; let size = 0
  for await (const chunk of req) { size += chunk.length; if (size > limit) throw Object.assign(new Error('Archivo demasiado grande.'), { status: 413 }); chunks.push(chunk) }
  return Buffer.concat(chunks)
}
async function jsonBody(req) {
  const raw = await body(req)
  try { return raw.length ? JSON.parse(raw.toString('utf8')) : {} } catch { throw Object.assign(new Error('JSON inválido.'), { status: 400 }) }
}
function magicType(buffer) {
  if (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]))) return 'image/png'
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return 'image/jpeg'
  if (buffer.length >= 12 && buffer.subarray(0, 4).toString() === 'RIFF' && buffer.subarray(8, 12).toString() === 'WEBP') return 'image/webp'
  if (buffer.length >= 6 && ['GIF87a','GIF89a'].includes(buffer.subarray(0, 6).toString())) return 'image/gif'
  if (buffer.length >= 12 && buffer.subarray(4, 8).toString() === 'ftyp') return 'video/mp4'
  if (buffer.length >= 4 && buffer.subarray(0, 4).equals(Buffer.from([0x1a,0x45,0xdf,0xa3]))) return 'video/webm'
  return null
}
function activeSchedule(state, deviceId, now = Date.now()) {
  return state.schedules.filter(item => item.deviceId === deviceId && item.enabled && Date.parse(item.startsAt) <= now && now < Date.parse(item.endsAt))
    .sort((a,b) => b.priority - a.priority || Date.parse(b.startsAt) - Date.parse(a.startsAt) || a.id.localeCompare(b.id))[0] || null
}
function manifest(state, device) {
  const schedule = activeSchedule(state, device.id)
  const playlist = schedule ? state.playlists.find(item => item.id === schedule.playlistId) : null
  let scheduled = null
  if (playlist?.entries?.length) {
    const total = playlist.entries.reduce((sum, item) => sum + item.durationSeconds, 0)
    let elapsed = Math.max(0, Math.floor((Date.now() - Date.parse(schedule.startsAt)) / 1000)) % total
    const entry = playlist.entries.find(item => { elapsed -= item.durationSeconds; return elapsed < 0 }) || playlist.entries[0]
    scheduled = state.contents.find(item => item.id === entry.contentId) || null
  }
  const content = scheduled || state.contents.find(item => item.id === device.contentId) || null
  const liveSession = [...state.liveSessions.values()].find(item => item.deviceId === device.id && item.state === 'active') || null
  return { schemaVersion: 1, deviceId: device.id, revision: device.revision, state: liveSession ? 'live' : content ? 'ready' : 'no-content', content, schedule, playlist, liveSession: liveSession ? { id: liveSession.id, startedAt: liveSession.startedAt } : null, generatedAt: new Date().toISOString() }
}
function createState() { return { pairings: new Map(), pairingFailures: new Map(), devices: new Map(), contents: [], uploads: new Map(), playlists: [], schedules: [], liveSessions: new Map() } }

function createServer(options = {}) {
  const state = options.state || createState()
  const now = options.now || (() => Date.now())
  function admin(req) { return req.headers.authorization === `Bearer ${options.adminToken || ADMIN_TOKEN}` }
  function deviceFor(req) {
    const deviceId = clean(req.headers['x-device-id'])
    const supplied = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '')
    const device = state.devices.get(deviceId)
    return device && !device.revokedAt && crypto.timingSafeEqual(Buffer.from(device.tokenHash), Buffer.from(hash(supplied))) ? device : null
  }
  function prunePairings() { for (const [key,value] of state.pairings) if (value.expiresAt <= now() || value.consumedAt) state.pairings.delete(key) }
  async function acceptSignal(req, res, session, sender) {
    if (session.state !== 'active') return fail(res, 409, 'La transmisión ya terminó.')
    const input = await jsonBody(req)
    if (!['offer','answer','candidate'].includes(input.type) || JSON.stringify(input.payload || {}).length > 65536) return fail(res, 400, 'Mensaje de conexión inválido.', 'VALIDATION')
    const signal = { sequence: session.signals.length + 1, sender, type: input.type, payload: input.payload, at: new Date(now()).toISOString() }
    session.signals.push(signal); return json(res, 201, { sequence: signal.sequence })
  }
  function listSignals(res, session, sender, url) {
    const after = Math.max(0, Number(url.searchParams.get('after')) || 0)
    return json(res, 200, { state: session.state, signals: session.signals.filter(item => item.sender === sender && item.sequence > after) })
  }

  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://local.test')
      const route = url.pathname
      if (route.startsWith('/api/signage/')) {
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*')
        res.setHeader('Vary', 'Origin')
        if (req.method === 'OPTIONS') { res.writeHead(204, { 'Access-Control-Allow-Headers': 'Authorization, Content-Type, X-Device-Id, X-Filename', 'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS' }); return res.end() }
      }
      if (req.method === 'GET' && route === '/api/signage/health') return json(res, 200, { ok: true, mode: 'local-ephemeral', persistence: false })

      if (req.method === 'POST' && route === '/api/signage/player/pairings') {
        prunePairings()
        let code
        do { code = String(crypto.randomInt(100000, 1000000)) } while ([...state.pairings.values()].some(item => item.codeHash === hash(code)))
        const claimToken = token()
        state.pairings.set(hash(claimToken), { codeHash: hash(code), expiresAt: now() + PAIRING_TTL_MS, attempts: 0, result: null, delivered: false })
        return json(res, 201, { code, claimToken, expiresAt: new Date(now() + PAIRING_TTL_MS).toISOString() })
      }
      if (req.method === 'POST' && route === '/api/signage/player/pairings/status') {
        const input = await jsonBody(req)
        const pairing = state.pairings.get(hash(String(input.claimToken || '')))
        if (!pairing || pairing.expiresAt <= now()) return fail(res, 410, 'El código expiró. Genera uno nuevo.', 'PAIRING_EXPIRED')
        if (!pairing.result) return json(res, 200, { state: 'pending', expiresAt: new Date(pairing.expiresAt).toISOString() })
        if (pairing.delivered) return fail(res, 410, 'Las credenciales ya fueron entregadas.', 'PAIRING_CONSUMED')
        pairing.delivered = true; pairing.consumedAt = now()
        return json(res, 200, { state: 'paired', ...pairing.result })
      }
      if (req.method === 'POST' && route === '/api/signage/admin/pairings/claim') {
        if (!admin(req)) return fail(res, 401, 'Sesión administrativa requerida.', 'ADMIN_REQUIRED')
        const source = req.socket.remoteAddress || 'local'
        const attempts = state.pairingFailures.get(source) || { count: 0, resetAt: now() + 60000 }
        if (attempts.resetAt <= now()) { attempts.count = 0; attempts.resetAt = now() + 60000 }
        attempts.count += 1; state.pairingFailures.set(source, attempts)
        if (attempts.count > 10) return fail(res, 429, 'Demasiados intentos. Espera un minuto.', 'PAIRING_RATE_LIMIT')
        const input = await jsonBody(req); prunePairings()
        const codeHash = hash(clean(input.code, 6))
        const pairing = [...state.pairings.values()].find(item => item.codeHash === codeHash)
        if (!pairing) return fail(res, 404, 'Código inválido o vencido.', 'PAIRING_NOT_FOUND')
        pairing.attempts += 1
        if (pairing.attempts > 5) { pairing.consumedAt = now(); return fail(res, 429, 'Demasiados intentos.', 'PAIRING_LOCKED') }
        if (pairing.result) return fail(res, 409, 'El código ya fue utilizado.', 'PAIRING_USED')
        const name = clean(input.name, 80), plant = clean(input.plant, 80), profile = clean(input.profile, 80)
        if (name.length < 3 || plant.length < 2 || profile.length < 3) return fail(res, 400, 'Nombre, planta y perfil son obligatorios.', 'VALIDATION')
        const deviceToken = token(); const device = { id: id('device'), name, plant, profile, tokenHash: hash(deviceToken), revision: 0, contentId: null, createdAt: new Date(now()).toISOString(), lastSeenAt: null, revokedAt: null }
        state.devices.set(device.id, device)
        pairing.result = { device: { ...device, tokenHash: undefined }, deviceToken }
        return json(res, 201, { device: { ...device, tokenHash: undefined } })
      }
      if (req.method === 'GET' && route === '/api/signage/player/manifest') {
        const device = deviceFor(req)
        if (!device) return fail(res, 401, 'Credencial de reproductor inválida o revocada.', 'DEVICE_DENIED')
        device.lastSeenAt = new Date(now()).toISOString()
        return json(res, 200, manifest(state, device))
      }

      if (route.startsWith('/api/signage/admin/') && !admin(req)) return fail(res, 401, 'Sesión administrativa requerida.', 'ADMIN_REQUIRED')
      if (req.method === 'GET' && route === '/api/signage/admin/devices') return json(res, 200, { devices: [...state.devices.values()].map(({tokenHash,...item}) => item) })
      const revokeMatch = route.match(/^\/api\/signage\/admin\/devices\/([^/]+)\/revoke$/)
      if (req.method === 'POST' && revokeMatch) {
        const device = state.devices.get(decodeURIComponent(revokeMatch[1])); if (!device) return fail(res, 404, 'Pantalla no encontrada.')
        const input = await jsonBody(req); if (clean(input.reason, 500).length < 3) return fail(res, 400, 'Indica un motivo de revocación.')
        device.revokedAt = new Date(now()).toISOString(); device.revision += 1
        return json(res, 200, { deviceId: device.id, revokedAt: device.revokedAt })
      }
      if (req.method === 'PUT' && route === '/api/signage/admin/uploads') {
        const declared = clean(req.headers['content-type'], 80).toLowerCase()
        const limit = declared.startsWith('video/') ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES
        const data = await body(req, limit)
        const detected = magicType(data)
        if (!detected || detected !== declared || !['image/png','image/jpeg','image/webp','image/gif','video/mp4','video/webm'].includes(detected)) return fail(res, 415, 'El archivo no coincide con un formato permitido.', 'UNSUPPORTED_MEDIA')
        const upload = { id: id('upload'), filename: clean(req.headers['x-filename'], 180), contentType: detected, size: data.length, data }
        state.uploads.set(upload.id, upload)
        return json(res, 201, { upload: { id: upload.id, filename: upload.filename, contentType: upload.contentType, size: upload.size, url: `/media/${upload.id}` } })
      }
      if (req.method === 'GET' && route === '/api/signage/admin/content') return json(res, 200, { contents: state.contents })
      if (req.method === 'POST' && route === '/api/signage/admin/content') {
        const input = await jsonBody(req); const type = clean(input.type, 20), title = clean(input.title, 80), alt = clean(input.alt, 180), bodyText = clean(input.body, 240)
        if (!['message','image','video','link'].includes(type) || title.length < 3) return fail(res, 400, 'Tipo o título inválido.', 'VALIDATION')
        if (type === 'message' && !bodyText) return fail(res, 400, 'El mensaje es obligatorio.', 'VALIDATION')
        let mediaUrl = ''
        if (['image','video'].includes(type)) {
          const upload = state.uploads.get(clean(input.uploadId)); if (!upload || !upload.contentType.startsWith(type + '/')) return fail(res, 400, 'Selecciona un archivo subido compatible.', 'VALIDATION')
          if (!alt) return fail(res, 400, 'La descripción accesible es obligatoria.', 'VALIDATION')
          mediaUrl = `/media/${upload.id}`
        }
        let linkUrl = ''
        if (type === 'link') {
          try { const parsed = new URL(input.url); if (parsed.protocol !== 'https:' || parsed.username || parsed.password) throw new Error(); linkUrl = parsed.href } catch { return fail(res, 400, 'El enlace debe ser HTTPS y no incluir credenciales.', 'VALIDATION') }
        }
        const content = { id: id('content'), type, title, body: bodyText, alt, mediaUrl, url: linkUrl, displayMode: type === 'link' ? 'link-card' : undefined, createdAt: new Date(now()).toISOString() }
        state.contents.unshift(content); return json(res, 201, { content })
      }
      const publishMatch = route.match(/^\/api\/signage\/admin\/devices\/([^/]+)\/publish$/)
      if (req.method === 'POST' && publishMatch) {
        const device = state.devices.get(decodeURIComponent(publishMatch[1])); if (!device || device.revokedAt) return fail(res, 404, 'Pantalla no disponible.')
        const input = await jsonBody(req); const content = state.contents.find(item => item.id === input.contentId); if (!content) return fail(res, 404, 'Contenido no encontrado.')
        device.contentId = content.id; device.revision += 1
        return json(res, 200, { deviceId: device.id, revision: device.revision, contentId: content.id })
      }
      if (req.method === 'POST' && route === '/api/signage/admin/live-sessions') {
        const input = await jsonBody(req); const device = state.devices.get(input.deviceId)
        if (!device || device.revokedAt) return fail(res, 404, 'Pantalla no disponible.')
        for (const session of state.liveSessions.values()) if (session.deviceId === device.id && session.state === 'active') session.state = 'stopped'
        const session = { id: id('live'), deviceId: device.id, state: 'active', startedAt: new Date(now()).toISOString(), signals: [] }
        state.liveSessions.set(session.id, session); device.revision += 1
        return json(res, 201, { session: { id: session.id, deviceId: session.deviceId, state: session.state, startedAt: session.startedAt } })
      }
      const adminLiveMatch = route.match(/^\/api\/signage\/admin\/live-sessions\/([^/]+)(?:\/(signals|stop))?$/)
      if (adminLiveMatch) {
        const session = state.liveSessions.get(decodeURIComponent(adminLiveMatch[1])); if (!session) return fail(res, 404, 'Transmisión no encontrada.')
        if (req.method === 'POST' && adminLiveMatch[2] === 'stop') { session.state = 'stopped'; const device = state.devices.get(session.deviceId); if (device) device.revision += 1; return json(res, 200, { state: 'stopped' }) }
        if (req.method === 'POST' && adminLiveMatch[2] === 'signals') return acceptSignal(req, res, session, 'sender')
        if (req.method === 'GET' && adminLiveMatch[2] === 'signals') return listSignals(res, session, 'receiver', url)
      }
      const playerLiveMatch = route.match(/^\/api\/signage\/player\/live-sessions\/([^/]+)\/signals$/)
      if (playerLiveMatch) {
        const device = deviceFor(req); if (!device) return fail(res, 401, 'Credencial de reproductor inválida o revocada.', 'DEVICE_DENIED')
        const session = state.liveSessions.get(decodeURIComponent(playerLiveMatch[1])); if (!session || session.deviceId !== device.id || session.state !== 'active') return fail(res, 404, 'Transmisión no disponible.')
        if (req.method === 'POST') return acceptSignal(req, res, session, 'receiver')
        if (req.method === 'GET') return listSignals(res, session, 'sender', url)
      }
      if (req.method === 'POST' && route === '/api/signage/admin/playlists') {
        const input = await jsonBody(req); const name = clean(input.name, 80); const entries = Array.isArray(input.entries) ? input.entries : []
        if (name.length < 3 || !entries.length || entries.length > 50 || entries.some(entry => !state.contents.some(item => item.id === entry.contentId) || !Number.isInteger(entry.durationSeconds) || entry.durationSeconds < 5 || entry.durationSeconds > 3600)) return fail(res, 400, 'Lista inválida.', 'VALIDATION')
        const playlist = { id: id('playlist'), name, entries, createdAt: new Date(now()).toISOString() }; state.playlists.push(playlist); return json(res, 201, { playlist })
      }
      if (req.method === 'POST' && route === '/api/signage/admin/schedules') {
        const input = await jsonBody(req); const starts = Date.parse(input.startsAt), ends = Date.parse(input.endsAt), priority = Number(input.priority)
        if (!state.devices.has(input.deviceId) || !state.playlists.some(item => item.id === input.playlistId) || !Number.isFinite(starts) || !Number.isFinite(ends) || ends <= starts || !Number.isInteger(priority) || priority < 0 || priority > 9) return fail(res, 400, 'Horario inválido.', 'VALIDATION')
        const schedule = { id: id('schedule'), deviceId: input.deviceId, playlistId: input.playlistId, startsAt: new Date(starts).toISOString(), endsAt: new Date(ends).toISOString(), priority, enabled: true }; state.schedules.push(schedule); return json(res, 201, { schedule })
      }

      const mediaMatch = route.match(/^\/media\/([^/]+)$/)
      if (req.method === 'GET' && mediaMatch) {
        const upload = state.uploads.get(decodeURIComponent(mediaMatch[1])); if (!upload) return fail(res, 404, 'Archivo no encontrado.')
        res.writeHead(200, { 'Content-Type': upload.contentType, 'Content-Length': upload.size, 'Cache-Control': 'private, max-age=60', 'X-Content-Type-Options': 'nosniff' }); return res.end(upload.data)
      }
      if (req.method === 'GET') {
        const relative = route === '/' ? 'signage-player.html' : decodeURIComponent(route.slice(1))
        const file = path.resolve(root, relative)
        if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) return fail(res, 404, 'Ruta no encontrada.')
        const type = ({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.ttf':'font/ttf','.otf':'font/otf'})[path.extname(file)] || 'application/octet-stream'
        res.writeHead(200, { 'Content-Type': type, 'X-Content-Type-Options': 'nosniff' }); return fs.createReadStream(file).pipe(res)
      }
      return fail(res, 404, 'Ruta no encontrada.')
    } catch (error) { return fail(res, error.status || 500, error.status ? error.message : 'Error interno del backend local.') }
  })
  return { server, state }
}

if (require.main === module) {
  const port = Number(process.env.SIGNAGE_LOCAL_PORT || 8765)
  const { server } = createServer()
  server.listen(port, '127.0.0.1', () => console.log(`SIERRA signage local backend: http://127.0.0.1:${port}`))
}

module.exports = { createServer, createState, ADMIN_TOKEN, magicType }
