-- ══════════════════════════════════════════════════════════════
-- TALENTO HUMANO — Vacaciones: keep vacation_balances.used_days in sync
-- with approved requests
--
-- update29.sql introduced vacation_policies/balances/requests but never
-- wired anything to maintain balances.used_days as requests move
-- through the approval workflow — it would otherwise be a column that
-- always reads 0 no matter how many approved vacations exist. This
-- adds a trigger that:
--   - increments the matching year's used_days when a request becomes
--     'approved' (whether newly inserted already-approved, or
--     transitioning from another status)
--   - decrements it if a previously-approved request is later
--     rejected or cancelled (an HR correction after the fact)
--
-- It only ever UPDATEs an existing vacation_balances row — it never
-- creates one. A balance requires a real vacation_policies row (not
-- null FK), so this never fabricates a policy/entitlement just because
-- a request was approved; if no balance row exists yet for that
-- employee/year, the UI shows "Sin saldo configurado" until HR sets
-- one up explicitly, and this trigger starts maintaining it from then on.
--
-- Idempotent. Run in Supabase > SQL Editor, after update31.sql.
-- ══════════════════════════════════════════════════════════════

create or replace function sync_vacation_balance_on_decision() returns trigger
language plpgsql security definer as $$
declare
  v_year int := extract(year from new.start_date)::int;
begin
  if tg_op = 'UPDATE' and old.status = 'approved' and new.status <> 'approved' then
    update vacation_balances
      set used_days = greatest(0, used_days - old.requested_days), updated_at = now()
      where employee_id = new.employee_id and period_year = v_year;
  elsif new.status = 'approved' and (tg_op = 'INSERT' or old.status is distinct from 'approved') then
    update vacation_balances
      set used_days = used_days + new.requested_days, updated_at = now()
      where employee_id = new.employee_id and period_year = v_year;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_sync_vacation_balance on vacation_requests;
create trigger trg_sync_vacation_balance
  after insert or update of status on vacation_requests
  for each row execute function sync_vacation_balance_on_decision();

comment on function sync_vacation_balance_on_decision is 'Talento Humano — Vacaciones: keeps vacation_balances.used_days in sync with approved requests. Never creates a balance row (a policy_id is required); only updates one that already exists.';
