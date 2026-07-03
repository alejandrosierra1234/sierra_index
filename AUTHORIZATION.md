# SIERRA Index — Capability-Based Authorization

Governance model: **Platform Owner + Data Owners**. Enforcement is
capability-based; legacy roles remain only as a compatibility fallback.

## Model

| Concept | Definition |
|---|---|
| Domain | A business area that owns its data: `fiber`, `yarn`, `fabric`, `chemicals`, `garment` (product divisions), `warehouse` (physical samples / dispatch), `customer_service` (requests & collections lifecycle), `platform` (users, grants, audit). |
| Capability | A verb granted on a domain: `read`, `write`, `delete`, `publish`, `dispatch`, `manage_status`, `grant`, `admin`. |
| Data Owner | Holder of `grant` (plus working capabilities) on a domain — can delegate access within it. |
| Platform Owner | Holder of `admin` + `grant` on `platform` — governs users and all grants. |
| Clients / public | No login-tier data; only the public product page (`?pub=<id>`), unchanged. |

Intended ownership: Product Development → fabric · Fiber Team → fiber ·
Yarn Team → yarn · Pride Chemicals → chemicals · Sample Warehouse →
warehouse · Customer Service → customer_service.

## Database (`samples_schema.sql`, "CAPABILITY-BASED AUTHORIZATION" section)

- **`capability_grants`** — `(user_id, domain, capability, resource_id?, granted_by, expires_at?)`. `resource_id = null` means the whole domain; a value scopes the grant to a single resource (used for collection collaborators). Unique per `(user, domain, capability, resource)`.
- **`grant_audit`** — append-only log of every grant/revoke, written by a trigger; readable by platform admins only.
- **`authorize(domain, capability, resource_id?)`** — the single authority function (security definer). Actor is always `auth.uid()`, never a client parameter. Checks explicit unexpired grants, then falls back to the legacy `profiles.role` mapping (admin → everything; editor → read/write/delete/publish/manage_status outside platform; dispatcher → warehouse read+dispatch, customer_service read+manage_status, division read). **Remove the fallback block in the deprecation phase.**
- **RLS** — all samples / sample_collections / collection_collaborators write policies now route through `authorize()`. Policy names unchanged (idempotent drop/create).
- **RPC hardening** — `verify_sample`, `exclude_sample`, `update_sample_status`, `update_collection_status` now (a) derive the actor from `auth.uid()` (`p_user_id` is only a SQL-editor fallback), (b) resolve the display name from `profiles`, and (c) enforce `authorize()` internally (security definer bypasses RLS, so this closed a spoofing gap). Signatures unchanged — no client migration needed.

### Automatic user migration

Idempotent backfill inserts grants from existing roles (`on conflict do nothing`):
admin → platform admin/grant + full division + customer_service + warehouse bundles;
editor → division editor bundles + customer_service; dispatcher → warehouse
dispatch + division read; user/vendedor → no grants (baseline unchanged).
Existing `collection_collaborators` rows are mirrored as resource-scoped
customer_service grants.

**To apply: run the whole `samples_schema.sql` (or just the new section) in the Supabase SQL Editor. The app works before and after — order doesn't matter.**

## Client (`index.html`)

Module right after the global state declarations:

- `loadGrants()` — loads the signed-in user's grants at login (called in `enterApp`); silently degrades to legacy fallback if the table doesn't exist yet.
- `can(capability, domain, resourceId?)` — UI gate; mirrors `authorize()` including the legacy fallback. **The DB is authoritative; `can()` is cosmetic.**
- `canEditDiv(d)` / `canDeleteDiv(d)` — division-aware helpers (`'all'`/null = any division).
- `authRoleLabel()` — badge label derived from capabilities (Admin / Data Owner / Editor / Dispatcher / Viewer).
- `isAdmin()` / `isEditor()` / `isDispatcher()` — **deprecated shims** over `can()`, kept for low-risk call sites; new code must call `can()`.

### Call-site mapping

| UI surface | Check |
|---|---|
| Product edit / add-image / drag-drop (detail page) | `canEditDiv(p.division)` |
| Product delete | `canDeleteDiv(p.division)` |
| Add product FAB | `canEditDiv(division)` (current division) |
| Sample Center "see all" + All Requests nav/route | `can('read','customer_service')` |
| Sample/collection status actions | `can('manage_status','customer_service')` |
| Dispatch screen / Go to Dispatch | `can('dispatch','warehouse')` |
| Team, Access Logs | `can('admin','platform')` |
| Comment delete | own comment or `canEditDiv(selected.division)` |

### Team screen

Now shows per-user **Domain access** chips (domain + level, hover for raw
capabilities, × to revoke) and an add-grant control (domain × level). Levels
are UI-only bundles expanded by `bundleCaps()`:
Viewer → read · Editor → read/write/publish (warehouse: read/dispatch;
customer_service: +manage_status; platform: admin) · Data Owner → editor
bundle + delete + `grant`. The legacy role dropdown remains (labeled as such)
until deprecation.

## Deprecation checklist (later phase)

1. Confirm every active user has explicit grants (`select * from profiles p where not exists (select 1 from capability_grants g where g.user_id = p.id)`).
2. Remove the legacy fallback block from `authorize()` and from `can()`.
3. Remove the role dropdown + `setUserRole()`; drop/ignore `profiles.role`.
4. Migrate `collection_collaborators` reads to resource-scoped grants and retire the table.

## Known gaps

- `products` table policies were configured directly in Supabase (not in this repo); they still use role checks until exported and rewritten through `authorize()`.
- Client grant snapshot loads at login; mid-session revocation leaves stale buttons (harmless — the DB rejects the write). Consider refetching on window focus.

## Product lifecycle (interaction with capabilities)

Products carry `products.lifecycle`: `draft`, `development`, `available`,
`reserved`, `discontinued`, `archived` (missing/legacy rows behave as
`available`). Rules, enforced in `index.html` helpers (`lc`, `lifecycleVisible`,
`canRequestSample`, `isArchived`) and `set_product_lifecycle()` in SQL:

- Status pill shown on every product card and on the detail page (Status block,
  with a change-status selector for users with `write` on the division).
- `draft`/`development` visible only where `canEditDiv(p.division)` — filtered
  out of catalog lists and Spotlight at load time.
- `discontinued` stays searchable but is not requestable: card/detail request
  buttons disabled and `addToCart()` (single choke point for the cart) refuses;
  dispatch add-product search also excludes it.
- `archived` is read-only: edit/delete hidden and guarded in `openEdit`/
  `confirmDelete`; only a status change (division `write`) reopens it. Not
  requestable.
- Public page (`?pub=`) refuses `draft`/`archived` ("This product is not
  available"). DB-level anon policy for products lives in the Supabase
  dashboard — see the note at the end of `samples_schema.sql` for the
  recommended `using` clause.
- Every status change is written to `product_events` by the
  `set_product_lifecycle()` RPC (with `authorize(division,'write')` check) and
  shown in the detail page "Activity" panel. The client falls back to a direct
  update + event insert if the RPC isn't migrated yet.

## Audit core (activity log, versions, audit trail)

Tables `activity_events` and `entity_versions` (+ RPCs `log_activity`,
`save_entity_version`) are generic: rows carry `(entity_type, entity_id,
domain)`. A separate `version_changes` table was deliberately omitted — diffs
are derived from adjacent snapshots (`Audit.diff`), so storing them would
denormalize. Visibility follows Part-8 rules via RLS: the actor, platform
admins, and holders of `read` on the row's domain; anonymous users see nothing.
Version numbering is gapless per entity (advisory-lock serialized in the RPC);
restores never rewrite history — they append a new version with
`restored_from` set.

Client: the `Audit` module (`Audit.log`, `Audit.snapshot`, `Audit.diff`) plus
`AUDIT_REGISTRY`. **Registering a new entity type = adding one registry entry**
(label + domain resolver); logging, versioning, timeline rendering and restore
all reuse the same code paths. Every Audit call swallows errors so auditing can
never break a workflow, and everything degrades gracefully until the SQL
migration runs.

Instrumented events: product created/edited/deleted, image uploads/removals,
lifecycle changes (archived/restored/published), technical sheet + label/QR/
barcode generation, comments added/deleted, collection created/status/dispatch,
sample requested/status, collaborator invited, legacy role changes and
capability grants/revocations.

Product page UI: Activity + Versions tabs (Apple-style segmented control).
Activity is one continuous newest-first timeline (activity_events paginated 15
at a time with Load more, legacy product_events and sample requests merged and
deduped, searchable and filterable). Versions load lazily on first open: pick
two to compare (only changed fields shown, old struck through, new
highlighted), Restore (division `write` or platform admin) writes the snapshot
back and appends a new version.

## Product knowledge graph

`product_links` stores typed product↔product relationships (one row per
link): `uses`, `produces`, `alternative`, `replacement`, `compatible`,
`collection`, `related`. Symmetric types read identically from both sides;
directional types flip to an inverse label when viewed from the target
(Uses ↔ Used by, Produces ↔ Produced from, Replacement ↔ Replaces) — defined
in the client `LINK_TYPES` registry. The table only stores product ids, so
future divisions participate with zero changes. RLS: authenticated read;
creating/removing a link requires `write` on either endpoint's division.
The product page's "Related Products" section renders visual cards
(relationship type in the division's color, thumb, name, code, lifecycle
note) with one-click navigation between products; editors get inline
search-to-link and per-card removal. Link add/remove events are recorded in
the activity log.

## Sample operations — multi-location inventory

Tables: `inventory_locations` (seeded: Guatemala Marketing Sample Library →
customer_service, Northern Textiles Sample Warehouse → warehouse, Pride
Chemicals Sample Center → chemicals; a new location = one row, nothing else),
`inventory_stock` (qty / reserved / min_qty per product × location × format,
DB checks make negative stock and over-reservation impossible),
`inventory_movements` (append-only: received, produced, transferred in/out,
reserved, released, picked, dispatched, returned, disposed, adjustment — with
actor, location, qty, reason, notes, optional collection/sample links).

**`move_inventory()` is the only write path** — security definer, row-locked
(`for update`), authorization inside via `can_adjust_location()` (location's
owner_domain `write`, warehouse `dispatch`, or platform admin). Every call
appends a movement; nothing changes stock silently. `transfer_inventory()`
moves between locations in one transaction. Low-stock (available ≤ min_qty)
inserts deduplicated `low_inventory` notifications for the owning domain's
grant holders.

Collection lifecycle integration: `reserve_collection_inventory()` on
creation (reserves, never deducts; skips untracked products so adoption is
gradual), `release_collection_inventory()` on cancel (archived/damaged),
`dispatch_collection_inventory()` at dispatch (verified → dispatched,
excluded → released). All hooked from the existing cart/status/dispatch
flows — no manual updates.

Product page: Availability chip in the identity column (Available / Low
Stock / Out of Stock / reserved count), per-location per-format inventory
in the specs column, lazy Movement history, and an Adjust form (reason
required) shown only to users who can adjust at least one location.
`INV_WIDGETS` + `renderInventoryWidget(key, el)` provide the six reusable
dashboard widgets (low inventory, most requested, by location, today's
dispatches, pending reservations, recently produced) for the future
Executive Dashboard.
