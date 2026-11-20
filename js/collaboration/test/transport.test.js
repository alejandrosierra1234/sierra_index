import {test} from 'node:test';
import assert from 'node:assert/strict';
import {CommunicationModel,Y,toBase64,fromBase64} from '../model.js';
import {CommunicationTransport} from '../transport.js';
const response={role:'editor',revision:0,snapshot_revision:0,updates:[],presence:[]};
function make(rpc,options={}){const model=new CommunicationModel(),statuses=[];const transport=new CommunicationTransport({doc:model.doc,rpc,valid:()=>true,presence:()=>({}),onChange:()=>{},onStatus:(...args)=>statuses.push(args),...options});return{model,transport,statuses};}
test('retry reuses nonce and does not acknowledge newer local edits',async()=>{
  const requests=[];let fail=true;
  const{model,transport}=make(async(_name,args)=>{requests.push(args);if(fail){fail=false;throw Error('offline');}return response;});
  model.seed({subject:'One'});await assert.rejects(transport.sync());
  model.apply(model.read(),{subject:'Two'});await transport.sync();
  assert.equal(requests[0].p_nonce,requests[1].p_nonce);assert.equal(transport.dirty,true);
  await transport.sync();assert.equal(transport.dirty,false);transport.stop();model.doc.destroy();
});
test('revocation stops polling and marks access blocked',async()=>{
  const{model,transport,statuses}=make(async()=>{throw Object.assign(Error('denied'),{code:'42501'});});
  await assert.rejects(transport.sync());assert.equal(transport.stopped,true);assert.equal(statuses.at(-1)[1],true);model.doc.destroy();
});
test('response after account switch is ignored',async()=>{
  let resolve,valid=true,changed=false;
  const{model,transport}=make(()=>new Promise(r=>resolve=r),{valid:()=>valid,onChange:()=>{changed=true;}});
  const request=transport.sync();valid=false;resolve(response);await request;
  assert.equal(changed,false);assert.equal(transport.revision,-1);transport.stop();model.doc.destroy();
});
test('transient access errors retry before stopping or clearing the document',async()=>{
  let calls=0;const{model,transport,statuses}=make(async()=>{if(++calls<3)throw Object.assign(Error('stale session'),{code:'42501'});return response;});
  await transport.sync();assert.equal(calls,3);assert.equal(transport.stopped,false);assert.equal(transport.revision,0);
  assert.ok(statuses.some(([text])=>text==='Verificando acceso…'));transport.stop();model.doc.destroy();
});
test('a rejected write becomes read-only without discarding local changes',async()=>{
  const requests=[];const{model,transport}=make(async(_name,args)=>{requests.push(args);if(args.p_update)throw Object.assign(Error('read only'),{code:'42501'});return{...response,role:'viewer'};});
  model.seed({subject:'Cambio local'});await transport.sync();
  assert.equal(transport.writeBlocked,true);assert.equal(transport.role,'viewer');assert.equal(transport.dirty,true);assert.equal(transport.stopped,false);
  assert.equal(requests.at(-1).p_update,null);transport.stop();model.doc.destroy();
});
test('leave removes the current presence session explicitly',async()=>{
  let last;const{model,transport}=make(async(_name,args)=>{last=args;return response;});
  await transport.leave();assert.equal(last.p_session,transport.session);assert.equal(last.p_awareness,null);assert.equal(transport.stopped,true);model.doc.destroy();
});
test('acknowledged updates carry current catalog metadata',async()=>{
  let request;const catalog={title:'Circular vigente',kind:'circular',metadata:{lifecycle:'active',department:'Comunicaciones'}};
  const{model,transport}=make(async(_name,args)=>{request=args;return response;},{catalog:()=>catalog});
  model.seed({subject:'Circular vigente'});await transport.sync();
  assert.equal(request.p_title,catalog.title);assert.equal(request.p_kind,catalog.kind);assert.deepEqual(request.p_metadata,catalog.metadata);
  transport.stop();model.doc.destroy();
});
test('large histories are drained page by page before editing starts',async()=>{
  const pages=[
    {...response,revision:0,latest_revision:2,has_more:true},
    {...response,revision:1,latest_revision:2,has_more:true},
    {...response,revision:2,latest_revision:2,has_more:false}
  ];
  const requests=[];const changes=[];
  const{model,transport}=make(async(_name,args)=>{requests.push(args);return pages.shift();},{onChange:data=>changes.push(data.revision)});
  await transport.sync();
  assert.deepEqual(requests.map(request=>request.p_after),[-1,0,1]);
  assert.deepEqual(changes,[0,1,2]);assert.equal(transport.revision,2);assert.equal(transport.hasMore,false);
  transport.stop();model.doc.destroy();
});

function memoryOutbox(rows=new Map(),key=crypto.randomUUID()) {return {load:async()=>[...rows].map(([key,update])=>({key,update})),save:async update=>{if(update)rows.set(key,update);else rows.delete(key);},remove:async records=>{for(const row of records)if(rows.get(row.key)===row.update)rows.delete(row.key);}};}
test('pending edits survive a destroyed client and replay only after authorization',async()=>{
  const rows=new Map(),server=new Y.Doc();
  let calls=0;
  const first=make(async()=>{throw Error('offline');},{outbox:memoryOutbox(rows)});
  first.model.seed({id:'invitation',subject:'Convocatoria recuperada',kind:'convocatoria',blocks:[]});
  await assert.rejects(first.transport.sync());assert.equal(rows.size,1);
  first.transport.stop();first.model.doc.destroy();
  const second=make(async(_name,args)=>{calls++;if(args.p_update)Y.applyUpdate(server,fromBase64(args.p_update));return {...response,snapshot:toBase64(Y.encodeStateAsUpdate(server))};},{outbox:memoryOutbox(rows)});
  await second.transport.restorePending();assert.equal(second.transport.dirty,false,'no replay before server authorization');
  await second.transport.sync();await second.transport.restorePending();
  assert.equal(second.model.read().subject,'Convocatoria recuperada');
  await second.transport.sync();assert.equal(rows.size,0,'remove backup only after acknowledgement');
  assert.equal(new CommunicationModel(server).read().subject,'Convocatoria recuperada');
  second.transport.stop();second.model.doc.destroy();server.destroy();
});
test('failed checkpoint does not report acknowledged data as lost and titles are nonempty',async()=>{
  let title;
  const current=make(async(name,args)=>{if(name==='communication_checkpoint'){title=args.p_title;throw Error('maintenance offline');}return {...response,revision:50,checkpoint_recommended:true};});
  current.model.seed({subject:'   '});await current.transport.sync();
  assert.equal(title,'Comunicado');assert.equal(current.transport.dirty,false);assert.equal(current.statuses.at(-1)[0],'Guardado en línea');
  current.transport.stop();current.model.doc.destroy();
});
test('backup errors do not prevent online saving or falsely claim offline protection',async()=>{
  const outbox={load:async()=>{throw Error('denied');},save:async()=>{throw Error('quota');},remove:async()=>{}};
  let online=true;const current=make(async()=>{if(!online)throw Error('offline');return response;},{outbox});
  await current.transport.sync();await current.transport.restorePending();current.model.seed({subject:'Memo'});await current.transport.sync();assert.equal(current.transport.dirty,false);
  online=false;current.model.apply(current.model.read(),{subject:'Pending'});await assert.rejects(current.transport.sync());assert.match(current.statuses.at(-1)[0],/Conserva esta ventana/);
  current.transport.stop();current.model.doc.destroy();
});
