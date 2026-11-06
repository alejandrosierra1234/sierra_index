const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const migration = fs.readFileSync(path.join(__dirname, '../../update72.sql'), 'utf8')

assert.match(
  migration,
  /public\.index_account_active\(\)[\s\S]*or split_part\(p_name,'\/',1\)='company-logos'/,
  'active Index accounts can read shared company logos',
)
assert.doesNotMatch(
  migration,
  /split_part\(p_name,'\/',1\) in \([^)]*'company-logos'[^)]*\)[\s\S]{0,120}authorize\('talento_humano','read'\)/,
  'company logos must not depend on Human Resources read access',
)
assert.match(
  migration,
  /split_part\(p_name,'\/',1\) in \('employees','birthday-cards','avatars'\)[\s\S]{0,120}authorize\('talento_humano','read'\)/,
  'private HR media remains protected by Human Resources access',
)

console.log('PASS: company logo Storage access is shared across active Index accounts')
