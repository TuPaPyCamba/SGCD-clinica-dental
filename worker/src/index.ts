import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import { authRoutes } from './api/auth/routes'
import { citasRoutes } from './api/citas/routes'
import { pacientesRoutes } from './api/pacientes/routes'
import type { Env } from './types/env'

const app = new Hono<{ Bindings: Env }>()

app.use('*', logger())
app.use('*', prettyJSON())
app.use('*', async (c, next) => {
  return cors({
    origin: c.env.CORS_ORIGIN || 'http://localhost:3000',
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  })(c, next)
})

app.get('/', (c) => c.json({ status: 'ok', service: 'SGCD Worker', version: '1.0.0', timestamp: new Date().toISOString() }))
app.get('/health', (c) => c.json({ status: 'healthy', timestamp: new Date().toISOString() }))

app.route('/api/auth', authRoutes)
app.route('/api/citas', citasRoutes)
app.route('/api/pacientes', pacientesRoutes)

app.notFound((c) => c.json({ success: false, error: 'Endpoint no encontrado', path: c.req.path }, 404))
app.onError((err, c) => {
  console.error(`Error en ${c.req.path}:`, err)
  return c.json({ success: false, error: err.message || 'Error interno' }, 500)
})

export default app
