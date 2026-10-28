const assert = require('node:assert/strict')
const { once } = require('node:events')
const { createServer, ADMIN_TOKEN } = require('./local-backend.cjs')
const Client = require('../../js/signage-backend-client.js')

;(async () => {
  const { server, state } = createServer()
  server.listen(0, '127.0.0.1'); await once(server, 'listening')
  const base = `http://127.0.0.1:${server.address().port}/api/signage`
  let assertions = 0
  const eq = (a,b,m) => { assert.equal(a,b,m); assertions += 1 }
  const ok = (v,m) => { assert.ok(v,m); assertions += 1 }
  try {
    const playerSetup = Client.createClient({ baseUrl: base, currentOrigin: base })
    const admin = Client.createClient({ baseUrl: base, currentOrigin: base, tokenProvider: () => ADMIN_TOKEN })
    eq((await admin.health()).mode, 'local-ephemeral', 'backend identifies ephemeral local mode')
    assert.throws(() => Client.createClient({ baseUrl: 'https://attacker.invalid', currentOrigin: base }), /mismo origen|local/); assertions += 1

    const pairing = await playerSetup.createPairing()
    eq(pairing.code.length, 6, 'pairing code is human sized')
    eq((await playerSetup.claimPairing(pairing.claimToken)).state, 'pending', 'player waits without an admin claim')
    const paired = await admin.pairDevice({ code: pairing.code, name: 'Comedor E2E', plant: 'Planta E2E', profile: 'Horizontal · 1920 × 1080' })
    ok(paired.device.id, 'admin receives device identity')
    eq(Object.hasOwn(paired.device, 'deviceToken'), false, 'admin never receives player secret')
    const claim = await playerSetup.claimPairing(pairing.claimToken)
    eq(claim.state, 'paired', 'player receives claimed result')
    ok(claim.deviceToken.length >= 40, 'player token has high entropy')
    await assert.rejects(() => playerSetup.claimPairing(pairing.claimToken), error => error.status === 410); assertions += 1
    ok(![...state.devices.values()][0].tokenHash.includes(claim.deviceToken), 'backend stores only token hash')

    const png = new Blob([Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a,0,0,0,0])], { type: 'image/png' })
    Object.defineProperty(png, 'name', { value: 'imagen-e2e.png' })
    const uploaded = await admin.upload(png)
    eq(uploaded.upload.contentType, 'image/png', 'upload validates file signature')
    const image = await admin.createContent({ type: 'image', title: 'Imagen E2E', alt: 'Imagen sintética', uploadId: uploaded.upload.id })
    eq(image.content.type, 'image', 'uploaded image becomes content')
    const link = await admin.createContent({ type: 'link', title: 'Enlace E2E', body: 'Enlace seguro', url: 'https://example.invalid/pantallas' })
    eq(link.content.displayMode, 'link-card', 'links use safe card fallback instead of arbitrary iframe')
    await assert.rejects(() => admin.createContent({ type: 'link', title: 'Enlace malo', url: 'http://example.invalid' }), error => error.status === 400); assertions += 1

    await admin.publish(paired.device.id, image.content.id)
    const player = Client.createPlayerClient({ baseUrl: base, currentOrigin: base, deviceToken: claim.deviceToken, deviceId: paired.device.id })
    const firstManifest = await player.manifest(paired.device.id)
    eq(firstManifest.content.id, image.content.id, 'separate player receives admin publication')
    eq(firstManifest.revision, 1, 'publication advances device revision')

    const playlist = await admin.createPlaylist({ name: 'Lista E2E', entries: [{ contentId: link.content.id, durationSeconds: 15 }] })
    const start = new Date(Date.now() - 1000), end = new Date(Date.now() + 60000)
    await admin.createSchedule({ deviceId: paired.device.id, playlistId: playlist.playlist.id, startsAt: start.toISOString(), endsAt: end.toISOString(), priority: 5 })
    eq((await player.manifest(paired.device.id)).content.id, link.content.id, 'active schedule overrides manual content deterministically')

    const live = await admin.startLive(paired.device.id)
    eq((await player.manifest(paired.device.id)).state, 'live', 'live sharing clearly overrides scheduled content')
    await admin.sendLiveSignal(live.session.id, { type: 'offer', payload: { type: 'offer', sdp: 'synthetic-offer' } })
    const offer = await player.receiveLiveSignals(live.session.id, 0)
    eq(offer.signals[0].type, 'offer', 'player receives sender WebRTC offer')
    await player.sendLiveSignal(live.session.id, { type: 'answer', payload: { type: 'answer', sdp: 'synthetic-answer' } })
    const answer = await admin.receiveLiveSignals(live.session.id, 0)
    eq(answer.signals[0].type, 'answer', 'sender receives player WebRTC answer')
    await admin.stopLive(live.session.id)
    eq((await player.manifest(paired.device.id)).state, 'ready', 'stopping live share returns to scheduled content')

    await admin.revokeDevice(paired.device.id, 'Fin de prueba E2E')
    await assert.rejects(() => player.manifest(paired.device.id), error => error.status === 401); assertions += 1
    const playerHtml = await fetch(base.replace('/api/signage','') + '/signage-player.html').then(response => response.text())
    ok(playerHtml.includes('Vincula esta pantalla'), 'standalone player is available without admin login')
    console.log(`signage phase4 integration: ${assertions} assertions passed`)
  } finally { server.close(); await once(server, 'close') }
})().catch(error => { console.error(error); process.exit(1) })
