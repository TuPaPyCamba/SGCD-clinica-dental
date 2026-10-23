import { createSupabaseUser } from '../../lib/supabase'
import type { Env } from '../../types/env'

export const pacientesService = {
  async getMisPacientes(env: Env, token: string) {
    const supabase = createSupabaseUser(env, token)
    const { data, error } = await supabase.rpc('rpc_get_mis_pacientes')
    return { data, error: error?.message }
  },

  // Insertar nuevo paciente o familiar en la base de datos
  async createPaciente(env: Env, token: string, pacienteData: any) {
    const supabase = createSupabaseUser(env, token)
    
    // Obtenemos la identidad del usuario para asegurar la propiedad del paciente
    const { data: userData, error: authError } = await supabase.auth.getUser()
    if (authError || !userData?.user) {
      return { data: null, error: 'No se pudo verificar la identidad del token' }
    }

    // Mapeo de camelCase a snake_case e inserción directa en la tabla
    const { data, error } = await supabase
      .schema('clinica')
      .from('pacientes')
      .insert({
        perfil_id: userData.user.id,
        nombre: pacienteData.nombre,
        apellido_paterno: pacienteData.apellidoPaterno,
        apellido_materno: pacienteData.apellidoMaterno || null,
        fecha_nacimiento: pacienteData.fechaNacimiento || null,
        genero: pacienteData.genero || null,
        es_familiar: pacienteData.esFamiliar ?? true,
        familiar_de: pacienteData.familiarDe ?? null  
      })
      .select()

    return { data, error: error?.message }
  },
}
