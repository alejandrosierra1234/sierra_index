const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')

const source = fs.readFileSync(path.join(__dirname, '../../js/policy-pdf-local.js'), 'utf8')
let clickListener, pickerCalls = 0, legacyCalls = 0, written, closed = false, message = ''
const window = {
  policySavePdfBlob: () => { legacyCalls++ },
  showSaveFilePicker: async options => {
    pickerCalls++
    assert.equal(options.suggestedName, 'politica-sierra.pdf')
    return { createWritable: async () => ({ write: async blob => { written = blob }, close: async () => { closed = true } }) }
  },
}
const context = vm.createContext({
  window,
  navigator: { userAgent: 'Mozilla/5.0 Chrome/154.0.0.0' },
  document: {
    currentScript: { src: 'https://index.test/js/policy-pdf-local.js' },
    addEventListener: (name, listener, capture) => {
      assert.equal(name, 'click')
      assert.equal(capture, true)
      clickListener = listener
    },
  },
  URL,
  Blob,
  TextDecoder,
  Uint8Array,
  ArrayBuffer,
  console,
  toast: value => { message = value },
  setTimeout,
})
vm.runInContext(source, context)

const button = {
  disabled: false,
  matches: selector => selector === '[data-policy-pdf]',
  getAttribute: () => '',
}

;(async () => {
  clickListener({ target: { closest: () => button } })
  const blob = new Blob(['%PDF-', 'content', '%%EOF'], { type: 'application/pdf' })
  const saved = await window.policySavePdfBlob(blob, 'policy.pdf')
  assert.equal(pickerCalls, 1)
  assert.equal(written, blob)
  assert.equal(closed, true)
  assert.equal(legacyCalls, 0)
  assert.equal(saved, true)

  window.showSaveFilePicker = async () => { const error = Error('cancelled'); error.name = 'AbortError'; throw error }
  clickListener({ target: { closest: () => button } })
  const cancelled = await window.policySavePdfBlob(blob, 'policy.pdf')
  assert.equal(legacyCalls, 0, 'cancelling the native picker must not start a fallback download')
  assert.equal(cancelled, false)
  assert.equal(message, 'Descarga cancelada.')

  const elements = new Map(), makeElement = id => ({ id, classList: { remove() {} }, addEventListener() {}, click() { this.clicked = true } })
  for (const id of ['download-title', 'download-file', 'download-link', 'download-meta']) elements.set(id, makeElement(id))
  const popup = { closed: false, document: { open() {}, write() {}, close() {}, getElementById: id => elements.get(id) } }
  window.showSaveFilePicker = undefined
  window.open = () => popup
  clickListener({ target: { closest: () => button } })
  const fallback = await window.policySavePdfBlob(blob, 'policy.pdf')
  assert.equal(fallback.pendingUser, true)
  assert.equal(elements.get('download-link').download, 'policy.pdf')
  assert.equal(elements.get('download-link').clicked, true)
  console.log('PASS: Chromium reserves a native destination or a durable download tab before generation')
})().catch(error => { console.error(error); process.exitCode = 1 })
