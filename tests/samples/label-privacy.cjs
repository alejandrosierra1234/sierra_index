const {JSDOM}=require('../communications/node_modules/jsdom'),assert=require('node:assert/strict'),fs=require('fs');
const {script,demo}=require('./label-preview.cjs');
const html=fs.readFileSync(require('path').join(__dirname,'../../index.html'),'utf8');
const w=new JSDOM('<body></body>',{runScripts:'outside-only',url:'https://example.test'}).window;
w.eval(script+html.slice(html.indexOf('async function lbToggleVisible'),html.indexOf('function lbMoveSection'))+';window.api={resetChoice:()=>{labelPrinterChoice=undefined},defaults:labelDefaultConfig,normalize:labelNormalizeConfig,keys:LABEL_CONFIDENTIAL_FIELDS,templates:LABEL_TEMPLATES,sections:LABEL_SECTIONS}');

w.siIcon=()=>'';w.toast=()=>{};w.lbRenderEditor=()=>{};w.lbRenderPreview=()=>{};
w.HTMLDialogElement.prototype.showModal=function(){this.open=true};w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'))};
const {api}=w;
(async()=>{
for(const template of Object.keys(api.templates))for(const key of api.keys)assert(api.defaults(template).hidden.includes(key));
for(const raw of [{hidden:[]},{hidden:[],confidentialApproved:{}},{hidden:[],confidentialApproved:'color'}]){const cfg=api.normalize(raw);for(const key of api.keys){assert(cfg.hidden.includes(key));assert(!w.labelFieldAllowed(cfg,key))}}
w.LB={p:demo,cfg:api.defaults()};
let pending=w.lbToggleVisible('color');await Promise.resolve();assert(w.document.querySelector('dialog').textContent.includes('clientes ni personas externas'));w.document.querySelector('[data-cancel]').click();await pending;assert(w.LB.cfg.hidden.includes('color'));
pending=w.lbToggleVisible('color');w.document.querySelector('[data-confirm]').click();await pending;assert(w.labelFieldAllowed(api.normalize(w.LB.cfg),'color'));assert(!w.labelFieldAllowed(w.LB.cfg,'gsm'));
await w.lbToggleVisible('color');assert(!w.labelFieldAllowed(w.LB.cfg,'color'));assert(!w.LB.cfg.confidentialApproved.includes('color'));
pending=w.lbToggleVisible('color');w.document.querySelector('dialog').close();await pending;assert(w.LB.cfg.hidden.includes('color'));
const section=Object.keys(api.sections).find(k=>api.sections[k].fields.includes('gsm'));
pending=w.lbToggleSection(section);w.document.querySelector('[data-cancel]').click();await pending;assert(!w.labelFieldAllowed(w.LB.cfg,'gsm'));
pending=w.lbToggleSection(section);w.document.querySelector('[data-confirm]').click();await pending;for(const k of api.sections[section].fields)assert(w.labelFieldAllowed(w.LB.cfg,k));
assert(!w.labelFieldAllowed({hidden:[]},'color'));
w.me={id:'alice'};w.setLabelPrinter('zebra');assert.equal(w.labelFavorite(),null);w.toggleLabelFavorite();assert.equal(w.labelFavorite(),'zebra');w.setLabelPrinter('brother');assert.equal(w.labelFavorite(),'zebra');
api.resetChoice();assert.equal(w.labelPrinterKey(),'zebra');w.me={id:'bob'};assert.equal(w.labelPrinterKey(),'brother');assert.equal(w.labelFavorite(),null);w.me={id:'alice'};assert.equal(w.labelPrinterKey(),'zebra');w.toggleLabelFavorite();assert.equal(w.labelFavorite(),null);
console.log('PASS: confidential defaults, legacy configs, confirm/cancel, section confirmation, revocation and per-user printer favorites');w.close();
})().catch(e=>{console.error(e);process.exit(1)});
