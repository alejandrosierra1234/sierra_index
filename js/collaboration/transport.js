import {Y, toBase64, fromBase64} from './model.js';

// Every exchange goes through an authenticated RPC, including cursor updates.
// No private payload is broadcast on a channel with cached membership checks.
export class CommunicationTransport {
  constructor({doc, rpc, valid, presence, catalog=()=>null, outbox=null, onChange, onStatus}) {
    Object.assign(this, {doc, rpc, valid, presence, catalog, outbox, onChange, onStatus});
    this.session = crypto.randomUUID(); this.revision = -1; this.pending = [];
    this.stopped = false; this.role = 'viewer'; this.failures = 0; this.accessFailures = 0;
    this.writeBlocked = false;
    this.journal=Promise.resolve();this.recovered=[];this.backupError=null;
    this.listener = (update, origin) => { if (origin !== 'remote') {this.pending.push(update);this.persistPending();} };
    doc.on('update', this.listener);
  }
  get dirty() { return this.pending.length > 0; }
  persistPending() {
    if(!this.outbox)return;
    const update=this.dirty?toBase64(Y.mergeUpdates(this.pending)):null;
    this.journal=this.journal.then(()=>this.outbox.save(update)).then(()=>{this.backupError=null;}).catch(error=>{this.backupError=error;});
  }
  async restorePending() {
    if(!this.outbox||this.stopped||!this.valid()||!['owner','editor'].includes(this.role))return;
    try{this.recovered=await this.outbox.load();}catch(error){this.backupError=error;return;}
    if(this.stopped||!this.valid())return;
    for(const row of this.recovered)Y.applyUpdate(this.doc,fromBase64(row.update),'recovery');
    // Replayed updates can already be present on the server after a lost reply.
    if(!this.dirty){try{await this.outbox.remove(this.recovered);this.recovered=[];}catch(error){this.backupError=error;}}
    await this.journal;
  }
  async sync() {
    if (this.stopped || !this.valid()) return;
    if (this.running) return this.running;
    this.running = this.drain();
    try { await this.running; } finally { this.running = null; }
  }
  async drain() {
    let pages = 0;
    do {
      await this.exchange();
      if (++pages > 128) throw Error('El historial del comunicado supera el límite seguro de sincronización.');
    } while (this.hasMore && !this.stopped && this.valid());
  }
  async exchange() {
    if(this.outbox)await this.journal;
    const count = this.pending.length;
    if (!this.batch && count && !this.writeBlocked) this.batch = {count, nonce:crypto.randomUUID(), update:toBase64(Y.mergeUpdates(this.pending.slice(0, count)))};
    try {
      const catalog=this.batch ? this.catalog() : null;
      const data = await this.rpc('communication_sync', {
        p_after:this.revision, p_nonce:this.batch?.nonce || null, p_update:this.batch?.update || null,
        p_session:this.session, p_awareness:JSON.stringify(this.presence()),
        p_title:catalog?.title || null,p_kind:catalog?.kind || null,p_metadata:catalog?.metadata || null
      });
      if (this.stopped || !this.valid()) return;
      this.role = data.role;
      if (this.batch) { this.pending.splice(0, this.batch.count); this.batch = null;this.persistPending(); }
      this.doc.transact(() => {
        if (data.snapshot) Y.applyUpdate(this.doc, fromBase64(data.snapshot), 'remote');
        for (const update of data.updates) Y.applyUpdate(this.doc, fromBase64(update.payload), 'remote');
      }, 'remote');
      this.revision = data.revision; this.hasMore = data.has_more === true; this.failures = 0; this.accessFailures = 0;
      if(!this.dirty&&this.outbox){await this.journal;if(this.recovered.length){try{await this.outbox.remove(this.recovered);this.recovered=[];}catch(error){this.backupError=error;}}}
      this.onChange(data);
      this.onStatus(this.writeBlocked && this.dirty ? 'Solo lectura · cambios locales sin guardar' : this.hasMore ? 'Sincronizando historial…' : this.dirty ? 'Guardando en línea…' : 'Guardado en línea', this.writeBlocked);
      // Compact only an acknowledged state. Concurrent writers make this a no-op.
      const latest = Number.isSafeInteger(data.latest_revision) ? data.latest_revision : data.revision;
      if (!this.hasMore && this.revision >= latest && !this.dirty && this.role !== 'viewer' &&
          (data.checkpoint_recommended === true || this.revision - data.snapshot_revision >= 50)) {
        try{await this.rpc('communication_checkpoint', {
          p_revision:this.revision, p_snapshot:toBase64(Y.encodeStateAsUpdate(this.doc)),
          p_title:String(this.doc.getMap('communication').get('subject') || 'Comunicado').trim().slice(0,500)||'Comunicado'
        });}catch(error){this.checkpointError=error;}
      }
    } catch (error) {
      if (this.stopped || !this.valid()) return;
      this.failures++;
      if (error.code === '42501' || error.status === 401 || error.status === 403) {
        this.accessFailures++;
        if (this.batch) {
          this.batch = null; this.writeBlocked = true; this.role = 'viewer';
          this.onStatus('Solo lectura · cambios locales sin guardar', true);
          return this.exchange();
        }
        if (this.accessFailures < 3) {
          this.onStatus('Verificando acceso…', true);
          await new Promise(resolve=>setTimeout(resolve,250*this.accessFailures));
          return this.exchange();
        }
        this.stop(); this.onStatus('No se pudo verificar el acceso. Vuelve a intentar sin cerrar esta página.', true);
      } else this.onStatus(this.outbox&&!this.backupError?'Sin conexión · cambios respaldados en este navegador. Se reenviarán al abrir el documento.':'Sin sincronizar. Conserva esta ventana abierta.', true);
      throw error;
    }
  }
  start() {
    const next = async () => {
      try { await this.sync(); } catch { /* Status is reported by exchange. */ }
      if (!this.stopped && this.valid()) this.timer = setTimeout(next, Math.min(10000, 650 * 2 ** this.failures));
    };
    next();
  }
  async leave() {
    if (this.stopped || !this.valid()) return;
    try {
      await this.rpc('communication_sync', {
        p_after:this.revision, p_nonce:null, p_update:null,
        p_session:this.session, p_awareness:null
      });
    } finally { this.stop(); }
  }
  stop() {
    this.stopped = true; clearTimeout(this.timer); this.doc.off('update', this.listener);
  }
}
