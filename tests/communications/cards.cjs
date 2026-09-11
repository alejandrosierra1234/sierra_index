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

let checks=0;function test(name,fn){fn();console.log('PASS: '+name);checks++}
w.newCommunicationDraft();w.commsAddBlock('cards');const id=w.eval('_commsCurrent.blocks.at(-1).id');
test('column changes preserve all cards and render two to four tracks',()=>{const b=w.commsCardBlock(id);b.cards.forEach((c,i)=>{c.title='Tarjeta '+i;c.richHtml='<b>Descripción</b> '+i});for(const count of [2,3,4]){w.commsSetBlock(id,'columns',count);const current=w.commsCardBlock(id);assert.equal(current.cards.length,3);const doc=new JSDOM(w.memoCardsHtml(current)).window.document;assert.equal(doc.querySelectorAll('.memo-card').length,3);assert.match(doc.querySelector('.memo-card-row').getAttribute('style'),new RegExp('repeat\\('+count));assert.equal(doc.querySelectorAll('strong').length,3)}});
test('nested rich editing reaches only the selected card',()=>{const b=w.commsCardBlock(id),second=b.cards[1].id;w.commsPickCard(id,second);const editor=w.document.querySelector('[data-block-id="'+second+'"]');assert.ok(editor);editor.innerHTML='<b>Texto corregido</b>';w.commsRichInput(editor);assert.equal(w.commsCardBlock(id).cards[1].content,'Texto corregido');assert.equal(w.commsCardBlock(id).cards[0].title,'Tarjeta 0');assert.ok(w.memoProofFields(w.eval('_commsCurrent')).some(f=>f.key==='richHtml'&&f.obj.id===second))});
test('duplicate and reorder keep images and text; deletion supports undo',()=>{const b=w.commsCardBlock(id),selected=b.cards[1];selected.src='data:image/png;base64,AA';w.commsCardAction(id,'duplicate');const after=w.commsCardBlock(id);assert.equal(after.cards.length,4);assert.notEqual(after.cards[1].id,after.cards[2].id);assert.equal(after.cards[2].src,selected.src);const uid=after.cards[2].id;w.commsCardAction(id,'previous');assert.equal(w.commsCardBlock(id).cards[1].id,uid);w.commsCardAction(id,'delete');assert.equal(w.commsCardBlock(id).cards.length,3);w.commsUndoEdit();assert.equal(w.commsCardBlock(id).cards.length,4)});
test('all export documents include cards and safe text with complete images by default',()=>{const b=w.commsCardBlock(id);b.title='<script>test</script>';b.cards[0].title='<img onerror=evil>';const draft=w.eval('_commsCurrent');for(const html of [w.memoImageDocumentHtml(draft),w.memoPrintDocumentHtml(draft)]){const doc=new JSDOM(html).window.document;assert.equal(doc.querySelectorAll('.memo-card').length,4);assert.equal(doc.querySelectorAll('.memo-card h4 img').length,0);assert.equal(doc.querySelector('.memo-card img').style.objectFit,'contain');assert.match(doc.querySelector('style').textContent,/memo-card-row/)}});
console.log(checks+' card grid checks passed');w.close();
