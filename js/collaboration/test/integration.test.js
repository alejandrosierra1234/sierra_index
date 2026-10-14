import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import vm from 'node:vm';

const root=new URL('../../../',import.meta.url);
const source=readFileSync(new URL('index.html',root),'utf8');
const until=async predicate=>{for(let i=0;i<100;i++){if(predicate())return;await new Promise(r=>setTimeout(r,10));}assert.fail('UI did not reach expected state');};

test('real editor sharing keeps cloud writes out of localStorage and survives back/logout',async()=>{
  const dom=new JSDOM('<div id="pg"></div><div id="sec-title"></div><div id="sec-sub"></div>',{url:'https://test.local',runScripts:'outside-only',pretendToBeVisual:true});
  const w=dom.window;let snapshot,revision=0,updates=[],authCallback;
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
        if(args.p_update && !updates.some(x=>x.nonce===args.p_nonce))updates.push({revision:++revision,payload:args.p_update,nonce:args.p_nonce});
        return{data:{role:'owner',revision,snapshot_revision:0,snapshot:args.p_after<0?snapshot:null,updates:updates.filter(x=>x.revision>args.p_after),presence:[]}};
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
    assert.ok(w.document.querySelector('[data-share-access]'),JSON.stringify(notices));
    w.commsAddBlock('feature');
    w.eval("Object.assign(_commsCurrent.blocks.at(-1),{content:'Feature text must survive sharing',richHtml:'<strong>Feature text must survive sharing</strong>'})");w.commsPersist();
    const largeImage='data:image/png;base64,'+'A'.repeat(18*1024*1024);
    w.largeImage=largeImage;
    w.eval("_commsCurrent.heroImage=largeImage;_commsAssetIds.set(largeImage,'sierra-memo-asset:test');_commsAssetValues.set('sierra-memo-asset:test',largeImage)");
    w.Image=class {naturalWidth=3000;naturalHeight=2000;async decode(){}};
    w.HTMLCanvasElement.prototype.getContext=()=>({drawImage(){}});
    w.HTMLCanvasElement.prototype.toDataURL=()=> 'data:image/webp;base64,U01BTEw=';
    w.commsPersist();
    w.document.querySelector('[data-share-access]').click();
    await until(()=>w.document.querySelector('.comms-collab-bar') && w.document.querySelector('#comms-sharing form'));
    const local=w.localStorage.getItem('sierra_communications_v1:'+w.me.id);
    assert.ok(snapshot.length<100000,'large images are prepared before the RPC');
    assert.equal(w.eval('_commsCurrent.heroImage'),'data:image/webp;base64,U01BTEw=');
    assert.equal(w.eval("commsStorageParse(localStorage.getItem('sierra_communications_v1:'+me.id))[0].heroImage"),largeImage,'the local original is untouched');
    assert.ok(w.document.querySelector('.memo-rich-editor .ProseMirror'));
    assert.equal(w.eval('_commsCurrent.blocks.at(-1).content'),'Feature text must survive sharing');
    assert.equal(w.document.querySelector('#comms-sharing select'),null,'use Index selectors');
    w.commsSet('subject','Private collaborative change');w.commsPersist();
    await until(()=>revision>0);
    assert.equal(w.localStorage.getItem('sierra_communications_v1:'+w.me.id),local);
    await w.commsBack();assert.equal(w.eval('_commsCurrent'),null);
    assert.ok(w.document.querySelector('[data-shared-library]'));
    await w.newNewsDraft();assert.equal(w.eval('_commsCurrent.kind'),'circular');
    w.commsSet('subject','Local circular');w.commsPersist();
    assert.match(w.localStorage.getItem('sierra_communications_v1:'+w.me.id),/Local circular/);
    await w.logout();assert.equal(w.eval('_commsCurrent'),null);
  }finally{await w.logout?.();await new Promise(r=>setTimeout(r,30));dom.window.close();assert.deepEqual(windowErrors,[]);}
});
