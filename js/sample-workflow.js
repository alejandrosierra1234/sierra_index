/* Governed Fabric/Garment collections. Data and permissions remain on the server. */
const sampleWorkflowViews = new Map()
const sampleWorkflowStages = {selection:'Selección y costing',preparing:'Preparación PD',packing_review:'Revisión de Ventas',packed:'Listo para salir',shipped:'En camino',delivered:'Entregado',unfulfilled:'Cerrada sin surtido'}
function sampleFlowIcon(name) {
 return siIcon(({list:'list',check:'check',box:'package',arrow:'arrow-right',refresh:'refresh',print:'printer',people:'users',save:'save',clock:'clock'})[name]||'list',16)
}
async function getSampleWorkflow(id) {
 const {data,error}=await sb.from('sample_workflows').select('*').eq('collection_id',id).maybeSingle()
 if(error) throw new Error('No se pudo comprobar el flujo: '+error.message)
 return data
}
async function renderSampleWorkflow(col,items,knownWorkflow=undefined) {
 const root=document.getElementById('sample-workflow-panel')
 if(!root) return
 try {
  const w=knownWorkflow===undefined?await getSampleWorkflow(col.id):knownWorkflow
  const eligible=items.length && items.every(i=>['fabric','garment'].includes(i.products?.division))
  if(!w&&!eligible){root.replaceChildren();return}
  const caps=await Promise.all(['sales','pd'].map(p_cap=>sb.rpc('sample_workflow_can',{p_collection:col.id,p_cap})))
  if(caps.some(r=>r.error))throw new Error('No se pudieron comprobar los permisos del equipo.')
  if(!root.isConnected)return
  const sales=!!caps[0].data,pd=!!caps[1].data
  sampleWorkflowViews.set(col.id,{w,col,items,sales,pd})
  if(!w&&!['draft','requested','approved'].includes(col.status)){root.replaceChildren();return}
  const stage=w?.stage||'selection'
  const stages=stage==='unfulfilled'?['selection','preparing','unfulfilled']:['selection','preparing','packing_review','packed','shipped','delivered'].filter(s=>s!=='packing_review'||w?.destination_kind!=='internal')
  const destination=w?.destination_kind||'client'
  root.innerHTML=`<section class="sf-panel" aria-label="Flujo de la colección">
   <div class="sf-heading"><div><h2>${sampleFlowIcon('box')} Flujo de la colección</h2><p>${w?esc(sampleWorkflowStages[stage]):'Define el destino y libera el trabajo para PD.'}</p></div><button class="btn btn-secondary btn-sm" onclick="showCollectionRecord('${col.id}')" title="Actualizar colección">${sampleFlowIcon('refresh')} Actualizar</button></div>
   ${w?`<ol class="sf-steps">${stages.map((s,i)=>`<li ${s===stage?'aria-current="step"':''} class="${s===stage?'active':''}"><span>${i+1}</span>${esc(sampleWorkflowStages[s])}</li>`).join('')}</ol>`:''}
   ${stage==='selection'?`<details ${!w?.configured?'open':''}><summary>${sampleFlowIcon('people')} Destino y condiciones</summary><fieldset ${sales?'':'disabled'}><legend>¿Quién recibe la colección?</legend><div class="sf-options">${[['client','Cliente'],['brand','Marca'],['internal','Equipo interno']].map(([key,label])=>`<label><input type="radio" name="sf-destination" value="${key}" ${destination===key?'checked':''}>${label}</label>`).join('')}</div><p class="sf-hint">Clientes y marcas requieren aprobación de Ventas antes de la salida. Las entregas internas siempre llevan packing list.</p><label class="sf-label" for="sf-country">País de destino</label><input id="sf-country" maxlength="100" value="${esc(w?.destination_country||'')}" placeholder="Ej. Guatemala"><label class="sf-check"><input id="sf-costing" type="checkbox" ${w?.costing_required?'checked':''}> Completar costing antes de preparar y etiquetar</label><label class="sf-label" for="sf-brief">Necesidad del cliente o instrucciones para PD</label><textarea id="sf-brief" rows="3" placeholder="Aplicación, referencias, colores y fecha de presentación…">${esc(w?.brief||'')}</textarea><details><summary>${sampleFlowIcon('list')} Opciones de etiqueta</summary><label class="sf-label" for="sf-label-title">Encabezado de etiqueta · opcional</label><input id="sf-label-title" maxlength="150" value="${esc(w?.label_title||'')}" placeholder="Nombre de la colección"><label class="sf-check"><input id="sf-label-price" type="checkbox" ${w?.label_show_price?'checked':''}> Incluir precio y condiciones en la etiqueta</label></details>${sales?`<button class="btn btn-secondary btn-sm" onclick="saveSampleWorkflow('${col.id}',this)">${sampleFlowIcon('save')} Guardar condiciones</button>`:''}</fieldset></details>`:`<p class="sf-hint">${destination==='internal'?'Entrega interna · Packing list visible para Ventas':'Cliente o marca · Aprobación de Ventas obligatoria'}${w.costing_required?' · Costing requerido':''}</p>${w.brief?`<details><summary>${sampleFlowIcon('list')} Instrucciones</summary><p class="sf-brief">${esc(w.brief)}</p></details>`:''}`}
   ${w?`<div id="sf-packing"></div><div class="sf-next">${stage==='selection'?`<p>${col.status==='draft'?'Abre Datos de entrega, completa el destinatario y envía la selección.':'Confirma que la selección está completa.'} ${w.costing_required?'Revisa los precios antes de liberar.':''}</p>${sales&&col.status!=='draft'?`<button class="btn btn-primary" onclick="runSampleWorkflow('${col.id}','release',this)">${sampleFlowIcon('check')} Liberar para PD</button>`:''}`:''}
   ${stage==='preparing'?`<p>PD prepara y verifica las muestras. Los faltantes deben llevar una explicación.</p>${pd?`<button class="btn btn-primary" onclick="showDispatch('${col.id}')">${sampleFlowIcon('box')} Preparar muestras</button>`:''}`:''}
   ${stage==='packing_review'?`<p>Revisa el contenido real antes de autorizar la salida.</p>${sales?`<button class="btn btn-primary" onclick="runSampleWorkflow('${col.id}','approve',this)">${sampleFlowIcon('check')} Aprobar packing list</button>`:''}`:''}
   ${stage==='packed'?`<p>Paquete registrado${w.approved_at?' y aprobado por Ventas':''}. Confirma cuando salga físicamente.</p>${pd?`<label class="sf-label" for="sf-tracking">Guía o referencia de entrega</label><input id="sf-tracking" placeholder="Transportista y guía, o constancia de entrega"><button class="btn btn-primary" onclick="runSampleWorkflow('${col.id}','ship',this)">${sampleFlowIcon('arrow')} Confirmar salida</button>`:''}`:''}
   ${stage==='preparing'&&pd&&items.length&&items.every(i=>i.excluded)?`<p>Todas las muestras tienen un faltante registrado. Puedes cerrar sin generar un envío.</p><button class="btn btn-secondary" onclick="runSampleWorkflow('${col.id}','close_unfulfilled',this)">${sampleFlowIcon('check')} Cerrar sin surtido</button>`:''}
   ${stage==='shipped'?`<p>Referencia: ${esc(w.tracking||'—')}</p>${pd?`<button class="btn btn-primary" onclick="runSampleWorkflow('${col.id}','deliver',this)">${sampleFlowIcon('check')} Confirmar recepción</button>`:''}`:''}
   </div><details><summary>${sampleFlowIcon('box')} Existencias de esta selección</summary><p class="sf-hint">Disponible = existencia menos reservas. Consulta actual del almacén por referencia y formato.</p><div id="sf-stock">Consultando inventario…</div></details><details><summary>${sampleFlowIcon('clock')} Historial del flujo</summary><div id="sf-history">Cargando…</div></details>
   ${sales&&['preparing','packing_review','packed'].includes(stage)?`<details><summary>${sampleFlowIcon('refresh')} Cambiar la selección</summary><p>Reabrir libera las reservas e invalida el packing list y su aprobación. Conserva el historial anterior.</p><button class="btn btn-secondary btn-sm" onclick="runSampleWorkflow('${col.id}','reopen',this)">${sampleFlowIcon('refresh')} Reabrir selección</button></details>`:''}`:''}
   <p class="sf-error" id="sf-error" role="alert"></p>
  </section>`
  if(w)await Promise.all([renderSamplePacking(col.id,w.packing_id),renderSampleStock(items,col.id),renderSampleFlowHistory(col.id)])
 }catch(e){root.innerHTML=`<div class="sf-panel" role="alert">${esc(e.message)} <button class="btn btn-secondary btn-sm" onclick="showCollectionRecord('${col.id}')">Reintentar</button></div>`}
}
async function saveSampleWorkflow(id,btn){
 const ctx=sampleWorkflowViews.get(id);if(!ctx)return
 const args={p_collection:id,p_revision:ctx.w?.revision||0,p_destination:document.querySelector('[name="sf-destination"]:checked')?.value,p_costing:document.getElementById('sf-costing').checked,p_brief:document.getElementById('sf-brief').value.trim(),p_label_title:document.getElementById('sf-label-title').value.trim(),p_label_show_price:document.getElementById('sf-label-price').checked,p_country:document.getElementById('sf-country').value.trim()}
 await sampleWorkflowRequest(btn,()=>sb.rpc('configure_sample_workflow',args),id)
}
async function sampleWorkflowRequest(btn,request,id){
 if(btn)btn.disabled=true
 try{const {error}=await request();if(error)throw error;await showCollectionRecord(id)}
 catch(e){const out=document.getElementById('sf-error');if(out)out.textContent=e.message;else toast(e.message)}
 finally{if(btn?.isConnected)btn.disabled=false}
}
async function runSampleWorkflow(id,action,btn){
 const ctx=sampleWorkflowViews.get(id);if(!ctx?.w)return
 await sampleWorkflowRequest(btn,()=>sb.rpc('sample_workflow_action',{p_collection:id,p_revision:ctx.w.revision,p_action:action,p_tracking:document.getElementById('sf-tracking')?.value.trim()||null}),id)
}
async function renderSamplePacking(id,packingId){
 const root=document.getElementById('sf-packing');if(!root||!packingId)return
 const {data,error}=await sb.from('sample_packing_lists').select('*').eq('id',packingId).single()
 if(error){root.textContent='No se pudo cargar el packing list.';return}
 const ctx=sampleWorkflowViews.get(id);if(ctx)ctx.packing=data
 if(!root.isConnected)return
 root.innerHTML=`<details open><summary>${sampleFlowIcon('list')} Packing list · versión ${data.revision}</summary>${samplePackingTable(data.content.items)}<button class="btn btn-secondary btn-sm" onclick="printSamplePacking('${id}')">${sampleFlowIcon('print')} Imprimir packing list</button></details>`
}
function samplePackingTable(items){return `<div class="sf-table-wrap"><table class="sf-table"><thead><tr><th>Muestra</th><th>Formato</th><th>Cantidad</th><th>Resultado</th></tr></thead><tbody>${items.map(i=>`<tr><td><strong>${esc(i.name||i.sample_id)}</strong><small>${esc(i.code||'')} · ${esc(i.sample_id)}</small><small>${esc(i.color||'')} ${esc(i.lot||'')}</small></td><td>${esc(i.format)}</td><td>${esc(String(i.quantity))} ${esc(i.unit==='piece'?(Number(i.quantity)===1?'pieza':'piezas'):i.unit||'')}</td><td>${i.excluded?`Faltante: ${esc(i.reason||'')}`:'Incluida'}</td></tr>`).join('')}</tbody></table></div>`}
function printSamplePacking(id){
 const p=sampleWorkflowViews.get(id)?.packing;if(!p)return
 const win=window.open('','_blank');if(!win){toast('Permite abrir la ventana de impresión');return}
 win.document.write(`<html lang="es"><head><title>Packing list ${esc(p.content.reference)}</title><style>body{font:12px Arial;color:#0b0b0b;margin:32px}table{border-collapse:collapse;width:100%}th,td{text-align:left;border-bottom:1px solid #e5e5e5;padding:10px}small{display:block;color:#444}thead{display:table-header-group}tr{break-inside:avoid}</style></head><body><h1>SIERRA · Packing list</h1><p>${esc(p.content.reference)} · Versión ${p.revision}</p><p>${esc(p.content.recipient||'')} · ${esc(p.content.address||'')} · ${esc(p.content.country||'')}</p>${samplePackingTable(p.content.items)}<p>Registrado: ${esc(new Date(p.created_at).toLocaleString('es'))}</p></body></html>`);win.document.close();win.print()
}
async function renderSampleStock(items,collectionId){
 const root=document.getElementById('sf-stock');if(!root)return
 const ctx=sampleWorkflowViews.get(collectionId)
 const ids=[...new Set(items.map(i=>i.product_id).filter(Boolean))];if(!ids.length){root.textContent='Sin referencias.';return}
 const {data,error}=await sb.from('sample_stock').select('*,inventory_locations(name,active)').in('product_id',ids)
 if(!root.isConnected)return
 if(error){root.textContent='No se pudo consultar inventario. Actualiza para reintentar.';return}
 const canAssign=(ctx.w.stage==='selection'&&ctx.sales)||(['preparing','packing_review','packed'].includes(ctx.w.stage)&&ctx.pd)
 root.innerHTML=`<p class="sf-hint" data-stock-time>Consultado ${esc(new Date().toLocaleTimeString('es'))} · actualización cada 10 segundos</p><p class="sf-hint">El lote seleccionado identifica el color y la unidad del renglón.</p>${items.map(i=>{const stock=(data||[]).filter(s=>s.product_id===i.product_id&&s.format===i.sample_type&&s.inventory_locations?.active);return `<details><summary>${sampleFlowIcon('box')} ${esc(i.products?.name||i.sample_id)} · ${esc(i.sample_type)}</summary>${canAssign?`<label class="sf-label" for="sf-stock-qty-${i.id}">Cantidad solicitada (unidad del lote)</label><input id="sf-stock-qty-${i.id}" type="number" min="0.001" step="0.001" value="${i.quantity}" ${ctx.w.stage!=='selection'?'readonly':''}>`:''}${stock.length?`<div class="sf-table-wrap"><table class="sf-table"><thead><tr><th>Color / lote</th><th>Ubicación</th><th>Disponible</th><th>Selección</th></tr></thead><tbody>${stock.map(r=>`<tr><td>${esc(r.color||'Sin color')}<small>${esc(r.lot||'Sin lote')}</small></td><td>${esc(r.inventory_locations.name)}</td><td data-stock-live="${r.id}">${Number(r.qty)-Number(r.reserved)} ${esc(r.unit==='piece'?'piezas':r.unit)}</td><td>${i.stock_id===r.id&&ctx.w.stage!=='selection'?'Seleccionado':canAssign?`<button class="btn btn-secondary btn-sm" onclick="chooseCollectionSampleStock('${collectionId}','${i.id}','${r.id}',this)">${sampleFlowIcon('check')} ${i.stock_id===r.id?'Actualizar cantidad':'Elegir lote'}</button>`:''}</td></tr>`).join('')}</tbody></table></div>`:'<p>Sin existencia registrada para este formato. PD debe registrar la preparación física o explicar el faltante.</p>'}</details>`}).join('')}`
 if(typeof watchSampleStock==='function')watchSampleStock(root,()=>sb.from('sample_stock').select('*').in('product_id',ids))
}
async function chooseCollectionSampleStock(id,sampleId,stockId,btn){
 const ctx=sampleWorkflowViews.get(id);if(!ctx?.w)return
 await sampleWorkflowRequest(btn,()=>sb.rpc('assign_sample_stock',{p_sample:sampleId,p_stock:stockId,p_revision:ctx.w.revision,p_quantity:Number(document.getElementById('sf-stock-qty-'+sampleId).value)}),id)
}
async function renderSampleFlowHistory(id){
 const root=document.getElementById('sf-history');if(!root)return
 const {data,error}=await sb.from('sample_workflow_events').select('action,revision,created_at').eq('collection_id',id).order('created_at',{ascending:false}).limit(30)
 if(!root.isConnected)return
 const labels={configure:'Condiciones guardadas',release:'Liberada para PD',pack:'Packing list registrado',approve:'Packing list aprobado',ship:'Salida confirmada',deliver:'Recepción confirmada',reopen:'Selección reabierta',verified:'Muestra verificada',excluded:'Faltante registrado',close_unfulfilled:'Cerrada sin surtido'}
 root.innerHTML=error?'No se pudo cargar el historial.':`<ul class="sf-history">${(data||[]).map(e=>`<li>${esc(labels[e.action]||e.action)}<small>Versión ${e.revision} · ${esc(new Date(e.created_at).toLocaleString('es'))}</small></li>`).join('')}</ul>`
}
async function sampleWorkflowLabelAllowed(collectionId){
 if(!collectionId)return true
 try{const w=await getSampleWorkflow(collectionId);if(w&&w.stage==='selection'){toast('Ventas debe liberar la selección y el costing antes de imprimir.');return false}return true}catch(e){toast(e.message);return false}
}
async function printGovernedSampleLabel(item,flow){
 if(flow.stage==='selection'){toast('Ventas debe liberar la selección antes de generar etiquetas.');return}
 const win=window.open('','_blank');if(!win){toast('Permite abrir la ventana de impresión');return}
 win.document.write('<p>Preparando etiqueta…</p>')
 try{
  const [stockResult,cardResult]=await Promise.all([sb.from('sample_stock').select('color,lot,unit').eq('id',item.stock_id).single(),sb.rpc('get_sample_public_card',{p_product:item.product_id})])
  if(stockResult.error||!stockResult.data)throw new Error('Selecciona el lote físico en la colección antes de etiquetar.')
  if(cardResult.error)throw cardResult.error
  if(!cardResult.data)throw new Error('Publica primero la ficha del desarrollo para que el QR tenga un destino disponible.')
  const product=item.released_product;if(!product)throw new Error('Falta la ficha liberada del desarrollo. Reabre y libera la selección.')
  const qr=await new Promise((resolve,reject)=>QRCode.toDataURL(getProductPublicUrl({id:item.product_id})+'&rev='+cardResult.data.revision,{width:240,margin:3,errorCorrectionLevel:'M'},(e,value)=>e?reject(e):resolve(value)))
  const barcode=document.createElementNS('http://www.w3.org/2000/svg','svg');JsBarcode(barcode,item.sample_id,{format:'CODE128',height:45,width:2,displayValue:true,fontSize:12,margin:8})
  const stock=stockResult.data,specs=product.specs||{}
  const fields=[['Referencia',product.code],['Color',stock.color],['Lote',stock.lot],['Composición',specs.Composition],['Ancho',specs.Width],['GSM',specs.GSM],['Formato',item.sample_type],['Cantidad',`${item.quantity} ${stock.unit==='piece'?'piezas':stock.unit}`]]
  const price=flow.label_show_price?`<p class="price">${esc(item.price_currency)} ${Number(item.price).toFixed(2)} / ${esc(item.price_unit==='piece'?'pieza':item.price_unit)}${item.moq?`<small>MOQ ${esc(item.moq)}</small>`:''}${item.price_valid_until?`<small>Vigente hasta ${esc(item.price_valid_until)}</small>`:''}</p>`:''
  win.document.open();win.document.write(`<html lang="es"><head><title>Etiqueta ${esc(item.sample_id)}</title><style>@page{size:62mm auto;margin:0}*{box-sizing:border-box}body{margin:0;color:#0b0b0b;font:10px Arial;background:white}.label{width:62mm;padding:4mm}.logo{font-weight:800;font-size:18px;margin-bottom:8px}h1{font-size:15px;line-height:1.3;margin:8px 0}dl{display:grid;grid-template-columns:22mm 1fr;margin:8px 0;gap:4px}dt{color:#444}dd{margin:0;overflow-wrap:anywhere}.qr{width:24mm;display:block;margin:8px auto}.barcode svg{width:100%;height:auto}.price{font-size:14px;font-weight:bold}small{display:block;font-size:9px;font-weight:normal;margin-top:4px}.tools{margin:12px}button{padding:8px 12px}@media print{.tools{display:none}}</style></head><body><div class="tools"><button onclick="window.print()">Imprimir etiqueta</button></div><section class="label"><div class="logo">SIERRA</div>${flow.label_title?`<p>${esc(flow.label_title)}</p>`:''}<h1>${esc(product.name)}</h1><dl>${fields.filter(([,v])=>v!=null&&v!=='').map(([k,v])=>`<dt>${esc(k)}</dt><dd>${esc(String(v))}</dd>`).join('')}</dl>${price}<img class="qr" src="${qr}" alt="QR de ficha pública"><div class="barcode">${barcode.outerHTML}</div><small>Este código identifica el renglón y la cantidad indicada.</small></section></body></html>`);win.document.close()
  const stamp=new Date().toISOString();const {error}=await sb.from('samples').update({label_printed_at:item.label_printed_at||stamp,...(flow.label_show_price?{sticker_printed_at:item.sticker_printed_at||stamp}:{})}).eq('id',item.id)
  if(error)throw error
  item.label_printed_at=stamp;if(flow.label_show_price)item.sticker_printed_at=stamp
  if(_dispatchCol){_dispatchFlow=await getSampleWorkflow(_dispatchCol.id);renderDispatchScreen()}
 }catch(e){win.close();toast(e.message)}
}

async function markGovernedPreparation(id,verified,reason){
 const {data,error}=await sb.rpc('mark_sample_preparation',{p_sample:id,p_revision:_dispatchFlow.revision,p_verified:verified,p_reason:reason})
 if(error){toast(error.message);return false}
 _dispatchFlow=data;const item=_dispatchItems.find(i=>i.id===id);if(item){item.verified=verified;item.excluded=!verified;item.exclusion_reason=verified?null:reason}renderDispatchScreen();return true
}
function renderGovernedDispatch(){
 const col=_dispatchCol,items=_dispatchItems,flow=_dispatchFlow;const root=document.getElementById('view-sample-detail')
 const resolved=items.filter(i=>i.verified||i.excluded).length,empty=items.length&&items.every(i=>i.excluded)
 root.innerHTML=`<div class="detail-view-inner"><div class="sf-heading"><div><button class="btn btn-ghost" onclick="showCollectionRecord('${col.id}')">${siIcon('arrow-left',16)} Volver a colección</button><h1>Preparar colección</h1><p>${esc(col.name||col.collection_id)} · ${esc(col.recipient||'')} · ${esc(flow.destination_country||'')}</p></div><button class="btn btn-secondary" onclick="showDispatch('${col.id}')">${sampleFlowIcon('refresh')} Actualizar</button></div><section class="sf-panel"><div class="sf-heading"><div><h2>${sampleFlowIcon('box')} Verificación física</h2><p>${resolved} de ${items.length} renglones resueltos. Confirma presencia o explica el faltante.</p></div><button class="btn btn-secondary" onclick="openScanMode('dispatch')">${siIcon('scan',16)} Escanear código</button></div><div class="sf-table-wrap"><table class="sf-table"><thead><tr><th>Muestra</th><th>Lote / cantidad</th><th>Estado</th><th>Preparación</th></tr></thead><tbody>${items.map(i=>`<tr><td><strong>${esc(i.released_product?.name||i.products?.name||i.sample_id)}</strong><small>${esc(i.sample_id)} · ${esc(i.sample_type)}</small></td><td>${i.stock_id?`${esc(i.stock?.color||'')}<small>${esc(i.stock?.lot||'')}</small>`:'Lote pendiente'}<small>${Number(i.quantity)} ${esc(i.stock?.unit==='piece'?'piezas':i.stock?.unit||'')}</small></td><td>${i.excluded?`<strong>Faltante</strong><small>${esc(i.exclusion_reason||'')}</small>`:i.verified?'Verificada':'Pendiente'}</td><td><div class="sf-options">${!i.excluded?`<button class="btn btn-secondary btn-sm" onclick="printBaseLabelFor('${i.id}')">${sampleFlowIcon('print')} ${i.label_printed_at?'Ver etiqueta':'Generar etiqueta'}</button>`:''}${!i.verified?`<button class="btn btn-secondary btn-sm" onclick="dispatchVerify('${i.id}')">${sampleFlowIcon('check')} Confirmar presencia</button>`:''}</div><details><summary>${sampleFlowIcon('list')} ${i.excluded?'Cambiar motivo':'Registrar faltante'}</summary><label class="sf-label" for="exclude-reason-${i.id}">Motivo del faltante</label><input id="exclude-reason-${i.id}" value="${esc(i.exclusion_reason||'')}" placeholder="Ej. No hay existencia del color solicitado"><button class="btn btn-secondary btn-sm" onclick="dispatchExclude('${i.id}')">${sampleFlowIcon('save')} Guardar motivo</button></details></td></tr>`).join('')}</tbody></table></div><p class="sf-hint">El código identifica el renglón y su cantidad. Registrar el paquete reserva existencias; confirmar su salida las descuenta.</p><div class="sf-options"><button class="btn btn-secondary" onclick="showCollectionRecord('${col.id}')">${sampleFlowIcon('list')} Ver selección e inventario</button>${empty?`<button class="btn btn-primary" onclick="closeGovernedUnfulfilled(this)">${sampleFlowIcon('check')} Cerrar sin surtido</button>`:`<button class="btn btn-primary" onclick="finalizeDispatch()" ${resolved!==items.length||!items.length?'disabled':''}>${sampleFlowIcon('box')} Registrar packing list</button>`}</div></section></div>`
}
async function closeGovernedUnfulfilled(btn){btn.disabled=true;const {error}=await sb.rpc('sample_workflow_action',{p_collection:_dispatchCol.id,p_revision:_dispatchFlow.revision,p_action:'close_unfulfilled',p_tracking:null});if(error){toast(error.message);btn.disabled=false;return}await showCollectionRecord(_dispatchCol.id)}

function showSampleTool(title,subtitle,leaf){
 _navLeaf=leaf;syncModule('samples');leaveView()
 document.getElementById('div-toolbar').style.display='none'
 document.getElementById('sec-title').textContent=title
 document.getElementById('sec-sub').textContent=subtitle
 document.getElementById('product-controls').style.display='none'
 document.getElementById('view-products').style.display='block'
 const root=document.getElementById('pg');root.style.display='block';root.innerHTML='<p role="status">Cargando…</p>'
 renderSidebarTree();return root
}
