const BUCKET='sample-digitization';
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const response=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
async function boundedJSON(req){
 const reader=req.body?.getReader();if(!reader)throw Error('body');let length=0;const chunks=[];
 try{for(;;){const {value,done}=await reader.read();if(done)break;length+=value.length;if(length>2*1024*1024)throw Error('body');chunks.push(value)}}finally{await reader.cancel()}
 const raw=new Uint8Array(length);let offset=0;for(const chunk of chunks){raw.set(chunk,offset);offset+=chunk.length}return JSON.parse(new TextDecoder().decode(raw));
}
export function createHandler(service){return async(req)=>{
 if(req.method!=='POST')return response({error:'method'},405);
 // This endpoint is for a native worker, never for scripts running in a browser.
 if(req.headers.has('origin'))return response({error:'origin'},403);
 const token=req.headers.get('authorization')?.match(/^Bearer ([a-zA-Z0-9_-]{43,128})$/)?.[1];
 if(!token)return response({error:'unauthorized'},401);
 try{
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(token));
  const hash=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
  const auth=await service.from('digitization_worker_credentials').select('id,name,bootstrap_job_id').eq('token_hash',hash).eq('active',true).maybeSingle();
  if(auth.error||!auth.data)return response({error:'unauthorized'},401);
  let body;try{body=await boundedJSON(req)}catch{return response({error:'invalid_body'},400)}
  const {action,job_id,lease}=body||{},credential=auth.data;
  const rpc=async(name,params={})=>{const r=await service.rpc(name,params);if(r.error)throw Error('backend');return r.data};
  if(action==='heartbeat'){
   const r=await service.from('digitization_workers').upsert({id:credential.id,seen_at:new Date().toISOString(),version:'1.1.0',detail:{engine:'PaddleOCR 3.3.2',device:'cpu',name:credential.name}});if(r.error)throw Error('backend');return response(true);
  }
  if(action==='claim')return response(await rpc('digitization_claim'));
  if(!UUID.test(job_id||''))return response({error:'job'},400);
  const lookup=await service.from('digitization_jobs').select('id,batch_id,status,ready,lease,lease_until,original_path').eq('id',job_id).maybeSingle();
  if(lookup.error)throw Error('backend');const job=lookup.data;
  if(!job)return response({error:'job'},404);
  if(action==='bootstrap_upload'){
   if(credential.bootstrap_job_id!==job.id||job.ready||job.status!=='Pending')return response({error:'forbidden'},403);
   const signed=await service.storage.from(BUCKET).createSignedUploadUrl(job.original_path,{upsert:false});if(signed.error)throw Error('backend');return response({url:signed.data.signedUrl});
  }
  if(!UUID.test(lease||'')||job.lease!==lease||job.status!=='Processing'||Date.parse(job.lease_until)<=Date.now())return response({error:'lease'},409);
  if(action==='renew')return response(await rpc('digitization_renew',{p_id:job.id,p_lease:lease}));
  if(action==='finish'){
   const result=body.result??null,error=body.error??null;
   if(error!==null&&typeof error!=='string')return response({error:'result'},400);
   if(result!==null&&(typeof result!=='object'||Array.isArray(result)||!result.fields||!Array.isArray(result.lines)))return response({error:'result'},400);
   if(result===null&&!error)return response({error:'result'},400);
   return response(await rpc('digitization_finish',{p_id:job.id,p_lease:lease,p_result:result,p_error:error?.slice(0,2000)??null}));
  }
  if(action==='cached')return response(await rpc('digitization_cached',{p_id:job.id}));
  if(action==='download'){
   let path=job.original_path;
   if(body.cached===true){const cached=await rpc('digitization_cached',{p_id:job.id});if(!cached)return response({error:'cache'},404);path=cached.processed_path}
   const signed=await service.storage.from(BUCKET).createSignedUrl(path,90);if(signed.error)throw Error('backend');return response({url:signed.data.signedUrl});
  }
  if(action==='upload'){
   const path=`${job.batch_id}/${job.id}/processed-${lease}.jpg`;
   const signed=await service.storage.from(BUCKET).createSignedUploadUrl(path,{upsert:false});if(signed.error)throw Error('backend');return response({url:signed.data.signedUrl});
  }
  return response({error:'action'},400);
 }catch{return response({error:'backend_unavailable'},503)}
}}
