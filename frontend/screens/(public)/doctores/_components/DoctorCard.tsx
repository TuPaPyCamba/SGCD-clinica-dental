import { Badge } from '@/components/ui/Badge'
import { User, Award } from 'lucide-react'

interface Doctor {
    id: string
    nombre_completo: string
    especialidad: string
    sub_especialidad?: string
    descripcion?: string
    cedula?: string
    orden_display: number
}

interface DoctorCardProps {
    doctor: Doctor
    colorIdx: number
}

const gradients = [
    'from-blue-500 to-primary-700',
    'from-primary-600 to-purple-700',
    'from-teal-500 to-primary-600',
]

export function DoctorCard({ doctor, colorIdx }: DoctorCardProps) {
    const getDoctorImage = (name: string) => {
        if (name.includes('Camba')) return '/doctores/fernando.jpg'
        if (name.includes('Miguel')) return '/doctores/miguel.jpg'
        if (name.includes('Leonardo')) return '/doctores/leonardo.jpg'
        return '/doctores/fernando.jpg'
    }

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
            {/* Photo area */}
            <div className="bg-gray-50 p-8 flex flex-col items-center">
                <div className="w-28 h-28 rounded-full mb-4 group-hover:scale-105 transition-transform overflow-hidden shadow-md">
                    <img
                        src={getDoctorImage(doctor.nombre_completo)}
                        alt={doctor.nombre_completo}
                        className="w-full h-full object-cover"
                    />
                </div>
                <h3 className="font-bold text-gray-900 text-xl text-center">
                    {doctor.nombre_completo}
                </h3>
                <p className="text-primary-600 font-medium text-sm mt-1 text-center">
                    {doctor.especialidad}
                </p>
            </div>

            {/* Content */}
            <div className="p-6">
                {doctor.sub_especialidad && (
                    <Badge variant="info" className="mb-4">
                        {doctor.sub_especialidad}
                    </Badge>
                )}
                {doctor.descripcion && (
                    <p className="text-gray-600 text-sm leading-relaxed">{doctor.descripcion}</p>
                )}
                <div className="mt-5 pt-5 border-t border-gray-100 flex items-center gap-2">
                    <Award className="w-4 h-4 text-gold-500" />
                    <span className="text-xs text-gray-500">
                        Certificado por colegios internacionales
                    </span>
                </div>
            </div>
        </div>
    )
}
