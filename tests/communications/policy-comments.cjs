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
assert.match(html, /El fragmento queda subrayado en amarillo y los comentarios no se imprimen/)
assert.match(html, /function policyAddComment\(\)/)
assert.match(html, /function policyToggleComment\(id\)/)
assert.match(html, /function policyResolveComment\(id\)/)
assert.match(html, /function policyReplyComment\(id,control\)/)
assert.match(html, /function policyRemoveComment\(id\)/)
assert.match(html, /comments:policyNormalizeComments\(seed\.comments\)/)
assert.match(html, /const POLICY_COMMENT_COLORS=\{yellow:/)
assert.match(html, /if\(key==='title'\)value=String\(value\|\|''\)\.toLocaleUpperCase\('es'\)/)
assert.match(html, /alignments=new Set\(\['left','center','right','justify'\]\)/)

assert.match(html, /function policyCommentMarkerHtml\(p,sectionId=''\)/)
assert.match(html, /\.policy-editorial-marker\{[^}]*right:0;top:-1mm/)
assert.match(html, /function policyShowCommentPopover\(trigger,sectionId='',pin=false\)/)
assert.match(html, /document\.querySelector\('body>\.policy-comment-popover'\)/)
assert.match(html, /max-height:min\(520px,calc\(100vh - 24px\)\)/)
assert.match(html, /onmouseenter="policyShowCommentPopover/)
assert.match(html, /class="policy-comment-popover-head"/)
assert.match(html, /class="policy-marker-count"/)
assert.match(html, /Revisión editorial · no se imprime/)
assert.match(html, /class="policy-comment-reply-form"/)
assert.match(html, /function policyApplyCommentHighlights\(root,p=_policyCurrent\)/)
assert.match(html, /className='policy-comment-highlight'/)
assert.match(html, /\.policy-comment-highlight\{[^}]*linear-gradient/)
assert.match(html, /data-policy-section-id="\$\{escAttr\(s\.id\)\}"/)
assert.match(html, /function policyOpenCommentThread\(sectionId=''\)/)
assert.match(html, /function policyShowCommentLocation\(sectionId=''\)/)
assert.match(html, /@media print\{\.policy-editorial-marker\{display:none!important\}\}/)
assert.doesNotMatch(html, /Etiqueta de color/)

console.log('PASS: policy comments stay editorial-only and policy names stay uppercase')
