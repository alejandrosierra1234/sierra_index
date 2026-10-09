const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const html = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf8')
const policySource = html.slice(html.indexOf('const POLICY_STORE_KEY='), html.indexOf('</script>', html.indexOf('const POLICY_STORE_KEY=')))

assert.match(html, /function policySelect\(id,label,options/)
assert.match(html, /policy-dedicated-select/)
assert.match(html, /function pdSelectKeydown\(e, id\)/)
assert.match(policySource, /policySelect\('policy-company','Empresa'/)
assert.match(policySource, /policySelect\('policy-status','Estado'/)
assert.match(policySource, /policySelect\('policy-comment-target','Comentar sobre'/)
assert.doesNotMatch(policySource, /Color del comentario/)
assert.match(policySource, /policySelect\(`policy-signer-role-\$\{i\}`/)
assert.match(policySource, /policySelect\(`policy-org-parent-\$\{i\}`/)
assert.doesNotMatch(policySource, /<select\b/i)

console.log('PASS: policy dropdowns use the dedicated SIERRA listbox control')
