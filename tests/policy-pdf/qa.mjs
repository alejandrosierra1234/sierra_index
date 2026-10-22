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
  const realistic=document.createElement('canvas');realistic.width=1400;realistic.height=900;const paint=realistic.getContext('2d');paint.clearRect(0,0,realistic.width,realistic.height);paint.fillStyle='#e72b67';paint.beginPath();paint.arc(420,430,270,0,Math.PI*2);paint.fill();paint.fillStyle='#16cdbe';paint.fillRect(700,180,520,520);paint.fillStyle='rgba(255,255,255,.72)';paint.font='700 120px sans-serif';paint.fillText('SIERRA',455,500);const realisticPhoto=realistic.toDataURL('image/webp',.92);snapshot.sections=snapshot.sections.map(section=>({...section,html:section.html.replace(/data:image\/png;base64,[A-Za-z0-9+/=]+/g,realisticPhoto)}));realistic.width=realistic.height=1;
  const policy=policyNormalize(snapshot),root=document.getElementById('export-root');root.innerHTML=policyPageHtml({...policy,comments:[]});await document.fonts.ready;for(const img of root.querySelectorAll('img'))await img.decode();policyPaginateDom(document,root);
  const before=JSON.stringify(policy),progress=[],start=performance.now();
  const pending=PolicyLocalPdf.generate(policy,(title,detail,percent)=>progress.push(percent));
  let concurrent='';try{await PolicyLocalPdf.generate(policy)}catch(error){concurrent=error.message}
  const blob=await pending,elapsed=performance.now()-start;
  let failedLogo='';try{await PolicyLocalPdf.generate({...policy,companyLogo:'https://policy-render.invalid/missing.png'})}catch(error){failedLogo=error.message}
  let failedGlyph='';try{await PolicyLocalPdf.generate({...policy,title:'PRUEBA 🧵',companyLogo:''})}catch(error){failedGlyph=error.message}
  const batch=await PolicyLocalPdf.generate([policy,{...policy,confidential:false,companyLogo:''}]);
  const renderedPages=[...root.querySelectorAll('.policy-page')],pageTexts=renderedPages.map(node=>node.innerText),overflowingPages=renderedPages.filter(node=>{const area=node.querySelector('.policy-page-content');return area.scrollHeight>area.clientHeight+1}).length;
  return {pdf:Array.from(new Uint8Array(await blob.arrayBuffer())),batch:Array.from(new Uint8Array(await batch.arrayBuffer())),pages:pageTexts.length,pageTexts,text:root.innerText,contentImages:root.querySelectorAll('.policy-section-body figure img').length,overflowingPages,progress,elapsed,concurrent,failedLogo,failedGlyph,unchanged:before===JSON.stringify(policy),leakedFrames:document.querySelectorAll('iframe').length};
 },samplePolicy);
 assert.match(result.concurrent,/Ya se está generando/);assert.match(result.failedLogo,/logotipo/);assert.match(result.failedGlyph,/carácter/);
 assert.equal(result.unchanged,true);assert.equal(result.leakedFrames,0);assert.deepEqual(errors,[]);
 assert.equal(requests.some(r=>r.method!=='GET'||r.host!=='policy-render.invalid'),false,'No snapshots/tokens sent anywhere');
 assert.match(result.pageTexts[0],/03\s+LINEAMIENTOS GENERALES/,'A long section should use the remaining space on the current page');
 assert.match(result.pageTexts[1],/LINEAMIENTOS GENERALES · CONTINUACIÓN/,'A split section should continue with a clear repeated heading');
 for(let i=1;i<=12;i++)assert.match(result.text,new RegExp(`RECURSO-UNICO-${i}(?:\\s|$)`),`List item ${i} must survive pagination`);
 assert.match(result.text,/COLA-UNICA-DESPUES-DE-LA-LISTA/,'Content after a paginated list must survive');
 assert.match(result.text,/IMAGEN-AJUSTABLE-ANTES/);assert.match(result.text,/IMAGEN-AJUSTABLE-DESPUES/);
 const beforeManual=result.pageTexts.findIndex(text=>text.includes('ANTES-SALTO-MANUAL')),afterManual=result.pageTexts.findIndex(text=>text.includes('DESPUES-SALTO-MANUAL'));
 assert(beforeManual>=0&&afterManual>beforeManual,'A manual page break must move following content to a later page');
 assert.doesNotMatch(result.text,/Salto de página/,'The editor-only page break marker must not print');
 for(let i=1;i<=9;i++)assert.match(result.text,new RegExp(`FILA-MEDIA-${i}(?:\\s|$)`),`Table row ${i} must survive pagination`);
 assert.equal(result.contentImages,2,'Image blocks survive in normal text and inside a table cell');
 assert.equal(result.overflowingPages,0,'No page may clip content outside its printable area');
 assert(result.progress.every((value,i)=>!i||value>=result.progress[i-1]));
 await writeFile(new URL('policy.pdf',out),Buffer.from(result.pdf));await writeFile(new URL('batch.pdf',out),Buffer.from(result.batch));
 const metrics={...result,pdf:undefined,batch:undefined};await writeFile(new URL('metrics.json',out),JSON.stringify(metrics,null,2));
 for(let i=0;i<result.pages;i++)await page.locator('.policy-page').nth(i).screenshot({path:new URL(`preview-${i+1}.png`,out).pathname});
 console.log(JSON.stringify({pages:result.pages,bytes:result.pdf.length,milliseconds:Math.round(result.elapsed),checks:['batch','concurrent','missing logo','missing glyph','cleanup','no mutation','no external requests']}));
}finally{await browser.close()}
