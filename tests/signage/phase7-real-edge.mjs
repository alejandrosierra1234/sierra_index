import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { createEdgeHarness } from './edge-harness.mjs'
const require=createRequire(import.meta.url),Backend=require('../../js/signage-backend-client.js')
let assertions=0;const eq=(actual,expected,message)=>{assert.deepEqual(actual,expected,message);assertions+=1}
const box=(type,payload=Buffer.alloc(0))=>{const result=Buffer.alloc(8+payload.length);result.writeUInt32BE(result.length,0);result.write(type,4,4,'ascii');payload.copy(result,8);return result}
const container=(type,...children)=>box(type,Buffer.concat(children))
const h264Mp4=()=>{const ftyp=box('ftyp',Buffer.concat([Buffer.from('isom'),Buffer.alloc(4),Buffer.from('isommp42')])),sample=box('avc1',Buffer.alloc(78)),stsd=box('stsd',Buffer.concat([Buffer.alloc(4),Buffer.from([0,0,0,1]),sample]));return Buffer.concat([ftyp,container('moov',container('trak',container('mdia',container('minf',container('stbl',stsd))))),box('mdat',Buffer.alloc(32,7))])}
const harness=createEdgeHarness({liveConfigured:false}),origin=await harness.start()
try{
  const baseUrl=origin+'/functions/v1/signage-api',workspaceId=harness.state.workspaceId,siteId=harness.state.siteId
  const config=Backend.publicConfig({enabled:true,backendUrl:baseUrl,allowedOrigins:[origin],workspaceId,siteId});eq(config.enabled,true,'public config is complete')
  assert.throws(()=>Backend.publicConfig({enabled:true,backendUrl:baseUrl,workspaceId:'bad',siteId}),/incompleta/);assertions+=1
  const admin=Backend.createClient({baseUrl,currentOrigin:origin,allowedOrigins:[origin],workspaceProvider:async()=>workspaceId,tokenProvider:async()=>'synthetic-admin-token'})
  const requestedUrls=[]
  const recordingFetch=async(url,options)=>{requestedUrls.push(String(url));return fetch(url,options)}
  const recordedAdmin=Backend.createClient({baseUrl,currentOrigin:origin,allowedOrigins:[origin],workspaceProvider:async()=>workspaceId,tokenProvider:async()=>'synthetic-admin-token',fetchImpl:recordingFetch})
  const pairing=await recordedAdmin.createPairing(),claimed=await recordedAdmin.pairDevice({workspaceId,siteId,code:pairing.code,name:'Pantalla contrato'})
  const delivered=await recordedAdmin.claimPairing(pairing.claimToken);eq(requestedUrls.some(url=>url.includes(pairing.claimToken)),false,'pairing claim token never enters a request URL')
  eq(delivered.state,'paired','pairing is delivered once')
  await assert.rejects(()=>admin.claimPairing(pairing.claimToken),error=>error.status===410);assertions+=1
  const player=Backend.createPlayerClient({baseUrl,currentOrigin:origin,allowedOrigins:[origin],deviceId:claimed.device.id,deviceToken:delivered.deviceToken})

  const createdSpace=await admin.saveSpace({workspaceId,siteId,name:'Sala sintética'});eq(createdSpace.space.name,'Sala sintética','space is created through the real Edge contract')
  const spaces=await admin.listSpaces();eq(spaces.spaces.length,1,'space list is scoped to the workspace')
  const renamed=await admin.updateDevice(claimed.device.id,{name:'Pantalla norte',spaceId:createdSpace.space.id,expectedRevision:0});eq(renamed.device.space_id,createdSpace.space.id,'device is assigned to one explicit space')
  const devices=await admin.listDevices();eq(devices.devices[0].name,'Pantalla norte','renamed device survives list contract')

  const draft=await admin.createContent({workspaceId,type:'message',title:'Mensaje aprobado',body:'Contenido sintético',theme:'neutral'})
  await assert.rejects(()=>admin.publish(claimed.device.id,draft.content.id),error=>error.status===409&&error.code==='APPROVAL_REQUIRED');assertions+=1
  await admin.approveContent(draft.content.id,draft.content.revision);await admin.publish(claimed.device.id,draft.content.id)
  const centralContent=await admin.listContent();eq(centralContent.content[0].snapshot.body,'Contenido sintético','content list carries the current central snapshot')
  const centralDevices=await admin.listDevices();eq(centralDevices.devices[0].active_publication.content_id,draft.content.id,'device list carries desired central content')
  const centralActivity=await admin.listActivity();eq(Array.isArray(centralActivity.activity),true,'central activity uses the authenticated Edge contract')
  let manifest=await player.manifest(claimed.device.id);eq(manifest.content.title,'Mensaje aprobado','manifest uses player contract');eq(manifest.revision,2,'manifest revision includes the prior device naming change')

  const curatedUrl='https://cdn.prod.website-files.com/673e5aab9ab2686aa6660ed3%2F67448935dfb12aa5cb9c86e9_video-cortado-transcode.mp4'
  const curated=await admin.createContent({workspaceId,type:'video',title:'Proceso SIERRA',body:'Fuente pública SIERRA',alt:'Proceso industrial SIERRA',mediaUrl:curatedUrl,theme:'neutral'})
  await admin.approveContent(curated.content.id,curated.content.revision);await admin.publish(claimed.device.id,curated.content.id);manifest=await player.manifest(claimed.device.id);eq(manifest.content.mediaUrl,curatedUrl,'curated public SIERRA media survives the real Edge contract')

  const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=','base64')
  const file=new File([png],'cuadro.png',{type:'image/png'}),progress=[];let interruptTransfer=true
  const retryFetch=async(url,options)=>{if(String(url).includes('/signed-upload/')&&interruptTransfer){interruptTransfer=false;throw Object.assign(new Error('interrupción sintética'),{code:'UPLOAD_INTERRUPTED'})}return fetch(url,options)}
  const retryAdmin=Backend.createClient({baseUrl,currentOrigin:origin,allowedOrigins:[origin],workspaceProvider:async()=>workspaceId,tokenProvider:async()=>'synthetic-admin-token',fetchImpl:retryFetch})
  await assert.rejects(()=>retryAdmin.upload(file,{onProgress:update=>progress.push(update.stage)}),error=>error.code==='UPLOAD_INTERRUPTED');assertions+=1
  const uploaded=await retryAdmin.upload(file,{onProgress:update=>progress.push(update.stage)});eq(uploaded.asset.state,'ready','interrupted upload can be retried safely');eq(progress.includes('verifying')&&progress.at(-1)==='complete',true,'upload reports verification and completion progress')
  await assert.rejects(()=>admin.upload(new File([Buffer.from('not a png')],'corrupto.png',{type:'image/png'})),error=>error.status===422);assertions+=1
  const interrupted=await admin.signUpload({workspaceId,fileName:'interrumpido.png',contentType:'image/png',byteSize:png.length,sha256:'a'.repeat(64)})
  await assert.rejects(()=>admin.completeUpload(interrupted.assetId),error=>error.status===409&&error.code==='UPLOAD_INCOMPLETE');assertions+=1
  await assert.rejects(()=>admin.signUpload({workspaceId,fileName:'enorme.png',contentType:'image/png',byteSize:10*1024*1024+1,sha256:'a'.repeat(64)}),error=>error.status===413);assertions+=1
  await assert.rejects(()=>admin.signUpload({workspaceId,fileName:'trampa.jpg',contentType:'image/png',byteSize:png.length,sha256:'a'.repeat(64)}),error=>error.status===400&&error.code==='MEDIA_EXTENSION_MISMATCH');assertions+=1
  const image=await admin.createContent({workspaceId,type:'image',title:'Imagen privada',alt:'Cuadro sintético',uploadId:uploaded.upload.id,theme:'neutral'})
  await admin.approveContent(image.content.id,image.content.revision);await admin.publish(claimed.device.id,image.content.id)
  manifest=await player.manifest(claimed.device.id);assert.match(manifest.content.mediaUrl,/\/media\/.*token=/);assertions+=1
  const unsignedMedia=new URL(manifest.content.mediaUrl);unsignedMedia.search='';eq((await fetch(unsignedMedia)).status,404,'private media cannot be fetched without its signed token')
  await assert.rejects(()=>admin.upload(new File([Buffer.from('not png')],'falso.png',{type:'image/png'})),error=>error.status===422);assertions+=1
  const video=await admin.upload(new File([h264Mp4()],'clip.mp4',{type:'video/mp4'}));eq(video.asset.state,'ready','H.264 MP4 follows signed byte verification contract')
  await assert.rejects(()=>admin.upload(new File([h264Mp4()],'clip.webm',{type:'video/webm'})),error=>error.status===415&&error.code==='MEDIA_TYPE_DENIED');assertions+=1
  const link=await admin.createContent({workspaceId,type:'link',title:'Enlace seguro',body:'Destino público',url:'https://example.invalid/pantallas',theme:'neutral'});await admin.approveContent(link.content.id,link.content.revision);await admin.publish(claimed.device.id,link.content.id);manifest=await player.manifest(claimed.device.id);eq(manifest.content.url,'https://example.invalid/pantallas','HTTPS link survives real Edge contract')

  const playlist=await admin.createPlaylist({workspaceId,name:'Horario real',entries:[{contentId:draft.content.id,contentRevision:draft.content.revision,durationSeconds:30}]})
  await admin.createSchedule({workspaceId,deviceId:claimed.device.id,playlistId:playlist.playlist.id,startsAt:new Date(Date.now()-60000).toISOString(),endsAt:new Date(Date.now()+3600000).toISOString(),priority:9})
  const programming=await admin.listProgramming();eq(programming.playlists[0].entries[0].contentId,draft.content.id,'central programming returns the pinned playlist entries');eq(programming.schedules[0].device_id,claimed.device.id,'central programming returns the destination schedule')
  manifest=await player.manifest(claimed.device.id);eq(manifest.content.title,'Mensaje aprobado','active schedule overrides direct publication');eq(manifest.schedule.priority,9,'schedule priority survives contract')
  const stopped=await admin.stopOutput(claimed.device.id,manifest.revision);eq(stopped.device.output_paused,true,'stop targets the selected device')
  manifest=await player.manifest(claimed.device.id);eq(manifest.state,'stopped','stop persists in the real Edge contract');eq(manifest.content,null,'stopped output hides scheduled and direct content');eq(manifest.schedule,null,'an active schedule cannot immediately restart a stopped screen')
  await admin.publish(claimed.device.id,draft.content.id)
  manifest=await player.manifest(claimed.device.id);eq(manifest.state,'ready','an intentional publication resumes a stopped screen')
  await player.heartbeat({playerVersion:'test',status:'playing',lastManifestRevision:manifest.revision,errors:[]});eq(harness.state.heartbeats.length,1,'heartbeat reaches Edge handler')
  const runtime=await player.runtime();eq(runtime.liveAvailable,false,'runtime denies unconfigured live video')
  await assert.rejects(()=>admin.startLive(claimed.device.id),error=>error.status===503&&error.code==='LIVE_NOT_CONFIGURED');assertions+=1

  harness.state.revokeFailure=true
  await assert.rejects(()=>admin.revokeDevice(claimed.device.id,'Fallo sintético'),error=>error.status===500);assertions+=1
  manifest=await player.manifest(claimed.device.id);eq(manifest.deviceId,claimed.device.id,'failed revocation is atomic')
  harness.state.revokeFailure=false;await admin.revokeDevice(claimed.device.id,'Retiro aprobado')
  await assert.rejects(()=>player.manifest(claimed.device.id),error=>error.status===401);assertions+=1
  console.log(`Pantallas real Edge harness: ${assertions} assertions passed`)
}finally{await harness.stop()}
