'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuthStore } from '@/store/useAuthStore'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ESTADO_CITA_LABELS, ESTADO_CITA_COLORS, formatDate, formatTime } from '@/lib/utils'
import { Calendar, User, Clock, Plus, ChevronRight } from 'lucide-react'

interface Cita {
  id: string
  fecha_hora_inicio: string
  fecha_hora_fin: string
  estado: string
  doctor: { nombre_completo: string; especialidad: string }
  procedimiento: { nombre: string }
  sucursal: { nombre: string; direccion: string }
  paciente: { nombre: string; apellido_paterno: string }
}

export function DashboardScreen() {
  const { perfil, user } = useAuthStore()
  const [citas, setCitas] = useState<Cita[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return
        const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL || 'http://localhost:8787'
        const res = await fetch(`${workerUrl}/api/citas?limit=5`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        })
        const json = await res.json() as { success: boolean; data: Cita[] }
        if (json.success) setCitas(json.data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCitas()
  }, [])

  const citasFuturas = citas.filter((c) => new Date(c.fecha_hora_inicio) > new Date() && c.estado !== 'cancelada')
  const citasPasadas = citas.filter((c) => new Date(c.fecha_hora_inicio) <= new Date())

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome */}
          <div className="bg-gradient-to-br from-primary-900 to-primary-700 rounded-3xl p-8 mb-8 text-white">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold">
                  ¡Hola, {perfil?.nombre || user?.email?.split('@')[0]}! 👋
                </h1>
                <p className="text-primary-100 mt-1">Bienvenido a tu área personal de SGCD</p>
              </div>
              <Link href="/agendar/">
                <Button variant="gold">
                  <Plus className="w-4 h-4 mr-2" /> Agendar cita
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
              <div className="bg-white/10 rounded-2xl p-4">
                <p className="text-2xl font-bold">{citasFuturas.length}</p>
                <p className="text-primary-200 text-sm">Citas próximas</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-4">
                <p className="text-2xl font-bold">{citasPasadas.length}</p>
                <p className="text-primary-200 text-sm">Citas pasadas</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 hidden sm:block">
                <p className="text-lg font-bold capitalize">{perfil?.rol || 'Cliente'}</p>
                <p className="text-primary-200 text-sm">Tipo de cuenta</p>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { href: '/agendar/', icon: Calendar, label: 'Agendar cita', desc: 'Reserva con nuestros especialistas', color: 'text-primary-600 bg-primary-50' },
              { href: '/citas/', icon: Clock, label: 'Mis citas', desc: 'Ver historial completo', color: 'text-purple-600 bg-purple-50' },
              { href: '/servicios/', icon: User, label: 'Servicios', desc: 'Catálogo de procedimientos', color: 'text-gold-600 bg-gold-50' },
            ].map(({ href, icon: Icon, label, desc, color }) => (
              <Link key={href} href={href} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-100 transition-all flex items-center gap-4 group">
                <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">{label}</p>
                  <p className="text-gray-500 text-xs">{desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-primary-400 transition-colors" />
              </Link>
            ))}
          </div>

          {/* Próximas citas */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-bold text-gray-900 text-lg">Próximas citas</h2>
              <Link href="/citas/" className="text-primary-600 text-sm font-medium hover:text-primary-700">Ver todas →</Link>
            </div>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : citasFuturas.length > 0 ? (
              <div className="space-y-3">
                {citasFuturas.map((cita) => (
                  <Link key={cita.id} href={`/citas/detalle?id=${cita.id}/`}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-primary-50 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{cita.procedimiento.nombre}</p>
                        <p className="text-gray-500 text-xs">{cita.doctor.nombre_completo} · {formatDate(cita.fecha_hora_inicio, 'PP')} {formatTime(cita.fecha_hora_inicio)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={ESTADO_CITA_COLORS[cita.estado]}>{ESTADO_CITA_LABELS[cita.estado]}</Badge>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary-400" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No tienes citas próximas</p>
                <Link href="/agendar/" className="text-primary-600 text-sm font-medium mt-2 inline-block">Agendar ahora →</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
