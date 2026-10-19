'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { supabase } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ESTADO_CITA_LABELS, ESTADO_CITA_COLORS, formatDate, formatTime } from '@/lib/utils'
import { Calendar, Clock, User, MapPin, FileText, ArrowLeft, AlertCircle } from 'lucide-react'

interface Cita {
    id: string
    fecha_hora_inicio: string
    fecha_hora_fin: string
    estado: string
    notas_cliente?: string
    resumen_doctor?: string
    doctor: { nombre_completo: string; especialidad: string }
    procedimiento: { nombre: string; duracion_minutos: number }
    sucursal: { nombre: string; direccion: string; maps_url?: string }
    paciente: { nombre: string; apellido_paterno: string }
}

export function CitaDetailScreen() {
    const searchParams = useSearchParams()
    const citaId = searchParams.get('id')
    const [cita, setCita] = useState<Cita | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isCancelling, setIsCancelling] = useState(false)
    const [cancelDone, setCancelDone] = useState(false)

    useEffect(() => {
        const fetchCita = async () => {
            try {
                const {
                    data: { session },
                } = await supabase.auth.getSession()
                if (!session) return
                const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL || 'http://localhost:8787'
                const res = await fetch(`${workerUrl}/api/citas/${citaId}`, {
                    headers: { Authorization: `Bearer ${session.access_token}` },
                })
                const json = (await res.json()) as { success: boolean; data: Cita }
                if (json.success) setCita(json.data)
            } catch (err) {
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchCita()
    }, [citaId])

    const handleCancel = async () => {
        if (!citaId || !confirm('¿Estás seguro de cancelar esta cita?')) return
        setIsCancelling(true)
        try {
            const {
                data: { session },
            } = await supabase.auth.getSession()
            if (!session) return
            const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL || 'http://localhost:8787'
            const res = await fetch(`${workerUrl}/api/citas/${citaId}/cancelar`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ motivo: 'Cancelada por el cliente' }),
            })
            const json = (await res.json()) as { success: boolean }
            if (json.success) {
                setCancelDone(true)
                setCita((prev) => (prev ? { ...prev, estado: 'cancelada' } : null))
            }
        } catch (err) {
            console.error(err)
        } finally {
            setIsCancelling(false)
        }
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
                    <Link
                        href="/citas/"
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" /> Volver a mis citas
                    </Link>

                    {isLoading ? (
                        <div className="bg-white rounded-3xl p-8 animate-pulse">
                            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4" />
                            <div className="space-y-3">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="h-12 bg-gray-100 rounded-xl" />
                                ))}
                            </div>
                        </div>
                    ) : !cita ? (
                        <div className="bg-white rounded-3xl p-12 text-center">
                            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">Cita no encontrada</p>
                            <Link
                                href="/citas/"
                                className="text-primary-600 text-sm mt-3 inline-block"
                            >
                                Ver mis citas
                            </Link>
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            {/* Header */}
                            <div className="bg-gradient-to-br from-primary-900 to-primary-700 p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h1 className="font-bold text-white text-xl">
                                            {cita.procedimiento.nombre}
                                        </h1>
                                        <p className="text-primary-200 text-sm mt-1">
                                            {cita.paciente.nombre} {cita.paciente.apellido_paterno}
                                        </p>
                                    </div>
                                    <Badge className={ESTADO_CITA_COLORS[cita.estado]}>
                                        {ESTADO_CITA_LABELS[cita.estado]}
                                    </Badge>
                                </div>
                            </div>

                            <div className="p-6 space-y-5">
                                {/* Info cards */}
                                {[
                                    {
                                        icon: Calendar,
                                        label: 'Fecha y hora',
                                        value: `${formatDate(cita.fecha_hora_inicio, 'PPPP')} · ${formatTime(cita.fecha_hora_inicio)} - ${formatTime(cita.fecha_hora_fin)} hrs`,
                                    },
                                    {
                                        icon: User,
                                        label: 'Doctor',
                                        value: `${cita.doctor.nombre_completo} · ${cita.doctor.especialidad}`,
                                    },
                                    {
                                        icon: Clock,
                                        label: 'Duración',
                                        value: `${cita.procedimiento.duracion_minutos / 60 === 1 ? '1 hora' : `${cita.procedimiento.duracion_minutos / 60} horas`}`,
                                    },
                                    {
                                        icon: MapPin,
                                        label: 'Sucursal',
                                        value: `${cita.sucursal.nombre} · ${cita.sucursal.direccion}`,
                                        link: cita.sucursal.maps_url,
                                    },
                                ].map(({ icon: Icon, label, value, link }) => (
                                    <div
                                        key={label}
                                        className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                                            <Icon className="w-5 h-5 text-primary-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-medium">
                                                {label}
                                            </p>
                                            {link ? (
                                                <a
                                                    href={link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-gray-900 text-sm font-medium hover:text-primary-600"
                                                >
                                                    {value}
                                                </a>
                                            ) : (
                                                <p className="text-gray-900 text-sm font-medium">
                                                    {value}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {/* Notas del cliente */}
                                {cita.notas_cliente && (
                                    <div className="p-4 bg-blue-50 rounded-2xl">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FileText className="w-4 h-4 text-blue-600" />
                                            <span className="text-blue-700 text-xs font-semibold">
                                                Tus notas
                                            </span>
                                        </div>
                                        <p className="text-blue-900 text-sm">
                                            {cita.notas_cliente}
                                        </p>
                                    </div>
                                )}

                                {/* Resumen del doctor */}
                                {cita.resumen_doctor && (
                                    <div className="p-4 bg-green-50 rounded-2xl">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FileText className="w-4 h-4 text-green-600" />
                                            <span className="text-green-700 text-xs font-semibold">
                                                Resumen del doctor
                                            </span>
                                        </div>
                                        <p className="text-green-900 text-sm">
                                            {cita.resumen_doctor}
                                        </p>
                                    </div>
                                )}

                                {/* Cancel button */}
                                {!['cancelada', 'completada', 'no_asistio'].includes(cita.estado) &&
                                    !cancelDone && (
                                        <Button
                                            variant="danger"
                                            className="w-full"
                                            isLoading={isCancelling}
                                            onClick={handleCancel}
                                        >
                                            Cancelar cita
                                        </Button>
                                    )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    )
}
