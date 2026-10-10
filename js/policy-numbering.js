/* Official policy identity belongs to PostgreSQL. No browser counter or offline approval. */
(function(){
 'use strict';
 let catalog=null,loading=null,approving=false;
 const rpc=async(name,args)=>{const {data,error}=await sb.rpc(name,args);if(error)throw error;return data};
 const pendingKey=()=>`policy-approval-pending:${me?.id||''}`;
 function refresh(){
  const form=document.getElementById('policy-form');if(!form||_policyTab!=='info')return;
  const top=form.scrollTop,active=document.activeElement,handler=form.contains(active)&&active.getAttribute('oninput'),id=active?.id,start=active?.selectionStart,end=active?.selectionEnd;
  form.innerHTML=policyInfoPanel();form.scrollTop=top;
  const next=handler?[...form.querySelectorAll('[oninput]')].find(el=>el.getAttribute('oninput')===handler):id?document.getElementById(id):null;
  next?.focus({preventScroll:true});if(next?.setSelectionRange&&typeof start==='number')next.setSelectionRange(start,end);
 }
 async function load(){if(loading)return loading;const accountId=me?.id;loading=(async()=>{try{const result=await rpc('policy_numbering_catalog');if(result?.version!==50||!Array.isArray(result.areas)||!Array.isArray(result.companies))throw Error('Catálogo no disponible');if(me?.id===accountId)catalog={...result,accountId}}catch{catalog=null}finally{loading=null;refresh()}})();return loading}
 function serverCatalog(){return catalog?.accountId===me?.id?catalog:null}
 function areas(){return serverCatalog()?.areas||PolicyCatalog.areas}
 function identityLocked(p){return Boolean(p?.numbering)||/^[A-Z]{2}-[A-Z&]{3}-\d{3}-POL-\d{3}$/.test(p?.code||'')}
 function currentArea(p){return areas().find(a=>a.code===p.areaCode)||areas().find(a=>a.code===PolicyCatalog.area(p.department)?.code)}
 function currentCompany(p){
  const live=serverCatalog()?.companies.find(c=>String(c.id)===String(p.companyId));if(live)return live;
  const company=_policyCompanies.find(c=>String(c.id)===String(p.companyId));if(!company)return null;
  const country=company.countries||(typeof _badge==='object'?_badge.countries?.find(c=>c.id===company.country_id):null);
  return {...company,companyCode:PolicyCatalog.companyCode(company),countryCode:country?.code||'',countryName:country?.name||''};
 }
 const originalOrg=policyLoadOrganization;
 policyLoadOrganization=async function(){await Promise.all([originalOrg(),load()])};
 // The tools panel is transformed during its collapse animation. Put its
 // dedicated menus in the browser's top layer so overflow cannot clip them.
 const originalSelectHtml=policySelect;
 policySelect=function(...args){return originalSelectHtml(...args).replace('class="pd-select-menu"','class="pd-select-menu" popover="manual"')};
 const originalClose=closePdSelects;
 closePdSelects=function(exceptId=null){document.querySelectorAll('.policy-dedicated-select .pd-select-menu[popover]').forEach(menu=>{if(menu.parentElement.id!==`${exceptId}-dd`&&typeof menu.hidePopover==='function'&&menu.matches(':popover-open'))menu.hidePopover()});originalClose(exceptId)};
 const originalToggle=togglePdSelect;
 togglePdSelect=function(event,id){originalToggle(event,id);const dd=document.getElementById(id+'-dd'),menu=dd?.querySelector('.pd-select-menu[popover]');if(menu?.showPopover&&dd.classList.contains('open')){menu.showPopover();positionPdSelect(id)}};
 policyInfoPanel=function(){
  const p=_policyCurrent,company=currentCompany(p),locked=identityLocked(p),area=currentArea(p);
  const options=areas().map(a=>({value:a.code,label:`${a.name} · ${a.code}`,icon:'briefcase'}));
  const oldArea=!area&&p.department?`<small class="policy-field-hint">Área anterior: «${esc(p.department)}». Elige su equivalencia del catálogo.</small>`:'';
  const areaHtml=`<div class="policy-field"><span>Departamento / área</span>${policySelect('policy-area','Departamento / área',options,area?.code||'','Selecciona un área','',locked)}${oldArea}</div>`;
  const pending=company?.companyCode&&company.countryCode&&area?`${company.countryCode}-${company.companyCode}-${area.code}-POL-…`:'Por asignar';
  const legacy=p.legacyCode||(!locked?p.code:'');
  const note=locked?'Código reservado. Para cambiar empresa o área, duplica la política.':company&&!company.companyCode?`${company.name} no tiene abreviatura oficial en el catálogo. Puedes guardar el borrador; la aprobación requiere completar ese dato.`:company&&!company.countryCode?'Falta el país en el registro de la empresa. Puedes continuar guardando el borrador.':!serverCatalog()?'Numeración en la nube no disponible. Puedes seguir editando y guardando el borrador.':'El número definitivo se asigna al aprobar; no necesitas escribirlo.';
  const needsAttention=!locked&&Boolean(company&&(!company.companyCode||!company.countryCode)||!serverCatalog());
  const codeHtml=`<div class="policy-numbering-group"><div class="policy-field-grid policy-code-grid"><div class="policy-field"><span id="policy-code-label">Código automático</span><output class="policy-code-output" aria-labelledby="policy-code-label" aria-describedby="policy-code-note">${esc(locked?p.code:pending)}</output></div>${policyField('version','Versión')}</div><p id="policy-code-note" class="policy-field-hint policy-numbering-note${needsAttention?' is-attention':''}">${siIcon(needsAttention?'info':locked?'lock':'info',15)}<span>${esc(note)}</span></p>${legacy?`<details class="policy-legacy-reference"><summary>Referencia anterior</summary><span>${esc(legacy)}</span><small>Conservada para consulta; no es el código automático.</small></details>`:''}</div>`;
  const derived=`<div class="policy-derived-fields" aria-label="Datos automáticos"><span>${siIcon('globe',14)}<span>${esc(company?.countryName||company?.countryCode||'País según empresa')}</span></span><span>${siIcon('file',14)}<span>Política · POL</span></span></div>`;
  return `<div class="policy-form-section policy-info-section">${policyField('title','Nombre de la política')}<div class="policy-section-label">Clasificación</div><div class="policy-field"><span>Empresa</span>${policySelect('policy-company','Empresa',policyCompanyOptions(),String(p.companyId||''),_policyOrgLoading?'Cargando empresas…':'Selecciona una empresa','',locked||_policyOrgLoading)}${derived}</div>${areaHtml}${policyField('processName','Proceso al que pertenece')}${codeHtml}<div class="policy-section-label">Revisión y aprobación</div><div class="policy-field"><span>Estado</span>${policySelect('policy-status','Estado',policyStatusOptions().map(policyStatusOption),p.status,'Selecciona un estado')}</div><div class="policy-field-grid">${policyField('date','Fecha de aprobación','date')}${policyField('reviewDate','Próxima revisión','date')}</div>${policyField('owner','Responsable del documento')}<label class="policy-confidential-toggle"><input type="checkbox" ${p.confidential?'checked':''} onchange="policySet('confidential',this.checked)"><span><b>Documento confidencial</b><small>Agrega la clasificación y una marca de agua en el documento.</small></span></label><div class="policy-section-label">Control de cambios</div>${policyField('changeControl','Criterio de revisión','textarea')}</div>`;
 };
 const originalSelect=policySelectChanged;
 policySelectChanged=function(value,id){if(id==='policy-area'){if(identityLocked(_policyCurrent)||approving)return;const area=areas().find(a=>a.code===value);if(!area)return;_policyCurrent.areaCode=area.code;_policyCurrent.department=area.name;policyCommit();refresh();document.querySelector('#policy-area-dd .pd-select-btn')?.focus({preventScroll:true});policyRenderPreview();return}originalSelect(value,id)};
 const originalCompany=policySetCompany;
 policySetCompany=function(id){if(identityLocked(_policyCurrent)||approving){toast('La empresa forma parte del código existente y no puede cambiarse.');refresh();return}if(id&&!_policyCompanies.some(c=>String(c.id)===String(id)))return;originalCompany(id)};
 const originalSet=policySet;
 policySet=function(key,value){if(approving||['code','numbering','legacyCode','approvedAt','approvedBy','department','areaCode','companyId','companyName','companyLegalName','countryCode','documentType'].includes(key))return;if(key==='status'&&value==='Aprobada'&&_policyCurrent.status!=='Aprobada'){void approve();return}originalSet(key,value)};
 const originalCommit=policyCommit;
 policyCommit=function(...args){if(_policyCurrent&&!_policyCurrent.numbering){const area=currentArea(_policyCurrent);if(area){_policyCurrent.areaCode=area.code;_policyCurrent.department=area.name}}return originalCommit(...args)};
 async function flush(id){policyFlushPendingSave();if(_policyCloudWrites.has(id))await _policyCloudWrites.get(id);if(_policyCloudDrafts.has(id)||!_policyCurrent?._revision)throw Error('Primero confirma el guardado en la nube. No se puede aprobar con cambios pendientes.');}
 function confirmation(message){return new Promise(resolve=>{commsConfirm('Aprobar política',message,()=>resolve(true),'Aprobar y asignar código');document.querySelector('dialog.comms-confirm')?.addEventListener('close',()=>queueMicrotask(()=>resolve(false)),{once:true})})}
 function progress(message,retry=false){
  let dialog=document.getElementById('policy-approval-progress');if(!dialog){dialog=document.createElement('dialog');dialog.id='policy-approval-progress';dialog.className='comms-confirm';dialog.addEventListener('cancel',event=>event.preventDefault());document.body.append(dialog);dialog.showModal()}
  dialog.replaceChildren();const h=document.createElement('h3');h.textContent=retry?'Aprobación por confirmar':'Confirmando aprobación';const p=document.createElement('p');p.textContent=message;dialog.append(h,p);dialog.setAttribute('aria-label',h.textContent);
  if(retry){const b=document.createElement('button');b.className='btn btn-primary';b.textContent='Verificar y reintentar';b.onclick=()=>resume();dialog.append(b)}
 }
 function finish(){approving=false;document.getElementById('policy-approval-progress')?.remove();refresh();policySyncEditorStatus();policyRenderPreview()}
 async function submit(intent){
  const accountId=me?.id,key=pendingKey();
  progress('La nube está reservando el código. No cierres esta ventana.');
  try{
   const saved=await rpc('policy_approve',{p_policy_id:intent.id,p_revision:intent.revision});
   if(me?.id!==accountId){finish();return}
   if(!saved?.numbering||saved.status!=='Aprobada')throw Error('Respuesta de aprobación incompleta');
   PolicyReview.acceptDocument(saved);localStorage.removeItem(key);policyCloudState('Guardado en la nube','saved');finish();toast(`Política aprobada: ${saved.code}`);
  }catch(error){
   if(me?.id!==accountId){finish();return}
   if(['22023','40001','42501','P0002'].includes(error.code)){
    // A transaction rejected by PostgreSQL allocated nothing. Keep the local copy.
    localStorage.removeItem(pendingKey());finish();toast(error.message||'No se pudo aprobar. Revisa los datos.');
   }else progress('No llegó la confirmación. No emitiremos otro código: verificaremos la misma operación. Tu política sigue protegida.',true);
  }
 }
 async function resume(){let intent;try{intent=JSON.parse(localStorage.getItem(pendingKey())||'null')}catch{}if(!intent)return;approving=true;await submit(intent)}
 async function approve(){
  if(approving||!_policyCurrent||!can('write','communications'))return;
  const id=_policyCurrent.id;approving=true;
  try{
   if(!serverCatalog())await load();
   if(!serverCatalog())throw Error('La numeración automática aún no está disponible en la nube. El borrador se conserva; no se asignará un código manual.');
   if(!_policyCurrent.areaCode&&currentArea(_policyCurrent))policyCommit();
   await flush(id);
   const p=_policyCurrent,company=currentCompany(p),area=currentArea(p);
   if(p?.id!==id)throw Error('La política abierta cambió.');
   if(!p.numbering&&(!company?.companyCode||!area))throw Error('Selecciona una empresa con abreviatura oficial y un área del catálogo antes de aprobar.');
   if(!p.title.trim()||p.title.trim()==='POLÍTICA SIN TÍTULO')throw Error('Escribe el nombre definitivo de la política.');
   const message=p.numbering?`Se conservará el código ${p.code}.`:`Se asignará el siguiente número disponible de ${company.countryCode}-${company.companyCode}-${area.code}-POL. Empresa y área quedarán vinculadas a ese código; no se reutilizará aunque archives la política.`;
   if(!await confirmation(message)){approving=false;refresh();return}
   await flush(id);const intent={id,revision:_policyCurrent._revision};localStorage.setItem(pendingKey(),JSON.stringify(intent));await submit(intent);
  }catch(error){approving=false;refresh();toast(error.message||'No se pudo iniciar la aprobación.')}
 }
 const originalOpen=policyOpen;
 policyOpen=function(id){originalOpen(id);if(!serverCatalog())void load();if(localStorage.getItem(pendingKey()))void resume()};
 // Restoring text never restores someone else's issued identity or approval state.
 const originalVersion=policyVersionSnapshot;
 policyVersionSnapshot=function(p){const result=originalVersion(p);for(const key of ['code','numbering','legacyCode','approvedAt','approvedBy','status','companyId','areaCode','department'])delete result[key];return result};
 window.PolicyNumbering={reload:load,approve,resume};
})();
