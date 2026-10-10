// Offline artifact rendering only: synthetic snapshots, no accounts or production API.
import {readFile} from 'node:fs/promises';
import {parse} from 'parse5';
export const root=new URL('../../',import.meta.url);
const source=await readFile(new URL('index.html',root),'utf8'),elements=[];
const visit=node=>{if(node.tagName==='style'||node.tagName==='script')elements.push(node);else for(const child of node.childNodes||[])visit(child)};visit(parse(source));
const text=node=>(node.childNodes||[]).map(child=>child.value||'').join('');
const script=elements.filter(node=>node.tagName==='script').map(text).filter(s=>s.includes('const POLICY_STORE_KEY=')||s.includes('function policySelectTab(tab)')).join('\n');
const styles=elements.filter(node=>node.tagName==='style').map(text).join('\n');
export const rendererHtml=`<!doctype html><html><head><meta charset="utf-8"><base href="https://policy-render.invalid/"><style>${styles}</style><style>
html,body{display:block!important;margin:0!important;padding:0!important;height:auto!important;min-height:0!important;overflow:visible!important;background:white!important}
#export-root{width:216mm}.policy-page-set{display:block!important;gap:0!important}.policy-page{margin:0!important;box-shadow:none!important}
</style></head><body><div id="export-root"></div><script>
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),escAttr=esc;
const siIcon=()=>'',can=()=>false,me=null,profile=null;
${script}
policyCommentMarkerHtml=()=>'';
</script></body></html>`;
