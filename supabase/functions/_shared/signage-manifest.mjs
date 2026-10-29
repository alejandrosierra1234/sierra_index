export async function normalizeSignageManifest({ raw, workspaceId, deviceId, getContentVersion, getCurrentRevision, getLiveSession, signMedia, now = Date.now() }) {
  const schedules = Array.isArray(raw?.schedules) ? raw.schedules : []
  const active = schedules.filter(item => Date.parse(item.starts_at) <= now && now < Date.parse(item.ends_at))
    .sort((a,b) => Number(b.priority)-Number(a.priority) || Date.parse(b.starts_at)-Date.parse(a.starts_at) || String(a.id).localeCompare(String(b.id)))[0]
  let content = raw?.snapshot ? { id: raw.content_id, revision: raw.content_revision, ...structuredClone(raw.snapshot) } : null
  if (active?.entries?.length) {
    const total = active.entries.reduce((sum,item) => sum + Number(item.durationSeconds || 0), 0)
    if (total > 0) {
      let elapsed = Math.max(0, Math.floor((now-Date.parse(active.starts_at))/1000)) % total
      const entry = active.entries.find(item => { elapsed -= Number(item.durationSeconds || 0); return elapsed < 0 }) || active.entries[0]
      let revision = Number(entry.contentRevision)
      if (!Number.isSafeInteger(revision) || revision < 1) revision = Number(await getCurrentRevision(entry.contentId, workspaceId))
      const snapshot = await getContentVersion(entry.contentId, revision, workspaceId)
      if (!snapshot) { const error = new Error('Una pieza programada ya no está disponible.'); error.status=409; error.code='SCHEDULE_CONTENT_MISSING'; throw error }
      content = { id: entry.contentId, revision, ...structuredClone(snapshot) }
    }
  }
  async function hydrate(value) {
    if (!value || typeof value !== 'object') return
    if (typeof value.mediaAssetId === 'string') value.mediaUrl = await signMedia(value.mediaAssetId, workspaceId)
    for (const child of Array.isArray(value) ? value : Object.values(value)) await hydrate(child)
  }
  await hydrate(content)
  const liveSession = await getLiveSession(deviceId, workspaceId)
  return {
    schemaVersion: 1, deviceId, revision: raw?.device_revision || 0,
    state: liveSession ? 'live' : content ? 'ready' : 'no-content', content,
    schedule: active ? { id: active.id, startsAt: active.starts_at, endsAt: active.ends_at, priority: active.priority } : null,
    playlist: active ? { id: active.playlist_id, revision: active.playlist_revision } : null,
    liveSession: liveSession ? { id: liveSession.id, startedAt: liveSession.started_at, expiresAt: liveSession.expires_at } : null,
    generatedAt: new Date(now).toISOString(),
  }
}
