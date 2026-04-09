'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'
import { useNavigate } from '@/context/NavigationContext'
import { useAuth } from '@/context/Auth/AuthContext'       // ← NEW
import { supabase } from '@/DB/client'                     // ← NEW
import { btnPrimary } from '@/lib/theme'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import ProgrammeHeader from '@/components/Programme/Header/component'
import HeroCard from '@/components/Programme/HeroCard/component'
import PlanningModules from '@/components/Programme/PlanningModules/component'
import Timeline from '@/components/Programme/Timeline/component'
import PrioritiesCard from '@/components/Programme/PrioritiesCard/component'
import DetailsCard from '@/components/Programme/DetailsCard/component'
import HeroCardMobile from '@/components/Programme/HeroCard/mobile'
import type { Programme } from '@/lib/Programme/types'

gsap.registerPlugin(ScrollTrigger)

export default function ProgrammePage() {
    const params = useParams()
    const { T, darkMode } = useTheme()
    const { navigate } = useNavigate()
    const { user } = useAuth()                        // ← NEW
    const progId = Array.isArray(params.id) ? params.id[0] : params.id as string

    const [programme, setProgramme] = useState<Programme | null>(null)
    const [ready, setReady] = useState(false)
    const [notFound, setNotFound] = useState(false)
    const rightColRef = useRef<HTMLDivElement>(null)

    const handleProgrammeChange = (updated: Programme) => setProgramme(updated)

    // ── Load from Supabase ──────────────────────────────────
    useEffect(() => {
        if (!progId || !user) return

        const load = async () => {
            const { data, error } = await supabase
                .rpc('get_wedding_programme', {
                    p_uid: user.uid,
                    p_programme_id: progId,
                })

            console.log('[Programme] data:', data)
            console.log('[Programme] error:', error)

            if (error || !data) {
                setNotFound(true)
                setReady(true)
                return
            }

            const mapped: Programme = {
                id: data.id,
                title: data.title,
                format: data.format,
                coupleNameA: '',
                coupleNameB: '',
                dateFrom: data.date_start ?? '',
                dateTo: data.date_end ?? '',
                region: data.region ?? '',
                currency: data.currency,
                cultures: data.culture_modules ?? [],
                priorities: [],
                guestEstimate: '',
                budgetTarget: '',
                hasPlanner: null,
                createdAt: '',
                subEvents: (data.events ?? [])
                    .map((e: any) => ({
                        id: e.id,
                        name: e.title,
                        date: e.event_date ?? '',
                        startTime: e.start_time ?? '',
                        endTime: e.end_time ?? '',
                    })),
            }

            setProgramme(mapped)
            setReady(true)
        }

        load()
    }, [progId, user])

    // ── GSAP animations — completely unchanged ──────────────
    useEffect(() => {
        if (!ready || !programme || !rightColRef.current) return
        const ctx = gsap.context(() => {
            gsap.from('.vow-section', {
                opacity: 0, y: 20, duration: 0.5,
                ease: 'power3.out', stagger: 0.07, clearProps: 'all',
            })
        }, rightColRef)
        return () => ctx.revert()
    }, [ready, programme])

    // ── Loading ───────────────────────────────────────────────
    if (!ready) return (
        <div className="min-h-screen flex items-center justify-center"
            style={{ backgroundColor: T.bg }}>
            <div className="w-6 h-6 rounded-full animate-pulse"
                style={{ background: btnPrimary.bg }} />
        </div>
    )

    // ── Not found ─────────────────────────────────────────────
    if (notFound || !programme) return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
            style={{ backgroundColor: T.bg }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5"
                style={{ backgroundColor: T.surface, border: `1px solid ${T.borderSubtle}` }}>
                💍
            </div>
            <h1 className="text-lg font-bold mb-2" style={{ color: T.textPrimary }}>
                Programme not found
            </h1>
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

    // ── Page — completely unchanged ───────────────────────────
    return (
        <div
            className="font-sans antialiased flex flex-col"
            style={{ backgroundColor: T.bg, color: T.textPrimary, height: '100dvh', overflow: 'hidden' }}
        >
            <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} aria-hidden>
                <div className="absolute inset-0" style={{ background: T.heroBg }} />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 lg:w-225 h-100 rounded-full blur-3xl opacity-60"
                    style={{ background: T.heroGlow }} />
            </div>

            <div className="relative shrink-0" style={{ zIndex: 50 }}>
                <ProgrammeHeader />
            </div>

            <div className="relative flex-1 overflow-hidden" style={{ zIndex: 10 }}>
                <BoardGrid
                    rightColRef={rightColRef}
                    heroCard={
                        <div className="vow-section h-full">
                            <HeroCard programme={programme} onChange={handleProgrammeChange} />
                        </div>
                    }
                    mobileHero={
                        <div className="vow-section">
                            <HeroCardMobile programme={programme} onChange={handleProgrammeChange} />
                        </div>
                    }
                    rightContent={
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div className="vow-section"><PlanningModules /></div>
                            {programme.subEvents.length > 0 && (
                                <div className="vow-section">
                                    <Timeline subEvents={programme.subEvents} />
                                </div>
                            )}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                                <div className="vow-section">
                                    <PrioritiesCard priorities={programme.priorities} />
                                </div>
                                <div className="vow-section">
                                    <DetailsCard programme={programme} />
                                </div>
                            </div>
                        </div>
                    }
                />
            </div>
        </div>
    )
}

// ── BoardGrid — completely unchanged ─────────────────────────
function BoardGrid({
    heroCard, mobileHero, rightContent, rightColRef,
}: {
    heroCard: React.ReactNode
    mobileHero: React.ReactNode
    rightContent: React.ReactNode
    rightColRef: React.RefObject<HTMLDivElement | null>
}) {
    const { T } = useTheme()

    return (
        <>
            <div className="flex flex-col h-full lg:hidden"
                style={{ padding: '12px 16px 0', gap: '12px' }}>
                <div style={{ flexShrink: 0 }}>{mobileHero}</div>
                <div className="flex-1 overflow-y-auto"
                    style={{ paddingBottom: '24px', scrollbarWidth: 'thin', scrollbarColor: `${T.borderBrown} transparent` }}>
                    {rightContent}
                </div>
            </div>

            <div className="hidden lg:grid h-full"
                style={{ gridTemplateColumns: 'min(480px, 38%) 1fr', gap: '24px', padding: '28px 40px 0', alignItems: 'stretch' }}>
                <div style={{ height: '95%' }}>{heroCard}</div>
                <div style={{ height: '100%', overflow: 'hidden', minWidth: 0 }}>
                    <div ref={rightColRef}
                        style={{ height: '100%', overflowY: 'auto', paddingBottom: '32px', paddingRight: '4px', scrollbarWidth: 'thin', scrollbarColor: `${T.borderBrown} transparent` }}>
                        {rightContent}
                    </div>
                </div>
            </div>
        </>
    )
}