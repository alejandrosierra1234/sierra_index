const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')

const html = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf8')
const start = html.indexOf('const POLICY_STORE_KEY=')
const end = html.indexOf('function policyOpen(', start)
const context = vm.createContext({
  console,
  Date,
  Math,
  JSON,
  localStorage: { getItem: () => null, setItem: () => {} },
})
vm.runInContext(html.slice(start, end), context)

const draft = context.createPolicyDraft({ title: 'Política editorial' })
assert.equal(draft.title, 'POLÍTICA EDITORIAL')
assert.deepEqual(JSON.parse(JSON.stringify(draft.comments)), [])

assert.match(html, /data-policy-tab="comments"/)
assert.match(html, /Los comentarios aparecen como indicadores en el margen del documento, pero no forman parte de la impresión ni del PDF/)
assert.match(html, /function policyAddComment\(\)/)
assert.match(html, /function policyToggleComment\(id\)/)
assert.match(html, /function policyRemoveComment\(id\)/)
assert.match(html, /comments:Array\.isArray\(seed\.comments\)\?seed\.comments:\[\]/)
assert.match(html, /if\(key==='title'\)value=String\(value\|\|''\)\.toLocaleUpperCase\('es'\)/)
assert.match(html, /alignments=new Set\(\['left','center','right','justify'\]\)/)

assert.match(html, /function policyCommentMarkerHtml\(p,sectionId=''\)/)
assert.match(html, /data-policy-section-id="\$\{escAttr\(s\.id\)\}"/)
assert.match(html, /function policyOpenCommentThread\(sectionId=''\)/)
assert.match(html, /function policyShowCommentLocation\(sectionId=''\)/)
assert.match(html, /doc\.querySelectorAll\('\.policy-editorial-marker'\)\.forEach\(marker=>marker\.remove\(\)\)/)
assert.match(html, /@media print\{\.policy-editorial-marker\{display:none!important\}\}/)

console.log('PASS: policy comments stay editorial-only and policy names stay uppercase')
