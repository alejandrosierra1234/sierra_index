/* Module permissions complement, never replace, per-document server access. */
(() => {
  const read=()=>can('read','communications');
  const write=()=>read()&&can('write','communications');
  const denied=()=>{
    clearTimeout(_commsSaveTimer);
    _commsCurrent=null;_commsDrafts=[];
    document.getElementById('pg').innerHTML='<div class="memo-empty" role="status">No tienes acceso a Comunicaciones. Solicita acceso al administrador de Index.</div>';
    return false;
  };
  const guard=(name,allowed,fallback)=>{
    const original=window[name];
    if(typeof original!=='function')throw Error('Missing communication access boundary: '+name);
    window[name]=function(...args){return allowed()?original.apply(this,args):fallback();};
  };
  guard('showCommunications',read,denied);
  guard('commsStorageKey',read,()=>{throw Error('Sin acceso a Comunicaciones.');});
  guard('commsLoad',read,denied);
  guard('renderCommunicationsHome',read,denied);
  guard('renderCommunicationReadOnly',read,denied);
  for(const name of ['newCommunicationDraft','newNewsDraft','newNoticeDraft','newInvitationDraft',
    'commsWriteAll','commsNextNumber','commsRecordHighWater','commsDuplicate','commsLifecycle','commsDeletePermanently'])
    guard(name,write,()=>{toast('Tu acceso a Comunicaciones es de solo lectura.');return false;});
  guard('commsPersist',write,()=>{clearTimeout(_commsSaveTimer);return read();});
  guard('commsAutosave',write,()=>{clearTimeout(_commsSaveTimer);return false;});
  const render=renderCommunicationEditor;
  renderCommunicationEditor=function(...args){
    if(!read())return denied();
    if(write())return render(...args);
    if(!_commsCurrent)return;
    renderCommunicationReadOnly();
    document.getElementById('sec-sub').textContent='Solo lectura';
    document.querySelectorAll('.comms-readonly button[onclick*="commsLifecycle"],.comms-readonly button[onclick*="commsOpenActions"]').forEach(el=>el.remove());
  };
  const home=renderCommunicationsHome;
  renderCommunicationsHome=function(...args){
    const result=home(...args);
    if(read()&&!write())document.querySelectorAll('.comms-header-actions button[onclick^="new"]').forEach(el=>el.remove());
    return result;
  };
  const actions=commsOpenActions;
  commsOpenActions=function(event,id){
    if(!read())return denied();
    if(write())return actions(event,id);
    commsPopover(event,menu=>commsMenuItem(menu,'Abrir',()=>openCommunicationDraft(id)));
  };
  guard('openCommunicationDraft',read,denied);
  for(const name of ['commsExportPdf','downloadCommunicationImage','commsBackupDraft'])guard(name,read,denied);
})();
