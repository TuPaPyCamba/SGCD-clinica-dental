'use client'
import Link from 'next/link'
import { useAppStore } from '@/store/useAppStore'
import { User } from 'lucide-react'

export function DoctoresPreview() {
  const { doctores } = useAppStore()

  const colors = ['from-blue-500 to-primary-700', 'from-primary-600 to-purple-700', 'from-teal-500 to-primary-600']

  const getDoctorImage = (name: string) => {
    if (name.includes('Camba')) return '/doctores/fernando.jpg'
    if (name.includes('Miguel')) return '/doctores/miguel.jpg'
    if (name.includes('Leonardo')) return '/doctores/leonardo.jpg'
    return '/doctores/fernando.jpg'
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Equipo</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Nuestros Especialistas
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Profesionales con posgrados internacionales y años de experiencia transformando sonrisas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {doctores.length > 0 ? doctores.map((doc, idx) => (
            <div key={doc.id} className="text-center group">
              <div className="w-32 h-32 rounded-3xl mx-auto mb-5 shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300 overflow-hidden">
                <img src={getDoctorImage(doc.nombre_completo)} alt={doc.nombre_completo} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">{doc.nombre_completo}</h3>
              <p className="text-primary-600 font-medium text-sm mt-1">{doc.especialidad}</p>
              {doc.sub_especialidad && <p className="text-gray-400 text-xs mt-0.5">{doc.sub_especialidad}</p>}
              {doc.descripcion && <p className="text-gray-500 text-sm mt-3 line-clamp-3">{doc.descripcion}</p>}
            </div>
          )) : (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="text-center animate-pulse">
                <div className="w-32 h-32 rounded-3xl bg-gray-200 mx-auto mb-5" />
                <div className="h-5 bg-gray-200 rounded w-40 mx-auto mb-2" />
                <div className="h-4 bg-gray-100 rounded w-28 mx-auto" />
              </div>
            ))
          )}
        </div>

        <div className="text-center mt-10">
          <Link href="/doctores/" className="text-primary-600 font-semibold hover:text-primary-700">
            Conocer al equipo →
          </Link>
        </div>
      </div>
    </section>
  )
}
