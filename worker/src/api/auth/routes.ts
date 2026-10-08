import { Hono } from 'hono'
import { getMiPerfil, getAppData } from './controller'
import { authMiddleware } from '../../middlewares/auth.middleware'
import type { Env, Variables } from '../../types/env'

/**
 * /api/auth
 * GET /api/auth/me       - Perfil del usuario autenticado
 * GET /api/auth/app-data - Datos iniciales (público)
 */
export const authRoutes = new Hono<{ Bindings: Env; Variables: Variables }>()
authRoutes.get('/me', authMiddleware, getMiPerfil)
authRoutes.get('/app-data', getAppData)
