const assert = require('node:assert/strict')

function playwright() {
  const candidates = [process.env.PLAYWRIGHT_CORE, '/tmp/signage-playwright/node_modules/playwright-core', 'playwright-core'].filter(Boolean)
  for (const candidate of candidates) { try { return require(candidate) } catch {} }
  throw new Error('Playwright Core no está instalado. Define PLAYWRIGHT_CORE con su ruta.')
}

;(async () => {
  const { createEdgeHarness } = await import('./edge-harness.mjs')
  const harness = createEdgeHarness({ liveConfigured: true }), origin = await harness.start()
  const { chromium } = playwright()
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox','--autoplay-policy=no-user-gesture-required','--disable-features=WebRtcHideLocalIpsWithMdns'] })
  try {
    const context = await browser.newContext()
    await context.addInitScript(({origin,workspaceId,siteId}) => {
      window.SIERRA_SIGNAGE_CONFIG={enabled:true,backendUrl:origin+'/functions/v1/signage-api',allowedOrigins:[origin],workspaceId,siteId,mediaEnabled:true,liveEnabled:true}
      window.SIERRA_SIGNAGE_LOCAL_ADMIN_TOKEN='synthetic-admin-token'
      window.SIERRA_SIGNAGE_HEARTBEAT_INTERVAL=500
    },{origin,workspaceId:harness.state.workspaceId,siteId:harness.state.siteId})
    const unsupportedContext = await browser.newContext()
    await unsupportedContext.addInitScript(() => { Object.defineProperty(window, 'fetch', { value: undefined, configurable: true }) })
    const unsupported = await unsupportedContext.newPage()
    await unsupported.goto(origin + '/signage-player.html')
    await unsupported.getByText('Este iPad necesita una versión más reciente de Safari y permitir almacenamiento local para usar Pantallas.', { exact: true }).waitFor({ timeout: 5000 })
    await unsupportedContext.close()
    const clientFailure = await context.newPage()
    await clientFailure.route('**/js/signage-backend-client.js*', route => route.abort())
    await clientFailure.goto(origin + '/signage-player.html')
    await clientFailure.getByText('No se pudo cargar cliente. Toca “Intentar de nuevo”.', { exact: true }).waitFor({ timeout: 5000 })
    await clientFailure.close()
    const parseFailure = await context.newPage()
    await parseFailure.route('**/js/signage-backend-client.js*', route => route.fulfill({ contentType: 'text/javascript', body: 'const = ;' }))
    await parseFailure.goto(origin + '/signage-player.html')
    await parseFailure.getByText('Ocurrió un error al iniciar cliente. Toca “Intentar de nuevo”.', { exact: true }).waitFor({ timeout: 5000 })
    await parseFailure.close()
    const bootFailure = await context.newPage()
    await bootFailure.route('**/js/pantallas-runtime.js*', route => route.abort())
    await bootFailure.goto(origin + '/signage-player.html')
    await bootFailure.getByText('No se pudo cargar reproductor. Toca “Intentar de nuevo”.', { exact: true }).waitFor({ timeout: 5000 })
    await bootFailure.close()
    const player = await context.newPage(), admin = await context.newPage(), errors = []
    player.on('pageerror', error => errors.push(`player: ${error.message}`)); admin.on('pageerror', error => errors.push(`admin: ${error.message}`))
    await player.goto(origin + '/signage-player.html')
    assert.equal(await player.locator('#sp-build').textContent(), 'P-20261029-3')
    const code = (await player.locator('#sp-code').textContent()).trim(); assert.match(code, /^\d{6}$/)
    await admin.goto(origin + '/tests/signage/phase1-visual.html?reset=1')
    await admin.getByRole('button', { name: 'Agregar pantalla' }).first().click()
    await admin.locator('#sg-pair-code').fill(code); await admin.locator('#sg-pair-name').fill('Comedor E2E'); await admin.locator('#sg-pair-plant').fill('Planta E2E')
    await admin.getByRole('button', { name: 'Vincular pantalla' }).click(); await admin.getByText('Comedor E2E', { exact: true }).waitFor()
    await player.locator('#sp-stage').waitFor({ state: 'visible', timeout: 5000 })
    const pairingCount = harness.state.pairings.size
    await player.reload()
    await player.locator('#sp-stage').waitFor({ state: 'visible', timeout: 5000 })
    await player.getByText('Listo para mostrar contenido', { exact: true }).waitFor({ timeout: 5000 })
    assert.equal(harness.state.pairings.size, pairingCount, 'an already linked player does not request another pairing code')
    assert.equal(await player.evaluate(() => typeof SignageLiveShare), 'undefined', 'live component is not part of the player boot path')
    await admin.evaluate(async () => {
      localStorage.removeItem(SignagePhase1.STORAGE_KEY)
      signageLoadState(); renderSignageHome()
      await signageSyncRemoteDevices({ silent: false })
    })
    await admin.getByText('Comedor E2E', { exact: true }).waitFor()
    assert.equal(await admin.locator('.sg-status-connected').first().textContent(), 'Vinculada')

    await admin.getByRole('button', { name: 'Agregar contenido' }).first().click(); await admin.locator('#sg-content-title').fill('Mensaje cruzado E2E'); await admin.locator('#sg-content-body').fill('Publicado desde otro navegador.'); await admin.getByRole('button', { name: 'Guardar contenido' }).click()
    await admin.getByRole('button', { name: 'Elegir qué mostrar' }).click(); await admin.locator('.sg-publish-item').filter({ hasText: 'Mensaje cruzado E2E' }).click()
    await player.getByText('Mensaje cruzado E2E', { exact: true }).waitFor({ timeout: 7000 })
    assert.equal([...harness.state.contents.values()].find(item => item.snapshot.title === 'Mensaje cruzado E2E').status, 'approved')

    await admin.getByRole('button', { name: 'Agregar contenido' }).first().click(); await admin.locator('[data-content-type="image"]').click(); await admin.locator('#sg-content-title').fill('Imagen cargada E2E'); await admin.locator('#sg-content-alt').fill('Cuadro sintético')
    const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', 'base64')
    await admin.locator('#sg-content-file').setInputFiles({ name: 'cuadro.png', mimeType: 'image/png', buffer: png }); await admin.locator('#sg-upload-preview img').waitFor(); await admin.getByRole('button', { name: 'Guardar contenido' }).click()
    await admin.getByRole('button', { name: 'Elegir qué mostrar' }).click(); await admin.locator('.sg-publish-item').filter({ hasText: 'Imagen cargada E2E' }).click(); await player.locator('img[alt="Cuadro sintético"]').waitFor({ timeout: 7000 })

    await player.route('**/functions/v1/signage-api/player/manifest', route => route.abort())
    await player.route('**/media/**', route => route.abort())
    await player.reload(); await player.locator('img[alt="Cuadro sintético"]').waitFor({ timeout: 5000 })
    assert.match(await player.locator('#sp-connection').textContent(), /Sin conexión/)
    await player.unroute('**/functions/v1/signage-api/player/manifest')
    await player.unroute('**/media/**')

    await admin.evaluate(async () => {
      const client=signageBackendClient(), message=_signageState.contents.find(item=>item.title==='Mensaje cruzado E2E'), screen=_signageState.screens.find(item=>item.kind==='paired')
      const playlist=await client.createPlaylist({name:'Lista programada E2E',entries:[{contentId:message.backendContentId,contentRevision:message.backendRevision,durationSeconds:30}]})
      await client.createSchedule({deviceId:screen.id,playlistId:playlist.playlist.id,startsAt:new Date(Date.now()-60000).toISOString(),endsAt:new Date(Date.now()+3600000).toISOString(),priority:9})
    })
    await player.getByText('Mensaje cruzado E2E', { exact: true }).waitFor({ timeout: 7000 })

    await admin.evaluate(async () => {
      const canvas = document.createElement('canvas'); canvas.width = 320; canvas.height = 180
      const context = canvas.getContext('2d'); let frame = 0
      const draw = () => { context.fillStyle = '#007d73'; context.fillRect(0,0,320,180); context.fillStyle = '#fff'; context.font = '32px sans-serif'; context.fillText('SIERRA E2E '+frame++,35,100) }
      draw(); window.__signageE2EFrames = setInterval(draw,100)
      const stream = canvas.captureStream(10)
      const client=signageBackendClient(),runtime=await client.runtime()
      if(!runtime.liveAvailable||!runtime.iceServers.length)throw new Error('ICE runtime missing')
      window.__signageE2ESender = SignageLiveShare.createSender({ client, deviceId: _signageState.screens.find(item => item.kind === 'paired').id, iceServers:runtime.iceServers, captureProvider: async () => stream })
      await window.__signageE2ESender.start()
    })
    try { await player.locator('#sp-live-video').waitFor({ timeout: 10000 }) }
    catch (error) {
      console.error('Live bootstrap diagnostics', await player.evaluate(() => ({ component: typeof SignageLiveShare, connection: document.getElementById('sp-connection')?.textContent, content: document.getElementById('sp-content')?.textContent })), [...harness.state.live.values()], errors)
      throw error
    }
    assert.equal(await player.evaluate(() => typeof SignageLiveShare), 'object', 'live component loads on demand after a live session is assigned')
    let webrtcVideo = true
    try { await player.waitForFunction(() => document.getElementById('sp-live-video')?.readyState >= 2, null, { timeout: 10000 }) }
    catch (error) {
      const states = [await admin.evaluate(() => window.__signageE2ESender.debugState), await player.evaluate(() => window.__signageLiveReceiver?.debugState || {})]
      if (states.every(state => state.candidates === 0)) { webrtcVideo = false; console.log('WebRTC video SKIP: el entorno no expuso candidatos ICE; oferta y respuesta sí fueron intercambiadas.') }
      else { console.error('WebRTC states', ...states); throw error }
    }
    await admin.evaluate(() => { clearInterval(window.__signageE2EFrames); return window.__signageE2ESender.stop() })
    await player.getByText('Mensaje cruzado E2E', { exact: true }).waitFor({ timeout: 7000 })
    harness.state.liveConfigured=false
    await admin.getByRole('button',{name:'Compartir mi pantalla'}).click()
    await admin.getByText('Compartir pantalla requiere configurar la conexión segura ICE/TURN.').waitFor({timeout:3000})
    await new Promise(resolve=>setTimeout(resolve,700)); assert.ok(harness.state.heartbeats.length>0,'player sends heartbeat through Edge handler')
    assert.equal(errors.length, 0, errors.join('\n'))
    console.log(`Pantallas browser E2E: pairing, upload, cross-client playback and durable recovery passed; WebRTC video ${webrtcVideo ? 'passed' : 'not verified'}`)
  } finally { await browser.close(); await harness.stop() }
})().catch(error => { console.error(error); process.exit(1) })
