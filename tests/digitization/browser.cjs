// Synthetic UI fixture; never a replacement for staging/pilot verification.
const {chromium}=require('../policy-pdf/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..');
(async()=>{
 const html=fs.readFileSync(path.join(root,'index.html'),'utf8');const styles=[...html.split('</head>')[0].matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m=>m[0]).join('\n');
 const fixture=`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${styles}<link rel="stylesheet" href="/css/sample-digitization.css"><style>body{padding:24px;overflow:auto}#host{max-width:1200px;margin:auto}</style></head><body><h1>SIERRA INDEX · SYNTHETIC UI TEST</h1><div id="host"><div id="pg"></div></div><script>
 let appLang='es',me={id:'00000000-0000-0000-0000-000000000001'};const AUTH_DIVISIONS=['fabric'],DIV_LBL={fabric:'Telas'};const can=()=>true;
 const esc=v=>String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');const toast=()=>{};
 function showSampleTool(){return document.getElementById('pg')}
 const batch={id:'00000000-0000-0000-0000-000000000010',name:'SYNTHETIC PILOT',division:'fabric'};
 const job={id:'00000000-0000-0000-0000-000000000020',batch_id:batch.id,filename:'Synthetic label',status:'Needs Review',revision:1,original_path:'synthetic',processed_path:'synthetic',fields:{'Development Code':{value:'TEST-001',original:'TEST-001',source_lines:[0],ocr_confidence:.96,interpretation_confidence:.98}},warnings:[],result:{width:1400,height:900,text:'Development Code: TEST-001',lines:[{polygon:[[40,160],[800,160],[800,220],[40,220]]}]}};
 const sb={from(table){const q={select(){return q},order(){return q},eq(){return q},limit(){return q},range(){return q},single(){return Promise.resolve({data:table==='digitization_jobs'?job:{id:true,revision:1,config:{concurrency:1}}})},then(resolve){return Promise.resolve({data:table==='digitization_batches'?[batch]:table==='digitization_jobs'?[job]:[],count:1}).then(resolve)}};return q},rpc:async(name)=>({data:name==='digitization_metrics'?{timing:{},accuracy:[],productivity:[],pending:0}:null}),storage:{from(){return {download:async()=>({data:await (await fetch('/work/ocr-fixtures/synthetic.png')).blob()})}}}};
 </script><script src="/js/digitization-core.js"></script><script src="/js/sample-digitization.js"></script></body></html>`;
 fs.writeFileSync(path.join(root,'work/ocr-fixtures/browser-fixture.html'),fixture);
 const server=http.createServer((req,res)=>{if(req.url==='/fixture'){res.setHeader('Content-Type','text/html');res.end(fixture);return}const name=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(!name.startsWith(root+path.sep)){res.writeHead(403).end();return}fs.readFile(name,(err,data)=>{if(err){res.writeHead(404).end();return}res.setHeader('Content-Type',name.endsWith('.js')?'application/javascript':name.endsWith('.css')?'text/css':name.endsWith('.png')?'image/png':'application/octet-stream');res.end(data)})});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({headless:true});try{const page=await browser.newPage();const errors=[];page.on('pageerror',e=>{errors.push(e.message);console.error('PAGE',e.message)});await page.goto(`http://127.0.0.1:${server.address().port}/fixture`);await page.evaluate(()=>showSampleDigitization());await page.evaluate(()=>sdChoose(batch.id));
 for(const width of [320,375,768,1024,1440]){await page.setViewportSize({width,height:1000});await page.evaluate(()=>sdCaptureView());assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'capture overflow '+width);await page.evaluate(()=>sdReview(job.id));await page.locator('#sd-field-0').focus();await page.waitForFunction(()=>document.querySelector('#sd-overlay polygon'));assert.equal(await page.locator('#sd-overlay polygon').count(),1);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'review overflow '+width);if(width===1440||width===375)await page.screenshot({path:path.join(root,`work/ocr-fixtures/review-${width}.png`),fullPage:true})}
 // Durable outbox remains scoped to the account and survives reopening the DB.
 assert.equal(await page.evaluate(async()=>{const box=await DigitizationCore.outbox('synthetic-test');await box.run('readwrite',s=>s.put({id:'one',file:new Blob(['x'])}));const reopened=await DigitizationCore.outbox('synthetic-test');return reopened.run('readonly',(s,set)=>{const r=s.count();r.onsuccess=()=>set(r.result)})}),1);
 const recovery=await page.evaluate(async()=>{
  await sdCaptureView();
  const originalRPC=sb.rpc,originalStorage=sb.storage,owner=me.id;
  let rejectBad=true,offline=false,uploads=0,downloads=0,switchAccount=false;
  sb.rpc=async(name,args)=>{if(name==='digitization_enqueue'){if(switchAccount)me={id:'another-account'};return {data:{id:args.p_id,original_path:args.p_filename,revision:1,ready:false}}}return {data:null}};
  sb.storage={from:()=>({upload:async(path)=>{if(offline)return {error:{statusCode:503,message:'Synthetic network failure'}};if(rejectBad&&path==='bad.png')return {error:{statusCode:403,message:'Synthetic rejected image'}};uploads++;return {error:null}},download:async()=>{downloads++;throw Error('Unexpected download')}})};
  const put=async(id,name)=>sd.outbox.run('readwrite',store=>store.put({id,name,batch:batch.id,hash:'a'.repeat(64),file:new File(['synthetic'],name,{type:'image/png'})}));
  await put('a','bad.png');await put('b','good.png');await sdPump();
  const isolated=await sdLocalUploads();const validAdvanced=uploads===1&&isolated.failed===1&&isolated.pending===0&&downloads===0;
  sd.outbox=await DigitizationCore.outbox(owner);await put('c','another-good.png');await sdPump();
  const reopened=await sdLocalUploads();const survivedReload=reopened.failed===1&&uploads===2;
  rejectBad=false;await sdRetryUploads();const retried=(await sdLocalUploads()).failed===0&&uploads===3;
  offline=true;await put('d','network.png');await put('e','after-network.png');await sdPump();
  const interrupted=await sdLocalUploads();offline=false;await sdPump();const recovered=interrupted.pending===2&&interrupted.failed===0&&(await sdLocalUploads()).pending===0;
  switchAccount=true;const before=uploads;await put('f','account.png');await sdPump();const isolatedAccount=uploads===before;me={id:owner};switchAccount=false;await sdPump();
  const originalBox=sd.outbox;let hashSwitchBlocked=false;
  try{await sdQueue({name:'switch.png',size:1,arrayBuffer:async()=>{me={id:'hash-other'};sd.account='hash-other';sd.outbox=await DigitizationCore.outbox('hash-other');return new Uint8Array([1]).buffer}},batch.id,owner)}catch(error){hashSwitchBlocked=error.message==='Account changed'&&(await sdLocalUploads()).pending===0}
  me={id:owner};sd.account=owner;sd.outbox=originalBox;
  sb.rpc=originalRPC;sb.storage=originalStorage;
  return {validAdvanced,survivedReload,retried,recovered,isolatedAccount,hashSwitchBlocked};
 });
 assert.deepEqual(recovery,{validAdvanced:true,survivedReload:true,retried:true,recovered:true,isolatedAccount:true,hashSwitchBlocked:true});
 const bulk=await page.evaluate(async()=>{
  const originalRPC=sb.rpc,originalStorage=sb.storage;let uploaded=0,maxPending=0,ticks=0;
  const timer=setInterval(()=>ticks++,10);
  sb.rpc=async(name,args)=>{if(name==='digitization_enqueue'){const counts=await sdLocalUploads();maxPending=Math.max(maxPending,counts.pending);return {data:{id:args.p_id,original_path:args.p_filename,revision:1,ready:false}}}return {data:null}};
  sb.storage={from:()=>({upload:async()=>{uploaded++;return {error:null}}})};
  const canvas=document.createElement('canvas');canvas.width=1;canvas.height=1;const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
  const files=Array.from({length:4001},(_,i)=>new File([blob,String(i)],`synthetic-${i}.png`,{type:'image/png'}));
  try{await sdImport(files);while(sd.pumping)await new Promise(resolve=>setTimeout(resolve,10));return {uploaded,maxPending,ticks,remaining:await sdLocalUploads()}}
  finally{clearInterval(timer);sb.rpc=originalRPC;sb.storage=originalStorage}
 });
 assert.equal(bulk.uploaded,4001);assert.ok(bulk.maxPending<=21,JSON.stringify(bulk));assert.ok(bulk.ticks>1);assert.equal(bulk.remaining.pending+bulk.remaining.failed,0);
 console.log('PASS: per-file upload failures, retry after reopening, network recovery, account isolation, 4,001 synthetic browser uploads with bounded outbox');
 assert.deepEqual(errors,[]);console.log('PASS: browser capture/review at 320/375/768/1024/1440, field overlays, persistent outbox');
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);process.exit(1)});
