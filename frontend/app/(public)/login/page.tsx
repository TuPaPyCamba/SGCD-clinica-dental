import type { Metadata } from 'next'
import { LoginScreen } from '@/screens/(public)/login/LoginScreen'

export const metadata: Metadata = {
  title: 'Iniciar sesión',
  description: 'Accede a tu cuenta de SGCD Clínica Dental para gestionar tus citas y datos médicos.',
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return <LoginScreen />
}
