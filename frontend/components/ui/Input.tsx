import { cn } from '@/lib/utils'
import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    helperText?: string
}

export function Input({ label, error, helperText, className, id, ...props }: InputProps) {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={cn(
                    'w-full px-4 py-3 rounded-xl border bg-white text-gray-900 placeholder-gray-400',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                    'transition-all duration-200',
                    error
                        ? 'border-red-400 focus:ring-red-400'
                        : 'border-gray-200 hover:border-gray-300',
                    className
                )}
                {...props}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            {helperText && !error && <p className="text-sm text-gray-500">{helperText}</p>}
        </div>
    )
}
