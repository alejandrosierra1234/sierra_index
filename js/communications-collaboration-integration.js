/* Communications-only bridge. Shared document bodies never enter localStorage. */
(() => {
  const originals={renderCommunicationEditor,renderCommunicationsHome,commsPersist,commsAutosave,commsBack,commsRichCommand,logout};
  const selectors=new Map();
  window.commsShareSelectChanged=(value,id)=>selectors.get(id)?.(value);
  function select(label,options,value,change){
    const id='comms-share-'+crypto.randomUUID(),host=document.createElement('div');
    selectors.set(id,change);
    host.innerHTML=pdSelect(id,options,value,label,'commsShareSelectChanged').replace('aria-haspopup="listbox"','aria-label="'+escAttr(label)+'" aria-haspopup="listbox"');
    return host;
  }
  function validate(d) {
    if(!d || !['memo','circular','aviso','convocatoria'].includes(d.kind) || !Array.isArray(d.blocks))throw Error('Formato de comunicado no válido.');
    let count=0;
    function walk(value,depth=0) {
      if(depth>30 || ++count>50000)throw Error('El comunicado supera los límites del editor.');
      if(!value || typeof value!=='object')return;
      for(const [key,item] of Object.entries(value)) {
        if(['__proto__','constructor','prototype'].includes(key))throw Error('Campo no permitido.');
        if((key==='id'||key==='uid') && (typeof item!=='string'||!/^[a-zA-Z0-9_-]{1,200}$/.test(item)))throw Error('Identificador no válido.');
        if(typeof item==='string' && /^\s*(javascript|vbscript):/i.test(item))throw Error('Enlace no permitido.');
        if(key==='richHtml' && typeof item==='string')value[key]=commsSanitizeRich(item);
        if(key==='noticeRichHtml' && typeof item==='string')value[key]=noticeSanitizeRich(item);
        if(item && typeof item==='object')walk(item,depth+1);
      }
    }
    walk(d);
  }
  const collab=window.SierraCollaboration.install({
    account:()=>me?.id ? {id:me.id,name:profile?.full_name||me.email} : null,
    rpc:(name,args)=>{
      const writes=['communication_create','communication_share','communication_checkpoint'].includes(name)
        || (name==='communication_sync'&&args?.p_update!=null);
      if(!can('read','communications')||(writes&&!can('write','communications')))
        return Promise.resolve({error:{code:'42501',message:'No tienes el permiso requerido en Comunicaciones.'}});
      return sb.rpc(name,args);
    },
    current:function(value){if(arguments.length)_commsCurrent=value;return _commsCurrent;},
    persistLocal:()=>originals.commsPersist(),
    render:()=>renderCommunicationEditor(),preview:()=>renderMemoPreview(),
    richHtml:b=>commsRichHtml(b),noticeHtml:d=>noticeMessageHtml(d),icon:siIcon,validate,select,clearSelectors:()=>selectors.clear(),
    clearPage:message=>{const pg=document.getElementById('pg');pg.replaceChildren();const p=document.createElement('p');p.textContent=message;pg.append(p);}
  });
  sb.auth.onAuthStateChange((_event,authSession)=>collab.accountChanged(authSession?.user?.id));
  const readImage=commsReadImage;
  commsReadImage=function(input,callback){
    const owner=me?.id,documentId=_commsCurrent?.id,shared=collab.active();
    return readImage(input,async source=>{
      try{
        const image=shared?await collab.prepareImage(source):source;
        if(me?.id===owner&&_commsCurrent?.id===documentId)callback(image);
      }catch(error){toast(error.message||'No se pudo preparar la imagen. El original se conserva.');}
    });
  };
  let depth=0;
  renderCommunicationEditor=function(...args){
    const outer=depth++===0;
    if(outer)collab.beforeRender();
    try{return originals.renderCommunicationEditor(...args);}
    finally{depth--;if(outer)collab.rendered();}
  };
  renderCommunicationsHome=function(...args){const result=originals.renderCommunicationsHome(...args);collab.homeRendered();return result;};
  commsPersist=function(){if(collab.active())return collab.persist();return originals.commsPersist();};
  commsAutosave=function(){if(collab.active()){clearTimeout(_commsSaveTimer);collab.capture();return;}return originals.commsAutosave();};
  commsBack=async function(){if(!collab.active())return originals.commsBack();if(!await collab.leave()){toast('Espera a que se guarden los cambios antes de salir.');return;}_commsCurrent=null;return originals.commsBack();};
  commsRichCommand=function(control,command,value=null){if(collab.command(control,command,value))return;return originals.commsRichCommand(control,command,value);};
  logout=async function(...args){collab.stop();_commsCurrent=null;return originals.logout(...args);};
  for(const name of ['newCommunicationDraft','newNewsDraft','newNoticeDraft','newInvitationDraft','showCommunications']) {
    const original=window[name];
    window[name]=async function(...args){
      if(collab.active()){
        if(!await collab.leave()){toast('Espera a que se guarden los cambios antes de salir.');return;}
        _commsCurrent=null;
      }
      return original(...args);
    };
  }
  const openLocal=openCommunicationDraft;
  openCommunicationDraft=function(...args){
    if(collab.active()){toast('Vuelve a Comunicaciones antes de abrir otro documento.');return false;}
    return openLocal(...args);
  };
})();
