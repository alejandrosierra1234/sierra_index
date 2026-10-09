const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const html = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf8')

assert.match(html, /break-after:avoid-page;page-break-after:avoid/)
assert.match(html, /const ensureLeadRoom=\(\)=>/)
assert.match(html, /begin\(false\);ensureLeadRoom\(\)/)
assert.match(html, /function policyZoomWidth\(\)/)
assert.match(html, /function policyZoomPage\(\)/)
assert.match(html, /data-policy-zoom-mode="width"/)
assert.match(html, /data-policy-zoom-mode="page"/)
assert.match(html, />Ancho<\/span>/)
assert.match(html, />Página<\/span>/)

console.log('PASS: policy preview keeps headings with content and supports width/page fitting')
