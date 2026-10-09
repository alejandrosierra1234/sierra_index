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
const migrated = context.createPolicyDraft({ comments: [{ id: 'legacy', body: 'Pendiente' }] })
assert.equal(migrated.comments[0].color, 'yellow')
assert.deepEqual(JSON.parse(JSON.stringify(migrated.comments[0].replies)), [])

assert.match(html, /data-policy-tab="comments"/)
assert.match(html, /Los comentarios aparecen como indicadores en el margen del documento, pero no forman parte de la impresión ni del PDF/)
assert.match(html, /function policyAddComment\(\)/)
assert.match(html, /function policyToggleComment\(id\)/)
assert.match(html, /function policyResolveComment\(id\)/)
assert.match(html, /function policyReplyComment\(id,control\)/)
assert.match(html, /function policySetCommentColor\(id,color\)/)
assert.match(html, /function policyRemoveComment\(id\)/)
assert.match(html, /comments:policyNormalizeComments\(seed\.comments\)/)
assert.match(html, /const POLICY_COMMENT_COLORS=\{yellow:/)
assert.match(html, /if\(key==='title'\)value=String\(value\|\|''\)\.toLocaleUpperCase\('es'\)/)
assert.match(html, /alignments=new Set\(\['left','center','right','justify'\]\)/)

assert.match(html, /function policyCommentMarkerHtml\(p,sectionId=''\)/)
assert.match(html, /\.policy-editorial-marker\{[^}]*right:0;top:-1mm/)
assert.match(html, /class="policy-comment-popover" role="dialog"/)
assert.match(html, /\.policy-editorial-marker:hover \.policy-comment-popover,\.policy-editorial-marker:focus-within \.policy-comment-popover\{display:grid/)
assert.match(html, /class="policy-comment-reply-form"/)
assert.match(html, /class="policy-comment-color"/)
assert.match(html, /data-policy-section-id="\$\{escAttr\(s\.id\)\}"/)
assert.match(html, /function policyOpenCommentThread\(sectionId=''\)/)
assert.match(html, /function policyShowCommentLocation\(sectionId=''\)/)
assert.match(html, /doc\.querySelectorAll\('\.policy-editorial-marker'\)\.forEach\(marker=>marker\.remove\(\)\)/)
assert.match(html, /@media print\{\.policy-editorial-marker\{display:none!important\}\}/)

console.log('PASS: policy comments stay editorial-only and policy names stay uppercase')
