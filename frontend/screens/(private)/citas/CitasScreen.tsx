'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { supabase } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/Badge'
import { ESTADO_CITA_LABELS, ESTADO_CITA_COLORS, formatDate, formatTime } from '@/lib/utils'
import { Calendar, Clock, ChevronRight } from 'lucide-react'

interface Cita {
    id: string
    fecha_hora_inicio: string
    fecha_hora_fin: string
    estado: string
    doctor: { nombre_completo: string; especialidad: string }
    procedimiento: { nombre: string; duracion_minutos: number }
    sucursal: { nombre: string; direccion: string; maps_url?: string }
    paciente: { nombre: string; apellido_paterno: string }
}

export function CitasScreen() {
    const [citas, setCitas] = useState<Cita[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [filter, setFilter] = useState<string>('todas')

    useEffect(() => {
        const fetchCitas = async () => {
            try {
                const {
                    data: { session },
                } = await supabase.auth.getSession()
                if (!session) return
                const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL || 'http://localhost:8787'
                const params = filter !== 'todas' ? `?estado=${filter}` : ''
                const res = await fetch(`${workerUrl}/api/citas${params}`, {
                    headers: { Authorization: `Bearer ${session.access_token}` },
                })
                const json = (await res.json()) as { success: boolean; data: Cita[] }
                if (json.success) setCitas(json.data || [])
            } catch (err) {
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchCitas()
    }, [filter])

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
                        <div>
                            <h1 className="font-display text-2xl font-bold text-gray-900">
                                Mis Citas
                            </h1>
                            <p className="text-gray-500 text-sm mt-1">
                                Historial completo de tus citas médicas
                            </p>
                        </div>
                        <Link
                            href="/agendar/"
                            className="bg-primary-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors inline-flex items-center gap-2"
                        >
                            <Calendar className="w-4 h-4" /> Agendar cita
                        </Link>
                    </div>

                    {/* Filter chips */}
                    <div className="flex gap-2 mb-6 overflow-x-auto">
                        {['todas', 'pendiente', 'confirmada', 'completada', 'cancelada'].map(
                            (f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                                        filter === f
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'
                                    }`}
                                >
                                    {f === 'todas' ? 'Todas' : ESTADO_CITA_LABELS[f]}
                                </button>
                            )
                        )}
                    </div>

                    {isLoading ? (
                        <div className="space-y-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="bg-white rounded-2xl p-5 shadow-sm animate-pulse h-24"
                                />
                            ))}
                        </div>
                    ) : citas.length === 0 ? (
                        <div className="text-center py-20">
                            <Calendar className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                            <h3 className="font-semibold text-gray-900 mb-2">
                                Sin citas registradas
                            </h3>
                            <p className="text-gray-500 text-sm mb-4">
                                Agenda tu primera cita con nuestros especialistas
                            </p>
                            <Link
                                href="/agendar/"
                                className="text-primary-600 font-medium text-sm hover:text-primary-700"
                            >
                                Agendar ahora →
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {citas.map((cita) => (
                                <Link
                                    key={cita.id}
                                    href={`/citas/detalle/?id=${cita.id}`}
                                    className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-100 transition-all flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-primary-50 flex flex-col items-center justify-center flex-shrink-0">
                                            <span className="text-primary-700 font-bold text-sm">
                                                {new Date(cita.fecha_hora_inicio).getDate()}
                                            </span>
                                            <span className="text-primary-500 text-xs uppercase">
                                                {new Date(cita.fecha_hora_inicio).toLocaleString(
                                                    'es-MX',
                                                    {
                                                        month: 'short',
                                                    }
                                                )}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {cita.procedimiento.nombre}
                                            </p>
                                            <p className="text-gray-500 text-sm">
                                                {cita.doctor.nombre_completo}
                                            </p>
                                            <p className="text-gray-400 text-xs mt-0.5 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {formatTime(cita.fecha_hora_inicio)} hrs ·{' '}
                                                {cita.sucursal.nombre}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge className={ESTADO_CITA_COLORS[cita.estado]}>
                                            {ESTADO_CITA_LABELS[cita.estado]}
                                        </Badge>
                                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary-400 transition-colors" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    )
}
