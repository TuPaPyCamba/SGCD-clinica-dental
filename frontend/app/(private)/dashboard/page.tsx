import type { Metadata } from 'next'
import { DashboardScreen } from '@/screens/(private)/dashboard/DashboardScreen'

export const metadata: Metadata = {
  title: 'Mi Dashboard',
  description: 'Gestiona tus citas, pacientes y datos de tu cuenta en SGCD Clínica Dental.',
  robots: { index: false, follow: false },
}

export default function DashboardPage() {
  return <DashboardScreen />
}
