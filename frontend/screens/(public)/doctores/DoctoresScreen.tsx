'use client'
import { useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { DoctorCard } from './_components/DoctorCard'
import { Award, Users, Star } from 'lucide-react'

export function DoctoresScreen() {
  const { doctores, fetchAppData, isLoaded } = useAppStore()

  useEffect(() => {
    if (!isLoaded) fetchAppData()
  }, [isLoaded, fetchAppData])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-900 to-primary-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-gold-300 font-semibold text-sm uppercase tracking-wider">Nuestro equipo</span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mt-2 mb-4">
            Especialistas de Clase Mundial
          </h1>
          <p className="text-primary-100 max-w-2xl mx-auto text-lg">
            Cada uno de nuestros doctores cuenta con formación internacional y años de experiencia
            en sus respectivas especialidades.
          </p>
        </div>
      </div>

      {/* Credenciales */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Award, label: 'Formación internacional', desc: 'Posgrados en UNAM, Michigan y Madrid' },
              { icon: Users, label: '+5,000 pacientes', desc: 'Tratados con excelencia' },
              { icon: Star, label: 'Miembros activos', desc: 'De asociaciones profesionales internacionales' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{label}</p>
                  <p className="text-gray-500 text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Doctores */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {doctores.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {doctores.map((doc, idx) => <DoctorCard key={doc.id} doctor={doc} colorIdx={idx} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 shadow-sm animate-pulse">
                <div className="w-24 h-24 rounded-2xl bg-gray-200 mb-6" />
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-1/2 mb-4" />
                <div className="space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-full" />
                  <div className="h-3 bg-gray-100 rounded w-5/6" />
                  <div className="h-3 bg-gray-100 rounded w-4/6" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
