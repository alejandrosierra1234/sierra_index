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
const INFO_COLOR_FAMILIES=[
  {id:'teal',name:'Turquesa SIERRA',light:'#cffffb',base:'#16cdbe',dark:'#007d73'},
  {id:'olive',name:'Oliva',light:'#efefaf',base:'#c4c412',dark:'#827e00'},
  {id:'green',name:'Verde',light:'#d1ffbe',base:'#3ed600',dark:'#2a9200'},
  {id:'blue',name:'Azul',light:'#c5e9ff',base:'#009fff',dark:'#004a86'},
  {id:'purple',name:'Morado',light:'#f6d8ff',base:'#9e00cb',dark:'#670084'},
  {id:'yellow',name:'Amarillo',light:'#fff0af',base:'#ffc529',dark:'#bb9800'},
  {id:'orange',name:'Naranja',light:'#ffe3d2',base:'#ff7824',dark:'#cd4f00'},
  {id:'red',name:'Rojo',light:'#ffc7c7',base:'#e80000',dark:'#b40b0b'}
]
const INFO_ITEM_FAMILIES=['teal','olive','green','purple']
const INFO_LEGACY_COLOR_MAP={
  '#e8f8f6':'#cffffb','#d9f7f3':'#cffffb','#dff4ff':'#c5e9ff','#fff3c4':'#efefaf',
  '#fff0b8':'#efefaf','#f7e2ff':'#f6d8ff','#f3dcff':'#f6d8ff','#ffe7d5':'#ffe3d2',
  '#e7f8d9':'#d1ffbe','#006da8':'#004a86','#75009a':'#670084','#34710c':'#2a9200',
  '#a93d00':'#cd4f00','#6b6b63':'#6b6b73','#171717':'#0b0b0b'
}
const INFO_ICONS=[
  ['info','Información'],['bulb','Idea'],['shield','Seguridad'],['heart','Bienestar'],
  ['leaf','Sostenibilidad'],['check','Correcto'],['calendar','Calendario'],['users','Personas'],
  ['bell','Aviso'],['star','Destacado'],['map-pin','Ubicación'],['link','Enlace'],
  ['photo','Imagen'],['chart-pie','Indicador'],['medical-cross','Salud'],['sparkle','Novedad']
]
const INFO_ICON_CATEGORIES=[
  ['recommended','Recomendados',[]],['all','Todos',[]],
  ['people','Personas',['user','users','man','woman','baby','face','mood','friends','heart','hand']],
  ['communication','Comunicación',['message','mail','phone','bell','speaker','microphone','broadcast','send','share','news']],
  ['safety','Seguridad',['shield','lock','key','alert','fire','helmet','traffic','eye','fingerprint','emergency']],
  ['health','Salud',['medical','heart','first-aid','stethoscope','pill','vaccine','ambulance','activity','health']],
  ['nature','Naturaleza',['leaf','plant','tree','flower','sun','moon','cloud','droplet','recycle','world']],
  ['data','Datos',['chart','graph','database','table','report','calculator','percentage','timeline','presentation']],
  ['objects','Objetos',['tool','device','building','car','truck','plane','home','box','package','camera']]
]
const INFO_ICON_ALIASES={persona:'user',personas:'users',equipo:'users',mensaje:'message',correo:'mail',telefono:'phone',aviso:'bell',seguridad:'shield',candado:'lock',llave:'key',alerta:'alert',fuego:'fire',salud:'medical',medicina:'pill',hospital:'medical',naturaleza:'leaf',planta:'plant',arbol:'tree',agua:'droplet',reciclaje:'recycle',mundo:'world',datos:'chart',grafica:'chart',reporte:'report',calculadora:'calculator',casa:'home',edificio:'building',vehiculo:'car',camion:'truck',avion:'plane',foto:'photo',imagen:'photo'}
let infoState=null,infoDraft=null,infoSelected='header',infoSaveTimer=null,infoDragId='',infoResizeObserver=null,infoSavedAt=0,infoIconCatalog=null,infoIconCatalogPromise=null,infoIconPickerState=null

function infoId(prefix){return prefix+'-'+(crypto.randomUUID?crypto.randomUUID():Date.now()+'-'+Math.random().toString(36).slice(2))}
function infoClone(value){return JSON.parse(JSON.stringify(value))}
function infoEscape(value){return typeof esc==='function'?esc(String(value??'')):String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function infoAttr(value){return typeof escAttr==='function'?escAttr(String(value??'')):infoEscape(value)}
function infoNotify(message){if(typeof toast==='function')toast(message);else console.info(message)}
function infoStorageKey(){return INFO_STORE+':'+(typeof me!=='undefined'&&me?.id?me.id:'guest')}
function infoNow(){return new Date().toISOString()}
function infoIcon(name,size=18){
  const shared=typeof siIcon==='function'?siIcon(name,size):'';if(shared)return shared
  const nodes=infoIconCatalog?.[name];if(!Array.isArray(nodes))return''
  const body=nodes.map(([tag,attrs])=>{if(!['path','circle','rect','line','polyline','polygon','ellipse'].includes(tag))return'';const values=Object.entries(attrs||{}).map(([key,value])=>`${infoAttr(key)}="${infoAttr(value)}"`).join(' ');return`<${tag}${values?' '+values:''}></${tag}>`}).join('')
  return`<svg class="si-icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`
}
function infoEnsureIconCatalog(){
  if(infoIconCatalog)return Promise.resolve(infoIconCatalog)
  if(!infoIconCatalogPromise)infoIconCatalogPromise=fetch('data/infographic-icons.json').then(response=>{if(!response.ok)throw Error('No se pudo cargar la biblioteca de iconos.');return response.json()}).then(catalog=>{infoIconCatalog=catalog;document.querySelectorAll('[data-info-icon-count]').forEach(el=>el.textContent=`${Object.keys(catalog).length.toLocaleString('es-GT')} iconos`);document.querySelectorAll('[data-info-icon-preview]').forEach(el=>el.innerHTML=infoIcon(el.dataset.infoIconPreview,23)||infoIcon('sparkle',23));if(document.getElementById('info-page-host'))infoRenderCanvas();return catalog}).catch(error=>{infoIconCatalogPromise=null;throw error})
  return infoIconCatalogPromise
}
function infoInk(color){const v=String(color||'').replace('#','');if(!/^[0-9a-f]{6}$/i.test(v))return'#0b0b0b';const [r,g,b]=[0,2,4].map(i=>parseInt(v.slice(i,i+2),16)/255),lum=.2126*r+.7152*g+.0722*b;return lum>.59?'#0b0b0b':'#ffffff'}
function infoSierraColor(value){const color=String(value||'').toLowerCase();return INFO_LEGACY_COLOR_MAP[color]||value}
function infoFamily(id){return INFO_COLOR_FAMILIES.find(family=>family.id===id)||INFO_COLOR_FAMILIES[0]}
function infoColorDistance(a,b){const parse=value=>{const v=String(value||'').replace('#','');return/^[0-9a-f]{6}$/i.test(v)?[0,2,4].map(i=>parseInt(v.slice(i,i+2),16)):null},x=parse(a),y=parse(b);return!x||!y?Infinity:x.reduce((sum,value,index)=>sum+(value-y[index])**2,0)}
function infoNearestFamily(...values){const colors=values.map(infoSierraColor).filter(value=>/^#[0-9a-f]{6}$/i.test(value||''));if(!colors.length)return'teal';return INFO_COLOR_FAMILIES.reduce((best,family)=>{const distance=Math.min(...colors.flatMap(color=>[family.light,family.base,family.dark].map(shade=>infoColorDistance(color,shade))));return distance<best.distance?{id:family.id,distance}:best},{id:'teal',distance:Infinity}).id}
function infoSafeUrl(value){try{const u=new URL(String(value||''));return ['http:','https:'].includes(u.protocol)&&!u.username&&!u.password?u.href:''}catch{return''}}
function infoSanitize(html){
  const doc=new DOMParser().parseFromString('<div>'+String(html||'')+'</div>','text/html'),root=doc.body.firstElementChild
  root.querySelectorAll('script,style,iframe,object,embed,form,input,button,svg,math').forEach(el=>el.remove())
  root.querySelectorAll('*').forEach(el=>{[...el.attributes].forEach(a=>{const n=a.name.toLowerCase();if(n.startsWith('on')||n==='style'||n==='class'||n==='id')el.removeAttribute(a.name);if((n==='href'||n==='src')&&!infoSafeUrl(a.value))el.removeAttribute(a.name)});if(el.tagName==='A'){el.setAttribute('target','_blank');el.setAttribute('rel','noopener noreferrer')}})
  return root.innerHTML
}
function infoBlock(type,seed={}){
  const base={id:infoId('art'),type,span:12,colorFamily:'teal',heightMode:'content',hidden:false}
  const byType={
    text:{heading:'Un mensaje claro',html:'<p>Escribe aquí la información que quieres comunicar. Puedes usar <strong>negritas</strong>, <u>subrayado</u> y listas.</p>',span:6},
    image:{src:'',alt:'',fit:'cover',position:50,span:6,colorFamily:'blue',heightMode:'fill'},
    callout:{heading:'Información importante',html:'<p>Resume aquí una idea que deba destacar.</p>',icon:'info',colorFamily:'olive',span:12},
    features:{heading:'Puntos clave',items:[['shield','Primer punto','Explica la idea en una frase breve.'],['bulb','Segundo punto','Usa palabras sencillas y accionables.'],['leaf','Tercer punto','Mantén una jerarquía visual clara.'],['check','Cuarto punto','Cierra con una acción concreta.']].map(([icon,title,text],index)=>({id:infoId('item'),icon,title,text,colorFamily:INFO_ITEM_FAMILIES[index]})),colorFamily:'purple',span:12},
    stat:{value:'85%',heading:'Indicador principal',html:'<p>Agrega contexto para que el dato sea fácil de entender.</p>',icon:'chart-pie',colorFamily:'green',span:6},
    cta:{heading:'¿Listo para actuar?',html:'<p>Explica brevemente el siguiente paso.</p>',label:'Abrir enlace',url:'https://',colorFamily:'orange',span:12}
  }
  return Object.assign(base,byType[type]||byType.text,seed)
}
function infoCreateDraft(seed={}){
  const now=infoNow()
  return Object.assign({
    id:infoId('infographic'),title:'Título de la infografía',subtitle:'Agrega una breve introducción que prepare al lector.',showSubtitle:true,eyebrow:'Comunicaciones SIERRA',
    preset:'letter',width:816,height:1056,canvasTone:'white',colorFamily:'teal',gap:14,
    department:'Comunicaciones Corporativas',footerColorFamily:'orange',createdAt:now,updatedAt:now,
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
  d.canvasTone=d.canvasTone==='smoke'||String(d.background||'').toLowerCase()==='#f5f5f5'?'smoke':'white'
  d.colorFamily=INFO_COLOR_FAMILIES.some(f=>f.id===d.colorFamily)?d.colorFamily:infoNearestFamily(d.accent)
  d.footerColorFamily=INFO_COLOR_FAMILIES.some(f=>f.id===d.footerColorFamily)?d.footerColorFamily:infoNearestFamily(d.departmentColor,'#ff7824')
  d.blocks.forEach(block=>{block.colorFamily=INFO_COLOR_FAMILIES.some(f=>f.id===block.colorFamily)?block.colorFamily:infoNearestFamily(block.iconColor,block.buttonBackground,block.background);block.heightMode=block.heightMode==='fill'?'fill':'content';block.items?.forEach((item,index)=>{item.colorFamily=INFO_COLOR_FAMILIES.some(f=>f.id===item.colorFamily)?item.colorFamily:infoNearestFamily(item.iconColor,item.iconBackground,infoFamily(INFO_ITEM_FAMILIES[index%INFO_ITEM_FAMILIES.length]).base)})})
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
  infoRenderAll();infoEnsureIconCatalog().catch(()=>infoNotify('No se pudo cargar el catálogo completo de iconos.'));requestAnimationFrame(()=>{infoFitCanvas();if(typeof ResizeObserver!=='undefined'){infoResizeObserver?.disconnect();infoResizeObserver=new ResizeObserver(infoFitCanvas);infoResizeObserver.observe(document.getElementById('info-stage'))}})
}
function infoLibraryHtml(){
  const items=[['text','text-size','Texto','Título y texto enriquecido','#cffffb','#007d73'],['image','photo','Imagen','Fotografía o ilustración','#c5e9ff','#004a86'],['callout','info','Destacado','Ícono y mensaje clave','#efefaf','#827e00'],['features','columns','Tarjetas con íconos','De dos a cuatro ideas','#f6d8ff','#670084'],['stat','chart-pie','Dato destacado','Cifra, etiqueta y contexto','#d1ffbe','#2a9200'],['cta','link','Llamado a la acción','Botón, texto y enlace','#ffe3d2','#cd4f00']]
  return`<div class="info-library-group"><span class="info-library-label">Módulos</span>${items.map(([type,icon,label,desc,soft,ink])=>`<button class="info-add-button" onclick="infoAddBlock('${type}')" style="--info-soft:${soft};--info-ink:${ink}"><span class="info-add-icon">${infoIcon(icon,18)}</span><span><b>${label}</b><small>${desc}</small></span></button>`).join('')}</div><div class="info-tip"><b>Layout adaptable</b><br>Combina anchos y decide si cada módulo se ajusta a su contenido o rellena la altura disponible en su fila.</div>`
}
function infoLogoHtml(){return typeof memoLogoHtml==='function'?memoLogoHtml():'<strong>SIERRA</strong>'}
function infoDepartmentHtml(){const family=infoFamily(infoDraft.footerColorFamily);return typeof sierraDepartmentHtml==='function'?sierraDepartmentHtml(infoDraft.department||'Departamento',family.base):`<strong style="color:${family.dark}">${infoEscape(infoDraft.department)}</strong>`}
function infoPageHtml(interactive=true){
  const clickHeader=interactive?' onclick="infoSelect(\'header\')"':'' ,clickFooter=interactive?' onclick="infoSelect(\'footer\')"':'',pageFamily=infoFamily(infoDraft.colorFamily),background=infoDraft.canvasTone==='smoke'?'#f5f5f5':'#ffffff'
  return`<article class="info-page" id="info-page" style="width:${infoDraft.width}px;height:${infoDraft.height}px;background:${background};--info-title:#0b0b0b;--info-muted:#6b6b73;--info-accent:${pageFamily.base};--info-accent-dark:${pageFamily.dark};--info-gap:${infoDraft.gap}px">
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
  const family=infoFamily(b.colorFamily),common=`class="info-block-shell info-clickable ${infoSelected===b.id&&interactive?'info-selected':''}" data-info-block="${infoAttr(b.id)}" data-info-height="${b.heightMode==='fill'?'fill':'content'}" style="--info-span:${Math.min(12,Math.max(4,Number(b.span)||12))}"${drag}`
  const style=`--info-family-light:${family.light};--info-family-base:${family.base};--info-family-dark:${family.dark};--info-card-bg:${family.light};--info-card-ink:#0b0b0b`
  let body=''
  if(b.type==='image')body=`<div class="info-block info-image-block" style="${style};--info-image-fit:${b.fit==='contain'?'contain':'cover'};--info-image-position:${Math.min(100,Math.max(0,Number(b.position)||50))}% 50%">${b.src?`<img src="${infoAttr(b.src)}" alt="${infoAttr(b.alt||'Imagen de la infografía')}">`:`<div class="info-image-placeholder"><span>${infoIcon('photo',34)}<b>Agrega una imagen</b></span></div>`}</div>`
  else if(b.type==='features')body=`<section class="info-block info-features-block" style="${style}"><h2>${infoEscape(b.heading)}</h2><div class="info-feature-grid">${(b.items||[]).map((item,index)=>{const itemFamily=infoFamily(item.colorFamily||INFO_ITEM_FAMILIES[index%INFO_ITEM_FAMILIES.length]);return`<article class="info-feature-item" style="--info-family-light:${itemFamily.light};--info-family-base:${itemFamily.base};--info-family-dark:${itemFamily.dark}"><span class="info-icon-plaque">${infoIcon(item.icon||'check',21)}</span><h3>${infoEscape(item.title)}</h3><p>${infoEscape(item.text)}</p></article>`}).join('')}</div></section>`
  else if(b.type==='callout')body=`<section class="info-block info-callout-layout" style="${style}"><span class="info-icon-plaque">${infoIcon(b.icon||'info',24)}</span><div><h2>${infoEscape(b.heading)}</h2><div class="info-rich-output" data-info-output="${infoAttr(b.id)}">${infoSanitize(b.html)}</div></div></section>`
  else if(b.type==='stat')body=`<section class="info-block info-stat-block" style="${style}"><span class="info-icon-plaque">${infoIcon(b.icon||'chart-pie',25)}</span><div><div class="info-stat-value">${infoEscape(b.value)}</div><h3 class="info-stat-label">${infoEscape(b.heading)}</h3><div class="info-rich-output" data-info-output="${infoAttr(b.id)}">${infoSanitize(b.html)}</div></div></section>`
  else if(b.type==='cta'){const href=infoSafeUrl(b.url);body=`<section class="info-block info-cta-block" style="${style};--info-button-bg:${family.dark};--info-button-ink:#ffffff"><div class="info-cta-copy"><h2>${infoEscape(b.heading)}</h2><div class="info-rich-output" data-info-output="${infoAttr(b.id)}">${infoSanitize(b.html)}</div>${b.url?`<span class="info-cta-url">${infoEscape(b.url)}</span>`:''}</div><a class="info-cta-link" href="${infoAttr(href||'#')}" ${interactive?'onclick="event.preventDefault()"':'target="_blank" rel="noopener noreferrer"'}>${infoEscape(b.label||'Abrir enlace')}</a></section>`}
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
function infoIconLabel(key){const known=INFO_ICONS.find(([name])=>name===key)?.[1];return known||String(key||'icono').replaceAll('-',' ')}
function infoIconTrigger(value,blockId,itemId=''){const count=infoIconCatalog?Object.keys(infoIconCatalog).length.toLocaleString('es-GT'):'5,130';return`<button type="button" class="info-icon-trigger" onclick="infoOpenIconPicker('${blockId}','${itemId}')"><span class="info-icon-trigger-preview" data-info-icon-preview="${infoAttr(value)}">${infoIcon(value,23)||infoIcon('sparkle',23)}</span><span><b>${infoEscape(infoIconLabel(value))}</b><small>Buscar entre <span data-info-icon-count>${count} iconos</span></small></span>${infoIcon('chevron-right',17)}</button>`}
function infoFamilyControl(label,value,scope,id='',itemId=''){
  const selected=infoFamily(value).id
  return`<div class="info-family-field" role="radiogroup" aria-label="${infoAttr(label)}"><span class="info-color-label">${infoEscape(label)} <small>Familias SIERRA</small></span><div class="info-family-grid">${INFO_COLOR_FAMILIES.map(family=>`<button type="button" class="info-family-option" role="radio" aria-checked="${selected===family.id}" onclick="infoSetFamily('${scope}','${infoAttr(id)}','${infoAttr(itemId)}','${family.id}')"><span class="info-family-swatches" aria-hidden="true"><i style="background:${family.light}"></i><i style="background:${family.base}"></i><i style="background:${family.dark}"></i></span><span>${infoEscape(family.name)}</span>${selected===family.id?infoIcon('check',14):''}</button>`).join('')}</div><small class="info-family-help">Claro para superficies · medio para acentos · oscuro para texto y acciones.</small></div>`
}
function infoCanvasToneControl(){return`<div class="info-field"><span>Fondo del lienzo</span><div class="info-segmented info-segmented-two"><button type="button" aria-pressed="${infoDraft.canvasTone!=='smoke'}" onclick="infoSetMeta('canvasTone','white',true)">Blanco</button><button type="button" aria-pressed="${infoDraft.canvasTone==='smoke'}" onclick="infoSetMeta('canvasTone','smoke',true)">Blanco humo</button></div></div>`}
window.infoSetFamily=function(scope,id,itemId,familyId){if(!INFO_COLOR_FAMILIES.some(family=>family.id===familyId))return;if(scope==='meta')infoDraft.colorFamily=familyId;else if(scope==='footer')infoDraft.footerColorFamily=familyId;else if(scope==='block'){const block=infoDraft.blocks.find(item=>item.id===id);if(block)block.colorFamily=familyId}else if(scope==='item'){const item=infoDraft.blocks.find(block=>block.id===id)?.items?.find(value=>value.id===itemId);if(item)item.colorFamily=familyId}infoRenderAll();infoScheduleSave()}
function infoPickerKeys(){
  if(!infoIconCatalog)return[]
  const all=Object.keys(infoIconCatalog),query=String(infoIconPickerState?.query||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''),category=infoIconPickerState?.category||'recommended'
  if(!query&&category==='recommended')return INFO_ICONS.map(([key])=>key).filter(key=>infoIconCatalog[key])
  const categoryWords=INFO_ICON_CATEGORIES.find(([key])=>key===category)?.[2]||[]
  const translated=INFO_ICON_ALIASES[query]||query
  return all.filter(key=>{const inCategory=category==='all'||category==='recommended'||categoryWords.some(word=>key.includes(word));if(!inCategory)return false;if(!query)return true;return key.includes(query)||key.includes(translated)})
}
function infoRenderIconPicker(){
  const dialog=infoIconPickerState?.dialog;if(!dialog)return
  const grid=dialog.querySelector('[data-info-icon-grid]'),status=dialog.querySelector('[data-info-icon-status]'),more=dialog.querySelector('[data-info-icon-more]');if(!grid||!status||!more)return
  if(!infoIconCatalog){grid.innerHTML='<div class="info-icon-loading">Cargando biblioteca…</div>';status.textContent='';more.hidden=true;return}
  const keys=infoPickerKeys(),shown=keys.slice(0,infoIconPickerState.limit),current=infoIconPickerState.current
  status.textContent=`${keys.length.toLocaleString('es-GT')} resultados · ${Object.keys(infoIconCatalog).length.toLocaleString('es-GT')} iconos disponibles`
  grid.innerHTML=shown.map(key=>`<button type="button" class="info-catalog-icon" data-info-icon="${infoAttr(key)}" title="${infoAttr(infoIconLabel(key))}" aria-label="${infoAttr(infoIconLabel(key))}" aria-pressed="${key===current}">${infoIcon(key,22)}</button>`).join('')||'<div class="info-icon-empty">No encontramos iconos con esa búsqueda.</div>'
  more.hidden=shown.length>=keys.length;more.textContent=`Mostrar más (${Math.min(120,keys.length-shown.length)})`
}
window.infoOpenIconPicker=function(blockId,itemId=''){
  const block=infoDraft.blocks.find(b=>b.id===blockId),current=itemId?block?.items?.find(item=>item.id===itemId)?.icon:block?.icon;if(!block||!current)return
  const previous=document.activeElement,dialog=document.createElement('dialog');dialog.className='modal-content comms-confirm info-icon-dialog';dialog.setAttribute('aria-label','Biblioteca de iconos');dialog.innerHTML=`<div class="modal-header"><div><h2>Biblioteca de iconos</h2><small>Tabler Outline · más de 5,000 opciones</small></div><button type="button" class="icon-btn" aria-label="Cerrar">${infoIcon('x',17)}</button></div><div class="info-icon-search">${infoIcon('search',18)}<input class="control-input" type="search" placeholder="Buscar: seguridad, personas, salud…" aria-label="Buscar iconos"></div><div class="info-icon-categories">${INFO_ICON_CATEGORIES.map(([key,label])=>`<button type="button" data-info-category="${key}" aria-pressed="${key==='recommended'}">${label}</button>`).join('')}</div><div class="info-icon-picker-meta" data-info-icon-status></div><div class="info-catalog-grid" data-info-icon-grid></div><button type="button" class="btn btn-secondary info-icon-more" data-info-icon-more>Mostrar más</button><div class="modal-footer"><button type="button" class="btn btn-secondary">Cancelar</button></div>`
  infoIconPickerState={dialog,blockId,itemId,current,category:'recommended',query:'',limit:120}
  const close=()=>dialog.close(),search=dialog.querySelector('input[type="search"]');dialog.querySelector('.modal-header .icon-btn').onclick=close;dialog.querySelector('.modal-footer button').onclick=close
  search.oninput=()=>{infoIconPickerState.query=search.value;infoIconPickerState.category=search.value?'all':infoIconPickerState.category;infoIconPickerState.limit=120;dialog.querySelectorAll('[data-info-category]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.infoCategory===infoIconPickerState.category)));infoRenderIconPicker()}
  dialog.querySelector('.info-icon-categories').onclick=event=>{const button=event.target.closest('[data-info-category]');if(!button)return;infoIconPickerState.category=button.dataset.infoCategory;infoIconPickerState.limit=120;dialog.querySelectorAll('[data-info-category]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));infoRenderIconPicker()}
  dialog.querySelector('[data-info-icon-grid]').onclick=event=>{const button=event.target.closest('[data-info-icon]');if(!button)return;const key=button.dataset.infoIcon;if(itemId){const item=block.items.find(x=>x.id===itemId);if(item)item.icon=key}else block.icon=key;dialog.close();infoRenderAll();infoScheduleSave()}
  dialog.querySelector('[data-info-icon-more]').onclick=()=>{infoIconPickerState.limit+=120;infoRenderIconPicker()}
  dialog.addEventListener('close',()=>{dialog.remove();infoIconPickerState=null;if(previous?.isConnected)previous.focus()},{once:true});document.body.appendChild(dialog);dialog.showModal();infoRenderIconPicker();infoEnsureIconCatalog().then(()=>{if(infoIconPickerState?.dialog===dialog)infoRenderIconPicker()}).catch(()=>{dialog.querySelector('[data-info-icon-grid]').innerHTML='<div class="info-icon-empty">No se pudo cargar la biblioteca. Recarga la aplicación.</div>'});search.focus()
}
function infoCommonInspector(b){return`<section class="info-inspector-section"><span class="info-section-title">Distribución adaptable</span>${infoField('Ancho',`<div class="info-segmented">${[[4,'⅓'],[6,'½'],[12,'Completo']].map(([span,label])=>`<button type="button" aria-pressed="${b.span===span}" onclick="infoSetBlock('${b.id}','span',${span},true)">${label}</button>`).join('')}</div>`)}${infoField('Altura',`<div class="info-segmented info-segmented-two"><button type="button" aria-pressed="${b.heightMode!=='fill'}" onclick="infoSetBlock('${b.id}','heightMode','content',true)">Según contenido</button><button type="button" aria-pressed="${b.heightMode==='fill'}" onclick="infoSetBlock('${b.id}','heightMode','fill',true)">Rellenar fila</button></div>`)}${infoFamilyControl('Familia de color',b.colorFamily,'block',b.id)}<div class="info-tip">El ancho se adapta en lienzos estrechos. «Según contenido» evita espacio vacío; «Rellenar fila» iguala la altura con los demás módulos de esa fila.</div></section><section class="info-inspector-section"><span class="info-section-title">Orden</span><div class="info-inspector-actions"><button class="btn btn-secondary" onclick="infoMoveBlock('${b.id}',-1)">${infoIcon('arrow-up',15)} Subir</button><button class="btn btn-secondary" onclick="infoMoveBlock('${b.id}',1)">${infoIcon('arrow-down',15)} Bajar</button><button class="btn btn-secondary" onclick="infoDuplicateBlock('${b.id}')">${infoIcon('copy',15)} Duplicar</button><button class="btn btn-ghost" onclick="infoDeleteBlock('${b.id}')">${infoIcon('trash',15)} Eliminar</button></div></section>`}
function infoRichEditor(b){return`<div><div class="info-rich-toolbar" role="toolbar" aria-label="Formato del texto"><button type="button" title="Negrita" onclick="infoRichCommand('${b.id}','bold')">B</button><button type="button" title="Cursiva" onclick="infoRichCommand('${b.id}','italic')"><i>I</i></button><button type="button" title="Subrayado" onclick="infoRichCommand('${b.id}','underline')"><u>U</u></button><button type="button" title="Lista con viñetas" onclick="infoRichCommand('${b.id}','insertUnorderedList')">•</button><button type="button" title="Lista numerada" onclick="infoRichCommand('${b.id}','insertOrderedList')">1.</button></div><div class="info-rich-editor" contenteditable="true" data-info-rich="${infoAttr(b.id)}" role="textbox" aria-multiline="true" oninput="infoRichInput('${b.id}',this)">${infoSanitize(b.html)}</div></div>`}
function infoContentInspector(b){
  if(b.type==='image')return`<section class="info-inspector-section"><span class="info-section-title">Imagen</span>${b.src?`<img class="info-upload-thumb" src="${infoAttr(b.src)}" alt="">`:''}<label class="info-upload">${infoIcon('upload',16)} ${b.src?'Cambiar imagen':'Elegir imagen'}<input type="file" accept="image/*" onchange="infoUploadImage('${b.id}',this)"></label>${b.src?`<button class="btn btn-ghost" onclick="infoSetBlock('${b.id}','src','')">${infoIcon('trash',15)} Quitar imagen</button>`:''}${infoInput('Descripción accesible','alt',b.alt)}<div class="info-field-row">${infoField('Ajuste',`<select class="control-input" onchange="infoSetBlock('${b.id}','fit',this.value)"><option value="cover" ${b.fit==='cover'?'selected':''}>Rellenar</option><option value="contain" ${b.fit==='contain'?'selected':''}>Mostrar completa</option></select>`)}${infoField('Posición',`<input class="control-input" type="range" min="0" max="100" value="${Number(b.position)||50}" oninput="infoSetBlock('${b.id}','position',Number(this.value))">`)}</div></section>`
  if(b.type==='features')return`<section class="info-inspector-section"><span class="info-section-title">Contenido</span>${infoInput('Título','heading',b.heading)}<div class="info-feature-editors">${(b.items||[]).map((item,i)=>`<div class="info-item-editor"><div class="info-item-head"><b>Tarjeta ${i+1}</b><button class="icon-btn" aria-label="Eliminar tarjeta ${i+1}" ${b.items.length<=2?'disabled':''} onclick="infoFeatureRemove('${b.id}','${item.id}')">${infoIcon('trash',14)}</button></div>${infoIconTrigger(item.icon,b.id,item.id)}${infoFamilyControl('Familia de color',item.colorFamily||INFO_ITEM_FAMILIES[i%INFO_ITEM_FAMILIES.length],'item',b.id,item.id)}<input class="control-input" aria-label="Título" value="${infoAttr(item.title)}" oninput="infoFeatureSet('${b.id}','${item.id}','title',this.value)"><textarea class="control-input" rows="2" aria-label="Descripción" oninput="infoFeatureSet('${b.id}','${item.id}','text',this.value)">${infoEscape(item.text)}</textarea></div>`).join('')}</div>${b.items.length<4?`<button class="btn btn-secondary" onclick="infoFeatureAdd('${b.id}')">${infoIcon('plus',15)} Agregar tarjeta</button>`:''}</section>`
  let fields=`<section class="info-inspector-section"><span class="info-section-title">Contenido</span>`
  if(b.type==='stat')fields+=infoInput('Dato o cifra','value',b.value)
  fields+=infoInput('Título','heading',b.heading)
  if(['callout','stat'].includes(b.type))fields+=infoIconTrigger(b.icon,b.id)
  fields+=infoField('Texto',infoRichEditor(b))
  if(b.type==='cta')fields+=infoInput('Texto del botón','label',b.label)+infoInput('Enlace visible','url',b.url,'url')
  return fields+'</section>'
}
function infoRenderInspector(){
  const host=document.getElementById('info-inspector');if(!host||!infoDraft)return
  if(infoSelected==='header'){host.innerHTML=`<section class="info-inspector-section"><span class="info-section-title">Encabezado</span>${infoField('Antetítulo',`<input class="control-input" value="${infoAttr(infoDraft.eyebrow)}" placeholder="Opcional" oninput="infoSetMeta('eyebrow',this.value)">`)}${infoField('Título obligatorio',`<textarea class="control-input" rows="3" required oninput="infoSetMeta('title',this.value)">${infoEscape(infoDraft.title)}</textarea>`)}<label class="info-field"><span><input type="checkbox" ${infoDraft.showSubtitle?'checked':''} onchange="infoSetMeta('showSubtitle',this.checked,true)"> Mostrar subtítulo</span>${infoDraft.showSubtitle?`<textarea class="control-input" rows="3" oninput="infoSetMeta('subtitle',this.value)">${infoEscape(infoDraft.subtitle)}</textarea>`:''}</label><div class="info-tip">El título permanece negro y el texto secundario gris SIERRA para asegurar jerarquía y lectura.</div></section>`;return}
  if(infoSelected==='footer'){host.innerHTML=`<section class="info-inspector-section"><span class="info-section-title">Pie de arte</span>${infoField('Departamento',`<input class="control-input" value="${infoAttr(infoDraft.department)}" oninput="infoSetMeta('department',this.value)">`)}${infoFamilyControl('Familia del departamento',infoDraft.footerColorFamily,'footer')}<div class="info-tip">La familia aplica el tono medio al identificador; el logotipo SIERRA conserva sus colores oficiales.</div></section>`;return}
  if(infoSelected==='page'){host.innerHTML=`<section class="info-inspector-section"><span class="info-section-title">Lienzo</span>${infoField('Formato',`<select class="control-input" onchange="infoSetPreset(this.value)">${Object.entries(INFO_PRESETS).map(([key,p])=>`<option value="${key}" ${infoDraft.preset===key?'selected':''}>${p.label}</option>`).join('')}</select>`)}<div class="info-field-row">${infoField('Ancho px',`<input class="control-input" type="number" min="320" max="2400" value="${infoDraft.width}" oninput="infoSetDimension('width',this.value)">`)}${infoField('Alto px',`<input class="control-input" type="number" min="480" max="4000" value="${infoDraft.height}" oninput="infoSetDimension('height',this.value)">`)}</div>${infoCanvasToneControl()}${infoFamilyControl('Familia principal',infoDraft.colorFamily,'meta')}${infoField('Separación entre módulos',`<input class="control-input" type="range" min="4" max="36" value="${infoDraft.gap}" oninput="infoSetMeta('gap',Number(this.value))">`)}</section><section class="info-inspector-section"><span class="info-section-title">Guía de layout</span><div class="info-tip">Los módulos se reorganizan en lienzos estrechos. Combina anchos y usa la altura según contenido o para rellenar su fila.</div></section>`;return}
  const b=infoSelectedBlock();if(!b){host.innerHTML='<div class="info-empty-inspector">Selecciona el título, el pie o una tarjeta del arte para personalizarla.</div>';return}
  host.innerHTML=infoContentInspector(b)+infoCommonInspector(b)
}

window.infoSetMeta=function(key,value,rerenderInspector=false){if(!infoDraft)return;infoDraft[key]=value;infoRenderCanvas();if(rerenderInspector)infoRenderInspector();infoScheduleSave()}
window.infoSetBlock=function(id,key,value,rerenderInspector=false){const b=infoDraft.blocks.find(x=>x.id===id);if(!b)return;b[key]=value;infoRenderCanvas();if(rerenderInspector)infoRenderInspector();infoScheduleSave()}
window.infoSetPreset=function(key){const p=INFO_PRESETS[key];if(!p)return;if(key==='custom'){infoOpenCustomSize();return}infoDraft.preset=key;infoDraft.width=p.width;infoDraft.height=p.height;infoSelected='page';infoRenderAll();infoScheduleSave()}
window.infoSetDimension=function(key,value){const range=key==='width'?[320,2400]:[480,4000];infoDraft[key]=Math.min(range[1],Math.max(range[0],Number(value)||range[0]));infoDraft.preset='custom';infoRenderCanvas();infoScheduleSave()}
function infoOpenCustomSize(){
  const previous=document.activeElement,dialog=document.createElement('dialog');dialog.className='modal-content comms-confirm info-size-dialog';dialog.setAttribute('aria-label','Medida personalizada');dialog.innerHTML=`<div class="modal-header"><h2>Medida personalizada</h2></div><p>Define el lienzo en píxeles. Puedes crear una pieza vertical, horizontal o cualquier formato digital.</p><div class="info-size-fields">${infoField('Ancho · 320 a 2400 px',`<input id="info-custom-width" class="control-input" type="number" min="320" max="2400" value="${Math.round(infoDraft.width)}">`)}${infoField('Alto · 480 a 4000 px',`<input id="info-custom-height" class="control-input" type="number" min="480" max="4000" value="${Math.round(infoDraft.height)}">`)}</div><div class="modal-footer"><button type="button" class="btn btn-secondary">Cancelar</button><button type="button" class="btn btn-primary">Aplicar medida</button></div>`
  const [cancel,apply]=dialog.querySelectorAll('button'),width=dialog.querySelector('#info-custom-width'),height=dialog.querySelector('#info-custom-height')
  cancel.onclick=()=>dialog.close();apply.onclick=()=>{if(!width.reportValidity()||!height.reportValidity())return;infoDraft.preset='custom';infoDraft.width=Math.min(2400,Math.max(320,Number(width.value)||816));infoDraft.height=Math.min(4000,Math.max(480,Number(height.value)||1056));infoSelected='page';dialog.close();infoRenderAll();infoPersist(true)}
  ;[width,height].forEach(input=>input.onkeydown=event=>{if(event.key==='Enter'){event.preventDefault();apply.click()}})
  dialog.addEventListener('close',()=>{dialog.remove();infoRenderInspector();infoRenderDesignSelect();document.querySelectorAll('[aria-label="Formato del lienzo"]').forEach(select=>select.value=infoDraft.preset);if(previous?.isConnected)previous.focus()},{once:true})
  document.body.appendChild(dialog);dialog.showModal();width.focus();width.select()
}
window.infoAddBlock=function(type){const b=infoBlock(type);infoDraft.blocks.push(b);infoSelected=b.id;infoRenderAll();infoScheduleSave();requestAnimationFrame(()=>document.querySelector(`[data-info-block="${b.id}"]`)?.scrollIntoView({behavior:'smooth',block:'center'}))}
window.infoMoveBlock=function(id,delta){const i=infoDraft.blocks.findIndex(b=>b.id===id),j=i+Number(delta);if(i<0||j<0||j>=infoDraft.blocks.length)return;[infoDraft.blocks[i],infoDraft.blocks[j]]=[infoDraft.blocks[j],infoDraft.blocks[i]];infoRenderCanvas();infoScheduleSave()}
window.infoDuplicateBlock=function(id){const i=infoDraft.blocks.findIndex(b=>b.id===id);if(i<0)return;const copy=infoClone(infoDraft.blocks[i]);copy.id=infoId('art');if(copy.items)copy.items.forEach(item=>item.id=infoId('item'));infoDraft.blocks.splice(i+1,0,copy);infoSelected=copy.id;infoRenderAll();infoScheduleSave()}
window.infoDeleteBlock=function(id){const remove=()=>{infoDraft.blocks=infoDraft.blocks.filter(b=>b.id!==id);infoSelected=infoDraft.blocks[0]?.id||'header';infoRenderAll();infoScheduleSave()};if(typeof commsConfirm==='function')commsConfirm('Eliminar módulo','Se retirará este módulo del arte.',remove);else if(confirm('¿Eliminar este módulo?'))remove()}
window.infoRichCommand=function(id,command){const editor=document.querySelector(`[data-info-rich="${id}"]`);if(!editor)return;editor.focus();document.execCommand(command,false,null);window.infoRichInput(id,editor)}
window.infoRichInput=function(id,editor){const b=infoDraft.blocks.find(x=>x.id===id);if(!b)return;b.html=infoSanitize(editor.innerHTML);document.querySelectorAll(`[data-info-output="${id}"]`).forEach(el=>el.innerHTML=b.html);infoScheduleSave()}
window.infoFeatureSet=function(blockId,itemId,key,value){const item=infoDraft.blocks.find(b=>b.id===blockId)?.items?.find(x=>x.id===itemId);if(!item)return;item[key]=value;infoRenderCanvas();infoScheduleSave()}
window.infoFeatureAdd=function(id){const b=infoDraft.blocks.find(x=>x.id===id);if(!b||b.items.length>=4)return;b.items.push({id:infoId('item'),icon:'check',title:'Nuevo punto',text:'Agrega una explicación breve.',colorFamily:INFO_ITEM_FAMILIES[b.items.length%INFO_ITEM_FAMILIES.length]});infoRenderAll();infoScheduleSave()}
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
  if(typeof window.html2canvas!=='function')throw Error('El generador de imágenes no está disponible. Recarga la aplicación e inténtalo de nuevo.')
  const host=document.createElement('div');host.className='info-export-host';host.innerHTML=infoPageHtml(false);document.body.appendChild(host);const page=host.querySelector('.info-page');page.style.transform='none';page.style.margin='0';page.querySelector('.info-overflow-warning')?.remove()
  try{await document.fonts?.ready;await Promise.all([...page.querySelectorAll('img')].map(img=>img.complete?Promise.resolve():new Promise(resolve=>{img.onload=img.onerror=resolve})));await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));const inner=page.querySelector('.info-page-inner');if(inner.scrollHeight>page.clientHeight+2)throw Error('El contenido excede el lienzo. Ajusta el alto o reduce los módulos antes de exportar.');const scale=Math.min(2,12000/Math.max(infoDraft.width,infoDraft.height),Math.sqrt(24000000/(infoDraft.width*infoDraft.height)));return await window.html2canvas(page,{scale,useCORS:true,allowTaint:false,backgroundColor:infoDraft.canvasTone==='smoke'?'#f5f5f5':'#ffffff',logging:false,width:infoDraft.width,height:infoDraft.height,windowWidth:infoDraft.width,windowHeight:infoDraft.height,scrollX:0,scrollY:0})}finally{host.remove()}
}
function infoCanvasBlob(canvas,type,quality){return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(Error('No se pudo generar el archivo. Reduce las dimensiones e inténtalo de nuevo.')),type,quality))}
function infoDownloadBlob(blob,name){const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=name;document.body.appendChild(link);try{link.click()}finally{link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000)}}
window.infoExport=async function(format){
  if(!String(infoDraft.title||'').trim()){infoSelected='header';infoRenderAll();infoNotify('Escribe el título antes de exportar.');return}
  if(!String(infoDraft.department||'').trim()){infoSelected='footer';infoRenderAll();infoNotify('Escribe el departamento del pie antes de exportar.');return}
  const buttons=[...document.querySelectorAll('.info-toolbar button')];buttons.forEach(b=>b.disabled=true);const state=document.getElementById('info-save-state');if(state)state.textContent='Preparando archivo…'
  try{infoPersist(true);const canvas=await infoCapture();if(format==='png'){infoDownloadBlob(await infoCanvasBlob(canvas,'image/png'),infoFilename('png'))}else{if(!window.jspdf?.jsPDF)throw Error('El generador de PDF no está disponible. Recarga la aplicación e inténtalo de nuevo.');const w=infoDraft.width/96*25.4,h=infoDraft.height/96*25.4,pdf=new window.jspdf.jsPDF({orientation:w>h?'landscape':'portrait',unit:'mm',format:[w,h],compress:true}),pageW=pdf.internal.pageSize.getWidth(),pageH=pdf.internal.pageSize.getHeight();pdf.setProperties({title:infoDesignName(infoDraft),creator:'SIERRA Index'});pdf.addImage(canvas.toDataURL('image/jpeg',.96),'JPEG',0,0,pageW,pageH,undefined,'FAST');pdf.save(infoFilename('pdf'))}infoNotify(format==='png'?'Descarga PNG iniciada.':'Descarga PDF iniciada.')}catch(error){infoNotify(error?.message||'No se pudo exportar el arte.')}finally{buttons.forEach(b=>b.disabled=false);if(state)state.textContent='Guardado'}
}

document.addEventListener('keydown',event=>{if(_navLeaf!=='comunicaciones|_|infographics')return;if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='s'){event.preventDefault();infoPersist(true);infoNotify('Diseño guardado.');return}if(event.target.closest('input,textarea,[contenteditable="true"],select'))return;const b=infoSelectedBlock();if(!b)return;if(event.key==='Delete'||event.key==='Backspace'){event.preventDefault();window.infoDeleteBlock(b.id)}else if(event.altKey&&event.key==='ArrowUp'){event.preventDefault();window.infoMoveBlock(b.id,-1)}else if(event.altKey&&event.key==='ArrowDown'){event.preventDefault();window.infoMoveBlock(b.id,1)}})
})()
