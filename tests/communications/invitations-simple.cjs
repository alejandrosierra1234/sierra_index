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

const bannerDraft={...draft,subject:'Encuentro SIERRA',sender:'Cultura y Talento',heroImage:'data:image/png;base64,AA',bannerHeight:82,bannerZoom:145,bannerFit:'contain',bannerFrame:'top-right'};
const box=w.document.createElement('div');box.innerHTML=w.invitationPageHtml(bannerDraft);
assert.equal(box.querySelector('.simple-invite-banner img').getAttribute('src'),bannerDraft.heroImage);
assert.match(box.querySelector('.simple-invite-banner img').getAttribute('alt'),/Encuentro SIERRA/);
assert.match(box.querySelector('.simple-invite-banner').getAttribute('style'),/--simple-banner-height:82mm/);
assert.match(box.querySelector('.simple-invite-banner').getAttribute('style'),/--simple-banner-zoom:1\.45/);
assert.match(box.querySelector('.simple-invite-banner').getAttribute('style'),/--simple-banner-fit:contain/);
assert.match(box.querySelector('.simple-invite-banner').getAttribute('style'),/--simple-banner-position:100% 0%/);
assert.equal(box.querySelector('.simple-invite-footer .sierra-department span').textContent,'Cultura y Talento');
w.eval('_commsCurrent=commsNormalize('+JSON.stringify(bannerDraft)+')');w.renderCommunicationEditor();
assert.ok(w.document.querySelector('.simple-invite-banner-editor input[type="file"][accept="image/*"]'));
assert.ok(w.document.querySelector('.simple-invite-banner-editor button'),'an uploaded banner can be removed');
assert.equal(w.document.querySelector('#simple-invite-banner-height').value,'82');
assert.equal(w.document.querySelector('#simple-invite-banner-zoom').value,'145');
assert.equal(w.document.querySelector('#simple-invite-banner-fit').value,'contain');
assert.equal(w.document.querySelector('#simple-invite-banner-frame').value,'top-right');
assert.equal(w.document.querySelectorAll('input[name="simple-invite-mode"]').length,3);
assert.equal(w.document.querySelector('#simple-invite-area').value,'Cultura y Talento');
assert.equal(w.document.querySelectorAll('.simple-invite-contact-editor').length,1,'new invitations start with one empty contact editor');
assert.equal(w.document.querySelector('.simple-invite-contact-editor input[placeholder="Nombre y apellido"]').value,'');
assert.match(w.document.querySelector('.simple-invite-contacts-editor button.btn-secondary').textContent,/Agregar otra persona/);

const contactsDraft={...bannerDraft,contacts:[
  {uid:'contact-a',name:'Ana López',role:'Coordinadora',phone:'+502 5555 0101',email:'ana@sierra.com',photo:'data:image/png;base64,PHOTO'},
  {uid:'contact-b',name:'Luis Pérez',role:'Especialista',phone:'+502 5555 0202',email:'luis@sierra.com',photo:''}
]};
box.innerHTML=w.invitationPageHtml(contactsDraft);
assert.equal(box.querySelectorAll('.simple-invite-contact-card').length,2,'all completed contacts are shown');
assert.match(box.querySelector('.simple-invite-contacts').textContent,/Ana López/);
assert.match(box.querySelector('.simple-invite-contacts').textContent,/Coordinadora/);
assert.equal(box.querySelector('.simple-invite-contact-photo img').getAttribute('src'),'data:image/png;base64,PHOTO');
assert.equal(box.querySelector('a[href^="mailto:"]').getAttribute('href'),'mailto:ana@sierra.com');
assert.equal(box.querySelector('a[href^="tel:"]').getAttribute('href'),'tel:+50255550101');
w.eval('_commsCurrent=commsNormalize('+JSON.stringify(contactsDraft)+')');w.renderCommunicationEditor();
assert.equal(w.document.querySelectorAll('.simple-invite-contact-editor').length,2,'multiple contacts can be edited');
assert.equal(w.document.querySelectorAll('.simple-invite-contact-photo-upload input[type="file"]').length,2);
assert.equal(w.document.querySelectorAll('.simple-invite-contact-editor button[aria-label^="Eliminar contacto"]').length,2);

const hybrid={...bannerDraft,mode:'ambos',location:'Salón principal',virtualUrl:'https://meet.google.com/abc-defg-hij',virtualShowButton:true,virtualButtonText:'Entrar ahora',virtualShowQr:true,virtualQrImage:'data:image/png;base64,QR'};
box.innerHTML=w.invitationPageHtml(hybrid);
assert.match(box.textContent,/Salón principal/);
assert.match(box.textContent,/Presencial y virtual/);
assert.equal(box.querySelector('.simple-invite-access-button').textContent.trim(),'Entrar ahora');
assert.equal(box.querySelector('.simple-invite-access-button').getAttribute('href'),hybrid.virtualUrl);
assert.equal(box.querySelector('.simple-invite-access img').getAttribute('src'),hybrid.virtualQrImage);
assert.equal(box.querySelector('.simple-invite-access-url').textContent,hybrid.virtualUrl,'the original virtual link stays visible');
w.eval('_commsCurrent=commsNormalize('+JSON.stringify(hybrid)+')');w.renderCommunicationEditor();
assert.ok(w.document.querySelector('#simple-invite-place'),'hybrid invitations keep the physical place');
assert.ok(w.document.querySelector('#simple-invite-virtual-url'),'hybrid invitations expose virtual access');
assert.ok(w.document.querySelector('.simple-invite-qr-editor-preview'));

const virtualOnly={...hybrid,mode:'virtual'};
box.innerHTML=w.invitationPageHtml(virtualOnly);
assert.doesNotMatch(box.textContent,/Salón principal/);
assert.doesNotMatch(box.querySelector('.simple-invite-details').textContent,/Modalidad/,'virtual access already communicates the modality');
assert.match(box.querySelector('.simple-invite-access').textContent,/Acceso virtual/);
w.eval('_commsCurrent=commsNormalize('+JSON.stringify(virtualOnly)+')');w.renderCommunicationEditor();
assert.equal(w.document.querySelector('#simple-invite-place'),null);
assert.ok(w.document.querySelector('#simple-invite-virtual-url'));

const exportCss=w.invitationModularPrintCss();
assert.match(exportCss,/\.simple-invite-banner\{height:var\(--simple-banner-height,68mm\);margin:8mm 12mm 0/);
assert.match(exportCss,/transform:scale\(var\(--simple-banner-zoom,1\)\)/);
assert.match(exportCss,/object-position:var\(--simple-banner-position,50% 50%\)/);
assert.match(exportCss,/\.simple-invite-header\{[^}]*padding:12mm 12mm 8mm/);
assert.match(exportCss,/\.simple-invite-body\{padding:8mm 12mm/);
assert.match(exportCss,/\.simple-invite-access\{/);
assert.match(exportCss,/\.simple-invite-contact-cards\{/);
console.log('PASS: simplified invitation title, banner framing, multiple contacts and hybrid access');
w.close();
