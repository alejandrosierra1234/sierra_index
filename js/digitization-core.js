/* Pure helpers: bounded ZIP import, safe exports, account-scoped durable upload outbox. */
(function(root){
'use strict';
const encoder=new TextEncoder(),decoder=new TextDecoder();
const MAX_IMAGE=20*1024*1024;
function safeCell(v){v=String(v??'');return /^[\s]*[=+@\-]/.test(v)?"'"+v:v}
function csv(rows){return '\ufeff'+rows.map(r=>r.map(v=>'"'+safeCell(v).replaceAll('"','""')+'"').join(',')).join('\r\n')}
function crc32(bytes){let c=0xffffffff;for(const b of bytes){c^=b;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0)}return (c^0xffffffff)>>>0}
function zipStore(files){let offset=0;const local=[],central=[];for(const [name,content]of files){const n=encoder.encode(name),b=encoder.encode(content),crc=crc32(b);const h=new Uint8Array(30+n.length),v=new DataView(h.buffer);v.setUint32(0,0x04034b50,true);v.setUint16(4,20,true);v.setUint32(14,crc,true);v.setUint32(18,b.length,true);v.setUint32(22,b.length,true);v.setUint16(26,n.length,true);h.set(n,30);local.push(h,b);const c=new Uint8Array(46+n.length),d=new DataView(c.buffer);d.setUint32(0,0x02014b50,true);d.setUint16(4,20,true);d.setUint16(6,20,true);d.setUint32(16,crc,true);d.setUint32(20,b.length,true);d.setUint32(24,b.length,true);d.setUint16(28,n.length,true);d.setUint32(42,offset,true);c.set(n,46);central.push(c);offset+=h.length+b.length}const end=new Uint8Array(22),e=new DataView(end.buffer),size=central.reduce((n,c)=>n+c.length,0);e.setUint32(0,0x06054b50,true);e.setUint16(8,files.length,true);e.setUint16(10,files.length,true);e.setUint32(12,size,true);e.setUint32(16,offset,true);return new Blob([...local,...central,end],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})}
function xlsx(rows){const xml=s=>String(s??'').replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g,'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');return zipStore([
 ['[Content_Types].xml','<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>'],
 ['_rels/.rels','<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'],
 ['xl/workbook.xml','<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Sample Digitization" sheetId="1" r:id="rId1"/></sheets></workbook>'],
 ['xl/_rels/workbook.xml.rels','<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>'],
 ['xl/worksheets/sheet1.xml','<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>'+rows.map((r,i)=>'<row r="'+(i+1)+'">'+r.map(v=>'<c t="inlineStr"><is><t xml:space="preserve">'+xml(v)+'</t></is></c>').join('')+'</row>').join('')+'</sheetData></worksheet>']])}
async function* unzip(file){
 if(file.size>256*1024*1024)throw Error('ZIP: maximum 256 MB');
 const tail=new Uint8Array(await file.slice(Math.max(0,file.size-65557)).arrayBuffer()),t=new DataView(tail.buffer);let end=-1;
 for(let i=tail.length-22;i>=0;i--)if(t.getUint32(i,true)===0x06054b50){end=i;break}
 if(end<0||t.getUint16(end+4,true)!==0||t.getUint16(end+6,true)!==0)throw Error('ZIP invalid / multipart unsupported');
 const count=t.getUint16(end+10,true),size=t.getUint32(end+12,true),offset=t.getUint32(end+16,true);
 if(count>5000||size>4*1024*1024||offset+size>file.size)throw Error('ZIP directory limit');
 const directory=new Uint8Array(await file.slice(offset,offset+size).arrayBuffer()),v=new DataView(directory.buffer);let pos=0,total=0;
 for(let i=0;i<count;i++){
  if(pos+46>directory.length||v.getUint32(pos,true)!==0x02014b50)throw Error('ZIP directory invalid');
  const flags=v.getUint16(pos+8,true),method=v.getUint16(pos+10,true),crc=v.getUint32(pos+16,true),compressed=v.getUint32(pos+20,true),length=v.getUint32(pos+24,true),nl=v.getUint16(pos+28,true),extra=v.getUint16(pos+30,true),comment=v.getUint16(pos+32,true),start=v.getUint32(pos+42,true);
  const name=decoder.decode(directory.slice(pos+46,pos+46+nl));pos+=46+nl+extra+comment;
  if(pos>directory.length||flags&1||name.includes('..')||name.startsWith('/')||name.includes('\\')||((v.getUint32(pos-(46+nl+extra+comment)+38,true)>>>16)&0xf000)===0xa000)throw Error('ZIP unsafe entry');
  if(name.endsWith('/'))continue;
  total+=length;if(length>MAX_IMAGE||total>512*1024*1024||length>Math.max(compressed*100,1048576))throw Error('ZIP expansion limit');
  if(!/\.(jpe?g|png|webp|heic|heif)$/i.test(name))throw Error('ZIP contains unsupported file');
  const header=new DataView(await file.slice(start,start+30).arrayBuffer());if(header.byteLength!==30||header.getUint32(0,true)!==0x04034b50)throw Error('ZIP local header invalid');
  const from=start+30+header.getUint16(26,true)+header.getUint16(28,true);if(from+compressed>offset)throw Error('ZIP entry out of bounds');
  let stream=file.slice(from,from+compressed).stream();if(method===8)stream=stream.pipeThrough(new DecompressionStream('deflate-raw'));else if(method!==0)throw Error('ZIP compression unsupported');
  const reader=stream.getReader(),chunks=[];let bytes=0;
  try{while(true){const {value,done}=await reader.read();if(done)break;bytes+=value.length;if(bytes>length||bytes>MAX_IMAGE)throw Error('ZIP expansion exceeded');chunks.push(value)}}finally{await reader.cancel()}
  const raw=new Uint8Array(await new Blob(chunks).arrayBuffer());if(bytes!==length||crc32(raw)!==crc)throw Error('ZIP integrity failure');
  yield new File([raw],name.split('/').pop(),{type:/\.png$/i.test(name)?'image/png':/\.webp$/i.test(name)?'image/webp':/\.hei[cf]$/i.test(name)?'image/heic':'image/jpeg'});
 }
}
async function outbox(account){return new Promise((resolve,reject)=>{const req=indexedDB.open('sierra-digitization-'+account,1);req.onupgradeneeded=()=>req.result.createObjectStore('uploads',{keyPath:'id'});req.onerror=()=>reject(req.error);req.onsuccess=()=>{const db=req.result;resolve({run:(mode,fn)=>new Promise((ok,no)=>{const tx=db.transaction('uploads',mode);let result;fn(tx.objectStore('uploads'),v=>result=v);tx.oncomplete=()=>ok(result);tx.onerror=()=>no(tx.error);tx.onabort=()=>no(tx.error)})})}})}
root.DigitizationCore={MAX_IMAGE,csv,xlsx,unzip,outbox,crc32};
if(typeof module!=='undefined')module.exports=root.DigitizationCore;
})(typeof window!=='undefined'?window:globalThis);
