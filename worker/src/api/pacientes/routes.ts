import { Hono } from 'hono'
import { authMiddleware } from '../../middlewares/auth.middleware'
import type { Env, Variables } from '../../types/env'
import { getPacientes } from './controller'

export const pacientesRoutes = new Hono<{ Bindings: Env; Variables: Variables }>()

pacientesRoutes.use('*', authMiddleware)
pacientesRoutes.get('/', getPacientes)
