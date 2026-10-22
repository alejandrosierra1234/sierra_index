import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {rendererHtml} from './renderer-fixture.mjs';

const article25='Art. 25. En todo contrato individual de trabajo deben entenderse incluidos, por lo menos, las garantías y derechos que otorguen a los trabajadores la Constitución, el presente Código, sus reglamentos y las demás leyes de trabajo o de previsión social.';
const filler='La organización establece lineamientos verificables para proteger a las personas trabajadoras y conservar evidencia de cumplimiento. ';
const snapshot={id:'list-qa',title:'POLÍTICA DE TRABAJO FORZOSO',code:'HN-HSM-001-POL-002',version:'1.0',status:'Borrador',companyName:'Empresa de prueba',department:'Talento Humano',sections:[{id:'normativa',title:'NORMATIVA',html:`<p>${filler.repeat(31)}</p><ul><li>${article25}</li><li><b>Art. 34.</b> Si se estableciere una relación de trabajo con un menor sin sujeción a lo preceptuado en el artículo anterior, el patrono está sujeto al cumplimiento de todas las obligaciones inherentes al contrato.</li></ul>`}],responsibles:[],org:[],signers:[],comments:[]};

const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:1100,height:1400}});await page.setContent(rendererHtml,{waitUntil:'load'});
 const result=await page.evaluate(async snapshot=>{const root=document.getElementById('export-root'),policy=policyNormalize(snapshot);root.innerHTML=policyPageHtml(policy);await document.fonts.ready;policyPaginateDom(document,root);return{pages:[...root.querySelectorAll('.policy-page')].map(page=>page.innerText),items:[...root.querySelectorAll('.policy-section-body>ul>li')].map(item=>({text:item.innerText.trim(),continuation:item.classList.contains('policy-list-item-continuation'),page:[...root.querySelectorAll('.policy-page')].indexOf(item.closest('.policy-page'))+1})),overflow:[...root.querySelectorAll('.policy-page-content')].some(area=>area.scrollHeight>area.clientHeight+1)}},snapshot);
 const articleFragments=result.items.filter(item=>item.text.includes('Art. 25')||item.text.includes('previsión social'));
 assert.equal(articleFragments.length,1,'Art. 25 stays together when it fits on a fresh page');
 assert.match(articleFragments[0].text,/previsión social\.$/);
 assert.equal(result.pages.some(text=>/^\s*social\./m.test(text)),false,'No page starts with an orphaned tail word');
 assert.equal(result.overflow,false,'The fix does not create page overflow');
 console.log(JSON.stringify({pages:result.pages.length,article25Page:articleFragments[0].page,orphanedTail:false,overflow:false}));
}finally{await browser.close()}
