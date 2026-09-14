import {CommunicationModel,Y,toBase64} from './model.js';
import {CommunicationTransport} from './transport.js';
import {Awareness} from 'y-protocols/awareness';
import {bindRich,readRich,seedRich,richCommand} from './rich-text.js';

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
  let session=null, rendering=false, deferred=false;
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
  function paintPresence(people=[]) {
    const bar=document.querySelector('.comms-collab-bar');if(!bar)return;
    bar.replaceChildren();
    const access=document.createElement('span');access.textContent='Privado · '+label(session.transport.role);bar.append(access);
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
    stop(false);api.current(null);api.clearPage('Abriendo comunicado privado...');
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
  async function share() {
    api.clearSelectors();
    const el=dialog('Compartir acceso');message(el,'Verificando acceso...');
    try {
      if(!active()) {
        if(!api.current() || !api.persistLocal()) throw Error('Guarda el comunicado antes de compartirlo.');
        const draft=copy(api.current()),model=new CommunicationModel();
        if(JSON.stringify(draft).includes('sierra-memo-asset:'))throw Error('Faltan imágenes locales. Recupéralas antes de compartir.');
        model.seed(stripped(draft));prepareRich(model,draft);
        const snapshot=Y.encodeStateAsUpdate(model.doc);model.doc.destroy();
        if(snapshot.length>16777216)throw Error('El comunicado supera 16 MB. Reduce sus imágenes antes de compartir.');
        const id=await rpc('communication_create',{p_source:draft.id,p_title:(draft.subject||'Comunicado').slice(0,500),p_kind:draft.kind||'memo',p_snapshot:toBase64(snapshot)});
        await open(id);
      }
      const id=session.id,access=await rpc('communication_access',{p_id:id});
      if(!el.isConnected)return;
      el.querySelector('[data-message]')?.remove();
      const privacy=document.createElement('p');privacy.className='comms-collab-lock';privacy.textContent='Privado · Solo las personas de esta lista tienen acceso.';el.append(privacy);
      const rows=document.createElement('div');el.append(rows);
      for(const person of access.members) {
        const row=document.createElement('div');row.className='comms-share-member';
        const name=document.createElement('span'),email=document.createElement('small');name.textContent=person.name;email.textContent=person.email;name.append(email);row.append(name);
        if(access.role==='owner' && person.role!=='owner') {
          const select=api.select('Acceso de '+person.name,[{value:'viewer',label:'Puede leer'},{value:'editor',label:'Puede editar'},{value:'',label:'Quitar acceso'}],person.role,async value=>{
            select.inert=true;try{await rpc('communication_share',{p_id:id,p_email:person.email,p_role:value||null});el.close();await share();}
            catch(error){select.inert=false;message(el,'No se pudo cambiar el acceso. El permiso anterior se conserva.',true);}
          });
          row.append(select);
        } else {const role=document.createElement('span');role.textContent=label(person.role);row.append(role);}
        rows.append(row);
      }
      if(access.role==='owner') {
        let invitedRole='viewer';
        const form=document.createElement('form');form.innerHTML='<label>Correo de la persona<input name="email" type="email" class="control-input" autocomplete="off" required></label><div data-role-control></div><button class="btn btn-primary" type="submit">Dar acceso</button>';
        form.querySelector('[data-role-control]').append(api.select('Permiso de la invitación',[{value:'viewer',label:'Puede leer'},{value:'editor',label:'Puede editar'}],invitedRole,value=>{invitedRole=value;}));
        form.onsubmit=async event=>{
          event.preventDefault();const button=form.querySelector('button');button.disabled=true;
          try{await rpc('communication_share',{p_id:id,p_email:form.elements.email.value,p_role:invitedRole});el.close();await share();}
          catch(error){button.disabled=false;message(el,error.code==='42501'?'No tienes permiso para compartir.':'No se pudo dar acceso. Verifica que el correo tenga una cuenta activa en Index.',true);}
        };el.append(form);
      }
    }catch(error){message(el,error.message||'No se pudo abrir el acceso compartido.',true);}
  }
  async function library() {
    const el=dialog('Comunicados compartidos');message(el,'Cargando...');
    try {
      const documents=await rpc('communication_list');if(!el.isConnected)return;
      el.querySelector('[data-message]')?.remove();
      if(!documents.length)message(el,'No tienes comunicados compartidos.');
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
      button.innerHTML=api.icon('users',16)+' Compartir acceso';button.onclick=share;header.prepend(button);
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
    status(session.transport.dirty?'Guardando cambios...':'Guardado en Index',session.blocked);
  }
  function homeRendered() {
    const header=document.querySelector('.comms-header-actions');if(!header||header.querySelector('[data-shared-library]'))return;
    const button=document.createElement('button');button.className='btn btn-secondary';button.dataset.sharedLibrary='';button.innerHTML=api.icon('users',16)+' Compartidos';button.onclick=library;header.prepend(button);
  }
  document.addEventListener('focusout',()=>setTimeout(()=>{
    if(active()&&deferred&&!document.activeElement?.closest('.memo-form')){deferred=false;api.render();}
  },0));
  window.addEventListener('beforeunload',event=>{if(active()&&session.transport.dirty){event.preventDefault();event.returnValue='';}});
  return {active,editable,stop,capture,rendered,homeRendered,share,library,
    accountChanged:id=>{if(session&&session.account!==id){stop();api.current(null);api.clearPage('La sesión cambió.');}},
    beforeRender:()=>{if(active()&&!rendering)capture();destroyViews();},
    persist:()=>{if(!active())return null;capture();session.transport.sync().catch(()=>{});return !session.blocked;},
    command:(control,command,value)=>{const element=control.closest('.memo-rich-toolbar')?.nextElementSibling,view=views.get(element);if(!view)return false;if(editable())richCommand(view,command,value);return true;},
    leave:async()=>{if(!active())return true;capture();if(!session.transport.dirty){stop();return true;}try{await session.transport.sync();if(session.transport.dirty)return false;stop();return true;}catch{return false;}}
  };
}
window.SierraCollaboration={install};
