'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAppStore } from '@/store/useAppStore'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'
import { Clock, ChevronRight, CheckCircle } from 'lucide-react'

const HORARIOS = [
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
]

type Step = 1 | 2 | 3 | 4

export function AgendarScreen() {
    const router = useRouter()
    const { procedimientos, doctores, sucursales, fetchAppData, isLoaded } = useAppStore()
    const [step, setStep] = useState<Step>(1)
    const [selectedProcedimiento, setSelectedProcedimiento] = useState('')
    const [selectedDoctor, setSelectedDoctor] = useState('')
    const [selectedFecha, setSelectedFecha] = useState('')
    const [selectedHora, setSelectedHora] = useState('')
    const [notas, setNotas] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        if (!isLoaded) fetchAppData()
    }, [isLoaded, fetchAppData])

    const proc = procedimientos.find((p) => p.id === selectedProcedimiento)

    // Filtrar doctores que realizan el procedimiento seleccionado
    const doctoresDisponibles = selectedProcedimiento ? doctores : doctores

    const sucursal = sucursales[0]

    // Calcular fecha mínima (mañana)
    const minDate = new Date()
    minDate.setDate(minDate.getDate() + 1)
    const minDateStr = minDate.toISOString().split('T')[0]

    // Deshabilitar fines de semana en el input de fecha
    const isWeekday = (dateStr: string) => {
        const d = new Date(dateStr)
        const day = d.getDay()
        return day !== 0 && day !== 6
    }

    const handleSubmit = async () => {
        if (!selectedProcedimiento || !selectedDoctor || !selectedFecha || !selectedHora) {
            setError('Por favor completa todos los campos')
            return
        }
        if (!isWeekday(selectedFecha)) {
            setError('Solo se atiende de lunes a viernes')
            return
        }
        setIsLoading(true)
        setError('')
        try {
            const {
                data: { session },
            } = await supabase.auth.getSession()
            if (!session) {
                router.push('/login/')
                return
            }

            // Obtener paciente del usuario
            const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL || 'http://localhost:8787'
            const pacRes = await fetch(`${workerUrl}/api/pacientes`, {
                headers: { Authorization: `Bearer ${session.access_token}` },
            })
            const pacJson = (await pacRes.json()) as {
                success: boolean
                data: Array<{ id: string; es_familiar: boolean }>
            }
            const miPaciente = pacJson.data?.find((p) => !p.es_familiar)

            if (!miPaciente) throw new Error('No se encontró tu perfil de paciente')

            const fechaHoraISO = `${selectedFecha}T${selectedHora}:00-06:00`

            const res = await fetch(`${workerUrl}/api/citas`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    pacienteId: miPaciente.id,
                    doctorId: selectedDoctor,
                    procedimientoId: selectedProcedimiento,
                    sucursalId: sucursal.id,
                    fechaHoraInicio: fechaHoraISO,
                    notasCliente: notas || undefined,
                }),
            })
            const json = (await res.json()) as { success: boolean; error?: string }
            if (!json.success) throw new Error(json.error || 'Error al agendar')
            setSuccess(true)
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Error al agendar la cita')
        } finally {
            setIsLoading(false)
        }
    }

    if (success) {
        return (
            <ProtectedRoute>
                <div className="min-h-[80vh] flex items-center justify-center px-4">
                    <div className="text-center max-w-md">
                        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">
                            ¡Cita agendada!
                        </h2>
                        <p className="text-gray-500 mb-6">
                            Tu cita ha sido reservada exitosamente. Te esperamos pronto.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <Button onClick={() => router.push('/citas/')}>Ver mis citas</Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSuccess(false)
                                    setStep(1)
                                    setSelectedProcedimiento('')
                                    setSelectedDoctor('')
                                    setSelectedFecha('')
                                    setSelectedHora('')
                                }}
                            >
                                Agendar otra
                            </Button>
                        </div>
                    </div>
                </div>
            </ProtectedRoute>
        )
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
                    <h1 className="font-display text-2xl font-bold text-gray-900 mb-2">
                        Agendar Cita
                    </h1>
                    <p className="text-gray-500 text-sm mb-8">
                        Elige el procedimiento, doctor, fecha y hora que prefieras.
                    </p>

                    {/* Steps indicator */}
                    <div className="flex items-center gap-2 mb-8">
                        {(['Servicio', 'Doctor', 'Horario', 'Confirmar'] as const).map(
                            (label, i) => (
                                <div key={label} className="flex items-center gap-2 flex-1">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                                            step > i + 1
                                                ? 'bg-green-500 text-white'
                                                : step === i + 1
                                                  ? 'bg-primary-600 text-white'
                                                  : 'bg-gray-200 text-gray-500'
                                        }`}
                                    >
                                        {step > i + 1 ? '✓' : i + 1}
                                    </div>
                                    <span
                                        className={`text-xs font-medium hidden sm:block ${
                                            step === i + 1 ? 'text-primary-700' : 'text-gray-400'
                                        }`}
                                    >
                                        {label}
                                    </span>
                                    {i < 3 && (
                                        <div
                                            className={`flex-1 h-0.5 ${step > i + 1 ? 'bg-green-400' : 'bg-gray-200'}`}
                                        />
                                    )}
                                </div>
                            )
                        )}
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                        {/* STEP 1: Procedimiento */}
                        {step === 1 && (
                            <div>
                                <h2 className="font-bold text-gray-900 mb-5">
                                    ¿Qué servicio necesitas?
                                </h2>
                                <div className="space-y-3">
                                    {procedimientos.map((proc) => (
                                        <button
                                            key={proc.id}
                                            onClick={() => setSelectedProcedimiento(proc.id)}
                                            className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                                                selectedProcedimiento === proc.id
                                                    ? 'border-primary-500 bg-primary-50'
                                                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                                            }`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-semibold text-gray-900">
                                                        {proc.nombre}
                                                    </p>
                                                    <p className="text-gray-500 text-xs mt-0.5 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {proc.duracion_minutos / 60 === 1
                                                            ? '1 hora'
                                                            : `${proc.duracion_minutos / 60} horas`}
                                                        · {proc.categoria_nombre}
                                                    </p>
                                                </div>
                                                <span className="font-bold text-primary-700">
                                                    {formatCurrency(proc.precio)}
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                <Button
                                    className="w-full mt-6"
                                    disabled={!selectedProcedimiento}
                                    onClick={() => setStep(2)}
                                >
                                    Continuar <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                        )}

                        {/* STEP 2: Doctor */}
                        {step === 2 && (
                            <div>
                                <h2 className="font-bold text-gray-900 mb-5">¿Con qué doctor?</h2>
                                <div className="space-y-3">
                                    {doctoresDisponibles.map((doc, idx) => (
                                        <button
                                            key={doc.id}
                                            onClick={() => setSelectedDoctor(doc.id)}
                                            className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                                                selectedDoctor === doc.id
                                                    ? 'border-primary-500 bg-primary-50'
                                                    : 'border-gray-100 hover:border-gray-200'
                                            }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className={`w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white font-bold ${
                                                        [
                                                            'from-blue-500 to-primary-700',
                                                            'from-primary-600 to-purple-700',
                                                            'from-teal-500 to-primary-600',
                                                        ][idx % 3]
                                                    }`}
                                                >
                                                    {doc.nombre_completo.split(' ')[1][0]}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">
                                                        {doc.nombre_completo}
                                                    </p>
                                                    <p className="text-gray-500 text-xs">
                                                        {doc.especialidad}
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-3 mt-6">
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => setStep(1)}
                                    >
                                        Atrás
                                    </Button>
                                    <Button
                                        className="flex-1"
                                        disabled={!selectedDoctor}
                                        onClick={() => setStep(3)}
                                    >
                                        Continuar
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: Fecha y hora */}
                        {step === 3 && (
                            <div>
                                <h2 className="font-bold text-gray-900 mb-5">
                                    ¿Cuándo te gustaría?
                                </h2>
                                <div className="mb-5">
                                    <label className="text-sm font-medium text-gray-700 block mb-2">
                                        Fecha
                                    </label>
                                    <input
                                        type="date"
                                        min={minDateStr}
                                        value={selectedFecha}
                                        onChange={(e) => {
                                            setSelectedFecha(e.target.value)
                                            setSelectedHora('')
                                        }}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">
                                        Atención: lunes a viernes, 9:00 - 16:00
                                    </p>
                                </div>
                                {selectedFecha && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 block mb-3">
                                            Horario disponible
                                        </label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {HORARIOS.filter((h) => {
                                                if (!proc) return true
                                                const [hh, mm] = h.split(':').map(Number)
                                                const totalMin =
                                                    hh * 60 + mm + proc.duracion_minutos
                                                return totalMin <= 16 * 60
                                            }).map((hora) => (
                                                <button
                                                    key={hora}
                                                    onClick={() => setSelectedHora(hora)}
                                                    className={`py-2 rounded-xl text-sm font-medium transition-all ${
                                                        selectedHora === hora
                                                            ? 'bg-primary-600 text-white'
                                                            : 'bg-gray-100 text-gray-600 hover:bg-primary-50 hover:text-primary-700'
                                                    }`}
                                                >
                                                    {hora}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className="mt-5">
                                    <label className="text-sm font-medium text-gray-700 block mb-2">
                                        Notas adicionales (opcional)
                                    </label>
                                    <textarea
                                        value={notas}
                                        onChange={(e) => setNotas(e.target.value)}
                                        rows={3}
                                        placeholder="Alergias, síntomas, preferencias..."
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none text-sm"
                                    />
                                </div>
                                <div className="flex gap-3 mt-5">
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => setStep(2)}
                                    >
                                        Atrás
                                    </Button>
                                    <Button
                                        className="flex-1"
                                        disabled={!selectedFecha || !selectedHora}
                                        onClick={() => setStep(4)}
                                    >
                                        Continuar
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* STEP 4: Confirmar */}
                        {step === 4 && (
                            <div>
                                <h2 className="font-bold text-gray-900 mb-5">Confirma tu cita</h2>
                                <div className="space-y-3 mb-6">
                                    {[
                                        { label: 'Servicio', value: proc?.nombre || '' },
                                        {
                                            label: 'Doctor',
                                            value:
                                                doctores.find((d) => d.id === selectedDoctor)
                                                    ?.nombre_completo || '',
                                        },
                                        { label: 'Fecha', value: selectedFecha },
                                        { label: 'Hora', value: `${selectedHora} hrs` },
                                        {
                                            label: 'Duración',
                                            value: proc
                                                ? `${proc.duracion_minutos / 60 === 1 ? '1 hora' : `${proc.duracion_minutos / 60} horas`}`
                                                : '',
                                        },
                                        {
                                            label: 'Precio',
                                            value: proc ? formatCurrency(proc.precio) : '',
                                        },
                                    ].map(({ label, value }) => (
                                        <div
                                            key={label}
                                            className="flex justify-between items-center py-2 border-b border-gray-50"
                                        >
                                            <span className="text-gray-500 text-sm">{label}</span>
                                            <span className="font-semibold text-gray-900 text-sm">
                                                {value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                {error && (
                                    <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-700 mb-4">
                                        {error}
                                    </div>
                                )}
                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => setStep(3)}
                                    >
                                        Atrás
                                    </Button>
                                    <Button
                                        className="flex-1"
                                        isLoading={isLoading}
                                        onClick={handleSubmit}
                                    >
                                        Confirmar cita
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    )
}
