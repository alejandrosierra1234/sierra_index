const fs = require('node:fs')
const assert = require('node:assert/strict')

const html = fs.readFileSync('index.html', 'utf8')

assert.match(html, /function policyCompanyAccent\(p\)\{[^}]*_policyCompanies[^}]*companyColor\(company\?\.brand_color\|\|company\?\.brandColor\|\|p\?\.companyColor\)/)
assert.match(html, /class="policy-page" onmouseup="policyOfferSelectionComment\(event,this\)" style="--policy-company-accent:\$\{companyAccent\}"/)
assert.match(html, /class="policy-card" style="[^"\n]*--policy-company-accent:\$\{companyAccent\}/)
assert.match(html, /\.policy-index h2,\.policy-document-section h2\{[^}]*border-left:\.8mm solid var\(--policy-company-accent\)/)
assert.match(html, /\.policy-control-reference:before\{[^}]*background:var\(--policy-company-accent\)/)
assert.match(html, /\.policy-control-datum:first-child\{[^}]*border-left:\.45mm solid var\(--policy-company-accent\)/)
assert.match(html, /\.policy-card-document-section\{[^}]*border-left:2px solid var\(--policy-company-accent,#008C82\)/)

console.log('PASS: policy preview, PDF and library thumbnail inherit the selected company color')
