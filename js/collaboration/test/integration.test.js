import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import vm from 'node:vm';

const root=new URL('../../../',import.meta.url);
const source=readFileSync(new URL('index.html',root),'utf8');
const until=async predicate=>{for(let i=0;i<100;i++){if(predicate())return;await new Promise(r=>setTimeout(r,10));}assert.fail('UI did not reach expected state');};

test('real editor promotes communications to the team, keeps cloud writes out of localStorage and survives back/logout',async()=>{
  const dom=new JSDOM('<div id="pg"></div><div id="sec-title"></div><div id="sec-sub"></div>',{url:'https://test.local',runScripts:'outside-only',pretendToBeVisual:true});
  const w=dom.window;let snapshot,revision=0,updates=[],authCallback,remoteOnline=true,remoteField='document',leaveRequests=0;
  const windowErrors=[];w.addEventListener('error',event=>windowErrors.push(event.error));
  w.eval=code=>vm.runInContext(code,dom.getInternalVMContext());
  try {
    w.structuredClone=structuredClone;w.TextEncoder=TextEncoder;w.TextDecoder=TextDecoder;
    w.me={id:'00000000-0000-4000-8000-000000000001'};w.profile={full_name:'Owner'};
    w.can=(cap,domain)=>!!w.me&&domain==='communications'&&['read','write'].includes(cap);
    w.esc=v=>String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');w.escAttr=w.esc;
    w.siIcon=()=>'';w.setSecCrumbs=()=>{};w.clearSecCrumbs=()=>{};w.requestAnimationFrame=()=>{};w.document.queryCommandState=()=>false;
    const notices=[];
    w.jsStr=v=>String(v??'').replaceAll("'","\\'");w.toast=value=>notices.push(value);w.logout=async()=>{w.me=null;};
    w.sb={auth:{onAuthStateChange:callback=>{authCallback=callback;}},rpc:async(name,args)=>{
      if(name==='communication_create'){snapshot=args.p_snapshot;return{data:'00000000-0000-4000-8000-000000000099'};}
      if(name==='communication_sync'){
        if(args.p_awareness===null)leaveRequests++;
        if(args.p_update && !updates.some(x=>x.nonce===args.p_nonce))updates.push({revision:++revision,payload:args.p_update,nonce:args.p_nonce});
        const presence=remoteOnline?[{user_id:'00000000-0000-4000-8000-000000000077',session_id:'00000000-0000-4000-8000-000000000078',name:'Ana Prueba',seen_at:new Date().toISOString(),awareness:JSON.stringify({clientID:77,field:remoteField,area:'Asunto',mode:'field'})}]:[];
        return{data:{role:'owner',revision,snapshot_revision:0,snapshot:args.p_after<0?snapshot:null,updates:updates.filter(x=>x.revision>args.p_after),presence}};
      }
      if(name==='communication_access')return{data:{role:'owner',members:[{id:w.me.id,email:'owner@test.local',name:'Owner',role:'owner'}]}};
      if(name==='communication_list')return{data:[]};
      throw Error('Unexpected RPC '+name);
    }};
    w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};
    w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'));};
    w.eval(source.slice(source.indexOf('function pdSelect('),source.indexOf('/* ═',source.indexOf('function pickPdSelect('))));
    w.eval(source.match(/const PRODUCT_COUNTRIES = \[[^\n]+/)[0]);
    const start=source.indexOf('const COMMS_STORE_KEY='),end=source.indexOf('\n',source.indexOf('function printCommunicationMemo()',start));
    w.eval('const LBL_LOGO_SVG="";\n'+source.slice(start,end));
    w.eval(readFileSync(new URL('js/communications-collaboration.js',root),'utf8'));
    w.eval(readFileSync(new URL('js/communications-collaboration-integration.js',root),'utf8'));
    w.eval(readFileSync(new URL('js/communications-access.js',root),'utf8'));
    await w.newCommunicationDraft();
    remoteField=w.document.querySelector('.memo-form [data-collab-key]')?.dataset.collabKey||'document';
    assert.ok(w.document.querySelector('[data-share-access]'),JSON.stringify(notices));
    assert.ok(w.document.querySelector('.comms-collab-bar'));
    await until(()=>w.document.querySelector('.comms-remote-area'));
    assert.match(w.document.querySelector('.comms-collab-bar').textContent,/Asunto/);
    assert.ok(w.document.querySelector('.comms-remote-area'),'the active remote field is visible');
    remoteOnline=false;
    await until(()=>/salió del documento/.test(w.document.querySelector('.comms-collab-bar')?.textContent||''));
    const local=w.localStorage.getItem('sierra_communications_v1:'+w.me.id);
    w.commsAddBlock('feature');
    w.eval("Object.assign(_commsCurrent.blocks.at(-1),{content:'Feature text must survive sharing',richHtml:'<strong>Feature text must survive sharing</strong>'})");w.commsPersist();
    w.document.querySelector('[data-share-access]').click();
    await until(()=>w.document.querySelector('#comms-sharing .comms-collab-lock'));
    assert.match(w.document.querySelector('#comms-sharing .comms-collab-lock').textContent,/todas las cuentas/);
    assert.ok(w.document.querySelector('.memo-rich-editor .ProseMirror'));
    assert.ok(w.document.querySelector('[data-comment-action]'));
    assert.equal(w.eval('_commsCurrent.blocks.at(-1).type'),'feature');
    assert.equal(w.document.querySelector('#comms-sharing select'),null,'use Index selectors');
    w.document.querySelector('#comms-sharing').close();
    w.commsSet('subject','Team collaborative change');w.commsPersist();
    await until(()=>revision>0);
    assert.equal(w.localStorage.getItem('sierra_communications_v1:'+w.me.id),local);
    await w.commsBack();assert.equal(w.eval('_commsCurrent'),null);assert.ok(leaveRequests>0,'leaving closes presence immediately');
    assert.ok(w.document.querySelector('[data-shared-library]'));
    await w.newNewsDraft();assert.equal(w.eval('_commsCurrent.kind'),'circular');
    assert.ok(w.document.querySelector('.comms-collab-bar'));
    w.commsSet('subject','Circular del equipo');w.commsPersist();
    await w.logout();assert.equal(w.eval('_commsCurrent'),null);
  }finally{await w.logout?.();await new Promise(r=>setTimeout(r,30));dom.window.close();assert.deepEqual(windowErrors,[]);}
});
