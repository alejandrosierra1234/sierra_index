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
  const CONTENT_TYPES = new Set(['message', 'image', 'video', 'link'])
  const SCREEN_ORIENTATIONS = new Set(['horizontal', 'vertical'])
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
      screens: [],
      contents: [],
      playlists: [],
      schedules: [],
      audit: [],
    }
  }

  function demoState() {
    const state = initialState()
    state.testFixtures = true
    state.screens = [
        {
          id: 'synthetic-screen-a',
          name: 'Pantalla sintética A',
          plant: 'Planta de prueba',
          profile: 'Horizontal · 1920 × 1080',
          kind: 'local-test',
          connectionState: 'not-linked',
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
          kind: 'local-test',
          connectionState: 'not-linked',
          evidence: 'Sin telemetría',
          publishedContentId: null,
          publicationVersion: 0,
          updatedAt: null,
          history: [],
          lastValidContentId: null,
          lastValidAt: null,
        },
      ]
    state.contents = [
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
      ]
    return state
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
      screen.kind = screen.kind || 'local-test'
      screen.connectionState = screen.connectionState || 'not-linked'
    })
    state.contents.forEach(content => { content.type = CONTENT_TYPES.has(content.type) ? content.type : 'message' })
    return state
  }

  function validateScreen(input, state) {
    const name = cleanText(input?.name)
    const plant = cleanText(input?.plant)
    const orientation = SCREEN_ORIENTATIONS.has(input?.orientation) ? input.orientation : 'horizontal'
    const width = Math.trunc(Number(input?.width))
    const height = Math.trunc(Number(input?.height))
    const errors = {}
    if (name.length < 3 || name.length > 80) errors.name = 'Usa un nombre de 3 a 80 caracteres.'
    if (plant.length < 2 || plant.length > 80) errors.plant = 'Usa una planta de 2 a 80 caracteres.'
    if (!SCREEN_ORIENTATIONS.has(input?.orientation)) errors.orientation = 'Selecciona una orientación.'
    if (!Number.isInteger(width) || width < 320 || width > 7680) errors.width = 'El ancho debe estar entre 320 y 7,680 px.'
    if (!Number.isInteger(height) || height < 320 || height > 7680) errors.height = 'El alto debe estar entre 320 y 7,680 px.'
    if (state?.screens?.some(screen => cleanText(screen.name).toLocaleLowerCase('es') === name.toLocaleLowerCase('es'))) errors.name = 'Ya existe una pantalla local con ese nombre.'
    return { ok: !Object.keys(errors).length, errors, value: { name, plant, orientation, width, height } }
  }

  function validateContent(input) {
    const type = CONTENT_TYPES.has(input?.type) ? input.type : 'message'
    const title = cleanText(input?.title)
    const body = cleanText(input?.body)
    const theme = THEMES.has(input?.theme) ? input.theme : 'neutral'
    const mediaUrl = cleanText(input?.mediaUrl)
    const linkUrl = cleanText(input?.url)
    const alt = cleanText(input?.alt)
    const errors = {}
    if (title.length < 3) errors.title = 'Escribe un título de al menos 3 caracteres.'
    if (title.length > 80) errors.title = 'El título no puede superar 80 caracteres.'
    if (type === 'message' && !body) errors.body = 'Escribe el mensaje que se mostrará.'
    if (body.length > 240) errors.body = 'El texto no puede superar 240 caracteres.'
    if (type === 'image' || type === 'video') {
      let parsed = null
      try { parsed = new URL(mediaUrl) } catch {}
      if (!parsed || parsed.protocol !== 'https:' || parsed.username || parsed.password) errors.mediaUrl = 'Usa una URL HTTPS sin credenciales.'
      const extension = parsed ? (parsed.pathname.split('.').pop() || '').toLowerCase() : ''
      const supported = type === 'image' ? IMAGE_EXTENSIONS : VIDEO_EXTENSIONS
      if (parsed && !supported.has(extension)) errors.mediaUrl = type === 'image' ? 'Formato inicial: JPG, PNG, WebP o GIF.' : 'Formato inicial: MP4 o WebM.'
      if (!alt) errors.alt = type === 'image' ? 'Describe la imagen para accesibilidad.' : 'Describe el contenido del video.'
      if (alt.length > 180) errors.alt = 'La descripción no puede superar 180 caracteres.'
    }
    if (type === 'link') {
      try { const parsed = new URL(linkUrl); if (parsed.protocol !== 'https:' || parsed.username || parsed.password) throw new Error() } catch { errors.url = 'Usa un enlace HTTPS sin usuario ni contraseña.' }
    }
    return { ok: !Object.keys(errors).length, errors, value: { type, title, body, theme, mediaUrl: ['image','video'].includes(type) ? mediaUrl : '', alt: ['image','video'].includes(type) ? alt : '', url: type === 'link' ? linkUrl : '' } }
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
      const error = new Error('No tienes permiso para modificar Pantallas.')
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

  function createTestScreen(current, input, context, options) {
    requireManage(context)
    const state = normalizeState(current)
    const validation = validateScreen(input, state)
    if (!validation.ok) {
      const error = new Error('Corrige los campos marcados.')
      error.code = 'SIGNAGE_VALIDATION'
      error.fields = validation.errors
      throw error
    }
    const value = validation.value
    const screen = {
      id: makeId('test-screen'),
      name: value.name,
      plant: value.plant,
      profile: `${value.orientation === 'vertical' ? 'Vertical' : 'Horizontal'} · ${value.width} × ${value.height}`,
      orientation: value.orientation,
      width: value.width,
      height: value.height,
      kind: 'local-test',
      connectionState: 'not-linked',
      evidence: 'Sin telemetría',
      publishedContentId: null,
      publicationVersion: 0,
      updatedAt: null,
      history: [],
      lastValidContentId: null,
      lastValidAt: null,
      createdAt: nowIso(options?.now),
      createdBy: actorName(context.actor),
    }
    state.screens.unshift(screen)
    appendAudit(state, { type: 'screen.created', actor: actorName(context.actor), screenId: screen.id, summary: `Registró la pantalla de prueba “${screen.name}” · no vinculada`, now: options?.now })
    return { state, screen }
  }

  function registerPairedScreen(current, device, context) {
    requireManage(context)
    const state = normalizeState(current)
    const id = cleanText(device?.id), name = cleanText(device?.name), plant = cleanText(device?.plant), profile = cleanText(device?.profile)
    if (!id || name.length < 3 || plant.length < 2 || profile.length < 3) {
      const error = new Error('El servicio devolvió una pantalla incompleta.')
      error.code = 'SIGNAGE_BACKEND_INVALID'
      throw error
    }
    if (state.screens.some(screen => screen.id === id)) return { state, screen: state.screens.find(screen => screen.id === id) }
    const screen = { id, name, plant, profile, kind: 'paired', connectionState: 'paired', evidence: 'Esperando primera conexión', publishedContentId: null, publicationVersion: 0, updatedAt: null, history: [], lastValidContentId: null, lastValidAt: null }
    state.screens.unshift(screen)
    appendAudit(state, { type: 'screen.paired', actor: actorName(context.actor), screenId: id, summary: `Vinculó “${name}” mediante código` })
    return { state, screen }
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
    function removeLegacyDemo(state) {
      if (!state || state.testFixtures) return state
      const legacyScreenIds = new Set(['synthetic-screen-a','synthetic-screen-b'])
      const legacyContentIds = new Set(['synthetic-content-welcome','synthetic-content-safety'])
      state.screens = state.screens.filter(screen => !legacyScreenIds.has(screen.id) || screen.updatedAt || screen.history?.length)
      const referenced = new Set(state.screens.flatMap(screen => [screen.publishedContentId,screen.lastValidContentId]).filter(Boolean))
      state.contents = state.contents.filter(content => !legacyContentIds.has(content.id) || referenced.has(content.id) || content.createdAt)
      return state
    }
    return {
      load() {
        try {
          const raw = storage.getItem(STORAGE_KEY)
          return { state: removeLegacyDemo(parse(raw)) || initialState(), recovered: false, recoveredFromBackup: false, error: null }
        } catch (error) {
          try {
            const backup = parse(storage.getItem(backupKey))
            if (backup) return { state: removeLegacyDemo(backup), recovered: true, recoveredFromBackup: true, error }
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
    demoState,
    normalizeState,
    validateContent,
    validateScreen,
    validatePlaylist,
    validateSchedule,
    createContent,
    createTestScreen,
    registerPairedScreen,
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
let _signageLiveSender = null
let _signageLiveScreenId = null

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
  _signageLoadWarning = result.recovered ? (result.recoveredFromBackup ? 'La copia principal guardada estaba dañada. Recuperamos la última copia válida.' : 'No pudimos leer los datos guardados. Empezamos con un espacio limpio.') : ''
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
function signageTypeLabel(type) { return ({ message: 'Mensaje', image: 'Imagen', video: 'Video', link: 'Enlace' })[type] || 'Mensaje' }
function signageFormatTime(value) {
  if (!value) return 'Sin publicación registrada'
  try { return new Intl.DateTimeFormat('es', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) } catch { return value }
}
function signageContentById(id) { return _signageState?.contents.find(item => item.id === id) || null }
function signagePublicConfig() { return SignageBackendClient.publicConfig(window.SIERRA_SIGNAGE_CONFIG || {}) }
function signageBackendClient() {
  const config = signagePublicConfig()
  if (!config.enabled) throw new Error('El servicio central de Pantallas todavía no está habilitado.')
  return SignageBackendClient.createClient({
    baseUrl: config.backendUrl || '/api/signage',
    currentOrigin: location.origin,
    allowedOrigins: config.allowedOrigins,
    workspaceProvider: async () => config.workspaceId,
    tokenProvider: async () => {
      if (window.SIERRA_SIGNAGE_LOCAL_ADMIN_TOKEN) return window.SIERRA_SIGNAGE_LOCAL_ADMIN_TOKEN
      const result = await sb.auth.getSession()
      return result.data.session?.access_token || ''
    },
  })
}

function showSignage() {
  if (_signagePlayerTimer) { clearInterval(_signagePlayerTimer); _signagePlayerTimer = null }
  _signagePlayerFailure = null
  syncModule('signage')
  _navLeaf = 'signage|_|control'
  sessionStorage.setItem('sierra_route', 'module:signage')
  leaveView()
  renderSidebarTree()
  document.getElementById('tb-section').textContent = 'Pantallas'
  document.getElementById('sec-title').textContent = 'Pantallas'
  document.getElementById('sec-sub').textContent = 'Agrega una pantalla, elige contenido y muéstralo'
  const controls = document.getElementById('product-controls')
  controls.style.display = 'flex'
  controls.innerHTML = `<button class="btn btn-secondary" onclick="signageOpenContentDrawer()">Agregar contenido</button><button class="btn btn-secondary" onclick="signageOpenPlaylistDrawer()">Nueva lista</button><button class="btn btn-secondary" onclick="signageOpenScheduleDrawer()">Crear horario</button><button class="btn btn-primary" onclick="signageOpenScreenDrawer()">${siIcon('plus',16)} Agregar pantalla</button>`
  signageLoadState()
  renderSignageHome()
}

function renderSignageHome() {
  if (!_signageState) signageLoadState()
  const pg = document.getElementById('pg')
  if (!signageContext().canManage) {
    pg.innerHTML = emptyStateHtml({ title: 'Acceso restringido', desc: 'No tienes permiso para administrar Pantallas.' })
    return
  }
  const published = _signageState.screens.filter(screen => screen.publishedContentId).length
  const warning = _signageLoadWarning ? `<div class="sg-banner sg-banner-warning" role="alert">${esc(_signageLoadWarning)}</div>` : ''
  pg.innerHTML = `<div class="sg-phase">
    ${_signageLiveSender ? `<div class="sg-live-active" role="status"><div><b>Estás compartiendo tu pantalla</b><span>Se muestra en ${esc(_signageState.screens.find(item => item.id === _signageLiveScreenId)?.name || 'la pantalla elegida')}.</span></div><button class="btn btn-secondary" onclick="signageStopLive()">Dejar de compartir</button></div>` : ''}
    <div class="sg-banner" role="note"><b>Modo de prueba en este navegador.</b> Puedes aprender el flujo sin afectar televisiones reales. Lo que agregues aquí no aparecerá en otro equipo hasta conectar el servicio central.</div>
    ${warning}
    <div class="page-metrics sg-metrics" aria-label="Resumen local">
      <div class="sg-metric"><b>${_signageState.screens.length}</b><span>Pantallas agregadas</span></div>
      <div class="sg-metric"><b>${_signageState.contents.length}</b><span>Contenidos</span></div>
      <div class="sg-metric"><b>${published}</b><span>Mostrando contenido</span></div>
      <div class="sg-metric"><b>${_signageState.playlists.length}</b><span>Listas</span></div>
      <div class="sg-metric"><b>${_signageState.schedules.length}</b><span>Horarios</span></div>
    </div>
    <section class="sg-start" aria-labelledby="sg-start-title">
      <div><span class="sg-kicker">Empieza aquí</span><h3 id="sg-start-title">Tres pasos para mostrar contenido</h3><p>Cada paso te indica qué hacer. En este modo se guarda únicamente en tu navegador.</p></div>
      <ol class="sg-steps"><li><b>1</b><span><strong>Agrega una pantalla</strong><small>Ponle un nombre fácil de reconocer.</small></span></li><li><b>2</b><span><strong>Elige contenido</strong><small>Mensaje, imagen, video o enlace.</small></span></li><li><b>3</b><span><strong>Muéstralo</strong><small>Publica ahora o programa una hora.</small></span></li></ol>
      <button class="btn btn-primary" onclick="signageOpenScreenDrawer()">${siIcon('plus',16)} Agregar pantalla</button>
      <p class="sg-real-tv-note"><b>Vincular una TV real:</b> todavía no disponible. Esa función requerirá servicio central, identidad de dispositivo y emparejamiento seguro.</p>
    </section>
    <section aria-labelledby="sg-screens-title">
      <div class="sg-section-head"><div><h3 id="sg-screens-title">Tus pantallas</h3><p>Aquí ves qué está mostrando cada una.</p></div><button class="btn btn-secondary btn-sm" onclick="signageOpenScreenDrawer()">${siIcon('plus',15)} Agregar pantalla</button></div>
      ${signageScreensTableHtml()}
    </section>
    <section aria-labelledby="sg-library-title">
      <div class="sg-section-head"><div><h3 id="sg-library-title">Contenido</h3><p>Mensajes, imágenes, videos y enlaces listos para mostrar.</p></div><button class="btn btn-secondary btn-sm" onclick="signageOpenContentDrawer()">${siIcon('plus',15)} Agregar contenido</button></div>
      ${signageLibraryHtml()}
    </section>
    <section aria-labelledby="sg-program-title">
      <div class="sg-section-head"><div><h3 id="sg-program-title">Listas y horarios</h3><p>Combina contenidos y decide cuándo se muestran.</p></div><div class="sg-actions"><button class="btn btn-secondary btn-sm" onclick="signageOpenPlaylistDrawer()">Nueva lista</button><button class="btn btn-secondary btn-sm" onclick="signageOpenScheduleDrawer()">Crear horario</button></div></div>
      ${signageProgrammingHtml()}
    </section>
    <section aria-labelledby="sg-audit-title">
      <div class="sg-section-head"><div><h3 id="sg-audit-title">Actividad</h3><p>Últimos cambios guardados en este navegador.</p></div><button class="btn btn-ghost btn-sm" onclick="signageResetLocalData()">Borrar datos de prueba</button></div>
      ${signageAuditHtml()}
    </section>
  </div>`
}

function signageScreensTableHtml() {
  if (!_signageState.screens.length) return emptyStateHtml({ title: 'Aún no agregas una pantalla', desc: 'Agrega una pantalla para empezar. En modo de prueba podrás verla en este mismo navegador.', actionLabel: 'Agregar pantalla', actionOnClick: 'signageOpenScreenDrawer()' })
  return `<div class="erp-table-wrap"><table class="erp-table sg-table"><thead><tr><th>Pantalla</th><th>Planta</th><th>Perfil declarado</th><th>Publicación local</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>${_signageState.screens.map(screen => {
    const content = signageContentById(screen.publishedContentId)
    const paired = screen.kind === 'paired'
    const liveEnabled = signagePublicConfig().liveEnabled
    return `<tr><td><b>${esc(screen.name)}</b><div class="sg-sub">${paired ? 'Vinculada mediante código' : 'Guardada en este navegador'}</div></td><td>${esc(screen.plant)}</td><td>${esc(screen.profile)}</td><td>${content ? `<b>${esc(content.title)}</b><div class="sg-sub">Actualizado ${screen.updatedAt ? esc(signageFormatTime(screen.updatedAt)) : 'en este navegador'}</div>` : '<span class="sg-muted">Nada todavía</span>'}</td><td><div class="sg-state-stack"><span class="sg-status ${paired ? 'sg-status-connected' : 'sg-status-local'}">${paired ? 'Vinculada' : 'Modo de prueba'}</span><span class="sg-sub">${paired ? 'Conexión pendiente de comprobar' : 'No conectada a una TV'}</span></div></td><td><div class="sg-actions"><button class="btn btn-secondary btn-sm" onclick="signageOpenPublishDrawer('${escAttr(screen.id)}')">Elegir qué mostrar</button>${paired ? liveEnabled ? `<button class="btn btn-ghost btn-sm" onclick="signageStartLive('${escAttr(screen.id)}')">Compartir mi pantalla</button>` : '<button class="btn btn-ghost btn-sm" disabled>Compartir pantalla · Próximamente</button>' : `<button class="btn btn-ghost btn-sm" onclick="signageShowPlayer('${escAttr(screen.id)}')">Ver pantalla</button>`}${screen.history.length ? `<button class="btn btn-ghost btn-sm" onclick="signageRollback('${escAttr(screen.id)}')">Deshacer cambio</button>` : ''}</div></td></tr>`
  }).join('')}</tbody></table></div>`
}

function signageOpenScreenDrawer() {
  if (!signageContext().canManage) { toast('No tienes permiso para agregar pantallas.'); return }
  openSideDrawer({ eyebrow: 'Pantallas', title: 'Agregar pantalla', onTab: () => {
    document.getElementById('sd-body').innerHTML = `<div class="sg-form">
      <div id="sg-pair-ready" class="sg-form-note"><b>Comprobando el servicio…</b> Espera un momento.</div>
      <form class="sg-form" onsubmit="signageSubmitPairing(event)" novalidate>
        <label class="sg-field" for="sg-pair-code"><span>Código de la pantalla <b aria-hidden="true">*</b></span><input class="control-input sg-code-input" id="sg-pair-code" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" placeholder="000000"><small id="sg-pair-code-error" class="sg-error"></small></label>
        <label class="sg-field" for="sg-pair-name"><span>¿Cómo quieres llamarla?</span><input class="control-input" id="sg-pair-name" maxlength="80" placeholder="Ej. Comedor planta 1"><small id="sg-pair-name-error" class="sg-error"></small></label>
        <label class="sg-field" for="sg-pair-plant"><span>¿Dónde está?</span><input class="control-input" id="sg-pair-plant" maxlength="80" placeholder="Ej. Planta 1"><small id="sg-pair-plant-error" class="sg-error"></small></label>
        <small id="sg-pair-service-error" class="sg-error" role="alert"></small>
        <div class="sg-form-actions"><button id="sg-pair-submit" type="submit" class="btn btn-primary" disabled>Vincular pantalla</button></div>
      </form>
      <div class="sg-or"><span>o</span></div>
      <div class="sg-test-choice"><div><b>¿Solo quieres conocer el módulo?</b><p>Crea una pantalla que funciona únicamente en este navegador.</p></div><button class="btn btn-secondary" onclick="signageOpenLocalScreenDrawer()">Usar modo de prueba</button></div>
    </div>`
    signageCheckBackendAvailability()
  } })
}

async function signageCheckBackendAvailability() {
  const host = document.getElementById('sg-pair-ready')
  const submit = document.getElementById('sg-pair-submit')
  try {
    if (!signagePublicConfig().enabled) throw new Error('Pantallas no está habilitado.')
    await signageBackendClient().health()
    if (host) host.innerHTML = '<b>En la televisión o reproductor:</b> abre <a href="signage-player.html" target="_blank" rel="noopener">el reproductor de Pantallas</a>. Verás un código de 6 números.'
    if (submit) submit.disabled = false
    document.getElementById('sg-pair-code')?.focus()
  } catch {
    if (host) host.innerHTML = '<b>La conexión con televisiones todavía no está disponible en este sitio.</b> Puedes usar el modo de prueba mientras se configura el servicio central.'
  }
}

async function signageSubmitPairing(event) {
  event.preventDefault()
  const code = document.getElementById('sg-pair-code').value.trim()
  const name = document.getElementById('sg-pair-name').value.trim()
  const plant = document.getElementById('sg-pair-plant').value.trim()
  const errorEl = document.getElementById('sg-pair-service-error'); errorEl.textContent = ''
  if (!/^\d{6}$/.test(code) || name.length < 3 || plant.length < 2) { errorEl.textContent = 'Completa el código, el nombre y la ubicación.'; return }
  const submit = event.submitter; submit.disabled = true; submit.textContent = 'Vinculando…'
  try {
    const config = signagePublicConfig()
    if (!config.enabled) throw new Error('El servicio central de Pantallas todavía no está habilitado.')
    const paired = await signageBackendClient().pairDevice({ code, name, plant, workspaceId: config.workspaceId, siteId: config.siteId, profile: 'Horizontal · 1920 × 1080' })
    const result = SignagePhase1.registerPairedScreen(_signageState, paired.device, signageContext())
    if (!signageSaveState(result.state)) return
    closeSideDrawer(); renderSignageHome(); toast('Pantalla vinculada. Ya puedes elegir qué mostrar.')
  } catch (error) {
    errorEl.textContent = error.status === 404 ? 'El código no existe o ya venció. Genera uno nuevo en la pantalla.' : error.message || 'No se pudo conectar con el servicio de Pantallas.'
  } finally { submit.disabled = false; submit.textContent = 'Vincular pantalla' }
}

function signageOpenLocalScreenDrawer() {
  if (!signageContext().canManage) { toast('No tienes permiso para registrar pantallas de prueba.'); return }
  openSideDrawer({ eyebrow: 'Pantallas · Modo de prueba', title: 'Agregar pantalla', onTab: () => {
    document.getElementById('sd-body').innerHTML = `<form class="sg-form" onsubmit="signageSubmitScreen(event)" novalidate>
      <div class="sg-form-note"><b>Estás en modo de prueba.</b> Esta pantalla se verá únicamente en este navegador. Para conectar una TV real se necesita el servicio central.</div>
      <label class="sg-field" for="sg-screen-name"><span>Nombre de la pantalla <b aria-hidden="true">*</b></span><input class="control-input" id="sg-screen-name" maxlength="80" placeholder="Ej. Comedor de prueba" aria-describedby="sg-screen-name-error"><small id="sg-screen-name-error" class="sg-error"></small></label>
      <label class="sg-field" for="sg-screen-plant"><span>Planta o ubicación <b aria-hidden="true">*</b></span><input class="control-input" id="sg-screen-plant" maxlength="80" placeholder="Ej. Planta de prueba" aria-describedby="sg-screen-plant-error"><small id="sg-screen-plant-error" class="sg-error"></small></label>
      <fieldset class="sg-theme-field"><legend>Orientación declarada</legend><div class="sg-type-options" role="radiogroup"><button type="button" class="sg-type-option selected" data-screen-orientation="horizontal" role="radio" aria-checked="true" onclick="signageChooseScreenOrientation(this)">Horizontal</button><button type="button" class="sg-type-option" data-screen-orientation="vertical" role="radio" aria-checked="false" onclick="signageChooseScreenOrientation(this)">Vertical</button></div><small id="sg-screen-orientation-error" class="sg-error"></small></fieldset>
      <div class="sg-dimensions"><label class="sg-field" for="sg-screen-width"><span>Ancho declarado (px)</span><input class="control-input" id="sg-screen-width" type="number" min="320" max="7680" step="1" value="1920" aria-describedby="sg-screen-width-error"><small id="sg-screen-width-error" class="sg-error"></small></label><label class="sg-field" for="sg-screen-height"><span>Alto declarado (px)</span><input class="control-input" id="sg-screen-height" type="number" min="320" max="7680" step="1" value="1080" aria-describedby="sg-screen-height-error"><small id="sg-screen-height-error" class="sg-error"></small></label></div>
      <div class="sg-form-actions"><button type="button" class="btn btn-secondary" onclick="closeSideDrawer()">Cancelar</button><button type="submit" class="btn btn-primary">Agregar pantalla</button></div>
    </form>`
    requestAnimationFrame(() => document.getElementById('sg-screen-name')?.focus())
  } })
}

function signageChooseScreenOrientation(button) {
  button.closest('.sg-type-options').querySelectorAll('[data-screen-orientation]').forEach(option => {
    const selected = option === button
    option.classList.toggle('selected', selected)
    option.setAttribute('aria-checked', String(selected))
  })
  const vertical = button.dataset.screenOrientation === 'vertical'
  const width = document.getElementById('sg-screen-width')
  const height = document.getElementById('sg-screen-height')
  if (width && height) { width.value = vertical ? '1080' : '1920'; height.value = vertical ? '1920' : '1080' }
}

function signageSubmitScreen(event) {
  event.preventDefault()
  document.querySelectorAll('.sg-error').forEach(el => { el.textContent = '' })
  const input = {
    name: document.getElementById('sg-screen-name').value,
    plant: document.getElementById('sg-screen-plant').value,
    orientation: document.querySelector('[data-screen-orientation].selected')?.dataset.screenOrientation,
    width: document.getElementById('sg-screen-width').value,
    height: document.getElementById('sg-screen-height').value,
  }
  try {
    const result = SignagePhase1.createTestScreen(_signageState, input, signageContext())
    if (!signageSaveState(result.state)) return
    closeSideDrawer(); renderSignageHome(); toast('Pantalla agregada al modo de prueba. No se conectó ninguna TV real.')
  } catch (error) {
    Object.entries(error.fields || {}).forEach(([field, message]) => {
      const inputEl = document.getElementById('sg-screen-' + field)
      const errorEl = document.getElementById('sg-screen-' + field + '-error')
      inputEl?.setAttribute('aria-invalid', 'true')
      if (errorEl) errorEl.textContent = message
    })
    const first = Object.keys(error.fields || {})[0]
    document.getElementById('sg-screen-' + first)?.focus()
    if (!error.fields) toast(error.message || 'No se pudo registrar la pantalla de prueba.')
  }
}

function signageLibraryHtml() {
  if (!_signageState.contents.length) return emptyStateHtml({ title: 'Aún no agregas contenido', desc: 'Agrega un mensaje, imagen, video o enlace y después elige dónde mostrarlo.', actionLabel: 'Agregar contenido', actionOnClick: 'signageOpenContentDrawer()' })
  return `<div class="sg-library">${_signageState.contents.map(content => `<article class="panel sg-content-card"><div class="sg-content-preview sg-theme-${escAttr(content.theme)}" aria-hidden="true"><span>${content.type === 'image' ? 'IMAGEN' : content.type === 'video' ? 'VIDEO' : content.type === 'link' ? 'ENLACE' : esc(content.title)}</span></div><div class="sg-content-copy"><div><h4>${esc(content.title)}</h4><p>${esc(content.body || content.alt || content.url || '')}</p></div><div class="sg-sub">${esc(signageTypeLabel(content.type))} · ${esc(signageThemeLabel(content.theme))} · ${esc(content.createdBy)}</div></div></article>`).join('')}</div>`
}

function signageProgrammingHtml() {
  if (!_signageState.playlists.length && !_signageState.schedules.length) return emptyStateHtml({ title: 'Aún no creas listas ni horarios', desc: 'Cuando tengas contenido, puedes combinarlo en una lista y elegir cuándo mostrarlo.' })
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
  const mediaEnabled = signagePublicConfig().mediaEnabled
  openSideDrawer({ eyebrow: 'Pantallas · Contenido', title: 'Agregar contenido', onTab: () => {
    document.getElementById('sd-body').innerHTML = `<form class="sg-form" onsubmit="signageSubmitContent(event)" novalidate>
      <div class="sg-form-note">${mediaEnabled ? 'Si vinculaste una pantalla, puedes subir un archivo. En modo de prueba también puedes usar una URL HTTPS.' : 'Este piloto permite mensajes y enlaces. Las imágenes y videos se habilitarán después de configurar su verificación segura.'}</div>
      <fieldset class="sg-theme-field"><legend>¿Qué quieres mostrar?</legend><div class="sg-type-options" role="radiogroup">${['message','image','video','link'].map((type,index)=>{ const unavailable=!mediaEnabled&&(type==='image'||type==='video'); return `<button type="button" class="sg-type-option${index===0?' selected':''}" data-content-type="${type}" role="radio" aria-checked="${index===0}" ${unavailable?'disabled aria-disabled="true"':''} onclick="signageChooseContentType(this)">${esc(signageTypeLabel(type))}${unavailable?' · Próximamente':''}</button>` }).join('')}</div></fieldset>
      <label class="sg-field" for="sg-content-title"><span>Título <b aria-hidden="true">*</b></span><input class="control-input" id="sg-content-title" maxlength="80" required aria-describedby="sg-content-title-error"><small id="sg-content-title-error" class="sg-error"></small></label>
      <label class="sg-field" for="sg-content-body"><span id="sg-body-label">Mensaje <b aria-hidden="true">*</b></span><textarea class="control-input sg-textarea" id="sg-content-body" maxlength="240" required aria-describedby="sg-content-body-error"></textarea><small id="sg-content-body-error" class="sg-error"></small></label>
      <div id="sg-media-fields" hidden><label class="sg-field" for="sg-content-file"><span>Archivo de imagen o video</span><input class="control-input sg-file-input" id="sg-content-file" type="file" accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm" onchange="signagePreviewUpload(this)"><small class="sg-muted">Máximo propuesto: 10 MB por imagen y 50 MB por video.</small></label><div id="sg-upload-preview" class="sg-upload-preview" hidden></div><div class="sg-or"><span>o, en modo de prueba</span></div><label class="sg-field" for="sg-content-mediaUrl"><span>URL HTTPS del archivo</span><input class="control-input" id="sg-content-mediaUrl" inputmode="url" maxlength="2048" aria-describedby="sg-content-mediaUrl-error"><small id="sg-content-mediaUrl-error" class="sg-error"></small></label><label class="sg-field" for="sg-content-alt"><span>Descripción accesible <b aria-hidden="true">*</b></span><input class="control-input" id="sg-content-alt" maxlength="180" aria-describedby="sg-content-alt-error"><small id="sg-content-alt-error" class="sg-error"></small></label></div>
      <div id="sg-link-fields" hidden><label class="sg-field" for="sg-content-url"><span>Enlace HTTPS <b aria-hidden="true">*</b></span><input class="control-input" id="sg-content-url" inputmode="url" maxlength="2048" placeholder="https://" aria-describedby="sg-content-url-error"><small id="sg-content-url-error" class="sg-error"></small></label><div class="sg-form-note">Se mostrará como una tarjeta segura. No todos los sitios permiten verse dentro de una pantalla y no se abrirán iframes arbitrarios.</div></div>
      <fieldset class="sg-theme-field"><legend>Estilo de contenido</legend><div class="sg-theme-options" role="radiogroup">${['neutral','teal','blue'].map((theme, index) => `<button type="button" class="sg-theme-option${index === 0 ? ' selected' : ''}" data-theme="${theme}" role="radio" aria-checked="${index === 0}" onclick="signageChooseTheme(this)"><span class="sg-theme-swatch sg-theme-${theme}"></span>${esc(signageThemeLabel(theme))}</button>`).join('')}</div></fieldset>
      <div class="sg-form-actions"><button type="button" class="btn btn-secondary" onclick="closeSideDrawer()">Cancelar</button><button type="submit" class="btn btn-primary">Guardar contenido</button></div>
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
  const isMedia = button.dataset.contentType === 'image' || button.dataset.contentType === 'video'
  const isLink = button.dataset.contentType === 'link'
  const media = document.getElementById('sg-media-fields')
  if (media) media.hidden = !isMedia
  const link = document.getElementById('sg-link-fields')
  if (link) link.hidden = !isLink
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

function signagePreviewUpload(input) {
  const file = input.files?.[0]
  const host = document.getElementById('sg-upload-preview')
  if (!host) return
  if (!file) { host.hidden = true; host.innerHTML = ''; return }
  const url = URL.createObjectURL(file)
  host.hidden = false
  host.innerHTML = file.type.startsWith('video/') ? `<video src="${escAttr(url)}" controls muted aria-label="Vista previa del video"></video><span>${esc(file.name)}</span>` : `<img src="${escAttr(url)}" alt="Vista previa del archivo seleccionado"><span>${esc(file.name)}</span>`
}

async function signageSubmitContent(event) {
  event.preventDefault()
  const title = document.getElementById('sg-content-title')
  const body = document.getElementById('sg-content-body')
  const type = document.querySelector('.sg-type-option.selected')?.dataset.contentType || 'message'
  const mediaUrl = document.getElementById('sg-content-mediaUrl')
  const alt = document.getElementById('sg-content-alt')
  const url = document.getElementById('sg-content-url')
  const file = document.getElementById('sg-content-file')?.files?.[0] || null
  const theme = document.querySelector('.sg-theme-option.selected')?.dataset.theme || 'neutral'
  document.querySelectorAll('.sg-error').forEach(el => { el.textContent = '' })
  ;[title, body, mediaUrl, alt, url].forEach(input => input?.removeAttribute('aria-invalid'))
  try {
    let remote = null
    let uploaded = null
    const hasPairedScreen = _signageState.screens.some(screen => screen.kind === 'paired')
    const candidateMediaUrl = file ? `https://assets.invalid/${encodeURIComponent(file.name)}` : mediaUrl?.value
    const validation = SignagePhase1.validateContent({ type, title: title.value, body: body.value, theme, mediaUrl: candidateMediaUrl, alt: alt?.value, url: url?.value })
    if (!validation.ok) { const validationError = new Error('Corrige los campos marcados.'); validationError.fields = validation.errors; throw validationError }
    if (file) {
      if (!signagePublicConfig().mediaEnabled) throw new Error('Las imágenes y videos todavía no están habilitados en este piloto.')
      const expected = type === 'image' ? 'image/' : type === 'video' ? 'video/' : ''
      if (!expected || !file.type.startsWith(expected)) throw new Error('El archivo elegido no coincide con el tipo de contenido.')
      const client = signageBackendClient()
      uploaded = await client.upload(file)
      remote = await client.createContent({ type, title: title.value, body: body.value, alt: alt?.value, uploadId: uploaded.upload.id })
    } else if (hasPairedScreen && (type === 'message' || type === 'link')) {
      remote = await signageBackendClient().createContent({ type, title: title.value, body: body.value, url: url?.value })
    }
    const localMediaUrl = candidateMediaUrl
    const result = SignagePhase1.createContent(_signageState, { type, title: title.value, body: body.value, theme, mediaUrl: localMediaUrl, alt: alt?.value, url: url?.value }, signageContext())
    if (remote) {
      result.content.backendContentId = remote.content.id
      result.content.backendRevision = remote.content.revision
      result.content.backendStatus = 'draft'
      result.content.backendAssetId = uploaded?.upload.id || null
      if (uploaded) result.content.mediaUrl = new URL(uploaded.upload.url, new URL(signageBackendClient().baseUrl).origin).href
    }
    if (!signageSaveState(result.state)) return
    closeSideDrawer()
    renderSignageHome()
    toast(remote ? 'Contenido guardado y listo para pantallas vinculadas.' : 'Contenido guardado en modo de prueba.')
  } catch (error) {
    if (error.fields) {
      Object.entries(error.fields).forEach(([field, message]) => {
        const input = document.getElementById('sg-content-' + field)
        const errorEl = document.getElementById('sg-content-' + field + '-error')
        input?.setAttribute('aria-invalid', 'true')
        if (errorEl) errorEl.textContent = message
      })
      ;(error.fields.title ? title : error.fields.body ? body : error.fields.mediaUrl ? mediaUrl : error.fields.alt ? alt : url)?.focus()
      return
    }
    toast(error.message || 'No se pudo agregar el contenido.')
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

async function signageSubmitPlaylist(event) {
  event.preventDefault()
  document.querySelectorAll('.sg-error').forEach(el => { el.textContent = '' })
  const entries = [...document.querySelectorAll('.sg-entry-row')].filter(row => row.querySelector('.sg-entry.selected')).map(row => ({ contentId: row.querySelector('.sg-entry').dataset.contentId, durationSeconds: row.querySelector('.sg-duration').value }))
  try {
    const result = SignagePhase1.createPlaylist(_signageState, { name: document.getElementById('sg-playlist-name').value, entries }, signageContext())
    if (_signageState.screens.some(screen => screen.kind === 'paired')) {
      const remoteEntries = entries.map(entry => ({ contentId: signageContentById(entry.contentId)?.backendContentId, contentRevision: signageContentById(entry.contentId)?.backendRevision, durationSeconds: Number(entry.durationSeconds) }))
      if (remoteEntries.some(entry => !entry.contentId)) throw new Error('Para usar esta lista en una pantalla vinculada, primero guarda todos sus contenidos en el servicio.')
      const remote = await signageBackendClient().createPlaylist({ name: result.playlist.name, entries: remoteEntries })
      result.playlist.backendPlaylistId = remote.playlist.id
    }
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

async function signageSubmitSchedule(event) {
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
    const screen = _signageState.screens.find(item => item.id === input.screenId)
    const playlist = _signageState.playlists.find(item => item.id === input.playlistId)
    if (screen?.kind === 'paired') {
      if (!playlist?.backendPlaylistId) throw new Error('Esta lista todavía no está guardada en el servicio de Pantallas.')
      const remote = await signageBackendClient().createSchedule({ deviceId: screen.id, playlistId: playlist.backendPlaylistId, startsAt: new Date(input.startsAt).toISOString(), endsAt: new Date(input.endsAt).toISOString(), priority: Number(input.priority) })
      result.schedule.backendScheduleId = remote.schedule.id
    }
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

async function signagePublish(screenId, contentId) {
  try {
    const screen = _signageState.screens.find(item => item.id === screenId)
    const content = signageContentById(contentId)
    if (screen?.kind === 'paired') {
      let backendContentId = content?.backendContentId
      if (!backendContentId && content && (content.type === 'message' || content.type === 'link')) {
        const remote = await signageBackendClient().createContent({ type: content.type, title: content.title, body: content.body, url: content.url })
        backendContentId = remote.content.id; content.backendContentId = backendContentId; content.backendRevision = remote.content.revision; content.backendStatus = 'draft'
      }
      if (!backendContentId) throw new Error('Para mostrar esta imagen o video en una pantalla vinculada, vuelve a agregarlo usando “Archivo de imagen o video”.')
      if (content.backendStatus !== 'approved') {
        await signageBackendClient().approveContent(backendContentId, content.backendRevision)
        content.backendStatus = 'approved'
      }
      await signageBackendClient().publish(screen.id, backendContentId)
    }
    const result = SignagePhase1.publishContent(_signageState, screenId, contentId, signageContext())
    if (!signageSaveState(result.state)) return
    closeSideDrawer()
    renderSignageHome()
    toast(screen?.kind === 'paired' ? `Contenido enviado a ${result.screen.name}.` : `Contenido mostrado en ${result.screen.name} dentro de este navegador.`)
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

async function signageStartLive(screenId) {
  const screen = _signageState.screens.find(item => item.id === screenId)
  if (!screen || screen.kind !== 'paired') { toast('Primero vincula una pantalla con su código.'); return }
  if (!signagePublicConfig().liveEnabled) { toast('Compartir pantalla todavía no está habilitado en este piloto.'); return }
  if (_signageLiveSender) { toast('Ya estás compartiendo tu pantalla. Detén esa transmisión primero.'); return }
  try {
    const client = signageBackendClient()
    const runtime = await client.runtime()
    if (!runtime.liveAvailable || !runtime.iceServers?.length) throw new Error('Compartir pantalla requiere configurar la conexión segura ICE/TURN.')
    const sender = SignageLiveShare.createSender({
      client,
      deviceId: screen.id,
      iceServers: runtime.iceServers,
      onStop: () => { _signageLiveSender = null; _signageLiveScreenId = null; renderSignageHome() },
    })
    _signageLiveSender = sender; _signageLiveScreenId = screen.id
    await sender.start()
    renderSignageHome(); toast('Tu pantalla se está compartiendo. Usa “Dejar de compartir” para terminar.')
  } catch (error) {
    _signageLiveSender = null; _signageLiveScreenId = null
    toast(error.name === 'NotAllowedError' ? 'No se compartió nada. Tú decides qué ventana o pantalla permitir.' : error.message || 'No se pudo iniciar la transmisión.')
  }
}

async function signageStopLive() {
  const sender = _signageLiveSender
  _signageLiveSender = null; _signageLiveScreenId = null
  await sender?.stop()
  renderSignageHome(); toast('Dejaste de compartir. La pantalla volvió a su contenido programado.')
}

function signageShowPlayer(screenId) {
  const result = SignagePhase1.resolvePlayback(_signageState, screenId)
  if (!result.screen) { toast('La pantalla ya no está disponible.'); return }
  if (_signagePlayerTimer) clearInterval(_signagePlayerTimer)
  _signagePlayerFailure = null
  document.getElementById('product-controls').style.display = 'none'
  setSecCrumbs([{ label: 'Pantallas', onclick: 'showSignage()' }, { label: result.screen.name }])
  document.getElementById('sec-title').textContent = result.screen.name
  document.getElementById('sec-sub').textContent = 'Reproductor local de prueba · no representa una televisión conectada'
  document.getElementById('pg').innerHTML = `<div class="sg-player-page"><div class="sg-player-toolbar"><span class="sg-status sg-status-unknown">Vista de prueba</span><span>${esc(result.screen.profile)}</span><button class="btn btn-secondary btn-sm" onclick="document.getElementById('sg-player-frame')?.requestFullscreen?.()">Pantalla completa</button></div><div id="sg-player-host"></div><p class="sg-player-disclaimer">Esta vista funciona en el navegador actual. Las imágenes y videos por URL requieren conexión; una TV vinculada usa el reproductor independiente.</p></div>`
  signageRenderPlayer(screenId)
  _signagePlayerTimer = setInterval(() => signageRefreshPlayer(screenId), 1000)
}

function signagePlayerBody(result) {
  const content = result.content
  if (!content) return `<div class="sg-player-empty"><b>Sin contenido reproducible</b><span>No existe una publicación local válida para recuperar.</span></div>`
  if (content.type === 'image') return `<div class="sg-player-media"><img src="${escAttr(content.mediaUrl)}" alt="${escAttr(content.alt)}" onload="signageRecordPlaybackSuccess('${escAttr(result.screen.id)}','${escAttr(content.id)}')" onerror="signagePlayerMediaFailed('${escAttr(result.screen.id)}','${escAttr(content.id)}')"><div class="sg-media-caption"><b>${esc(content.title)}</b>${content.body ? `<span>${esc(content.body)}</span>` : ''}</div></div>`
  if (content.type === 'video') return `<div class="sg-player-media"><video src="${escAttr(content.mediaUrl)}" aria-label="${escAttr(content.alt)}" autoplay muted playsinline oncanplay="signageRecordPlaybackSuccess('${escAttr(result.screen.id)}','${escAttr(content.id)}')" onerror="signagePlayerMediaFailed('${escAttr(result.screen.id)}','${escAttr(content.id)}')"></video><div class="sg-media-caption"><b>${esc(content.title)}</b>${content.body ? `<span>${esc(content.body)}</span>` : ''}</div></div>`
  if (content.type === 'link') return `<div class="sg-player-content"><div class="sg-player-eyebrow">ENLACE SEGURO</div><h2>${esc(content.title)}</h2><p>${esc(content.body || content.url)}</p><small>${esc(content.url)}</small></div>`
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
  if (!signageContext().canManage || !confirm('¿Borrar las pantallas, contenidos y horarios guardados en este navegador?')) return
  try {
    _signageState = signageRepository().reset()
    _signageLoadWarning = ''
    renderSignageHome()
    toast('Se borraron los datos del modo de prueba.')
  } catch { toast('No se pudo restablecer el almacenamiento local.') }
}
