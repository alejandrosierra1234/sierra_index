import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const require=createRequire(import.meta.url),here=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(here,'../..')
let assertions=0
const listeners=()=>new Map()
const on=(map,type,callback)=>{const values=map.get(type)||new Set();values.add(callback);map.set(type,values)}
const off=(map,type,callback)=>map.get(type)?.delete(callback)
const emit=(map,type,event={})=>{for(const callback of map.get(type)||[])callback({type,...event})}

class FakePeer {
  constructor(){this.events=listeners();this.connectionState='new';this.iceConnectionState='new';this.iceGatheringState='complete';this.signalingState='stable';this.localDescription=null;this.remoteDescription=null;this.currentRemoteDescription=null;FakePeer.instances.push(this)}
  addEventListener(type,callback){on(this.events,type,callback)}
  removeEventListener(type,callback){off(this.events,type,callback)}
  addTrack(){}
  async createOffer(options){this.lastOfferOptions=options||null;return{type:'offer',sdp:'v=0'}}
  async createAnswer(){return{type:'answer',sdp:'v=0'}}
  async setLocalDescription(value){const description={};Object.defineProperties(description,{type:{value:value.type,enumerable:false},sdp:{value:value.sdp,enumerable:false}});this.localDescription=description}
  async setRemoteDescription(value){assert.deepEqual(Object.keys(value).sort(),['sdp','type'],'signaling metadata is stripped before WebRTC receives a description');this.remoteDescription=value;this.currentRemoteDescription=value;this.connectionState='connected';this.iceConnectionState='connected';emit(this.events,'connectionstatechange');emit(this.events,'iceconnectionstatechange');if(value.type==='offer'&&FakePeer.remoteStream)emit(this.events,'track',{streams:[FakePeer.remoteStream]})}
  async addIceCandidate(value){assert.ok(Object.keys(value).every(key=>['candidate','sdpMid','sdpMLineIndex','usernameFragment'].includes(key)),'signaling metadata is stripped before WebRTC receives a candidate')}
  async getStats(){this.statsCalls=(this.statsCalls||0)+1;return this.remoteDescription&&this.remoteDescription.type==='offer'?new Map([['video-in',{type:'inbound-rtp',kind:'video',bytesReceived:4096*this.statsCalls,framesDecoded:2*this.statsCalls,packetsLost:0,isRemote:false}]]):new Map([['video-out',{type:'outbound-rtp',kind:'video',bytesSent:2048*this.statsCalls,framesEncoded:2*this.statsCalls,isRemote:false}]])}
  restartIce(){this.restartIceCalls=(this.restartIceCalls||0)+1}
  close(){this.connectionState='closed';this.iceConnectionState='closed'}
}
FakePeer.instances=[]

globalThis.RTCPeerConnection=FakePeer
const Live=require(path.join(root,'js/signage-live-share.js'))

function track(){const events=listeners();return{readyState:'live',addEventListener(type,callback){on(events,type,callback)},stop(){this.readyState='ended'},end(){this.readyState='ended';emit(events,'ended')}}}
function stream(){const video=track();return{video,getTracks:()=>[video],getVideoTracks:()=>[video]}}

{
  const captured=stream(),states=[],signals=[],stops=[]
  const client={startLive:async()=>({session:{id:'session-1'}}),sendLiveSignal:async(id,signal)=>signals.push([id,signal]),receiveLiveSignals:async()=>({state:'active',signals:[{sequence:1,type:'answer',payload:{type:'answer',sdp:'v=0',generation:1,receiverId:'receiver-1'}},{sequence:2,type:'media',payload:{generation:1,receiverId:'receiver-1',bytesReceived:4096,framesDecoded:2}}]}),stopLive:async(id,options)=>stops.push([id,options])}
  const sender=Live.createSender({client,deviceId:'device-1',iceServers:[],captureProvider:async()=>captured,onState:event=>states.push(event.state)})
  await sender.start();await sender.waitConnected(100);await sender.waitMediaFlow(100)
  assert.equal(sender.state,'media-flowing');assertions+=1
  assert.equal(signals[0][1].type,'offer');assertions+=1
  assert.deepEqual({type:signals[0][1].payload.type,sdp:signals[0][1].payload.sdp,generation:signals[0][1].payload.generation},{type:'offer',sdp:'v=0',generation:1},'Safari-like non-enumerable localDescription is serialized explicitly');assertions+=1
  assert.ok(states.includes('connected')&&states.includes('media-flowing'));assertions+=1
  assert.deepEqual(sender.debugState.localRoutes,{total:0,host:0,srflx:0,prflx:0,relay:0},'diagnostics summarize routes without exposing candidate addresses');assertions+=1
  const stopped=await sender.stop('user',{keepalive:true})
  assert.equal(stopped.remoteStopped,true);assertions+=1
  assert.equal(captured.video.readyState,'ended');assertions+=1
  assert.deepEqual(stops,[['session-1',{keepalive:true}]]);assertions+=1
}

{
  let sessions=0
  const sender=Live.createSender({client:{startLive:async()=>{sessions+=1},stopLive:async()=>{},receiveLiveSignals:async()=>({state:'active',signals:[]}),sendLiveSignal:async()=>{}},deviceId:'device-2',captureProvider:async()=>{throw new DOMException('cancel','NotAllowedError')}})
  await assert.rejects(()=>sender.start(),error=>error.name==='NotAllowedError');assertions+=1
  assert.equal(sessions,0);assertions+=1
}

{
  const captured=stream()
  const client={startLive:async()=>({session:{id:'session-3'}}),sendLiveSignal:async()=>{},receiveLiveSignals:async()=>({state:'active',signals:[{sequence:1,type:'answer',payload:{type:'answer',sdp:'v=0'}}]}),stopLive:async()=>{throw new Error('offline')}}
  const sender=Live.createSender({client,deviceId:'device-3',captureProvider:async()=>captured})
  await sender.start();await sender.waitConnected(100)
  const stopped=await sender.stop('pagehide',{keepalive:true})
  assert.equal(stopped.remoteStopped,false);assertions+=1
  assert.equal(captured.video.readyState,'ended');assertions+=1
}

{
  const remote=stream(),videoEvents=listeners(),states=[]
  FakePeer.remoteStream=remote
  let blocked=0
  const video={readyState:0,srcObject:null,addEventListener(type,callback){on(videoEvents,type,callback)},play:async()=>{throw new DOMException('autoplay','NotAllowedError')}}
  const client={
    receiveLiveSignals:async()=>({state:'active',signals:[{sequence:1,type:'offer',payload:{type:'offer',sdp:'v=0'}}]}),
    sendLiveSignal:async()=>{},
  }
  let confirmed=0,errors=0
  const receiver=Live.createReceiver({client,sessionId:'session-receiver',iceServers:[],video,disconnectGraceMs:5,reconnectTimeoutMs:5,onState:event=>states.push(event.state),onConnected:()=>{confirmed+=1},onPlayBlocked:()=>{blocked+=1},onError:()=>{errors+=1}})
  await receiver.start()
  await new Promise(resolve=>setTimeout(resolve,0))
  assert.equal(confirmed,0,'the track event alone must not claim visible video');assertions+=1
  assert.equal(blocked,1,'autoplay rejection requests an explicit receiver action instead of claiming failure');assertions+=1
  video.readyState=2;emit(videoEvents,'loadeddata');await new Promise(resolve=>setTimeout(resolve,0))
  assert.equal(confirmed,1);assertions+=1
  assert.equal(video.srcObject,remote);assertions+=1
  assert.ok(states.includes('connected')&&states.includes('media-flowing'));assertions+=1
  assert.deepEqual(receiver.mediaStats,{bytesSent:0,framesEncoded:0,bytesReceived:4096,framesDecoded:2,packetsLost:0,roundTripTime:null,localCandidateType:null,remoteCandidateType:null});assertions+=1
  const peer=FakePeer.instances.at(-1);peer.connectionState='disconnected';emit(peer.events,'connectionstatechange');await new Promise(resolve=>setTimeout(resolve,20))
  assert.equal(errors,1,'a sustained receiver disconnect becomes an actionable error');assertions+=1
  receiver.stop();FakePeer.remoteStream=null
}

{
  const captured=stream(),states=[],signals=[];let captureCalls=0,answerGeneration=1
  const client={
    startLive:async()=>({session:{id:'session-recover'}}),
    sendLiveSignal:async(_id,signal)=>{signals.push(signal);if(signal.type==='offer')answerGeneration=signal.payload.generation},
    receiveLiveSignals:async(_id,after)=>after>=answerGeneration*2?{state:'active',signals:[]}:{state:'active',signals:[{sequence:answerGeneration*2-1,type:'answer',payload:{type:'answer',sdp:'v=0',generation:answerGeneration,receiverId:'receiver-a'}},{sequence:answerGeneration*2,type:'media',payload:{generation:answerGeneration,receiverId:'receiver-a',bytesReceived:4096*answerGeneration,framesDecoded:2*answerGeneration}}].filter(signal=>signal.sequence>after)},
    stopLive:async()=>({state:'stopped'}),
  }
  const sender=Live.createSender({client,deviceId:'device-recover',captureProvider:async()=>{captureCalls+=1;return captured},disconnectGraceMs:2,reconnectTimeoutMs:20,pollIntervalMs:1,maxReconnectAttempts:1,onState:event=>states.push(event.state)})
  await sender.start();await sender.waitConnected(100)
  const peer=FakePeer.instances.at(-1);peer.connectionState='disconnected';peer.iceConnectionState='disconnected';emit(peer.events,'connectionstatechange')
  await new Promise(resolve=>setTimeout(resolve,30))
  assert.equal(captureCalls,1,'recovery never requests capture permission again');assertions+=1
  assert.equal(signals.filter(signal=>signal.type==='offer').length,2,'one interruption creates one bounded ICE restart offer');assertions+=1
  assert.equal(sender.generation,2);assert.equal(sender.recoveryCount,1);assert.ok(states.includes('recovering')&&states.includes('recovered'));assertions+=3
  assert.equal(peer.restartIceCalls,1);assert.deepEqual(peer.lastOfferOptions,{iceRestart:true});assertions+=2
  await sender.stop('user')
}

{
  const remote=stream(),videoEvents=listeners(),answers=[];let polls=0
  FakePeer.remoteStream=remote
  const video={readyState:2,srcObject:null,addEventListener(type,callback){on(videoEvents,type,callback)},play:async()=>{}}
  const client={
    receiveLiveSignals:async()=>{
      polls+=1
      if(polls===1)return{state:'active',signals:[{sequence:1,type:'candidate',payload:{candidate:'stale-first',generation:2}},{sequence:2,type:'offer',payload:{type:'offer',sdp:'v=0',generation:2}},{sequence:3,type:'offer',payload:{type:'offer',sdp:'v=0',generation:2}},{sequence:4,type:'offer',payload:{type:'offer',sdp:'v=0',generation:1}}]}
      return{state:'active',signals:[]}
    },
    sendLiveSignal:async(_id,signal)=>answers.push(signal),
  }
  const receiver=Live.createReceiver({client,sessionId:'session-refresh',receiverId:'receiver-refresh',video,pollIntervalMs:1})
  receiver.start();await new Promise(resolve=>setTimeout(resolve,15))
  assert.equal(receiver.generation,2,'receiver refresh joins the latest offer generation');assertions+=1
  const answerSignals=answers.filter(signal=>signal.type==='answer'),mediaSignals=answers.filter(signal=>signal.type==='media')
  assert.equal(answerSignals[0].payload.receiverId,'receiver-refresh');assert.equal(answerSignals[0].payload.generation,2,'answer identifies the refreshed receiver without exposing device data');assertions+=2
  assert.equal(answerSignals[0].payload.type,'answer');assert.equal(answerSignals[0].payload.sdp,'v=0','Safari-like answer retains its SDP');assertions+=2
  assert.equal(answerSignals.length,1,'duplicate and stale offers cannot create extra answers');assertions+=1
  assert.equal(mediaSignals[0].payload.generation,2);assert.ok(mediaSignals[0].payload.bytesReceived>0&&mediaSignals[0].payload.framesDecoded>0,'receiver confirms decoded media for the active generation');assertions+=2
  assert.equal(FakePeer.instances.at(-1).remoteDescription.generation,undefined);assertions+=1
  receiver.stop();FakePeer.remoteStream=null
}

{
  const remote=stream(),videoEvents=listeners(),states=[],sent=[];let answerAttempts=0,polls=0
  FakePeer.remoteStream=remote
  const video={readyState:2,srcObject:null,addEventListener(type,callback){on(videoEvents,type,callback)},play:async()=>{}}
  const client={
    receiveLiveSignals:async()=>{polls+=1;return{state:'active',signals:[{sequence:1,type:'offer',payload:{type:'offer',sdp:'v=0',generation:1}}]}},
    sendLiveSignal:async(_id,signal)=>{sent.push(signal.type);if(signal.type==='answer'){answerAttempts+=1;if(answerAttempts===1)throw new Error('response lost')}},
  }
  const receiver=Live.createReceiver({client,sessionId:'session-answer-retry',receiverId:'receiver-retry',video,pollIntervalMs:1,onState:event=>states.push(event.state)})
  receiver.start();await new Promise(resolve=>setTimeout(resolve,20))
  assert.equal(answerAttempts,2,'a lost answer response is retried once from the prepared answer');assertions+=1
  assert.ok(sent.includes('media'),'media confirmation follows the recovered answer');assertions+=1
  assert.ok(polls>=1);assert.ok(states.includes('signal-interrupted'),'a signaling interruption is visible without terminating capture');assertions+=2
  assert.equal(receiver.generation,1);assertions+=1
  receiver.stop();FakePeer.remoteStream=null
}

{
  const captured=stream(),states=[]
  const client={
    startLive:async()=>({session:{id:'session-no-receiver-media'}}),sendLiveSignal:async()=>{},
    receiveLiveSignals:async()=>({state:'active',signals:[{sequence:1,type:'answer',payload:{type:'answer',sdp:'v=0',generation:1,receiverId:'receiver-silent'}}]}),stopLive:async()=>({state:'stopped'}),
  }
  const sender=Live.createSender({client,deviceId:'device-no-receiver-media',captureProvider:async()=>captured,onState:event=>states.push(event.state)})
  await sender.start();await sender.waitConnected(100)
  await assert.rejects(()=>sender.waitMediaFlow(20),error=>error.code==='RECEIVER_MEDIA_UNCONFIRMED'&&/no confirmó imágenes/.test(error.message));assertions+=1
  assert.equal(states.includes('media-flowing'),false,'outbound bytes alone cannot confirm delivery without receiver decoded frames');assertions+=1
  await sender.stop('user')
}

{
  const captured=stream()
  const client={
    startLive:async()=>({session:{id:'session-legacy-receiver'}}),sendLiveSignal:async()=>{},
    receiveLiveSignals:async()=>({state:'active',signals:[{sequence:1,type:'answer',payload:{type:'answer',sdp:'v=0'}}]}),stopLive:async()=>({state:'stopped'}),
  }
  const sender=Live.createSender({client,deviceId:'device-legacy-receiver',captureProvider:async()=>captured,pollIntervalMs:1})
  await sender.start();await sender.waitConnected(100)
  await assert.rejects(()=>sender.waitMediaFlow(20),error=>error.code==='RECEIVER_UPDATE_REQUIRED'&&/reproductor anterior/.test(error.message));assertions+=1
  await sender.stop('user')
}

console.log(`Pantallas live-share state machine: ${assertions} assertions passed`)
