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
let checks=0;function test(name,fn){fn();console.log('PASS: '+name);checks++}
w.HTMLDialogElement.prototype.showModal=function(){this.open=true};w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'))};
w.newCommunicationDraft();const id=w.eval('_commsCurrent.id');
w.eval("_commsCurrent.status='Aprobado';_commsCurrent.category='Política';_commsCurrent.department='Operaciones';_commsCurrent.tags=['urgente'];_commsCurrent.signature='data:image/png;base64,AA'");w.commsPersist();
const folio=w.eval('_commsCurrent.communicationNumber');
test('archive keeps status and classification; restore keeps folio',()=>{w.commsLifecycle(id,'archive');let d=w.eval('_commsDrafts[0]');assert.equal(d.lifecycle,'archived');assert.equal(d.status,'Aprobado');w.commsLifecycle(id,'trash');assert.equal(w.eval('_commsDrafts[0].previousLifecycle'),'archived');w.commsLifecycle(id,'restore');d=w.eval('_commsDrafts[0]');assert.equal(d.lifecycle,'archived');assert.equal(d.communicationNumber,folio);assert.equal(d.category,'Política')});
test('duplicate creates independent draft, folio and unsigned copy',()=>{w.commsDuplicate(id);let d=w.eval('_commsCurrent');assert.notEqual(d.id,id);assert.ok(d.communicationNumber>folio);assert.equal(d.status,'Borrador');assert.equal(d.lifecycle,'active');assert.equal(d.signature,'');assert.equal(d.department,'Operaciones');assert.deepEqual(Array.from(d.tags),['urgente']);d.tags.push('otra');assert.equal(w.eval('_commsDrafts.find(d=>d.id=== '+JSON.stringify(id)+').tags.length'),1)});
test('editor and library render only Index selectors',()=>{assert.equal(w.document.querySelectorAll('select').length,0);assert.ok(w.document.querySelector('.pd-select'));w.commsBack();assert.equal(w.document.querySelectorAll('select').length,0);const input=w.document.querySelector('.comms-search');input.focus();w.eval("_commsQuery='urgente'");w.renderCommunicationsResults();assert.equal(w.document.activeElement,input);assert.equal(w.commsFiltered().length,1)});
test('storage failure cannot archive or discard a record',()=>{const original=w.Storage.prototype.setItem;w.Storage.prototype.setItem=function(){throw Error('quota')};w.commsLifecycle(id,'unarchive');assert.equal(w.eval('_commsDrafts.find(d=>d.id=== '+JSON.stringify(id)+').lifecycle'),'archived');w.Storage.prototype.setItem=original});
test('signature removal can be undone',()=>{w.openCommunicationDraft(id);w.commsLifecycle(id,'unarchive');w.openCommunicationDraft(id);w.commsRemoveSignature();assert.equal(w.eval('_commsCurrent.signature'),'');w.commsUndoEdit();assert.match(w.eval('_commsCurrent.signature'),/^data:/)});
test('new department remains available before autosave',()=>{w.eval("_commsCurrent.department='Finanzas'");assert.ok(w.commsDepartments().includes('Finanzas'))});
test('deletion cancels autosave and preserves consecutive numbers',()=>{w.commsAutosave();w.commsLifecycle(id,'trash');w.commsDeletePermanently(id);const dialog=w.document.querySelector('dialog');assert.ok(dialog);dialog.querySelectorAll('button')[1].click();assert.equal(w.eval('_commsDrafts.some(d=>d.id=== '+JSON.stringify(id)+')'),false);assert.equal(w.eval('_commsCurrent'),null);assert.ok(w.createCommunicationDraft().communicationNumber>folio)});
test('palette uses documented colors and selected state',()=>{w.newCommunicationDraft();const button=w.document.querySelector('[data-memo-color]');button.dataset.color='rgb(0, 74, 134)';w.commsColorMenu({currentTarget:button,stopPropagation(){}});const options=w.document.querySelectorAll('.comms-color-option');assert.equal(options.length,31);assert.equal(w.document.querySelector('.comms-color-option[aria-pressed="true"]').title,'Azul oscuro · #004a86');w.commsCloseMenu()});
test('all communication icon keys exist and destructive controls are labeled',()=>{
  const moduleSource=source.slice(start,end);
  for(const [,name] of moduleSource.matchAll(/siIcon\('([^']+)'/g))assert.ok(w.siIcon(name),`Missing icon ${name}`);
  w.newCommunicationDraft();
  for(const type of ['image','table','orgchart','process','banner'])w.commsAddBlock(type);
  assert.equal(w.document.querySelectorAll('.memo-insert-icon svg').length,13);
  assert.ok(w.document.querySelector('[aria-label="Eliminar etapa"] svg'));
  assert.ok(w.document.querySelector('[aria-label="Eliminar persona"] svg'));
  for(const button of w.document.querySelectorAll('button'))if(button.querySelector('svg')&&!button.textContent.trim())assert.ok(button.getAttribute('aria-label')||button.title,'Icon button needs a name');
  assert.ok(w.document.querySelector('.memo-upload[tabindex="0"][role="button"]'));
});
test('memo events reuse SIERRA identity and survive saving and export',()=>{
  w.newCommunicationDraft();w.commsAddBlock('event');
  const b=w.eval('_commsCurrent.blocks.at(-1)');
  assert.equal(b.type,'event');
  for(const [key,value] of Object.entries({title:'Capacitacion',date:'2026-09-15',department:'Talento Humano',mode:'ambos',location:'Sala 1',virtualUrl:'https://example.com/event',color:'#009fff'}))w.commsSetBlock(b.id,key,value);
  const html=w.memoBlockHtml(b),box=w.document.createElement('div');box.innerHTML=html;
  assert.equal(box.querySelector('.sierra-event-date .invite-date-day').textContent,'15');
  assert.equal(box.querySelectorAll('.memo-event').length,1);
  const layout=box.querySelector('.memo-event-layout');
  assert.equal(layout.children.length,2);
  assert.ok(layout.firstElementChild.classList.contains('sierra-event-date'));
  const content=layout.lastElementChild;
  assert.ok(content.classList.contains('memo-event-content'));
  assert.ok(content.querySelector('h3'));
  assert.ok(content.querySelector('.memo-event-logistics'));
  assert.equal(layout.style.alignItems,'start');
  assert.equal(box.querySelector('h3').style.fontSize,'14pt');
  for(const icon of box.querySelectorAll('.memo-event-detail svg')){
    assert.ok(icon.parentElement.classList.contains('memo-event-icon'));
    assert.equal(icon.parentElement.style.borderRadius,'2mm');
    assert.equal(icon.parentElement.style.background,'rgb(245, 245, 245)');
    assert.equal(icon.parentElement.style.color,'rgb(11, 11, 11)');
  }
  assert.equal(box.querySelector('.sierra-department'),null,'memos never display the department mark, including older event blocks');
  assert.ok(!w.commsEventEditor(b,'').includes('Departamento organizador'));
  assert.equal(box.querySelector('a').getAttribute('href'),'https://example.com/event');
  w.commsPersist();assert.equal(w.eval('_commsDrafts[0].blocks.at(-1).type'),'event');
  assert.ok(w.memoPrintDocumentHtml(w.eval('_commsCurrent')).includes('sierra-event-date'));
  w.commsSetBlock(b.id,'virtualUrl','javascript:alert(1)');
  assert.ok(!w.memoBlockHtml(w.eval('_commsCurrent.blocks.at(-1)')).includes('href="javascript:'));
  const invite=w.createInvitationDraft();const inviteBox=w.document.createElement('div');inviteBox.innerHTML=w.invitationPageHtml(invite);
  assert.ok(inviteBox.querySelector('.sierra-department path'),'invitations keep the department mark');
  assert.ok(inviteBox.querySelector('.sierra-event-date'));
});
test('contact and CTA blocks save, export and preserve safe written links',()=>{
  w.newCommunicationDraft();
  for(const type of ['contact','cta']){
    w.commsAddBlock(type);const b=w.eval('_commsCurrent.blocks.at(-1)');
    Object.assign(b,{name:'Ana <Test>',title:'Inscripcion',role:'Analista',email:'ana@example.com',phone:'+504 1234 5678',src:'data:image/png;base64,AA',buttonAction:'link',url:'https://example.com/registro',showButton:true,showQr:true,qrImage:'data:image/png;base64,AA'});
    const box=w.document.createElement('div');box.innerHTML=w.memoBlockHtml(b);
    assert.ok(box.querySelector('.memo-action-image'));
    assert.equal(box.querySelector('.memo-action-button').getAttribute('href'),b.url);
    assert.ok(box.textContent.includes(b.url));
    if(type==='contact'){assert.ok(box.textContent.includes(b.name));assert.ok(box.querySelector('a[href^="mailto:"]'));assert.ok(box.querySelector('a[href^="tel:"]'))}
    else assert.ok(box.querySelector('.memo-action-qr'));
    w.commsActionCardSet(b.id,'url','https://example.com/nuevo');assert.equal(b.qrImage,'');
    b.showButton=false;box.innerHTML=w.memoBlockHtml(b);assert.equal(box.querySelector('.memo-action-button'),null);assert.ok(box.textContent.includes(b.url));
    b.url='javascript:alert(1)';b.showButton=true;box.innerHTML=w.memoBlockHtml(b);assert.equal(box.querySelector('.memo-action-button').getAttribute('aria-disabled'),'true');assert.equal(box.querySelector('.memo-action-button').hasAttribute('href'),false);
    b.url='';box.innerHTML=w.memoBlockHtml(b);assert.ok(box.querySelector('.memo-action-button'));assert.equal(box.querySelector('.memo-action-button').getAttribute('aria-disabled'),'true');
    b.url='www.example.com/registro';box.innerHTML=w.memoBlockHtml(b);assert.equal(box.querySelector('.memo-action-button').getAttribute('href'),'https://www.example.com/registro');assert.ok(box.textContent.includes(b.url));
    b.url='https://example.com/final';w.commsPersist();
    assert.equal(w.eval('_commsDrafts[0].blocks.at(-1).type'),type);
    assert.ok(w.memoPrintDocumentHtml(w.eval('_commsCurrent')).includes('memo-'+type));
  }
});
test('CTA colors preserve a white QR sticker and right-side image',()=>{
  const b={type:'cta',title:'Registro',text:'Participa',url:'https://example.com',showQr:true,qrImage:'data:image/png;base64,AA',src:'data:image/png;base64,AA'};
  const box=w.document.createElement('div');box.innerHTML=w.memoActionCardHtml(b);
  assert.equal(box.firstElementChild.style.background,'rgb(255, 255, 255)');
  Object.assign(b,{backgroundColor:'#007d73',textColor:'#ffffff'});box.innerHTML=w.memoActionCardHtml(b);
  assert.equal(box.firstElementChild.style.background,'rgb(0, 125, 115)');
  assert.equal(box.querySelector('h3').style.color,'rgb(255, 255, 255)');
  assert.equal(box.firstElementChild.lastElementChild.className,'memo-action-media');
  assert.equal(box.querySelector('.memo-action-image').style.height,'100%');
  assert.equal(box.querySelector('.memo-action-image').style.objectFit,'cover');
  const sticker=box.querySelector('.memo-qr-sticker');assert.equal(sticker.style.background,'rgb(255, 255, 255)');assert.equal(sticker.style.padding,'1.5mm');assert.ok(sticker.querySelector('.memo-action-qr'));
  Object.assign(b,{showButton:true,buttonColor:'#ffc529'});box.innerHTML=w.memoActionCardHtml(b);
  assert.equal(box.querySelector('.memo-action-button').style.background,'rgb(255, 197, 41)');
  assert.equal(box.querySelector('.memo-action-button').style.color,'rgb(11, 11, 11)');
  b.src='';box.innerHTML=w.memoActionCardHtml(b);assert.equal(box.firstElementChild.style.gridTemplateColumns,'minmax(0,1fr)');
});
test('contact buttons default to email with a paper plane and editable text',()=>{
  const b={type:'contact',name:'Ana',email:'ana@example.com',showButton:true,buttonText:'Contactar'};
  const box=w.document.createElement('div');box.innerHTML=w.memoActionCardHtml(b);
  const button=box.querySelector('.memo-action-button');assert.equal(button.getAttribute('href'),'mailto:ana%40example.com');assert.ok(button.querySelector('svg'));assert.equal(button.textContent,'Envíale un correo a Ana');
  b.buttonText='Escríbeme';box.innerHTML=w.memoActionCardHtml(b);assert.equal(box.querySelector('.memo-action-button').textContent,'Escríbeme');
  b.email='';box.innerHTML=w.memoActionCardHtml(b);assert.equal(box.querySelector('.memo-action-button').getAttribute('aria-disabled'),'true');
});
test('large icon blocks support rich text and optional buttons without spelling review',()=>{
  w.newCommunicationDraft();w.commsAddBlock('feature');const b=w.eval('_commsCurrent.blocks.at(-1)');
  Object.assign(b,{title:'Plataforma',richHtml:'<strong>SIERRA</strong> <u>Nexus</u>',showButton:true,url:'https://example.com'});
  const box=w.document.createElement('div');box.innerHTML=w.memoBlockHtml(b);
  assert.ok(box.querySelector('.memo-feature-icon svg'));assert.ok(box.querySelector('strong'));assert.ok(box.querySelector('u'));assert.ok(box.querySelector('.memo-feature-button[href]'));
  assert.ok(!w.commsRichEditorHtml(b).includes('spellcheck="true"'));
  assert.ok(!w.downloadCommunicationImage.toString().includes('commsReviewExport'));
  assert.ok(!w.printCommunicationMemo.toString().includes('commsReviewExport'));
  assert.ok(!w.commsExportPdf.toString().includes('window.open'));
  assert.ok(!w.commsExportPdf.toString().includes('print('));
});
test('typing keeps the preview frame, focus and scale stable before paint',()=>{
  const raf=w.requestAnimationFrame;let pendingFrames=0;
  w.requestAnimationFrame=()=>{pendingFrames++};
  for(const create of [w.newCommunicationDraft,w.newInvitationDraft]){
    create();
    const host=w.document.getElementById('memo-live-preview'),stage=w.document.getElementById('memo-preview-stage');
    const sheet=host.querySelector('.memo-preview-sheet'),input=w.document.querySelector('.memo-customizer input.control-input');
    Object.defineProperty(stage,'clientWidth',{configurable:true,value:600});
    Object.defineProperty(stage,'clientHeight',{configurable:true,value:700});
    Object.defineProperty(w.HTMLElement.prototype,'offsetWidth',{configurable:true,get(){return this.classList.contains('memo-page')?816:0}});
    Object.defineProperty(w.HTMLElement.prototype,'scrollHeight',{configurable:true,get(){return this.classList.contains('memo-page')?1056:0}});
    input.focus();stage.scrollTop=120;
    for(const subject of ['Prueba','Prueba de escritura','Prueba de escritura continua']){
      w.commsSet('subject',subject);
      assert.equal(host.querySelector('.memo-preview-sheet'),sheet);
      assert.equal(w.document.activeElement,input);
      assert.equal(stage.scrollTop,120);
      assert.equal(host.style.width,'552px');
      assert.match(sheet.style.transform,/^scale\(0\.676/);
      assert.ok(sheet.textContent.includes(subject));
    }
  }
  assert.equal(pendingFrames,0,'preview must not expose an unscaled frame while waiting for RAF');
  w.requestAnimationFrame=raf;clearTimeout(w.eval('_commsSaveTimer'));
});
async function qrChecks(){
  w.newCommunicationDraft();w.commsAddBlock('cta');const id=w.eval('_commsCurrent.blocks.at(-1).id');
  w.commsActionCardSet(id,'url','https://example.com/first');
  let finish;w.QRCode={toDataURL(url,options,callback){assert.equal(options.margin,4);finish=callback}};
  const pending=w.commsActionCardQr(id);
  w.commsActionCardSet(id,'url','https://example.com/second');finish(null,'data:image/png;base64,OLD');await pending;
  assert.equal(w.eval('_commsCurrent.blocks.at(-1).qrImage'),'');
  const current=w.commsActionCardQr(id);finish(null,'data:image/png;base64,NEW');await current;
  assert.equal(w.eval('_commsCurrent.blocks.at(-1).qrImage'),'data:image/png;base64,NEW');
  const gone=w.commsActionCardQr(id);w.eval('_commsCurrent.blocks.pop()');finish(null,'data:image/png;base64,GONE');await gone;
  console.log('PASS: QR generation ignores stale URLs and deleted blocks');checks++;
}
qrChecks().then(()=>{console.log(checks+' management checks passed');w.close()}).catch(error=>{console.error(error);w.close();process.exitCode=1});
