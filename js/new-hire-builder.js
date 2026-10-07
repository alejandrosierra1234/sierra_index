/* SIERRA Marketing · altas de colaborador */
const NEW_HIRE_DEFAULTS={
  name:'Nombre del colaborador',
  role:'Puesto del colaborador',
  email:'nombre@sierratextiles.com',
  department:'Talento Humano',
  country:'Honduras',
  company:'Northern Textiles',
  message:'¡Bienvenido a SIERRA! Estamos muy emocionados de que formes parte de nuestro equipo. Tu talento y experiencia aportarán un gran valor a nuestra organización.',
  photo:'',photoX:50,photoY:50,photoZoom:100,palette:'teal'
}
const NEW_HIRE_PALETTES={
  teal:{primary:'#62b8b1',accent:'#dd6e28',deep:'#2d514e'},
  blue:{primary:'#009fff',accent:'#ff7824',deep:'#004a86'},
  olive:{primary:'#b59e48',accent:'#9827b8',deep:'#625f02'},
  orange:{primary:'#dd6e28',accent:'#62b8b1',deep:'#8b3c12'}
}
let _newHire={...NEW_HIRE_DEFAULTS},_newHireScale=1,_newHireExporting=false

function newHireStorageKey(){return`index_new_hire_v1:${typeof me!=='undefined'&&me?.id?me.id:'local'}`}
function newHireLoad(){
  try{const value=JSON.parse(localStorage.getItem(newHireStorageKey())||'null');_newHire={...NEW_HIRE_DEFAULTS,...(value&&typeof value==='object'?value:{})}}
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
    <aside class="new-hire-editor" aria-label="Editor de bienvenida">
      <header class="new-hire-editor-head"><h2>Nuevo colaborador</h2><p id="new-hire-save-state">Cambios guardados en este navegador</p></header>
      <div class="new-hire-form">${newHireFormHtml()}</div>
      <footer class="new-hire-actions">
        <button type="button" class="btn btn-ghost" onclick="newHireReset()">${siIcon('rotate-ccw',16)} Restablecer</button>
        <button type="button" class="btn btn-secondary" onclick="newHireExport('jpg')">${siIcon('photo',16)} JPG</button>
        <button type="button" class="btn btn-primary" onclick="newHireExport('png')">${siIcon('download',16)} Descargar PNG</button>
      </footer>
    </aside>
    <section class="new-hire-preview" aria-label="Vista previa">
      <div class="new-hire-preview-bar"><b>Vista previa</b><span>1080 × 1350 px · formato vertical 4:5</span></div>
      <div class="new-hire-stage" id="new-hire-stage"><div class="new-hire-sheet" id="new-hire-sheet"><div id="new-hire-art-root"></div></div></div>
    </section>
  </section>`
  newHireRenderArt();requestAnimationFrame(newHireFit)
}
function newHireField(key,label,type='text',hint=''){
  return`<label class="new-hire-field"><span>${esc(label)}</span><input class="control-input" type="${type}" value="${escAttr(_newHire[key]||'')}" oninput="newHireSet('${key}',this.value)">${hint?`<small>${esc(hint)}</small>`:''}</label>`
}
function newHireFormHtml(){
  const palettes=Object.entries(NEW_HIRE_PALETTES).map(([key,value])=>`<button type="button" class="new-hire-palette" aria-label="Paleta ${escAttr(key)}" aria-pressed="${_newHire.palette===key}" onclick="newHirePalette('${key}')"><i style="--swatch:${value.primary}"></i><i style="--swatch:${value.accent}"></i><i style="--swatch:${value.deep}"></i></button>`).join('')
  return`<section class="new-hire-section"><h3 class="new-hire-section-title">${siIcon('user-plus',16)} Identidad</h3>
    <label class="new-hire-upload" tabindex="0" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.querySelector('input').click()}">
      <span class="new-hire-upload-thumb" id="new-hire-upload-thumb">${_newHire.photo?`<img src="${escAttr(_newHire.photo)}" alt="Foto cargada">`:siIcon('user',26)}</span>
      <span class="new-hire-upload-copy"><b>${_newHire.photo?'Cambiar fotografía':'Cargar fotografía'}</b><small>Usa un retrato vertical y nítido.</small></span>
      <input type="file" accept="image/png,image/jpeg,image/webp" onchange="newHirePhoto(this)">
    </label>
    ${newHireField('name','Nombre completo')}${newHireField('role','Puesto')}${newHireField('email','Contacto','email')}
    <div class="new-hire-range"><label for="new-hire-x">Posición horizontal</label><output id="new-hire-x-value">${Number(_newHire.photoX)}%</output><input id="new-hire-x" type="range" min="0" max="100" value="${Number(_newHire.photoX)}" oninput="newHireRange('photoX',this.value,'new-hire-x-value')"></div>
    <div class="new-hire-range"><label for="new-hire-y">Posición vertical</label><output id="new-hire-y-value">${Number(_newHire.photoY)}%</output><input id="new-hire-y" type="range" min="0" max="100" value="${Number(_newHire.photoY)}" oninput="newHireRange('photoY',this.value,'new-hire-y-value')"></div>
    <div class="new-hire-range"><label for="new-hire-zoom">Zoom de la fotografía</label><output id="new-hire-zoom-value">${Number(_newHire.photoZoom)}%</output><input id="new-hire-zoom" type="range" min="100" max="180" value="${Number(_newHire.photoZoom)}" oninput="newHireRange('photoZoom',this.value,'new-hire-zoom-value')"></div>
  </section>
  <section class="new-hire-section"><h3 class="new-hire-section-title">${siIcon('building',16)} Organización</h3>
    <div class="new-hire-grid">${newHireField('department','Gerencia / departamento')}${newHireField('country','País')}</div>${newHireField('company','Empresa')}
  </section>
  <section class="new-hire-section"><h3 class="new-hire-section-title">${siIcon('message',16)} Mensaje y color</h3>
    <label class="new-hire-field"><span>Mensaje de bienvenida</span><textarea class="control-input" maxlength="280" oninput="newHireSet('message',this.value)">${esc(_newHire.message)}</textarea><small>Máximo 280 caracteres para conservar una lectura cómoda.</small></label>
    <div class="new-hire-field"><span>Paleta SIERRA</span><div class="new-hire-palettes">${palettes}</div></div>
  </section>`
}
function newHireSet(key,value){_newHire[key]=value;newHireRenderArt();newHireSave()}
function newHireRange(key,value,outputId){_newHire[key]=Number(value);const output=document.getElementById(outputId);if(output)output.value=value+'%';newHireRenderArt();newHireSave()}
function newHirePalette(key){if(!NEW_HIRE_PALETTES[key])return;_newHire.palette=key;document.querySelectorAll('.new-hire-palette').forEach(button=>button.setAttribute('aria-pressed',String(button.getAttribute('aria-label')===`Paleta ${key}`)));newHireRenderArt();newHireSave()}
function newHirePhoto(input){
  const file=input.files?.[0];if(!file)return;if(!/^image\/(png|jpeg|webp)$/i.test(file.type)){toast('Usa una imagen PNG, JPG o WebP.');return}
  const reader=new FileReader();reader.onload=()=>{_newHire.photo=String(reader.result||'');const thumb=document.getElementById('new-hire-upload-thumb');if(thumb)thumb.innerHTML=`<img src="${escAttr(_newHire.photo)}" alt="Foto cargada">`;newHireRenderArt();newHireSave()};reader.onerror=()=>toast('No se pudo leer la fotografía.');reader.readAsDataURL(file)
}
function newHireArtHtml(){
  const p=NEW_HIRE_PALETTES[_newHire.palette]||NEW_HIRE_PALETTES.teal,logo=typeof memoLogoHtml==='function'?memoLogoHtml():'<strong>SIERRA</strong>'
  const fact=(label,value,cls='')=>value?`<div class="new-hire-fact"><dt>${esc(label)}</dt><dd class="${cls}">${esc(value)}</dd></div>`:''
  const photo=_newHire.photo?`<img src="${escAttr(_newHire.photo)}" alt="Retrato de ${escAttr(_newHire.name||'nuevo colaborador')}">`:`<div class="new-hire-photo-empty">${siIcon('user',64)}<b>Carga una fotografía</b></div>`
  return`<article class="new-hire-art" id="new-hire-art" style="--nh-primary:${p.primary};--nh-accent:${p.accent};--nh-deep:${p.deep};--nh-photo-x:${Number(_newHire.photoX)}%;--nh-photo-y:${Number(_newHire.photoY)}%;--nh-photo-zoom:${(Number(_newHire.photoZoom)||100)/100}">
    <header class="new-hire-art-header">${logo}<span class="new-hire-art-divider"></span><span class="new-hire-art-kicker">Nuevo colaborador</span></header>
    <main class="new-hire-art-main"><h1 class="new-hire-art-title">Te damos la bienvenida<br>al equipo SIERRA</h1>
      <div class="new-hire-card-grid"><div class="new-hire-photo">${photo}</div><section class="new-hire-info">
        <h2 class="new-hire-name">${esc(_newHire.name||'Nombre del colaborador')}</h2><p class="new-hire-role">${esc(_newHire.role||'Puesto del colaborador')}</p>
        <dl class="new-hire-facts">${fact('Contacto',_newHire.email)}${fact('Gerencia',_newHire.department,'new-hire-department')}${fact('País',_newHire.country)}${fact('Empresa',_newHire.company)}</dl>
      </section></div></main>
    <footer class="new-hire-art-footer"><p class="new-hire-message">${esc(_newHire.message)}</p><img class="new-hire-clay" src="marketing/assets/sierra-clay-welcome-team.png" alt="Equipo SIERRA con materiales textiles"></footer>
    <span class="new-hire-brand-line" aria-hidden="true"></span>
  </article>`
}
function newHireRenderArt(){const root=document.getElementById('new-hire-art-root');if(root)root.innerHTML=newHireArtHtml()}
function newHireFit(){
  const stage=document.getElementById('new-hire-stage'),sheet=document.getElementById('new-hire-sheet');if(!stage||!sheet)return
  _newHireScale=Math.min(1,(stage.clientWidth-48)/720,(stage.clientHeight-48)/900);_newHireScale=Math.max(.28,_newHireScale);sheet.style.transform=`scale(${_newHireScale})`;sheet.style.marginBottom=`${Math.round(900*(_newHireScale-1))}px`
}
function newHireReset(){
  if(!confirm('¿Restablecer todos los campos y quitar la fotografía?'))return;_newHire={...NEW_HIRE_DEFAULTS};newHireSave();renderNewHireCreator();toast('Plantilla restablecida.')
}
function newHireFileName(format){const name=String(_newHire.name||'nuevo-colaborador').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'').toLowerCase();return`bienvenida-${name||'nuevo-colaborador'}.${format}`}
async function newHireExport(format='png'){
  if(_newHireExporting)return;if(!_newHire.name.trim()||_newHire.name===NEW_HIRE_DEFAULTS.name){toast('Escribe el nombre del colaborador antes de exportar.');return}if(!_newHire.photo){toast('Carga la fotografía del colaborador antes de exportar.');return}
  const art=document.getElementById('new-hire-art');if(!art||typeof html2canvas!=='function'){toast('No se pudo preparar la imagen. Recarga e inténtalo de nuevo.');return}
  _newHireExporting=true;const buttons=document.querySelectorAll('.new-hire-actions button');buttons.forEach(button=>button.disabled=true)
  try{await document.fonts?.ready;await Promise.all([...art.images].map(image=>image.decode().catch(()=>{})));const canvas=await html2canvas(art,{scale:1.5,useCORS:true,allowTaint:false,backgroundColor:'#ffffff',logging:false,width:720,height:900});const mime=format==='jpg'?'image/jpeg':'image/png',quality=format==='jpg' ? .94 : undefined;const blob=await new Promise((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(Error('No se pudo crear el archivo.')),mime,quality));const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=newHireFileName(format);document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);canvas.width=canvas.height=0;toast(`${format.toUpperCase()} listo para compartir.`)}catch(error){console.error(error);alert(error.message||'No se pudo exportar la bienvenida.')}finally{_newHireExporting=false;buttons.forEach(button=>button.disabled=false)}
}
window.addEventListener('resize',()=>{if(document.getElementById('new-hire-studio'))newHireFit()})
