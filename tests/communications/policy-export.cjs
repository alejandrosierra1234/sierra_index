const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')

const html = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf8')
const start = html.indexOf('async function policyRasterizeSvgLogo(p)')
const end = html.indexOf('async function policyPdfBlob(p', start)
assert(start >= 0 && end > start, 'SVG conversion helper is present')

function fixture({ tainted = false, storage = false, status = 200 } = {}) {
  const source = storage
    ? 'https://assets.test/storage/v1/object/sign/product-images/company.svg?token=expired'
    : 'https://example.test/company.svg?token=abc'
  const fresh = 'https://assets.test/storage/v1/object/sign/product-images/company.svg?token=fresh'
  let draws = 0, revoked = '', resolved = '', requested = ''
  class TestImage {
    set src(value) {
      this._src = value
      this.naturalWidth = 125
      this.naturalHeight = 150
      queueMicrotask(() => this.onload?.())
    }
    get src() { return this._src }
  }
  const document = {
    createElement: type => {
      assert.equal(type, 'canvas')
      return {
        getContext: () => ({ drawImage(value, x, y, width, height) {
          draws++
          assert(value instanceof TestImage)
          assert.deepEqual([x, y, width, height], [0, 0, 1000, 1200])
        } }),
        toDataURL() { if (tainted) throw Error('Canvas is tainted'); return 'data:image/png;base64,AA==' },
      }
    },
  }
  const context = vm.createContext({
    document,
    Blob,
    Image: TestImage,
    URL: {
      createObjectURL: () => 'blob:policy-logo',
      revokeObjectURL: value => { revoked = value },
    },
    fetch: async value => {
      requested = value
      return {
        ok: status >= 200 && status < 300,
        status,
        blob: async () => new Blob(['<svg viewBox="0 0 125 150"></svg>'], { type: 'image/svg+xml' }),
      }
    },
    indexAssets: {
      path: value => storage && value === source ? 'company.svg' : null,
      resolve: async value => { resolved = value; return fresh },
    },
  })
  vm.runInContext(html.slice(start, end), context)
  return { context, source, fresh, getDraws: () => draws, getRequested: () => requested, getResolved: () => resolved, getRevoked: () => revoked }
}

;(async () => {
  const loaded = fixture()
  const draft = { companyLogo: loaded.source, title: 'Política' }
  const result = await loaded.context.policyRasterizeSvgLogo(draft)
  assert.equal(result.companyLogo, 'data:image/png;base64,AA==')
  assert.equal(draft.companyLogo, loaded.source, 'saved draft keeps its SVG')
  assert.equal(loaded.getDraws(), 1, 'downloaded SVG is converted once before creating the PDF iframe')
  assert.equal(loaded.getRequested(), loaded.source)
  assert.equal(loaded.getRevoked(), 'blob:policy-logo')

  const expired = fixture({ storage: true })
  const refreshed = await expired.context.policyRasterizeSvgLogo({ companyLogo: expired.source })
  assert.equal(refreshed.companyLogo, 'data:image/png;base64,AA==')
  assert.equal(expired.getResolved(), expired.source, 'expired storage URL is refreshed through the active session')
  assert.equal(expired.getRequested(), expired.fresh, 'PDF fetches the refreshed signed URL')

  const png = { companyLogo: 'https://example.test/company.png' }
  assert.equal(await loaded.context.policyRasterizeSvgLogo(png), png, 'PNG logos pass through unchanged')
  const failure = fixture({ tainted: true })
  await assert.rejects(failure.context.policyRasterizeSvgLogo({ companyLogo: failure.source }), /No se pudo preparar el logo para el PDF/)
  const unavailable = fixture({ status: 400 })
  await assert.rejects(unavailable.context.policyRasterizeSvgLogo({ companyLogo: unavailable.source }), /El servidor respondió 400/)
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
  const pdfSource = html.slice(end, html.indexOf('async function policyDownloadPdf()', end))
  assert.match(pdfSource, /window\.PolicyLocalPdf\.generate\(p,onProgress\)/)
  const local = fs.readFileSync(path.join(__dirname, '../../js/policy-pdf-local.js'), 'utf8')
  assert.match(local, /policyPageHtml\(p\)/)
  assert.match(local, /policyPaginateDom\(doc,host\)/)
  assert.match(local, /canvas:pdf\.canvas/)
  assert.match(local, /pdf\.addFont/)
  assert.match(local, /comments:\[\]/)
  assert.match(local, /frame\?\.remove\(\);busy=false/)
  assert.doesNotMatch(local, /pdf\.addImage|splitTextToSize|Authorization|policy-export-config/)
  assert.doesNotMatch(pdfSource, /policyDisplayDate/)
  assert.doesNotMatch(pdfSource, /html2canvas/)
  assert.doesNotMatch(pdfSource, /canvas\.toDataURL\('image\/jpeg'/)
  assert.match(html, /companyLogo:policyDurableAssetUrl\(seed\.companyLogo\)/)
  assert.match(html, /_policyCurrent\.companyLogo=policyDurableAssetUrl\(company\?\.logo_url\)/)
  assert.match(html, /function policyExportProgress\(active,title=/)
  assert.match(html, /if\(!_policyCurrent\|\|_policyPdfBusy\)return/)
  assert.match(local, /Página \$\{i\+1\} de \$\{pages\.length\}/)
  assert.match(html, /policyExportProgress\(true,'PDF listo'/)
  console.log('PASS: SVG logo and PDF boxes preserve intrinsic aspect ratio')
})().catch(error => { console.error(error); process.exitCode = 1 })
