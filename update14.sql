-- ══════════════════════════════════════════════════════════════
-- FIX: infinite recursion in the SELECT policy on `profiles`
--
-- Symptom: "42P17 — infinite recursion detected in policy for
-- relation 'profiles'" whenever anything embeds someone ELSE's
-- profile (e.g. "who requested this collection?"). This happens when
-- a SELECT policy on profiles contains a subquery that itself selects
-- from profiles — Postgres re-evaluates the same policy on that inner
-- query, forever.
--
-- Fix: replace whatever SELECT policy exists today (name unknown —
-- dropped dynamically below, whatever it's actually called) with one
-- simple, non-recursive rule: any authenticated user can view any
-- profile. This matches how every other table in the app already
-- works (samples, collections, comments are all visible to any
-- authenticated user) — profiles just never got the same treatment.
--
-- Only touches SELECT. Insert/update/delete policies on profiles are
-- untouched. Run in Supabase > SQL Editor. Idempotent.
-- ══════════════════════════════════════════════════════════════

do $$
declare pol record;
begin
  for pol in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'profiles' and cmd = 'SELECT'
  loop
    execute format('drop policy %I on public.profiles', pol.policyname);
  end loop;
end $$;

create policy "authenticated can view profiles"
  on profiles for select using (auth.uid() is not null);
