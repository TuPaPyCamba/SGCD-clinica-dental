import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CLINIC_INFO } from '@/lib/utils'

export const metadata: Metadata = {
  title: {
    default: CLINIC_INFO.name,
    template: `%s | ${CLINIC_INFO.name}`,
  },
  description: `${CLINIC_INFO.name} - ${CLINIC_INFO.slogan}. Especialistas en odontología de alta calidad en Polanco, Ciudad de México.`,
  keywords: ['clínica dental', 'dentista', 'Polanco', 'CDMX', 'implantes', 'ortodoncia', 'blanqueamiento'],
  authors: [{ name: CLINIC_INFO.name }],
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    siteName: CLINIC_INFO.name,
    title: CLINIC_INFO.name,
    description: `${CLINIC_INFO.slogan} - Clínica dental premium en Polanco, CDMX`,
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans bg-white">
        <Navbar />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
