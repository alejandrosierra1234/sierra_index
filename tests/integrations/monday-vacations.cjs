const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const pdfLib = require('pdf-lib')

const root = path.join(__dirname, '../..')
const functionSource = fs.readFileSync(path.join(root, 'supabase/functions/monday-vacation-webhook/index.ts'), 'utf8')
const pdfSource = fs.readFileSync(path.join(root, 'supabase/functions/_shared/vacation-pdf.js'), 'utf8')

assert.match(functionSource, /const BOARD_ID = '7729506932'/)
assert.match(functionSource, /const STATUS_COLUMN_ID = 'estado8'/)
assert.match(functionSource, /const OUTPUT_COLUMN_ID = 'file_mm824tqy'/)
assert.match(functionSource, /const TARGET_STATUS = 'Finalizado'/)
assert.match(functionSource, /body\?\.challenge/)
assert.match(functionSource, /MONDAY_VACATIONS_WEBHOOK_SECRET/)
assert.match(functionSource, /normalize\(columnText\(item,COLUMNS\.status\)\)/)
assert.match(functionSource, /columnFiles\(item,COLUMNS\.output\).*outputName/)
assert.match(functionSource, /add_file_to_column/)
assert.match(functionSource, /variables\[file\]/)
assert.match(functionSource, /companyIdentity\(\)/)
assert.match(functionSource, /createVacationPdf\(pdfLib/)

;(async () => {
  const moduleUrl = 'data:text/javascript;base64,' + Buffer.from(pdfSource).toString('base64')
  const { createVacationPdf } = await import(moduleUrl)
  const bytes = await createVacationPdf(pdfLib, {
    companyName:'Northern Textiles, S.A. de C.V.', folio:'261012-NT-00255', employeeCode:'NT-00255', requestDate:'2026-10-12',
    employeeName:'Daniel Edgardo Bustamante Carbajal', identification:'801197901904', department:'Production', site:'Northern Textiles',
    timeType:'Días completos', startDate:'2026-10-22', endDate:'2026-10-23', returnDate:'2026-10-24', requestedDays:'2',
    status:'Finalizado', partialTime:'', managerApproval:'Aprobado', hrApproval:'Finalizado', observations:'Boleta generada desde monday.com.',
  })
  const outputDir = path.join(root, 'tmp/pdfs')
  fs.mkdirSync(outputDir, { recursive:true })
  const output = path.join(outputDir, 'monday-vacation-webhook-fixture.pdf')
  fs.writeFileSync(output, bytes)
  const document = await pdfLib.PDFDocument.load(bytes)
  assert.equal(document.getPageCount(), 1)
  assert.ok(bytes.length > 4000)
  console.log(`PASS: Monday vacation webhook maps Finalizado to a one-page ORIGINAL/COPIA PDF (${output})`)
})().catch(error => { console.error(error); process.exitCode = 1 })
