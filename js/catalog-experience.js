/* Catalog decision surfaces reuse the product dataset and existing collection actions. */
function catL(es,en){return appLang==='es'?es:en}
function catQuickSpecs(p){
 if(p.division==='fabric')return [[catL('Construcción','Construction'),CONST_META[inferConstruction(p)]?.label||'—'],[catL('Gramaje','Weight'),Number.parseFloat(catGSM(p))>0?String(catGSM(p)).replace(/\s*GSM$/i,'')+' GSM':'—'],[catL('Ancho','Width'),catWidth(p)],['Color',catColor(p)]];
 if(p.division==='yarn')return [[catL('Título','Yarn count'),p.specs?.['Yarn Count']||'—'],['Color',catColor(p)]];
 return Object.entries(p.specs||{}).filter(([k])=>!['composition','price','recipe'].includes(k.toLowerCase())).slice(0,4).map(([k,v])=>[k,String(v??'—')]);
}
function catResultsHtml(n){
 const chips=Object.entries(catalogFilters).flatMap(([key,values])=>[...values].map(value=>`<button class="btn btn-secondary" onclick="catRemoveFacet('${key}',${escAttr(JSON.stringify(value))})" aria-label="${escAttr(catL('Quitar filtro ','Remove filter ')+value)}">${esc(value)} ${siIcon('x',14)}</button>`)).join('');
 return `<div class="catalog-results"><div><strong>${n} ${catL('referencias','references')}</strong><span>${catL('Explora las fichas o selecciona de 2 a 4 para comparar.','Explore records or select 2 to 4 to compare.')}</span></div><div class="pd-tabs" role="group" aria-label="${catL('Vista del catálogo','Catalog view')}">${[['cards','grid',catL('Tarjetas','Cards')],['table','list',catL('Tabla','Table')]].map(([key,icon,label])=>`<button class="pd-tab ${catalogView===key?'active':''}" aria-pressed="${catalogView===key}" onclick="setCatalogView('${key}')">${siIcon(icon,16)} ${label}</button>`).join('')}</div></div>${chips?`<div class="catalog-filter-chips">${chips}<button class="btn btn-ghost" onclick="catClearFilters()">${catL('Limpiar filtros','Clear filters')}</button></div>`:''}`;
}
function catRemoveFacet(key,value){catalogFilters[key]?.delete(value);renderProducts(filterProducts())}
function catCompareSelection(){
 if(selectedProducts.length<2||selectedProducts.length>4)return;
 const items=[...selectedProducts];
 openSideDrawer({eyebrow:catL('Selección de catálogo','Catalog selection'),title:catL('Comparar referencias','Compare references'),onTab:()=>{
 const rows=[[catL('Código','Code'),p=>catCode(p)],[catL('División','Division'),p=>DIV_LBL[p.division]||p.division],[catL('Composición','Composition'),catComposition],...([...new Set(items.flatMap(p=>catQuickSpecs(p).map(([k])=>k)))].map(k=>[k,p=>catQuickSpecs(p).find(([label])=>label===k)?.[1]||'—'])),[catL('Estado del desarrollo','Development status'),p=>tx('lifecycle.'+lc(p))]];
 document.getElementById('sd-body').innerHTML=`<section class="catalog-comparison"><p>${catL('Compara la misma característica entre referencias. La existencia física se consulta en la ficha de cada producto.','Compare each attribute across references. Check physical stock in each product record.')}</p><div class="erp-table-wrap" tabindex="0" aria-label="${catL('Comparación desplazable','Scrollable comparison')}"><table class="erp-table"><thead><tr><th>${catL('Característica','Attribute')}</th>${items.map(p=>`<th><button class="catalog-name" onclick="closeSideDrawer();openFicha(dec('${enc(p)}'))">${esc(p.name)}</button></th>`).join('')}</tr></thead><tbody>${rows.map(([label,read])=>`<tr><th scope="row">${esc(label)}</th>${items.map(p=>`<td>${esc(read(p))}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p class="sf-hint">${catL('Tu selección se conserva al cerrar esta comparación.','Your selection is kept when you close this comparison.')}</p></section>`;
 }});
}
function catSortLabel(key,fallback){return appLang==='es'?({name_asc:'Nombre (A–Z)',name_desc:'Nombre (Z–A)',code_asc:'Código',gsm_desc:'Mayor gramaje',updated_desc:'Actualizadas recientemente'}[key]||fallback):fallback}
function catFieldLabel(key,fallback){return appLang==='es'?({construction:'Construcción',availability:'Estado del desarrollo',composition:'Composición',yarnCount:'Título de hilo',code:'Código',product:'Producto / Construcción',width:'Ancho',gsm:'Gramaje',dye:'Método de teñido',lot:'Lote',price:'Precio',updated:'Actualización'}[key]||fallback):fallback}
