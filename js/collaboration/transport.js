import {Y, toBase64, fromBase64} from './model.js';

// Every exchange goes through an authenticated RPC, including cursor updates.
// No private payload is broadcast on a channel with cached membership checks.
export class CommunicationTransport {
  constructor({doc, rpc, valid, presence, onChange, onStatus}) {
    Object.assign(this, {doc, rpc, valid, presence, onChange, onStatus});
    this.session = crypto.randomUUID(); this.revision = -1; this.pending = [];
    this.stopped = false; this.role = 'viewer'; this.failures = 0;
    this.listener = (update, origin) => { if (origin !== 'remote') this.pending.push(update); };
    doc.on('update', this.listener);
  }
  get dirty() { return this.pending.length > 0; }
  async sync() {
    if (this.stopped || !this.valid()) return;
    if (this.running) return this.running;
    this.running = this.exchange();
    try { await this.running; } finally { this.running = null; }
  }
  async exchange() {
    const count = this.pending.length;
    if (!this.batch && count) this.batch = {count, nonce:crypto.randomUUID(), update:toBase64(Y.mergeUpdates(this.pending.slice(0, count)))};
    try {
      const data = await this.rpc('communication_sync', {
        p_after:this.revision, p_nonce:this.batch?.nonce || null, p_update:this.batch?.update || null,
        p_session:this.session, p_awareness:JSON.stringify(this.presence())
      });
      if (this.stopped || !this.valid()) return;
      this.role = data.role;
      if (this.batch) { this.pending.splice(0, this.batch.count); this.batch = null; }
      this.doc.transact(() => {
        if (data.snapshot) Y.applyUpdate(this.doc, fromBase64(data.snapshot), 'remote');
        for (const update of data.updates) Y.applyUpdate(this.doc, fromBase64(update.payload), 'remote');
      }, 'remote');
      this.revision = data.revision; this.failures = 0;
      this.onChange(data);
      this.onStatus(this.dirty ? 'Guardando cambios...' : 'Guardado en Index', false);
      // Compact only an acknowledged state. Concurrent writers make this a no-op.
      if (!this.dirty && this.role !== 'viewer' && this.revision - data.snapshot_revision >= 50) {
        await this.rpc('communication_checkpoint', {
          p_revision:this.revision, p_snapshot:toBase64(Y.encodeStateAsUpdate(this.doc)),
          p_title:String(this.doc.getMap('communication').get('subject') || 'Comunicado').slice(0, 500)
        });
      }
    } catch (error) {
      if (this.stopped || !this.valid()) return;
      this.failures++;
      if (error.code === '42501' || error.status === 401 || error.status === 403) {
        this.stop(); this.onStatus('Ya no tienes acceso a este comunicado.', true);
      } else this.onStatus('Sin sincronizar. Conserva esta ventana abierta.', true);
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
  stop() {
    this.stopped = true; clearTimeout(this.timer); this.doc.off('update', this.listener);
  }
}
