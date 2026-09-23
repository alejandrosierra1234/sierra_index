const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')

const html = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf8')
const start = html.indexOf('function policyHeaderHtml(')
const end = html.indexOf('function policyPageHtml(', start)
assert(start >= 0 && end > start)
const context = vm.createContext({
  esc: value => String(value ?? ''),
  escAttr: value => String(value ?? ''),
  policyDateLabel: () => '22 sept 2026',
  policySanitize: value => value,
  policyOrgHtml: () => '',
})
vm.runInContext(html.slice(start, end), context)

const policy = {
  title: 'Política de seguridad', code: 'POL-2026-001', version: '1.0',
  processName: 'Mantenimiento', department: 'Operaciones',
  companyName: 'Hilos y Algodón', siteName: 'Planta Norte',
  companyLogo: '', confidential: true, date: '2026-09-22',
  sections: [{ title: 'Objetivo', html: '<p>Contenido</p>' }],
  responsibles: [], org: [], signers: [], changeControl: '',
}
const header = context.policyHeaderHtml(policy, 1, 3)
const initial = header.split('<div class="policy-header-compact">')[0]
const compact = header.split('<div class="policy-header-compact">')[1]
assert.match(initial, /Código.*POL-2026-001.*Rev\. 1\.0.*CONFIDENCIAL/s)
assert.doesNotMatch(initial, /Página|>Proceso</)
assert.match(compact, /Política.*Política de seguridad/s)
assert.doesNotMatch(compact, /Página/)
assert.match(context.policyFooterHtml(policy, 2, 3), /Área de implementación · Operaciones.*Página 2 de 3/s)
const content = context.policyContentHtml(policy)
assert.match(content, /<table class="policy-index-table">/)
assert.match(content, /<thead><tr><th scope="col">No\.<\/th><th scope="col">Sección<\/th><th scope="col">Página<\/th>/)
assert.match(content, /<tbody class="policy-index-list"><tr class="policy-index-row">/)
assert.match(content, /data-policy-index-page="2"/)
assert.match(html, /const table=originalContainer\.closest\('table'\)/)
assert.match(html, /\.policy-heading-number\{[^}]*font:700 11\.5pt\/1\.2 "Aeonik",Arial,sans-serif/)
assert.match(html, /\.policy-page\.is-continuation \.policy-header-compact\{[^}]*grid-template-columns:30mm minmax\(0,1fr\)/)
assert.match(html, /\.policy-page\.is-continuation \.policy-record-logo img\{width:28mm;height:12mm;max-height:12mm\}/)
console.log('PASS: policy index table, compact header and implementation-area footer')
