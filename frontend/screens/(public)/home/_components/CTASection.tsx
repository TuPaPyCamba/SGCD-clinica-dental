import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-900 to-primary-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
          ¿Listo para transformar tu sonrisa?
        </h2>
        <p className="text-primary-100 text-lg mb-8">
          Agenda tu consulta inicial y descubre el plan de tratamiento perfecto para ti.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login/">
            <Button size="lg" variant="gold">Agendar ahora</Button>
          </Link>
          <a href="tel:+525512345678">
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
              Llamar: +52 55 1234 5678
            </Button>
          </a>
        </div>
      </div>
    </section>
  )
}
