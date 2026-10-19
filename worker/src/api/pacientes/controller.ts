import { supabase } from './../../../../frontend/lib/supabase/client';
import type { Context } from 'hono'
import type { Env, Variables} from '../../types/env'
import { createSupabaseUser } from '../../lib/supabase'

export async function getPacientes(c: Context) {
  const token = c.req.header("Authorization")!.slice(7)
  const supabase = createSupabaseUser(c.env,token)
  const {data, error} = await supabase.rpc('rpc_get_mis_pacientes')
  if (error) return c.json({success: false, error: error.message}, 400)
    return c.json({succes: true, data: data || []})
}