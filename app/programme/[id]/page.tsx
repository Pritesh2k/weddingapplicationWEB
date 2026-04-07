'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'
import { useNavigate } from '@/context/NavigationContext'
import { btnPrimary } from '@/lib/theme'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import ProgrammeHeader from '@/components/Programme/Header/component'
import HeroCard from '@/components/Programme/HeroCard/component'
import PlanningModules from '@/components/Programme/PlanningModules/component'
import Timeline from '@/components/Programme/Timeline/component'
import PrioritiesCard from '@/components/Programme/PrioritiesCard/component'
import DetailsCard from '@/components/Programme/DetailsCard/component'
import type { Programme } from '@/lib/Programme/types'

gsap.registerPlugin(ScrollTrigger)

export default function ProgrammePage() {
    const params = useParams()
    const { T, darkMode } = useTheme()
    const { navigate } = useNavigate()
    const progId = Array.isArray(params.id) ? params.id[0] : params.id as string

    const [programme, setProgramme] = useState<Programme | null>(null)
    const [ready, setReady] = useState(false)
    const [notFound, setNotFound] = useState(false)
    const mainRef = useRef<HTMLElement>(null)

    const handleProgrammeChange = (updated: Programme) => {
        setProgramme(updated)
    }

    useEffect(() => {
        if (!progId) { setNotFound(true); setReady(true); return }
        try {
            const list: Programme[] = JSON.parse(localStorage.getItem('vow-programmes') || '[]')
            const found = list.find((p) => p.id === progId)
            found ? setProgramme(found) : setNotFound(true)
        } catch { setNotFound(true) }
        setReady(true)
    }, [progId])

    useEffect(() => {
        if (!ready || !programme || !mainRef.current) return
        const ctx = gsap.context(() => {
            gsap.from('.vow-section', {
                opacity: 0, y: 24, duration: 0.55,
                ease: 'power3.out', stagger: 0.09, clearProps: 'all',
            })
        }, mainRef)
        return () => ctx.revert()
    }, [ready, programme])

    if (!ready) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: T.bg }}>
                <div className="w-6 h-6 rounded-full animate-pulse" style={{ background: btnPrimary.bg }} />
            </div>
        )
    }

    if (notFound || !programme) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
                style={{ backgroundColor: T.bg }}>
                <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5"
                    style={{ backgroundColor: T.surface, border: `1px solid ${T.borderSubtle}` }}
                >
                    💍
                </div>
                <h1 className="text-lg font-bold mb-2" style={{ color: T.textPrimary }}>Programme not found</h1>
                <p className="text-sm mb-7 max-w-xs" style={{ color: T.textMuted }}>
                    This programme may have been deleted or the link is invalid.
                </p>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold
                     hover:scale-[1.02] transition-all duration-200 focus:outline-none"
                    style={{ background: btnPrimary.bg, boxShadow: btnPrimary.shadow, color: btnPrimary.color }}
                >
                    Back to Dashboard
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen font-sans antialiased" style={{ backgroundColor: T.bg, color: T.textPrimary }}>
            {/* Ambient bg */}
            <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} aria-hidden>
                <div className="absolute inset-0" style={{ background: T.heroBg }} />
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-175 h-125 rounded-full blur-3xl"
                    style={{ background: T.heroGlow }}
                />
            </div>

            <ProgrammeHeader />

            <main
                ref={mainRef}
                className="relative max-w-2xl mx-auto px-3 sm:px-4 md:px-6
                   pt-6 sm:pt-8 md:pt-10 pb-20 sm:pb-24 space-y-6 sm:space-y-8"
                style={{ zIndex: 10 }}
            >
                <HeroCard programme={programme} onChange={handleProgrammeChange} />
                <PlanningModules />
                <Timeline subEvents={programme.subEvents} />

                {/* Priorities + Details side by side */}
                <div className="vow-section grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <PrioritiesCard priorities={programme.priorities} />
                    <DetailsCard programme={programme} />
                </div>
            </main>
        </div>
    )
}