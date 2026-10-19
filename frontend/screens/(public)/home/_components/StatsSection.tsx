export function StatsSection() {
    const stats = [
        { value: '+5,000', label: 'Pacientes atendidos' },
        { value: '3', label: 'Especialistas certificados' },
        { value: '15+', label: 'Años de experiencia' },
        { value: '98.7%', label: 'Tasa de éxito en implantes' },
    ]

    return (
        <section className="bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat) => (
                        <div key={stat.label} className="text-center">
                            <p className="font-display text-3xl sm:text-4xl font-bold text-primary-700">
                                {stat.value}
                            </p>
                            <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
