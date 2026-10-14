/* Policy PDF: browser layout -> vector canvas -> PDF. No policy leaves the browser. */
(function(){
 'use strict';
 const root=new URL('../',document.currentScript.src);
 const faces=[
  ['Aeonik',400,'normal','Aeonik-Regular.ttf'],['Aeonik',500,'normal','Aeonik-Medium.ttf'],['Aeonik',700,'normal','Aeonik-Bold.ttf'],
  ['Aeonik',400,'italic','Aeonik-RegularItalic.ttf'],['Aeonik',500,'italic','Aeonik-MediumItalic.ttf'],['Aeonik',700,'italic','Aeonik-BoldItalic.ttf'],
  ['Aeonik Mono',400,'normal','assets/pdf-fonts/AeonikMono-Regular.ttf'],['Aeonik Mono',500,'normal','assets/pdf-fonts/AeonikMono-Medium.ttf'],['Aeonik Mono',700,'normal','assets/pdf-fonts/AeonikMono-Bold.ttf'],
  ['Replica',400,'normal','assets/pdf-fonts/Replica-Regular.ttf'],['Replica',700,'normal','assets/pdf-fonts/Replica-Bold.ttf']
 ];
 let fontData, busy=false;
 const pause=()=>new Promise(resolve=>setTimeout(resolve,0));
 async function fonts(){
  if(!fontData)fontData=Promise.all(faces.map(async face=>{
   const response=await fetch(new URL(face[3],root),{signal:AbortSignal.timeout(30000)});if(!response.ok)throw Error('No se pudo cargar la tipografía del PDF. Vuelve a intentarlo.');
   const bytes=new Uint8Array(await response.arrayBuffer());let binary='';
   for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));
   return {data:btoa(binary)};
  })).catch(error=>{fontData=null;throw error});
  return fontData;
 }
 function vectorContext(pdf,fontFaces){
  const context=pdf.context2d;
  context.fontFaces=fontFaces;context.autoPaging=false;
  // 2.5.2 still allocates pages at bottom-edge paths even with autoPaging=false.
  // A virtual wrap boundary disables that allocator; actual PDF size is unchanged.
  context.margin=[0,0,-1000000,0];
  // The vector canvas stores globalAlpha but does not emit it. Scope the PDF
  // graphics state per drawing call so translucent watermarks stay translucent.
  const states=new Map();
  for(const method of ['fillText','strokeText','fill','stroke','fillRect','strokeRect','drawImage']){
   const draw=context[method];context[method]=function(...args){
    if(method==='fillText'||method==='strokeText'){
     const font=pdf.getFont().metadata;
     if(!font?.characterToGlyph)throw Error('No se pudo conservar una tipografía del documento.');
     for(const char of args[0])if(!/\s/u.test(char)&&!font.characterToGlyph(char.codePointAt(0)))throw Error(`La tipografía del PDF no admite el carácter «${char}». Sustitúyelo antes de descargar para evitar texto incompleto.`);
    }
    const alpha=Number(this.globalAlpha??1);
    if(!states.has(alpha))states.set(alpha,new pdf.GState({opacity:alpha,'stroke-opacity':alpha}));
    pdf.saveGraphicsState();pdf.setGState(states.get(alpha));
    try{return draw.apply(this,args)}finally{pdf.restoreGraphicsState()}
   };
  }
  // jsPDF 2.5 rounds CSS sizes down and rejects intermediate CSS weights (650).
  // Preserve the browser's fractional size and its nearest available static face.
  pdf.context2d=new Proxy(context,{set(target,key,value){
   if(key==='font'){
    const normalized=value.replace(/\b([1-9]\d{2})\s+(?=[\d.]+px)/,(_,weight)=>`${Number(weight)>500?700:Number(weight)>400?500:400} `);
    target.font=normalized;const size=normalized.match(/([\d.]+)px/);
    if(size)pdf.setFontSize(Number(size[1])*pdf.internal.scaleFactor);
    return true;
   }
   return Reflect.set(target,key,value);
  }});
  return pdf.context2d;
 }
 async function localPdf(value,onProgress=()=>{}){
  if(busy)throw Error('Ya se está generando un PDF. Espera a que termine.');
  if(!window.jspdf?.jsPDF||!window.html2canvas)throw Error('No se pudo cargar el generador de PDF. Recarga la aplicación e inténtalo de nuevo.');
  const policies=JSON.parse(JSON.stringify((Array.isArray(value)?value:[value]).filter(Boolean)));
  if(!policies.length)throw Error('Selecciona una política para descargar.');
  if(policies.length>10)throw Error('Selecciona hasta 10 políticas por descarga.');
  busy=true;let frame;
  try{
   onProgress('Preparando PDF','Cargando las tipografías originales…',5);await pause();
   const data=await fonts(),pdf=new window.jspdf.jsPDF({unit:'px',format:[216*96/25.4,279.4*96/25.4],hotfixes:['px_scaling'],compress:true,putOnlyUsedFonts:true,floatPrecision:8});
   const fontFaces=[];
   for(let i=0;i<faces.length;i++){
    const [family,weight,style,path]=faces[i],name=`policy-font-${i}`,fontStyle='normal';
    pdf.addFileToVFS(path,data[i].data);pdf.addFont(path,name,fontStyle);
    fontFaces.push({family,weight,style,src:[],ref:{name,style:fontStyle}});await pause();
   }
   const ctx=vectorContext(pdf,fontFaces);
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
    await doc.fonts.ready;for(const img of host.querySelectorAll('img'))await img.decode();
    if([...doc.fonts].some(face=>face.status==='error'))throw Error('Falta una tipografía. Recarga la aplicación antes de descargar.');
    policyPaginateDom(doc,host);policyFitExportLogos(host);
    for(const content of host.querySelectorAll('.policy-page-content'))if(content.scrollHeight>content.clientHeight+2)throw Error('Hay contenido que no cabe en una página. Revisa la sección antes de descargar.');
    pages.push(...host.querySelectorAll('.policy-page'));await pause();
   }
   if(pages.length>150)throw Error('Descarga hasta 150 páginas por archivo.');
   pdf.setProperties({title:policies.length===1?policies[0].title:'Políticas seleccionadas',creator:'SIERRA Index'});
   for(let i=0;i<pages.length;i++){
    onProgress('Generando PDF',`Página ${i+1} de ${pages.length} · El texto seguirá siendo seleccionable.`,25+70*i/pages.length);await pause();
    if(i)pdf.addPage();doc.body.replaceChildren(pages[i]);await doc.fonts.ready;
    ctx.save(true);
    await window.html2canvas(pages[i],{canvas:pdf.canvas,scale:1,backgroundColor:'#ffffff',logging:false,useCORS:true,windowWidth:1100,windowHeight:1400,scrollX:0,scrollY:0});
    ctx.restore(true);
   }
   if(pdf.getNumberOfPages()!==pages.length)throw Error('La paginación del PDF no coincide con la vista previa.');
   onProgress('Finalizando descarga','Preparando el archivo…',98);await pause();return pdf.output('blob');
  }catch(error){
   if(error.name==='TimeoutError')throw Error('La carga de una fuente o logotipo tardó demasiado. Vuelve a intentar la descarga.');
   throw error;
  }finally{frame?.remove();busy=false}
 }
 window.PolicyLocalPdf={generate:localPdf};
})();
