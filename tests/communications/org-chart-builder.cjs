const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict')
const {JSDOM}=require('jsdom')
const root=path.join(__dirname,'../..'),source=fs.readFileSync(path.join(root,'js/org-chart-builder.js'),'utf8'),css=fs.readFileSync(path.join(root,'css/org-chart-builder.css'),'utf8'),times=fs.readFileSync(path.join(root,'js/sierra-times.js'),'utf8'),collaboration=fs.readFileSync(path.join(root,'js/collaboration/browser.js'),'utf8'),integration=fs.readFileSync(path.join(root,'js/communications-collaboration-integration.js'),'utf8')
assert.match(source,/label:'Organigramas'/)
assert.match(source,/orgChartLibraryRead/)
assert.match(source,/Organigramas encontrados en Memos/)
assert.match(source,/commsOrgImportLibrary/)
assert.match(source,/orgChartExport/)
assert.match(source,/orgChartImportFile/)
assert.match(source,/orgChartDownloadTemplate/)
assert.match(source,/orgChartResourcesAdd/)
assert.match(source,/indirectParents/)
assert.match(source,/Carta horizontal/)
assert.match(source,/importReviewDialog/)
assert.match(source,/orgChartUndo/)
assert.match(source,/orgChartBackup/)
assert.match(source,/orgChartRestore/)
assert.match(source,/orgChartScenarioCompare/)
assert.match(source,/orgChartPreviewFit/)
assert.match(source,/orgChartPrintPreview/)
assert.match(source,/orgChartExportPdf/)
assert.match(source,/Directorio vinculado/)
assert.match(times,/Marketing · \$\{chart\.title\}/)
assert.match(times,/org-chart-builder\.js/)
assert.match(collaboration,/installOrgCharts/)
assert.match(collaboration,/kind:'orgchart'/)
assert.match(integration,/SierraOrgChartTeam/)
assert.match(source,/syncCloudLibrary/)
assert.match(source,/orgChartReceiveRemote/)
assert.match(css,/--org-light/)
assert.match(css,/\.org-chart-tree/)
assert.match(css,/\.org-chart-connectors/)
assert.match(source,/#16cdbe/)
assert.match(source,/#c5e9ff/)
assert.match(source,/computeOrgLayout/)
assert.match(css,/\.org-resource-bank/)
assert.match(css,/\.org-crop-dialog/)
assert.match(css,/\.org-import-review/)
assert.match(css,/\.org-canvas-tools/)
assert.match(css,/\.org-print-dialog/)
assert.match(css,/@media\(max-width:760px\)/)
const dom=new JSDOM('<!doctype html><html><head></head><body><div id="tb-section"></div><div id="product-controls"></div><div id="sec-title"></div><div id="sec-sub"></div><main id="pg"></main></body></html>',{url:'https://index.sierra.test',runScripts:'outside-only'})
const w=dom.window
Object.assign(w,{structuredClone:global.structuredClone,confirm:()=>true,me:{id:'tester'},profile:{},siIcon:(name)=>`<i>${name}</i>`,toast:()=>{},syncModule:()=>{},leaveView:()=>{},renderSidebarTree:()=>{},clearSecCrumbs:()=>{},setSecCrumbs:()=>{},renderCommunicationEditor:()=>{},commsAutosave:()=>{},_navLeaf:null,_commsDrafts:[],MODULES:{comunicaciones:{tools:[{id:'memos',label:'Memos',run:'showCommunications'}]}},enterApp:async()=>{},commsOrgEditorHtml:()=>'<div class="memo-block-help">Ayuda</div>'})
vm.runInContext(source,dom.getInternalVMContext())
assert.equal(w.MODULES.comunicaciones.tools.some(tool=>tool.id==='org-charts'),true)
w.showOrgChartBuilder()
assert.match(w.document.getElementById('pg').textContent,/Biblioteca de organigramas/)
w.orgChartNew()
assert.ok(w.document.querySelector('.org-builder'))
assert.ok(w.document.querySelector('[data-org-undo]'))
assert.ok(w.document.querySelector('.org-canvas-tools'))
assert.match(w.document.getElementById('pg').textContent,/Directorio vinculado/)
w.orgChartSet('title','Equipo de Marketing')
w.orgChartPersonSet(0,'name','Dirección')
const rootPerson=w.orgChartLibraryRead()[0].people[0]
w.orgChartAddPerson(rootPerson.uid)
w.orgChartPersonSet(1,'name','Diseño')
const saved=w.orgChartLibraryRead()[0]
assert.equal(saved.title,'Equipo de Marketing')
assert.equal(saved.people.length,2)
assert.equal(saved.people[1].parent,saved.people[0].uid)
assert.equal(w.document.querySelectorAll('.org-chart-node').length,2)
w.orgChartAreaAdd()
w.orgChartAreaSet(0,'name','Marketing')
w.orgChartPersonSet(1,'areaId',w.orgChartLibraryRead()[0].areas[0].id,true)
w.orgChartAddPerson('')
w.orgChartPersonSet(2,'name','Asesoría externa')
w.orgChartPersonSet(2,'parent',rootPerson.uid)
w.orgChartPersonSet(2,'relationship','advisor',true)
w.orgChartPersonSet(1,'indirectParents',[w.orgChartLibraryRead()[0].people[2].uid],true)
const enhanced=w.orgChartLibraryRead()[0]
assert.equal(enhanced.areas[0].name,'Marketing')
assert.equal(enhanced.people[1].areaId,enhanced.areas[0].id)
assert.equal(enhanced.people[2].relationship,'advisor')
assert.deepEqual(enhanced.people[1].indirectParents,[enhanced.people[2].uid])
assert.ok(w.document.querySelector('.org-chart-node.is-advisor'))
assert.ok(w.document.querySelector('.org-chart-connectors'))
assert.ok(w.document.querySelector('.org-chart-connectors .is-advisor'))
assert.ok(w.document.querySelector('.org-chart-connectors .is-indirect'))
const syntheticPeople=[{uid:'root',name:'Dirección',parent:'',relationship:'direct',indirectParents:[],order:0},...Array.from({length:8},(_,index)=>({uid:`wide-${index}`,name:`Gerencia ${index}`,parent:'root',relationship:index===7?'advisor':'direct',indirectParents:index===6?['wide-0']:[],order:index})),...Array.from({length:5},(_,index)=>({uid:`deep-${index}`,name:`Nivel ${index}`,parent:index?`deep-${index-1}`:'wide-0',relationship:'direct',indirectParents:[],order:index}))]
const geometry=w.__sierraOrgLayout({people:syntheticPeople,areas:[],color:'teal'})
assert.equal(geometry.nodes.length,syntheticPeople.length)
assert.ok(geometry.width>geometry.nodes[0].width*4)
assert.ok(geometry.height>geometry.nodes[0].height*4)
for(let i=0;i<geometry.nodes.length;i++)for(let j=i+1;j<geometry.nodes.length;j++){const a=geometry.nodes[i],b=geometry.nodes[j],overlap=a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y;assert.equal(overlap,false,`nodes ${a.id} and ${b.id} overlap`)}
for(const edge of geometry.connectors){assert.ok(edge.points.length>=4);for(const point of edge.points){assert.ok(point[0]>=0&&point[0]<=geometry.width);assert.ok(point[1]>=0&&point[1]<=geometry.height)}}
const person=(uid,parent='',relationship='direct',indirectParents=[],areaId='area-a',order=0)=>({uid,name:`Persona ${uid}`,role:`Puesto ${uid}`,parent,relationship,indirectParents,areaId,order})
const cases={
  small:{people:[person('root'),person('a','root'),person('b','root')]},
  wide:{people:[person('root'),...Array.from({length:16},(_,index)=>person(`w${index}`,'root',index>=13?'advisor':'direct',index===9?['w1']:index===10?['w2']:index===11?['w3']:index===12?['w4']:[], 'area-a',index))]},
  deep:{people:[person('root'),...Array.from({length:12},(_,index)=>person(`d${index}`,index?`d${index-1}`:'root')),person('advisor-1','d3','advisor'),person('advisor-2','d7','advisor')]},
  mixed:{people:[person('root'),person('m1','root'),person('m2','root'),person('m3','root'),person('m4','root','advisor'),person('m5','root','advisor'),person('g1','m1'),person('g2','m1'),person('g3','m2','direct',['m3']),person('g4','m2','direct',['m1']),person('deep1','g1'),person('deep2','deep1')]},
  area:{areaId:'area-a',people:[person('outside','','direct',[],'area-b'),person('area-root','outside'),person('area-child','area-root'),person('area-advisor','area-root','advisor'),person('other','outside','direct',[],'area-b')]}
}
const inside=(point,rect)=>point[0]>rect.x&&point[0]<rect.x+rect.width&&point[1]>rect.y&&point[1]<rect.y+rect.height
const segmentHitsRect=(a,b,rect)=>{if(a[0]===b[0])return a[0]>rect.x&&a[0]<rect.x+rect.width&&Math.max(Math.min(a[1],b[1]),rect.y)<Math.min(Math.max(a[1],b[1]),rect.y+rect.height);if(a[1]===b[1])return a[1]>rect.y&&a[1]<rect.y+rect.height&&Math.max(Math.min(a[0],b[0]),rect.x)<Math.min(Math.max(a[0],b[0]),rect.x+rect.width);return false}
const collinearOverlap=(a,b,c,d)=>{if(a[0]===b[0]&&c[0]===d[0]&&a[0]===c[0])return Math.max(Math.min(a[1],b[1]),Math.min(c[1],d[1]))<Math.min(Math.max(a[1],b[1]),Math.max(c[1],d[1]));if(a[1]===b[1]&&c[1]===d[1]&&a[1]===c[1])return Math.max(Math.min(a[0],b[0]),Math.min(c[0],d[0]))<Math.min(Math.max(a[0],b[0]),Math.max(c[0],d[0]));return false}
const properCross=(a,b,c,d)=>{const av=a[0]===b[0],cv=c[0]===d[0];if(av===cv)return false;const v1=av?a:c,v2=av?b:d,h1=av?c:a,h2=av?d:b,x=v1[0],y=h1[1];return x>Math.min(h1[0],h2[0])&&x<Math.max(h1[0],h2[0])&&y>Math.min(v1[1],v2[1])&&y<Math.max(v1[1],v2[1])}
const geometryEvidence={}
for(const [name,value] of Object.entries(cases)){
  const layout=w.__sierraOrgLayout({people:value.people,areas:[{id:'area-a',name:'Área A',color:'blue'},{id:'area-b',name:'Área B',color:'green'}],color:'teal'},value.areaId||''),nodes=new Map(layout.nodes.map(item=>[item.id,item]));let nodeOverlaps=0,cardCrossings=0,indirectOverlaps=0,lineCrossings=0,relationshipOverlaps=0
  const list=[...nodes.values()];for(let i=0;i<list.length;i++){const item=list[i];assert.ok(item.x>=0&&item.y>=0&&item.x+item.width<=layout.width&&item.y+item.height<=layout.height,`${name}: ${item.id} remains inside canvas`);for(let j=i+1;j<list.length;j++){const other=list[j],overlap=item.x<other.x+other.width&&item.x+item.width>other.x&&item.y<other.y+other.height&&item.y+item.height>other.y;if(overlap)nodeOverlaps++}}
  for(const edge of layout.connectors){const source=nodes.get(edge.from),target=nodes.get(edge.to),first=edge.points[0],last=edge.points.at(-1),down=source.y<=target.y,expectedFirstY=source.y+(edge.kind==='indirect'&&!down?0:source.height),expectedLastY=target.y+(edge.kind==='indirect'&&!down?target.height:0);if(edge.kind==='direct')assert.equal(first[0],source.x+source.width/2,`${name}: direct line starts at center of ${edge.from}`);else assert.ok(first[0]>source.x&&first[0]<source.x+source.width,`${name}: ${edge.kind} starts on ${edge.from}`);assert.equal(first[1],expectedFirstY,`${name}: ${edge.kind} starts vertically at ${edge.from}`);if(edge.kind==='indirect')assert.ok(last[0]>target.x&&last[0]<target.x+target.width,`${name}: indirect line ends on ${edge.to}`);else assert.equal(last[0],target.x+target.width/2,`${name}: ${edge.kind} ends horizontally at ${edge.to}`);assert.equal(last[1],expectedLastY,`${name}: ${edge.kind} ends vertically at ${edge.to}`);for(let index=1;index<edge.points.length;index++)for(const node of list){if(node.id===edge.from||node.id===edge.to)continue;if(segmentHitsRect(edge.points[index-1],edge.points[index],node))cardCrossings++}}
  const indirect=layout.connectors.filter(edge=>edge.kind==='indirect');for(let i=0;i<indirect.length;i++)for(let j=i+1;j<indirect.length;j++)for(let a=1;a<indirect[i].points.length;a++)for(let b=1;b<indirect[j].points.length;b++){if(collinearOverlap(indirect[i].points[a-1],indirect[i].points[a],indirect[j].points[b-1],indirect[j].points[b]))indirectOverlaps++;if(properCross(indirect[i].points[a-1],indirect[i].points[a],indirect[j].points[b-1],indirect[j].points[b]))lineCrossings++}
  for(let i=0;i<layout.connectors.length;i++)for(let j=i+1;j<layout.connectors.length;j++){const first=layout.connectors[i],second=layout.connectors[j];if(first.kind===second.kind)continue;for(let a=1;a<first.points.length;a++)for(let b=1;b<second.points.length;b++)if(collinearOverlap(first.points[a-1],first.points[a],second.points[b-1],second.points[b]))relationshipOverlaps++}
  assert.equal(nodeOverlaps,0,`${name}: no node overlap`);assert.equal(cardCrossings,0,`${name}: connectors avoid unrelated cards`);assert.equal(indirectOverlaps,0,`${name}: indirect lines have independent lanes`);assert.equal(relationshipOverlaps,0,`${name}: advisor, direct and indirect lines do not overlap`);geometryEvidence[name]={nodes:layout.nodes.length,width:layout.width,height:layout.height,connectors:layout.connectors.length,indirect:indirect.length,nodeOverlaps,cardCrossings,indirectOverlaps,relationshipOverlaps,lineCrossings}
}
assert.equal(geometryEvidence.area.nodes,3)
assert.match(css,/\.org-chart-node strong\{[^}]*font-size:15px/)
assert.match(css,/\.org-chart-node span\{[^}]*font-size:12px/)
assert.match(css,/\.is-indirect-halo/)
assert.match(css,/\.org-chart-art>header::before\{content:none\}/)
assert.match(css,/\.org-chart-node\{[^}]*background:#fff/)
assert.match(css,/\.org-builder-stage #org-chart-art\{background:transparent\}/)
assert.match(css,/\.org-export-host \.org-chart-art,\.org-print-sheet \.org-chart-art\{background:#fff\}/)
assert.doesNotMatch(source,/org-chart-card-head"><span><\/span>/)
assert.doesNotMatch(source,/doc\.rect\(x,y,w,Math\.max\(2,3\*scale\),'F'\)/)
assert.match(source,/function installCanvasPan\(\)/)
assert.equal(w.document.querySelector('.org-builder-stage').getAttribute('aria-label'),'Lienzo libre del organigrama')
assert.equal(w.document.querySelectorAll('.org-studio-rail [role="tab"]').length,6)
assert.ok(w.document.querySelector('.org-studio-rail [aria-selected="true"]'))
console.log('GEOMETRY:',JSON.stringify(geometryEvidence))
assert.match(w.commsOrgEditorHtml({id:'block-1'},''),/Insertar desde Marketing/)
console.log('PASS: Marketing organigrams create, persist, model areas/advisors/indirect reports, preview and connect to Memos and SIERRA Times')
