# SGCD - Sistema de Gestión de Consultorio Dental

Monorepo para el sistema de gestión de la Clínica Dental Premium en Polanco, CDMX.

## Estructura

```
SGCD-clinica-dental/
├── frontend/          # Next.js - Cloudflare Pages
├── worker/            # Hono.js - Cloudflare Workers  
└── supabase/          # Base de datos local Supabase
```

## Inicio rápido

### Supabase local
```bash
cd supabase
npx supabase start
```

### Worker (Hono)
```bash
cd worker && npm install && npm run dev
```

### Frontend (Next.js)
```bash
cd frontend && npm install && npm run dev
```

## Stack
- **Frontend**: Next.js 15 (static export) + Tailwind CSS + Zustand + Supabase Auth
- **Backend**: Hono.js en Cloudflare Workers
- **Base de datos**: Supabase (PostgreSQL) - schema `clinica`
- **Autenticación**: Supabase Auth (Email/Password + Google OAuth)
- **Comunicación Front↔Back**: Cloudflare Service Bindings
