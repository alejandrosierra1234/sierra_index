const PT_PER_MM = 72 / 25.4

const clean = value => String(value ?? '').trim()
const mm = value => value * PT_PER_MM

function fitText(font, value, size, maxWidth) {
  let text = clean(value)
  if (!text || font.widthOfTextAtSize(text, size) <= maxWidth) return text
  while (text.length > 1 && font.widthOfTextAtSize(text + '...', size) > maxWidth) text = text.slice(0, -1)
  return text + '...'
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

export async function createVacationPdf(pdfLib, data, assets = {}) {
  const { PDFDocument, StandardFonts, rgb, degrees } = pdfLib
  const pdf = await PDFDocument.create()
  const page = pdf.addPage([792, 612])
  const regular = await pdf.embedFont(StandardFonts.Helvetica)
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
  const mono = await pdf.embedFont(StandardFonts.Courier)
  const logo = await embedImage(pdf, assets.logo)
  const employeeSignature = await embedImage(pdf, assets.employeeSignature)
  const managerSignature = await embedImage(pdf, assets.managerSignature)
  const ink = rgb(0.125, 0.129, 0.141)
  const muted = rgb(0.365, 0.388, 0.408)
  const line = rgb(0.79, 0.80, 0.81)
  const border = rgb(0.68, 0.70, 0.72)
  const panel = rgb(0.91, 0.92, 0.92)
  const accent = rgb(0, 0.49, 0.45)
  const watermark = rgb(0.91, 0.92, 0.92)
  const margin = mm(3)
  const gap = mm(1.5)
  const copyWidth = (page.getWidth() - (margin * 2) - gap) / 2
  const copyHeight = page.getHeight() - (margin * 2)

  const drawCopy = (kind, left) => {
    const top = margin
    const localX = value => left + value
    const localY = value => page.getHeight() - top - value
    const rect = (x, y, width, height, options = {}) => page.drawRectangle({
      x: localX(x), y: localY(y + height), width, height,
      borderColor: options.borderColor || line,
      borderWidth: options.borderWidth ?? 0.6,
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
      text(label.toUpperCase(), x + mm(1.5), y + mm(1.3), 5.6, regular, muted, { maxWidth:width - mm(3) })
      text(value, x + mm(1.5), y + mm(4.4), options.valueSize || 8.1, options.mono ? mono : bold, ink, { maxWidth:width - mm(3) })
    }
    const section = (y, title) => {
      rect(mm(4.5), y, copyWidth - mm(9), mm(5), { color:panel, borderColor:line })
      page.drawRectangle({ x:localX(mm(4.5)), y:localY(y + mm(5)), width:mm(1), height:mm(5), color:accent })
      text(title.toUpperCase(), mm(7), y + mm(1.2), 7.7, bold, ink)
      return y + mm(5)
    }
    const signature = (x, y, width, label, image, value = '') => {
      rect(x, y, width, mm(16), { borderColor:line })
      if (image) {
        const scaled = image.scale(1)
        const maxW = width - mm(6), maxH = mm(8)
        const ratio = Math.min(maxW / scaled.width, maxH / scaled.height)
        const imageWidth = scaled.width * ratio, imageHeight = scaled.height * ratio
        page.drawImage(image, { x:localX(x + ((width - imageWidth) / 2)), y:localY(y + mm(10)) + mm(1), width:imageWidth, height:imageHeight })
      }
      if (value) text(value, x + mm(2), y + mm(6.3), 7.2, mono, ink, { maxWidth:width - mm(4) })
      rule(x + mm(2), y + mm(10), x + width - mm(2), y + mm(10), border, 0.65)
      text(label, x + mm(1.5), y + mm(11.4), 6.2, bold, ink, { maxWidth:width - mm(3) })
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
    rule(innerX + logoW, headerY, innerX + logoW, headerY + headerH, line)
    rule(innerX + logoW, headerY + mm(19), innerX + innerWidth, headerY + mm(19), line)
    const rightWidth = innerWidth - logoW
    rule(innerX + logoW + rightWidth / 2, headerY + mm(19), innerX + logoW + rightWidth / 2, headerY + headerH, line)
    if (logo) {
      const dims = logo.scale(1), maxW = logoW - mm(5), maxH = headerH - mm(7)
      const ratio = Math.min(maxW / dims.width, maxH / dims.height)
      const width = dims.width * ratio, height = dims.height * ratio
      page.drawImage(logo, { x:localX(innerX + ((logoW - width) / 2)), y:localY(headerY + ((headerH + height) / 2)), width, height })
    } else {
      text(data.companyName, innerX + logoW / 2, headerY + mm(12), 6.3, bold, muted, { align:'center', maxWidth:logoW - mm(5) })
    }
    const titleX = innerX + logoW + mm(3)
    text('TALENTO HUMANO', titleX, headerY + mm(3), 6.2, bold, accent)
    text('Solicitud de vacaciones', titleX, headerY + mm(7.2), 13.2, regular, ink, { maxWidth:rightWidth - mm(6) })
    text(data.companyName, titleX, headerY + mm(13.2), 7.2, regular, muted, { maxWidth:rightWidth - mm(6) })
    text('EJEMPLAR', titleX, headerY + mm(20.5), 5.2, regular, muted)
    text('FOLIO', titleX + rightWidth / 2, headerY + mm(20.5), 5.2, regular, muted)
    text(kind, titleX, headerY + mm(24), 7.5, bold, ink)
    text(data.folio, titleX + rightWidth / 2, headerY + mm(24), 7.2, mono, ink, { maxWidth:rightWidth / 2 - mm(4) })

    let cursor = headerY + headerH + mm(1.8)
    cursor = section(cursor, 'Datos del colaborador')
    const half = innerWidth / 2
    cell(innerX, cursor, half, mm(9.2), 'Código', data.employeeCode, { mono:true }); cell(innerX + half, cursor, half, mm(9.2), 'Fecha de solicitud', data.requestDate); cursor += mm(9.2)
    cell(innerX, cursor, innerWidth, mm(10.5), 'Nombre del empleado', data.employeeName); cursor += mm(10.5)
    cell(innerX, cursor, half, mm(9.2), 'Documento de identificación', data.identification); cell(innerX + half, cursor, half, mm(9.2), 'Área / departamento', data.department); cursor += mm(9.2)
    cell(innerX, cursor, half, mm(9.2), 'Sede', data.site); cell(innerX + half, cursor, half, mm(9.2), 'Tipo de tiempo', data.timeType); cursor += mm(9.2)

    cursor += mm(1.8); cursor = section(cursor, 'Periodo solicitado')
    cell(innerX, cursor, half, mm(9.2), 'Desde', data.startDate); cell(innerX + half, cursor, half, mm(9.2), 'Hasta', data.endDate); cursor += mm(9.2)
    cell(innerX, cursor, half, mm(9.2), 'Regresa a sus labores', data.returnDate); cell(innerX + half, cursor, half, mm(9.2), 'Días solicitados', data.requestedDays, { mono:true }); cursor += mm(9.2)
    cell(innerX, cursor, half, mm(9.2), 'Estado', data.status); cell(innerX + half, cursor, half, mm(9.2), 'Tiempo parcial', data.partialTime); cursor += mm(9.2)

    cursor += mm(1.8); cursor = section(cursor, 'Firmas y autorizaciones')
    signature(innerX, cursor, half, 'Firma del empleado', employeeSignature); signature(innerX + half, cursor, half, 'Jefe inmediato', managerSignature); cursor += mm(16)
    signature(innerX, cursor, half, 'Recursos Humanos', null); signature(innerX + half, cursor, half, 'Fecha de solicitud', null, data.requestDate); cursor += mm(16)

    cursor += mm(1.8); cursor = section(cursor, 'Control de aprobación')
    cell(innerX, cursor, half, mm(9.2), 'Jefe inmediato', data.managerApproval); cell(innerX + half, cursor, half, mm(9.2), 'Recursos Humanos', data.hrApproval); cursor += mm(9.2)
    cell(innerX, cursor, innerWidth, mm(9.2), 'Fecha de aprobación RR. HH.', data.approvalDate); cursor += mm(9.2)
    cell(innerX, cursor, innerWidth, mm(12), 'Observaciones', data.observations, { valueSize:7.1 })

    const footerY = copyHeight - mm(5.8)
    rule(innerX, footerY, innerX + innerWidth, footerY, line)
    text('DOCUMENTO INTERNO', innerX, footerY + mm(1.2), 5.2, regular, muted)
    text('TALENTO HUMANO', innerX + innerWidth, footerY + mm(1.2), 5.2, regular, muted, { align:'right' })
  }

  drawCopy('ORIGINAL', margin)
  drawCopy('COPIA', margin + copyWidth + gap)
  page.drawLine({ start:{ x:page.getWidth()/2, y:margin }, end:{ x:page.getWidth()/2, y:page.getHeight()-margin }, color:rgb(.75,.76,.77), thickness:.5, dashArray:[3,3] })
  pdf.setTitle(`Boleta de vacaciones - ${clean(data.employeeName)}`)
  pdf.setCreator('SIERRA Index')
  return await pdf.save({ useObjectStreams:true })
}
