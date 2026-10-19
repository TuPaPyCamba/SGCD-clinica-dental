'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { cn, CLINIC_INFO } from '@/lib/utils'
import { useAuthStore } from '@/store/useAuthStore'
import { Button } from '@/components/ui/Button'
import { Menu, X, Stethoscope, ChevronDown, LogOut, User, Calendar } from 'lucide-react'

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const pathname = usePathname()
    const { isAuthenticated, perfil, signOut } = useAuthStore()

    const publicLinks = [
        { href: '/', label: 'Inicio' },
        { href: '/doctores/', label: 'Doctores' },
        { href: '/servicios/', label: 'Servicios' },
    ]

    const handleSignOut = async () => {
        await signOut()
        setDropdownOpen(false)
        window.location.href = '/'
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center shadow-md group-hover:shadow-primary-200 transition-all">
                            <Stethoscope className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 text-sm leading-tight">SGCD</p>
                            <p className="text-xs text-gray-500 leading-tight">Clínica Dental</p>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {publicLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                                    pathname === link.href
                                        ? 'text-primary-700 bg-primary-50'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Auth section */}
                    <div className="hidden md:flex items-center gap-3">
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-sm font-bold">
                                        {perfil?.nombre?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">
                                        {perfil?.nombre || 'Mi cuenta'}
                                    </span>
                                    <ChevronDown
                                        className={cn(
                                            'w-4 h-4 text-gray-400 transition-transform',
                                            dropdownOpen && 'rotate-180'
                                        )}
                                    />
                                </button>
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                                        <Link
                                            href="/dashboard/"
                                            onClick={() => setDropdownOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            <User className="w-4 h-4 text-gray-400" /> Mi perfil
                                        </Link>
                                        <Link
                                            href="/citas/"
                                            onClick={() => setDropdownOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            <Calendar className="w-4 h-4 text-gray-400" /> Mis citas
                                        </Link>
                                        <Link
                                            href="/agendar/"
                                            onClick={() => setDropdownOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary-600 hover:bg-primary-50 font-medium"
                                        >
                                            <Calendar className="w-4 h-4 text-primary-500" />{' '}
                                            Agendar cita
                                        </Link>
                                        <hr className="my-2 border-gray-100" />
                                        <button
                                            onClick={handleSignOut}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full"
                                        >
                                            <LogOut className="w-4 h-4" /> Cerrar sesión
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link href="/login/">
                                    <Button variant="ghost" size="sm">
                                        Iniciar sesión
                                    </Button>
                                </Link>
                                <Link href="/login/">
                                    <Button size="sm">Agendar cita</Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                    >
                        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 py-3 px-4">
                    {publicLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="block py-2.5 text-gray-700 font-medium hover:text-primary-600"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <hr className="my-3 border-gray-100" />
                    {isAuthenticated ? (
                        <>
                            <Link
                                href="/dashboard/"
                                onClick={() => setIsOpen(false)}
                                className="block py-2.5 text-gray-700 font-medium"
                            >
                                Mi perfil
                            </Link>
                            <Link
                                href="/citas/"
                                onClick={() => setIsOpen(false)}
                                className="block py-2.5 text-gray-700 font-medium"
                            >
                                Mis citas
                            </Link>
                            <button
                                onClick={() => {
                                    handleSignOut()
                                    setIsOpen(false)
                                }}
                                className="block py-2.5 text-red-600 font-medium w-full text-left"
                            >
                                Cerrar sesión
                            </button>
                        </>
                    ) : (
                        <Link href="/login/" onClick={() => setIsOpen(false)}>
                            <Button className="w-full mt-2">Iniciar sesión</Button>
                        </Link>
                    )}
                </div>
            )}
        </nav>
    )
}
