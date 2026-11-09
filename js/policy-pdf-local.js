/* Policy PDF: browser layout -> vector canvas -> PDF. No policy leaves the browser. */
(function(){
 'use strict';
 const root=new URL('../',document.currentScript.src);
 let busy=false;
 const pause=()=>new Promise(resolve=>setTimeout(resolve,0));
 function completedPdfBlob(pdf){
  const buffer=pdf.output('arraybuffer');
  if(!(buffer instanceof ArrayBuffer)||buffer.byteLength<1024)throw Error('El PDF no terminó de generarse. No se descargó un archivo vacío. Inténtalo nuevamente.');
  const bytes=new Uint8Array(buffer),head=String.fromCharCode(...bytes.subarray(0,5)),tail=new TextDecoder('latin1').decode(bytes.subarray(Math.max(0,bytes.length-2048)));
  if(head!=='%PDF-'||!tail.includes('%%EOF'))throw Error('El PDF quedó incompleto. No se descargó el archivo; vuelve a intentarlo.');
  return new Blob([buffer],{type:'application/pdf'});
 }
 let reservedDownload=null;
 function downloadWindow(name){
  const popup=window.open?.('','_blank');if(!popup)return null;
  const doc=popup.document;doc.open();doc.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Preparando PDF · SIERRA Index</title><style>html{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;background:#f5f5f5;color:#2b2b2b}body{min-height:100vh;margin:0;display:grid;place-items:center}.card{width:min(440px,calc(100% - 48px));box-sizing:border-box;padding:32px;background:#fff;border:1px solid #e5e5e5;border-radius:12px;text-align:center}.mark{color:#007d73;font-weight:700;letter-spacing:.08em}.file{display:block;margin:12px 0 24px;overflow-wrap:anywhere;color:#444}.download{display:inline-flex;min-height:48px;align-items:center;justify-content:center;padding:0 24px;border-radius:8px;background:#2b2b2b;color:#fff;text-decoration:none;font-weight:650}.download[hidden]{display:none}.meta{margin:12px 0 0;color:#666;font-size:14px}@media(prefers-reduced-motion:no-preference){.working{animation:pulse 1.2s ease-in-out infinite alternate}@keyframes pulse{to{opacity:.45}}}</style></head><body><main class="card"><div class="mark">SIERRA INDEX</div><h1 id="download-title" class="working">Preparando PDF…</h1><strong id="download-file" class="file"></strong><a id="download-link" class="download" hidden>Descargar PDF</a><p id="download-meta" class="meta">Esta pestaña mantendrá disponible el archivo aunque el navegador bloquee la descarga automática.</p></main></body></html>`);doc.close();doc.getElementById('download-file').textContent=name;return popup;
 }
 function completeDownloadWindow(popup,blob,name){
  if(!popup||popup.closed)return false;const doc=popup.document,url=URL.createObjectURL(blob),title=doc.getElementById('download-title'),link=doc.getElementById('download-link'),meta=doc.getElementById('download-meta');
  doc.title=`${name} · SIERRA Index`;title.textContent='PDF listo';title.classList.remove('working');link.href=url;link.download=name;link.hidden=false;link.addEventListener('click',()=>{meta.textContent='Descarga solicitada. Si no aparece en Descargas, pulsa el botón otra vez.'});meta.textContent='La descarga se intentará automáticamente. El botón queda disponible como respaldo.';link.click();const timer=setTimeout(()=>URL.revokeObjectURL(url),600000);timer?.unref?.();return true;
 }
 function reservedFileName(button){
  if(button.matches('[data-policy-pdf]')&&typeof _policyCurrent!=='undefined'&&_policyCurrent)return policyFileName(_policyCurrent);
  if(button.matches('[data-policy-bulk-pdf]'))return `Politicas-seleccionadas-${policyLocalDate()}.pdf`;
  const id=button.getAttribute('onclick')?.match(/policyDownloadFromLibrary\('([^']+)'/)?.[1],policy=typeof _policies!=='undefined'?_policies.find(item=>item.id===id):null;
  return policy?policyFileName(policy):'politica-sierra.pdf';
 }
 document.addEventListener('click',event=>{
  const button=event.target.closest?.('[data-policy-pdf],[data-policy-bulk-pdf],button[onclick*="policyDownloadFromLibrary"]');
  if(!button||button.disabled)return;
  const name=reservedFileName(button);
  reservedDownload=Promise.resolve({popup:downloadWindow(name)});
 },true);
 const legacyPolicySave=window.policySavePdfBlob;
 window.policySavePdfBlob=async function(blob,name){
  const reservation=reservedDownload;reservedDownload=null;
  if(!reservation){legacyPolicySave(blob,name);return true}
  try{
   const {popup}=await reservation;
   if(popup){const ready=completeDownloadWindow(popup,blob,name);if(ready)return {pendingUser:true};legacyPolicySave(blob,name);return true}
   legacyPolicySave(blob,name);return true;
  }catch(error){console.error('No se pudo preparar la pestaña de descarga:',error);legacyPolicySave(blob,name);return true}
 };
 async function decodedImage(image){try{if(!image.complete||!image.naturalWidth)await image.decode()}catch{}if(!image.naturalWidth||!image.naturalHeight)throw Error('Una imagen de la política no se pudo preparar. Vuelve a cargarla y reintenta la descarga.')}
 async function portableImages(doc,host){
  if(typeof indexAssets!=='undefined')await indexAssets.images(host);
  for(const image of host.querySelectorAll('img')){
   await decodedImage(image);
   if(/^data:/i.test(image.src))continue;
   const response=await fetch(image.src,{mode:'cors',credentials:'omit',signal:AbortSignal.timeout(30000)});
   if(!response.ok)throw Error('No se pudo cargar una imagen del contenido. No se descargó un PDF incompleto.');
   const blob=await response.blob(),data=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(blob)});
   image.removeAttribute('crossorigin');image.src=data;await decodedImage(image);
  }
 }
 async function flattenPolicyMedia(doc,host,media){
  for(const figure of host.querySelectorAll('figure.policy-content-image')){
   const image=figure.querySelector(':scope>img');if(!image)throw Error('Una imagen de la política no se pudo preparar. Vuelve a cargarla y reintenta la descarga.');await decodedImage(image);
   const box=figure.getBoundingClientRect(),width=Math.max(1,Math.round(box.width)),height=Math.max(1,Math.round(box.height)),density=Math.min(2,1600/Math.max(width,height)),canvas=doc.createElement('canvas');
   canvas.width=Math.max(1,Math.round(width*density));canvas.height=Math.max(1,Math.round(height*density));
   const context=canvas.getContext('2d'),fit=figure.dataset.policyFit==='contain'?'contain':'cover',zoom=Math.max(.5,Math.min(3,Number(figure.dataset.policyZoom||100)/100)),positionX=Math.max(0,Math.min(100,Number(figure.dataset.policyPositionX||50)))/100,positionY=Math.max(0,Math.min(100,Number(figure.dataset.policyPositionY||50)))/100,base=fit==='contain'?Math.min(width/image.naturalWidth,height/image.naturalHeight):Math.max(width/image.naturalWidth,height/image.naturalHeight),drawWidth=image.naturalWidth*base*zoom,drawHeight=image.naturalHeight*base*zoom;
   context.fillStyle=getComputedStyle(figure).backgroundColor||'#f1f3f3';context.fillRect(0,0,canvas.width,canvas.height);context.imageSmoothingEnabled=true;context.imageSmoothingQuality='high';context.drawImage(image,(width-drawWidth)*positionX*density,(height-drawHeight)*positionY*density,drawWidth*density,drawHeight*density);
   const blob=await new Promise((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(Error('No se pudo preparar una imagen para el PDF.')),'image/jpeg',.96)),bytes=new Uint8Array(await blob.arrayBuffer()),id=`policy-export-image-${media.size+1}`,flattened=doc.createElement('div');media.set(id,{bytes,format:'JPEG'});flattened.setAttribute('data-policy-export-image',id);flattened.setAttribute('aria-label',image.alt||'Imagen');flattened.style.cssText=`display:block;width:${width}px;height:${height}px;max-width:100%;margin:12px auto;break-inside:avoid;background:#f1f3f3`;figure.replaceWith(flattened);canvas.width=canvas.height=1;
  }
 }
 async function localPdf(value,onProgress=()=>{}){
  if(busy)throw Error('Ya se está generando un PDF. Espera a que termine.');
  if(!window.jspdf?.jsPDF||!window.html2canvas)throw Error('No se pudo cargar el generador de PDF. Recarga la aplicación e inténtalo de nuevo.');
  const policies=JSON.parse(JSON.stringify((Array.isArray(value)?value:[value]).filter(Boolean)));
  if(!policies.length)throw Error('Selecciona una política para descargar.');
  if(policies.length>10)throw Error('Selecciona hasta 10 políticas por descarga.');
  busy=true;let frame;
  try{
   onProgress('Preparando PDF','Cargando el diseño y las tipografías…',5);await pause();
   const pdf=new window.jspdf.jsPDF({unit:'px',format:[216*96/25.4,279.4*96/25.4],hotfixes:['px_scaling'],compress:true,floatPrecision:8});
   frame=document.createElement('iframe');frame.title='Preparación privada del PDF';frame.setAttribute('aria-hidden','true');frame.tabIndex=-1;
   frame.style.cssText='position:fixed;left:-20000px;top:0;width:1100px;height:1400px;border:0;pointer-events:none';document.body.append(frame);
   const doc=frame.contentDocument;doc.open();doc.write('<!doctype html><html><head><meta charset="utf-8"></head><body></body></html>');doc.close();
   const base=doc.createElement('base');base.href=root.href;doc.head.append(base);
   document.querySelectorAll('style').forEach(style=>doc.head.append(style.cloneNode(true)));
   const reset=doc.createElement('style');reset.textContent='html,body{display:block!important;margin:0!important;padding:0!important;min-height:0!important;height:auto!important;overflow:visible!important;background:white!important;color-scheme:light}.policy-page-set{display:block!important;gap:0!important}.policy-page{margin:0!important;box-shadow:none!important}.policy-comment-marker,.policy-comment-rail,[data-policy-comment-marker]{display:none!important}';doc.head.append(reset);
   const pages=[];
   for(let i=0;i<policies.length;i++){
    onProgress('Preparando páginas',`Documento ${i+1} de ${policies.length}: conservando el diseño…`,10+15*i/policies.length);
    let p={...policies[i],comments:[]};
    if(p.companyLogo){
     if(/\.svg(?:[?#]|$)|^data:image\/svg\+xml/i.test(p.companyLogo))p=await policyRasterizeSvgLogo(p);
     else if(!/^data:/i.test(p.companyLogo)){
      const url=typeof indexAssets!=='undefined'&&indexAssets.path(p.companyLogo)!==null?await indexAssets.resolve(p.companyLogo):p.companyLogo;
      const response=await fetch(url,{mode:'cors',credentials:'omit',signal:AbortSignal.timeout(30000)});if(!response.ok)throw Error('No se pudo cargar el logotipo. No se descargó un PDF incompleto.');
      p.companyLogo=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;response.blob().then(blob=>reader.readAsDataURL(blob),reject)});
     }
    }
    const host=doc.createElement('div');host.innerHTML=policyPageHtml(p);doc.body.replaceChildren(host);
    await doc.fonts.ready;await portableImages(doc,host);
    if([...doc.fonts].some(face=>face.status==='error'))throw Error('Falta una tipografía. Recarga la aplicación antes de descargar.');
    policyPaginateDom(doc,host);policyFitExportLogos(host);
    for(const content of host.querySelectorAll('.policy-page-content'))if(content.scrollHeight>content.clientHeight+2)throw Error('Hay contenido que no cabe en una página. Revisa la sección antes de descargar.');
    pages.push(...host.querySelectorAll('.policy-page'));await pause();
   }
   if(pages.length>150)throw Error('Descarga hasta 150 páginas por archivo.');
   pdf.setProperties({title:policies.length===1?policies[0].title:'Políticas seleccionadas',creator:'SIERRA Index'});
   for(let i=0;i<pages.length;i++){
    onProgress('Generando PDF',`Página ${i+1} de ${pages.length} · Conservando todo el contenido.`,25+70*i/pages.length);await pause();
    if(i)pdf.addPage();const renderPage=pages[i].cloneNode(true);doc.body.replaceChildren(renderPage);doc.defaultView.scrollTo(0,0);await doc.fonts.ready;
    const pageWidth=renderPage.offsetWidth,pageHeight=renderPage.offsetHeight;
    const canvas=await window.html2canvas(renderPage,{scale:2.5,backgroundColor:'#ffffff',logging:false,useCORS:true,width:pageWidth,height:pageHeight,windowWidth:1100,windowHeight:1400,scrollX:0,scrollY:0}),pageBlob=await new Promise((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(Error('No se pudo preparar una página del PDF.')),'image/png')),pageImage=new Uint8Array(await pageBlob.arrayBuffer());
    pdf.addImage(pageImage,'PNG',0,0,pageWidth,pageHeight,`policy-page-${i+1}`,'FAST');canvas.width=canvas.height=1;
   }
   if(pdf.getNumberOfPages()!==pages.length)throw Error('La paginación del PDF no coincide con la vista previa.');
   onProgress('Finalizando descarga','Verificando el archivo completo…',98);await pause();return completedPdfBlob(pdf);
  }catch(error){
   if(error.name==='TimeoutError')throw Error('La carga de una fuente o logotipo tardó demasiado. Vuelve a intentar la descarga.');
   throw error;
  }finally{frame?.remove();busy=false}
 }
 window.PolicyLocalPdf={generate:localPdf};
})();
