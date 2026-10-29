import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createSignageHandler } from '../../supabase/functions/_shared/signage-api-core.mjs'

const UUIDS={workspace:'20000000-0000-4000-8000-000000000001',experience:'50000000-0000-4000-8000-000000000001',session:'60000000-0000-4000-8000-000000000001',device:'40000000-0000-4000-8000-000000000001',asset:'70000000-0000-4000-8000-000000000001'}
let assertions=0,calls=[]
const adapter={
  authorizeAdmin:async(token,workspace,capability)=>{if(token!=='admin')throw Object.assign(new Error('No'),{status:401,code:'AUTH'});calls.push(['auth',workspace,capability]);return{id:'user',token}},
  getExperience:async input=>({experience:{id:input.experienceId,kind:'presentation',snapshot:{slides:[]}}}),
  savePresentation:async input=>{calls.push(['save',input.presentation]);return{experience:{id:UUIDS.experience,kind:'presentation',snapshot:{slides:input.presentation.slides,pageCount:input.presentation.slides.length}}}},
  stepExperience:async input=>{calls.push(['step',input]);return{session:{id:input.sessionId,current_slide:input.targetSlide,control_revision:input.expectedControlRevision+1},destinations:[UUIDS.device],slide_count:2}},
  liveConfigured:async()=>false,
}
const handler=createSignageHandler(adapter,{prefix:'/signage-api',corsOrigins:['https://index.test']})
async function request(method,path,body,token='admin'){
  const headers={'Origin':'https://index.test','X-Signage-Workspace':UUIDS.workspace};if(token)headers.Authorization=`Bearer ${token}`;if(body)headers['Content-Type']='application/json'
  const response=await handler(new Request(`https://edge.test/signage-api${path}`,{method,headers,body:body?JSON.stringify(body):undefined}));return{response,payload:await response.json().catch(()=>null)}
}
let result=await request('POST','/admin/presentations',{workspaceId:UUIDS.workspace,name:'Presentación sintética',slides:[{mediaAssetId:UUIDS.asset,alt:'Diapositiva 1',width:1280,height:720,index:0}]})
assert.equal(result.response.status,201);assertions+=1
assert.equal(result.payload.experience.kind,'presentation');assertions+=1
result=await request('GET',`/admin/experiences/${UUIDS.experience}`)
assert.equal(result.payload.experience.id,UUIDS.experience);assertions+=1
result=await request('POST',`/admin/experience-sessions/${UUIDS.session}/step`,{workspaceId:UUIDS.workspace,targetSlide:1,expectedControlRevision:0})
assert.equal(result.payload.session.current_slide,1);assertions+=1
assert.equal(calls.find(call=>call[0]==='step')[1].expectedControlRevision,0);assertions+=1
result=await request('POST',`/admin/experience-sessions/${UUIDS.session}/step`,{workspaceId:UUIDS.workspace,targetSlide:1,expectedControlRevision:-1})
assert.equal(result.response.status,400);assertions+=1
result=await request('POST','/admin/presentations',{workspaceId:UUIDS.workspace,name:'x',slides:[]})
assert.equal(result.response.status,400);assertions+=1
result=await request('GET',`/admin/experiences/${UUIDS.experience}`,null,'')
assert.equal(result.response.status,401);assertions+=1

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..')
const edge=await fs.readFile(path.join(root,'supabase/functions/signage-api/index.ts'),'utf8')
const migration=await fs.readFile(path.join(root,'update66.sql'),'utf8')
assert.match(edge,/rpc\('signage_presentation_save'/);assertions+=1
assert.match(edge,/rpc\('signage_experience_step'/);assertions+=1
assert.match(edge,/content_type','image\/png'/);assertions+=1
assert.doesNotMatch(edge,/service_role[^\n]*(?:window|globalThis|localStorage)/i);assertions+=1
assert.match(migration,/security definer set search_path=''/i);assertions+=1
assert.match(migration,/grant execute on function public\.signage_presentation_save[\s\S]*to authenticated/i);assertions+=1
assert.match(migration,/revoke all on function public\.signage_presentation_save[\s\S]*from public,anon,authenticated/i);assertions+=1
assert.doesNotMatch(migration,/grant (?:insert|update|delete) on public\.signage_/i);assertions+=1
console.log(`Pantallas presentation Edge contract: ${assertions} assertions passed`)
