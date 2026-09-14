import {test} from 'node:test';
import assert from 'node:assert/strict';
import {CommunicationModel} from '../model.js';
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
