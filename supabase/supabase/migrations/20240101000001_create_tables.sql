SET search_path TO clinica, extensions;

-- ENUMS
CREATE TYPE clinica.rol_usuario AS ENUM ('cliente', 'empleado', 'administrador', 'doctor');
CREATE TYPE clinica.estado_cita AS ENUM ('pendiente', 'confirmada', 'en_proceso', 'completada', 'cancelada', 'no_asistio');
CREATE TYPE clinica.duracion_procedimiento AS ENUM ('1_hora', '2_horas', '3_horas');
CREATE TYPE clinica.genero AS ENUM ('masculino', 'femenino', 'otro', 'prefiero_no_decir');

-- perfiles
CREATE TABLE clinica.perfiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  nombre TEXT NOT NULL,
  apellido_paterno TEXT NOT NULL DEFAULT '',
  apellido_materno TEXT,
  telefono TEXT,
  fecha_nacimiento DATE,
  genero clinica.genero,
  avatar_url TEXT,
  rol clinica.rol_usuario NOT NULL DEFAULT 'cliente',
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- doctores
CREATE TABLE clinica.doctores (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  perfil_id UUID REFERENCES clinica.perfiles(id) ON DELETE SET NULL,
  nombre_completo TEXT NOT NULL,
  cedula_profesional TEXT,
  especialidad TEXT NOT NULL,
  sub_especialidad TEXT,
  descripcion TEXT,
  foto_url TEXT,
  email_contacto TEXT,
  telefono_contacto TEXT,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  orden_display INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- sucursales
CREATE TABLE clinica.sucursales (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  nombre TEXT NOT NULL,
  direccion TEXT NOT NULL,
  colonia TEXT NOT NULL,
  ciudad TEXT NOT NULL DEFAULT 'Ciudad de México',
  estado TEXT NOT NULL DEFAULT 'CDMX',
  codigo_postal TEXT NOT NULL,
  telefono TEXT,
  email TEXT,
  maps_url TEXT,
  horario_apertura TIME NOT NULL DEFAULT '09:00',
  horario_cierre TIME NOT NULL DEFAULT '16:00',
  dias_atencion TEXT[] NOT NULL DEFAULT ARRAY['Lunes','Martes','Miércoles','Jueves','Viernes'],
  activa BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- categorias_procedimiento
CREATE TABLE clinica.categorias_procedimiento (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  nombre TEXT NOT NULL UNIQUE,
  descripcion TEXT,
  icono TEXT,
  orden_display INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- procedimientos
CREATE TABLE clinica.procedimientos (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  categoria_id UUID REFERENCES clinica.categorias_procedimiento(id),
  nombre TEXT NOT NULL,
  descripcion TEXT,
  descripcion_larga TEXT,
  duracion clinica.duracion_procedimiento NOT NULL DEFAULT '1_hora',
  duracion_minutos INTEGER NOT NULL DEFAULT 60,
  precio NUMERIC(10,2) NOT NULL,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  imagen_url TEXT,
  orden_display INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- doctor_procedimiento
CREATE TABLE clinica.doctor_procedimiento (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  doctor_id UUID NOT NULL REFERENCES clinica.doctores(id) ON DELETE CASCADE,
  procedimiento_id UUID NOT NULL REFERENCES clinica.procedimientos(id) ON DELETE CASCADE,
  UNIQUE(doctor_id, procedimiento_id)
);

-- pacientes
CREATE TABLE clinica.pacientes (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  perfil_id UUID REFERENCES clinica.perfiles(id) ON DELETE SET NULL,
  nombre TEXT NOT NULL,
  apellido_paterno TEXT NOT NULL,
  apellido_materno TEXT,
  fecha_nacimiento DATE,
  genero clinica.genero,
  telefono TEXT,
  email TEXT,
  alergias TEXT,
  notas_medicas TEXT,
  es_familiar BOOLEAN NOT NULL DEFAULT FALSE,
  familiar_de UUID REFERENCES clinica.pacientes(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- citas
CREATE TABLE clinica.citas (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  paciente_id UUID NOT NULL REFERENCES clinica.pacientes(id),
  doctor_id UUID NOT NULL REFERENCES clinica.doctores(id),
  procedimiento_id UUID NOT NULL REFERENCES clinica.procedimientos(id),
  sucursal_id UUID NOT NULL REFERENCES clinica.sucursales(id),
  agendado_por UUID NOT NULL REFERENCES clinica.perfiles(id),
  fecha_hora_inicio TIMESTAMPTZ NOT NULL,
  fecha_hora_fin TIMESTAMPTZ NOT NULL,
  estado clinica.estado_cita NOT NULL DEFAULT 'pendiente',
  notas_cliente TEXT,
  notas_internas TEXT,
  resumen_doctor TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- configuracion_clinica
CREATE TABLE clinica.configuracion_clinica (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  clave TEXT NOT NULL UNIQUE,
  valor TEXT NOT NULL,
  descripcion TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- horarios_bloqueados
CREATE TABLE clinica.horarios_bloqueados (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  doctor_id UUID REFERENCES clinica.doctores(id) ON DELETE CASCADE,
  fecha_inicio TIMESTAMPTZ NOT NULL,
  fecha_fin TIMESTAMPTZ NOT NULL,
  motivo TEXT,
  aplica_todos_doctores BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDEXES
CREATE INDEX idx_citas_doctor_fecha ON clinica.citas(doctor_id, fecha_hora_inicio);
CREATE INDEX idx_citas_paciente ON clinica.citas(paciente_id);
CREATE INDEX idx_citas_estado ON clinica.citas(estado);
CREATE INDEX idx_citas_agendado_por ON clinica.citas(agendado_por);
CREATE INDEX idx_perfiles_rol ON clinica.perfiles(rol);
CREATE INDEX idx_pacientes_perfil ON clinica.pacientes(perfil_id);
CREATE INDEX idx_procedimientos_categoria ON clinica.procedimientos(categoria_id);
