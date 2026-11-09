const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')

const source = fs.readFileSync(path.join(__dirname, '../../js/policy-pdf-local.js'), 'utf8')
let clickListener, legacyCalls = 0
const elements = new Map()
const makeElement = id => ({
  id,
  classList: { remove() {} },
  addEventListener() {},
  click() { this.clicked = true },
})
for (const id of ['download-title', 'download-file', 'download-link', 'download-meta']) elements.set(id, makeElement(id))
const popup = {
  closed: false,
  document: {
    open() {},
    write() {},
    close() {},
    getElementById: id => elements.get(id),
  },
}
const window = {
  policySavePdfBlob: () => { legacyCalls++ },
  showSaveFilePicker: () => { throw Error('The native picker must never be used') },
  open: () => popup,
}
const context = vm.createContext({
  window,
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
  assert.equal(elements.get('download-file').textContent, 'politica-sierra.pdf')

  const blob = new Blob(['%PDF-', 'content', '%%EOF'], { type: 'application/pdf' })
  const saved = await window.policySavePdfBlob(blob, 'policy.pdf')
  assert.equal(saved.pendingUser, true)
  assert.equal(elements.get('download-link').download, 'policy.pdf')
  assert.equal(elements.get('download-link').clicked, true)
  assert.equal(legacyCalls, 0)
  console.log('PASS: every browser receives a durable PDF download tab before generation')
})().catch(error => { console.error(error); process.exitCode = 1 })
