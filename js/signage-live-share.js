(function (root, factory) {
  const api = factory()
  if (typeof module === 'object' && module.exports) module.exports = api
  root.SignageLiveShare = api
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict'
  function waitIce(peer, timeout = 5000) {
    if (peer.iceGatheringState === 'complete') return Promise.resolve()
    return new Promise(resolve => {
      const done = () => { peer.removeEventListener('icegatheringstatechange', check); clearTimeout(timer); resolve() }
      const check = () => { if (peer.iceGatheringState === 'complete') done() }
      const timer = setTimeout(done, timeout); peer.addEventListener('icegatheringstatechange', check)
    })
  }
  function peerConfig(iceServers) { return { iceServers: Array.isArray(iceServers) ? iceServers : [] } }

  function createSender(options) {
    let peer = null, stream = null, timer = null, session = null, sequence = 0, stopped = false
    async function poll() {
      if (stopped || !session) return
      try {
        const result = await options.client.receiveLiveSignals(session.id, sequence)
        for (const signal of result.signals || []) {
          sequence = Math.max(sequence, signal.sequence)
          if (signal.type === 'answer' && !peer.currentRemoteDescription) await peer.setRemoteDescription(signal.payload)
          if (signal.type === 'candidate' && signal.payload) await peer.addIceCandidate(signal.payload)
        }
      } finally { if (!stopped) timer = setTimeout(poll, 1000) }
    }
    async function start() {
      const capture = options.captureProvider || (() => navigator.mediaDevices?.getDisplayMedia?.({ video: { frameRate: { ideal: 15, max: 30 } }, audio: false }))
      stream = await capture()
      if (!stream) throw new Error('Este navegador no permite compartir pantalla.')
      session = (await options.client.startLive(options.deviceId)).session
      peer = new RTCPeerConnection(peerConfig(options.iceServers))
      stream.getTracks().forEach(track => { peer.addTrack(track, stream); track.addEventListener('ended', stop, { once: true }) })
      await peer.setLocalDescription(await peer.createOffer()); await waitIce(peer)
      await options.client.sendLiveSignal(session.id, { type: 'offer', payload: peer.localDescription })
      poll(); return { session, stream }
    }
    async function stop() {
      if (stopped) return; stopped = true; clearTimeout(timer)
      stream?.getTracks().forEach(track => track.stop()); peer?.close()
      if (session) await options.client.stopLive(session.id).catch(() => {})
      options.onStop?.()
    }
    return { start, stop, get session() { return session }, get connectionState() { return peer?.connectionState || 'new' }, get debugState() { return { connection:peer?.connectionState,ice:peer?.iceConnectionState,gathering:peer?.iceGatheringState,signaling:peer?.signalingState,local:peer?.localDescription?.type,remote:peer?.remoteDescription?.type,candidates:(peer?.localDescription?.sdp?.match(/a=candidate:/g)||[]).length } } }
  }

  function createReceiver(options) {
    let peer = null, timer = null, sequence = 0, stopped = false, answered = false
    async function poll() {
      if (stopped) return
      try {
        const result = await options.client.receiveLiveSignals(options.sessionId, sequence)
        if (result.state === 'stopped') return stop()
        for (const signal of result.signals || []) {
          sequence = Math.max(sequence, signal.sequence)
          if (signal.type === 'offer' && !answered) {
            peer = new RTCPeerConnection(peerConfig(options.iceServers))
            peer.addEventListener('track', event => { options.video.srcObject = event.streams[0]; options.video.play().catch(() => {}) })
            await peer.setRemoteDescription(signal.payload); await peer.setLocalDescription(await peer.createAnswer()); await waitIce(peer)
            await options.client.sendLiveSignal(options.sessionId, { type: 'answer', payload: peer.localDescription }); answered = true; options.onConnected?.()
          } else if (signal.type === 'candidate' && signal.payload && peer) await peer.addIceCandidate(signal.payload)
        }
      } catch (error) { options.onError?.(error) }
      if (!stopped) timer = setTimeout(poll, 1000)
    }
    function start() { poll() }
    function stop() { if (stopped) return; stopped = true; clearTimeout(timer); peer?.close(); if (options.video) options.video.srcObject = null; options.onStop?.() }
    return { start, stop, get connectionState() { return peer?.connectionState || 'new' }, get debugState() { return { connection:peer?.connectionState,ice:peer?.iceConnectionState,gathering:peer?.iceGatheringState,signaling:peer?.signalingState,local:peer?.localDescription?.type,remote:peer?.remoteDescription?.type,candidates:(peer?.localDescription?.sdp?.match(/a=candidate:/g)||[]).length } } }
  }
  return { createSender, createReceiver, waitIce }
})
