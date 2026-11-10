const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')

const source = fs.readFileSync(path.join(__dirname, '../../js/policy-pdf-local.js'), 'utf8')
let clickListener, legacyCalls = 0, reservedLink
const window = {
  policySavePdfBlob: () => { legacyCalls++ },
  showSaveFilePicker: () => { throw Error('The native picker must never be used') },
  open: () => { throw Error('Policy downloads must never open a new tab') },
}
const document = {
  currentScript: { src: 'https://index.test/js/policy-pdf-local.js' },
  body: { append(link) { link.isConnected = true; reservedLink = link } },
  createElement: tag => {
    assert.equal(tag, 'a')
    return {
      hidden: false,
      isConnected: false,
      setAttribute(name, value) { this[name] = value },
      click() { this.clicked = true },
      remove() { this.isConnected = false },
    }
  },
  addEventListener: (name, listener, capture) => {
    assert.equal(name, 'click')
    assert.equal(capture, true)
    clickListener = listener
  },
}
const context = vm.createContext({
  window,
  document,
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
  assert.equal(reservedLink.download, 'politica-sierra.pdf')
  assert.equal(reservedLink.hidden, true)
  assert.equal(reservedLink['aria-hidden'], 'true')

  const blob = new Blob(['%PDF-', 'content', '%%EOF'], { type: 'application/pdf' })
  const saved = await window.policySavePdfBlob(blob, 'policy.pdf')
  assert.equal(saved, true)
  assert.equal(reservedLink.download, 'policy.pdf')
  assert.match(reservedLink.href, /^blob:/)
  assert.equal(reservedLink.clicked, true)
  assert.equal(legacyCalls, 0)
  console.log('PASS: policy PDFs download in the current tab without a popup or native picker')
})().catch(error => { console.error(error); process.exitCode = 1 })
