import { createClient } from 'npm:@supabase/supabase-js@2'
import { ApiError, createSignageHandler, isAllowedCuratedMedia } from '../_shared/signage-api-core.mjs'
import { normalizeSignageManifest } from '../_shared/signage-manifest.mjs'
import { inspectMedia, MediaValidationError, sha256Hex } from '../_shared/signage-media-verify.mjs'

const env = (name: string, required = true) => {
  const value = Deno.env.get(name) || ''
  if (required && !value) throw new Error(`Missing ${name}`)
  return value
}
const supabaseUrl = env('SUPABASE_URL')
const anonKey = env('SUPABASE_ANON_KEY')
const serviceKey = env('SUPABASE_SERVICE_ROLE_KEY')
const service = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })
const encoder = new TextEncoder()
const b64url = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
const randomToken = (bytes = 32) => { const value = new Uint8Array(bytes); crypto.getRandomValues(value); return b64url(value) }
const digest = async (value: string) => [...new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(value)))].map(byte => byte.toString(16).padStart(2, '0')).join('')
const pairingDigest = async (value: string) => {
  const key = await crypto.subtle.importKey('raw', encoder.encode(env('SIGNAGE_PAIRING_PEPPER')), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  return [...new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(value)))].map(byte => byte.toString(16).padStart(2, '0')).join('')
}
const fail = (error: any, fallback = 'La operación fue rechazada.') => {
  if (!error) return
  const message = String(error.message || fallback)
  const denied = error.code === '42501' || /denied|permission|row-level|jwt/i.test(message)
  throw new ApiError(denied ? 403 : 500, denied ? 'ACCESS_DENIED' : 'DATA_ERROR', denied ? fallback : 'No se pudo completar la operación de datos.')
}
const one = <T>(result: { data: T, error: any }, fallback?: string) => { fail(result.error, fallback); return result.data }
const parseCors = () => (env('SIGNAGE_CORS_ORIGINS', false) || '').split(',').map(item => item.trim()).filter(Boolean)

async function userClient(token: string) {
  const client = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: `Bearer ${token}` } }, auth: { persistSession: false, autoRefreshToken: false } })
  const identity = await client.auth.getUser()
  if (identity.error || !identity.data.user) throw new ApiError(401, 'ADMIN_AUTH_INVALID', 'La sesión no es válida.')
  return { client, user: identity.data.user }
}

const adapter = {
  async authorizeAdmin(token: string, workspaceId: string, capability: string) {
    const { client, user } = await userClient(token)
    const result = await client.rpc('signage_can', { p_workspace: workspaceId, p_capability: capability })
    if (result.error || result.data !== true) throw new ApiError(403, 'CAPABILITY_DENIED', 'No tienes permiso para realizar esta acción.')
    return { id: user.id, token }
  },
  async authorizeDevice(deviceId: string, token: string) {
    const tokenDigest = await digest(token)
    const result = await service.from('signage_device_credentials').select('id,device_id,workspace_id,expires_at,revoked_at,signage_devices!inner(state)').eq('device_id', deviceId).eq('token_digest', tokenDigest).maybeSingle()
    fail(result.error)
    const row: any = result.data
    if (!row || row.revoked_at || (row.expires_at && new Date(row.expires_at) <= new Date()) || row.signage_devices?.state !== 'active') {
      throw new ApiError(401, 'DEVICE_CREDENTIAL_DENIED', 'La credencial del reproductor no es válida.')
    }
    return { deviceId, credentialId: row.id, workspaceId: row.workspace_id }
  },
  async rateLimit(bucket: string, limit: number, seconds: number) {
    const result = await service.rpc('signage_rate_limit_service', { p_bucket_digest: await digest(bucket), p_limit: limit, p_window_seconds: seconds })
    fail(result.error)
    if (result.data !== true) throw new ApiError(429, 'RATE_LIMITED', 'Demasiados intentos. Espera un momento.')
  },
  async createPairing() {
    const code = String(crypto.getRandomValues(new Uint32Array(1))[0] % 1000000).padStart(6, '0')
    const claimToken = randomToken(32), expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()
    const result = await service.from('signage_pairing_sessions').insert({ code_digest: await pairingDigest(code), claim_digest: await digest(claimToken), expires_at: expiresAt }).select('id').single()
    fail(result.error)
    return { code, claimToken, expiresAt }
  },
  async claimPairing(input: any) {
    const result = await service.rpc('signage_pairing_claim_service', {
      p_code_digest: await pairingDigest(input.code), p_workspace: input.workspaceId, p_site: input.siteId, p_name: input.name, p_actor: input.actorId,
    })
    fail(result.error, 'El código no existe, venció o ya fue utilizado.')
    return { state: 'claimed', device: { id: result.data.device_id, name: input.name, siteId: input.siteId, workspaceId: input.workspaceId } }
  },
  async deliverPairing(claimToken: string) {
    if (!/^[A-Za-z0-9_-]{40,128}$/.test(claimToken)) throw new ApiError(400, 'INVALID_CLAIM_TOKEN', 'La solicitud de vinculación no es válida.')
    const deviceToken = randomToken(48)
    const result = await service.rpc('signage_pairing_deliver_service', {
      p_claim_digest: await digest(claimToken), p_token_digest: await digest(deviceToken), p_fingerprint: (await digest(deviceToken)).slice(0, 32),
      p_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    })
    fail(result.error, 'La vinculación venció o ya fue entregada.')
    if (result.data.state === 'pending') return result.data
    return { state: 'paired', device: { id: result.data.device_id, workspaceId: result.data.workspace_id }, deviceToken }
  },
  async revokeDevice(input: any) {
    const { client } = await userClient(input.actor.token)
    const result = await client.rpc('signage_device_revoke', { p_workspace: input.workspaceId, p_device: input.deviceId, p_reason: input.reason })
    fail(result.error, 'No se pudo revocar la pantalla.')
  },
  async listDevices(input: any) {
    const result = await service.from('signage_devices')
      .select('id,workspace_id,site_id,space_id,name,state,revision,output_paused,active_publication_id,updated_at,signage_device_heartbeats(status,received_at,last_manifest_revision,player_version,errors)')
      .eq('workspace_id', input.workspaceId)
      .order('name')
      .order('received_at', { referencedTable: 'signage_device_heartbeats', ascending: false })
      .limit(1, { referencedTable: 'signage_device_heartbeats' })
    fail(result.error)
    const devices: any[] = result.data || []
    const publicationIds = devices.map(device => device.active_publication_id).filter(Boolean)
    const publications = publicationIds.length
      ? await service.from('signage_publications').select('id,device_id,content_id,content_revision,published_at,version,kind').eq('workspace_id', input.workspaceId).in('id', publicationIds)
      : { data: [], error: null }
    fail(publications.error)
    const byId = new Map((publications.data || []).map((publication: any) => [publication.id, publication]))
    return { devices: devices.map(device => ({ ...device, active_publication: byId.get(device.active_publication_id) || null })) }
  },
  async listSpaces(input: any) {
    const result = await service.from('signage_spaces').select('id,workspace_id,site_id,name,state,sort_order,created_at,updated_at').eq('workspace_id', input.workspaceId).eq('state', 'active').order('sort_order').order('name')
    fail(result.error); return { spaces: result.data || [] }
  },
  async saveSpace(input: any) {
    const { client } = await userClient(input.actor.token)
    const result = await client.rpc('signage_space_save', { p_workspace: input.workspaceId, p_space: input.space?.id || null, p_site: input.space?.siteId, p_name: String(input.space?.name || ''), p_expected_updated_at: input.space?.expectedUpdatedAt || null })
    fail(result.error, 'No se pudo guardar el espacio.'); return { space: result.data }
  },
  async updateDevice(input: any) {
    let revision = Number(input.expectedRevision)
    if (!Number.isSafeInteger(revision)) {
      const current = await service.from('signage_devices').select('revision').eq('id', input.deviceId).eq('workspace_id', input.workspaceId).maybeSingle()
      fail(current.error); if (!current.data) throw new ApiError(404, 'DEVICE_NOT_FOUND', 'No se encontró la pantalla.'); revision = current.data.revision
    }
    const { client } = await userClient(input.actor.token)
    const result = await client.rpc('signage_device_update', { p_workspace: input.workspaceId, p_device: input.deviceId, p_name: String(input.name || ''), p_space: input.spaceId || null, p_expected_device_revision: revision })
    fail(result.error, 'No se pudo actualizar la pantalla.'); return { device: result.data }
  },
  async listContent(input: any) {
    const result = await service.from('signage_content_items').select('id,title,status,current_revision,updated_at,created_at,created_by,updated_by').eq('workspace_id', input.workspaceId).order('updated_at', { ascending: false }).limit(200)
    fail(result.error)
    const items: any[] = result.data || []
    const versionRows: any[] = []
    for (let offset = 0; offset < items.length; offset += 25) {
      const chunk = items.slice(offset, offset + 25)
      const filter = chunk.map(item => `and(content_id.eq.${item.id},revision.eq.${item.current_revision})`).join(',')
      const versions = await service.from('signage_content_versions').select('content_id,revision,snapshot,created_at').eq('workspace_id', input.workspaceId).or(filter)
      fail(versions.error); versionRows.push(...(versions.data || []))
    }
    const current = new Map(versionRows.map((version: any) => [`${version.content_id}:${version.revision}`, version]))
    const snapshots = items.map(item => ({ ...item, revision: item.current_revision, snapshot: current.get(`${item.id}:${item.current_revision}`)?.snapshot || null }))
    const assetIds = [...new Set(snapshots.map(item => item.snapshot?.mediaAssetId).filter(Boolean))]
    const previewUrls = new Map<string,string>()
    if (assetIds.length) {
      const assets = await service.from('signage_media_assets').select('id,storage_path').eq('workspace_id', input.workspaceId).eq('state', 'ready').in('id', assetIds)
      fail(assets.error)
      if (assets.data?.length) {
        const links = await service.storage.from('signage-media').createSignedUrls(assets.data.map((asset: any) => asset.storage_path), 5 * 60)
        fail(links.error)
        const byPath = new Map((links.data || []).map((link: any) => [link.path, link.signedUrl]))
        for (const asset of assets.data) if (byPath.get(asset.storage_path)) previewUrls.set(asset.id, byPath.get(asset.storage_path) as string)
      }
    }
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString()
    return { content: snapshots.map(item => item.snapshot?.mediaAssetId && previewUrls.has(item.snapshot.mediaAssetId)
      ? { ...item, snapshot: { ...item.snapshot, mediaUrl: previewUrls.get(item.snapshot.mediaAssetId), mediaUrlExpiresAt: expiresAt } }
      : item) }
  },
  async listActivity(input: any) {
    const result = await service.from('signage_audit').select('id,event_type,entity_type,entity_id,actor_id,details,created_at').eq('workspace_id', input.workspaceId).order('created_at', { ascending: false }).limit(100)
    fail(result.error); return { activity: result.data || [] }
  },
  async listProgramming(input: any) {
    const playlists = await service.from('signage_playlists').select('id,name,current_revision,created_at,updated_at').eq('workspace_id', input.workspaceId).order('updated_at', { ascending: false })
    fail(playlists.error)
    const items = playlists.data || [], versions: any[] = []
    for (let offset = 0; offset < items.length; offset += 25) {
      const chunk = items.slice(offset, offset + 25)
      const filter = chunk.map((item: any) => `and(playlist_id.eq.${item.id},revision.eq.${item.current_revision})`).join(',')
      const result = await service.from('signage_playlist_versions').select('playlist_id,revision,entries,created_at').eq('workspace_id', input.workspaceId).or(filter)
      fail(result.error); versions.push(...(result.data || []))
    }
    const current = new Map(versions.map((version: any) => [`${version.playlist_id}:${version.revision}`, version]))
    const schedules = await service.from('signage_schedules').select('id,device_id,playlist_id,playlist_revision,starts_at,ends_at,priority,enabled,revision,created_at,updated_at').eq('workspace_id', input.workspaceId).order('starts_at', { ascending: false }).limit(500)
    fail(schedules.error)
    return {
      playlists: items.map((item: any) => ({ ...item, entries: current.get(`${item.id}:${item.current_revision}`)?.entries || [] })),
      schedules: schedules.data || [],
    }
  },
  async listExperiences(input: any) {
    const experiences = await service.from('signage_experiences').select('id,kind,name,snapshot,state,created_at,updated_at').eq('workspace_id', input.workspaceId).neq('state','archived').order('updated_at',{ascending:false}).limit(100)
    fail(experiences.error)
    const sessions = await service.from('signage_experience_sessions').select('id,experience_id,state,starts_at,expires_at,ended_at,created_at,current_slide,control_revision,signage_experience_destinations(device_id,accepted_at)').eq('workspace_id', input.workspaceId).order('created_at',{ascending:false}).limit(100)
    fail(sessions.error)
    return { experiences: experiences.data || [], sessions: sessions.data || [], serverTime: new Date().toISOString() }
  },
  async getExperience(input: any) {
    const result = await service.from('signage_experiences').select('id,kind,name,snapshot,state,created_at,updated_at').eq('id', input.experienceId).eq('workspace_id', input.workspaceId).neq('state','archived').maybeSingle()
    fail(result.error); if (!result.data) throw new ApiError(404, 'EXPERIENCE_NOT_FOUND', 'No se encontró la experiencia.')
    const experience: any = result.data
    if (experience.kind !== 'presentation') return { experience }
    const slides = Array.isArray(experience.snapshot?.slides) ? experience.snapshot.slides : []
    const assetIds = slides.map((slide: any) => slide.mediaAssetId).filter(Boolean)
    const assets = assetIds.length ? await service.from('signage_media_assets').select('id,storage_path').eq('workspace_id',input.workspaceId).eq('state','ready').eq('content_type','image/png').in('id',assetIds) : { data: [], error: null }
    fail(assets.error)
    const links = assets.data?.length ? await service.storage.from('signage-media').createSignedUrls(assets.data.map((asset: any) => asset.storage_path), 5 * 60) : { data: [], error: null }
    fail(links.error)
    const byPath = new Map((links.data || []).map((link: any) => [link.path, link.signedUrl]))
    const byId = new Map((assets.data || []).map((asset: any) => [asset.id, byPath.get(asset.storage_path)]))
    return { experience: { ...experience, snapshot: { ...experience.snapshot, slides: slides.map((slide: any) => ({ ...slide, previewUrl: byId.get(slide.mediaAssetId) || null })) } }, previewExpiresAt: new Date(Date.now()+5*60*1000).toISOString() }
  },
  async saveExperience(input: any) {
    const source = input.experience || {}, { client } = await userClient(input.actor.token)
    const result = await client.rpc('signage_experience_save', { p_workspace: input.workspaceId, p_experience: source.id || null, p_name: source.name, p_snapshot: { template: source.template, displayName: source.displayName, subtitle: source.subtitle }, p_expected_updated_at: source.expectedUpdatedAt || null })
    fail(result.error, 'No se pudo guardar la bienvenida.'); return { experience: result.data }
  },
  async savePresentation(input: any) {
    const source = input.presentation || {}, slides = Array.isArray(source.slides) ? source.slides.map((slide: any, index: number) => ({
      mediaAssetId: String(slide.mediaAssetId || ''), alt: String(slide.alt || `Diapositiva ${index + 1}`), width: Number(slide.width), height: Number(slide.height), index,
    })) : []
    const { client } = await userClient(input.actor.token)
    const result = await client.rpc('signage_presentation_save', { p_workspace: input.workspaceId, p_experience: source.id || null, p_name: String(source.name || ''), p_slides: slides, p_expected_updated_at: source.expectedUpdatedAt || null })
    fail(result.error, 'No se pudo guardar la presentación.'); return { experience: result.data }
  },
  async startExperience(input: any) {
    const { client } = await userClient(input.actor.token)
    const result = await client.rpc('signage_experience_start', { p_workspace: input.workspaceId, p_experience: input.experienceId, p_devices: input.deviceIds, p_duration_minutes: input.durationMinutes })
    fail(result.error, 'No se pudo iniciar la bienvenida.'); return result.data
  },
  async finishExperience(input: any) {
    const { client } = await userClient(input.actor.token)
    const result = await client.rpc('signage_experience_finish', { p_workspace: input.workspaceId, p_session: input.sessionId })
    fail(result.error, 'No se pudo finalizar la bienvenida.'); return result.data
  },
  async stepExperience(input: any) {
    const { client } = await userClient(input.actor.token)
    const result = await client.rpc('signage_experience_step', { p_workspace: input.workspaceId, p_session: input.sessionId, p_target_slide: input.targetSlide, p_expected_control_revision: input.expectedControlRevision })
    fail(result.error, 'La presentación cambió. Actualiza la sesión para continuar.'); return result.data
  },
  async saveContent(input: any) {
    const source = input.content || {}, type = String(source.type || 'message')
    const snapshot: any = { type, title: String(source.title || ''), body: String(source.body || ''), theme: String(source.theme || 'neutral') }
    if (type === 'link') snapshot.url = String(source.url || '')
    if (type === 'image' || type === 'video') {
      snapshot.alt = String(source.alt || 'Contenido multimedia')
      if (source.uploadId) snapshot.mediaAssetId = source.uploadId
      else {
        const mediaUrl = String(source.mediaUrl || '')
        if (!isAllowedCuratedMedia(type, mediaUrl)) throw new ApiError(400, 'MEDIA_SOURCE_DENIED', 'La fuente multimedia no está autorizada para este tipo de contenido.')
        snapshot.mediaUrl = mediaUrl
      }
    }
    const { client } = await userClient(input.actor.token)
    const result = await client.rpc('signage_content_save', { p_workspace: input.workspaceId, p_content: source.id || null, p_snapshot: snapshot, p_expected_revision: Number(source.expectedRevision) || 0 })
    fail(result.error, 'No se pudo guardar el contenido.')
    return { content: { id: result.data.id, revision: result.data.revision, ...result.data.snapshot } }
  },
  async approveContent(input: any) {
    let revision = Number(input.expectedRevision)
    if (!Number.isSafeInteger(revision)) {
      const current = await service.from('signage_content_items').select('current_revision').eq('id', input.contentId).eq('workspace_id', input.workspaceId).maybeSingle()
      fail(current.error); if (!current.data) throw new ApiError(404, 'CONTENT_NOT_FOUND', 'No se encontró el contenido.'); revision = current.data.current_revision
    }
    const { client } = await userClient(input.actor.token)
    const result = await client.rpc('signage_content_approve', { p_workspace: input.workspaceId, p_content: input.contentId, p_expected_revision: revision })
    fail(result.error, 'No se pudo aprobar el contenido.'); return { content: result.data }
  },
  async publish(input: any) {
    let revision = Number(input.expectedRevision)
    if (!Number.isSafeInteger(revision)) {
      const current = await service.from('signage_devices').select('revision').eq('id', input.deviceId).eq('workspace_id', input.workspaceId).maybeSingle()
      fail(current.error); if (!current.data) throw new ApiError(404, 'DEVICE_NOT_FOUND', 'No se encontró la pantalla.'); revision = current.data.revision
    }
    const { client } = await userClient(input.actor.token)
    const result = await client.rpc('signage_publish', { p_workspace: input.workspaceId, p_device: input.deviceId, p_content: input.contentId, p_expected_device_revision: revision })
    fail(result.error, 'No se pudo publicar el contenido.'); return { publication: result.data }
  },
  async stopOutput(input: any) {
    let revision = Number(input.expectedRevision)
    if (!Number.isSafeInteger(revision)) {
      const current = await service.from('signage_devices').select('revision').eq('id', input.deviceId).eq('workspace_id', input.workspaceId).maybeSingle()
      fail(current.error); if (!current.data) throw new ApiError(404, 'DEVICE_NOT_FOUND', 'No se encontró la pantalla.'); revision = current.data.revision
    }
    const { client } = await userClient(input.actor.token)
    const result = await client.rpc('signage_stop_output', { p_workspace: input.workspaceId, p_device: input.deviceId, p_expected_device_revision: revision })
    fail(result.error, 'No se pudo detener la pantalla.'); return { state: 'stopped', device: result.data }
  },
  async rollback(input: any) {
    let revision = Number(input.expectedRevision)
    if (!Number.isSafeInteger(revision)) {
      const current = await service.from('signage_devices').select('revision').eq('id', input.deviceId).eq('workspace_id', input.workspaceId).maybeSingle()
      fail(current.error); if (!current.data) throw new ApiError(404, 'DEVICE_NOT_FOUND', 'No se encontró la pantalla.'); revision = current.data.revision
    }
    const { client } = await userClient(input.actor.token)
    const result = await client.rpc('signage_rollback', { p_workspace: input.workspaceId, p_device: input.deviceId, p_target_publication: input.publicationId, p_expected_device_revision: revision })
    fail(result.error, 'No se pudo restaurar la publicación.'); return { publication: result.data }
  },
  async savePlaylist(input: any) {
    const source = input.playlist || {}, entries = Array.isArray(source.entries) ? source.entries.map((item: any) => ({ contentId: item.contentId, contentRevision: Number(item.contentRevision), durationSeconds: Number(item.durationSeconds) })) : []
    const { client } = await userClient(input.actor.token)
    const result = await client.rpc('signage_playlist_save', { p_workspace: input.workspaceId, p_playlist: source.id || null, p_name: String(source.name || ''), p_entries: entries, p_expected_revision: Number(source.expectedRevision) || 0 })
    fail(result.error, 'No se pudo guardar la lista.'); return { playlist: result.data }
  },
  async saveSchedule(input: any) {
    const source = input.schedule || {}
    const playlist = await service.from('signage_playlists').select('current_revision').eq('id', source.playlistId).eq('workspace_id', input.workspaceId).maybeSingle()
    fail(playlist.error); if (!playlist.data) throw new ApiError(404, 'PLAYLIST_NOT_FOUND', 'No se encontró la lista.')
    const { client } = await userClient(input.actor.token)
    const result = await client.rpc('signage_schedule_save', { p_workspace: input.workspaceId, p_schedule: source.id || null, p_device: source.deviceId, p_playlist: source.playlistId, p_starts_at: source.startsAt, p_ends_at: source.endsAt, p_priority: Number(source.priority) || 0, p_expected_revision: Number(source.expectedRevision) || 0 })
    fail(result.error, 'No se pudo guardar el horario.'); return { schedule: result.data }
  },
  async manifest(identity: any) {
    const result = await service.rpc('signage_device_manifest_service', { p_device: identity.deviceId, p_credential: identity.credentialId })
    fail(result.error, 'La pantalla no está autorizada.')
    const signed = new Map<string,string>()
    return normalizeSignageManifest({ raw: result.data, workspaceId: identity.workspaceId, deviceId: identity.deviceId,
      getCurrentRevision: async (contentId: string, workspaceId: string) => { const row=await service.from('signage_content_items').select('current_revision').eq('id',contentId).eq('workspace_id',workspaceId).maybeSingle(); fail(row.error); return row.data?.current_revision },
      getContentVersion: async (contentId: string, revision: number, workspaceId: string) => { const row=await service.from('signage_content_versions').select('snapshot').eq('content_id',contentId).eq('workspace_id',workspaceId).eq('revision',revision).maybeSingle(); fail(row.error); return row.data?.snapshot || null },
      getLiveSession: async (deviceId: string, workspaceId: string) => { const row=await service.from('signage_live_sessions').select('id,started_at,expires_at').eq('device_id',deviceId).eq('workspace_id',workspaceId).eq('state','active').gt('expires_at',new Date().toISOString()).order('started_at',{ascending:false}).limit(1).maybeSingle(); fail(row.error); return row.data },
      signMedia: async (assetId: string, workspaceId: string) => { let url=signed.get(assetId); if(url)return url; const asset=await service.from('signage_media_assets').select('storage_path').eq('id',assetId).eq('workspace_id',workspaceId).eq('state','ready').maybeSingle(); fail(asset.error); if(!asset.data)throw new ApiError(409,'MEDIA_NOT_READY','Un archivo publicado no está disponible.'); const link=await service.storage.from('signage-media').createSignedUrl(asset.data.storage_path,15*60); fail(link.error); url=link.data.signedUrl; signed.set(assetId,url); return url },
    })
  },
  async heartbeat(identity: any, payload: any) {
    const result = await service.from('signage_device_heartbeats').upsert({ device_id: identity.deviceId, workspace_id: identity.workspaceId, credential_id: identity.credentialId, player_version: payload.playerVersion || null, status: payload.status || null, last_manifest_revision: payload.lastManifestRevision, storage_free_bytes: payload.storageFreeBytes, errors: payload.errors, received_at: new Date().toISOString() }, { onConflict: 'device_id' })
    fail(result.error)
    await service.from('signage_device_credentials').update({ last_seen_at: new Date().toISOString() }).eq('id', identity.credentialId)
    return { accepted: true }
  },
  async signUpload(input: any) {
    const assetId = crypto.randomUUID(), safeName = input.name.replace(/[^A-Za-z0-9._-]+/g, '-').slice(-120), storagePath = `${input.workspaceId}/${assetId}/${safeName}`
    const inserted = await service.from('signage_media_assets').insert({ id: assetId, workspace_id: input.workspaceId, storage_path: storagePath, original_name: input.name, content_type: input.type, byte_size: input.size, sha256: input.sha256, state: 'pending', created_by: input.actorId })
    fail(inserted.error)
    const signed = await service.storage.from('signage-media').createSignedUploadUrl(storagePath)
    if (signed.error) { await service.from('signage_media_assets').delete().eq('id', assetId); fail(signed.error) }
    return { assetId, path: storagePath, upload: { url: signed.data.signedUrl, token: signed.data.token }, state: 'pending' }
  },
  async completeUpload(input: any) {
    const asset = await service.from('signage_media_assets').select('*').eq('id', input.assetId).eq('workspace_id', input.workspaceId).maybeSingle()
    fail(asset.error); if (!asset.data || asset.data.state === 'deleted') throw new ApiError(404, 'MEDIA_NOT_FOUND', 'No se encontró el archivo.')
    if (asset.data.state === 'quarantined') throw new ApiError(422, 'MEDIA_QUARANTINED', 'El archivo fue rechazado por la verificación de seguridad.')
    if (asset.data.state === 'pending') {
      const stored = await service.storage.from('signage-media').download(asset.data.storage_path)
      if (stored.error || !stored.data) throw new ApiError(409, 'UPLOAD_INCOMPLETE', 'La transferencia no terminó. Intenta subir el archivo nuevamente.')
      const payload = new Uint8Array(await stored.data.arrayBuffer())
      try {
        if (payload.byteLength !== Number(asset.data.byte_size)) throw new MediaValidationError('MEDIA_SIZE_MISMATCH', 'El tamaño recibido no coincide con el archivo seleccionado.')
        if (await sha256Hex(payload) !== asset.data.sha256) throw new MediaValidationError('MEDIA_HASH_MISMATCH', 'El archivo recibido no coincide con el original.')
        inspectMedia(payload, asset.data.content_type)
      } catch (error) {
        if (!(error instanceof MediaValidationError)) throw error
        await service.from('signage_media_assets').update({ state: 'quarantined' }).eq('id', input.assetId).eq('workspace_id', input.workspaceId).eq('state', 'pending')
        throw new ApiError(422, error.code, error.message)
      }
      const updated = await service.from('signage_media_assets').update({ state: 'ready' }).eq('id', input.assetId).eq('workspace_id', input.workspaceId).eq('state', 'pending').select('id,state').maybeSingle()
      fail(updated.error); if (!updated.data) throw new ApiError(409, 'MEDIA_STATE_CHANGED', 'El archivo cambió mientras se verificaba. Actualiza la biblioteca.')
    }
    const link = await service.storage.from('signage-media').createSignedUrl(asset.data.storage_path, 5 * 60)
    fail(link.error); return { assetId: asset.data.id, state: 'ready', downloadUrl: link.data.signedUrl, expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString() }
  },
  async liveConfigured() { return Boolean(env('SIGNAGE_ICE_CONFIG_URL', false) && env('SIGNAGE_ICE_CONFIG_TOKEN', false)) },
  async liveAvailable() { return true },
  async playerRuntime() {
    if (!(await this.liveConfigured())) return { liveAvailable: true, connectionMode: 'direct', iceServers: [] }
    const result = await fetch(env('SIGNAGE_ICE_CONFIG_URL'), { headers: { Authorization: `Bearer ${env('SIGNAGE_ICE_CONFIG_TOKEN')}` }, signal: AbortSignal.timeout(5000) })
    if (!result.ok) throw new ApiError(503, 'ICE_UNAVAILABLE', 'No se pudo preparar la transmisión en vivo.')
    const body = await result.json(); return { liveAvailable: true, connectionMode: 'relay', iceServers: Array.isArray(body.iceServers) ? body.iceServers : [] }
  },
  async adminRuntime() { return this.playerRuntime() },
  async startLive(input: any) {
    const device = await service.from('signage_devices').select('id').eq('id', input.deviceId).eq('workspace_id', input.workspaceId).eq('state', 'active').maybeSingle()
    fail(device.error); if (!device.data) throw new ApiError(404, 'DEVICE_NOT_FOUND', 'No se encontró la pantalla activa.')
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
    const result = await service.from('signage_live_sessions').insert({ workspace_id: input.workspaceId, device_id: input.deviceId, started_by: input.actorId, expires_at: expiresAt }).select('*').single()
    fail(result.error); return { session: result.data }
  },
  async stopLive(input: any) {
    const result = await service.from('signage_live_sessions').update({ state: 'stopped', stopped_at: new Date().toISOString() }).eq('id', input.sessionId).eq('workspace_id', input.workspaceId).eq('state', 'active').select('id').maybeSingle()
    fail(result.error); if (!result.data) throw new ApiError(404, 'LIVE_SESSION_NOT_FOUND', 'La transmisión ya no está activa.')
    return { state: 'stopped' }
  },
  async sendSignal(input: any) {
    if (!['offer', 'answer', 'candidate', 'media'].includes(input.signal?.type) || !input.signal?.payload || JSON.stringify(input.signal.payload).length > 65536) throw new ApiError(400, 'INVALID_SIGNAL', 'La señal WebRTC no es válida.')
    let session = service.from('signage_live_sessions').select('id,workspace_id,device_id,state,expires_at').eq('id', input.sessionId)
    if (input.identity) session = session.eq('device_id', input.identity.deviceId).eq('workspace_id', input.identity.workspaceId)
    else session = session.eq('workspace_id', input.workspaceId)
    const found = await session.maybeSingle(); fail(found.error)
    if (!found.data || found.data.state !== 'active' || new Date(found.data.expires_at) <= new Date()) throw new ApiError(404, 'LIVE_SESSION_NOT_FOUND', 'La transmisión ya no está activa.')
    const result = await service.from('signage_live_signals').insert({ session_id: input.sessionId, sender: input.sender, kind: input.signal.type, payload: input.signal.payload }).select('id').single()
    fail(result.error); return { sequence: result.data.id }
  },
  async receiveSignals(input: any) {
    let session = service.from('signage_live_sessions').select('id,workspace_id,device_id,state,expires_at').eq('id', input.sessionId)
    if (input.identity) session = session.eq('device_id', input.identity.deviceId).eq('workspace_id', input.identity.workspaceId)
    else session = session.eq('workspace_id', input.workspaceId)
    const found = await session.maybeSingle(); fail(found.error)
    if (!found.data) throw new ApiError(404, 'LIVE_SESSION_NOT_FOUND', 'No se encontró la transmisión.')
    if (found.data.state !== 'active' || new Date(found.data.expires_at) <= new Date()) return { state: 'stopped', signals: [] }
    const opposite = input.sender === 'admin' ? 'device' : 'admin'
    const signals = await service.from('signage_live_signals').select('id,kind,payload').eq('session_id', input.sessionId).eq('sender', opposite).gt('id', input.after).order('id').limit(100)
    fail(signals.error); return { state: 'active', signals: (signals.data || []).map((item: any) => ({ sequence: item.id, type: item.kind, payload: item.payload })) }
  },
}

const handler = createSignageHandler(adapter, { prefix: '/signage-api', corsOrigins: parseCors() })
Deno.serve(handler)
