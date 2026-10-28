const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { JSDOM } = require('jsdom')

const root = path.join(__dirname, '../..')
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8')
const source = fs.readFileSync(path.join(root, 'js/academy.js'), 'utf8')
const css = fs.readFileSync(path.join(root, 'css/academy.css'), 'utf8')
const signatureFont = path.join(root, 'assets/fonts/TT-Milks-Script-Trial-Regular.otf')
const migration = fs.readFileSync(path.join(root, 'update58.sql'), 'utf8')
const collaborationMigration = fs.readFileSync(path.join(root, 'update61.sql'), 'utf8')

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
diploma.companyName = 'Pride Chemicals'
diploma.companyLegalName = 'Pride Chemicals, S.A.'
diploma.companyColor = '#FF6B35'
diploma.recipientName = 'Luisa Alburez'
diploma.recipients = [
  { uid: 'recipient-1', name: 'Luisa Alburez' },
  { uid: 'recipient-2', name: 'Ana López' },
  { uid: 'recipient-3', name: 'Carlos Méndez' },
]
diploma.courseTitle = 'Liderazgo intencional'
diploma.certificateTitle = 'Certificado de participación'
diploma.laborRegistration = '90028481'
diploma.companyLogo = 'https://assets.test/logo.svg'
diploma.signers.push({ uid: 'signer-2', name: 'Pablo Hernández', title: 'Vicepresidente', signature: '' })

const front = w.academyFrontHtml(diploma)
const back = w.academyBackHtml(diploma)
assert.match(front, /data-academy-face="front"/)
assert.match(front, /Luisa Alburez/)
assert.match(front, /Liderazgo intencional/)
assert.match(front, /Certificado de participación/)
assert.doesNotMatch(front, />Diploma</)
assert.match(front, /https:\/\/assets\.test\/logo\.svg/)
assert.match(front, /academy-document-id"><span>Pride Chemicals<\/span>/)
assert.match(front, /Documento emitido por<\/small><b>Pride Chemicals<\/b>/)
assert.match(front, /academy-registration-seal/)
assert.match(front, /Registro MINTRAB/)
assert.match(front, /90028481/)
assert.match(front, /data-icon="calendar"/)
assert.match(front, /data-icon="clock"/)
assert.match(front, /data-icon="building"/)
assert.doesNotMatch(front, /Academia/i)
assert.doesNotMatch(front, /academy-logo-fallback/)
assert.equal((front.match(/<img src="https:\/\/assets\.test\/logo\.svg"/g) || []).length, 1)
assert.match(front, /academy-identity-rail is-accent/)
assert.equal((front.match(/class="academy-pattern-tile/g) || []).length, 0)
assert.equal((front.match(/class="academy-signature"/g) || []).length, 2)
assert.equal((front.match(/class="academy-signature-script"/g) || []).length, 2)
assert.match(back, /data-academy-face="back"/)
assert.match(back, /Contenido del curso/)
assert.match(back, /Pride Chemicals · Registro de formación/)
assert.match(back, /data-icon="user"/)
assert.match(back, /data-icon="book"/)
assert.match(back, /data-icon="clock"/)
assert.doesNotMatch(back, /Academia/i)
assert.match(back, /academy-identity-rail is-accent/)
assert.equal((back.match(/class="academy-curriculum-row"/g) || []).length, 3)
assert.equal(w.academyTotalHours(diploma), 8)
assert.equal(JSON.stringify(w.academyPalette(diploma)), JSON.stringify({ light: '#FFDED3', base: '#FF6B35', dark: '#AC4A27' }))

const patterned = w.academyNormalize({ ...diploma, decorMode: 'image', decorImage: '', decorImages: ['one.jpg', 'two.jpg', 'three.jpg'], decorPatternColumns: 3 })
const patternFront = w.academyFrontHtml(patterned)
assert.match(patternFront, /academy-identity-rail is-image-pattern/)
assert.match(patternFront, /--academy-pattern-cols:3/)
assert.equal((patternFront.match(/class="academy-pattern-tile"/g) || []).length, 33)
assert.equal((patternFront.match(/src="one\.jpg"/g) || []).length, 11)
assert.equal((patternFront.match(/src="two\.jpg"/g) || []).length, 11)
assert.equal((patternFront.match(/src="three\.jpg"/g) || []).length, 11)
const legacyPattern = w.academyNormalize({ ...diploma, decorMode: 'image', decorImage: 'legacy.jpg', decorImages: undefined })
assert.equal(JSON.stringify(w.academyDecorImages(legacyPattern)), JSON.stringify(['legacy.jpg']))
assert.equal(legacyPattern.decorPatternColumns, 2)

const storageSetItem = w.Storage.prototype.setItem
const consoleWarn = w.console.warn
w.console.warn = () => {}
w.Storage.prototype.setItem = function(){ throw new w.DOMException('Quota exceeded', 'QuotaExceededError') }
assert.equal(w.academyWriteLocal(), false)
w.Storage.prototype.setItem = storageSetItem
w.console.warn = consoleWarn

w._policyCompanies = [{
  id: 'company-1', name: 'Pride Denim Mills', legal_name: 'Pride Denim Mills, S.A.',
  logo_url: 'https://assets.test/pdm.svg', brand_color: '#FF6B35',
}]
const legacy = w.academyNormalize({ ...diploma, companyName: 'SIERRA', companyLogo: '', companyColor: '#16CDBE', location: 'SIERRA Academia' })
w.academyApplyCompanyIdentity(legacy)
assert.equal(legacy.companyName, 'Pride Denim Mills')
assert.equal(legacy.companyLogo, 'https://assets.test/pdm.svg')
assert.equal(legacy.companyColor, '#FF6B35')
assert.equal(legacy.location, 'Pride Denim Mills')

const batch = w.academyRecipientDocuments(diploma)
assert.equal(batch.length, 3)
assert.equal(batch[0].recipientName, 'Luisa Alburez')
assert.equal(batch[1].recipientName, 'Ana López')
assert.equal(batch[0].certificateNo, `${diploma.certificateNo}-01`)
assert.equal(batch[2].certificateNo, `${diploma.certificateNo}-03`)
assert.equal(diploma.certificateNo.endsWith('-01'), false)

assert.match(source, /const ACADEMY_RENDER_SCALE=3\.125/)
assert.match(source, /const ACADEMY_MAX_SIGNERS=4/)
assert.match(source, /const ACADEMY_MAX_MODULES=14/)
assert.match(source, /const ACADEMY_MAX_RECIPIENTS=100/)
assert.match(source, /const ACADEMY_MAX_DECOR_IMAGES=4/)
assert.match(source, /new window\.jspdf\.jsPDF\(\{orientation:'landscape',unit:'mm',format:'letter'/)
assert.match(source, /pdf\.addPage\('letter','landscape'\)/)
assert.match(source, /academyCompanyOptions/)
assert.match(source, /data-academy-tab="design"/)
assert.match(source, /data-academy-tab="participants"/)
assert.match(source, /academySetRecipients/)
assert.match(source, /Certificados-Lote-/)
assert.match(source, /certificateTitle/)
assert.match(source, /Tipo o título del certificado/)
assert.match(source, /Registro Ministerio de Trabajo/)
assert.match(source, /academyPrintPdf/)
assert.match(source, /academyDecorImagesUpload/)
assert.match(source, /academySetPatternColumns/)
assert.match(source, /academyMigrateEmbeddedAssets/)
assert.match(source, /storage\.from\('product-images'\)\.upload/)
assert.match(source, /Cambios sin guardar · almacenamiento lleno/)
assert.match(source, /commsAssetStore/)
assert.match(source, /ACADEMY_DECOR_ICONS/)
assert.match(source, /academyPrepareExportDocument/)
assert.match(source, /academyRasterExportAsset/)
assert.match(source, /targetWidth:1000,targetHeight:1000/)
assert.match(source, /academyPdfBlob,academyPrepareExportDocument/)
assert.match(css, /width:279\.4mm;height:215\.9mm/)
assert.match(css, /\.academy-preview-shell\{[^}]*min-height:0;overflow:hidden/)
assert.match(css, /\.academy-preview-stage\{[^}]*overflow:auto[^}]*scrollbar-gutter:stable/)
assert.match(css, /\.academy-studio,\.academy-studio \*\{box-sizing:border-box\}/)
assert.match(css, /\.academy-customizer>\*\{width:100%;min-width:0;max-width:100%\}/)
assert.match(css, /\.academy-recipient-list\{[^}]*overflow:auto/)
assert.match(css, /--academy-column:88px;--academy-content:792px;--academy-rail:264px/)
assert.match(css, /\.academy-sheet::before\{[^}]*right:288px[^}]*left:24px[^}]*border:1px solid #e5e5e5/)
assert.match(css, /\.academy-identity-rail\{[^}]*right:0[^}]*width:var\(--academy-rail\)/)
assert.match(css, /\.academy-identity-rail\.is-image-pattern\{[^}]*grid-template-columns:repeat\(var\(--academy-pattern-cols\)/)
assert.match(css, /\.academy-pattern-tile img\{[^}]*width:100%[^}]*height:100%[^}]*object-fit:cover/)
assert.match(css, /\.academy-document-logo img\{[^}]*width:auto[^}]*height:auto[^}]*max-width:230px[^}]*max-height:64px/)
assert.doesNotMatch(css, /\.academy-front-main::before/)
assert.doesNotMatch(css, /\.academy-pattern-tile\{[^}]*border-radius/)
assert.match(css, /\.academy-document-head\{[^}]*grid-template-columns:repeat\(9/)
assert.match(css, /\.academy-front-main\{[^}]*grid-template-columns:repeat\(9/)
assert.match(css, /\.academy-front-footer\{[^}]*grid-template-columns:repeat\(9/)
assert.match(css, /\.academy-back-head\{[^}]*grid-template-columns:repeat\(9/)
assert.match(css, /\.academy-front-main\{[^}]*text-align:left/)
assert.match(css, /\.academy-document-logo\{[^}]*justify-content:flex-start[^}]*grid-column:1\/4/)
assert.doesNotMatch(css, /\.academy-identity-rail\.is-image::after/)
assert.doesNotMatch(css, /\.academy-curriculum-row:nth-child/)
assert.match(css, /@font-face\{font-family:"TT Milks Script"/)
assert.match(css, /\.academy-front-main h2\{[^}]*font:400 68px\/\.96 "TT Milks Script"/)
assert.match(css, /\.academy-front-main h1\{[^}]*font:500 30px\/1\.05 "Replica"/)
assert.match(css, /\.academy-registration-seal\{/)
assert.match(css, /\.academy-facts i\{[^}]*color:var\(--academy-dark\)/)
assert.match(css, /\.academy-course-summary i\{[^}]*color:var\(--academy-dark\)/)
assert.match(css, /\.academy-signature-script\{[^}]*font:400 30px\/\.95 "TT Milks Script"/)
assert.equal(fs.existsSync(signatureFont), true)
assert.match(css, /\.academy-brand-palette\{/)
assert.match(css, /font-family:"Aeonik","DM Sans"/)
assert.doesNotMatch(css, /\.academy-sheet\{[^}]*font-family:[^}]*Arial/)
assert.match(css, /@media\(max-width:900px\)/)
assert.match(css, /@media\(max-width:375px\)/)

assert.match(migration, /'academy'/)
assert.match(migration, /create table if not exists public\.academy_diplomas/)
assert.match(migration, /academy_diploma_list/)
assert.match(migration, /academy_diploma_save/)
assert.match(migration, /jsonb_array_length\(coalesce\(p_snapshot->'signers'/)
assert.match(collaborationMigration, /create table if not exists public\.academy_presence/)
assert.match(collaborationMigration, /academy_presence_sync/)
assert.match(collaborationMigration, /authorize\('academy','read'\)/)
assert.match(collaborationMigration, /authorize\('academy','write'\)/)
assert.match(collaborationMigration, /seen_at<now\(\)-interval '25 seconds'/)
assert.match(source, /academyStartPresence/)
assert.match(source, /academyStopPresence/)
assert.match(source, /academy_presence_sync/)
assert.match(source, /8\)000|8000/)
assert.match(css, /\.academy-presence\{/)

console.log('PASS: Certificates create durable two-sided landscape Letter documents')
