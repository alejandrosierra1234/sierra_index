import {test} from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {readFileSync} from 'node:fs';
import {fixture} from './policy-browser-fixture.js';
const source=fixture().replace(/<link[^>]+>/g,'').replace(/<script src="([^"]+)"><\/script>/g,(_,path)=>'<script>'+readFileSync(new URL('../../..'+path,import.meta.url),'utf8')+'</script>');
test('actual editor DOM: exact threads, overlap, post-pagination delegation, drafts, read-only authors and tombstones',async()=>{
 const dom=new JSDOM(source,{url:'http://localhost/fixture',runScripts:'dangerously',pretendToBeVisual:true});
 const w=dom.window,d=w.document;
 try{
 await new Promise(resolve=>setTimeout(resolve,80));
 assert.ok(d.querySelector('.policy-page-set'));
 let marks=[...d.querySelectorAll('[data-review-threads]')];
 assert.deepEqual(marks.map(m=>m.dataset.reviewThreads),['thread-first','thread-second']);
 assert.equal(d.querySelectorAll('[data-review-pin]').length,2);
 assert.equal(d.querySelectorAll('.policy-page [data-review-pin]').length,0);
 marks[1].click();
 assert.match(d.querySelector('#policy-review-rail .review-thread').textContent,/segunda coincidencia/);
 assert.equal(d.querySelector('#policy-review-rail [data-review-action="edit:thread-second"]'),null);
 const input=d.querySelector('#policy-review-rail textarea');input.value='Borrador que no debe perderse';input.dispatchEvent(new w.Event('input',{bubbles:true}));input.focus();input.setSelectionRange(4,8);
 w.policyFitPreview();
 assert.equal(d.querySelector('#policy-review-rail textarea').value,'Borrador que no debe perderse');
 assert.equal(d.activeElement.selectionStart,4);
 // Delegated marks survive clone-based pagination and any annotation refresh.
 w.PolicyReview.annotate();d.querySelector('[data-review-threads="thread-first"]').click();
 assert.match(d.querySelector('#policy-review-rail .review-thread').textContent,/primer alcance/);
 await w.PolicyReview.apply({action:'resolve',threadId:'thread-first',version:1});
 assert.equal(d.querySelector('[data-review-threads="thread-first"]'),null);
 await w.PolicyReview.apply({action:'reopen',threadId:'thread-first',version:2});
 assert.ok(d.querySelector('[data-review-threads="thread-first"]'));
 await w.PolicyReview.apply({action:'delete-thread',threadId:'thread-first',version:3});
 assert.equal(d.querySelector('[data-review-threads="thread-first"]'),null);
 await w.PolicyReview.apply({action:'restore-thread',threadId:'thread-first',version:4});
 assert.ok(d.querySelector('[data-review-threads="thread-first"]'));
 // All semantic text areas are addressable, including headers, titles and tables.
 for(const selector of ['.policy-record-title','.policy-heading-title','.policy-approvals','.policy-index-table'])assert.ok(d.querySelector(selector+'[data-review-block]'));
 // Overlaps are represented as multiple thread ids, never an arbitrary first match.
 await w.PolicyReview.apply({action:'create',threadId:'overlap',body:'Overlap',anchor:w.PolicyReview.core.anchor('s1:body','La política aplica al equipo. La política aplica al equipo.',3,20,'s1')});
 assert.ok([...d.querySelectorAll('[data-review-threads]')].some(m=>m.dataset.reviewThreads.split('|').length===2));
 }finally{w.policyStopPresence();w.close()}
});
