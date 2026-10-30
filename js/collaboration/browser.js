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

const shortText = value => String(value || '').replace(/\s+/g,' ').trim().slice(0,80);
const initials = value => shortText(value).split(' ').filter(Boolean).slice(0,2).map(part=>part[0]?.toUpperCase()).join('') || 'SI';
const safeColor = (value,fallback='#007d73') => /^#[0-9a-f]{6}$/i.test(value || '') ? value : fallback;
const stableKey = value => {let hash=2166136261;for(const char of String(value)){hash^=char.charCodeAt(0);hash=Math.imul(hash,16777619);}return (hash>>>0).toString(36);};
function areaName(element,index=0) {
  const field=element.closest('.memo-field,.invite-image-control,.simple-invite-banner-control');
  const fieldLabel=field?.querySelector('label,span');
  if(shortText(fieldLabel?.textContent))return shortText(fieldLabel.textContent);
  const block=element.closest('.memo-block,.invite-card-outline,.invite-item-editor');
  const blockLabel=block?.querySelector('.memo-block-kind,.invite-card-toggle b,.invite-item-editor-head b');
  if(shortText(blockLabel?.textContent))return shortText(blockLabel.textContent);
  const section=element.closest('.memo-form-section');
  const sectionLabel=section?.querySelector('.memo-form-section-title');
  return shortText(element.getAttribute('aria-label') || element.getAttribute('placeholder') || sectionLabel?.textContent) || `Área ${index+1}`;
}
function controlKey(element,index=0) {
  const behavior=['id','name','oninput','onchange','onclick'].map(name=>element.getAttribute(name)||'').join('|');
  const context=element.closest('[data-invitation-card],[data-flow-block]')?.getAttribute('data-invitation-card') || element.closest('[data-flow-block]')?.getAttribute('data-flow-block') || '';
  return 'control:'+stableKey(behavior+'|'+context+'|'+areaName(element,index)+'|'+element.tagName+'|'+(element.getAttribute('type')||''));
}

function install(api) {
  let session=null, rendering=false, deferred=false, sharing=false,homeRequest=0;
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
    document.querySelectorAll('#memo-save-state,[data-collab-status]').forEach(el=>(el.querySelector('span')||el).textContent=text);
    if(session.transport.stopped) {
      document.querySelector('.memo-customizer')?.setAttribute('data-collab-disconnected','true');
      views.forEach(view=>view.setProps({editable:()=>false}));
      return;
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
    if(session){
      const current=session;
      if(!current.transport.stopped)current.transport.leave().catch(()=>current.transport.stop());
      else current.transport.stop();
      current.awareness.destroy();current.model.doc.destroy();
    }
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
        states.set(id,{user:{name,color},field:state.field,area:state.area,mode:state.mode,cursor:state.cursor});seen.add(id);
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
  function presenceRows(people=[]) {
    const rows=[],local=api.account()||{},localState=session.awareness.getLocalState()||{};
    rows.push({key:'local',userId:local.id||'',name:local.name||'Tú',self:true,color:safeColor(localState.user?.color),area:shortText(localState.area)||'Documento',field:localState.field||'document',mode:localState.mode||'area'});
    for(const person of people){
      if(person.session_id===session.transport.session)continue;
      try{
        const state=JSON.parse(person.awareness||'{}'),clientId=Number(state.clientID);
        if(!Number.isSafeInteger(clientId))continue;
        rows.push({key:person.session_id||String(clientId),userId:person.user_id||'',name:shortText(person.name)||'Colaborador',self:false,
          color:colors[clientId%colors.length],area:shortText(state.area)||'Documento',field:state.field||'document',mode:state.mode||'area',seenAt:person.seen_at||''});
      }catch{/* Ignore malformed ephemeral presence. */}
    }
    const unique=new Map();
    for(const row of rows){const key=row.self?'local':row.userId||row.key,previous=unique.get(key);if(!previous||String(row.seenAt)>String(previous.seenAt))unique.set(key,row);}
    return [...unique.values()];
  }
  function recordPresenceEvents(rows) {
    const next=new Map(rows.filter(row=>!row.self).map(row=>[row.key,row]));
    if(session.presenceReady){
      next.forEach((row,key)=>{if(!session.presenceSessions.has(key))session.events.unshift({text:`${row.name} entró al documento`,at:new Date(),kind:'join'});});
      session.presenceSessions.forEach((row,key)=>{if(!next.has(key))session.events.unshift({text:`${row.name} salió del documento`,at:new Date(),kind:'leave'});});
      session.events=session.events.slice(0,12);
    }else session.presenceReady=true;
    session.presenceSessions=next;
  }
  function paintRemoteAreas(rows) {
    const panel=document.querySelector('.memo-customizer');if(!panel)return;
    panel.querySelectorAll('.comms-remote-area').forEach(el=>el.classList.remove('comms-remote-area'));
    panel.querySelectorAll('[data-remote-presence]').forEach(el=>el.remove());
    const grouped=new Map();
    rows.filter(row=>!row.self&&row.field&&row.field!=='document').forEach(row=>{const list=grouped.get(row.field)||[];list.push(row);grouped.set(row.field,list);});
    grouped.forEach((activeRows,field)=>{
      const target=[...panel.querySelectorAll('[data-collab-key]')].find(element=>element.dataset.collabKey===field);if(!target)return;
      const area=target.closest('.memo-block,.invite-card-outline,.invite-item-editor,.memo-field,.memo-form-section')||target;
      area.classList.add('comms-remote-area');area.style.setProperty('--remote-color',safeColor(activeRows[0].color));
      const badge=document.createElement('span');badge.dataset.remotePresence='';badge.className='comms-remote-badge';
      badge.style.setProperty('--remote-color',safeColor(activeRows[0].color));badge.textContent=activeRows.map(row=>row.name).join(', ');area.append(badge);
    });
  }
  function personNode(row) {
    const item=document.createElement('span');item.className='comms-collab-person';item.style.setProperty('--person-color',safeColor(row.color));
    const avatar=document.createElement('span');avatar.className='comms-collab-avatar';avatar.setAttribute('aria-hidden','true');avatar.textContent=initials(row.name);
    const text=document.createElement('span'),name=document.createElement('strong'),area=document.createElement('small');
    name.textContent=row.self?'Tú':row.name;area.textContent=row.area;text.append(name,area);item.append(avatar,text);return item;
  }
  function presenceDialog() {
    if(!active())return;
    const el=dialog('Personas en este comunicado'),rows=session.presenceRows||[];
    const intro=document.createElement('p');intro.className='comms-collab-lock';intro.textContent='La ubicación se actualiza mientras cada persona trabaja. En los bloques de texto también verás su cursor y selección.';el.append(intro);
    const list=document.createElement('div');list.className='comms-presence-list';
    rows.forEach(row=>{const card=document.createElement('div');card.className='comms-presence-card';card.append(personNode(row));const state=document.createElement('span');state.className='comms-presence-online';state.textContent='En línea';card.append(state);list.append(card);});el.append(list);
    const heading=document.createElement('h3');heading.className='comms-presence-heading';heading.textContent='Actividad reciente';el.append(heading);
    const events=document.createElement('ol');events.className='comms-presence-events';
    if(!session.events.length){const empty=document.createElement('li');empty.textContent='Aún no hay entradas o salidas durante esta sesión.';events.append(empty);}
    session.events.forEach(event=>{const item=document.createElement('li');const time=document.createElement('time');time.textContent=event.at.toLocaleTimeString('es-GT',{hour:'2-digit',minute:'2-digit'});item.append(document.createTextNode(event.text+' '),time);events.append(item);});el.append(events);
  }
  function paintPresence(people=[]) {
    const bar=document.querySelector('.comms-collab-bar');if(!bar||!session)return;
    const rows=presenceRows(people);recordPresenceEvents(rows);session.presenceRows=rows;session.lastPresence=people;
    bar.replaceChildren();
    const collaborators=rows.filter(row=>!row.self),peopleButton=document.createElement('button');peopleButton.type='button';peopleButton.className='comms-collab-people';peopleButton.dataset.presencePanel='';peopleButton.setAttribute('aria-label',collaborators.length?`${collaborators.length} ${collaborators.length===1?'colaborador conectado':'colaboradores conectados'}`:'Solo tú estás en este comunicado');peopleButton.onclick=presenceDialog;
    collaborators.slice(0,3).forEach(row=>peopleButton.append(personNode(row)));
    if(collaborators.length>3){const more=document.createElement('span');more.className='comms-collab-more';more.textContent=`+${collaborators.length-3}`;peopleButton.append(more);}else if(!collaborators.length){const alone=document.createElement('span');alone.className='comms-collab-alone';alone.textContent='Solo tú';peopleButton.append(alone);}bar.append(peopleButton);
    paintRemoteAreas(rows);
  }
  function setActivity(field,area,mode='area') {
    if(!active())return;
    session.awareness.setLocalState({...session.awareness.getLocalState(),field,area:shortText(area)||'Documento',mode});
    paintPresence(session.lastPresence||[]);session.transport.sync().catch(()=>{});
  }
  async function open(id) {
    if(active() && session.id===id)return;
    if(active()){capture();await session.transport.sync();if(session.transport.dirty)throw Error('Todavía hay cambios pendientes.');}
    if(!active() && api.current() && !api.persistLocal())throw Error('No se pudo guardar el documento local.');
    stop(false);
    const account=getAccount(),model=new CommunicationModel(),awareness=new Awareness(model.doc);
    const current={id,account,model,awareness,blocked:true,source:null,baseline:{},presenceReady:false,presenceSessions:new Map(),presenceRows:[],events:[],lastPresence:[]};
    const transport=new CommunicationTransport({doc:model.doc,
      rpc:(name,args)=>rpc(name,{p_id:id,...args}),valid:()=>session===current&&getAccount()===account,
      presence:()=>({clientID:model.doc.clientID,...awareness.getLocalState()}),
      onChange:data=>{if(current.source)applyRemote(data);},onStatus:status});
    current.transport=transport;session=current;
    try {
      await transport.sync();if(session!==current)return;
      const d=read();api.validate(d);current.source=d.id;current.baseline=stripped(d);current.blocked=false;
      awareness.setLocalState({user:{name:api.account().name||'Colaborador',color:colors[model.doc.clientID%colors.length]},field:'document',area:'Documento',mode:'area'});
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
  const awarenessOf=person=>{try{return JSON.parse(person.awareness||'{}')}catch{return{}}};
  const peopleIn=document=>{
    const people=new Map();
    for(const person of document.presence||[]){const previous=people.get(person.user_id);if(!previous||String(previous.seen_at)<String(person.seen_at))people.set(person.user_id,person);}
    return [...people.values()];
  };
  const avatarFor=person=>{
    const avatar=document.createElement('span');avatar.className='comms-collab-avatar';avatar.textContent=initials(person.name);avatar.style.setProperty('--person-color',colors[parseInt(stableKey(person.user_id||person.name),36)%colors.length]);avatar.setAttribute('aria-hidden','true');return avatar;
  };
  function renderTeamActivity(el,documents){
    el.querySelector('[data-message]')?.remove();el.querySelector('[data-team-body]')?.remove();
    const body=document.createElement('div');body.dataset.teamBody='';body.className='comms-team-body';body.setAttribute('aria-live','polite');
    const intro=document.createElement('p');intro.className='comms-team-intro';intro.textContent='Consulta quién está trabajando, en qué comunicado y en qué área, sin abrir el documento.';body.append(intro);
    if(!documents.length){const empty=document.createElement('p');empty.className='comms-team-empty';empty.textContent='Todavía no hay comunicados en el espacio del equipo.';body.append(empty);el.append(body);return;}
    const live=documents.map(document=>({document,people:peopleIn(document)})).filter(item=>item.people.length);
    const heading=document.createElement('h3');heading.className='comms-team-heading';heading.textContent=`Ahora mismo · ${live.reduce((sum,item)=>sum+item.people.length,0)} en línea`;body.append(heading);
    if(!live.length){const empty=document.createElement('p');empty.className='comms-team-empty';empty.textContent='Nadie está editando ahora.';body.append(empty);}
    else for(const {document:record,people} of live){
      const card=document.createElement('section');card.className='comms-team-document';
      const openButton=document.createElement('button');openButton.type='button';openButton.className='comms-team-document-open';
      const title=document.createElement('strong');title.textContent=record.title||'Comunicado sin título';const hint=document.createElement('small');hint.textContent=`${people.length} ${people.length===1?'persona':'personas'} · Abrir comunicado`;openButton.append(title,hint);
      openButton.onclick=async()=>{openButton.disabled=true;try{await open(record.id);el.close();}catch(error){openButton.disabled=false;message(el,'No se pudo abrir el comunicado. Comprueba tu acceso y conexión.',true);}};card.append(openButton);
      const list=document.createElement('div');list.className='comms-team-people';
      for(const person of people){const awareness=awarenessOf(person),row=document.createElement('div');row.className='comms-team-person';row.append(avatarFor(person));const copy=document.createElement('span'),name=document.createElement('strong'),area=document.createElement('small');name.textContent=person.name||'Cuenta SIERRA';area.textContent=shortText(awareness.area)||'En el documento';copy.append(name,area);row.append(copy);list.append(row);}
      card.append(list);body.append(card);
    }
    const sharedHeading=document.createElement('h3');sharedHeading.className='comms-team-heading';sharedHeading.textContent='Comunicados compartidos';body.append(sharedHeading);
    const all=document.createElement('div');all.className='comms-team-documents';
    for(const record of documents){const people=peopleIn(record),row=document.createElement('button');row.type='button';row.className='comms-team-document-row';const copy=document.createElement('span'),title=document.createElement('strong'),meta=document.createElement('small'),count=document.createElement('span');title.textContent=record.title||'Comunicado sin título';meta.textContent=label(record.role);copy.append(title,meta);count.className=people.length?'is-online':'';count.textContent=people.length?`${people.length} en línea`:'Sin actividad';row.append(copy,count);row.onclick=async()=>{row.disabled=true;try{await open(record.id);el.close();}catch(error){row.disabled=false;message(el,'No se pudo abrir el comunicado. Comprueba tu acceso y conexión.',true);}};all.append(row);}
    body.append(all);el.append(body);
  }
  async function library() {
    const el=dialog('Actividad del equipo');el.classList.add('comms-team-dialog');message(el,'Cargando actividad...');let stopped=false,loading=false,timer=0;
    const load=async()=>{if(stopped||loading)return;loading=true;try{const documents=await rpc('communication_list');if(el.isConnected)renderTeamActivity(el,documents||[]);}catch(error){if(el.isConnected)message(el,'El espacio compartido no está disponible. No se modificaron tus documentos locales.',true);}finally{loading=false;}};
    el.addEventListener('close',()=>{stopped=true;clearInterval(timer)},{once:true});await load();if(!stopped)timer=setInterval(load,4000);
  }
  const kindName=kind=>({memo:'Memo',convocatoria:'Convocatoria',circular:'Circular informativa',aviso:'Aviso'}[kind]||'Comunicado');
  const sharedHomeRecords=documents=>{
    if(typeof _commsView!=='undefined'&&_commsView!=='active')return[];
    const localIds=new Set((typeof _commsDrafts==='undefined'?[]:_commsDrafts).map(d=>d.id));
    const account=getAccount(),kind=typeof _commsKind==='undefined'?'':_commsKind;
    const query=String(typeof _commsQuery==='undefined'?'':_commsQuery).trim().toLocaleLowerCase('es');
    return (documents||[]).filter(record=>{
      if(record.owner_id===account&&record.source_id&&localIds.has(record.source_id))return false;
      if(kind&&(record.kind||'memo')!==kind)return false;
      return !query||[record.title,record.owner_name,kindName(record.kind),label(record.role)].join(' ').toLocaleLowerCase('es').includes(query);
    });
  };
  function updateSharedCounts(documents) {
    if(typeof _commsDrafts==='undefined')return;
    const localIds=new Set(_commsDrafts.map(d=>d.id)),account=getAccount();
    const shared=(documents||[]).filter(record=>!(record.owner_id===account&&record.source_id&&localIds.has(record.source_id)));
    document.querySelectorAll('.comms-kind-tab[data-kind]').forEach(button=>{
      const kind=button.dataset.kind,count=shared.filter(record=>!kind||(record.kind||'memo')===kind).length;
      const local=_commsDrafts.filter(d=>d.lifecycle==='active'&&(!kind||(d.kind||'memo')===kind)).length;
      const badge=button.querySelector('.comms-kind-count');if(badge)badge.textContent=String(local+count);
    });
    const activeTab=document.querySelector('.comms-lifecycle-tabs button:first-child span');
    if(activeTab)activeTab.textContent=String(_commsDrafts.filter(d=>d.lifecycle==='active').length+shared.length);
  }
  function renderSharedHome(results,documents) {
    results.querySelector('[data-shared-home]')?.remove();updateSharedCounts(documents);
    const records=sharedHomeRecords(documents);if(!records.length)return;
    results.querySelector('.memo-empty')?.setAttribute('hidden','');
    const grid=typeof _commsLayout!=='undefined'&&_commsLayout==='grid';
    const section=document.createElement('section');section.dataset.sharedHome='';section.className='comms-shared-library'+(grid?' is-grid':'');section.setAttribute('aria-labelledby','comms-shared-library-title');
    const heading=document.createElement('div');heading.className='comms-shared-library-heading';
    const copy=document.createElement('span'),title=document.createElement('h2'),hint=document.createElement('p'),count=document.createElement('span');
    title.id='comms-shared-library-title';title.textContent='Biblioteca del equipo';hint.textContent='Comunicados creados por otras personas y documentos compartidos contigo.';copy.append(title,hint);count.textContent=String(records.length);count.setAttribute('aria-label',`${records.length} ${records.length===1?'comunicado compartido':'comunicados compartidos'}`);heading.append(copy,count);section.append(heading);
    const list=document.createElement('div');list.className=grid?'comms-library-grid comms-shared-library-grid':'comms-shared-library-rows';
    for(const record of records){
      const row=document.createElement('button');row.type='button';row.className=grid?'comms-shared-card-open':'comms-shared-library-row';row.dataset.sharedCommunication=record.id;
      const body=document.createElement('span'),top=document.createElement('span'),kind=document.createElement('span'),recordTitle=document.createElement('strong'),meta=document.createElement('span'),access=document.createElement('span');
      body.className='comms-shared-library-copy';top.className='comms-shared-library-title';kind.className='comms-document-kind';kind.textContent=kindName(record.kind);recordTitle.textContent=record.title||'Comunicado sin título';top.append(kind,recordTitle);
      meta.className='comms-shared-library-meta';meta.textContent=`Por ${record.owner_name||'Equipo SIERRA'}${record.updated_at?' · '+new Date(record.updated_at).toLocaleDateString('es-GT',{day:'2-digit',month:'short',year:'numeric'}):''}`;body.append(top,meta);
      access.className='comms-shared-library-access';access.textContent=label(record.role);row.append(body,access);
      row.onclick=async()=>{row.disabled=true;try{await open(record.id);}catch(error){row.disabled=false;message(dialog('Biblioteca del equipo'),error.message||'No se pudo abrir el comunicado.',true);}};
      if(grid){
        const card=document.createElement('article');card.className='comms-shared-library-card';card.dataset.kind=record.kind||'memo';
        const preview=document.createElement('span'),sheet=document.createElement('span'),previewKind=document.createElement('span');preview.className='comms-shared-card-preview';preview.setAttribute('aria-hidden','true');sheet.className='comms-shared-card-sheet';sheet.innerHTML=api.icon('file',28);previewKind.textContent=kindName(record.kind);sheet.append(previewKind);preview.append(sheet);row.prepend(preview);card.append(row);list.append(card);
      }else list.append(row);
    }
    section.append(list);const head=results.querySelector('.comms-results-head');if(head)head.after(section);else results.prepend(section);
  }
  async function loadSharedHome() {
    const request=++homeRequest,results=document.getElementById('comms-results');if(!results||!document.querySelector('.comms-home'))return;
    results.querySelector('[data-shared-home]')?.remove();
    if(typeof _commsView!=='undefined'&&_commsView!=='active')return;
    const loading=document.createElement('p');loading.dataset.sharedHome='';loading.className='comms-shared-library-loading';loading.textContent='Cargando biblioteca del equipo…';results.querySelector('.comms-results-head')?.after(loading);
    try{
      const documents=await rpc('communication_list');
      if(request!==homeRequest||results!==document.getElementById('comms-results'))return;
      renderSharedHome(results,documents||[]);
    }catch(error){
      if(request!==homeRequest||results!==document.getElementById('comms-results'))return;
      loading.textContent='No se pudo cargar la biblioteca del equipo. Tus documentos locales siguen disponibles.';loading.classList.add('is-error');
    }
  }
  function rendered() {
    if(!api.current())return;
    const header=document.querySelector('#product-controls .comms-header-actions,.memo-panel-head .comms-header-actions');
    if(!active())return;
    destroyViews();
    const panel=document.querySelector('.memo-customizer');if(!panel)return;
    if(!document.querySelector('.comms-collab-bar')){const bar=document.createElement('div');bar.className='comms-collab-bar';header?.before(bar);}
    document.querySelectorAll('.memo-rich-editor[data-block-id]').forEach(element=>{
      const id=element.dataset.blockId,fragment=session.model.doc.getXmlFragment('rich:'+id);
      const area=areaName(element,[...document.querySelectorAll('.memo-rich-editor[data-block-id]')].indexOf(element));
      element.dataset.collabKey=id;
      const view=bindRich({element,fragment,awareness:session.awareness,editable,field:id,area,onActivity:()=>setActivity(id,area,'cursor'),onChange:()=>{
        if(!active())return;
        const block=richBlocks(api.current()).find(b=>b.id===id);
        if(block){Object.assign(block,readRich(fragment));api.preview();}
        else if(id==='notice-message'&&api.current().kind==='aviso'){const rich=readRich(fragment,true);api.current().noticeRichHtml=rich.richHtml;api.current().noticeMessage=rich.content;api.preview();}
      }});views.set(element,view);
      const toolbar=element.parentElement?.querySelector('.memo-rich-toolbar');
      if(toolbar&&!toolbar.querySelector('[data-comment-action]')){const button=document.createElement('button');button.type='button';button.dataset.commentAction='';button.title='Comentar selección';button.setAttribute('aria-label','Comentar texto seleccionado');button.innerHTML=api.icon('message',16)+' Comentar';button.onclick=()=>addComment(view,id);toolbar.append(button);}
      element.querySelectorAll('mark[data-comment-id]').forEach(mark=>{mark.tabIndex=0;mark.title='Abrir comentario';mark.onclick=()=>commentsDialog(mark.dataset.commentId);mark.onkeydown=event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();commentsDialog(mark.dataset.commentId);}};});
    });
    const controls=[...panel.querySelectorAll('.memo-form input,.memo-form textarea,.memo-form select,.memo-form button,.memo-form [role="button"],.memo-form summary')]
      .filter(element=>!element.closest('.memo-rich-toolbar')&&!element.closest('.memo-rich-editor'));
    controls.forEach((element,index)=>{
      const key=controlKey(element,index),area=areaName(element,index);element.dataset.collabKey=key;
      const focused=()=>setActivity(key,area,element.matches('input,textarea')?'field':'area');
      element.addEventListener('focus',focused);element.addEventListener('pointerdown',focused);
      inputCleanups.push(()=>{element.removeEventListener('focus',focused);element.removeEventListener('pointerdown',focused);});
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
    paintPresence(session.lastPresence||[]);
    status(session.transport.dirty?'Guardando en línea…':'Guardado en línea',session.blocked);
  }
  function homeRendered() {
    const header=document.querySelector('.comms-header-actions');if(!header)return;
    if(!header.querySelector('[data-shared-library]')){const button=document.createElement('button');button.className='btn btn-secondary';button.dataset.sharedLibrary='';button.innerHTML=api.icon('users',16)+' Actividad';button.onclick=library;header.prepend(button);}
    loadSharedHome();
  }
  document.addEventListener('focusout',()=>setTimeout(()=>{
    if(active()&&deferred&&!document.activeElement?.closest('.memo-form')){deferred=false;api.render();}
  },0));
  window.addEventListener('beforeunload',event=>{if(active()&&session.transport.dirty){event.preventDefault();event.returnValue='';}});
  window.addEventListener('pagehide',()=>{if(active())session.transport.leave().catch(()=>{});});
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
    leave:async()=>{if(!active())return true;capture();try{const current=session;for(let attempt=0;current.transport.dirty&&attempt<3;attempt++)await current.transport.sync();if(current.transport.dirty)return false;await current.transport.leave();if(session===current)stop();return true;}catch{return false;}}
  };
}
window.SierraCollaboration={install};
