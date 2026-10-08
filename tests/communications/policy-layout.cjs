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
  policyResponsibilityHtml: person => person.roleHtml || person.role || '',
  policyOrgHtml: () => '',
})
vm.runInContext(html.slice(start, end), context)

const policy = {
  title: 'Política de seguridad', code: 'POL-2026-001', version: '1.0',
  processName: 'Mantenimiento', department: 'Operaciones',
  companyName: 'Hilos y Algodón', siteName: 'Planta Norte',
  companyLogo: '', confidential: true, date: '2026-09-22', reviewDate: '2027-09-22',
  sections: [{ title: 'Objetivo', html: '<p>Contenido</p>' }],
  responsibles: [{ name: 'Administración', roleHtml: '<ul><li>Verificar</li><li>Reportar</li></ul>' }], org: [], signers: [], changeControl: '',
}
const header = context.policyHeaderHtml(policy, 1, 3)
const initial = header.split('<div class="policy-header-compact">')[0]
const compact = header.split('<div class="policy-header-compact">')[1]
assert.match(initial, /Política.*CONFIDENCIAL.*Política de seguridad/s)
assert.match(initial, /Código.*POL-2026-001.*Versión.*1\.0.*Empresa.*Hilos y Algodón.*Departamento.*Operaciones.*Aprobación.*Próxima revisión/s)
assert.doesNotMatch(initial, /Planta|Planta Norte/)
assert.doesNotMatch(initial, /Página|>Proceso</)
assert.match(compact, /Política.*CONFIDENCIAL.*Política de seguridad/s)
assert.match(compact, /Hilos y Algodón/)
assert.doesNotMatch(compact, /Planta Norte/)
assert.doesNotMatch(compact, /Página/)
assert.match(context.policyFooterHtml(policy, 2, 3), /Área de implementación · Operaciones.*Página 2 de 3/s)
const content = context.policyContentHtml(policy)
assert.match(content, /<table class="policy-index-table">/)
assert.match(content, /<thead><tr><th scope="col">No\.<\/th><th scope="col">Sección<\/th><th scope="col">Página<\/th>/)
assert.match(content, /<tbody class="policy-index-list"><tr class="policy-index-row">/)
assert.match(content, /data-policy-index-page="2"/)
assert.match(content, /<colgroup><col><col><\/colgroup>/)
assert.match(content, /<td>Administración<\/td><td><ul><li>Verificar<\/li><li>Reportar<\/li><\/ul><\/td>/)
assert.match(html, /const table=originalContainer\.closest\('table'\)/)
assert.match(html, /\.policy-heading-number\{[^}]*font:700 11\.5pt\/1\.2 "Aeonik",Arial,sans-serif/)
assert.match(html, /\.policy-page\.is-continuation \.policy-header-compact\{[^}]*grid-template-columns:30mm minmax\(0,1fr\)/)
assert.match(html, /\.policy-record-logo img\{display:block;width:auto;height:auto;max-width:100%;max-height:37mm\}/)
assert.match(html, /\.policy-page\.is-continuation \.policy-record-logo img\{max-width:28mm;max-height:12mm\}/)
assert.match(html, /\.policy-index h2,\.policy-document-section h2\{[^}]*background:transparent;font:700 11\.5pt/)
assert.match(html, /\.policy-page \.policy-watermark\{font-size:50pt\}/)
assert.match(html, /\.policy-record-metadata\{display:grid;grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/)
assert.match(html, /\.policy-record-classification\{[^}]*border:\.25mm solid #e80000[^}]*background:#ffc7c7[^}]*color:#b40b0b/)
assert.match(html, /\.policy-responsibility-table\{width:100%;table-layout:fixed/)
assert.match(html, /\.policy-responsibility-table col:first-child\{width:34%\}/)
assert.match(html, /\.policy-responsibility-table col:last-child\{width:66%\}/)
assert.match(html, /class="policy-responsibility-rich" contenteditable="true"/)
assert.match(html, /\.policy-person-row\.is-responsible\{grid-template-columns:minmax\(0,1fr\) 32px/)
assert.match(html, /\.policy-person-row\.is-responsible>\.policy-responsibility-editor\{grid-column:1\/-1;grid-row:2\}/)
assert.match(html, /policyResponsibilityCommand\(event,\$\{i\},'insertUnorderedList'\)/)
assert.match(html, /policyResponsibilityCommand\(event,\$\{i\},'insertOrderedList'\)/)
assert.match(html, /function policyResponsibilityKeydown\(event,editor\)/)
assert.match(html, /\.policy-approval\{min-height:44mm;border:\.25mm solid #cfd2d5/)
assert.doesNotMatch(html.slice(html.indexOf('function policyInfoPanel()'), html.indexOf('function policySectionEditor(')), /policySetSite|policySiteOptions|>Planta</)
console.log('PASS: policy index table, compact header and implementation-area footer')
