import { Hono } from 'hono'
import { authMiddleware } from '../../middlewares/auth.middleware'
import type { Env, Variables } from '../../types/env'
import { getDisponibilidad } from './controller'

export const citasRoutes = new Hono<{ Bindings: Env; Variables: Variables }>()

citasRoutes.use('*', authMiddleware)

// Consultar disponibilidad de horarios para las citas
citasRoutes.get('/disponibilidad', getDisponibilidad)

// Listar historial y citas próximas del usuario autenticado
citasRoutes.get('/', getMisCitas)