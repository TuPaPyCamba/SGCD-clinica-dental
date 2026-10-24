import { Hono } from 'hono'
import { authMiddleware } from '../../middlewares/auth.middleware'
import type { Env, Variables } from '../../types/env'
import { createPaciente, getPacientes } from './controller'

export const pacientesRoutes = new Hono<{ Bindings: Env; Variables: Variables }>()

// Middleware de autenticación
pacientesRoutes.use('*', authMiddleware)

// Obtener todos los pacientes del usuario logueado
pacientesRoutes.get('/', getPacientes)

// Registrar Paciente
pacientesRoutes.post('/', createPaciente)
