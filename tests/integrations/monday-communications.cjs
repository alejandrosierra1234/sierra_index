const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const {JSDOM}=require('../communications/node_modules/jsdom');

const root=path.join(__dirname,'../..');
const source=fs.readFileSync(path.join(root,'index.html'),'utf8');
const fnSource=fs.readFileSync(path.join(root,'supabase/functions/monday-communications/index.ts'),'utf8');

assert.ok(fnSource.includes('MONDAY_API_TOKEN'));
assert.ok(fnSource.includes("caller.rpc('authorize'"));
assert.ok(!fnSource.includes('SUPABASE_SERVICE_ROLE_KEY'));
assert.ok(fnSource.includes("action === 'claim'"));

const dom=new JSDOM('<div id="pg"></div><div id="sec-title"></div><div id="sec-sub"></div>',{url:'https://test.local',runScripts:'outside-only'});
const w=dom.window;
w.me={id:'creator'};w.profile={full_name:'Creator'};w.requestAnimationFrame=fn=>fn();w.document.queryCommandState=()=>false;
w.esc=v=>String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
w.escAttr=w.esc;w.jsStr=v=>String(v??'').replaceAll("'","\\'");
w.clearSecCrumbs=w.setSecCrumbs=()=>{};w.toastMessage='';w.toast=message=>{w.toastMessage=message};
w.can=(cap,domain)=>domain==='communications'&&(cap==='read'||cap==='write');
w.SB_URL='https://example.supabase.co';
w.SB_KEY='publishable-key';
w.sb={auth:{getSession:async()=>({data:{session:{access_token:'test-token'}},error:null})}};
w.HTMLDialogElement.prototype.showModal=function(){this.open=true};w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'))};
w.eval=code=>vm.runInContext(code,dom.getInternalVMContext());
w.eval(source.slice(source.indexOf('function pdSelect('),source.indexOf('/* ═',source.indexOf('function pickPdSelect('))));
w.eval(source.match(/const PRODUCT_COUNTRIES = \[[^\n]+/)[0]);
w.eval(source.slice(source.indexOf('const SI_ICON = {'),source.indexOf('// StatusBadge (',source.indexOf('const SI_ICON = {'))));
const start=source.indexOf('const COMMS_STORE_KEY='),end=source.indexOf('\n',source.indexOf('function printCommunicationMemo()',start));
w.eval('const LBL_LOGO_SVG="";\n'+source.slice(start,end));

let claims=0;
w.fetch=async(url,{body,headers})=>{
  assert.equal(url,'https://example.supabase.co/functions/v1/monday-communications');
  assert.equal(headers.Authorization,'Bearer publishable-key');
  assert.equal(headers.apikey,'publishable-key');
  body=JSON.parse(body);
  assert.equal(body._auth_token,'test-token');
  delete body._auth_token;
  if(body.action==='claim'){claims++;assert.equal(body.item_id,'123');return{ok:true,json:async()=>({ok:true})}}
  return{ok:true,json:async()=>({ok:true,requests:[{
    id:'123',name:'Lanzamiento SIERRA Nexus',kind:'circular',status:'Nueva',requester:'Marketing',
    email:'marketing@example.test',country:'Guatemala',company:'SIERRA',plant:'Hilos y Algodón',
    department:'Marketing',audience:'Todos',summary:'Bajada enviada desde el formulario',
    details:'Texto largo enviado por el solicitante',deadline:'2026-09-30',url:'https://monday.test/items/123'
  }]})}
};

(async()=>{
  w.renderCommunicationsHome();
  await w.commsOpenMondayRequests();
  await new Promise(resolve=>setTimeout(resolve,0));
  const dialog=w.document.querySelector('.comms-monday-dialog');
  assert.ok(dialog);
  assert.ok(dialog.textContent.includes('Lanzamiento SIERRA Nexus'));
  await w.commsImportMondayRequest('123');
  const d=w.eval('_commsCurrent');
  assert.equal(claims,1);
  assert.equal(d.kind,'circular');
  assert.equal(d.source,'monday');
  assert.equal(d.mondayItemId,'123');
  assert.equal(d.subject,'Lanzamiento SIERRA Nexus');
  assert.equal(d.summary,'Bajada enviada desde el formulario');
  assert.equal(d.company,'SIERRA');
  assert.equal(d.newsPlant,'Hilos y Algodón');
  assert.equal(d.newsDepartment,'Marketing');
  assert.equal(d.author,'Marketing');
  assert.equal(d.blocks[0].content.includes('Texto largo'),true);
  w.commsDuplicate(d.id);
  const copy=w.eval('_commsCurrent');
  assert.equal(copy.source,'manual');
  assert.equal(copy.mondayItemId,null);
  console.log('PASS: Monday communication requests import into drafts without exposing tokens or duplicating item links');
  w.close();
})().catch(error=>{console.error(error);w.close();process.exitCode=1});
