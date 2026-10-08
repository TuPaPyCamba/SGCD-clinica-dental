import { createMiddleware } from 'hono/factory'
import { validateToken } from '../lib/supabase'
import type { Env, Variables } from '../types/env'

export const authMiddleware = createMiddleware<{ Bindings: Env; Variables: Variables }>(
  async (c, next) => {
    const authHeader = c.req.header('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ success: false, error: 'Token de autenticación requerido' }, 401)
    }
    const token = authHeader.slice(7)
    const user = await validateToken(c.env, token)
    if (!user) {
      return c.json({ success: false, error: 'Token inválido o expirado' }, 401)
    }
    c.set('userId', user.userId)
    await next()
  }
)

export const optionalAuthMiddleware = createMiddleware<{ Bindings: Env; Variables: Variables }>(
  async (c, next) => {
    const authHeader = c.req.header('Authorization')
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7)
      const user = await validateToken(c.env, token)
      if (user) c.set('userId', user.userId)
    }
    await next()
  }
)
