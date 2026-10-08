import { createSupabaseAdmin, createSupabaseUser } from '../../lib/supabase'
import type { Env } from '../../types/env'

export const authService = {
  async getMiPerfil(env: Env, token: string) {
    const supabase = createSupabaseUser(env, token)
    const { data, error } = await supabase.rpc('rpc_get_mi_perfil')
    return { data, error: error?.message }
  },
  async getAppData(env: Env) {
    const supabase = createSupabaseAdmin(env)
    const { data, error } = await supabase.rpc('rpc_get_app_initial_data')
    return { data, error: error?.message }
  },
}
