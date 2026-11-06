/* Communications-only bridge. Shared document bodies never enter localStorage. */
(() => {
  const originals={renderCommunicationEditor,renderCommunicationsHome,renderCommunicationsResults,commsPersist,commsAutosave,commsBack,commsRichCommand,logout};
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
  const durableAssets=new Map();
  const durableUrl=value=>typeof indexAssets!=='undefined'&&typeof indexAssets.canonical==='function'?indexAssets.canonical(String(value||'')):String(value||'');
  const assetExtension=type=>type==='image/png'?'png':type==='image/jpeg'?'jpg':type==='image/gif'?'gif':type==='image/svg+xml'?'svg':'webp';
  async function prepareAsset(source,draftId='communication') {
    let value=String(source||'');
    if(!value)return value;
    if(value.startsWith('sierra-memo-asset:'))value=await commsAssetRead(value);
    if(!/^data:image\//i.test(value))return durableUrl(value);
    if(durableAssets.has(value))return durableAssets.get(value);
    const owner=me?.id;
    const task=(async()=>{
      if(!owner||!can('write','communications'))throw Error('No tienes permiso para guardar imágenes en Comunicaciones.');
      const response=await fetch(value),blob=await response.blob();
      if(!blob.type.startsWith('image/'))throw Error('La imagen no tiene un formato válido.');
      const hash=[...new Uint8Array(await crypto.subtle.digest('SHA-256',await blob.arrayBuffer()))].map(byte=>byte.toString(16).padStart(2,'0')).join('');
      const safeId=String(draftId||'communication').replace(/[^a-zA-Z0-9_-]/g,'-').slice(0,120)||'communication';
      const path=`communications/${safeId}/${hash}.${assetExtension(blob.type)}`;
      const {error}=await sb.storage.from('product-images').upload(path,blob,{contentType:blob.type,upsert:false,cacheControl:'31536000'});
      if(error&&!/already exists|duplicate|conflict|resource exists/i.test(error.message||''))throw Error('No se pudo guardar una imagen del comunicado. '+error.message);
      if(me?.id!==owner)throw Error('La sesión cambió mientras se guardaban las imágenes.');
      return durableUrl(sb.storage.from('product-images').getPublicUrl(path).data.publicUrl);
    })();
    durableAssets.set(value,task);
    try{return await task}catch(error){durableAssets.delete(value);throw error;}
  }
  async function prepareCloud(draft,progress=()=>{}) {
    const copy=JSON.parse(JSON.stringify(draft)),refs=[];
    const collect=value=>{if(typeof value==='string'&&(value.startsWith('sierra-memo-asset:')||/^data:image\//i.test(value)))refs.push(value);else if(Array.isArray(value))value.forEach(collect);else if(value&&typeof value==='object')Object.values(value).forEach(collect);};
    collect(copy);const unique=[...new Set(refs)],resolved=new Map();let done=0;
    for(const source of unique){resolved.set(source,await prepareAsset(source,copy.id));progress(++done,unique.length);}
    const replace=value=>{if(typeof value==='string')return resolved.get(value)||value;if(Array.isArray(value))return value.map(replace);if(value&&typeof value==='object')for(const key of Object.keys(value))value[key]=replace(value[key]);return value;};
    return replace(copy);
  }
  const collab=window.SierraCollaboration.install({
    account:()=>me?.id ? {id:me.id,name:profile?.full_name||me.email,email:me.email||'',avatar:profile?.avatar_url||''} : null,
    rpc:(name,args)=>{
      const writes=['communication_create','communication_import','communication_catalog','communication_share','communication_checkpoint'].includes(name)
        || (name==='communication_sync'&&args?.p_update!=null);
      if(!me?.id||(writes&&!can('write','communications')))
        return Promise.resolve({error:{code:'42501',message:writes?'No tienes permiso para editar Comunicaciones.':'Inicia sesión para abrir este comunicado.'}});
      return sb.rpc(name,args);
    },
    current:function(value){if(arguments.length)_commsCurrent=value;return _commsCurrent;},
    localDrafts:()=>_commsDrafts,
    canWrite:()=>can('write','communications'),
    prepareCloud,prepareAsset,
    persistLocal:()=>originals.commsPersist(),
    render:()=>renderCommunicationEditor(),preview:()=>renderMemoPreview(),previewHtml:d=>memoPageHtml(d,true),
    richHtml:b=>commsRichHtml(b),noticeHtml:d=>noticeMessageHtml(d),icon:siIcon,validate,select,clearSelectors:()=>selectors.clear(),
    clearPage:message=>{const pg=document.getElementById('pg');pg.replaceChildren();const p=document.createElement('p');p.textContent=message;pg.append(p);}
  });
  const infographicCollab=window.SierraCollaboration.installInfographics({
    account:()=>me?.id?{id:me.id,name:profile?.full_name||me.email,email:me.email||''}:null,
    rpc:(name,args)=>{
      const writes=name==='communication_create'||(name==='communication_sync'&&args?.p_update!=null);
      if(!me?.id||(writes&&!can('write','communications')))return Promise.resolve({error:{code:'42501',message:writes?'No tienes permiso para editar Comunicaciones.':'Inicia sesión para abrir esta infografía.'}});
      return sb.rpc(name,args);
    },
    validate:d=>{if(!d||d.kind!=='infographic'||!Array.isArray(d.blocks)||typeof d.id!=='string')throw Error('Formato de infografía no válido.');},
    remote:(draft,role)=>window.infoReceiveRemote?.(draft,role),status:(text,blocked)=>window.infoCloudStatus?.(text,blocked)
  });
  window.SierraInfographicTeam=infographicCollab;
  const orgChartCollab=window.SierraCollaboration.installOrgCharts({
    account:()=>me?.id?{id:me.id,name:profile?.full_name||me.email,email:me.email||''}:null,
    rpc:(name,args)=>{
      const writes=name==='communication_create'||(name==='communication_sync'&&args?.p_update!=null);
      if(!me?.id||(writes&&!can('write','communications')))return Promise.resolve({error:{code:'42501',message:writes?'No tienes permiso para editar Marketing.':'Inicia sesión para abrir este organigrama.'}});
      return sb.rpc(name,args);
    },
    validate:d=>{if(!d||d.kind!=='orgchart'||!Array.isArray(d.people)||typeof d.id!=='string')throw Error('Formato de organigrama no válido.');},
    remote:(draft,role)=>window.orgChartReceiveRemote?.(draft,role),status:(text,blocked)=>window.orgChartCloudStatus?.(text,blocked)
  });
  window.SierraOrgChartTeam=orgChartCollab;
  sb.auth.onAuthStateChange((_event,authSession)=>{collab.accountChanged(authSession?.user?.id);infographicCollab.accountChanged(authSession?.user?.id);orgChartCollab.accountChanged(authSession?.user?.id);});
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
  renderCommunicationsHome=function(...args){return originals.renderCommunicationsHome(...args);};
  renderCommunicationsResults=function(...args){const result=originals.renderCommunicationsResults(...args);collab.homeRendered();return result;};
  commsPersist=function(){if(collab.active())return collab.persist();return originals.commsPersist();};
  commsAutosave=function(){if(collab.active()){clearTimeout(_commsSaveTimer);collab.capture();return;}return originals.commsAutosave();};
  commsBack=async function(){if(!collab.active())return originals.commsBack();if(!await collab.leave()){toast('Espera a que se guarden los cambios antes de salir.');return;}_commsCurrent=null;return originals.commsBack();};
  commsRichCommand=function(control,command,value=null){if(collab.command(control,command,value))return;return originals.commsRichCommand(control,command,value);};
  logout=async function(...args){collab.stop();await infographicCollab.leave();await orgChartCollab.leave();_commsCurrent=null;return originals.logout(...args);};
  for(const name of ['newCommunicationDraft','newNewsDraft','newNoticeDraft','newInvitationDraft','showCommunications']) {
    const original=window[name];
    window[name]=async function(...args){
      if(collab.active()){
        if(!await collab.leave()){toast('Espera a que se guarden los cambios antes de salir.');return;}
        _commsCurrent=null;
      }
      const result=await original(...args);
      if(name!=='showCommunications'&&_commsCurrent&&!collab.active())try{await collab.publishCurrent();}catch(error){toast(error.message||'El comunicado se guardó localmente, pero todavía no está disponible para el equipo.');}
      return result;
    };
  }
  const openLocal=openCommunicationDraft;
  openCommunicationDraft=function(...args){
    if(collab.active()){toast('Vuelve a Comunicaciones antes de abrir otro documento.');return false;}
    const opened=openLocal(...args);
    if(opened)queueMicrotask(()=>collab.publishCurrent().catch(error=>toast(error.message||'El comunicado se abrió localmente, pero todavía no está disponible para el equipo.')));
    return opened;
  };
  const duplicateLocal=commsDuplicate;
  commsDuplicate=async function(...args){
    const result=duplicateLocal(...args);
    if(_commsCurrent&&!collab.active())try{await collab.publishCurrent();}catch(error){toast(error.message||'La copia se guardó localmente, pero todavía no está disponible para el equipo.');}
    return result;
  };
})();
