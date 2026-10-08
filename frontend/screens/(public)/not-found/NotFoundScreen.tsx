import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Home, Search } from 'lucide-react'

export function NotFoundScreen() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="w-24 h-24 rounded-3xl bg-primary-50 flex items-center justify-center mx-auto mb-6">
          <Search className="w-12 h-12 text-primary-400" />
        </div>
        <h1 className="font-display text-6xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-3">Página no encontrada</h2>
        <p className="text-gray-500 mb-8">
          Lo sentimos, la página que buscas no existe o ha sido movida. Regresa al inicio o explora nuestros servicios.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="primary">
              <Home className="w-4 h-4 mr-2" /> Ir al inicio
            </Button>
          </Link>
          <Link href="/servicios/">
            <Button variant="outline">Ver servicios</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
