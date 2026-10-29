import assert from 'node:assert/strict'
import { inspectMedia, MediaValidationError, sha256Hex } from '../../supabase/functions/_shared/signage-media-verify.mjs'

let assertions=0
const ok=(value,message)=>{assert.ok(value,message);assertions+=1}
const equal=(actual,expected,message)=>{assert.deepEqual(actual,expected,message);assertions+=1}
const rejected=(run,code)=>{assert.throws(run,error=>error instanceof MediaValidationError&&error.code===code);assertions+=1}
const box=(type,payload=Buffer.alloc(0))=>{const result=Buffer.alloc(8+payload.length);result.writeUInt32BE(result.length,0);result.write(type,4,4,'ascii');payload.copy(result,8);return result}
const container=(type,...children)=>box(type,Buffer.concat(children))
const mp4=codec=>{
  const ftyp=box('ftyp',Buffer.concat([Buffer.from('isom'),Buffer.alloc(4),Buffer.from('isommp42')]))
  const sample=box(codec,Buffer.alloc(78)),stsd=box('stsd',Buffer.concat([Buffer.alloc(4),Buffer.from([0,0,0,1]),sample]))
  return Buffer.concat([ftyp,container('moov',container('trak',container('mdia',container('minf',container('stbl',stsd))))),box('mdat',Buffer.alloc(32,7))])
}

const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=','base64')
const image=inspectMedia(png,'image/png');equal(image.width,1,'PNG width is parsed');equal(image.height,1,'PNG height is parsed');equal(image.format,'png','PNG format is identified')
equal((await sha256Hex(png)).length,64,'SHA-256 uses the actual bytes')
const damaged=Buffer.from(png);damaged[damaged.length-5]^=1;rejected(()=>inspectMedia(damaged,'image/png'),'MEDIA_STRUCTURE_INVALID')
rejected(()=>inspectMedia(png,'image/jpeg'),'MEDIA_BYTES_MISMATCH')
rejected(()=>inspectMedia(Buffer.alloc(10*1024*1024+1),'image/png'),'MEDIA_SIZE_DENIED')
const h264=inspectMedia(mp4('avc1'),'video/mp4');equal(h264.codec,'h264','MP4 requires H.264 sample description')
rejected(()=>inspectMedia(mp4('hvc1'),'video/mp4'),'MEDIA_CODEC_DENIED')
rejected(()=>inspectMedia(mp4('avc1').subarray(0,70),'video/mp4'),'MEDIA_STRUCTURE_INVALID')
rejected(()=>inspectMedia(png,'application/pdf'),'MEDIA_TYPE_DENIED')
ok(!('path' in image),'inspection does not expose storage paths')

console.log(`Pantallas media verification: ${assertions} assertions passed`)
