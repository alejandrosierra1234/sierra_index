const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')

const html = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf8')
const start = html.indexOf('const POLICY_STORE_KEY=')
const end = html.indexOf('function policyOpen(', start)
assert(start >= 0 && end > start)

const context = vm.createContext({
  console,
  Date,
  Math,
  JSON,
  localStorage: { getItem: () => null, setItem: () => {} },
})
vm.runInContext(html.slice(start, end), context)
vm.runInContext(`_policies=[createPolicyDraft({
  id:'source',title:'Política de calidad',code:'POL-${new Date().getFullYear()}-007',status:'Aprobada',
  companyId:'company-1',companyName:'Hilos y Algodón',companyLogo:'logo.png',
  sections:[{id:'section-source',title:'Objetivo',html:'<p>Contenido</p>'}],
  signers:[{role:'Aprobado por',name:'Ana',title:'Gerencia'}]
})]`, context)

const copy = context.policyDuplicateDraft(vm.runInContext('_policies[0]', context))
assert.notEqual(copy.id, 'source')
assert.equal(copy.title, 'Política de calidad (copia)')
assert.equal(copy.code, `POL-${new Date().getFullYear()}-008`)
assert.equal(copy.status, 'Borrador')
assert.equal(copy.companyName, 'Hilos y Algodón')
assert.equal(copy.sections[0].html, '<p>Contenido</p>')
assert.notEqual(copy.sections[0].id, 'section-source')
assert.deepEqual(JSON.parse(JSON.stringify(copy.signers)), [{ role: 'Aprobado por', name: 'Ana', title: 'Gerencia' }])
assert.match(html, /aria-label="Duplicar \$\{escAttr\(p\.title\)\}"/)
assert.match(html, /aria-label="\$\{archived\?'Desarchivar':'Archivar'\} \$\{escAttr\(p\.title\)\}"/)
assert.match(html, /function policyArchive\(id\)/)
console.log('PASS: policies duplicate independently and expose archive actions')
