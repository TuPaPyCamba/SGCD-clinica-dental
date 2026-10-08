import type { Metadata } from 'next'
import { CitaDetailScreen } from '@/screens/(private)/citas/CitaDetailScreen'

export const metadata: Metadata = {
  title: 'Detalle de Cita',
  description: 'Información detallada de tu cita médica.',
  robots: { index: false, follow: false },
}

export default function CitaDetailPage({ params }: { params: { id: string } }) {
  return <CitaDetailScreen citaId={params.id} />
}
