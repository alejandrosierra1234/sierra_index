import {CommunicationModel,Y,toBase64} from './model.js';
import {CommunicationTransport} from './transport.js';
import {Awareness} from 'y-protocols/awareness';
import {bindRich,readRich,seedRich,richCommand,addCommentMark} from './rich-text.js';
import {optimizeSharingImages} from './images.js';

const copy = value => JSON.parse(JSON.stringify(value));
const colors=['#007d73','#004a86','#670084','#cd4f00','#2a9200'];
const label = role => ({owner:'Propietario',editor:'Puede editar',viewer:'Puede leer'}[role] || 'Sin acceso');
const richBlocks = d => (d.blocks || []).flatMap(b => b.type==='cards' ? b.cards || [] : ['text','quote','feature'].includes(b.type) ? [b] : []);
const stripped = d => {
  const value=copy(d);
  richBlocks(value).forEach(b => {delete b.richHtml;delete b.content;});
  if(value.kind==='aviso'){delete value.noticeRichHtml;delete value.noticeMessage;}
  return value;
};

function dialog(title) {
  document.getElementById('comms-sharing')?.remove();
  const el=document.createElement('dialog'); el.id='comms-sharing';el.className='comms-share-dialog';
  const header=document.createElement('header'),heading=document.createElement('h2'),close=document.createElement('button');
  heading.id='comms-sharing-title';heading.textContent=title;el.setAttribute('aria-labelledby',heading.id);
  close.className='icon-btn';close.textContent='×';close.title='Cerrar';close.setAttribute('aria-label','Cerrar');close.onclick=() => el.close();
  header.append(heading,close);el.append(header);document.body.append(el);
  el.addEventListener('close',() => el.remove(),{once:true});el.showModal();return el;
}
function message(el,value,error=false) {
  el.querySelector('[data-message]')?.remove();
  const node=document.createElement('p');node.dataset.message='';node.setAttribute('role',error?'alert':'status');node.textContent=value;el.append(node);
}

function install(api) {
  let session=null, rendering=false, deferred=false, sharing=false;
  const views=new Map(),inputCleanups=[],lockedElements=new Map();
  const getAccount=() => api.account()?.id;
  const rpc=async(name,args={}) => {
    const account=getAccount();
    if(!account) throw Error('Inicia sesión para continuar.');
    const {data,error}=await api.rpc(name,args);
    if(getAccount()!==account) throw Object.assign(Error('La sesión cambió.'),{code:'42501'});
    if(error) throw error;
    return data;
  };
  const active=() => {
    if(session && session.account!==getAccount()){stop();api.current(null);api.clearPage('La sesión cambió.');}
    return !!session;
  };
  const editable=() => active() && !session.blocked && ['owner','editor'].includes(session.transport.role);
  const destroyViews=() => {views.forEach(view=>view.destroy());views.clear();inputCleanups.splice(0).forEach(clean=>clean());};
  const read=() => {
    const d=session.model.read();
    richBlocks(d).forEach(b => Object.assign(b,readRich(session.model.doc.getXmlFragment('rich:'+b.id))));
    if(d.kind==='aviso'){const rich=readRich(session.model.doc.getXmlFragment('rich:notice-message'),true);d.noticeRichHtml=rich.richHtml;d.noticeMessage=rich.content;}
    return d;
  };
  const prepareRich=(model,d) => {
    richBlocks(d).forEach(b => seedRich(model.doc.getXmlFragment('rich:'+b.id),api.richHtml(b)));
    if(d.kind==='aviso')seedRich(model.doc.getXmlFragment('rich:notice-message'),api.noticeHtml(d));
  };
  const capture=() => {
    if(!editable()) return false;
    const d=api.current();if(!d || d.id!==session.source) return false;
    prepareRich(session.model,d);
    const next=stripped(d);
    session.model.apply(session.baseline,next);session.baseline=copy(next);return true;
  };
  const status=(text,blocked=false) => {
    if(!session)return;
    session.blocked=blocked;
    document.querySelectorAll('#memo-save-state,[data-collab-status]').forEach(el=>el.textContent=text);
    if(session.transport.stopped) {
      destroyViews();api.current(null);api.clearPage(text);stop();return;
    }
    if(editable()){
      lockedElements.forEach((wasDisabled,el)=>{if(el.isConnected)el.disabled=wasDisabled;});lockedElements.clear();
    }else document.querySelectorAll('.memo-form input,.memo-form textarea,.memo-form button,.memo-form select,.memo-panel-head .pd-select-btn').forEach(el=>{
      if(!el.closest('.memo-studio-actions')){if(!lockedElements.has(el))lockedElements.set(el,el.disabled);el.disabled=true;}
    });
    views.forEach(view=>view.setProps({editable}));
  };
  function stop(closeDialog=true) {
    destroyViews();
    if(session){session.transport.stop();session.awareness.destroy();session.model.doc.destroy();}
    session=null;deferred=false;lockedElements.clear();api.clearSelectors();if(closeDialog)document.getElementById('comms-sharing')?.close();
  }
  function applyRemote(data) {
    if(!active())return;
    const previous=api.current(),next=read();
    api.validate(next);
    session.baseline=stripped(next);api.current(next);
    const states=session.awareness.getStates();
    const seen=new Set([session.model.doc.clientID]);
    data.presence.forEach(person=>{
      if(person.session_id===session.transport.session)return;
      try {
        const state=JSON.parse(person.awareness), id=Number(state.clientID);
        if(!Number.isSafeInteger(id)||id===session.model.doc.clientID)return;
        const name=String(person.name||'Colaborador').slice(0,80),color=colors[id%colors.length];
        states.set(id,{user:{name,color},field:state.field,cursor:state.cursor});seen.add(id);
      }catch { /* Ignore malformed ephemeral cursor state. */ }
    });
    const removed=[];states.forEach((_state,id)=>{if(!seen.has(id)){states.delete(id);removed.push(id);}});
    session.awareness.emit('change',[{added:[],updated:[...seen],removed},'remote']);
    if(previous && JSON.stringify(stripped(previous))!==JSON.stringify(stripped(next))) {
      if(document.activeElement?.closest('.memo-form') || document.querySelector('.memo-dragging'))deferred=true;
      else {rendering=true;try{api.render();}finally{rendering=false;}}
    }
    api.preview();paintPresence(data.presence);
  }
  const comments=() => Array.isArray(api.current()?.comments)?api.current().comments:[];
  const activeComments=() => comments().filter(comment=>!comment.resolved);
  const syncComments=() => {capture();session?.transport.sync().catch(()=>{});};
  function commentsDialog(focusId='') {
    if(!active())return;
    const el=dialog('Comentarios');
    const intro=document.createElement('p');intro.className='comms-collab-lock';intro.textContent='Los comentarios quedan en el editor y no se incluyen en la vista previa ni en las descargas.';el.append(intro);
    const list=document.createElement('div');list.className='comms-comment-list';el.append(list);
    const items=comments();
    if(!items.length)message(el,'Selecciona texto y usa Comentar para iniciar una conversación.');
    items.forEach(comment=>{
      const card=document.createElement('article');card.className='comms-comment-card'+(comment.resolved?' is-resolved':'');card.dataset.commentId=comment.id;
      const meta=document.createElement('div');meta.className='comms-comment-meta';
      const author=document.createElement('strong');author.textContent=comment.authorName||'Colaborador';
      const time=document.createElement('time');time.textContent=comment.createdAt?new Date(comment.createdAt).toLocaleString('es-GT'):'';meta.append(author,time);
      const quote=document.createElement('blockquote');quote.textContent=comment.quote||'';
      const body=document.createElement('p');body.textContent=comment.body||'';
      const action=document.createElement('button');action.type='button';action.className='btn btn-ghost btn-sm';action.textContent=comment.resolved?'Reabrir':'Resolver';
      action.onclick=()=>{comment.resolved=!comment.resolved;comment.resolvedAt=comment.resolved?new Date().toISOString():'';syncComments();el.close();api.render();queueMicrotask(()=>commentsDialog(comment.id));};
      card.append(meta,quote,body,action);list.append(card);
    });
    if(focusId)queueMicrotask(()=>el.querySelector(`[data-comment-id="${CSS.escape(focusId)}"]`)?.scrollIntoView({block:'center'}));
  }
  function addComment(view,field) {
    if(!editable())return;
    const selected=view.state.doc.textBetween(view.state.selection.from,view.state.selection.to,' ',' ').replace(/\s+/g,' ').trim();
    if(!selected){message(dialog('Agregar comentario'),'Selecciona primero el texto que quieres comentar.',true);return;}
    const el=dialog('Agregar comentario'),form=document.createElement('form'),quote=document.createElement('blockquote'),label=document.createElement('label'),textarea=document.createElement('textarea'),button=document.createElement('button');
    quote.textContent=selected;label.textContent='Comentario';textarea.className='control-input';textarea.name='body';textarea.required=true;textarea.rows=4;label.append(textarea);button.className='btn btn-primary';button.type='submit';button.textContent='Comentar';form.append(quote,label,button);el.append(form);textarea.focus();
    form.onsubmit=event=>{event.preventDefault();const id='comment-'+crypto.randomUUID(),marked=addCommentMark(view,id);if(!marked){message(el,'La selección ya no está disponible. Vuelve a seleccionar el texto.',true);return;}const identity=api.account()||{};const current=api.current();current.comments=Array.isArray(current.comments)?current.comments:[];current.comments.push({id,field,quote:marked,body:textarea.value.trim(),authorId:identity.id||'',authorName:identity.name||'Colaborador',authorEmail:identity.email||'',createdAt:new Date().toISOString(),resolved:false});syncComments();el.close();api.render();};
  }
  function paintPresence(people=[]) {
    const bar=document.querySelector('.comms-collab-bar');if(!bar)return;
    bar.replaceChildren();
    const access=document.createElement('span');access.textContent='Equipo · '+label(session.transport.role);bar.append(access);
    const seen=new Set();
    people.forEach(p=>{
      if(seen.has(p.user_id))return;seen.add(p.user_id);
      const item=document.createElement('span');item.className='comms-collab-person';item.textContent=p.name;bar.append(item);
    });
    const state=document.createElement('span');state.dataset.collabStatus='';state.setAttribute('role','status');state.textContent=session.transport.dirty?'Guardando cambios...':'Guardado en Index';bar.append(state);
  }
  async function open(id) {
    if(active() && session.id===id)return;
    if(active()){capture();await session.transport.sync();if(session.transport.dirty)throw Error('Todavía hay cambios pendientes.');}
    if(!active() && api.current() && !api.persistLocal())throw Error('No se pudo guardar el documento local.');
    stop(false);api.current(null);api.clearPage('Abriendo comunicado del equipo...');
    const account=getAccount(),model=new CommunicationModel(),awareness=new Awareness(model.doc);
    const current={id,account,model,awareness,blocked:true,source:null,baseline:{}};
    const transport=new CommunicationTransport({doc:model.doc,
      rpc:(name,args)=>rpc(name,{p_id:id,...args}),valid:()=>session===current&&getAccount()===account,
      presence:()=>({clientID:model.doc.clientID,...awareness.getLocalState()}),
      onChange:data=>{if(current.source)applyRemote(data);},onStatus:status});
    current.transport=transport;session=current;
    try {
      await transport.sync();if(session!==current)return;
      const d=read();api.validate(d);current.source=d.id;current.baseline=stripped(d);current.blocked=false;
      awareness.setLocalState({user:{name:api.account().name||'Colaborador',color:colors[model.doc.clientID%colors.length]}});
      api.current(d);api.render();transport.start();
    } catch(error){stop();throw error;}
  }
  async function publishCurrent() {
    if(active())return true;
    if(!api.current()||!api.persistLocal())throw Error('No se pudo guardar el comunicado antes de publicarlo al equipo.');
    const draft=copy(api.current());
    if(JSON.stringify(draft).includes('sierra-memo-asset:'))throw Error('Faltan imágenes locales. Usa “Guardar en equipo” para prepararlas.');
    const model=new CommunicationModel();let snapshot;
    try{model.seed(stripped(draft));prepareRich(model,draft);snapshot=Y.encodeStateAsUpdate(model.doc);}
    finally{model.doc.destroy();}
    if(snapshot.length>16777216)throw Error('El comunicado necesita preparar sus imágenes. Usa “Guardar en equipo”.');
    const id=await rpc('communication_create',{p_source:draft.id,p_title:(draft.subject||'Comunicado').slice(0,500),p_kind:draft.kind||'memo',p_snapshot:toBase64(snapshot)});
    if(api.current()?.id!==draft.id)return false;
    await open(id);return true;
  }
  async function share() {
    if(sharing)return;
    sharing=true;
    api.clearSelectors();
    const el=dialog('Espacio del equipo');message(el,'Verificando el documento...');
    try {
      if(!active()) {
        if(!api.current() || !api.persistLocal()) throw Error('Guarda el comunicado antes de compartirlo.');
        const original=copy(api.current()),account=getAccount();
        let draft=original,snapshot;
        const valid=()=>el.isConnected&&getAccount()===account&&api.current()?.id===original.id;
        const encode=d=>{
          const model=new CommunicationModel();
          try{model.seed(stripped(d));prepareRich(model,d);return Y.encodeStateAsUpdate(model.doc);}
          finally{model.doc.destroy();}
        };
        if(JSON.stringify(draft).includes('sierra-memo-asset:'))throw Error('Faltan imágenes locales. Recupéralas antes de compartir.');
        snapshot=encode(draft);
        if(snapshot.length>8*1024*1024) {
          message(el,'Preparando imágenes para compartir. El original se conserva...');
          for(const [maxDimension,quality] of [[2400,.9],[1920,.88],[1600,.85]]) {
            draft=await optimizeSharingImages(original,{maxDimension,quality,valid,
              progress:(done,total)=>message(el,'Preparando imágenes: '+done+' de '+total+'...')});
            snapshot=encode(draft);
            if(snapshot.length<=15*1024*1024)break;
          }
        }
        if(!valid())return;
        if(JSON.stringify(api.current())!==JSON.stringify(original))throw Error('El comunicado cambió durante la preparación. Vuelve a compartir la versión actual.');
        if(snapshot.length>16777216)throw Error('No se pudo preparar la copia compartida automáticamente. Tu comunicado original se conserva intacto.');
        message(el,'Guardando el comunicado en el espacio del equipo...');
        const id=await rpc('communication_create',{p_source:draft.id,p_title:(draft.subject||'Comunicado').slice(0,500),p_kind:draft.kind||'memo',p_snapshot:toBase64(snapshot)});
        if(!valid())return;
        await open(id);
      }
      if(!el.isConnected)return;
      el.querySelector('[data-message]')?.remove();
      const team=document.createElement('p');team.className='comms-collab-lock';team.textContent='Visible para todas las cuentas con acceso a Comunicaciones. Quienes tengan permiso de edición pueden modificarlo y comentar en tiempo real.';el.append(team);
    }catch(error){if(el.isConnected)message(el,error.message||'No se pudo abrir el acceso compartido.',true);}
    finally{sharing=false;}
  }
  async function library() {
    const el=dialog('Comunicados del equipo');message(el,'Cargando...');
    try {
      const documents=await rpc('communication_list');if(!el.isConnected)return;
      el.querySelector('[data-message]')?.remove();
      if(!documents.length)message(el,'Todavía no hay comunicados en el espacio del equipo.');
      for(const d of documents) {
        const row=document.createElement('button');row.className='btn btn-ghost comms-share-member';row.style.width='100%';row.textContent=d.title;
        const access=document.createElement('small');access.textContent=label(d.role);row.append(access);
        row.onclick=async()=>{row.disabled=true;try{await open(d.id);el.close();}catch(error){row.disabled=false;message(el,'No se pudo abrir el comunicado. Comprueba tu acceso y conexión.',true);}};el.append(row);
      }
    }catch(error){message(el,'El espacio compartido no está disponible. No se modificaron tus documentos locales.',true);}
  }
  function rendered() {
    if(!api.current())return;
    const header=document.querySelector('.memo-panel-head .comms-header-actions');
    if(header&&!header.querySelector('[data-share-access]')) {
      const button=document.createElement('button');button.className='btn btn-secondary';button.type='button';button.dataset.shareAccess='';
      button.innerHTML=api.icon('users',16)+' Guardar en equipo';button.onclick=share;header.prepend(button);
    }
    if(!active())return;
    destroyViews();
    const panel=document.querySelector('.memo-customizer');if(!panel)return;
    if(!panel.querySelector('.comms-collab-bar')){const bar=document.createElement('div');bar.className='comms-collab-bar';panel.querySelector('.memo-panel-head').after(bar);}
    paintPresence();
    document.querySelectorAll('.memo-rich-editor[data-block-id]').forEach(element=>{
      const id=element.dataset.blockId,fragment=session.model.doc.getXmlFragment('rich:'+id);
      const view=bindRich({element,fragment,awareness:session.awareness,editable,field:id,onChange:()=>{
        if(!active())return;
        const block=richBlocks(api.current()).find(b=>b.id===id);
        if(block){Object.assign(block,readRich(fragment));api.preview();}
        else if(id==='notice-message'&&api.current().kind==='aviso'){const rich=readRich(fragment,true);api.current().noticeRichHtml=rich.richHtml;api.current().noticeMessage=rich.content;api.preview();}
      }});views.set(element,view);
      const toolbar=element.parentElement?.querySelector('.memo-rich-toolbar');
      if(toolbar&&!toolbar.querySelector('[data-comment-action]')){const button=document.createElement('button');button.type='button';button.dataset.commentAction='';button.title='Comentar selección';button.setAttribute('aria-label','Comentar texto seleccionado');button.innerHTML=api.icon('message',16)+' Comentar';button.onclick=()=>addComment(view,id);toolbar.append(button);}
      element.querySelectorAll('mark[data-comment-id]').forEach(mark=>{mark.tabIndex=0;mark.title='Abrir comentario';mark.onclick=()=>commentsDialog(mark.dataset.commentId);mark.onkeydown=event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();commentsDialog(mark.dataset.commentId);}};});
    });
    document.querySelectorAll('.memo-form input,.memo-form textarea').forEach(element=>{
      const handler=element.getAttribute('oninput')||'';
      const root=handler.match(/commsSet\('([^']+)'/),block=handler.match(/commsSetBlock\('([^']+)'\s*,\s*'([^']+)'/);
      let type=root ? session.model.root.get(root[1]) : null;
      if(block)type=session.model.root.get('blocks')?.get('_items')?.get(block[1])?.get(block[2]);
      if(!(type instanceof Y.Text))return;
      let anchor=null,head=null;
      const before=()=>{
        if(document.activeElement!==element || element.selectionStart===null)return;
        anchor=Y.createRelativePositionFromTypeIndex(type,Math.min(element.selectionStart,type.length));
        head=Y.createRelativePositionFromTypeIndex(type,Math.min(element.selectionEnd,type.length));
      };
      const changed=()=>{
        if(element.value===type.toString())return;
        element.value=type.toString();
        if(document.activeElement===element && anchor && head){
          const a=Y.createAbsolutePositionFromRelativePosition(anchor,session.model.doc),b=Y.createAbsolutePositionFromRelativePosition(head,session.model.doc);
          if(a&&b)element.setSelectionRange(a.index,b.index);
        }
      };
      session.model.doc.on('beforeTransaction',before);type.observe(changed);
      inputCleanups.push(()=>{type.unobserve(changed);session?.model.doc.off('beforeTransaction',before);});
    });
    // Lifecycle/copy operations in the local library must not fork shared state silently.
    header?.querySelectorAll('[aria-label="Acciones del comunicado"]').forEach(button=>button.disabled=true);
    if(header&&!header.querySelector('[data-comments-panel]')){const button=document.createElement('button');button.type='button';button.className='btn btn-secondary';button.dataset.commentsPanel='';button.innerHTML=api.icon('message',16)+' Comentarios '+activeComments().length;button.onclick=()=>commentsDialog();header.prepend(button);}
    status(session.transport.dirty?'Guardando cambios...':'Guardado en Index',session.blocked);
  }
  function homeRendered() {
    const header=document.querySelector('.comms-header-actions');if(!header||header.querySelector('[data-shared-library]'))return;
    const button=document.createElement('button');button.className='btn btn-secondary';button.dataset.sharedLibrary='';button.innerHTML=api.icon('users',16)+' Equipo';button.onclick=library;header.prepend(button);
  }
  document.addEventListener('focusout',()=>setTimeout(()=>{
    if(active()&&deferred&&!document.activeElement?.closest('.memo-form')){deferred=false;api.render();}
  },0));
  window.addEventListener('beforeunload',event=>{if(active()&&session.transport.dirty){event.preventDefault();event.returnValue='';}});
  return {active,editable,stop,capture,rendered,homeRendered,share,library,publishCurrent,
    prepareImage:async source=>{
      const current=session;
      if(!editable())throw Error('No tienes permiso para editar este comunicado.');
      const draft=await optimizeSharingImages({src:source},{valid:()=>session===current&&editable()});
      return draft.src;
    },
    accountChanged:id=>{if(session&&session.account!==id){stop();api.current(null);api.clearPage('La sesión cambió.');}},
    beforeRender:()=>{if(active()&&!rendering)capture();destroyViews();},
    persist:()=>{if(!active())return null;capture();session.transport.sync().catch(()=>{});return !session.blocked;},
    command:(control,command,value)=>{const element=control.closest('.memo-rich-toolbar')?.nextElementSibling,view=views.get(element);if(!view)return false;if(editable())richCommand(view,command,value);return true;},
    leave:async()=>{if(!active())return true;capture();if(!session.transport.dirty){stop();return true;}try{await session.transport.sync();if(session.transport.dirty)return false;stop();return true;}catch{return false;}}
  };
}
window.SierraCollaboration={install};
