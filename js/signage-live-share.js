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
  function peerConfig(iceServers) { return { iceServers: Array.isArray(iceServers) ? iceServers : [], iceTransportPolicy:'all' } }
  function candidateSummary(description) {
    const summary = { total:0, host:0, srflx:0, prflx:0, relay:0 }
    const sdp = description && description.sdp
    if (!sdp) return summary
    const candidates = sdp.match(/^a=candidate:.*$/gm) || []
    summary.total = candidates.length
    candidates.forEach(line => {
      const match = line.match(/\styp\s(host|srflx|prflx|relay)(?:\s|$)/)
      if (match) summary[match[1]] += 1
    })
    return summary
  }
  function debugState(peer) {
    const local = peer && peer.localDescription
    const remote = peer && peer.remoteDescription
    const localRoutes = candidateSummary(local), remoteRoutes = candidateSummary(remote)
    return { connection:peer && peer.connectionState,ice:peer && peer.iceConnectionState,gathering:peer && peer.iceGatheringState,signaling:peer && peer.signalingState,local:local && local.type,remote:remote && remote.type,candidates:localRoutes.total,localRoutes,remoteRoutes }
  }

  function connected(peer) {
    if (!peer) return false
    if (peer.connectionState && peer.connectionState !== 'new') return peer.connectionState === 'connected'
    return peer.iceConnectionState === 'connected' || peer.iceConnectionState === 'completed'
  }

  function failed(peer) {
    return Boolean(peer && (peer.connectionState === 'failed' || peer.iceConnectionState === 'failed'))
  }

  function generationOf(payload) {
    const value = Number(payload && payload.generation)
    return Number.isSafeInteger(value) && value > 0 ? value : 1
  }

  function rtcDescription(payload) {
    return { type:payload && payload.type, sdp:payload && payload.sdp }
  }

  function signalDescription(description, metadata) {
    if (!description || !description.type || typeof description.sdp !== 'string') throw codedError('INVALID_LOCAL_DESCRIPTION', 'El navegador no preparó una descripción WebRTC válida.')
    return { type:description.type, sdp:description.sdp, ...(metadata || {}) }
  }

  function rtcCandidate(payload) {
    if (!payload) return payload
    const candidate = { candidate:payload.candidate || '' }
    if (payload.sdpMid != null) candidate.sdpMid = payload.sdpMid
    if (payload.sdpMLineIndex != null) candidate.sdpMLineIndex = payload.sdpMLineIndex
    if (payload.usernameFragment != null) candidate.usernameFragment = payload.usernameFragment
    return candidate
  }

  function codedError(code, message) {
    const error = new Error(message)
    error.code = code
    return error
  }

  function receiverIdentity(runtime, supplied) {
    if (supplied) return String(supplied)
    if (runtime.crypto && typeof runtime.crypto.randomUUID === 'function') return runtime.crypto.randomUUID()
    return `receiver-${Date.now()}-${Math.random().toString(36).slice(2)}`
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

  async function mediaStats(peer) {
    const summary = { bytesSent:0, framesEncoded:0, bytesReceived:0, framesDecoded:0, packetsLost:0, roundTripTime:null, localCandidateType:null, remoteCandidateType:null }
    if (!peer || typeof peer.getStats !== 'function') return summary
    const stats = await peer.getStats()
    stats.forEach(report => {
      if (report.type === 'outbound-rtp' && report.kind === 'video' && !report.isRemote) { summary.bytesSent += Number(report.bytesSent || 0); summary.framesEncoded += Number(report.framesEncoded || 0) }
      if (report.type === 'inbound-rtp' && report.kind === 'video' && !report.isRemote) { summary.bytesReceived += Number(report.bytesReceived || 0); summary.framesDecoded += Number(report.framesDecoded || 0); summary.packetsLost += Number(report.packetsLost || 0) }
      if (report.type === 'candidate-pair' && (report.selected || report.nominated) && report.state === 'succeeded') {
        summary.roundTripTime = Number.isFinite(report.currentRoundTripTime) ? report.currentRoundTripTime : null
        const local = stats.get(report.localCandidateId), remote = stats.get(report.remoteCandidateId)
        summary.localCandidateType = local && local.candidateType || null
        summary.remoteCandidateType = remote && remote.candidateType || null
      }
    })
    return summary
  }

  function createSender(options) {
    let peer = null, stream = null, timer = null, session = null, sequence = 0, stopped = false, descriptionSent = false, state = 'idle', failureTimer = null, lastMediaStats = null
    let generation = 1, remoteGeneration = 0, receiverId = null, receiverMediaGeneration = 0, receiverMediaStats = null, recoveries = 0, recoveryPromise = null, recoveryMediaPromise = null, recoveryBaselineBytes = 0
    const maxRecoveries = Math.max(0, Number(options.maxReconnectAttempts == null ? 2 : options.maxReconnectAttempts))
    const emit = (next, detail) => { state = next; if (options.onState) options.onState({ state: next, detail: detail || null, debug: debugState(peer) }) }
    async function sendOffer(restart) {
      descriptionSent = false
      if (restart && typeof peer.restartIce === 'function') peer.restartIce()
      await peer.setLocalDescription(await peer.createOffer(restart ? { iceRestart:true } : undefined)); await waitIce(peer)
      await options.client.sendLiveSignal(session.id, { type:'offer', payload:signalDescription(peer.localDescription, { generation }) })
      descriptionSent = true
    }
    async function recover(reason, force) {
      if (stopped || !peer || !session || (!force && connected(peer))) return false
      if (recoveryPromise) return recoveryPromise
      if (recoveries >= maxRecoveries) { await stop('recovery-exhausted'); return false }
      recoveries += 1; generation += 1; remoteGeneration = 0; receiverMediaGeneration = 0; receiverMediaStats = null; recoveryBaselineBytes = Number(lastMediaStats && lastMediaStats.bytesSent) || 0
      emit('recovering', { attempt:recoveries, maximum:maxRecoveries, reason })
      recoveryPromise = (async () => {
        try {
          await sendOffer(true)
          clearTimeout(failureTimer)
          failureTimer = setTimeout(() => { if (!stopped && (!connected(peer) || remoteGeneration !== generation)) void recover('recovery-timeout', true) }, Number(options.reconnectTimeoutMs) || 8000)
          return true
        } catch (error) {
          emit('recovery-failed', { attempt:recoveries, message:error.message })
          if (recoveries >= maxRecoveries) await stop('recovery-failed')
          else failureTimer = setTimeout(() => { void recover('recovery-retry') }, Number(options.disconnectGraceMs) || 5000)
          return false
        } finally { recoveryPromise = null }
      })()
      return recoveryPromise
    }
    async function confirmRecoveredMedia() {
      if (recoveryMediaPromise || stopped) return recoveryMediaPromise
      recoveryMediaPromise = (async () => {
        const startedAt = Date.now(), timeout = Number(options.recoveryMediaTimeoutMs) || 8000
        while (!stopped && connected(peer) && Date.now() - startedAt < timeout) {
          const stats = await mediaStats(peer)
          if (stats.bytesSent > recoveryBaselineBytes && stats.framesEncoded > 0 && receiverMediaGeneration === generation && receiverMediaStats && receiverMediaStats.bytesReceived > 0 && receiverMediaStats.framesDecoded > 0) {
            lastMediaStats = stats; clearTimeout(failureTimer); emit('recovered', { attempts:recoveries }); emit('media-flowing', { ...stats, receiver:receiverMediaStats, recovered:true }); return true
          }
          await new Promise(resolve => setTimeout(resolve, Number(options.mediaPollIntervalMs) || 250))
        }
        if (!stopped) {
          emit('recovery-failed', { attempt:recoveries, message:'La conexión regresó, pero no confirmó video nuevo.' })
          if (recoveries < maxRecoveries) await recover('media-stalled', true)
          else await stop('media-stalled')
        }
        return false
      })().finally(() => { recoveryMediaPromise = null })
      return recoveryMediaPromise
    }
    async function poll() {
      if (stopped || !session) return
      try {
        const result = await options.client.receiveLiveSignals(session.id, sequence)
        if (result.state === 'stopped') return stop('remote', { remoteAlreadyStopped: true })
        for (const signal of result.signals || []) {
          const signalGeneration = generationOf(signal.payload)
          if (signal.type === 'answer' && signalGeneration === generation) {
            const nextReceiverId = signal.payload && signal.payload.receiverId || null
            if (remoteGeneration !== generation) {
              await peer.setRemoteDescription(rtcDescription(signal.payload)); remoteGeneration = generation; receiverId = nextReceiverId || receiverId
              if (recoveries && connected(peer)) { emit('reconnected', { attempts:recoveries }); void confirmRecoveredMedia() }
            } else if (nextReceiverId && receiverId && nextReceiverId !== receiverId) {
              receiverId = nextReceiverId; void recover('receiver-refreshed', true)
            }
          }
          if (signal.type === 'candidate' && signal.payload && signalGeneration === generation) await peer.addIceCandidate(rtcCandidate(signal.payload))
          if (signal.type === 'media' && signalGeneration === generation && (!receiverId || signal.payload.receiverId === receiverId) && Number(signal.payload.bytesReceived) > 0 && Number(signal.payload.framesDecoded) > 0) {
            receiverId = signal.payload.receiverId; receiverMediaGeneration = signalGeneration; receiverMediaStats = { bytesReceived:Number(signal.payload.bytesReceived), framesDecoded:Number(signal.payload.framesDecoded) }
          }
          sequence = Math.max(sequence, signal.sequence)
        }
      } catch (error) {
        emit('signal-interrupted', error.message)
        if (options.onError) options.onError(error)
      } finally { if (!stopped) timer = setTimeout(poll, Number(options.pollIntervalMs) || 1000) }
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
          if (connected(peer)) {
            clearTimeout(failureTimer)
            if (recoveries) { emit('reconnected', { attempts:recoveries }); void confirmRecoveredMedia() }
            else emit('connected')
          }
          else if (peer.connectionState === 'disconnected') {
            emit('interrupted')
            clearTimeout(failureTimer)
            failureTimer = setTimeout(() => { if (!stopped && !connected(peer)) void recover('connection-lost') }, Number(options.disconnectGraceMs) || 5000)
          } else if (failed(peer)) void recover('connection-failed')
        })
        peer.addEventListener('icecandidate', event => {
          if (descriptionSent && event.candidate) options.client.sendLiveSignal(session.id, { type:'candidate', payload:{ ...event.candidate.toJSON(), generation } }).catch(options.onError || (() => {}))
        })
        stream.getTracks().forEach(track => { peer.addTrack(track, stream); track.addEventListener('ended', () => stop('capture-ended'), { once: true }) })
        await sendOffer(false)
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
        if (connected(peer)) {
          lastMediaStats = await mediaStats(peer)
          if (lastMediaStats.bytesSent > 0 && lastMediaStats.framesEncoded > 0 && receiverMediaGeneration === generation && receiverMediaStats && receiverMediaStats.bytesReceived > 0 && receiverMediaStats.framesDecoded > 0) { const confirmed={ ...lastMediaStats, receiver:receiverMediaStats }; emit('media-flowing', confirmed); return confirmed }
        }
        await new Promise(resolve => setTimeout(resolve, 250))
      }
      if (stopped) throw new Error('La transmisión fue detenida.')
      if (!remoteGeneration) throw codedError('RECEIVER_SIGNALING_MISSING', 'La pantalla vinculada no respondió a la oferta de video.')
      if (!receiverId) throw codedError('RECEIVER_UPDATE_REQUIRED', 'La pantalla vinculada usa un reproductor anterior que no confirma el video.')
      throw codedError('RECEIVER_MEDIA_UNCONFIRMED', 'La pantalla respondió, pero no confirmó imágenes decodificadas.')
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
    return { start, stop, waitConnected, waitMediaFlow, recover, get session() { return session }, get stream() { return stream }, get state() { return state }, get mediaStats() { return lastMediaStats }, get connectionState() { return peer ? peer.connectionState : 'new' }, get recoveryCount() { return recoveries }, get generation() { return generation }, get debugState() { return { ...debugState(peer), generation, recoveries } } }
  }

  function createReceiver(options) {
    let peer = null, timer = null, sequence = 0, stopped = false, answered = false, descriptionSent = false, mediaConfirmed = false, mediaChecking = false, failureTimer = null, recoveryTimer = null, mediaTimer = null, lastMediaStats = null, generation = 0, pendingAnswer = null, pendingMediaAck = null
    const receiverId = receiverIdentity(typeof globalThis !== 'undefined' ? globalThis : {}, options.receiverId)
    const queuedCandidates = new Map()
    const emit = (state, detail) => { if (options.onState) options.onState({ state, detail: detail || null, debug: debugState(peer) }) }
    const confirmMedia = async () => {
      if (mediaConfirmed || mediaChecking || !options.video || options.video.readyState < 2) return
      if (!answered) { clearTimeout(mediaTimer); mediaTimer = setTimeout(confirmMedia, 100); return }
      mediaChecking = true
      try {
        lastMediaStats = await mediaStats(peer)
        if (lastMediaStats.bytesReceived <= 0 || lastMediaStats.framesDecoded <= 0) { clearTimeout(mediaTimer); mediaTimer = setTimeout(confirmMedia, 250); return }
        mediaConfirmed = true; clearTimeout(mediaTimer)
        pendingMediaAck = { type:'media', payload:{ generation, receiverId, bytesReceived:Math.trunc(lastMediaStats.bytesReceived), framesDecoded:Math.trunc(lastMediaStats.framesDecoded) } }
        try { await options.client.sendLiveSignal(options.sessionId, pendingMediaAck); pendingMediaAck = null }
        catch (error) { emit('signal-interrupted', { message:error.message }); if (options.onSignalError) options.onSignalError(error) }
        emit('media-flowing', lastMediaStats); if (options.onConnected) options.onConnected(lastMediaStats)
      } finally { mediaChecking = false }
    }
    function recoveryDeadline(reason) {
      clearTimeout(failureTimer); clearTimeout(recoveryTimer)
      emit('recovering', { reason })
      recoveryTimer = setTimeout(() => {
        if (stopped || connected(peer)) return
        emit('failed', { reason:'recovery-timeout' })
        if (options.onError) options.onError(new Error('La conexión de video no pudo recuperarse.'))
      }, Number(options.reconnectTimeoutMs) || 12000)
    }
    function attachPeer(nextGeneration) {
      if (peer) peer.close()
      generation = nextGeneration; answered = false; descriptionSent = false; mediaConfirmed = false; mediaChecking = false; pendingMediaAck = null
      peer = new RTCPeerConnection(peerConfig(options.iceServers))
      peer.addEventListener('connectionstatechange', () => {
        if (connected(peer)) { clearTimeout(failureTimer); clearTimeout(recoveryTimer); emit(generation > 1 ? 'recovered' : 'connected', { generation }) }
        else if (peer.connectionState === 'disconnected') {
          emit('interrupted'); clearTimeout(failureTimer)
          failureTimer = setTimeout(() => { if (!stopped && !connected(peer)) recoveryDeadline('connection-lost') }, Number(options.disconnectGraceMs) || 5000)
        } else if (failed(peer)) recoveryDeadline('connection-failed')
      })
      peer.addEventListener('track', event => {
        options.video.srcObject = event.streams[0]
        options.video.addEventListener('loadeddata', confirmMedia, { once:true })
        options.video.addEventListener('playing', confirmMedia, { once:true })
        options.video.play().then(confirmMedia).catch(error => { if (options.onPlayBlocked) options.onPlayBlocked(error) })
      }, { once:true })
      peer.addEventListener('icecandidate', event => {
        if (descriptionSent && event.candidate) options.client.sendLiveSignal(options.sessionId, { type:'candidate', payload:{ ...event.candidate.toJSON(), generation, receiverId } }).catch(options.onError || (() => {}))
      })
    }
    async function poll() {
      if (stopped) return
      try {
        if (pendingAnswer) { await options.client.sendLiveSignal(options.sessionId, pendingAnswer); pendingAnswer = null; descriptionSent = true; answered = true; void confirmMedia() }
        if (pendingMediaAck) { await options.client.sendLiveSignal(options.sessionId, pendingMediaAck); pendingMediaAck = null }
        const result = await options.client.receiveLiveSignals(options.sessionId, sequence)
        if (result.state === 'stopped') return stop()
        for (const signal of result.signals || []) {
          const signalGeneration = generationOf(signal.payload)
          if (signal.type === 'offer') {
            if (signalGeneration < generation || (signalGeneration === generation && answered)) { sequence = Math.max(sequence, signal.sequence); continue }
            if (signalGeneration > generation || !peer) { if (generation) emit('recovering', { reason:'new-offer' }); attachPeer(signalGeneration) }
            await peer.setRemoteDescription(rtcDescription(signal.payload))
            for (const candidate of queuedCandidates.get(signalGeneration) || []) await peer.addIceCandidate(rtcCandidate(candidate))
            queuedCandidates.delete(signalGeneration)
            await peer.setLocalDescription(await peer.createAnswer()); await waitIce(peer)
            pendingAnswer = { type:'answer', payload:signalDescription(peer.localDescription, { generation, receiverId }) }
            await options.client.sendLiveSignal(options.sessionId, pendingAnswer); pendingAnswer = null; descriptionSent = true; answered = true; void confirmMedia()
          } else if (signal.type === 'candidate' && signal.payload) {
            if (signalGeneration < generation) { sequence = Math.max(sequence, signal.sequence); continue }
            if (!peer || signalGeneration > generation || !peer.remoteDescription) {
              const pending = queuedCandidates.get(signalGeneration) || []; pending.push(signal.payload); queuedCandidates.set(signalGeneration, pending)
            } else await peer.addIceCandidate(rtcCandidate(signal.payload))
          }
          sequence = Math.max(sequence, signal.sequence)
        }
      } catch (error) { emit('signal-interrupted', { message:error.message }); if (options.onSignalError) options.onSignalError(error) }
      if (!stopped) timer = setTimeout(poll, Number(options.pollIntervalMs) || 1000)
    }
    function start() { emit('waiting-offer'); poll() }
    function stop(reason = 'remote') { if (stopped) return; stopped = true; pendingAnswer = null; pendingMediaAck = null; clearTimeout(timer); clearTimeout(failureTimer); clearTimeout(recoveryTimer); clearTimeout(mediaTimer); queuedCandidates.clear(); if (peer) peer.close(); if (options.video) options.video.srcObject = null; emit('stopped', reason); if (options.onStop) options.onStop({ reason }) }
    return { start, stop, get mediaStats() { return lastMediaStats }, get connectionState() { return peer ? peer.connectionState : 'new' }, get generation() { return generation }, get debugState() { return { ...debugState(peer), generation } } }
  }
  return { createSender, createReceiver, waitIce }
})
