'use client'
import Link from 'next/link'
import { useAppStore } from '@/store/useAppStore'
import { formatCurrency } from '@/lib/utils'
import { Clock, ArrowRight } from 'lucide-react'

export function ServiciosPreview() {
  const { procedimientos } = useAppStore()
  const featured = procedimientos.slice(0, 6)

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Catálogo</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Nuestros Servicios
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Ofrecemos tratamientos dentales de la más alta calidad con tecnología de vanguardia.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.length > 0 ? featured.map((proc) => (
            <div key={proc.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-100 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">
                  {proc.categoria_nombre || 'Tratamiento'}
                </span>
                <div className="flex items-center gap-1 text-gray-400 text-xs">
                  <Clock className="w-3.5 h-3.5" />
                  {proc.duracion_minutos / 60}h
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors">{proc.nombre}</h3>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">{proc.descripcion}</p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900">{formatCurrency(proc.precio)}</span>
                <Link href="/agendar/" className="text-primary-600 text-sm font-medium hover:text-primary-700">Agendar →</Link>
              </div>
            </div>
          )) : (
            // Skeleton while loading
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
                <div className="h-5 bg-gray-100 rounded-full w-24 mb-4" />
                <div className="h-6 bg-gray-100 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-full mb-1" />
                <div className="h-4 bg-gray-100 rounded w-2/3 mb-4" />
                <div className="h-5 bg-gray-100 rounded w-20" />
              </div>
            ))
          )}
        </div>

        <div className="text-center mt-10">
          <Link href="/servicios/" className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700">
            Ver todos los servicios <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
