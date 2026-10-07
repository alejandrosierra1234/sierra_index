// Real-browser regression: object-fit must not turn a circle into an ellipse.
// Usage: NODE_PATH=<runtime node_modules> node tests/communications/new-hire-visual.cjs
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict')
const {chromium}=require('playwright')
const {PNG}=require('pngjs')
const root=path.resolve(__dirname,'../..'),out=process.env.SIERRA_QA_DIR||'/private/tmp/sierra-new-hire-qa'
fs.mkdirSync(out,{recursive:true})
const source=fs.readFileSync(path.join(root,'index.html'),'utf8')
const fitted=source.slice(source.indexOf('async function memoPrepareFittedImages('),source.indexOf('async function memoImageBlob('))
const identity=source.slice(source.indexOf('const SIERRA_MOUNTAIN_PATH='),source.indexOf('function sierraEventDateHtml('))
const logo=source.match(/const LBL_LOGO_SVG = `[^`]+`/)[0]
const html=`<!doctype html><meta charset="utf-8"><style>
*{box-sizing:border-box}body{margin:0} @font-face{font-family:Aeonik;src:url('/Aeonik-Regular.ttf')}@font-face{font-family:Aeonik;font-weight:600 900;src:url('/Aeonik-Bold.ttf')}@font-face{font-family:Replica;src:url('/Replica%20Regular.otf')}@font-face{font-family:Replica;font-weight:700;src:url('/Replica%20Bold.otf')}
</style><link rel="stylesheet" href="/css/new-hire-builder.css"><div id="new-hire-art-root"></div><script src="/html2canvas.js"></script><script src="/jspdf.js"></script><script>
function esc(s){return String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;')}const escAttr=esc;function commsHexColor(v){return v}function toast(){};
function siIcon(name,size=14){return '<svg class="si-icon" width="'+size+'" height="'+size+'" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" d="M3 5h18v14H3zM3 5l9 8 9-8"/></svg>'}
${logo};function memoLogoHtml(){return '<div class="memo-logo">'+LBL_LOGO_SVG+'</div>'}
${identity}${fitted}</script><script src="/js/new-hire-builder.js"></script>`
const server=http.createServer((req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname)
 if(pathname==='/'){res.setHeader('Content-Type','text/html');res.end(html);return}
 const libraries={'/html2canvas.js':'/private/tmp/sierra-html2canvas.min.js','/jspdf.js':'/private/tmp/sierra-jspdf.min.js'}
 const allowed=['/css/new-hire-builder.css','/js/new-hire-builder.js','/marketing/assets/sierra-clay-welcome-team.png','/Aeonik-Regular.ttf','/Aeonik-Bold.ttf','/Replica Regular.otf','/Replica Bold.otf']
 const file=libraries[pathname]||(allowed.includes(pathname)?path.join(root,pathname):null)
 if(!file){res.writeHead(404);res.end();return}
 res.setHeader('Content-Type',pathname.endsWith('.js')?'application/javascript':pathname.endsWith('.css')?'text/css':pathname.endsWith('.png')?'image/png':'application/octet-stream');res.end(fs.readFileSync(file))
})
;(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r))
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true})
 try{
 const page=await browser.newPage({viewport:{width:1100,height:1100},deviceScaleFactor:1.5})
 await page.goto(`http://127.0.0.1:${server.address().port}`)
 await page.evaluate(async()=>{
  const c=document.createElement('canvas');c.width=800;c.height=600;const x=c.getContext('2d');x.fillStyle='#eeeeee';x.fillRect(0,0,800,600);x.fillStyle='#009fff';x.beginPath();x.arc(400,300,65,0,Math.PI*2);x.fill()
  Object.assign(_newHire,{name:'Andrea López',role:'Talent Acquisition Coordinator',email:'acquisition.coordinator@sierratextiles.com',phone:'3054 0720',department:'Talento Humano',country:'Guatemala',company:'Hilos y Algodón, S.A.',startDate:'2026-10-05',palette:'olive',photo:c.toDataURL()});newHireRenderArt();await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));newHireFitSingleLines()
 })
 await page.locator('.new-hire-art').screenshot({path:path.join(out,'preview.png')})
 for(const [name,x,y,zoom] of [['center',50,50,100],['positioned',45,60,130]]){
 await page.evaluate(({x,y,zoom})=>{Object.assign(_newHire,{photoX:x,photoY:y,photoZoom:zoom});newHireRenderArt()},{x,y,zoom})
 const reference=PNG.sync.read(await page.locator('.new-hire-art').screenshot())
 const result=await page.evaluate(async({x,y,zoom})=>{
  Object.assign(_newHire,{photoX:x,photoY:y,photoZoom:zoom});newHireRenderArt();const canvas=await newHireCapture();const pixels=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;let minX=Infinity,minY=Infinity,maxX=0,maxY=0;
  for(let y=300;y<1050;y++)for(let x=52;x<480;x++){let i=(y*canvas.width+x)*4;if(pixels[i]<20&&pixels[i+1]>135&&pixels[i+1]<180&&pixels[i+2]>240){minX=Math.min(x,minX);maxX=Math.max(x,maxX);minY=Math.min(y,minY);maxY=Math.max(y,maxY)}}
  const pdf=new jspdf.jsPDF({unit:'mm',format:[216,270]});pdf.addImage(canvas.toDataURL('image/jpeg',.96),'JPEG',0,0,216,270)
  return{width:canvas.width,height:canvas.height,circle:[maxX-minX+1,maxY-minY+1],png:canvas.toDataURL(),jpg:canvas.toDataURL('image/jpeg',.94),pdf:pdf.output('datauristring')}
 },{x,y,zoom})
 assert.equal(result.width,1080);assert.equal(result.height,1350);assert.ok(result.circle[0]>100);assert.ok(Math.abs(result.circle[0]-result.circle[1])<=2,`${name}: distorted circle ${result.circle}`)
 for(const format of ['png','jpg','pdf'])fs.writeFileSync(path.join(out,`${name}.${format}`),Buffer.from(result[format].split(',')[1],'base64'))
 const exported=PNG.sync.read(Buffer.from(result.png.split(',')[1],'base64'))
 for(const [region,x1,y1,x2,y2] of [['title',0,100,1080,280],['portrait',51,300,480,1050],['details',504,380,1029,970],['footer',51,1100,1029,1320]]){
  let different=0,total=0
  for(let y=y1;y<y2;y++)for(let x=x1;x<x2;x++){const i=(y*1080+x)*4;total++;if(Math.max(...[0,1,2].map(c=>Math.abs(reference.data[i+c]-exported.data[i+c])))>50)different++}
  assert.ok(different/total<.06,`${name} ${region}: ${(100*different/total).toFixed(2)}% pixels differ from preview`)
 }
  console.log(`PASS ${name}: circle ${result.circle.join('×')}; PNG/JPG/PDF 1080×1350`)
 }
 // Exercise the actual download functions, not only the common capture helper.
 for(const format of ['png','jpg','pdf']){
  const [download]=await Promise.all([page.waitForEvent('download'),page.evaluate(format=>newHireExport(format),format)])
  assert.equal(download.suggestedFilename(),`bienvenida-andrea-lopez.${format}`)
  await download.saveAs(path.join(out,`download.${format}`))
 }
 console.log('PASS actual PNG, JPG and PDF downloads')
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>server.close())
