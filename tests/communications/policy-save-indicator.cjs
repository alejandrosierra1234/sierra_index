const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const html = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf8')

assert.match(html, /class="policy-save-indicator" data-policy-save-indicator/)
assert.match(html, /data-state="\$\{escAttr\(_policyCloudStatus\)\}"/)
assert.match(html, /function policyCloudState\(message,state=''\).*querySelectorAll\('\[data-policy-save-indicator\]'\)/)
assert.match(html, /\.policy-save-indicator\[data-state="saving"\]/)
assert.match(html, /\.policy-save-indicator\[data-state="saved"\]/)
assert.match(html, /\.policy-save-indicator\[data-state="error"\]/)
assert.match(html, /aria-live="polite"/)

console.log('PASS: policy editor exposes live cloud-save status')
