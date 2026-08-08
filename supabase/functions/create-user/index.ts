// Creates a new team account (auth user + profile) and emails them a Supabase
// invite link to set their own password. Callable only by someone who holds
// admin on the 'platform' domain — same authority as the Team screen's
// grant management. Never accepts a password from the client.
//
// Deploy: supabase functions deploy create-user
// Secrets SUPABASE_URL / SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY are
// injected automatically by the Supabase Edge Runtime — nothing to set.
import { createClient } from 'npm:@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const VALID_ROLES = ['admin', 'editor', 'dispatcher', 'user']

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS })

  const authHeader = req.headers.get('Authorization') ?? ''
  if (!authHeader) return json({ error: 'Missing Authorization header' }, 401)

  // Scoped to the caller's own session — authorize() runs as that user, so
  // this can't be spoofed by passing someone else's id in the body.
  const callerClient = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  })
  const { data: isAuthorized, error: authErr } = await callerClient
    .rpc('authorize', { p_domain: 'platform', p_capability: 'admin' })
  if (authErr || !isAuthorized) return json({ error: 'not authorized' }, 403)

  let body: { email?: string; full_name?: string; role?: string }
  try {
    body = await req.json()
  } catch {
    return json({ error: 'invalid JSON body' }, 400)
  }

  const email = body.email?.trim().toLowerCase()
  const full_name = body.full_name?.trim()
  const role = VALID_ROLES.includes(body.role || '') ? body.role : 'user'
  if (!email || !full_name) return json({ error: 'email and full_name are required' }, 400)

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)
  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { full_name, role },
  })
  if (error) return json({ error: error.message }, 400)

  return json({ user: { id: data.user.id, email: data.user.email } }, 200)
})
