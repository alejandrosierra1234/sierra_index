-- ══════════════════════════════════════════════════════════════
-- TALENTO HUMANO — Altas (hires/rehires) and Bajas (terminations) as
-- explicit, atomic workflows
--
-- Today a "new employee" only exists via the bulk import path, and
-- there is no dedicated hire flow; a termination is just flipping
-- employees.employee_status to 'terminated' by hand in the generic
-- edit form. Neither creates the movement/employment-period records
-- update29.sql introduced, and neither is atomic from the client (a
-- multi-step client-side sequence of inserts can partially fail).
--
-- This migration adds three SECURITY INVOKER functions — each runs as
-- a single statement, so Postgres gives it one transaction for free,
-- and because they are SECURITY INVOKER (the default), every insert/
-- update inside still goes through the exact same RLS policies the
-- calling user would hit directly; the explicit authorization checks
-- inside are defense in depth, not a bypass:
--
--   - hire_employee(...)      → new person, new employee identity
--   - rehire_employee(...)    → an existing (terminated) employee
--                                identity returns; never a duplicate
--                                identity for someone who left and
--                                came back (§16)
--   - terminate_employee(...) → formal departure: closes the current
--                                employment period with a real
--                                category/reason, logs a 'departure'
--                                movement, closes reporting-relationship
--                                rows, and optionally cancels the
--                                badge / disables Index access — never
--                                a bare status flip, and never a delete.
--
-- Also extends the company/manager-scoped visibility introduced in
-- update29/update30 to employee_reporting_relationships, so a Company
-- HR Admin hiring or terminating someone in their own company can also
-- write the manager-link row these functions create/close — mirrors
-- exactly what update30 already did for employee_movements/badges.
--
-- Idempotent. Run in Supabase > SQL Editor, after update30.sql.
-- ══════════════════════════════════════════════════════════════

-- ── 0. can_view_employee() must treat write access as including read
--    access (conventional RBAC: write ⊇ read). Without this, a user
--    granted only the 'write' capability on a company (and not a
--    separate 'read' grant) could pass every can_manage_employee()
--    check yet fail the SELECT policy — including the implicit SELECT
--    that `INSERT ... RETURNING` requires — on the very row they just
--    created. Found while validating hire_employee() against exactly
--    that grant shape. ──
create or replace function can_view_employee(p_employee_id uuid)
returns boolean language plpgsql security definer stable as $$
begin
  if can_manage_employee(p_employee_id) then return true; end if;
  if is_self_employee(p_employee_id) or is_manager_of(p_employee_id) then return true; end if;
  return authorize('talento_humano', 'read');
end;
$$;

-- ── 1. Company/manager-scoped RLS on employee_reporting_relationships ──
drop policy if exists "talento_humano read reporting relationships" on employee_reporting_relationships;
create policy "talento_humano read reporting relationships"
  on employee_reporting_relationships for select using (can_view_employee(employee_id));

drop policy if exists "talento_humano write reporting relationships" on employee_reporting_relationships;
create policy "talento_humano write reporting relationships"
  on employee_reporting_relationships for insert with check (can_manage_employee(employee_id));

drop policy if exists "talento_humano update reporting relationships" on employee_reporting_relationships;
create policy "talento_humano update reporting relationships"
  on employee_reporting_relationships for update using (can_manage_employee(employee_id));

-- ── 2. HIRE — a brand-new employee identity. ──
create or replace function hire_employee(
  p_site_id                  uuid,
  p_employee_code            text,
  p_first_name               text,
  p_last_name                text,
  p_preferred_name           text default null,
  p_birth_date               date default null,
  p_identification_type      text default null,
  p_identification_number    text default null,
  p_phone                    text default null,
  p_email                    text default null,
  p_department_id            uuid default null,
  p_position_id              uuid default null,
  p_manager_employee_id      uuid default null,
  p_hire_date                date default current_date,
  p_employee_category        text default null,
  p_reason                   text default null
) returns uuid
language plpgsql
security invoker
as $$
declare
  v_company_id       uuid;
  v_department_name  text;
  v_position_name    text;
  v_employee_id      uuid;
begin
  select company_id into v_company_id from sites where id = p_site_id;
  if v_company_id is null then
    raise exception 'Sede no encontrada';
  end if;
  if not (authorize('platform', 'admin') or authorize('talento_humano', 'write')
          or user_has_company_scope(v_company_id, 'write')) then
    raise exception 'No autorizado para dar de alta colaboradores en esta empresa';
  end if;

  select name into v_department_name from departments where id = p_department_id;
  select title into v_position_name from positions where id = p_position_id;

  -- Pre-generate the id rather than `insert ... returning id`: for a
  -- company-scoped (non-global) grant, can_view_employee()/
  -- can_manage_employee() re-query employees by id to resolve
  -- company_id, and RETURNING's implicit SELECT-policy check runs
  -- inside the SAME command as this INSERT — before the new row is
  -- visible to that nested query. Supplying the id up front avoids
  -- needing RETURNING (and the self-referential lookup) at all.
  v_employee_id := gen_random_uuid();

  insert into employees (
    id, site_id, employee_code, first_name, last_name, preferred_name, birth_date,
    identification_type, identification_number, phone, email,
    department, position, department_id, position_id,
    hire_date, employee_category, employee_status, created_by
  ) values (
    v_employee_id, p_site_id, p_employee_code, p_first_name, p_last_name, p_preferred_name, p_birth_date,
    p_identification_type, p_identification_number, p_phone, p_email,
    v_department_name, v_position_name, p_department_id, p_position_id,
    p_hire_date, p_employee_category, 'active', auth.uid()
  );

  insert into employment_periods (employee_id, company_id, site_id, start_date, is_current, period_status, created_by)
    values (v_employee_id, v_company_id, p_site_id, p_hire_date, true, 'active', auth.uid());

  insert into employee_movements (
    employee_id, site_id, movement_type, effective_date, status, reason, applied_at, created_by,
    new_company_id, new_department_id, new_position_id, new_manager_id
  ) values (
    v_employee_id, p_site_id, 'new_hire', p_hire_date, 'applied', coalesce(p_reason, 'Alta de colaborador'), now(), auth.uid(),
    v_company_id, p_department_id, p_position_id, p_manager_employee_id
  );

  if p_manager_employee_id is not null then
    insert into employee_reporting_relationships (employee_id, manager_employee_id, site_id, effective_from, created_by)
      values (v_employee_id, p_manager_employee_id, p_site_id, p_hire_date, auth.uid());
  end if;

  return v_employee_id;
end;
$$;

-- ── 3. REHIRE — the SAME employee identity returns; a new employment
--    period, never a new employee row (§16: multiple employment
--    periods per employee, no duplicate identities). ──
create or replace function rehire_employee(
  p_employee_id           uuid,
  p_site_id               uuid,
  p_hire_date             date default current_date,
  p_department_id         uuid default null,
  p_position_id           uuid default null,
  p_manager_employee_id   uuid default null,
  p_reason                text default null
) returns uuid
language plpgsql
security invoker
as $$
declare
  v_company_id       uuid;
  v_department_name  text;
  v_position_name    text;
begin
  select company_id into v_company_id from sites where id = p_site_id;
  if v_company_id is null then
    raise exception 'Sede no encontrada';
  end if;
  if not (authorize('platform', 'admin') or authorize('talento_humano', 'write')
          or user_has_company_scope(v_company_id, 'write')) then
    raise exception 'No autorizado para recontratar en esta empresa';
  end if;
  if exists (select 1 from employment_periods where employee_id = p_employee_id and is_current) then
    raise exception 'Este colaborador ya tiene un periodo de empleo activo';
  end if;

  select name into v_department_name from departments where id = p_department_id;
  select title into v_position_name from positions where id = p_position_id;

  update employees set
    site_id = p_site_id,
    department = coalesce(v_department_name, department),
    position = coalesce(v_position_name, position),
    department_id = coalesce(p_department_id, department_id),
    position_id = coalesce(p_position_id, position_id),
    employee_status = 'active',
    updated_at = now()
  where id = p_employee_id;

  insert into employment_periods (employee_id, company_id, site_id, start_date, is_current, period_status, created_by)
    values (p_employee_id, v_company_id, p_site_id, p_hire_date, true, 'active', auth.uid());

  insert into employee_movements (
    employee_id, site_id, movement_type, effective_date, status, reason, applied_at, created_by,
    new_company_id, new_department_id, new_position_id, new_manager_id
  ) values (
    p_employee_id, p_site_id, 'rehire', p_hire_date, 'applied', coalesce(p_reason, 'Recontratación'), now(), auth.uid(),
    v_company_id, p_department_id, p_position_id, p_manager_employee_id
  );

  if p_manager_employee_id is not null then
    insert into employee_reporting_relationships (employee_id, manager_employee_id, site_id, effective_from, created_by)
      values (p_employee_id, p_manager_employee_id, p_site_id, p_hire_date, auth.uid());
  end if;

  return p_employee_id;
end;
$$;

-- ── 4. TERMINATE — a formal departure, never a bare status flip and
--    never a delete. Closes the current employment period with a real
--    category/reason, closes any current reporting-relationship rows
--    (the departed employee is organizationally unassigned, never
--    silently re-parented to a guess), and optionally cancels the
--    badge / disables Index access — both controlled, both logged. ──
create or replace function terminate_employee(
  p_employee_id             uuid,
  p_effective_date          date,
  p_termination_category    text,
  p_termination_reason      text default null,
  p_notes                   text default null,
  p_disable_index_access    boolean default false,
  p_invalidate_badge        boolean default false
) returns void
language plpgsql
security invoker
as $$
declare
  v_site_id   uuid;
  v_period_id uuid;
begin
  if not can_manage_employee(p_employee_id) then
    raise exception 'No autorizado para dar de baja a este colaborador';
  end if;
  if p_termination_category not in ('resignation', 'termination', 'end_of_contract', 'retirement', 'other') then
    raise exception 'Categoría de baja inválida';
  end if;

  select site_id into v_site_id from employees where id = p_employee_id;
  if v_site_id is null then
    raise exception 'Colaborador no encontrado';
  end if;

  update employees set employee_status = 'terminated', updated_at = now() where id = p_employee_id;

  update employment_periods
    set end_date = p_effective_date, period_status = 'ended', is_current = false,
        termination_category = p_termination_category, termination_reason = p_termination_reason,
        notes = coalesce(p_notes, notes)
    where employee_id = p_employee_id and is_current
    returning id into v_period_id;

  insert into employee_movements (employee_id, site_id, movement_type, effective_date, status, reason, note, applied_at, created_by, employment_period_id)
    values (p_employee_id, v_site_id, 'departure', p_effective_date, 'applied', p_termination_category, p_termination_reason, now(), auth.uid(), v_period_id);

  update employee_reporting_relationships
    set is_current = false, effective_to = p_effective_date, updated_by = auth.uid(), updated_at = now()
    where is_current and (employee_id = p_employee_id or manager_employee_id = p_employee_id);

  if p_disable_index_access then
    update profiles set account_status = 'disabled' where employee_id = p_employee_id;
  end if;

  if p_invalidate_badge then
    update badge_issuances set status = 'cancelled', cancelled_at = now(), cancelled_by = auth.uid(),
        cancellation_reason = 'Baja de colaborador'
      where employee_id = p_employee_id and status not in ('cancelled', 'expired');
  end if;
end;
$$;

comment on function hire_employee is 'Talento Humano — Altas: creates a new employee identity plus its opening employment_periods row and new_hire movement in one transaction. No payroll/salary data.';
comment on function rehire_employee is 'Talento Humano — Altas (recontratación): reuses an existing employee identity, opening a new employment_periods row rather than a duplicate employee.';
comment on function terminate_employee is 'Talento Humano — Bajas: closes the current employment period with a real category/reason and logs a departure movement. Never deletes the employee.';
