# SIERRA ERP Design System

Source of truth for how every ERP screen in `index.html` is built. This
is a single static HTML/CSS/JS app (no component framework), so
"components" here means **CSS classes + small JS render helpers** that
every screen must reuse — not a page-specific pattern invented on the
spot.

Audited from the existing codebase before writing this: most of the
right primitives already existed (`.srd-layout`, `.srd-card`,
`.detail-toolbar`, `.smp-badge`, the `--sp-*`/`--r-*` token scales) but
were inconsistently applied — several screens hand-rolled their own
padding, widths and card shapes instead of reusing them. This doc
names the canonical primitive for each job and the token that backs
it, so new screens have one obvious thing to reach for.

## 1. Core principle

Structured, precise, calm, enterprise-grade, minimal, predictable.
Apple-level restraint + Linear-level alignment + ERP information
density. Not dashboard templates, not legacy SAP density, not
page-specific spacing hacks.

## 2. Global page grid

```
App shell
├── .sidebar            (fixed width, --sidebar-width)
└── .main
    └── .content        (the ONE scrollable page container)
        └── screen root (view-products / view-sample-detail / ...)
```

`.content` is the canonical **PageContainer**. It is the *only* place
horizontal page padding is ever declared:

```css
.content { padding: var(--page-padding-y) var(--page-padding-x); }
```

**Rule:** no screen may add its own `padding-left`/`padding-right`,
`margin-left`, or `width: calc(...)` to re-create page margins. If a
screen needs a bottom-cleared, width-capped inner wrapper (because it
has a sticky `.detail-toolbar`), it uses `.detail-view-inner` — see §3.
This was the single biggest inconsistency in the codebase: several
detail screens wrapped their content in a second `padding: … 1.75rem`
div *inside* `.content`, doubling the horizontal inset and knocking
their content out of alignment with the sticky action bar underneath
it (which bleeds to `.content`'s true edge via negative margin). Fixed
in the Samples fulfillment screens; do not reintroduce it.

### Layout tokens (`:root`)

| Token | Value | Use |
|---|---|---|
| `--sidebar-width` | 200px | `.sidebar` width |
| `--sidebar-width-collapsed` | 52px | `.sidebar.collapsed` width |
| `--page-padding-x` | 1.75rem | `.content` horizontal inset — THE page guide |
| `--page-padding-y` | 1.75rem | `.content` top/bottom inset |
| `--page-max-width` | 1480px | `.detail-view-inner` max width |
| `--content-gap` | 32px (`--sp-6`) | ContentGrid column gap |
| `--section-gap` | 24px (`--sp-5`) | vertical rhythm between page sections |
| `--panel-gap` | 16px (`--sp-4`) | spacing between stacked panels/rows |
| `--context-pane-width` | 340px | ContextPane fixed column width |
| `--control-h-sm` | 2rem | compact toolbar controls |
| `--control-h-md` | 2.5rem | standard buttons/inputs |
| `--panel-radius` / `--panel-border` / `--panel-padding` | `--r-md` / `1px solid var(--border)` / `1.25rem 1.4rem` | `.panel` |

These sit alongside the pre-existing scales already used throughout
the app — reuse them, don't invent parallel ones:

- **Spacing** (base-4): `--sp-1` 4px … `--sp-8` 64px
- **Radius**: `--r-xs` 4px, `--r-sm` 7px, `--r-md` 10px, `--r-lg` 12px, `--r-xl` 16px, `--r-2xl` 18px, `--r-pill` 999px
- **Status**: `--success`/`--success-bg`, `--warning-text`/`--warning-bg`/`--warning-border`, `--danger`/`--danger-bg`, `--info`/`--info-bg`
- **Motion**: `--dur-fast`/`--dur-base`/`--dur-slow`, `--ease-out`/`--ease-spring`

## 3. Standard page structure

Two shapes cover the whole app:

**List/catalog screen** (Catalog, Sample Center, Collections hub, Dispatch Queue):
```
.content-hdr              → PageHeader (title, subtitle, actions)
.page-metrics (optional)  → PageMetrics — compact counters that double as quick filters
.page-toolbar (optional)  → PageToolbar — search/filters/sort, one row
#pg                       → page body (table, grid, or list)
```

**Single-record / workspace screen** (Sample record, Collection
workspace, Dispatch/order workspace, Product detail) — always rendered
into `#view-sample-detail` or `#view-detail`:
```
.detail-view-inner        → PageContainer for this screen (caps width, clears sticky toolbar)
  .detail-back-btn        → breadcrumb back
  .page-header            → title + status + actions (alias: .srd-id-block)
  .ord-steps (optional)   → WorkflowStepper
  .content-grid           → MainPane + ContextPane (alias: .srd-layout)
.detail-toolbar (optional)→ WorkflowActionBar, sticky bottom
```

**Never** let a feature screen decide on its own where these live —
reuse the shape above.

## 4. PageHeader

Canonical class: `.page-header` (alias `.srd-id-block`, kept for
existing call sites). One flex row: title block on the left, status
badge + primary action on the right — never absolutely positioned.

```html
<div class="page-header">
  <div>
    <div class="page-header-title">COL-2026-000011</div>   <!-- 1.6rem/700, alias .srd-id-text -->
    <div class="page-header-meta">Target Fall 2027</div>    <!-- 0.7rem uppercase, alias .srd-id-sub -->
  </div>
  <div style="flex:1"></div>
  <span class="smp-badge smp-preparing">Preparing</span>
</div>
```

Supporting metadata (customer/requester/items/delivery-style key
facts) goes directly below the header as a plain flex row of
`label <b>value</b>` pairs — see `.ord-hdr-row` in the order workspace.
Don't invent a new metadata component per screen; copy that pattern.

### Typography scale

| Role | Size / weight |
|---|---|
| Page title (list screens, `.content-hdr-l h2`) | 2rem / 700 |
| Entity title (`.page-header-title`) | 1.6rem / 700 |
| Section label (`.page-section-label`, alias `.srd-section-label`) | 0.62rem / 600, uppercase, 0.1em tracking |
| Body | 0.8–0.85rem |
| Metadata (`.page-header-meta`, table headers) | 0.62–0.74rem |

## 5. Spacing rhythm

Use the tokens, not arbitrary values:

- Header → metadata: `--panel-gap` (16px)
- Metadata → toolbar/stepper: `--section-gap` (24px)
- Toolbar → content: `--panel-gap` (16px)
- Section → section: `--section-gap` (24px)

Don't compensate for weak structure with oversized blank space — if a
screen feels empty, that's a content/density problem to fix in the
screen, not a spacing problem to fix with a bigger margin.

## 6. ContentGrid (two-column operational layout)

Canonical class: `.content-grid` (alias `.srd-layout`).

```css
.content-grid { display:grid; grid-template-columns:minmax(0,1fr) var(--context-pane-width); gap:var(--content-gap); align-items:start; }
```

```html
<div class="content-grid">
  <div><!-- MainPane: table, form, board --></div>
  <div class="panel"><!-- ContextPane: see §12 --></div>
</div>
```

Both columns start-align (`align-items:start`) so the context panel
never floats disconnected from the main content. Below 900px it
collapses to a single stacked column (`gap:var(--section-gap)`) —
there is no separate "drawer" implementation yet; stacking is the
current small-screen behavior and is an acceptable interim per the
responsive rules in §14.

## 7. ERP table

Canonical classes: `.erp-table-wrap` / `.erp-table` (aliases
`.dq-table-wrap`/`.dq-table` and `.pick-table`, which used to be two
near-identical hand-copied rulesets — now one shared definition).

```html
<div class="erp-table-wrap">
  <table class="erp-table">
    <thead><tr><th>Order</th><th data-num>Items</th>…</tr></thead>
    <tbody><tr class="is-clickable" onclick="…">…</tr></tbody>
  </table>
</div>
```

- Sticky, uppercase, 0.62rem header on `--surface2`.
- Compact row padding (`0.5rem 0.7rem`), 1px border between rows, no
  border on the last row.
- `[data-num]` right-aligns and applies tabular numerals — put it on
  `<th>`/`<td>` for any numeric or currency column.
- Row hover (`tr.is-clickable:hover`) uses `--surface2`, same as every
  other hover state in the app — don't invent a new hover color.
- Status cells use `.smp-badge` (§11). Actions are small ghost/primary
  buttons in the last cell, right-aligned by column order (not
  `position:absolute`).
- Never wrap a table in a `.panel`/`.srd-card` "for spacing" — the
  table's own border/radius is the container. Only add a panel around
  a table if there's a real reason to group it with other content.

## 8. Panel

Canonical class: `.panel` (alias `.srd-card`).

```css
.panel { border:var(--panel-border); border-radius:var(--panel-radius); padding:var(--panel-padding); }
```

Cards are not the default — most page content sits directly on
`.content`'s background. Reach for `.panel` only when information is a
meaningfully distinct group (a ContextPane, a form, a QR/codes block).
Max nesting is `Page → Panel → Content` — don't nest panels inside
panels.

## 9. Buttons

Already standardized app-wide via `.btn` + modifiers — reuse, don't
recreate:

- Types: `.btn-primary`, `.btn-ghost`, (destructive = `.btn-ghost` with
  `color:var(--danger)`, as used for Exclude/Archive actions)
- Sizes: default and `.btn-sm`
- Heights come from `--control-h-md` (toolbar/sticky-bar buttons,
  40px) and `--control-h-sm` (inline table/row actions, 32px) — don't
  pick a one-off height per screen.

Primary action placement: **top-right of the PageHeader** for
navigational/creation actions ("Create collection"), or **the
WorkflowActionBar** for a workflow's next step. Never place a lone
primary button floating under a table with no bar around it.

## 10. WorkflowActionBar

Canonical class: `.detail-toolbar` (already existed and was already
correct — sticky, blurred, bleeds to the page edge via
`margin:0 calc(var(--page-padding-x) * -1)`). Content is one flex row:

```html
<div class="detail-toolbar">
  <div class="detail-toolbar-inner">
    <span style="color:var(--text-3)">3 items still pending</span>  <!-- left: validation summary -->
    <div class="detail-toolbar-spacer"></div>
    <button class="btn btn-ghost btn-sm">Reprint manifest</button>   <!-- right: secondary -->
    <button class="btn btn-primary">Finalize Picking</button>        <!-- right: primary -->
  </div>
</div>
```

Left = status/validation text (why a button is disabled, or what's
outstanding) — never leave a disabled button with no explanation.
Right = secondary then primary, in that order. This is the pattern
implemented in the Dispatch/order workspace (§19 test case).

## 11. Status system

Canonical: `.smp-badge` + `.smp-<status>` (already the single status
pill system, backed by the `--success`/`--warning`/`--danger`/`--info`
tokens). Every workflow status in the app — samples, collections,
dispatch — renders through `smpBadge(status)`. Don't build a bespoke
colored `<span>` for a new status; add it to `SMP_STATUS_LABEL` +
`.smp-<status>` instead.

## 12. ContextPane content template

Canonical classes: `.ctx-lbl` (section label), `.ctx-stat` (label/value
row, `.warn` modifier for an exception count), `.ctx-line` /
`.ctx-line.muted` (freeform lines), `.ctx-sep` (divider).

```html
<div class="panel">
  <div class="ctx-lbl">Reconciliation</div>
  <div class="ctx-stat"><span>Requested</span><b>24</b></div>
  <div class="ctx-stat warn"><span>Unavailable</span><b>2</b></div>
  <div class="ctx-sep"></div>
  <div class="ctx-lbl">Delivery</div>
  <div class="ctx-line">DHL · Urgent</div>
  <div class="ctx-line muted">123 Main St, …</div>
</div>
```

This is the one template for every right-side panel — reconciliation,
delivery info, notes, permissions summaries, etc.

## 13. Form controls

Inputs/selects share one look app-wide: `1px solid var(--border)`,
`var(--surface2)` background, `var(--r-sm)` radius, `0.76–0.85rem`
font. Compact toolbar controls (`.page-toolbar input`,
`.page-toolbar select`) are `--control-h-sm` (32px); standalone form
fields elsewhere in the app run slightly taller — don't shrink those
to match a toolbar, and don't stretch toolbar controls to match a
form.

## 14. Responsive rules

- **Table**: horizontal scroll inside `.erp-table-wrap` (`overflow:auto`,
  `min-width` on the table) rather than collapsing columns.
- **ContentGrid**: single column below 900px (`.content-grid`/`.srd-layout`
  media query) — context pane stacks under the main pane. A drawer
  variant is not implemented yet; stacking is the current standard,
  don't build a one-off collapse behavior per screen.
- **Sidebar**: collapses to `--sidebar-width-collapsed` via
  `.sidebar.collapsed`, unrelated to page content responsiveness.

## 15. No absolute positioning for layout

Status badges, primary actions and context content must be composed
with flex/grid inside `.page-header`/`.content-grid`/`.detail-toolbar`
— never `position:absolute` to "place" them. Absolute positioning is
reserved for true overlays (modals, popovers like `.bu-switch-pop`/
`.mod-switch-pop`, sticky decorative dots). The Samples fulfillment
screens had no absolute-positioned layout to begin with; if you find
one while touching another screen, replace it with the grid/flex
primitives above.

## 16. Applying this to a new screen

1. Decide: list screen or single-record/workspace screen (§3).
2. List screen → build inside `#pg`, using `.page-metrics`/
   `.page-toolbar`/`.erp-table` as needed. Header stays in the
   existing `.content-hdr` (title/subtitle/`#product-controls`).
3. Single-record/workspace screen → wrap everything in
   `.detail-view-inner`, start with `.page-header`, then
   `.content-grid` if there's a context pane, then `.detail-toolbar`
   if there's a workflow action.
4. Reuse `.panel`, `.ctx-*`, `.smp-badge`, `.btn*` — don't hand-roll
   inline-styled equivalents.
5. If a spacing/sizing value isn't covered by an existing token,
   that's a signal to add the token here, not to hardcode a one-off
   value in the screen.

## 17. Status of the Samples module

Refactored onto this system: **Dispatch Queue** (list + counters +
toolbar + table) and the **Dispatch/order workspace** (picking,
packing, delivery) — the explicit test case for this pass, including
fixing the double-padding bug described in §2. **Sample record** and
**Collection workspace** had the same double-padding bug and were
fixed at the container level (now use `.detail-view-inner`) without a
full visual rewrite. **Catalog**, **Insights**, and **Warehouse
Inventory** already used the pre-existing `.content-hdr`/`.srd-*`
primitives reasonably well and were left as-is beyond the shared token
changes (which apply automatically since they're aliases, not
rewrites).

Not yet audited to this system: Collection Board/Cards/Table/Insights
sub-views, Team/Access Logs, and the public product page. Apply the
same §16 checklist when touching them.
