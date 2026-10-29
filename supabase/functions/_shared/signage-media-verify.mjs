export const MEDIA_RULES = Object.freeze({
  'image/png': { maxBytes: 10 * 1024 * 1024, kind: 'image' },
  'image/jpeg': { maxBytes: 10 * 1024 * 1024, kind: 'image' },
  'video/mp4': { maxBytes: 50 * 1024 * 1024, kind: 'video' },
})

export class MediaValidationError extends Error {
  constructor(code, message) { super(message); this.code = code }
}

const fail = (code, message) => { throw new MediaValidationError(code, message) }
const bytes = value => value instanceof Uint8Array ? value : new Uint8Array(value)
const u32 = (data, offset) => ((data[offset] << 24) | (data[offset + 1] << 16) | (data[offset + 2] << 8) | data[offset + 3]) >>> 0
const ascii = (data, offset, length) => String.fromCharCode(...data.subarray(offset, offset + length))

let crcTable
function crc32(data) {
  if (!crcTable) crcTable = Array.from({ length: 256 }, (_, value) => {
    let current = value
    for (let bit = 0; bit < 8; bit += 1) current = (current & 1) ? (0xedb88320 ^ (current >>> 1)) : (current >>> 1)
    return current >>> 0
  })
  let crc = 0xffffffff
  for (const value of data) crc = crcTable[(crc ^ value) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

function dimensions(width, height) {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || width > 8192 || height > 8192 || width * height > 33177600) {
    fail('MEDIA_DIMENSIONS_DENIED', 'La imagen supera 8K o no contiene dimensiones válidas.')
  }
  return { width, height }
}

function inspectPng(data) {
  const signature = [137,80,78,71,13,10,26,10]
  if (data.length < 45 || signature.some((value, index) => data[index] !== value)) fail('MEDIA_BYTES_MISMATCH', 'El archivo no contiene una imagen PNG válida.')
  let offset = 8, image, ended = false, chunks = 0
  while (offset + 12 <= data.length) {
    const length = u32(data, offset), type = ascii(data, offset + 4, 4), end = offset + 12 + length
    if (end > data.length) fail('MEDIA_STRUCTURE_INVALID', 'La estructura PNG está incompleta.')
    if (crc32(data.subarray(offset + 4, offset + 8 + length)) !== u32(data, offset + 8 + length)) fail('MEDIA_STRUCTURE_INVALID', 'La imagen PNG contiene datos dañados.')
    if (chunks === 0 && (type !== 'IHDR' || length !== 13)) fail('MEDIA_STRUCTURE_INVALID', 'La imagen PNG no contiene un encabezado válido.')
    if (type === 'IHDR') image = dimensions(u32(data, offset + 8), u32(data, offset + 12))
    if (type === 'IEND') { if (length !== 0 || end !== data.length) fail('MEDIA_STRUCTURE_INVALID', 'La imagen PNG contiene datos inesperados.'); ended = true }
    offset = end; chunks += 1
    if (ended) break
  }
  if (!image || !ended) fail('MEDIA_STRUCTURE_INVALID', 'La imagen PNG está incompleta.')
  return { ...image, format: 'png' }
}

function inspectJpeg(data) {
  if (data.length < 16 || data[0] !== 0xff || data[1] !== 0xd8 || data[data.length - 2] !== 0xff || data[data.length - 1] !== 0xd9) fail('MEDIA_BYTES_MISMATCH', 'El archivo no contiene una imagen JPEG válida.')
  let offset = 2, image = null
  const sof = new Set([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf])
  while (offset + 4 <= data.length - 2) {
    while (offset < data.length && data[offset] === 0xff) offset += 1
    const marker = data[offset++]
    if (marker === 0xda || marker === 0xd9) break
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue
    if (offset + 2 > data.length) fail('MEDIA_STRUCTURE_INVALID', 'La imagen JPEG está incompleta.')
    const length = (data[offset] << 8) | data[offset + 1]
    if (length < 2 || offset + length > data.length) fail('MEDIA_STRUCTURE_INVALID', 'La estructura JPEG está dañada.')
    if (sof.has(marker)) {
      if (length < 8) fail('MEDIA_STRUCTURE_INVALID', 'La imagen JPEG no contiene dimensiones válidas.')
      image = dimensions((data[offset + 5] << 8) | data[offset + 6], (data[offset + 3] << 8) | data[offset + 4])
    }
    offset += length
  }
  if (!image) fail('MEDIA_STRUCTURE_INVALID', 'La imagen JPEG no contiene dimensiones verificables.')
  return { ...image, format: 'jpeg' }
}

function boxes(data, start, end) {
  const result = []
  let offset = start
  while (offset + 8 <= end) {
    const size = u32(data, offset), type = ascii(data, offset + 4, 4)
    if (size < 8 || offset + size > end) fail('MEDIA_STRUCTURE_INVALID', 'El contenedor MP4 está dañado o incompleto.')
    result.push({ type, start: offset + 8, end: offset + size })
    offset += size
  }
  if (offset !== end) fail('MEDIA_STRUCTURE_INVALID', 'El contenedor MP4 contiene bytes fuera de estructura.')
  return result
}

function findAvc(data, list) {
  for (const box of list) {
    if (box.type === 'stsd') {
      if (box.start + 8 > box.end) fail('MEDIA_STRUCTURE_INVALID', 'La descripción de video MP4 está incompleta.')
      const count = u32(data, box.start + 4)
      let offset = box.start + 8
      for (let index = 0; index < count; index += 1) {
        if (offset + 8 > box.end) fail('MEDIA_STRUCTURE_INVALID', 'La descripción de video MP4 está dañada.')
        const size = u32(data, offset), type = ascii(data, offset + 4, 4)
        if (size < 8 || offset + size > box.end) fail('MEDIA_STRUCTURE_INVALID', 'La descripción de video MP4 está dañada.')
        if (type === 'avc1' || type === 'avc3') return true
        offset += size
      }
    }
    if (['moov','trak','mdia','minf','stbl'].includes(box.type) && findAvc(data, boxes(data, box.start, box.end))) return true
  }
  return false
}

function inspectMp4(data) {
  if (data.length < 64) fail('MEDIA_BYTES_MISMATCH', 'El archivo no contiene un video MP4 válido.')
  const top = boxes(data, 0, data.length), ftyp = top.find(box => box.type === 'ftyp')
  if (!ftyp || ftyp.start + 8 > ftyp.end || !top.some(box => box.type === 'moov') || !top.some(box => box.type === 'mdat')) fail('MEDIA_STRUCTURE_INVALID', 'El video MP4 no contiene las secciones necesarias.')
  const brands = []
  for (let offset = ftyp.start; offset + 4 <= ftyp.end; offset += 4) brands.push(ascii(data, offset, 4))
  if (!brands.some(brand => ['isom','iso2','mp41','mp42','M4V '].includes(brand))) fail('MEDIA_CODEC_DENIED', 'El contenedor MP4 no es compatible con el reproductor inicial.')
  if (!findAvc(data, top)) fail('MEDIA_CODEC_DENIED', 'El video debe estar codificado como H.264 (avc1/avc3).')
  return { format: 'mp4', codec: 'h264' }
}

export function inspectMedia(value, declaredType) {
  const data = bytes(value), rule = MEDIA_RULES[declaredType]
  if (!rule) fail('MEDIA_TYPE_DENIED', 'Solo se admiten PNG, JPEG y MP4 H.264.')
  if (data.length < 1 || data.length > rule.maxBytes) fail('MEDIA_SIZE_DENIED', rule.kind === 'image' ? 'La imagen debe pesar 10 MB o menos.' : 'El video debe pesar 50 MB o menos.')
  if (declaredType === 'image/png') return { type: declaredType, byteSize: data.length, ...inspectPng(data) }
  if (declaredType === 'image/jpeg') return { type: declaredType, byteSize: data.length, ...inspectJpeg(data) }
  return { type: declaredType, byteSize: data.length, ...inspectMp4(data) }
}

export async function sha256Hex(value) {
  const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes(value))
  return [...new Uint8Array(digest)].map(value => value.toString(16).padStart(2, '0')).join('')
}
