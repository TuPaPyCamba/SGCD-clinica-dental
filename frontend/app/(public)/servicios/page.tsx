import type { Metadata } from 'next'
import { ServiciosScreen } from '@/screens/(public)/servicios/ServiciosScreen'

export const metadata: Metadata = {
  title: 'Nuestros Servicios',
  description: 'Catálogo completo de servicios dentales: implantes, ortodoncia, blanqueamiento, carillas de porcelana, endodoncia y más. Precios transparentes en SGCD Clínica Dental Premium.',
  openGraph: {
    title: 'Servicios Dentales | SGCD Clínica Dental',
    description: 'Catálogo de procedimientos con precios - Polanco, CDMX',
  },
}

export default function ServiciosPage() {
  return <ServiciosScreen />
}
