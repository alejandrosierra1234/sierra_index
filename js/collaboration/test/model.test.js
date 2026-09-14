import {test} from 'node:test';
import assert from 'node:assert/strict';
import {CommunicationModel,Y,toBase64,fromBase64} from '../model.js';

const seed={id:'memo-test',kind:'memo',subject:'Hola',blocks:[{id:'a',type:'text',content:'Uno'},{id:'b',type:'text',content:'Dos'}]};
function clients(){const a=new CommunicationModel();a.seed(seed);const b=new CommunicationModel();Y.applyUpdate(b.doc,Y.encodeStateAsUpdate(a.doc));return[a,b];}
function sync(a,b){const x=Y.encodeStateAsUpdate(a.doc),y=Y.encodeStateAsUpdate(b.doc);Y.applyUpdate(a.doc,y);Y.applyUpdate(b.doc,x);assert.deepEqual(a.read(),b.read());}
test('round trip preserves existing document and inline private images',()=>{
  const model=new CommunicationModel();model.seed({...seed,heroImage:'data:image/png;base64,AA=='});
  const other=new CommunicationModel();Y.applyUpdate(other.doc,fromBase64(toBase64(Y.encodeStateAsUpdate(model.doc))));assert.deepEqual(model.read(),other.read());
});
test('simultaneous title insertion merges both users',()=>{
  const[a,b]=clients(),av=a.read(),bv=b.read();a.apply(av,{...av,subject:'Hola A'});b.apply(bv,{...bv,subject:'Hola B'});sync(a,b);
  assert.match(a.read().subject,/A/);assert.match(a.read().subject,/B/);
});
test('moving a block does not lose a concurrent edit',()=>{
  const[a,b]=clients(),av=a.read(),bv=b.read();a.apply(av,{...av,blocks:[av.blocks[1],av.blocks[0]]});
  const next=structuredClone(bv);next.blocks[0].content='Nuevo texto';b.apply(bv,next);sync(a,b);
  assert.deepEqual(a.read().blocks.map(x=>x.id),['b','a']);assert.equal(a.read().blocks[1].content,'Nuevo texto');
});
test('concurrent inserts survive and have unique stable identities',()=>{
  const[a,b]=clients(),av=a.read(),bv=b.read();a.apply(av,{...av,blocks:[av.blocks[0],{id:'c',type:'text',content:'C'},av.blocks[1]]});
  b.apply(bv,{...bv,blocks:[bv.blocks[0],{id:'d',type:'text',content:'D'},bv.blocks[1]]});sync(a,b);
  assert.equal(a.read().blocks.length,4);assert.equal(new Set(a.read().blocks.map(x=>x.id)).size,4);
});
test('deleting a block wins over editing it without resurrecting it',()=>{
  const[a,b]=clients(),av=a.read(),bv=b.read();a.apply(av,{...av,blocks:[av.blocks[1]]});
  const next=structuredClone(bv);next.blocks[0].content='Edited';b.apply(bv,next);sync(a,b);assert.deepEqual(a.read().blocks.map(x=>x.id),['b']);
});
test('replayed updates are idempotent',()=>{
  const[a,b]=clients(),av=a.read();a.apply(av,{...av,subject:'Hola mundo'});const update=Y.encodeStateAsUpdate(a.doc);
  Y.applyUpdate(b.doc,update);Y.applyUpdate(b.doc,update);assert.deepEqual(b.read(),a.read());
});
