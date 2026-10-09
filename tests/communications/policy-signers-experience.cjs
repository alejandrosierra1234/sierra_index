const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const html = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf8')

assert.match(html, /function policySignerRoleData\(role\)/)
assert.match(html, /'Elaborado por':\{icon:'pencil',color:'#009fff',soft:'#e8f6ff',ink:'#004a86'\}/)
assert.match(html, /'Revisado por':\{icon:'eye',color:'#ffc529',soft:'#fff7cf',ink:'#715900'\}/)
assert.match(html, /'Aprobado por':\{icon:'check-circle',color:'#3ed600',soft:'#e9ffe0',ink:'#256f08'\}/)
assert.match(html, /class="policy-signer-card" data-policy-signer=/)
assert.match(html, /class="policy-signer-fields"/)
assert.match(html, /function policySyncSignerCard\(i,value\)/)
assert.match(html, /policySyncSignerCard\(i,value\)/)
assert.match(html, /\.policy-signer-fields\{display:grid;grid-template-columns:minmax\(0,1fr\) minmax\(0,1fr\)/)
assert.match(html, /@media\(max-width:520px\)\{\.policy-signer-fields\{grid-template-columns:1fr\}/)
assert.match(html, /active\.color\?` style="color:\$\{escAttr\(active\.color\)\}"`/)

console.log('PASS: signer cards stay readable and color-code authoring, review and approval roles')
