/* SIERRA certificates — two-sided landscape Letter certificate creator. */
(function academyModule(){
'use strict';

const ACADEMY_STORE_KEY='sierra-academy-diplomas-v1';
const ACADEMY_RENDER_SCALE=3.125;
const ACADEMY_MAX_SIGNERS=4;
const ACADEMY_MAX_MODULES=14;
const ACADEMY_MAX_RECIPIENTS=100;
const ACADEMY_DECOR_ICONS=['award','book','bulb','target','tools','leaf','factory','certificate'];
let _academyDocs=[];
let _academyCurrent=null;
let _academyTab='data';
let _academyView='active';
let _academyQuery='';
let _academySaveTimer=null;
let _academyCloudAvailable=true;
let _academySaveState='Guardado en línea';
let _academyZoom=.72;
let _academyExporting=false;
let _academyPreviewRecipient='';

function academyId(prefix='academy'){
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
}
function academyIsoDate(){return new Date().toISOString().slice(0,10)}
function academyClone(value){return JSON.parse(JSON.stringify(value))}
function academyText(value,fallback=''){const text=String(value??'').trim();return text||fallback}
function academyNumber(value){const number=Number(value);return Number.isFinite(number)&&number>=0?number:0}
function academyDateLabel(value){
  if(!value)return'Fecha por definir';
  const date=new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime())?value:new Intl.DateTimeFormat('es-GT',{day:'numeric',month:'long',year:'numeric'}).format(date);
}
function academySafeName(value){return academyText(value,'certificado').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,80)||'certificado'}
function academyDefault(){
  const year=new Date().getFullYear();
  return academyNormalize({
    id:academyId(),status:'Borrador',companyId:'',companyName:'',companyLegalName:'',companyLogo:'',companyColor:'#16CDBE',
    decorMode:'pattern',decorIcon:'award',decorImage:'',
    certificateTitle:'Certificado de finalización',recipientName:'Nombre de la persona',recipients:[{uid:academyId('recipient'),name:'Nombre de la persona'}],courseTitle:'Nombre del curso',courseDescription:'Por haber completado satisfactoriamente el programa de formación.',
    issueDate:academyIsoDate(),durationHours:8,certificateNo:`ACA-${year}-001`,location:'',laborRegistration:'',
    signers:[{uid:academyId('signer'),name:'Nombre del firmante',title:'Cargo',signature:''}],
    contents:[
      {uid:academyId('module'),title:'Fundamentos',description:'Conceptos esenciales y contexto del curso.',hours:2},
      {uid:academyId('module'),title:'Aplicación práctica',description:'Ejercicios, casos y herramientas de trabajo.',hours:4},
      {uid:academyId('module'),title:'Evaluación y cierre',description:'Comprobación de aprendizaje y compromisos.',hours:2},
    ],createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),_revision:0,
  });
}
function academyNormalize(source={}){
  const d={...source};
  d.id=academyText(d.id,academyId());d.status=d.status==='Archivado'?'Archivado':'Borrador';
  d.companyId=String(d.companyId||'');d.companyName=String(d.companyName||'');d.companyLegalName=String(d.companyLegalName||'');
  d.companyLogo=typeof policyDurableAssetUrl==='function'?policyDurableAssetUrl(d.companyLogo):String(d.companyLogo||'');
  d.companyColor=typeof companyColor==='function'?companyColor(d.companyColor):/^#[0-9a-f]{6}$/i.test(d.companyColor||'')?d.companyColor:'#16CDBE';
  d.decorMode=['pattern','image'].includes(d.decorMode)?d.decorMode:'pattern';
  d.decorIcon=ACADEMY_DECOR_ICONS.includes(d.decorIcon)?d.decorIcon:'award';
  d.decorImage=String(d.decorImage||'');
  d.certificateTitle=String(d.certificateTitle||d.awardTitle||'Certificado de finalización');d.recipientName=String(d.recipientName||'');
  const recipientSource=Array.isArray(d.recipients)&&d.recipients.length?d.recipients:[{name:d.recipientName}];
  const recipientSeen=new Set();
  d.recipients=recipientSource.slice(0,ACADEMY_MAX_RECIPIENTS).map(item=>typeof item==='string'?{name:item}:item||{}).map(item=>({uid:item.uid||academyId('recipient'),name:String(item.name||'').trim()})).filter(item=>item.name&&!recipientSeen.has(item.name.toLocaleLowerCase('es'))&&recipientSeen.add(item.name.toLocaleLowerCase('es')));
  d.recipientName=d.recipients[0]?.name||d.recipientName;
  d.courseTitle=String(d.courseTitle||'');d.courseDescription=String(d.courseDescription||'');
  d.issueDate=String(d.issueDate||'');d.durationHours=academyNumber(d.durationHours);d.certificateNo=String(d.certificateNo||'');d.location=String(d.location||'');d.laborRegistration=String(d.laborRegistration||'').trim();
  d.signers=(Array.isArray(d.signers)?d.signers:[]).slice(0,ACADEMY_MAX_SIGNERS).map(item=>({uid:item.uid||academyId('signer'),name:String(item.name||''),title:String(item.title||''),signature:String(item.signature||'')}));
  if(!d.signers.length)d.signers=[{uid:academyId('signer'),name:'',title:'',signature:''}];
  d.contents=(Array.isArray(d.contents)?d.contents:[]).slice(0,ACADEMY_MAX_MODULES).map(item=>({uid:item.uid||academyId('module'),title:String(item.title||''),description:String(item.description||''),hours:academyNumber(item.hours)}));
  if(!d.contents.length)d.contents=[{uid:academyId('module'),title:'',description:'',hours:0}];
  d.createdAt=d.createdAt||new Date().toISOString();d.updatedAt=d.updatedAt||d.createdAt;d._revision=Number(d._revision)||0;
  return d;
}
function academyReadLocal(){
  try{return(JSON.parse(localStorage.getItem(ACADEMY_STORE_KEY)||'[]')||[]).map(academyNormalize)}catch{return[]}
}
function academyWriteLocal(){
  localStorage.setItem(ACADEMY_STORE_KEY,JSON.stringify(_academyDocs));
}
function academyApplyCompanyIdentity(d){
  const company=academyCompanies().find(item=>String(item.id)===String(d?.companyId));
  if(!company)return d;
  const previousName=academyText(d.companyName||d.companyLegalName);
  const previousLocation=academyText(d.location);
  d.companyName=String(company.name||company.legal_name||company.code||'');
  d.companyLegalName=String(company.legal_name||'');
  d.companyLogo=typeof policyDurableAssetUrl==='function'?policyDurableAssetUrl(company.logo_url):String(company.logo_url||'');
  d.companyColor=typeof companyColor==='function'?companyColor(company.brand_color):academyHex(company.brand_color);
  if(!previousLocation||/^sierra academia$/i.test(previousLocation)||(previousName&&previousLocation===previousName))d.location=academyIdentityName(d);
  return d;
}
async function academyLoad(){
  _academyDocs=academyReadLocal();
  if(typeof policyLoadOrganization==='function')await policyLoadOrganization();
  _academyDocs=_academyDocs.map(academyApplyCompanyIdentity);
  if(typeof sb==='undefined'||!can('read','academy'))return;
  try{
    const {data,error}=await sb.rpc('academy_diploma_list');
    if(error)throw error;
    const cloud=(Array.isArray(data)?data:[]).map(academyNormalize).map(academyApplyCompanyIdentity);
    const localById=new Map(_academyDocs.map(item=>[item.id,item]));
    cloud.forEach(item=>localById.set(item.id,item));
    _academyDocs=[...localById.values()].sort((a,b)=>String(b.updatedAt).localeCompare(String(a.updatedAt)));
    academyWriteLocal();
  }catch(error){
    if(/academy_diploma_list|schema cache|does not exist|PGRST202/i.test(error?.message||''))_academyCloudAvailable=false;
    else console.warn('No se pudieron cargar los certificados:',error);
  }
}
function academySetSaveState(message,state='saved'){
  _academySaveState=message;
  document.querySelectorAll('[data-academy-save]').forEach(el=>{el.textContent=message;el.dataset.state=state});
}
function academyCommitLocal(){
  if(!_academyCurrent)return;
  _academyCurrent.updatedAt=new Date().toISOString();
  const index=_academyDocs.findIndex(item=>item.id===_academyCurrent.id);
  if(index<0)_academyDocs.unshift(_academyCurrent);else _academyDocs[index]=_academyCurrent;
  academyWriteLocal();
}
function academyAutosave(){
  if(!_academyCurrent||!can('write','academy'))return;
  academyCommitLocal();academySetSaveState('Guardando…','saving');
  clearTimeout(_academySaveTimer);_academySaveTimer=setTimeout(academySaveCloud,650);
}
async function academySaveCloud(){
  if(!_academyCurrent)return;
  const snapshot=academyClone(_academyCurrent);
  if(!_academyCloudAvailable||typeof sb==='undefined'){academySetSaveState('Guardado en este dispositivo','local');return}
  try{
    const {data,error}=await sb.rpc('academy_diploma_save',{p_snapshot:snapshot});
    if(error)throw error;
    if(data&&_academyCurrent?.id===snapshot.id){
      const saved=academyNormalize(data);Object.assign(_academyCurrent,saved);academyCommitLocal();
    }
    academySetSaveState('Guardado en línea','saved');
  }catch(error){
    if(/academy_diploma_save|schema cache|does not exist|PGRST202/i.test(error?.message||''))_academyCloudAvailable=false;
    academySetSaveState('Guardado en este dispositivo','local');
    console.warn('Autoguardado de certificados:',error);
  }
}

function academyCompanies(){return typeof _policyCompanies!=='undefined'&&Array.isArray(_policyCompanies)?_policyCompanies:[]}
function academyCompany(){return academyCompanies().find(company=>String(company.id)===String(_academyCurrent?.companyId))||null}
function academyCompanyOptions(){return[{value:'',label:'Selecciona una empresa',icon:'building'},...academyCompanies().map(company=>({value:String(company.id),label:company.name||company.legal_name||company.code||'Empresa',icon:'building'}))]}
function academyHex(value,fallback='#16CDBE'){
  const color=String(value||'').trim().toUpperCase();return /^#[0-9A-F]{6}$/.test(color)?color:fallback;
}
function academyMix(color,target,weight){
  const from=academyHex(color),to=academyHex(target),ratio=Math.max(0,Math.min(1,Number(weight)||0));
  const channel=index=>Math.round(parseInt(from.slice(index,index+2),16)*(1-ratio)+parseInt(to.slice(index,index+2),16)*ratio).toString(16).padStart(2,'0');
  return`#${channel(1)}${channel(3)}${channel(5)}`.toUpperCase();
}
function academyPalette(d=_academyCurrent){
  const base=academyHex(d?.companyColor);return{light:academyMix(base,'#FFFFFF',.78),base,dark:academyMix(base,'#0B0B0B',.34)};
}
function academyIdentityName(d=_academyCurrent){return academyText(d?.companyName||d?.companyLegalName,'Empresa por seleccionar')}
function academyStyle(d){const palette=academyPalette(d);return`--academy-light:${palette.light};--academy-accent:${palette.base};--academy-dark:${palette.dark}`}
function academyPickCompany(value){
  if(!_academyCurrent||!can('write','academy'))return;
  const company=academyCompanies().find(item=>String(item.id)===String(value));
  _academyCurrent.companyId=company?.id||'';_academyCurrent.companyName=company?.name||'';_academyCurrent.companyLegalName=company?.legal_name||'';
  _academyCurrent.companyLogo=typeof policyDurableAssetUrl==='function'?policyDurableAssetUrl(company?.logo_url):String(company?.logo_url||'');
  _academyCurrent.companyColor=typeof companyColor==='function'?companyColor(company?.brand_color):'#16CDBE';
  _academyCurrent.location=company?academyIdentityName(_academyCurrent):'';
  const identityLabel=document.querySelector('.academy-editor-head p');if(identityLabel)identityLabel.textContent=`${academyIdentityName()} · Certificado`;
  academyAutosave();academyRenderPreview();academyRenderPanel();
}

function academyLogoHtml(d,compact=false){
  const label=academyIdentityName(d);
  if(d.companyLogo)return`<img src="${escAttr(d.companyLogo)}" alt="Logo de ${escAttr(label)}" crossorigin="anonymous" loading="eager" decoding="sync">`;
  return`<span class="academy-company-wordmark" aria-label="${escAttr(label)}">${esc(label)}</span>`;
}
function academyRecipientDocuments(d=_academyCurrent){
  const recipients=d?.recipients?.length?d.recipients:[{uid:'recipient-fallback',name:d?.recipientName||''}];
  return recipients.map((recipient,index)=>{
    const copy=academyClone(d);copy.recipientName=recipient.name;
    if(recipients.length>1&&copy.certificateNo)copy.certificateNo=`${copy.certificateNo}-${String(index+1).padStart(2,'0')}`;
    copy._recipientUid=recipient.uid;copy._recipientIndex=index;return copy;
  });
}
function academyPreviewDocument(){
  const documents=academyRecipientDocuments();
  return documents.find(item=>item._recipientUid===_academyPreviewRecipient)||documents[0]||_academyCurrent;
}
function academyDecorHtml(d){
  if(d.decorMode==='image'&&d.decorImage)return`<aside class="academy-identity-rail is-image" aria-hidden="true"><img src="${escAttr(d.decorImage)}" alt=""></aside>`;
  return`<aside class="academy-identity-rail is-accent" aria-hidden="true"></aside>`;
}
function academyTotalHours(d){return d.contents.reduce((sum,item)=>sum+academyNumber(item.hours),0)||academyNumber(d.durationHours)}
function academySignerHtml(signer){
  const name=signer.name||'Nombre del firmante';
  return`<div class="academy-signature"><div class="academy-signature-art">${signer.signature?`<img src="${escAttr(signer.signature)}" alt="Firma de ${escAttr(name)}">`:`<span class="academy-signature-script">${esc(name)}</span>`}</div><span class="academy-signature-line"></span><strong>${esc(name)}</strong><small>${esc(signer.title||'Cargo')}</small></div>`;
}
function academyFrontHtml(d=_academyCurrent){
  const signers=d.signers.slice(0,ACADEMY_MAX_SIGNERS),identity=academyIdentityName(d),title=academyText(d.certificateTitle,'Certificado de finalización'),nameLength=String(d.recipientName||'').length,titleLength=title.length,copyLength=String(d.courseDescription||'').length;
  const density=`${d.decorMode==='image'&&d.decorImage?' is-decor-image':''}${nameLength>58?' is-name-extra-long':nameLength>34?' is-name-long':''}${titleLength>64?' is-title-extra-long':titleLength>38?' is-title-long':''}${copyLength>160?' is-copy-dense':''}`;
  return`<article class="academy-sheet academy-front${density}" style="${academyStyle(d)}" data-academy-face="front">
    ${academyDecorHtml(d)}
    <header class="academy-document-head"><div class="academy-document-logo">${academyLogoHtml(d)}</div><div class="academy-document-id"><span>${esc(identity)}</span><b>${esc(d.certificateNo||'CERTIFICADO')}</b></div></header>
    <main class="academy-front-main"><section class="academy-certificate-block"><h1>${esc(title)}</h1></section><section class="academy-recipient-block"><p class="academy-awarded">Se otorga a</p><h2>${esc(d.recipientName||'Nombre de la persona')}</h2><span class="academy-recipient-rule"></span></section><section class="academy-course-block"><p class="academy-achievement">${esc(d.courseDescription||'Por haber completado satisfactoriamente el programa de formación.')}</p><h3>${esc(d.courseTitle||'Nombre del curso')}</h3></section>
      <div class="academy-facts"><span><small>Fecha</small><b>${esc(academyDateLabel(d.issueDate))}</b></span><span><small>Duración</small><b>${esc(String(academyNumber(d.durationHours)||academyTotalHours(d)))} horas</b></span><span><small>Emisión</small><b>${esc(d.location||identity)}</b></span></div>
    </main>
    <footer class="academy-front-footer"><div class="academy-signatures academy-signatures-${signers.length}">${signers.map(academySignerHtml).join('')}</div><div class="academy-authenticity"><span class="academy-authenticity-icon">${siIcon('certificate',19)}</span><div class="academy-authenticity-copy"><small>Documento emitido por</small><b>${esc(identity)}</b></div>${d.laborRegistration?`<div class="academy-registration-seal"><small>Registro MINTRAB</small><b>${esc(d.laborRegistration)}</b></div>`:''}</div></footer>
  </article>`;
}
function academyBackHtml(d=_academyCurrent){
  const total=academyTotalHours(d),dense=`${d.decorMode==='image'&&d.decorImage?' is-decor-image':''}${d.contents.length>9?' is-extra-dense':d.contents.length>6?' is-dense':''}`,identity=academyIdentityName(d);
  return`<article class="academy-sheet academy-back${dense}" style="${academyStyle(d)}" data-academy-face="back">
    ${academyDecorHtml(d)}
    <header class="academy-back-head"><div class="academy-document-logo">${academyLogoHtml(d,true)}</div><div><p>${esc(identity)} · Registro de formación</p><h1>Contenido del curso</h1></div><span class="academy-back-code">${esc(d.certificateNo||'CERTIFICADO')}</span></header>
    <div class="academy-course-summary"><div><small>Participante</small><strong>${esc(d.recipientName||'Nombre de la persona')}</strong></div><div><small>Programa</small><strong>${esc(d.courseTitle||'Nombre del curso')}</strong></div><div><small>Duración total</small><strong>${esc(String(total))} horas</strong></div></div>
    <main class="academy-curriculum"><div class="academy-curriculum-head"><span>No.</span><span>Módulo</span><span>Contenido</span><span>Horas</span></div>${d.contents.map((item,index)=>`<div class="academy-curriculum-row"><b>${String(index+1).padStart(2,'0')}</b><strong>${esc(item.title||'Módulo sin título')}</strong><p>${esc(item.description||'Contenido por definir')}</p><span>${esc(String(academyNumber(item.hours)))}</span></div>`).join('')}<div class="academy-curriculum-total"><span>Total acreditado</span><b>${esc(String(total))} horas</b></div></main>
    <footer class="academy-back-footer"><p>Este documento acredita la participación indicada en el programa y fecha registrados.</p><div><span>${esc(identity)}</span><b>${esc(d.certificateNo||'CERTIFICADO')}</b></div></footer>
  </article>`;
}

function academyLibraryResults(){
  const archived=_academyView==='archived',query=_academyQuery.trim().toLocaleLowerCase('es');
  return _academyDocs.filter(d=>(d.status==='Archivado')===archived&&(!query||[d.recipientName,...(d.recipients||[]).map(item=>item.name),d.certificateTitle,d.courseTitle,d.certificateNo,d.companyName].some(value=>String(value||'').toLocaleLowerCase('es').includes(query)))).sort((a,b)=>String(b.updatedAt).localeCompare(String(a.updatedAt)));
}
function academyLibraryCard(d){
  const archived=d.status==='Archivado';
  const count=d.recipients?.length||1,preview=academyRecipientDocuments(d)[0]||d;
  return`<article class="academy-card"><button class="academy-card-preview" onclick="academyOpen('${d.id}')" aria-label="Abrir certificado de ${escAttr(d.recipientName||'participante')}"><span class="academy-card-sheet">${academyFrontHtml(preview)}</span></button><div class="academy-card-copy"><span class="academy-card-kicker">${siIcon('certificate',14)} ${esc(d.certificateNo||'Sin folio')}</span><h3>${esc(d.recipientName||'Persona por definir')}${count>1?` <span class="academy-batch-count">+${count-1}</span>`:''}</h3><p>${esc(d.courseTitle||'Curso por definir')}</p><small>${count} ${count===1?'participante':'participantes'} · ${esc(d.companyName||'Empresa por seleccionar')} · ${esc(academyDateLabel(d.issueDate))}</small></div><div class="academy-card-actions"><button class="btn btn-ghost btn-sm" onclick="academyDuplicate('${d.id}')">${siIcon('copy',14)} Duplicar</button><button class="btn btn-ghost btn-sm" onclick="academyArchive('${d.id}')">${siIcon(archived?'rotate-ccw':'archive',14)} ${archived?'Restaurar':'Archivar'}</button><button class="btn btn-secondary btn-sm" onclick="academyOpen('${d.id}')">${siIcon(can('write','academy')?'file-edit':'eye',14)} ${can('write','academy')?'Abrir':'Ver'}</button></div></article>`;
}
function academyRenderLibrary(){
  const pg=document.getElementById('pg'),rows=academyLibraryResults(),active=_academyDocs.filter(d=>d.status!=='Archivado').length,archived=_academyDocs.length-active,writable=can('write','academy');
  document.getElementById('sec-title').textContent='Certificados';document.getElementById('sec-sub').textContent='Certificados y constancias de formación';clearSecCrumbs();
  pg.innerHTML=`<section class="academy-library"><div class="academy-library-tabs"><div role="tablist" aria-label="Vistas de certificados"><button role="tab" aria-selected="${_academyView==='active'}" onclick="academySetView('active')">Activos <span>${active}</span></button><button role="tab" aria-selected="${_academyView==='archived'}" onclick="academySetView('archived')">Archivados <span>${archived}</span></button></div>${writable?`<button class="btn btn-primary" onclick="academyNew()">${siIcon('plus',16)} Crear certificado</button>`:''}</div><div class="academy-library-tools"><label>${siIcon('search',17)}<input id="academy-search" class="control-input" type="search" value="${escAttr(_academyQuery)}" placeholder="Buscar por persona, curso, folio o empresa" oninput="academySearch(this.value)"></label><span>${rows.length} ${rows.length===1?'certificado':'certificados'}</span></div><div class="academy-library-grid">${rows.length?rows.map(academyLibraryCard).join(''):`<div class="academy-empty">${siIcon('certificate',30)}<h3>${_academyView==='archived'?'No hay certificados archivados':'Crea el primer certificado'}</h3><p>El frente acredita el logro y el reverso conserva el contenido del curso.</p>${writable&&_academyView==='active'?`<button class="btn btn-primary" onclick="academyNew()">Crear certificado</button>`:''}</div>`}</div></section>`;
}
function academySetView(view){_academyView=view==='archived'?'archived':'active';academyRenderLibrary()}
function academySearch(value){_academyQuery=value;academyRenderLibrary();requestAnimationFrame(()=>{const input=document.getElementById('academy-search');if(input){input.focus();input.setSelectionRange(value.length,value.length)}})}
function academyNew(){if(!can('write','academy'))return;_academyCurrent=academyDefault();_academyPreviewRecipient=_academyCurrent.recipients[0]?.uid||'';_academyDocs.unshift(_academyCurrent);academyCommitLocal();academyAutosave();academyRenderEditor()}
function academyOpen(id){const found=_academyDocs.find(item=>item.id===id);if(!found)return;_academyCurrent=academyApplyCompanyIdentity(found);_academyPreviewRecipient=found.recipients?.[0]?.uid||'';academyCommitLocal();academyRenderEditor()}
function academyBack(){clearTimeout(_academySaveTimer);if(_academyCurrent)academyCommitLocal();_academyCurrent=null;_academyPreviewRecipient='';academyRenderLibrary()}
function academyDuplicate(id){if(!can('write','academy'))return;const source=_academyDocs.find(item=>item.id===id);if(!source)return;const copy=academyNormalize({...academyClone(source),id:academyId(),recipientName:`${source.recipientName||'Certificado'} — copia`,certificateNo:'',status:'Borrador',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),_revision:0});_academyDocs.unshift(copy);academyWriteLocal();_academyCurrent=copy;academyAutosave();academyRenderEditor()}
async function academyArchive(id){
  if(!can('write','academy'))return;const d=_academyDocs.find(item=>item.id===id);if(!d)return;d.status=d.status==='Archivado'?'Borrador':'Archivado';d.updatedAt=new Date().toISOString();academyWriteLocal();
  if(_academyCloudAvailable&&typeof sb!=='undefined'){const {error}=await sb.rpc('academy_diploma_save',{p_snapshot:d});if(error)console.warn(error)}academyRenderLibrary();
}

function academyField(label,key,type='text',attrs=''){
  const value=_academyCurrent?.[key]??'';
  return`<label class="academy-field"><span>${esc(label)}</span>${type==='textarea'?`<textarea class="control-input" ${attrs} oninput="academySet('${key}',this.value)">${esc(value)}</textarea>`:`<input class="control-input" type="${type}" value="${escAttr(value)}" ${attrs} oninput="academySet('${key}',this.value)">`}</label>`;
}
function academyDataPanel(){
  const companyNote=_academyCurrent.companyId?(_academyCurrent.companyLogo?'Logo, nombre, emisor y paleta se aplican automáticamente a las dos caras.':'Esta empresa no tiene logotipo configurado; el documento usará su nombre como firma visual.'):'Selecciona la entidad que emite el certificado. Toda la identidad del documento cambiará con ella.';
  return`<section class="academy-form-section"><div class="academy-section-label">Entidad emisora</div><label class="academy-field"><span>Empresa</span>${pdSelect('academy-company',academyCompanyOptions(),String(_academyCurrent.companyId||''),'Selecciona una empresa','academyPickCompany')}</label><p class="academy-inline-note">${siIcon('info',15)} <span>${esc(companyNote)}</span></p><div class="academy-section-label">Certificado</div>${academyField('Tipo o título del certificado','certificateTitle','text','maxlength="90" placeholder="Ej. Certificado de participación"')}${academyField('Nombre del curso','courseTitle','text','maxlength="110"')}${academyField('Texto acreditativo','courseDescription','textarea','maxlength="220" rows="3"')}<div class="academy-field-grid">${academyField('Fecha de emisión','issueDate','date')}${academyField('Duración total (horas)','durationHours','number','min="0" step="0.5"')}</div><div class="academy-field-grid">${academyField('Prefijo del certificado','certificateNo','text','maxlength="40"')}${academyField('Unidad emisora','location','text','maxlength="70"')}</div>${academyField('Registro Ministerio de Trabajo','laborRegistration','text','maxlength="48" placeholder="Ej. 90028481"')}<p class="academy-field-help">Se mostrará como un sello de registro junto a la entidad emisora.</p><p class="academy-inline-note">${siIcon('users',15)} <span>Agrega una o más personas en <b>Personas</b>. En un lote, cada certificado recibe un consecutivo automático.</span></p></section>`;
}
function academyParticipantsPanel(){
  const recipients=_academyCurrent.recipients||[],selected=_academyPreviewRecipient||recipients[0]?.uid||'';
  return`<section class="academy-form-section"><div class="academy-panel-intro"><div><div class="academy-section-label">Participantes</div><p>Pega una lista desde Excel o escribe un nombre por línea. El diseño, contenido y firmantes se aplican a todo el lote.</p></div><span class="academy-recipient-count" id="academy-recipient-count">${recipients.length}/${ACADEMY_MAX_RECIPIENTS}</span></div><label class="academy-field"><span>Lista de nombres</span><textarea class="control-input academy-recipient-input" rows="9" maxlength="9000" placeholder="Ana López&#10;Carlos Méndez&#10;Luisa Alburez" oninput="academySetRecipients(this.value)">${esc(recipients.map(item=>item.name).join('\n'))}</textarea><small>Se eliminan líneas vacías y nombres duplicados.</small></label>${recipients.length?`<div class="academy-recipient-preview"><div class="academy-section-label">Persona en vista previa</div><div class="academy-recipient-list">${recipients.map((item,index)=>`<button type="button" class="academy-recipient-row" aria-pressed="${selected===item.uid}" onclick="academySelectRecipient('${item.uid}')"><span>${String(index+1).padStart(2,'0')}</span><b>${esc(item.name)}</b>${selected===item.uid?siIcon('eye',15):''}</button>`).join('')}</div></div>`:`<div class="academy-recipient-empty">${siIcon('users',22)}<b>Agrega al menos una persona</b><span>La primera aparecerá inmediatamente en la vista previa.</span></div>`}</section>`;
}
function academyDesignPanel(){
  const imageMode=_academyCurrent.decorMode==='image',palette=academyPalette(),identity=academyIdentityName();
  return`<section class="academy-form-section"><div><div class="academy-section-label">Dirección visual</div><p class="academy-design-help">Las dos caras usan una retícula fija de 12 columnas: <b>9 para el documento</b> y <b>3 para la pleca visual</b>.</p></div><div class="academy-brand-palette" aria-label="Paleta automática de ${escAttr(identity)}"><span style="--swatch:${palette.light}"><i></i><b>Claro</b><small>${palette.light}</small></span><span style="--swatch:${palette.base}"><i></i><b>Base</b><small>${palette.base}</small></span><span style="--swatch:${palette.dark}"><i></i><b>Oscuro</b><small>${palette.dark}</small></span></div><p class="academy-inline-note">${siIcon('lock',15)} <span>La paleta está vinculada a ${esc(identity)} para preservar consistencia y trazabilidad.</span></p><div class="academy-section-label">Pleca de 3 columnas</div><div class="academy-decor-mode" role="group" aria-label="Contenido de la pleca visual"><button type="button" aria-pressed="${!imageMode}" onclick="academySetDecorMode('pattern')">${siIcon('minus',17)} Color</button><button type="button" aria-pressed="${imageMode}" onclick="academySetDecorMode('image')">${siIcon('photo',17)} Imagen o ilustración</button></div>${imageMode?`<label class="academy-decor-upload">${_academyCurrent.decorImage?`<img src="${escAttr(_academyCurrent.decorImage)}" alt="Vista previa del recurso lateral">`:`<span>${siIcon('upload',21)}<b>Agregar imagen o ilustración</b><small>Usa un recurso autorizado, vertical y con una composición que admita recorte.</small></span>`}<input type="file" accept="image/png,image/jpeg,image/webp" onchange="academyDecorImage(this)"></label>${_academyCurrent.decorImage?`<button type="button" class="btn btn-ghost btn-sm" onclick="academyClearDecorImage()">${siIcon('trash',14)} Quitar recurso</button>`:''}`:`<p class="academy-design-help">La pleca usa la gama corporativa de la empresa y mantiene la misma medida en ambas caras.</p>`}</section>`;
}
function academyContentsPanel(){
  return`<section class="academy-form-section"><div class="academy-panel-intro"><div><div class="academy-section-label">Contenido del curso</div><p>Se imprime como tabla en el reverso. Máximo ${ACADEMY_MAX_MODULES} módulos.</p></div><button class="btn btn-secondary btn-sm" onclick="academyAddModule()" ${_academyCurrent.contents.length>=ACADEMY_MAX_MODULES?'disabled':''}>${siIcon('plus',14)} Agregar módulo</button></div><div class="academy-module-list">${_academyCurrent.contents.map((item,index)=>`<article class="academy-module-editor"><header><b>${String(index+1).padStart(2,'0')}</b><span>Módulo ${index+1}</span><div><button class="icon-btn icon-btn-quiet" onclick="academyMoveModule('${item.uid}',-1)" aria-label="Subir módulo" ${index===0?'disabled':''}>${siIcon('arrow-up',15)}</button><button class="icon-btn icon-btn-quiet" onclick="academyMoveModule('${item.uid}',1)" aria-label="Bajar módulo" ${index===_academyCurrent.contents.length-1?'disabled':''}>${siIcon('arrow-down',15)}</button><button class="icon-btn icon-btn-quiet" onclick="academyRemoveModule('${item.uid}')" aria-label="Eliminar módulo" ${_academyCurrent.contents.length===1?'disabled':''}>${siIcon('trash',15)}</button></div></header><label class="academy-field"><span>Título</span><input class="control-input" maxlength="70" value="${escAttr(item.title)}" oninput="academySetModule('${item.uid}','title',this.value)"></label><label class="academy-field"><span>Contenido</span><textarea class="control-input" maxlength="180" rows="2" oninput="academySetModule('${item.uid}','description',this.value)">${esc(item.description)}</textarea></label><label class="academy-field academy-hours"><span>Horas</span><input class="control-input" type="number" min="0" step="0.5" value="${escAttr(item.hours)}" oninput="academySetModule('${item.uid}','hours',this.value)"></label></article>`).join('')}</div><div class="academy-hours-total"><span>Total del temario</span><b>${academyTotalHours(_academyCurrent)} horas</b></div></section>`;
}
function academySignersPanel(){
  return`<section class="academy-form-section"><div class="academy-panel-intro"><div><div class="academy-section-label">Firmantes</div><p>Se muestran en el frente. Puedes agregar hasta ${ACADEMY_MAX_SIGNERS} personas.</p></div><button class="btn btn-secondary btn-sm" onclick="academyAddSigner()" ${_academyCurrent.signers.length>=ACADEMY_MAX_SIGNERS?'disabled':''}>${siIcon('plus',14)} Agregar firmante</button></div><div class="academy-signer-list">${_academyCurrent.signers.map((signer,index)=>`<article class="academy-signer-editor"><header><b>Firmante ${index+1}</b><button class="icon-btn icon-btn-quiet" onclick="academyRemoveSigner('${signer.uid}')" aria-label="Eliminar firmante" ${_academyCurrent.signers.length===1?'disabled':''}>${siIcon('trash',15)}</button></header><div class="academy-field-grid"><label class="academy-field"><span>Nombre</span><input class="control-input" maxlength="70" value="${escAttr(signer.name)}" oninput="academySetSigner('${signer.uid}','name',this.value)"></label><label class="academy-field"><span>Cargo</span><input class="control-input" maxlength="80" value="${escAttr(signer.title)}" oninput="academySetSigner('${signer.uid}','title',this.value)"></label></div><label class="academy-signature-upload">${signer.signature?`<img src="${escAttr(signer.signature)}" alt="Firma de ${escAttr(signer.name||'firmante')}">`:`<span>${siIcon('upload',18)}<b>Agregar firma</b><small>PNG o JPG con fondo transparente o blanco</small></span>`}<input type="file" accept="image/png,image/jpeg,image/webp" onchange="academySignerImage('${signer.uid}',this)"></label>${signer.signature?`<button class="btn btn-ghost btn-sm" onclick="academyClearSignerImage('${signer.uid}')">${siIcon('trash',14)} Quitar firma</button>`:''}</article>`).join('')}</div></section>`;
}
function academyRenderPanel(){
  const panel=document.getElementById('academy-form');if(!panel||!_academyCurrent)return;
  panel.innerHTML=_academyTab==='participants'?academyParticipantsPanel():_academyTab==='content'?academyContentsPanel():_academyTab==='signers'?academySignersPanel():_academyTab==='design'?academyDesignPanel():academyDataPanel();
  panel.classList.toggle('is-readonly',!can('write','academy'));
  if(!can('write','academy'))panel.querySelectorAll('input,textarea,button').forEach(control=>{control.disabled=true});
}
function academySelectTab(tab){_academyTab=['data','design','participants','content','signers'].includes(tab)?tab:'data';document.querySelectorAll('[data-academy-tab]').forEach(button=>button.setAttribute('aria-selected',String(button.dataset.academyTab===_academyTab)));academyRenderPanel()}
function academySet(key,value){if(!_academyCurrent||!can('write','academy'))return;_academyCurrent[key]=key==='durationHours'?academyNumber(value):value;academyAutosave();academyRenderPreview();if(/^decor(?:Icon|Bg|Fg)$/.test(key))academyRenderPanel()}
function academySetRecipients(value){
  if(!_academyCurrent||!can('write','academy'))return;
  const existing=new Map((_academyCurrent.recipients||[]).map(item=>[item.name.toLocaleLowerCase('es'),item.uid])),seen=new Set();
  const names=String(value||'').split(/\r?\n/).map(name=>name.trim().replace(/\s+/g,' ')).filter(name=>{const key=name.toLocaleLowerCase('es');if(!name||seen.has(key))return false;seen.add(key);return true}).slice(0,ACADEMY_MAX_RECIPIENTS);
  _academyCurrent.recipients=names.map(name=>({uid:existing.get(name.toLocaleLowerCase('es'))||academyId('recipient'),name}));
  _academyCurrent.recipientName=names[0]||'';
  if(!_academyCurrent.recipients.some(item=>item.uid===_academyPreviewRecipient))_academyPreviewRecipient=_academyCurrent.recipients[0]?.uid||'';
  const counter=document.getElementById('academy-recipient-count');if(counter)counter.textContent=`${names.length}/${ACADEMY_MAX_RECIPIENTS}`;
  academyAutosave();academyRenderPreview();
}
function academySelectRecipient(uid){if(!_academyCurrent?.recipients?.some(item=>item.uid===uid))return;_academyPreviewRecipient=uid;academyRenderPanel();academyRenderPreview()}
function academySetDecorMode(mode){if(!_academyCurrent||!can('write','academy'))return;_academyCurrent.decorMode=mode==='image'?'image':'pattern';academyAutosave();academyRenderPanel();academyRenderPreview()}
function academyClearDecorImage(){if(!_academyCurrent||!can('write','academy'))return;_academyCurrent.decorImage='';academyAutosave();academyRenderPanel();academyRenderPreview()}
async function academyDecorImage(input){
  const file=input?.files?.[0];if(!file||!_academyCurrent||!can('write','academy'))return;
  try{
    const value=typeof commsPrepareImageFile==='function'?await commsPrepareImageFile(file,{maxDimension:1800,quality:.88}):await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result||''));reader.onerror=()=>reject(reader.error||Error('No se pudo leer la imagen.'));reader.readAsDataURL(file)});
    _academyCurrent.decorImage=value;_academyCurrent.decorMode='image';academyAutosave();academyRenderPanel();academyRenderPreview();
  }catch(error){console.error(error);toast(error.message||'No se pudo procesar la imagen.')}
}
function academySetModule(uid,key,value){const item=_academyCurrent?.contents.find(row=>row.uid===uid);if(!item||!can('write','academy'))return;item[key]=key==='hours'?academyNumber(value):value;academyAutosave();academyRenderPreview();const total=document.querySelector('.academy-hours-total b');if(total)total.textContent=`${academyTotalHours(_academyCurrent)} horas`}
function academyAddModule(){if(!_academyCurrent||!can('write','academy')||_academyCurrent.contents.length>=ACADEMY_MAX_MODULES)return;_academyCurrent.contents.push({uid:academyId('module'),title:'Nuevo módulo',description:'Contenido por definir',hours:0});academyAutosave();academyRenderPanel();academyRenderPreview()}
function academyRemoveModule(uid){if(!_academyCurrent||_academyCurrent.contents.length===1||!can('write','academy'))return;_academyCurrent.contents=_academyCurrent.contents.filter(item=>item.uid!==uid);academyAutosave();academyRenderPanel();academyRenderPreview()}
function academyMoveModule(uid,direction){const index=_academyCurrent?.contents.findIndex(item=>item.uid===uid);const target=index+direction;if(index<0||target<0||target>=_academyCurrent.contents.length||!can('write','academy'))return;[_academyCurrent.contents[index],_academyCurrent.contents[target]]=[_academyCurrent.contents[target],_academyCurrent.contents[index]];academyAutosave();academyRenderPanel();academyRenderPreview()}
function academySetSigner(uid,key,value){const signer=_academyCurrent?.signers.find(item=>item.uid===uid);if(!signer||!can('write','academy'))return;signer[key]=value;academyAutosave();academyRenderPreview()}
function academyAddSigner(){if(!_academyCurrent||!can('write','academy')||_academyCurrent.signers.length>=ACADEMY_MAX_SIGNERS)return;_academyCurrent.signers.push({uid:academyId('signer'),name:'Nuevo firmante',title:'Cargo',signature:''});academyAutosave();academyRenderPanel();academyRenderPreview()}
function academyRemoveSigner(uid){if(!_academyCurrent||_academyCurrent.signers.length===1||!can('write','academy'))return;_academyCurrent.signers=_academyCurrent.signers.filter(item=>item.uid!==uid);academyAutosave();academyRenderPanel();academyRenderPreview()}
function academyClearSignerImage(uid){academySetSigner(uid,'signature','');academyRenderPanel()}
async function academySignerImage(uid,input){
  const file=input.files?.[0];if(!file)return;input.disabled=true;
  try{
    const value=typeof commsPrepareImageFile==='function'?await commsPrepareImageFile(file,{maxDimension:1200,quality:.9}):await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result||''));reader.onerror=()=>reject(reader.error||Error('No se pudo leer la firma.'));reader.readAsDataURL(file)});
    if(value.length>1800000)throw Error('La firma es demasiado pesada. Usa una imagen más pequeña.');
    academySetSigner(uid,'signature',value);academyRenderPanel();
  }catch(error){toast(error.message||'No se pudo preparar la firma.')}finally{input.value='';input.disabled=false}
}

function academyRenderPreview(){
  const host=document.getElementById('academy-preview-pages');if(!host||!_academyCurrent)return;
  const preview=academyPreviewDocument();host.style.setProperty('--academy-scale',String(_academyZoom));host.innerHTML=`<div class="academy-preview-page"><span class="academy-face-label">Frente</span><div class="academy-sheet-wrap">${academyFrontHtml(preview)}</div></div><div class="academy-preview-page"><span class="academy-face-label">Reverso</span><div class="academy-sheet-wrap">${academyBackHtml(preview)}</div></div>`;
  const zoom=document.getElementById('academy-zoom-value');if(zoom)zoom.textContent=`${Math.round(_academyZoom*100)}%`;
}
function academyZoom(delta){_academyZoom=Math.min(1.1,Math.max(.35,_academyZoom+delta));academyRenderPreview()}
function academyFitPreview(){const stage=document.getElementById('academy-preview-stage');if(!stage)return;const available=Math.max(320,stage.clientWidth-48);_academyZoom=Math.min(.9,available/1056);academyRenderPreview()}
function academyRenderEditor(){
  if(!_academyCurrent)return;const writable=can('write','academy'),pg=document.getElementById('pg');
  const count=_academyCurrent.recipients?.length||0,batch=count>1;setSecCrumbs([{label:'Certificados',onclick:'academyBack()'},{label:_academyCurrent.courseTitle||'Nuevo certificado'}]);document.getElementById('sec-title').textContent='Creador de certificados';document.getElementById('sec-sub').textContent='Carta horizontal · frente y reverso';
  pg.innerHTML=`<div class="academy-studio"><section class="academy-customizer"><header class="academy-editor-head"><button class="icon-btn icon-btn-quiet" onclick="academyBack()" aria-label="Volver a certificados">${siIcon('arrow-left',18)}</button><div><p>${esc(academyIdentityName())} · Certificado</p><h2>${esc(_academyCurrent.courseTitle||'Nuevo certificado')}</h2><span data-academy-save data-state="saved" role="status" aria-live="polite">${esc(_academySaveState)}</span></div></header><nav class="academy-editor-tabs" role="tablist" aria-label="Secciones del creador"><button data-academy-tab="data" role="tab" aria-selected="${_academyTab==='data'}" onclick="academySelectTab('data')">Datos</button><button data-academy-tab="design" role="tab" aria-selected="${_academyTab==='design'}" onclick="academySelectTab('design')">Diseño</button><button data-academy-tab="participants" role="tab" aria-selected="${_academyTab==='participants'}" onclick="academySelectTab('participants')">Personas <span>${count}</span></button><button data-academy-tab="content" role="tab" aria-selected="${_academyTab==='content'}" onclick="academySelectTab('content')">Curso</button><button data-academy-tab="signers" role="tab" aria-selected="${_academyTab==='signers'}" onclick="academySelectTab('signers')">Firmas</button></nav><div class="academy-form" id="academy-form"></div><footer class="academy-editor-footer"><span>${siIcon('cloud',14)} Autoguardado activo</span><button class="btn btn-secondary academy-mobile-preview" onclick="document.getElementById('academy-preview-stage').scrollIntoView({behavior:'smooth'})">Ver certificado</button></footer></section><section class="academy-preview-shell"><header class="academy-preview-toolbar"><div><strong>Vista del certificado</strong><span>2 caras · Carta horizontal${batch?` · ${count} personas / ${count*2} páginas`:''}</span></div><div class="academy-preview-actions"><div class="academy-preview-controls" role="group" aria-label="Zoom de vista previa"><button class="icon-btn icon-btn-quiet" onclick="academyZoom(-.1)" aria-label="Alejar">${siIcon('minus',16)}</button><span id="academy-zoom-value">${Math.round(_academyZoom*100)}%</span><button class="icon-btn icon-btn-quiet" onclick="academyZoom(.1)" aria-label="Acercar">${siIcon('plus',16)}</button><button class="btn btn-ghost btn-sm" onclick="academyFitPreview()">Ajustar</button></div><div class="academy-export-actions"><button class="btn btn-secondary btn-sm" onclick="academyPrintPdf()" ${_academyExporting?'disabled':''}>${siIcon('printer',15)} Imprimir</button><button class="btn btn-primary btn-sm" onclick="academyDownloadPdf()" ${_academyExporting?'disabled':''}>${siIcon('download',15)} ${batch?'Descargar lote':'Descargar PDF'}</button></div></div></header><div class="academy-preview-stage" id="academy-preview-stage" tabindex="0" aria-label="Vista previa desplazable del frente y reverso"><div class="academy-preview-pages" id="academy-preview-pages"></div></div></section></div>`;
  academyRenderPanel();academyRenderPreview();requestAnimationFrame(academyFitPreview);
}

function academyValidate(){
  const missing=[];if(!_academyCurrent?.recipients?.length)missing.push('al menos un participante');if(!academyText(_academyCurrent?.certificateTitle))missing.push('el tipo de certificado');if(!academyText(_academyCurrent?.courseTitle))missing.push('el nombre del curso');if(!academyText(_academyCurrent?.companyId))missing.push('la empresa emisora');
  if(missing.length){toast(`Completa ${missing.join(', ')} antes de descargar.`);return false}return true;
}
async function academyPdfBlob(onProgress){
  if(!window.jspdf?.jsPDF||typeof window.html2canvas!=='function')throw Error('No se pudo cargar el generador de PDF. Recarga la aplicación.');
  const documents=academyRecipientDocuments(),host=document.createElement('div');host.className='academy-export-host';host.innerHTML=documents.map(document=>academyFrontHtml(document)+academyBackHtml(document)).join('');document.body.append(host);
  try{
    await document.fonts.ready;await Promise.all([...host.querySelectorAll('img')].map(image=>image.decode().catch(()=>{})));
    const pages=[...host.querySelectorAll('.academy-sheet')],pdf=new window.jspdf.jsPDF({orientation:'landscape',unit:'mm',format:'letter',compress:true});pdf.setProperties({title:`Certificados · ${_academyCurrent.courseTitle}`,creator:academyIdentityName(_academyCurrent),author:academyIdentityName(_academyCurrent)});
    for(let index=0;index<pages.length;index++){
      if(typeof onProgress==='function')onProgress(index+1,pages.length);
      const canvas=await html2canvas(pages[index],{scale:ACADEMY_RENDER_SCALE,useCORS:true,allowTaint:false,backgroundColor:'#ffffff',logging:false,width:1056,height:816,windowWidth:1056,windowHeight:816,scrollX:0,scrollY:0});
      if(index)pdf.addPage('letter','landscape');if(documents.length>1)pdf.addImage(canvas.toDataURL('image/jpeg',.96),'JPEG',0,0,279.4,215.9,undefined,'FAST');else pdf.addImage(canvas.toDataURL('image/png'),'PNG',0,0,279.4,215.9);canvas.width=canvas.height=0;
    }
    return pdf.output('blob');
  }finally{host.remove()}
}
async function academyDownloadPdf(){
  if(_academyExporting||!academyValidate())return;_academyExporting=true;const button=document.querySelector('.academy-preview-toolbar .btn-primary'),count=_academyCurrent.recipients.length;if(button){button.disabled=true;button.innerHTML=`${siIcon('refresh',16)} Generando…`}
  try{await academySaveCloud();const blob=await academyPdfBlob((page,total)=>{if(button)button.innerHTML=`${siIcon('refresh',16)} ${page}/${total}`}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=count>1?`Certificados-Lote-${academySafeName(_academyCurrent.courseTitle)}-${count}-personas.pdf`:`Certificado-${academySafeName(_academyCurrent.recipientName)}-${academySafeName(_academyCurrent.courseTitle)}.pdf`;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);toast(count>1?`Lote descargado: ${count} certificados, ${count*2} páginas.`:'Certificado descargado: frente y reverso.')}
  catch(error){console.error(error);toast(error.message||'No se pudo generar el certificado.')}
  finally{_academyExporting=false;if(button){button.disabled=false;button.innerHTML=`${siIcon('download',16)} ${count>1?'Descargar lote':'Descargar PDF'}`}}
}
async function academyPrintPdf(){
  if(_academyExporting||!academyValidate())return;const printWindow=window.open('','_blank');if(!printWindow){toast('Permite ventanas emergentes para abrir el lote de impresión.');return}
  printWindow.document.write('<title>Preparando certificados…</title><p style="font:16px system-ui;padding:24px">Preparando el lote para impresión…</p>');_academyExporting=true;
  try{await academySaveCloud();const blob=await academyPdfBlob(),url=URL.createObjectURL(blob);printWindow.location.href=url;setTimeout(()=>URL.revokeObjectURL(url),300000);toast('PDF abierto: usa Imprimir para enviar el lote completo.')}
  catch(error){printWindow.close();console.error(error);toast(error.message||'No se pudo preparar la impresión.')}
  finally{_academyExporting=false}
}

async function showAcademy(){
  if(!can('read','academy')){toast('No tienes acceso a Certificados.');showModuleHub();return}
  syncModule('academia');_navLeaf='academia|_|diplomas';sessionStorage.setItem('sierra_route','module:academia');leaveView();renderSidebarTree();document.getElementById('tb-section').textContent='Certificados';document.getElementById('product-controls').style.display='none';document.getElementById('sec-title').textContent='Certificados';document.getElementById('sec-sub').textContent='Certificados y constancias de formación';document.getElementById('pg').innerHTML='<div class="academy-empty"><p>Cargando certificados…</p></div>';await academyLoad();if(_navLeaf==='academia|_|diplomas')academyRenderLibrary();
}

Object.assign(window,{showAcademy,academySetView,academySearch,academyNew,academyOpen,academyBack,academyDuplicate,academyArchive,academyPickCompany,academySelectTab,academySet,academySetRecipients,academySelectRecipient,academySetDecorMode,academyClearDecorImage,academyDecorImage,academySetModule,academyAddModule,academyRemoveModule,academyMoveModule,academySetSigner,academyAddSigner,academyRemoveSigner,academyClearSignerImage,academySignerImage,academyZoom,academyFitPreview,academyDownloadPdf,academyPrintPdf,academyPdfBlob,academyFrontHtml,academyBackHtml,academyNormalize,academyApplyCompanyIdentity,academyDefault,academyTotalHours,academyRecipientDocuments,academyPalette,academyIdentityName});
})();
