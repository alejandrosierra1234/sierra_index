(function () {
  'use strict'
  const STORAGE_KEY = 'sierra_pantallas_player_v1'
  const LAST_MANIFEST_KEY = 'sierra_pantallas_last_manifest_v1'
  const MEDIA_CACHE = 'sierra-pantallas-media-v1'
  const SIERRA_AMBIENT_VIDEO = 'https://cdn.prod.website-files.com/673e5aab9ab2686aa6660ed3%2F67448935dfb12aa5cb9c86e9_video-cortado-transcode.mp4'
  const SIERRA_AMBIENT_POSTER = 'https://cdn.prod.website-files.com/673e5aab9ab2686aa6660ed3%2F67448935dfb12aa5cb9c86e9_video-cortado-poster-00001.jpg'
  const SIERRA_REST_IMAGE = 'https://cdn.prod.website-files.com/673e5aab9ab2686aa6660ed3/673f7b62650c2610524db19f_DSC09322-Enhanced-NR%20(1).jpg'
  const params = new URLSearchParams(location.search)
  const publicConfig = SignageBackendClient.publicConfig(window.SIERRA_SIGNAGE_CONFIG || {})
  const baseUrl = params.get('backend') || publicConfig.backendUrl || '/api/signage'
  let pairingTimer = null
  let manifestTimer = null
  let credentials = loadCredentials()
  let lastManifest = loadLastManifest()
  let liveReceiver = null
  let liveSessionId = null
  let currentObjectUrl = null
  let lastHeartbeatAt = 0
  let liveShareLoad = null
  const heartbeatInterval = Number(window.SIERRA_SIGNAGE_HEARTBEAT_INTERVAL) || 30000

  function loadCredentials() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) } catch (error) { return null } }
  function loadLastManifest() { try { return JSON.parse(localStorage.getItem(LAST_MANIFEST_KEY)) } catch (error) { return null } }
  function saveCredentials(value) { localStorage.setItem(STORAGE_KEY, JSON.stringify(value)); credentials = value }
  function saveLastManifest(value) {
    lastManifest = value
    try { localStorage.setItem(LAST_MANIFEST_KEY, JSON.stringify(value)) } catch (error) {}
  }
  async function clearCachedPlayback() {
    localStorage.removeItem(LAST_MANIFEST_KEY); lastManifest = null
    if ('caches' in window) await caches.delete(MEDIA_CACHE).catch(() => {})
    await renderContent(null, { state: 'no-content' })
  }
  function setupStatus(message, retry) { document.getElementById('sp-setup-status').textContent = message; document.getElementById('sp-new-code').hidden = !retry }
  const allowedOrigins = publicConfig.allowedOrigins
  function mediaUrl(value) { return new URL(value, SignageBackendClient.normalizeBaseUrl(baseUrl, location.origin, allowedOrigins).replace(/\/api\/signage$/, '') + '/').href }
  function ambientTime() {
    try { return new Intl.DateTimeFormat('es', { hour: '2-digit', minute: '2-digit' }).format(new Date()) } catch (error) { return '' }
  }
  function renderAmbient(note, options = {}) {
    const host = document.getElementById('sp-content')
    const stopped = options.state === 'stopped'
    const media = stopped
      ? `<div class="sp-ambient-visual" style="background-image:url('${SIERRA_REST_IMAGE}')" aria-hidden="true"></div>`
      : `<video class="sp-ambient-visual" src="${SIERRA_AMBIENT_VIDEO}" poster="${SIERRA_AMBIENT_POSTER}" autoplay muted loop playsinline preload="metadata" aria-hidden="true"></video>`
    host.innerHTML = `<div class="sp-ambient${stopped ? ' is-resting' : ''}">${media}<div class="sp-ambient-shade" aria-hidden="true"></div><header><img src="SIERRA_Primary_Blue02.svg" alt="SIERRA"><span>SIERRA OS</span></header><main><span class="sp-ambient-kicker">${stopped ? 'PANTALLA EN REPOSO' : 'LISTA PARA MOSTRAR'}</span><h1>${stopped ? 'Una pausa que también comunica.' : 'Materia que conecta.'}</h1><p>${escapeHtml(note || (stopped ? 'La vinculación y el contenido programado se conservan.' : 'Elige imágenes, videos o mensajes desde SIERRA Index.'))}</p></main><footer><span>SIERRA · Pantallas</span><time>${escapeHtml(ambientTime())}</time></footer></div>`
    const ambientVideo = host.querySelector('.sp-ambient video')
    if (ambientVideo && typeof ambientVideo.play === 'function') {
      ambientVideo.muted = true; ambientVideo.defaultMuted = true; ambientVideo.playsInline = true
      ambientVideo.play().catch(() => ambientVideo.classList.add('is-still'))
    }
  }

  function renderMediaFallback(content, message) {
    const host = document.getElementById('sp-content')
    const poster = content && content.poster ? ` style="--sp-poster:url('${escapeCssUrl(content.poster)}')"` : ''
    host.innerHTML = `<div class="sp-media-fallback${poster ? ' has-poster' : ''}"${poster}><div class="sp-media-fallback-shade" aria-hidden="true"></div><header><img src="SIERRA_Primary_Blue02.svg" alt="SIERRA"><span>SIERRA OS · CONTENIDO</span></header><main><span>${escapeHtml(content && content.type === 'video' ? 'VIDEO EN PAUSA' : 'ARCHIVO NO DISPONIBLE')}</span><h1>${escapeHtml(content && content.title ? content.title : 'Contenido pendiente')}</h1><p>${escapeHtml(message)}</p></main><footer>La pieza elegida se conserva. Corrígela o reemplázala desde SIERRA Index.</footer></div>`
  }

  async function beginPairing() {
    clearTimeout(pairingTimer)
    document.getElementById('sp-new-code').hidden = true
    try {
      const client = SignageBackendClient.createClient({ baseUrl, currentOrigin: location.origin, allowedOrigins })
      const pairing = await client.createPairing()
      document.getElementById('sp-code').textContent = pairing.code
      window.__sierraPlayerSettled = true
      setupStatus('El código vence en 5 minutos y funciona una sola vez.', false)
      pollPairing(client, pairing.claimToken)
    } catch (error) {
      window.__sierraPlayerSettled = true
      const detail = error && error.code === 'REQUEST_TIMEOUT' ? 'La conexión tardó demasiado.' : 'No se pudo conectar con el servicio de Pantallas.'
      setupStatus(`${detail} Toca “Generar otro código” para intentar de nuevo.`, true)
    }
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
    } catch (error) { return networkUrl }
  }

  async function renderContent(content, options = {}) {
    const host = document.getElementById('sp-content')
    const connection = document.getElementById('sp-connection')
    if (connection) connection.hidden = Boolean(content && (content.type === 'image' || content.type === 'video' || content.type === 'presentation'))
    if (!content) { renderAmbient(options.note, options); return }
    if (content.type === 'welcome') host.innerHTML = `<article class="sp-welcome sp-welcome-${escapeAttr(content.template || 'essential')}"><header><img src="SIERRA_Primary_Blue02.svg" alt="SIERRA"><span>BIENVENIDA · SIERRA</span></header><main><span>BIENVENIDOS</span><h1>${escapeHtml(content.displayName)}</h1><p>${escapeHtml(content.subtitle)}</p></main><footer><span>SIERRA tvOS</span><time>${escapeHtml(ambientTime())}</time></footer></article>`
    else if (content.type === 'presentation' && content.slide && content.slide.mediaUrl) {
      const slide = { ...content.slide, mediaUrl: content.slide.mediaUrl }
      host.innerHTML = `<div class="sp-presentation"><img src="${escapeAttr(await cachedMediaUrl(slide))}" alt="${escapeAttr(slide.alt || `Diapositiva ${Number(content.slideIndex) + 1}`)}"><div class="sp-presentation-status" aria-hidden="true">${Number(content.slideIndex) + 1} / ${Number(content.slideCount) || 1}</div></div>`
    }
    else if (content.type === 'image') host.innerHTML = `<div class="sp-media"><img src="${escapeAttr(await cachedMediaUrl(content))}" alt="${escapeAttr(content.alt)}"></div>`
    else if (content.type === 'video') {
      host.innerHTML = `<div class="sp-media"><video src="${escapeAttr(await cachedMediaUrl(content))}"${content.poster ? ` poster="${escapeAttr(content.poster)}"` : ''} aria-label="${escapeAttr(content.alt)}" autoplay muted loop playsinline preload="auto"></video></div>`
      const video = host.querySelector('video')
      if (video && typeof video.play === 'function') {
        video.muted = true; video.defaultMuted = true; video.playsInline = true
        video.play().catch(() => renderMediaFallback(content, 'El navegador no pudo iniciar el video automáticamente.'))
      }
    }
    else if (content.type === 'link') host.innerHTML = `<div class="sp-link"><div class="sp-link-icon" aria-hidden="true">↗</div><h1>${escapeHtml(content.title)}</h1><p>${escapeHtml(content.body || 'Abre este enlace desde un dispositivo autorizado.')}</p><a href="${escapeAttr(content.url)}" rel="noopener noreferrer">${escapeHtml(content.url)}</a></div>`
    else host.innerHTML = `<article class="sp-message"><header><img src="SIERRA_Primary_Blue02.svg" alt="SIERRA"><span>SIERRA OS · MENSAJE</span></header><main><h1>${escapeHtml(content.title)}</h1><p>${escapeHtml(content.body)}</p></main><footer><span>SIERRA · Pantallas</span><time>${escapeHtml(ambientTime())}</time></footer></article>`
    host.querySelectorAll('img,video').forEach(media => media.addEventListener('error', () => { if (lastManifest && lastManifest.content) renderMediaFallback(content, 'No pudimos cargar este archivo. Revisa la conexión o el formato desde SIERRA Index.') }, { once: true }))
  }

  function loadLiveShare() {
    if (window.SignageLiveShare) return Promise.resolve(window.SignageLiveShare)
    if (liveShareLoad) return liveShareLoad
    liveShareLoad = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      const timeout = setTimeout(() => reject(new Error('La transmisión en vivo tardó demasiado en cargar.')), 12000)
      script.src = 'js/signage-live-share.js?v=20261029-4'
      script.async = true
      script.onload = () => {
        clearTimeout(timeout)
        if (window.SignageLiveShare) resolve(window.SignageLiveShare)
        else reject(new Error('No se pudo iniciar la transmisión en vivo.'))
      }
      script.onerror = () => { clearTimeout(timeout); reject(new Error('No se pudo cargar la transmisión en vivo.')) }
      document.head.appendChild(script)
    }).catch(error => { liveShareLoad = null; throw error })
    return liveShareLoad
  }

  async function showLive(session, client) {
    if (liveSessionId === session.id) return
    const runtime = await client.runtime()
    if (!runtime.liveAvailable || !runtime.iceServers || !runtime.iceServers.length) throw new Error('La transmisión en vivo no tiene una conexión ICE/TURN configurada.')
    const liveShare = await loadLiveShare()
    if (liveReceiver) liveReceiver.stop(); liveSessionId = session.id
    const host = document.getElementById('sp-content')
    host.innerHTML = '<div class="sp-live"><span class="sp-live-label">PANTALLA COMPARTIDA EN VIVO</span><video id="sp-live-video" autoplay muted playsinline></video></div>'
    liveReceiver = liveShare.createReceiver({
      client,
      sessionId: session.id,
      video: document.getElementById('sp-live-video'),
      iceServers: runtime.iceServers,
      onConnected: () => { document.getElementById('sp-connection').textContent = 'Transmisión en vivo' },
      onStop: () => { liveSessionId = null; liveReceiver = null; if (lastManifest) renderContent(lastManifest.content, { state: lastManifest.state }) },
      onError: () => { document.getElementById('sp-connection').textContent = 'Transmisión interrumpida' },
    })
    window.__signageLiveReceiver = liveReceiver
    liveReceiver.start()
  }

  async function sync() {
    const client = SignageBackendClient.createPlayerClient({ baseUrl, currentOrigin: location.origin, allowedOrigins, deviceToken: credentials.deviceToken, deviceId: credentials.deviceId })
    try {
      const result = await client.manifest(credentials.deviceId)
      document.getElementById('sp-connection').textContent = result.state === 'stopped' ? 'Conectada · en reposo' : 'Conectada · actualizado ahora'
      if (result.liveSession) await showLive(result.liveSession, client)
      else {
        if (liveReceiver) liveReceiver.stop()
        if (!lastManifest || result.revision !== lastManifest.revision || result.state !== lastManifest.state || (result.content && result.content.id) !== (lastManifest.content && lastManifest.content.id) || lastManifest.liveSession) await renderContent(result.content, { state: result.state })
      }
      saveLastManifest(result)
      if (Date.now() - lastHeartbeatAt >= heartbeatInterval) {
        lastHeartbeatAt = Date.now()
        const estimate = navigator.storage && typeof navigator.storage.estimate === 'function' ? await navigator.storage.estimate().catch(() => null) : null
        await client.heartbeat({ playerVersion: 'web-1', status: result.liveSession ? 'live' : result.content ? 'playing' : 'idle', lastManifestRevision: result.revision, storageFreeBytes: estimate && estimate.quota && estimate.usage ? Math.max(0, estimate.quota-estimate.usage) : null, errors: [] }).catch(() => {})
      }
    } catch (error) {
      document.getElementById('sp-connection').hidden = false
      document.getElementById('sp-connection').textContent = error.status === 401 ? 'Vinculación revocada' : 'Sin conexión · mostrando lo último recibido'
      if (error.status === 401) { localStorage.removeItem(STORAGE_KEY); clearInterval(manifestTimer); await clearCachedPlayback() }
    }
  }

  function startPlayer() {
    window.__sierraPlayerSettled = true
    document.getElementById('sp-setup').hidden = true
    document.getElementById('sp-stage').hidden = false
    document.getElementById('sp-connection').textContent = 'Pantalla vinculada · conectando…'
    if (lastManifest && lastManifest.deviceId === credentials.deviceId) renderContent(lastManifest.content, { state: lastManifest.state })
    else renderContent(null, { state: 'no-content' })
    sync(); manifestTimer = setInterval(sync, 2000)
  }
  function escapeHtml(value) { const div = document.createElement('div'); div.textContent = String(value || ''); return div.innerHTML }
  function escapeAttr(value) { return escapeHtml(value).replace(/"/g, '&quot;') }
  function escapeCssUrl(value) { return String(value || '').replace(/[\\'"()\n\r]/g, '') }

  document.getElementById('sp-new-code').addEventListener('click', beginPairing)
  window.__sierraPlayerBooted = true
  if (!publicConfig.enabled) {
    document.getElementById('sp-code').textContent = '—'
    setupStatus('El servicio central de Pantallas todavía no está habilitado.', false)
  } else if (credentials && credentials.deviceId && credentials.deviceToken) startPlayer()
  else beginPairing()
})()
