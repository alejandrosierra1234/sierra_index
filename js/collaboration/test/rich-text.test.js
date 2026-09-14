import {test} from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Y} from '../model.js';
import {Awareness,encodeAwarenessUpdate,applyAwarenessUpdate} from 'y-protocols/awareness';

test('two rich text editors merge concurrent text, preserve marks and render a named cursor',async()=>{
  const dom=new JSDOM('<div id="a"></div><div id="b"></div>',{pretendToBeVisual:true});
  for(const key of ['window','document','MutationObserver','HTMLElement','Node','getComputedStyle'])globalThis[key]=key==='getComputedStyle'?dom.window.getComputedStyle.bind(dom.window):dom.window[key];
  const {seedRich,readRich,bindRich,richCommand}=await import('../rich-text.js');
  const a=new Y.Doc(),b=new Y.Doc(),aa=new Awareness(a),ba=new Awareness(b);
  let av,bv;
  try {
    seedRich(a.getXmlFragment('body'),'<strong>Hola</strong>');Y.applyUpdate(b,Y.encodeStateAsUpdate(a));
    aa.setLocalState({field:'body',user:{name:'Ana',color:'#007d73'}});
    ba.setLocalState({field:'body',user:{name:'Luis',color:'#004a86'}});
    av=bindRich({element:document.getElementById('a'),fragment:a.getXmlFragment('body'),awareness:aa,editable:()=>true,onChange:()=>{},field:'body'});
    bv=bindRich({element:document.getElementById('b'),fragment:b.getXmlFragment('body'),awareness:ba,editable:()=>true,onChange:()=>{},field:'body'});
    av.dispatch(av.state.tr.insertText(' A',5));bv.dispatch(bv.state.tr.insertText(' B',5));
    const au=Y.encodeStateAsUpdate(a),bu=Y.encodeStateAsUpdate(b);Y.applyUpdate(a,bu);Y.applyUpdate(b,au);
    assert.deepEqual(readRich(a.getXmlFragment('body')),readRich(b.getXmlFragment('body')));
    assert.match(av.dom.textContent,/A/);assert.match(av.dom.textContent,/B/);assert.match(readRich(a.getXmlFragment('body')).richHtml,/<strong>/);
    bv.focus();bv.dispatch(bv.state.tr.setSelection(bv.state.selection));
    applyAwarenessUpdate(aa,encodeAwarenessUpdate(ba,[b.clientID]),'remote');
    await new Promise(resolve=>setTimeout(resolve,30));
    assert.match(av.dom.querySelector('.ProseMirror-yjs-cursor')?.textContent||'',/Luis/);
    richCommand(av,'foreColor','#004a86');av.dispatch(av.state.tr.insertText(' Azul'));
    assert.match(readRich(a.getXmlFragment('body')).richHtml,/color:/);
  }finally{await new Promise(resolve=>setTimeout(resolve,30));av?.destroy();bv?.destroy();aa.destroy();ba.destroy();a.destroy();b.destroy();dom.window.close();}
});
