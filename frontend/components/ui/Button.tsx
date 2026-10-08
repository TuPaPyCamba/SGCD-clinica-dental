import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gold'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export function Button({ variant = 'primary', size = 'md', isLoading, className, children, disabled, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-lg hover:shadow-primary-200',
    secondary: 'bg-primary-50 text-primary-700 hover:bg-primary-100 focus:ring-primary-400',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    gold: 'bg-gold-500 text-white hover:bg-gold-600 focus:ring-gold-400 shadow-lg',
  }
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg',
  }
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} disabled={disabled || isLoading} {...props}>
      {isLoading ? (
        <><span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />Cargando...</>
      ) : children}
    </button>
  )
}
