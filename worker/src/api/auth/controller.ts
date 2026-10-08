import type { Context } from 'hono'
import type { Env, Variables } from '../../types/env'
import { authService } from './service'

export async function getMiPerfil(c: Context<{ Bindings: Env; Variables: Variables }>) {
  const token = c.req.header('Authorization')!.slice(7)
  const { data, error } = await authService.getMiPerfil(c.env, token)
  if (error) return c.json({ success: false, error }, 400)
  return c.json({ success: true, data })
}

export async function getAppData(c: Context<{ Bindings: Env; Variables: Variables }>) {
  const { data, error } = await authService.getAppData(c.env)
  if (error) return c.json({ success: false, error }, 500)
  return c.json({ success: true, data })
}
