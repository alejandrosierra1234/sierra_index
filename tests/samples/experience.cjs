const {JSDOM}=require('../communications/node_modules/jsdom');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const repo=path.join(__dirname,'../..'),html=fs.readFileSync(path.join(repo,'index.html'),'utf8');
const dom=new JSDOM('<main id="view-sample-detail"><label for="format">Formato de muestra</label><select id="format" onchange="changes.push(this.value)"><option value="hanger">Hanger</option><option value="yard">Yardas</option><option value="roll" disabled>Rollo</option></select></main>',{runScripts:'dangerously',pretendToBeVisual:true,url:'https://example.test'}),w=dom.window;
w.esc=w.escAttr=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));w.jsStr=s=>String(s??'').replace(/'/g,"\\'");w.changes=[];w.activeModule='samples';
w.eval(html.slice(html.indexOf('function pdSelect('),html.indexOf('/* ══════════════════════════════════════════════════════════════════════\n   LABEL RENDERER'))+'\n'+fs.readFileSync(path.join(repo,'js/sample-experience.js'),'utf8'));
(async()=>{
 const d=w.document,source=d.getElementById('format'),trigger=d.querySelector('.pd-select-btn');
 assert(source.hidden);assert.equal(d.querySelectorAll('.sample-select-host').length,1);assert.equal(trigger.getAttribute('aria-label'),'Formato de muestra');
 trigger.dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true}));await new Promise(r=>setTimeout(r,30));assert.equal(trigger.getAttribute('aria-expanded'),'true');assert.equal(d.activeElement.getAttribute('role'),'option');
 d.activeElement.dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true}));assert.equal(d.activeElement.textContent.trim(),'Yardas');d.activeElement.click();
 assert.equal(source.value,'yard');assert.deepEqual(w.changes,['yard']);assert.equal(d.querySelector('.pd-select-label').textContent,'Yardas');assert.equal(d.activeElement.getAttribute('aria-haspopup'),'listbox');
 d.activeElement.click();d.querySelector('[role=option]').focus();d.activeElement.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert.equal(d.querySelector('.pd-select-btn').getAttribute('aria-expanded'),'false');assert.equal(d.activeElement,d.querySelector('.pd-select-btn'));
 assert(d.querySelector('[role=option]:disabled'));source.value='hanger';source.dispatchEvent(new w.Event('change'));assert.equal(d.querySelector('.pd-select-label').textContent,'Hanger');
 const dynamic=d.createElement('select');dynamic.innerHTML='<option>USD</option><option>GTQ</option>';d.getElementById('view-sample-detail').append(dynamic);await new Promise(r=>setTimeout(r,0));assert(dynamic.hidden);assert.equal(d.querySelectorAll('.sample-select-host').length,2);
 const extra=d.createElement('option');extra.value='mxn';extra.textContent='MXN';dynamic.append(extra);await new Promise(r=>setTimeout(r,0));assert.equal(dynamic.nextElementSibling.querySelectorAll('[role=option]').length,3);
 w.enhanceSampleSelects(d);assert.equal(d.querySelectorAll('.sample-select-host').length,2);
 console.log('PASS: Sierra dropdown value preservation, original handler, keyboard arrows, Escape/focus, disabled options and dynamic rendering');w.close();
})().catch(e=>{console.error(e);process.exit(1)});
