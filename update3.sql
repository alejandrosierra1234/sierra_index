-- ============================================
-- SIERRA INDEX — Update 3: Product comments
-- Run in Supabase > SQL Editor
-- ============================================

create table if not exists product_comments (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references products(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  comment text not null,
  created_at timestamptz default now()
);

alter table product_comments enable row level security;

create policy "All authenticated can view comments"
  on product_comments for select using (auth.role() = 'authenticated');

create policy "Users can add comments"
  on product_comments for insert with check (user_id = auth.uid());

create policy "Users can delete own, editors can delete any"
  on product_comments for delete using (
    user_id = auth.uid()
    or exists (select 1 from profiles where id = auth.uid() and role = 'editor')
  );
