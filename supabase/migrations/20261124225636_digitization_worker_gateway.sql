begin;
-- Supabase default privileges may grant DML on new tables. Close those explicitly.
revoke all on public.digitization_settings,public.digitization_batches,public.digitization_jobs,public.digitization_events,public.digitization_workers from anon,authenticated;
grant select on public.digitization_settings,public.digitization_batches,public.digitization_jobs,public.digitization_events,public.digitization_workers to authenticated;
revoke all on sequence public.digitization_events_id_seq from anon,authenticated;
create table public.digitization_worker_credentials (
 id uuid primary key default gen_random_uuid(), name text not null,
 token_hash text not null unique check(token_hash ~ '^[a-f0-9]{64}$'),
 active boolean not null default true, created_at timestamptz not null default now(),
 bootstrap_job_id uuid references public.digitization_jobs(id)
);
alter table public.digitization_worker_credentials enable row level security;
revoke all on public.digitization_worker_credentials from public,anon,authenticated;
grant all on public.digitization_worker_credentials to service_role;
comment on table public.digitization_worker_credentials is 'Server-only hashed worker tokens. bootstrap_job_id is a temporary, exact job-scoped installation check permission; clear after verification.';
commit;
