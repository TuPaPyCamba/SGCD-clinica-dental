import type { Context } from 'hono'
import type { Env, Variables } from '../../types/env'
import { pacientesService } from './service'

export async function getPacientes(c: Context<{ Bindings: Env; Variables: Variables }>) {
  const authHeader = c.req.header('Authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : ''
  const { data, error } = await pacientesService.getMisPacientes(c.env, token)
  if (error) return c.json({ success: false, error }, 400)
  return c.json({ success: true, data: data || [] })
}