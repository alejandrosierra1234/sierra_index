(function (root, factory) {
  const api = factory(root)
  if (typeof module === 'object' && module.exports) module.exports = api
  root.SignagePdfPresentations = api
})(typeof globalThis !== 'undefined' ? globalThis : this, function (runtime) {
  'use strict'

  const RULES = Object.freeze({
    maxBytes: 25 * 1024 * 1024,
    maxPages: 50,
    maxEdge: 1920,
    maxTotalPixels: 80 * 1024 * 1024,
    outputType: 'image/png',
  })
  const PDFJS_BASE = runtime.document && runtime.document.currentScript && runtime.document.currentScript.src
    ? new URL('../vendor/pdfjs/', runtime.document.currentScript.src).href
    : ''

  class PdfPresentationError extends Error {
    constructor(code, message) { super(message); this.name = 'PdfPresentationError'; this.code = code }
  }

  function fail(code, message) { throw new PdfPresentationError(code, message) }
  function aborted(signal) {
    if (signal && signal.aborted) fail('PDF_CANCELLED', 'Se canceló la preparación. El PDF original no se guardó.')
  }

  function validateContainer(file, bytes) {
    const name = String(file && file.name || '')
    const type = String(file && file.type || '').toLowerCase()
    if (!/\.pdf$/i.test(name) || (type && type !== 'application/pdf')) fail('PDF_TYPE_DENIED', 'Elige un archivo PDF. PowerPoint y Keynote aún no son compatibles.')
    if (!bytes.byteLength || bytes.byteLength > RULES.maxBytes) fail('PDF_SIZE_DENIED', `El PDF debe pesar menos de ${RULES.maxBytes / 1024 / 1024} MB.`)
    const prefix = new TextDecoder('latin1').decode(bytes.slice(0, Math.min(bytes.byteLength, 1024)))
    const suffix = new TextDecoder('latin1').decode(bytes.slice(Math.max(0, bytes.byteLength - 4096)))
    if (!prefix.includes('%PDF-') || !/%%EOF\s*(?:[\x00\t\r\n ]*)$/.test(suffix)) fail('PDF_BYTES_DENIED', 'El archivo no contiene una estructura PDF válida.')
    if (/\/Encrypt\b/.test(new TextDecoder('latin1').decode(bytes))) fail('PDF_PASSWORD_DENIED', 'Los PDF protegidos con contraseña no son compatibles.')
  }

  function canvasBlob(canvas) {
    if (typeof canvas.convertToBlob === 'function') return canvas.convertToBlob({ type: RULES.outputType })
    return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('No se pudo convertir la diapositiva.')), RULES.outputType))
  }

  async function defaultLoader() {
    const pdfjs = await import(PDFJS_BASE + 'pdf.mjs')
    pdfjs.GlobalWorkerOptions.workerSrc = PDFJS_BASE + 'pdf.worker.mjs'
    return pdfjs
  }

  function defaultCanvas(width, height) {
    const canvas = runtime.document.createElement('canvas')
    canvas.width = width; canvas.height = height
    return canvas
  }

  async function inspectActiveContent(pdf) {
    const javaScript = typeof pdf.getJavaScript === 'function' ? await pdf.getJavaScript() : []
    const actions = typeof pdf.getJSActions === 'function' ? await pdf.getJSActions() : null
    if ((Array.isArray(javaScript) && javaScript.some(Boolean)) || (actions && Object.keys(actions).length)) {
      fail('PDF_ACTIVE_CONTENT_DENIED', 'El PDF contiene acciones o scripts. Exporta una copia plana antes de usarla.')
    }
  }

  async function processPdf(file, options) {
    options = options || {}
    const signal = options.signal
    const progress = value => { if (typeof options.onProgress === 'function') options.onProgress(value) }
    aborted(signal); progress({ stage: 'validating', completed: 0, total: 1 })
    const bytes = new Uint8Array(await file.arrayBuffer())
    validateContainer(file, bytes); aborted(signal)
    let loadingTask, pdf
    try {
      const pdfjs = options.pdfjs || await (options.loader || defaultLoader)()
      loadingTask = pdfjs.getDocument({ data: bytes, password: '', stopAtErrors: true, isEvalSupported: false, useSystemFonts: false })
      pdf = await loadingTask.promise
      if (!Number.isInteger(pdf.numPages) || pdf.numPages < 1 || pdf.numPages > RULES.maxPages) fail('PDF_PAGE_LIMIT', `La presentación debe tener entre 1 y ${RULES.maxPages} páginas.`)
      await inspectActiveContent(pdf)
      const slides = []
      let totalPixels = 0
      for (let index = 1; index <= pdf.numPages; index += 1) {
        aborted(signal); progress({ stage: 'rendering', completed: index - 1, total: pdf.numPages })
        const page = await pdf.getPage(index)
        const natural = page.getViewport({ scale: 1 })
        const scale = Math.min(2, RULES.maxEdge / Math.max(natural.width, natural.height))
        const viewport = page.getViewport({ scale })
        const width = Math.max(1, Math.round(viewport.width)), height = Math.max(1, Math.round(viewport.height))
        totalPixels += width * height
        if (totalPixels > RULES.maxTotalPixels) fail('PDF_PIXEL_LIMIT', 'La presentación es demasiado grande para procesarla con seguridad en este dispositivo.')
        const canvas = (options.createCanvas || defaultCanvas)(width, height)
        const context = canvas.getContext('2d', { alpha: false })
        if (!context) fail('PDF_RENDER_UNAVAILABLE', 'Este navegador no puede preparar las diapositivas.')
        await page.render({ canvasContext: context, viewport, background: '#FFFFFF' }).promise
        aborted(signal)
        const blob = await canvasBlob(canvas)
        slides.push({ index: index - 1, width, height, blob, fileName: `diapositiva-${String(index).padStart(2, '0')}.png`, alt: `Diapositiva ${index} de ${pdf.numPages}` })
        if (typeof page.cleanup === 'function') page.cleanup()
      }
      progress({ stage: 'complete', completed: pdf.numPages, total: pdf.numPages })
      return { name: String(file.name || '').replace(/\.pdf$/i, ''), pageCount: pdf.numPages, slides, originalUploaded: false }
    } catch (error) {
      if (error instanceof PdfPresentationError) throw error
      if (error && (error.name === 'PasswordException' || /password/i.test(error.message || ''))) fail('PDF_PASSWORD_DENIED', 'Los PDF protegidos con contraseña no son compatibles.')
      const wrapped = new PdfPresentationError('PDF_PARSE_DENIED', 'No pudimos leer este PDF. Exporta una copia plana e inténtalo de nuevo.')
      wrapped.cause = error
      throw wrapped
    } finally {
      if (pdf && typeof pdf.destroy === 'function') await pdf.destroy().catch(() => {})
      else if (loadingTask && typeof loadingTask.destroy === 'function') await loadingTask.destroy().catch(() => {})
    }
  }

  return { RULES, PdfPresentationError, validateContainer, processPdf }
})
