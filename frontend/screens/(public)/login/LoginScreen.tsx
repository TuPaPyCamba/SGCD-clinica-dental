'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from '@/lib/supabase/auth'
import { useAuthStore } from '@/store/useAuthStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { CLINIC_INFO } from '@/lib/utils'
import { Stethoscope, Eye, EyeOff } from 'lucide-react'

export function LoginScreen() {
    const [mode, setMode] = useState<'login' | 'register'>('login')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [nombre, setNombre] = useState('')
    const [apellido, setApellido] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const router = useRouter()
    const { initialize } = useAuthStore()

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setIsLoading(true)

        try {
            if (mode === 'login') {
                const { error } = await signInWithEmail(email, password)
                if (error) throw error
                await initialize()
                router.push('/dashboard/')
            } else {
                if (!nombre.trim()) throw new Error('El nombre es requerido')
                const { error } = await signUpWithEmail(email, password, {
                    full_name: nombre,
                    last_name: apellido,
                })
                if (error) throw error
                setSuccess('¡Cuenta creada! Revisa tu email o inicia sesión.')
                setMode('login')
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Ocurrió un error'
            setError(
                message.includes('Invalid login credentials')
                    ? 'Email o contraseña incorrectos'
                    : message.includes('User already registered')
                      ? 'Este email ya está registrado'
                      : message.includes('Password should be')
                        ? 'La contraseña debe tener al menos 6 caracteres'
                        : message
            )
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogle = async () => {
        setError('')
        setIsLoading(true)
        try {
            const { error } = await signInWithGoogle()
            if (error) throw error
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Error con Google')
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-[90vh] flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-br from-primary-900 to-primary-700 px-8 py-8 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
                            <Stethoscope className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="font-display text-2xl font-bold text-white">
                            {CLINIC_INFO.name}
                        </h1>
                        <p className="text-primary-200 text-sm mt-1">{CLINIC_INFO.slogan}</p>
                    </div>

                    <div className="px-8 py-8">
                        {/* Mode tabs */}
                        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
                            <button
                                onClick={() => {
                                    setMode('login')
                                    setError('')
                                    setSuccess('')
                                }}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                                    mode === 'login'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Iniciar sesión
                            </button>
                            <button
                                onClick={() => {
                                    setMode('register')
                                    setError('')
                                    setSuccess('')
                                }}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                                    mode === 'register'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Crear cuenta
                            </button>
                        </div>

                        {/* Google button */}
                        <button
                            onClick={handleGoogle}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50 mb-6"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Continuar con Google
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex-1 h-px bg-gray-200" />
                            <span className="text-xs text-gray-400">o con email</span>
                            <div className="flex-1 h-px bg-gray-200" />
                        </div>

                        {/* Form */}
                        <form onSubmit={handleEmailAuth} className="space-y-4">
                            {mode === 'register' && (
                                <>
                                    <Input
                                        label="Nombre"
                                        type="text"
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                        placeholder="Tu nombre"
                                        required
                                    />
                                    <Input
                                        label="Apellido"
                                        type="text"
                                        value={apellido}
                                        onChange={(e) => setApellido(e.target.value)}
                                        placeholder="Tu apellido"
                                    />
                                </>
                            )}
                            <Input
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu@email.com"
                                required
                            />
                            <div className="relative">
                                <Input
                                    label="Contraseña"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-700">
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 text-sm text-green-700">
                                    {success}
                                </div>
                            )}

                            <Button type="submit" isLoading={isLoading} className="w-full">
                                {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
                            </Button>
                        </form>
                    </div>
                </div>

                <p className="text-center text-sm text-gray-500 mt-6">
                    <Link href="/" className="hover:text-primary-600">
                        ← Volver al inicio
                    </Link>
                </p>
            </div>
        </div>
    )
}
