import { createSupabaseUser } from '../../lib/supabase'
import type { Env } from '../../types/env'
import type { CitaInput } from '../../types'


export const citasService = { 
	// request a supabase para conseguir la data de disponibildad del doctor
	async getDisponibilidadDoctor( env: Env, token: string, doctorID: string, fecha: string, duracionMins: number)
	{
		// definicion de usuario de supabase sin privilegios
		const supabase = createSupabaseUser(env, token)
		// consigue la info en una llamada a la base de datos 
		/* p_doctor_id etc es una traducción de TS a SQL */
		const { data, error } = await supabase.rpc('rpc_get_disponibilidad', { p_doctor_id: doctorID, p_fecha: fecha, p_duracion_minutos: duracionMins })
		// regresamos la data a la función que solicitó este servicio, y el error si existe
		return { data, error: error?.message }
	}

	async getMisCitas(env: Env, token: string, estado: string | undefined, limit: number, offset: number)
	{
		const supabase = createSupabaseUser(env, token)
		
		// Llamada a la RPC
		const { data, error } = await supabase.rpc('rpc_get_mis_citas', { 
			p_estado: estado || null, 
			p_limit: limit, 
			p_offset: offset 
		})
		
		return { data, error: error?.message }
	}
}