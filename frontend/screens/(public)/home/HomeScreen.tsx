'use client'
import Link from 'next/link'
import { useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { CLINIC_INFO, formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { HeroSection } from './_components/HeroSection'
import { StatsSection } from './_components/StatsSection'
import { DoctoresPreview } from './_components/DoctoresPreview'
import { ServiciosPreview } from './_components/ServiciosPreview'
import { UbicacionSection } from './_components/UbicacionSection'
import { CTASection } from './_components/CTASection'

export function HomeScreen() {
    const { fetchAppData, isLoaded } = useAppStore()

    useEffect(() => {
        if (!isLoaded) fetchAppData()
    }, [isLoaded, fetchAppData])

    return (
        <div className="min-h-screen">
            <HeroSection />
            <StatsSection />
            <ServiciosPreview />
            <DoctoresPreview />
            <UbicacionSection />
            <CTASection />
        </div>
    )
}
