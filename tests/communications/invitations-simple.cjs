const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const {JSDOM}=require('jsdom');
const source=fs.readFileSync(require('node:path').join(__dirname,'../../index.html'),'utf8');
const dom=new JSDOM('<head><style id="simple-invitation-editor-styles"></style></head><body><div id="pg"></div><div id="sec-title"></div><div id="sec-sub"></div></body>',{url:'https://test.local',runScripts:'outside-only'});
const w=dom.window;
w.me={id:'test-user'};w.eval=code=>vm.runInContext(code,dom.getInternalVMContext());w.esc=v=>String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');w.escAttr=w.esc;w.siIcon=()=>'';w.setSecCrumbs=()=>{};w.requestAnimationFrame=fn=>fn();w.toast=()=>{};w.clearSecCrumbs=()=>{};
w.eval(source.match(/const PRODUCT_COUNTRIES = \[[^\n]+/)[0]);
const start=source.indexOf('const COMMS_STORE_KEY='),end=source.indexOf('\n',source.indexOf('function printCommunicationMemo()',start));
w.eval('const LBL_LOGO_SVG="";\n'+source.slice(start,end));
const simple=source.match(/<script id="simple-invitation-editor">([\s\S]*?)<\/script>/)[1];
w.eval(simple);

const draft=w.createInvitationDraft();
assert.equal(draft.subject,'','a new invitation must not persist suggested title text');
w.eval('_commsCurrent=commsNormalize(createInvitationDraft())');
w.renderCommunicationEditor();
const name=w.document.querySelector('#simple-invite-name');
assert.ok(name.required,'the event name is required');
assert.equal(name.value,'');
assert.equal(name.placeholder,'Ej. Reunión general');
w.invitationSimpleNameFocus(name);assert.equal(name.placeholder,'');
w.invitationSimpleNameBlur(name);assert.equal(name.placeholder,'Ej. Reunión general');
assert.equal(w.invitationSimpleRequireName(),false,'blank invitations cannot open the download menu');

const bannerDraft={...draft,subject:'Encuentro SIERRA',heroImage:'data:image/png;base64,AA'};
const box=w.document.createElement('div');box.innerHTML=w.invitationPageHtml(bannerDraft);
assert.equal(box.querySelector('.simple-invite-banner img').getAttribute('src'),bannerDraft.heroImage);
assert.match(box.querySelector('.simple-invite-banner img').getAttribute('alt'),/Encuentro SIERRA/);
w.eval('_commsCurrent=commsNormalize('+JSON.stringify(bannerDraft)+')');w.renderCommunicationEditor();
assert.ok(w.document.querySelector('.simple-invite-banner-editor input[type="file"][accept="image/*"]'));
assert.ok(w.document.querySelector('.simple-invite-banner-editor button'),'an uploaded banner can be removed');

const exportCss=w.invitationModularPrintCss();
assert.match(exportCss,/\.simple-invite-banner\{height:50mm;margin:8mm 12mm 0/);
assert.match(exportCss,/\.simple-invite-header\{[^}]*padding:12mm 12mm 8mm/);
assert.match(exportCss,/\.simple-invite-body\{padding:10mm 12mm/);
console.log('PASS: simplified invitation required title, banner and compact exported layout');
w.close();
