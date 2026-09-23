const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')

const html = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf8')
const start = html.indexOf('async function policyRasterizeSvgLogo(p)')
const end = html.indexOf('async function policyPdfBlob(p)', start)
assert(start >= 0 && end > start, 'SVG conversion helper is present')

function fixture({ tainted = false } = {}) {
  const source = 'https://example.test/company.svg?token=abc'
  const image = { src: source, naturalWidth: 125, naturalHeight: 150 }
  let draws = 0
  const document = {
    baseURI: 'https://example.test/',
    querySelectorAll: () => [image],
    createElement: type => {
      assert.equal(type, 'canvas')
      return {
        getContext: () => ({ drawImage(value, x, y, width, height) {
          draws++
          assert.equal(value, image)
          assert.deepEqual([x, y, width, height], [0, 0, 1000, 1200])
        } }),
        toDataURL() { if (tainted) throw Error('Canvas is tainted'); return 'data:image/png;base64,AA==' },
      }
    },
  }
  const context = vm.createContext({ document, URL, Image: class { constructor() { throw Error('The loaded preview should be reused') } } })
  vm.runInContext(html.slice(start, end), context)
  return { context, source, image, getDraws: () => draws }
}

;(async () => {
  const loaded = fixture()
  const draft = { companyLogo: loaded.source, title: 'Política' }
  const result = await loaded.context.policyRasterizeSvgLogo(draft)
  assert.equal(result.companyLogo, 'data:image/png;base64,AA==')
  assert.equal(draft.companyLogo, loaded.source, 'saved draft keeps its SVG')
  assert.equal(loaded.getDraws(), 1, 'loaded preview is converted once before creating the PDF iframe')

  const png = { companyLogo: 'https://example.test/company.png' }
  assert.equal(await loaded.context.policyRasterizeSvgLogo(png), png, 'PNG logos pass through unchanged')
  const failure = fixture({ tainted: true })
  await assert.rejects(failure.context.policyRasterizeSvgLogo({ companyLogo: failure.source }), /No se pudo convertir el logo SVG para el PDF/)
  const wide = (compact) => ({ naturalWidth: 300, naturalHeight: 65, style: {}, closest: () => compact ? {} : null })
  const first = wide(false), continued = wide(true), square = { naturalWidth: 100, naturalHeight: 100, style: {}, closest: () => ({}) }
  loaded.context.policyFitExportLogos({ querySelectorAll: () => [first, continued, square] })
  assert.equal(first.style.width, '37.000mm')
  assert.equal(first.style.height, '8.017mm')
  assert.equal(continued.style.width, '28.000mm')
  assert.equal(continued.style.height, '6.067mm')
  assert.equal(square.style.width, '12.000mm')
  assert.equal(square.style.height, '12.000mm')
  assert.equal(first.style.maxWidth, 'none')
  assert.equal(continued.style.maxHeight, 'none')
  assert.match(html.slice(end, html.indexOf('async function policyDownloadPdf()', end)), /const exportPolicy=await policyRasterizeSvgLogo\(p\)/)
  assert.match(html.slice(end, html.indexOf('async function policyDownloadPdf()', end)), /policyPageHtml\(exportPolicy\)/)
  assert.match(html.slice(end, html.indexOf('async function policyDownloadPdf()', end)), /policyFitExportLogos\(doc\)/)
  console.log('PASS: SVG logo and PDF boxes preserve intrinsic aspect ratio')
})().catch(error => { console.error(error); process.exitCode = 1 })
