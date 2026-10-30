(function (root, factory) {
  const api = factory()
  if (typeof module === 'object' && module.exports) module.exports = api
  root.SignagePhase1 = api
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict'

  const STORAGE_KEY = 'sierra_signage_phase1_v1'
  const SCHEMA_VERSION = 5
  const LEGACY_FIXTURE_ORIGIN = 'sierra-pantallas-demo-v1'
  const LEGACY_FIXTURE_SCREEN_IDS = new Set(['synthetic-screen-a', 'synthetic-screen-b'])
  const LEGACY_FIXTURE_CONTENT_IDS = new Set(['synthetic-content-welcome', 'synthetic-content-safety'])
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
      spaces: [],
      screens: [],
      contents: [],
      playlists: [],
      schedules: [],
      audit: [],
      archivedLocalFixtures: { screens: [], contents: [], ambiguousScreens: [], ambiguousContents: [], archivedAt: null },
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
          fixtureOrigin: LEGACY_FIXTURE_ORIGIN,
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
          fixtureOrigin: LEGACY_FIXTURE_ORIGIN,
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
          fixtureOrigin: LEGACY_FIXTURE_ORIGIN,
        },
        {
          id: 'synthetic-content-safety',
          type: 'message',
          title: 'Recordatorio sintético',
          body: 'Este mensaje no sustituye comunicaciones operativas ni sistemas certificados de seguridad.',
          theme: 'blue',
          createdAt: null,
          createdBy: 'Sistema de prueba',
          fixtureOrigin: LEGACY_FIXTURE_ORIGIN,
        },
      ]
    return state
  }

  function normalizeState(input) {
    if (!input || ![1, 3, 4, 5].includes(input.schemaVersion) || !['local-synthetic-phase1', 'local-synthetic-phase3'].includes(input.mode)) return initialState()
    const state = clone(input)
    state.schemaVersion = SCHEMA_VERSION
    state.mode = 'local-synthetic-phase3'
    state.spaces = Array.isArray(state.spaces) ? state.spaces : []
    state.screens = Array.isArray(state.screens) ? state.screens : []
    state.contents = Array.isArray(state.contents) ? state.contents : []
    state.playlists = Array.isArray(state.playlists) ? state.playlists : []
    state.schedules = Array.isArray(state.schedules) ? state.schedules : []
    state.audit = Array.isArray(state.audit) ? state.audit.slice(0, MAX_AUDIT_EVENTS) : []
    const archive = state.archivedLocalFixtures || {}
    state.archivedLocalFixtures = {
      screens: Array.isArray(archive.screens) ? archive.screens : [],
      contents: Array.isArray(archive.contents) ? archive.contents : [],
      ambiguousScreens: Array.isArray(archive.ambiguousScreens) ? archive.ambiguousScreens : [],
      ambiguousContents: Array.isArray(archive.ambiguousContents) ? archive.ambiguousContents : [],
      archivedAt: archive.archivedAt || null,
    }
    state.screens.forEach(screen => {
      screen.history = Array.isArray(screen.history) ? screen.history : []
      screen.lastValidContentId = screen.lastValidContentId || screen.publishedContentId || null
      screen.lastValidAt = screen.lastValidAt || null
      screen.kind = screen.kind || 'local-test'
      screen.connectionState = screen.connectionState || 'not-linked'
      screen.outputPaused = screen.outputPaused === true
      screen.spaceId = screen.spaceId || null
    })
    state.contents.forEach(content => { content.type = CONTENT_TYPES.has(content.type) ? content.type : 'message' })
    return state
  }

  function isKnownFixtureScreen(screen) {
    if (!LEGACY_FIXTURE_SCREEN_IDS.has(screen?.id)) return false
    return screen.fixtureOrigin === LEGACY_FIXTURE_ORIGIN || (screen.kind === 'local-test' && screen.evidence === 'Sin telemetría')
  }

  function isKnownFixtureContent(content) {
    if (!LEGACY_FIXTURE_CONTENT_IDS.has(content?.id)) return false
    return content.fixtureOrigin === LEGACY_FIXTURE_ORIGIN || content.createdBy === 'Sistema de prueba'
  }

  function separateLegacyFixtures(current, options = {}) {
    const state = normalizeState(current)
    if (!options.connected) return { state, changed: false, archivedCount: 0, ambiguousCount: 0 }
    const archive = state.archivedLocalFixtures
    const knownScreens = state.screens.filter(isKnownFixtureScreen)
    const knownContents = state.contents.filter(isKnownFixtureContent)
    const ambiguousScreens = state.screens.filter(screen => LEGACY_FIXTURE_SCREEN_IDS.has(screen.id) && !isKnownFixtureScreen(screen))
    const ambiguousContents = state.contents.filter(content => LEGACY_FIXTURE_CONTENT_IDS.has(content.id) && !isKnownFixtureContent(content))
    const movedScreens = [...knownScreens, ...ambiguousScreens]
    const movedContents = [...knownContents, ...ambiguousContents]
    if (!movedScreens.length && !movedContents.length) return { state, changed: false, archivedCount: 0, ambiguousCount: 0 }
    const appendUnique = (target, items) => {
      const ids = new Set(target.map(item => item.id))
      items.forEach(item => { if (!ids.has(item.id)) target.push(clone(item)) })
    }
    appendUnique(archive.screens, knownScreens)
    appendUnique(archive.contents, knownContents)
    appendUnique(archive.ambiguousScreens, ambiguousScreens)
    appendUnique(archive.ambiguousContents, ambiguousContents)
    const screenIds = new Set(movedScreens.map(item => item.id))
    const contentIds = new Set(movedContents.map(item => item.id))
    state.screens = state.screens.filter(item => !screenIds.has(item.id))
    state.contents = state.contents.filter(item => !contentIds.has(item.id))
    state.testFixtures = false
    archive.archivedAt = options.now ? nowIso(options.now) : archive.archivedAt || nowIso()
    return { state, changed: true, archivedCount: knownScreens.length + knownContents.length, ambiguousCount: ambiguousScreens.length + ambiguousContents.length }
  }

  function recoverAmbiguousFixtures(current, options = {}) {
    const state = normalizeState(current)
    const archive = state.archivedLocalFixtures
    const screenIdMap = new Map()
    const contentIdMap = new Map()
    const suffix = cleanText(options.suffix) || 'recuperado'
    archive.ambiguousContents.forEach((content, index) => {
      const id = `local-content-${suffix}-${index + 1}`
      contentIdMap.set(content.id, id)
      state.contents.push({ ...clone(content), id, fixtureOrigin: undefined, backendContentId: null, createdBy: content.createdBy || 'Borrador recuperado', recoveredFromLegacyFixture: true })
    })
    archive.ambiguousScreens.forEach((screen, index) => {
      const id = `local-screen-${suffix}-${index + 1}`
      screenIdMap.set(screen.id, id)
      state.screens.push({ ...clone(screen), id, fixtureOrigin: undefined, kind: 'local-test', connectionState: 'not-linked', backendRevision: 0, activePublicationId: null, publishedContentId: contentIdMap.get(screen.publishedContentId) || null, lastValidContentId: contentIdMap.get(screen.lastValidContentId) || null, recoveredFromLegacyFixture: true })
    })
    const recoveredCount = archive.ambiguousScreens.length + archive.ambiguousContents.length
    archive.ambiguousScreens = []
    archive.ambiguousContents = []
    return { state, recoveredCount, screenIdMap, contentIdMap }
  }

  function validateSpace(input, state, editingId) {
    const name = cleanText(input?.name)
    const errors = {}
    if (name.length < 2 || name.length > 80) errors.name = 'Usa un nombre de 2 a 80 caracteres.'
    if (state?.spaces?.some(space => space.id !== editingId && cleanText(space.name).toLocaleLowerCase('es') === name.toLocaleLowerCase('es'))) errors.name = 'Ya existe un espacio con ese nombre.'
    return { ok: !Object.keys(errors).length, errors, value: { name } }
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
      outputPaused: false,
      publishedContentId: null,
      publicationVersion: 0,
      updatedAt: null,
      history: [],
      lastValidContentId: null,
      lastValidAt: null,
      createdAt: nowIso(options?.now),
      createdBy: actorName(context.actor),
      spaceId: cleanText(input?.spaceId) || null,
    }
    state.screens.unshift(screen)
    appendAudit(state, { type: 'screen.created', actor: actorName(context.actor), screenId: screen.id, summary: `Registró la pantalla de prueba “${screen.name}” · no vinculada`, now: options?.now })
    return { state, screen }
  }

  function createSpace(current, input, context, options) {
    requireManage(context)
    const state = normalizeState(current)
    const validation = validateSpace(input, state)
    if (!validation.ok) {
      const error = new Error('Corrige el nombre del espacio.')
      error.code = 'SIGNAGE_VALIDATION'; error.fields = validation.errors; throw error
    }
    const space = { id: makeId('space'), name: validation.value.name, kind: 'local-test', createdAt: nowIso(options?.now), createdBy: actorName(context.actor) }
    state.spaces.push(space)
    appendAudit(state, { type: 'space.created', actor: actorName(context.actor), summary: `Creó el espacio “${space.name}”`, now: options?.now })
    return { state, space }
  }

  function updateScreen(current, screenId, input, context, options) {
    requireManage(context)
    const state = normalizeState(current)
    const screen = state.screens.find(item => item.id === screenId)
    if (!screen) { const error = new Error('La pantalla ya no está disponible.'); error.code = 'SIGNAGE_NOT_FOUND'; throw error }
    const name = cleanText(input?.name)
    const spaceId = cleanText(input?.spaceId) || null
    const errors = {}
    if (name.length < 3 || name.length > 80) errors.name = 'Usa un nombre de 3 a 80 caracteres.'
    if (state.screens.some(item => item.id !== screenId && cleanText(item.name).toLocaleLowerCase('es') === name.toLocaleLowerCase('es'))) errors.name = 'Ya existe una pantalla con ese nombre.'
    if (spaceId && !state.spaces.some(space => space.id === spaceId)) errors.spaceId = 'El espacio elegido ya no está disponible.'
    if (Object.keys(errors).length) { const error = new Error('Corrige los datos de la pantalla.'); error.code = 'SIGNAGE_VALIDATION'; error.fields = errors; throw error }
    const previousName = screen.name
    screen.name = name; screen.spaceId = spaceId; screen.plant = state.spaces.find(space => space.id === spaceId)?.name || screen.plant || 'Sin espacio'; screen.updatedAt = nowIso(options?.now)
    appendAudit(state, { type: 'screen.updated', actor: actorName(context.actor), screenId, summary: `Actualizó “${previousName}” como “${name}”`, now: options?.now })
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
    const screen = { id, name, plant, profile, spaceId: device?.spaceId || null, kind: 'paired', connectionState: device?.connectionState || 'paired', evidence: 'Esperando primera conexión', lastSeenAt: device?.lastSeenAt || null, playbackStatus: device?.playbackStatus || null, lastManifestRevision: device?.lastManifestRevision ?? null, outputPaused: device?.outputPaused === true, backendRevision: Number(device?.backendRevision) || 0, publishedContentId: null, publicationVersion: 0, updatedAt: null, history: [], lastValidContentId: null, lastValidAt: null }
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
    if (screen.outputPaused) return { screen, content: null, source: 'stopped', schedule: null, playlist: null, conflictCount: 0, fallback: false }
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
    screen.outputPaused = false
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
    screen.outputPaused = false
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

  function stopOutput(current, screenId, context, options) {
    requireManage(context)
    const state = normalizeState(current)
    const screen = state.screens.find(item => item.id === screenId)
    if (!screen) {
      const error = new Error('La pantalla ya no está disponible.')
      error.code = 'SIGNAGE_NOT_FOUND'
      throw error
    }
    screen.outputPaused = true
    screen.publicationVersion = Number(screen.publicationVersion || 0) + 1
    screen.updatedAt = nowIso(options?.now)
    appendAudit(state, {
      type: 'screen.output_stopped',
      actor: actorName(context.actor),
      screenId: screen.id,
      contentId: screen.publishedContentId || null,
      summary: `Dejó ${screen.name} en reposo · el contenido se conservó`,
      now: options?.now,
    })
    return { state, screen }
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
    demoState,
    normalizeState,
    separateLegacyFixtures,
    recoverAmbiguousFixtures,
    validateContent,
    validateScreen,
    validateSpace,
    validatePlaylist,
    validateSchedule,
    createContent,
    createTestScreen,
    createSpace,
    updateScreen,
    registerPairedScreen,
    createPlaylist,
    createSchedule,
    activeSchedules,
    resolvePlayback,
    markPlaybackSuccess,
    publishContent,
    rollbackScreen,
    stopOutput,
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
let _signageLiveState = 'idle'
let _signageLiveStopping = false
let _signagePairingInFlight = false
let _signageRemoteSyncPromise = null
let _signageRemoteActivity = []
let _signageRemoteExperiences = []
let _signageRemoteSessions = []
let _signageActiveView = 'spaces'
let _signageScreenQuery = ''
let _signageContentQuery = ''
let _signageManagementSyncTimer = null
let _signageSyncState = { status: 'idle', at: null, error: '' }
let _signageFixtureNotice = { archivedCount: 0, ambiguousCount: 0 }
const _signageViewScroll = { spaces: 0, content: 0, sessions: 0 }
const _signageStopInFlight = new Set()
const _signageSelectedScreenIds = new Set()
let _signageBatchInFlight = false
let _signagePresentationDraft = null
const SIERRA_SIGNAGE_LOGO_URL = typeof document === 'undefined'
  ? 'SIERRA_Primary_Blue02.svg'
  : new URL('../SIERRA_Primary_Blue02.svg', document.currentScript?.src || window.location.href).href
const SIERRA_CURATED_CONTENT = Object.freeze([
  { id: 'sierra-industrial-loop', type: 'video', title: 'Proceso SIERRA', body: 'Loop industrial publicado por SIERRA.', alt: 'Proceso industrial de hilatura y maquinaria SIERRA.', theme: 'neutral', mediaUrl: 'https://cdn.prod.website-files.com/673e5aab9ab2686aa6660ed3%2F67448935dfb12aa5cb9c86e9_video-cortado-transcode.mp4', poster: 'https://cdn.prod.website-files.com/673e5aab9ab2686aa6660ed3%2F67448935dfb12aa5cb9c86e9_video-cortado-poster-00001.jpg', sourceUrl: 'https://www.sierratextiles.com/' },
  { id: 'sierra-campus-loop', type: 'video', title: 'Campus y energía', body: 'Loop del campus publicado por SIERRA.', alt: 'Vista aérea del campus y parque solar SIERRA.', theme: 'neutral', mediaUrl: 'https://cdn.prod.website-files.com/673e5aab9ab2686aa6660ed3%2F673f497adb654923cf8ff63e_homepage2%20%281%29-transcode.mp4', poster: 'https://cdn.prod.website-files.com/673e5aab9ab2686aa6660ed3%2F673f497adb654923cf8ff63e_homepage2%20%281%29-poster-00001.jpg', sourceUrl: 'https://www.sierratextiles.com/' },
  { id: 'sierra-people-solar', type: 'image', title: 'Personas y energía', body: 'Fotografía publicada en el sitio de SIERRA.', alt: 'Grupo de personas en el parque de paneles solares SIERRA.', theme: 'neutral', mediaUrl: 'https://cdn.prod.website-files.com/673e5aab9ab2686aa6660ed3/673f7b62650c2610524db19f_DSC09322-Enhanced-NR%20(1).jpg', sourceUrl: 'https://www.sierratextiles.com/' },
])

function signageRepository() { return SignagePhase1.createRepository(window.localStorage) }
function signageContext() {
  return {
    canManage: typeof isAdmin === 'function' && isAdmin(),
    actor: profile?.full_name || me?.email || 'Administrador local',
  }
}
function signageLoadState() {
  const repository = signageRepository()
  const result = repository.load()
  const separated = SignagePhase1.separateLegacyFixtures(result.state, { connected: signagePublicConfig().enabled })
  _signageState = separated.changed ? repository.save(separated.state) : separated.state
  _signageFixtureNotice = { archivedCount: separated.archivedCount, ambiguousCount: separated.ambiguousCount }
  _signageLoadWarning = result.recovered ? (result.recoveredFromBackup ? 'La copia principal guardada estaba dañada. Recuperamos la última copia válida.' : 'No pudimos leer los datos guardados. Empezamos con un espacio limpio.') : ''
  return _signageState
}

function signageLegacyFixtureNoticeHtml() {
  const archived = Number(_signageFixtureNotice.archivedCount) || 0
  const ambiguous = Number(_signageFixtureNotice.ambiguousCount) || 0
  if (!archived && !ambiguous) return ''
  const detail = ambiguous
    ? `También apartamos ${ambiguous} borrador${ambiguous === 1 ? '' : 'es'} con identidad antigua para no mezclarlo${ambiguous === 1 ? '' : 's'} con las pantallas vinculadas.`
    : 'No se borraron pantallas, contenido ni publicaciones de la cuenta central.'
  return `<div class="sg-fixture-notice" role="status"><span class="sg-fixture-notice-icon">${siIcon('info',17)}</span><div><b>Se apartaron datos locales de demostración</b><span>${archived ? `${archived} registro${archived === 1 ? '' : 's'} de la demostración anterior. ` : ''}${detail}</span></div>${ambiguous ? '<button class="btn btn-secondary btn-sm" type="button" onclick="signageRecoverAmbiguousLocalDrafts(this)">Recuperar como borradores</button>' : ''}</div>`
}

function signageRecoverAmbiguousLocalDrafts(button) {
  if (button) button.disabled = true
  const result = SignagePhase1.recoverAmbiguousFixtures(_signageState, { suffix: Date.now().toString(36) })
  if (!result.recoveredCount) { _signageFixtureNotice.ambiguousCount = 0; renderSignageHome(); return }
  if (!signageSaveState(result.state)) { if (button) button.disabled = false; return }
  _signageFixtureNotice.ambiguousCount = 0
  renderSignageHome()
  toast(`${result.recoveredCount} borrador${result.recoveredCount === 1 ? '' : 'es'} recuperado${result.recoveredCount === 1 ? '' : 's'} solo en este navegador.`)
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

function signageRemoteContent(item, existing = null) {
  const snapshot = item?.snapshot && typeof item.snapshot === 'object' ? item.snapshot : {}
  return {
    ...(existing || {}),
    ...snapshot,
    id: existing?.id || item.id,
    type: snapshot.type || existing?.type || 'message',
    title: snapshot.title || item.title || existing?.title || 'Contenido sin título',
    body: snapshot.body || '',
    theme: snapshot.theme || existing?.theme || 'neutral',
    alt: snapshot.alt || '',
    url: snapshot.url || '',
    mediaUrl: snapshot.mediaUrl || existing?.mediaUrl || '',
    backendContentId: item.id,
    backendRevision: Number(item.current_revision ?? item.revision) || 0,
    backendStatus: item.status || 'draft',
    central: true,
    centralSnapshotAvailable: Boolean(item.snapshot),
    createdAt: item.created_at || existing?.createdAt || null,
    updatedAt: item.updated_at || null,
    createdBy: existing?.createdBy || 'Cuenta SIERRA',
  }
}

function signageRemoteScreen(device, fallback = {}, remoteContentIds = new Map()) {
  const heartbeat = Array.isArray(device?.signage_device_heartbeats) ? device.signage_device_heartbeats[0] : device?.signage_device_heartbeats
  const lastSeenAt = heartbeat?.received_at || null
  const connected = lastSeenAt && Date.now() - new Date(lastSeenAt).getTime() < 90000
  const publication = device?.active_publication || null
  const centralContentId = publication?.content_id || null
  return {
    id: device?.id,
    name: device?.name,
    plant: fallback.plant || 'Sede vinculada',
    profile: fallback.profile || 'Perfil sin declarar',
    spaceId: device?.space_id || null,
    connectionState: connected ? 'connected' : 'offline',
    lastSeenAt,
    playbackStatus: heartbeat?.status || null,
    lastManifestRevision: heartbeat?.last_manifest_revision ?? null,
    playerVersion: heartbeat?.player_version || null,
    playerErrors: Array.isArray(heartbeat?.errors) ? heartbeat.errors : [],
    outputPaused: device?.output_paused === true || device?.outputPaused === true,
    backendRevision: Number(device?.revision) || 0,
    activePublicationId: publication?.id || device?.active_publication_id || null,
    publishedContentId: centralContentId ? (remoteContentIds.get(centralContentId) || null) : null,
    centralContentId,
    publicationVersion: Number(publication?.version) || 0,
    desiredAt: publication?.published_at || null,
  }
}

function signageMergeRemoteProgramming(state, programming, remoteContentIds = new Map()) {
  const remotePlaylists = Array.isArray(programming?.playlists) ? programming.playlists : []
  const remoteSchedules = Array.isArray(programming?.schedules) ? programming.schedules : []
  const remotePlaylistIds = new Set(remotePlaylists.map(item => item.id))
  const remoteScheduleIds = new Set(remoteSchedules.map(item => item.id))
  const localPlaylistIds = new Map()
  const localPlaylists = state.playlists.filter(item => !item.central && !item.backendPlaylistId)
  for (const item of remotePlaylists) {
    const existing = state.playlists.find(playlist => playlist.backendPlaylistId === item.id || playlist.id === item.id)
    const id = existing?.id || item.id
    localPlaylistIds.set(item.id, id)
    localPlaylists.push({
      ...(existing || {}), id, name: item.name, central: true, backendPlaylistId: item.id,
      backendRevision: Number(item.current_revision) || 0, createdAt: item.created_at || existing?.createdAt || null,
      updatedAt: item.updated_at || null,
      entries: (Array.isArray(item.entries) ? item.entries : []).map(entry => ({
        contentId: remoteContentIds.get(entry.contentId) || entry.contentId,
        contentRevision: Number(entry.contentRevision) || 0,
        durationSeconds: Number(entry.durationSeconds) || 0,
      })),
    })
  }
  const localSchedules = state.schedules.filter(item => !item.central && !item.backendScheduleId)
  for (const item of remoteSchedules) {
    const existing = state.schedules.find(schedule => schedule.backendScheduleId === item.id || schedule.id === item.id)
    const playlistId = localPlaylistIds.get(item.playlist_id) || item.playlist_id
    localSchedules.push({
      ...(existing || {}), id: existing?.id || item.id, central: true, backendScheduleId: item.id,
      backendRevision: Number(item.revision) || 0, screenId: item.device_id, playlistId,
      playlistRevision: Number(item.playlist_revision) || 0, startsAt: item.starts_at, endsAt: item.ends_at,
      priority: Number(item.priority) || 0, enabled: item.enabled !== false,
      createdAt: item.created_at || existing?.createdAt || null, updatedAt: item.updated_at || null,
    })
  }
  state.playlists = localPlaylists.filter(item => !item.backendPlaylistId || remotePlaylistIds.has(item.backendPlaylistId))
  state.schedules = localSchedules.filter(item => !item.backendScheduleId || remoteScheduleIds.has(item.backendScheduleId))
  return state
}

async function signageSyncRemoteDevices(options = {}) {
  if (_signageRemoteSyncPromise) return _signageRemoteSyncPromise
  const config = signagePublicConfig()
  if (!config.enabled || !signageContext().canManage) return { added: [] }
  _signageRemoteSyncPromise = (async () => {
    try {
      const client = signageBackendClient()
      _signageSyncState = { status: 'loading', at: _signageSyncState.at, error: '' }
      const [result, spacesResult, contentResult, activityResult, programmingResult, experienceResult] = await Promise.all([
        client.listDevices(),
        client.listSpaces().catch(() => ({ spaces: [] })),
        client.listContent(),
        client.listActivity().catch(() => ({ activity: [] })),
        client.listProgramming(),
        client.listExperiences().catch(() => ({ experiences: [], sessions: [] })),
      ])
      const added = []
      let changed = false
      let next = _signageState
      const remoteContentIds = new Map()
      for (const remoteContent of contentResult?.content || []) {
        const existing = next.contents.find(content => content.backendContentId === remoteContent.id || content.id === remoteContent.id)
        const normalized = signageRemoteContent(remoteContent, existing)
        remoteContentIds.set(remoteContent.id, normalized.id)
        if (existing) {
          if (JSON.stringify(existing) !== JSON.stringify(normalized)) changed = true
          Object.assign(existing, normalized)
        } else {
          next.contents.push(normalized)
          changed = true
        }
      }
      _signageRemoteActivity = Array.isArray(activityResult?.activity) ? activityResult.activity : []
      _signageRemoteExperiences = Array.isArray(experienceResult?.experiences) ? experienceResult.experiences : []
      _signageRemoteSessions = Array.isArray(experienceResult?.sessions) ? experienceResult.sessions : []
      const beforeProgramming = JSON.stringify({ playlists: next.playlists, schedules: next.schedules })
      signageMergeRemoteProgramming(next, programmingResult, remoteContentIds)
      if (beforeProgramming !== JSON.stringify({ playlists: next.playlists, schedules: next.schedules })) changed = true
      for (const remoteSpace of spacesResult?.spaces || []) {
        const normalized = { id: remoteSpace.id, name: remoteSpace.name, kind: 'paired', siteId: remoteSpace.site_id || remoteSpace.siteId, updatedAt: remoteSpace.updated_at || remoteSpace.updatedAt }
        const existingSpace = next.spaces.find(space => space.id === normalized.id)
        if (existingSpace) {
          if (existingSpace.name !== normalized.name || existingSpace.updatedAt !== normalized.updatedAt) changed = true
          Object.assign(existingSpace, normalized)
        } else { next.spaces.push(normalized); changed = true }
      }
      for (const device of result?.devices || []) {
        if (device?.state && device.state !== 'active') continue
        const existing = next.screens.find(screen => screen.id === device.id)
        if (existing) {
          const remote = signageRemoteScreen(device, existing, remoteContentIds)
          const paused = device?.output_paused === true || device?.outputPaused === true
          const revision = Number(device?.revision) || existing.backendRevision || 0
          if (existing.outputPaused !== paused || existing.backendRevision !== revision || existing.name !== remote.name || existing.spaceId !== remote.spaceId || existing.connectionState !== remote.connectionState || existing.lastSeenAt !== remote.lastSeenAt || existing.playbackStatus !== remote.playbackStatus || existing.publishedContentId !== remote.publishedContentId || existing.lastManifestRevision !== remote.lastManifestRevision) changed = true
          Object.assign(existing, remote, { outputPaused: paused, backendRevision: revision })
          continue
        }
        const remote = signageRemoteScreen(device, {}, remoteContentIds)
        remote.plant = next.spaces.find(space => space.id === remote.spaceId)?.name || 'Sin espacio'
        const registered = SignagePhase1.registerPairedScreen(next, remote, signageContext())
        next = registered.state
        Object.assign(registered.screen, remote)
        added.push(registered.screen)
        changed = true
      }
      if (changed) {
        if (!signageSaveState(next)) return { added: [], error: new Error('No se pudo guardar la sincronización local.') }
      }
      _signageSyncState = { status: 'ready', at: new Date().toISOString(), error: '' }
      renderSignageHome()
      return { added }
    } catch (error) {
      _signageSyncState = { status: 'error', at: _signageSyncState.at, error: error.message || 'No se pudo actualizar el servicio central.' }
      renderSignageHome()
      if (!options.silent) throw error
      return { added: [], error }
    } finally {
      _signageRemoteSyncPromise = null
    }
  })()
  return _signageRemoteSyncPromise
}

function showSignage() {
  if (_signagePlayerTimer) { clearInterval(_signagePlayerTimer); _signagePlayerTimer = null }
  _signagePlayerFailure = null
  syncModule('signage')
  _navLeaf = 'signage|_|control'
  sessionStorage.setItem('sierra_route', 'module:signage')
  leaveView()
  document.getElementById('content').classList.add('signage-active')
  renderSidebarTree()
  document.getElementById('tb-section').textContent = 'Pantallas'
  document.getElementById('sec-title').textContent = 'Pantallas'
  document.getElementById('sec-sub').textContent = 'Agrega una pantalla, elige contenido y muéstralo'
  const controls = document.getElementById('product-controls')
  controls.style.display = 'none'
  controls.innerHTML = ''
  signageLoadState()
  _signageActiveView = sessionStorage.getItem('sierra_signage_view') || 'spaces'
  if (!['spaces','content','sessions'].includes(_signageActiveView)) _signageActiveView = 'spaces'
  renderSignageHome()
  void signageSyncRemoteDevices({ silent: true })
  if (_signageManagementSyncTimer) clearInterval(_signageManagementSyncTimer)
  _signageManagementSyncTimer = setInterval(() => {
    if (sessionStorage.getItem('sierra_route') === 'module:signage') void signageSyncRemoteDevices({ silent: true })
  }, 30000)
}

function signageSyncStatusHtml() {
  if (!signagePublicConfig().enabled) return '<span class="sg-sync-state sg-sync-local">Modo de prueba local</span>'
  if (_signageSyncState.status === 'loading') return '<span class="sg-sync-state"><i></i>Actualizando cuenta…</span>'
  if (_signageSyncState.status === 'error') return `<button class="sg-sync-state sg-sync-error" type="button" onclick="signageRefreshCentral()"><i></i>No se pudo actualizar · Reintentar</button>`
  return `<span class="sg-sync-state sg-sync-ready"><i></i>Cuenta actualizada${_signageSyncState.at ? ` · ${esc(signageFormatTime(_signageSyncState.at))}` : ''}</span>`
}

function signageModuleNavHtml() {
  const items = [
    ['spaces', 'grid', 'Espacios', `${_signageState.screens.length} pantalla${_signageState.screens.length === 1 ? '' : 's'}`],
    ['content', 'image', 'Contenido', `${_signageState.contents.filter(item => !item.curated).length} pieza${_signageState.contents.filter(item => !item.curated).length === 1 ? '' : 's'}`],
    ['sessions', 'clock', 'Sesiones', _signageRemoteSessions.some(item => item.state === 'active' && new Date(item.expires_at) > new Date()) ? 'Experiencia activa' : 'Bienvenidas y actividad'],
  ]
  return `<nav class="sg-module-nav" aria-label="Secciones de Pantallas">${items.map(([id, icon, label, detail]) => `<button type="button" data-sg-view="${id}" class="sg-module-nav-item${_signageActiveView === id ? ' active' : ''}" aria-current="${_signageActiveView === id ? 'page' : 'false'}" onclick="signageNavigate('${id}',this)">${siIcon(icon,17)}<span><b>${label}</b><small>${detail}</small></span></button>`).join('')}</nav>`
}

function signageSpacesViewHtml() {
  const connected = _signageState.screens.filter(screen => screen.kind === 'paired' && screen.connectionState === 'connected').length
  const published = _signageState.screens.filter(screen => screen.publishedContentId && !screen.outputPaused).length
  return `<section class="sg-view" aria-labelledby="sg-spaces-title">
    <div class="sg-view-head"><div><span class="sg-kicker">Control por lugar</span><h2 id="sg-spaces-title">Espacios</h2><p>Selecciona pantallas de uno o varios espacios. Varias pantallas duplican la pieza completa; no crean un videowall.</p></div><div class="sg-actions"><button class="btn btn-secondary btn-sm" onclick="signageOpenSpaceDrawer()">${siIcon('plus',15)} Crear espacio</button><button class="btn btn-secondary btn-sm" onclick="signageOpenScreenDrawer()">${siIcon('plus',15)} Agregar pantalla</button><button class="btn btn-primary btn-sm" onclick="signageOpenWelcomeDrawer()">Preparar bienvenida</button></div></div>
    <div class="sg-view-toolbar"><label class="sg-search">${siIcon('search',15)}<input type="search" aria-label="Buscar pantallas o espacios" value="${escAttr(_signageScreenQuery)}" placeholder="Buscar pantalla o espacio" oninput="signageFilterScreens(this.value)"></label><div class="sg-overview" aria-label="Resumen de pantallas"><span><i class="sg-dot sg-dot-ok"></i><b>${connected}</b> conectada${connected === 1 ? '' : 's'}</span><span><i class="sg-dot"></i><b>${published}</b> con contenido</span><span><i class="sg-dot sg-dot-warn"></i><b>${_signageState.screens.filter(screen => screen.outputPaused).length}</b> en reposo</span></div></div>
    ${!_signageState.screens.length ? `<section class="sg-start" aria-labelledby="sg-start-title"><div><span class="sg-kicker">Empieza aquí</span><h3 id="sg-start-title">Conecta tu primera pantalla</h3><p>Abre el reproductor, identifica el código, ponle un nombre y asígnala a un espacio.</p></div><button class="btn btn-primary" onclick="signageOpenScreenDrawer()">${siIcon('plus',16)} Agregar pantalla</button></section>` : ''}
    ${signageSpacesHtml()}
  </section>`
}

function signageContentViewHtml() {
  const mediaNote = signagePublicConfig().mediaEnabled
    ? `Imágenes PNG/JPEG y videos MP4 H.264 pasan validación antes de guardarse. ${signagePublicConfig().liveEnabled ? 'Compartir computadora está disponible para una pantalla a la vez.' : 'Compartir computadora sigue deshabilitado.'}`
    : 'La carga de archivos y compartir computadora siguen deshabilitados hasta completar sus servicios.'
  return `<section class="sg-view" aria-labelledby="sg-library-title"><div class="sg-view-head"><div><span class="sg-kicker">Control por contenido</span><h2 id="sg-library-title">Contenido</h2><p>Elige una pieza y usa el mismo panel “Mostrar en…” para uno o varios destinos.</p></div><button class="btn btn-primary btn-sm" onclick="signageOpenContentDrawer()">${siIcon('plus',15)} Agregar contenido</button></div><div class="sg-view-toolbar"><label class="sg-search">${siIcon('search',15)}<input type="search" aria-label="Buscar contenido" value="${escAttr(_signageContentQuery)}" placeholder="Buscar contenido" oninput="signageFilterContent(this.value)"></label><span class="sg-sub">${mediaNote}</span></div>${signageLibraryHtml()}</section>`
}

function signageActivityLabel(event) {
  const labels = { 'content.saved':'Contenido guardado', 'content.approved':'Contenido aprobado', 'device.published':'Orden de publicación aceptada', 'device.output_stopped':'Pantalla dejada en reposo', 'device.updated':'Pantalla actualizada', 'device.paired':'Pantalla vinculada', 'space.saved':'Espacio guardado', 'device.revoked':'Pantalla revocada' }
  return labels[event?.event_type] || String(event?.event_type || 'Actividad').replaceAll('.', ' · ')
}

function signageCentralActivityHtml() {
  if (!signagePublicConfig().enabled) return '<div class="sg-empty-inline"><b>Actividad central no disponible</b><span>Este modo guarda únicamente datos de prueba en el navegador.</span></div>'
  if (_signageSyncState.status === 'error' && !_signageRemoteActivity.length) return `<div class="sg-empty-inline"><b>No pudimos cargar la actividad</b><span>${esc(_signageSyncState.error)}</span><button class="btn btn-secondary btn-sm" onclick="signageRefreshCentral()">Reintentar</button></div>`
  if (!_signageRemoteActivity.length) return '<div class="sg-empty-inline"><b>Sin actividad central todavía</b><span>Las órdenes aceptadas por el servicio aparecerán aquí.</span></div>'
  return `<div class="sg-activity-list">${_signageRemoteActivity.slice(0,50).map(event => `<article><span class="sg-activity-icon">${siIcon(event.entity_type === 'device' ? 'screen' : event.entity_type === 'content' ? 'image' : 'clock',15)}</span><div><b>${esc(signageActivityLabel(event))}</b><small>${esc(event.entity_type || 'Pantallas')} · ${esc(signageFormatTime(event.created_at))}</small></div><span class="sg-central-badge">Central</span></article>`).join('')}</div>`
}

function signageActivityViewHtml() {
  return `<section class="sg-view" aria-labelledby="sg-activity-title"><div class="sg-view-head"><div><span class="sg-kicker">Estado operacional</span><h2 id="sg-activity-title">Actividad</h2><p>Órdenes aceptadas por el servicio central. “Reproducción reportada” no confirma que el panel físico esté encendido.</p></div><button class="btn btn-secondary btn-sm" onclick="signageRefreshCentral()">${siIcon('refresh',15)} Actualizar</button></div>${signageCentralActivityHtml()}<details class="sg-local-section"><summary>Listas, horarios y registro local</summary><div class="sg-local-warning"><b>La programación vinculada se sincroniza con la cuenta.</b><span>Los borradores marcados “Solo aquí” permanecen en este navegador hasta que todos sus contenidos estén guardados centralmente.</span></div><div class="sg-section-head"><div><h3>Listas y horarios</h3></div><div class="sg-actions"><button class="btn btn-secondary btn-sm" onclick="signageOpenPlaylistDrawer()">Nueva lista</button><button class="btn btn-secondary btn-sm" onclick="signageOpenScheduleDrawer()">Crear horario</button></div></div>${signageProgrammingHtml()}<div class="sg-section-head"><div><h3>Registro de este navegador</h3></div></div>${signageAuditHtml()}</details></section>`
}

function signageSessionDestinations(session) {
  const rows = Array.isArray(session?.signage_experience_destinations) ? session.signage_experience_destinations : []
  return rows.map(row => _signageState.screens.find(screen => screen.id === row.device_id)?.name || 'Pantalla vinculada')
}

function signageSessionsViewHtml() {
  const now = Date.now()
  const experienceById = new Map(_signageRemoteExperiences.map(item => [item.id, item]))
  const sessions = _signageRemoteSessions.map(session => ({ ...session, experience: experienceById.get(session.experience_id), activeNow: session.state === 'active' && Date.parse(session.expires_at) > now }))
  const cards = sessions.length ? sessions.map(session => {
    const presentation = session.experience?.kind === 'presentation'
    const slide = Number(session.current_slide) || 0
    const count = Number(session.experience?.snapshot?.pageCount) || 0
    const destinations = (session.signage_experience_destinations || []).map(row => {
      const screen = _signageState.screens.find(item => item.id === row.device_id)
      const state = screen ? signageScreenState(screen) : { label: 'Sin estado reciente', cls: 'off' }
      return `<li><span>${esc(screen?.name || 'Pantalla vinculada')}</span><b class="sg-state sg-state-${escAttr(state.cls)}"><i></i>${esc(state.label)}</b></li>`
    }).join('')
    return `<article class="sg-session-card"><div><span class="sg-state ${session.activeNow ? 'sg-state-ok' : 'sg-state-local'}"><i></i>${session.activeNow ? 'Activa' : session.state === 'ended' ? 'Finalizada' : 'Vencida'}</span><h3>${esc(session.experience?.name || 'Bienvenida')}</h3><p>${presentation ? `Diapositiva ${slide + 1} de ${count}` : session.activeNow ? `Termina ${esc(signageFormatTime(session.expires_at))}` : `Inició ${esc(signageFormatTime(session.starts_at))}`}</p>${session.activeNow ? `<ul class="sg-session-destinations" aria-label="Estado por destino">${destinations}</ul>` : `<p>${esc(signageSessionDestinations(session).join(', ') || 'Sin destinos')}</p>`}</div>${session.activeNow ? `<div class="sg-session-actions">${presentation ? `<button class="btn btn-secondary btn-sm" ${slide <= 0 ? 'disabled' : ''} onclick="signageStepPresentation('${escAttr(session.id)}',${slide - 1},${Number(session.control_revision) || 0})">Anterior</button><button class="btn btn-secondary btn-sm" ${slide >= count - 1 ? 'disabled' : ''} onclick="signageStepPresentation('${escAttr(session.id)}',${slide + 1},${Number(session.control_revision) || 0})">Siguiente</button>` : ''}<button class="btn btn-secondary btn-sm" onclick="signageFinishExperience('${escAttr(session.id)}')">Finalizar y regresar</button></div>` : ''}</article>`
  }).join('') : '<div class="sg-empty-inline"><b>Aún no hay sesiones</b><span>Prepara una bienvenida o una presentación y revísala antes de mostrarla.</span></div>'
  return `<section class="sg-view" aria-labelledby="sg-sessions-title"><div class="sg-view-head"><div><span class="sg-kicker">Experiencias temporales</span><h2 id="sg-sessions-title">Sesiones</h2><p>Prepara sin publicar. Al finalizar o vencer, cada pantalla regresa a su salida anterior.</p></div><div class="sg-actions"><button class="btn btn-secondary btn-sm" onclick="signageOpenPresentationDrawer()">${siIcon('file',15)} Preparar PDF</button><button class="btn btn-primary btn-sm" onclick="signageOpenWelcomeDrawer()">${siIcon('plus',15)} Preparar bienvenida</button></div></div><div class="sg-session-list">${cards}</div><details class="sg-local-section"><summary>Actividad y programación</summary>${signageCentralActivityHtml()}<div class="sg-section-head"><div><h3>Listas y horarios</h3></div><div class="sg-actions"><button class="btn btn-secondary btn-sm" onclick="signageOpenPlaylistDrawer()">Nueva lista</button><button class="btn btn-secondary btn-sm" onclick="signageOpenScheduleDrawer()">Crear horario</button></div></div>${signageProgrammingHtml()}</details></section>`
}

function renderSignageHome() {
  if (!_signageState) signageLoadState()
  const pg = document.getElementById('pg')
  if (!signageContext().canManage) { pg.innerHTML = emptyStateHtml({ title: 'Acceso restringido', desc: 'No tienes permiso para administrar Pantallas.' }); return }
  for (const id of [..._signageSelectedScreenIds]) if (!_signageState.screens.some(screen => screen.id === id)) _signageSelectedScreenIds.delete(id)
  const warning = _signageLoadWarning ? `<div class="sg-banner sg-banner-warning" role="alert">${esc(_signageLoadWarning)}</div>` : ''
  const centralEnabled = signagePublicConfig().enabled
  const view = _signageActiveView === 'content' ? signageContentViewHtml() : _signageActiveView === 'sessions' ? signageSessionsViewHtml() : signageSpacesViewHtml()
  pg.innerHTML = `<div class="sg-phase">${_signageLiveSender ? `<div class="sg-live-active" role="status"><div><b>${_signageLiveState === 'media-flowing' ? 'Estás compartiendo tu computadora' : 'Conectando la pantalla…'}</b><span>${_signageLiveState === 'media-flowing' ? `Video confirmado hacia ${esc(_signageState.screens.find(item => item.id === _signageLiveScreenId)?.name || 'la pantalla elegida')}.` : 'La captura está activa, pero todavía no confirmamos el envío de video.'}</span></div><button class="btn btn-secondary" ${_signageLiveStopping ? 'disabled' : ''} onclick="signageStopLive()">${_signageLiveStopping ? 'Deteniendo…' : 'Dejar de compartir'}</button></div>` : ''}${warning}${signageLegacyFixtureNoticeHtml()}<div class="sg-account-bar"><div><b>${centralEnabled ? 'Cuenta central de Pantallas' : 'Modo de prueba'}</b><span>${centralEnabled ? 'Datos compartidos entre administradores cuando están marcados como centrales.' : 'Nada de esta vista controla televisiones reales.'}</span></div>${signageSyncStatusHtml()}</div><div class="sg-app-shell">${signageModuleNavHtml()}<main class="sg-module-main" tabindex="-1">${view}</main></div><div id="sg-selection-slot">${signageSelectionBarHtml()}</div><p class="sg-physical-note">El estado proviene del reproductor. No comprueba que la televisión física esté encendida ni que la entrada de video sea la correcta.</p></div>`
  signageApplyCurrentFilter()
}

function signageNavigate(view, trigger) {
  if (!['spaces','content','sessions'].includes(view) || view === _signageActiveView) return
  _signageViewScroll[_signageActiveView] = window.scrollY
  _signageActiveView = view
  sessionStorage.setItem('sierra_signage_view', view)
  renderSignageHome()
  requestAnimationFrame(() => { window.scrollTo({ top: _signageViewScroll[view] || 0, behavior: 'auto' }); document.querySelector(`[data-sg-view="${view}"]`)?.focus({ preventScroll: true }) })
}

function signageFilterScreens(value) { _signageScreenQuery = String(value || ''); signageApplyCurrentFilter() }
function signageFilterContent(value) { _signageContentQuery = String(value || ''); signageApplyCurrentFilter() }
function signageApplyCurrentFilter() {
  const query = (_signageActiveView === 'spaces' ? _signageScreenQuery : _signageContentQuery).trim().toLocaleLowerCase('es')
  if (_signageActiveView === 'spaces') document.querySelectorAll('[data-sg-space]').forEach(space => { const cards=[...space.querySelectorAll('[data-sg-searchable]')];cards.forEach(card=>{card.hidden=Boolean(query&&!card.dataset.sgSearchable.includes(query))});space.hidden=Boolean(query&&!cards.some(card=>!card.hidden)) })
  if (_signageActiveView === 'content') document.querySelectorAll('[data-sg-searchable]').forEach(card => { card.hidden = Boolean(query && !card.dataset.sgSearchable.includes(query)) })
}

async function signageRefreshCentral() { await signageSyncRemoteDevices({ silent: true }) }

function signageScreenState(screen) {
  if (screen.outputPaused) return { label: 'En reposo', detail: 'Muestra la pantalla de descanso', cls: 'warn' }
  if (screen.kind !== 'paired') return { label: 'Modo de prueba', detail: 'No conectada a una TV', cls: 'local' }
  const manifestCurrent = Number.isFinite(Number(screen.lastManifestRevision)) && Number(screen.lastManifestRevision) >= Number(screen.backendRevision || 0)
  if (screen.connectionState === 'connected' && screen.activePublicationId) {
    if (screen.playbackStatus === 'playing' && manifestCurrent) return { label: 'Reproducción reportada', detail: `Orden recibida · ${signageFormatTime(screen.lastSeenAt)}`, cls: 'ok' }
    return { label: 'Orden aceptada', detail: 'Esperando confirmación del reproductor', cls: 'pending' }
  }
  if (screen.activePublicationId) return { label: 'Orden aceptada', detail: 'Reproductor sin señal reciente', cls: 'pending' }
  if (screen.connectionState === 'connected') return { label: 'Reproductor conectado', detail: screen.lastSeenAt ? `Actualizado ${signageFormatTime(screen.lastSeenAt)}` : 'Heartbeat reciente', cls: 'ok' }
  return { label: 'Sin señal reciente', detail: screen.lastSeenAt ? `Último reporte ${signageFormatTime(screen.lastSeenAt)}` : 'Aún no reporta actividad', cls: 'off' }
}

function signageScreenTileHtml(screen) {
  const content = signageContentById(screen.publishedContentId)
  const state = signageScreenState(screen)
  const selected = _signageSelectedScreenIds.has(screen.id)
  const preview = screen.outputPaused ? '<div class="sg-screen-preview sg-screen-rest"><img src="SIERRA_Primary_Blue02.svg" alt=""><span>Descanso SIERRA</span></div>' : content ? `<div class="sg-screen-preview sg-theme-${escAttr(content.theme)}"><small>${esc(signageTypeLabel(content.type))}</small><b>${esc(content.title)}</b></div>` : '<div class="sg-screen-preview sg-screen-rest"><img src="SIERRA_Primary_Blue02.svg" alt=""><span>Listo para mostrar</span></div>'
  const search = `${screen.name} ${screen.plant || ''} ${content?.title || ''}`.toLocaleLowerCase('es')
  const liveAction = signagePublicConfig().liveEnabled && screen.kind === 'paired' ? `<button class="btn btn-secondary btn-sm" onclick="signageOpenLiveDrawer('${escAttr(screen.id)}')">Compartir computadora</button>` : ''
  return `<article class="sg-screen-tile${selected ? ' selected' : ''}" data-sg-searchable="${escAttr(search)}">${preview}<button class="sg-screen-select" type="button" data-screen-id="${escAttr(screen.id)}" aria-pressed="${selected}" aria-label="${selected ? 'Quitar' : 'Seleccionar'} ${escAttr(screen.name)}" onclick="signageToggleScreenSelection('${escAttr(screen.id)}')">${selected ? siIcon('check',16) : ''}</button><div class="sg-screen-copy"><div class="sg-screen-title"><b>${esc(screen.name)}</b><span class="sg-state sg-state-${state.cls}"><i></i>${esc(state.label)}</span></div><span>${esc(state.detail)}</span></div><div class="sg-screen-actions"><button class="btn btn-ghost btn-sm" onclick="signageOpenEditScreenDrawer('${escAttr(screen.id)}')">Configurar</button><button class="btn btn-secondary btn-sm" onclick="signageOpenPublishDrawer('${escAttr(screen.id)}')">Mostrar</button>${liveAction}${!screen.outputPaused ? `<button class="btn btn-ghost btn-sm" onclick="signageStopOutput('${escAttr(screen.id)}')">Dejar en reposo</button>` : ''}</div></article>`
}

function signageSpacesHtml() {
  if (!_signageState.screens.length) return emptyStateHtml({ title: 'Aún no agregas una pantalla', desc: 'Agrega una pantalla para empezar.', actionLabel: 'Agregar pantalla', actionOnClick: 'signageOpenScreenDrawer()' })
  const spaces = [..._signageState.spaces, { id: '', name: 'Sin espacio' }]
  return `<div class="sg-space-grid">${spaces.map(space => {
    const screens = _signageState.screens.filter(screen => (screen.spaceId || '') === space.id)
    if (!screens.length && !space.id) return ''
    return `<section class="sg-space${screens.length > 1 ? ' sg-space-wide' : ''}" data-sg-space><div class="sg-space-head"><div><span class="sg-space-icon">${siIcon('grid',16)}</span><span><b>${esc(space.name)}</b><small>${screens.length} pantalla${screens.length === 1 ? '' : 's'}</small></span></div>${screens.length ? `<button class="btn btn-ghost btn-sm" onclick="signageSelectSpace('${escAttr(space.id)}')">Seleccionar ${screens.length === 1 ? 'pantalla' : 'todas'}</button>` : ''}</div><div class="sg-screen-grid">${screens.map(screen => signageScreenTileHtml({ ...screen, plant: `${space.name} ${screen.plant || ''}` })).join('')}</div></section>`
  }).join('')}</div>`
}

function signageSelectionBarHtml() {
  const screens = _signageState.screens.filter(screen => _signageSelectedScreenIds.has(screen.id))
  if (!screens.length) return ''
  const liveAction = signagePublicConfig().liveEnabled && screens.length === 1 && screens[0].kind === 'paired' ? `<button class="btn btn-secondary btn-sm" onclick="signageOpenLiveDrawer('${escAttr(screens[0].id)}')">Compartir computadora</button>` : ''
  return `<div class="sg-selection-bar" role="region" aria-label="Pantallas seleccionadas"><div><b>${screens.length} pantalla${screens.length === 1 ? '' : 's'} seleccionada${screens.length === 1 ? '' : 's'}</b><span>${screens.map(screen => esc(screen.name)).join(', ')}</span></div><div class="sg-actions"><button class="btn btn-ghost btn-sm" onclick="signageClearSelection()">Cancelar</button>${liveAction}<button class="btn btn-secondary btn-sm" onclick="signageStopSelected()">Pantalla de descanso</button><button class="btn btn-primary btn-sm" onclick="signageOpenPublishDrawer()">Mostrar contenido</button></div></div>`
}

function signageRefreshSelectionUi(focusScreenId = '') {
  document.querySelectorAll('.sg-screen-tile').forEach(tile => {
    const button = tile.querySelector('.sg-screen-select')
    const screenId = button?.dataset.screenId
    if (!screenId) return
    const selected = _signageSelectedScreenIds.has(screenId)
    const screen = _signageState.screens.find(item => item.id === screenId)
    tile.classList.toggle('selected', selected)
    button.setAttribute('aria-pressed', String(selected))
    button.setAttribute('aria-label', `${selected ? 'Quitar' : 'Seleccionar'} ${screen?.name || 'pantalla'}`)
    button.innerHTML = selected ? siIcon('check', 16) : ''
  })
  const slot = document.getElementById('sg-selection-slot')
  if (slot) slot.innerHTML = signageSelectionBarHtml()
  if (focusScreenId) requestAnimationFrame(() => [...document.querySelectorAll('.sg-screen-select')].find(button => button.dataset.screenId === focusScreenId)?.focus({ preventScroll: true }))
}
function signageToggleScreenSelection(screenId) {
  if (_signageSelectedScreenIds.has(screenId)) _signageSelectedScreenIds.delete(screenId); else _signageSelectedScreenIds.add(screenId)
  signageRefreshSelectionUi(screenId)
}
function signageClearSelection() { _signageSelectedScreenIds.clear(); signageRefreshSelectionUi() }
function signageSelectSpace(spaceId) { _signageState.screens.filter(screen => (screen.spaceId || '') === spaceId).forEach(screen => _signageSelectedScreenIds.add(screen.id)); signageRefreshSelectionUi() }
function signageStopSelected() { return signageStopMany([..._signageSelectedScreenIds]) }

function signageSpaceChoicesHtml(selectedId = '') {
  return `<div class="sg-space-choices" role="radiogroup" aria-label="Espacio"><button type="button" class="sg-choice${selectedId ? '' : ' selected'}" data-space-id="" aria-pressed="${!selectedId}" onclick="signageChooseSpace(this)">Sin espacio</button>${_signageState.spaces.map(space => `<button type="button" class="sg-choice${selectedId === space.id ? ' selected' : ''}" data-space-id="${escAttr(space.id)}" aria-pressed="${selectedId === space.id}" onclick="signageChooseSpace(this)">${esc(space.name)}</button>`).join('')}</div>`
}
function signageChooseSpace(button) { button.closest('.sg-space-choices').querySelectorAll('[data-space-id]').forEach(option=>{const selected=option===button;option.classList.toggle('selected',selected);option.setAttribute('aria-pressed',String(selected))}) }

function signageWelcomePreview() {
  const name = document.getElementById('sg-welcome-display')?.value.trim() || 'Invitado de muestra'
  const subtitle = document.getElementById('sg-welcome-subtitle')?.value.trim() || 'Bienvenidos a SIERRA'
  const title = document.querySelector('.sg-welcome-preview h3'), copy = document.querySelector('.sg-welcome-preview p')
  if (title) title.textContent = name
  if (copy) copy.textContent = subtitle
}

function signageOpenWelcomeDrawer() {
  const selected = new Set(_signageSelectedScreenIds)
  openSideDrawer({ eyebrow:'Pantallas · Experiencias', title:'Preparar bienvenida', onTab:()=>{
    document.getElementById('sd-body').innerHTML=`<form class="sg-form" onsubmit="signageSubmitWelcome(event,'prepare')" novalidate><div class="sg-form-note"><b>Preparar no publica.</b> Revisa la salida y los destinos. Solo “Mostrar ahora” enviará una orden.</div><div class="sg-welcome-layout"><div><label class="sg-field" for="sg-welcome-name"><span>Nombre de la sesión</span><input class="control-input" id="sg-welcome-name" maxlength="100" value="Bienvenida de muestra"><small class="sg-muted">Visible únicamente en el centro de control.</small></label><label class="sg-field" for="sg-welcome-display"><span>Nombre visible</span><input class="control-input" id="sg-welcome-display" maxlength="60" value="Invitado de muestra" oninput="signageWelcomePreview()"></label><label class="sg-field" for="sg-welcome-subtitle"><span>Motivo o mensaje breve</span><input class="control-input" id="sg-welcome-subtitle" maxlength="90" value="Visita a nuestras instalaciones" oninput="signageWelcomePreview()"></label><fieldset class="sg-theme-field"><legend>Regresar automáticamente</legend><div class="sg-choice-list" role="radiogroup"><button type="button" class="sg-choice" data-welcome-duration="30" aria-pressed="false" onclick="signageChooseOne(this,'.sg-choice[data-welcome-duration]')">30 minutos</button><button type="button" class="sg-choice selected" data-welcome-duration="60" aria-pressed="true" onclick="signageChooseOne(this,'.sg-choice[data-welcome-duration]')">1 hora</button><button type="button" class="sg-choice" data-welcome-duration="240" aria-pressed="false" onclick="signageChooseOne(this,'.sg-choice[data-welcome-duration]')">4 horas</button><button type="button" class="sg-choice" data-welcome-duration="480" aria-pressed="false" onclick="signageChooseOne(this,'.sg-choice[data-welcome-duration]')">Jornada</button></div></fieldset></div><div class="sg-welcome-preview" aria-label="Previsualización de salida"><img src="${escAttr(SIERRA_SIGNAGE_LOGO_URL)}" alt="SIERRA"><span>BIENVENIDA · SIERRA</span><h3>Invitado de muestra</h3><p>Visita a nuestras instalaciones</p><footer>SIERRA tvOS · vista previa</footer></div></div><fieldset class="sg-theme-field"><legend>Destinos</legend><div class="sg-destination-list">${_signageState.screens.filter(screen=>screen.kind==='paired').map(screen=>`<label class="sg-destination"><input type="checkbox" name="welcome-device" value="${escAttr(screen.id)}"${selected.has(screen.id)?' checked':''}><span><strong>${esc(screen.name)}</strong><small>${esc(_signageState.spaces.find(space=>space.id===screen.spaceId)?.name||'Sin espacio')} · ${esc(signageScreenState(screen).label)}</small></span></label>`).join('')||'<div class="sg-empty-inline"><b>No hay pantallas vinculadas</b><span>Agrega una pantalla antes de mostrar la bienvenida.</span></div>'}</div><small id="sg-welcome-error" class="sg-error"></small></fieldset><div class="sg-form-note"><b>Al finalizar o vencer</b><span>La sesión deja de tener prioridad y cada pantalla regresa a la publicación, horario o reposo que ya tenía.</span></div><div class="sg-form-actions sg-drawer-actions"><button type="button" class="btn btn-secondary" onclick="closeSideDrawer()">Cancelar</button><button class="btn btn-secondary" type="submit">Guardar preparada</button><button class="btn btn-primary" type="button" onclick="signageSubmitWelcome(event,'start')">Mostrar ahora</button></div></form>`
    requestAnimationFrame(()=>document.getElementById('sg-welcome-display')?.focus())
  } })
}

async function signageSubmitWelcome(event, mode) {
  event.preventDefault()
  const form = event.currentTarget?.closest?.('form') || document.querySelector('#sd-body form')
  const buttons = [...form.querySelectorAll('button')], error = document.getElementById('sg-welcome-error')
  const deviceIds = [...form.querySelectorAll('input[name="welcome-device"]:checked')].map(input=>input.value)
  if (mode === 'start' && !deviceIds.length) { error.textContent='Elige al menos una pantalla.'; return }
  error.textContent=''; buttons.forEach(button=>button.disabled=true)
  try {
    const saved = await signageBackendClient().saveExperience({ name:document.getElementById('sg-welcome-name').value.trim(), displayName:document.getElementById('sg-welcome-display').value.trim(), subtitle:document.getElementById('sg-welcome-subtitle').value.trim(), template:'essential' })
    if (mode === 'start') await signageBackendClient().startExperience(saved.experience.id,{ deviceIds, durationMinutes:Number(form.querySelector('.sg-choice[data-welcome-duration].selected')?.dataset.welcomeDuration || 60) })
    closeSideDrawer(); _signageActiveView='sessions'; sessionStorage.setItem('sierra_signage_view','sessions'); await signageSyncRemoteDevices({silent:true}); toast(mode==='start'?'Bienvenida enviada. Revisa el resultado por pantalla.':'Bienvenida guardada como preparada.')
  } catch (failure) { error.textContent=failure.message||'No se pudo guardar la bienvenida.'; buttons.forEach(button=>button.disabled=false) }
}

async function signageFinishExperience(sessionId) {
  try { await signageBackendClient().finishExperience(sessionId); await signageSyncRemoteDevices({silent:true}); toast('Sesión finalizada. Las pantallas regresan a su salida anterior.') }
  catch (error) { toast(error.message||'No se pudo finalizar la sesión.') }
}

function signageReleasePresentationDraft() {
  if (_signagePresentationDraft?.slides) _signagePresentationDraft.slides.forEach(slide => { if (slide.previewUrl) URL.revokeObjectURL(slide.previewUrl) })
  _signagePresentationDraft = null
}

function signagePresentationDestinationsHtml(selected) {
  return _signageState.screens.filter(screen=>screen.kind==='paired').map(screen=>`<label class="sg-destination"><input type="checkbox" name="presentation-device" value="${escAttr(screen.id)}"${selected.has(screen.id)?' checked':''}><span><strong>${esc(screen.name)}</strong><small>${esc(_signageState.spaces.find(space=>space.id===screen.spaceId)?.name||'Sin espacio')} · ${esc(signageScreenState(screen).label)}</small></span></label>`).join('')||'<div class="sg-empty-inline"><b>No hay pantallas vinculadas</b><span>Agrega una pantalla antes de mostrar la presentación.</span></div>'
}

function signagePresentationPreviewHtml() {
  const draft=_signagePresentationDraft
  if(!draft)return '<div class="sg-pdf-empty"><b>El PDF se procesa aquí</b><span>El original no se sube. Solo guardaremos imágenes PNG verificadas de sus páginas cuando confirmes.</span></div>'
  const slide=draft.slides[draft.activeIndex||0]
  return `<div class="sg-pdf-stage"><img src="${escAttr(slide.previewUrl)}" alt="${escAttr(slide.alt)}"><span>${slide.index+1} / ${draft.pageCount}</span></div><div class="sg-pdf-thumbs" role="list" aria-label="Diapositivas">${draft.slides.map(item=>`<button type="button" role="listitem" class="${item.index===(draft.activeIndex||0)?'selected':''}" onclick="signageSelectPdfSlide(${item.index})" aria-label="Ver diapositiva ${item.index+1}"><img src="${escAttr(item.previewUrl)}" alt=""><span>${item.index+1}</span></button>`).join('')}</div>`
}

function signageOpenPresentationDrawer() {
  signageReleasePresentationDraft()
  const selected=new Set(_signageSelectedScreenIds)
  openSideDrawer({eyebrow:'Pantallas · Sesiones',title:'Preparar presentación PDF',onTab:()=>{
    document.getElementById('sd-body').innerHTML=`<form class="sg-form" onsubmit="signageSubmitPresentation(event,'prepare')" novalidate><div class="sg-form-note"><b>Procesamiento privado en este navegador.</b><span>PDF de hasta 25 MB y 50 páginas. No se ejecutan scripts; PowerPoint y Keynote aún no son compatibles.</span></div><label class="sg-field" for="sg-pdf-name"><span>Nombre de la sesión</span><input class="control-input" id="sg-pdf-name" maxlength="100" placeholder="Ej. Presentación de resultados"></label><label class="sg-pdf-picker" for="sg-pdf-file"><span>${siIcon('file',20)}</span><b>Elegir PDF</b><small>El original no saldrá de este dispositivo.</small><input id="sg-pdf-file" type="file" accept="application/pdf,.pdf" onchange="signageProcessPdf(event)" hidden></label><div id="sg-pdf-progress" class="sg-pdf-progress" role="status" aria-live="polite"></div><div id="sg-pdf-preview" class="sg-pdf-preview">${signagePresentationPreviewHtml()}</div><fieldset class="sg-theme-field"><legend>Regresar automáticamente</legend><div class="sg-choice-list" role="radiogroup"><button type="button" class="sg-choice selected" data-presentation-duration="60" aria-pressed="true" onclick="signageChooseOne(this,'.sg-choice[data-presentation-duration]')">1 hora</button><button type="button" class="sg-choice" data-presentation-duration="240" aria-pressed="false" onclick="signageChooseOne(this,'.sg-choice[data-presentation-duration]')">4 horas</button><button type="button" class="sg-choice" data-presentation-duration="480" aria-pressed="false" onclick="signageChooseOne(this,'.sg-choice[data-presentation-duration]')">Jornada</button></div></fieldset><fieldset class="sg-theme-field"><legend>Destinos</legend><div class="sg-destination-list">${signagePresentationDestinationsHtml(selected)}</div><small id="sg-pdf-error" class="sg-error"></small></fieldset><div class="sg-form-note"><b>Al finalizar, vencer o perder la conexión</b><span>La pantalla conserva la última diapositiva válida durante la reconexión. Al finalizar la sesión regresa a la bienvenida, publicación, horario o reposo anterior.</span></div><div class="sg-form-actions sg-drawer-actions"><button type="button" class="btn btn-secondary" onclick="signageReleasePresentationDraft();closeSideDrawer()">Cancelar</button><button class="btn btn-secondary" type="submit">Guardar preparada</button><button class="btn btn-primary" type="button" onclick="signageSubmitPresentation(event,'start')">Mostrar ahora</button></div></form>`
    requestAnimationFrame(()=>document.getElementById('sg-pdf-name')?.focus())
  }})
}

async function signageProcessPdf(event) {
  const file=event.target.files?.[0],progress=document.getElementById('sg-pdf-progress'),error=document.getElementById('sg-pdf-error')
  if(!file)return
  signageReleasePresentationDraft();error.textContent='';progress.textContent='Validando PDF…'
  try {
    const result=await SignagePdfPresentations.processPdf(file,{onProgress:state=>{progress.textContent=state.stage==='rendering'?`Preparando diapositiva ${state.completed+1} de ${state.total}…`:state.stage==='complete'?`${state.total} diapositivas listas para revisar.`:'Validando PDF…'}})
    result.activeIndex=0;result.slides.forEach(slide=>{slide.previewUrl=URL.createObjectURL(slide.blob);slide.mediaAssetId=null});_signagePresentationDraft=result
    if(!document.getElementById('sg-pdf-name').value.trim())document.getElementById('sg-pdf-name').value=result.name
    document.getElementById('sg-pdf-preview').innerHTML=signagePresentationPreviewHtml()
  } catch(failure){progress.textContent='';error.textContent=failure.message||'No se pudo preparar el PDF.';event.target.value=''}
}

function signageSelectPdfSlide(index){if(!_signagePresentationDraft||!_signagePresentationDraft.slides[index])return;_signagePresentationDraft.activeIndex=index;document.getElementById('sg-pdf-preview').innerHTML=signagePresentationPreviewHtml()}

async function signageSubmitPresentation(event,mode){
  event.preventDefault();const form=event.currentTarget?.closest?.('form')||document.querySelector('#sd-body form'),error=document.getElementById('sg-pdf-error'),progress=document.getElementById('sg-pdf-progress'),buttons=[...form.querySelectorAll('button')]
  const deviceIds=[...form.querySelectorAll('input[name="presentation-device"]:checked')].map(input=>input.value)
  if(!_signagePresentationDraft){error.textContent='Elige y revisa un PDF.';return}if(mode==='start'&&!deviceIds.length){error.textContent='Elige al menos una pantalla.';return}
  error.textContent='';buttons.forEach(button=>button.disabled=true)
  try{
    const client=signageBackendClient(),slides=_signagePresentationDraft.slides
    for(let index=0;index<slides.length;index+=1){const slide=slides[index];if(slide.mediaAssetId)continue;progress.textContent=`Guardando diapositiva ${index+1} de ${slides.length}…`;const file=new File([slide.blob],slide.fileName,{type:'image/png'});const uploaded=await client.upload(file);slide.mediaAssetId=uploaded.asset?.id||uploaded.asset?.assetId||uploaded.upload?.id||uploaded.assetId;if(!slide.mediaAssetId)throw new Error('La diapositiva se verificó, pero el servicio no devolvió su identificador.')}
    progress.textContent='Guardando presentación preparada…'
    const saved=await client.savePresentation({name:document.getElementById('sg-pdf-name').value.trim(),slides:slides.map(slide=>({mediaAssetId:slide.mediaAssetId,alt:slide.alt,width:slide.width,height:slide.height,index:slide.index}))})
    if(mode==='start')await client.startExperience(saved.experience.id,{deviceIds,durationMinutes:Number(form.querySelector('.sg-choice[data-presentation-duration].selected')?.dataset.presentationDuration||60)})
    signageReleasePresentationDraft();closeSideDrawer();_signageActiveView='sessions';sessionStorage.setItem('sierra_signage_view','sessions');await signageSyncRemoteDevices({silent:true});toast(mode==='start'?'Presentación enviada. Comprueba cada destino.':'Presentación guardada como preparada.')
  }catch(failure){error.textContent=failure.message||'No se pudo guardar la presentación. Puedes reintentar sin volver a procesar el PDF.';buttons.forEach(button=>button.disabled=false)}
}

async function signageStepPresentation(sessionId,targetSlide,expectedControlRevision){
  try{await signageBackendClient().stepExperience(sessionId,{targetSlide,expectedControlRevision});await signageSyncRemoteDevices({silent:true})}
  catch(error){await signageSyncRemoteDevices({silent:true});toast(error.message||'La presentación cambió. Actualizamos su estado para continuar.')}
}

function signageOpenSpaceDrawer() {
  openSideDrawer({ eyebrow:'Pantallas · Organización', title:'Crear espacio', onTab:()=>{
    document.getElementById('sd-body').innerHTML=`<form class="sg-form" onsubmit="signageSubmitSpace(event)" novalidate><div class="sg-form-note"><b>Un espacio organiza pantallas.</b> No cambia credenciales ni transmite contenido.</div><label class="sg-field" for="sg-space-name"><span>Nombre del espacio</span><input class="control-input" id="sg-space-name" maxlength="80" placeholder="Ej. Sala de coordinación"><small id="sg-space-name-error" class="sg-error"></small></label><div class="sg-form-actions"><button type="button" class="btn btn-secondary" onclick="closeSideDrawer()">Cancelar</button><button class="btn btn-primary" type="submit">Crear espacio</button></div></form>`;requestAnimationFrame(()=>document.getElementById('sg-space-name')?.focus())
  } })
}

async function signageSubmitSpace(event) {
  event.preventDefault();const name=document.getElementById('sg-space-name').value.trim();const errorEl=document.getElementById('sg-space-name-error');errorEl.textContent=''
  try {
    const result=SignagePhase1.createSpace(_signageState,{name},signageContext())
    if(signagePublicConfig().enabled){const config=signagePublicConfig();const remote=await signageBackendClient().saveSpace({name,siteId:config.siteId});result.space.id=remote.space.id;result.space.kind='paired';result.space.siteId=remote.space.site_id;result.space.updatedAt=remote.space.updated_at}
    if(!signageSaveState(result.state))return;closeSideDrawer();renderSignageHome();toast(`Espacio “${result.space.name}” creado.`)
  } catch(error){if(error.fields?.name)errorEl.textContent=error.fields.name;else errorEl.textContent=error.message||'No se pudo crear el espacio.'}
}

function signageOpenEditScreenDrawer(screenId) {
  const screen=_signageState.screens.find(item=>item.id===screenId);if(!screen)return
  openSideDrawer({eyebrow:'Pantallas · Configuración',title:screen.name,onTab:()=>{document.getElementById('sd-body').innerHTML=`<form class="sg-form" onsubmit="signageSubmitScreenUpdate(event,'${escAttr(screen.id)}')" novalidate><label class="sg-field" for="sg-edit-screen-name"><span>Nombre visible</span><input class="control-input" id="sg-edit-screen-name" maxlength="80" value="${escAttr(screen.name)}"><small id="sg-edit-screen-name-error" class="sg-error"></small></label><fieldset class="sg-theme-field"><legend>Espacio</legend>${signageSpaceChoicesHtml(screen.spaceId||'')}<small id="sg-edit-screen-spaceId-error" class="sg-error"></small></fieldset><div class="sg-form-note"><b>Estado real:</b> ${esc(signageScreenState(screen).label)}. Renombrar o mover no revoca la vinculación.</div><div class="sg-form-actions"><button type="button" class="btn btn-secondary" onclick="closeSideDrawer()">Cancelar</button><button class="btn btn-primary" type="submit">Guardar cambios</button></div></form>`}})
}

async function signageSubmitScreenUpdate(event,screenId){event.preventDefault();const screen=_signageState.screens.find(item=>item.id===screenId);if(!screen)return;const input={name:document.getElementById('sg-edit-screen-name').value,spaceId:document.querySelector('.sg-space-choices .selected')?.dataset.spaceId||null};try{if(screen.kind==='paired'){const remote=await signageBackendClient().updateDevice(screen.id,{name:input.name,spaceId:input.spaceId,expectedRevision:screen.backendRevision});screen.backendRevision=Number(remote.device.revision)||screen.backendRevision}const result=SignagePhase1.updateScreen(_signageState,screenId,input,signageContext());if(!signageSaveState(result.state))return;closeSideDrawer();renderSignageHome();toast('Pantalla actualizada. Su vinculación se conserva.')}catch(error){const errorEl=document.getElementById('sg-edit-screen-'+(error.fields?.name?'name':'spaceId')+'-error');if(errorEl)errorEl.textContent=error.fields?.name||error.fields?.spaceId||error.message||'No se pudo actualizar la pantalla.'}}

function signageOpenScreenDrawer() {
  if (!signageContext().canManage) { toast('No tienes permiso para agregar pantallas.'); return }
  openSideDrawer({ eyebrow: 'Pantallas', title: 'Agregar pantalla', onTab: () => {
    document.getElementById('sd-body').innerHTML = `<div class="sg-form">
      <div id="sg-pair-ready" class="sg-form-note"><b>Comprobando el servicio…</b> Espera un momento.</div>
      <form class="sg-form" onsubmit="signageSubmitPairing(event)" novalidate>
        <label class="sg-field" for="sg-pair-code"><span>Código de la pantalla <b aria-hidden="true">*</b></span><input class="control-input sg-code-input" id="sg-pair-code" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" placeholder="000000"><small id="sg-pair-code-error" class="sg-error"></small></label>
        <label class="sg-field" for="sg-pair-name"><span>¿Cómo quieres llamarla?</span><input class="control-input" id="sg-pair-name" maxlength="80" placeholder="Ej. Comedor planta 1"><small id="sg-pair-name-error" class="sg-error"></small></label>
        <fieldset class="sg-theme-field"><legend>Espacio</legend>${signageSpaceChoicesHtml()}<small class="sg-muted">Puedes asignarla después sin volver a vincularla.</small></fieldset>
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
    if (host) host.innerHTML = '<b>En la televisión o reproductor:</b> abre <a href="signage-player.html?build=P-20261029-9" target="_blank" rel="noopener">el reproductor de Pantallas</a>. Verás un código de 6 números.'
    if (submit) submit.disabled = false
    document.getElementById('sg-pair-code')?.focus()
  } catch {
    if (host) host.innerHTML = '<b>La conexión con televisiones todavía no está disponible en este sitio.</b> Puedes usar el modo de prueba mientras se configura el servicio central.'
  }
}

async function signageSubmitPairing(event) {
  event.preventDefault()
  if (_signagePairingInFlight) return
  const code = document.getElementById('sg-pair-code').value.trim()
  const name = document.getElementById('sg-pair-name').value.trim()
  const spaceId = document.querySelector('.sg-space-choices .selected')?.dataset.spaceId || null
  const plant = _signageState.spaces.find(space => space.id === spaceId)?.name || 'Sin espacio'
  const errorEl = document.getElementById('sg-pair-service-error'); errorEl.textContent = ''
  if (!/^\d{6}$/.test(code) || name.length < 3) { errorEl.textContent = 'Completa el código y el nombre.'; return }
  const submit = event.submitter || event.currentTarget?.querySelector('[type="submit"]')
  _signagePairingInFlight = true
  if (submit) { submit.disabled = true; submit.textContent = 'Vinculando…' }
  try {
    const config = signagePublicConfig()
    if (!config.enabled) throw new Error('El servicio central de Pantallas todavía no está habilitado.')
    const paired = await signageBackendClient().pairDevice({ code, name, plant, workspaceId: config.workspaceId, siteId: config.siteId, profile: 'Horizontal · 1920 × 1080' })
    if (spaceId) paired.device = (await signageBackendClient().updateDevice(paired.device.id, { name, spaceId, expectedRevision: 0 })).device
    const device = signageRemoteScreen(paired.device, { plant, profile: 'Horizontal · 1920 × 1080' })
    const result = SignagePhase1.registerPairedScreen(_signageState, device, signageContext())
    if (!signageSaveState(result.state)) return
    closeSideDrawer(); renderSignageHome(); toast('Pantalla vinculada. Ya puedes elegir qué mostrar.')
  } catch (error) {
    const recovered = await signageSyncRemoteDevices({ silent: true })
    const sameDevice = recovered.added.find(screen => screen.name.toLocaleLowerCase('es') === name.toLocaleLowerCase('es'))
    if (sameDevice) {
      closeSideDrawer(); renderSignageHome(); toast('La pantalla ya había quedado vinculada y fue recuperada.')
      return
    }
    errorEl.textContent = error.status === 404 ? 'El código no existe o ya venció. Genera uno nuevo en la pantalla.' : error.message || 'No se pudo conectar con el servicio de Pantallas.'
  } finally {
    _signagePairingInFlight = false
    if (submit) { submit.disabled = false; submit.textContent = 'Vincular pantalla' }
  }
}

function signageOpenLocalScreenDrawer() {
  if (!signageContext().canManage) { toast('No tienes permiso para registrar pantallas de prueba.'); return }
  openSideDrawer({ eyebrow: 'Pantallas · Modo de prueba', title: 'Agregar pantalla', onTab: () => {
    document.getElementById('sd-body').innerHTML = `<form class="sg-form" onsubmit="signageSubmitScreen(event)" novalidate>
      <div class="sg-form-note"><b>Estás en modo de prueba.</b> Esta pantalla se verá únicamente en este navegador. Para conectar una TV real se necesita el servicio central.</div>
      <label class="sg-field" for="sg-screen-name"><span>Nombre de la pantalla <b aria-hidden="true">*</b></span><input class="control-input" id="sg-screen-name" maxlength="80" placeholder="Ej. Comedor de prueba" aria-describedby="sg-screen-name-error"><small id="sg-screen-name-error" class="sg-error"></small></label>
      <fieldset class="sg-theme-field"><legend>Espacio</legend>${signageSpaceChoicesHtml()}<small id="sg-screen-spaceId-error" class="sg-error"></small></fieldset>
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
    spaceId: document.querySelector('.sg-space-choices .selected')?.dataset.spaceId || null,
    plant: _signageState.spaces.find(space => space.id === document.querySelector('.sg-space-choices .selected')?.dataset.spaceId)?.name || 'Sin espacio',
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

function signageContentPreviewHtml(content) {
  if (content.type === 'image' && content.mediaUrl) return `<div class="sg-content-preview sg-media-thumb" aria-hidden="true"><img src="${escAttr(content.mediaUrl)}" alt="" loading="lazy" onerror="this.hidden=true;this.parentNode.classList.add('fallback')"><span>IMAGEN</span></div>`
  return `<div class="sg-content-preview sg-theme-${escAttr(content.theme)}" aria-hidden="true"><span>${content.type === 'image' ? 'IMAGEN' : content.type === 'video' ? 'VIDEO MP4' : content.type === 'link' ? 'ENLACE' : esc(content.title)}</span></div>`
}

function signageLibraryHtml() {
  const curated = `<div class="sg-curated-note"><b>SIERRA para comenzar</b><span>Medios públicos del sitio oficial, verificados el 29 oct 2026. Se reproducen desde su URL pública; la cadena completa de licencias no está documentada.</span></div><div class="sg-library sg-library-curated">${SIERRA_CURATED_CONTENT.map(item => `<article class="panel sg-content-card sg-curated-card" data-sg-searchable="${escAttr(`${item.title} ${item.body} ${item.type}`.toLocaleLowerCase('es'))}"><div class="sg-content-preview sg-curated-preview">${item.poster || item.type === 'image' ? `<img src="${escAttr(item.poster || item.mediaUrl)}" alt="" onerror="this.hidden=true;this.parentNode.classList.add('fallback')">` : ''}<span>${item.type === 'video' ? 'VIDEO SIERRA' : 'IMAGEN SIERRA'}</span></div><div class="sg-content-copy"><div><h4>${esc(item.title)}</h4><p>${esc(item.body)}</p></div><div class="sg-content-footer"><span class="sg-sub">${esc(signageTypeLabel(item.type))} · Catálogo SIERRA</span><button class="btn btn-secondary btn-sm" onclick="signageOpenCuratedDestinations('${escAttr(item.id)}')">Mostrar en…</button></div></div></article>`).join('')}</div>`
  const personalContent = _signageState.contents.filter(content => !content.curated)
  const personal = personalContent.length ? `<h4 class="sg-library-title">Contenido de la cuenta</h4><div class="sg-library">${personalContent.map(content => { const central=Boolean(content.backendContentId);return `<article class="panel sg-content-card" data-sg-searchable="${escAttr(`${content.title} ${content.body || content.alt || content.url || ''} ${content.type}`.toLocaleLowerCase('es'))}">${signageContentPreviewHtml(content)}<div class="sg-content-copy"><div><div class="sg-content-heading"><h4>${esc(content.title)}</h4><span class="sg-source-badge ${central ? 'central' : 'local'}">${central ? 'Central' : 'Solo aquí'}</span></div><p>${esc(content.body || content.alt || content.url || '')}</p></div><div class="sg-content-footer"><span class="sg-sub">${esc(signageTypeLabel(content.type))} · ${esc(signageThemeLabel(content.theme))}</span><div class="sg-actions">${!central && signagePublicConfig().enabled && ['message','link'].includes(content.type) ? `<button class="btn btn-ghost btn-sm" onclick="signageMigrateLocalContent('${escAttr(content.id)}',this)">Guardar en cuenta</button>` : ''}<button class="btn btn-secondary btn-sm" onclick="signageOpenContentDestinations('${escAttr(content.id)}')">Mostrar en…</button></div></div></div></article>` }).join('')}</div>` : `<div class="sg-empty-inline"><b>Aún no agregas contenido propio</b><span>Puedes usar la selección SIERRA o agregar un mensaje o enlace.</span></div>`
  return curated + personal
}

async function signageMigrateLocalContent(contentId, button) {
  const content = signageContentById(contentId)
  if (!content || content.backendContentId || !['message','link'].includes(content.type)) return
  const original = button?.textContent || 'Guardar en cuenta'
  if (button) { button.disabled = true; button.textContent = 'Guardando…' }
  try {
    const remote = await signageBackendClient().createContent({ type: content.type, title: content.title, body: content.body, url: content.url })
    content.backendContentId = remote.content.id; content.backendRevision = remote.content.revision; content.backendStatus = remote.content.status || 'draft'; content.central = true
    if (!signageSaveState(_signageState)) return
    renderSignageHome(); toast('Contenido guardado en la cuenta central.')
  } catch (error) {
    if (button) { button.disabled = false; button.textContent = original }
    toast(error.message || 'No se pudo guardar este contenido en la cuenta.')
  }
}

function signageEnsureCuratedContent(curatedId) {
  const item = SIERRA_CURATED_CONTENT.find(entry => entry.id === curatedId)
  if (!item) throw new Error('Este contenido SIERRA ya no está disponible.')
  const existing = _signageState.contents.find(content => content.curatedId === curatedId)
  if (existing) return existing
  const result = SignagePhase1.createContent(_signageState, item, signageContext())
  result.content.curated = true; result.content.curatedId = item.id; result.content.poster = item.poster || ''; result.content.sourceUrl = item.sourceUrl
  if (!signageSaveState(result.state)) throw new Error('No se pudo guardar la selección SIERRA en este navegador.')
  return result.content
}

function signageOpenCuratedDestinations(curatedId) {
  try { signageOpenContentDestinations(signageEnsureCuratedContent(curatedId).id) } catch (error) { toast(error.message || 'No se pudo preparar el contenido SIERRA.') }
}

function signageOpenContentDestinations(contentId) {
  const content = signageContentById(contentId)
  if (!content) { toast('El contenido ya no está disponible.'); return }
  if (!_signageState.screens.length) { toast('Agrega una pantalla antes de elegir dónde mostrar.'); return }
  openSideDrawer({ eyebrow: 'Pantallas · Mostrar en…', title: content.title, onTab: () => {
    document.getElementById('sd-body').innerHTML = `<div class="sg-publish"><div class="sg-dispatch-preview"><span class="sg-theme-swatch sg-theme-${escAttr(content.theme)}"></span><div><b>${esc(content.title)}</b><small>${esc(signageTypeLabel(content.type))} · se mostrará completa en cada destino</small></div></div><div class="sg-form-note"><b>Mismo contenido en cada pantalla.</b> Esto no crea un videowall. Solo reemplaza la salida activa de los destinos elegidos.</div><p>Elige uno o varios destinos.</p><div class="sg-destination-list">${_signageState.spaces.concat([{ id:'', name:'Sin espacio' }]).map(space => { const screens=_signageState.screens.filter(screen=>(screen.spaceId||'')===space.id); return screens.length?`<div><b>${esc(space.name)}</b>${screens.map(screen=>{const selected=_signageSelectedScreenIds.has(screen.id),current=signageContentById(screen.publishedContentId);return `<button type="button" class="sg-destination${selected?' selected':''}" data-screen-id="${escAttr(screen.id)}" aria-pressed="${selected}" onclick="signageToggleDrawerDestination(this)"><span class="sg-destination-check">${selected?siIcon('check',14):''}</span><span><strong>${esc(screen.name)}</strong><small>${esc(signageScreenState(screen).label)} · ${current ? `reemplaza “${esc(current.title)}”` : 'sin contenido activo'}</small></span></button>`}).join('')}</div>`:'' }).join('')}</div><div id="sg-publish-feedback" class="sg-inline-feedback" role="status" aria-live="polite"></div><div class="sg-form-actions sg-drawer-actions"><button class="btn btn-secondary" onclick="closeSideDrawer()">Cancelar</button><button class="btn btn-primary" data-sg-publish-action onclick="signagePublishDrawerSelection('${escAttr(content.id)}')">Mostrar</button></div></div>`
    signageUpdateDrawerDestinationAction()
    requestAnimationFrame(() => document.querySelector('.sg-destination.selected,.sg-destination')?.focus({ preventScroll: true }))
  } })
}

function signageUpdateDrawerDestinationAction() {
  const count = document.querySelectorAll('.sg-destination.selected').length
  const button = document.querySelector('[data-sg-publish-action]')
  if (!button) return
  button.disabled = !count || _signageBatchInFlight
  button.textContent = count ? `Mostrar en ${count} pantalla${count === 1 ? '' : 's'}` : 'Elige una pantalla'
}
function signageToggleDrawerDestination(button) { const selected=!button.classList.contains('selected');button.classList.toggle('selected',selected);button.setAttribute('aria-pressed',String(selected));button.querySelector('.sg-destination-check').innerHTML=selected?siIcon('check',14):'';signageUpdateDrawerDestinationAction() }
function signagePublishDrawerSelection(contentId) { const ids=[...document.querySelectorAll('.sg-destination.selected')].map(button=>button.dataset.screenId);if(!ids.length)return;return signagePublishMany(ids,contentId) }

function signageProgrammingHtml() {
  if (!_signageState.playlists.length && !_signageState.schedules.length) return emptyStateHtml({ title: 'Aún no creas listas ni horarios', desc: 'Cuando tengas contenido, puedes combinarlo en una lista y elegir cuándo mostrarlo.' })
  const schedules = _signageState.schedules.map(schedule => {
    const screen = _signageState.screens.find(item => item.id === schedule.screenId)
    const playlist = _signageState.playlists.find(item => item.id === schedule.playlistId)
    return `<tr><td><b>${esc(playlist?.name || 'Lista no disponible')}</b><div class="sg-sub">${schedule.central ? 'Cuenta SIERRA' : 'Solo aquí'}</div></td><td>${esc(screen?.name || 'Pantalla no disponible')}</td><td>${esc(signageFormatTime(schedule.startsAt))}<div class="sg-sub">hasta ${esc(signageFormatTime(schedule.endsAt))}</div></td><td>${schedule.priority}</td></tr>`
  }).join('')
  return `<div class="sg-program-grid"><div><h4>Listas</h4><div class="sg-playlists">${_signageState.playlists.map(playlist => `<article class="panel sg-playlist-card"><b>${esc(playlist.name)}</b><span>${playlist.central ? 'Cuenta SIERRA' : 'Solo aquí'} · ${playlist.entries.length} pieza${playlist.entries.length === 1 ? '' : 's'} · ${playlist.entries.reduce((sum,item)=>sum+item.durationSeconds,0)} s por vuelta</span><ol>${playlist.entries.map(entry => `<li>${esc(signageContentById(entry.contentId)?.title || 'Pieza no disponible')} · ${entry.durationSeconds}s</li>`).join('')}</ol></article>`).join('') || '<p class="sg-muted">Sin listas.</p>'}</div></div><div><h4>Horarios</h4>${schedules ? `<div class="erp-table-wrap"><table class="erp-table sg-schedule-table"><thead><tr><th>Lista</th><th>Pantalla</th><th>Ventana</th><th>Prioridad</th></tr></thead><tbody>${schedules}</tbody></table></div>` : '<p class="sg-muted">Sin horarios.</p>'}</div></div>`
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
      <div class="sg-form-note">${mediaEnabled ? '<b>Sube una imagen o un video a la biblioteca privada.</b> Se verifican los bytes antes de guardarlo y no se mostrará automáticamente en ninguna pantalla.' : '<b>Crea un mensaje o enlace.</b> Las imágenes y videos SIERRA disponibles están en la biblioteca principal; cargar archivos propios llegará en una fase posterior.'}</div>
      <fieldset class="sg-theme-field"><legend>¿Qué quieres mostrar?</legend><div class="sg-type-options" role="radiogroup">${(mediaEnabled ? ['message','image','video','link'] : ['message','link']).map((type,index)=>`<button type="button" class="sg-type-option${index===0?' selected':''}" data-content-type="${type}" role="radio" aria-checked="${index===0}" onclick="signageChooseContentType(this)">${esc(signageTypeLabel(type))}</button>`).join('')}</div></fieldset>
      <label class="sg-field" for="sg-content-title"><span>Título <b aria-hidden="true">*</b></span><input class="control-input" id="sg-content-title" maxlength="80" required aria-describedby="sg-content-title-error"><small id="sg-content-title-error" class="sg-error"></small></label>
      <label class="sg-field" for="sg-content-body"><span id="sg-body-label">Mensaje <b aria-hidden="true">*</b></span><textarea class="control-input sg-textarea" id="sg-content-body" maxlength="240" required aria-describedby="sg-content-body-error"></textarea><small id="sg-content-body-error" class="sg-error"></small></label>
      <div id="sg-media-fields" hidden><label class="sg-field" for="sg-content-file"><span>Archivo de imagen o video <b aria-hidden="true">*</b></span><input class="control-input sg-file-input" id="sg-content-file" type="file" accept="image/png,image/jpeg,video/mp4,.png,.jpg,.jpeg,.mp4" onchange="signagePreviewUpload(this)" aria-describedby="sg-content-file-help sg-content-file-error"><small id="sg-content-file-help" class="sg-muted">PNG o JPEG hasta 10 MB. Video MP4 H.264 hasta 50 MB. PDF, presentaciones, GIF, WebP y WebM todavía no están disponibles.</small><small id="sg-content-file-error" class="sg-error"></small></label><div id="sg-upload-preview" class="sg-upload-preview" hidden></div><div id="sg-upload-state" class="sg-upload-state" hidden role="status" aria-live="polite"><progress id="sg-upload-progress" max="100" value="0"></progress><span id="sg-upload-status">Preparando archivo…</span></div><label class="sg-field" for="sg-content-alt"><span>Descripción accesible <b aria-hidden="true">*</b></span><input class="control-input" id="sg-content-alt" maxlength="180" aria-describedby="sg-content-alt-error"><small id="sg-content-alt-error" class="sg-error"></small></label></div>
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
  if (host.dataset.objectUrl) URL.revokeObjectURL(host.dataset.objectUrl)
  if (!file) { host.hidden = true; host.innerHTML = ''; delete host.dataset.objectUrl; return }
  const url = URL.createObjectURL(file)
  host.dataset.objectUrl = url
  host.hidden = false
  host.innerHTML = file.type === 'video/mp4' ? `<video src="${escAttr(url)}" controls muted playsinline preload="metadata" aria-label="Vista previa del video"></video><span>${esc(file.name)} · vista previa local</span>` : `<img src="${escAttr(url)}" alt="Vista previa local del archivo seleccionado"><span>${esc(file.name)} · vista previa local</span>`
}

function signageUploadProgress(update) {
  const host = document.getElementById('sg-upload-state'), progress = document.getElementById('sg-upload-progress'), status = document.getElementById('sg-upload-status')
  if (!host || !progress || !status) return
  const labels = { hashing: 'Comprobando el archivo…', preparing: 'Preparando carga privada…', uploading: 'Subiendo archivo…', verifying: 'Verificando formato y seguridad…', complete: 'Archivo verificado.' }
  host.hidden = false; progress.value = Math.max(0, Math.min(100, Number(update?.percent) || 0)); status.textContent = labels[update?.stage] || 'Procesando archivo…'
}

function signageWaitForMediaMetadata(file, type) {
  const objectUrl = URL.createObjectURL(file)
  return new Promise((resolve, reject) => {
    const element = type === 'image' ? new Image() : document.createElement('video')
    const timeout = setTimeout(() => finish(new Error('No se pudo leer el archivo en este navegador.')), 10000)
    const finish = error => { clearTimeout(timeout); URL.revokeObjectURL(objectUrl); element.removeAttribute('src'); if (error) reject(error); else resolve() }
    element.onerror = () => finish(new Error(type === 'image' ? 'La imagen está dañada o no es compatible.' : 'El video no se puede reproducir en este navegador. Exporta un MP4 H.264.'))
    if (type === 'image') element.onload = () => {
      const width = element.naturalWidth, height = element.naturalHeight
      finish(width < 1 || height < 1 || width > 8192 || height > 8192 || width * height > 33177600 ? new Error('La imagen supera 8K o no contiene dimensiones válidas.') : null)
    }
    else {
      element.preload = 'metadata'; element.muted = true; element.playsInline = true
      element.onloadedmetadata = () => finish(!Number.isFinite(element.duration) || element.duration <= 0 || element.videoWidth < 1 || element.videoHeight < 1 ? new Error('El video no contiene duración o dimensiones válidas.') : null)
    }
    element.src = objectUrl
  })
}

async function signageValidateSelectedMedia(file, type) {
  if (!file) throw new Error('Selecciona un archivo.')
  const expected = type === 'image' ? ['image/png','image/jpeg'] : type === 'video' ? ['video/mp4'] : []
  if (!expected.includes(file.type)) throw new Error(type === 'image' ? 'Selecciona una imagen PNG o JPEG.' : 'Selecciona un video MP4 H.264.')
  const extension = (file.name.toLowerCase().match(/\.[a-z0-9]+$/) || [''])[0]
  const validExtension = file.type === 'image/png' ? extension === '.png' : file.type === 'image/jpeg' ? ['.jpg','.jpeg'].includes(extension) : extension === '.mp4'
  if (!validExtension) throw new Error('La extensión no coincide con el formato declarado por el archivo.')
  const limit = type === 'image' ? 10 * 1024 * 1024 : 50 * 1024 * 1024
  if (file.size < 1 || file.size > limit) throw new Error(type === 'image' ? 'La imagen debe pesar 10 MB o menos.' : 'El video debe pesar 50 MB o menos.')
  if (type === 'video' && !document.createElement('video').canPlayType('video/mp4')) throw new Error('Este navegador no puede validar video MP4.')
  await signageWaitForMediaMetadata(file, type)
}

async function signageSubmitContent(event) {
  event.preventDefault()
  const form = event.currentTarget, submit = form.querySelector('button[type="submit"]')
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
  if (submit) { submit.disabled = true; submit.textContent = 'Guardando…' }
  try {
    let remote = null
    let uploaded = null
    const centralEnabled = signagePublicConfig().enabled
    const candidateMediaUrl = file ? `https://assets.invalid/${encodeURIComponent(file.name)}` : mediaUrl?.value
    const validation = SignagePhase1.validateContent({ type, title: title.value, body: body.value, theme, mediaUrl: candidateMediaUrl, alt: alt?.value, url: url?.value })
    if (!validation.ok) { const validationError = new Error('Corrige los campos marcados.'); validationError.fields = validation.errors; throw validationError }
    if (file) {
      if (!signagePublicConfig().mediaEnabled) throw new Error('Las imágenes y videos todavía no están habilitados en este piloto.')
      await signageValidateSelectedMedia(file, type)
      const client = signageBackendClient()
      uploaded = await client.upload(file, { onProgress: signageUploadProgress })
      remote = await client.createContent({ type, title: title.value, body: body.value, theme, alt: alt?.value, uploadId: uploaded.upload.id })
    } else if (centralEnabled && (type === 'message' || type === 'link')) {
      remote = await signageBackendClient().createContent({ type, title: title.value, body: body.value, url: url?.value })
    }
    const localMediaUrl = candidateMediaUrl
    const result = SignagePhase1.createContent(_signageState, { type, title: title.value, body: body.value, theme, mediaUrl: localMediaUrl, alt: alt?.value, url: url?.value }, signageContext())
    if (remote) {
      result.content.backendContentId = remote.content.id
      result.content.backendRevision = remote.content.revision
      result.content.backendStatus = remote.content.status || 'draft'
      result.content.central = true
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
    const fileError = document.getElementById('sg-content-file-error')
    if (file && fileError) { fileError.textContent = error.message || 'No se pudo verificar el archivo.'; document.getElementById('sg-content-file')?.setAttribute('aria-invalid', 'true') }
    const uploadStatus = document.getElementById('sg-upload-status')
    if (uploadStatus) uploadStatus.textContent = `${error.message || 'La carga falló.'} Puedes intentar de nuevo.`
    toast(error.message || 'No se pudo agregar el contenido.')
  } finally {
    if (submit?.isConnected) { submit.disabled = false; submit.textContent = 'Guardar contenido' }
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
    let central = false
    if (signagePublicConfig().enabled) {
      const remoteEntries = entries.map(entry => ({ contentId: signageContentById(entry.contentId)?.backendContentId, contentRevision: signageContentById(entry.contentId)?.backendRevision, durationSeconds: Number(entry.durationSeconds) }))
      if (remoteEntries.some(entry => !entry.contentId || !entry.contentRevision)) throw new Error('Para guardar esta lista en la cuenta, primero guarda todos sus contenidos en el servicio.')
      const remote = await signageBackendClient().createPlaylist({ name: result.playlist.name, entries: remoteEntries })
      result.playlist.backendPlaylistId = remote.playlist.id
      result.playlist.backendRevision = Number(remote.playlist.revision) || 0
      result.playlist.central = true
      central = true
    }
    if (!signageSaveState(result.state)) return
    closeSideDrawer(); renderSignageHome(); toast(central ? 'Lista guardada en la cuenta SIERRA.' : 'Lista guardada únicamente en este navegador.')
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
      result.schedule.backendRevision = Number(remote.schedule.revision) || 0
      result.schedule.central = true
    }
    if (!signageSaveState(result.state)) return
    closeSideDrawer(); renderSignageHome(); toast(result.schedule.central ? 'Horario guardado en la cuenta SIERRA.' : 'Horario guardado únicamente en este navegador.')
  } catch (error) {
    Object.entries(error.fields || {}).forEach(([field,message]) => {
      const el = document.getElementById('sg-schedule-' + field + '-error')
      if (el) el.textContent = message
    })
    toast(error.message || 'No se pudo crear el horario.')
  }
}

function signageTargetIds(input) {
  const values = Array.isArray(input) ? input : input ? [input] : [..._signageSelectedScreenIds]
  return [...new Set(values)].filter(id => _signageState.screens.some(screen => screen.id === id))
}

function signageOpenPublishDrawer(screenIds, preferredContentId) {
  if (!signageContext().canManage) { toast('No tienes permiso para publicar.'); return }
  const ids = signageTargetIds(screenIds)
  const screens = _signageState.screens.filter(screen => ids.includes(screen.id))
  if (!screens.length) { toast('Selecciona al menos una pantalla.'); return }
  const preferred = preferredContentId ? signageContentById(preferredContentId) : null
  if (preferredContentId && !preferred) { toast('El contenido ya no está disponible.'); return }
  openSideDrawer({ eyebrow: 'Pantallas · Mostrar', title: preferred ? 'Revisar envío' : 'Elegir contenido', onTab: () => {
    const targets = screens.map(screen => { const current=signageContentById(screen.publishedContentId);return `<li><b>${esc(screen.name)}</b><span>${esc(_signageState.spaces.find(space => space.id === screen.spaceId)?.name || 'Sin espacio')} · ${current ? `reemplaza “${esc(current.title)}”` : 'sin contenido activo'}</span></li>` }).join('')
    const scope = `<div class="sg-form-note"><b>Duplicar en ${screens.length} pantalla${screens.length === 1 ? '' : 's'}.</b> Cada destino mostrará la pieza completa. Esto no crea un videowall.</div><ul class="sg-target-summary">${targets}</ul>`
    const contents = preferred ? [preferred] : _signageState.contents
    document.getElementById('sd-body').innerHTML = `<div class="sg-publish">${scope}<p>${preferred ? 'Esta pieza reemplazará el contenido activo en los destinos indicados.' : 'Selecciona la pieza que debe quedar activa.'}</p><div class="sg-publish-list">${contents.map(content => `<button type="button" class="sg-publish-item" onclick="signagePublishMany(${escAttr(JSON.stringify(ids))},'${escAttr(content.id)}')"><span class="sg-theme-swatch sg-theme-${escAttr(content.theme)}"></span><span><b>${esc(content.title)}</b><small>${esc(content.body || content.alt || content.url || '')}</small></span><em>Mostrar</em></button>`).join('') || '<div class="sg-empty-inline"><b>No hay contenido disponible</b><span>Agrega contenido o elige una pieza de la selección SIERRA.</span></div>'}</div><button type="button" class="sg-rest-action" onclick="signageStopMany(${escAttr(JSON.stringify(ids))})"><span><b>Dejar en reposo</b><small>Muestra el descanso SIERRA sin desvincular ni borrar horarios.</small></span><span aria-hidden="true">→</span></button><div id="sg-publish-feedback" class="sg-inline-feedback" role="status" aria-live="polite"></div></div>`
    requestAnimationFrame(() => document.querySelector('.sg-publish-item,.sg-rest-action')?.focus({ preventScroll: true }))
  } })
}

async function signageEnsureRemoteContent(content) {
  if (content.backendContentId) return content.backendContentId
  const isCurated = content.curated === true && SIERRA_CURATED_CONTENT.some(item => item.id === content.curatedId && item.mediaUrl === content.mediaUrl)
  if ((content.type === 'image' || content.type === 'video') && !isCurated) throw new Error('Este archivo todavía no está guardado en el servicio de Pantallas.')
  const remote = await signageBackendClient().createContent({ type: content.type, title: content.title, body: content.body, alt: content.alt, url: content.url, mediaUrl: isCurated ? content.mediaUrl : undefined })
  content.backendContentId = remote.content.id
  content.backendRevision = remote.content.revision
  content.backendStatus = 'draft'
  return content.backendContentId
}

function signageSetDrawerBusy(busy, label = 'Actualizando pantallas…') {
  const body = document.getElementById('sd-body')
  if (!body) return
  body.setAttribute('aria-busy', String(busy))
  body.querySelectorAll('.sg-publish-item,.sg-rest-action,[data-sg-publish-action]').forEach(button => { button.disabled = busy })
  const feedback = body.querySelector('#sg-publish-feedback')
  if (feedback && busy) { feedback.dataset.pending = 'true'; feedback.setAttribute('role','status'); feedback.textContent = label }
  else if (feedback?.dataset.pending === 'true') { feedback.dataset.pending = 'false'; feedback.textContent = '' }
}

function signageBatchResultHtml(title, successes, failures, retry = null) {
  return `<div class="sg-batch-result" role="status"><h3>${esc(title)}</h3>${successes.length ? `<div class="sg-result-ok"><b>${successes.length} completada${successes.length === 1 ? '' : 's'}</b><ul>${successes.map(item => `<li>${esc(item.name)}</li>`).join('')}</ul></div>` : ''}${failures.length ? `<div class="sg-result-fail" role="alert"><b>${failures.length} no se pudo${failures.length === 1 ? '' : 'ieron'} actualizar</b><ul>${failures.map(item => `<li><span>${esc(item.name)}</span><small>${esc(item.message)}</small></li>`).join('')}</ul></div>` : ''}<div class="sg-form-actions">${retry ? `<button class="btn btn-secondary" onclick="${escAttr(retry.onclick)}">${esc(retry.label)}</button>` : ''}<button class="btn btn-primary" onclick="closeSideDrawer()">Listo</button></div></div>`
}

async function signagePublishMany(screenIds, contentId) {
  if (_signageBatchInFlight) return
  const ids = signageTargetIds(screenIds)
  const content = signageContentById(contentId)
  if (!ids.length || !content) { toast('El contenido o los destinos ya no están disponibles.'); return }
  _signageBatchInFlight = true
  signageSetDrawerBusy(true, `Mostrando en ${ids.length} pantalla${ids.length === 1 ? '' : 's'}…`)
  const successes = [], failures = []
  try {
    const paired = _signageState.screens.filter(screen => ids.includes(screen.id) && screen.kind === 'paired')
    let backendContentId = null
    if (paired.length) {
      backendContentId = await signageEnsureRemoteContent(content)
      if (content.backendStatus !== 'approved') {
        await signageBackendClient().approveContent(backendContentId, content.backendRevision)
        content.backendStatus = 'approved'
      }
    }
    for (const id of ids) {
      const screen = _signageState.screens.find(item => item.id === id)
      if (!screen) continue
      try {
        if (screen.kind === 'paired') {
          const remote = await signageBackendClient().publish(screen.id, backendContentId, screen.backendRevision)
          screen.backendRevision = Number(remote?.publication?.device_revision) || screen.backendRevision || 0
          screen.activePublicationId = remote?.publication?.id || screen.activePublicationId || null
          screen.desiredAt = new Date().toISOString()
        }
        const result = SignagePhase1.publishContent(_signageState, screen.id, content.id, signageContext())
        _signageState = result.state
        successes.push({ id: screen.id, name: result.screen.name })
      } catch (error) { failures.push({ id: screen.id, name: screen.name, message: error.message || 'No se pudo actualizar.' }) }
    }
    if (successes.length && !signageSaveState(_signageState)) return
    successes.forEach(item => _signageSelectedScreenIds.delete(item.id))
    failures.forEach(item => _signageSelectedScreenIds.add(item.id))
    renderSignageHome()
    const body = document.getElementById('sd-body')
    if (body) body.innerHTML = signageBatchResultHtml('Contenido enviado', successes, failures, failures.length ? { label: `Reintentar ${failures.length} pantalla${failures.length === 1 ? '' : 's'}`, onclick: `signagePublishMany(${JSON.stringify(failures.map(item => item.id))},${JSON.stringify(content.id)})` } : null)
    if (!failures.length) toast(`Contenido enviado a ${successes.length} pantalla${successes.length === 1 ? '' : 's'}.`)
  } catch (error) {
    const feedback = document.getElementById('sg-publish-feedback')
    if (feedback) { feedback.dataset.pending = 'false'; feedback.textContent = error.message || 'No se pudo preparar el contenido para estas pantallas.'; feedback.setAttribute('role','alert') }
    else toast(error.message || 'No se pudo preparar el contenido para estas pantallas.')
  }
  finally { _signageBatchInFlight = false; signageSetDrawerBusy(false) }
}

function signagePublish(screenId, contentId) { return signagePublishMany([screenId], contentId) }

function signageConfirmAction({ title, message, confirmLabel, tone = 'primary', onConfirm }) {
  const previous = document.activeElement
  const dialog = document.createElement('dialog')
  dialog.className = 'modal-content comms-confirm sg-confirm-dialog'
  dialog.setAttribute('aria-labelledby', 'sg-confirm-title')
  dialog.setAttribute('aria-describedby', 'sg-confirm-message')
  dialog.innerHTML = `<div class="modal-header"><h2 id="sg-confirm-title">${esc(title)}</h2></div><p id="sg-confirm-message">${esc(message)}</p><div class="modal-footer"><button type="button" class="btn btn-secondary" data-cancel>Cancelar</button><button type="button" class="btn ${tone === 'danger' ? 'btn-danger' : 'btn-primary'}" data-confirm>${esc(confirmLabel)}</button></div>`
  const cancel = dialog.querySelector('[data-cancel]')
  const confirmButton = dialog.querySelector('[data-confirm]')
  cancel.onclick = () => dialog.close()
  confirmButton.onclick = () => {
    if (confirmButton.disabled) return
    confirmButton.disabled = true
    dialog.close('confirmed')
    onConfirm()
  }
  dialog.addEventListener('close', () => { dialog.remove(); if (previous?.isConnected) previous.focus({ preventScroll: true }) }, { once: true })
  document.body.appendChild(dialog)
  dialog.showModal()
  cancel.focus()
}

function signageRollback(screenId) {
  const screen = _signageState.screens.find(item => item.id === screenId)
  if (!screen) return
  signageConfirmAction({ title: 'Restaurar contenido anterior', message: `Se restaurará la publicación local anterior de ${screen.name}.`, confirmLabel: 'Restaurar', onConfirm: () => {
    try {
      const result = SignagePhase1.rollbackScreen(_signageState, screenId, signageContext())
      if (!signageSaveState(result.state)) return
      renderSignageHome()
      toast('Se restauró la publicación local anterior.')
    } catch (error) { toast(error.message || 'No se pudo restaurar la publicación.') }
  } })
}

async function signageStopMany(screenIds, options = {}) {
  const ids = signageTargetIds(screenIds)
  if (!ids.length || _signageBatchInFlight) return
  const names = _signageState.screens.filter(screen => ids.includes(screen.id)).map(screen => screen.name)
  if (!options.confirmed) {
    signageConfirmAction({ title: ids.length === 1 ? 'Dejar pantalla en reposo' : `Dejar ${ids.length} pantallas en reposo`, message: `${ids.length === 1 ? names[0] : 'Las pantallas elegidas'} mostrar${ids.length === 1 ? 'á' : 'án'} el descanso SIERRA. Seguirán vinculadas y conservarán su contenido y horarios.`, confirmLabel: 'Dejar en reposo', onConfirm: () => signageStopMany(ids, { ...options, confirmed: true }) })
    return
  }
  _signageBatchInFlight = true
  signageSetDrawerBusy(true, `Dejando ${ids.length === 1 ? 'la pantalla' : `${ids.length} pantallas`} en reposo…`)
  const successes = [], failures = []
  try {
    for (const id of ids) {
      const screen = _signageState.screens.find(item => item.id === id)
      if (!screen || _signageStopInFlight.has(id)) continue
      _signageStopInFlight.add(id)
      try {
        if (_signageLiveSender && _signageLiveScreenId === id) await _signageLiveSender.stop()
        if (screen.kind === 'paired') {
          const remote = await signageBackendClient().stopOutput(screen.id, screen.backendRevision)
          screen.backendRevision = Number(remote?.device?.revision || remote?.device_revision) || screen.backendRevision || 0
        }
        const result = SignagePhase1.stopOutput(_signageState, id, signageContext())
        _signageState = result.state
        successes.push({ id, name: result.screen.name })
      } catch (error) { failures.push({ id, name: screen.name, message: error.message || 'No se pudo dejar en reposo.' }) }
      finally { _signageStopInFlight.delete(id) }
    }
    if (successes.length && !signageSaveState(_signageState)) return
    successes.forEach(item => _signageSelectedScreenIds.delete(item.id))
    failures.forEach(item => _signageSelectedScreenIds.add(item.id))
    renderSignageHome()
    const body = document.getElementById('sd-body')
    if (body && options.showResult !== false) body.innerHTML = signageBatchResultHtml('Pantalla de descanso', successes, failures, failures.length ? { label: `Reintentar ${failures.length} pantalla${failures.length === 1 ? '' : 's'}`, onclick: `signageStopMany(${JSON.stringify(failures.map(item => item.id))},{confirmed:true})` } : null)
    if (!failures.length) toast(`${successes.length} pantalla${successes.length === 1 ? '' : 's'} en reposo.`)
  } finally { _signageBatchInFlight = false; signageSetDrawerBusy(false); renderSignageHome() }
}

function signageStopOutput(screenId) { return signageStopMany([screenId]) }

function signageLiveFeedback(message, isError = false) {
  const feedback = document.getElementById('sg-live-feedback')
  if (!feedback) return
  feedback.textContent = message || ''
  feedback.classList.toggle('error', isError)
  feedback.setAttribute('role', isError ? 'alert' : 'status')
}

function signageOpenLiveDrawer(screenId) {
  const screen = _signageState.screens.find(item => item.id === screenId)
  if (!screen || screen.kind !== 'paired') { toast('Primero vincula una pantalla con su código.'); return }
  if (!signagePublicConfig().liveEnabled) { toast('Compartir pantalla todavía no está habilitado en este piloto.'); return }
  if (_signageLiveSender) { toast('Ya estás compartiendo tu pantalla. Detén esa transmisión primero.'); return }
  const supported = Boolean(window.isSecureContext && navigator.mediaDevices && typeof navigator.mediaDevices.getDisplayMedia === 'function')
  openSideDrawer({ eyebrow:'Pantallas · Sesiones', title:'Compartir computadora', onTab:()=>{
    document.getElementById('sd-body').innerHTML=`<div class="sg-live-setup"><div class="sg-live-destination"><span>${siIcon('screen',20)}</span><div><small>Se mostrará únicamente en</small><b>${esc(screen.name)}</b><span>${esc(_signageState.spaces.find(space=>space.id===screen.spaceId)?.name||'Sin espacio')}</span></div></div><div class="sg-form-note"><b>Tu navegador pedirá permiso.</b><span>Elige una pantalla, ventana o pestaña en el selector del sistema. SIERRA no puede reemplazar ni omitir esa confirmación.</span></div><ul class="sg-live-notes"><li>La prueba directa usa la red actual y una pantalla a la vez.</li><li>No es videowall ni duplica automáticamente hacia varias pantallas.</li><li>Al detener, cancelar o cerrar la captura, el destino regresa a su contenido anterior.</li></ul><div id="sg-live-feedback" class="sg-inline-feedback" role="status" aria-live="polite">${supported?'Nada se captura hasta que elijas “Elegir ventana o pantalla”.':'Este navegador no ofrece el permiso seguro para compartir pantalla.'}</div><div class="sg-form-actions sg-drawer-actions"><button type="button" class="btn btn-secondary" onclick="closeSideDrawer()">Cancelar</button><button type="button" class="btn btn-primary" data-sg-live-start ${supported?'':'disabled'} onclick="signageStartLive('${escAttr(screen.id)}',this)">Elegir ventana o pantalla</button></div></div>`
    requestAnimationFrame(()=>document.querySelector('[data-sg-live-start]')?.focus({preventScroll:true}))
  } })
}

async function signageStartLive(screenId, actionButton) {
  const screen = _signageState.screens.find(item => item.id === screenId)
  if (!screen || screen.kind !== 'paired') { toast('Primero vincula una pantalla con su código.'); return }
  if (!signagePublicConfig().liveEnabled) { toast('Compartir pantalla todavía no está habilitado en este piloto.'); return }
  if (_signageLiveSender) { toast('Ya estás compartiendo tu pantalla. Detén esa transmisión primero.'); return }
  let sender = null, capture = null, direct = false
  if (actionButton) actionButton.disabled = true
  try {
    if (!window.isSecureContext || !navigator.mediaDevices || typeof navigator.mediaDevices.getDisplayMedia !== 'function') throw new Error('Este navegador no permite compartir pantalla de forma segura.')
    _signageLiveState = 'requesting-capture'; signageLiveFeedback('Elige qué quieres compartir en el selector de tu navegador…')
    capture = await navigator.mediaDevices.getDisplayMedia({ video:{ frameRate:{ ideal:15,max:30 } }, audio:false })
    if (!capture?.getVideoTracks?.().length) throw new Error('No se recibió video de la pantalla elegida.')
    _signageLiveState = 'preparing'; signageLiveFeedback('Permiso concedido. Preparando una conexión privada con la pantalla…')
    const client = signageBackendClient()
    const runtime = await client.runtime()
    if (!runtime.liveAvailable) throw new Error('Compartir pantalla todavía no está disponible.')
    direct = runtime.connectionMode === 'direct'
    if (!direct && !runtime.iceServers?.length) throw new Error('Compartir pantalla requiere una conexión ICE/TURN configurada.')
    sender = SignageLiveShare.createSender({
      client,
      deviceId: screen.id,
      iceServers: runtime.iceServers,
      captureProvider: async()=>capture,
      onState: event => {
        _signageLiveState = event.state
        if (event.state === 'connected') signageLiveFeedback('Conexión establecida. Confirmando que el video está saliendo…')
        if (event.state === 'media-flowing') signageLiveFeedback('Video confirmado.')
      },
      onStop: result => {
        if (_signageLiveSender === sender) { _signageLiveSender = null; _signageLiveScreenId = null; _signageLiveState = 'idle'; _signageLiveStopping = false; renderSignageHome() }
        if (!result.remoteStopped) toast('La captura se detuvo aquí, pero no pudimos confirmar el regreso de la pantalla. Revisa su estado y reintenta.')
      },
    })
    _signageLiveSender = sender; _signageLiveScreenId = screen.id
    await sender.start()
    signageLiveFeedback(direct ? 'Buscando una ruta directa hacia la pantalla…' : 'Conectando mediante el relay configurado…')
    await sender.waitConnected(Number(window.SIERRA_SIGNAGE_LIVE_TIMEOUT_MS)||20000)
    await sender.waitMediaFlow(Number(window.SIERRA_SIGNAGE_MEDIA_TIMEOUT_MS)||8000)
    _signageLiveState = 'media-flowing'; closeSideDrawer(); renderSignageHome(); toast('Video confirmado. Usa “Dejar de compartir” para terminar.')
  } catch (error) {
    await sender?.stop('start-failed').catch(()=>{})
    if (!sender) capture?.getTracks?.().forEach(track=>track.stop())
    _signageLiveSender = null; _signageLiveScreenId = null; _signageLiveState = 'idle'; _signageLiveStopping = false
    const message = error.name === 'NotAllowedError'
      ? 'No se compartió nada. Tú decides qué ventana o pantalla permitir.'
      : direct && /no respondió a tiempo|rechazada por la red|no confirmó el envío/.test(error.message||'')
        ? 'No se confirmó video directo. La captura se detuvo; esta red puede requerir un relay TURN.'
        : error.message || 'No se pudo iniciar la transmisión.'
    if (document.getElementById('sg-live-feedback')) { signageLiveFeedback(message,true); if(actionButton)actionButton.disabled=false }
    else toast(message)
  }
}

async function signageStopLive() {
  if (_signageLiveStopping) return
  const sender = _signageLiveSender
  if (!sender) return
  _signageLiveStopping = true; renderSignageHome()
  const result = await sender.stop('user')
  _signageLiveSender = null; _signageLiveScreenId = null; _signageLiveState = 'idle'; _signageLiveStopping = false
  renderSignageHome()
  toast(result.remoteStopped ? 'Dejaste de compartir. La pantalla volvió a su contenido anterior.' : 'La captura se detuvo aquí. No pudimos confirmar el regreso de la pantalla; revisa su estado.')
}

if (typeof window !== 'undefined' && !window.__sierraSignageLivePagehideBound) {
  window.__sierraSignageLivePagehideBound = true
  window.addEventListener('pagehide', () => {
    const sender = _signageLiveSender
    _signageLiveSender = null; _signageLiveScreenId = null; _signageLiveState = 'idle'
    if (sender) void sender.stop('pagehide', { keepalive:true })
  })
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
  if (!signageContext().canManage) return
  signageConfirmAction({ title: 'Borrar datos de prueba', message: 'Se borrarán únicamente las pantallas, contenidos y horarios guardados en este navegador. Las pantallas vinculadas al servicio central no se revocarán.', confirmLabel: 'Borrar datos de prueba', tone: 'danger', onConfirm: () => {
    try {
      _signageState = signageRepository().reset()
      _signageLoadWarning = ''
      _signageSelectedScreenIds.clear()
      renderSignageHome()
      toast('Se borraron los datos del modo de prueba.')
    } catch { toast('No se pudo restablecer el almacenamiento local.') }
  } })
}
