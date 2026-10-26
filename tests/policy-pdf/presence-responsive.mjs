import {chromium} from 'playwright';
import {readFile} from 'node:fs/promises';

const css=await readFile(new URL('../../css/communications-collaboration.css',import.meta.url),'utf8');
const browser=await chromium.launch({headless:true});
try{
  const page=await browser.newPage();
  await page.setContent(`<!doctype html><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;font-family:system-ui;color:#2b2b2b}.memo-customizer{width:min(100%,430px);margin:auto;border:1px solid #e5e5e5}.memo-form{padding:16px}.memo-block{padding:16px;border:1px solid #e5e5e5}${css}</style>
    <main class="memo-customizer"><div class="comms-collab-bar"><span class="comms-collab-access">Equipo · Puede editar</span><button class="comms-collab-people"><span class="comms-collab-person" style="--person-color:#007d73"><span class="comms-collab-avatar">AT</span><span><strong>Tú</strong><small>Mensaje principal</small></span></span><span class="comms-collab-person" style="--person-color:#004a86"><span class="comms-collab-avatar">LA</span><span><strong>Luisa Alburez</strong><small>Medidas de seguridad y recomendaciones</small></span></span></button><span class="comms-presence-event">Luisa Alburez entró al documento</span><span data-collab-status>Guardado en Index</span></div><div class="memo-form"><section class="memo-block comms-remote-area" style="--remote-color:#004a86"><span class="comms-remote-badge" style="--remote-color:#004a86">Luisa Alburez</span><p>Contenido del comunicado con un <span class="ProseMirror-yjs-cursor" style="border-color:#004a86"><span style="background:#004a86">Luisa Alburez</span></span>cursor remoto.</p></section></div></main>`);
  const results=[];
  for(const width of [320,375,768,1024,1440]){
    await page.setViewportSize({width,height:800});
    results.push(await page.evaluate(width=>{
      const button=document.querySelector('.comms-collab-people'),badge=document.querySelector('.comms-remote-badge'),area=badge.parentElement;
      const b=badge.getBoundingClientRect(),a=area.getBoundingClientRect();
      return{width,overflow:document.documentElement.scrollWidth>width,buttonHeight:button.getBoundingClientRect().height,badgeInside:b.left>=a.left&&b.right<=a.right};
    },width));
  }
  if(results.some(result=>result.overflow||result.buttonHeight<44||!result.badgeInside))throw Error(JSON.stringify(results));
  console.log(JSON.stringify(results));
}finally{await browser.close();}
