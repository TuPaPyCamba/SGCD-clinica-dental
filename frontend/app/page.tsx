import type { Metadata } from 'next'
import { HomeScreen } from '@/screens/(public)/home/HomeScreen'
import { CLINIC_INFO } from '@/lib/utils'

export const metadata: Metadata = {
    title: `${CLINIC_INFO.name} - Tu sonrisa, nuestra pasión`,
    description:
        'Clínica dental premium en Polanco, CDMX. Especialistas en implantes, ortodoncia, blanqueamiento dental y más. Dr. Fernando Camba, Dr. Miguel Ángel Moreno, Dr. Leonardo López Pineda.',
    openGraph: {
        title: `${CLINIC_INFO.name}`,
        description: 'Clínica dental premium en Polanco, CDMX',
    },
}

export default function HomePage() {
    return <HomeScreen />
}
