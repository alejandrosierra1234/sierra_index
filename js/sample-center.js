/* Collection-first work queue. Counts and permissions come from one RLS-protected snapshot. */
const sampleCenterState={view:'work',search:'',offset:0,limit:30,request:0,counts:{},timer:null};
const sampleCenterTabs=[['work','list','Mi trabajo'],['collections','package','Colecciones'],['inventory','box','Inventario'],['tracking','truck','Seguimiento']];
function centerIcon(key){return siIcon(key,16)}
function sampleCenterTabsHtml(){return `<nav class="sc-tabs" aria-label="Vistas del Centro de Muestras">${sampleCenterTabs.map(([key,icon,label])=>`<button class="btn btn-secondary ${sampleCenterState.view===key?'is-active':''}" ${sampleCenterState.view===key?'aria-current="page"':''} onclick="showSampleCenter('${key}')">${centerIcon(icon)} ${label}<span data-center-count="${key}">${sampleCenterState.counts[key]??''}</span></button>`).join('')}</nav>`}
function returnToSampleCenter(){if(sampleCenterState.returnSpace!==undefined)setSampleSpace(sampleCenterState.returnSpace);return showSampleCenter(sampleCenterState.view,true)}
function sampleCenterTask(c){
 const count=(n,s)=>`${n} ${s}${n===1?'':'s'}`;
 if(!c.governed){
  const closed=['delivered','archived','returned','damaged','picked_up'].includes(c.status);
  return {stage:({draft:'Borrador',requested:'Solicitud',approved:'Aprobada',preparing:'Preparación',ready:'Lista',shipped:'En camino',delivered:'Entregada',archived:'Archivada',returned:'Devuelta',damaged:'Incidencia',picked_up:'Retirada'})[c.status]||'Por revisar',team:closed?'Cerrada':c.status==='shipped'?'PD':(['draft','requested','approved'].includes(c.status)?'Ventas':'PD'),detail:!c.item_count?'Sin referencias seleccionadas':c.status==='draft'?(!c.name?'Dar nombre a la colección':!c.recipient?'Completar destinatario':!c.deadline?'Definir fecha requerida':'Revisar destino y condiciones'):({requested:'Confirmar selección con Ventas',approved:'Coordinar preparación con PD',preparing:'Revisar preparación de muestras',ready:'Verificar contenido antes de la salida',shipped:'Consultar guía y confirmar recepción'})[c.status]||'Contenido e historial disponibles',action:closed?'Ver detalle':!c.item_count?'Seleccionar muestras':c.status==='draft'?'Completar colección':'Revisar colección',active:c.actionable,tone:'neutral'};
 }
 switch(c.stage){
 case 'selection':return {stage:'Selección y costing',team:'Ventas',detail:!c.configured?'Definir destino y condiciones':!c.item_count?'Seleccionar las referencias':!c.destination_country?'Completar país de destino':!c.recipient?'Completar destinatario':(c.costing_required||c.label_show_price)&&c.pending_prices?`${count(c.pending_prices,'precio')} por completar`:c.status==='draft'?'Completar destinatario y enviar selección':'Selección pendiente de liberación',action:!c.can_sales?'Editar selección':!c.configured?'Definir condiciones':(c.costing_required||c.label_show_price)&&c.pending_prices?'Completar costing':'Revisar selección',active:c.can_sales||c.can_select,tone:'neutral'};
 case 'preparing':return {stage:'Preparación',team:'PD',detail:c.pending_preparation?`${count(c.pending_preparation,'muestra')} por verificar`:c.missing_count===c.item_count?'Todos los renglones tienen faltantes':c.pending_stock?`${count(c.pending_stock,'lote')} por asignar`:c.pending_labels?`${count(c.pending_labels,'etiqueta')} pendiente${c.pending_labels===1?'':'s'}`:'Verificación completa · registrar paquete',action:'Preparar muestras',active:c.can_pd,tone:'neutral'};
 case 'packing_review':return {stage:'Revisión del paquete',team:'Ventas',detail:'Packing list pendiente de aprobación',action:'Revisar packing list',active:c.can_sales,tone:'attention'};
 case 'packed':return {stage:'Listo para salir',team:'PD',detail:c.destination_kind==='internal'?'Entrega interna · packing list registrado':'Paquete aprobado por Ventas',action:'Registrar salida',active:c.can_pd,tone:'ready'};
 case 'shipped':return {stage:'En camino',team:'PD',detail:c.tracking||'Recepción pendiente de confirmar',action:'Ver seguimiento',active:c.can_pd,tone:'neutral'};
 case 'unfulfilled':return {stage:'Cerrada con faltantes',team:'Cerrada',detail:'Sin envío · faltantes documentados',action:'Ver cierre',active:false,tone:'neutral'};
 default:return {stage:'Entregada',team:'Cerrada',detail:'Consultar contenido e historial',action:'Ver detalle',active:false,tone:'ready'};
 }
}
function sampleCenterDate(c){
 if(!c.deadline)return '<span class="sc-muted">Sin fecha requerida</span>';
 const d=new Date(c.deadline+'T00:00:00'),today=new Date();today.setHours(0,0,0,0);
 const closed=c.tracked&&c.stage!=='shipped'&&c.status!=='shipped';
 return `<span class="sc-date ${d<today&&!closed?'is-late':''}">${centerIcon('calendar')} ${esc(d.toLocaleDateString('es-GT',{day:'numeric',month:'short',year:'numeric'}))}${d<today&&!closed?'<small>Fecha vencida</small>':''}</span>`;
}
function sampleCenterRow(c){
 const task=sampleCenterTask(c);const name=c.name||c.collection_id||'Colección sin nombre';
 const dest=({client:'Cliente',brand:'Marca',internal:'Equipo interno'})[c.destination_kind]||'Destino por definir';
 return `<tr><td><button class="sc-record" onclick="openSampleCenterCollection('${c.id}')">${esc(name)}</button><small>${c.name?esc(c.collection_id)+' · ':''}${esc(sampleSpaces[c.sample_space]?.label||(c.sample_space==='mixed'?'Histórica · varios equipos':'Por clasificar'))} · ${c.item_count} referencia${c.item_count===1?'':'s'}${c.fabric_count?' · Tela':''}${c.garment_count?' · Prendas':''}</small><small>${esc(c.customer||c.recipient||'Destinatario pendiente')} · ${esc(dest)}${c.destination_country?' · '+esc(c.destination_country):''}</small></td><td><span class="sc-stage ${task.tone}">${centerIcon(({selection:'list',preparing:'box',packing_review:'file',packed:'package',shipped:'truck',delivered:'check',unfulfilled:'alert-triangle'})[c.stage]||'clock')} ${esc(task.stage)}</span><small class="sc-next-owner">${esc(task.team)} · ${esc(task.detail)}</small>${c.missing_count?`<small>${c.missing_count} ${c.missing_count===1?'renglón':'renglones'} con faltantes</small>`:''}</td><td>${esc(c.owner_name)}${sampleCenterDate(c)}</td><td><button class="btn btn-secondary" onclick="openSampleCenterCollection('${c.id}')" aria-label="${esc(task.active?task.action:'Ver colección')}: ${esc(name)}">${esc(task.active?task.action:'Ver colección')} ${centerIcon('arrow-right')}</button></td></tr>`;
}
async function showSampleCenter(view='work',preserve=false){
 if(!sampleCenterTabs.some(t=>t[0]===view))view='work';
 if(!preserve){sampleCenterState.search='';sampleCenterState.offset=0}
 sampleCenterState.view=view;clearTimeout(sampleCenterState.timer);sampleCenterState.request++;
 const root=showSampleTool('Muestras · '+sampleSpaceLabel(),'Colecciones, pendientes y entregas del equipo',view==='collections'?'samples|_|collections':'samples|_|requests');
 try{sessionStorage.setItem('sierra_route','sample-center:'+view)}catch{}
 root.innerHTML=`<section class="sc-center">${sampleCenterTabsHtml()}<div id="sc-content"></div></section>`;
 const panel=document.getElementById('sc-content');
 if(view==='inventory'){
  panel.innerHTML=`<div class="sc-intro"><h2>Consultar existencias</h2><p>Elige el almacén. Encontrarás colores, lotes y cantidades disponibles en su unidad original.</p></div><div class="sc-inventory">${[['fabric','Telas','Rollos, yardas, metros y hangers','grid'],['garment','Prendas','Muestras terminadas del taller','package'],['yarn','Hilo','Existencias de muestras de hilo','box'],['chemicals','Químicos','Existencias de muestras de químicos','package'],['fiber','Fibra','Existencias de muestras de fibra','box']].filter(([d])=>(!sampleActiveSpace||sampleSpaceDivisions().includes(d))&&(can('read',d)||canDispatchDiv(d))).map(([d,label,desc,icon])=>`<button class="sc-inventory-card" onclick="${['fabric','garment'].includes(d)?'showPhysicalSampleStock':'showWarehouseInventory'}('${d}')">${centerIcon(icon)}<span><strong>${label}</strong><small>${desc}</small></span>${centerIcon('arrow-right')}</button>`).join('')||'<p>No tienes acceso a estos almacenes.</p>'}</div><p class="sf-hint">Las cantidades se consultan en el almacén; una referencia en el catálogo no garantiza existencia física.</p>`;
  return;
 }
 const intro={work:['Qué necesita tu atención','Pendientes que puedes atender con tus permisos. Las fechas vencidas aparecen primero.'],collections:['Colecciones del equipo','Organiza solicitudes por cliente. Los borradores vacíos se conservan aquí.'],tracking:['Salidas y cierres','Consulta la guía, el contenido y los faltantes de cada colección.']}[view];
 panel.innerHTML=`<div class="sc-intro"><div><h2>${intro[0]}</h2><p>${intro[1]}</p></div>${can('read','customer_service')?`<button class="btn btn-primary" onclick="startBlankDraft()">${centerIcon('plus')} Nueva colección</button>`:''}</div><div class="sc-toolbar"><label class="sc-search">${centerIcon('search')}<input aria-label="Buscar colecciones" type="search" placeholder="Cliente, colección, responsable o guía" value="${esc(sampleCenterState.search)}" oninput="searchSampleCenter(this.value)"></label><button class="btn btn-secondary" onclick="loadSampleCenter()" aria-label="Actualizar colecciones">${centerIcon('refresh')} Actualizar</button></div><div id="sc-results" aria-live="polite"></div>${view==='tracking'?`<details class="sc-legacy"><summary>${centerIcon('archive')} Solicitudes individuales anteriores</summary><p>Registros históricos que no pertenecen a una colección.</p><button class="btn btn-secondary" onclick="showLegacyIndividualSamples()">${centerIcon('list')} Consultar solicitudes individuales</button></details>`:''}`;
 await loadSampleCenter();
}
function searchSampleCenter(value){sampleCenterState.search=value;sampleCenterState.offset=0;sampleCenterState.request++;clearTimeout(sampleCenterState.timer);sampleCenterState.timer=setTimeout(loadSampleCenter,300)}
async function loadSampleCenter(){
 const root=document.getElementById('sc-results');if(!root)return;
 const token=++sampleCenterState.request;root.setAttribute('aria-busy','true');
 root.innerHTML='<p class="sc-loading" role="status">Consultando colecciones…</p>';
 try{
  const {data,error}=await sb.rpc('sample_center_scoped',{p_view:sampleCenterState.view,p_search:sampleCenterState.search,p_offset:sampleCenterState.offset,p_limit:sampleCenterState.limit,p_space:sampleActiveSpace});
  if(token!==sampleCenterState.request||!root.isConnected)return;
  if(error)throw error;if(!data||!Array.isArray(data.rows))throw new Error('No se recibió la lista de colecciones.');
  sampleCenterState.counts=data.counts||{};document.querySelectorAll('[data-center-count]').forEach(el=>{el.textContent=sampleCenterState.counts[el.dataset.centerCount]??''});
  const start=sampleCenterState.offset+1,end=sampleCenterState.offset+data.rows.length;
  root.innerHTML=data.rows.length?`<div class="sf-table-wrap"><table class="sf-table sc-table"><caption class="sr-only">Colecciones y siguiente acción</caption><thead><tr><th>Colección / destino</th><th>Etapa y siguiente paso</th><th>Responsable / fecha requerida</th><th><span class="sr-only">Acción</span></th></tr></thead><tbody>${data.rows.map(sampleCenterRow).join('')}</tbody></table></div><div class="sc-pagination"><span>${start}–${end} de ${data.total} ${data.total===1?'colección':'colecciones'}</span><div><button class="btn btn-secondary" ${sampleCenterState.offset?'':'disabled'} onclick="pageSampleCenter(-1)">${centerIcon('chevron-left')} Anterior</button><button class="btn btn-secondary" ${end<data.total?'':'disabled'} onclick="pageSampleCenter(1)">Siguiente ${centerIcon('chevron-right')}</button></div></div>`:`<div class="sc-empty">${centerIcon('check')}<h3>${sampleCenterState.search?'No encontramos coincidencias':sampleCenterState.view==='work'?'No tienes acciones pendientes':sampleCenterState.view==='tracking'?'Todavía no hay salidas o cierres':'Todavía no hay colecciones'}</h3><p>${sampleCenterState.search?'Prueba con otro cliente, responsable o referencia.':sampleCenterState.view==='work'?'Puedes consultar el avance del equipo en Colecciones. Los borradores sin referencias están allí.':'Los registros aparecerán aquí conforme avance el trabajo.'}</p>${sampleCenterState.view==='work'?'<button class="btn btn-secondary" onclick="showSampleCenter(\'collections\')">Ver colecciones</button>':''}</div>`;
 }catch(e){if(token===sampleCenterState.request&&root.isConnected)root.innerHTML=`<div class="sc-empty" role="alert"><h3>No pudimos cargar las colecciones</h3><p>${esc(e.message||'Revisa tu conexión e inténtalo otra vez.')}</p><button class="btn btn-secondary" onclick="loadSampleCenter()">${centerIcon('refresh')} Reintentar</button></div>`}
 finally{if(token===sampleCenterState.request&&root.isConnected)root.removeAttribute('aria-busy')}
}
function pageSampleCenter(direction){sampleCenterState.offset=Math.max(0,sampleCenterState.offset+direction*sampleCenterState.limit);loadSampleCenter()}
function openSampleCenterCollection(id){sampleCenterState.returnSpace=sampleActiveSpace;sampleCenterState.request++;showCollectionRecord(id,'returnToSampleCenter')}
