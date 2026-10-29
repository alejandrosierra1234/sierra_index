const assert = require('node:assert/strict')

function syntheticPresentationPdf() {
  const objects=[
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R 4 0 R] /Count 2 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 640 360] /Contents 5 0 R /Resources << /Font << /F1 7 0 R >> >> >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 640 360] /Contents 6 0 R /Resources << /Font << /F1 7 0 R >> >> >>',
    '<< /Length 47 >>\nstream\nBT /F1 26 Tf 72 180 Td (SIERRA pagina 1) Tj ET\nendstream',
    '<< /Length 47 >>\nstream\nBT /F1 26 Tf 72 180 Td (SIERRA pagina 2) Tj ET\nendstream',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ]
  let body='%PDF-1.4\n',offsets=[]
  objects.forEach((value,index)=>{offsets.push(Buffer.byteLength(body));body+=`${index+1} 0 obj\n${value}\nendobj\n`})
  const xref=Buffer.byteLength(body);body+=`xref\n0 ${objects.length+1}\n0000000000 65535 f \n${offsets.map(value=>String(value).padStart(10,'0')+' 00000 n ').join('\n')}\ntrailer\n<< /Size ${objects.length+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`
  return Buffer.from(body)
}

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
    await clientFailure.route(/signage-backend-client\.js/, route => route.abort())
    await clientFailure.goto(origin + '/signage-player.html')
    await clientFailure.getByText('No se pudo cargar cliente. Toca “Intentar de nuevo”.', { exact: true }).waitFor({ timeout: 5000 })
    await clientFailure.close()
    const parseFailure = await context.newPage()
    await parseFailure.route(/signage-backend-client\.js/, route => route.fulfill({ contentType: 'text/javascript', body: 'const = ;' }))
    await parseFailure.goto(origin + '/signage-player.html')
    await parseFailure.getByText('Ocurrió un error al iniciar cliente. Toca “Intentar de nuevo”.', { exact: true }).waitFor({ timeout: 5000 })
    await parseFailure.close()
    const bootFailure = await context.newPage()
    await bootFailure.route(/signage-player\.js/, route => route.abort())
    await bootFailure.goto(origin + '/signage-player.html')
    await bootFailure.getByText('No se pudo cargar reproductor. Toca “Intentar de nuevo”.', { exact: true }).waitFor({ timeout: 5000 })
    await bootFailure.close()
    const player = await context.newPage(), admin = await context.newPage(), errors = []
    player.on('pageerror', error => errors.push(`player: ${error.message}`)); admin.on('pageerror', error => errors.push(`admin: ${error.message}`))
    await player.goto(origin + '/signage-player.html')
    assert.equal(await player.locator('#sp-build').textContent(), 'P-20261029-8')
    assert.equal(await player.locator('#sp-setup').isVisible(), true, 'pairing setup is the only visible pane before enrollment')
    assert.equal(await player.locator('#sp-stage').isHidden(), true, 'playback pane stays hidden before enrollment')
    const code = (await player.locator('#sp-code').textContent()).trim(); assert.match(code, /^\d{6}$/)
    if (process.env.SIGNAGE_SCREENSHOT_DIR) await player.screenshot({ path: process.env.SIGNAGE_SCREENSHOT_DIR + '/pantallas-sierraos-pairing.png', fullPage: true })
    await admin.goto(origin + '/tests/signage/phase1-visual.html?reset=1')
    await admin.evaluate(() => localStorage.setItem(SignagePhase1.STORAGE_KEY, JSON.stringify(SignagePhase1.demoState())))
    await admin.goto(origin + '/tests/signage/phase1-visual.html')
    await admin.getByText('Se apartaron datos locales de demostración', { exact: true }).waitFor()
    assert.equal(await admin.getByText('Pantalla sintética A', { exact: true }).count(), 0, 'a connected account never renders legacy fixture screens')
    assert.equal(await admin.getByText('Mensaje sintético de bienvenida', { exact: true }).count(), 0, 'a connected account never renders legacy fixture content')
    assert.equal(await admin.evaluate(() => _signageState.archivedLocalFixtures.screens.length), 2, 'legacy fixture screens remain archived instead of being deleted')
    assert.equal(await admin.evaluate(() => _signageState.archivedLocalFixtures.contents.length), 2, 'legacy fixture content remains archived instead of being deleted')
    await admin.getByRole('button', { name: 'Crear espacio' }).first().click(); await admin.locator('#sg-space-name').fill('Sala E2E'); await admin.getByRole('button', { name: 'Crear espacio', exact: true }).last().click(); await admin.waitForFunction(() => _signageState.spaces.some(space => space.name === 'Sala E2E'))
    await admin.getByRole('button', { name: 'Agregar pantalla' }).first().click()
    await admin.locator('#sg-pair-code').fill(code); await admin.locator('#sg-pair-name').fill('Comedor E2E'); await admin.locator('.sg-space-choices .sg-choice').filter({ hasText: 'Sala E2E' }).click()
    await admin.getByRole('button', { name: 'Vincular pantalla' }).click(); await admin.getByText('Comedor E2E', { exact: true }).waitFor()
    await player.locator('#sp-stage').waitFor({ state: 'visible', timeout: 5000 })
    assert.equal(await player.locator('#sp-setup').isHidden(), true, 'pairing setup is hidden immediately after enrollment')
    const pairingCount = harness.state.pairings.size
    await player.reload()
    await player.locator('#sp-stage').waitFor({ state: 'visible', timeout: 5000 })
    assert.equal(await player.locator('#sp-setup').isHidden(), true, 'a returning enrolled player never shows the pairing pane')
    assert.equal(await player.evaluate(() => document.documentElement.scrollHeight <= window.innerHeight + 1), true, 'an enrolled player renders exactly one viewport without a hidden pairing pane below or above it')
    await player.locator('.sp-ambient h1').waitFor({ timeout: 5000 })
    assert.equal(await player.locator('.sp-ambient h1').textContent(), 'Materia que conecta.', 'idle output uses the SIERRA OS thesis with real visual evidence')
    assert.equal(await player.locator('#sp-stage button').count(), 0, 'passive ambient output never renders inoperable controls')
    if (process.env.SIGNAGE_SCREENSHOT_DIR) await player.screenshot({ path: process.env.SIGNAGE_SCREENSHOT_DIR + '/pantallas-sierraos-ambient.png', fullPage: true })
    assert.equal(harness.state.pairings.size, pairingCount, 'an already linked player does not request another pairing code')
    assert.equal(await player.evaluate(() => typeof SignageLiveShare), 'undefined', 'live component is not part of the player boot path')
    await admin.evaluate(async () => {
      localStorage.removeItem(SignagePhase1.STORAGE_KEY)
      signageLoadState(); renderSignageHome()
      await signageSyncRemoteDevices({ silent: false })
    })
    await admin.getByText('Comedor E2E', { exact: true }).waitFor()
    assert.match(await admin.locator('.sg-state').first().textContent(), /Reproductor conectado|Reproducción reportada/)
    await admin.locator('.sg-screen-tile').filter({ hasText: 'Comedor E2E' }).getByRole('button', { name: 'Configurar' }).click(); await admin.locator('#sg-edit-screen-name').fill('Comedor norte E2E'); await admin.getByRole('button', { name: 'Guardar cambios' }).click(); await admin.getByText('Comedor norte E2E', { exact: true }).waitFor()

    await admin.getByRole('button', { name: 'Preparar bienvenida' }).first().click()
    await admin.locator('#sg-welcome-display').fill('Invitado de muestra')
    await admin.locator('#sg-welcome-subtitle').fill('Visita de prueba')
    await admin.locator('input[name="welcome-device"]').check()
    if (process.env.SIGNAGE_SCREENSHOT_DIR) {
      await admin.setViewportSize({ width: 1440, height: 900 }); await admin.screenshot({ path: process.env.SIGNAGE_SCREENSHOT_DIR + '/pantallas-welcome-desktop.png', fullPage: true })
      await admin.setViewportSize({ width: 1024, height: 900 }); await admin.screenshot({ path: process.env.SIGNAGE_SCREENSHOT_DIR + '/pantallas-welcome-tablet.png', fullPage: true })
      await admin.setViewportSize({ width: 390, height: 844 }); await admin.screenshot({ path: process.env.SIGNAGE_SCREENSHOT_DIR + '/pantallas-welcome-mobile.png', fullPage: true })
      await admin.emulateMedia({ reducedMotion: 'reduce' }); await admin.screenshot({ path: process.env.SIGNAGE_SCREENSHOT_DIR + '/pantallas-welcome-reduced-motion.png', fullPage: true })
      await admin.emulateMedia({ reducedMotion: 'no-preference' }); await admin.setViewportSize({ width: 1440, height: 900 })
    }
    await admin.getByRole('button', { name: 'Mostrar ahora' }).click()
    await player.locator('.sp-welcome').waitFor({ timeout: 7000 })
    assert.equal(await player.locator('.sp-welcome h1').textContent(), 'Invitado de muestra', 'welcome preview fields reach the real player surface')
    if (process.env.SIGNAGE_SCREENSHOT_DIR) await player.screenshot({ path: process.env.SIGNAGE_SCREENSHOT_DIR + '/pantallas-sierraos-welcome.png', fullPage: true })
    await admin.locator('[data-sg-view="sessions"]').click()
    await admin.getByRole('button', { name: 'Finalizar y regresar' }).click()
    await player.locator('.sp-ambient h1').waitFor({ timeout: 7000 })
    assert.equal(await player.locator('.sp-ambient h1').textContent(), 'Materia que conecta.', 'finishing a welcome returns to the prior ambient output')

    await admin.getByRole('button', { name: 'Preparar PDF' }).click()
    await admin.locator('#sg-pdf-name').fill('Presentación PDF E2E')
    await admin.locator('#sg-pdf-file').setInputFiles({ name:'presentacion-sintetica.pdf', mimeType:'application/pdf', buffer:syntheticPresentationPdf() })
    try { await admin.getByText('2 diapositivas listas para revisar.', { exact:true }).waitFor({ timeout:15000 }) }
    catch(error){const direct=await admin.evaluate(async base64=>{const bytes=Uint8Array.from(atob(base64),char=>char.charCodeAt(0));try{await SignagePdfPresentations.processPdf(new File([bytes],'directo.pdf',{type:'application/pdf'}));return{ok:true}}catch(failure){return{code:failure.code,message:failure.message,cause:failure.cause&&`${failure.cause.name}: ${failure.cause.message}`}}},syntheticPresentationPdf().toString('base64'));console.error('PDF diagnostics',await admin.evaluate(()=>({progress:document.getElementById('sg-pdf-progress')?.textContent,error:document.getElementById('sg-pdf-error')?.textContent,pdfjsBase:window.SignagePdfPresentations?true:false})),direct,errors);throw error}
    assert.equal(await admin.locator('.sg-pdf-thumbs button').count(),2,'the browser renders a faithful thumbnail for every synthetic PDF page')
    await admin.locator('input[name="presentation-device"]').check()
    if(process.env.SIGNAGE_SCREENSHOT_DIR){
      await admin.setViewportSize({width:1440,height:900});await admin.screenshot({path:process.env.SIGNAGE_SCREENSHOT_DIR+'/pantallas-pdf-desktop.png',fullPage:true})
      await admin.setViewportSize({width:1024,height:900});await admin.screenshot({path:process.env.SIGNAGE_SCREENSHOT_DIR+'/pantallas-pdf-tablet.png',fullPage:true})
      await admin.setViewportSize({width:390,height:844});await admin.screenshot({path:process.env.SIGNAGE_SCREENSHOT_DIR+'/pantallas-pdf-mobile.png',fullPage:true})
      await admin.emulateMedia({reducedMotion:'reduce'});await admin.screenshot({path:process.env.SIGNAGE_SCREENSHOT_DIR+'/pantallas-pdf-reduced-motion.png',fullPage:true});await admin.emulateMedia({reducedMotion:'no-preference'});await admin.setViewportSize({width:1440,height:900})
    }
    await admin.getByRole('button',{name:'Mostrar ahora'}).click()
    await player.locator('.sp-presentation img').waitFor({timeout:15000})
    assert.equal([...harness.state.assets.values()].filter(asset=>asset.type==='image/png').length,2,'only the two derived PNG slides are stored')
    assert.equal([...harness.state.assets.values()].some(asset=>asset.type==='application/pdf'),false,'the original PDF never reaches storage')
    assert.equal(await player.locator('.sp-presentation-status').textContent(),'1 / 2','presentation starts on the first slide')
    await admin.locator('[data-sg-view="sessions"]').click()
    const presentationCard=admin.locator('.sg-session-card').filter({hasText:'Presentación PDF E2E'})
    await presentationCard.getByRole('button',{name:'Siguiente'}).click()
    await player.getByText('2 / 2',{exact:true}).waitFor({timeout:7000})
    const presentationContext=await browser.newContext()
    await presentationContext.addInitScript(({origin,workspaceId,siteId})=>{window.SIERRA_SIGNAGE_CONFIG={enabled:true,backendUrl:origin+'/functions/v1/signage-api',allowedOrigins:[origin],workspaceId,siteId,mediaEnabled:true,liveEnabled:false};window.SIERRA_SIGNAGE_LOCAL_ADMIN_TOKEN='synthetic-admin-token'},{origin,workspaceId:harness.state.workspaceId,siteId:harness.state.siteId})
    const presentationAdmin=await presentationContext.newPage();await presentationAdmin.goto(origin+'/tests/signage/phase1-visual.html?reset=1');await presentationAdmin.locator('[data-sg-view="sessions"]').click()
    await presentationAdmin.getByText(/Diapositiva 2 de 2/i).waitFor({timeout:5000})
    assert.equal(await presentationAdmin.locator('.sg-session-card').filter({hasText:'Presentación PDF E2E'}).getByRole('button',{name:'Siguiente'}).isDisabled(),true,'a second admin reconstructs the current slide and its bounds')
    await player.route('**/functions/v1/signage-api/player/manifest',route=>route.abort());await player.route('**/media/**',route=>route.abort());await player.reload();await player.getByText('2 / 2',{exact:true}).waitFor({timeout:7000});await player.unroute('**/functions/v1/signage-api/player/manifest');await player.unroute('**/media/**')
    await presentationAdmin.locator('.sg-session-card').filter({hasText:'Presentación PDF E2E'}).getByRole('button',{name:'Finalizar y regresar'}).click();await player.locator('.sp-ambient h1').waitFor({timeout:7000});await presentationContext.close()
    assert.equal(await player.locator('.sp-ambient h1').textContent(),'Materia que conecta.','finishing a presentation restores the prior valid output')

    await player.evaluate(() => { window.__signageOriginalPlay = HTMLMediaElement.prototype.play; HTMLMediaElement.prototype.play = () => Promise.reject(new Error('synthetic autoplay denial')) })
    await admin.locator('[data-sg-view="content"]').click()
    await admin.locator('.sg-content-card').filter({ hasText: 'Proceso SIERRA' }).getByRole('button', { name: 'Mostrar en…' }).click()
    await admin.locator('.sg-destination').filter({ hasText: 'Comedor norte E2E' }).click()
    await admin.getByRole('button', { name: 'Mostrar en 1 pantalla', exact: true }).click()
    await player.getByText('VIDEO EN PAUSA', { exact: true }).waitFor({ timeout: 7000 })
    await player.getByRole('heading', { name: 'Proceso SIERRA', exact: true }).waitFor()
    assert.equal(await player.getByText('Materia que conecta.', { exact: true }).count(), 0, 'autoplay denial keeps the selected piece instead of replacing it with generic ambience')
    assert.equal(await player.locator('#sp-connection').isHidden(), true, 'operational status never overlays selected image or video content')
    assert.equal(await player.locator('#sp-stage button').count(), 0, 'video fallback is passive and exposes no dead controls')
    if (process.env.SIGNAGE_SCREENSHOT_DIR) await player.screenshot({ path: process.env.SIGNAGE_SCREENSHOT_DIR + '/pantallas-sierraos-video-error.png', fullPage: true })
    await player.evaluate(() => { HTMLMediaElement.prototype.play = window.__signageOriginalPlay; delete window.__signageOriginalPlay })
    await admin.getByRole('button', { name: 'Listo', exact: true }).click()
    await admin.locator('[data-sg-view="spaces"]').click()

    await admin.getByRole('button', { name: 'Agregar pantalla' }).first().click(); await admin.getByRole('button', { name: 'Usar modo de prueba' }).click(); await admin.locator('#sg-screen-name').fill('Pantalla local E2E'); await admin.locator('.sg-space-choices .sg-choice').filter({ hasText: 'Sala E2E' }).click(); await admin.getByRole('button', { name: 'Agregar pantalla', exact: true }).last().click(); await admin.getByText('Pantalla local E2E', { exact: true }).waitFor()

    await admin.locator('[data-sg-view="content"]').click(); await admin.getByRole('button', { name: 'Agregar contenido' }).click(); await admin.locator('#sg-content-title').fill('Mensaje cruzado E2E'); await admin.locator('#sg-content-body').fill('Publicado desde otro navegador.'); await admin.getByRole('button', { name: 'Guardar contenido' }).click(); await admin.locator('#sd-overlay').waitFor({ state: 'hidden' }); await admin.locator('[data-sg-view="spaces"]').click()
    for (const selector of await admin.locator('.sg-screen-select').all()) {
      const beforeScroll = await admin.evaluate(() => window.scrollY)
      await selector.click()
      assert.equal(await selector.evaluate(element => document.activeElement === element), true, 'screen selection preserves keyboard focus')
      assert.equal(await admin.evaluate(() => window.scrollY), beforeScroll, 'screen selection preserves page position')
    }
    await admin.locator('.sg-selection-bar').getByRole('button', { name: 'Mostrar contenido' }).click(); await admin.locator('.sg-publish-item').filter({ hasText: 'Mensaje cruzado E2E' }).click()
    await player.getByText('Mensaje cruzado E2E', { exact: true }).waitFor({ timeout: 7000 })
    await player.getByText('SIERRA OS · MENSAJE', { exact: true }).waitFor()
    if (process.env.SIGNAGE_SCREENSHOT_DIR) await player.screenshot({ path: process.env.SIGNAGE_SCREENSHOT_DIR + '/pantallas-sierraos-message.png', fullPage: true })
    await admin.getByText('2 completadas', { exact: true }).waitFor()
    await admin.getByRole('button', { name: 'Listo', exact: true }).click()
    const pairedTile = admin.locator('.sg-screen-tile').filter({ hasText: 'Comedor norte E2E' })
    await pairedTile.locator('.sg-screen-select').click()
    await admin.locator('[data-sg-view="content"]').click()
    await admin.getByRole('heading', { name: 'Contenido', exact: true }).waitFor()
    await admin.locator('.sg-content-card').filter({ hasText: 'Mensaje cruzado E2E' }).getByRole('button', { name: 'Mostrar en…' }).click()
    assert.equal(await admin.locator('.sg-destination.selected').count(), 1, 'content-first flow reuses the current screen selection')
    assert.equal(await admin.getByRole('button', { name: 'Revisar y mostrar' }).count(), 0, 'content-first flow has no redundant review step')
    await admin.getByRole('button', { name: 'Mostrar en 1 pantalla', exact: true }).click()
    await admin.getByText('1 completada', { exact: true }).waitFor()
    await admin.getByRole('button', { name: 'Listo', exact: true }).click()
    const secondContext = await browser.newContext()
    await secondContext.addInitScript(({origin,workspaceId,siteId}) => {
      window.SIERRA_SIGNAGE_CONFIG={enabled:true,backendUrl:origin+'/functions/v1/signage-api',allowedOrigins:[origin],workspaceId,siteId,mediaEnabled:true,liveEnabled:true}
      window.SIERRA_SIGNAGE_LOCAL_ADMIN_TOKEN='synthetic-admin-token'
    },{origin,workspaceId:harness.state.workspaceId,siteId:harness.state.siteId})
    const secondAdmin = await secondContext.newPage()
    await secondAdmin.goto(origin + '/tests/signage/phase1-visual.html?reset=1')
    await secondAdmin.locator('[data-sg-view="content"]').click()
    await secondAdmin.getByRole('heading', { name: 'Mensaje cruzado E2E', exact: true }).waitFor({ timeout: 5000 })
    assert.equal(await secondAdmin.locator('.sg-content-card').filter({ hasText: 'Mensaje cruzado E2E' }).getByText('Central', { exact: true }).count(), 1, 'a separate browser session reconstructs central content')
    await secondAdmin.getByRole('searchbox', { name: 'Buscar contenido' }).fill('sin coincidencias')
    assert.equal(await secondAdmin.locator('.sg-content-card:visible').count(), 0, 'content search filters without losing the current view')
    await secondAdmin.getByRole('searchbox', { name: 'Buscar contenido' }).fill('Mensaje cruzado')
    assert.equal(await secondAdmin.locator('.sg-content-card:visible').count(), 1, 'content search finds central content')
    await secondAdmin.locator('[data-sg-view="sessions"]').click()
    await secondAdmin.getByText('Actividad y programación', { exact: true }).click()
    await secondAdmin.getByText('Orden de publicación aceptada', { exact: true }).first().waitFor()
    await secondAdmin.locator('[data-sg-view="spaces"]').click()
    await secondAdmin.getByText('Comedor norte E2E', { exact: true }).waitFor()
    assert.match(await secondAdmin.locator('.sg-screen-tile').filter({ hasText: 'Comedor norte E2E' }).locator('.sg-state').textContent(), /Orden aceptada|Reproducción reportada/)
    await secondContext.close()
    if (process.env.SIGNAGE_SCREENSHOT_DIR) {
      await admin.setViewportSize({ width: 1440, height: 900 }); await admin.screenshot({ path: process.env.SIGNAGE_SCREENSHOT_DIR + '/pantallas-content-desktop.png', fullPage: true })
      await admin.locator('[data-sg-view="spaces"]').click()
      await admin.setViewportSize({ width: 1440, height: 900 }); await admin.screenshot({ path: process.env.SIGNAGE_SCREENSHOT_DIR + '/pantallas-management-desktop.png', fullPage: true })
      await admin.setViewportSize({ width: 1024, height: 900 }); await admin.screenshot({ path: process.env.SIGNAGE_SCREENSHOT_DIR + '/pantallas-management-tablet.png', fullPage: true })
      await admin.setViewportSize({ width: 390, height: 844 }); await admin.screenshot({ path: process.env.SIGNAGE_SCREENSHOT_DIR + '/pantallas-management-mobile.png', fullPage: true })
      await admin.setViewportSize({ width: 1280, height: 720 })
    } else await admin.locator('[data-sg-view="spaces"]').click()
    await admin.goto(origin + '/tests/signage/phase1-visual.html'); await admin.locator('[data-sg-view="spaces"]').click(); await admin.getByText('Comedor norte E2E', { exact: true }).waitFor(); await admin.getByText('Sala E2E', { exact: true }).first().waitFor()
    const pairedDeviceId = await admin.evaluate(() => _signageState.screens.find(item => item.kind === 'paired').id)
    await admin.route(`**/admin/devices/${pairedDeviceId}/publish`, route => route.abort())
    for (const selector of await admin.locator('.sg-screen-select').all()) await selector.click()
    await admin.locator('.sg-selection-bar').getByRole('button', { name: 'Mostrar contenido' }).click(); await admin.locator('.sg-publish-item').filter({ hasText: 'Mensaje cruzado E2E' }).click(); await admin.getByText('1 completada', { exact: true }).waitFor(); await admin.getByText('1 no se pudo actualizar', { exact: true }).waitFor(); await admin.unroute(`**/admin/devices/${pairedDeviceId}/publish`); await admin.getByRole('button', { name: 'Reintentar 1 pantalla', exact: true }).click(); await admin.getByText('1 completada', { exact: true }).waitFor(); await admin.getByRole('button', { name: 'Listo', exact: true }).click()

    const restButton = admin.locator('.sg-screen-tile').filter({ hasText: 'Comedor norte E2E' }).getByRole('button', { name: 'Dejar en reposo', exact: true })
    await restButton.click()
    await admin.getByRole('dialog').getByRole('button', { name: 'Cancelar', exact: true }).click()
    assert.equal(await restButton.evaluate(element => document.activeElement === element), true, 'page confirmation restores focus after cancellation')
    assert.equal(await admin.locator('.sg-state').filter({ hasText: 'En reposo' }).count(), 0, 'cancelling the page confirmation keeps output unchanged')
    await restButton.click()
    await admin.getByRole('dialog').getByRole('button', { name: 'Dejar en reposo', exact: true }).click()
    await admin.getByText('En reposo', { exact: true }).first().waitFor()
    await player.locator('.sp-ambient h1').waitFor({ timeout: 7000 })
    assert.equal(await player.locator('.sp-ambient h1').textContent(), 'Una pausa que también comunica.', 'stopped output has a distinct SIERRA OS rest state')
    if (process.env.SIGNAGE_SCREENSHOT_DIR) await player.screenshot({ path: process.env.SIGNAGE_SCREENSHOT_DIR + '/pantallas-sierraos-rest.png', fullPage: true })
    assert.equal([...harness.state.contents.values()].length > 0, true, 'stopping output preserves content')
    await player.reload()
    await player.locator('.sp-ambient h1').waitFor({ timeout: 7000 })
    await admin.locator('.sg-screen-tile').filter({ hasText: 'Comedor norte E2E' }).getByRole('button', { name: 'Mostrar', exact: true }).click()
    await admin.locator('.sg-publish-item').filter({ hasText: 'Mensaje cruzado E2E' }).click()
    await player.getByText('Mensaje cruzado E2E', { exact: true }).waitFor({ timeout: 7000 })
    await admin.getByRole('button', { name: 'Listo', exact: true }).click()
    assert.equal([...harness.state.contents.values()].find(item => item.snapshot.title === 'Mensaje cruzado E2E').status, 'approved')

    await admin.locator('[data-sg-view="content"]').click(); await admin.getByRole('button', { name: 'Agregar contenido' }).click(); await admin.locator('[data-content-type="image"]').click(); await admin.locator('#sg-content-title').fill('Imagen cargada E2E'); await admin.locator('#sg-content-alt').fill('Cuadro sintético')
    const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', 'base64')
    await admin.locator('#sg-content-file').setInputFiles({ name: 'trampa.jpg', mimeType: 'image/png', buffer: png }); await admin.getByRole('button', { name: 'Guardar contenido' }).click(); await admin.locator('#sg-content-file-error').getByText('La extensión no coincide con el formato declarado por el archivo.', { exact: true }).waitFor()
    await admin.locator('#sg-content-file').setInputFiles({ name: 'cuadro.png', mimeType: 'image/png', buffer: png }); await admin.locator('#sg-upload-preview img').waitFor(); await admin.getByRole('button', { name: 'Guardar contenido' }).click(); await admin.locator('[data-sg-view="spaces"]').click()
    await admin.locator('.sg-screen-tile').filter({ hasText: 'Comedor norte E2E' }).getByRole('button', { name: 'Mostrar', exact: true }).click(); await admin.locator('.sg-publish-item').filter({ hasText: 'Imagen cargada E2E' }).click(); await player.locator('img[alt="Cuadro sintético"]').waitFor({ timeout: 7000 }); await admin.getByRole('button', { name: 'Listo', exact: true }).click()
    const mediaContext = await browser.newContext()
    await mediaContext.addInitScript(({origin,workspaceId,siteId}) => { window.SIERRA_SIGNAGE_CONFIG={enabled:true,backendUrl:origin+'/functions/v1/signage-api',allowedOrigins:[origin],workspaceId,siteId,mediaEnabled:true,liveEnabled:false};window.SIERRA_SIGNAGE_LOCAL_ADMIN_TOKEN='synthetic-admin-token' },{origin,workspaceId:harness.state.workspaceId,siteId:harness.state.siteId})
    const mediaAdmin=await mediaContext.newPage();await mediaAdmin.goto(origin+'/tests/signage/phase1-visual.html?reset=1');await mediaAdmin.locator('[data-sg-view="content"]').click()
    const mediaCard=mediaAdmin.locator('.sg-content-card').filter({hasText:'Imagen cargada E2E'});await mediaCard.getByText('Central',{exact:true}).waitFor();await mediaCard.locator('img').waitFor();assert.equal(await mediaCard.locator('img').evaluate(image=>image.naturalWidth),1,'second browser receives a short-lived signed thumbnail')
    await mediaContext.close()

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
    const programmingContext = await browser.newContext()
    await programmingContext.addInitScript(({origin,workspaceId,siteId}) => {
      window.SIERRA_SIGNAGE_CONFIG={enabled:true,backendUrl:origin+'/functions/v1/signage-api',allowedOrigins:[origin],workspaceId,siteId,mediaEnabled:true,liveEnabled:true}
      window.SIERRA_SIGNAGE_LOCAL_ADMIN_TOKEN='synthetic-admin-token'
    },{origin,workspaceId:harness.state.workspaceId,siteId:harness.state.siteId})
    const programmingAdmin = await programmingContext.newPage()
    await programmingAdmin.goto(origin + '/tests/signage/phase1-visual.html?reset=1')
    await programmingAdmin.waitForFunction(() => _signageState.playlists.some(item => item.name === 'Lista programada E2E' && item.central) && _signageState.schedules.some(item => item.central), null, { timeout: 5000 })
    assert.equal(await programmingAdmin.evaluate(() => _signageState.playlists.find(item => item.name === 'Lista programada E2E').entries[0].durationSeconds), 30, 'a separate browser reconstructs the central playlist revision')
    assert.equal(await programmingAdmin.evaluate(() => _signageState.schedules.find(item => item.central).priority), 9, 'a separate browser reconstructs the central schedule')
    await programmingContext.close()
    await player.getByText('Mensaje cruzado E2E', { exact: true }).waitFor({ timeout: 7000 })

    await admin.locator('.sg-screen-tile').filter({ hasText: 'Comedor norte E2E' }).getByRole('button', { name: 'Dejar en reposo', exact: true }).click()
    await admin.getByRole('dialog').getByRole('button', { name: 'Dejar en reposo', exact: true }).click()
    await player.locator('.sp-ambient h1').waitFor({ timeout: 7000 })
    assert.equal([...harness.state.schedules.values()].length, 1, 'stopping output preserves schedules')
    await admin.locator('.sg-screen-tile').filter({ hasText: 'Comedor norte E2E' }).getByRole('button', { name: 'Mostrar', exact: true }).click()
    await admin.locator('.sg-publish-item').filter({ hasText: 'Mensaje cruzado E2E' }).click()
    await player.getByText('Mensaje cruzado E2E', { exact: true }).waitFor({ timeout: 7000 })
    await admin.getByRole('button', { name: 'Listo', exact: true }).click()

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
    await admin.evaluate(() => signageStartLive(_signageState.screens.find(item => item.kind === 'paired').id))
    await admin.getByText('Compartir pantalla requiere configurar la conexión segura ICE/TURN.').waitFor({timeout:3000})
    await new Promise(resolve=>setTimeout(resolve,700)); assert.ok(harness.state.heartbeats.length>0,'player sends heartbeat through Edge handler')
    assert.equal(errors.length, 0, errors.join('\n'))
    console.log(`Pantallas browser E2E: pairing, upload, cross-client playback and durable recovery passed; WebRTC video ${webrtcVideo ? 'passed' : 'not verified'}`)
  } finally { await browser.close(); await harness.stop() }
})().catch(error => { console.error(error); process.exit(1) })
