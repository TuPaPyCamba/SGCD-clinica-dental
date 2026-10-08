# SGCD - Base de Datos Supabase

Configuración de Supabase local. Schema: `clinica` (NO `public`).

## Inicio
```bash
supabase start
supabase db reset  # Aplica migraciones + seed
# Studio: http://localhost:54323
```

## Migraciones
- `000000`: Schema y extensiones
- `000001`: Tablas principales
- `000002`: RLS Policies  
- `000003`: Funciones RPC
- `000004`: Triggers

## Seguridad
- RLS activo en todas las tablas
- Acceso SQL directo deshabilitado para usuarios
- Solo RPC como interfaz con la BD
