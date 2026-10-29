(function (root, factory) {
  const api = factory(root)
  if (typeof module === 'object' && module.exports) module.exports = api
  root.SignageBackendClient = api
})(typeof globalThis !== 'undefined' ? globalThis : this, function (runtime) {
  'use strict'
  const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

  function publicConfig(value) {
    const config = value && typeof value === 'object' ? value : {}
    const backendUrl = String(config.backendUrl || '').trim()
    const workspaceId = String(config.workspaceId || '').trim()
    const siteId = String(config.siteId || '').trim()
    const allowedOrigins = Array.isArray(config.allowedOrigins) ? config.allowedOrigins.map(String) : []
    if (config.enabled && (!backendUrl || !UUID.test(workspaceId) || !UUID.test(siteId))) throw new Error('La configuración pública de Pantallas está incompleta.')
    if (backendUrl && new URL(backendUrl, 'https://index.invalid').protocol !== 'https:' && !/^http:\/\/(?:127\.0\.0\.1|localhost|\[::1\])(?::|\/)/.test(backendUrl)) throw new Error('El servicio de Pantallas debe usar HTTPS.')
    return { enabled: config.enabled === true, backendUrl, workspaceId, siteId, allowedOrigins, mediaEnabled: config.mediaEnabled === true, liveEnabled: config.liveEnabled === true }
  }

  function normalizeBaseUrl(value, currentOrigin, allowedOrigins) {
    const origin = currentOrigin || (typeof location !== 'undefined' ? location.origin : 'http://127.0.0.1')
    const url = new URL(value || '/api/signage', origin)
    const loopback = ['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname)
    const allowed = new Set(Array.isArray(allowedOrigins) ? allowedOrigins : [])
    if (url.origin !== origin && !loopback && !allowed.has(url.origin)) throw new Error('El backend debe usar el mismo origen o un origen aprobado.')
    if (url.protocol !== 'https:' && !loopback) throw new Error('El backend remoto debe usar HTTPS.')
    return url.href.replace(/\/$/, '')
  }

  function createClient(options) {
    options = options || {}
    const baseUrl = normalizeBaseUrl(options.baseUrl, options.currentOrigin, options.allowedOrigins)
    const fetchImpl = options.fetchImpl || runtime.fetch
    if (typeof fetchImpl !== 'function') throw new Error('Este navegador no ofrece fetch.')
    const tokenProvider = options.tokenProvider || (() => '')
    const workspaceProvider = options.workspaceProvider || (() => '')

    async function request(path, init) {
      init = init || {}
      const timeoutMs = Number(init.timeoutMs) > 0 ? Number(init.timeoutMs) : 12000
      if (Object.prototype.hasOwnProperty.call(init, 'timeoutMs')) { init = { ...init }; delete init.timeoutMs }
      const token = await tokenProvider()
      const headers = new Headers(init.headers || {})
      if (token) headers.set('Authorization', `Bearer ${token}`)
      const workspaceId = await workspaceProvider()
      if (workspaceId) headers.set('X-Signage-Workspace', workspaceId)
      if (init.body && !(init.body instanceof Blob) && typeof init.body !== 'string') {
        headers.set('Content-Type', 'application/json')
        init = { ...init, body: JSON.stringify(init.body) }
      }
      const controller = typeof runtime.AbortController === 'function' && !init.signal ? new runtime.AbortController() : null
      const timeout = controller ? setTimeout(() => controller.abort(), timeoutMs) : null
      if (controller) init = { ...init, signal: controller.signal }
      try {
        const response = await fetchImpl(baseUrl + path, { ...init, headers, cache: 'no-store' })
        const text = await response.text()
        let payload = null
        try { payload = text ? JSON.parse(text) : null } catch (parseError) { payload = { message: text } }
        if (!response.ok) {
          const error = new Error((payload && payload.message) || `Solicitud rechazada (${response.status}).`)
          error.status = response.status
          error.code = (payload && payload.code) || 'SIGNAGE_BACKEND_ERROR'
          throw error
        }
        return payload
      } catch (error) {
        if (error && error.name === 'AbortError') {
          const timeoutError = new Error('La conexión tardó demasiado.')
          timeoutError.code = 'REQUEST_TIMEOUT'
          throw timeoutError
        }
        throw error
      } finally {
        if (timeout) clearTimeout(timeout)
      }
    }

    function transferFile(url, file, onProgress) {
      if (typeof runtime.XMLHttpRequest !== 'function') return fetchImpl(url, { method: 'PUT', headers: { 'Content-Type': file.type || 'application/octet-stream' }, body: file })
      return new Promise((resolve, reject) => {
        const xhr = new runtime.XMLHttpRequest()
        xhr.open('PUT', url, true)
        xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream')
        xhr.upload.onprogress = event => {
          if (event.lengthComputable && onProgress) onProgress({ stage: 'uploading', percent: 10 + Math.round((event.loaded / event.total) * 75) })
        }
        xhr.onerror = () => reject(Object.assign(new Error('La transferencia se interrumpió.'), { code: 'UPLOAD_INTERRUPTED' }))
        xhr.onabort = xhr.onerror
        xhr.onload = () => resolve({ ok: xhr.status >= 200 && xhr.status < 300, status: xhr.status })
        xhr.send(file)
      })
    }

    return {
      baseUrl,
      health: () => request('/health'),
      runtime: () => request('/admin/runtime'),
      createPairing: () => request('/player/pairings', { method: 'POST' }),
      claimPairing: claimToken => request('/player/pairings/status', { method: 'POST', body: { claimToken } }),
      pairDevice: input => request('/admin/pairings/claim', { method: 'POST', body: input }),
      listDevices: () => request('/admin/devices'),
      listSpaces: () => request('/admin/spaces'),
      listActivity: () => request('/admin/activity'),
      listProgramming: () => request('/admin/programming'),
      saveSpace: input => request('/admin/spaces', { method: 'POST', body: input }),
      updateDevice: (deviceId, input) => request(`/admin/devices/${encodeURIComponent(deviceId)}/update`, { method: 'POST', body: input }),
      revokeDevice: (deviceId, reason) => request(`/admin/devices/${encodeURIComponent(deviceId)}/revoke`, { method: 'POST', body: { reason } }),
      listContent: () => request('/admin/content'),
      createContent: input => request('/admin/content', { method: 'POST', body: input }),
      approveContent: (contentId, expectedRevision) => request(`/admin/content/${encodeURIComponent(contentId)}/approve`, { method: 'POST', body: { expectedRevision } }),
      publish: (deviceId, contentId, expectedRevision) => request(`/admin/devices/${encodeURIComponent(deviceId)}/publish`, { method: 'POST', body: { contentId, expectedRevision } }),
      stopOutput: (deviceId, expectedRevision) => request(`/admin/devices/${encodeURIComponent(deviceId)}/stop`, { method: 'POST', body: { expectedRevision } }),
      rollback: (deviceId, publicationId, expectedRevision) => request(`/admin/devices/${encodeURIComponent(deviceId)}/rollback`, { method: 'POST', body: { publicationId, expectedRevision } }),
      createPlaylist: input => request('/admin/playlists', { method: 'POST', body: input }),
      createSchedule: input => request('/admin/schedules', { method: 'POST', body: input }),
      startLive: deviceId => request('/admin/live-sessions', { method: 'POST', body: { deviceId } }),
      stopLive: sessionId => request(`/admin/live-sessions/${encodeURIComponent(sessionId)}/stop`, { method: 'POST' }),
      sendLiveSignal: (sessionId, signal) => request(`/admin/live-sessions/${encodeURIComponent(sessionId)}/signals`, { method: 'POST', body: signal }),
      receiveLiveSignals: (sessionId, after) => request(`/admin/live-sessions/${encodeURIComponent(sessionId)}/signals?after=${Number(after) || 0}`),
      signUpload: input => request('/admin/uploads/sign', { method: 'POST', body: input }),
      completeUpload: assetId => request(`/admin/uploads/${encodeURIComponent(assetId)}/complete`, { method: 'POST', body: {}, timeoutMs: 60000 }),
      upload: async (file, options) => {
        options = options || {}
        const progress = value => { if (typeof options.onProgress === 'function') options.onProgress(value) }
        const workspaceId = await workspaceProvider()
        if (workspaceId) {
          progress({ stage: 'hashing', percent: 3 })
          const bytes = await file.arrayBuffer()
          const hash = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map(byte => byte.toString(16).padStart(2, '0')).join('')
          progress({ stage: 'preparing', percent: 8 })
          const signed = await request('/admin/uploads/sign', { method: 'POST', body: { workspaceId, fileName: file.name, contentType: file.type, byteSize: file.size, sha256: hash } })
          progress({ stage: 'uploading', percent: 10 })
          const sent = await transferFile(signed.upload.url, file, progress)
          if (!sent.ok) throw new Error(`No se pudo transferir el archivo (${sent.status}).`)
          progress({ stage: 'verifying', percent: 90 })
          const completed = await request(`/admin/uploads/${encodeURIComponent(signed.assetId)}/complete`, { method: 'POST', body: { workspaceId }, timeoutMs: 60000 })
          progress({ stage: 'complete', percent: 100 })
          return { upload: { id: signed.assetId, url: completed.downloadUrl || '' }, asset: completed }
        }
        const headers = new Headers({ 'Content-Type': file.type || 'application/octet-stream', 'X-Filename': file.name || 'archivo' })
        const token = await tokenProvider()
        if (token) headers.set('Authorization', `Bearer ${token}`)
        const response = await fetchImpl(baseUrl + '/admin/uploads', { method: 'PUT', headers, body: file, cache: 'no-store' })
        const payload = await response.json().catch(() => null)
        if (!response.ok) throw new Error((payload && payload.message) || `No se pudo subir el archivo (${response.status}).`)
        return payload
      },
    }
  }

  const tokenMap = new WeakMap()
  function createPlayerClient(options) {
    options = options || {}
    const baseUrl = normalizeBaseUrl(options.baseUrl, options.currentOrigin, options.allowedOrigins)
    const fetchImpl = options.fetchImpl || runtime.fetch
    const client = { baseUrl, fetchImpl }
    tokenMap.set(client, options.deviceToken || '')
    client.manifest = async deviceId => {
      const response = await fetchImpl(baseUrl + '/player/manifest', { headers: { Authorization: `Bearer ${tokenMap.get(client)}`, 'X-Device-Id': deviceId }, cache: 'no-store' })
      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        const error = new Error((payload && payload.message) || `No se pudo sincronizar (${response.status}).`)
        error.status = response.status
        throw error
      }
      return payload
    }
    client.runtime = async () => {
      const response = await fetchImpl(baseUrl + '/player/runtime', { headers: { Authorization: `Bearer ${tokenMap.get(client)}`, 'X-Device-Id': options.deviceId || '' }, cache: 'no-store' })
      const payload = await response.json().catch(() => null); if (!response.ok) throw new Error((payload && payload.message) || 'No se pudo preparar la transmisión.'); return payload
    }
    client.heartbeat = async input => {
      const response = await fetchImpl(baseUrl + '/player/heartbeat', { method: 'POST', headers: { Authorization: `Bearer ${tokenMap.get(client)}`, 'X-Device-Id': options.deviceId || '', 'Content-Type': 'application/json' }, body: JSON.stringify(input || {}), cache: 'no-store' })
      const payload = await response.json().catch(() => null); if (!response.ok) throw new Error((payload && payload.message) || 'No se pudo reportar el estado.'); return payload
    }
    client.sendLiveSignal = async (sessionId, signal) => {
      const response = await fetchImpl(`${baseUrl}/player/live-sessions/${encodeURIComponent(sessionId)}/signals`, { method: 'POST', headers: { Authorization: `Bearer ${tokenMap.get(client)}`, 'X-Device-Id': options.deviceId || '', 'Content-Type': 'application/json' }, body: JSON.stringify(signal), cache: 'no-store' })
      const payload = await response.json().catch(() => null); if (!response.ok) throw new Error((payload && payload.message) || 'No se pudo responder a la transmisión.'); return payload
    }
    client.receiveLiveSignals = async (sessionId, after) => {
      const response = await fetchImpl(`${baseUrl}/player/live-sessions/${encodeURIComponent(sessionId)}/signals?after=${Number(after) || 0}`, { headers: { Authorization: `Bearer ${tokenMap.get(client)}`, 'X-Device-Id': options.deviceId || '' }, cache: 'no-store' })
      const payload = await response.json().catch(() => null); if (!response.ok) throw new Error((payload && payload.message) || 'No se pudo recibir la transmisión.'); return payload
    }
    return client
  }
  return { normalizeBaseUrl, publicConfig, createClient, createPlayerClient }
})
