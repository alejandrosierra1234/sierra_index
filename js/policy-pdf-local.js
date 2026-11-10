/* Policy PDF: browser layout -> vector canvas -> PDF. No policy leaves the browser. */
(function(){
 'use strict';
 const root=new URL('../',document.currentScript.src);
 const EXPORT_VERSION='2026.11.09.6';
 const TIMEOUT={asset:30000,font:30000,layout:45000,page:60000,total:240000};
 const STAGES=Object.freeze({IDLE:'idle',ASSETS:'preparing-assets',LAYOUT:'layout',RENDER:'rendering',VALIDATE:'validating',DOWNLOAD:'downloading',COMPLETE:'complete',ERROR:'error'});
 let busy=false;
 let diagnostics=[];
 const pause=()=>new Promise(resolve=>setTimeout(resolve,0));
 class PolicyPdfError extends Error{constructor(code,stage,message,cause){super(message,{cause});this.name='PolicyPdfError';this.code=code;this.stage=stage}}
 function timeout(promise,milliseconds,code,stage,message){let timer;return Promise.race([Promise.resolve(promise),new Promise((_,reject)=>{timer=setTimeout(()=>reject(new PolicyPdfError(code,stage,message)),milliseconds)})]).finally(()=>clearTimeout(timer))}
 function diagnostic(entry){const safe={at:new Date().toISOString(),version:EXPORT_VERSION,stage:entry.stage,code:entry.code||'',duration:Math.round(entry.duration||0),pages:Number(entry.pages||0),documents:Number(entry.documents||0),browser:navigator.userAgent.slice(0,160)};diagnostics=[...diagnostics.slice(-9),safe];try{const key='sierra:policy-pdf-diagnostics',prior=JSON.parse(localStorage.getItem(key)||'[]');localStorage.setItem(key,JSON.stringify([...prior.slice(-9),safe]))}catch{}}
 function completedPdfBlob(pdf){
  const buffer=pdf.output('arraybuffer');
  if(!(buffer instanceof ArrayBuffer)||buffer.byteLength<1024)throw Error('El PDF no terminó de generarse. No se descargó un archivo vacío. Inténtalo nuevamente.');
  const bytes=new Uint8Array(buffer),head=String.fromCharCode(...bytes.subarray(0,5)),tail=new TextDecoder('latin1').decode(bytes.subarray(Math.max(0,bytes.length-2048)));
  if(head!=='%PDF-'||!tail.includes('%%EOF'))throw Error('El PDF quedó incompleto. No se descargó el archivo; vuelve a intentarlo.');
  return new Blob([buffer],{type:'application/pdf'});
 }
 let reservedDownload=null;
 function reservedDownloadLink(name){
  const link=document.createElement('a');link.download=name;link.hidden=true;link.setAttribute('aria-hidden','true');document.body.append(link);return link;
 }
 function completeReservedDownload(link,blob,name){
  if(!link?.isConnected)return false;const url=URL.createObjectURL(blob);link.href=url;link.download=name;link.click();const timer=setTimeout(()=>{link.remove();URL.revokeObjectURL(url)},60000);timer?.unref?.();return true;
 }
 function reservedFileName(button){
  if(button.matches('[data-policy-pdf]')&&typeof _policyCurrent!=='undefined'&&_policyCurrent)return policyFileName(_policyCurrent);
  if(button.matches('[data-policy-bulk-pdf]'))return `Politicas-seleccionadas-${policyLocalDate()}.pdf`;
  const id=button.getAttribute('onclick')?.match(/policyDownloadFromLibrary\('([^']+)'/)?.[1],policy=typeof _policies!=='undefined'?_policies.find(item=>item.id===id):null;
  return policy?policyFileName(policy):'politica-sierra.pdf';
 }
 document.addEventListener('click',event=>{
  const button=event.target.closest?.('[data-policy-pdf],[data-policy-bulk-pdf],button[onclick*="policyDownloadFromLibrary"]');
  if(!button||button.disabled||busy)return;
  const name=reservedFileName(button);
  reservedDownload=reservedDownloadLink(name);
 },true);
 const legacyPolicySave=window.policySavePdfBlob;
 window.policySavePdfBlob=async function(blob,name){
  const reservation=reservedDownload;reservedDownload=null;
  if(!reservation){legacyPolicySave(blob,name);return true}
  try{
   if(completeReservedDownload(reservation,blob,name))return true;
   legacyPolicySave(blob,name);return true;
  }catch(error){console.error('No se pudo completar la descarga reservada:',error);reservation?.remove?.();legacyPolicySave(blob,name);return true}
 };
 async function decodedImage(image){try{if(!image.complete||!image.naturalWidth)await timeout(image.decode(),TIMEOUT.asset,'IMAGE_DECODE_TIMEOUT',STAGES.ASSETS,'Una imagen tardó demasiado en cargar. No se descargó un PDF incompleto.')}catch(error){if(error instanceof PolicyPdfError)throw error}if(!image.naturalWidth||!image.naturalHeight)throw new PolicyPdfError('IMAGE_INVALID',STAGES.ASSETS,'Una imagen de la política no se pudo preparar. Vuelve a cargarla y reintenta la descarga.')}
 async function portableImages(doc,host){
  if(typeof indexAssets!=='undefined')await indexAssets.images(host);
  for(const image of host.querySelectorAll('img')){
   await decodedImage(image);
   if(/^data:/i.test(image.src))continue;
   const response=await fetch(image.src,{mode:'cors',credentials:'omit',signal:AbortSignal.timeout(TIMEOUT.asset)});
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
  busy=true;let frame,totalTimer,stage=STAGES.IDLE,pageCount=0;const started=performance.now();
  const report=(next,title,detail,percent)=>{stage=next;onProgress(title,detail,percent)};
  try{
   const totalGuard=new Promise((_,reject)=>{totalTimer=setTimeout(()=>reject(new PolicyPdfError('EXPORT_TIMEOUT',stage,'La preparación completa tardó demasiado. No se descargó un archivo incompleto.')),TIMEOUT.total)});
   const work=(async()=>{
   report(STAGES.ASSETS,'Preparando PDF','Cargando el diseño, los logos y las tipografías…',5);await pause();
   const pdf=new window.jspdf.jsPDF({unit:'px',format:[216*96/25.4,279.4*96/25.4],hotfixes:['px_scaling'],compress:true,floatPrecision:8});
   frame=document.createElement('iframe');frame.title='Preparación privada del PDF';frame.setAttribute('aria-hidden','true');frame.tabIndex=-1;
   frame.style.cssText='position:fixed;left:-20000px;top:0;width:1100px;height:1400px;border:0;pointer-events:none';document.body.append(frame);
   const doc=frame.contentDocument;doc.open();doc.write('<!doctype html><html><head><meta charset="utf-8"></head><body></body></html>');doc.close();
   const base=doc.createElement('base');base.href=root.href;doc.head.append(base);
   document.querySelectorAll('style').forEach(style=>doc.head.append(style.cloneNode(true)));
   const reset=doc.createElement('style');reset.textContent='html,body{display:block!important;margin:0!important;padding:0!important;min-height:0!important;height:auto!important;overflow:visible!important;background:white!important;color-scheme:light}.policy-page-set{display:block!important;gap:0!important}.policy-page{margin:0!important;box-shadow:none!important}.policy-comment-marker,.policy-comment-rail,[data-policy-comment-marker]{display:none!important}';doc.head.append(reset);
   const pages=[];
   for(let i=0;i<policies.length;i++){
    report(STAGES.ASSETS,'Preparando recursos',`Documento ${i+1} de ${policies.length}: incorporando logos e imágenes…`,8+12*i/policies.length);
    let p={...policies[i],comments:[]};
    if(p.companyLogo)p=await timeout(policyPrepareExportLogo(p),TIMEOUT.asset,'LOGO_TIMEOUT',STAGES.ASSETS,'El logotipo tardó demasiado en prepararse. No se descargó un PDF incompleto.');
    const host=doc.createElement('div');host.innerHTML=policyPageHtml(p);doc.body.replaceChildren(host);
    await timeout(doc.fonts.ready,TIMEOUT.font,'FONT_TIMEOUT',STAGES.ASSETS,'Las tipografías tardaron demasiado en cargar. Vuelve a intentarlo.');
    await timeout(portableImages(doc,host),TIMEOUT.asset,'ASSET_TIMEOUT',STAGES.ASSETS,'Las imágenes tardaron demasiado en prepararse. No se descargó un PDF incompleto.');
    if([...doc.fonts].some(face=>face.status==='error'))throw Error('Falta una tipografía. Recarga la aplicación antes de descargar.');
    report(STAGES.LAYOUT,'Organizando páginas',`Documento ${i+1} de ${policies.length}: validando la paginación…`,20+10*i/policies.length);
    await timeout(Promise.resolve().then(()=>{policyPaginateDom(doc,host);policyFitExportLogos(host)}),TIMEOUT.layout,'LAYOUT_TIMEOUT',STAGES.LAYOUT,'La paginación tardó demasiado. Revisa el contenido e inténtalo de nuevo.');
    for(const content of host.querySelectorAll('.policy-page-content'))if(content.scrollHeight>content.clientHeight+2)throw Error('Hay contenido que no cabe en una página. Revisa la sección antes de descargar.');
    pages.push(...host.querySelectorAll('.policy-page'));await pause();
   }
   if(pages.length>150)throw Error('Descarga hasta 150 páginas por archivo.');
   pageCount=pages.length;pdf.setProperties({title:policies.length===1?policies[0].title:'Políticas seleccionadas',creator:'SIERRA Index',subject:`SIERRA Index Policy Export ${EXPORT_VERSION}`});
   for(let i=0;i<pages.length;i++){
    report(STAGES.RENDER,'Generando PDF',`Página ${i+1} de ${pages.length} · Conservando todo el contenido.`,30+65*i/pages.length);await pause();
    if(i)pdf.addPage();const renderPage=pages[i].cloneNode(true);doc.body.replaceChildren(renderPage);doc.defaultView.scrollTo(0,0);await timeout(doc.fonts.ready,TIMEOUT.font,'FONT_TIMEOUT',STAGES.RENDER,'Las tipografías tardaron demasiado en cargar. Vuelve a intentarlo.');
    const pageWidth=renderPage.offsetWidth,pageHeight=renderPage.offsetHeight;
    const canvas=await timeout(window.html2canvas(renderPage,{scale:2.5,backgroundColor:'#ffffff',logging:false,useCORS:true,width:pageWidth,height:pageHeight,windowWidth:1100,windowHeight:1400,scrollX:0,scrollY:0}),TIMEOUT.page,'PAGE_TIMEOUT',STAGES.RENDER,`La página ${i+1} tardó demasiado en procesarse. No se descargó un PDF incompleto.`),pageBlob=await timeout(new Promise((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(Error('No se pudo preparar una página del PDF.')),'image/png')),TIMEOUT.page,'PAGE_BLOB_TIMEOUT',STAGES.RENDER,'No se pudo finalizar una página del PDF.'),pageImage=new Uint8Array(await pageBlob.arrayBuffer());
    pdf.addImage(pageImage,'PNG',0,0,pageWidth,pageHeight,`policy-page-${i+1}`,'FAST');canvas.width=canvas.height=1;
   }
   if(pdf.getNumberOfPages()!==pages.length)throw Error('La paginación del PDF no coincide con la vista previa.');
   report(STAGES.VALIDATE,'Verificando PDF','Comprobando páginas, tamaño y cierre del archivo…',98);await pause();const blob=completedPdfBlob(pdf);report(STAGES.DOWNLOAD,'PDF listo','Entregando el archivo al navegador…',100);return blob;
   })();
   const blob=await Promise.race([work,totalGuard]);diagnostic({stage:STAGES.COMPLETE,duration:performance.now()-started,pages:pageCount,documents:policies.length});return blob;
  }catch(error){
   const failure=error instanceof PolicyPdfError?error:new PolicyPdfError(error.name==='TimeoutError'?'ASSET_TIMEOUT':'EXPORT_FAILED',stage,error.message||'No se pudo generar el PDF.',error);diagnostic({stage:STAGES.ERROR,code:failure.code,duration:performance.now()-started,pages:pageCount,documents:policies.length});reservedDownload?.remove?.();reservedDownload=null;throw failure;
  }finally{clearTimeout(totalTimer);frame?.remove();busy=false}
 }
 window.PolicyLocalPdf={generate:localPdf,stages:STAGES,version:EXPORT_VERSION,getDiagnostics(){try{return JSON.parse(localStorage.getItem('sierra:policy-pdf-diagnostics')||JSON.stringify(diagnostics))}catch{return diagnostics.slice()}}};
})();
