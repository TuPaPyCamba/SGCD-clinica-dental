import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, formatStr = 'PPP') {
    return format(new Date(date), formatStr, { locale: es })
}

export function formatCurrency(amount: number) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
    }).format(amount)
}

export function formatTime(date: string | Date) {
    return format(new Date(date), 'HH:mm', { locale: es })
}

export const CLINIC_INFO = {
    name: 'SGCD Clínica Dental Premium',
    slogan: 'Tu sonrisa, nuestra pasión',
    address: 'Av. Presidente Masaryk 123, Piso 3, Polanco V Sección',
    city: 'Ciudad de México, CDMX 11560',
    phone: '+52 55 1234 5678',
    email: 'contacto@sgcd.mx',
    mapsUrl: 'https://maps.google.com/?q=Av.+Presidente+Masaryk+123+Polanco+CDMX',
    instagram: '@sgcd.dental',
    facebook: 'SGCD Clínica Dental',
    hours: 'Lunes a Viernes, 9:00 - 16:00',
}

export const ESTADO_CITA_LABELS: Record<string, string> = {
    pendiente: 'Pendiente',
    confirmada: 'Confirmada',
    en_proceso: 'En proceso',
    completada: 'Completada',
    cancelada: 'Cancelada',
    no_asistio: 'No asistió',
}

export const ESTADO_CITA_COLORS: Record<string, string> = {
    pendiente: 'bg-yellow-100 text-yellow-800',
    confirmada: 'bg-blue-100 text-blue-800',
    en_proceso: 'bg-purple-100 text-purple-800',
    completada: 'bg-green-100 text-green-800',
    cancelada: 'bg-red-100 text-red-800',
    no_asistio: 'bg-gray-100 text-gray-800',
}
