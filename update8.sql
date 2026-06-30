-- Login / access log
create table if not exists login_logs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid,
  email       text,
  ip          text,
  country     text,
  country_code text,
  city        text,
  region      text,
  org         text,
  latitude    numeric,
  longitude   numeric,
  user_agent  text,
  created_at  timestamptz default now()
);

alter table login_logs enable row level security;

-- Any authenticated user can insert their own log entry
create policy "Users can insert own login log" on login_logs
  for insert with check (user_id = auth.uid());

-- Only editors can read all logs
create policy "Editors can view all login logs" on login_logs
  for select using (
    exists (select 1 from profiles where id = auth.uid() and role = 'editor')
  );

-- Index for fast queries
create index if not exists login_logs_user_id_idx on login_logs(user_id);
create index if not exists login_logs_created_at_idx on login_logs(created_at desc);
