(function (root, factory) {
  const api = factory()
  if (typeof module === 'object' && module.exports) module.exports = api
  root.SignagePhase1 = api
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict'

  const STORAGE_KEY = 'sierra_signage_phase1_v1'
  const SCHEMA_VERSION = 3
  const MAX_AUDIT_EVENTS = 100
  const THEMES = new Set(['neutral', 'teal', 'blue'])
  const CONTENT_TYPES = new Set(['message', 'image', 'video'])
  const IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif'])
  const VIDEO_EXTENSIONS = new Set(['mp4', 'webm'])

  function clone(value) { return JSON.parse(JSON.stringify(value)) }
  function nowIso(now) { return (now || new Date()).toISOString() }
  function makeId(prefix) {
    const random = globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2) + Date.now().toString(36)
    return prefix + '-' + random
  }
  function actorName(actor) { return String(actor || 'Administrador local').trim() || 'Administrador local' }
  function cleanText(value) { return String(value == null ? '' : value).replace(/\s+/g, ' ').trim() }

  function initialState() {
    return {
      schemaVersion: SCHEMA_VERSION,
      mode: 'local-synthetic-phase3',
      screens: [
        {
          id: 'synthetic-screen-a',
          name: 'Pantalla sintética A',
          plant: 'Planta de prueba',
          profile: 'Horizontal · 1920 × 1080',
          evidence: 'Sin telemetría',
          publishedContentId: 'synthetic-content-welcome',
          publicationVersion: 1,
          updatedAt: null,
          history: [],
          lastValidContentId: 'synthetic-content-welcome',
          lastValidAt: null,
        },
        {
          id: 'synthetic-screen-b',
          name: 'Pantalla sintética B',
          plant: 'Planta de prueba',
          profile: 'Vertical · 1080 × 1920',
          evidence: 'Sin telemetría',
          publishedContentId: null,
          publicationVersion: 0,
          updatedAt: null,
          history: [],
          lastValidContentId: null,
          lastValidAt: null,
        },
      ],
      contents: [
        {
          id: 'synthetic-content-welcome',
          type: 'message',
          title: 'Mensaje sintético de bienvenida',
          body: 'Contenido de prueba local para validar el flujo de publicación en SIERRA Index.',
          theme: 'teal',
          createdAt: null,
          createdBy: 'Sistema de prueba',
        },
        {
          id: 'synthetic-content-safety',
          type: 'message',
          title: 'Recordatorio sintético',
          body: 'Este mensaje no sustituye comunicaciones operativas ni sistemas certificados de seguridad.',
          theme: 'blue',
          createdAt: null,
          createdBy: 'Sistema de prueba',
        },
      ],
      playlists: [],
      schedules: [],
      audit: [],
    }
  }

  function normalizeState(input) {
    if (!input || ![1, 3].includes(input.schemaVersion) || !['local-synthetic-phase1', 'local-synthetic-phase3'].includes(input.mode)) return initialState()
    const state = clone(input)
    state.schemaVersion = SCHEMA_VERSION
    state.mode = 'local-synthetic-phase3'
    state.screens = Array.isArray(state.screens) ? state.screens : []
    state.contents = Array.isArray(state.contents) ? state.contents : []
    state.playlists = Array.isArray(state.playlists) ? state.playlists : []
    state.schedules = Array.isArray(state.schedules) ? state.schedules : []
    state.audit = Array.isArray(state.audit) ? state.audit.slice(0, MAX_AUDIT_EVENTS) : []
    state.screens.forEach(screen => {
      screen.history = Array.isArray(screen.history) ? screen.history : []
      screen.lastValidContentId = screen.lastValidContentId || screen.publishedContentId || null
      screen.lastValidAt = screen.lastValidAt || null
    })
    state.contents.forEach(content => { content.type = CONTENT_TYPES.has(content.type) ? content.type : 'message' })
    return state
  }

  function validateContent(input) {
    const type = CONTENT_TYPES.has(input?.type) ? input.type : 'message'
    const title = cleanText(input?.title)
    const body = cleanText(input?.body)
    const theme = THEMES.has(input?.theme) ? input.theme : 'neutral'
    const mediaUrl = cleanText(input?.mediaUrl)
    const alt = cleanText(input?.alt)
    const errors = {}
    if (title.length < 3) errors.title = 'Escribe un título de al menos 3 caracteres.'
    if (title.length > 80) errors.title = 'El título no puede superar 80 caracteres.'
    if (type === 'message' && !body) errors.body = 'Escribe el mensaje que se mostrará.'
    if (body.length > 240) errors.body = 'El texto no puede superar 240 caracteres.'
    if (type !== 'message') {
      let parsed = null
      try { parsed = new URL(mediaUrl) } catch {}
      if (!parsed || parsed.protocol !== 'https:' || parsed.username || parsed.password) errors.mediaUrl = 'Usa una URL HTTPS sin credenciales.'
      const extension = parsed ? (parsed.pathname.split('.').pop() || '').toLowerCase() : ''
      const supported = type === 'image' ? IMAGE_EXTENSIONS : VIDEO_EXTENSIONS
      if (parsed && !supported.has(extension)) errors.mediaUrl = type === 'image' ? 'Formato inicial: JPG, PNG, WebP o GIF.' : 'Formato inicial: MP4 o WebM.'
      if (!alt) errors.alt = type === 'image' ? 'Describe la imagen para accesibilidad.' : 'Describe el contenido del video.'
      if (alt.length > 180) errors.alt = 'La descripción no puede superar 180 caracteres.'
    }
    return { ok: !Object.keys(errors).length, errors, value: { type, title, body, theme, mediaUrl: type === 'message' ? '' : mediaUrl, alt: type === 'message' ? '' : alt } }
  }

  function validatePlaylist(input, state) {
    const name = cleanText(input?.name)
    const entries = Array.isArray(input?.entries) ? input.entries.map(entry => ({
      contentId: cleanText(entry.contentId),
      durationSeconds: Math.trunc(Number(entry.durationSeconds)),
    })) : []
    const errors = {}
    if (name.length < 3 || name.length > 80) errors.name = 'Usa un nombre de 3 a 80 caracteres.'
    if (!entries.length) errors.entries = 'Agrega al menos una pieza.'
    if (entries.length > 50) errors.entries = 'La lista admite hasta 50 entradas.'
    if (entries.some(entry => !state.contents.some(content => content.id === entry.contentId))) errors.entries = 'La lista contiene una pieza inexistente.'
    if (entries.some(entry => !Number.isInteger(entry.durationSeconds) || entry.durationSeconds < 5 || entry.durationSeconds > 3600)) errors.entries = 'Cada duración debe estar entre 5 segundos y 60 minutos.'
    return { ok: !Object.keys(errors).length, errors, value: { name, entries } }
  }

  function validateSchedule(input, state) {
    const screenId = cleanText(input?.screenId)
    const playlistId = cleanText(input?.playlistId)
    const startsAt = new Date(input?.startsAt)
    const endsAt = new Date(input?.endsAt)
    const priority = Math.trunc(Number(input?.priority))
    const errors = {}
    if (!state.screens.some(screen => screen.id === screenId)) errors.screenId = 'Selecciona una pantalla disponible.'
    if (!state.playlists.some(playlist => playlist.id === playlistId)) errors.playlistId = 'Selecciona una lista disponible.'
    if (Number.isNaN(startsAt.getTime())) errors.startsAt = 'Indica un inicio válido.'
    if (Number.isNaN(endsAt.getTime()) || (!Number.isNaN(startsAt.getTime()) && endsAt <= startsAt)) errors.endsAt = 'El fin debe ser posterior al inicio.'
    if (!Number.isInteger(priority) || priority < 0 || priority > 9) errors.priority = 'La prioridad debe estar entre 0 y 9.'
    return { ok: !Object.keys(errors).length, errors, value: { screenId, playlistId, startsAt: Number.isNaN(startsAt.getTime()) ? '' : startsAt.toISOString(), endsAt: Number.isNaN(endsAt.getTime()) ? '' : endsAt.toISOString(), priority } }
  }

  function requireManage(context) {
    if (!context?.canManage) {
      const error = new Error('No tienes permiso para modificar la señalización local.')
      error.code = 'SIGNAGE_FORBIDDEN'
      throw error
    }
  }

  function appendAudit(state, event) {
    state.audit.unshift({ id: makeId('audit'), at: nowIso(event.now), ...event })
    state.audit = state.audit.slice(0, MAX_AUDIT_EVENTS)
  }

  function createContent(current, input, context, options) {
    requireManage(context)
    const validation = validateContent(input)
    if (!validation.ok) {
      const error = new Error('Corrige los campos marcados.')
      error.code = 'SIGNAGE_VALIDATION'
      error.fields = validation.errors
      throw error
    }
    const state = normalizeState(current)
    const content = {
      id: makeId('content'),
      ...validation.value,
      createdAt: nowIso(options?.now),
      createdBy: actorName(context.actor),
    }
    state.contents.unshift(content)
    appendAudit(state, {
      type: 'content.created',
      actor: actorName(context.actor),
      summary: `Creó “${content.title}”`,
      now: options?.now,
    })
    return { state, content }
  }

  function createPlaylist(current, input, context, options) {
    requireManage(context)
    const state = normalizeState(current)
    const validation = validatePlaylist(input, state)
    if (!validation.ok) {
      const error = new Error('Corrige la lista marcada.')
      error.code = 'SIGNAGE_VALIDATION'
      error.fields = validation.errors
      throw error
    }
    const playlist = { id: makeId('playlist'), ...validation.value, createdAt: nowIso(options?.now), createdBy: actorName(context.actor) }
    state.playlists.unshift(playlist)
    appendAudit(state, { type: 'playlist.created', actor: actorName(context.actor), summary: `Creó la lista “${playlist.name}”`, now: options?.now })
    return { state, playlist }
  }

  function createSchedule(current, input, context, options) {
    requireManage(context)
    const state = normalizeState(current)
    const validation = validateSchedule(input, state)
    if (!validation.ok) {
      const error = new Error('Corrige el horario marcado.')
      error.code = 'SIGNAGE_VALIDATION'
      error.fields = validation.errors
      throw error
    }
    const schedule = { id: makeId('schedule'), ...validation.value, createdAt: nowIso(options?.now), createdBy: actorName(context.actor), enabled: true }
    state.schedules.unshift(schedule)
    appendAudit(state, { type: 'schedule.created', actor: actorName(context.actor), screenId: schedule.screenId, summary: `Programó “${state.playlists.find(item => item.id === schedule.playlistId)?.name || 'Lista'}”`, now: options?.now })
    return { state, schedule }
  }

  function activeSchedules(state, screenId, now) {
    const timestamp = (now || new Date()).getTime()
    return normalizeState(state).schedules.filter(schedule => schedule.enabled !== false && schedule.screenId === screenId
      && new Date(schedule.startsAt).getTime() <= timestamp && timestamp < new Date(schedule.endsAt).getTime())
      .sort((a, b) => Number(b.priority) - Number(a.priority)
        || new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime()
        || String(a.id).localeCompare(String(b.id)))
  }

  function playlistContentAt(state, playlist, schedule, now) {
    if (!playlist?.entries?.length) return null
    const total = playlist.entries.reduce((sum, entry) => sum + Number(entry.durationSeconds || 0), 0)
    if (!total) return null
    const elapsed = Math.max(0, Math.floor(((now || new Date()).getTime() - new Date(schedule.startsAt).getTime()) / 1000)) % total
    let cursor = 0
    for (const entry of playlist.entries) {
      cursor += Number(entry.durationSeconds || 0)
      if (elapsed < cursor) return state.contents.find(content => content.id === entry.contentId) || null
    }
    return null
  }

  function contentPlayable(content) { return Boolean(content && validateContent(content).ok) }

  function resolvePlayback(current, screenId, options) {
    const state = normalizeState(current)
    const screen = state.screens.find(item => item.id === screenId) || null
    if (!screen) return { screen: null, content: null, source: 'missing-screen', schedule: null, playlist: null, conflictCount: 0, fallback: false }
    const excluded = new Set(options?.excludeContentIds || [])
    const schedules = activeSchedules(state, screenId, options?.now)
    const schedule = schedules[0] || null
    const playlist = schedule ? state.playlists.find(item => item.id === schedule.playlistId) || null : null
    const scheduledContent = schedule ? playlistContentAt(state, playlist, schedule, options?.now) : null
    if (contentPlayable(scheduledContent) && !excluded.has(scheduledContent.id)) {
      return { screen, content: scheduledContent, source: 'schedule', schedule, playlist, conflictCount: Math.max(0, schedules.length - 1), fallback: false }
    }
    const published = state.contents.find(item => item.id === screen.publishedContentId) || null
    if (!schedule && contentPlayable(published) && !excluded.has(published.id)) {
      return { screen, content: published, source: 'manual', schedule, playlist, conflictCount: 0, fallback: false }
    }
    const lastValid = state.contents.find(item => item.id === screen.lastValidContentId) || null
    if (contentPlayable(lastValid) && !excluded.has(lastValid.id)) {
      return { screen, content: lastValid, source: 'last-valid', schedule, playlist, conflictCount: Math.max(0, schedules.length - 1), fallback: Boolean(schedule) }
    }
    if (contentPlayable(published) && !excluded.has(published.id)) {
      return { screen, content: published, source: 'manual', schedule, playlist, conflictCount: Math.max(0, schedules.length - 1), fallback: Boolean(schedule) }
    }
    return { screen, content: null, source: schedule ? 'schedule-invalid' : 'empty', schedule, playlist, conflictCount: Math.max(0, schedules.length - 1), fallback: Boolean(schedule) }
  }

  function markPlaybackSuccess(current, screenId, contentId, options) {
    const state = normalizeState(current)
    const screen = state.screens.find(item => item.id === screenId)
    if (!screen || !state.contents.some(item => item.id === contentId)) return state
    screen.lastValidContentId = contentId
    screen.lastValidAt = nowIso(options?.now)
    return state
  }

  function publishContent(current, screenId, contentId, context, options) {
    requireManage(context)
    const state = normalizeState(current)
    const screen = state.screens.find(item => item.id === screenId)
    const content = state.contents.find(item => item.id === contentId)
    if (!screen || !content) {
      const error = new Error('La pantalla o el contenido ya no está disponible.')
      error.code = 'SIGNAGE_NOT_FOUND'
      throw error
    }
    const previousContentId = screen.publishedContentId || null
    screen.history.unshift({
      contentId: previousContentId,
      version: screen.publicationVersion || 0,
      at: screen.updatedAt || null,
    })
    screen.history = screen.history.slice(0, 10)
    screen.publishedContentId = content.id
    screen.publicationVersion = Number(screen.publicationVersion || 0) + 1
    screen.updatedAt = nowIso(options?.now)
    appendAudit(state, {
      type: 'screen.published',
      actor: actorName(context.actor),
      screenId: screen.id,
      contentId: content.id,
      summary: `Publicó “${content.title}” en ${screen.name} · versión local ${screen.publicationVersion}`,
      now: options?.now,
    })
    return { state, screen, content }
  }

  function rollbackScreen(current, screenId, context, options) {
    requireManage(context)
    const state = normalizeState(current)
    const screen = state.screens.find(item => item.id === screenId)
    if (!screen || !screen.history.length) {
      const error = new Error('No existe una publicación local anterior para restaurar.')
      error.code = 'SIGNAGE_NO_ROLLBACK'
      throw error
    }
    const previous = screen.history.shift()
    const currentContentId = screen.publishedContentId || null
    screen.history.unshift({ contentId: currentContentId, version: screen.publicationVersion, at: screen.updatedAt })
    screen.publishedContentId = previous.contentId
    screen.publicationVersion = Number(screen.publicationVersion || 0) + 1
    screen.updatedAt = nowIso(options?.now)
    const content = state.contents.find(item => item.id === previous.contentId)
    appendAudit(state, {
      type: 'screen.rolled_back',
      actor: actorName(context.actor),
      screenId: screen.id,
      contentId: previous.contentId,
      summary: `Restauró la publicación anterior de ${screen.name} · versión local ${screen.publicationVersion}`,
      now: options?.now,
    })
    return { state, screen, content: content || null }
  }

  function contentForScreen(state, screenId) {
    return resolvePlayback(state, screenId)
  }

  function createRepository(storage) {
    const backupKey = STORAGE_KEY + '_backup'
    function parse(raw) { return raw ? normalizeState(JSON.parse(raw)) : null }
    return {
      load() {
        try {
          const raw = storage.getItem(STORAGE_KEY)
          return { state: parse(raw) || initialState(), recovered: false, recoveredFromBackup: false, error: null }
        } catch (error) {
          try {
            const backup = parse(storage.getItem(backupKey))
            if (backup) return { state: backup, recovered: true, recoveredFromBackup: true, error }
          } catch {}
          return { state: initialState(), recovered: true, recoveredFromBackup: false, error }
        }
      },
      save(state) {
        const normalized = normalizeState(state)
        const current = storage.getItem(STORAGE_KEY)
        if (current) {
          try { parse(current); storage.setItem(backupKey, current) } catch {}
        }
        storage.setItem(STORAGE_KEY, JSON.stringify(normalized))
        return normalized
      },
      reset() { storage.removeItem(STORAGE_KEY); storage.removeItem(backupKey); return initialState() },
    }
  }

  return {
    STORAGE_KEY,
    SCHEMA_VERSION,
    initialState,
    normalizeState,
    validateContent,
    validatePlaylist,
    validateSchedule,
    createContent,
    createPlaylist,
    createSchedule,
    activeSchedules,
    resolvePlayback,
    markPlaybackSuccess,
    publishContent,
    rollbackScreen,
    contentForScreen,
    createRepository,
  }
})

/* SIERRA Index integration. These functions intentionally remain outside
   the pure phase-one model above so the model can be tested without a DOM. */
let _signageState = null
let _signageLoadWarning = ''
let _signagePlayerTimer = null
let _signagePlayerFailure = null

function signageRepository() { return SignagePhase1.createRepository(window.localStorage) }
function signageContext() {
  return {
    canManage: typeof isAdmin === 'function' && isAdmin(),
    actor: profile?.full_name || me?.email || 'Administrador local',
  }
}
function signageLoadState() {
  const result = signageRepository().load()
  _signageState = result.state
  _signageLoadWarning = result.recovered ? (result.recoveredFromBackup ? 'La copia principal local estaba dañada. Se recuperó la última copia local válida.' : 'Los datos locales no se pudieron leer. Se cargó un conjunto sintético limpio.') : ''
  return _signageState
}
function signageSaveState(next) {
  try {
    _signageState = signageRepository().save(next)
    _signageLoadWarning = ''
    return true
  } catch (error) {
    console.error('signage local save failed:', error)
    toast('No se pudo guardar en este navegador. Revisa el almacenamiento local.')
    return false
  }
}
function signageThemeLabel(theme) { return ({ neutral: 'Neutral', teal: 'Teal SIERRA', blue: 'Azul' })[theme] || 'Neutral' }
function signageTypeLabel(type) { return ({ message: 'Mensaje', image: 'Imagen HTTPS', video: 'Video HTTPS' })[type] || 'Mensaje' }
function signageFormatTime(value) {
  if (!value) return 'Sin publicación registrada'
  try { return new Intl.DateTimeFormat('es', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) } catch { return value }
}
function signageContentById(id) { return _signageState?.contents.find(item => item.id === id) || null }

function showSignage() {
  if (_signagePlayerTimer) { clearInterval(_signagePlayerTimer); _signagePlayerTimer = null }
  _signagePlayerFailure = null
  syncModule('signage')
  _navLeaf = 'signage|_|control'
  sessionStorage.setItem('sierra_route', 'module:signage')
  leaveView()
  renderSidebarTree()
  document.getElementById('tb-section').textContent = 'Señalización'
  document.getElementById('sec-title').textContent = 'Señalización digital'
  document.getElementById('sec-sub').textContent = 'Fase 3 · multimedia, listas y programación local con datos sintéticos'
  const controls = document.getElementById('product-controls')
  controls.style.display = 'flex'
  controls.innerHTML = `<button class="btn btn-secondary" onclick="signageOpenPlaylistDrawer()">Nueva lista</button><button class="btn btn-secondary" onclick="signageOpenScheduleDrawer()">Programar</button><button class="btn btn-primary" onclick="signageOpenContentDrawer()">${siIcon('plus',16)} Nueva pieza</button>`
  signageLoadState()
  renderSignageHome()
}

function renderSignageHome() {
  if (!_signageState) signageLoadState()
  const pg = document.getElementById('pg')
  if (!signageContext().canManage) {
    pg.innerHTML = emptyStateHtml({ title: 'Acceso restringido', desc: 'La fase local de Señalización está disponible únicamente para administradores de plataforma.' })
    return
  }
  const published = _signageState.screens.filter(screen => screen.publishedContentId).length
  const warning = _signageLoadWarning ? `<div class="sg-banner sg-banner-warning" role="alert">${esc(_signageLoadWarning)}</div>` : ''
  pg.innerHTML = `<div class="sg-phase">
    <div class="sg-banner" role="note"><b>Prueba local funcional.</b> Configuración, listas y texto viven solo en este navegador. Las imágenes y videos por URL requieren red y compatibilidad del navegador; no hay nube, telemetría, Smart TV verificada ni garantía offline.</div>
    ${warning}
    <div class="page-metrics sg-metrics" aria-label="Resumen local">
      <div class="sg-metric"><b>${_signageState.screens.length}</b><span>Pantallas sintéticas</span></div>
      <div class="sg-metric"><b>${_signageState.contents.length}</b><span>Piezas locales</span></div>
      <div class="sg-metric"><b>${published}</b><span>Con publicación local</span></div>
      <div class="sg-metric"><b>${_signageState.playlists.length}</b><span>Listas locales</span></div>
      <div class="sg-metric"><b>${_signageState.schedules.length}</b><span>Horarios locales</span></div>
    </div>
    <section aria-labelledby="sg-screens-title">
      <div class="sg-section-head"><div><h3 id="sg-screens-title">Pantallas de prueba</h3><p>El estado físico y de red no está verificado en esta fase.</p></div></div>
      ${signageScreensTableHtml()}
    </section>
    <section aria-labelledby="sg-library-title">
      <div class="sg-section-head"><div><h3 id="sg-library-title">Biblioteca local</h3><p>Mensajes persistentes y referencias HTTPS a imágenes o video; los medios no se descargan ni cachean.</p></div><button class="btn btn-secondary btn-sm" onclick="signageOpenContentDrawer()">${siIcon('plus',15)} Nueva pieza</button></div>
      ${signageLibraryHtml()}
    </section>
    <section aria-labelledby="sg-program-title">
      <div class="sg-section-head"><div><h3 id="sg-program-title">Listas y programación</h3><p>Ventanas absolutas según el reloj del navegador; conflictos por prioridad, inicio más reciente e ID.</p></div><div class="sg-actions"><button class="btn btn-secondary btn-sm" onclick="signageOpenPlaylistDrawer()">Nueva lista</button><button class="btn btn-secondary btn-sm" onclick="signageOpenScheduleDrawer()">Programar</button></div></div>
      ${signageProgrammingHtml()}
    </section>
    <section aria-labelledby="sg-audit-title">
      <div class="sg-section-head"><div><h3 id="sg-audit-title">Actividad local</h3><p>Historial del navegador; no es auditoría de servidor.</p></div><button class="btn btn-ghost btn-sm" onclick="signageResetLocalData()">Restablecer datos sintéticos</button></div>
      ${signageAuditHtml()}
    </section>
  </div>`
}

function signageScreensTableHtml() {
  return `<div class="erp-table-wrap"><table class="erp-table sg-table"><thead><tr><th>Pantalla</th><th>Planta</th><th>Perfil declarado</th><th>Publicación local</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>${_signageState.screens.map(screen => {
    const content = signageContentById(screen.publishedContentId)
    return `<tr><td><b>${esc(screen.name)}</b><div class="sg-sub">ID ${esc(screen.id)}</div></td><td>${esc(screen.plant)}</td><td>${esc(screen.profile)}</td><td>${content ? `<b>${esc(content.title)}</b><div class="sg-sub">v${screen.publicationVersion} · ${screen.updatedAt ? esc(signageFormatTime(screen.updatedAt)) : 'Datos iniciales sintéticos'}</div>` : '<span class="sg-muted">Sin contenido</span>'}</td><td><span class="sg-status sg-status-unknown">${esc(screen.evidence)}</span></td><td><div class="sg-actions"><button class="btn btn-secondary btn-sm" onclick="signageOpenPublishDrawer('${escAttr(screen.id)}')">Publicar</button><button class="btn btn-ghost btn-sm" onclick="signageShowPlayer('${escAttr(screen.id)}')">Abrir reproductor</button>${screen.history.length ? `<button class="btn btn-ghost btn-sm" onclick="signageRollback('${escAttr(screen.id)}')">Rollback</button>` : ''}</div></td></tr>`
  }).join('')}</tbody></table></div>`
}

function signageLibraryHtml() {
  if (!_signageState.contents.length) return emptyStateHtml({ title: 'Sin piezas locales', desc: 'Crea un mensaje sintético para publicarlo en una pantalla de prueba.', actionLabel: 'Nueva pieza', actionOnClick: 'signageOpenContentDrawer()' })
  return `<div class="sg-library">${_signageState.contents.map(content => `<article class="panel sg-content-card"><div class="sg-content-preview sg-theme-${escAttr(content.theme)}" aria-hidden="true"><span>${content.type === 'image' ? 'IMAGEN HTTPS' : content.type === 'video' ? 'VIDEO HTTPS' : esc(content.title)}</span></div><div class="sg-content-copy"><div><h4>${esc(content.title)}</h4><p>${esc(content.body || content.alt || '')}</p></div><div class="sg-sub">${esc(signageTypeLabel(content.type))} · ${esc(signageThemeLabel(content.theme))} · ${esc(content.createdBy)}</div></div></article>`).join('')}</div>`
}

function signageProgrammingHtml() {
  if (!_signageState.playlists.length && !_signageState.schedules.length) return emptyStateHtml({ title: 'Sin programación local', desc: 'Crea una lista ordenada y después asigna una ventana a una pantalla sintética.' })
  const schedules = _signageState.schedules.map(schedule => {
    const screen = _signageState.screens.find(item => item.id === schedule.screenId)
    const playlist = _signageState.playlists.find(item => item.id === schedule.playlistId)
    return `<tr><td><b>${esc(playlist?.name || 'Lista no disponible')}</b></td><td>${esc(screen?.name || 'Pantalla no disponible')}</td><td>${esc(signageFormatTime(schedule.startsAt))}<div class="sg-sub">hasta ${esc(signageFormatTime(schedule.endsAt))}</div></td><td>${schedule.priority}</td></tr>`
  }).join('')
  return `<div class="sg-program-grid"><div><h4>Listas</h4><div class="sg-playlists">${_signageState.playlists.map(playlist => `<article class="panel sg-playlist-card"><b>${esc(playlist.name)}</b><span>${playlist.entries.length} pieza${playlist.entries.length === 1 ? '' : 's'} · ${playlist.entries.reduce((sum,item)=>sum+item.durationSeconds,0)} s por vuelta</span><ol>${playlist.entries.map(entry => `<li>${esc(signageContentById(entry.contentId)?.title || 'Pieza no disponible')} · ${entry.durationSeconds}s</li>`).join('')}</ol></article>`).join('') || '<p class="sg-muted">Sin listas.</p>'}</div></div><div><h4>Horarios</h4>${schedules ? `<div class="erp-table-wrap"><table class="erp-table sg-schedule-table"><thead><tr><th>Lista</th><th>Pantalla</th><th>Ventana</th><th>Prioridad</th></tr></thead><tbody>${schedules}</tbody></table></div>` : '<p class="sg-muted">Sin horarios.</p>'}</div></div>`
}

function signageAuditHtml() {
  if (!_signageState.audit.length) return emptyStateHtml({ title: 'Sin actividad todavía', desc: 'Las publicaciones y piezas creadas en este navegador aparecerán aquí.' })
  return `<div class="erp-table-wrap"><table class="erp-table"><thead><tr><th>Evento</th><th>Actor local</th><th>Fecha del navegador</th></tr></thead><tbody>${_signageState.audit.slice(0, 10).map(event => `<tr><td>${esc(event.summary)}</td><td>${esc(event.actor)}</td><td>${esc(signageFormatTime(event.at))}</td></tr>`).join('')}</tbody></table></div>`
}

function signageOpenContentDrawer() {
  if (!signageContext().canManage) { toast('No tienes permiso para crear contenido.'); return }
  openSideDrawer({ eyebrow: 'Señalización · Fase 3', title: 'Nueva pieza local', onTab: () => {
    document.getElementById('sd-body').innerHTML = `<form class="sg-form" onsubmit="signageSubmitContent(event)" novalidate>
      <div class="sg-form-note">La configuración se guarda en este navegador. Las URLs multimedia se reproducen desde su origen y requieren red; no se descargan ni validan en una TV.</div>
      <fieldset class="sg-theme-field"><legend>Tipo de pieza</legend><div class="sg-type-options" role="radiogroup">${['message','image','video'].map((type,index)=>`<button type="button" class="sg-type-option${index===0?' selected':''}" data-content-type="${type}" role="radio" aria-checked="${index===0}" onclick="signageChooseContentType(this)">${esc(signageTypeLabel(type))}</button>`).join('')}</div></fieldset>
      <label class="sg-field" for="sg-content-title"><span>Título <b aria-hidden="true">*</b></span><input class="control-input" id="sg-content-title" maxlength="80" required aria-describedby="sg-content-title-error"><small id="sg-content-title-error" class="sg-error"></small></label>
      <label class="sg-field" for="sg-content-body"><span id="sg-body-label">Mensaje <b aria-hidden="true">*</b></span><textarea class="control-input sg-textarea" id="sg-content-body" maxlength="240" required aria-describedby="sg-content-body-error"></textarea><small id="sg-content-body-error" class="sg-error"></small></label>
      <div id="sg-media-fields" hidden><label class="sg-field" for="sg-content-mediaUrl"><span>URL HTTPS <b aria-hidden="true">*</b></span><input class="control-input" id="sg-content-mediaUrl" inputmode="url" maxlength="2048" aria-describedby="sg-content-mediaUrl-error"><small id="sg-content-mediaUrl-error" class="sg-error"></small></label><label class="sg-field" for="sg-content-alt"><span>Descripción accesible <b aria-hidden="true">*</b></span><input class="control-input" id="sg-content-alt" maxlength="180" aria-describedby="sg-content-alt-error"><small id="sg-content-alt-error" class="sg-error"></small></label></div>
      <fieldset class="sg-theme-field"><legend>Estilo de contenido</legend><div class="sg-theme-options" role="radiogroup">${['neutral','teal','blue'].map((theme, index) => `<button type="button" class="sg-theme-option${index === 0 ? ' selected' : ''}" data-theme="${theme}" role="radio" aria-checked="${index === 0}" onclick="signageChooseTheme(this)"><span class="sg-theme-swatch sg-theme-${theme}"></span>${esc(signageThemeLabel(theme))}</button>`).join('')}</div></fieldset>
      <div class="sg-form-actions"><button type="button" class="btn btn-secondary" onclick="closeSideDrawer()">Cancelar</button><button type="submit" class="btn btn-primary">Guardar pieza local</button></div>
    </form>`
    requestAnimationFrame(() => document.getElementById('sg-content-title')?.focus())
  } })
}

function signageChooseContentType(button) {
  button.closest('.sg-type-options').querySelectorAll('.sg-type-option').forEach(option => {
    const selected = option === button
    option.classList.toggle('selected', selected)
    option.setAttribute('aria-checked', String(selected))
  })
  const isMessage = button.dataset.contentType === 'message'
  const media = document.getElementById('sg-media-fields')
  if (media) media.hidden = isMessage
  const body = document.getElementById('sg-content-body')
  if (body) body.required = isMessage
  const label = document.getElementById('sg-body-label')
  if (label) label.innerHTML = isMessage ? 'Mensaje <b aria-hidden="true">*</b>' : 'Texto de apoyo <span class="sg-optional">Opcional</span>'
}

function signageChooseTheme(button) {
  button.closest('.sg-theme-options').querySelectorAll('.sg-theme-option').forEach(option => {
    const selected = option === button
    option.classList.toggle('selected', selected)
    option.setAttribute('aria-checked', String(selected))
  })
}

function signageSubmitContent(event) {
  event.preventDefault()
  const title = document.getElementById('sg-content-title')
  const body = document.getElementById('sg-content-body')
  const type = document.querySelector('.sg-type-option.selected')?.dataset.contentType || 'message'
  const mediaUrl = document.getElementById('sg-content-mediaUrl')
  const alt = document.getElementById('sg-content-alt')
  const theme = document.querySelector('.sg-theme-option.selected')?.dataset.theme || 'neutral'
  document.querySelectorAll('.sg-error').forEach(el => { el.textContent = '' })
  ;[title, body, mediaUrl, alt].forEach(input => input?.removeAttribute('aria-invalid'))
  try {
    const result = SignagePhase1.createContent(_signageState, { type, title: title.value, body: body.value, theme, mediaUrl: mediaUrl?.value, alt: alt?.value }, signageContext())
    if (!signageSaveState(result.state)) return
    closeSideDrawer()
    renderSignageHome()
    toast('Pieza guardada únicamente en este navegador.')
  } catch (error) {
    if (error.fields) {
      Object.entries(error.fields).forEach(([field, message]) => {
        const input = document.getElementById('sg-content-' + field)
        const errorEl = document.getElementById('sg-content-' + field + '-error')
        input?.setAttribute('aria-invalid', 'true')
        if (errorEl) errorEl.textContent = message
      })
      ;(error.fields.title ? title : error.fields.body ? body : error.fields.mediaUrl ? mediaUrl : alt)?.focus()
      return
    }
    toast(error.message || 'No se pudo crear la pieza local.')
  }
}

function signageOpenPlaylistDrawer() {
  if (!signageContext().canManage) { toast('No tienes permiso para crear listas.'); return }
  openSideDrawer({ eyebrow: 'Programación local', title: 'Nueva lista', onTab: () => {
    document.getElementById('sd-body').innerHTML = `<form class="sg-form" onsubmit="signageSubmitPlaylist(event)" novalidate>
      <div class="sg-form-note">El orden mostrado define la rotación. Cada duración se evalúa con el reloj del navegador.</div>
      <label class="sg-field" for="sg-playlist-name"><span>Nombre <b aria-hidden="true">*</b></span><input class="control-input" id="sg-playlist-name" maxlength="80"><small id="sg-playlist-name-error" class="sg-error"></small></label>
      <fieldset class="sg-theme-field"><legend>Piezas y duración</legend><div class="sg-entry-list">${_signageState.contents.map(content => `<div class="sg-entry-row"><button type="button" class="sg-entry" data-content-id="${escAttr(content.id)}" aria-pressed="false" onclick="this.classList.toggle('selected');this.setAttribute('aria-pressed',String(this.classList.contains('selected')))"><span class="sg-theme-swatch sg-theme-${escAttr(content.theme)}"></span><span><b>${esc(content.title)}</b><small>${esc(signageTypeLabel(content.type))}</small></span></button><label><span>segundos</span><input class="control-input sg-duration" type="number" min="5" max="3600" step="1" value="15" aria-label="Duración de ${escAttr(content.title)}"></label></div>`).join('')}</div><small id="sg-playlist-entries-error" class="sg-error"></small></fieldset>
      <div class="sg-form-actions"><button type="button" class="btn btn-secondary" onclick="closeSideDrawer()">Cancelar</button><button type="submit" class="btn btn-primary">Guardar lista</button></div>
    </form>`
    requestAnimationFrame(() => document.getElementById('sg-playlist-name')?.focus())
  } })
}

function signageSubmitPlaylist(event) {
  event.preventDefault()
  document.querySelectorAll('.sg-error').forEach(el => { el.textContent = '' })
  const entries = [...document.querySelectorAll('.sg-entry-row')].filter(row => row.querySelector('.sg-entry.selected')).map(row => ({ contentId: row.querySelector('.sg-entry').dataset.contentId, durationSeconds: row.querySelector('.sg-duration').value }))
  try {
    const result = SignagePhase1.createPlaylist(_signageState, { name: document.getElementById('sg-playlist-name').value, entries }, signageContext())
    if (!signageSaveState(result.state)) return
    closeSideDrawer(); renderSignageHome(); toast('Lista guardada únicamente en este navegador.')
  } catch (error) {
    if (error.fields?.name) document.getElementById('sg-playlist-name-error').textContent = error.fields.name
    if (error.fields?.entries) document.getElementById('sg-playlist-entries-error').textContent = error.fields.entries
    toast(error.message || 'No se pudo crear la lista.')
  }
}

function signageLocalDateTimeValue(date) {
  const adjusted = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return adjusted.toISOString().slice(0, 16)
}

function signageOpenScheduleDrawer() {
  if (!signageContext().canManage) { toast('No tienes permiso para programar.'); return }
  if (!_signageState.playlists.length) { toast('Crea una lista antes de programar.'); return }
  const start = new Date(Date.now() - 60000)
  const end = new Date(start.getTime() + 60 * 60 * 1000)
  openSideDrawer({ eyebrow: 'Programación local', title: 'Nuevo horario', onTab: () => {
    document.getElementById('sd-body').innerHTML = `<form class="sg-form" onsubmit="signageSubmitSchedule(event)" novalidate>
      <div class="sg-form-note">Ventana absoluta en la zona del navegador (${esc(Intl.DateTimeFormat().resolvedOptions().timeZone || 'local')}). No existe sincronización de reloj con un dispositivo.</div>
      <fieldset class="sg-theme-field"><legend>Pantalla</legend><div class="sg-choice-list">${_signageState.screens.map((screen,index)=>`<button type="button" class="sg-choice${index===0?' selected':''}" data-screen-id="${escAttr(screen.id)}" aria-pressed="${index===0}" onclick="signageChooseOne(this,'.sg-choice[data-screen-id]')">${esc(screen.name)}</button>`).join('')}</div><small id="sg-schedule-screenId-error" class="sg-error"></small></fieldset>
      <fieldset class="sg-theme-field"><legend>Lista</legend><div class="sg-choice-list">${_signageState.playlists.map((playlist,index)=>`<button type="button" class="sg-choice${index===0?' selected':''}" data-playlist-id="${escAttr(playlist.id)}" aria-pressed="${index===0}" onclick="signageChooseOne(this,'.sg-choice[data-playlist-id]')">${esc(playlist.name)}</button>`).join('')}</div><small id="sg-schedule-playlistId-error" class="sg-error"></small></fieldset>
      <label class="sg-field"><span>Inicio <b aria-hidden="true">*</b></span><input class="control-input" id="sg-schedule-startsAt" type="datetime-local" value="${signageLocalDateTimeValue(start)}"><small id="sg-schedule-startsAt-error" class="sg-error"></small></label>
      <label class="sg-field"><span>Fin <b aria-hidden="true">*</b></span><input class="control-input" id="sg-schedule-endsAt" type="datetime-local" value="${signageLocalDateTimeValue(end)}"><small id="sg-schedule-endsAt-error" class="sg-error"></small></label>
      <label class="sg-field"><span>Prioridad (0–9)</span><input class="control-input" id="sg-schedule-priority" type="number" min="0" max="9" step="1" value="0"><small id="sg-schedule-priority-error" class="sg-error"></small></label>
      <div class="sg-form-actions"><button type="button" class="btn btn-secondary" onclick="closeSideDrawer()">Cancelar</button><button type="submit" class="btn btn-primary">Guardar horario</button></div>
    </form>`
  } })
}

function signageChooseOne(button, selector) {
  button.closest('.sg-choice-list').querySelectorAll(selector).forEach(option => {
    const selected = option === button
    option.classList.toggle('selected', selected)
    option.setAttribute('aria-pressed', String(selected))
  })
}

function signageSubmitSchedule(event) {
  event.preventDefault()
  document.querySelectorAll('.sg-error').forEach(el => { el.textContent = '' })
  const input = {
    screenId: document.querySelector('.sg-choice.selected[data-screen-id]')?.dataset.screenId,
    playlistId: document.querySelector('.sg-choice.selected[data-playlist-id]')?.dataset.playlistId,
    startsAt: document.getElementById('sg-schedule-startsAt').value,
    endsAt: document.getElementById('sg-schedule-endsAt').value,
    priority: document.getElementById('sg-schedule-priority').value,
  }
  try {
    const result = SignagePhase1.createSchedule(_signageState, input, signageContext())
    if (!signageSaveState(result.state)) return
    closeSideDrawer(); renderSignageHome(); toast('Horario guardado únicamente en este navegador.')
  } catch (error) {
    Object.entries(error.fields || {}).forEach(([field,message]) => {
      const el = document.getElementById('sg-schedule-' + field + '-error')
      if (el) el.textContent = message
    })
    toast(error.message || 'No se pudo crear el horario.')
  }
}

function signageOpenPublishDrawer(screenId) {
  if (!signageContext().canManage) { toast('No tienes permiso para publicar.'); return }
  const screen = _signageState.screens.find(item => item.id === screenId)
  if (!screen) { toast('La pantalla ya no está disponible.'); return }
  openSideDrawer({ eyebrow: 'Publicación local', title: screen.name, onTab: () => {
    document.getElementById('sd-body').innerHTML = `<div class="sg-publish"><div class="sg-form-note"><b>Alcance:</b> solo cambia el reproductor local de prueba. No hay sincronización con una televisión.</div><p>Selecciona la pieza que debe quedar activa.</p><div class="sg-publish-list">${_signageState.contents.map(content => `<button type="button" class="sg-publish-item${screen.publishedContentId === content.id ? ' current' : ''}" onclick="signagePublish('${escAttr(screen.id)}','${escAttr(content.id)}')"><span class="sg-theme-swatch sg-theme-${escAttr(content.theme)}"></span><span><b>${esc(content.title)}</b><small>${esc(content.body)}</small></span>${screen.publishedContentId === content.id ? '<em>Actual</em>' : ''}</button>`).join('')}</div></div>`
  } })
}

function signagePublish(screenId, contentId) {
  try {
    const result = SignagePhase1.publishContent(_signageState, screenId, contentId, signageContext())
    if (!signageSaveState(result.state)) return
    closeSideDrawer()
    renderSignageHome()
    toast('Publicación local aplicada a ' + result.screen.name + '.')
  } catch (error) { toast(error.message || 'No se pudo publicar localmente.') }
}

function signageRollback(screenId) {
  const screen = _signageState.screens.find(item => item.id === screenId)
  if (!screen || !confirm(`Restaurar la publicación local anterior de ${screen?.name || 'esta pantalla'}?`)) return
  try {
    const result = SignagePhase1.rollbackScreen(_signageState, screenId, signageContext())
    if (!signageSaveState(result.state)) return
    renderSignageHome()
    toast('Se restauró la publicación local anterior.')
  } catch (error) { toast(error.message || 'No se pudo restaurar la publicación.') }
}

function signageShowPlayer(screenId) {
  const result = SignagePhase1.resolvePlayback(_signageState, screenId)
  if (!result.screen) { toast('La pantalla ya no está disponible.'); return }
  if (_signagePlayerTimer) clearInterval(_signagePlayerTimer)
  _signagePlayerFailure = null
  document.getElementById('product-controls').style.display = 'none'
  setSecCrumbs([{ label: 'Señalización', onclick: 'showSignage()' }, { label: result.screen.name }])
  document.getElementById('sec-title').textContent = result.screen.name
  document.getElementById('sec-sub').textContent = 'Reproductor local de prueba · no representa una televisión conectada'
  document.getElementById('pg').innerHTML = `<div class="sg-player-page"><div class="sg-player-toolbar"><span class="sg-status sg-status-unknown">Sin telemetría</span><span>Perfil declarado: ${esc(result.screen.profile)}</span><button class="btn btn-secondary btn-sm" onclick="document.getElementById('sg-player-frame')?.requestFullscreen?.()">Pantalla completa</button></div><div id="sg-player-host"></div><p class="sg-player-disclaimer">El texto y la programación están en localStorage. Los medios HTTPS no se cachean: una falla de red intenta el último contenido válido local, pero no demuestra continuidad offline ni estado físico de una TV.</p></div>`
  signageRenderPlayer(screenId)
  _signagePlayerTimer = setInterval(() => signageRefreshPlayer(screenId), 1000)
}

function signagePlayerBody(result) {
  const content = result.content
  if (!content) return `<div class="sg-player-empty"><b>Sin contenido reproducible</b><span>No existe una publicación local válida para recuperar.</span></div>`
  if (content.type === 'image') return `<div class="sg-player-media"><img src="${escAttr(content.mediaUrl)}" alt="${escAttr(content.alt)}" onload="signageRecordPlaybackSuccess('${escAttr(result.screen.id)}','${escAttr(content.id)}')" onerror="signagePlayerMediaFailed('${escAttr(result.screen.id)}','${escAttr(content.id)}')"><div class="sg-media-caption"><b>${esc(content.title)}</b>${content.body ? `<span>${esc(content.body)}</span>` : ''}</div></div>`
  if (content.type === 'video') return `<div class="sg-player-media"><video src="${escAttr(content.mediaUrl)}" aria-label="${escAttr(content.alt)}" autoplay muted playsinline oncanplay="signageRecordPlaybackSuccess('${escAttr(result.screen.id)}','${escAttr(content.id)}')" onerror="signagePlayerMediaFailed('${escAttr(result.screen.id)}','${escAttr(content.id)}')"></video><div class="sg-media-caption"><b>${esc(content.title)}</b>${content.body ? `<span>${esc(content.body)}</span>` : ''}</div></div>`
  return `<div class="sg-player-content"><div class="sg-player-eyebrow">SIERRA · PRUEBA LOCAL</div><h2>${esc(content.title)}</h2><p>${esc(content.body)}</p></div>`
}

function signageRenderPlayer(screenId) {
  const excluded = _signagePlayerFailure?.screenId === screenId ? _signagePlayerFailure.contentIds : []
  const result = SignagePhase1.resolvePlayback(_signageState, screenId, { excludeContentIds: excluded })
  const host = document.getElementById('sg-player-host')
  if (!host || !result.screen) return
  const key = [result.content?.id || 'empty', result.source, result.schedule?.id || '', result.conflictCount].join('|')
  host.dataset.playbackKey = key
  const source = result.source === 'schedule' ? `Lista programada: ${result.playlist?.name || ''}` : result.source === 'last-valid' ? 'Último contenido local válido' : result.source === 'manual' ? 'Publicación manual local' : 'Sin fuente válida'
  const warning = _signagePlayerFailure ? '<div class="sg-player-warning" role="alert">El medio no cargó en este navegador; se intentó recuperar el último contenido local válido.</div>' : ''
  host.innerHTML = `${warning}<div class="sg-player-meta"><span>${esc(source)}</span>${result.conflictCount ? `<span>${result.conflictCount} horario(s) desplazado(s) por la regla de prioridad</span>` : ''}</div><div class="sg-player-frame ${result.content ? `sg-theme-${escAttr(result.content.theme)}` : 'sg-theme-neutral'}" id="sg-player-frame" tabindex="0" aria-label="Reproductor local de ${escAttr(result.screen.name)}">${signagePlayerBody(result)}</div>`
  if (result.content?.type === 'message') signageRecordPlaybackSuccess(result.screen.id, result.content.id)
}

function signageRefreshPlayer(screenId) {
  const excluded = _signagePlayerFailure?.screenId === screenId ? _signagePlayerFailure.contentIds : []
  const result = SignagePhase1.resolvePlayback(_signageState, screenId, { excludeContentIds: excluded })
  const key = [result.content?.id || 'empty', result.source, result.schedule?.id || '', result.conflictCount].join('|')
  if (document.getElementById('sg-player-host')?.dataset.playbackKey !== key) signageRenderPlayer(screenId)
}

function signageRecordPlaybackSuccess(screenId, contentId) {
  const screen = _signageState?.screens.find(item => item.id === screenId)
  if (!screen || screen.lastValidContentId === contentId) return
  const next = SignagePhase1.markPlaybackSuccess(_signageState, screenId, contentId)
  signageSaveState(next)
}

function signagePlayerMediaFailed(screenId, contentId) {
  if (_signagePlayerFailure?.screenId !== screenId) _signagePlayerFailure = { screenId, contentIds: [] }
  if (!_signagePlayerFailure.contentIds.includes(contentId)) _signagePlayerFailure.contentIds.push(contentId)
  signageRenderPlayer(screenId)
}

function signageResetLocalData() {
  if (!signageContext().canManage || !confirm('¿Restablecer piezas, publicaciones e historial sintéticos de este navegador?')) return
  try {
    _signageState = signageRepository().reset()
    _signageLoadWarning = ''
    renderSignageHome()
    toast('Datos sintéticos restablecidos.')
  } catch { toast('No se pudo restablecer el almacenamiento local.') }
}
