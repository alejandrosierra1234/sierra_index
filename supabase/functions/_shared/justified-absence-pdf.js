const PT_PER_MM = 72 / 25.4

const clean = value => String(value ?? '').trim()
const mm = value => value * PT_PER_MM

function fitText(font, value, size, maxWidth) {
  let text = clean(value)
  if (!text || font.widthOfTextAtSize(text, size) <= maxWidth) return text
  while (text.length > 1 && font.widthOfTextAtSize(text + '...', size) > maxWidth) text = text.slice(0, -1)
  return text + '...'
}

function wrapText(font, value, size, maxWidth, maxLines = 2) {
  const words = clean(value).split(/\s+/).filter(Boolean)
  if (!words.length) return []
  const lines = []
  let line = ''
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word
    if (!line || font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      line = candidate
      continue
    }
    lines.push(line)
    line = word
    if (lines.length === maxLines - 1) break
  }
  if (line && lines.length < maxLines) lines.push(line)
  if (lines.length === maxLines && words.join(' ') !== lines.join(' ')) {
    lines[maxLines - 1] = fitText(font, lines[maxLines - 1], size, maxWidth)
  }
  return lines
}

async function embedImage(pdf, asset) {
  if (!asset?.bytes?.length) return null
  const mime = clean(asset.mime).toLowerCase()
  try {
    if (mime.includes('png')) return await pdf.embedPng(asset.bytes)
    if (mime.includes('jpeg') || mime.includes('jpg')) return await pdf.embedJpg(asset.bytes)
  } catch {
    return null
  }
  return null
}

export async function createJustifiedAbsencePdf(pdfLib, data, assets = {}) {
  const { PDFDocument, StandardFonts, rgb, degrees } = pdfLib
  const pdf = await PDFDocument.create()
  const page = pdf.addPage([792, 612])
  const regular = await pdf.embedFont(StandardFonts.Helvetica)
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
  const mono = await pdf.embedFont(StandardFonts.Courier)
  const logo = await embedImage(pdf, assets.logo)
  const employeeSignature = await embedImage(pdf, assets.employeeSignature)
  const ink = rgb(0.169, 0.169, 0.169)
  const muted = rgb(0.37, 0.39, 0.41)
  const line = rgb(0.82, 0.83, 0.84)
  const border = rgb(0.68, 0.70, 0.72)
  const panel = rgb(0.96, 0.96, 0.96)
  const accent = rgb(0, 0.49, 0.45)
  const watermark = rgb(0.92, 0.93, 0.93)
  const margin = mm(3)
  const gap = mm(1.5)
  const copyWidth = (page.getWidth() - (margin * 2) - gap) / 2
  const copyHeight = page.getHeight() - (margin * 2)

  const drawCopy = (kind, left) => {
    const top = margin
    const localX = value => left + value
    const localY = value => page.getHeight() - top - value
    const rect = (x, y, width, height, options = {}) => page.drawRectangle({
      x:localX(x), y:localY(y + height), width, height,
      borderColor:options.borderColor || line,
      borderWidth:options.borderWidth ?? 0.6,
      ...(options.color ? { color:options.color } : {}),
    })
    const rule = (x1, y1, x2, y2, color = line, thickness = 0.6) => page.drawLine({
      start:{ x:localX(x1), y:localY(y1) }, end:{ x:localX(x2), y:localY(y2) }, color, thickness,
    })
    const text = (value, x, y, size, font = regular, color = ink, options = {}) => {
      const raw = clean(value)
      if (!raw) return
      const shown = options.maxWidth ? fitText(font, raw, size, options.maxWidth) : raw
      let drawX = localX(x)
      if (options.align === 'right') drawX -= font.widthOfTextAtSize(shown, size)
      if (options.align === 'center') drawX -= font.widthOfTextAtSize(shown, size) / 2
      page.drawText(shown, { x:drawX, y:localY(y) - size, size, font, color })
    }
    const cell = (x, y, width, height, label, value, options = {}) => {
      rect(x, y, width, height, { borderColor:line })
      text(label.toUpperCase(), x + mm(1.5), y + mm(1.2), 5.4, regular, muted, { maxWidth:width - mm(3) })
      const valueFont = options.mono ? mono : bold
      const valueSize = options.valueSize || 7.8
      const lines = options.wrap ? wrapText(valueFont, value, valueSize, width - mm(3), options.maxLines || 2) : [clean(value)]
      lines.forEach((lineText, index) => text(lineText, x + mm(1.5), y + mm(4.1 + (index * 3.2)), valueSize, valueFont, ink, { maxWidth:width - mm(3) }))
    }
    const section = (y, title) => {
      rect(mm(4.5), y, copyWidth - mm(9), mm(5), { color:panel, borderColor:line })
      text(title.toUpperCase(), mm(6.5), y + mm(1.2), 7.3, bold, ink)
      return y + mm(5)
    }
    const signature = (x, y, width, label, image, value = '') => {
      rect(x, y, width, mm(15), { borderColor:line })
      if (image) {
        const scaled = image.scale(1)
        const maxW = width - mm(6), maxH = mm(7.4)
        const ratio = Math.min(maxW / scaled.width, maxH / scaled.height)
        const imageWidth = scaled.width * ratio, imageHeight = scaled.height * ratio
        page.drawImage(image, { x:localX(x + ((width - imageWidth) / 2)), y:localY(y + mm(9.5)) + mm(1), width:imageWidth, height:imageHeight })
      } else if (value) {
        text(value, x + mm(2), y + mm(5.6), 7, regular, ink, { maxWidth:width - mm(4) })
      }
      rule(x + mm(2), y + mm(9.5), x + width - mm(2), y + mm(9.5), border, 0.65)
      text(label, x + mm(1.5), y + mm(10.9), 6.1, bold, ink, { maxWidth:width - mm(3) })
    }

    rect(0, 0, copyWidth, copyHeight, { borderColor:border, borderWidth:0.8 })
    const watermarkSize = kind === 'COPIA' ? 82 : 68
    const watermarkWidth = bold.widthOfTextAtSize(kind, watermarkSize)
    const watermarkHeight = bold.heightAtSize(watermarkSize)
    const angle = 35 * Math.PI / 180
    const centerX = left + copyWidth / 2
    const centerY = page.getHeight() - top - copyHeight / 2
    page.drawText(kind, {
      x:centerX - ((watermarkWidth * Math.cos(angle) - watermarkHeight * Math.sin(angle)) / 2),
      y:centerY - ((watermarkWidth * Math.sin(angle) + watermarkHeight * Math.cos(angle)) / 2),
      size:watermarkSize, font:bold, color:watermark, rotate:degrees(35), opacity:0.72,
    })

    const innerX = mm(4.5), innerWidth = copyWidth - mm(9)
    const headerY = mm(4), headerH = mm(29), logoW = mm(30)
    rect(innerX, headerY, innerWidth, headerH, { borderColor:border, borderWidth:0.8 })
    rule(innerX + logoW, headerY, innerX + logoW, headerY + headerH)
    rule(innerX + logoW, headerY + mm(19), innerX + innerWidth, headerY + mm(19))
    const rightWidth = innerWidth - logoW
    rule(innerX + logoW + rightWidth / 2, headerY + mm(19), innerX + logoW + rightWidth / 2, headerY + headerH)
    if (logo) {
      const dims = logo.scale(1), maxW = logoW - mm(5), maxH = headerH - mm(7)
      const ratio = Math.min(maxW / dims.width, maxH / dims.height)
      const width = dims.width * ratio, height = dims.height * ratio
      page.drawImage(logo, { x:localX(innerX + ((logoW - width) / 2)), y:localY(headerY + ((headerH + height) / 2)), width, height })
    } else {
      text(data.companyName, innerX + logoW / 2, headerY + mm(12), 6.1, bold, muted, { align:'center', maxWidth:logoW - mm(5) })
    }
    const titleX = innerX + logoW + mm(3)
    text('TALENTO HUMANO', titleX, headerY + mm(3), 6.2, bold, accent)
    text('Inasistencia justificada', titleX, headerY + mm(7.2), 12.2, regular, ink, { maxWidth:rightWidth - mm(6) })
    text(data.companyName, titleX, headerY + mm(13.2), 7, regular, muted, { maxWidth:rightWidth - mm(6) })
    text('EJEMPLAR', titleX, headerY + mm(20.5), 5.2, regular, muted)
    text('FOLIO', titleX + rightWidth / 2, headerY + mm(20.5), 5.2, regular, muted)
    text(kind, titleX, headerY + mm(24), 7.5, bold, ink)
    text(data.folio, titleX + rightWidth / 2, headerY + mm(24), 7.1, mono, ink, { maxWidth:rightWidth / 2 - mm(4) })

    let cursor = headerY + headerH + mm(1.8)
    cursor = section(cursor, 'Datos del colaborador')
    const half = innerWidth / 2
    cell(innerX, cursor, half, mm(9), 'Fecha de solicitud', data.requestDate); cell(innerX + half, cursor, half, mm(9), 'Área / departamento', data.department); cursor += mm(9)
    cell(innerX, cursor, innerWidth, mm(9.8), 'Nombre del colaborador', data.employeeName); cursor += mm(9.8)
    cell(innerX, cursor, half, mm(9), 'Número de DPI', data.identification, { mono:true }); cell(innerX + half, cursor, half, mm(9), 'Correo electrónico', data.email, { valueSize:6.8 }); cursor += mm(9)

    cursor += mm(1.8); cursor = section(cursor, 'Detalle de la inasistencia')
    cell(innerX, cursor, innerWidth, mm(11), 'Concepto', data.reason, { wrap:true, maxLines:2, valueSize:7.1 }); cursor += mm(11)
    cell(innerX, cursor, half, mm(9), 'Tipo de tiempo', data.timeType); cell(innerX + half, cursor, half, mm(9), 'Tiempo parcial', data.partialTime); cursor += mm(9)
    cell(innerX, cursor, half, mm(9), 'Desde', data.startDate); cell(innerX + half, cursor, half, mm(9), 'Hasta', data.endDate); cursor += mm(9)
    cell(innerX, cursor, half, mm(9), 'Total equivalente', data.totalDays, { mono:true }); cell(innerX + half, cursor, half, mm(9), 'Constancia', data.evidence); cursor += mm(9)

    cursor += mm(1.8); cursor = section(cursor, 'Firmas y autorización')
    signature(innerX, cursor, half, 'Firma del colaborador', employeeSignature); signature(innerX + half, cursor, half, 'Gerente de área', null, data.manager); cursor += mm(15)
    signature(innerX, cursor, half, 'Recursos Humanos', null, data.hr); signature(innerX + half, cursor, half, 'Fecha de cierre', null, data.approvalDate); cursor += mm(15)

    cursor += mm(1.8); cursor = section(cursor, 'Control')
    cell(innerX, cursor, half, mm(9), 'Estado', data.status); cell(innerX + half, cursor, half, mm(9), 'Solicitud en tiempo', data.onTime); cursor += mm(9)
    cell(innerX, cursor, innerWidth, mm(13), 'Comentarios', data.comments, { wrap:true, maxLines:2, valueSize:6.8 })

    const footerY = copyHeight - mm(5.8)
    rule(innerX, footerY, innerX + innerWidth, footerY)
    text('DOCUMENTO INTERNO', innerX, footerY + mm(1.2), 5.2, regular, muted)
    text('TALENTO HUMANO', innerX + innerWidth, footerY + mm(1.2), 5.2, regular, muted, { align:'right' })
  }

  drawCopy('ORIGINAL', margin)
  drawCopy('COPIA', margin + copyWidth + gap)
  page.drawLine({ start:{ x:page.getWidth()/2, y:margin }, end:{ x:page.getWidth()/2, y:page.getHeight()-margin }, color:rgb(.75,.76,.77), thickness:.5, dashArray:[3,3] })
  pdf.setTitle(`Boleta de inasistencia justificada - ${clean(data.employeeName)}`)
  pdf.setCreator('SIERRA Index')
  return await pdf.save({ useObjectStreams:true })
}
