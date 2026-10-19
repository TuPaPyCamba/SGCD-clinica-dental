import { CLINIC_INFO } from '@/lib/utils'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export function UbicacionSection() {
    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
                            Ubicación
                        </span>
                        <h2 className="font-display text-3xl font-bold text-gray-900 mt-2 mb-6">
                            Encuéntranos en Polanco
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4 bg-white rounded-2xl p-4 shadow-sm">
                                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-5 h-5 text-primary-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">Dirección</p>
                                    <p className="text-gray-500 text-sm">{CLINIC_INFO.address}</p>
                                    <p className="text-gray-500 text-sm">{CLINIC_INFO.city}</p>
                                    <a
                                        href={CLINIC_INFO.mapsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary-600 text-sm font-medium mt-1 inline-block hover:text-primary-700"
                                    >
                                        Ver en Google Maps →
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm">
                                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                                    <Clock className="w-5 h-5 text-primary-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">Horarios</p>
                                    <p className="text-gray-500 text-sm">{CLINIC_INFO.hours}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm">
                                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                                    <Phone className="w-5 h-5 text-primary-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">Teléfono</p>
                                    <a
                                        href={`tel:${CLINIC_INFO.phone}`}
                                        className="text-gray-500 text-sm hover:text-primary-600"
                                    >
                                        {CLINIC_INFO.phone}
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm">
                                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-5 h-5 text-primary-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">Email</p>
                                    <a
                                        href={`mailto:${CLINIC_INFO.email}`}
                                        className="text-gray-500 text-sm hover:text-primary-600"
                                    >
                                        {CLINIC_INFO.email}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden h-80 lg:h-96 flex items-center justify-center">
                        <div className="text-center px-8">
                            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <MapPin className="w-8 h-8 text-primary-500" />
                            </div>
                            <p className="font-bold text-gray-900">Polanco V Sección</p>
                            <p className="text-gray-500 text-sm mt-1">
                                Av. Presidente Masaryk 123, Piso 3
                            </p>
                            <a
                                href={CLINIC_INFO.mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block mt-4 bg-primary-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors"
                            >
                                Abrir en Maps
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
