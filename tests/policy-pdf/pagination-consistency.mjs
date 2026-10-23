import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {rendererHtml} from './renderer-fixture.mjs';

const filler='La organización mantiene controles verificables para proteger a las personas y documentar el cumplimiento. ';
const protectedParagraph='PARRAFO-INTEGRO La aplicación debe trasladar este párrafo completo cuando cabe en una página nueva, sin convertirlo en viñeta ni abandonar su última palabra FINAL-PARRAFO.';
const numbered=Array.from({length:4},(_,index)=>`<li>PUNTO-${index+1} ${filler.repeat(3)}</li>`).join('');
const snapshot={id:'pagination-consistency',title:'POLÍTICA DE TRABAJO FORZOSO',code:'HN-HSM-001-POL-002',version:'1.0',status:'Borrador',companyName:'Empresa de prueba',department:'Talento Humano',sections:[
  {id:'automatic',title:'PAGINACIÓN AUTOMÁTICA',html:`<p>${filler.repeat(29)}</p><ol>${numbered}</ol><p>${filler.repeat(29)}</p><p>${protectedParagraph}</p>`},
  {id:'manual',title:'SALTO MANUAL',html:`<ol start="8"><li value="8">PUNTO-8</li><li value="9">PUNTO-9</li></ol><div class="policy-page-break" data-policy-page-break="true">Salto</div><ol start="10"><li value="10">PUNTO-10</li><li value="11">PUNTO-11</li></ol><p>PARRAFO-SIN-VINETA</p>`}
],responsibles:[],org:[],signers:[],comments:[]};

const browser=await chromium.launch({headless:true});
try{
  const page=await browser.newPage({viewport:{width:1100,height:1400}});await page.setContent(rendererHtml,{waitUntil:'load'});
  const split=await page.evaluate(()=>{const host=document.createElement('div');host.className='policy-rich-editor';host.innerHTML='<p>INTRO-SIN-VINETA</p><ol><li>PUNTO-1</li><li>PUNTO-2</li><li>PUNTO-3 CONTINUA</li><li>PUNTO-4</li></ol>';document.body.append(host);const text=host.querySelectorAll('li')[2].firstChild,range=document.createRange(),marker=document.createElement('div');range.setStart(text,8);range.collapse(true);marker.className='policy-page-break';marker.dataset.policyPageBreak='true';policyDecoratePageBreak(marker);const handled=policySplitListForPageBreak(host,range,marker),saved=policySanitize(host.innerHTML),template=document.createElement('template');template.innerHTML=saved;return{handled,html:saved,starts:[...template.content.querySelectorAll('ol')].map(list=>list.start),values:[...template.content.querySelectorAll('li')].map(item=>item.value),continuations:[...template.content.querySelectorAll('li')].map(item=>item.dataset.policyListContinuation==='true'),paragraphTag:template.content.querySelector('p')?.tagName}});
  assert.equal(split.handled,true,'page break is handled structurally inside a list');
  assert.deepEqual(split.starts,[1,3],'the second ordered list resumes at the interrupted item');
  assert.deepEqual(split.values,[1,2,3,3,4],'both fragments retain point 3 and point 4 keeps its number');
  assert.deepEqual(split.continuations,[false,false,false,true,false],'only the second fragment is marked as a continuation');
  assert.equal(split.paragraphTag,'P','a neighboring paragraph stays a paragraph');
  const legacy=await page.evaluate(()=>{const saved=policySanitize('<ol><li value="8">PUNTO-8</li><li value="9">fragmento sin terminar</li></ol><div data-policy-page-break="true">Salto</div><ol><li>continúa aquí.</li><li>PUNTO-10</li></ol>'),template=document.createElement('template');template.innerHTML=saved;return{starts:[...template.content.querySelectorAll('ol')].map(list=>list.start),values:[...template.content.querySelectorAll('li')].map(item=>item.value),continuations:[...template.content.querySelectorAll('li')].map(item=>item.dataset.policyListContinuation==='true')}});
  assert.deepEqual(legacy.starts,[1,9],'a legacy list after a page break resumes at the interrupted number');
  assert.deepEqual(legacy.values,[8,9,9,10],'legacy continuation and following item receive the correct values');
  assert.deepEqual(legacy.continuations,[false,false,true,false],'only a lowercase legacy tail is treated as a continuation');
  const result=await page.evaluate(async snapshot=>{const root=document.getElementById('export-root'),policy=policyNormalize(snapshot);root.innerHTML=policyPageHtml(policy);await document.fonts.ready;policyPaginateDom(document,root);const pages=[...root.querySelectorAll('.policy-page')];return{
    pages:pages.map(page=>page.innerText),
    numbered:[...root.querySelectorAll('[data-policy-section-id="automatic"] .policy-section-body>ol>li')].map(item=>({text:item.innerText.trim(),value:item.value,page:pages.indexOf(item.closest('.policy-page'))+1,continuation:item.dataset.policyListContinuation==='true'})),
    manual:[...root.querySelectorAll('[data-policy-section-id="manual"] .policy-section-body>ol>li')].map(item=>({text:item.innerText.trim(),value:item.value,page:pages.indexOf(item.closest('.policy-page'))+1})),
    paragraphNodes:[...root.querySelectorAll('.policy-section-body>p')].filter(item=>item.innerText.includes('PARRAFO-INTEGRO')).map(item=>({text:item.innerText.trim(),page:pages.indexOf(item.closest('.policy-page'))+1})),
    plainParagraphTags:[...root.querySelectorAll('*')].filter(item=>item.childElementCount===0&&item.textContent.includes('PARRAFO-SIN-VINETA')).map(item=>item.tagName),
    overflow:pages.some(page=>{const area=page.querySelector('.policy-page-content');return area.scrollHeight>area.clientHeight+1})
  }},snapshot);
  const automatic=result.numbered.filter(item=>/^PUNTO-[1-4]\b/.test(item.text));
  assert.deepEqual(automatic.map(item=>item.value),[1,2,3,4],'automatic list keeps a single continuous sequence');
  assert.equal(automatic.every(item=>!item.continuation),true,'ordinary list items move whole instead of becoming continuations');
  assert.deepEqual(result.manual.map(item=>item.value),[8,9,10,11],'manual page break preserves the ordered-list sequence');
  assert.equal(result.manual[2].page>result.manual[1].page,true,'manual break starts point 10 on a later page');
  assert.equal(result.paragraphNodes.length,1,'a paragraph that fits a fresh page is never split');
  assert.match(result.paragraphNodes[0].text,/FINAL-PARRAFO\.$/);
  assert.deepEqual(result.plainParagraphTags,['P'],'plain paragraphs never acquire list semantics');
  assert.equal(result.overflow,false,'consistent pagination does not overflow');
  if(process.env.POLICY_QA_SCREENSHOT)await page.locator('#export-root').screenshot({path:process.env.POLICY_QA_SCREENSHOT});
  console.log(JSON.stringify({pages:result.pages.length,automatic:automatic.map(item=>item.value),manual:result.manual.map(item=>item.value),paragraphFragments:result.paragraphNodes.length,overflow:false}));
}finally{await browser.close()}
