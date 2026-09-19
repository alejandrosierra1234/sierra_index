const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict')
const {JSDOM}=require('jsdom')
const dom=new JSDOM(`<!doctype html><div id="tb-section"></div><div id="product-controls"></div><div id="sec-title"></div><div id="sec-sub"></div><div id="pg"></div>`,{url:'https://test.local',runScripts:'outside-only'})
const w=dom.window
Object.assign(w,{
  me:{id:'info-test'},_navLeaf:null,
  syncModule(){},leaveView(){},renderSidebarTree(){},clearSecCrumbs(){},
  esc:v=>String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;'),
  escAttr:v=>String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;'),
  siIcon:name=>`<svg data-icon="${name}"></svg>`,memoLogoHtml:()=>'<div class="memo-logo">SIERRA</div>',
  sierraDepartmentHtml:(name,color)=>`<div class="sierra-department" style="color:${color}">${name}</div>`,
  toast(){},requestAnimationFrame:fn=>fn(),confirm:()=>true,
  commsConfirm:(title,body,fn)=>fn(),
})
w.eval=code=>vm.runInContext(code,dom.getInternalVMContext())
w.HTMLElement.prototype.scrollIntoView=function(){}
w.HTMLDialogElement.prototype.showModal=function(){this.open=true}
w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'))}
w.eval(fs.readFileSync(path.join(__dirname,'../../js/infographic-builder.js'),'utf8'))

;(async()=>{
w.showInfographics()
assert.equal(w.document.getElementById('sec-title').textContent,'Creador de infografías')
assert.equal(w.document.querySelector('.info-page').style.width,'816px')
assert.equal(w.document.querySelector('.info-page').style.height,'1056px')
assert.match(w.document.querySelector('.info-title').textContent,/Título de la infografía/)
assert.match(w.document.querySelector('.info-footer').textContent,/Comunicaciones Corporativas/)
assert.match(w.document.querySelector('.info-footer').textContent,/SIERRA/)
assert.equal(w.document.querySelectorAll('[data-info-block]').length,4)
console.log('PASS: infographic workspace opens with Letter art, title, modules and branded footer')

w.infoAddBlock('cta')
assert.equal(w.document.querySelectorAll('[data-info-block]').length,5)
assert.ok(w.document.querySelector('.info-cta-link'))
w.infoSetBlock(w.document.querySelector('[data-info-block].info-selected').dataset.infoBlock,'span',6)
assert.match(w.document.querySelector('[data-info-block].info-selected').getAttribute('style'),/--info-span:6/)
console.log('PASS: modules can be added and resized in the 12-column layout')

w.infoAddBlock('callout')
const iconBlock=w.document.querySelector('[data-info-block].info-selected').dataset.infoBlock
assert.ok(w.document.querySelectorAll('.info-icon-choice').length>=16)
assert.doesNotMatch(w.document.getElementById('info-inspector').textContent,/Esquinas|Espacio interior/)
w.infoSetBlock(iconBlock,'iconColor','#ff0000');w.infoSetBlock(iconBlock,'iconBackground','#00ff00')
const plaque=w.document.querySelector(`[data-info-block="${iconBlock}"] .info-icon-plaque`)
assert.match(plaque.getAttribute('style'),/--info-icon-color:#ff0000/)
assert.match(plaque.getAttribute('style'),/--info-icon-bg:#00ff00/)
assert.equal(w.document.querySelector('.info-feature-item')?.style.borderRight,'')
console.log('PASS: visual icon picker, editable icon colors and divider-free cards preserve the SIERRA system')

w.infoSelect('header');w.infoSetMeta('title','Seguridad primero')
assert.equal(w.document.querySelector('.info-title').textContent,'Seguridad primero')
w.infoSelect('page');w.infoSetPreset('custom')
const sizeDialog=w.document.querySelector('.info-size-dialog')
assert.ok(sizeDialog?.open)
sizeDialog.querySelector('#info-custom-width').value='1200'
sizeDialog.querySelector('#info-custom-height').value='1500'
sizeDialog.querySelector('.btn-primary').click()
assert.equal(w.document.querySelector('.info-page').style.width,'1200px')
assert.equal(w.document.querySelector('.info-page').style.height,'1500px')
console.log('PASS: required heading and custom canvas dimensions update live')

const textId=w.document.querySelector('[data-info-block]').dataset.infoBlock
w.infoSelect(textId)
const editor=w.document.querySelector('[data-info-rich]')
editor.innerHTML='<p><strong>Seguro</strong> <u>visible</u><img src=x onerror="alert(1)"></p><script>alert(1)</script>'
w.infoRichInput(textId,editor)
const output=w.document.querySelector(`[data-info-output="${textId}"]`).innerHTML
assert.match(output,/<strong>Seguro<\/strong>/)
assert.match(output,/<u>visible<\/u>/)
assert.doesNotMatch(output,/script|onerror/i)
console.log('PASS: rich formatting survives while unsafe pasted markup is removed')

const saved=JSON.parse(w.localStorage.getItem('sierra_infographics_v1:info-test'))
assert.ok(saved.designs.length)
assert.equal(saved.activeId,saved.designs[0].id)
console.log('PASS: infographic drafts persist per signed-in user')

let downloaded='',pdfSaved=''
w.html2canvas=async()=>({toBlob:callback=>callback(new w.Blob(['png'],{type:'image/png'})),toDataURL:()=> 'data:image/jpeg;base64,AA=='})
w.URL.createObjectURL=()=> 'blob:test';w.URL.revokeObjectURL=()=>{}
w.HTMLAnchorElement.prototype.click=function(){downloaded=this.download}
w.jspdf={jsPDF:function(){return{internal:{pageSize:{getWidth:()=>215.9,getHeight:()=>279.4}},setProperties(){},addImage(){},save(name){pdfSaved=name}}}}
await w.infoExport('png');await w.infoExport('pdf')
assert.match(downloaded,/\.png$/);assert.match(pdfSaved,/\.pdf$/)
console.log('PASS: PNG and PDF exports trigger downloadable files')
w.close()
})().catch(error=>{console.error(error);process.exitCode=1})
