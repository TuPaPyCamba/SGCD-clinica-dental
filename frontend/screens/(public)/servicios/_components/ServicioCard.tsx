import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import { Clock, ArrowRight } from 'lucide-react'

interface ServicioCardProps {
  servicio: {
    id: string
    nombre: string
    descripcion?: string
    descripcion_larga?: string
    duracion_minutos: number
    precio: number
    categoria_nombre?: string
  }
}

export function ServicioCard({ servicio }: ServicioCardProps) {
  const durHoras = servicio.duracion_minutos / 60
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary-100 transition-all group p-6">
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs font-medium text-primary-700 bg-primary-50 px-2.5 py-1 rounded-full">
          {servicio.categoria_nombre || 'Tratamiento'}
        </span>
        <div className="flex items-center gap-1 text-gray-400 text-xs">
          <Clock className="w-3.5 h-3.5" />
          {durHoras === 1 ? '1 hora' : `${durHoras} horas`}
        </div>
      </div>
      <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-primary-700 transition-colors">
        {servicio.nombre}
      </h3>
      <p className="text-gray-500 text-sm mb-4 line-clamp-3">
        {servicio.descripcion_larga || servicio.descripcion}
      </p>
      <div className="flex justify-between items-center pt-4 border-t border-gray-50">
        <div>
          <span className="text-xs text-gray-400">Desde</span>
          <p className="font-bold text-gray-900 text-lg">{formatCurrency(servicio.precio)}</p>
        </div>
        <Link href="/agendar/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700">
          Agendar <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}
