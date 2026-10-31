const fs = require('node:fs')
const path = require('node:path')
const { spawnSync } = require('node:child_process')

const root = path.join(__dirname, '../..')
const baseline = [
  'check.cjs', 'infographics.cjs', 'new-hire.cjs', 'management.cjs',
  'export.cjs', 'flow.cjs', 'clean.cjs', 'spelling.cjs', 'cards.cjs',
  'storage.cjs', 'process-companies.cjs', 'invitations-simple.cjs',
  'academy.cjs',
  'sierra-times.cjs',
]
const policy = fs.readdirSync(__dirname).filter(name => /^policy-.*\.cjs$/.test(name)).sort()

for (const name of [...baseline, ...policy]) {
  const result = spawnSync(process.execPath, [path.join(__dirname, name)], {
    cwd: root,
    stdio: 'inherit',
  })
  if (result.status !== 0) process.exit(result.status || 1)
}
