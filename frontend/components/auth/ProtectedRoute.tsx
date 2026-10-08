'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRol?: 'cliente' | 'empleado' | 'administrador' | 'doctor'
}

export function ProtectedRoute({ children, requiredRol }: ProtectedRouteProps) {
  const router = useRouter()
  const { isAuthenticated, isLoading, perfil } = useAuthStore()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace('/login/')
        return
      }
      if (requiredRol && perfil?.rol !== requiredRol) {
        const adminRoles = ['administrador', 'empleado', 'doctor']
        if (!adminRoles.includes(perfil?.rol || '')) {
          router.replace('/dashboard/')
        }
      }
    }
  }, [isAuthenticated, isLoading, perfil, requiredRol, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) return null

  return <>{children}</>
}
