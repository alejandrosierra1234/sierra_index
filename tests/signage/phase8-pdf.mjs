import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const require=createRequire(import.meta.url), here=path.dirname(fileURLToPath(import.meta.url)), root=path.resolve(here,'../..')
const Pdf=require(path.join(root,'js/signage-pdf-presentations.js'))
let assertions=0
const rejects=async(fn,code)=>{await assert.rejects(fn,error=>error?.code===code);assertions+=1}

function syntheticPdf() {
  const objects=[
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 640 360] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
    '<< /Length 45 >>\nstream\nBT /F1 24 Tf 72 180 Td (SIERRA demo) Tj ET\nendstream',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ]
  let body='%PDF-1.4\n',offsets=[0]
  objects.forEach((value,index)=>{offsets.push(Buffer.byteLength(body));body+=`${index+1} 0 obj\n${value}\nendobj\n`})
  const xref=Buffer.byteLength(body);body+=`xref\n0 ${objects.length+1}\n0000000000 65535 f \n${offsets.slice(1).map(value=>String(value).padStart(10,'0')+' 00000 n ').join('\n')}\ntrailer\n<< /Size ${objects.length+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`
  return new Uint8Array(Buffer.from(body))
}

const valid=syntheticPdf(),file=new File([valid],'presentacion.pdf',{type:'application/pdf'})
Pdf.validateContainer(file,valid);assertions+=1
const pdfjs=await import(pathToFileURL(path.join(root,'vendor/pdfjs/pdf.mjs')).href)
const parsed=await pdfjs.getDocument({data:valid.slice(),disableWorker:true,isEvalSupported:false}).promise
assert.equal(parsed.numPages,1);assertions+=1;await parsed.destroy()

const mockPdfjs={
  getDocument(){
    return { promise:Promise.resolve({
      numPages:2,
      getJavaScript:async()=>[],
      getJSActions:async()=>null,
      getPage:async()=>({getViewport:({scale})=>({width:640*scale,height:360*scale}),render:()=>({promise:Promise.resolve()}),cleanup(){}}),
      destroy:async()=>{},
    }) }
  },
}
const canvas=()=>({getContext:()=>({}),toBlob(callback){callback(new Blob([new Uint8Array([137,80,78,71])],{type:'image/png'}))}})
const stages=[]
const result=await Pdf.processPdf(file,{pdfjs:mockPdfjs,createCanvas:canvas,onProgress:value=>stages.push(value.stage)})
assert.equal(result.pageCount,2);assertions+=1
assert.equal(result.originalUploaded,false);assertions+=1
assert.deepEqual(result.slides.map(slide=>slide.fileName),['diapositiva-01.png','diapositiva-02.png']);assertions+=1
assert.equal(stages.at(-1),'complete');assertions+=1

await rejects(()=>Pdf.processPdf(new File([Buffer.from('not pdf')],'trampa.pdf',{type:'application/pdf'}),{pdfjs:mockPdfjs,createCanvas:canvas}),'PDF_BYTES_DENIED')
await rejects(()=>Pdf.processPdf(new File([valid],'trampa.png',{type:'image/png'}),{pdfjs:mockPdfjs,createCanvas:canvas}),'PDF_TYPE_DENIED')
await rejects(()=>Pdf.processPdf(new File([Buffer.concat([Buffer.from('%PDF-1.4\n/Encrypt true\n'),Buffer.from('%%EOF\n')])],'protegido.pdf',{type:'application/pdf'}),{pdfjs:mockPdfjs,createCanvas:canvas}),'PDF_PASSWORD_DENIED')
const tooMany={getDocument(){return{promise:Promise.resolve({numPages:51,destroy:async()=>{}})}}}
await rejects(()=>Pdf.processPdf(file,{pdfjs:tooMany,createCanvas:canvas}),'PDF_PAGE_LIMIT')
const active={getDocument(){return{promise:Promise.resolve({numPages:1,getJavaScript:async()=>['app.alert(1)'],getJSActions:async()=>null,destroy:async()=>{}})}}}
await rejects(()=>Pdf.processPdf(file,{pdfjs:active,createCanvas:canvas}),'PDF_ACTIVE_CONTENT_DENIED')
const controller=new AbortController();controller.abort()
await rejects(()=>Pdf.processPdf(file,{pdfjs:mockPdfjs,createCanvas:canvas,signal:controller.signal}),'PDF_CANCELLED')

assert.equal(Pdf.RULES.maxBytes,25*1024*1024);assertions+=1
assert.equal(Pdf.RULES.maxPages,50);assertions+=1
console.log(`Pantallas PDF processor: ${assertions} assertions passed`)
