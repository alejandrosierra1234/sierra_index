// Creates PDFs from synthetic content, not browser UI automation.
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';
import {rendererHtml,root} from './renderer-fixture.mjs';
import {samplePolicy} from './sample.mjs';
const out=new URL('./tmp/',import.meta.url);await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:1100,height:1400}}),errors=[],requests=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.route('**/*',async route=>{
  const url=new URL(route.request().url());requests.push({host:url.hostname,method:route.request().method()});
  if(url.origin!=='https://policy-render.invalid')return route.abort();
  const name=decodeURIComponent(url.pathname.slice(1));
  const path=name==='jspdf.js'?'tests/policy-pdf/node_modules/jspdf/dist/jspdf.umd.min.js':name==='html2canvas.js'?'tests/policy-pdf/node_modules/html2canvas/dist/html2canvas.min.js':name;
  try{await route.fulfill({body:await readFile(new URL(path,root)),contentType:path.endsWith('.js')?'text/javascript':path.endsWith('.ttf')?'font/ttf':'font/otf'})}catch{await route.fulfill({status:404,body:'Missing fixture asset'})}
 });
 await page.setContent(rendererHtml,{waitUntil:'load'});
 for(const name of ['jspdf.js','html2canvas.js','js/policy-pdf-local.js'])await page.addScriptTag({url:'https://policy-render.invalid/'+name});
 const result=await page.evaluate(async snapshot=>{
  const policy=policyNormalize(snapshot),root=document.getElementById('export-root');root.innerHTML=policyPageHtml({...policy,comments:[]});await document.fonts.ready;for(const img of root.querySelectorAll('img'))await img.decode();policyPaginateDom(document,root);
  const before=JSON.stringify(policy),progress=[],start=performance.now();
  const pending=PolicyLocalPdf.generate(policy,(title,detail,percent)=>progress.push(percent));
  let concurrent='';try{await PolicyLocalPdf.generate(policy)}catch(error){concurrent=error.message}
  const blob=await pending,elapsed=performance.now()-start;
  let failedLogo='';try{await PolicyLocalPdf.generate({...policy,companyLogo:'https://policy-render.invalid/missing.png'})}catch(error){failedLogo=error.message}
  let failedGlyph='';try{await PolicyLocalPdf.generate({...policy,title:'PRUEBA 🧵',companyLogo:''})}catch(error){failedGlyph=error.message}
  const batch=await PolicyLocalPdf.generate([policy,{...policy,confidential:false,companyLogo:''}]);
  return {pdf:Array.from(new Uint8Array(await blob.arrayBuffer())),batch:Array.from(new Uint8Array(await batch.arrayBuffer())),pages:root.querySelectorAll('.policy-page').length,text:root.innerText,progress,elapsed,concurrent,failedLogo,failedGlyph,unchanged:before===JSON.stringify(policy),leakedFrames:document.querySelectorAll('iframe').length};
 },samplePolicy);
 assert.match(result.concurrent,/Ya se está generando/);assert.match(result.failedLogo,/logotipo/);assert.match(result.failedGlyph,/carácter/);
 assert.equal(result.unchanged,true);assert.equal(result.leakedFrames,0);assert.deepEqual(errors,[]);
 assert.equal(requests.some(r=>r.method!=='GET'||r.host!=='policy-render.invalid'),false,'No snapshots/tokens sent anywhere');
 assert(result.progress.every((value,i)=>!i||value>=result.progress[i-1]));
 await writeFile(new URL('policy.pdf',out),Buffer.from(result.pdf));await writeFile(new URL('batch.pdf',out),Buffer.from(result.batch));
 const metrics={...result,pdf:undefined,batch:undefined};await writeFile(new URL('metrics.json',out),JSON.stringify(metrics,null,2));
 for(let i=0;i<result.pages;i++)await page.locator('.policy-page').nth(i).screenshot({path:new URL(`preview-${i+1}.png`,out).pathname});
 console.log(JSON.stringify({pages:result.pages,bytes:result.pdf.length,milliseconds:Math.round(result.elapsed),checks:['batch','concurrent','missing logo','missing glyph','cleanup','no mutation','no external requests']}));
}finally{await browser.close()}
