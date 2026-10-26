import {chromium} from 'playwright';
import {readFile} from 'node:fs/promises';

const source=await readFile(new URL('../../index.html',import.meta.url),'utf8');
const collaboration=await readFile(new URL('../../css/communications-collaboration.css',import.meta.url),'utf8');
const css=[...source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(match=>match[1]).join('\n')+'\n'+collaboration+'\n.memo-editor-tabs{display:flex!important}.memo-editor-tabs button{display:block!important}';
const browser=await chromium.launch({headless:true});
try{
  const page=await browser.newPage();
  await page.setContent(`<!doctype html><meta charset="utf-8"><style>${css}</style><main><div class="memo-studio comms-ui"><section class="memo-panel memo-customizer"><div class="memo-panel-head memo-editor-head"><button class="icon-btn memo-editor-back">←</button><div class="memo-panel-heading"><div class="memo-panel-title">Editar memorándum</div><span class="memo-save-state">Guardado en Index</span></div><div class="memo-panel-meta"><button class="pd-select-btn">Borrador</button><button class="icon-btn">•••</button></div></div><div class="memo-editor-primary-actions"><div class="comms-header-actions"><button class="btn btn-secondary">Comentarios</button><button class="btn btn-secondary">Guardar en equipo</button></div><button class="btn btn-secondary">Descargar</button></div><div class="comms-collab-bar"><span class="comms-collab-access">Equipo · Propietario</span><button class="comms-collab-people"><span class="comms-collab-alone">Solo tú</span></button></div><div class="memo-editor-tabs"><button type="button" data-comms-tab="info">Datos</button><button type="button" data-comms-tab="content" aria-pressed="true">Contenido</button><button type="button" data-comms-tab="signature">Firmantes</button></div><div class="memo-form"><section class="memo-outline"><div class="memo-outline-head"><button class="icon-btn memo-drag-handle">↕</button><button class="memo-outline-toggle"><span class="memo-insert-icon">T</span><span><b>Introducción</b><small>Texto · Bloque 1</small></span><span>⌄</span></button><button class="icon-btn memo-outline-menu">•••</button></div><div class="memo-outline-body"><div class="memo-block"><div class="memo-rich-toolbar"><button>B</button><button>I</button><button>U</button><button>A</button><span class="memo-toolbar-separator"></span><button>•</button><button>1.</button><details class="memo-rich-more"><summary>Más</summary><div class="memo-rich-more-panel"><span class="memo-rich-more-label">Alineación</span><button>←</button><button>↔</button><button>→</button><button>≡</button><button class="memo-rich-clear">Quitar formato</button></div></details></div><div class="memo-rich-editor">Contenido del comunicado</div></div></div></section></div></section><section class="memo-preview-shell"><div class="memo-preview-head"><div><div class="memo-preview-title">Vista previa</div><div class="memo-preview-note">Documento</div></div><div class="memo-preview-head-actions"><span class="memo-preview-badge">Documento completo</span><div class="memo-zoom-controls"><button class="icon-btn">−</button><span class="memo-zoom-value">100%</span><button class="icon-btn">+</button><button class="btn">Ancho</button></div></div></div><div class="memo-preview-stage"></div></section></div></main>`);
  const results=[];
  for(const width of [320,375,768,1024,1440]){
    await page.setViewportSize({width,height:900});
    await page.locator('.memo-rich-more').evaluate(node=>node.open=true);
    results.push(await page.evaluate(width=>({
      width,
      overflow:document.documentElement.scrollWidth>width,
      columns:getComputedStyle(document.querySelector('.memo-studio')).gridTemplateColumns.split(' ').length,
      controls:[...document.querySelectorAll('.memo-outline-head>.icon-btn,.memo-rich-toolbar>button,.memo-rich-more>summary,.memo-editor-tabs button')].map(node=>node.getBoundingClientRect().height),
      moreInside:(()=>{const rect=document.querySelector('.memo-rich-more-panel').getBoundingClientRect();return rect.left>=0&&rect.right<=width;})(),
    }),width));
  }
  if(results.some(result=>result.overflow||result.controls.some(height=>height<44)||!result.moreInside))throw Error(JSON.stringify(results));
  for(const result of results){const expected=result.width<=1180?1:2;if(result.columns!==expected)throw Error(JSON.stringify(results));}
  console.log(JSON.stringify(results));
}finally{await browser.close();}
