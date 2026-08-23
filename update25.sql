-- ══════════════════════════════════════════════════════════════
-- TALENTO HUMANO — Birthday Card workflow, data model
--
-- Adds the one table this milestone needs. Depends on update24.sql
-- (employees.birth_date) having been applied first — apply in order.
--
-- Idempotent. Run in Supabase > SQL Editor.
-- ══════════════════════════════════════════════════════════════

create table if not exists birthday_cards (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid references employees(id) on delete cascade not null,
  site_id uuid references sites(id) on delete restrict not null,

  moment_type text not null default 'birthday' check (moment_type in ('birthday')),
  event_year int not null,

  -- Persisted workflow states only. The pre-draft states (Detected /
  -- Information incomplete / Ready) are derived client-side from
  -- employee data — they never need a row here; a row exists from the
  -- moment a draft is first created.
  status text not null default 'draft' check (status in (
    'draft', 'pending_approval', 'approved', 'completed', 'skipped'
  )),

  template_id text not null,        -- key into the code-defined BIRTHDAY_TEMPLATES registry
  content jsonb not null default '{}', -- { display_name, position, message, photo_url, format }

  asset_png_url text,
  asset_pdf_generated_at timestamptz, -- PDF is produced via browser print-to-PDF (no stored file)

  skip_reason text,

  created_by uuid references profiles(id) on delete set null,
  approved_by uuid references profiles(id) on delete set null,

  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  approved_at timestamptz,
  completed_at timestamptz,

  -- One card record per employee per birthday year — the hard guard
  -- against duplicates the workflow relies on (find-or-create, never
  -- blind insert).
  unique (employee_id, moment_type, event_year)
);

create index if not exists birthday_cards_site_status_idx on birthday_cards(site_id, status);
create index if not exists birthday_cards_employee_idx on birthday_cards(employee_id);

alter table birthday_cards enable row level security;

drop policy if exists "talento_humano read cards" on birthday_cards;
create policy "talento_humano read cards"
  on birthday_cards for select using (authorize('talento_humano', 'read'));

-- A new row must start as a real draft — never inserted pre-approved.
drop policy if exists "talento_humano write cards" on birthday_cards;
create policy "talento_humano write cards"
  on birthday_cards for insert with check (
    authorize('talento_humano', 'write') and status = 'draft'
  );

-- Anyone with write access can update a card row (content, template,
-- exported-asset metadata, most status moves). The approval gate below
-- is deliberately NOT expressed as a WITH CHECK on this policy: a plain
-- "status <> 'approved' OR authorize(...,'approve')" check would also
-- block an ordinary HR user from doing anything at all to a row that is
-- ALREADY approved (e.g. exporting its PNG) unless they personally hold
-- 'approve' — which is wrong; only the *transition into* approved should
-- require it. That needs OLD vs NEW, which only a trigger can see.
drop policy if exists "talento_humano update cards" on birthday_cards;
create policy "talento_humano update cards"
  on birthday_cards for update
  using (authorize('talento_humano', 'write'))
  with check (authorize('talento_humano', 'write'));

-- Server-side approval gate, correctly scoped to the transition itself
-- (old.status <> 'approved' and new.status = 'approved') — not every
-- subsequent write to a row that already is approved. Grant the
-- capability via capability_grants (domain='talento_humano',
-- capability='approve') for Regional HR / authorized approvers;
-- 'admin' role already has it via authorize()'s existing legacy fallback.
create or replace function birthday_cards_guard_approval()
returns trigger language plpgsql security definer as $$
begin
  if new.status = 'approved' and old.status is distinct from 'approved' then
    if not authorize('talento_humano', 'approve') then
      raise exception 'not authorized to approve birthday cards';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_birthday_cards_guard_approval on birthday_cards;
create trigger trg_birthday_cards_guard_approval
  before update on birthday_cards
  for each row execute function birthday_cards_guard_approval();

-- ══════════════════════════════════════════════════════════════
-- MARKETING / DESIGN SCOPED READ — a role that only prepares cards
-- must never receive row access to `employees` (that table carries
-- medical/emergency/identification data no RLS column filter can
-- hide). Instead they get a grant on a *different* domain
-- ('talento_humano_cards') that only unlocks this function, which
-- returns exclusively the columns a birthday card needs. SECURITY
-- DEFINER so it can read `employees` under its own authority — the
-- caller never gets table-level access.
-- ══════════════════════════════════════════════════════════════
create or replace function birthday_card_roster(p_site_id uuid)
returns table (
  id uuid, first_name text, last_name text, preferred_name text,
  "position" text, department text, photo_url text, employee_status text,
  birth_date date
) language plpgsql security definer stable as $$
begin
  if not (authorize('talento_humano', 'read') or authorize('talento_humano_cards', 'read')) then
    raise exception 'not authorized';
  end if;
  return query
    select e.id, e.first_name, e.last_name, e.preferred_name,
           e.position, e.department, e.photo_url, e.employee_status, e.birth_date
    from employees e
    where e.site_id = p_site_id;
end;
$$;
