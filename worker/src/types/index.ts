export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  meta?: { total?: number; page?: number; limit?: number }
}

export interface CitaInput {
  pacienteId: string
  doctorId: string
  procedimientoId: string
  sucursalId: string
  fechaHoraInicio: string
  notasCliente?: string
}

export interface PacienteInput {
  nombre: string
  apellidoPaterno: string
  apellidoMaterno?: string
  fechaNacimiento?: string
  genero?: 'masculino' | 'femenino' | 'otro' | 'prefiero_no_decir'
  telefono?: string
  email?: string
  alergias?: string
  esFamiliar?: boolean
  familiarDe?: string
}
