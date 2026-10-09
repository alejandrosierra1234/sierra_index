const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const html = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf8')

assert.match(html, /\.policy-list\{display:grid;grid-template-columns:repeat\(auto-fill,minmax\(min\(100%,270px\),1fr\)\)/)
assert.match(html, /function policyCardPreviewHtml\(p\)/)
assert.match(html, /class="policy-card-sheet"/)
assert.match(html, /class="policy-card-comment-count"/)
assert.match(html, /class="policy-card-updated"/)
assert.match(html, /class="btn btn-secondary btn-sm policy-card-open"/)
assert.doesNotMatch(html, /\.policy-list\{display:block;border:1px solid var\(--border\)/)

console.log('PASS: policy library uses compact preview cards in a responsive grid')
