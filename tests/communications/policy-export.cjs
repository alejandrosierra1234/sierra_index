const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')

const html = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf8')
const start = html.indexOf('async function policyRasterizeSvgLogos(doc)')
const end = html.indexOf('async function policyPdfBlob(p)', start)
assert(start >= 0 && end > start, 'SVG conversion helper is present')
const context = vm.createContext({})
vm.runInContext(html.slice(start, end), context)

function logo(src) {
  return {
    src, naturalWidth: 125, naturalHeight: 150,
    async decode() {},
    removeAttribute(name) { assert.equal(name, 'crossorigin') },
  }
}

;(async () => {
  const first = logo('https://example.test/company.svg?token=abc')
  const second = logo(first.src)
  const png = logo('https://example.test/company.png')
  let draws = 0
  const doc = {
    querySelectorAll: () => [first, second, png],
    createElement: type => {
      assert.equal(type, 'canvas')
      return {
        getContext: () => ({ drawImage(image, x, y, width, height) {
          draws++
          assert.equal(image, first)
          assert.deepEqual([x, y, width, height], [0, 0, 1000, 1200])
        } }),
        toDataURL: () => 'data:image/png;base64,AA==',
      }
    },
  }
  await context.policyRasterizeSvgLogos(doc)
  assert.equal(draws, 1, 'repeated logos are converted once')
  assert.equal(first.src, 'data:image/png;base64,AA==')
  assert.equal(second.src, first.src)
  assert.equal(png.src, 'https://example.test/company.png')

  const broken = logo('data:image/svg+xml;base64,broken')
  const badDoc = { querySelectorAll: () => [broken], createElement: () => ({ getContext: () => ({ drawImage() {} }), toDataURL() { throw Error('Canvas is tainted') } }) }
  await assert.rejects(context.policyRasterizeSvgLogos(badDoc), /No se pudo preparar el logo SVG para el PDF/)
  assert.match(html.slice(end, html.indexOf('async function policyDownloadPdf()', end)), /await policyRasterizeSvgLogos\(doc\)/)
  console.log('PASS: SVG logos are rasterized before PDF capture, reused on every page, and fail visibly')
})().catch(error => { console.error(error); process.exitCode = 1 })
