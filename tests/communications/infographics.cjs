const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict')
const {JSDOM}=require('jsdom')
const iconCatalog=JSON.parse(fs.readFileSync(path.join(__dirname,'../../data/infographic-icons.json'),'utf8'))
const infographicCss=fs.readFileSync(path.join(__dirname,'../../css/infographic-builder.css'),'utf8')
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
  fetch:async()=>({ok:true,json:async()=>iconCatalog}),
  commsConfirm:(title,body,fn)=>fn(),
})
w.eval=code=>vm.runInContext(code,dom.getInternalVMContext())
w.HTMLElement.prototype.scrollIntoView=function(){}
w.HTMLDialogElement.prototype.showModal=function(){this.open=true}
w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'))}
w.eval(fs.readFileSync(path.join(__dirname,'../../js/infographic-builder.js'),'utf8'))

;(async()=>{
w.localStorage.setItem('sierra_infographics_v1:info-test',JSON.stringify({activeId:'legacy-info',designs:[{id:'legacy-info',title:'Título de la infografía',department:'Comunicaciones Corporativas',mutedColor:'#6b6b63',blocks:[{id:'legacy-callout',type:'callout',background:'#fff3c4',color:'#171717',iconBackground:'#d9f7f3',iconColor:'#006da8'},{id:'legacy-text',type:'text'},{id:'legacy-image',type:'image'},{id:'legacy-features',type:'features'}]}]}))
w.showInfographics()
assert.equal(w.document.getElementById('sec-title').textContent,'Creador de infografías')
assert.equal(w.document.querySelector('.info-page').style.width,'816px')
assert.equal(w.document.querySelector('.info-page').style.height,'1056px')
assert.match(w.document.querySelector('.info-title').textContent,/Título de la infografía/)
assert.match(w.document.querySelector('.info-footer').textContent,/Comunicaciones Corporativas/)
assert.match(w.document.querySelector('.info-footer').textContent,/SIERRA/)
assert.equal(w.document.querySelectorAll('[data-info-block]').length,4)
assert.equal(w.document.querySelector('.info-callout-layout').style.getPropertyValue('--info-card-bg'),'#efefaf')
assert.equal(w.document.querySelector('.info-callout-layout').style.getPropertyValue('--info-family-base'),'#c4c412')
assert.equal(w.document.querySelector('.info-callout-layout').style.getPropertyValue('--info-family-dark'),'#827e00')
console.log('PASS: infographic workspace opens with Letter art, title, modules and branded footer')

w.infoAddBlock('cta')
assert.equal(w.document.querySelectorAll('[data-info-block]').length,5)
assert.ok(w.document.querySelector('.info-cta-link'))
w.infoSetBlock(w.document.querySelector('[data-info-block].info-selected').dataset.infoBlock,'span',6)
assert.match(w.document.querySelector('[data-info-block].info-selected').getAttribute('style'),/--info-span:6/)
w.infoSetBlock(w.document.querySelector('[data-info-block].info-selected').dataset.infoBlock,'heightMode','fill',true)
assert.equal(w.document.querySelector('[data-info-block].info-selected').dataset.infoHeight,'fill')
console.log('PASS: modules can be resized and choose content or remaining-space height')

w.infoAddBlock('callout')
const iconBlock=w.document.querySelector('[data-info-block].info-selected').dataset.infoBlock
assert.ok(w.document.querySelector('.info-icon-trigger'))
assert.doesNotMatch(w.document.getElementById('info-inspector').textContent,/Esquinas|Espacio interior/)
w.infoOpenIconPicker(iconBlock);await new Promise(resolve=>setTimeout(resolve,0))
assert.ok(Object.keys(iconCatalog).length>1000)
assert.match(w.document.querySelector('[data-info-icon-status]').textContent,/5,130 iconos disponibles/)
assert.ok(w.document.querySelectorAll('.info-catalog-icon').length>=10)
const iconSearch=w.document.querySelector('.info-icon-dialog input[type="search"]');iconSearch.value='ambulance';iconSearch.dispatchEvent(new w.Event('input',{bubbles:true}))
assert.ok(w.document.querySelector('[data-info-icon="ambulance"]'))
w.document.querySelector('[data-info-icon="ambulance"]').click()
assert.ok(w.document.querySelector(`[data-info-block="${iconBlock}"] .info-icon-plaque svg`))
assert.equal(w.document.querySelectorAll('.info-family-field[aria-label="Familia de color"] .info-family-option').length,8)
assert.equal(w.document.querySelectorAll('input[type="color"],input[aria-label="Código hexadecimal"]').length,0)
w.infoSetFamily('block',iconBlock,'','orange')
let callout=w.document.querySelector(`[data-info-block="${iconBlock}"] .info-callout-layout`)
assert.equal(callout.style.getPropertyValue('--info-family-light'),'#ffe3d2')
assert.equal(callout.style.getPropertyValue('--info-family-base'),'#ff7824')
assert.equal(callout.style.getPropertyValue('--info-family-dark'),'#cd4f00')
w.infoSetAppearance('block',iconBlock,'','surfaceStyle','gray');w.infoSetAppearance('block',iconBlock,'','textTone','black')
callout=w.document.querySelector(`[data-info-block="${iconBlock}"] .info-callout-layout`)
assert.equal(callout.style.getPropertyValue('--info-card-bg'),'#f5f5f5')
assert.equal(callout.style.getPropertyValue('--info-heading'),'#0b0b0b')
w.infoSetAppearance('block',iconBlock,'','surfaceStyle','outline')
callout=w.document.querySelector(`[data-info-block="${iconBlock}"] .info-callout-layout`)
assert.equal(callout.style.getPropertyValue('--info-card-bg'),'transparent')
assert.equal(callout.style.getPropertyValue('--info-card-border'),'#ff7824')
assert.equal(w.document.querySelector('.info-feature-item')?.style.borderRight,'')
assert.ok(w.document.querySelector('.info-features-block'))
w.infoSelect('legacy-features')
const firstItemEditor=w.document.querySelector('.info-item-editor')
assert.ok([...firstItemEditor.querySelectorAll('button')].some(button=>button.textContent.trim()==='Gris'))
assert.ok([...firstItemEditor.querySelectorAll('button')].some(button=>button.textContent.trim()==='Contorno'))
assert.ok([...firstItemEditor.querySelectorAll('button')].some(button=>button.textContent.trim()==='Negro'))
assert.match(infographicCss,/grid-template-columns:repeat\(auto-fit,minmax\(min\(150px,100%\),1fr\)\)/)
assert.match(infographicCss,/@container \(max-width:620px\)/)
console.log('PASS: icon picker, linked SIERRA color families and responsive flat cards preserve the design system')

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
