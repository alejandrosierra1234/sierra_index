import {chromium} from 'playwright';
import {readFile} from 'node:fs/promises';

const source=await readFile(new URL('../../index.html',import.meta.url),'utf8');
const css=source.match(/commsLibraryStyle\.textContent=`([\s\S]*?)`;\ndocument\.head\.appendChild\(commsLibraryStyle\)/)?.[1];
if(!css)throw Error('Communications library styles were not found.');
const browser=await chromium.launch({headless:true});
try{
  const page=await browser.newPage();
  await page.setContent(`<!doctype html><meta charset="utf-8"><style>
    :root{--surface:#fff;--surface-subtle:#f5f5f5;--surface-hover:#f5f5f5;--border:#e5e5e5;--text-primary:#0b0b0b;--text-muted:#666;--accent:#16cdbe}
    *{box-sizing:border-box}body{margin:0;padding:20px;font-family:system-ui;color:var(--text-primary)}button,input{font:inherit}.btn,.control-input,.pd-tab{min-height:44px;border:1px solid var(--border);border-radius:8px;background:#fff;padding:8px 14px}.btn-primary{background:#2b2b2b;color:white}.comms-toolbar,.comms-header-actions,.comms-filterbar{display:flex}.comms-toolbar{align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}.comms-search{flex:1}.comms-library-row{display:flex}.comms-open-record{flex:1;border:0;background:none;text-align:left}.icon-btn{width:44px;height:44px}.comms-status{align-self:center}${css}
  </style><main class="comms-home comms-ui"><div class="comms-toolbar"><div class="comms-kind-tabs">${['Todos','Memos','Convocatorias','Circulares','Avisos'].map((x,i)=>`<button class="comms-kind-tab" aria-pressed="${i===0}"><span>${x}</span><span class="comms-kind-count">${32-i*5}</span></button>`).join('')}</div><div class="comms-header-actions"><button class="btn btn-secondary">Equipo</button><button class="btn btn-primary" data-comms-create>Crear</button></div></div><div class="pd-tabs comms-lifecycle-tabs"><button class="pd-tab active">Activos 32</button><button class="pd-tab">Archivados 0</button><button class="pd-tab">Papelera 4</button></div><div class="comms-filterbar"><div class="comms-filter-primary"><input class="control-input comms-search" placeholder="Buscar por folio, asunto o remitente…"><button class="btn btn-secondary">Filtros</button></div></div><div class="comms-results-head"><p class="comms-result-count">3 documentos</p><div class="comms-layout-toggle"><button aria-pressed="false">L</button><button aria-pressed="true">M</button></div></div><div class="comms-library-grid">${[1,2,3,4].map(i=>`<article class="comms-library-card" data-kind="memo"><button class="comms-card-open"><span class="comms-card-preview"><span class="comms-card-preview-sheet"><article class="memo-page">Vista ${i}</article></span></span><span class="comms-card-copy"><span class="comms-card-heading"><span class="comms-card-labels"><span class="comms-document-kind">Memo</span><span class="comms-status comms-card-status">Borrador</span></span><span class="comms-card-title">Medidas de seguridad para transportistas</span></span><span class="comms-row-meta comms-card-sender">Seguridad Industrial</span><span class="comms-card-meta"><span>COM-2026-035</span><span class="comms-card-meta-dot">·</span><time>2026-10-26</time></span></span></button><button class="icon-btn comms-card-actions">•••</button></article>`).join('')}</div></main><div id="comms-popover" class="comms-create-menu" role="menu"><div class="comms-create-menu-head"><strong>Crear comunicado</strong><span>Elige el formato que necesitas.</span></div><button class="comms-create-option"><span class="comms-create-option-icon">+</span><span class="comms-create-option-copy"><strong>Memorándum</strong><small>Información formal o instrucción interna.</small></span></button></div>`);
  const results=[];
  for(const width of [320,375,768,1024,1440,1920]){
    await page.setViewportSize({width,height:900});
    results.push(await page.evaluate(width=>({
      width,
      overflow:document.documentElement.scrollWidth>width,
      createHeight:document.querySelector('[data-comms-create]').getBoundingClientRect().height,
      filterHeight:document.querySelector('.comms-filter-primary .btn').getBoundingClientRect().height,
      layoutHeights:[...document.querySelectorAll('.comms-layout-toggle button')].map(button=>button.getBoundingClientRect().height),
      gridColumns:getComputedStyle(document.querySelector('.comms-library-grid')).gridTemplateColumns.split(' ').length,
      menuInside:document.querySelector('#comms-popover').getBoundingClientRect().right<=width,
      previewFillsCard:(()=>{const card=document.querySelector('.comms-library-card').getBoundingClientRect(),preview=document.querySelector('.comms-card-preview').getBoundingClientRect();return Math.abs(card.width-preview.width)<=2.5;})(),
      previewCentered:(()=>{const preview=document.querySelector('.comms-card-preview').getBoundingClientRect(),sheet=document.querySelector('.comms-card-preview-sheet').getBoundingClientRect();return Math.abs((preview.left+preview.width/2)-(sheet.left+sheet.width/2))<1;})(),
      cardHeight:document.querySelector('.comms-library-card').getBoundingClientRect().height,
    }),width));
  }
  if(results.some(result=>result.overflow||result.createHeight<44||result.filterHeight<44||result.layoutHeights.some(height=>height<44)||!result.menuInside||!result.previewFillsCard||!result.previewCentered||result.cardHeight<350||result.cardHeight>460))throw Error(JSON.stringify(results));
  for(const result of results){const expected=result.width<=620?1:result.width<=1023?2:result.width<1600?3:4;if(result.gridColumns!==expected)throw Error(JSON.stringify(results));}
  if(process.env.COMMS_LIBRARY_SCREENSHOT)await page.screenshot({path:process.env.COMMS_LIBRARY_SCREENSHOT,fullPage:true});
  console.log(JSON.stringify(results));
}finally{await browser.close();}
