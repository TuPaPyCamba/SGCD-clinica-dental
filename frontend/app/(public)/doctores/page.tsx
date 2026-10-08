import type { Metadata } from 'next'
import { DoctoresScreen } from '@/screens/(public)/doctores/DoctoresScreen'

export const metadata: Metadata = {
  title: 'Nuestros Doctores',
  description: 'Conoce al equipo de especialistas dentales de SGCD: Dr. Fernando Camba, Dr. Miguel Ángel Moreno y Dr. Leonardo López Pineda. Expertos en implantes, ortodoncia y estética dental en Polanco.',
  openGraph: {
    title: 'Nuestros Doctores | SGCD Clínica Dental',
    description: 'Especialistas en odontología de alta calidad en Polanco, CDMX',
  },
}

export default function DoctoresPage() {
  return <DoctoresScreen />
}
