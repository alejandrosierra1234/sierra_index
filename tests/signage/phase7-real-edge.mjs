import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { createEdgeHarness } from './edge-harness.mjs'
const require=createRequire(import.meta.url),Backend=require('../../js/signage-backend-client.js')
let assertions=0;const eq=(actual,expected,message)=>{assert.deepEqual(actual,expected,message);assertions+=1}
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

  const draft=await admin.createContent({workspaceId,type:'message',title:'Mensaje aprobado',body:'Contenido sintético',theme:'neutral'})
  await assert.rejects(()=>admin.publish(claimed.device.id,draft.content.id),error=>error.status===409&&error.code==='APPROVAL_REQUIRED');assertions+=1
  await admin.approveContent(draft.content.id,draft.content.revision);await admin.publish(claimed.device.id,draft.content.id)
  let manifest=await player.manifest(claimed.device.id);eq(manifest.content.title,'Mensaje aprobado','manifest uses player contract');eq(manifest.revision,1,'manifest revision is normalized')

  const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=','base64')
  const file=new File([png],'cuadro.png',{type:'image/png'}),uploaded=await admin.upload(file);eq(uploaded.asset.state,'ready','signed upload is finalized')
  harness.state.verifierConfigured=false
  await assert.rejects(()=>admin.upload(new File([png],'sin-verificador.png',{type:'image/png'})),error=>error.status===503&&error.code==='MEDIA_VERIFIER_NOT_CONFIGURED');assertions+=1
  harness.state.verifierConfigured=true
  const image=await admin.createContent({workspaceId,type:'image',title:'Imagen privada',alt:'Cuadro sintético',uploadId:uploaded.upload.id,theme:'neutral'})
  await admin.approveContent(image.content.id,image.content.revision);await admin.publish(claimed.device.id,image.content.id)
  manifest=await player.manifest(claimed.device.id);assert.match(manifest.content.mediaUrl,/\/media\//);assertions+=1
  await assert.rejects(()=>admin.upload(new File([Buffer.from('not png')],'falso.png',{type:'image/png'})),error=>error.status===422);assertions+=1
  const webm=await admin.upload(new File([Buffer.from([0x1a,0x45,0xdf,0xa3,0x01,0x00,0x00,0x00])],'clip.webm',{type:'video/webm'}));eq(webm.asset.state,'ready','video follows signed verification contract')
  const link=await admin.createContent({workspaceId,type:'link',title:'Enlace seguro',body:'Destino público',url:'https://example.invalid/pantallas',theme:'neutral'});await admin.approveContent(link.content.id,link.content.revision);await admin.publish(claimed.device.id,link.content.id);manifest=await player.manifest(claimed.device.id);eq(manifest.content.url,'https://example.invalid/pantallas','HTTPS link survives real Edge contract')

  const playlist=await admin.createPlaylist({workspaceId,name:'Horario real',entries:[{contentId:draft.content.id,contentRevision:draft.content.revision,durationSeconds:30}]})
  await admin.createSchedule({workspaceId,deviceId:claimed.device.id,playlistId:playlist.playlist.id,startsAt:new Date(Date.now()-60000).toISOString(),endsAt:new Date(Date.now()+3600000).toISOString(),priority:9})
  manifest=await player.manifest(claimed.device.id);eq(manifest.content.title,'Mensaje aprobado','active schedule overrides direct publication');eq(manifest.schedule.priority,9,'schedule priority survives contract')
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
