import type { Metadata } from 'next'
import { NotFoundScreen } from '@/screens/(public)/not-found/NotFoundScreen'

export const metadata: Metadata = {
  title: 'Página no encontrada',
  description: 'La página que buscas no existe.',
  robots: { index: false, follow: false },
}

export default function NotFoundPage() {
  return <NotFoundScreen />
}
