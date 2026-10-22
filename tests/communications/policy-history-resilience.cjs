const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { JSDOM } = require('jsdom')

const review = fs.readFileSync(path.join(__dirname, '../../js/policy-review.js'), 'utf8')
const start = review.indexOf(' policyOpenHistory=async function(){')
const end = review.indexOf('\n policyRestoreVersion=', start)
assert(start >= 0 && end > start)

const dom = new JSDOM('<!doctype html><body><button class="policy-history-button">Historial</button></body>')
const policy = {
  id: 'policy-1',
  versions: [{ id: 'publication-1', published: true, snapshot: { title: 'Aprobada' } }],
}
const statuses = []
let renders = 0
const context = vm.createContext({
  document: dom.window.document,
  current: () => policy,
  originalHistory: () => {
    renders += 1
    if (!dom.window.document.querySelector('.policy-history-backdrop')) {
      const drawer = dom.window.document.createElement('div')
      drawer.className = 'policy-history-backdrop'
      dom.window.document.body.append(drawer)
    }
  },
  policyHistorySetStatus: (kind, message, retry) => statuses.push({ kind, message, retry }),
  policyFlushPendingSave: () => {},
  _policyCloudWrites: new Map(),
  rpc: async name => {
    if (name === 'policy_revision_list') return [{ id: 'cloud-2', snapshot: { title: 'Borrador anterior' } }]
    throw new Error('publication endpoint unavailable')
  },
  console: { warn: () => {} },
  policyOpenHistory: null,
})

vm.runInContext(review.slice(start, end), context)

;(async () => {
  await context.policyOpenHistory()
  assert.equal(renders, 2, 'the drawer opens immediately and refreshes with available cloud data')
  assert.equal(JSON.stringify(policy.versions.map(version => version.id)), JSON.stringify(['cloud-2', 'publication-1']))
  assert.equal(statuses[0].kind, 'loading')
  assert.equal(statuses.at(-1).kind, 'warning')
  assert.match(statuses.at(-1).message, /publicaciones aprobadas/)
  assert.equal(statuses.at(-1).retry, true)
  const button = dom.window.document.querySelector('.policy-history-button')
  assert.equal(button.disabled, false)
  assert.equal(button.hasAttribute('aria-busy'), false)
  console.log('PASS: policy history remains usable when one cloud source fails')
})().catch(error => {
  console.error(error)
  process.exitCode = 1
})
