/* SIERRA Index · Infographic builder
   Self-contained on purpose: communications data remains independent from the
   art drafts and the editor can be evolved without coupling it to memo state. */
(function(){
'use strict'

const INFO_STORE='sierra_infographics_v1'
const INFO_PRESETS={
  letter:{label:'Carta vertical',width:816,height:1056},
  landscape:{label:'Carta horizontal',width:1056,height:816},
  square:{label:'Cuadrada · 1080',width:1080,height:1080},
  story:{label:'Historia · 1080 × 1920',width:1080,height:1920},
  custom:{label:'Medida personalizada'}
}
const INFO_COLORS=['#f5f5f5','#e8f8f6','#dff4ff','#fff3c4','#f7e2ff','#ffe7d5','#e7f8d9','#0b0b0b']
const INFO_ICONS=[
  ['info','Información'],['bulb','Idea'],['shield','Seguridad'],['heart','Bienestar'],
  ['leaf','Sostenibilidad'],['check','Correcto'],['calendar','Calendario'],['users','Personas'],
  ['bell','Aviso'],['star','Destacado'],['map-pin','Ubicación'],['link','Enlace'],
  ['photo','Imagen'],['chart-pie','Indicador'],['medical-cross','Salud'],['sparkle','Novedad']
]
let infoState=null,infoDraft=null,infoSelected='header',infoSaveTimer=null,infoDragId='',infoResizeObserver=null,infoSavedAt=0

function infoId(prefix){return prefix+'-'+(crypto.randomUUID?crypto.randomUUID():Date.now()+'-'+Math.random().toString(36).slice(2))}
function infoClone(value){return JSON.parse(JSON.stringify(value))}
function infoEscape(value){return typeof esc==='function'?esc(String(value??'')):String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function infoAttr(value){return typeof escAttr==='function'?escAttr(String(value??'')):infoEscape(value)}
function infoNotify(message){if(typeof toast==='function')toast(message);else console.info(message)}
function infoStorageKey(){return INFO_STORE+':'+(typeof me!=='undefined'&&me?.id?me.id:'guest')}
function infoNow(){return new Date().toISOString()}
function infoIcon(name,size=18){return typeof siIcon==='function'?siIcon(name,size):''}
function infoInk(color){const v=String(color||'').replace('#','');if(!/^[0-9a-f]{6}$/i.test(v))return'#171717';const [r,g,b]=[0,2,4].map(i=>parseInt(v.slice(i,i+2),16)/255),lum=.2126*r+.7152*g+.0722*b;return lum>.59?'#171717':'#ffffff'}
function infoSafeUrl(value){try{const u=new URL(String(value||''));return ['http:','https:'].includes(u.protocol)&&!u.username&&!u.password?u.href:''}catch{return''}}
function infoSanitize(html){
  const doc=new DOMParser().parseFromString('<div>'+String(html||'')+'</div>','text/html'),root=doc.body.firstElementChild
  root.querySelectorAll('script,style,iframe,object,embed,form,input,button,svg,math').forEach(el=>el.remove())
  root.querySelectorAll('*').forEach(el=>{[...el.attributes].forEach(a=>{const n=a.name.toLowerCase();if(n.startsWith('on')||n==='style'||n==='class'||n==='id')el.removeAttribute(a.name);if((n==='href'||n==='src')&&!infoSafeUrl(a.value))el.removeAttribute(a.name)});if(el.tagName==='A'){el.setAttribute('target','_blank');el.setAttribute('rel','noopener noreferrer')}})
  return root.innerHTML
}
function infoBlock(type,seed={}){
  const base={id:infoId('art'),type,span:12,background:'#f5f5f5',color:'#171717',radius:18,padding:22,minHeight:0,hidden:false}
  const byType={
    text:{heading:'Un mensaje claro',html:'<p>Escribe aquí la información que quieres comunicar. Puedes usar <strong>negritas</strong>, <u>subrayado</u> y listas.</p>',span:6},
    image:{src:'',alt:'',fit:'cover',position:50,span:6,minHeight:250,padding:0},
    callout:{heading:'Información importante',html:'<p>Resume aquí una idea que deba destacar.</p>',icon:'info',plaque:'#ffffff',span:12},
    features:{heading:'Puntos clave',items:[['shield','Primer punto','Explica la idea en una frase breve.'],['bulb','Segundo punto','Usa palabras sencillas y accionables.'],['leaf','Tercer punto','Mantén una jerarquía visual clara.'],['check','Cuarto punto','Cierra con una acción concreta.']].map(([icon,title,text])=>({id:infoId('item'),icon,title,text})),span:12},
    stat:{value:'85%',heading:'Indicador principal',html:'<p>Agrega contexto para que el dato sea fácil de entender.</p>',icon:'chart-pie',plaque:'#ffffff',span:6},
    cta:{heading:'¿Listo para actuar?',html:'<p>Explica brevemente el siguiente paso.</p>',label:'Abrir enlace',url:'https://',buttonBackground:'#0b0b0b',buttonColor:'#ffffff',span:12}
  }
  return Object.assign(base,byType[type]||byType.text,seed)
}
function infoCreateDraft(seed={}){
  const now=infoNow()
  return Object.assign({
    id:infoId('infographic'),title:'Título de la infografía',subtitle:'Agrega una breve introducción que prepare al lector.',showSubtitle:true,eyebrow:'Comunicaciones SIERRA',
    preset:'letter',width:816,height:1056,background:'#ffffff',titleColor:'#0b0b0b',mutedColor:'#6b6b63',accent:'#16cdbe',gap:14,
    department:'Comunicaciones Corporativas',departmentColor:'#ff7824',createdAt:now,updatedAt:now,
    blocks:[
      infoBlock('text',{heading:'¿Qué necesitas comunicar?',html:'<p>Presenta el tema con una explicación breve, directa y fácil de recordar.</p>'}),
      infoBlock('image'),
      infoBlock('features'),
      infoBlock('callout',{heading:'Cierra con una idea memorable',html:'<p><strong>Combina texto, color e íconos</strong> para guiar la lectura sin saturar la composición.</p>'})
    ]
  },seed)
}
function infoNormalizeDraft(raw){
  const d=Object.assign(infoCreateDraft({blocks:[]}),raw||{})
  d.width=Math.min(2400,Math.max(320,Number(d.width)||816));d.height=Math.min(4000,Math.max(480,Number(d.height)||1056));d.gap=Math.min(36,Math.max(4,Number(d.gap)||14))
  d.blocks=Array.isArray(raw?.blocks)?raw.blocks.map(b=>Object.assign(infoBlock(b.type||'text',{id:b.id||infoId('art')}),b)):[]
  return d
}
function infoLoad(){
  try{const raw=JSON.parse(localStorage.getItem(infoStorageKey())||'null');if(raw&&Array.isArray(raw.designs)&&raw.designs.length){infoState={activeId:raw.activeId,designs:raw.designs.map(infoNormalizeDraft)};infoDraft=infoState.designs.find(d=>d.id===infoState.activeId)||infoState.designs[0];infoState.activeId=infoDraft.id;return}}catch{}
  infoDraft=infoCreateDraft();infoState={activeId:infoDraft.id,designs:[infoDraft]};infoPersist(true)
}
function infoPersist(silent=false){
  if(!infoDraft||!infoState)return false
  infoDraft.updatedAt=infoNow();infoState.activeId=infoDraft.id
  const i=infoState.designs.findIndex(d=>d.id===infoDraft.id);if(i<0)infoState.designs.unshift(infoDraft);else infoState.designs[i]=infoDraft
  try{localStorage.setItem(infoStorageKey(),JSON.stringify(infoState));infoSavedAt=Date.now();const el=document.getElementById('info-save-state');if(el)el.textContent='Guardado';if(!silent)infoRenderDesignSelect();return true}catch(error){const el=document.getElementById('info-save-state');if(el)el.textContent='No se pudo guardar';infoNotify('El diseño supera el espacio disponible. Reduce el tamaño de las imágenes.');return false}
}
function infoScheduleSave(){clearTimeout(infoSaveTimer);const el=document.getElementById('info-save-state');if(el)el.textContent='Guardando…';infoSaveTimer=setTimeout(()=>infoPersist(true),420)}
function infoDesignName(d){return String(d.title||'Diseño sin título').trim()||'Diseño sin título'}
function infoDesignSelectHtml(){return`<select class="control-input info-design-select" aria-label="Diseño actual" onchange="infoOpenDesign(this.value)">${infoState.designs.map(d=>`<option value="${infoAttr(d.id)}" ${d.id===infoDraft.id?'selected':''}>${infoEscape(infoDesignName(d))}</option>`).join('')}</select>`}
function infoRenderDesignSelect(){const host=document.getElementById('info-design-picker');if(host)host.innerHTML=infoDesignSelectHtml()}

window.showInfographics=function(){
  syncModule('comunicaciones');_navLeaf='comunicaciones|_|infographics';sessionStorage.setItem('sierra_route','module:comunicaciones:infographics');leaveView();renderSidebarTree();clearSecCrumbs()
  document.getElementById('tb-section').textContent='Comunicaciones';document.getElementById('product-controls').style.display='none';document.getElementById('sec-title').textContent='Creador de infografías';document.getElementById('sec-sub').textContent='Compón, organiza y exporta piezas visuales con identidad SIERRA'
  if(!infoState)infoLoad();infoSelected='header'
  const pg=document.getElementById('pg');pg.style.display='block';pg.innerHTML=`<div class="info-builder comms-ui">
    <div class="info-toolbar">
      <div class="info-toolbar-group"><span id="info-design-picker">${infoDesignSelectHtml()}</span><button class="btn btn-secondary" onclick="infoNewDesign()">${infoIcon('plus',16)} Nuevo</button><button class="icon-btn" title="Duplicar diseño" aria-label="Duplicar diseño" onclick="infoDuplicateDesign()">${infoIcon('copy',16)}</button><button class="icon-btn" title="Eliminar diseño" aria-label="Eliminar diseño" onclick="infoDeleteDesign()">${infoIcon('trash',16)}</button></div>
      <div class="info-toolbar-group"><select class="control-input" aria-label="Formato del lienzo" onchange="infoSetPreset(this.value)">${Object.entries(INFO_PRESETS).map(([key,p])=>`<option value="${key}" ${infoDraft.preset===key?'selected':''}>${p.label}</option>`).join('')}</select><button class="btn btn-secondary" onclick="infoSelect('page')">${infoIcon('settings',16)} Diseño</button></div>
      <span class="info-save-state" id="info-save-state">Guardado</span>
      <div class="info-toolbar-group"><button class="btn btn-secondary" onclick="infoExport('png')">${infoIcon('photo',16)} PNG</button><button class="btn btn-primary" onclick="infoExport('pdf')">${infoIcon('download',16)} PDF</button></div>
    </div>
    <div class="info-workspace">
      <aside class="info-panel info-library"><div class="info-panel-head"><b>Agregar contenido</b><small>Los bloques entran al final; luego puedes arrastrarlos.</small></div><div class="info-library-body">${infoLibraryHtml()}</div></aside>
      <section class="info-stage-panel"><div class="info-stage-head"><span id="info-canvas-size"></span><span id="info-zoom-label">Vista ajustada</span></div><div class="info-stage" id="info-stage"><div class="info-page-wrap" id="info-page-wrap"><div id="info-page-host"></div></div></div></section>
      <aside class="info-panel info-inspector"><div class="info-panel-head"><b>Personalizar</b><small>Cada cambio se refleja al instante.</small></div><div class="info-inspector-body" id="info-inspector"></div></aside>
    </div></div>`
  infoRenderAll();requestAnimationFrame(()=>{infoFitCanvas();if(typeof ResizeObserver!=='undefined'){infoResizeObserver?.disconnect();infoResizeObserver=new ResizeObserver(infoFitCanvas);infoResizeObserver.observe(document.getElementById('info-stage'))}})
}
function infoLibraryHtml(){
  const items=[['text','text-size','Texto','Título y texto enriquecido','#e8f8f6','#007d73'],['image','photo','Imagen','Fotografía o ilustración','#dff4ff','#006da8'],['callout','info','Destacado','Ícono y mensaje clave','#fff3c4','#827e00'],['features','columns','Tarjetas con íconos','De dos a cuatro ideas','#f7e2ff','#75009a'],['stat','chart-pie','Dato destacado','Cifra, etiqueta y contexto','#e7f8d9','#34710c'],['cta','link','Llamado a la acción','Botón, texto y enlace','#ffe7d5','#a93d00']]
  return`<div class="info-library-group"><span class="info-library-label">Módulos</span>${items.map(([type,icon,label,desc,soft,ink])=>`<button class="info-add-button" onclick="infoAddBlock('${type}')" style="--info-soft:${soft};--info-ink:${ink}"><span class="info-add-icon">${infoIcon(icon,18)}</span><span><b>${label}</b><small>${desc}</small></span></button>`).join('')}</div><div class="info-tip"><b>Layout sin complicaciones</b><br>Selecciona un bloque para cambiar su ancho. Combina ½ + ½, ⅓ + ⅔ o módulos de ancho completo.</div>`
}
function infoLogoHtml(){return typeof memoLogoHtml==='function'?memoLogoHtml():'<strong>SIERRA</strong>'}
function infoDepartmentHtml(){return typeof sierraDepartmentHtml==='function'?sierraDepartmentHtml(infoDraft.department||'Departamento',infoDraft.departmentColor):`<strong>${infoEscape(infoDraft.department)}</strong>`}
function infoPageHtml(interactive=true){
  const clickHeader=interactive?' onclick="infoSelect(\'header\')"':'' ,clickFooter=interactive?' onclick="infoSelect(\'footer\')"':''
  return`<article class="info-page" id="info-page" style="width:${infoDraft.width}px;height:${infoDraft.height}px;background:${infoAttr(infoDraft.background)};--info-title:${infoAttr(infoDraft.titleColor)};--info-muted:${infoAttr(infoDraft.mutedColor)};--info-accent:${infoAttr(infoDraft.accent)};--info-gap:${infoDraft.gap}px">
    <div class="info-page-inner">
      <header class="info-header info-clickable ${infoSelected==='header'&&interactive?'info-selected':''}"${clickHeader}>
        ${infoDraft.eyebrow?`<p class="info-eyebrow">${infoEscape(infoDraft.eyebrow)}</p>`:''}<h1 class="info-title">${infoEscape(String(infoDraft.title||'').trim()||'Título de la infografía')}</h1>${infoDraft.showSubtitle&&infoDraft.subtitle?`<p class="info-subtitle">${infoEscape(infoDraft.subtitle)}</p>`:''}
      </header>
      <main class="info-grid">${infoDraft.blocks.filter(b=>!b.hidden).map(b=>infoBlockHtml(b,interactive)).join('')}</main>
      <footer class="info-footer info-clickable ${infoSelected==='footer'&&interactive?'info-selected':''}"${clickFooter}>${infoDepartmentHtml()}${infoLogoHtml()}</footer>
    </div>
  </article>`
}
function infoBlockHtml(b,interactive){
  const drag=interactive?` draggable="true" onclick="infoSelect('${b.id}')" ondragstart="infoDragStart(event,'${b.id}')" ondragover="infoDragOver(event,'${b.id}')" ondragleave="this.classList.remove('info-drop-target')" ondrop="infoDrop(event,'${b.id}')" ondragend="infoDragEnd()"`:''
  const common=`class="info-block-shell info-clickable ${infoSelected===b.id&&interactive?'info-selected':''}" data-info-block="${infoAttr(b.id)}" style="--info-span:${Math.min(12,Math.max(4,Number(b.span)||12))};--info-radius:${Math.max(0,Number(b.radius)||0)}px;--info-min-height:${Math.max(0,Number(b.minHeight)||0)}px"${drag}`
  const style=`--info-card-bg:${infoAttr(b.background)};--info-card-ink:${infoAttr(b.color)};--info-padding:${Math.max(0,Number(b.padding)||0)}px`
  let body=''
  if(b.type==='image')body=`<div class="info-block info-image-block" style="${style};--info-image-fit:${b.fit==='contain'?'contain':'cover'};--info-image-position:${Math.min(100,Math.max(0,Number(b.position)||50))}% 50%">${b.src?`<img src="${infoAttr(b.src)}" alt="${infoAttr(b.alt||'Imagen de la infografía')}">`:`<div class="info-image-placeholder"><span>${infoIcon('photo',34)}<b>Agrega una imagen</b></span></div>`}</div>`
  else if(b.type==='features'){const cols=Math.min(4,Math.max(2,b.items?.length||2));body=`<section class="info-block" style="${style}"><h2>${infoEscape(b.heading)}</h2><div class="info-feature-grid" style="--info-feature-cols:${cols}">${(b.items||[]).map(item=>`<article class="info-feature-item"><span class="info-icon-plaque" style="--info-plaque:${infoAttr(item.plaque||'#ffffff')}">${infoIcon(item.icon||'check',21)}</span><h3>${infoEscape(item.title)}</h3><p>${infoEscape(item.text)}</p></article>`).join('')}</div></section>`}
  else if(b.type==='callout')body=`<section class="info-block info-callout-layout" style="${style}"><span class="info-icon-plaque" style="--info-plaque:${infoAttr(b.plaque||'#ffffff')}">${infoIcon(b.icon||'info',24)}</span><div><h2>${infoEscape(b.heading)}</h2><div class="info-rich-output" data-info-output="${infoAttr(b.id)}">${infoSanitize(b.html)}</div></div></section>`
  else if(b.type==='stat')body=`<section class="info-block info-stat-block" style="${style}"><span class="info-icon-plaque" style="--info-plaque:${infoAttr(b.plaque||'#ffffff')}">${infoIcon(b.icon||'chart-pie',25)}</span><div><div class="info-stat-value">${infoEscape(b.value)}</div><h3 class="info-stat-label">${infoEscape(b.heading)}</h3><div class="info-rich-output" data-info-output="${infoAttr(b.id)}">${infoSanitize(b.html)}</div></div></section>`
  else if(b.type==='cta'){const href=infoSafeUrl(b.url);body=`<section class="info-block info-cta-block" style="${style};--info-button-bg:${infoAttr(b.buttonBackground||'#0b0b0b')};--info-button-ink:${infoAttr(b.buttonColor||'#ffffff')}"><div class="info-cta-copy"><h2>${infoEscape(b.heading)}</h2><div class="info-rich-output" data-info-output="${infoAttr(b.id)}">${infoSanitize(b.html)}</div>${b.url?`<span class="info-cta-url">${infoEscape(b.url)}</span>`:''}</div><a class="info-cta-link" href="${infoAttr(href||'#')}" ${interactive?'onclick="event.preventDefault()"':'target="_blank" rel="noopener noreferrer"'}>${infoEscape(b.label||'Abrir enlace')}</a></section>`}
  else body=`<section class="info-block" style="${style}"><h2>${infoEscape(b.heading)}</h2><div class="info-rich-output" data-info-output="${infoAttr(b.id)}">${infoSanitize(b.html)}</div></section>`
  return`<div ${common}>${body}</div>`
}
function infoRenderAll(){infoRenderCanvas();infoRenderInspector();infoRenderDesignSelect()}
function infoRenderCanvas(){const host=document.getElementById('info-page-host');if(!host||!infoDraft)return;host.innerHTML=infoPageHtml(true);const size=document.getElementById('info-canvas-size');if(size)size.textContent=`${Math.round(infoDraft.width)} × ${Math.round(infoDraft.height)} px`;requestAnimationFrame(()=>{infoFitCanvas();infoCheckOverflow()})}
function infoCheckOverflow(){const page=document.getElementById('info-page'),inner=page?.querySelector('.info-page-inner');if(!page||!inner)return;page.querySelector('.info-overflow-warning')?.remove();if(inner.scrollHeight>page.clientHeight+2){const warning=document.createElement('span');warning.className='info-overflow-warning';warning.textContent='El contenido excede el lienzo';page.appendChild(warning)}}
function infoFitCanvas(){const stage=document.getElementById('info-stage'),wrap=document.getElementById('info-page-wrap'),page=document.getElementById('info-page');if(!stage||!wrap||!page)return;const scale=Math.min(1,Math.max(.12,(stage.clientWidth-50)/infoDraft.width));wrap.style.width=Math.ceil(infoDraft.width*scale)+'px';wrap.style.height=Math.ceil(infoDraft.height*scale)+'px';page.style.transform=`scale(${scale})`;page.style.transformOrigin='top left';const label=document.getElementById('info-zoom-label');if(label)label.textContent=`${Math.round(scale*100)}% · vista ajustada`}

window.infoSelect=function(id){infoSelected=id;infoRenderCanvas();infoRenderInspector()}
function infoSelectedBlock(){return infoDraft.blocks.find(b=>b.id===infoSelected)}
function infoField(label,control){return`<label class="info-field"><span>${label}</span>${control}</label>`}
function infoInput(label,key,value,type='text',extra=''){return infoField(label,`<input class="control-input" type="${type}" value="${infoAttr(value)}" ${extra} oninput="infoSetBlock('${infoSelected}','${key}',this.value)">`)}
function infoIconOptions(value){return INFO_ICONS.map(([key,label])=>`<option value="${key}" ${value===key?'selected':''}>${label}</option>`).join('')}
function infoPaletteHtml(b){return`<div class="info-palette">${INFO_COLORS.map(c=>`<button class="info-swatch" type="button" style="background:${c}" aria-label="Usar color ${c}" aria-pressed="${String(b.background).toLowerCase()===c}" onclick="infoSetBlock('${b.id}','background','${c}')"></button>`).join('')}</div>`}
function infoCommonInspector(b){return`<section class="info-inspector-section"><span class="info-section-title">Distribución</span><div class="info-segmented">${[[4,'⅓'],[6,'½'],[12,'Completo']].map(([span,label])=>`<button type="button" aria-pressed="${b.span===span}" onclick="infoSetBlock('${b.id}','span',${span})">${label}</button>`).join('')}</div><div class="info-field-row">${infoField('Alto mínimo',`<select class="control-input" onchange="infoSetBlock('${b.id}','minHeight',Number(this.value))">${[[0,'Automático'],[160,'Compacto'],[240,'Medio'],[330,'Alto']].map(([v,l])=>`<option value="${v}" ${Number(b.minHeight)===v?'selected':''}>${l}</option>`).join('')}</select>`)}${infoField('Esquinas',`<input class="control-input" type="number" min="0" max="48" value="${Number(b.radius)||0}" oninput="infoSetBlock('${b.id}','radius',Number(this.value))">`)}</div><div class="info-field-row">${infoField('Color de tarjeta',`<input type="color" value="${infoAttr(b.background)}" oninput="infoSetBlock('${b.id}','background',this.value)">`)}${infoField('Color de texto',`<input type="color" value="${infoAttr(b.color)}" oninput="infoSetBlock('${b.id}','color',this.value)">`)}</div>${infoPaletteHtml(b)}${b.type!=='image'?infoField('Espacio interior',`<input class="control-input" type="range" min="8" max="54" value="${Number(b.padding)||22}" oninput="infoSetBlock('${b.id}','padding',Number(this.value))">`):''}</section><section class="info-inspector-section"><span class="info-section-title">Orden</span><div class="info-inspector-actions"><button class="btn btn-secondary" onclick="infoMoveBlock('${b.id}',-1)">${infoIcon('arrow-up',15)} Subir</button><button class="btn btn-secondary" onclick="infoMoveBlock('${b.id}',1)">${infoIcon('arrow-down',15)} Bajar</button><button class="btn btn-secondary" onclick="infoDuplicateBlock('${b.id}')">${infoIcon('copy',15)} Duplicar</button><button class="btn btn-ghost" onclick="infoDeleteBlock('${b.id}')">${infoIcon('trash',15)} Eliminar</button></div></section>`}
function infoRichEditor(b){return`<div><div class="info-rich-toolbar" role="toolbar" aria-label="Formato del texto"><button type="button" title="Negrita" onclick="infoRichCommand('${b.id}','bold')">B</button><button type="button" title="Cursiva" onclick="infoRichCommand('${b.id}','italic')"><i>I</i></button><button type="button" title="Subrayado" onclick="infoRichCommand('${b.id}','underline')"><u>U</u></button><button type="button" title="Lista con viñetas" onclick="infoRichCommand('${b.id}','insertUnorderedList')">•</button><button type="button" title="Lista numerada" onclick="infoRichCommand('${b.id}','insertOrderedList')">1.</button></div><div class="info-rich-editor" contenteditable="true" data-info-rich="${infoAttr(b.id)}" role="textbox" aria-multiline="true" oninput="infoRichInput('${b.id}',this)">${infoSanitize(b.html)}</div></div>`}
function infoContentInspector(b){
  if(b.type==='image')return`<section class="info-inspector-section"><span class="info-section-title">Imagen</span>${b.src?`<img class="info-upload-thumb" src="${infoAttr(b.src)}" alt="">`:''}<label class="info-upload">${infoIcon('upload',16)} ${b.src?'Cambiar imagen':'Elegir imagen'}<input type="file" accept="image/*" onchange="infoUploadImage('${b.id}',this)"></label>${b.src?`<button class="btn btn-ghost" onclick="infoSetBlock('${b.id}','src','')">${infoIcon('trash',15)} Quitar imagen</button>`:''}${infoInput('Descripción accesible','alt',b.alt)}<div class="info-field-row">${infoField('Ajuste',`<select class="control-input" onchange="infoSetBlock('${b.id}','fit',this.value)"><option value="cover" ${b.fit==='cover'?'selected':''}>Rellenar</option><option value="contain" ${b.fit==='contain'?'selected':''}>Mostrar completa</option></select>`)}${infoField('Posición',`<input class="control-input" type="range" min="0" max="100" value="${Number(b.position)||50}" oninput="infoSetBlock('${b.id}','position',Number(this.value))">`)}</div></section>`
  if(b.type==='features')return`<section class="info-inspector-section"><span class="info-section-title">Contenido</span>${infoInput('Título','heading',b.heading)}<div class="info-feature-editors">${(b.items||[]).map((item,i)=>`<div class="info-item-editor"><div class="info-item-head"><b>Tarjeta ${i+1}</b><button class="icon-btn" aria-label="Eliminar tarjeta ${i+1}" ${b.items.length<=2?'disabled':''} onclick="infoFeatureRemove('${b.id}','${item.id}')">${infoIcon('trash',14)}</button></div><div class="info-item-grid"><select class="control-input" aria-label="Ícono" onchange="infoFeatureSet('${b.id}','${item.id}','icon',this.value)">${infoIconOptions(item.icon)}</select><input class="control-input" aria-label="Título" value="${infoAttr(item.title)}" oninput="infoFeatureSet('${b.id}','${item.id}','title',this.value)"></div><textarea class="control-input" rows="2" aria-label="Descripción" oninput="infoFeatureSet('${b.id}','${item.id}','text',this.value)">${infoEscape(item.text)}</textarea></div>`).join('')}</div>${b.items.length<4?`<button class="btn btn-secondary" onclick="infoFeatureAdd('${b.id}')">${infoIcon('plus',15)} Agregar tarjeta</button>`:''}</section>`
  let fields=`<section class="info-inspector-section"><span class="info-section-title">Contenido</span>`
  if(b.type==='stat')fields+=infoInput('Dato o cifra','value',b.value)
  fields+=infoInput('Título','heading',b.heading)
  if(['callout','stat'].includes(b.type))fields+=infoField('Ícono',`<select class="control-input" onchange="infoSetBlock('${b.id}','icon',this.value)">${infoIconOptions(b.icon)}</select>`)
  fields+=infoField('Texto',infoRichEditor(b))
  if(b.type==='cta')fields+=infoInput('Texto del botón','label',b.label)+infoInput('Enlace visible','url',b.url,'url')+`<div class="info-field-row">${infoField('Color del botón',`<input type="color" value="${infoAttr(b.buttonBackground)}" oninput="infoSetBlock('${b.id}','buttonBackground',this.value)">`)}${infoField('Texto del botón',`<input type="color" value="${infoAttr(b.buttonColor)}" oninput="infoSetBlock('${b.id}','buttonColor',this.value)">`)}</div>`
  return fields+'</section>'
}
function infoRenderInspector(){
  const host=document.getElementById('info-inspector');if(!host||!infoDraft)return
  if(infoSelected==='header'){host.innerHTML=`<section class="info-inspector-section"><span class="info-section-title">Encabezado</span>${infoField('Antetítulo',`<input class="control-input" value="${infoAttr(infoDraft.eyebrow)}" placeholder="Opcional" oninput="infoSetMeta('eyebrow',this.value)">`)}${infoField('Título obligatorio',`<textarea class="control-input" rows="3" required oninput="infoSetMeta('title',this.value)">${infoEscape(infoDraft.title)}</textarea>`)}<label class="info-field"><span><input type="checkbox" ${infoDraft.showSubtitle?'checked':''} onchange="infoSetMeta('showSubtitle',this.checked,true)"> Mostrar subtítulo</span>${infoDraft.showSubtitle?`<textarea class="control-input" rows="3" oninput="infoSetMeta('subtitle',this.value)">${infoEscape(infoDraft.subtitle)}</textarea>`:''}</label></section><section class="info-inspector-section"><span class="info-section-title">Color</span><div class="info-field-row">${infoField('Título',`<input type="color" value="${infoAttr(infoDraft.titleColor)}" oninput="infoSetMeta('titleColor',this.value)">`)}${infoField('Texto secundario',`<input type="color" value="${infoAttr(infoDraft.mutedColor)}" oninput="infoSetMeta('mutedColor',this.value)">`)}</div></section>`;return}
  if(infoSelected==='footer'){host.innerHTML=`<section class="info-inspector-section"><span class="info-section-title">Pie de arte</span>${infoField('Departamento',`<input class="control-input" value="${infoAttr(infoDraft.department)}" oninput="infoSetMeta('department',this.value)">`)}${infoField('Color del departamento',`<input type="color" value="${infoAttr(infoDraft.departmentColor)}" oninput="infoSetMeta('departmentColor',this.value)">`)}<div class="info-tip">El identificador del departamento y el logotipo SIERRA permanecen en el pie para conservar la firma corporativa.</div></section>`;return}
  if(infoSelected==='page'){host.innerHTML=`<section class="info-inspector-section"><span class="info-section-title">Lienzo</span>${infoField('Formato',`<select class="control-input" onchange="infoSetPreset(this.value)">${Object.entries(INFO_PRESETS).map(([key,p])=>`<option value="${key}" ${infoDraft.preset===key?'selected':''}>${p.label}</option>`).join('')}</select>`)}<div class="info-field-row">${infoField('Ancho px',`<input class="control-input" type="number" min="320" max="2400" value="${infoDraft.width}" oninput="infoSetDimension('width',this.value)">`)}${infoField('Alto px',`<input class="control-input" type="number" min="480" max="4000" value="${infoDraft.height}" oninput="infoSetDimension('height',this.value)">`)}</div><div class="info-field-row">${infoField('Fondo',`<input type="color" value="${infoAttr(infoDraft.background)}" oninput="infoSetMeta('background',this.value)">`)}${infoField('Acento',`<input type="color" value="${infoAttr(infoDraft.accent)}" oninput="infoSetMeta('accent',this.value)">`)}</div>${infoField('Separación entre módulos',`<input class="control-input" type="range" min="4" max="36" value="${infoDraft.gap}" oninput="infoSetMeta('gap',Number(this.value))">`)}</section><section class="info-inspector-section"><span class="info-section-title">Guía de layout</span><div class="info-tip">Usa anchos que sumen 12: ½ + ½, ⅓ + ⅔ o una pieza completa. Arrastra los módulos directamente sobre el arte para reordenarlos.</div></section>`;return}
  const b=infoSelectedBlock();if(!b){host.innerHTML='<div class="info-empty-inspector">Selecciona el título, el pie o una tarjeta del arte para personalizarla.</div>';return}
  host.innerHTML=infoContentInspector(b)+infoCommonInspector(b)
}

window.infoSetMeta=function(key,value,rerenderInspector=false){if(!infoDraft)return;infoDraft[key]=value;infoRenderCanvas();if(rerenderInspector)infoRenderInspector();infoScheduleSave()}
window.infoSetBlock=function(id,key,value){const b=infoDraft.blocks.find(x=>x.id===id);if(!b)return;b[key]=value;infoRenderCanvas();infoScheduleSave()}
window.infoSetPreset=function(key){const p=INFO_PRESETS[key];if(!p)return;infoDraft.preset=key;if(key!=='custom'){infoDraft.width=p.width;infoDraft.height=p.height}infoSelected='page';infoRenderAll();infoScheduleSave()}
window.infoSetDimension=function(key,value){const range=key==='width'?[320,2400]:[480,4000];infoDraft[key]=Math.min(range[1],Math.max(range[0],Number(value)||range[0]));infoDraft.preset='custom';infoRenderCanvas();infoScheduleSave()}
window.infoAddBlock=function(type){const b=infoBlock(type);infoDraft.blocks.push(b);infoSelected=b.id;infoRenderAll();infoScheduleSave();requestAnimationFrame(()=>document.querySelector(`[data-info-block="${b.id}"]`)?.scrollIntoView({behavior:'smooth',block:'center'}))}
window.infoMoveBlock=function(id,delta){const i=infoDraft.blocks.findIndex(b=>b.id===id),j=i+Number(delta);if(i<0||j<0||j>=infoDraft.blocks.length)return;[infoDraft.blocks[i],infoDraft.blocks[j]]=[infoDraft.blocks[j],infoDraft.blocks[i]];infoRenderCanvas();infoScheduleSave()}
window.infoDuplicateBlock=function(id){const i=infoDraft.blocks.findIndex(b=>b.id===id);if(i<0)return;const copy=infoClone(infoDraft.blocks[i]);copy.id=infoId('art');if(copy.items)copy.items.forEach(item=>item.id=infoId('item'));infoDraft.blocks.splice(i+1,0,copy);infoSelected=copy.id;infoRenderAll();infoScheduleSave()}
window.infoDeleteBlock=function(id){const remove=()=>{infoDraft.blocks=infoDraft.blocks.filter(b=>b.id!==id);infoSelected=infoDraft.blocks[0]?.id||'header';infoRenderAll();infoScheduleSave()};if(typeof commsConfirm==='function')commsConfirm('Eliminar módulo','Se retirará este módulo del arte.',remove);else if(confirm('¿Eliminar este módulo?'))remove()}
window.infoRichCommand=function(id,command){const editor=document.querySelector(`[data-info-rich="${id}"]`);if(!editor)return;editor.focus();document.execCommand(command,false,null);window.infoRichInput(id,editor)}
window.infoRichInput=function(id,editor){const b=infoDraft.blocks.find(x=>x.id===id);if(!b)return;b.html=infoSanitize(editor.innerHTML);document.querySelectorAll(`[data-info-output="${id}"]`).forEach(el=>el.innerHTML=b.html);infoScheduleSave()}
window.infoFeatureSet=function(blockId,itemId,key,value){const item=infoDraft.blocks.find(b=>b.id===blockId)?.items?.find(x=>x.id===itemId);if(!item)return;item[key]=value;infoRenderCanvas();infoScheduleSave()}
window.infoFeatureAdd=function(id){const b=infoDraft.blocks.find(x=>x.id===id);if(!b||b.items.length>=4)return;b.items.push({id:infoId('item'),icon:'check',title:'Nuevo punto',text:'Agrega una explicación breve.'});infoRenderAll();infoScheduleSave()}
window.infoFeatureRemove=function(id,itemId){const b=infoDraft.blocks.find(x=>x.id===id);if(!b||b.items.length<=2)return;b.items=b.items.filter(x=>x.id!==itemId);infoRenderAll();infoScheduleSave()}
function infoReadImage(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onerror=reject;reader.onload=()=>{const img=new Image();img.onerror=reject;img.onload=()=>{const max=1800,scale=Math.min(1,max/Math.max(img.width,img.height)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.width*scale));canvas.height=Math.max(1,Math.round(img.height*scale));canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);resolve(canvas.toDataURL(file.type==='image/png'?'image/png':'image/jpeg',.88))};img.src=reader.result};reader.readAsDataURL(file)})}
window.infoUploadImage=async function(id,input){const file=input.files?.[0];if(!file)return;if(!file.type.startsWith('image/')){infoNotify('Elige un archivo de imagen.');return}try{const src=await infoReadImage(file),b=infoDraft.blocks.find(x=>x.id===id);if(!b)return;b.src=src;b.alt=b.alt||file.name.replace(/\.[^.]+$/,'');infoRenderAll();infoPersist(true)}catch{infoNotify('No se pudo preparar la imagen. Intenta con otro archivo.')}finally{input.value=''}}

window.infoDragStart=function(event,id){infoDragId=id;event.dataTransfer.effectAllowed='move';event.dataTransfer.setData('text/plain',id);event.currentTarget.classList.add('info-dragging')}
window.infoDragOver=function(event,id){event.preventDefault();event.dataTransfer.dropEffect='move';document.querySelectorAll('.info-drop-target').forEach(el=>el.classList.remove('info-drop-target'));if(id!==infoDragId)event.currentTarget.classList.add('info-drop-target')}
window.infoDrop=function(event,targetId){event.preventDefault();event.stopPropagation();const source=infoDragId||event.dataTransfer.getData('text/plain'),from=infoDraft.blocks.findIndex(b=>b.id===source),to=infoDraft.blocks.findIndex(b=>b.id===targetId);if(from<0||to<0||from===to){window.infoDragEnd();return}const [moved]=infoDraft.blocks.splice(from,1);infoDraft.blocks.splice(from<to?to-1:to,0,moved);infoSelected=moved.id;window.infoDragEnd();infoRenderAll();infoScheduleSave()}
window.infoDragEnd=function(){infoDragId='';document.querySelectorAll('.info-dragging,.info-drop-target').forEach(el=>el.classList.remove('info-dragging','info-drop-target'))}

window.infoNewDesign=function(){const d=infoCreateDraft({title:'Nueva infografía',blocks:[infoBlock('text'),infoBlock('image'),infoBlock('callout')]});infoState.designs.unshift(d);infoState.activeId=d.id;infoDraft=d;infoSelected='header';infoRenderAll();infoPersist(true)}
window.infoDuplicateDesign=function(){const d=infoClone(infoDraft);d.id=infoId('infographic');d.title=(infoDesignName(infoDraft)+' · copia').slice(0,140);d.createdAt=infoNow();d.updatedAt=d.createdAt;d.blocks.forEach(b=>{b.id=infoId('art');b.items?.forEach(item=>item.id=infoId('item'))});infoState.designs.unshift(d);infoState.activeId=d.id;infoDraft=d;infoSelected='header';infoRenderAll();infoPersist(true)}
window.infoOpenDesign=function(id){const d=infoState.designs.find(x=>x.id===id);if(!d)return;infoPersist(true);infoDraft=d;infoState.activeId=id;infoSelected='header';infoRenderAll()}
window.infoDeleteDesign=function(){if(infoState.designs.length===1){infoNotify('Conserva al menos un diseño.');return}const remove=()=>{infoState.designs=infoState.designs.filter(d=>d.id!==infoDraft.id);infoDraft=infoState.designs[0];infoState.activeId=infoDraft.id;infoSelected='header';infoRenderAll();infoPersist(true)};if(typeof commsConfirm==='function')commsConfirm('Eliminar diseño',`Se eliminará «${infoDesignName(infoDraft)}» de este navegador.`,remove);else if(confirm('¿Eliminar este diseño?'))remove()}

function infoFilename(ext){const base=infoDesignName(infoDraft).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'').toLowerCase()||'infografia-sierra';return base+'.'+ext}
async function infoCapture(){
  if(typeof html2canvas!=='function')throw Error('El generador de imágenes no está disponible.')
  const host=document.createElement('div');host.className='info-export-host';host.innerHTML=infoPageHtml(false);document.body.appendChild(host);const page=host.querySelector('.info-page');page.style.transform='none';page.style.margin='0';page.querySelector('.info-overflow-warning')?.remove()
  try{await document.fonts?.ready;await Promise.all([...page.querySelectorAll('img')].map(img=>img.complete?Promise.resolve():new Promise(resolve=>{img.onload=img.onerror=resolve})));const inner=page.querySelector('.info-page-inner');if(inner.scrollHeight>page.clientHeight+2)throw Error('El contenido excede el lienzo. Ajusta el alto o reduce los módulos antes de exportar.');return await html2canvas(page,{scale:2,useCORS:true,allowTaint:false,backgroundColor:infoDraft.background,logging:false,width:infoDraft.width,height:infoDraft.height,windowWidth:infoDraft.width,windowHeight:infoDraft.height,scrollX:0,scrollY:0})}finally{host.remove()}
}
window.infoExport=async function(format){
  if(!String(infoDraft.title||'').trim()){infoSelected='header';infoRenderAll();infoNotify('Escribe el título antes de exportar.');return}
  if(!String(infoDraft.department||'').trim()){infoSelected='footer';infoRenderAll();infoNotify('Escribe el departamento del pie antes de exportar.');return}
  const buttons=[...document.querySelectorAll('.info-toolbar button')];buttons.forEach(b=>b.disabled=true);const state=document.getElementById('info-save-state');if(state)state.textContent='Preparando archivo…'
  try{infoPersist(true);const canvas=await infoCapture();if(format==='png'){const a=document.createElement('a');a.download=infoFilename('png');a.href=canvas.toDataURL('image/png');a.click()}else{if(!window.jspdf?.jsPDF)throw Error('El generador de PDF no está disponible.');const w=infoDraft.width/96*25.4,h=infoDraft.height/96*25.4,pdf=new window.jspdf.jsPDF({orientation:w>h?'landscape':'portrait',unit:'mm',format:[w,h],compress:true});pdf.setProperties({title:infoDesignName(infoDraft),creator:'SIERRA Index'});pdf.addImage(canvas.toDataURL('image/jpeg',.96),'JPEG',0,0,w,h,undefined,'FAST');pdf.save(infoFilename('pdf'))}infoNotify(format==='png'?'PNG descargado.':'PDF descargado.')}catch(error){infoNotify(error?.message||'No se pudo exportar el arte.')}finally{buttons.forEach(b=>b.disabled=false);if(state)state.textContent='Guardado'}
}

document.addEventListener('keydown',event=>{if(_navLeaf!=='comunicaciones|_|infographics')return;if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='s'){event.preventDefault();infoPersist(true);infoNotify('Diseño guardado.');return}if(event.target.closest('input,textarea,[contenteditable="true"],select'))return;const b=infoSelectedBlock();if(!b)return;if(event.key==='Delete'||event.key==='Backspace'){event.preventDefault();window.infoDeleteBlock(b.id)}else if(event.altKey&&event.key==='ArrowUp'){event.preventDefault();window.infoMoveBlock(b.id,-1)}else if(event.altKey&&event.key==='ArrowDown'){event.preventDefault();window.infoMoveBlock(b.id,1)}})
})()
