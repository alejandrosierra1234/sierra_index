import {test} from 'node:test';
import assert from 'node:assert/strict';
import {optimizeSharingImages} from '../images.js';
import {CommunicationModel,Y} from '../model.js';

test('large sharing copies are optimized once per photo without altering originals, QR or signatures',async()=>{
 const photo='data:image/png;base64,'+'A'.repeat(6*1024*1024),smaller='data:image/webp;base64,SMALL';
 const draft={id:'large',heroImage:photo,blocks:[{id:'one',src:photo},{id:'two',photo}],signature:photo,qrs:[{image:photo}],logo:photo};
 let calls=0;const progress=[];
 const copy=await optimizeSharingImages(draft,{convert:async()=>{calls++;return smaller;},progress:(...args)=>progress.push(args)});
 assert.equal(calls,1);assert.deepEqual(progress,[[1,1]]);
 assert.equal(copy.heroImage,smaller);assert.equal(copy.blocks[0].src,smaller);assert.equal(copy.blocks[1].photo,smaller);
 assert.equal(copy.signature,photo);assert.equal(copy.qrs[0].image,photo);assert.equal(copy.logo,photo);
 assert.equal(draft.heroImage,photo);assert.equal(draft.blocks[0].src,photo);
 delete draft.signature;delete draft.qrs;delete draft.logo;
 const model=new CommunicationModel();model.seed(draft);assert.ok(Y.encodeStateAsUpdate(model.doc).length>16777216);model.doc.destroy();
 const prepared=await optimizeSharingImages(draft,{convert:async()=>smaller});
 const shared=new CommunicationModel();shared.seed(prepared);assert.ok(Y.encodeStateAsUpdate(shared.doc).length<1024);shared.doc.destroy();
});

test('cancelled preparations and conversion failures never change the source',async()=>{
 const source={heroImage:'data:image/jpeg;base64,'+'B'.repeat(400000)};
 let valid=true;
 await assert.rejects(optimizeSharingImages(source,{valid:()=>valid,convert:async()=>{valid=false;return 'data:image/webp;base64,X';}}),/canceló/);
 await assert.rejects(optimizeSharingImages(source,{convert:async()=>{throw Error('decode failed');}}),/decode failed/);
 assert.equal(source.heroImage.length,400023);
 const copy=await optimizeSharingImages(source,{convert:async image=>image+'larger'});assert.deepEqual(copy,source);
});
