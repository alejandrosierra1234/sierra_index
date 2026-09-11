/* Sierra workspaces share the samples engine, while keeping each team's working context explicit. */
const sampleSpaces={textiles:{label:'Tela y Prendas',divisions:['fabric','garment'],icon:'grid',description:'Desarrollos, hangers y prendas · Northern Textiles'},yarn:{label:'Hilo',divisions:['yarn'],icon:'box',description:'Catálogo y operación de muestras de hilo'},chemicals:{label:'Químicos',divisions:['chemicals'],icon:'package',description:'Productos y muestras de químicos'},fiber:{label:'Fibra',divisions:['fiber'],icon:'box',description:'Catálogo y operación de muestras de fibra'}};
let sampleActiveSpace='';try{sampleActiveSpace=sessionStorage.getItem('sierra_sample_space')||''}catch{}
function sampleSpaceForDivision(d){return ['fabric','garment'].includes(d)?'textiles':d}
function accessibleSampleSpaces(){return Object.entries(sampleSpaces).filter(([,s])=>s.divisions.some(d=>can('read',d)||canDispatchDiv(d)))}
function sampleSpaceDivisions(){const s=sampleSpaces[sampleActiveSpace];return s?s.divisions:[]}
function sampleSpaceLabel(){return sampleSpaces[sampleActiveSpace]?.label||'Todos los equipos'}
function setSampleSpace(key){sampleActiveSpace=sampleSpaces[key]?key:'';try{sessionStorage.setItem('sierra_sample_space',sampleActiveSpace)}catch{}}
function enterSampleSpace(key){if(key&&!accessibleSampleSpaces().some(([k])=>k===key)){toast('No tienes acceso a este espacio');return}setSampleSpace(key);sampleCenterState.counts={};return showSampleCenter()}
function showSampleSpaces(){
 const root=showSampleTool('Muestras','Elige el equipo con el que vas a trabajar.','samples|_|spaces');
 root.innerHTML=`<section class="sc-center"><div class="sc-space-grid">${accessibleSampleSpaces().map(([key,s])=>`<button class="sc-space-card" onclick="enterSampleSpace('${key}')"><span class="nav-icon-tile" style="--tile-bg:${DIV_ACCENT[s.divisions[0]].light};--tile-fg:${DIV_ACCENT[s.divisions[0]].accent}">${DIV_ICON[s.divisions[0]]}</span><strong>${esc(s.label)}</strong><span>${esc(s.description)}</span>${siIcon('arrow-right',16)}</button>`).join('')}</div>${can('read','customer_service')?`<button class="btn btn-secondary" onclick="enterSampleSpace('')">${siIcon('list',16)} Consultar todos los equipos</button><p class="sf-hint">La vista general incluye borradores anteriores sin clasificar. Los permisos de cada registro siguen vigentes.</p>`:''}</section>`;
}
function sampleSpaceNavHtml(){if(typeof _navLeaf!=='undefined'&&_navLeaf==='samples|_|spaces')return '';return `<button class="nav-item" onclick="showSampleSpaces()">${siIcon('arrow-left',16)}<span class="nav-label">Cambiar equipo</span></button><span class="s-label">${esc(sampleSpaceLabel())}</span>`}

/* Adapt legacy form selects to the canonical pdSelect. Keep the original element
   as the form/value source, including existing change handlers and validation. */
let sampleSelectSequence=0;
const sampleSelectSources=new Map();
function enhanceSampleSelects(root){
 if(!root?.querySelectorAll)return;
 root.querySelectorAll('select:not([multiple]):not([data-sierra-select])').forEach(select=>{
  const key='sample-select-'+(++sampleSelectSequence);
  select.dataset.sierraSelect=key;
  const host=document.createElement('span');host.className='sample-select-host';select.after(host);
  const label=select.getAttribute('aria-label')||select.labels?.[0]?.textContent?.trim()||select.getAttribute('title')||({'dq-customer':'Cliente','dq-requester':'Solicitante','dq-delivery':'Entrega','dq-sort':'Orden'}[select.id])||(select.classList.contains('ws-row-type')?'Formato de muestra':select.classList.contains('ws-row-cat')?'Categoría':select.classList.contains('ws-invite-role-sel')?'Rol del colaborador':'Seleccionar opción');
  const refresh=()=>{
   const value=select.value;
   const html=pdSelect(key,[...select.options].map(o=>({value:o.value,label:o.textContent})),value,label,'sampleSelectChanged','wide');
   if(!host.firstElementChild)host.innerHTML=html;
   else{const temp=document.createElement('div');temp.innerHTML=html;host.querySelector('.pd-select-label').textContent=temp.querySelector('.pd-select-label').textContent;host.querySelector('input').value=value;host.querySelector('[role=listbox]').innerHTML=temp.querySelector('[role=listbox]').innerHTML;}
   const trigger=host.querySelector('.pd-select-btn');trigger.disabled=select.disabled;trigger.setAttribute('aria-label',label);trigger.setAttribute('aria-controls',key+'-options');
   host.querySelector('[role=listbox]').id=key+'-options';host.querySelector('[role=listbox]').setAttribute('aria-label',label);
   host.querySelectorAll('[role=option]').forEach((el,i)=>{el.disabled=select.options[i].disabled||select.options[i].parentElement.disabled;el.tabIndex=-1});
  };
  sampleSelectSources.set(key,{select,host,refresh});refresh();
  select.hidden=true;select.style.display='none';select.addEventListener('change',refresh);
  host.addEventListener('click',e=>{if(e.target.closest('.pd-select-btn'))refresh()},{capture:true});
  select.addEventListener('invalid',e=>{e.preventDefault();host.querySelector('button')?.focus()});
 });
 for(const [key,entry] of sampleSelectSources)if(!entry.select.isConnected)sampleSelectSources.delete(key);
}
function sampleSelectChanged(value,key){const entry=sampleSelectSources.get(key);if(!entry)return;entry.select.value=value;entry.select.dispatchEvent(new Event('input',{bubbles:true}));entry.select.dispatchEvent(new Event('change',{bubbles:true}));entry.host.querySelector('.pd-select-btn')?.focus()}
function sampleEnhanceScreen(){
 if(typeof activeModule==='undefined'||activeModule!=='samples')return;
 for(const id of ['view-products','view-detail','view-samples','view-sample-detail','cart-panel','m-label','m-yarn','m-add','m-import','m-ws-invite'])enhanceSampleSelects(document.getElementById(id));
}
let sampleEnhancePending=false;
new MutationObserver(records=>{
 const sources=new Set(records.map(r=>r.target.closest?.('select[data-sierra-select]')).filter(Boolean));
 sources.forEach(s=>sampleSelectSources.get(s.dataset.sierraSelect)?.refresh());
 if(!records.some(r=>[...r.addedNodes].some(n=>n.nodeType===1&&(n.matches?.('select')||n.querySelector?.('select:not([data-sierra-select])')))))return;
 if(!sampleEnhancePending){sampleEnhancePending=true;queueMicrotask(()=>{sampleEnhancePending=false;sampleEnhanceScreen()})}
}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['selected','disabled','value']});
sampleEnhanceScreen();
// Shared keyboard behavior also improves canonical dropdowns already on sample pages.
document.addEventListener('keydown',e=>{
 const dd=e.target.closest?.('.pd-select');if(!dd)return;
 const trigger=dd.querySelector('.pd-select-btn'),menu=dd.querySelector('[role=listbox]');
 const options=[...menu.querySelectorAll('[role=option]:not(:disabled)')];
 if(e.key==='Escape'){e.preventDefault();closePdSelects();trigger.focus();return}
 if(e.key==='Tab'){closePdSelects();return}
 if(!['ArrowDown','ArrowUp','Home','End'].includes(e.key))return;
 e.preventDefault();e.stopPropagation();
 if(!dd.classList.contains('open')){trigger.click();requestAnimationFrame(()=>{const live=[...menu.querySelectorAll('[role=option]:not(:disabled)')];(live.find(o=>o.getAttribute('aria-selected')==='true')||live[0])?.focus()});return}
 let i=options.indexOf(document.activeElement);i=e.key==='Home'?0:e.key==='End'?options.length-1:(i+(e.key==='ArrowUp'?-1:1)+options.length)%options.length;options[i]?.focus();
});
