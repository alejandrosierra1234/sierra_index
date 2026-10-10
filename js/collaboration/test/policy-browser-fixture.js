// Development-only fixture: real editor/renderers, synthetic accounts, no network credentials.
import {readFileSync} from 'node:fs';
import http from 'node:http';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {JSDOM} from 'jsdom';
const root=fileURLToPath(new URL('../../../',import.meta.url));
const source=readFileSync(path.join(root,'index.html'),'utf8');
const scripts=[...source.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]).filter(s=>s.includes('const POLICY_STORE_KEY=')||s.includes('function policySelectTab(tab)'));
const parsed=new JSDOM(source);
const styles=[...parsed.window.document.querySelectorAll('style')].map(el=>el.outerHTML).join('\n');parsed.window.close();
const setup=`
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),escAttr=esc;
const siIcon=(name,size=16)=>'<svg width="'+size+'" height="'+size+'" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h16M12 4v16" fill="none" stroke="currentColor"/></svg>';
const can=()=>true,me={id:'account-a'},profile={full_name:'Ana Prueba'},avatarStyle=()=>'',clearSecCrumbs=()=>{},toast=message=>{document.getElementById('fixture-status').textContent=message};
${source.slice(source.indexOf('function jsStr(s)'),source.indexOf('\n/* ═',source.indexOf('function pdSelect(')))}
function commsConfirm(title,message,action,label){const d=document.createElement('dialog');d.className='comms-confirm';d.innerHTML='<h2>'+title+'</h2><p>'+message+'</p><button>Cancelar</button><button>'+label+'</button>';d.querySelectorAll('button')[0].onclick=()=>d.close();d.querySelectorAll('button')[1].onclick=()=>{d.close();action()};d.addEventListener('close',()=>d.remove());document.body.append(d);d.showModal()}
let mockThreads=[],mockRevision=1;const mockPolicies=new Map();
const sb={rpc:async(name,args)=>{
 if(name==='policy_numbering_catalog')return window.fixtureCatalogUnavailable?{error:{code:'PGRST202',message:'Migration not applied'}}:{data:{version:50,areas:[{code:'008',name:'Administración'},{code:'001',name:'Talento Humano'}],companies:[{id:'company-a',name:'Empresa de prueba',companyCode:'HSM',countryCode:'HN',countryName:'Honduras'}]}};
 if(name==='policy_presence_touch')return {data:[{userId:'account-a',name:'Ana Prueba'},{userId:'account-b',name:'Bruno Prueba'}]};
 if(name==='policy_comments_read')return {data:{threads:mockThreads,cursor:mockRevision}};
 if(name==='policy_cloud_save'){const p={...args.p_snapshot,_revision:++mockRevision,comments:mockThreads};mockPolicies.set(p.id,p);return {data:p}};
 if(name==='policy_approve'){window.fixtureApprovalCalls=(window.fixtureApprovalCalls||0)+1;let p=mockPolicies.get(args.p_policy_id);if(!p)return {error:{code:'P0002',message:'Save first'}};if(p.status!=='Aprobada'){p={...p,_revision:++mockRevision,status:'Aprobada',code:'HN-HSM-008-POL-001',numbering:{code:'HN-HSM-008-POL-001',areaCode:'008',serial:1},approvedAt:'2026-10-10',approvedBy:'account-a'};mockPolicies.set(p.id,p)}if(window.fixtureApprovalLoseResponse){window.fixtureApprovalLoseResponse=false;return {error:{message:'Lost response'}}}return {data:p}};
 if(name==='policy_comment_history')return {data:[]};
 if(name==='policy_revision_list')return {data:[]};
 if(name==='policy_comment_apply'){const op=args.p_operation;let t=mockThreads.find(t=>t.id===op.threadId);const identity={authorId:'account-a',authorName:'Ana Prueba',canManage:true,createdAt:new Date().toISOString(),version:1};if(op.action==='create'){t={id:op.threadId,anchor:op.anchor,sectionId:op.anchor.sectionId,...identity,resolved:false,deleted:false,messages:[{id:op.threadId,body:op.body,...identity}]};mockThreads.push(t)}else if(op.action==='reply')t.messages.push({id:op.messageId,body:op.body,...identity});else if(op.action==='resolve')t.resolved=true;else if(op.action==='reopen')t.resolved=false;else if(op.action==='delete-thread')t.deleted=true;else if(op.action==='restore-thread')t.deleted=false;else if(op.action==='edit')t.messages.find(m=>m.id===op.messageId).body=op.body;return {data:{threads:mockThreads,cursor:++mockRevision}}}
 return {data:[]};
}};
`;
const start=`
const para='El equipo debe revisar las condiciones antes de iniciar el trabajo. Se registran los cambios y se conserva la evidencia. ';
const p=createPolicyDraft({id:'fixture-policy',title:'POLÍTICA DE PRUEBA',department:'Procesos',sections:[{id:'s1',title:'ALCANCE',html:'<p>La política aplica al equipo. La política aplica al equipo.</p>'},{id:'s2',title:'LINEAMIENTOS',html:Array.from({length:22},()=>'<p>'+para.repeat(3)+'</p>').join('')}]});
const author={authorId:'account-a',authorName:'Ana Prueba',createdAt:new Date().toISOString(),canManage:true,version:1};
mockThreads=[{id:'thread-first',anchor:PolicyReviewCore.anchor('s1:body','La política aplica al equipo. La política aplica al equipo.',0,28,'s1'),sectionId:'s1',...author,messages:[{id:'thread-first',body:'Revisar el primer alcance.',...author}]},{id:'thread-second',anchor:PolicyReviewCore.anchor('s1:body','La política aplica al equipo. La política aplica al equipo.',30,58,'s1'),sectionId:'s1',...author,authorId:'account-b',authorName:'Bruno Prueba',messages:[{id:'thread-second',body:'Comentario en la segunda coincidencia.',...author,authorId:'account-b',authorName:'Bruno Prueba',canManage:false}]}];
p.comments=mockThreads;_policies=[policyNormalize(p)];policyOpen(p.id);
`;
export function fixture({pdf=false}={}){return `<!doctype html><html><head><meta charset="utf-8">${pdf?'<script src="/tests/policy-pdf/node_modules/jspdf/dist/jspdf.umd.min.js"></script><script src="/tests/policy-pdf/node_modules/html2canvas/dist/html2canvas.min.js"></script>':''}${styles}<link rel="stylesheet" href="/css/policy-review.css"><style>body{display:block!important;overflow:hidden!important;background:#f5f5f5}#content{margin:0!important;padding:16px!important;position:relative!important;height:calc(100vh - 40px)!important}#pg{height:100%}.policy-studio{height:100%!important}.policy-editor-workspace{height:100%!important}#fixture-status{height:30px;font:13px sans-serif;padding:6px}</style></head><body><div id="fixture-status">Prueba local · datos sintéticos</div><div id="sec-title"></div><div id="sec-sub"></div><div id="content"><div id="pg"></div></div><script>${setup}</script>${scripts.map(s=>'<script>'+s+'</script>').join('')}<script src="/js/policy-review-core.js"></script><script src="/js/policy-review.js"></script><script src="/js/policy-catalog.js"></script><script src="/js/policy-numbering.js"></script>${pdf?'<script src="/js/policy-pdf-local.js"></script>':''}<script>${start}</script></body></html>`}
if(process.argv[1]===fileURLToPath(import.meta.url))http.createServer((req,res)=>{
 const url=new URL(req.url,'http://localhost');
 if(url.pathname==='/fixture'){
  let html=fixture({pdf:true});
  if(url.searchParams.get('catalog')==='offline')html=html.replace('<script>','<script>window.fixtureCatalogUnavailable=true;').replace("const para=","_policyCompanies=[{id:'company-a',name:'Honduras Spinning Mills',countries:{name:'Honduras',code:'HN'}}];\nconst para=");
  res.setHeader('Content-Type','text/html');res.end(html);return
 }
 if(url.pathname==='/migration'){res.setHeader('Content-Type','text/html;charset=utf-8');res.end('<!doctype html><title>Migración verificada 50</title><h1>Migración verificada 50</h1><pre>'+readFileSync(path.join(root,'update50.sql'),'utf8').replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</pre>');return}
 const file=path.join(root,decodeURIComponent(url.pathname));if(!file.startsWith(root)){res.writeHead(403);res.end();return}
 try{res.setHeader('Content-Type',file.endsWith('.css')?'text/css':file.endsWith('.js')?'application/javascript':'application/octet-stream');res.end(readFileSync(file))}catch{res.writeHead(404);res.end()}
}).listen(4173,'127.0.0.1',()=>console.log('Fixture http://127.0.0.1:4173/fixture'));
