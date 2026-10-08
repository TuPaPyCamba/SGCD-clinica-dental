import type { Metadata } from 'next'
import { Suspense } from 'react'
import { CitaDetailScreen } from '@/screens/(private)/citas/CitaDetailScreen'

export const metadata: Metadata = {
  title: 'Detalle de Cita',
  description: 'Información detallada de tu cita médica.',
  robots: { index: false, follow: false },
}

export default function CitaDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando cita...</div>}>
      <CitaDetailScreen />
    </Suspense>
  )
}
