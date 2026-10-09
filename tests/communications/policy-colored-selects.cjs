const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const html = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf8')

assert.match(html, /pd-select\$\{active\?\.color\?' has-color':''\}/)
assert.match(html, /--selected-color:\$\{escAttr\(active\.color\)\}/)
assert.match(html, /dd\.classList\.toggle\('has-color',Boolean\(color\)\)/)
assert.match(html, /dd\.style\.setProperty\('--selected-color',color\)/)
assert.match(html, /\.policy-dedicated-select\.has-color \.pd-select-btn\{border-color:color-mix/)
assert.match(html, /\.policy-dedicated-select \.pd-select-opt\.is-active\[data-color\]:not\(\[data-color=""\]\)\{background:color-mix/)
assert.match(html, /function policyStatusOption\(status\).*color:data\.color/)
assert.match(html, /const POLICY_USER_COMMENT_COLORS=\['yellow','green','blue','purple','pink'\]/)
assert.match(html, /function policyUserCommentColor\(identity=\{\}\)/)
assert.doesNotMatch(html, /function policyCommentPaletteHtml/)

console.log('PASS: policy status colors remain semantic and comment colors are assigned by author')
