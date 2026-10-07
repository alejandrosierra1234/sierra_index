/* SIERRA Marketing · altas de colaborador */
const NEW_HIRE_DEFAULTS={
  name:'Nombre del colaborador',
  role:'Puesto del colaborador',
  email:'nombre@sierratextiles.com',
  phone:'',
  department:'Talento Humano',
  country:'Honduras',
  company:'Northern Textiles',
  startDate:new Date().toISOString().slice(0,10),
  message:'¡Bienvenida a SIERRA! Nos alegra que formes parte de nuestro equipo. Tu talento y experiencia suman a todo lo que construimos juntos.',
  photo:'',photoX:50,photoY:50,photoZoom:100,palette:'teal'
}
const NEW_HIRE_LEGACY_MESSAGES=[
  '¡Bienvenido a SIERRA! Estamos muy emocionados de que formes parte de nuestro equipo. Tu talento y experiencia aportarán un gran valor a nuestra organización.'
]
const NEW_HIRE_PALETTES={
  teal:{label:'Turquesa institucional',primary:'#62b8b1',accent:'#62b8b1',deep:'#2d514e',soft:'#edf8f7'},
  blue:{label:'Azul corporativo',primary:'#009fff',accent:'#009fff',deep:'#004a86',soft:'#eef8ff'},
  olive:{label:'Oliva institucional',primary:'#b59e48',accent:'#b59e48',deep:'#625f02',soft:'#f7f5e9'},
  orange:{label:'Naranja institucional',primary:'#dd6e28',accent:'#dd6e28',deep:'#8b3c12',soft:'#fff3ec'}
}
let _newHire={...NEW_HIRE_DEFAULTS},_newHireScale=1,_newHireZoomMode='fit',_newHireTab='content',_newHireExporting=false

function newHireStorageKey(){return`index_new_hire_v1:${typeof me!=='undefined'&&me?.id?me.id:'local'}`}
function newHireLoad(){
  try{const value=JSON.parse(localStorage.getItem(newHireStorageKey())||'null');_newHire={...NEW_HIRE_DEFAULTS,...(value&&typeof value==='object'?value:{})};if(NEW_HIRE_LEGACY_MESSAGES.includes(_newHire.message))_newHire.message=NEW_HIRE_DEFAULTS.message}
  catch{_newHire={...NEW_HIRE_DEFAULTS}}
}
function newHireSave(){
  try{localStorage.setItem(newHireStorageKey(),JSON.stringify(_newHire));const label=document.getElementById('new-hire-save-state');if(label)label.textContent='Cambios guardados en este navegador'}
  catch{const label=document.getElementById('new-hire-save-state');if(label)label.textContent='No se pudo guardar la foto; la vista actual sigue disponible'}
}
function showNewHireCreator(){
  syncModule('comunicaciones');_navLeaf='comunicaciones|_|new-hires';sessionStorage.setItem('sierra_route','module:comunicaciones:new-hires');leaveView();renderSidebarTree()
  document.getElementById('tb-section').textContent='Marketing';document.getElementById('product-controls').style.display='none';clearSecCrumbs()
  document.getElementById('sec-title').textContent='Altas de colaborador';document.getElementById('sec-sub').textContent='Crea una bienvenida SIERRA lista para compartir'
  newHireLoad();renderNewHireCreator()
}
function renderNewHireCreator(){
  const pg=document.getElementById('pg');pg.style.display='block';pg.innerHTML=`<section class="new-hire-studio">
    <header class="new-hire-studio-head">
      <div class="new-hire-studio-title"><h2>Bienvenida de colaborador</h2><p>Formato vertical 1080 × 1350 px</p></div>
      <span class="new-hire-save-state" id="new-hire-save-state">Guardado</span>
      <div class="new-hire-head-actions">
        <button type="button" class="btn btn-ghost" onclick="newHireReset()">${siIcon('rotate-ccw',16)} Restablecer</button>
        <button type="button" class="btn btn-secondary" onclick="newHireExport('jpg')">${siIcon('photo',16)} JPG</button>
        <button type="button" class="btn btn-secondary new-hire-pdf-action" onclick="newHireExport('pdf')">${siIcon('file',16)} PDF</button>
        <button type="button" class="btn btn-primary" onclick="newHireExport('png')">${siIcon('download',16)} Descargar PNG</button>
      </div>
    </header>
    <div class="new-hire-workspace">
      <aside class="new-hire-editor" aria-label="Editor de bienvenida">
        <div class="new-hire-tabs" role="tablist" aria-label="Secciones del editor"><button type="button" class="new-hire-tab" role="tab" aria-selected="${_newHireTab==='content'}" onclick="newHireOpenTab('content')">Contenido</button><button type="button" class="new-hire-tab" role="tab" aria-selected="${_newHireTab==='design'}" onclick="newHireOpenTab('design')">Diseño</button></div>
        <div class="new-hire-form" id="new-hire-form">${newHireFormHtml()}</div>
      </aside>
      <section class="new-hire-preview" aria-label="Vista previa">
        <div class="new-hire-preview-bar"><b>Vista previa</b><span class="new-hire-preview-meta">La pieza se actualiza al escribir</span><div class="new-hire-preview-tools"><button type="button" class="new-hire-zoom-btn new-hire-fit-btn" onclick="newHireZoomFit()">Ajustar</button><button type="button" class="new-hire-zoom-btn" aria-label="Alejar" onclick="newHireZoom(-.1)">${siIcon('minus',16)}</button><span class="new-hire-zoom-value" id="new-hire-zoom-value">100%</span><button type="button" class="new-hire-zoom-btn" aria-label="Acercar" onclick="newHireZoom(.1)">${siIcon('plus',16)}</button></div></div>
        <div class="new-hire-stage" id="new-hire-stage"><div class="new-hire-sheet" id="new-hire-sheet"><div id="new-hire-art-root"></div></div></div>
      </section>
    </div>
  </section>`
  newHireRenderArt();requestAnimationFrame(newHireFit)
}
function newHireField(key,label,type='text',hint=''){
  return`<label class="new-hire-field"><span>${esc(label)}</span><input id="new-hire-field-${key}" class="control-input" type="${type}" value="${escAttr(_newHire[key]||'')}" oninput="newHireSet('${key}',this.value)">${hint?`<small>${esc(hint)}</small>`:''}</label>`
}
function newHireFormHtml(){
  if(_newHireTab==='design')return newHireDesignFormHtml()
  return`<section class="new-hire-section"><h3 class="new-hire-section-title">${siIcon('user-plus',16)} Identidad</h3>
    <label class="new-hire-upload" tabindex="0" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.querySelector('input').click()}">
      <span class="new-hire-upload-thumb" id="new-hire-upload-thumb">${_newHire.photo?`<img src="${escAttr(_newHire.photo)}" alt="Foto cargada">`:siIcon('user',26)}</span>
      <span class="new-hire-upload-copy"><b>${_newHire.photo?'Cambiar fotografía':'Cargar fotografía'}</b><small>Usa un retrato vertical y nítido.</small></span>
      <input type="file" accept="image/png,image/jpeg,image/webp" onchange="newHirePhoto(this)">
    </label>
    ${newHireField('name','Nombre completo')}${newHireField('role','Puesto')}${newHireField('email','Correo','email')}${newHireField('phone','Teléfono (opcional)','tel')}
  </section>
  <section class="new-hire-section"><h3 class="new-hire-section-title">${siIcon('building',16)} Organización</h3>
    ${newHireField('department','Gerencia / departamento')}${newHireField('country','País')}${newHireField('company','Empresa')}${newHireField('startDate','Fecha de ingreso','date')}
  </section>
  <section class="new-hire-section"><h3 class="new-hire-section-title">${siIcon('message',16)} Mensaje</h3>
    <label class="new-hire-field"><span>Mensaje de bienvenida</span><textarea id="new-hire-field-message" class="control-input" maxlength="280" oninput="newHireSet('message',this.value)">${esc(_newHire.message)}</textarea><small>Máximo 280 caracteres para conservar una lectura cómoda.</small></label>
  </section>`
}
function newHireDesignFormHtml(){
  const palettes=Object.entries(NEW_HIRE_PALETTES).map(([key,value])=>`<button type="button" class="new-hire-palette" aria-label="Paleta ${escAttr(key)}" aria-pressed="${_newHire.palette===key}" onclick="newHirePalette('${key}')"><span class="new-hire-palette-swatches"><i style="--swatch:${value.soft}"></i><i style="--swatch:${value.primary}"></i><i style="--swatch:${value.deep}"></i></span><span>${esc(value.label)}</span><span class="new-hire-palette-check">${_newHire.palette===key?siIcon('check',16):''}</span></button>`).join('')
  return`<section class="new-hire-section"><h3 class="new-hire-section-title">${siIcon('photo',16)} Encuadre de fotografía</h3><p class="new-hire-design-note">Ajusta el retrato sin alterar el tamaño final de la pieza.</p>
    <div class="new-hire-range"><label for="new-hire-x">Posición horizontal</label><output id="new-hire-x-value">${Number(_newHire.photoX)}%</output><input id="new-hire-x" type="range" min="0" max="100" value="${Number(_newHire.photoX)}" oninput="newHireRange('photoX',this.value,'new-hire-x-value')"></div>
    <div class="new-hire-range"><label for="new-hire-y">Posición vertical</label><output id="new-hire-y-value">${Number(_newHire.photoY)}%</output><input id="new-hire-y" type="range" min="0" max="100" value="${Number(_newHire.photoY)}" oninput="newHireRange('photoY',this.value,'new-hire-y-value')"></div>
    <div class="new-hire-range"><label for="new-hire-zoom">Zoom de la fotografía</label><output id="new-hire-zoom-value">${Number(_newHire.photoZoom)}%</output><input id="new-hire-zoom" type="range" min="100" max="180" value="${Number(_newHire.photoZoom)}" oninput="newHireRange('photoZoom',this.value,'new-hire-zoom-value')"></div>
  </section><section class="new-hire-section"><h3 class="new-hire-section-title">${siIcon('palette',16)} Paleta SIERRA</h3><div class="new-hire-palettes">${palettes}</div></section>`
}
function newHireOpenTab(tab){if(!['content','design'].includes(tab))return;_newHireTab=tab;document.querySelectorAll('.new-hire-tab').forEach((button,index)=>button.setAttribute('aria-selected',String((index===0)===(tab==='content'))));const form=document.getElementById('new-hire-form');if(form){form.innerHTML=newHireFormHtml();form.scrollTop=0}}
function newHireSet(key,value){_newHire[key]=value;newHireRenderArt();newHireSave()}
function newHireRange(key,value,outputId){_newHire[key]=Number(value);const output=document.getElementById(outputId);if(output)output.value=value+'%';newHireRenderArt();newHireSave()}
function newHirePalette(key){if(!NEW_HIRE_PALETTES[key])return;_newHire.palette=key;newHireOpenTab('design');newHireRenderArt();newHireSave()}
function newHirePhoto(input){
  const file=input.files?.[0];if(!file)return;if(!/^image\/(png|jpeg|webp)$/i.test(file.type)){toast('Usa una imagen PNG, JPG o WebP.');return}
  const reader=new FileReader();reader.onload=()=>{const image=new Image();image.onload=()=>{const max=1600,scale=Math.min(1,max/Math.max(image.naturalWidth,image.naturalHeight)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(image.naturalWidth*scale));canvas.height=Math.max(1,Math.round(image.naturalHeight*scale));canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);_newHire.photo=canvas.toDataURL('image/jpeg',.9);canvas.width=canvas.height=0;const thumb=document.getElementById('new-hire-upload-thumb');if(thumb)thumb.innerHTML=`<img src="${escAttr(_newHire.photo)}" alt="Foto cargada">`;newHireRenderArt();newHireSave()};image.onerror=()=>toast('No se pudo procesar la fotografía.');image.src=String(reader.result||'')};reader.onerror=()=>toast('No se pudo leer la fotografía.');reader.readAsDataURL(file)
}
function newHireDateLabel(value){
  const match=String(value||'').match(/^(\d{4})-(\d{2})-(\d{2})$/);if(!match)return String(value||'')
  return new Intl.DateTimeFormat('es-GT',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(Date.UTC(Number(match[1]),Number(match[2])-1,Number(match[3]))))
}
function newHireArtHtml(){
  const p=NEW_HIRE_PALETTES[_newHire.palette]||NEW_HIRE_PALETTES.teal,logo=typeof memoLogoHtml==='function'?memoLogoHtml():'<strong>SIERRA</strong>'
  const fact=(key,label,value,cls='',wrapCls='')=>value?`<div class="new-hire-fact ${wrapCls}" data-nh-field="${key}" onclick="newHireFocusField('${key}')"><dt>${esc(label)}</dt><dd class="${cls}">${esc(value)}</dd></div>`:''
  const contact=[_newHire.email?`<span class="new-hire-contact-line" data-nh-field="email" onclick="event.stopPropagation();newHireFocusField('email')">${siIcon('mail',14)}<span class="new-hire-contact-value new-hire-single-line" data-min-font="8">${esc(_newHire.email)}</span></span>`:'',_newHire.phone?`<span class="new-hire-contact-line" data-nh-field="phone" onclick="event.stopPropagation();newHireFocusField('phone')">${siIcon('phone',14)}<span class="new-hire-contact-value new-hire-single-line" data-min-font="9">${esc(_newHire.phone)}</span></span>`:''].filter(Boolean).join('')
  const photo=_newHire.photo?`<img src="${escAttr(_newHire.photo)}" alt="Retrato de ${escAttr(_newHire.name||'nuevo colaborador')}">`:`<div class="new-hire-photo-empty">${siIcon('user',64)}<b>Carga una fotografía</b></div>`
  return`<article class="new-hire-art" id="new-hire-art" style="--nh-primary:${p.primary};--nh-accent:${p.accent};--nh-deep:${p.deep};--nh-soft:${p.soft};--nh-photo-x:${Number(_newHire.photoX)}%;--nh-photo-y:${Number(_newHire.photoY)}%;--nh-photo-zoom:${(Number(_newHire.photoZoom)||100)/100}">
    <header class="new-hire-art-header">${logo}<span class="new-hire-art-kicker">Nuevo colaborador</span></header>
    <main class="new-hire-art-main">
      <div class="new-hire-heading"><h1 class="new-hire-art-title"><span>Te damos la bienvenida</span><span>al equipo <strong>SIERRA</strong></span></h1></div>
      <div class="new-hire-card-grid"><div class="new-hire-photo" data-nh-field="photo" onclick="newHireFocusField('photo')">${photo}</div><section class="new-hire-info">
        <h2 class="new-hire-name new-hire-single-line" data-min-font="15" data-nh-field="name" onclick="newHireFocusField('name')">${esc(_newHire.name||'Nombre del colaborador')}</h2><p class="new-hire-role" data-nh-field="role" onclick="newHireFocusField('role')">${esc(_newHire.role||'Puesto del colaborador')}</p>
        <dl class="new-hire-facts">${contact?`<div class="new-hire-fact new-hire-fact-contact"><dt>Contacto</dt><dd class="new-hire-contact-lines">${contact}</dd></div>`:''}${fact('department','Gerencia',_newHire.department,'new-hire-department','new-hire-fact-department')}${fact('country','País',_newHire.country)}${fact('company','Empresa',_newHire.company)}${fact('startDate','Fecha de ingreso',newHireDateLabel(_newHire.startDate),'','new-hire-fact-date')}</dl>
      </section></div>
      <footer class="new-hire-message-card"><div class="new-hire-message-copy"><p class="new-hire-message-label">Nos alegra que estés aquí</p><p class="new-hire-message" data-nh-field="message" onclick="newHireFocusField('message')">${esc(_newHire.message)}</p></div><img class="new-hire-clay" src="marketing/assets/sierra-clay-welcome-team.png" alt="Equipo SIERRA con materiales textiles"></footer>
    </main>
  </article>`
}
function newHireFitSingleLines(root=document){
  root.querySelectorAll?.('.new-hire-single-line').forEach(element=>{element.style.fontSize='';if(!element.clientWidth)return;let size=parseFloat(getComputedStyle(element).fontSize)||13,min=Number(element.dataset.minFont)||8;while(element.scrollWidth>element.clientWidth&&size>min){size=Math.max(min,size-.5);element.style.fontSize=`${size}px`}})
}
function newHireRenderArt(){const root=document.getElementById('new-hire-art-root');if(!root)return;root.innerHTML=newHireArtHtml();newHireFitSingleLines(root);requestAnimationFrame(()=>newHireFitSingleLines(root));document.fonts?.ready?.then(()=>newHireFitSingleLines(root))}
function newHireFit(){
  const stage=document.getElementById('new-hire-stage'),sheet=document.getElementById('new-hire-sheet');if(!stage||!sheet)return
  if(_newHireZoomMode==='fit')_newHireScale=Math.min(1,(stage.clientWidth-48)/720,(stage.clientHeight-48)/900);_newHireScale=Math.max(.28,_newHireScale);newHireApplyScale()
}
function newHireApplyScale(){const sheet=document.getElementById('new-hire-sheet');if(!sheet)return;sheet.style.transform=`scale(${_newHireScale})`;sheet.style.marginBottom=`${Math.round(900*(_newHireScale-1))}px`;const label=document.getElementById('new-hire-zoom-value');if(label)label.textContent=`${Math.round(_newHireScale*100)}%`}
function newHireZoom(delta){_newHireZoomMode='manual';_newHireScale=Math.min(1.25,Math.max(.3,Math.round((_newHireScale+delta)*10)/10));newHireApplyScale()}
function newHireZoomFit(){_newHireZoomMode='fit';newHireFit()}
function newHireFocusField(key){const design=key==='photo'&&!!_newHire.photo;newHireOpenTab(design?'design':'content');requestAnimationFrame(()=>{if(key==='photo'){(design?document.getElementById('new-hire-x'):document.querySelector('.new-hire-upload'))?.focus({preventScroll:true});return}const field=document.getElementById(`new-hire-field-${key}`);field?.focus({preventScroll:true});field?.scrollIntoView?.({block:'center',behavior:'smooth'})})}
function newHireReset(){
  if(!confirm('¿Restablecer todos los campos y quitar la fotografía?'))return;_newHire={...NEW_HIRE_DEFAULTS};newHireSave();renderNewHireCreator();toast('Plantilla restablecida.')
}
function newHireFileName(format){const name=String(_newHire.name||'nuevo-colaborador').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'').toLowerCase();return`bienvenida-${name||'nuevo-colaborador'}.${format}`}
async function newHireExport(format='png'){
  format=String(format).toLowerCase();if(!['png','jpg','pdf'].includes(format)||_newHireExporting)return;if(!_newHire.name.trim()||_newHire.name===NEW_HIRE_DEFAULTS.name){toast('Escribe el nombre del colaborador antes de exportar.');return}if(!_newHire.photo){toast('Carga la fotografía del colaborador antes de exportar.');return}
  const art=document.getElementById('new-hire-art');if(!art||typeof html2canvas!=='function'){toast('No se pudo preparar la imagen. Recarga e inténtalo de nuevo.');return}
  _newHireExporting=true;const buttons=document.querySelectorAll('.new-hire-head-actions button');buttons.forEach(button=>button.disabled=true)
  let canvas
  try{await document.fonts?.ready;newHireFitSingleLines(art);await Promise.all([...art.querySelectorAll('img')].map(image=>typeof image.decode==='function'?image.decode().catch(()=>{}):Promise.resolve()));canvas=await html2canvas(art,{scale:1.5,useCORS:true,allowTaint:false,backgroundColor:'#ffffff',logging:false,width:720,height:900});if(format==='pdf'){if(!window.jspdf?.jsPDF)throw Error('El generador de PDF no está disponible. Recarga la aplicación e inténtalo de nuevo.');const pdf=new window.jspdf.jsPDF({orientation:'portrait',unit:'mm',format:[216,270],compress:true}),pageWidth=pdf.internal.pageSize.getWidth(),pageHeight=pdf.internal.pageSize.getHeight();pdf.setProperties({title:`Bienvenida · ${_newHire.name}`,creator:'SIERRA Index'});pdf.addImage(canvas.toDataURL('image/jpeg',.96),'JPEG',0,0,pageWidth,pageHeight,undefined,'FAST');pdf.save(newHireFileName('pdf'))}else{const mime=format==='jpg'?'image/jpeg':'image/png',quality=format==='jpg' ? .94 : undefined,blob=await new Promise((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(Error('No se pudo crear el archivo.')),mime,quality)),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=newHireFileName(format);document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000)}toast(`${format.toUpperCase()} listo para compartir.`)}catch(error){console.error(error);alert(error.message||'No se pudo exportar la bienvenida.')}finally{if(canvas)canvas.width=canvas.height=0;_newHireExporting=false;buttons.forEach(button=>button.disabled=false)}
}
window.addEventListener('resize',()=>{if(document.getElementById('new-hire-studio'))newHireFit()})
