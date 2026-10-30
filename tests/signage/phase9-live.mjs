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
  async createOffer(){return{type:'offer',sdp:'v=0'}}
  async createAnswer(){return{type:'answer',sdp:'v=0'}}
  async setLocalDescription(value){this.localDescription=value}
  async setRemoteDescription(value){this.remoteDescription=value;this.currentRemoteDescription=value;this.connectionState='connected';this.iceConnectionState='connected';emit(this.events,'connectionstatechange');emit(this.events,'iceconnectionstatechange');if(value.type==='offer'&&FakePeer.remoteStream)emit(this.events,'track',{streams:[FakePeer.remoteStream]})}
  async addIceCandidate(){}
  async getStats(){return new Map([['video',{type:'outbound-rtp',kind:'video',bytesSent:2048,isRemote:false}]])}
  close(){this.connectionState='closed';this.iceConnectionState='closed'}
}
FakePeer.instances=[]

globalThis.RTCPeerConnection=FakePeer
const Live=require(path.join(root,'js/signage-live-share.js'))

function track(){const events=listeners();return{readyState:'live',addEventListener(type,callback){on(events,type,callback)},stop(){this.readyState='ended'},end(){this.readyState='ended';emit(events,'ended')}}}
function stream(){const video=track();return{video,getTracks:()=>[video],getVideoTracks:()=>[video]}}

{
  const captured=stream(),states=[],signals=[],stops=[]
  const client={startLive:async()=>({session:{id:'session-1'}}),sendLiveSignal:async(id,signal)=>signals.push([id,signal]),receiveLiveSignals:async()=>({state:'active',signals:[{sequence:1,type:'answer',payload:{type:'answer',sdp:'v=0'}}]}),stopLive:async(id,options)=>stops.push([id,options])}
  const sender=Live.createSender({client,deviceId:'device-1',iceServers:[],captureProvider:async()=>captured,onState:event=>states.push(event.state)})
  await sender.start();await sender.waitConnected(100);await sender.waitMediaFlow(100)
  assert.equal(sender.state,'media-flowing');assertions+=1
  assert.equal(signals[0][1].type,'offer');assertions+=1
  assert.ok(states.includes('connected')&&states.includes('media-flowing'));assertions+=1
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
  const video={readyState:0,srcObject:null,addEventListener(type,callback){on(videoEvents,type,callback)},play:async()=>{}}
  const client={
    receiveLiveSignals:async()=>({state:'active',signals:[{sequence:1,type:'offer',payload:{type:'offer',sdp:'v=0'}}]}),
    sendLiveSignal:async()=>{},
  }
  let confirmed=0,errors=0
  const receiver=Live.createReceiver({client,sessionId:'session-receiver',iceServers:[],video,disconnectGraceMs:5,onState:event=>states.push(event.state),onConnected:()=>{confirmed+=1},onError:()=>{errors+=1}})
  await receiver.start()
  await new Promise(resolve=>setTimeout(resolve,0))
  assert.equal(confirmed,0,'the track event alone must not claim visible video');assertions+=1
  video.readyState=2;emit(videoEvents,'loadeddata')
  assert.equal(confirmed,1);assertions+=1
  assert.equal(video.srcObject,remote);assertions+=1
  assert.ok(states.includes('connected')&&states.includes('media-flowing'));assertions+=1
  const peer=FakePeer.instances.at(-1);peer.connectionState='disconnected';emit(peer.events,'connectionstatechange');await new Promise(resolve=>setTimeout(resolve,10))
  assert.equal(errors,1,'a sustained receiver disconnect becomes an actionable error');assertions+=1
  receiver.stop();FakePeer.remoteStream=null
}

console.log(`Pantallas live-share state machine: ${assertions} assertions passed`)
