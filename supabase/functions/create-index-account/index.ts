import { createClient } from 'npm:@supabase/supabase-js@2'
import { createManualAccountHandler } from '../_shared/create-manual-account.ts'

Deno.serve(createManualAccountHandler(createClient, {
  SUPABASE_URL: Deno.env.get('SUPABASE_URL')!,
  SUPABASE_ANON_KEY: Deno.env.get('SUPABASE_ANON_KEY')!,
  SUPABASE_SERVICE_ROLE_KEY: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
}))
