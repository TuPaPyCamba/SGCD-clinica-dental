import Link from 'next/link'
import { CLINIC_INFO } from '@/lib/utils'
import { MapPin, Phone, Mail, Clock, Stethoscope } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-white">SGCD</p>
                <p className="text-xs text-gray-400">Clínica Dental Premium</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 italic">&ldquo;{CLINIC_INFO.slogan}&rdquo;</p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Clínica</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Inicio</Link></li>
              <li><Link href="/doctores/" className="hover:text-white transition-colors">Nuestros Doctores</Link></li>
              <li><Link href="/servicios/" className="hover:text-white transition-colors">Servicios</Link></li>
              <li><Link href="/agendar/" className="hover:text-white transition-colors">Agendar Cita</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contacto</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                <span>{CLINIC_INFO.address}, {CLINIC_INFO.city}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <a href={`tel:${CLINIC_INFO.phone}`} className="hover:text-white">{CLINIC_INFO.phone}</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <a href={`mailto:${CLINIC_INFO.email}`} className="hover:text-white">{CLINIC_INFO.email}</a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-semibold text-white mb-4">Horarios</h3>
            <div className="flex items-center gap-2 text-sm mb-3">
              <Clock className="w-4 h-4 text-primary-400 flex-shrink-0" />
              <span>{CLINIC_INFO.hours}</span>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 text-sm">
              <p className="text-white font-medium mb-2">¿Listo para sonreír?</p>
              <Link href="/agendar/" className="text-primary-400 hover:text-primary-300 font-medium">Agenda tu cita →</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} {CLINIC_INFO.name}. Todos los derechos reservados.</p>
          <p>Proyecto escolar - Ficticio</p>
        </div>
      </div>
    </footer>
  )
}
