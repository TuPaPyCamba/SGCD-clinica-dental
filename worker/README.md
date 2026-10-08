# SGCD Worker - Hono.js API

Backend API con Hono.js para Cloudflare Workers.

## Estructura
```
src/
├── index.ts          # Entry point + middlewares globales
├── types/env.ts      # Types de bindings
├── types/index.ts    # Types compartidos
├── lib/supabase.ts   # Cliente Supabase
├── middlewares/
│   └── auth.middleware.ts
└── api/
    ├── auth/         # routes.ts | controller.ts | service.ts
    ├── citas/
    ├── procedimientos/
    ├── doctores/
    └── pacientes/
```

## Dev
```bash
npm install
# Crear .dev.vars:
# SUPABASE_URL=http://localhost:54321
# SUPABASE_SERVICE_ROLE_KEY=<key>
# CORS_ORIGIN=http://localhost:3000
npm run dev
# http://localhost:8787
```
