// NODE_PATH=<Playwright installation>/node_modules node tests/communications/infographics-layout.cjs
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict')
const {chromium}=require('playwright')
const root=path.resolve(__dirname,'../..'),source=fs.readFileSync(path.join(root,'index.html'),'utf8')
const out=process.env.SIERRA_QA_DIR||'/private/tmp/sierra-infographic-layout';fs.mkdirSync(out,{recursive:true})
const logo=source.match(/const LBL_LOGO_SVG = `[^`]+`/)[0]
const fixture={id:'layout',styleVersion:3,title:'¿Necesitas asistencia con tu equipo?',subtitle:'Solicita asistencia a través del sistema de tickets de IT.',showSubtitle:true,department:'Comunicaciones Corporativas',blocks:[
{id:'a',type:'callout',span:4,heading:'Un solo canal',html:'<p>Solicita soporte desde el formulario de tickets.</p>',icon:'info',surfaceStyle:'tint',colorFamily:'orange'},
{id:'b',type:'text',span:6,heading:'Tipos de soporte',html:'<ul><li>Software y herramientas de trabajo</li><li>Conectividad</li><li>Soporte técnico</li><li>Solicitud y asignación de equipos</li></ul>'},
{id:'c',type:'cta',span:6,heading:'Abre tu solicitud',html:'<p>Cuéntanos qué necesitas para ayudarte.</p>',url:'https://example.com/soporte',label:'Solicitar soporte'},
{id:'d',type:'text',span:6,heading:'Información importante',html:'<p>Incluye una descripción del problema y el nombre de tu equipo. El equipo de IT dará seguimiento a tu solicitud.</p>'}
]}
const html=`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><style>${source.match(/<style>([\s\S]*?)<\/style>/)[1]}body{display:block;padding:16px;overflow:auto}#pg{margin:0;padding:0;width:100%}</style><link rel="stylesheet" href="/css/infographic-builder.css"><div id="tb-section"></div><div id="product-controls"></div><h1 id="sec-title"></h1><p id="sec-sub"></p><div id="pg"></div><script>
window.me={id:'visual'};window._navLeaf=null;
for(const name of ['syncModule','leaveView','renderSidebarTree','clearSecCrumbs','toast'])window[name]=()=>{};
function esc(v){return String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;')}const escAttr=esc;
${logo};function memoLogoHtml(){return '<div class="memo-logo">'+LBL_LOGO_SVG+'</div>'}
function siIcon(){return '<svg class="si-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 7v6m0 3v1"/></svg>'}
localStorage.setItem('sierra_infographics_v1:visual',JSON.stringify({activeId:'layout',designs:[${JSON.stringify(fixture)}]}));
</script><script src="/js/infographic-builder.js"></script><script>showInfographics();infoOpenDesign('layout')</script>`
const server=http.createServer((req,res)=>{let name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(name==='/'){res.end(html);return}const file=path.join(root,name);if(!file.startsWith(root)||!fs.existsSync(file)){res.writeHead(404);res.end();return}res.setHeader('Content-Type',name.endsWith('.js')?'text/javascript':name.endsWith('.css')?'text/css':name.endsWith('.json')?'application/json':'application/octet-stream');res.end(fs.readFileSync(file))})
;(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});try{
const page=await browser.newPage({viewport:{width:1440,height:1100}});await page.goto(`http://127.0.0.1:${server.address().port}`);await page.evaluate(()=>document.fonts.ready)
await page.evaluate(()=>{infoSelect('page');document.querySelector('.info-page').style.transform='none'})
async function snapshot(name){await page.evaluate(()=>{const copy=document.querySelector('.info-page').cloneNode(true);copy.id='qa-art';copy.style.transform='none';copy.style.position='absolute';copy.style.left='0';copy.style.top='0';copy.style.zIndex='9999';document.body.appendChild(copy)});await page.locator('#qa-art').screenshot({path:path.join(out,name)});await page.evaluate(()=>document.getElementById('qa-art').remove())}
const measure=()=>{const grid=document.querySelector('.info-grid'),g=grid.getBoundingClientRect();return [...grid.children].map(el=>{const r=el.getBoundingClientRect();return {id:el.dataset.infoBlock,x:r.x-g.x,y:r.y-g.y,w:r.width,h:r.height,grid:g.width,bg:getComputedStyle(el.firstElementChild).backgroundColor,overflow:el.scrollWidth>el.clientWidth+1}})}
let boxes=await page.evaluate(measure);assert.equal(boxes[0].y,boxes[1].y);assert.ok(Math.abs(boxes[1].x+boxes[1].w-boxes[1].grid)<1,'mixed widths fill row');assert.equal(boxes[0].h,boxes[1].h);assert.ok(boxes.every(b=>b.bg==='rgb(255, 255, 255)'&&!b.overflow));assert.deepEqual(boxes.map(b=>b.id),['a','b','c','d'])
await snapshot('letter.png')
for(const width of [320,375,768,1024,1440]){await page.setViewportSize({width,height:1100});await page.waitForTimeout(80);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,`editor overflow at ${width}`)}
// The same art must retain geometry across viewport sizes (also html2canvas windowWidth).
await page.evaluate(()=>{document.querySelector('.info-page').style.transform='none'});let wide=await page.evaluate(measure)
await page.setViewportSize({width:375,height:1100});await page.evaluate(()=>{document.querySelector('.info-page').style.transform='none'});let narrow=await page.evaluate(measure)
assert.deepEqual(narrow,wide,'art layout must not depend on viewport')
await page.setViewportSize({width:1440,height:1100});await page.evaluate(()=>{infoSetMeta('width',375);infoSetMeta('height',1800);document.querySelector('.info-page').style.transform='none'});boxes=await page.evaluate(measure);assert.ok(boxes.every(b=>Math.abs(b.w-b.grid)<1&&!b.overflow),'narrow canvas stacks full width')
await snapshot('narrow.png')
await page.evaluate(()=>{infoSetMeta('width',816);infoAddBlock('features');const id=document.querySelector('[data-info-block].info-selected').dataset.infoBlock;const editor=document.querySelector('.info-item-editor button[aria-label="Eliminar tarjeta 4"]');editor?.click();document.querySelector('.info-page').style.transform='none'})
const features=await page.evaluate(()=>{const grid=document.querySelector('.info-feature-grid'),r=grid.getBoundingClientRect();return [...grid.children].map(e=>{const b=e.getBoundingClientRect();return {x:b.x-r.x,y:b.y-r.y,w:b.width,grid:r.width}})})
assert.ok(Math.abs(features.at(-1).x+features.at(-1).w-features.at(-1).grid)<1,'last feature row fills width')
await page.evaluate(()=>{infoAddBlock('image');const id=document.querySelector('[data-info-block].info-selected').dataset.infoBlock;infoSetBlock(id,'span',6);infoAddBlock('text');document.querySelector('.info-page').style.transform='none'})
const imageBox=await page.locator('.info-image-block').boundingBox();assert.ok(imageBox.height>=200,'image keeps visible height')
console.log('PASS: neutral legacy cards, full rows, equal heights, reading order, five editor widths and viewport-independent art')
}finally{await browser.close();server.close()}})().catch(e=>{console.error(e);server.close();process.exitCode=1})
