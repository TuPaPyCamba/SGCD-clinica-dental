import { createSupabaseUser } from '../../lib/supabase'
import type { Env } from '../../types/env'

export const citasService = {
    // request a supabase para conseguir la data de disponibildad del doctor
    async getDisponibilidadDoctor(
        env: Env,
        token: string,
        doctorID: string,
        fecha: string,
        duracionMins: number
    ) {
        // definicion de usuario de supabase sin privilegios
        const supabase = createSupabaseUser(env, token)
        // consigue la info en una llamada a la base de datos
        /* p_doctor_id etc es una traducción de TS a SQL */
        const { data, error } = await supabase.rpc('rpc_get_disponibilidad', {
            p_doctor_id: doctorID,
            p_fecha: fecha,
            p_duracion_minutos: duracionMins,
        })
        // regresamos la data a la función que solicitó este servicio, y el error si existe
        return { data, error: error?.message }
    },
    // cancela una cita (la base de datos valida los permisos)
    async cancelarCita(env: Env, token: string, citaId: string, motivo: string | null) {
        const supabase = createSupabaseUser(env, token)
        const { data, error } = await supabase.rpc('rpc_cancelar_cita', {
            p_cita_id: citaId,
            p_motivo: motivo,
        })
        return { data, error: error?.message }
    },

    // request para listar las citas
    async getMisCitas(
        env: Env,
        token: string,
        estado: string | undefined,
        limit: number,
        offset: number
    ) {
        const supabase = createSupabaseUser(env, token)

        // Llamada a la RPC
        const { data, error } = await supabase.rpc('rpc_get_mis_citas', {
            p_estado: estado || null,
            p_limit: limit,
            p_offset: offset,
        })

        return { data, error: error?.message }
    },

    // request a supabase para agendar una nueva cita
    async agendarCita(
        env: Env,
        token: string,
        pacienteId: string,
        doctorId: string,
        procedimientoId: string,
        sucursalId: string,
        fechaHoraInicio: string,
        notasCliente?: string
    ) {
        const supabase = createSupabaseUser(env, token)

        const { data, error } = await supabase.rpc('rpc_agendar_cita', {
            p_paciente_id: pacienteId,
            p_doctor_id: doctorId,
            p_procedimiento_id: procedimientoId,
            p_sucursal_id: sucursalId,
            p_fecha_hora_inicio: fechaHoraInicio,
            p_notas_cliente: notasCliente || null,
        })

        return { data, error: error?.message }
    },

    // request a supabase para subir el resumen médico y completar la cita
    async subirResumen(env: Env, token: string, citaId: string, resumen: string) {
        const supabase = createSupabaseUser(env, token)

        const { data, error } = await supabase.rpc('rpc_doctor_subir_resumen', {
            p_cita_id: citaId,
            p_resumen: resumen,
        })

        return { data, error: error?.message }
    },

    // request a supabase para conseguir el detalle de una sola cita
    async getCitaById(env: Env, token: string, citaId: string) {
        const supabase = createSupabaseUser(env, token)

        // Llamamos a la RPC con un límite amplio (limit)
        const { data, error } = await supabase.rpc('rpc_get_mis_citas', {
            p_estado: null,
            p_limit: 100,
            p_offset: 0,
        })

        if (error) return { data: null, error: error.message }

        // Buscamos la cita específica, si no regresa la cita es porque no existe o el id no corresponde al usuario actual
        const cita = data?.find((c: any) => c.id === citaId)

        if (!cita) return { data: null, error: 'Cita no encontrada o sin autorización para verla' }

        return { data: cita, error: null }
    },
}
