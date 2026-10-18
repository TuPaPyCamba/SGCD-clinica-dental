import { create } from 'zustand'

interface Doctor {
    id: string
    nombre_completo: string
    especialidad: string
    sub_especialidad?: string
    descripcion?: string
    foto_url?: string
    activo: boolean
    orden_display: number
}

interface Procedimiento {
    id: string
    nombre: string
    descripcion?: string
    descripcion_larga?: string
    duracion_minutos: number
    precio: number
    activo: boolean
    imagen_url?: string
    orden_display: number
    categoria_nombre?: string
}

interface Sucursal {
    id: string
    nombre: string
    direccion: string
    colonia: string
    ciudad: string
    telefono?: string
    email?: string
    maps_url?: string
    horario_apertura: string
    horario_cierre: string
}

interface AppState {
    doctores: Doctor[]
    procedimientos: Procedimiento[]
    sucursales: Sucursal[]
    isLoaded: boolean
    isLoading: boolean
    setAppData: (data: {
        doctores: Doctor[]
        procedimientos: Procedimiento[]
        sucursales: Sucursal[]
    }) => void
    setLoading: (loading: boolean) => void
    fetchAppData: () => Promise<void>
}

export const useAppStore = create<AppState>()((set) => ({
    doctores: [],
    procedimientos: [],
    sucursales: [],
    isLoaded: false,
    isLoading: false,

    setAppData: (data) => set({ ...data, isLoaded: true }),
    setLoading: (isLoading) => set({ isLoading }),

    fetchAppData: async () => {
        set({ isLoading: true })
        try {
            const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL || 'http://localhost:8787'
            const response = await fetch(`${workerUrl}/api/auth/app-data`)
            const json = (await response.json()) as {
                success: boolean
                data: {
                    doctores: Doctor[]
                    procedimientos: Procedimiento[]
                    sucursales: Sucursal[]
                }
            }
            if (json.success && json.data) {
                set({
                    doctores: json.data.doctores || [],
                    procedimientos: json.data.procedimientos || [],
                    sucursales: json.data.sucursales || [],
                    isLoaded: true,
                })
            }
        } catch (error) {
            console.error('Error fetching app data:', error)
        } finally {
            set({ isLoading: false })
        }
    },
}))
