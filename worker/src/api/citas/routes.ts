import { Hono } from 'hono'
import { authMiddleware } from '../../middlewares/auth.middleware'
import type { Env, Variables } from '../../types/env'
import {
    agendarCita,
    cancelarCita,
    getCita,
    getDisponibilidad,
    getMisCitas,
    subirResumen,
} from './controller'

export const citasRoutes = new Hono<{ Bindings: Env; Variables: Variables }>()

citasRoutes.use('*', authMiddleware)

// Consultar disponibilidad de horarios para las citas
citasRoutes.get('/disponibilidad', getDisponibilidad)

// Cancelar una cita
citasRoutes.patch('/:id/cancelar', cancelarCita)

// Listar historial y citas prximas del usuario autenticado
citasRoutes.get('/', getMisCitas)

// Agendar nueva cita
citasRoutes.post('/', agendarCita)

// Cargar Resumen Mdico y Completar Consulta
citasRoutes.post('/:id/resumen', subirResumen)

// Obtener detalle individual de una cita
citasRoutes.get('/:id', getCita)
