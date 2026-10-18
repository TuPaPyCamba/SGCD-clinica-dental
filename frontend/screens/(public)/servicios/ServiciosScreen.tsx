'use client'
import { useEffect, useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { ServicioCard } from './_components/ServicioCard'

export function ServiciosScreen() {
    const { procedimientos, fetchAppData, isLoaded } = useAppStore()
    const [selectedCat, setSelectedCat] = useState<string>('todos')

    useEffect(() => {
        if (!isLoaded) fetchAppData()
    }, [isLoaded, fetchAppData])

    const categorias = [
        'todos',
        ...Array.from(new Set(procedimientos.map((p) => p.categoria_nombre || 'General'))),
    ]

    const filtered =
        selectedCat === 'todos'
            ? procedimientos
            : procedimientos.filter((p) => (p.categoria_nombre || 'General') === selectedCat)

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="bg-gradient-to-br from-primary-900 to-primary-700 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-gold-300 font-semibold text-sm uppercase tracking-wider">
                        Catálogo
                    </span>
                    <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mt-2 mb-4">
                        Nuestros Servicios
                    </h1>
                    <p className="text-primary-100 max-w-2xl mx-auto">
                        Ofrecemos una amplia gama de tratamientos dentales con tecnología de punta y
                        precios transparentes.
                    </p>
                </div>
            </div>

            {/* Filter */}
            <div className="sticky top-16 bg-white border-b border-gray-100 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        {categorias.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCat(cat)}
                                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                                    selectedCat === cat
                                        ? 'bg-primary-600 text-white shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {procedimientos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((proc) => (
                            <ServicioCard key={proc.id} servicio={proc} />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-2xl p-6 shadow-sm border animate-pulse"
                            >
                                <div className="h-4 bg-gray-100 rounded w-24 mb-4" />
                                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                                <div className="h-4 bg-gray-100 rounded w-full mb-1" />
                                <div className="h-4 bg-gray-100 rounded w-2/3 mb-4" />
                                <div className="h-6 bg-gray-200 rounded w-20" />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
