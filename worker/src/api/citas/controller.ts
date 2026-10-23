import type { Context } from 'hono'
import type { Env, Variables } from '../../types/env'
import type { CitaInput } from '../../types'
import { citasService } from './service'

export async function getDisponibilidad(c: Context<{ Bindings: Env; Variables: Variables }>) 
{
	// middleware ya lo checo y regreso el token con los datos
	const token = c.req.header('Authorization')!.slice(7)
	/*
	Context = c 
	viene de Hono, que incluye request y response (json es inferido como respuesta)
	express tienes que definir lo que es response (response.json) y el request por separado
	sirve para hacer query de datos desde la solicitud frontend al backend/supabase
	*/
	const doctorID = c.req.query('doctorID') || c.req.query('doctorId')
	const fecha = c.req.query('fecha')
	// parseInt es para conseguir en INT el string
	const duracion = parseInt(c.req.query('duracion') || '60', 10)
	// Si no se reciben los datos del doctor o la fecha
	// Hono gestiona el success, pero para error le mandamos un error code para que este enterado de qué fue el error
	if (!doctorID || !fecha) return c.json({ error: 'Doctor o fecha no recibidos', success: false }, 400)

	// llamada al servicio (service.ts) para sacar la data de la database
	const { data, error } = await citasService.getDisponibilidadDoctor( c.env, token, doctorID, fecha, duracion)
	if (error) return c.json({ error, success: false }, 404)
	return c.json({ data, success: true })
}

export async function getMisCitas(c: Context<{ Bindings: Env; Variables: Variables }>) 
{
	// middleware ya lo checó y regresa el token
	const token = c.req.header('Authorization')!.slice(7)
	
	// Filtro opcional por estado
	const estado = c.req.query('estado')
	
	// limites y el offset
	const limit = parseInt(c.req.query('limit') || '20', 10)
	const offset = parseInt(c.req.query('offset') || '0', 10)

	// Llamada al servicio
	const { data, error } = await citasService.getMisCitas(c.env, token, estado, limit, offset)
	
	if (error) return c.json({ error, success: false }, 400)
	return c.json({ data, success: true }, 200)
}
