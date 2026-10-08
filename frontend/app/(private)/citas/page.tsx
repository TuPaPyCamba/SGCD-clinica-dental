import type { Metadata } from 'next'
import { CitasScreen } from '@/screens/(private)/citas/CitasScreen'

export const metadata: Metadata = {
  title: 'Mis Citas',
  description: 'Consulta tus citas pasadas y futuras en SGCD Clínica Dental.',
  robots: { index: false, follow: false },
}

export default function CitasPage() {
  return <CitasScreen />
}
