-- ══════════════════════════════════════════════════════════════
-- COLLABORATOR ROLE PRESETS
--
-- collection_collaborators previously had no notion of role: every
-- invited person got the same implicit access (full edit of a draft
-- collection — samples, categories, pricing — for as long as it stayed
-- a draft). This adds a role preset per collaborator (Viewer /
-- Contributor / Technical Editor / Commercial Editor / Collection
-- Manager / Custom), matching the SIERRA ERP evolution brief's invite
-- flow requirement.
--
-- The preset -> capability mapping (manage_samples, comment,
-- edit_pricing, edit_protected_specs, submit, manage_people) is defined
-- once in index.html as COLLAB_ROLE_PRESETS — this migration only needs
-- to persist which preset (or Custom capability set) a collaborator has.
--
-- IMPORTANT — scope of this pass: enforcement of these capabilities is
-- currently UI-level (index.html reads role/capabilities and hides/
-- disables controls accordingly), same as most of the app's existing
-- role gating. This migration does NOT add new RLS policies per
-- capability — samples/pricing writes are still governed by the
-- existing table-level RLS (see samples_schema.sql / update7.sql for
-- customer_service RLS). Treat the role preset as a real product
-- feature but not yet a hard security boundary; tightening RLS to
-- match is future work, flagged here rather than silently assumed.
-- ══════════════════════════════════════════════════════════════

alter table collection_collaborators add column if not exists role text not null default 'contributor';

alter table collection_collaborators drop constraint if exists collection_collaborators_role_check;
alter table collection_collaborators add constraint collection_collaborators_role_check
  check (role in ('viewer','contributor','technical_editor','commercial_editor','collection_manager','custom'));

-- Only meaningful when role = 'custom'; null for every preset role
-- (the preset's fixed capability set is looked up client-side).
alter table collection_collaborators add column if not exists capabilities jsonb;

-- No UPDATE policy existed on this table before (only select/insert/
-- delete) — with RLS enabled that silently denied every update, which
-- would have made role changes a no-op against the real database. This
-- mirrors the existing insert policy's trust boundary (owner, an
-- already-privileged collaborator, or an admin/editor/dispatcher) rather
-- than inventing a stricter one; it does not itself validate the
-- `capabilities` JSON a collection_manager/custom-manage_people actor
-- writes, so treat this as "closes the wide-open no-policy gap," not as
-- a full server-side capability system.
drop policy if exists "collection managers can update collaborator roles" on collection_collaborators;
create policy "collection managers can update collaborator roles"
  on collection_collaborators for update using (
    exists (
      select 1 from sample_collections c
      where c.id = collection_id and c.requested_by = auth.uid()
    )
    or exists (
      select 1 from collection_collaborators cc
      where cc.collection_id = collection_collaborators.collection_id
        and cc.user_id = auth.uid()
        and (
          cc.role = 'collection_manager'
          or (cc.role = 'custom' and coalesce((cc.capabilities->>'manage_people')::boolean, false))
        )
    )
    or exists (select 1 from profiles where id = auth.uid() and role in ('admin','editor','dispatcher'))
  );
