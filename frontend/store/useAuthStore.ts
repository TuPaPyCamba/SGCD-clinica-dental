import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'

interface PerfilUsuario {
    id: string
    email: string
    nombre: string
    apellido_paterno: string
    apellido_materno?: string
    telefono?: string
    avatar_url?: string
    rol: 'cliente' | 'empleado' | 'administrador' | 'doctor'
    activo: boolean
}

interface AuthState {
    user: User | null
    session: Session | null
    perfil: PerfilUsuario | null
    isLoading: boolean
    isAuthenticated: boolean
    setUser: (user: User | null) => void
    setSession: (session: Session | null) => void
    setPerfil: (perfil: PerfilUsuario | null) => void
    setLoading: (loading: boolean) => void
    initialize: () => Promise<void>
    signOut: () => Promise<void>
    reset: () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            session: null,
            perfil: null,
            isLoading: true,
            isAuthenticated: false,

            setUser: (user) => set({ user, isAuthenticated: !!user }),
            setSession: (session) => set({ session }),
            setPerfil: (perfil) => set({ perfil }),
            setLoading: (isLoading) => set({ isLoading }),

            initialize: async () => {
                set({ isLoading: true })
                try {
                    const {
                        data: { session },
                    } = await supabase.auth.getSession()
                    if (session) {
                        set({ session, user: session.user, isAuthenticated: true })
                    } else {
                        set({ session: null, user: null, isAuthenticated: false })
                    }
                } catch (error) {
                    console.error('Error initializing auth:', error)
                    set({ session: null, user: null, isAuthenticated: false })
                } finally {
                    set({ isLoading: false })
                }
            },

            signOut: async () => {
                await supabase.auth.signOut()
                set({ user: null, session: null, perfil: null, isAuthenticated: false })
            },

            reset: () =>
                set({
                    user: null,
                    session: null,
                    perfil: null,
                    isLoading: false,
                    isAuthenticated: false,
                }),
        }),
        {
            name: 'sgcd-auth',
            partialize: (state) => ({ perfil: state.perfil }),
        }
    )
)
