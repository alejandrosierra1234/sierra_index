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
  function debugState(peer) {
    const local = peer && peer.localDescription
    const remote = peer && peer.remoteDescription
    return { connection:peer && peer.connectionState,ice:peer && peer.iceConnectionState,gathering:peer && peer.iceGatheringState,signaling:peer && peer.signalingState,local:local && local.type,remote:remote && remote.type,candidates:((local && local.sdp && local.sdp.match(/a=candidate:/g))||[]).length }
  }

  function connected(peer) {
    if (!peer) return false
    if (peer.connectionState && peer.connectionState !== 'new') return peer.connectionState === 'connected'
    return peer.iceConnectionState === 'connected' || peer.iceConnectionState === 'completed'
  }

  function failed(peer) {
    return Boolean(peer && (peer.connectionState === 'failed' || peer.iceConnectionState === 'failed'))
  }

  function waitForPeer(peer, timeout, stopped) {
    if (connected(peer)) return Promise.resolve()
    return new Promise((resolve, reject) => {
      const finish = error => {
        clearTimeout(timer)
        peer.removeEventListener('connectionstatechange', check)
        peer.removeEventListener('iceconnectionstatechange', check)
        error ? reject(error) : resolve()
      }
      const check = () => {
        if (connected(peer)) finish()
        else if (failed(peer)) finish(new Error('La conexión de video fue rechazada por la red.'))
        else if (stopped() || peer.connectionState === 'closed') finish(new Error('La transmisión fue detenida.'))
      }
      const timer = setTimeout(() => finish(new Error('La conexión de video no respondió a tiempo.')), timeout)
      peer.addEventListener('connectionstatechange', check)
      peer.addEventListener('iceconnectionstatechange', check)
      check()
    })
  }

  async function videoBytes(peer) {
    if (!peer || typeof peer.getStats !== 'function') return 0
    const stats = await peer.getStats()
    let bytes = 0
    stats.forEach(report => {
      if (report.type === 'outbound-rtp' && report.kind === 'video' && !report.isRemote) bytes += Number(report.bytesSent || report.framesEncoded || 0)
    })
    return bytes
  }

  function createSender(options) {
    let peer = null, stream = null, timer = null, session = null, sequence = 0, stopped = false, descriptionSent = false, state = 'idle', failureTimer = null
    const emit = (next, detail) => { state = next; if (options.onState) options.onState({ state: next, detail: detail || null, debug: debugState(peer) }) }
    async function poll() {
      if (stopped || !session) return
      try {
        const result = await options.client.receiveLiveSignals(session.id, sequence)
        if (result.state === 'stopped') return stop('remote', { remoteAlreadyStopped: true })
        for (const signal of result.signals || []) {
          sequence = Math.max(sequence, signal.sequence)
          if (signal.type === 'answer' && !peer.currentRemoteDescription) await peer.setRemoteDescription(signal.payload)
          if (signal.type === 'candidate' && signal.payload) await peer.addIceCandidate(signal.payload)
        }
      } catch (error) {
        emit('signal-interrupted', error.message)
        if (options.onError) options.onError(error)
      } finally { if (!stopped) timer = setTimeout(poll, 1000) }
    }
    async function start() {
      try {
        emit('requesting-capture')
        const capture = options.captureProvider || (() => navigator.mediaDevices && typeof navigator.mediaDevices.getDisplayMedia === 'function' ? navigator.mediaDevices.getDisplayMedia({ video: { frameRate: { ideal: 15, max: 30 } }, audio: false }) : null)
        stream = await capture()
        if (!stream) throw new Error('Este navegador no permite compartir pantalla.')
        if (!stream.getVideoTracks || !stream.getVideoTracks().length) throw new Error('No se recibió video de la pantalla elegida.')
        emit('captured')
        session = (await options.client.startLive(options.deviceId)).session
        emit('signaling')
        peer = new RTCPeerConnection(peerConfig(options.iceServers))
        peer.addEventListener('connectionstatechange', () => {
          if (connected(peer)) { clearTimeout(failureTimer); emit('connected') }
          else if (peer.connectionState === 'disconnected') {
            emit('interrupted')
            clearTimeout(failureTimer)
            failureTimer = setTimeout(() => { if (!stopped && !connected(peer)) stop('connection-lost') }, Number(options.disconnectGraceMs) || 5000)
          } else if (failed(peer)) stop('connection-failed')
        })
        peer.addEventListener('icecandidate', event => {
          if (descriptionSent && event.candidate) options.client.sendLiveSignal(session.id, { type: 'candidate', payload: event.candidate.toJSON() }).catch(options.onError || (() => {}))
        })
        stream.getTracks().forEach(track => { peer.addTrack(track, stream); track.addEventListener('ended', () => stop('capture-ended'), { once: true }) })
        await peer.setLocalDescription(await peer.createOffer()); await waitIce(peer)
        await options.client.sendLiveSignal(session.id, { type: 'offer', payload: peer.localDescription })
        descriptionSent = true
        poll(); return { session, stream }
      } catch (error) {
        await stop('start-failed')
        throw error
      }
    }
    function waitConnected(timeout = 20000) {
      if (!peer) return Promise.reject(new Error('La transmisión todavía no ha iniciado.'))
      return waitForPeer(peer, timeout, () => stopped)
    }
    async function waitMediaFlow(timeout = 8000) {
      const startedAt = Date.now()
      while (!stopped && Date.now() - startedAt < timeout) {
        if (failed(peer)) throw new Error('La conexión de video fue rechazada por la red.')
        if (connected(peer) && await videoBytes(peer) > 0) { emit('media-flowing'); return }
        await new Promise(resolve => setTimeout(resolve, 250))
      }
      throw new Error(stopped ? 'La transmisión fue detenida.' : 'La conexión abrió, pero no confirmó el envío de video.')
    }
    async function stop(reason = 'user', stopOptions = {}) {
      if (stopped) return { remoteStopped: true, reason }; stopped = true; clearTimeout(timer); clearTimeout(failureTimer)
      emit('stopping', reason)
      if (stream) stream.getTracks().forEach(track => track.stop()); if (peer) peer.close()
      let remoteError = null
      if (session && !stopOptions.remoteAlreadyStopped) await options.client.stopLive(session.id, { keepalive: stopOptions.keepalive === true }).catch(error => { remoteError = error })
      emit(remoteError ? 'local-stopped' : 'stopped', reason)
      const result = { remoteStopped: !remoteError, reason, error: remoteError }
      if (options.onStop) options.onStop(result)
      return result
    }
    return { start, stop, waitConnected, waitMediaFlow, get session() { return session }, get stream() { return stream }, get state() { return state }, get connectionState() { return peer ? peer.connectionState : 'new' }, get debugState() { return debugState(peer) } }
  }

  function createReceiver(options) {
    let peer = null, timer = null, sequence = 0, stopped = false, answered = false, descriptionSent = false, mediaConfirmed = false, failureTimer = null
    const emit = (state, detail) => { if (options.onState) options.onState({ state, detail: detail || null, debug: debugState(peer) }) }
    const confirmMedia = () => {
      if (mediaConfirmed || !options.video || options.video.readyState < 2) return
      mediaConfirmed = true; emit('media-flowing'); if (options.onConnected) options.onConnected()
    }
    async function poll() {
      if (stopped) return
      try {
        const result = await options.client.receiveLiveSignals(options.sessionId, sequence)
        if (result.state === 'stopped') return stop()
        for (const signal of result.signals || []) {
          sequence = Math.max(sequence, signal.sequence)
          if (signal.type === 'offer' && !answered) {
            peer = new RTCPeerConnection(peerConfig(options.iceServers))
            peer.addEventListener('connectionstatechange', () => {
              if (connected(peer)) { clearTimeout(failureTimer); emit('connected') }
              else if (peer.connectionState === 'disconnected') {
                emit('interrupted'); clearTimeout(failureTimer)
                failureTimer = setTimeout(() => { if (!stopped && !connected(peer) && options.onError) options.onError(new Error('La conexión de video se interrumpió.')) }, Number(options.disconnectGraceMs) || 5000)
              } else if (failed(peer)) { clearTimeout(failureTimer); emit('failed'); if (options.onError) options.onError(new Error('La conexión de video se interrumpió.')) }
            })
            peer.addEventListener('track', event => {
              options.video.srcObject = event.streams[0]
              options.video.addEventListener('loadeddata', confirmMedia, { once: true })
              options.video.addEventListener('playing', confirmMedia, { once: true })
              options.video.play().then(confirmMedia).catch(error => { if (options.onError) options.onError(error) })
            }, { once: true })
            peer.addEventListener('icecandidate', event => {
              if (descriptionSent && event.candidate) options.client.sendLiveSignal(options.sessionId, { type: 'candidate', payload: event.candidate.toJSON() }).catch(options.onError || (() => {}))
            })
            await peer.setRemoteDescription(signal.payload); await peer.setLocalDescription(await peer.createAnswer()); await waitIce(peer)
            await options.client.sendLiveSignal(options.sessionId, { type: 'answer', payload: peer.localDescription }); descriptionSent = true; answered = true
          } else if (signal.type === 'candidate' && signal.payload && peer) await peer.addIceCandidate(signal.payload)
        }
      } catch (error) { if (options.onError) options.onError(error) }
      if (!stopped) timer = setTimeout(poll, 1000)
    }
    function start() { emit('waiting-offer'); poll() }
    function stop(reason = 'remote') { if (stopped) return; stopped = true; clearTimeout(timer); clearTimeout(failureTimer); if (peer) peer.close(); if (options.video) options.video.srcObject = null; emit('stopped', reason); if (options.onStop) options.onStop({ reason }) }
    return { start, stop, get connectionState() { return peer ? peer.connectionState : 'new' }, get debugState() { return debugState(peer) } }
  }
  return { createSender, createReceiver, waitIce }
})
