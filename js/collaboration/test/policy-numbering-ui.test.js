import {test} from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {readFileSync} from 'node:fs';
import {fixture} from './policy-browser-fixture.js';
const source=fixture().replace(/<link[^>]+>/g,'').replace(/<script src="([^"]+)"><\/script>/g,(_,path)=>'<script>'+readFileSync(new URL('../../..'+path,import.meta.url),'utf8')+'</script>');
const tick=()=>new Promise(r=>setTimeout(r,30));
test('classification form keeps notices outside paired fields and preserves legacy references without presenting them as official codes',async()=>{
 const dom=new JSDOM(source,{url:'http://localhost/fixture',runScripts:'dangerously',pretendToBeVisual:true});
 const w=dom.window,d=w.document;
 try{
  await tick();
  w.eval("_policyCompanies=[{id:'amtex',name:'AMTEX',countries:{name:'El Salvador',code:'SV'}}];Object.assign(_policyCurrent,{companyId:'amtex',department:'oo',areaCode:'',code:'',legacyCode:'POL-2026-001'})");
  d.querySelector('#policy-form').innerHTML=w.policyInfoPanel();
  assert.equal(d.querySelector('.policy-code-output').textContent,'Por asignar');
  assert.equal(d.querySelector('.policy-legacy-reference>span').textContent,'POL-2026-001');
  assert.equal(d.querySelectorAll('.policy-numbering-note').length,1);
  assert.match(d.querySelector('.policy-numbering-note').textContent,/AMTEX no tiene abreviatura oficial/);
  assert.equal(d.querySelector('.policy-code-grid small,.policy-code-grid p'),null,'long explanations never stretch the version field');
  assert.equal(d.querySelector('.policy-org-choice'),null,'no redundant card around a single field');
  assert.equal(d.querySelectorAll('.policy-derived-fields').length,1);
  assert.equal(d.querySelector('.policy-info-section').firstElementChild.textContent,'Nombre de la política');
  assert.equal(d.querySelectorAll('#policy-form select').length,0);
  assert.ok(d.querySelector('#policy-company-dd svg'),'real company icon is present');
  assert.equal(d.querySelectorAll('.policy-derived-fields svg').length,2,'both metadata icons exist in the real icon library');
  assert.doesNotMatch(source,/\.policy-tab\{font-size:0/,'mobile tabs keep their names legible');
  assert.equal(w.eval('_policyCurrent.department'),'oo','unmapped historical content is never guessed or erased');
 }finally{w.policyStopPresence();w.close()}
});
test('numbering UI uses a catalog, prevents manual codes, and verifies a lost approval without issuing twice',async()=>{
 const dom=new JSDOM(source,{url:'http://localhost/fixture',runScripts:'dangerously',pretendToBeVisual:true,beforeParse(w){w.HTMLDialogElement.prototype.showModal=function(){this.open=true};w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'))}}});
 const w=dom.window,d=w.document;
 try{
  await tick();assert.ok(d.querySelector('#policy-area'));assert.ok(d.querySelector('.policy-field output'));assert.equal(d.querySelector('input[oninput*="policySet(\'code\'"]'),null);
  w.policySet('code','FAKE');assert.equal(w.eval('_policyCurrent.code'),'');
  w.eval("_policyCompanies=[{id:'company-a',name:'Empresa de prueba'}]");w.policySetCompany('company-a');w.policySelectChanged('008','policy-area');await tick();
  assert.equal(w.eval('_policyCurrent.department'),'Administración');assert.match(d.querySelector('.policy-code-output').textContent,/HN-HSM-008-POL-…/);
  w.fixtureApprovalLoseResponse=true;const pending=w.PolicyNumbering.approve();await tick();
  const dialog=d.querySelector('dialog.comms-confirm');assert.match(dialog.textContent,/Aprobar y asignar/);dialog.querySelectorAll('button')[1].click();await pending;
  assert.equal(w.fixtureApprovalCalls,1);assert.ok(d.querySelector('#policy-approval-progress'));assert.ok(w.localStorage.getItem('policy-approval-pending:account-a'));
  w.policySet('title','MUST NOT CHANGE DURING UNKNOWN APPROVAL');assert.notEqual(w.eval('_policyCurrent.title'),'MUST NOT CHANGE DURING UNKNOWN APPROVAL');
  await w.PolicyNumbering.resume();assert.equal(w.fixtureApprovalCalls,2);assert.equal(w.eval('_policyCurrent.code'),'HN-HSM-008-POL-001');assert.equal(w.eval('_policyCurrent.status'),'Aprobada');assert.equal(d.querySelector('#policy-approval-progress'),null);
  assert.equal(w.localStorage.getItem('policy-approval-pending:account-a'),null);
  const copy=w.policyDuplicateDraft(w.eval('_policyCurrent'));assert.equal(copy.code,'');assert.equal(copy.numbering,null);assert.equal(copy._revision,0);
  w.policySetCompany('');assert.equal(w.eval('_policyCurrent.companyId'),'company-a');
 }finally{w.policyStopPresence();w.close()}
});

test('workbook selectors work without migration 50; legacy values, drafts and editing remain safe',async()=>{
 const dom=new JSDOM(source,{url:'http://localhost/fixture',runScripts:'dangerously',pretendToBeVisual:true,beforeParse(w){w.fixtureCatalogUnavailable=true}});
 const w=dom.window,d=w.document;
 try{
  await tick();
  assert.equal(w.createPolicyDraft().department,'','new policies never invent an area outside the catalog');
  assert.equal(w.PolicyCatalog.areas.length,13);
  assert.deepEqual(Array.from(w.PolicyCatalog.areas,a=>a.code),Array.from({length:13},(_,i)=>String(i+1).padStart(3,'0')));
  for(const value of ['RRHH','Talento Humano'])assert.equal(w.PolicyCatalog.area(value).code,'001');
  assert.equal(w.PolicyCatalog.area('Admon').code,'008');
  assert.equal(w.PolicyCatalog.area('Procesos'),undefined,'unknown legacy areas are not guessed');
  assert.equal(w.PolicyCatalog.companyCode({name:'Hilos y Algodón'}),'H&A');
  assert.equal(w.PolicyCatalog.companyCode({name:'Northern Textiles'}),'N&T');
  assert.equal(w.PolicyCatalog.companyCode({name:'AMTEX'}),'');
  assert.ok(d.querySelector('#policy-area'));
  assert.equal(d.querySelectorAll('#policy-area-dd [role="option"]').length,13);
  assert.equal(d.querySelectorAll('#policy-form select').length,0,'dedicated SIERRA controls, never native dropdowns');
  assert.equal(d.querySelector('#policy-area-dd [role="listbox"]').getAttribute('popover'),'manual','menu escapes transformed panel clipping');
  assert.equal(d.querySelector('#policy-area').disabled,false);
  assert.equal(d.querySelector('input[oninput*="department"]'),null);
  assert.equal(d.querySelector('input[oninput*="code"]'),null);
  assert.match(d.querySelector('#policy-form').textContent,/Área anterior: «Procesos»/);
  assert.equal(w.eval('_policyCurrent.department'),'Procesos');
  w.eval("_policyCompanies=[{id:'ha',name:'Hilos y Algodón',logo_url:'',countries:{name:'Guatemala',code:'GT'}}]");
  w.policySetCompany('ha');w.policySelectChanged('013','policy-area');await tick();
  assert.equal(w.eval('_policyCurrent.department'),'Calidad');
  assert.equal(w.eval('_policyCurrent.areaCode'),'013');
  assert.equal(w.eval("mockPolicies.get('fixture-policy').areaCode"),'013','area survives a cloud save on schema 49');
  assert.match(d.querySelector('#policy-form').textContent,/Guatemala/);
  assert.match(d.querySelector('#policy-form').textContent,/Política · POL/);
  assert.match(d.querySelector('.policy-code-output').textContent,/GT-H&A-013-POL-…/);
  for(const [key,value] of [['code','FAKE'],['department','Custom'],['areaCode','999'],['companyId','fake']])w.policySet(key,value);
  w.policySelectChanged('999','policy-area');w.policySetCompany('fake');
  assert.equal(w.eval('_policyCurrent.code'),'');assert.equal(w.eval('_policyCurrent.areaCode'),'013');assert.equal(w.eval('_policyCurrent.companyId'),'ha');
  await w.PolicyNumbering.approve();assert.equal(w.fixtureApprovalCalls,undefined);assert.equal(w.eval('_policyCurrent.status'),'Borrador');
  assert.match(d.querySelector('#fixture-status').textContent,/numeración automática aún no está disponible/);
  const title=d.querySelector('input.policy-uppercase');title.focus();title.setSelectionRange(2,4);d.querySelector('#policy-form').scrollTop=150;
  await w.PolicyNumbering.reload();assert.ok(d.activeElement.matches('input.policy-uppercase'));assert.equal(d.activeElement.selectionStart,2);assert.equal(d.querySelector('#policy-form').scrollTop,150);
  w.policySet('title','Texto editorial');await tick();assert.equal(w.eval('_policyCurrent.title'),'TEXTO EDITORIAL');
 }finally{w.policyStopPresence();w.close()}
});
