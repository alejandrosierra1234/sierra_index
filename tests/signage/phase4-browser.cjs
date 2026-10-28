const assert = require('node:assert/strict')
const { once } = require('node:events')
const { createServer } = require('./local-backend.cjs')

function playwright() {
  const candidates = [process.env.PLAYWRIGHT_CORE, '/tmp/signage-playwright/node_modules/playwright-core', 'playwright-core'].filter(Boolean)
  for (const candidate of candidates) { try { return require(candidate) } catch {} }
  throw new Error('Playwright Core no está instalado. Define PLAYWRIGHT_CORE con su ruta.')
}

;(async () => {
  const { server } = createServer(); server.listen(0, '127.0.0.1'); await once(server, 'listening')
  const origin = `http://127.0.0.1:${server.address().port}`
  const { chromium } = playwright()
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox','--autoplay-policy=no-user-gesture-required','--disable-features=WebRtcHideLocalIpsWithMdns'] })
  try {
    const context = await browser.newContext()
    const player = await context.newPage(), admin = await context.newPage(), errors = []
    player.on('pageerror', error => errors.push(`player: ${error.message}`)); admin.on('pageerror', error => errors.push(`admin: ${error.message}`))
    await player.goto(origin + '/signage-player.html')
    const code = (await player.locator('#sp-code').textContent()).trim(); assert.match(code, /^\d{6}$/)
    await admin.goto(origin + '/tests/signage/phase1-visual.html?reset=1&backend=1')
    await admin.getByRole('button', { name: 'Agregar pantalla' }).first().click()
    await admin.locator('#sg-pair-code').fill(code); await admin.locator('#sg-pair-name').fill('Comedor E2E'); await admin.locator('#sg-pair-plant').fill('Planta E2E')
    await admin.getByRole('button', { name: 'Vincular pantalla' }).click(); await admin.getByText('Comedor E2E', { exact: true }).waitFor()
    await player.locator('#sp-stage').waitFor({ state: 'visible', timeout: 5000 })

    await admin.getByRole('button', { name: 'Agregar contenido' }).first().click(); await admin.locator('#sg-content-title').fill('Mensaje cruzado E2E'); await admin.locator('#sg-content-body').fill('Publicado desde otro navegador.'); await admin.getByRole('button', { name: 'Guardar contenido' }).click()
    await admin.getByRole('button', { name: 'Elegir qué mostrar' }).click(); await admin.locator('.sg-publish-item').filter({ hasText: 'Mensaje cruzado E2E' }).click()
    await player.getByText('Mensaje cruzado E2E', { exact: true }).waitFor({ timeout: 7000 })

    await admin.getByRole('button', { name: 'Agregar contenido' }).first().click(); await admin.locator('[data-content-type="image"]').click(); await admin.locator('#sg-content-title').fill('Imagen cargada E2E'); await admin.locator('#sg-content-alt').fill('Cuadro sintético')
    const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', 'base64')
    await admin.locator('#sg-content-file').setInputFiles({ name: 'cuadro.png', mimeType: 'image/png', buffer: png }); await admin.locator('#sg-upload-preview img').waitFor(); await admin.getByRole('button', { name: 'Guardar contenido' }).click()
    await admin.getByRole('button', { name: 'Elegir qué mostrar' }).click(); await admin.locator('.sg-publish-item').filter({ hasText: 'Imagen cargada E2E' }).click(); await player.locator('img[alt="Cuadro sintético"]').waitFor({ timeout: 7000 })

    await player.route('**/api/signage/player/manifest', route => route.abort())
    await player.route('**/media/**', route => route.abort())
    await player.reload(); await player.locator('img[alt="Cuadro sintético"]').waitFor({ timeout: 5000 })
    assert.match(await player.locator('#sp-connection').textContent(), /Sin conexión/)
    await player.unroute('**/api/signage/player/manifest')
    await player.unroute('**/media/**')

    await admin.evaluate(async () => {
      const canvas = document.createElement('canvas'); canvas.width = 320; canvas.height = 180
      const context = canvas.getContext('2d'); let frame = 0
      const draw = () => { context.fillStyle = '#007d73'; context.fillRect(0,0,320,180); context.fillStyle = '#fff'; context.font = '32px sans-serif'; context.fillText('SIERRA E2E '+frame++,35,100) }
      draw(); window.__signageE2EFrames = setInterval(draw,100)
      const stream = canvas.captureStream(10)
      window.__signageE2ESender = SignageLiveShare.createSender({ client: signageBackendClient(), deviceId: _signageState.screens.find(item => item.kind === 'paired').id, captureProvider: async () => stream })
      await window.__signageE2ESender.start()
    })
    await player.locator('#sp-live-video').waitFor({ timeout: 10000 })
    let webrtcVideo = true
    try { await player.waitForFunction(() => document.getElementById('sp-live-video')?.readyState >= 2, null, { timeout: 10000 }) }
    catch (error) {
      const states = [await admin.evaluate(() => window.__signageE2ESender.debugState), await player.evaluate(() => window.__signageLiveReceiver?.debugState || {})]
      if (states.every(state => state.candidates === 0)) { webrtcVideo = false; console.log('WebRTC video SKIP: el entorno no expuso candidatos ICE; oferta y respuesta sí fueron intercambiadas.') }
      else { console.error('WebRTC states', ...states); throw error }
    }
    await admin.evaluate(() => { clearInterval(window.__signageE2EFrames); return window.__signageE2ESender.stop() })
    await player.locator('img[alt="Cuadro sintético"]').waitFor({ timeout: 7000 })
    assert.equal(errors.length, 0, errors.join('\n'))
    console.log(`Pantallas browser E2E: pairing, upload, cross-client playback and durable recovery passed; WebRTC video ${webrtcVideo ? 'passed' : 'not verified'}`)
  } finally {
    await browser.close(); server.close(); await once(server, 'close')
  }
})().catch(error => { console.error(error); process.exit(1) })
