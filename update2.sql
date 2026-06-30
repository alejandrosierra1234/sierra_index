-- ============================================
-- SIERRA INDEX — Update 2: Editor request management
-- Run in Supabase > SQL Editor
-- ============================================

-- Allow editors to view ALL sample requests (not just their own)
create policy "Editors can view all requests"
  on sample_requests for select using (
    exists (select 1 from profiles where id = auth.uid() and role = 'editor')
  );

-- Allow editors to update request status (approve / ship / reject)
create policy "Editors can update request status"
  on sample_requests for update using (
    exists (select 1 from profiles where id = auth.uid() and role = 'editor')
  );
