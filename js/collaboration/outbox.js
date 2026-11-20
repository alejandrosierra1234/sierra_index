// Pending updates are scoped to the signed-in account and document. They are
// replayed only after the server has re-authorized write access to that document.
export function createOutbox(scope, indexedDB=globalThis.indexedDB) {
  const key=scope+':'+crypto.randomUUID();
  let database;
  const db=()=>database||(database=new Promise((resolve,reject)=>{
    if(!indexedDB)return reject(Error('No hay respaldo local disponible.'));
    const request=indexedDB.open('sierra-communication-outbox-v1',1);
    request.onupgradeneeded=()=>request.result.createObjectStore('pending',{keyPath:'key'});
    request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);
  }));
  const transaction=async(mode,run)=>{const connection=await db();return new Promise((resolve,reject)=>{
    const tx=connection.transaction('pending',mode),store=tx.objectStore('pending');let result;
    run(store,value=>{result=value});tx.oncomplete=()=>resolve(result);tx.onerror=tx.onabort=()=>reject(tx.error||Error('No se pudo respaldar el cambio.'));
  });};
  return {
    load:()=>transaction('readonly',(store,done)=>{const request=store.getAll();request.onsuccess=()=>done(request.result.filter(row=>row.scope===scope));}),
    save:update=>transaction('readwrite',store=>{if(update)store.put({key,scope,update});else store.delete(key);}),
    // A second tab may have extended an entry since it was read. Never remove
    // that newer version; replaying the same Yjs update is harmless.
    remove:rows=>transaction('readwrite',store=>rows.forEach(row=>{const request=store.get(row.key);request.onsuccess=()=>{if(request.result?.update===row.update)store.delete(row.key);};}))
  };
}
