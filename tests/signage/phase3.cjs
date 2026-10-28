const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const Signage = require('../../js/signage-phase1.js')

const admin = { canManage: true, actor: 'Operador sintético' }
const start = new Date('2030-04-05T10:00:00.000Z')
let assertions = 0
function eq(actual, expected, message) { assert.equal(actual, expected, message); assertions += 1 }
function ok(value, message) { assert.ok(value, message); assertions += 1 }

let state = Signage.initialState()
eq(state.schemaVersion, 3, 'phase 3 schema')
eq(state.mode, 'local-synthetic-phase3', 'phase 3 mode')

let invalidMedia = Signage.validateContent({ type: 'image', title: 'Imagen prueba', mediaUrl: 'http://example.invalid/picture.png', alt: '' })
eq(invalidMedia.ok, false, 'insecure image URL rejected')
ok(invalidMedia.errors.mediaUrl, 'image requires HTTPS')
ok(invalidMedia.errors.alt, 'image requires accessible description')
invalidMedia = Signage.validateContent({ type: 'video', title: 'Video prueba', mediaUrl: 'https://example.invalid/movie.mov', alt: 'Video sintético' })
eq(invalidMedia.ok, false, 'unsupported video extension rejected')

let image = Signage.createContent(state, { type: 'image', title: 'Imagen sintética', body: 'Referencia remota controlada.', mediaUrl: 'https://example.invalid/synthetic.png', alt: 'Gradiente sintético azul', theme: 'blue' }, admin, { now: start })
state = image.state
eq(image.content.type, 'image', 'image content created')
state = Signage.publishContent(state, 'synthetic-screen-a', image.content.id, admin, { now: start }).state
eq(Signage.resolvePlayback(state, 'synthetic-screen-a', { now: start }).content.id, image.content.id, 'manual publication is attempted before older last valid content')
let video = Signage.createContent(state, { type: 'video', title: 'Video sintético', body: '', mediaUrl: 'https://example.invalid/synthetic.webm', alt: 'Animación sintética', theme: 'neutral' }, admin, { now: start })
state = video.state
eq(video.content.type, 'video', 'video content created')

assert.throws(() => Signage.createPlaylist(state, { name: 'Lista inválida', entries: [{ contentId: image.content.id, durationSeconds: 2 }] }, admin), error => error.code === 'SIGNAGE_VALIDATION' && Boolean(error.fields.entries))
assertions += 1
assert.throws(() => Signage.createPlaylist(state, { name: 'Lista inválida', entries: [{ contentId: image.content.id, durationSeconds: 'no-numérico' }] }, admin), error => error.code === 'SIGNAGE_VALIDATION' && Boolean(error.fields.entries))
assertions += 1
let playlist = Signage.createPlaylist(state, { name: 'Rotación sintética', entries: [{ contentId: image.content.id, durationSeconds: 15 }, { contentId: video.content.id, durationSeconds: 20 }] }, admin, { now: start })
state = playlist.state
eq(playlist.playlist.entries.length, 2, 'playlist preserves ordered entries')
assert.throws(() => Signage.createSchedule(state, { screenId: 'synthetic-screen-a', playlistId: playlist.playlist.id, startsAt: start, endsAt: new Date(start.getTime()+1000), priority: 'no-numérico' }, admin), error => error.code === 'SIGNAGE_VALIDATION' && Boolean(error.fields.priority))
assertions += 1

let low = Signage.createSchedule(state, { screenId: 'synthetic-screen-a', playlistId: playlist.playlist.id, startsAt: start, endsAt: new Date(start.getTime() + 3600000), priority: 2 }, admin, { now: start })
state = low.state
const secondPlaylist = Signage.createPlaylist(state, { name: 'Rotación prioritaria', entries: [{ contentId: video.content.id, durationSeconds: 10 }, { contentId: image.content.id, durationSeconds: 10 }] }, admin, { now: start })
state = secondPlaylist.state
let high = Signage.createSchedule(state, { screenId: 'synthetic-screen-a', playlistId: secondPlaylist.playlist.id, startsAt: new Date(start.getTime() + 60000), endsAt: new Date(start.getTime() + 3600000), priority: 8 }, admin, { now: start })
state = high.state

let resolved = Signage.resolvePlayback(state, 'synthetic-screen-a', { now: new Date(start.getTime() + 61000) })
eq(resolved.source, 'schedule', 'active schedule selected')
eq(resolved.playlist.id, secondPlaylist.playlist.id, 'highest priority wins conflict')
eq(resolved.conflictCount, 1, 'displaced conflict counted')
eq(resolved.content.id, video.content.id, 'first playlist entry selected')
resolved = Signage.resolvePlayback(state, 'synthetic-screen-a', { now: new Date(start.getTime() + 71000) })
eq(resolved.content.id, image.content.id, 'rotation advances by elapsed duration')

state = Signage.markPlaybackSuccess(state, 'synthetic-screen-a', 'synthetic-content-welcome', { now: start })
resolved = Signage.resolvePlayback(state, 'synthetic-screen-a', { now: new Date(start.getTime() + 61000), excludeContentIds: [video.content.id] })
eq(resolved.source, 'last-valid', 'failed scheduled media falls back to last valid')
eq(resolved.content.id, 'synthetic-content-welcome', 'last valid text recovered')
eq(resolved.fallback, true, 'fallback is explicit')

const migrated = Signage.normalizeState({ ...Signage.initialState(), schemaVersion: 1, mode: 'local-synthetic-phase1', playlists: undefined, schedules: undefined })
eq(migrated.schemaVersion, 3, 'phase 1 state migrates')
ok(Array.isArray(migrated.playlists) && Array.isArray(migrated.schedules), 'migration supplies phase 3 collections')

const memory = new Map()
const storage = { getItem: key => memory.has(key) ? memory.get(key) : null, setItem: (key,value) => memory.set(key,value), removeItem: key => memory.delete(key) }
const repo = Signage.createRepository(storage)
repo.save(state)
const changed = Signage.createPlaylist(state, { name: 'Copia posterior', entries: [{ contentId: image.content.id, durationSeconds: 30 }] }, admin).state
repo.save(changed)
storage.setItem(Signage.STORAGE_KEY, '{damaged')
const recovered = repo.load()
eq(recovered.recoveredFromBackup, true, 'corrupt primary recovers backup')
eq(recovered.state.playlists.length, state.playlists.length, 'backup is last complete prior state')

const root = path.resolve(__dirname, '../..')
const source = fs.readFileSync(path.join(root, 'js/signage-phase1.js'), 'utf8')
const css = fs.readFileSync(path.join(root, 'css/signage-phase1.css'), 'utf8')
assert.doesNotMatch(source, /<select\b/i, 'no native visible dropdown introduced')
assertions += 1
ok(source.includes('signageOpenScheduleDrawer'), 'schedule UI integrated')
ok(source.includes('signagePlayerMediaFailed'), 'media failure recovery integrated')
ok(css.includes('.sg-player-media'), 'media player styles exist')

console.log(`signage phase3: ${assertions} assertions passed`)
