const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')

const html = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf8')
const start = html.indexOf('function policyDurableAssetUrl(')
const end = html.indexOf('function createPolicyDraft(', start)
assert(start >= 0 && end > start, 'company identity helpers are present')

const context = vm.createContext({
  _policyCompanies: [{
    id: 'company-1',
    name: 'Empresa vigente',
    legal_name: 'Empresa Vigente, S.A.',
    logo_url: 'https://assets.test/storage/v1/object/sign/product-images/company-1/logo.svg?token=fresh',
  }],
  indexAssets: {
    canonical(value) {
      return String(value || '').replace('/sign/', '/public/').replace(/\?token=.*$/, '')
    },
  },
  document: {},
  console,
})
vm.runInContext(html.slice(start, end), context)

const sharedSnapshot = {
  id: 'policy-1',
  companyId: 'company-1',
  companyName: 'Nombre anterior',
  companyLegalName: '',
  companyLogo: '',
}
const resolved = context.policyResolvedCompany(sharedSnapshot)
assert.equal(resolved.companyName, 'Empresa vigente')
assert.equal(resolved.companyLegalName, 'Empresa Vigente, S.A.')
assert.equal(resolved.companyLogo, 'https://assets.test/storage/v1/object/public/product-images/company-1/logo.svg')
assert.equal(sharedSnapshot.companyLogo, '', 'shared cloud snapshot is not mutated while rendering')

const stale = context.policyResolvedCompany({ ...sharedSnapshot, companyLogo: 'https://old.test/logo.svg' })
assert.equal(stale.companyLogo, resolved.companyLogo, 'the current company catalog wins over a stale per-policy logo')

context._policyCompanies = []
const fallback = context.policyResolvedCompany({ ...sharedSnapshot, companyLogo: 'https://fallback.test/logo.png' })
assert.equal(fallback.companyLogo, 'https://fallback.test/logo.png', 'saved policy logo remains available when the company catalog cannot load')

assert.match(html, /data-policy-logo-src=/)
assert.match(html, /Promise\.all\(\[policyResolveRichImages\(sheet\),policyResolveCompanyLogos\(sheet\)\]\)/)
assert.match(html, /renderPolicyLibrary\(\).*policyResolveCompanyLogos\(pg\)/s)
assert.match(html, /policyFilterLibrary\(\).*policyResolveCompanyLogos\(list\)/s)

console.log('PASS: policy logos resolve from the current company for every session')
