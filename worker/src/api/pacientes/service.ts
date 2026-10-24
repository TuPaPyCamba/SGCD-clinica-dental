import { createSupabaseAdmin, createSupabaseUser, validateToken } from '../../lib/supabase'
import type { Env } from '../../types/env'
import type { PacienteInput } from '../../types'

export const pacientesService = {
    async getMisPacientes(env: Env, token: string) {
        const supabase = createSupabaseUser(env, token)
        const { data, error } = await supabase.rpc('rpc_get_mis_pacientes')
        return { data, error: error?.message }
    },

    // Insertar nuevo paciente o familiar en la base de datos
    async createPaciente(env: Env, token: string, pacienteData: PacienteInput) {
        const user = await validateToken(env, token)
        if (!user) {
            return { data: null, error: 'Token inválido o expirado' }
        }

        const supabase = createSupabaseAdmin(env)

        // Mapeo de camelCase a snake_case e inserción directa en la tabla con permisos admin
        const { data, error } = await supabase
            .from('pacientes')
            .insert({
                perfil_id: user.userId,
                nombre: pacienteData.nombre,
                apellido_paterno: pacienteData.apellidoPaterno,
                apellido_materno: pacienteData.apellidoMaterno || null,
                fecha_nacimiento: pacienteData.fechaNacimiento || null,
                genero: pacienteData.genero || null,
                telefono: pacienteData.telefono || null,
                email: pacienteData.email || null,
                alergias: pacienteData.alergias || null,
                es_familiar: pacienteData.esFamiliar ?? true,
                familiar_de: pacienteData.familiarDe ?? null,
            })
            .select()
            .single()

        return { data, error: error?.message }
    },
}
