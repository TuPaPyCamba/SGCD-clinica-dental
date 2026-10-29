import { createClient } from '@supabase/supabase-js'
import type { Env } from '../types/env'

const DEFAULT_ANON_KEY = 'sb_publishable_Rpy6C_3U04p1Kopzr5cVxw_1gTLvNer'

function getSupabaseKey(env: Env, preferAdmin = false): string {
  if (preferAdmin && env.SUPABASE_SERVICE_ROLE_KEY) {
    return env.SUPABASE_SERVICE_ROLE_KEY
  }
  return env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY || DEFAULT_ANON_KEY
}

export function createSupabaseAdmin(env: Env) {
  return createClient(env.SUPABASE_URL, getSupabaseKey(env, true), {
    auth: { autoRefreshToken: false, persistSession: false },
    db: { schema: 'clinica' },
  })
}

export function createSupabaseUser(env: Env, accessToken: string) {
  return createClient(env.SUPABASE_URL, getSupabaseKey(env, false), {
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
