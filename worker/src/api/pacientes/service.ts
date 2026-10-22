import { createSupabaseUser } from '../../lib/supabase'
import type { Env } from '../../types/env'

export const pacientesService = {
  async getMisPacientes(env: Env, token: string) {
    const supabase = createSupabaseUser(env, token)
    const { data, error } = await supabase.rpc('rpc_get_mis_pacientes')
    return { data, error: error?.message }
  },
}
