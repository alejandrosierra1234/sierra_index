import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { ApiError, createSignageHandler, isAllowedCuratedMedia } from '../../supabase/functions/_shared/signage-api-core.mjs'

const WORKSPACE='20000000-0000-4000-8000-000000000001', OTHER='20000000-0000-4000-8000-000000000002'
const SITE='30000000-0000-4000-8000-000000000001', DEVICE='40000000-0000-4000-8000-000000000001'
const SESSION='60000000-0000-4000-8000-000000000001', ASSET='50000000-0000-4000-8000-000000000001'
let assertions=0
const equal=(actual,expected,message)=>{ assert.deepEqual(actual,expected,message); assertions+=1 }
const calls=[]
const adapter={
  authorizeAdmin: async (token,workspace,capability)=>{ calls.push(['admin',workspace,capability]); if(token!=='admin-token'||workspace!==WORKSPACE) throw new ApiError(403,'CAPABILITY_DENIED','No autorizado.'); return {id:'10000000-0000-4000-8000-000000000001'} },
  authorizeDevice: async (device,token)=>{ calls.push(['device',device]); if(device!==DEVICE||token!=='device-token') throw new ApiError(401,'DEVICE_CREDENTIAL_DENIED','Credencial inválida.'); return {deviceId:DEVICE,workspaceId:WORKSPACE,credentialId:'70000000-0000-4000-8000-000000000001'} },
  rateLimit: async key=>{ if(key.includes('blocked')) throw new ApiError(429,'RATE_LIMITED','Espera.') },
  createPairing: async()=>({code:'123456',claimToken:'x'.repeat(48),expiresAt:'2030-01-01T00:00:00Z'}),
  deliverPairing: async token=>token==='x'.repeat(48)?{state:'pending'}:{state:'paired',device:{id:DEVICE},deviceToken:'secret'},
  claimPairing: async input=>({state:'claimed',device:{id:DEVICE,name:input.name,workspaceId:input.workspaceId}}),
  revokeDevice: async input=>{ calls.push(['revoke',input.workspaceId,input.actor.id]) },
  listDevices:async input=>({devices:[{id:DEVICE,workspaceId:input.workspaceId}]}),
  listActivity:async()=>({activity:[{id:1,event_type:'content.saved'}]}),
  listProgramming:async()=>({playlists:[{id:ASSET,name:'Lista',current_revision:1,entries:[]}],schedules:[{id:SESSION,device_id:DEVICE,playlist_id:ASSET,revision:1}]}),
  listExperiences:async()=>({experiences:[{id:ASSET,name:'Bienvenida'}],sessions:[]}), saveExperience:async input=>({experience:{id:ASSET,name:input.experience.name}}), startExperience:async input=>({session:{id:SESSION,state:'active'},destinations:input.deviceIds}), finishExperience:async()=>({session:{id:SESSION,state:'ended'},destinations:[DEVICE]}),
  listContent:async()=>({content:[]}), saveContent:async input=>({content:{id:ASSET,title:input.content.title}}), approveContent:async()=>({content:{status:'approved'}}),
  publish:async()=>({publication:{version:1}}), stopOutput:async input=>({state:'stopped',device:{id:input.deviceId,output_paused:true,revision:2}}), rollback:async()=>({publication:{version:2,kind:'rollback'}}), savePlaylist:async()=>({playlist:{id:ASSET}}), saveSchedule:async()=>({schedule:{id:SESSION}}),
  manifest: async()=>({schema_version:1,device_id:DEVICE,device_revision:7,state:'ready',snapshot:{type:'message',title:'Prueba'}}),
  heartbeat: async(_identity,payload)=>({accepted:true,status:payload.status}),
  signUpload: async input=>({assetId:ASSET,path:`${input.workspaceId}/${ASSET}/test.png`,upload:{url:'https://storage.invalid/signed'}}),
  completeUpload: async()=>({id:ASSET,state:'ready'}),
  liveConfigured: async()=>false,
  playerRuntime: async()=>({liveAvailable:false,iceServers:[]}), adminRuntime:async()=>({liveAvailable:false,iceServers:[]}),
  startLive: async()=>({session:{id:SESSION}}), stopLive:async()=>({state:'stopped'}),
  sendSignal:async input=>({sequence:1,type:input.signal.type}), receiveSignals:async()=>({state:'active',signals:[]}),
}
const handler=createSignageHandler(adapter,{prefix:'/signage-api',corsOrigins:['https://index.example']})
const curatedVideo='https://cdn.prod.website-files.com/673e5aab9ab2686aa6660ed3%2F67448935dfb12aa5cb9c86e9_video-cortado-transcode.mp4'
const curatedImage='https://cdn.prod.website-files.com/673e5aab9ab2686aa6660ed3/673f7b62650c2610524db19f_DSC09322-Enhanced-NR%20(1).jpg'
equal(isAllowedCuratedMedia('video',curatedVideo),true)
equal(isAllowedCuratedMedia('image',curatedImage),true)
equal(isAllowedCuratedMedia('image',curatedVideo),false)
equal(isAllowedCuratedMedia('video',curatedImage),false)
equal(isAllowedCuratedMedia('video','https://example.invalid/arbitrary.mp4'),false)
const request=async(method,route,{token,device,workspace=WORKSPACE,body,origin='https://index.example'}={})=>{
  const headers=new Headers({Origin:origin})
  if(token) headers.set('Authorization',`Bearer ${token}`)
  if(device) headers.set('X-Device-Id',device)
  if(workspace) headers.set('X-Signage-Workspace',workspace)
  if(body!==undefined) headers.set('Content-Type','application/json')
  const response=await handler(new Request(`https://edge.example/functions/v1/signage-api${route}`,{method,headers,body:body===undefined?undefined:JSON.stringify(body)}))
  return {response,payload:response.status===204?null:await response.json()}
}

let result=await request('GET','/health'); equal(result.response.status,200); equal(result.payload.liveConfigured,false)
result=await request('POST','/player/pairings'); equal(result.response.status,201); equal(result.payload.code,'123456')
const claimToken='x'.repeat(48)
result=await request('POST','/player/pairings/status',{body:{claimToken}}); equal(result.payload.state,'pending')
result=await request('GET',`/player/pairings/${claimToken}`); equal(result.payload.state,'pending')
result=await request('POST','/admin/pairings/claim',{token:'admin-token',body:{workspaceId:WORKSPACE,siteId:SITE,code:'123456',name:'Comedor'}}); equal(result.response.status,201); equal(result.payload.device.workspaceId,WORKSPACE)
result=await request('POST','/admin/pairings/claim',{token:'admin-token',workspace:OTHER,body:{workspaceId:OTHER,siteId:SITE,code:'123456',name:'Comedor'}}); equal(result.response.status,403)
result=await request('POST',`/admin/devices/${DEVICE}/revoke`,{token:'admin-token',body:{workspaceId:WORKSPACE,reason:'Equipo retirado'}}); equal(result.payload.state,'revoked'); equal(calls.at(-1)[2],'10000000-0000-4000-8000-000000000001')
result=await request('GET','/admin/devices',{token:'admin-token'}); equal(result.payload.devices[0].id,DEVICE)
result=await request('GET','/admin/activity',{token:'admin-token'}); equal(result.payload.activity[0].event_type,'content.saved')
result=await request('GET','/admin/programming',{token:'admin-token'}); equal(result.payload.playlists[0].name,'Lista'); equal(result.payload.schedules[0].device_id,DEVICE)
result=await request('GET','/admin/programming'); equal(result.response.status,401)
result=await request('GET','/admin/experiences',{token:'admin-token'}); equal(result.payload.experiences[0].name,'Bienvenida')
result=await request('POST','/admin/experiences',{token:'admin-token',body:{workspaceId:WORKSPACE,name:'Visita',displayName:'Invitado de muestra',subtitle:'Recorrido',template:'essential'}}); equal(result.response.status,201)
result=await request('POST',`/admin/experiences/${ASSET}/start`,{token:'admin-token',body:{workspaceId:WORKSPACE,deviceIds:[DEVICE],durationMinutes:60}}); equal(result.response.status,201); equal(result.payload.destinations[0],DEVICE)
result=await request('POST',`/admin/experience-sessions/${SESSION}/finish`,{token:'admin-token',body:{workspaceId:WORKSPACE}}); equal(result.payload.session.state,'ended')
result=await request('POST','/admin/content',{token:'admin-token',body:{workspaceId:WORKSPACE,type:'message',title:'Aviso',body:'Prueba'}}); equal(result.response.status,201)
result=await request('POST',`/admin/content/${ASSET}/approve`,{token:'admin-token',body:{workspaceId:WORKSPACE,expectedRevision:1}}); equal(result.payload.content.status,'approved')
result=await request('POST',`/admin/devices/${DEVICE}/publish`,{token:'admin-token',body:{workspaceId:WORKSPACE,contentId:ASSET}}); equal(result.payload.publication.version,1)
result=await request('POST',`/admin/devices/${DEVICE}/stop`,{token:'admin-token',body:{workspaceId:WORKSPACE,expectedRevision:1}}); equal(result.payload.device.output_paused,true)
result=await request('POST',`/admin/devices/${DEVICE}/stop`,{body:{workspaceId:WORKSPACE}}); equal(result.response.status,401)
result=await request('POST',`/admin/devices/${DEVICE}/rollback`,{token:'admin-token',body:{workspaceId:WORKSPACE,publicationId:ASSET}}); equal(result.payload.publication.kind,'rollback')
result=await request('POST','/admin/playlists',{token:'admin-token',body:{workspaceId:WORKSPACE,name:'Lista',entries:[{contentId:ASSET,durationSeconds:15}]}}); equal(result.response.status,201)
result=await request('POST','/admin/schedules',{token:'admin-token',body:{workspaceId:WORKSPACE,deviceId:DEVICE,playlistId:ASSET,startsAt:'2030-01-01T00:00:00Z',endsAt:'2030-01-01T01:00:00Z'}}); equal(result.response.status,201)
result=await request('GET','/player/manifest',{token:'device-token',device:DEVICE}); equal(result.response.status,200); equal(result.response.headers.get('etag'),'"device-7"')
result=await request('GET','/player/manifest',{token:'wrong',device:DEVICE}); equal(result.response.status,401)
result=await request('POST','/player/heartbeat',{token:'device-token',device:DEVICE,body:{status:'playing',errors:Array(25).fill('x')}}); equal(result.response.status,202); equal(result.payload.status,'playing')
result=await request('POST','/admin/uploads/sign',{token:'admin-token',body:{workspaceId:WORKSPACE,fileName:'test.png',contentType:'image/png',byteSize:12,sha256:'a'.repeat(64)}}); equal(result.response.status,201); equal(result.payload.assetId,ASSET)
result=await request('POST','/admin/uploads/sign',{token:'admin-token',workspace:OTHER,body:{workspaceId:OTHER,fileName:'test.png',contentType:'image/png',byteSize:12,sha256:'a'.repeat(64)}}); equal(result.response.status,403)
result=await request('POST','/admin/uploads/sign',{token:'admin-token',body:{workspaceId:WORKSPACE,fileName:'bad.svg',contentType:'image/svg+xml',byteSize:12,sha256:'a'.repeat(64)}}); equal(result.response.status,415)
result=await request('POST','/admin/uploads/sign',{token:'admin-token',body:{workspaceId:WORKSPACE,fileName:'trampa.jpg',contentType:'image/png',byteSize:12,sha256:'a'.repeat(64)}}); equal(result.response.status,400); equal(result.payload.code,'MEDIA_EXTENSION_MISMATCH')
result=await request('POST','/admin/uploads/sign',{token:'admin-token',body:{workspaceId:WORKSPACE,fileName:'clip.webm',contentType:'video/webm',byteSize:12,sha256:'a'.repeat(64)}}); equal(result.response.status,415)
result=await request('POST','/admin/uploads/sign',{token:'admin-token',body:{workspaceId:WORKSPACE,fileName:'big.mp4',contentType:'video/mp4',byteSize:52428801,sha256:'a'.repeat(64)}}); equal(result.response.status,413)
result=await request('GET','/player/runtime',{token:'device-token',device:DEVICE}); equal(result.payload.liveAvailable,false)
result=await request('GET','/player/runtime'); equal(result.response.status,401)
result=await request('POST','/admin/live-sessions',{token:'admin-token',body:{workspaceId:WORKSPACE,deviceId:DEVICE}}); equal(result.response.status,503); equal(result.payload.code,'LIVE_NOT_CONFIGURED')
result=await request('GET','/health',{origin:'https://evil.example'}); equal(result.response.status,403); equal(result.payload.code,'ORIGIN_DENIED')
result=await request('POST',`/admin/live-sessions/${SESSION}/signals`,{token:'admin-token',body:{type:'script',payload:{}}}); equal(result.response.status,400)
equal(calls.some(call=>call[0]==='admin'&&call[1]===WORKSPACE&&call[2]==='manage_devices'),true)

const here=path.dirname(fileURLToPath(import.meta.url)), root=path.resolve(here,'../..')
const edgeSource=await fs.readFile(path.join(root,'supabase/functions/signage-api/index.ts'),'utf8')
const mediaSource=await fs.readFile(path.join(root,'supabase/functions/_shared/signage-media-verify.mjs'),'utf8')
const clientSource=await fs.readFile(path.join(root,'js/signage-backend-client.js'),'utf8')
const playerSource=await fs.readFile(path.join(root,'js/signage-player.js'),'utf8')
const liveSource=await fs.readFile(path.join(root,'js/signage-live-share.js'),'utf8')
assert.match(clientSource,/claimPairing: claimToken => request\('\/player\/pairings\/status'/); assertions+=1
assert.doesNotMatch(clientSource,/pairings\/\$\{encodeURIComponent\(claimToken\)\}/); assertions+=1
assert.doesNotMatch(clientSource+playerSource+liveSource,/\?\./); assertions+=1
assert.match(liveSource,/catch \(error\) \{\s*await stop\(\)\s*throw error/s); assertions+=1
assert.match(liveSource,/addEventListener\('track',[\s\S]*options\.onConnected\(\)/); assertions+=1
assert.doesNotMatch(clientSource,/globalThis\.fetch/); assertions+=1
for(const required of ['signage_pairing_claim_service','signage_pairing_deliver_service','signage_device_manifest_service','signage_stop_output','createSignedUploadUrl','signage_device_heartbeats','inspectMedia','sha256Hex','SIGNAGE_ICE_CONFIG_URL','SIGNAGE_PAIRING_PEPPER','signage_playlist_save','signage_schedule_save']) {
  assert.match(edgeSource,new RegExp(required)); assertions+=1
}
assert.doesNotMatch(edgeSource,/SIGNAGE_MEDIA_VERIFIER_(?:URL|TOKEN)/); assertions+=1
assert.doesNotMatch(edgeSource,/product-images/); assertions+=1
assert.match(edgeSource,/rpc\('signage_device_revoke'/); assertions+=1
assert.match(edgeSource,/rpc\('signage_stop_output'/); assertions+=1
assert.match(edgeSource,/contentRevision: Number\(item\.contentRevision\)/); assertions+=1
assert.match(edgeSource,/isAllowedCuratedMedia/); assertions+=1
assert.match(edgeSource,/MEDIA_SOURCE_DENIED/); assertions+=1
for(const required of ['inspectPng','inspectJpeg','inspectMp4','MEDIA_CODEC_DENIED','MEDIA_DIMENSIONS_DENIED']){assert.match(mediaSource,new RegExp(required));assertions+=1}
const migration59=await fs.readFile(path.join(root,'update59.sql'),'utf8')
assert.doesNotMatch(migration59,/drop constraint if exists capability_grants/); assertions+=1
assert.doesNotMatch(migration59,/create or replace function public\.set_index_access/); assertions+=1
assert.match(migration59,/create table public\.signage_access_grants/); assertions+=1
console.log(`Pantallas Edge contract: ${assertions} assertions passed`)
