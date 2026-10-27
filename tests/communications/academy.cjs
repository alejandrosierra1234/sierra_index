const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { JSDOM } = require('jsdom')

const root = path.join(__dirname, '../..')
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8')
const source = fs.readFileSync(path.join(root, 'js/academy.js'), 'utf8')
const css = fs.readFileSync(path.join(root, 'css/academy.css'), 'utf8')
const migration = fs.readFileSync(path.join(root, 'update58.sql'), 'utf8')

new vm.Script(source, { filename: 'academy.js' })
assert.match(html, /'academy'/)
assert.match(html, /academia:\s*\{[\s\S]*?run:\s*'showAcademy'/)
assert.match(html, /css\/academy\.css/)
assert.match(html, /js\/academy\.js/)

const dom = new JSDOM('<!doctype html><body><main id="pg"></main></body>', {
  url: 'https://index.test/',
  runScripts: 'outside-only',
})
const w = dom.window
w.esc = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])
w.escAttr = w.esc
w.siIcon = (name, size) => `<svg data-icon="${name}" width="${size}"></svg>`
w.LBL_LOGO_SVG = '<svg data-logo="sierra"></svg>'
w.policyDurableAssetUrl = value => String(value || '')
w.companyColor = value => /^#[0-9a-f]{6}$/i.test(value || '') ? value : '#16CDBE'
w.can = () => true
w.eval(source)

const diploma = w.academyDefault()
diploma.companyId = 'company-1'
diploma.companyName = 'SIERRA'
diploma.recipientName = 'Luisa Alburez'
diploma.courseTitle = 'Liderazgo intencional'
diploma.companyLogo = 'https://assets.test/logo.svg'
diploma.signers.push({ uid: 'signer-2', name: 'Pablo Hernández', title: 'Vicepresidente', signature: '' })

const front = w.academyFrontHtml(diploma)
const back = w.academyBackHtml(diploma)
assert.match(front, /data-academy-face="front"/)
assert.match(front, /Luisa Alburez/)
assert.match(front, /Liderazgo intencional/)
assert.match(front, /https:\/\/assets\.test\/logo\.svg/)
assert.match(front, /academy-logo-fallback/)
assert.match(front, /academy-identity-rail is-pattern/)
assert.equal((front.match(/class="academy-signature"/g) || []).length, 2)
assert.match(back, /data-academy-face="back"/)
assert.match(back, /Contenido del curso/)
assert.match(back, /academy-identity-rail is-pattern/)
assert.equal((back.match(/class="academy-curriculum-row"/g) || []).length, 3)
assert.equal(w.academyTotalHours(diploma), 8)

assert.match(source, /const ACADEMY_RENDER_SCALE=3\.125/)
assert.match(source, /const ACADEMY_MAX_SIGNERS=4/)
assert.match(source, /const ACADEMY_MAX_MODULES=14/)
assert.match(source, /new window\.jspdf\.jsPDF\(\{orientation:'landscape',unit:'mm',format:'letter'/)
assert.match(source, /pdf\.addPage\('letter','landscape'\)/)
assert.match(source, /academyCompanyOptions/)
assert.match(source, /data-academy-tab="design"/)
assert.match(source, /academyDecorImage/)
assert.match(source, /ACADEMY_DECOR_ICONS/)
assert.match(css, /width:279\.4mm;height:215\.9mm/)
assert.match(css, /\.academy-preview-shell\{[^}]*min-height:0;overflow:hidden/)
assert.match(css, /\.academy-preview-stage\{[^}]*overflow:auto[^}]*scrollbar-gutter:stable/)
assert.match(css, /\.academy-identity-rail\{[^}]*right:0[^}]*width:152px/)
assert.match(css, /@media\(max-width:900px\)/)
assert.match(css, /@media\(max-width:375px\)/)

assert.match(migration, /'academy'/)
assert.match(migration, /create table if not exists public\.academy_diplomas/)
assert.match(migration, /academy_diploma_list/)
assert.match(migration, /academy_diploma_save/)
assert.match(migration, /jsonb_array_length\(coalesce\(p_snapshot->'signers'/)

console.log('PASS: Academia creates durable two-sided landscape Letter diplomas')
