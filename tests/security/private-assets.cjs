const assert=require('node:assert/strict');
const {create}=require('../../js/private-assets.js');
const origin='https://vhyddogeemohtqijohry.supabase.co',publicUrl=origin+'/storage/v1/object/public/product-images/employees/photo.png';
(async()=>{
 let calls=[],allow=true;
 const assets=create({origin,key:'public-key',fetch:async(url,init)=>{
   calls.push({url,init});
   if(String(url).includes('/object/sign/'))return new Response(JSON.stringify(allow?{signedURL:'/object/sign/product-images/employees/photo.png?token=temporary'}:{error:'denied'}),{status:allow?200:403});
   return new Response(JSON.stringify({photo:publicUrl,captions:{[publicUrl]:'Photo'}}),{headers:{'content-type':'application/json'}});
 }});
 assert.equal(assets.path('https://attacker.test/storage/v1/object/public/product-images/a'),null);
 const response=await assets.fetch(origin+'/rest/v1/employees',{headers:{Authorization:'Bearer alice'}}),body=await response.json();
 assert.equal(body.photo,origin+'/storage/v1/object/sign/product-images/employees/photo.png?token=temporary');
 assert.equal(calls.filter(c=>c.url.includes('/object/sign/')).length,1);
 assert.equal(Object.keys(body.captions)[0],body.photo);
 assert.equal(calls[1].init.headers.Authorization,'Bearer alice');
 await assets.fetch(origin+'/rest/v1/employees',{method:'PATCH',headers:{Authorization:'Bearer alice','Content-Type':'application/json'},body:JSON.stringify(body)});
 const saved=JSON.parse(calls.find(c=>c.init?.method==='PATCH').init.body);
 assert.equal(saved.photo,publicUrl);assert.equal(Object.keys(saved.captions)[0],publicUrl);
 assets.scope('Bearer bob');allow=false;
 await assert.rejects(assets.resolve(publicUrl),/denied/);
 assert.equal(calls.at(-1).init.headers.Authorization,'Bearer bob');
 const denied=await assets.fetch(origin+'/rest/v1/employees',{headers:{Authorization:'Bearer bob'}});
 assert.equal((await denied.json()).photo,publicUrl);
 // PostgREST count-only HEAD requests advertise JSON but deliberately have no body.
 for(const inputKind of ['init','request','override']){
  const original=new Response(null,{status:200,headers:{'content-type':'application/json','content-range':'*/7'}});
  const client=create({origin,key:'public-key',fetch:async()=>original});
  const url=origin+'/rest/v1/digitization_jobs?select=id';
  const input=inputKind==='init'?url:new Request(url,{method:inputKind==='override'?'GET':'HEAD'});
  const result=await client.fetch(input,inputKind==='request'?undefined:{method:'HEAD'});
  assert.equal(result,original);assert.equal(result.bodyUsed,false);assert.equal(result.headers.get('content-range'),'*/7');
 }
 for(const status of [204,205,304]){
  const original=new Response(null,{status,headers:{'content-type':'application/json'}});
  const client=create({origin,key:'public-key',fetch:async()=>original});
  assert.equal(await client.fetch(origin+'/rest/v1/rpc/digitization_action',{method:'POST'}),original);
 }
 console.log('PASS: HEAD counts and bodyless HTTP statuses preserve the original response and headers');
 console.log('PASS: private assets honor session, reject foreign origins, deduplicate signing, and never persist temporary tokens');
})().catch(e=>{console.error(e);process.exitCode=1});
