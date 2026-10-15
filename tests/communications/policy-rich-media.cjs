const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { JSDOM } = require('jsdom')

const html = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf8')
const localPdf = fs.readFileSync(path.join(__dirname, '../../js/policy-pdf-local.js'), 'utf8')
const assets = fs.readFileSync(path.join(__dirname, '../../js/private-assets.js'), 'utf8')
const start = html.indexOf('function policyMediaNumber(')
const end = html.indexOf('function policyResponsibilityHtml(', start)
assert(start >= 0 && end > start)

const dom = new JSDOM('<!doctype html><body></body>', { url: 'https://sierra.test/' })
const storage = 'https://assets.test/storage/v1/object/public/product-images/user/policy/photo.webp'
const context = vm.createContext({
  document: dom.window.document,
  policyUid: () => 'media-safe',
  policyDurableAssetUrl: value => value,
  indexAssets: { path: value => value === storage ? 'user/policy/photo.webp' : null },
})
vm.runInContext(html.slice(start, end), context)

const sanitized = context.policySanitize(`<script>alert(1)</script><table onclick="bad()"><tbody><tr><td colspan="99">Celda <figure data-policy-media-id="x" data-policy-width="999" data-policy-height="12" data-policy-zoom="999" data-policy-fit="contain" style="position:fixed"><img src="${storage}" alt="Diagrama" onerror="bad()"></figure></td></tr></tbody></table><img src="https://tracker.test/pixel.png">`)
const box = dom.window.document.createElement('div')
box.innerHTML = sanitized
assert.equal(box.querySelectorAll('script').length, 0)
assert.equal(box.querySelectorAll('table.policy-content-table').length, 1)
assert.equal(box.querySelector('td').colSpan, 8)
assert.equal(box.querySelectorAll('img').length, 1, 'external tracking image is rejected')
const figure = box.querySelector('figure.policy-content-image')
assert.equal(figure.dataset.policyWidth, '100')
assert.equal(figure.dataset.policyHeight, '80')
assert.equal(figure.dataset.policyZoom, '250')
assert.equal(figure.dataset.policyFit, 'contain')
assert.equal(figure.style.getPropertyValue('--policy-media-height'), '80px')
assert.equal(figure.querySelector('img').dataset.policySrc, storage)
assert.equal(figure.querySelector('img').getAttribute('onerror'), null)

assert.match(html, /title="Agregar imagen"/)
assert.match(html, /title="Agregar tabla 2 por 2"/)
assert.match(html, /data-policy-image-input=/)
assert.match(html, /policy-content\/\$\{_policyCurrent\.id\}/)
assert.match(html, /Ancho y alto son independientes/)
assert.match(html, /Rellenar y recortar/)
assert.match(html, /Mostrar completa/)
assert.match(html, /function policyTableAction\(control,action\)/)
assert.match(html, /if\(child\.tagName==='TABLE'\)\{splitRichTable\(child\)/)
assert.match(localPdf, /async function portableImages\(doc,host\)/)
assert.match(localPdf, /await portableImages\(doc,host\)/)
assert.match(assets, /doc\?\.images\|\|doc\?\.querySelectorAll\?\.\('img'\)/)
console.log('PASS: policy images and tables are safe, adjustable, cloud-backed and PDF-portable')
