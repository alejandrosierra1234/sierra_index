const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const html = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf8')

assert.match(html, /const POLICY_PANEL_LAYOUT_KEY='sierra_policy_panel_layout_v1'/)
assert.match(html, /function policyStartPanelResize\(event\)/)
assert.match(html, /function policyResizePanelKey\(event\)/)
assert.match(html, /function policyTogglePanel\(force\)/)
assert.match(html, /role="separator" aria-label="Ajustar ancho del panel de herramientas"/)
assert.match(html, /class="policy-panel-collapse"/)
assert.match(html, /class="policy-panel-divider-expand"/)
assert.match(html, /\.policy-studio\.is-panel-collapsed\{grid-template-columns:0 50px minmax\(0,1fr\)\}/)
assert.match(html, /@media\(max-width:940px\)/)

console.log('PASS: policy tools panel is spacious, resizable, collapsible and persistent')
