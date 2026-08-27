// Creates an Index account LINKED to an existing Talento Humano
// collaborator (employee) — or, for the 'external' case, a vendor/
// contractor account with no collaborator record. Replaces the old
// "Crear cuenta" flow (create-user), which used to create an unrelated
// name+email record with no relationship to Colaboradores.
//
// Callable only by someone who holds admin on the 'platform' domain.
// Never accepts a password from the client; the invitee sets their own
// via the Supabase invite email.
//
// Enforced here (defense in depth — the DB also enforces this via
// profiles_account_type_link_check and the unique employee_id index):
//   - account_type 'employee' requires employee_id, and that employee
//     must not already have an account.
//   - account_type 'system_admin' can NEVER be created through this
//     function — that classification only exists via direct database
//     migration (see update27.sql), which is what makes it a real
//     exception instead of a UI bug waiting to happen.
//
// Deploy: supabase functions deploy create-index-account
import { createClient } from 'npm:@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const VALID_ROLES = ['admin', 'editor', 'dispatcher', 'user']
const VALID_ACCOUNT_TYPES = ['employee', 'external']

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

  const callerClient = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  })
  const { data: isAuthorized, error: authErr } = await callerClient
    .rpc('authorize', { p_domain: 'platform', p_capability: 'admin' })
  if (authErr || !isAuthorized) return json({ error: 'not authorized' }, 403)

  let body: { email?: string; employee_id?: string; account_type?: string; role?: string; allow_inactive?: boolean; full_name?: string }
  try {
    body = await req.json()
  } catch {
    return json({ error: 'invalid JSON body' }, 400)
  }

  const email = body.email?.trim().toLowerCase()
  const account_type = VALID_ACCOUNT_TYPES.includes(body.account_type || '') ? body.account_type! : 'employee'
  const role = VALID_ROLES.includes(body.role || '') ? body.role : 'user'
  const employee_id = body.employee_id?.trim() || null

  if (!email) return json({ error: 'email is required' }, 400)
  if (account_type === 'employee' && !employee_id) {
    return json({ error: 'employee_id is required to create an employee account' }, 400)
  }
  if (account_type === 'external' && !body.full_name?.trim()) {
    return json({ error: 'full_name is required for an external account' }, 400)
  }

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

  let full_name = account_type === 'external' ? body.full_name!.trim() : email.split('@')[0]
  let employee: Record<string, unknown> | null = null

  if (account_type === 'employee') {
    const { data: emp, error: empErr } = await admin
      .from('employees')
      .select('id, first_name, last_name, employee_status')
      .eq('id', employee_id)
      .maybeSingle()
    if (empErr || !emp) return json({ error: 'collaborator not found' }, 404)
    employee = emp

    if (emp.employee_status !== 'active' && !body.allow_inactive) {
      return json({ error: 'collaborator is not active — pass allow_inactive to override' }, 409)
    }

    const { data: existing } = await admin
      .from('profiles')
      .select('id')
      .eq('employee_id', employee_id)
      .maybeSingle()
    if (existing) return json({ error: 'this collaborator already has an Index account' }, 409)

    full_name = `${emp.first_name} ${emp.last_name}`.trim()
  }

  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { full_name, role },
  })
  if (error) return json({ error: error.message }, 400)

  // handle_new_user() (setup.sql) inserts the base profile row on the
  // auth.users insert trigger; this follow-up sets the fields that
  // belong to the new account/collaborator relationship. Runs with the
  // service role (no end-user JWT), so it passes the privileged-fields
  // trigger's trusted-server-context check (update27.sql).
  const { error: linkErr } = await admin
    .from('profiles')
    .update({ employee_id: account_type === 'employee' ? employee_id : null, account_type, account_status: 'active' })
    .eq('id', data.user.id)
  if (linkErr) return json({ error: linkErr.message }, 400)

  return json({ user: { id: data.user.id, email: data.user.email }, employee }, 200)
})
