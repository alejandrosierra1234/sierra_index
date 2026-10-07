const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict')
const {JSDOM}=require('jsdom')
const dom=new JSDOM('<!doctype html><div id="tb-section"></div><div id="product-controls"></div><div id="sec-title"></div><div id="sec-sub"></div><div id="pg"></div>',{url:'https://test.local',runScripts:'outside-only'})
const w=dom.window
Object.assign(w,{
  me:{id:'new-hire-test'},_navLeaf:null,
  syncModule(){},leaveView(){},renderSidebarTree(){},clearSecCrumbs(){},toast(){},confirm:()=>true,
  requestAnimationFrame:fn=>fn(),
  esc:v=>String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;'),
  escAttr:v=>String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;'),
  siIcon:name=>`<svg data-icon="${name}"></svg>`,memoLogoHtml:()=>'<div class="memo-logo">SIERRA</div>'
})
w.eval=code=>vm.runInContext(code,dom.getInternalVMContext())
w.eval(fs.readFileSync(path.join(__dirname,'../../js/new-hire-builder.js'),'utf8'))

w.showNewHireCreator()
assert.equal(w.document.getElementById('sec-title').textContent,'Altas de colaborador')
assert.equal(w.document.querySelector('.new-hire-art').offsetWidth,0)
assert.match(w.document.querySelector('.new-hire-art').getAttribute('style'),/--nh-primary:#62b8b1/)
assert.equal(w.document.querySelectorAll('.new-hire-palette').length,4)
assert.equal(w.document.querySelectorAll('select').length,0)
assert.match(w.document.querySelector('.new-hire-art-footer img').src,/sierra-clay-welcome-team\.png$/)
assert.equal(w.document.querySelector('.new-hire-name').textContent,'Nombre del colaborador')
w.newHireSet('name','Ana Martínez')
w.newHireSet('role','Analista de Desarrollo')
w.newHireSet('department','Talento Humano')
assert.equal(w.document.querySelector('.new-hire-name').textContent,'Ana Martínez')
assert.equal(w.document.querySelector('.new-hire-role').textContent,'Analista de Desarrollo')
assert.equal(w.document.querySelector('.new-hire-department').textContent,'Talento Humano')
w.newHirePalette('orange')
assert.match(w.document.querySelector('.new-hire-art').getAttribute('style'),/--nh-primary:#dd6e28/)
assert.equal(JSON.parse(w.localStorage.getItem('index_new_hire_v1:new-hire-test')).palette,'orange')
w.newHireReset()
assert.equal(w.document.querySelector('.new-hire-name').textContent,'Nombre del colaborador')
console.log('PASS: new-hire creator renders, updates, stores and resets the SIERRA welcome art')
