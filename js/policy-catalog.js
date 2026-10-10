/* BASE DE CODIGOS - POLITICAS.xlsx, BASE!C4:F16 (2026-10-09).
 * Public classification vocabulary, not a numbering authority. Company IDs,
 * countries and logos still come from the organization's registered records.
 * RRHH / Admon use their expanded labels from the workbook's named sheets. */
(function(){
 'use strict';
 const normalize=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase().replace(/\s+/g,' ');
 const areas=[
  ['001','Talento Humano',['RRHH']],['002','Finanzas'],['003','Compras'],
  ['004','Logística'],['005','Ventas'],['006','Mercadeo'],['007','IT'],
  ['008','Administración',['Admon']],['009','Créditos y Cobros'],
  ['010','Auditoría Interna'],['011','Ambiente, salud y seguridad'],
  ['012','Control Interno'],['013','Calidad']
 ].map(([code,name,aliases=[]])=>Object.freeze({code,name,aliases:Object.freeze(aliases)}));
 const companies=[
  ['SIE',['Sierra']],['N&T',['Northern Textiles','NT']],
  ['HSM',['Honduras Spinning Mills','HSM']],['N&S',['Northern Spinning','Northern Spinning Mills','NS']],
  ['H&A',['Hilos y Algodón','Hilos y Algodón, S.A.']],['PCH',['Pride Chemicals']],
  ['PDM',['Pride Denim Mills','PDM']],['P&Y',['Pride Yarn']],['LCP',['Lake City Park S.A.']]
 ];
 window.PolicyCatalog=Object.freeze({
  areas:Object.freeze(areas),
  area(value){return areas.find(a=>[a.code,a.name,...a.aliases].some(x=>normalize(x)===normalize(value)))},
  companyCode(company){return companies.find(([,names])=>names.some(n=>[company?.name,company?.legal_name].some(v=>v&&normalize(v)===normalize(n))))?.[0]||''}
 });
})();
