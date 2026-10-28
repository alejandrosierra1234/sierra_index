const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const Signage = require('../../js/signage-phase1.js')

const fixedNow = new Date('2030-01-02T03:04:05.000Z')
const admin = { canManage: true, actor: 'Persona sintética' }

const empty = Signage.initialState()
assert.equal(empty.screens.length, 0)
assert.equal(empty.contents.length, 0)
const initial = Signage.demoState()
assert.equal(initial.mode, 'local-synthetic-phase3')
assert.equal(initial.screens.length, 2)
assert.equal(initial.contents.length, 2)
assert.ok(initial.screens.every(item => item.evidence === 'Sin telemetría'))

const legacyMemory = new Map([[Signage.STORAGE_KEY, JSON.stringify({ ...initial, testFixtures: undefined })]])
const legacyRepo = Signage.createRepository({ getItem:key=>legacyMemory.get(key)||null, setItem:(key,value)=>legacyMemory.set(key,value), removeItem:key=>legacyMemory.delete(key) })
assert.equal(legacyRepo.load().state.screens.length, 0, 'untouched legacy demo screens are removed from the normal experience')
assert.equal(legacyRepo.load().state.contents.length, 0, 'untouched legacy demo content is removed from the normal experience')

const invalid = Signage.validateContent({ title: 'x', body: '', theme: 'unknown' })
assert.equal(invalid.ok, false)
assert.ok(invalid.errors.title)
assert.ok(invalid.errors.body)
assert.equal(invalid.value.theme, 'neutral')

assert.throws(
  () => Signage.createContent(initial, { title: 'Mensaje válido', body: 'Texto válido.' }, { canManage: false }),
  error => error.code === 'SIGNAGE_FORBIDDEN'
)

const created = Signage.createContent(initial, {
  title: '  Mensaje   de prueba  ',
  body: 'Contenido   sintético controlado.',
  theme: 'blue',
}, admin, { now: fixedNow })
assert.equal(created.content.title, 'Mensaje de prueba')
assert.equal(created.content.createdAt, fixedNow.toISOString())
assert.equal(initial.contents.length, 2, 'las operaciones no deben mutar el estado de entrada')
assert.equal(created.state.contents.length, 3)
assert.equal(created.state.audit[0].type, 'content.created')

const published = Signage.publishContent(created.state, 'synthetic-screen-b', created.content.id, admin, { now: fixedNow })
assert.equal(published.screen.publishedContentId, created.content.id)
assert.equal(published.screen.publicationVersion, 1)
assert.equal(published.state.audit[0].type, 'screen.published')
assert.equal(Signage.contentForScreen(published.state, 'synthetic-screen-b').content.id, created.content.id)

const second = Signage.publishContent(published.state, 'synthetic-screen-b', 'synthetic-content-welcome', admin, { now: fixedNow })
assert.equal(second.screen.publicationVersion, 2)
const rolledBack = Signage.rollbackScreen(second.state, 'synthetic-screen-b', admin, { now: fixedNow })
assert.equal(rolledBack.screen.publishedContentId, created.content.id)
assert.equal(rolledBack.screen.publicationVersion, 3)
assert.equal(rolledBack.state.audit[0].type, 'screen.rolled_back')

const memory = new Map()
const storage = {
  getItem: key => memory.has(key) ? memory.get(key) : null,
  setItem: (key, value) => memory.set(key, value),
  removeItem: key => memory.delete(key),
}
const repo = Signage.createRepository(storage)
repo.save(rolledBack.state)
assert.equal(repo.load().state.screens[1].publicationVersion, 3)
storage.setItem(Signage.STORAGE_KEY, '{broken')
const recovered = repo.load()
assert.equal(recovered.recovered, true)
assert.equal(recovered.state.mode, 'local-synthetic-phase3')

const root = path.resolve(__dirname, '../..')
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8')
const css = fs.readFileSync(path.join(root, 'css/signage-phase1.css'), 'utf8')
const source = fs.readFileSync(path.join(root, 'js/signage-phase1.js'), 'utf8')
assert.match(index, /label: 'Pantallas'/)
assert.match(index, /showSignage/)
assert.match(index, /css\/signage-phase1\.css/)
assert.match(index, /js\/signage-phase1\.js/)
assert.doesNotMatch(source, /<select\b/i, 'la fase no debe introducir selectores nativos visibles')
assert.match(css, /@media\(max-width:620px\)/)
assert.match(css, /prefers-reduced-motion/)

console.log('signage phase1: 24 assertions passed')
