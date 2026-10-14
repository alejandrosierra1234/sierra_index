-- ══════════════════════════════════════════════════════════════
-- TALENTO HUMANO — extend company/manager-scoped visibility to
-- employee_movements, badge_issuances and badge_events
--
-- update29.sql introduced can_view_employee()/can_manage_employee(),
-- which layer company-scoped (capability_grants.resource_id =
-- company_id) and manager-chain access on top of the existing global
-- talento_humano grant / platform admin / self access, and applied
-- them to `employees` and `employment_periods`. This migration applies
-- the same helpers to the other employee-linked tables the redesigned
-- profile's Empleo/Gafete tabs read, so a Company HR Admin (or a
-- manager, where read access already covers self/reports) sees the
-- same employee's history and badge consistently instead of the
-- employee record being visible while its movements/badge silently
-- read empty under the old blanket policy.
--
-- Global grants, platform admins and self access keep working exactly
-- as before — this only ADDS company-scoped and manager access.
--
-- Idempotent. Run in Supabase > SQL Editor, after update29.sql.
-- ══════════════════════════════════════════════════════════════

-- EMPLOYEE_MOVEMENTS (update24.sql)
drop policy if exists "talento_humano read movements" on employee_movements;
create policy "talento_humano read movements"
  on employee_movements for select using (can_view_employee(employee_id));

drop policy if exists "talento_humano write movements" on employee_movements;
create policy "talento_humano write movements"
  on employee_movements for insert with check (can_manage_employee(employee_id));

drop policy if exists "talento_humano update movements" on employee_movements;
create policy "talento_humano update movements"
  on employee_movements for update using (can_manage_employee(employee_id));

-- BADGE_ISSUANCES (update19.sql) — the Gafete tab and badge queue.
drop policy if exists "talento_humano read issuances" on badge_issuances;
create policy "talento_humano read issuances"
  on badge_issuances for select using (can_view_employee(employee_id));

drop policy if exists "talento_humano write issuances" on badge_issuances;
create policy "talento_humano write issuances"
  on badge_issuances for insert with check (can_manage_employee(employee_id));

drop policy if exists "talento_humano update issuances" on badge_issuances;
create policy "talento_humano update issuances"
  on badge_issuances for update using (can_manage_employee(employee_id));

-- BADGE_EVENTS (update19.sql) — audit trail, follows its issuance.
drop policy if exists "talento_humano read events" on badge_events;
create policy "talento_humano read events"
  on badge_events for select using (
    exists (select 1 from badge_issuances bi where bi.id = issuance_id and can_view_employee(bi.employee_id))
  );

drop policy if exists "talento_humano write events" on badge_events;
create policy "talento_humano write events"
  on badge_events for insert with check (
    exists (select 1 from badge_issuances bi where bi.id = issuance_id and can_manage_employee(bi.employee_id))
  );
