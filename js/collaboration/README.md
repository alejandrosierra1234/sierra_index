# Collaborative Communications

This module extends the existing communications editor. It is separate from product,
HR and commercial-card storage. It does not change the public media bucket.

## Deployment Order

1. Run `npm ci --ignore-scripts` in this directory, then `npm run build` and `npm test`.
2. Run the existing communications and security regression tests.
3. Apply `update41.sql` after `update40.sql` as a transaction.
4. Publish the generated bundle, integration bridge, stylesheet and `index.html`.
5. Verify with two distinct authenticated accounts, including a viewer and a revoked member.

Do not consider local database tests proof of production deployment. No secret or
service-role key is required in the browser. The integration reuses Index's client.

## Access Boundary

Documents are private by default. Only an active owner can grant, change or revoke
access by exact account email. Active readers can inspect and export; editors can
change content. Global legacy roles do not confer document access.

The five new tables have RLS enabled and no direct privileges for authenticated or
anonymous users. RPCs check the active account and membership on each call. Sharing
and synchronization lock the same document row. Access changes are audited.

Cursor presence uses the same authenticated RPC as updates. It is not sent through
Supabase public Broadcast/Presence channels. A revoked client cannot read subsequent
updates, even with an already-open connection. Previously downloaded/exported content
cannot be recalled. Names shown in presence come from server profiles, not cursor payloads.

Shared document bodies stay in browser memory, not localStorage. The owner's original
local draft remains a pre-sharing copy. `Compartidos` opens the server-backed version.
Changing accounts or logging out clears the shared session and its editor bindings.

## Merge Semantics

- Rich paragraphs, notice body, formatting and cursors: Yjs + y-prosemirror.
- Text fields: Y.Text with relative positions for the bound inputs.
- Blocks and other arrays with stable IDs: Y.Map records plus fractional ordering.
  Reordering does not replace the block record; concurrent deletion wins over edits.
- Scalar settings and arrays without stable IDs (for example legacy table cells):
  last-writer-wins. These are not per-cell collaborative spreadsheets.
- Undo inside a rich-text field is local to that participant through yUndoPlugin.

The transport serializes exchanges, reuses an update nonce on retry and only removes
acknowledged pending updates. Server checkpoints use a revision compare-and-swap.
Updates and cursors currently poll every 650 ms with failure backoff; this trades
WebSocket efficiency for per-request access checks. There are no AI calls or AI-token
charges in this feature. Database, bandwidth and request usage still apply.

Images are included in the private Yjs state, with a 16 MiB snapshot/update limit.
This avoids publishing private files but is intended for modest internal documents,
not a media library. A dedicated private asset store and traffic/load testing are
needed before high-volume rollout. Missing local assets prevent initial sharing.

## Tests

`test/authorization.test.js` runs the real migration against isolated PostgreSQL
(PGlite), with owner/editor/viewer/stranger identities and anonymous direct-table checks.
Other tests cover CRDT convergence, retries, account switches, rich cursors, formatting,
the actual Index editor bridge, and absence of cloud writes to localStorage.
# Automatic Sharing Preparation

Large local drafts are prepared on a detached copy before sharing. Raster photos
are converted to WebP at up to 2400 px (with bounded 1920/1600 px retries), repeated
photos are processed once per pass, and the smaller result is used. Original local
images, signatures, logos, QR codes and small graphics are retained unchanged.
The dialog reports progress and cancellation/account changes stop preparation.
Photos added while collaborating are prepared before entering the shared model.
The server's 16 MiB payload safety limit still applies after preparation; no public
storage bucket or anonymous media link is introduced by this workflow.
