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

w.HTMLDialogElement.prototype.showModal=function(){this.open=true};w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'))};
w.eval(fs.readFileSync(require('node:path').join(__dirname,'../../assets/spelling/nspell.js'),'utf8'));
const engine=new w.MemoNspell({aff:fs.readFileSync(require('node:path').join(__dirname,'../../assets/spelling/es.aff'),'utf8'),dic:fs.readFileSync(require('node:path').join(__dirname,'../../assets/spelling/es.dic'),'utf8')});
assert.equal(engine.correct('comunicación'),true);assert.equal(engine.correct('comunicacion'),false);assert.ok(engine.suggest('comunicacion').includes('comunicación'));
w.memoSpellEngine=async()=>engine;
(async()=>{w.newCommunicationDraft();w.eval("_commsCurrent.subject='comunicacion';_commsCurrent.blocks=[{type:'text',richHtml:'<b>comuni</b><i>cacion</i> correcta'}]");let exported=0;w.commsExportImage=()=>exported++;await w.downloadCommunicationImage('png');assert.equal(exported,0);assert.ok(w.document.querySelector('dialog'));const fields=w.memoProofFields(w.eval('_commsCurrent')),rich=fields.find(f=>f.html);w.memoProofReplace(rich,'comunicacion','comunicación');assert.equal(w.memoProofText(rich),'comunicación correcta');assert.ok(rich.obj.richHtml.includes('<b>'));w.document.querySelector('dialog').close();assert.equal(exported,0);await w.downloadCommunicationImage('jpg');for(let i=0;i<30;i++){const keep=[...w.document.querySelectorAll('dialog button')].find(b=>b.textContent==='Conservar esta palabra');if(!keep)break;keep.click()}const proceed=[...w.document.querySelectorAll('dialog button')].find(b=>b.textContent==='Exportar JPG');assert.ok(proceed);proceed.click();assert.equal(exported,1);w.memoSpellEngine=async()=>{throw Error('offline')};await w.downloadCommunicationImage('jpg');assert.match(w.document.querySelector('dialog').textContent,/Reintentar revisión/);assert.equal(exported,1);w.document.querySelector('dialog').close();console.log('PASS: real Spanish dictionary, export gate, rich formatting, cancellation and load failure');w.close()})().catch(e=>{console.error(e);w.close();process.exitCode=1});
