'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { CLINIC_INFO } from '@/lib/utils'
import { MapPin, Phone, Star, ArrowRight, CheckCircle } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-700/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-600/5 rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <div className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-pulse" />
              <span className="text-white/90 text-sm font-medium">Polanco, Ciudad de México</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Tu sonrisa merece{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-500">
                lo mejor
              </span>
            </h1>

            <p className="text-primary-100 text-lg mb-8 leading-relaxed">
              Clínica dental de alta especialidad en el corazón de Polanco. Tecnología de vanguardia,
              especialistas de clase mundial y una experiencia que transforma tu sonrisa.
            </p>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-4 mb-8">
              {[
                'Más de 5,000 pacientes',
                'Tecnología digital',
                'Atención personalizada',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-primary-100 text-sm">
                  <CheckCircle className="w-4 h-4 text-gold-400 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login/">
                <Button size="lg" variant="gold" className="w-full sm:w-auto">
                  Agendar mi cita
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/servicios/">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto">
                  Ver servicios
                </Button>
              </Link>
            </div>

            {/* Contact quick */}
            <div className="flex items-center gap-6 mt-8 pt-8 border-t border-white/10">
              <a href={`tel:${CLINIC_INFO.phone}`} className="flex items-center gap-2 text-primary-200 hover:text-white transition-colors text-sm">
                <Phone className="w-4 h-4" />
                {CLINIC_INFO.phone}
              </a>
              <div className="flex items-center gap-1 text-primary-200 text-sm">
                <MapPin className="w-4 h-4" />
                Polanco V Sección
              </div>
            </div>
          </div>

          {/* Right side - Cards */}
          <div className="hidden lg:block relative">
            {/* Main card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gold-500/20 flex items-center justify-center">
                  <Star className="w-6 h-6 text-gold-400" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg">Clínica Premium</p>
                  <p className="text-primary-200 text-sm">Polanco, CDMX</p>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Dr. Fernando Camba', esp: 'Cirugía e Implantología' },
                  { label: 'Dr. Miguel Ángel Moreno', esp: 'Ortodoncia Digital' },
                  { label: 'Dr. Leonardo López', esp: 'Endodoncia & Estética' },
                ].map((doc) => (
                  <div key={doc.label} className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm">
                      {doc.label.split(' ')[1][0]}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{doc.label}</p>
                      <p className="text-primary-300 text-xs">{doc.esp}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 bg-gold-500/10 rounded-xl p-4 border border-gold-500/20">
                <p className="text-gold-300 text-sm font-medium">Horarios de atención</p>
                <p className="text-white text-sm mt-1">Lun - Vie · 9:00 - 16:00 hrs</p>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 bg-gold-500 rounded-2xl px-4 py-2 shadow-xl">
              <p className="text-white font-bold text-sm">+15 años</p>
              <p className="text-gold-100 text-xs">de experiencia</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
