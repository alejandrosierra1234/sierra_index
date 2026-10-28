(function () {
  'use strict'
  const STORAGE_KEY = 'sierra_pantallas_player_v1'
  const LAST_MANIFEST_KEY = 'sierra_pantallas_last_manifest_v1'
  const MEDIA_CACHE = 'sierra-pantallas-media-v1'
  const params = new URLSearchParams(location.search)
  const baseUrl = params.get('backend') || '/api/signage'
  let pairingTimer = null
  let manifestTimer = null
  let credentials = loadCredentials()
  let lastManifest = loadLastManifest()
  let liveReceiver = null
  let liveSessionId = null
  let currentObjectUrl = null

  function loadCredentials() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) } catch { return null } }
  function loadLastManifest() { try { return JSON.parse(localStorage.getItem(LAST_MANIFEST_KEY)) } catch { return null } }
  function saveCredentials(value) { localStorage.setItem(STORAGE_KEY, JSON.stringify(value)); credentials = value }
  function saveLastManifest(value) { localStorage.setItem(LAST_MANIFEST_KEY, JSON.stringify(value)); lastManifest = value }
  async function clearCachedPlayback() {
    localStorage.removeItem(LAST_MANIFEST_KEY); lastManifest = null
    if ('caches' in window) await caches.delete(MEDIA_CACHE).catch(() => {})
    await renderContent(null)
  }
  function setupStatus(message, retry) { document.getElementById('sp-setup-status').textContent = message; document.getElementById('sp-new-code').hidden = !retry }
  const allowedOrigins = window.SIERRA_SIGNAGE_ALLOWED_BACKEND_ORIGINS || []
  function mediaUrl(value) { return new URL(value, SignageBackendClient.normalizeBaseUrl(baseUrl, location.origin, allowedOrigins).replace(/\/api\/signage$/, '') + '/').href }

  async function beginPairing() {
    clearTimeout(pairingTimer)
    document.getElementById('sp-new-code').hidden = true
    try {
      const client = SignageBackendClient.createClient({ baseUrl, currentOrigin: location.origin, allowedOrigins })
      const pairing = await client.createPairing()
      document.getElementById('sp-code').textContent = pairing.code
      setupStatus('El código vence en 5 minutos y funciona una sola vez.', false)
      pollPairing(client, pairing.claimToken)
    } catch (error) { setupStatus('No se pudo conectar con el servicio de Pantallas.', true) }
  }

  async function pollPairing(client, claimToken) {
    try {
      const result = await client.claimPairing(claimToken)
      if (result.state === 'paired') { saveCredentials({ deviceId: result.device.id, deviceToken: result.deviceToken, name: result.device.name }); return startPlayer() }
      pairingTimer = setTimeout(() => pollPairing(client, claimToken), 1500)
    } catch (error) { setupStatus(error.status === 410 ? 'El código venció. Genera uno nuevo.' : 'Se perdió la conexión. Intenta otra vez.', true) }
  }

  async function cachedMediaUrl(content) {
    const networkUrl = mediaUrl(content.mediaUrl)
    if (!('caches' in window)) return networkUrl
    try {
      const cache = await caches.open(MEDIA_CACHE)
      let response = await cache.match(networkUrl)
      if (!response) {
        const fetched = await fetch(networkUrl, { credentials: 'omit' })
        if (!fetched.ok) throw new Error('No se pudo descargar el archivo.')
        const length = Number(fetched.headers.get('content-length') || 0)
        if (length && length > 50 * 1024 * 1024) throw new Error('El archivo supera el límite de caché.')
        await cache.put(networkUrl, fetched.clone()); response = fetched
      }
      const blob = await response.blob()
      if (currentObjectUrl) URL.revokeObjectURL(currentObjectUrl)
      currentObjectUrl = URL.createObjectURL(blob)
      return currentObjectUrl
    } catch { return networkUrl }
  }

  async function renderContent(content) {
    const host = document.getElementById('sp-content')
    if (!content) { host.innerHTML = '<div class="sp-empty"><h1>Listo para mostrar contenido</h1><p>Elige qué mostrar desde SIERRA Index.</p></div>'; return }
    if (content.type === 'image') host.innerHTML = `<div class="sp-media"><img src="${escapeAttr(await cachedMediaUrl(content))}" alt="${escapeAttr(content.alt)}"><div class="sp-caption"><b>${escapeHtml(content.title)}</b>${content.body ? `<span>${escapeHtml(content.body)}</span>` : ''}</div></div>`
    else if (content.type === 'video') host.innerHTML = `<div class="sp-media"><video src="${escapeAttr(await cachedMediaUrl(content))}" aria-label="${escapeAttr(content.alt)}" autoplay muted loop playsinline></video><div class="sp-caption"><b>${escapeHtml(content.title)}</b>${content.body ? `<span>${escapeHtml(content.body)}</span>` : ''}</div></div>`
    else if (content.type === 'link') host.innerHTML = `<div class="sp-link"><div class="sp-link-icon" aria-hidden="true">↗</div><h1>${escapeHtml(content.title)}</h1><p>${escapeHtml(content.body || 'Abre este enlace desde un dispositivo autorizado.')}</p><a href="${escapeAttr(content.url)}" rel="noopener noreferrer">${escapeHtml(content.url)}</a></div>`
    else host.innerHTML = `<div class="sp-message"><h1>${escapeHtml(content.title)}</h1><p>${escapeHtml(content.body)}</p></div>`
    host.querySelectorAll('img,video').forEach(media => media.addEventListener('error', () => { if (lastManifest?.content) host.innerHTML = '<div class="sp-empty"><h1>No pudimos cargar este archivo</h1><p>Revisa la conexión o el formato desde SIERRA Index.</p></div>' }, { once: true }))
  }

  function showLive(session, client) {
    if (liveSessionId === session.id) return
    liveReceiver?.stop(); liveSessionId = session.id
    const host = document.getElementById('sp-content')
    host.innerHTML = '<div class="sp-live"><span class="sp-live-label">PANTALLA COMPARTIDA EN VIVO</span><video id="sp-live-video" autoplay muted playsinline></video></div>'
    liveReceiver = SignageLiveShare.createReceiver({
      client,
      sessionId: session.id,
      video: document.getElementById('sp-live-video'),
      onConnected: () => { document.getElementById('sp-connection').textContent = 'Transmisión en vivo' },
      onStop: () => { liveSessionId = null; liveReceiver = null; if (lastManifest) renderContent(lastManifest.content) },
      onError: () => { document.getElementById('sp-connection').textContent = 'Reconectando transmisión…' },
    })
    window.__signageLiveReceiver = liveReceiver
    liveReceiver.start()
  }

  async function sync() {
    const client = SignageBackendClient.createPlayerClient({ baseUrl, currentOrigin: location.origin, allowedOrigins, deviceToken: credentials.deviceToken, deviceId: credentials.deviceId })
    try {
      const result = await client.manifest(credentials.deviceId)
      document.getElementById('sp-connection').textContent = 'Conectada · actualizado ahora'
      if (result.liveSession) showLive(result.liveSession, client)
      else {
        if (liveReceiver) liveReceiver.stop()
        if (!lastManifest || result.revision !== lastManifest.revision || result.content?.id !== lastManifest.content?.id || lastManifest.liveSession) await renderContent(result.content)
      }
      saveLastManifest(result)
    } catch (error) {
      document.getElementById('sp-connection').textContent = error.status === 401 ? 'Vinculación revocada' : 'Sin conexión · mostrando lo último recibido'
      if (error.status === 401) { localStorage.removeItem(STORAGE_KEY); clearInterval(manifestTimer); await clearCachedPlayback() }
    }
  }

  function startPlayer() {
    document.getElementById('sp-setup').hidden = true
    document.getElementById('sp-stage').hidden = false
    if (lastManifest?.deviceId === credentials.deviceId) renderContent(lastManifest.content)
    sync(); manifestTimer = setInterval(sync, 2000)
  }
  function escapeHtml(value) { const div = document.createElement('div'); div.textContent = String(value || ''); return div.innerHTML }
  function escapeAttr(value) { return escapeHtml(value).replace(/"/g, '&quot;') }

  document.getElementById('sp-new-code').addEventListener('click', beginPairing)
  if (credentials?.deviceId && credentials?.deviceToken) startPlayer(); else beginPairing()
})()
