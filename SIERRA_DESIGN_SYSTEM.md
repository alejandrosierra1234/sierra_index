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

Superseded by the full **Status System** in §41 — five distinct
component families (StatusBadge / LifecyclePill / RoleTag /
ReadinessBadge / CategoryTag), not one generic tiny pill. `.smp-badge`
+ `.smp-<status>` is still the canonical StatusBadge for sample/
collection workflow status, backed by the `--success`/`--warning`/
`--danger`/`--info` tokens, and every workflow status still renders
through `smpBadge(status)` — but it now returns an icon + label at the
larger §41 anatomy, not a bare colored span. Don't build a bespoke
colored `<span>` for a new status; add it to `SMP_STATUS_LABEL` +
`SMP_STATUS_ICON` + `.smp-<status>` instead. Read §41 before touching
any status/role/readiness/category component.

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

## 49. SectionTabs vs. ViewTabs — two different hierarchy levels

`.pd-tabs-inline` (§ "ViewTabs, inline variant") and the new
`.section-tabs`/`.section-tab` are not interchangeable, even though both
render a horizontal row of buttons:

- **`.section-tabs`** — primary in-page navigation between the top-level
  views of a module (Talento Humano: Colaboradores / Cola de gafetes /
  Historial / Empresas / Configuración, via `renderBadgeTabs()`). This is
  "where am I in the module." Underline style: transparent background,
  neutral text, active tab gets `var(--accent-dark)` text + a 2px
  `var(--accent)` underline. Never a filled pill — that visual weight
  belongs one level up, to primary actions.
- **`.pd-tabs-inline`** — a view switcher (Table|Cards, Board/Cards/Table/
  Stats) or a filter-chip strip (Catalog saved views). This is "which
  representation/subset of the same data am I looking at," a secondary,
  reversible choice — not navigation. Its active state is neutral
  (`var(--surface)` + border + soft shadow, no teal fill), matching the
  base `.pd-tabs`/`.pd-tab` segmented control it's a variant of.

Both existed as one component before this pass, so every consumer — top
nav, view switch, filter chips — rendered as an identical teal pill.
Adding `.section-tabs` and neutralizing `.pd-tabs-inline .pd-tab.active`
fixes that without touching the base `.pd-tabs`/`.pd-tab` segmented
control, which was already neutral. When building a new module's
top-level nav, use `.section-tabs`; never repurpose `.pd-tabs-inline` for
that job again.

## 50. Table cell wrapping default

`.erp-table`/`.dq-table`/`.pick-table` `<td>` now default to
`white-space:nowrap` — a value never wraps onto multiple lines by
accident just because a column is narrow. Combined with
`.erp-table-wrap`'s `overflow:auto`, a table with a long, un-truncated
value scrolls horizontally rather than growing every row's height.
Columns that should truncate with an ellipsis instead (name, code,
position, department — anything identity-like) use `.emp-td-trunc` /
`.td-trunc` (`max-width:1px` + `overflow:hidden` + `text-overflow:
ellipsis`; put the full value in a `title` attribute for hover). A column
that must genuinely wrap (long-form notes, addresses) opts back in with
`.td-wrap`. Default nowrap, explicit opt-in to either truncate or wrap —
never the reverse.

## 51. Filter chips and applied-filter pills are neutral, not teal

`.emp-filter-chip` (an applied filter value, e.g. "Departamento: Ventas
✕") used to fill with `var(--accent-light)` unconditionally — this made
"a filter is applied" look identical to "this row/option is selected,"
collapsing two different signals into one color. It's now neutral
(`var(--surface2)` background, `var(--text-primary)` text, `var(--r-sm)`
radius, not pill) like every other secondary control in §8. Teal stays
reserved for the components in §44/§2 that genuinely mean "you are here"
or "this is the primary action" — an applied filter chip is neither.

---

# Sidebar Navigation Tree (§52–§54)

> **DEPRECATED — superseded by §61 "Sidebar Rearchitecture."** §52-56
> describe the single flat `_navExpanded` tree that rendered every
> accessible module simultaneously. That model is no longer in
> `index.html`; do not reintroduce `_navExpanded`/`navToggleExpand()`/
> `navToggleModule()`/`navModuleRowHtml()`. Kept below for history only.

## 52. Persistent tree, not a popover

The sidebar's module/division navigation (`.mod-switch`/`.bu-switch`) has
been replaced with a persistent, always-in-the-DOM tree —
`renderSidebarTree()` in `index.html`, rendered into `#nav-tree`. Every
accessible module, and Muestras' every authorized division, renders every
time; there is nothing to "open" to see what's reachable. Expand/collapse
is a small `Set` (`_navExpanded`), persisted to `localStorage`
(`sierra_nav_expanded`) so it survives reload — not a dropdown that has to
be reopened after every navigation.

```
Dashboard                          ← static, outside the tree
Favoritos                          ← header + empty state only (§ Favorites, not built yet)
Módulos
  ▾ Muestras
      ▾ SIERRA Fiber
          Catálogo
          Cola de despacho          (canDispatchDiv(d))
          Inventario                (hasWarehouseAccess(d))
      ▸ SIERRA Yarn / Fabric / Chemicals / Apparel
      Sample Center                 (can('read','customer_service'))
      Collections                   (same gate, carries the cart badge)
      Insights                      (insightsSections().length)
  ▾ Talento Humano
      Gafetes
  ▾ Index
      Equipo y Permisos             (can('admin','platform'))
      Access Logs                   (same gate)
      Style Guide
```

Three render functions, one job each:
- `navModuleRowHtml(key, m)` — a module row + its children. `samples` is
  special-cased (divisions + the three cross-division leaves); every
  other module iterates `m.tools`, filtered by an optional
  `t.visible()` predicate (used by Team/Access Logs to gate on
  `can('admin','platform')` — Style Guide has none, always visible once
  the module itself is accessible).
- `navDivisionRowHtml(d)` — one division's Catálogo/Cola de
  despacho/Inventario, gated by `canDispatchDiv(d)`/`hasWarehouseAccess(d)`
  exactly like the old fixed nav-items were.
- `navLeafHtml(key, id, label, icon, depthClass, fnExpr, extraAttrs)` — a
  single destination. `NAV_LEAF_TX` bakes the existing partial EN/ES
  overlay (`tx('nav.sampleCenter')` etc.) directly into the leaf's label
  at render time, so a language switch doesn't get reverted by the next
  navigation's re-render (the old `applyLanguage()` `setText()` calls
  against fixed IDs are gone — it just calls `renderSidebarTree()` now).

**`navGo(key, fn)`** is the one entry point every leaf's `onclick` calls:
records `_navLeaf = key`, runs the real navigation function, re-renders.
`renderSidebarTree()` itself expands the ancestor chain of `_navLeaf` on
every render, so both a tree click and a direct/deep-link call to a
`show*()` function (which each set `_navLeaf` as their first statement —
see `setDiv()`, `showGafetes()`, `showDashboard()`, etc.) land on a
correctly expanded, correctly highlighted tree.

## 53. Integration: aliases, not a rewrite of every call site

`renderModuleSwitcher()`, `renderBuSwitcher()`,
`renderSamplesFulfillmentNav()` and `renderSamplesCommercialNav()` are
kept as **thin aliases to `renderSidebarTree()`** — the ~15 existing call
sites across `setDiv()`, `showDispatchQueue()`, `showWarehouseInventory()`,
`enterApp()`, `setDefaultModule()` etc. needed no changes. All four used
to do different partial DOM updates (toggle a `.mod-scope` div, rebuild
one popover, show/hide two fixed nav-items); now they all just re-render
the one tree, which reads current state (`division`, `activeModule`,
`can()`, `sampleCart`) fresh on every call. `applyModuleScope()` and the
`.mod-scope` wrapper divs are gone entirely — the tree shows every
accessible module simultaneously instead of switching between single-
module "scopes."

## 54. Active state, never a filled pill

Module and division rows are structure — clicking one only toggles
`_navExpanded`, it never "goes" anywhere. Only a leaf can be active, and
active means the same neutral-bordered `.nav-item.active` treatment used
everywhere else in the app (`background:none; border-color:var(--border);
font-weight:600`), with the icon color switching to `var(--accent)` — no
filled background, no pill. This is the direct fix for the reported
"cyan pill" collapse of hierarchy levels (§48–§51): navigation now reads
as navigation at every depth, not a stack of identically-styled buttons.

**Collapsed sidebar**: `.nav-tree-children` and `.nav-tree-chevron` are
both `display:none` under `.sidebar.collapsed`, so the rail shows only
the top-level module icons — square, 40px, same as Dashboard/Website
below them, never a partial or misaligned tree. `navToggleModule(key)`
calls `toggleSidebar()` first if the sidebar is collapsed, then expands
that module — a collapsed-rail click always does something useful
instead of requiring the user to expand the sidebar manually first.

## 55. ERP density pass

Tightened, not cramped — the base-4 spacing scale (§5) is unchanged, only
the *values assigned to it* moved down one notch on the surfaces that had
the most dead air:

| Token/rule | Was | Now |
|---|---|---|
| `--page-padding-y` | 1.75rem | 1.25rem |
| `--section-gap` | 24px (`--sp-5`) | 20px |
| `--panel-gap` | 16px (`--sp-4`) | 14px |
| `.content-hdr` margin-bottom | 1.5rem | 1.1rem |
| `.modal-hdr`/`.modal-body`/`.modal-ftr` padding | 1.25/1.1/1rem × 1.4rem | 1/0.95/0.85rem × 1.25rem |
| `.sd-hdr`/`.sd-body` padding (Drawer) | 1.1rem × 1.3rem | 0.9–0.95rem × 1.15rem |
| `.erp-table th` padding | 0.55rem 0.7rem | 0.45rem 0.7rem |
| `.erp-table td` padding | 0.5rem 0.7rem | 0.42rem 0.7rem |
| `.pop-menu-item`/`.ws-menu-item`/`.card-more-item` min-height | 34px | 32px |
| `.s-label` (sidebar section label) padding | 0.7rem top | 0.55rem top |

`--control-h` (40px control height) was deliberately left untouched —
it's load-bearing for alignment across every button/input/select in the
app, and re-tuning it needs its own pass with broader visual verification
than this one covered, not a drive-by shrink alongside the sidebar
rewrite.

## 56. Pill/rounded-rectangle audit

Confirmed the dominant pill-overuse pattern was `.pd-tabs-inline`'s
filled-teal active state serving three different jobs at once (§49) —
fixed there. Spot-audited the remaining `border-radius:var(--r-pill)`/
`999px` usages app-wide: all are legitimate per §16 (status badges,
count chips like `.queue-count`/`.ws-cat-count`, avatars, the one real
toggle switch, `.emp-filter-chip` already fixed to `--r-sm` in §51). No
further large-scale offender found. A full line-by-line pass over every
`.panel`/`.card` container in the app for "boxed instead of separated by
spacing" was not attempted in this pass — flagged as future work if a
specific screen is found to still lean on containment instead of
hierarchy.

## 57. Favorites (built, not a placeholder)

Favorites were previously a static "Sin favoritos aún" label with no
functionality (§ "Sidebar Navigation Tree" originally shipped the
Favoritos header with an empty state only). They're now real, per the
ERP-interface-architecture brief's §22: **a favorite is a navigation
shortcut** — small entity icon + screen name — never louder than a
Module row, never a second hierarchy.

- `_navFavorites` — a `Set` of favorited leaf keys, persisted to
  `localStorage` (`sierra_nav_favorites`).
- `_navAllLeaves` — rebuilt on every `renderSidebarTree()` pass as
  `navLeafHtml()` runs across the tree; this is the live, permission-
  filtered catalog of every leaf the current user can actually reach
  right now (Catálogo/Cola de despacho/Inventario per division,
  Solicitudes, Colecciones, Insights, and every module tool). A
  favorite for a leaf the user has since lost access to (division
  reassigned, role changed) silently drops out of the rendered list
  instead of dangling — the Favoritos section is always derived from
  current permissions, never a frozen snapshot.
- `.nav-fav-btn` — the star toggle riding inside a favoritable leaf
  row (`navToggleFavorite()`), trailing after the label, same slot
  `.cart-nav-count` uses. Hidden until hover/focus/favorited so it
  never competes with the row's icon+label identity; filled teal when
  favorited, matching the existing accent-for-"you are here" convention
  `.nav-item.active`'s icon already uses — no new color meaning
  introduced.
- `renderNavFavorites()` fills `#nav-fav-list` by intersecting
  `_navAllLeaves` with `_navFavorites`, reusing `navLeafHtml()` itself
  (`{ collect:false }` so the favorites section doesn't re-register its
  own rows as tree leaves) — the favorites row is the *same component*
  as a tree leaf, not a parallel one.
- Module and division rows (`navModuleRowHtml`/`navDivisionRowHtml`)
  are structural, not favoritable — consistent with §54, only a leaf
  can be "current," and only a leaf can be a shortcut to it.

## 58. Access Logs — migrated onto the ERP table system

`showAccessLogs()` was the one list screen still on the legacy
`.data-table` class with hardcoded English copy (`Loading…`, `Date /
Time`, `No access records yet.`) sitting next to an all-Spanish rest of
the app — a direct instance of the §26 "don't mix languages on the same
interface" violation, and a `.data-table` holdout from before `.erp-table`
(§7) became the one table primitive. Migrated: `.erp-table-wrap`/
`.erp-table` markup, Spanish column headers and states, `emptyStateHtml()`
for both the "table not provisioned" and "no records" cases instead of a
hand-rolled `<div class="empty">`, and `.td-trunc` on the identity/org
columns per §50 (default nowrap, explicit truncate — a long user-agent
org string no longer pushes the row's height). Unescaped `${r.email}`/
`${r.city}`/`${r.org}` interpolations (external, DB-sourced strings
rendered without `esc()`) were also closed here — the same fields are
already escaped correctly everywhere else login/geo data is displayed
elsewhere in the app.

## 59. `--up`/`--down` finance tokens now match the semantic palette

The six standalone marketing/division pages (`home.html`, `fiber.html`,
`yarn.html`, `fabric.html`, `chemicals.html`, `apparel.html`) defined
`--up:#1a8a5c`/`--down:#c0392b` — a plausible-looking but *unregistered*
green/red pair, not one of the sanctioned `--sem-green-dark`/
`--sem-red-dark` hex values used everywhere status/positive/negative
color appears inside `index.html` (§44/§45). Flagged as low-risk future
work in §48; now closed — all six pages use `--up:#2a9200`/
`--down:#b40b0b`, i.e. `--sem-green-dark`/`--sem-red-dark` verbatim. The
six pages remain intentionally separate stylesheets (§46 — each defines
its own `:root`, not a shared file), so this was a value-for-value sync,
not a refactor to a shared token source; if a shared stylesheet is ever
extracted for these pages, pull `--up`/`--down` from the same registry
`index.html` uses instead of re-hardcoding the pair a third time.

## 60. Fresh module-by-module audit (§39) — findings and fixes

Ran a systematic pass over every top-level screen (`show*()`/list-screen
entry point) not already covered by §17's audit history, checking each
against header/toolbar/tabs/table/radius/color/spacing/empty-state/
language rules. Full inventory: 20 screens total, 12 already audited
(Catalog, Product Detail, Dispatch Queue/workspace, Sample record,
Collection workspace, Warehouse Inventory, Insights, Access Logs, plus
Gafetes — a clean `.section-tabs` reference implementation). This pass
covers the remaining 8.

**Dashboard (`showDashboard()`)** — the app's landing screen, was
entirely in English while the rest of the ERP shell is Spanish: greeting
copy, `en-US` date/time locale (dashboard notif timestamps too), search
placeholder, every section label (World Time/Notifications/Pending
Samples/Continue Working/Actions/Market), action-button labels, loading
states, and the market-detail "no live price" copy. All translated to
Spanish; `en-US`/`es-MX` locale calls unified. One inline
`border-radius:10px` (market detail icon) replaced with `var(--r-md)`
(10px is exactly `--r-md`, not a new token).

**Module Hub / Module Tools (`showModuleHub()`/`showModuleTools()`)** —
`MODULES.samples.color` was `#16cdbe`, brand teal, used as the Muestras
tile's *identity* color — a direct §42/§44 violation ("teal is reserved
for interaction, never identity"), while `talento_humano` (`#ffc529`,
Warm Yellow) and `administracion` (`#444444`, neutral) already followed
the rule correctly. Reassigned Muestras to the unclaimed Yellow/Olive
secondary family (`#c4c412`) — divisions inside Muestras already carry
their own DIV_ACCENT identity, so the module tile itself just needed a
non-interactive, non-conflicting hue. Also fixed: two inline
`border-radius:12px` tile literals → `var(--r-lg)` (12px is exactly
`--r-lg`), and the hand-rolled no-access `<div class="empty">` → 
`emptyStateHtml()`.

**A second, independently-drifted division-color registry** — found
while touching Module Hub, not part of the original audit list:
`SPOT_DIVS` (Spotlight search's per-division filter chips) hardcoded its
own hex values instead of reading `DIV_ACCENT` (§46's declared "single
source of truth"), and had drifted badly: Yarn/Fabric were swapped
(Yarn showed Fabric's green, Fabric showed Yarn's blue), Chemicals was
tinted Apparel's orange, and Apparel was tinted brand teal (`#16cdbe`) —
the same forbidden teal-as-identity pattern as the Module Hub finding
above, independently introduced in a second registry. `SPOT_DIVS` now
derives its `color` from `DIV_ACCENT[key]`
at load time instead of carrying a parallel literal, closing the drift
permanently rather than re-syncing the values by hand a second time —
the same lesson §46 already drew from the old `DIV_CLR`/`DIV_ACCENT`
duplication.

**Team (`showUserManagement()`)** — explicitly flagged "not yet audited"
in §17. The "Crear cuenta" primary action was hand-rolled inside `#pg`
behind an inline `justify-content:flex-end` wrapper instead of living in
`#product-controls` (§9 — creation actions belong top-right of the
PageHeader, matching every other list screen); moved. Two hardcoded
English fallback strings ("Loading…", "No users yet.") that bypassed the
screen's own `tx()` scaffolding were translated directly (Spanish is the
literal default here, not routed through `tx()`, since the rest of the
screen already resolves through it and these were just missed).

**Sample Center (`showSampleCenter()`)** — was the one Muestras-family
screen never brought over to Spanish, sitting next to Spanish siblings
(Sample record, Collection workspace, Dispatch): title/subtitle, loading/
error/empty-state copy, section labels ("Collections"/"Individual
Samples"), filter-chip labels ("All divisions (N)"/"All (N)"), row copy
("Pickup"/"Urgent"), and `en-US` row-date locale (Collections Hub already
correctly used a Spanish locale for the same kind of row — now `es-MX`
here too, matching). All translated.

**Filter-tab redundancy (Sample Center + Collections Hub)** —
`filterSampleRows()`/`filterSampleDivision()`/`colhSetTab()`'s trigger
buttons already carry `.div-toolbar-btn.active`, which the CSS itself
renders as the correct neutral bordered-surface active state — but the
JS also manually toggled `btn.style.background`/`btn.style.color` to the
exact same values on every filter change, and the initial server-rendered
markup baked the same inline style onto the default-active button. Purely
redundant, not a color violation (the class alone already produces the
right look), but exactly the kind of duplicated-logic drift that made two
screens diverge instead of sharing one behavior. Removed the inline style
mutation from both filter functions and both markup call sites — the
`.active` class is now the only thing driving the visual state, in both
screens, matching how every other `.pd-tabs-inline`/`.div-toolbar-btn`
consumer in the app already works.

**Collections Hub (`showCollectionsHub()`)** — two stray English
toast/error strings in `cloneCollectionToDraft()` ("Could not start from
this collection…", "New draft … started — edit it freely before
submitting") next to a sibling function (`startBlankDraft()`) that
already toasts in Spanish. Translated.

**Account menu (`renderAcctMenu()`)** — shared chrome opened from every
screen's sidebar identity, was hardcoded English (My profile/
Notifications/Appearance/Dark·Light/Team/Access logs/Help/Log out) inside
an otherwise Spanish shell. Translated; "Team"/"Access logs" now read
"Equipo y Permisos"/"Registro de accesos", matching the labels used
everywhere else those destinations are named (`MODULES.administracion`,
the sidebar tree). Access Logs' own screen title (`showAccessLogs()`) was
also still literally "Access Logs" in English from §58's pass — that pass
translated the table/body but missed the header text; now "Registro de
accesos" throughout.

**Not fixed in this pass, left as-is deliberately**: Sample Center's
hand-rolled `<div class="empty">` blocks (already Spanish, already using
the shared `.empty` class — converting to `emptyStateHtml()` is cosmetic
polish, not a correctness fix, and risked visual regression on
content/icon combinations `emptyStateHtml()` wasn't built for); a full
mechanical sweep of every remaining inline `border-radius:Npx` literal
app-wide (the codebase uses hardcoded 8px/10px radius values extremely
pervasively — hundreds of call sites predating the token scale — and a
blind mass-replace was judged too large a blast radius for this pass;
only the literals inside screens this pass was already editing, and that
matched a token value exactly, were converted). Both flagged as future
work, not silently assumed done.

---

# Status System (§41)

This pass replaced the single tiny `.badge`/`.smp-badge` pill that every
status, lifecycle, role, readiness and category value rendered through.
Monday.com was used as a reference for **scale, hit area, iconography,
spacing and control confidence only** — not for visual style. SIERRA's
existing semantic color logic (`--success`/`--warning`/`--danger`/
`--info`, the `sem-*` hue tokens) is unchanged; what changed is
component anatomy: bigger, icon-supported, less pill-heavy, and split
into distinct families so different kinds of information stop looking
identical.

## 41.1 Why one generic badge was wrong

`Pending`, `Approved`, `Shipped`, `Active` and `Viewer` used to render
through the same 20–24px, fully-rounded, color-only pill. A workflow
status, a long-running lifecycle state, a permission role and a
data-completeness warning are different *kinds* of information — they
must look different so a user can tell which one they're reading
without parsing the text.

## 41.2 The five component families

| # | Family | Component | Answers | Visual language |
|---|---|---|---|---|
| 1 | STATUS | `.status-badge` (canonical), aliased by `.badge` and `.smp-badge` | "What step of a workflow is this in?" | Tinted background, icon + label, 7px radius |
| 2 | LIFECYCLE | `.lc-pill` | "What long-running state is this record in?" | Tinted background, **dot** (not an icon) + label — the dot is what keeps it visually distinct from StatusBadge at a glance |
| 3 | ROLE | `.role-tag` | "What can this person do here?" | Neutral surface, icon + label, subtle border — never a lifecycle/status color |
| 4 | READINESS / WARNING | `.readiness-badge` | "Is this record ready to act on?" | Tinted background, icon + label, **interactive** (button, opens a popover), trailing chevron |
| 5 | ENTITY LABEL | `.category-tag` | "What category/attribute is this?" | Neutral surface, plain label, no semantic color |

Every family shares one JS helper pattern — `siIcon(name)` for the icon
markup and a `*Html()` render function per family (`statusBadgeHtml()`,
`roleTagHtml()`, `lcPillFor()`) — so a screen never hand-builds a
colored `<span>`. Add a new value to the relevant label/icon map
(`SMP_STATUS_ICON`, `EMP_STATUS_ICON`, `BADGE_STATUS_ICON`,
`READINESS_ICON`, `LIFECYCLE`) instead.

## 41.3 Shared anatomy tokens

```css
--status-h: 32px;          /* StatusBadge / LifecyclePill / ReadinessBadge / CategoryTag height */
--role-h: 30px;             /* RoleTag height — one notch down, it's metadata not a workflow state */
--status-radius: 7px;       /* restrained rounded rectangle — NOT --r-pill */
--status-font-size: 0.8125rem; /* 13px, medium/semibold — not tiny uppercase */
--status-icon-size: 14px;   /* icon inside every status-family component */
--status-px: 10px;          /* horizontal padding */
--status-gap: 6px;          /* icon → label gap */
```

Full pills (`--r-pill`) are reserved for components that genuinely
benefit from a pill shape (chips, counters) — status/role/readiness
components use the restrained 7px radius so they read as compact ERP
labels, not bubbles.

## 41.4 Icon rules for status components

- Anatomy is always `[icon] Label` — icon leading, never trailing,
  except ReadinessBadge's chevron (it's an interactive control, so the
  chevron communicates "opens a menu", same rule as StatusSelect/§30).
- Icon size is fixed at `--status-icon-size` (14px) inside every
  status-family component — never scaled up.
- Icon + text + color always travel together. Color alone never carries
  meaning (accessibility — colorblind users must be able to read the
  icon/label).
- The icon set lives in one place, `SI_ICON` in `index.html` (next to
  `esc()`/`escAttr()`), rendered via `siIcon(name, size)` — inline SVG,
  `stroke="currentColor"`, 24×24 viewBox. Add new icons there, never
  inline a bespoke `<svg>` for a status.
- Icon source: [Tabler Icons](https://tabler.io/icons) outline set, MIT
  license — paths are copied verbatim (not redrawn) from the matching
  `icons/outline/<name>.svg` in the `@tabler/icons` package. Chosen over
  Google Material Symbols or Apple SF Symbols because its 2px-stroke,
  round-cap, 24×24 language already matches the hand-drawn icons used
  elsewhere in the app (nav, division marks) — one icon system app-wide,
  per the icon rule above. Apple's SF Symbols license does not permit
  embedding outside Apple-platform apps, so it was not an option. To add
  an icon: find it in the Tabler outline set, copy its `<path>` elements
  (drop the inert `M0 0h24v24H0z` bounding placeholder) into `SI_ICON`.

Current icon mapping:

| Status family | Value | Icon |
|---|---|---|
| Sample/collection workflow (`SMP_STATUS_ICON`) | draft | file-edit |
| | requested / preparing | clock |
| | approved | check |
| | ready / delivered | check-circle |
| | picked_up | package |
| | shipped | truck |
| | returned / reprinted | rotate-ccw |
| | damaged | alert-triangle |
| | archived | archive |
| Employee status (`EMP_STATUS_ICON`) | active | check-circle |
| | inactive | pause-circle |
| | terminated | x-circle |
| | on_leave | clock |
| | transferred | arrow-right-circle |
| Badge lifecycle (`BADGE_STATUS_ICON`) | no_badge | minus-circle |
| | ready_to_print | clock |
| | printed | printer |
| | cancelled | x-circle |
| Readiness (`READINESS_ICON`) | ready | check-circle |
| | missing | alert-triangle |
| | blocked | x-circle |
| RoleTag (`roleIconFor()`) | admin/owner | shield |
| | manager | crown |
| | dispatcher | truck |
| | editor/contributor | pencil |
| | viewer (default) | eye |

## 41.5 Color architecture (unchanged, kept)

Three-part relationship per status, already correct in this codebase —
this pass did not touch it:

- **Light tint** (`--success-bg`/`--warning-bg`/`--danger-bg`/
  `--info-bg`, ~10–16% alpha) → component background.
- **Strong/dark hue** (`--success`/`--warning-text`/`--danger`/`--info`)
  → icon + text, via `currentColor` so the SVG icon always matches the
  label without a second color declaration.
- Dark mode redefines the same tokens at `:root` under
  `[data-theme="dark"]` (see the token block near the top of
  `index.html`) — status components need zero dark-mode-specific CSS of
  their own because they're built entirely from tokens.

## 41.6 Typography

13px (`--status-font-size`), weight 600, sentence case ("Approved", not
"APPROVED"). Uppercase is reserved for field labels/section headings
(§19/§26) — status/role/readiness text is never uppercased.

## 41.7 RoleTag is not a status

Roles (Viewer/Contributor/Technical Editor/Admin/…) never use lifecycle
semantic colors. `.role-tag` is neutral: `--surface2` background,
`--border` outline, `--text-2` label, `--text-3` icon. Applied at the
profile role indicator (`#prof-role-badge`, via `roleTagHtml()`) and the
collaborator invite list (`wsInvitePersonRow()` — replaces the old
`.ws-invite-owner-tag` pill with the shared component).

## 41.8 ReadinessBadge is interactive

`readinessPillHtml()` (Badge module) renders `.readiness-badge` as a
real `<button>` — it opens the missing-fields popover — with a trailing
chevron so it doesn't read as a static label. `Missing 2 fields` /
`Ready` / `Blocked` map to `badge-ready-missing` / `badge-ready-yes` /
`badge-ready-blocked`, sharing color tokens with the other status
families but the interactive anatomy of §15 StatusSelect.

## 41.9 Migration notes

- `smpBadge(status)`, `badgeStatusBadgeHtml(status)` (badge/gafete
  lifecycle), `empStatusBadgeHtml(status)` (employee status) and
  `lcPillFor(status)` are the only places these render — every table
  cell, card, and detail field calls through one of them. Fixing the
  shared function/CSS propagates everywhere automatically (§27/§31 of
  the ERP evolution brief) — screens were not hand-edited individually.
- `.badge`/`.smp-badge` are kept as class-name aliases of the
  `.status-badge` anatomy so existing `badge-<status>` modifier classes
  (`.badge-active`, `.badge-pending`, …) didn't need renaming at every
  call site — only the shared base rule and the render functions
  changed.
- Live reference: the Style Guide screen (`showStyleGuide()`,
  `#sg-badges`) renders one example of all five families and is the
  first place to check when adding a new status value.
- Not yet migrated to a dedicated `.category-tag`: construction/
  composition pills on Catalog cards (`.card-div-pill` family) and
  saved-view chips — flagged as future work per §31, not silently
  assumed done, since the fix pattern (swap the CSS class, verify no
  layout regression) is now established here for whoever picks it up
  next. §42.2 resized `.card-div-pill` onto the shared 32px/7px status
  shell (so it no longer visually drifts from its sibling `.rec-id`
  RecordID pill in the same row) without renaming the class — the
  class-swap-to-`.category-tag` migration itself is still open.

## 41.10 App-wide icon migration (Tabler), scope and remainder

`SI_ICON` started as the Status System's icon set but is now the single
icon source for the whole app — every icon-bearing chrome element
(sidebar nav, the account/notification/theme controls, the global
search trigger, close/collapse buttons, the Catalog row-actions
overflow menu, invite/"add person" affordances, view-toggle and
document/print/archive actions) renders through it. Before this pass
every one of these was a bespoke hand-drawn SVG — no two shared the
same stroke width, viewBox, or corner style, and several were
byte-for-byte duplicated across 4–6 call sites. `index.html` was
audited SVG-by-SVG (199 inline `<svg>` blocks total) and every icon
was classified into one of three buckets:

1. **Migrated to Tabler** (71 of 193 non-decorative `<svg>` blocks,
   covering every reused shape and all always-visible app chrome) —
   sidebar navigation (Dashboard/Website/Search/Notifications/
   Appearance/Account), the `SB_ICON` top-bar account-menu registry,
   close/collapse/plus/chevron/dots/check/clock controls used
   throughout, and the Catalog row `•••` menu (View record/Print
   label/Archive). `SI_ICON` grew from the original 21 status icons to
   71 general-purpose ones (search, x, plus, dots, chevrons, home,
   globe, calendar, filter, sort, columns, download, upload, share,
   link, briefcase, settings, table, file, lock, key, box, trash, copy,
   scan, barcode, qrcode, user/users/user-plus, and more) — add new
   icons there, not as one-off inline SVGs.
2. **Deliberately excluded, not a gap** — the SIERRA wordmark/mark (5
   inline copies across the loading screen, auth screen, top bar and
   printed badge — brand identity, never redrawn as a generic icon),
   the printed badge's SVG wordmark/barcode/QR canvases (functional
   output, not UI chrome — see §33's editor/document-are-different-
   systems rule), and the sidebar's collapse/expand dual-path toggle
   (`.edge-collapse`/`.edge-expand`, a single SVG with two paths shown/
   hidden by CSS depending on collapsed state — not a simple 1-icon
   swap, left as-is).
3. **Not yet migrated** — roughly 122 remaining `<svg>` instances (86
   distinct shapes) inside feature-specific screens: the Samples/Badge
   module (front/back badge preview, readiness checklist icons), the
   Insights and relationship-diagram views, the Label/Document editor's
   codes tab, Catalog's Table/Cards/view-mode icon trio, avatar/
   completeness-ring decorations, and assorted single-use icons inside
   specific modals and drawers. These were not touched in this pass —
   guessing an icon's meaning from its path shape alone (without a
   live render to verify against, which this environment's network
   policy blocks) risks shipping a wrong icon silently, so they were
   left as their original hand-drawn SVGs rather than force-migrated.
   Continue the same audit method (`grep -c "<svg\b"`, group by path
   shape, confirm meaning from the surrounding label/`onclick`/context,
   map to the matching `icons/outline/<name>.svg` in `@tabler/icons`)
   the next time one of those screens is touched.

Every migrated icon's path data is copied verbatim from
`@tabler/icons` (`npm install @tabler/icons`, outline set) — never
redrawn by hand — so a future contributor extending `SI_ICON` should
do the same: find the closest-matching icon in the Tabler outline set,
copy its `<path>` elements (dropping the inert `M0 0h24v24H0z` bounding
placeholder), and add it as a new `SI_ICON` key.

## 42. Product Card component grammar: RecordID, and the 32/40 rule

§41 fixed *color* — five distinct status families instead of one generic
badge. It didn't touch *size, radius, border weight or type* — a Catalog
card still mixed a 20px division chip, a barely-rendered lifecycle pill,
a thin 24px outline button and a 30px, differently-radiused overflow
button in one row. This pass fixes that: one card row, one shared
interaction baseline.

### 42.1 The rule: 32px = information, 40px = interaction

Every control on a card (and, by extension, everywhere else) is one of
exactly two heights:

| Height | Meaning | Components |
|---|---|---|
| **32px** (`--status-h`) | Information — read, not clicked | `.status-badge`, `.lc-pill`, `.role-tag`(30px, one notch down — see §41.3), `.category-tag`/`.card-div-pill`, `.rec-id` (RecordID) |
| **40px** (`--control-h`) | Interaction — a control | `.btn`, `.icon-btn`, form inputs/selects |

A 28px "small/metadata" tier is reserved for micro-elements that sit
*inside* a 32/40px control (tags, inline chips) rather than beside one —
nothing on the Catalog card needed it, so no new components were forced
onto it this pass. Don't invent a third row-level height. The one
sanctioned exception is `--control-h-sm` (36px) for controls inside an
already-compact secondary surface — a table row, a popover, a drawer
footer — never mixed with `--control-h` in the same group (see §8/§23,
unchanged by this pass). Catalog's own **table row** actions
(`catRowActionsHtml`) are exactly that exception: `.btn.btn-primary.
btn-sm` + `overflowMenuHtml()` at 36px, deliberately smaller than the
40px card row a few pixels away in the same screen's Cards view.

### 42.2 RecordID — a dedicated component, not a repurposed chip

`YRN-000045` used to render through `.card-div-pill` — the same class
used for the "all products" view's *division* chip — so a record code
and a division category tag were, literally, the same component wearing
different text. They answer different questions ("what record is this"
vs "what division is this") and now look different:

```
.rec-id            → 32px, --status-radius (7px), --info/--info-bg (blue
                      identity tint), 13px Replica Mono code, 14px leading
                      icon (the division's existing DIV_ICON glyph — no
                      new icon set), no hover/shadow.
.rec-id.is-click    → only when the identifier itself is a real trigger:
                      subtle background shift, nothing else. A RecordID
                      is not a CTA and must never look like one.
```

Built by `recordIdHtml(code, iconSvg, opts)` (next to `catCode()` in
`index.html`) — the one place a record identifier chip is constructed.
Call sites: `catCardHtml()` (Catalog Cards view, single-division only —
the "all products" view still needs the division category tag, so it
keeps `.card-div-pill` there), `wsCardsViewHtml()` (Collection sample
cards), and the Fabric/Yarn quick-view Drawer headers that used to
hand-roll `<span style="font-size:0.72rem...">`. `.card-div-pill` itself
was resized to the same 32px/7px shell (still its own identity-tinted
background per division) so the two pills in a card's meta row read as
one system even when they're not literally the same component.

### 42.3 Card action row — one interaction baseline

`Request sample` was `.cat-req-btn`: a bespoke, ~24px, 7px-radius,
outline-only button — visually *weaker* than the 32px status pill above
it, the opposite of the intended hierarchy (primary action should read
as more prominent than a status label, never less). It's gone. The card
row now uses the same two canonical components every other action group
in the app uses:

- **Primary action** — `.btn.btn-primary` (unchanged component, just
  finally used here): 40px, `--control-radius` (8px), filled brand teal
  (`--accent` / `--brand-teal` `#16cdbe`, hover `--accent-dark` /
  `--brand-teal-dark` `#007d73`), leading icon (`package`) + label.
- **Overflow** — `overflowMenuHtml(items, {btnClass:'icon-btn', title:
  'More'})`. `.card-more-btn.icon-btn` already existed (§ "A ••• trigger
  sitting in an action group is an IconButton") but nothing on the card
  passed it — the overflow trigger was rendering through the bare,
  smaller default. Now it does: 40×40, `--control-radius`, same
  `--border-strong` border as every other `.icon-btn`, tooltip.

`.card-more-btn`'s own *default* (no modifier — used by every other
overflow trigger in the app: employee rows, the product-detail image
gallery, etc.) was also standardized to `--control-h-sm`/`--control-
radius`/`--border-strong`/`--surface`, replacing a hardcoded `30px`/`8px`/
`var(--border)` that had already drifted out of sync with `--control-h-sm`
(36px) elsewhere on the same screens (e.g. the Talento Humano row, where
a 36px `.btn-sm` already sat next to the old 30px overflow trigger).
`.card-actions`/`.cat-row-actions` gap now reads `--control-gap` instead
of a hand-picked `0.5rem`/`0.3rem`.

### 42.4 Lifecycle pill — the "outlined" look was a CSS bug, not a style

`Available` visibly read as a thin, unfilled outline. Root cause:
`LIFECYCLE.available.color` is `'var(--success)'` (a custom-property
*reference*, not a literal hex string), and `lcPillFor()` built its
inline style as `` `background:${m.color}15` `` — string-concatenating an
alpha suffix onto a `var()` call. `background:var(--success)15` is
invalid CSS; the browser drops the whole declaration and falls back to
the base `.lc-pill` rule's `border:1px solid transparent` — a pill with
no fill and no border at all, just colored text and a dot. This only
ever worked for `.card-div-pill`/division colors because `DIV_CLR`
stores literal hex (`'#009fff'`), where the same suffix trick is valid.

Fixed by switching to `color-mix()` — the same technique the app's own
`.status-static`/`.pd-status-select` components already use for this
exact "tint a token-based color" problem:

```js
background: color-mix(in srgb, var(--success) 16%, var(--surface))
color:      color-mix(in srgb, var(--success) 80%, var(--text-primary))
```

This is a global fix (`lcPillFor()` is the only renderer for `.lc-pill`,
per §41.9's migration-notes pattern) — every lifecycle pill everywhere
in the app now renders a real soft fill instead of the broken outline,
not just the ones on Catalog cards. Cards render lifecycle at the full
32px `--status-h` (`lcPill(p)`); the ERP table's `availability` column
keeps the compact `lcPill(p, true)` (30px `--role-h`) as the sanctioned
compact-surface exception from §42.1.

### 42.5 Scope and what's deliberately not touched

Covered by construction (all five divisions — Fiber/Yarn/Fabric/
Chemicals/Apparel — share `catCardHtml()`, and Collections' sample cards
share the same `.card`/`.rec-id` primitives): the fix is in the shared
renderer, so "only the data changes" per division/screen holds without
per-screen edits, matching §16/§18's ownership rule.

Not in scope for this pass, flagged rather than silently assumed done
(same pattern as §41.9/§41.10's "not yet migrated" notes):

- **ERP table row density** (the main Catalog/Sample Center table view)
  was left at its existing compact rhythm — only its two action controls
  were brought onto the sanctioned 36px `--control-h-sm` tier already
  documented for "compact secondary surfaces." Re-flowing full table row
  height is a separate, much larger-blast-radius change and wasn't
  requested by the card-consistency problem this pass was scoped to.
- **The global `--r-*` radius scale** (`--r-sm:7px`/`--r-md:10px`/
  `--r-lg:12px`, used app-wide well beyond cards) was left as-is rather
  than renumbered to a fresh 6/8/12 scale — the status-family radius
  (`--status-radius`, 7px) and control radius (`--control-radius`, 8px)
  already give every component touched in this pass one shared, sourced
  value each; introducing a second, slightly different radius scale
  alongside the existing one would itself be a consistency regression.
- **Employee/Talento Humano cards** and other non-Catalog card surfaces
  weren't audited beyond confirming `.card-more-btn`'s base-rule fix
  (§42.3) also benefits their row actions — no dedicated employee card
  grid exists yet to migrate.

## 43. Catalog page architecture: PageHeader levels, CategoryTabs, ProductCard hierarchy

§42 fixed one card's *component grammar* (RecordID/Lifecycle/buttons all
sharing one height/radius/border scale). This pass fixes the page *around*
the card: the header had five or six controls all rendering as similar-
weight buttons, the view switcher and the category filters were literally
the same CSS class wearing different text, and the card itself put the
product **code** ahead of the product **name** — backwards for a catalog
whose job is product comprehension, not code lookup.

### 43.1 PageHeader: three levels, each visually quieter than the last

Every Catalog-style screen (`#view-products`, reused by every division)
already had the right *skeleton* — `.content-hdr` → view switch → saved-
views bar → `.page-toolbar` → grid — it just rendered all four rows at
close to the same visual weight. Nothing moved; the weight did:

| Level | Role | Component | Weight |
|---|---|---|---|
| 1 | Page identity | `.content-hdr` (`#sec-title`/`#sec-sub` + primary action) | Heaviest — 2rem title, one filled `.btn-primary` |
| 2 | Views | `.view-tabs`/`.view-tab` (**new**) | Text + 2px underline on the active tab, no track/pill |
| 3 | Taxonomy (optional) | `.cat-tabs`/`.cat-tab` (**new**) | Text-forward, soft tint only when active, muted count |
| 3.5 | Toolbar | `.page-toolbar` + `.btn.btn-secondary` (icon+label) | Bordered controls — heavier than tabs, lighter than the Level-1 primary action |

Levels 2 and 3 used to be the *same* `.pd-tabs-inline`/`.pd-tab` component
(originally built for the view switch, then reused for the saved-views
strip because it "already looked like a tab strip") — which is exactly
why Table|Cards and All Fabrics|Jersey|Rib competed for attention in the
screenshot that opened this pass: they were the same button rendered
twice. They're now two distinct, purpose-built components:

- **ViewTabs** (`.view-tabs`) answers "which surface am I looking at" —
  underline indicator, no background/border on the track, so it sits
  directly under the PageHeader without adding a rectangle.
- **CategoryTabs** (`.cat-tabs`) answers "which subset am I browsing" —
  a lighter-still row: `background:none` at rest, a soft `--surface2`
  tint only on hover/active, count always in `--text-3` regardless of
  active state (§2 — the count is never the emphasized half).

`.pd-tabs`/`.pd-tabs-inline` itself is untouched and still correct for
what it was actually built for (Collection workspace Board/Cards/Table/
Stats, a small *fixed* tab set in a bounded box) — only Catalog's two
call sites moved off it.

### 43.2 Toolbar: icon + label, one interaction height

`renderCatalogToolbar()` (Filter/Sort/Group/Columns/•••) moved from
`.btn-secondary.btn-sm` (36px, text-only — "Sort: Name (A–Z)", "Group by:
Construction") to full `.btn-secondary` (40px `--control-h`, icon
leading, prefix dropped — "Name A–Z", "Construction"). The icon already
says *what kind* of control this is; repeating "Sort:"/"Group by:" in the
label was pure noise once the icon carries that job (§1/§26). The shared
`.page-toolbar input[type=text]`/`select` primitive (used by every
`.page-toolbar`/`.dq-toolbar` in the app, not just Catalog) moved from
`--control-h-sm` to `--control-h` for the same reason — Search is Level-3
*interaction*, not a compact secondary surface, so it takes the 40px
tier like its neighbors (§24). The overflow trigger is the canonical
`.icon-btn` (40×40), not the old bespoke `.ws-icon-btn`.

### 43.3 ProductCard: name first, code and status are metadata

The card's `.card-meta` row (RecordID + LifecyclePill) used to render
*above* the product name — so `S-237` was the first, boldest thing on the
card and `Bubble Jersey` came second. Reversed:

```
[ media — 152px photo / 96px empty state ]
Bubble Jersey                              ← .card-name, 16.8px/650, 1 line
[🔲 S-237]              [● Available]      ← .card-meta: RecordID + LifecyclePill, unchanged from §42
68% Modal
29% Polyester                              ← .card-comp — see §43.4
3% Spx
358 GSM · Jersey                           ← .card-tech
[📦 Request sample]              [•••]     ← .card-actions, unchanged from §42
```

`.card-name` is now single-line (`white-space:nowrap` + ellipsis) at
1.05rem/650 — the strongest text in the card body — with a `.wrap-2`
escape hatch (`catCardHtml()` applies it past ~26 characters) for names
that genuinely need a second line rather than silently truncating a name
mid-word. RecordID/LifecyclePill keep every anatomy rule from §42 —
this pass only moved *where* that row sits, not what it looks like.

### 43.4 Composition is read, not truncated

`catCompositionHtml()`/`catCompositionParts()` (next to `catCode()` in
`index.html`) replace the old `.card-desc` 2-line clamp, which silently
cut off anything past ~40 characters — exactly the "users can't compare
fabrics" problem in §14. Composition strings are space-separated
("68% Modal 29% Polyester 3% Spx", not comma-delimited), so parts are
split at whitespace immediately preceding a digit (`\s+(?=\d)`) rather
than on a fixed delimiter:

- **≤ 2 components** → one line, joined with " · " (`98% Modal · 2% Spx`).
- **3+ components** → stacked, one component per line, fully readable,
  no clamp.

`catTechLine()` renders weight + construction (`358 GSM · Jersey`) as
its own muted line underneath — previously bolted onto the same string
as composition with no visual separation.

### 43.5 Grid density: comprehension over card count

`.pg-grid`'s floor moved from `minmax(240px,1fr)` to `minmax(280px,1fr)`,
and the separate `.cat-cards-dense` variant (`minmax(200px,1fr)`, 84px
media, single-line everything — literally the over-densified card this
pass exists to fix) was deleted; Catalog Cards now renders through the
one shared `.pg-grid`/`.card`, same as Collections' sample cards (§31 —
shared primitive, not a per-screen density hack). Plain CSS Grid
`auto-fill` does the rest without hand-maintained per-breakpoint column
counts: at a 280px floor a ~1160px content column naturally lands ~4-up
on a large desktop, ~3 on a laptop, and the `max-width:767px` tablet
breakpoint (floor lowered to 220px there) still yields ~2-3 depending on
viewport, down to the existing 400px breakpoint's forced single column.

### 43.6 Card selection: the table's checkbox, not a bespoke circle

`.card-check` was a decorative circular `<div>` toggled by textContent
(`✓`/``). It's now a real `<input type="checkbox">` — the exact same
element and `accent-color` treatment as `.cat-td-select input` in the
table — positioned over the media region's top-left corner instead of a
floating circle top-right (§20). `toggleProductSelect()` now sets
`.checked` on it directly instead of `.textContent`.

### 43.7 Media region: don't let an empty state dominate

`.card-img` (real photo) stays tall — 152px, since a real photo is worth
the space. `.card-img-placeholder` (no image) dropped from a forced-equal
128px to 96px with a slightly larger, more opaque icon (24px, 0.6 opacity
vs 22px/0.55) — legible without the gray box reading as more important
than the product name directly beneath it (§16).

### 43.8 Scope and what's deliberately not touched

This pass changed the **shared** `catCardHtml()`/`wsCardsViewHtml()`
renderers, `.pg-grid`, `.view-tabs`/`.cat-tabs`, and `renderCatalogToolbar()`
— so Fiber, Yarn, Fabric, Chemicals and Apparel all pick it up for free
(Yarn's own `renderCatalogHeaderActions()`/`catColCellHtml()` overrides
were updated to match the new 40px button sizing but didn't need any
other change), and Collections' sample cards now share the same
name-first anatomy. Not in scope, flagged rather than silently assumed
done:

- **Sidebar navigation** (§4-§8 of the request) — the sidebar tree
  (`renderSidebarTree()`/`_navExpanded`/`navToggleExpand()`) already only
  renders a module's or division's children when its key is in the
  `_navExpanded` `Set` (persisted to `localStorage`); a fresh session
  shows only the active module/division expanded. The all-divisions-open
  screenshot reflects **accumulated session state** from prior use, not a
  missing collapse mechanism — there was nothing to build. What the
  request also asks for — a Monday-style *dropdown* module switcher — is
  a **documented, deliberate rejection** already on record in this file
  (see the "SIDEBAR NAVIGATION TREE" comment block above
  `renderSidebarTree()`): the persistent always-visible tree explicitly
  replaced an earlier `.mod-switch`/`.bu-switch` dropdown pair. Reversing
  that decision inside this pass, without revisiting why it was made,
  would be a regression dressed as a fix — flagged for a deliberate,
  separate decision rather than silently done or silently skipped.
- **Favorites empty state** already matches the request ("Sin favoritos
  aún" / "No favorites yet") — no change needed.
- **ERP Table view** (`catTableHtml()`) row density is unchanged, same
  rationale as §42.5 — only its Search/Filter/Sort/Group/Columns toolbar
  (shared with Cards) picked up the 40px sizing.

---

# Sidebar Rearchitecture: Module Switcher + Active-Module Tree (§61)

## 61. Deliberate reversal of the §52/§43.8 "no dropdown switcher" decision

§43.8 (above) documents an earlier, deliberate rejection of a Monday-style
dropdown module switcher in favor of the persistent always-visible tree
built in §52-56. That rejection is **superseded here**, on purpose, not by
accident: this pass was commissioned specifically to revisit it as an
information-architecture problem, not a cosmetic one. The persistent tree
correctly solved "don't hide navigation behind a popover you reopen every
time" for a *single* module, but did not scale to multiple modules —
every accessible module rendered simultaneously, multiple divisions could
be expanded at once, and Catalog/Dispatch Queue/Inventory repeated once
per division. §52-56 are kept below for history but are **deprecated**:
`_navExpanded` (a flat `Set` of every expanded module+division key),
`navToggleExpand()`, `navToggleModule()`, `navModuleRowHtml()` and the
"every module renders every time" model no longer exist in `index.html`.
Do not resurrect them; everything below is the current, load-bearing
behavior of `renderSidebarTree()`.

## 61.1 Four zones

```
GLOBAL              Dashboard
FAVORITES           Favoritos — star shortcuts, or "Sin favoritos aún"
MODULE SWITCHER     [IconTile] Muestras  ▾     ← the ONE way to change modules
ACTIVE MODULE TREE  Divisiones (accordion) → Herramientas — active module only
UTILITY             — divider — Website
```

Only the **active** module's own navigation ever renders in `#nav-tree`.
Every other accessible module — Talento Humano, Index, and any future
module — is reachable exclusively through the Module Switcher popover,
never as a second permanent block stacked underneath. This is the direct
fix for "the sidebar exposes too much information at once": the sidebar's
length no longer grows with the number of modules in the platform, only
with the active module's own navigation depth (§30 future-scalability —
adding a 20th module adds one row to the switcher's list, zero rows to
the permanent sidebar).

## 61.2 Module Switcher (`.mod-switcher`)

`renderModSwitcherTrigger(key)` renders `[IconTile] {module.label} ▾` as
a `.nav-item` (so it inherits row height, hover, tooltip and the
collapsed-rail 40×40 treatment for free) with an extra `.mod-switcher-chevron`.
Clicking it (`toggleModuleSwitcher()`) opens `.mod-switcher-pop`, an
ancestor-driven popover (same ".xxx.open .xxx-pop" family as the account
menu, §12b) built by `renderModSwitcherPop()`:

- A `.control-input` search field (`modSwitchFilter()`), filtering
  `accessibleModules()` by label substring — no separate search index.
- **Recientes** — up to 3 modules from `_navRecentModules`
  (`localStorage: sierra_nav_recent_modules`, most-recent-first, pushed
  in `syncModule()`), excluding whichever module is already active.
  Hidden entirely once the user types a query — a search result list
  doesn't need a "recent" preamble.
- **Todos los módulos** — every module `accessibleModules()` returns,
  rows built from `MODULES` config (`m.icon`, `m.color`, `m.label`) —
  never a hardcoded per-module switcher list (§29). The active module's
  row carries `.pop-menu-item.current` (bold, existing convention).

Selecting a row (`modSwitchGo(key)`) closes the popover and calls the
existing `enterModule(key)` — no new routing path. The outside-click
listener next to `renderAcctMenu()`'s in `index.html` also closes
`#mod-switcher`.

## 61.3 Active-module tree: divisions (accordion) then tools

`renderSidebarTree()` resolves `navDisplayModuleKey()` — `activeModule` if
set, else `_navLastModule` (persisted, §61.6), else the user's first
accessible module — and renders **only** that module:

- **Muestras** — `authorizedDivisions()` render as `.nav-tree-div` rows
  via `navDivisionRowHtml(d, expanded, isCurrent)`, under a "Divisiones"
  `.s-label`. Exactly one division is expanded at a time
  (`_navExpandedDivision.samples`, §61.4) — expanding SIERRA Yarn
  collapses SIERRA Fabric automatically; there is no multi-expand state
  to track. Below the divisions, `samplesSharedTools()` (Solicitudes/
  Colecciones/Insights) render once under a "Herramientas" `.s-label` —
  cross-division destinations are never nested inside every division
  (§12 of the request).
- **Every other module** (Talento Humano, Index, future modules with no
  divisions) — just its `MODULES[key].tools` list (filtered by
  `t.visible()`), under the same "Herramientas" label. No "Divisiones"
  heading renders when a module has none — headings only appear when
  their section has content.

A new module is added to the tree by adding it to `MODULES` (and, if it
has divisions, extending `renderSidebarTree()`'s `key === 'samples'`
branch — currently only Muestras has divisions; a second divisioned
module would generalize that branch into a `moduleDivisions(key)` lookup
rather than duplicating the render loop) — never by hand-writing a new
block of sidebar markup.

## 61.4 Accordion + auto-expand-on-navigate (one mechanism, not two)

`_navExpandedDivision` is a plain object keyed by module id
(`{samples: 'fabric'}`), persisted to
`localStorage: sierra_nav_expanded_division` — "last expanded division
per module" (§17 of the request). Two ways it changes:

1. **Manual** — `navToggleDivision(d)` (division row click): expands the
   sidebar first if collapsed, then sets `_navExpandedDivision.samples`
   to `d` (or `null` if `d` was already open — a real accordion, not a
   one-way ratchet).
2. **Automatic** — the active route auto-expands its parent (§18 of the
   request): `renderSidebarTree()` derives the division from `_navLeaf`
   (`'samples|fabric|catalog'` → `fabric`) and forces it into
   `_navExpandedDivision.samples`. This only fires when `_navLeaf`
   actually *changed* since the last render (`_navLeafExpandedFor`
   guard) — otherwise a manual accordion click while parked on an
   unrelated screen would be immediately overridden by this same check
   on the re-render the click itself triggers. Browsing a different
   division without navigating away from the current screen works
   correctly because of this guard; don't remove it.

## 61.5 Division row anatomy + IconTile (one identity signal)

```
[chevron]  [IconTile]  SIERRA Fabric
```

`.nav-icon-tile` (28×28, `border-radius:7px`, 16px icon) is the **only**
place a division's identity color appears — `--tile-bg` set to
`DIV_ACCENT[d].light`, `--tile-fg` to `DIV_ACCENT[d].accent`. Row text,
the chevron and the row border all stay neutral (`--text-2`/`--text-3`).
This replaces the old pattern of a bare colored SVG floating directly in
the row (`style="color:${accent}"` on `.n-icon`) — chevron + floating
colored icon + no tile was exactly the "competing signals" problem named
in the request. The Module Switcher trigger and its popover rows reuse
the same `.nav-icon-tile`, tinted from `MODULES[key].color` at ~12%
opacity (`${m.color}1f`) for the tile background.

**Child rows** (Catálogo/Cola de despacho/Inventario) use neutral utility
icons, never the division's own shape: `NAV_ICON_CATALOG` is
`DIV_ICON.all` (the existing generic 2×2 grid glyph, reused rather than
drawing a parallel "catalog" icon), Cola de despacho/Inventario keep
their existing neutral outline icons. Division identity belongs to the
division row's IconTile only; a child icon communicates *function*
(catalog/dispatch/inventory), not *whose* division it's in.

## 61.6 Persistence

| State | Key | Scope |
|---|---|---|
| Active module (survives Dashboard/Módulos-hub) | `localStorage: sierra_nav_last_module` (`_navLastModule`) | Cross-session |
| Recent modules (Module Switcher) | `localStorage: sierra_nav_recent_modules` | Cross-session |
| Expanded division per module | `localStorage: sierra_nav_expanded_division` | Cross-session |
| Sidebar collapsed/expanded | `localStorage: sierra-sidebar` (unchanged — `toggleSidebar()`) | Cross-session |
| Favorites | `localStorage: sierra_nav_favorites` (unchanged — §57) | Cross-session |
| Current route/leaf | `_navLeaf` (in-memory) + `sessionStorage: sierra_active_module`/`sierra_route` (unchanged) | Per tab |

Nothing here resets on an ordinary route change within the same module —
only an explicit module switch or division toggle changes the persisted
state, matching "don't reset navigation state every time the user changes
route" (§17 of the request).

## 61.7 Indentation, row height, typography (fixed scale, not ad hoc)

```
Level 0   Dashboard, Module Switcher trigger      padding-left: 0.55rem (base .nav-item)
Level 1   .nav-tree-div, .nav-tree-leaf.lvl2       padding-left: 26px
Level 2   .nav-tree-leaf.lvl3                      padding-left: 52px
```

Row height is `min-height`, not padding math: `.nav-item` (global/
division rows) is 40px; `.nav-item.nav-tree-leaf` (any child screen or
module-level tool) is 37px. Typography: base `.nav-item` is 14px/500
(covers Dashboard, Website, division rows, the Module Switcher trigger);
`.nav-tree-leaf` drops to 400 weight (still 14px) since a child screen is
one step quieter than its division; `.active` always wins to 600
regardless of level. Section headings (`.s-label`, `.mod-switch-hdr`) are
~11px/650, uppercase, tracked, muted (`--text-3`) — never used for
anything but a group label, and never so frequent they eat vertical
rhythm (Favoritos / Divisiones / Herramientas — three per full render,
at most).

## 61.8 Active state: left indicator, not a bordered box

`.nav-item.active` replaced its old `border-color:var(--border)` bordered
rectangle with `background:var(--surface2)` + a 3px `var(--accent)` bar
riding the row's left edge (`.nav-item.active::before`), plus bold text
and a teal icon (`.nav-item:hover .n-icon, .nav-item.active .n-icon`,
unchanged). This is the one combination in use — never background +
border + colored text + colored icon simultaneously. Division/module rows
are never `.active` — only a leaf can be "here" (unchanged from §54);
`.nav-current-div` is a separate, purely structural marker (§61.9) that
carries no visual treatment of its own in the expanded sidebar.

## 61.9 Collapsed sidebar

`.sidebar.collapsed` shows, top to bottom: Dashboard icon, the Module
Switcher trigger as a 40×40 IconTile square (still opens the same
popover — anchored to the right of the rail via
`.sidebar.collapsed .mod-switcher-pop`, no forced re-expand needed since
a popover doesn't require sidebar width), **only the current/expanded
division's IconTile** (`.sidebar.collapsed .nav-tree-div:not(.nav-current-div)
{ display:none }` — every other division disappears outright, not just
its children, so the rail never becomes a second cramped copy of the
tree), the module's shared tools as plain icon squares, then Website at
the bottom. No brand wordmark in the rail — SIERRA identity lives once,
in the Global System Bar (a pre-existing decision, unchanged). No nested
chevrons collapsed (`.sidebar.collapsed .nav-tree-chevron{display:none}`,
unchanged from §54). Every row keeps its `data-tip` tooltip
(theme-native pill, unchanged mechanism).

## 61.10 Navigation color budget

Per the request's ~90/10 neutral/accent target: the only color sources
left in the sidebar are (1) IconTiles — division and module identity,
always contained to the 28×28 tile, never bleeding into text/border/
background, and (2) the 3px teal active indicator + teal icon on the
current leaf. Everything else — row text, chevrons, section labels,
hover states — is neutral (`--text-2`/`--text-3`/`--surface2`). This is
what §21 ("visual color budget") and §33 ("visual acceptance test — no
many colors, many boxes, many repeated icons") ask for structurally, not
just as a one-off polish pass — a new division added to `DIV_ACCENT`
automatically stays inside this budget because color only ever enters
through `--tile-bg`/`--tile-fg`.
