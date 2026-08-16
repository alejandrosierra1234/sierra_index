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
| `--control-h` | 36px | **THE** control height — see §24 |
| `--control-h-sm` | 32px | compact secondary contexts only |
| `--control-h-lg` | 40px | full-width form submits / modal footers |
| `--control-h-md` | alias of `--control-h` | legacy name |
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

See **§23 Button hierarchy** for the full contract. Summary: four
variants (`.btn-primary`, `.btn-secondary`, `.btn-ghost`,
`.btn-danger`), one height (`--control-h`, 36px), one radius, one type
size. A button never sets its own height.

Primary action placement: **the ObjectHeader's action group** on a
record screen, **top-right of the PageHeader** for navigational/creation
actions ("Create collection"), or **the WorkflowActionBar** for a
workflow's next step. Never place a lone primary button floating under a
table with no bar around it. One primary per screen.

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

## 12b. Popover / Dropdown Menu (canonical, single implementation)

Before this pass, the module switcher (`.mod-switch-pop`) and business-unit
switcher (`.bu-switch-pop`) were byte-for-byte duplicated CSS, and the
workspace "more"/price/invite flyout (`.ws-pop`) was a third, separately
maintained popover shell. All three now compose one shared rule set —
`.pop-menu-item` / `.pop-menu-sep` / `.pop-menu-hint` for rows, plus a
shared shell (background/border/radius/shadow/padding) applied via a
combined selector on `.mod-switch-pop, .bu-switch-pop, .acct-menu-pop`
(ancestor-driven open state) and on `.ws-pop` (self-toggled open state via
`.ws-pop.open`). **Do not create a new popover CSS block** — a new
anchored menu should render `.pop-menu-item` rows inside either an
ancestor-driven `.pop-menu-…` wrapper (switcher-style, lives in a labeled
parent that owns `.open`) or a self-toggled `.ws-pop` (icon-button
flyout), never a bespoke shell.

Two open mechanics, by design, not accidentally:
- **Ancestor-driven**: parent element (`.mod-switch`, `.bu-switch`,
  `.acct-menu`) toggles its own `.open` class; the popover fades via a
  descendant-combinator rule. Used by switcher-style triggers.
- **Self-toggled**: the popover element toggles `.open` on itself
  (`.ws-pop.open`); any other click closes all open `.ws-pop`s
  (`wsClosePopovers()`). Used by icon-button flyouts (more menu, price
  editor, invite).

### Account menu

Sidebar identity click (`#acct-menu`) now opens a structured popover
(`renderAcctMenu()` / `toggleAcctMenu()`) instead of jumping straight to
the profile modal — §25 of the ERP evolution brief. Rows: My profile,
Notifications, Appearance (shows current Light/Dark), Administration
(Team, Access logs — only rendered when `isAdmin()`), Help, Log out
(`.pop-menu-item.danger`). Content is rebuilt on every open so it always
reflects live theme/role state. The existing standalone sidebar-footer
shortcuts (Website, Notifications, Appearance nav items) are left in
place as direct-access affordances; the account menu is an additional,
structured entry point layered on top, not a replacement requiring a
sidebar-footer rewrite.

## 12c. Drawer (canonical right-side panel)

Canonical shell: `#sd-overlay` / `.sd-panel` / `.sd-hdr` / `.sd-tabs` /
`.sd-body` — one instance in the page markup, filled and opened through a
generic JS API, not a component you re-render per feature:

```js
openSideDrawer({
  eyebrow: 'Colección',            // small label above the title
  title: 'Actividad',
  tabs: [{ key: 'activity', label: 'Actividad' }, { key: 'comments', label: 'Comentarios (3)' }],
  activeTab: 'activity',
  onTab: (key) => { /* fill #sd-body for this tab */ },
})
closeSideDrawer()
```

Use the Drawer — not a permanent inline block, not a new modal, not a
navigate-away page — for secondary context that should stay anchored to
the object you're already looking at: Activity, Comments, Permissions,
audit history (§17/§23 of the ERP evolution brief). Visual language
matches `.modal` (same surface/border/radius/shadow scale) so it reads as
the same system, just anchored to the right edge instead of centered,
with ESC and backdrop-click both wired to `closeSideDrawer()`.

**When to reach for what:**
- **Popover** (§12b) — a small anchored list of actions/options, closes on
  any outside click, no independent scroll region.
- **Drawer** (this section) — secondary *content* (a feed, a form, a
  timeline) the user reads/scrolls while keeping the object's main view
  visible behind it.
- **Modal** — a focused task that blocks the rest of the page until it's
  resolved (invite, destructive confirmation, multi-field create flow).

**Reference implementation**: Collection workspace ObjectHeader (§10) —
the Activity and Comments icon buttons (`wsOpenDrawer('activity'|'comments')`
in the `.ws-hdr` actions row) open the same drawer instance with tabs.
Comments used to render as a permanent `.srd-card` block at the bottom of
the Board tab; that block is gone — comments only exist inside the
drawer now (`_wsDrawerState.commentsHtml`, filled once per workspace
render, kept out of the main work surface). Activity is fetched on tab
open (`wsLoadActivity`) against the same `activity_events` table used by
the product detail audit tab, rendered with the existing `.tl-item`
timeline markup — no new timeline component was created.

## 12d. Collaborator role presets (invite flow)

Single source of truth: `COLLAB_ROLE_PRESETS` in `index.html` (next to
`SMP_STATUS_LABEL`, same "one registry, not a scattered string
comparison" pattern). Six presets — Viewer, Contributor, Technical
Editor, Commercial Editor, Collection Manager, Custom — each mapping to
a fixed capability set (`manage_samples`, `comment`, `edit_pricing`,
`edit_protected_specs`, `submit`, `manage_people`). Custom is the only
preset with `caps: null`; its actual capabilities live per-row in the
`capabilities` jsonb column (see `update17.sql`), edited through an
inline checklist (`wsCapChecklistHtml`) that only appears when Custom is
selected — "complex permissions must feel simple" means the other five
presets never show the matrix at all.

**Where it's read:**
- `wsCapsForRole(role, capabilities)` — resolves one collaborator's caps.
- `wsMyCapabilities(col, collaborators)` — resolves the signed-in user's
  caps for a given collection; the collection owner and anyone with the
  platform-level `manage_status`/`customer_service` permission bypass the
  preset system entirely (same "admin overrides everything" pattern as
  `isAdmin()` elsewhere).
- The workspace render computes this once per render into `myCap` (and
  mirrors it to `_wsMyCap` for helpers like `wsPriceCellHtml` that don't
  receive it as a parameter) and gates: Board's add/remove/category
  controls on `manage_samples`, the price popover on `edit_pricing`, the
  submit form on `submit`, and the invite search/role controls on
  `manage_people`.

**Invite flow UI**: a search result row carries its own role `<select>`
(defaults Contributor) next to the "Invitar" button; an existing
collaborator's row gets the same select if the viewer has
`manage_people`, otherwise a read-only role tag. Reuses `.grant-sel` for
the select and the existing `.ws-invite-row` shape — no new form control
or row component.

**Honesty about enforcement**: this pass gates the *UI* — the same level
most of the app's existing role/permission checks already operate at
(`can()`, `canEditDiv()`, etc.). `update17.sql` adds one real RLS policy
(collaborator role/capabilities UPDATE, which had no policy at all
before — that gap is now closed) but does not add per-capability RLS
for every sample/pricing write; those still go through the table-level
policies that existed before this pass. Treat the role preset as a real
product feature, not yet a hardened security boundary — tightening RLS
to match every capability is flagged as future work, not silently
assumed done.

## 12e. Overflow (•••) menu

Canonical helper: `overflowMenuHtml(items, opts)` in `index.html` (next
to `toggleCardMore`). Every object-level ••• menu should be built by
calling it, not by hand-writing `.card-more-btn`/`.card-more-menu`
markup — that duplication (the Catalog card and product-detail quick
actions each hard-coded their own menu HTML, and `.card-more-menu` had
its own copy of the popover shell CSS instead of composing `.ws-pop`)
is exactly what this pass removed.

```js
overflowMenuHtml([
  { label: 'Duplicate product', onClick: 'duplicateProduct(selected)' },
  { label: 'Delete', onClick: `deleteThing('${id}')`, danger: true },
], { title: 'Quick actions', style: 'width:auto;padding:0 0.6rem' /* optional trigger override */ })
```

`items[].icon` accepts a raw inline SVG string when the row needs one
(Catalog card's "View sheet"/"Print label" rows do; plain text-only rows
like the product quick-actions menu can omit it). The generated trigger
button reuses `toggleCardMore()` for open/close — self-toggled on the
trigger, same mechanic family as `.ws-pop` (§12b).

**Two reference implementations, deliberately not force-merged into one
JS function:**
- **Catalog card / product detail quick actions** — `overflowMenuHtml()`,
  single ••• trigger per object, toggled via `toggleCardMore()`.
- **Collection workspace ObjectHeader** (`#ws-more-pop`) — still built
  from a conditional `moreMenuItems` array (its items depend on
  collection status/division in ways a flat list doesn't capture as
  cleanly) and toggled via `wsToggleMore()`/`wsClosePopovers()` — the
  same "close every open `.ws-pop` on outside click" mechanic that also
  serves the per-row price popover and the invite panel. Its rows
  already render through `.ws-menu-item`, which is aliased into the
  same `.pop-menu-item` base styling as `overflowMenuHtml()`'s rows
  (§12b) — so both are visually and structurally the *same component*
  even though the JS entry point differs. Don't rewrite `#ws-more-pop`
  to force it through `overflowMenuHtml()`; the toggle mechanism, not
  the visual, is what differs, and `wsClosePopovers()` needs to keep
  coordinating multiple simultaneous `.ws-pop` instances on one screen
  (more-menu, price editor, invite) that a single-button helper doesn't
  need to handle.

If a new entity needs a ••• menu with a fixed, non-conditional item
list, reach for `overflowMenuHtml()` first.

## 13. Form controls

Inputs/selects share one look app-wide. A control that can sit next to
a button — `.control-input` (alias `.tl-search`), `.pd-select`,
`.completeness-control`, `.icon-btn` — is `--control-h` tall with a
`--border-strong` border, `--control-radius` corners and 14px type. See
**§24 Control heights**. Compact contexts (`.page-toolbar`, table rows,
popovers) use `--control-h-sm`, and never mix the two in one group.

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

**Full-codebase audit (this pass)**: every `position:absolute` rule in
`index.html` was reviewed, not just the Samples screens. Result: all 29
CSS rules are legitimate anchored elements — badges pinned to a
card/icon corner (`.card-check`, `.ws-icon-badge`, `.cart-nav-badge`),
popovers/dropdown menus (`.ws-pop` family, §12b), tooltips, an
avatar-stack overlap effect, and the QR/camera-scan viewfinder's
decorative corner brackets. Zero inline `style="position:absolute"` in
any JS-generated markup, and zero page-container `margin-left`/
`width:calc(...)` hacks (the pattern §2 explicitly forbids) anywhere in
the file — `width:calc(...)` only shows up twice, both sizing a
self-contained floating widget (mobile bulk-action bar, camera-overlay
button) against its own margin, not recreating `.content`'s padding.
Conclusion: this codebase was already clean on layout hacks going into
this pass (the prior design-system pass had already fixed the real
instances) — nothing further to remove here. If a future screen
introduces one, treat it as a regression against this audit, not a
pre-existing pattern to match.

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
full visual rewrite. **Insights** and **Warehouse Inventory** already
used the pre-existing `.content-hdr`/`.srd-*` primitives reasonably
well and were left as-is beyond the shared token changes (which apply
automatically since they're aliases, not rewrites). **Catalog** was
later rebuilt from a product-gallery screen into the ERP list-screen
shape from §3 — see §18.

Collection workspace now has four view tabs over the **same dataset**
(§11 — views must not duplicate data): Board (editable/draft or
read-only rows, grouped by category with collapse/expand — already
existed), **Cards** (new — photo-forward `.pg-grid` of `.card` tiles,
read-only, click opens the sample record; see `wsCardsViewHtml()`),
**Table** (new — flat `.erp-table` over the identical `items` array,
sorted by category then name, row click opens the sample record; see
`wsTableViewHtml()`), and Stats. A Board-native Insights tab is not yet
split out — Stats currently covers that role.

Cards deliberately reuses the Catalog's card primitives
(`.pg-grid`/`.card`/`.card-img`/`.card-img-placeholder`/`.card-div-pill`/
`.card-meta-side`/`.card-name`/`.card-desc`) rather than a second card
component — the only new markup is the body content (category · sample
type · qty, price, status badge) swapped in for the catalog card's
quick-request/print actions, which don't apply to an item already inside
a collection.

Popover/dropdown menus across the whole app were consolidated onto one
primitive this pass (§12b) — no screen should introduce a new one-off
popover shell.

A canonical Drawer primitive (§12c) now exists — `#sd-overlay`/`.sd-panel`
+ `openSideDrawer()`/`closeSideDrawer()`/`switchDrawerTab()`. First (and
so far only) consumer: Collection workspace Activity + Comments, reached
from two icon buttons in the ObjectHeader. Comments moved out of a
permanent inline block into the drawer as part of this change. Sample
record, product detail, dispatch/order workspace still render their
Activity/Comments/history inline or in tabs — not yet migrated to the
Drawer; do that the next time one of those screens is touched, rather
than inventing another local panel.

Not yet audited to this system: Team/Access Logs list screens, and the
public product page. Apply the same §16 checklist when touching them.

## 18. Catalog (ERP product master)

Catalog was rebuilt from a photo-forward product gallery (permanent
large construction-type buttons, giant cards, an oversized "Add
sample" CTA on every tile, cards-only) into the standard §3
list-screen shape: PageHeader → ViewTabs → saved views → DataToolbar →
DataTable/Cards. It is now **data-first, Table by default**; images
are secondary. Every new primitive below composes existing shared
components — no page-specific toolbar or card system was introduced.

**Header** — unchanged `.content-hdr` (`#sec-title`/`#sec-sub`,
`DIV_LBL[division]` / "Technical product catalog"), with the primary
action moved into `#product-controls` (top-right, per §9): `+ New
product` when the signed-in user can edit that division
(`renderCatalogHeaderActions()`).

**ViewTabs (Table | Cards)** — `#cat-view-tabs`, `.pd-tabs
.pd-tabs-inline`. `.pd-tabs-inline` is a new modifier on the existing
`.pd-tabs`/`.pd-tab` segmented control (§ "Collection workspace"
Board/Cards/Table/Stats tabs): the base component stretches every tab
to equal width via `flex:1`, which is wrong for a tab strip that
should hug its content. `.pd-tabs-inline` keeps the same pill-track/
lifted-active visual language without the stretch — use it for any
future 2-4-item view switch or compact tab row; don't build a second
tabs component. `setCatalogView()` persists the choice
(`localStorage: sierra_catalog_view`) and re-renders the same filtered
dataset through the other view — Table and Cards are never two data
paths.

**Saved views (fabric only)** — `#fab-filter-bar`, also rendered as
`.pd-tabs-inline` (`renderCatalogSavedViews()`), replacing the old
permanent large `.fab-chip` category buttons. `CAT_SAVED_VIEWS` is a
fixed list (All Fabrics / Jersey / Rib / Interlock / Sustainable);
`Sustainable` matches the real `tags` field (substring `sustain`), not
an invented attribute. Construction/type is otherwise reached through
Filter and Group by, per the brief — no other division shows this row.

**DataToolbar** — `#cat-toolbar`, `.page-toolbar`
(`renderCatalogToolbar()`): Search, Filter, Sort, Group by, Hide
columns (Table view only), spacer, `•••`. One toolbar for the whole
screen — there is no separate custom Catalog toolbar. Filter/Sort/
Group by/Hide-columns are each a trigger button (`.cat-tb-btn`) next
to a `.ws-pop` popover filled with `.cat-pop-row` checklist/list rows —
this is the **filter/column-visibility popover pattern**, new to the
design system, composed entirely from the existing self-toggled
popover primitive (§12b) rather than a bespoke dropdown. Because
`.ws-pop`'s outside-click-closes behavior only recognized
`.ws-icon-btn` triggers, the shared listener in `index.html` (next to
`wsClosePopovers()`) was extended to also recognize `.cat-tb-btn` —
reuse that class on any future text-label popover trigger instead of
special-casing another one. The old floating `#div-toolbar` action
pill (Search/Select/Import/New product, shown only while Catalog was
active) is retired — the element is kept empty in the DOM only because
many unrelated screens null-check-free `getElementById('div-toolbar')`
on their way in.

**Filters** — `catFacetValues()`/`catApplyFacetFilters()` build
checklists from real fields only: Construction (fabric), Availability
(lifecycle), Composition, Color. No fake attributes (Yarn Count,
Finish, Warehouse/Location) are surfaced — they don't exist on
`products`/`specs` today. "Finish" in the columns list is the closest
real field, Dyed Method, labeled accordingly.

**Grouping** — `CAT_GROUP_DEFS` (Construction / Composition /
Availability) + `catGroup()`, one function shared by both Table
(`catTableHtml`) and Cards (`catCardsHtml`) — never a per-view
grouping implementation (§11). Groups are collapsible
(`.cat-group-row`/`catToggleGroup()`); the collapsed set persists only
for the current session (`_catCollapsedGroups`).

**DataTable** — `.erp-table` (§7) extended with a checkbox column
(`.cat-td-select`/`.cat-th-select`), sticky header (inherited from
`.erp-table th { position:sticky }`, wrapped in `.erp-table-wrap` with
`max-height:calc(100vh - 320px)` so the table scrolls internally
rather than growing the page), and a configurable column set
(`CAT_COLUMNS`, hidden columns persisted to
`localStorage: sierra_catalog_hidden_cols`). Row click opens the
product quick-view Drawer; the last cell is row actions — a subtle
`.cat-req-btn` "Request sample" (outline, not a filled CTA) plus the
canonical `•••` (`overflowMenuHtml()`, §12e) for View full record /
Print label. Column resizing is not implemented — flagged as future
work, not faked with a non-functional drag handle.

**Cards** — same filtered/sorted/grouped dataset as Table, rendered
through `.pg-grid.cat-cards-dense`, a density modifier on the existing
card primitives (not a second card component): shorter image (84px vs
128px), tighter body padding, single-line name/description, tags
hidden. Quick action is the same `.cat-req-btn` as the table row, not
the old filled `.card-req-btn` CTA (removed).

**Row/card selection** is always on — there is no "select mode"
toggle to turn on first (the old `toggleSelectMode()`/`#select-btn`
were removed as dead code once selection became a permanent table/card
affordance, matching how selection works everywhere else in the app).
Selecting rows shows the existing **BulkActionBar** (`#select-bar`,
already the canonical bulk bar — same shell reused, not rebuilt): the
new `bulkRequestSamples()` action adds every selected product straight
to the active draft collection (same mechanism as the per-row Request
sample button — "the current sample request/cart", per the product
brief), and the pre-existing `openBulkReq()`/`#m-bulk` flow is relabeled
"Add to Collection" for the confirm-first path.

**Product quick-view Drawer** — clicking a row/card calls
`openCatalogDrawer(p)`, filling the canonical Drawer (§12c,
`#sd-overlay`) with code/lifecycle, construction, and the same
technical fields as the table columns via the `.ctx-*` template
(§12), plus Request sample / Add to selection / **Open full record**.
"Open full record" still routes to the existing full-page product
detail (`openFicha`/`showProductDetail`) for the deep specs/documents/
history view that doesn't belong in a quick-glance panel — the Drawer
is a quick-view layer in front of it, not a replacement for it.

**Pricing** — `canSeeCatalogPricing()` gates the Price column/drawer
row behind the existing `edit_pricing`-style capability
(`canEditPricing()`, i.e. `can('write','customer_service')`) plus
admin, the same permission already used for sample/collection pricing
elsewhere. `specs.Price` is still a free-text field (no structured
currency/unit columns exist on `products` yet), so it's shown verbatim
rather than reformatted into a fabricated canonical `$X / lb` string —
do that reformatting once pricing becomes structured data, not before.


## 19. Typography & text contrast

The single biggest reason the app read as "everything is gray" was
`--text-3: #aaaaaa` — 2.3:1 on white, below any accessible threshold,
used for 300+ pieces of genuinely useful information. The text system
is now a four-step ladder with a defined job per step, and nothing a
user must read sits below WCAG AA.

| Token | Light | Contrast on `--bg` | Job |
|---|---|---|---|
| `--text-primary` (`--text`) | `#0b0b0b` | 19.6:1 | Titles, field values, active nav |
| `--text-secondary` (`--text-2`) | `#45454a` | 9.2:1 | Body, **inactive tabs**, metadata, block titles |
| `--text-muted` (`--text-3`) | `#6b6b73` | 5.6:1 | Field labels, timestamps, captions, empty values |
| `--text-disabled` | `#a5a5ab` | 2.5:1 | **Disabled controls only** |

`--text-2` / `--text-3` are the historical aliases every screen already
uses; they now point at the ladder, so the fix applied app-wide rather
than to one screen. Dark mode re-measures the same four steps against
`#1c1c1e`.

Rules:

- Never style navigation or useful data with `--text-disabled`. If it
  looks disabled it must *be* disabled.
- Inactive tabs are `--text-secondary`, not muted.
- Labels may be quiet (`--text-muted`) but never faint.

Minimum readable scale (desktop):

| Token | Value | Used for |
|---|---|---|
| `--title-size` | 28px | Record title |
| `--section-title-size` | 16px | Primary section title |
| `--block-title-size` | 12px | Uppercase DataBlock heading |
| `--field-value-size` | 14px | Field value |
| `--field-value-size-lg` | 18px | Prominent field value |
| `--field-label-size` | 11px | Uppercase field label |
| `--body-size` | 14px | Body, menu rows, comments |
| `--meta-size` | 13px | Metadata, breadcrumb, timestamps |
| `--tab-size` | 14px | Tabs |
| `--control-font-size` | 14px | Buttons, inputs, dropdowns |

10px text is not used for ERP information. 11px is reserved for
uppercase field labels.

## 20. Design tokens added for record screens

These are the non-negotiable tokens; a record screen references them
and never hardcodes an equivalent value:

```
record-grid-columns   record-grid-gap     record-section-gap   record-column-gap
record-field-gap      record-label-gap
control-h             control-h-sm        control-h-lg
control-padding-x     control-radius      control-gap          icon-size-control
text-primary          text-secondary      text-muted           text-disabled
surface-default       surface-subtle      surface-hover
border-default        border-strong
tab-height            tab-gap             subtab-height
title-size            section-title-size  block-title-size
field-label-size      field-value-size    field-value-size-lg
body-size             meta-size           tab-size             control-font-size
```

---

# Record Detail Architecture (§21–§30)

Product Detail was rebuilt from the grid upward. Everything in this
part of the document is **shared design-system law**, not a Product
Detail page style: the same primitives are what any future
single-record screen (sample record, collection record, order record)
must be assembled from.

The two rules everything else follows from:

1. **Nothing is positioned by hand.** Every block on a record is a
   span on one 12-column grid. No percentages, no per-section widths,
   no "put it where there's space".
2. **Related data reads vertically.** A user scans DOWN a column of
   related fields, not ACROSS a row of unrelated ones. Horizontal
   space is used to place *domains* side by side, never to spread one
   domain's fields apart.

## 21. Record Detail — screen shape

```
.detail-view-inner              PageContainer (§2 — width cap, page margins)
  .object-header                ONE header block, three fixed layers (§22)
    .object-breadcrumb            L1 — where am I
    .object-header-main           L2 — identity | status + completeness + actions
    .record-tabs                  L3 — record navigation (§25)
  .record-toolbar               optional contextual toolbar for the current tab
  .record-grid                  the 12-column grid (§26)
    .rg-4 / .rg-8 / …             column spans
      .data-column                a vertical reading column
        .data-block               a titled group of related fields
          .data-fields
            .data-field           LABEL over value
```

A tab's body is a `.record-grid`. A region inside it that needs its
own columns uses `.record-subgrid` (3-up by default, `.cols-2` for
two, `.equal` when the blocks carry a surface and should share a row
height).

## 22. ObjectHeader

`.object-header` — sticky, full-bleed to the page edge and re-padded by
the same amount, so its divider spans the content width while its text
still aligns exactly with the grid beneath it. Three layers, always in
this order, never more:

| Layer | Contains |
|---|---|
| L1 | `.object-breadcrumb` — one level up ("‹ SIERRA Fabric") |
| L2 | `.object-identity` (title + `.object-meta`) on the left; `.object-header-aside` (StatusControl, CompletenessIndicator, `.object-header-divider`, `.object-header-actions`) on the right |
| L3 | `.record-tabs` |

Rules:

- The metadata line does **not** repeat what the breadcrumb already
  said. `S-238 · LOT NT25-BS425`, not `S-238 · SIERRA Fabric · LOT …`.
- Every control in L2 is `--control-h` tall. A 32px button next to a
  40px one is a bug, not a style choice.
- Exactly **one** primary action (`Request Sample`), one secondary
  (`Edit`), and one `•••`. Technical Sheet, Label, Share, Duplicate and
  Archive live in the overflow menu — a permanently visible unlabeled
  square icon is not an acceptable home for a named action (§28).
- Status appears **once**, as one control (§29). Never a read-only pill
  plus a separate "change status" dropdown.
- `.detail-back-btn` is the same primitive as `.object-breadcrumb`
  under its historical name; the Sample record, Collection workspace
  and Dispatch workspace use it, so breadcrumbs stay identical.

## 23. Button hierarchy

Four variants. Every button in the app is one of them, and a screen
never writes button CSS.

| Variant | Look | Use |
|---|---|---|
| `.btn-primary` | Accent fill, white label, optional leading icon | The one main action per screen |
| `.btn-secondary` | Surface fill, visible `--border-strong`, near-black label | The default non-primary button |
| `.btn-ghost` | No border, no fill | Tertiary/contextual only, inside an already-framed surface |
| `.btn-danger` | Danger tint → solid on hover | Destructive, always behind a confirm |

`.icon-btn` is the square IconButton at `--control-h`. Icon-only is
allowed **only** for universally recognizable actions (back, close,
more, search) and always carries a `title`/`aria-label` (§28).

`.btn-sm` / `.icon-btn-sm` exist for genuinely compact secondary
surfaces (table rows, popovers, inline editors). Never mix them with
full-height controls in one action group.

Every variant has a visible hover, a visible focus ring and a distinct
disabled state, so no control needs to be hovered to look interactive
(§30).

> `.btn-ghost` used to mean "bordered secondary". It was renamed
> app-wide to `.btn-secondary` and `.btn-ghost` now means the real
> borderless ghost. Don't reintroduce the old meaning.

## 24. Control heights

**One** height for anything that can sit next to something else:

| Token | Value | Applies to |
|---|---|---|
| `--control-h` | 36px | `.btn`, `.icon-btn`, `.pd-select`, `.pd-status-select`, `.status-static`, `.completeness-control`, `.control-input`, `.comment-form input` |
| `--control-h-sm` | 32px | `.btn-sm`, `.icon-btn-sm`, `.pd-select-sm`, `.page-toolbar` controls |
| `--control-h-lg` | 40px | full-width form submits, modal footers |
| `--control-padding-x` | 14px | horizontal padding inside a control |
| `--control-radius` | 8px | control corners |
| `--control-gap` | 8px | gap between controls in one group |
| `--icon-size-control` | 16px | **the** icon size inside a control |

Never set a height on a button, select or input inside a screen. Never
mix two heights inside one toolbar or action group. Icons inside
controls are 16px — not 14, 17, 20 and 22 depending on where they came
from.

## 25. Tab architecture

| Component | Job |
|---|---|
| `.record-tabs` / `.record-tab` | Navigation between the views of ONE record. 44px tall, `--tab-gap` 28px, plain text on a shared bottom divider, 2px accent underline exactly as wide as the active tab. Lives inside the ObjectHeader. |
| `.sub-tabs` / `.sub-tab` | The same architecture one level down (Activity / Comments / Versions), 34px / 13px. |
| `.pd-tabs` / `.pd-tab` | Segmented control — a MODE switch inside a bounded box (Board/Cards/Table). **Not** navigation. |

Inactive tabs use `--text-secondary` and stay fully readable: they are
navigation, not disabled controls. No gray pills, no large rounded
backgrounds, no segmented container the width of the page around three
sub-views.

## 26. RecordGrid, DataColumn, DataBlock, DataField

```
--record-grid-columns  12
--record-grid-gap      24px   gutter between grid columns
--record-column-gap    32px   gutter between vertical data columns
--record-section-gap   28px   vertical rhythm between record sections
--record-field-gap     18px   field → field inside a column
--record-label-gap     5px    label → value
```

- `.record-grid` — 12 equal columns. Spans: `.rg-3 .rg-4 .rg-5 .rg-6
  .rg-7 .rg-8 .rg-9 .rg-12`.
- `.record-subgrid` — a nested equal-column region (3-up default,
  `.cols-2`, `.equal` for shared row heights).
- `.data-column` — a vertical stack of blocks. **The unit of reading.**
- `.data-block` (`dataBlockHtml(title, inner, {surface, aside})`) — a
  titled group. A rule under the title, not a card around the group.
  `surface:true` opts into Surface 1 where several blocks sit side by
  side and grouping must be visible at a glance (Technical).
- `.data-field` (`dataFieldHtml()`), `.data-fields` /
  `dataFieldsHtml()` — LABEL over value, stacked. `{cols:2|3}` exists
  for genuinely parallel short values and is the exception.

Field typography:

| Part | Size | Weight | Color |
|---|---|---|---|
| `.data-field-label` | `--field-label-size` 11px, uppercase, 0.06em | 700 | `--text-muted` |
| `.data-field-value` | `--field-value-size` 14px | 500 | `--text-primary` |
| `.data-field-lg` value | `--field-value-size-lg` 18px | 650 | `--text-primary` |
| `.data-block-title` | `--block-title-size` 12px, uppercase | 700 | `--text-secondary` |
| `.record-section-title` | `--section-title-size` 16px | 650 | `--text-primary` |
| `.object-title` | `--title-size` 28px | 750 | `--text-primary` |

A missing value renders as `Not specified` in `--text-muted` — never a
raw DB null, never an empty cell, never disabled-gray. Copy is a
hover-revealed enhancement on top of an always-readable value.

**Uppercase** is only for `.data-block-title` and `.data-field-label`.
Never for navigation, never for long labels. Hierarchy comes from
weight, alignment and grouping — not from making things tiny, gray and
uppercase.

## 27. Surface hierarchy

| Token | Role |
|---|---|
| `--surface-default` | Surface 0 — page/card ground |
| `--surface-subtle` | Surface 1 — a grouped information block (`.data-block-surface`), a compact empty state |
| `--surface-hover` | Surface 2 — hover, selected, contextual emphasis |
| `--border-default` | hairline separators |
| `--border-strong` | **control** borders — must be visible without hovering |

Separation on a record comes from a deliberate mix of 1px separators,
Surface 1 blocks, column alignment, typography and spacing. Whitespace
alone is not structure. Neither is a border box around every field.

## 28. Icon rules

Icons aid recognition, not decoration. One size inside controls:
`--icon-size-control` (16px). Every icon-only control needs a
`title`/`aria-label`. An action with a name the user must read
(Technical Sheet, Label, Share) is either a labeled button with a
leading icon or a row in the `•••` menu — never a bare square.

## 29. StatusControl & CompletenessIndicator

- **StatusControl** — `.pd-status-select` wrapping `pdSelect()`: dot +
  label + chevron in one `--control-h` control, tinted by the
  lifecycle color. Read-only users get `.status-static`: identical
  footprint, no chevron, so the header keeps its rhythm and nothing
  pretends to be clickable. Status is represented **once**.
- **CompletenessIndicator** — `.completeness-control` +
  `completenessChipHtml()`: a control (border, hover, control height),
  because it opens a popover listing the missing fields and a
  "Complete product" action. A clickable chip must not look like a
  static one.

## 30. Affordance rules

- Primary and secondary actions look actionable **before** hover.
- Dropdown triggers always show a chevron.
- Tabs look like navigation without hover.
- Values are readable without hover; only enhancements (copy, delete,
  reorder) may be hover-revealed.
- Operational actions (Adjust inventory, Add document, Link product)
  are visible buttons in their block header or context rail, not
  affordances discovered by hovering a section.
- Loading and empty states use `.pd-loading` and `emptyStateHtml()` —
  readable neutral text and a compact bordered block sized to its
  section. An empty section is allowed to be small; the page is not
  obliged to fill the viewport.

## 31. Per-tab composition (Product Detail as the reference)

| Tab | Composition |
|---|---|
| Overview | `.rg-4` media column (ProductGallery + Sample availability summary) + `.rg-8` `.record-subgrid` of three domain columns: **Product** / **Physical** / **Color & Production**. Fits the first desktop viewport. |
| Technical | One `.record-subgrid.equal` of surfaced blocks per engineering domain: Construction, Material, Physical, Dyeing & Finishing, Commercial, Identification (+ Notes/Tags at `.rg-6`). |
| Samples & Inventory | `.rg-8` operational area (inventory DataTable, movement timeline, sample request DataTable) + `.rg-4` rail (Availability summary, formats, **Adjust inventory**, Related products). |
| Documents | `.record-table-hdr` + `.erp-table` with Document / Type / Source / Updated / Owner / Actions. Two documents means a two-row table. |
| Activity | `.sub-tabs` → Activity (`.record-toolbar` search + event filter, then `.timeline`), Comments (`.comment-list` + composer), Versions. |

**ActivityTimeline** (`.timeline`): a rail with one dot per event; the
event title, then actor and timestamp directly beneath it. The
timestamp belongs to the event and never floats to the far right of a
1400px row. Change chips (`.tl-change`) hug their content.

**CommentsPanel**: avatar · author · time · message, capped at a
readable 720px, with an avatar + input + **Send** composer. Deliberately
not the audit-row shape used by the timeline.

## 32. Anti-patterns removed (do not reintroduce)

- Tiny low-contrast labels; `--text-3` as a 2.3:1 whisper.
- Inactive navigation styled to look disabled.
- Mixed button heights inside one action group.
- Unexplained square icon buttons between labeled actions.
- Unrelated fields spread horizontally across the viewport.
- A giant segmented control for three sub-views.
- Duplicated status UI (pill + separate change-status dropdown).
- Full-width sections holding two lines of content.
- Per-screen spacing, widths and button CSS.
- Interaction discoverable only on hover.
- Decorative whitespace standing in for structural grouping.

---

# Document & Label Editors (§33–§40)

Product Detail's Label Builder is the reference implementation. Anything
that edits a document destined for paper — a label, a technical sheet, a
shipping guide — is built from the pieces below, not from a bespoke
modal.

The governing distinction: **the editor is an app surface, the document
is print stock.** They use different design systems and must never share
one. An editor in dark mode still previews a white label.

## 33. Editor shell

`.lbl-dr` — a centred workspace dialog, three regions:

| Region | Contains |
|---|---|
| `.lbl-dr-hdr` | Document type + record name, save-state chip, validation chip, then `Save` / `PDF` / `Print` and close. One `--control-h` across every control. |
| `.lbl-dr-editor` | 400px editor rail: `.sub-tabs` (Content / Layout / Codes / Print) over a scrolling body. |
| `.lbl-dr-preview` | `.lbl-pv-bar` (sheet dimensions + zoom) over `.lbl-pv-stage` → `.lbl-dr-paper` → the document. |

The rail is 400px because the form inside it must hold a 14px input plus
a label, a source badge and a visibility toggle on one line without
wrapping. Do not narrow it below 360px.

## 34. Editor form density

- `.lbl-acc` — accordion section. Identity / Material / Physical open by
  default; open state is remembered for the editing session.
- `.lbl-fld` — one field: name, source badge, reset, visibility toggle,
  then the input. Rows share one grid; **a field never gets its own
  card**.
- `.lbl-fld-pair` — two-up for short parallel values (Width/GSM,
  DIA/Gauge). The source badge is suppressed here so the field name is
  never truncated.
- `.lbl-vis` — the VisibilityToggle: a real switch with `aria-pressed`,
  never a bare checkbox floated to the right of a card.
- Type: section heading 14px/650, field label 13px/650, input 14px,
  helper 12px. Nothing in an editor is 10px.

## 35. Field source model

A label field knows where its value comes from; it does not own a copy
of it.

```
LABEL_FIELDS[key] = { label, section, read(product), long?, required? }
LabelConfig       = { template, overrides{}, hidden[], order[], qr{}, barcode{} }
```

`read()` pulls from the product record. `overrides[key]` exists **only**
where a user deliberately typed something else. Resolution is one
function (`lbValue`), used by both the editor and the renderer.

Three consequences, all required:

1. Editing a label never writes to product master data. The save payload
   is `{ specs: { …existing, label_config } }` — no master column is in
   it.
2. A later correction to the product record flows into every label that
   has not explicitly overridden that field.
3. Typing the product's own value back **removes** the override rather
   than freezing a duplicate.

The editor shows which is in play (`Product data` / `Label override`)
and offers a per-field reset.

## 36. Live preview

One renderer produces both the preview and the printed sheet from the
same config; the only differences are passed in:

```
renderLabel(product, config, { interactive })  // preview
renderLabel(product, config, { assets })       // print
```

Every mutation re-renders immediately — there is no Preview button and
nothing needs saving first. Typing does not re-render the editor row
(focus and caret would be lost); only the source badge is synced.

**Preview → editor**: every value on the document carries
`data-lf="<field>"` and a `.lbl-region` hit area. Clicking it selects the
field, opens its accordion section, scrolls the row into view and
focuses the input. This is the single most useful affordance in the
builder — a new user learns the whole editor by clicking the document.

## 37. Print-safe layout

- Document geometry is **millimetres**, never pixels or rem. The preview
  changes only its CSS `transform`; zoom (Fit / 100 / 125 / 150) never
  touches the document's metrics.
- The `@page` size is written from the *measured* sheet at print time, so
  preview and paper are the same size. On continuous media the sheet is
  cut to content; a format's `maxHeightMm` is the practical handling
  limit, not a printer limit.
- Never invent printer geometry. 62mm is the QL-800's real media width;
  formats differ in what they carry, not in what medium they claim.
- Machine-readable zones get fixed boxes (the barcode is a 12mm band with
  `preserveAspectRatio="none"`). Deriving their height from the
  generator's intrinsic ratio makes the document's height depend on the
  payload, which silently changes the sheet.
- Print CSS collapses the ink ramp to solid black (thermal printing is
  1-bit) and strips every preview affordance.

## 38. Machine-readable codes

`QRConfigurator` / `BarcodeConfigurator` live in the **Codes** tab:

| Control | Rule |
|---|---|
| QR enabled + destination | Product record (default) or a custom URL. A custom URL must be a full `https://` address — a malformed destination is unrecoverable once printed. |
| Barcode enabled + encoded field | Chosen from the fields the stack can actually encode (Mill article / Lot / Product ID). Symbology is stated, not invented: only what the bundled encoder supports is offered. |

The editor always shows the exact payload that will be encoded.

## 39. Validation

`.lbl-issues` — two severities, one rule:

- **error** blocks printing. Missing required field, barcode with no
  data, unsupported characters for the symbology, invalid QR
  destination.
- **warn** does not. Content past the format's practical length, which
  will be scaled down.

Every issue carries an actionable fix where one exists ("Hide Yarn 01",
"Use the compact format") — never a bare complaint. Overflow is measured
from the rendered DOM, not guessed from string lengths, because the
document reflows.

The header's validation chip is the always-visible summary and is a
button: it takes you to the Print tab where the issues live.

## 40. Templates, permissions, audit

- **Templates** define fields, section order, geometry and default
  visibility. Product data fills them. A new division gets a template
  entry, not a new screen.
- **Permissions**: editing overrides and layout requires write on the
  product's division; printing does not. UI hiding is not authorization
  — the save is an `update` on `products`, governed by RLS.
- **Audit**: log committed actions only — config saved (with a
  field-level diff of overrides), label printed, PDF downloaded, builder
  opened. Never log a keystroke.

## 41. Label design acceptance

A SIERRA label is not acceptable if the brand hierarchy is weak, the QR
or barcode dominates, long yarn values overflow, technical values shrink
below the readable floor (1.8mm), sections are boxed rather than
separated by hairlines, or safe margins are inconsistent. The print type
ramp is fixed: title 6.2mm, values 2.9mm, metadata 2.4mm, keys 1.8mm.

---

# Color System & Semantic Color Rules (§42–§48)

## 42. Core principle

INDEX distinguishes two color systems and never mixes them:

- **UI / interaction color** — communicates how the application works.
  This is brand teal, always: `--accent` / `--accent-light` /
  `--accent-dark` (`#16cdbe` / `#cffffb` / `#007d73`).
- **Semantic / identification color** — communicates what information
  represents (a division, a status, a category, a tag, an avatar). This
  is the secondary palette (§44).

`--accent` is a **fixed** value app-wide. It is never reassigned per
division or module — see `applyDivisionAccent()` in `index.html`, which
sets `--div-color*` (small identity markers) and deliberately does not
touch `--accent`. A purple SIERRA Fiber folder gets a purple dot; opening
it never repaints the surrounding buttons/tabs/nav purple.

## 43. Neutral UI

`--bg #ffffff · --bg-alt #f5f5f5 · --surface #ffffff · --surface2 #f5f5f5
· --border #e5e5e5 · --text-primary #0b0b0b · --text-secondary #444444 ·
--text-muted #6b6b73 · --text-disabled #a4a4a4` (re-measured for dark
mode, see `:root`/`[data-theme="dark"]`). Neutrals build ~80–90% of the
visible interface: backgrounds, sidebars, table surfaces, dividers,
borders, typography, disabled state, standard icons, input/dropdown/modal
surfaces. Color reads as meaningful precisely because it isn't
everywhere.

## 44. Secondary semantic palette

Seven families, each with three sanctioned levels — light (subtle
bg/chip), base (identifier/icon/accent), dark (accessible text over the
light bg). Backed by CSS custom properties `--sem-<name>-light` /
`--sem-<name>` / `--sem-<name>-dark` in `index.html`'s `:root`. Do not
improvise a fourth shade.

| Family | Light | Base | Dark |
|---|---|---|---|
| Yellow / Olive | `#efefaf` | `#c4c412` | `#827e00` |
| Green | `#d1ffbe` | `#3ed600` | `#2a9200` |
| Blue | `#c5e9ff` | `#009fff` | `#004a86` |
| Purple | `#f6d8ff` | `#9e00cb` | `#670084` |
| Warm Yellow | `#fff0af` | `#ffc529` | `#bb9800` |
| Orange | `#ffe3d2` | `#ff7824` | `#cd4f00` |
| Red | `#ffc7c7` | `#e80000` | `#b40b0b` |

Dark-mode text uses a lightened per-family variant (`--sem-<name>-dark-text`,
`--success`/`--warning-text`/`--danger`/`--info` follow the same pattern)
so nothing drops below AA against `#1c1c1e` — same hue family, never a
new one.

**Allowed**: identifying a division, module, folder, board, saved view,
group, category, status value, tag, label, or generated avatar — as a
dot, icon, thin side border, chip, or status cell. **Forbidden**: primary/
standard buttons, links, tabs, checkboxes/radio/switches, dropdown
interaction, input focus, nav selection, hover states, loaders, search,
generic icons, CRUD actions, pagination, modal actions, drawers, active
controls. Those are teal + neutral only, no exceptions.

## 45. Status system → secondary palette mapping

`--success/--success-bg` (green), `--warning-text/--warning-bg` (warm
yellow), `--danger/--danger-bg` (red), `--info/--info-bg` (blue) are the
single source for every status badge/pill/dot in the app (`.badge-*`,
`.smp-*`, HR status badges, badge-readiness, inventory availability) —
never a bespoke hex duplicating one of these hues. Never map a status
onto brand teal; that would blur "this is a status" with "this is
interactive." `.smp-badge`'s 11 sample-lifecycle statuses extend the same
four families (plus purple for the one-off `picked_up` hand-off step) —
see the `.smp-*` rules in `index.html` for the full mapping.

## 46. Division / module identity

`DIV_ACCENT` in `index.html` is the single source of truth for each
division's identity color (also mirrored into `DIV_CLR` for inline dot/
badge use): Fiber → Purple, Yarn → Blue, Fabric → Green, Chemicals →
Red, Apparel/Garment → Orange. If a division is purple in the sidebar
switcher dot, it is purple everywhere it's referenced as a folder,
category, board identifier or contextual chip — never recolored per
screen. `applyDivisionAccent(d)` sets only `--div-color`/`--div-color-dark`/
`--div-color-light`/`--div-color-rgb` (small markers); it must never be
extended to set `--accent`.

The public division landing pages (`fiber.html`, `yarn.html`,
`fabric.html`, `chemicals.html`, `apparel.html`, `home.html`) each define
their own `--accent` in `:root` — as of this pass all six are fixed to
`#16cdbe`, not the page's division hue. A division marketing page may
still say "SIERRA Fiber" and show purple identity swatches, but its
buttons/links/CTAs are teal like the rest of INDEX.

## 47. Avatars

`AVATAR_PALETTE` in `index.html` is 21 hex values — the seven secondary
families × three levels, brand teal deliberately excluded (teal is
reserved for interaction, never identity). `avatarColor(seed)` hashes a
user's persistent id to a deterministic palette index — same person,
same color, every render, every session. `avatarTextColor()` flips
black/white text for contrast per swatch.

## 48. Consistency audit (this pass)

Replaced with tokens: the four parallel hardcoded status-color systems
that had drifted apart (`.badge-*`, `.smp-*`, HR `.badge-active` family,
inventory-availability object using iOS `#34c759`/`#e0442e`/`#ff9f0a`
instead of `--success`/`--danger`/`--warning`), a nav hover/active state
that tinted icons with a per-tool secondary color instead of teal
(`.nav-item:hover .n-icon`/`.nav-item.active .n-icon` — a real forbidden-
hover violation, now `var(--accent)` unconditionally), an
`.import-upload-zone:hover`/`.site-switcher-item.active` pair painted
warm yellow instead of teal, and two divergent division-color registries
(`DIV_CLR` vs `DIV_ACCENT` used to disagree on Fiber/Yarn/Fabric/
Chemicals hex values — now one source). `applyDivisionAccent()` no longer
mutates `--accent`/`--accent-dark`/`--accent-light` — that was the
central violation of "teal = interaction," since it meant every button,
tab and focus ring in the app changed color when switching divisions.
Not yet swept: chart/RSS-feed per-item swatches in the Dashboard/Insights
market ticker (already match the sanctioned secondary hex values, low
risk) and the `--up`/`--down` finance tokens on the six standalone pages
(`#1a8a5c`/`#c0392b`-family, not yet remapped onto `--sem-green-dark`/
`--sem-red-dark` — flagged as future work, not a live violation since
they're already a consistent green/red pair app-wide).
