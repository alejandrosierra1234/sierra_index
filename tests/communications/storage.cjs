const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const {JSDOM}=require('jsdom');
const source=fs.readFileSync(require('node:path').join(__dirname,'../../index.html'),'utf8');
const dom=new JSDOM('<div id="pg"></div><div id="sec-title"></div><div id="sec-sub"></div>',{url:'https://test.local',runScripts:'outside-only'});
const w=dom.window;w.eval=code=>vm.runInContext(code,dom.getInternalVMContext());w.esc=v=>String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');w.escAttr=w.esc;w.siIcon=()=>'';w.setSecCrumbs=()=>{};w.requestAnimationFrame=()=>{};w.document.queryCommandState=()=>false;
w.jsStr=v=>String(v??'').replaceAll("'","\\'");w.clearSecCrumbs=()=>{};w.toast=()=>{};
w.eval(source.slice(source.indexOf('function pdSelect('),source.indexOf('/* ═',source.indexOf('function pickPdSelect('))));
let scripts=0;for(const match of source.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){if(!match[2].trim()||/application\/ld\+json/.test(match[1]))continue;new vm.Script(match[2]);scripts++}console.log(`PASS: syntax of ${scripts} inline scripts`);
w.eval(source.match(/const PRODUCT_COUNTRIES = \[[^\n]+/)[0]);
const start=source.indexOf("const COMMS_STORE_KEY="),end=source.indexOf('\n',source.indexOf('function printCommunicationMemo()',start));
w.eval('const LBL_LOGO_SVG="";\n'+source.slice(start,end));

w.eval(source.slice(source.indexOf('const SI_ICON = {'),source.indexOf('// StatusBadge (',source.indexOf('const SI_ICON = {'))));

w.HTMLElement.prototype.scrollIntoView=function(){};

w.indexedDB=require('fake-indexeddb').indexedDB;w.TextEncoder=TextEncoder;Object.defineProperty(w.crypto,'subtle',{value:require('node:crypto').webcrypto.subtle});
(async()=>{const payload='data:image/png;base64,'+'A'.repeat(6*1024*1024);const key=await w.commsAssetStore(payload);assert.match(key,/^sierra-memo-asset:/);assert.equal(await w.commsAssetStore(payload),key);const d=w.createCommunicationDraft({id:'large',signature:payload,blocks:[{id:'img',type:'image',src:payload}]});assert.equal(w.commsWriteAll([d]),true);assert.ok(w.localStorage.getItem('sierra_communications_v1').length<3000);assert.equal(w.commsStorageParse(w.localStorage.getItem('sierra_communications_v1'))[0].signature,payload);w.eval('_commsAssetIds.clear();_commsAssetValues.clear()');await w.commsPrepareStorage();w.commsLoad();assert.equal(w.eval('_commsDrafts[0].blocks[0].src'),payload);console.log('PASS: image over localStorage limit persists once and reloads from IndexedDB');
const legacy='data:image/png;base64,legacy';w.localStorage.setItem('sierra_communications_v1',JSON.stringify([{id:'old',blocks:[{type:'image',src:legacy}]}]));w.localStorage.setItem('sierra_memo_signatures_v1',JSON.stringify([{id:'sig',signature:legacy}]));await w.commsPrepareStorage();assert.ok(!w.localStorage.getItem('sierra_communications_v1').includes(legacy));assert.equal(w.commsSignatureRecords()[0].signature,legacy);console.log('PASS: legacy memo and signature migrate without losing original image');
w.localStorage.setItem('sierra_communications_v1',JSON.stringify([{id:'missing',blocks:[{src:'sierra-memo-asset:missing'}]}]));const before=w.localStorage.getItem('sierra_communications_v1');await assert.rejects(w.commsPrepareStorage(),/Falta una imagen/);assert.equal(w.localStorage.getItem('sierra_communications_v1'),before);console.log('PASS: missing asset cannot overwrite stored records');w.close()})().catch(e=>{console.error(e);w.close();process.exitCode=1});
