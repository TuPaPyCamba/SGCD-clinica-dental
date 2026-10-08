import type { Metadata } from 'next'
import { AgendarScreen } from '@/screens/(private)/agendar/AgendarScreen'

export const metadata: Metadata = {
  title: 'Agendar Cita',
  description: 'Agenda tu cita dental con nuestros especialistas en SGCD Clínica Dental.',
  robots: { index: false, follow: false },
}

export default function AgendarPage() {
  return <AgendarScreen />
}
