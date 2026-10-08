import { createClient } from '@supabase/supabase-js'
import type { Env } from '../types/env'

export function createSupabaseAdmin(env: Env) {
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
    db: { schema: 'clinica' },
  })
}

export function createSupabaseUser(env: Env, accessToken: string) {
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
    db: { schema: 'clinica' },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  })
}

export async function validateToken(
  env: Env,
  token: string
): Promise<{ userId: string; email: string } | null> {
  const supabase = createSupabaseAdmin(env)
  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data.user) return null
  return { userId: data.user.id, email: data.user.email ?? '' }
}
