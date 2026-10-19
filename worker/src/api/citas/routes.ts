import { Hono } from 'hono'
import { authMiddleware } from '../../middlewares/auth.middleware.ts'
import type { Env, Variables } from '../../types/env'
import { getDisponibilidad } from './controller.ts'


export const citasRoutes = Hono<{ Bindings: Env; Variables: Variables }>()

citasRoutes.use('*', authMiddleware)

// Consultar disponibilad de horarios para las citas
citasRoutes.get('/disponibilidad', getDisponibilidad)