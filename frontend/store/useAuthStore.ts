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
                        let perfil = get().perfil
                        try {
                            const { data, error } = await supabase.rpc('rpc_get_mi_perfil')
                            if (data && !error) {
                                perfil = data
                            } else {
                                const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL || 'http://localhost:8787'
                                const res = await fetch(`${workerUrl}/api/auth/me`, {
                                    headers: { Authorization: `Bearer ${session.access_token}` },
                                })
                                const json = (await res.json()) as { success: boolean; data: PerfilUsuario }
                                if (json.success && json.data) perfil = json.data
                            }
                        } catch (rpcErr) {
                            console.warn('No se pudo obtener perfil detallado:', rpcErr)
                        }
                        set({ session, user: session.user, perfil, isAuthenticated: true })
                    } else {
                        set({ session: null, user: null, perfil: null, isAuthenticated: false })
                    }
                } catch (error) {
                    console.error('Error initializing auth:', error)
                    set({ session: null, user: null, perfil: null, isAuthenticated: false })
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

if (typeof window !== 'undefined') {
    supabase.auth.onAuthStateChange(async (event, session) => {
        if (session) {
            useAuthStore.getState().setSession(session)
            useAuthStore.getState().setUser(session.user)
            try {
                const { data, error } = await supabase.rpc('rpc_get_mi_perfil')
                if (data && !error) {
                    useAuthStore.getState().setPerfil(data)
                } else {
                    const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL || 'http://localhost:8787'
                    const res = await fetch(`${workerUrl}/api/auth/me`, {
                        headers: { Authorization: `Bearer ${session.access_token}` },
                    })
                    const json = (await res.json()) as { success: boolean; data: PerfilUsuario }
                    if (json.success && json.data) useAuthStore.getState().setPerfil(json.data)
                }
            } catch {
                // Ignore fallback
            }
            useAuthStore.getState().setLoading(false)
        } else if (event === 'SIGNED_OUT') {
            useAuthStore.getState().reset()
        }
    })
}
