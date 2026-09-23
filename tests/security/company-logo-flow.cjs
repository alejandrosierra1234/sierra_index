const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const path = require('node:path')

const html = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf8')
const start = html.indexOf('async function saveCompany(id) {')
const end = html.indexOf('async function deleteCompany(id) {', start)
assert(start >= 0 && end > start, 'company logo flow source is present')
const flow = html.slice(start, end)

function fixture(uploadError = null) {
  const file = { name: 'planta.svg', type: 'image/svg+xml', size: 240 }
  const input = { files: [file], value: 'planta.svg' }
  const status = { textContent: '', dataset: {} }
  const button = { disabled: false, textContent: 'Guardar', isConnected: true }
  const fields = {
    'company-name': { value: 'Planta de prueba' },
    'company-code': { value: 'PT' },
    'company-legal-name': { value: 'Planta de prueba, S.A.' },
    'company-country': { value: 'country-1' },
    'company-logo-file': input,
    'company-logo-file-name': status,
    'company-save-btn': button,
  }
  const calls = { uploads: 0, updates: 0, closed: 0, messages: [] }
  const storage = {
    upload: async (_key, uploaded, options) => {
      calls.uploads++
      assert.equal(uploaded, file)
      assert.equal(options.contentType, 'image/svg+xml')
      return { error: uploadError }
    },
    getPublicUrl: key => ({ data: { publicUrl: `https://example.test/${key}` } }),
  }
  const sb = {
    storage: { from: () => storage },
    from: () => ({
      select: () => ({ limit: async () => ({ error: null }) }),
      update: payload => ({ eq: async () => { calls.updates++; calls.payload = payload; return { error: null } } }),
    }),
  }
  const context = vm.createContext({
    document: { getElementById: id => fields[id] || null, querySelector: () => null },
    _badge: { companies: { 'country-1': [{ id: 'company-1', name: 'Planta de prueba', logo_url: null }] } },
    sb, IMG_MAX_MB: 8, window: {},
    toast: message => calls.messages.push(message),
    closeCompanyEditor: () => { calls.closed++; button.isConnected = false },
    loadBadgeData: async () => {}, renderBadgeModule: () => {},
  })
  vm.runInContext(flow, context)
  return { context, input, status, button, calls }
}

(async () => {
  const success = fixture()
  success.context.handleCompanyLogoSelection(success.input)
  assert.equal(success.calls.uploads, 0, 'selecting only stages the logo')
  assert.match(success.status.textContent, /pulsar Guardar/)
  await success.context.saveCompany('company-1')
  assert.equal(success.calls.uploads, 1)
  assert.equal(success.calls.updates, 1)
  assert.match(success.calls.payload.logo_url, /company-logos\/company-1/)
  assert.equal(success.calls.closed, 1)

  const failure = fixture({ message: 'permission denied' })
  await failure.context.saveCompany('company-1')
  assert.equal(failure.calls.updates, 0, 'failed upload must not update the company')
  assert.equal(failure.calls.closed, 0, 'failed upload preserves the modal')
  assert.equal(failure.status.dataset.state, 'error')
  assert.match(failure.status.textContent, /permission denied/)
  assert.equal(failure.button.disabled, false, 'user can retry')
  assert.equal(failure.input.files[0].name, 'planta.svg', 'file remains selected')

  assert.equal(success.context.companyLogoContentType({ name: 'logo.svg', type: '' }), 'image/svg+xml')
  assert.equal(success.context.companyLogoContentType({ name: 'logo.ai', type: '' }), null)
  console.log('PASS: staged selection, explicit upload, failure recovery and logo type validation')
})().catch(error => { console.error(error); process.exitCode = 1 })
