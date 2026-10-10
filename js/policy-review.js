/* Policy review: authenticated atomic threads, stable text anchors and an unscaled
 * margin rail. The PDF renderer never receives the review DOM. */
(function(){
 'use strict';
 const core=PolicyReviewCore,copy=x=>JSON.parse(JSON.stringify(x)),bases=new Map(),drafts=new Map();
 let active='',open='',filter='open',groups=new Map(),locations=new Map(),timer=null,polling=false,pending=null,busy=false,selection=null,reattach='',presenceOK=false,history=null,editing='',epoch=0,renderEpoch=0;
 const $=id=>document.getElementById(id),current=()=>_policyCurrent;
 const threads=()=>current()?.comments||[],thread=id=>threads().find(t=>t.id===id);
 const writable=()=>can('write','communications');
 let lastThreadPayload='';
 const outboxKey=()=> 'policy-content-outbox:'+String(me?.id||'');
 function outbox(){try{return JSON.parse(localStorage.getItem(outboxKey())||'{}')}catch{return {}}}
 function persistOutbox(id,snapshot){const box=outbox();if(snapshot)box[id]={snapshot:copy(snapshot),base:bases.get(id)};else delete box[id];localStorage.setItem(outboxKey(),JSON.stringify(box))}
 const draftKey=()=> 'policy-comment-drafts:'+String(me?.id||'')+':'+String(current()?.id||'');
 function persistDrafts(){localStorage.setItem(draftKey(),JSON.stringify([...drafts]))}
 const confirm=(message,title)=>new Promise(resolve=>{commsConfirm(title,message,()=>resolve(true),'Confirmar');const dialog=document.querySelector('dialog.comms-confirm');dialog?.addEventListener('close',()=>queueMicrotask(()=>resolve(false)),{once:true})});
 const attr=escAttr,html=esc;
 const button=(label,action,icon='')=>`<button type="button" class="btn btn-ghost btn-sm" data-review-action="${attr(action)}">${icon?siIcon(icon,14):''}${html(label)}</button>`;
 const originalNormalize=policyNormalize;
 policyNormalize=function(p){const result=originalNormalize(p);result._revision=Number(p?._revision)||0;result.comments=(p?.comments||[]).map(t=>({...t,color:policyUserCommentColor(t),body:t.messages?.find(m=>m.id===t.id)?.body??t.body??'',replies:t.messages?.filter(m=>m.id!==t.id&&!m.deleted)??t.replies??[]}));return result};
 const originalVersion=policyVersionSnapshot;
 policyVersionSnapshot=function(p){const result=originalVersion(p);delete result._revision;return result};
 const originalHistory=policyOpenHistory;
 policyOpenHistory=async function(){const id=current()?.id;if(!id)return;policyFlushPendingSave();if(_policyCloudWrites.has(id))await _policyCloudWrites.get(id);try{const versions=await rpc('policy_revision_list',{p_policy_id:id});if(current()?.id!==id)return;current().versions=[...versions].reverse();originalHistory()}catch{toast('No se pudo cargar el historial de la nube. Intenta de nuevo.')}};
 policyRestoreVersion=async function(id){const version=current()?.versions?.find(v=>v.id===id);if(!version||!writable())return;if(!await confirm('El contenido actual se conservará en el historial. Los comentarios no se sobrescribirán.','Restaurar versión'))return;const preserved={id:current().id,_revision:current()._revision,comments:current().comments,versions:current().versions,createdAt:current().createdAt};_policyCurrent=policyNormalize({...current(),...copy(version.snapshot),...preserved});_policyVersionPreviewId='';policyCloseHistory();policyCommit(true);policyRefreshEditor();toast('Restauración preparada. Comprueba el indicador de guardado.')};
 const originalLoad=policyLoad;
 policyLoad=async function(){const box=outbox();await originalLoad();_policies.forEach(p=>bases.set(p.id,copy(p)));for(const [id,item] of Object.entries(box)){if(item.base)bases.set(id,item.base);const i=_policies.findIndex(p=>p.id===id);if(i>=0)_policies[i]=policyNormalize(item.snapshot);else _policies.unshift(policyNormalize(item.snapshot));policyQueueCloudSave(item.snapshot)}policyPersistAll()};
 async function rpc(name,args){const {data,error}=await sb.rpc(name,args);if(error)throw error;return data}
 policyCloudSave=async function(p){const saved=policyNormalize(await rpc('policy_cloud_save',{p_snapshot:copy(p)}));bases.set(p.id,copy(saved));return saved};
 function updateRevision(id,saved){for(const p of [_policies.find(p=>p.id===id),current(),_policyCloudDrafts.get(id)])if(p?.id===id){p._revision=saved._revision;p.comments=saved.comments}policyPersistAll()}
 policyQueueCloudSave=function(p){
   if(!p?.id)return;const id=p.id;_policyCloudDrafts.set(id,copy(p));persistOutbox(id,p);policyCloudState('Guardando en la nube…','saving');if(_policyCloudWrites.has(id))return;
   const accountId=me?.id;
   const work=(async()=>{while(_policyCloudDrafts.has(id)){
     if(me?.id!==accountId){_policyCloudDrafts.delete(id);break}
     let snapshot=_policyCloudDrafts.get(id);_policyCloudDrafts.delete(id);
     try{
       snapshot._revision=bases.get(id)?._revision??snapshot._revision??0;
       let saved;
       try{saved=await policyCloudSave(snapshot)}catch(error){
         if(error.code!=='40001')throw error;
         const remote=policyNormalize(await rpc('policy_cloud_get',{p_policy_id:id})),base=bases.get(id);
         if(!base)throw error;
         const latest=_policyCloudDrafts.get(id)||snapshot,merged=core.merge(base,latest,remote);
         if(merged.conflicts.length){showConflict(id,latest,remote,merged.conflicts);throw Object.assign(new Error('Hay cambios simultáneos que requieren revisión.'),{conflict:true})}
         _policyCloudDrafts.delete(id);snapshot=merged.value;snapshot._revision=remote._revision;
         saved=await policyCloudSave(snapshot);
         if(current()?.id===id){Object.assign(current(),snapshot);policyRenderPreview()}
       }
       if(me?.id!==accountId){_policyCloudDrafts.delete(id);break}
       updateRevision(id,saved);const i=_policies.findIndex(x=>x.id===id);if(i>=0&&!_policyCloudDrafts.has(id))_policies[i]=saved;
       _policyCloudAvailable=true;persistOutbox(id,_policyCloudDrafts.get(id));policyPersistAll();policyCloudState(_policyCloudDrafts.has(id)?'Guardando en la nube…':'Guardado en la nube',_policyCloudDrafts.has(id)?'saving':'saved');
     }catch(error){if(!_policyCloudDrafts.has(id))_policyCloudDrafts.set(id,snapshot);policyCloudState(error.conflict?'Cambios simultáneos · revisar':'No guardado en la nube · copia local','error');break}
   }})().finally(()=>_policyCloudWrites.delete(id));_policyCloudWrites.set(id,work);
 };
 function showConflict(id,local,remote,fields){
   localStorage.setItem('policy-conflict:'+id,JSON.stringify({local,remote,fields}));
   toast('Otra persona modificó los mismos campos. Tu copia se conserva; revisa el conflicto antes de guardar.');
   const host=document.querySelector('.policy-editor-signals');if(!host||host.querySelector('[data-review-conflict]'))return;
   const b=document.createElement('button');b.className='btn btn-secondary btn-sm';b.dataset.reviewConflict=id;b.textContent='Revisar cambios simultáneos';b.onclick=()=>conflictDialog(id);host.append(b);
 }
 function conflictDialog(id){
   const item=JSON.parse(localStorage.getItem('policy-conflict:'+id)||'null');if(!item)return;
   const overlay=document.createElement('div');overlay.className='policy-history-backdrop';
   overlay.innerHTML=`<section class="policy-history-drawer" role="dialog" aria-modal="true" aria-label="Cambios simultáneos"><div class="policy-history-head"><strong>Cambios simultáneos</strong></div><div class="policy-history-list"><p>Tu copia se conserva. Se modificaron los mismos campos: ${html(item.fields.join(', '))}.</p><p>Puedes abrir la versión compartida y conservar tus cambios en una política separada para compararlos, sin sobrescribir a nadie.</p>${button('Conservar mi copia y abrir la compartida','conflict-copy','copy')}${button('Seguir revisando','conflict-close','x')}</div></section>`;
   overlay.onclick=event=>{const action=event.target.closest('[data-review-action]')?.dataset.reviewAction;if(action==='conflict-close')overlay.remove();if(action==='conflict-copy'){
     const latest=current()?.id===id?current():item.local,duplicate=policyDuplicateDraft(latest);duplicate._revision=0;
     _policyCloudDrafts.delete(id);bases.set(id,item.remote);_policies=_policies.map(p=>p.id===id?policyNormalize(item.remote):p);_policies.unshift(duplicate);policyPersistAll();policyQueueCloudSave(duplicate);localStorage.removeItem('policy-conflict:'+id);overlay.remove();policyOpen(id);toast('Tu trabajo se conservó como una política aparte.');
   }};document.body.append(overlay);
 }
 const originalCloudState=policyCloudState;
 policyCloudState=function(message,state){originalCloudState(message,state);const el=document.querySelector('.policy-save-state');if(el){el.textContent=message;el.setAttribute('role','status')}};
 const originalOpen=policyOpen,originalStop=policyStopPresence;
 policyOpen=function(id){originalOpen(id);if(!bases.has(id)&&current())bases.set(id,copy(current()));active=id;open='';selection=null;history=null;editing='';filter='open';lastThreadPayload='';drafts.clear();for(const [key,value] of JSON.parse(localStorage.getItem(draftKey())||'[]'))drafts.set(key,value);pending=JSON.parse(localStorage.getItem(pendingKey())||'null');epoch++;sync();timer=setInterval(sync,2500);const conflict=JSON.parse(localStorage.getItem('policy-conflict:'+id)||'null');if(conflict)showConflict(id,conflict.local,conflict.remote,conflict.fields)};
 policyStopPresence=function(){originalStop();clearInterval(timer);timer=null;active='';epoch++;presenceOK=false};
 policyPresenceHtml=function(){if(!presenceOK)return '<span class="policy-comment-meta">Presencia sin confirmar</span>';const people=_policyPresence;return `<span class="policy-presence"><span class="policy-presence-avatars">${people.slice(0,4).map(policyPresenceAvatarHtml).join('')}</span><span>${people.length} ${people.length===1?'persona aquí':'personas aquí'}</span></span>`};
 policySyncPresence=async function(id){try{const data=await rpc('policy_presence_touch',{p_policy_id:id});if(current()?.id!==id)return;_policyPresence=data.map(p=>({...p,color:policyUserCommentColor(p)}));presenceOK=true}catch{if(current()?.id!==id)return;_policyPresence=[];presenceOK=false}policyRenderPresence()};
 function pendingKey(){return 'policy-comment-pending:'+String(me?.id||'')+':'+String(current()?.id||'')}
 function accept(data){if(!current())return;lastThreadPayload=JSON.stringify(data.threads);current().comments=policyNormalize({comments:data.threads}).comments;const p=_policies.find(x=>x.id===current().id);if(p)p.comments=copy(current().comments);policyPersistAll();annotate();refreshPanel();renderRail()}
 async function sync(){if(polling||busy||!active||current()?.id!==active||!$('policy-studio')||document.hidden||(!selection?.composing&&getSelection()?.toString()))return;polling=true;const id=active,token=epoch;try{const data=await rpc('policy_comments_read',{p_policy_id:id});if(token===epoch&&current()?.id===id&&JSON.stringify(data.threads)!==lastThreadPayload)accept(data)}catch{if(token===epoch){const rail=$('policy-review-rail');if(rail)rail.dataset.offline='true'}}finally{polling=false}}
 async function apply(op){
   if(busy||!writable())return false;if(pending&&op)return false;
   const id=current()?.id,accountId=me?.id;if(!id)return false;
   if(op){pending={operationId:policyUid('operation'),...op};localStorage.setItem(pendingKey(),JSON.stringify(pending))}
   if(!pending)return false;busy=true;refreshPanel();renderRail();
   try{
     policyFlushPendingSave();if(_policyCloudWrites.has(id))await _policyCloudWrites.get(id);
     if(me?.id!==accountId||current()?.id!==id)return false;
     const data=await rpc('policy_comment_apply',{p_policy_id:id,p_operation:pending});
     if(current()?.id!==id||me?.id!==accountId||active!==id)return true;
     if(pending.action==='create'){open=pending.threadId;drafts.delete('new');selection=null;policyHideSelectionAction();getSelection()?.removeAllRanges()}
     if(pending.action==='reply')drafts.delete('reply:'+pending.threadId);
     if(pending.action==='edit'){drafts.delete('edit:'+pending.messageId);editing=''}
     persistDrafts();localStorage.removeItem(pendingKey());pending=null;busy=false;accept(data);policyFitPreview();return true;
   }catch(error){
     if(current()?.id!==id||me?.id!==accountId||active!==id)return false;
     busy=false;if(['40001','42501','P0002','23505'].includes(error.code)){localStorage.setItem(pendingKey()+':rejected',JSON.stringify(pending));pending=null;localStorage.removeItem(pendingKey());toast(error.code==='42501'?'Solo el autor puede modificar este comentario.':'El hilo cambió. Actualizamos su estado; tu texto sigue en el editor.');await sync()}else toast('No se pudo confirmar el comentario. Tu envío se conserva para reintentar.');
     refreshPanel();renderRail();return false;
   }finally{busy=false}
 }
 policyOpenCommentCount=()=>threads().filter(t=>!t.resolved&&!t.deleted).length;
 policyCommentMarkerHtml=()=>'';
 policyApplyCommentHighlights=()=>{};
 policyHideCommentPopover=()=>{};
 policyScheduleCommentPopoverClose=()=>{};
 function avatar(t){return `<span class="review-avatar" style="--author-color:${policyCommentColorData(policyUserCommentColor(t)).base}">${t.authorAvatar?`<img src="${attr(t.authorAvatar)}" alt="">`:html((t.authorName||'?').split(/\s+/).map(s=>s[0]).slice(0,2).join(''))}</span>`}
 function people(t){return [...new Map([t,...(t.messages||[])].map(m=>[m.authorId||m.authorName,m])).values()]}
 function messageHtml(t,m){return `<article class="review-message" data-review-message="${attr(m.id)}"><header>${avatar(m)}<span><strong>${html(m.authorName||'Comentario anterior')}</strong><small>${html(policyCommentDate(m.createdAt))}${m.legacy?' · atribución histórica':''}</small></span></header>${m.deleted?'<p class="policy-comment-meta">Respuesta eliminada</p>':editing===m.id?`<textarea data-review-draft="edit:${attr(m.id)}" aria-label="Editar comentario" maxlength="10000">${html(drafts.get('edit:'+m.id)??m.body)}</textarea>${button('Guardar cambios','edit-save:'+m.id,'check')}`:`<p class="review-body">${html(m.body)}</p>`}${m.canManage&&writable()?`<div class="review-message-tools">${m.deleted?button('Restaurar','message-restore:'+m.id,'rotate-ccw'):button('Editar','edit:'+m.id,'file-edit')+(m.id!==t.id?button('Eliminar','message-delete:'+m.id,'trash'):'')}</div>`:''}</article>`}
 function statusText(t){if(t.deleted)return'Eliminado · recuperable';if(t.resolved)return'Resuelto'+(t.resolvedBy?.authorName?' por '+t.resolvedBy.authorName:'');return locations.get(t.id)?.status==='orphan'?'Texto sin vincular':'Abierto'}
 function card(t){return `<section class="review-thread" data-review-thread="${attr(t.id)}" style="--author-color:${policyCommentColorData(policyUserCommentColor(t)).base}"><header class="review-thread-head"><span>${html(statusText(t))}</span>${button('Cerrar','close','x')}</header>${locations.get(t.id)?.status==='orphan'?`<p class="review-warning">El fragmento cambió o ya no está. El comentario se conserva.${t.canManage?button('Vincular a otro texto','reanchor:'+t.id,'link'):''}</p>`:''}${(t.messages||[{id:t.id,body:t.body,...t}]).map(m=>messageHtml(t,m)).join('')}<div class="review-thread-actions">${writable()?t.deleted?(t.canManage?button('Restaurar hilo','restore-thread:'+t.id,'rotate-ccw'):''):button(t.resolved?'Reabrir':'Resolver',(t.resolved?'reopen:':'resolve:')+t.id,'check')+(t.canManage?button('Eliminar hilo','delete-thread:'+t.id,'trash'):''):''}${button('Historial','history:'+t.id,'history')}</div>${!t.deleted&&!t.resolved&&writable()?`<form class="review-reply" data-review-reply="${attr(t.id)}"><textarea data-review-draft="reply:${attr(t.id)}" aria-label="Responder a ${attr(t.authorName||'comentario')}" placeholder="Escribe una respuesta…" maxlength="10000">${html(drafts.get('reply:'+t.id)||'')}</textarea><button type="submit" class="btn btn-primary btn-sm" ${busy||pending?'disabled':''}>${siIcon('message',14)} Responder</button></form>`:''}${history?.id===t.id?`<div class="review-history">${history.events.map(e=>`<div><strong>${html(e.authorName||'Migración')}</strong> · ${html(e.action)}<small>${html(new Date(e.createdAt).toLocaleString('es-GT'))}</small>${e.before?.body?`<p>${html(e.before.body)}</p>${t.messages?.some(m=>m.id===e.before.id&&m.canManage&&!m.deleted)?button('Restaurar este texto','version:'+e.id,'rotate-ccw'):''}`:''}</div>`).join('')}</div>`:''}</section>`}
 function pendingHtml(){return pending?`<div class="review-warning" role="status">${busy?'Guardando comentario…':'Envío sin confirmar. Se conserva en este navegador.'}${!busy?button('Reintentar envío','retry','refresh'):''}</div>`:''}
 policyCommentsPanel=function(){const list=threads().filter(t=>filter==='deleted'?t.deleted:filter==='resolved'?t.resolved&&!t.deleted:!t.resolved&&!t.deleted);return `<div class="review-panel"><p class="policy-comment-meta">Selecciona texto en la vista previa para comentar. Los comentarios no se imprimen.</p>${pendingHtml()}<div class="review-filters" role="group" aria-label="Mostrar comentarios">${[['open','Abiertos'],['resolved','Resueltos'],['deleted','Eliminados']].map(([key,label])=>`<button class="btn btn-sm ${filter===key?'btn-primary':'btn-ghost'}" data-review-action="filter:${key}" aria-pressed="${filter===key}">${label}</button>`).join('')}</div>${reattach?'<p class="review-warning">Selecciona el nuevo fragmento en el documento y pulsa Vincular.</p>':''}${list.map(t=>`<div class="review-summary" data-review-thread="${attr(t.id)}"><button type="button" class="review-summary-open" data-review-action="open:${attr(t.id)}">${avatar(t)}<span><strong>${html(t.authorName||'Comentario anterior')}</strong><span>${html(t.body||'Comentario eliminado')}</span><small>${html(policyCommentTargetLabel(t))} · ${html(statusText(t))}</small></span>${siIcon('chevron-right',16)}</button>${open===t.id&&(_policyPreviewHidden||innerWidth<=860)?card(t):''}</div>`).join('')||'<p class="policy-comment-meta">No hay comentarios en esta vista.</p>'}</div>`};
 function preserveFocus(host,render){if(!host)return;const focused=host.contains(document.activeElement)?document.activeElement:null,key=focused?.dataset.reviewDraft,start=focused?.selectionStart,end=focused?.selectionEnd,top=host.scrollTop;render();host.scrollTop=top;if(key){const input=[...host.querySelectorAll('[data-review-draft]')].find(el=>el.dataset.reviewDraft===key);input?.focus({preventScroll:true});input?.setSelectionRange(start,end)}}
 function refreshPanel(){if(_policyTab==='comments')preserveFocus($('policy-form'),()=>{$('policy-form').innerHTML=policyCommentsPanel()});const count=policyOpenCommentCount(),tab=document.querySelector('[data-policy-tab="comments"]');if(tab){let badge=tab.querySelector('.policy-tab-count');if(!badge&&count){badge=document.createElement('span');badge.className='policy-tab-count';tab.append(badge)}if(badge){badge.textContent=count;badge.hidden=!count}}}
 // Stamp semantic blocks before pagination. Cloned/split paragraphs retain their
 // block key and are indexed as one logical stream after page layout.
 function stamp(root){
   root.querySelectorAll('[data-policy-section-id]').forEach(section=>{const id=section.dataset.policySectionId;section.querySelector('.policy-heading-title')?.setAttribute('data-review-block',id+':title');const body=section.querySelector('.policy-section-body,.policy-approvals,.policy-index-table');body?.setAttribute('data-review-block',id+':body')});
   const selectors=['.policy-record-title','.policy-record-kind','.policy-record-classification','.policy-record-field','.policy-record-compact-title','.policy-record-compact-company','.policy-record-reference','.policy-record-folio'];
   selectors.forEach((selector,i)=>root.querySelectorAll(selector).forEach((node,j)=>node.setAttribute('data-review-block','header:'+i+':'+j)));
   root.querySelectorAll('.policy-footer span').forEach((node,j)=>node.setAttribute('data-review-block','footer:'+j));
 }
 function visibleBlock(el){if(el.closest('.is-continuation .policy-control-table')||el.closest('.policy-page:not(.is-continuation) .policy-header-compact'))return false;return true}
 function textMap(elements){const refs=[],chars=[];let space=null;for(const el of elements){const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let n;while(n=walker.nextNode()){if(n.parentElement.closest('button,.policy-editorial-marker'))continue;for(let i=0;i<n.length;i++){if(/\s/.test(n.data[i])){if(chars.length&&!space)space={node:n,offset:i};continue}if(space){chars.push(' ');refs.push(space);space=null}chars.push(n.data[i]);refs.push({node:n,offset:i})}}}return {text:chars.join(''),refs,elements}}
 function rebuildGroups(){groups=new Map();const root=$('policy-preview-sheet');if(!root)return;root.querySelectorAll('mark[data-review-threads]').forEach(mark=>mark.replaceWith(...mark.childNodes));root.normalize();root.querySelectorAll('[data-review-block]').forEach(el=>{if(!visibleBlock(el))return;const id=el.dataset.reviewBlock;if(id.endsWith(':title')&&groups.has(id))return;if(id.startsWith('header:')&&groups.has(id))return;if(id.startsWith('footer:')&&groups.has(id))return;const list=groups.get(id)||[];list.push(el);groups.set(id,list)});groups=new Map([...groups].map(([key,list])=>[key,textMap(list)]))}
 function locateThread(t){const a=t.anchor||{quote:t.quote,sectionId:t.sectionId};let g=groups.get(a.blockId),key=a.blockId;if(!g){const candidates=[...groups].filter(([k,group])=>a.sectionId?k.startsWith(a.sectionId+':'):k.startsWith('header:'));if(!a.quote){const candidate=candidates[0];return candidate?{status:'section',element:candidate[1].elements[0]}:{status:'orphan'}}const matches=candidates.map(([k,group])=>({key:k,g:group,...core.locate(a,group.text)})).filter(x=>['attached','changed'].includes(x.status));if(matches.length!==1)return{status:'orphan'};({g,key}=matches[0])}const found=core.locate(a,g.text);return {...found,key,g,element:g.elements[0]}}
 function annotate(){
   if(_policyVersionPreviewId)return;rebuildGroups();locations=new Map();const byNode=new Map();
   for(const t of threads()){if(t.deleted)continue;const loc=locateThread(t);locations.set(t.id,loc);if(t.resolved||!loc.g||loc.start===undefined)continue;
     loc.g.refs.slice(loc.start,loc.end).forEach(ref=>{const list=byNode.get(ref.node)||[];list.push({offset:ref.offset,id:t.id});byNode.set(ref.node,list)})
   }
   for(const [node,refs] of byNode){const offsets=new Map();for(const {offset,id} of refs){const ids=offsets.get(offset)||new Set();ids.add(id);offsets.set(offset,ids)}const fragment=document.createDocumentFragment();let start=0,last=JSON.stringify([...offsets.get(0)||[]].sort());for(let i=1;i<=node.length;i++){const next=i===node.length?'END':JSON.stringify([...offsets.get(i)||[]].sort());if(next===last)continue;const text=node.data.slice(start,i);if(last!=='[]'){const mark=document.createElement('mark');mark.dataset.reviewThreads=JSON.parse(last).join('|');mark.className='policy-comment-highlight';mark.tabIndex=0;mark.setAttribute('role','button');mark.setAttribute('aria-label','Abrir comentario sobre '+text);mark.textContent=text;fragment.append(mark)}else fragment.append(document.createTextNode(text));start=i;last=next}node.replaceWith(fragment)}
   // Locations use DOM elements after highlights, never stale text-node ranges.
   for(const [id,loc] of locations){const mark=[...$('policy-preview-sheet')?.querySelectorAll('[data-review-threads]')||[]].find(el=>el.dataset.reviewThreads.split('|').includes(id));if(mark)loc.element=mark}
 }
 policyRenderPreview=function(){const sheet=$('policy-preview-sheet');if(!sheet||!current())return;const token=++renderEpoch;policyPlaceEditorStatus();policyPrepareZoomControls();sheet.innerHTML=policyPageHtml(policyActivePreviewDocument());stamp(sheet);const banner=document.querySelector('[data-policy-version-banner]');if(banner)banner.innerHTML=policyVersionPreviewBannerHtml();requestAnimationFrame(async()=>{await document.fonts?.ready;await Promise.all([...sheet.querySelectorAll('img')].map(img=>img.decode?.().catch(()=>{})));if(token!==renderEpoch||!sheet.isConnected)return;policyPaginateDom(document,sheet);annotate();const count=sheet.querySelectorAll('.policy-page').length;if($('policy-preview-pages'))$('policy-preview-pages').textContent=`${count} ${count===1?'página':'páginas'}`;policyFitPreview()})};
 function canvas(){const sheet=$('policy-preview-sheet');if(!sheet)return null;let c=sheet.parentElement;if(!c.classList.contains('policy-review-canvas')){c=document.createElement('div');c.className='policy-review-canvas';sheet.before(c);c.append(sheet);const rail=document.createElement('aside');rail.id='policy-review-rail';rail.setAttribute('aria-label','Comentarios del documento');c.append(rail)}return c}
 policyFitPreview=function(){const stage=$('policy-preview-stage'),sheet=$('policy-preview-sheet'),set=sheet?.querySelector('.policy-page-set'),page=sheet?.querySelector('.policy-page'),c=canvas();if(!stage||!set||!page||!c)return;
   const width=page.offsetWidth||816,height=set.scrollHeight,railWidth=(open||selection?.composing||pending)?336:threads().some(t=>!t.deleted&&!t.resolved)?64:0;
   const fit=(stage.clientWidth-48-railWidth)/width;if(_policyPreviewZoom==='width')_policyPreviewScale=Math.min(1,Math.max(.5,fit));else if(_policyPreviewZoom==='page')_policyPreviewScale=Math.min(1,Math.max(.35,Math.min(fit,(stage.clientHeight-48)/(page.offsetHeight||1056))));
   sheet.style.transform='none';sheet.style.width=width*_policyPreviewScale+'px';sheet.style.height=Math.ceil(height*_policyPreviewScale)+'px';set.style.transform=`scale(${_policyPreviewScale})`;set.style.transformOrigin='top left';set.style.width=width+'px';
   c.style.width=width*_policyPreviewScale+railWidth+'px';c.style.minHeight=sheet.style.height;const rail=$('policy-review-rail');rail.style.left=width*_policyPreviewScale+16+'px';rail.style.width=Math.max(48,railWidth-16)+'px';
   if($('policy-zoom-value'))$('policy-zoom-value').textContent=Math.round(_policyPreviewScale*100)+'%';document.querySelectorAll('[data-policy-zoom-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.policyZoomMode===_policyPreviewZoom)));renderRail()
 };
 function yOf(el){const c=canvas();return el?.isConnected?Math.max(0,el.getBoundingClientRect().top-c.getBoundingClientRect().top):0}
 function renderRail(){const rail=$('policy-review-rail');if(!rail)return;if(_policyVersionPreviewId){rail.replaceChildren();return}preserveFocus(rail,()=>{
   let floor=0;const pins=threads().filter(t=>!t.deleted&&(!t.resolved||open===t.id)&&locations.get(t.id)?.element&&locations.get(t.id)?.status!=='orphan').map(t=>({t,y:yOf(locations.get(t.id).element)})).sort((a,b)=>a.y-b.y);
   rail.innerHTML=pendingHtml()+pins.map(({t,y})=>{const top=Math.max(y,floor);floor=top+52;const authors=people(t);return `<div class="review-pin-slot" data-review-pin="${attr(t.id)}" style="top:${top}px"><button class="review-pin" data-review-action="open:${attr(t.id)}" aria-expanded="${open===t.id}" aria-label="Comentarios de ${attr(authors.map(a=>a.authorName).join(', '))}" title="${attr(t.authorName||'Comentario')}">${avatar(t)}${authors.length>1?`<small>+${authors.length-1}</small>`:''}</button>${open===t.id?card(t):''}</div>`}).join('');
   if(open&&!pins.some(x=>x.t.id===open)&&thread(open))rail.insertAdjacentHTML('beforeend',`<div class="review-pin-slot" style="top:0">${card(thread(open))}</div>`);
   if(selection?.composing)rail.insertAdjacentHTML('beforeend',`<div class="review-pin-slot review-composer" style="top:${selection.y}px"><form data-review-create><strong>Nuevo comentario</strong><textarea data-review-draft="new" aria-label="Nuevo comentario" placeholder="Escribe tu comentario…" maxlength="10000">${html(drafts.get('new')||'')}</textarea><div>${button('Cancelar','cancel')}<button class="btn btn-primary btn-sm" ${busy||pending?'disabled':''}>Comentar</button></div></form></div>`);
 });
 // Open cards expand the rail's scrollable canvas, never cover another pin.
 let floor=0;for(const slot of rail.querySelectorAll('.review-pin-slot')){const top=Math.max(parseFloat(slot.style.top)||0,floor);slot.style.top=top+'px';floor=top+slot.offsetHeight+12}const c=canvas();if(c)c.style.paddingBottom=Math.max(0,floor-parseFloat($('policy-preview-sheet').style.height))+'px';
 }
 policyHideSelectionComment=function(){document.querySelector('.review-selection-action')?.remove();if(!selection?.composing)selection=null};
 policyOfferSelectionComment=function(event,source){if(!writable()||_policyVersionPreviewId||selection?.composing)return;setTimeout(()=>{
   const s=getSelection();if(!s?.rangeCount||s.isCollapsed)return;const range=s.getRangeAt(0),start=range.startContainer.nodeType===3?range.startContainer.parentElement:range.startContainer,end=range.endContainer.nodeType===3?range.endContainer.parentElement:range.endContainer;
   const a=start.closest('[data-review-block]'),b=end.closest('[data-review-block]');if(!a||!b||a.dataset.reviewBlock!==b.dataset.reviewBlock){toast('Selecciona texto dentro de una misma sección o campo.');return}
   // Re-index current marked nodes to keep offsets correct after other comments.
   const registered=groups.get(a.dataset.reviewBlock)?.elements||[],els=registered.includes(a)?registered:[a],map=textMap(els);let first=-1,last=-1;map.refs.forEach((ref,i)=>{try{if(range.comparePoint(ref.node,ref.offset)===0&&!(ref.node===range.endContainer&&ref.offset>=range.endOffset)){if(first<0)first=i;last=i+1}}catch{}});if(first<0||last<=first)return;
   while(last>first&&/\s/.test(map.text[last-1]))last--;const sectionId=a.closest('[data-policy-section-id]')?.dataset.policySectionId||'';
   selection={anchor:core.anchor(a.dataset.reviewBlock,map.text,first,last,sectionId),y:yOf(a),composing:false};
   policyHideSelectionAction();const action=document.createElement('button'),c=canvas(),rect=range.getBoundingClientRect(),cr=c.getBoundingClientRect();action.className='btn btn-primary btn-sm review-selection-action';action.textContent=reattach?'Vincular comentario':'Comentar';action.style.left=Math.max(0,rect.left-cr.left)+'px';action.style.top=rect.bottom-cr.top+6+'px';action.onmousedown=e=>e.preventDefault();action.onclick=async()=>{if(reattach){const t=thread(reattach);if(t&&await apply({action:'anchor',threadId:t.id,version:t.version,anchor:selection.anchor})){reattach='';selection=null;action.remove()}}else{selection.composing=true;open='';action.remove();policyFitPreview();railFocus('new')}};c.append(action);
 },0)};
 function policyHideSelectionAction(){document.querySelector('.review-selection-action')?.remove()}
 function railFocus(key){requestAnimationFrame(()=>{[...document.querySelectorAll('#policy-review-rail [data-review-draft]')].find(el=>el.dataset.reviewDraft===key)?.focus({preventScroll:true})})}
 function openThread(id,scroll=false){open=id;history=null;selection=null;policyHideSelectionAction();policyFitPreview();refreshPanel();if(scroll){const stage=$('policy-preview-stage'),el=locations.get(id)?.element;if(stage&&el)stage.scrollTo({top:Math.max(0,yOf(el)-80),behavior:'smooth'})}}
 async function handleAction(value,event){const colon=value.indexOf(':'),action=colon<0?value:value.slice(0,colon),id=colon<0?'':value.slice(colon+1),t=thread(id)||thread(event.target.closest('[data-review-thread]')?.dataset.reviewThread);switch(action){
   case 'filter':filter=id;refreshPanel();break;
   case 'open':openThread(id,event.target.closest('.review-panel')!==null);break;
   case 'close':open='';history=null;policyFitPreview();refreshPanel();break;
   case 'cancel':selection=null;drafts.delete('new');policyFitPreview();break;
   case 'retry':await apply(null);break;
   case 'reanchor':reattach=id;toast('Selecciona el nuevo fragmento y pulsa Vincular comentario.');refreshPanel();break;
   case 'resolve':case 'reopen':case 'restore-thread':await apply({action,threadId:id,version:t.version});break;
   case 'delete-thread':if(await confirm('¿Eliminar este hilo? Podrás recuperarlo en Comentarios → Eliminados.','Eliminar hilo'))await apply({action,threadId:id,version:t.version});break;
   case 'edit':editing=id;refreshPanel();renderRail();railFocus('edit:'+id);break;
   case 'edit-save':{const m=t.messages.find(m=>m.id===id),body=drafts.get('edit:'+id)??m.body;if(await apply({action:'edit',threadId:t.id,messageId:id,version:m.version,body})){editing='';drafts.delete('edit:'+id);refreshPanel();renderRail()}break}
   case 'message-delete':case 'message-restore':{const m=t.messages.find(m=>m.id===id);if(action==='message-delete'&&!await confirm('La respuesta se conservará en el historial y podrá restaurarse.','Eliminar respuesta'))break;await apply({action:action==='message-delete'?'delete-message':'restore-message',threadId:t.id,messageId:id,version:m.version});break}
   case 'history':history={id,events:await rpc('policy_comment_history',{p_policy_id:current().id,p_thread_id:id})};refreshPanel();renderRail();break;
   case 'version':{const entry=history.events.find(e=>String(e.id)===id),m=t.messages.find(m=>m.id===entry.before.id);await apply({action:'edit',threadId:t.id,messageId:m.id,version:m.version,body:entry.before.body});break}
 }}
 document.addEventListener('input',event=>{const key=event.target.dataset.reviewDraft;if(key){drafts.set(key,event.target.value);persistDrafts()}});
 window.addEventListener('online',()=>{for(const [id,p] of _policyCloudDrafts)if(!localStorage.getItem('policy-conflict:'+id))policyQueueCloudSave(p)});
 document.addEventListener('click',event=>{const action=event.target.closest('[data-review-action]');if(action){event.preventDefault();handleAction(action.dataset.reviewAction,event).catch(()=>toast('No se pudo completar la acción. Intenta de nuevo.'));return}const mark=event.target.closest('[data-review-threads]');if(mark){const ids=mark.dataset.reviewThreads.split('|');if(ids.length===1)openThread(ids[0]);else{filter='open';policySelectTab('comments');const panel=$('policy-form');panel.innerHTML=`<p>Este fragmento tiene ${ids.length} hilos. Elige uno:</p>`+ids.map(id=>`<div class="review-summary" data-review-thread="${attr(id)}">${button(thread(id)?.body||'Abrir comentario','open:'+id,'message')}</div>`).join('')}}});
 document.addEventListener('keydown',event=>{if(event.target.matches('[data-review-threads]')&&['Enter',' '].includes(event.key)){event.preventDefault();event.target.click()}if(event.key==='Escape'){open='';policyHideSelectionAction();if(!drafts.get('new'))selection=null;policyFitPreview();refreshPanel()}});
 document.addEventListener('submit',async event=>{const form=event.target;if(!form.matches('[data-review-reply],[data-review-create]'))return;event.preventDefault();const isNew=form.hasAttribute('data-review-create'),id=isNew?policyUid('thread'):form.dataset.reviewReply,key=isNew?'new':'reply:'+id,body=drafts.get(key)?.trim();if(!body)return;const op=isNew?{action:'create',threadId:id,body,anchor:selection.anchor}:{action:'reply',threadId:id,messageId:policyUid('reply'),body};if(await apply(op)){drafts.delete(key);selection=null;open=id;policyFitPreview();refreshPanel()}});
 // Disable obsolete whole-snapshot comment mutation paths.
 policyAddComment=()=>toast('Selecciona el fragmento en la vista previa para comentar.');
 policyUpdateComment=()=>{};policyAddSelectionComment=()=>{};policyReplyComment=()=>{};
 policyResolveComment=id=>handleAction('resolve:'+id,{target:document.body});
 policyRemoveComment=id=>handleAction('delete-thread:'+id,{target:document.body});
 policyToggleComment=id=>handleAction((thread(id)?.resolved?'reopen:':'resolve:')+id,{target:document.body});
 window.PolicyReview={locateThread,textMap,stamp,annotate,apply,core};
})();
