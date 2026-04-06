// app/programme/[id]/page.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'
import { btnPrimary, BROWN_PRIMARY, THEME } from '@/lib/theme'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ─── TYPES ───────────────────────────────────────────────────
interface SubEvent {
    id: string; name: string; date: string; startTime: string; endTime: string
}
interface Programme {
    id: string; coupleNameA: string; coupleNameB: string; title: string
    dateFrom: string; dateTo: string; region: string; currency: string
    format: string; cultures: string[]; subEvents: SubEvent[]
    guestEstimate: string; budgetTarget: string; priorities: string[]
    hasPlanner: boolean | null; createdAt: string
}

// ─── MODULES ─────────────────────────────────────────────────
const MODULES = [
    { id: 'guests', emoji: '👥', label: 'Guest List', desc: 'Invites, RSVPs, dietary needs & seating' },
    { id: 'venue', emoji: '🏛️', label: 'Venue', desc: 'Ceremony and reception spaces' },
    { id: 'vendors', emoji: '🤝', label: 'Vendors', desc: 'Food, drink, decor, music & suppliers' },
    { id: 'items', emoji: '🪑', label: 'Venue Items', desc: 'Tables, chairs, linens — customisable' },
    { id: 'tasks', emoji: '✅', label: 'Task List', desc: 'Everything to do, ordered by timeline' },
    { id: 'budget', emoji: '💷', label: 'Budget', desc: 'Track spend vs target, by category' },
    { id: 'timeline', emoji: '🗓️', label: 'Day Timeline', desc: 'Minute-by-minute order of your day' },
    { id: 'inspiration', emoji: '✨', label: 'Inspiration', desc: 'Mood boards, palettes and your vision' },
]

// ─── HELPERS ─────────────────────────────────────────────────
const FORMAT_LABELS: Record<string, string> = {
    'single-day': 'Single Day', 'multi-day': 'Multi-Day',
    'destination': 'Destination', 'custom': 'Custom',
}
const daysUntil = (d: string) =>
    d ? Math.ceil((new Date(d).getTime() - Date.now()) / 86_400_000) : null

const fmtDate = (d: string, opts?: Intl.DateTimeFormatOptions) =>
    d ? new Date(d).toLocaleDateString('en-GB', opts ?? { day: 'numeric', month: 'short', year: 'numeric' }) : ''

const fmtTime = (t: string) => {
    if (!t) return ''
    const [h, m] = t.split(':'); const hr = parseInt(h)
    return `${hr % 12 || 12}:${m} ${hr >= 12 ? 'PM' : 'AM'}`
}

// ─── ICONS ───────────────────────────────────────────────────
const IconRings = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <circle cx="8" cy="12" r="5" /><circle cx="16" cy="12" r="5" />
    </svg>
)
const IconMoon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
)
const IconSun = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
)
const IconArrowLeft = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
        <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
)
const IconCalendar = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 shrink-0">
        <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
)
const IconClock = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 shrink-0">
        <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
    </svg>
)
const IconPin = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 shrink-0">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
        <circle cx="12" cy="9" r="2.5" />
    </svg>
)
const IconUsers = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 shrink-0">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
)
const IconLock = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-2.5 h-2.5 shrink-0">
        <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
)

// ─── MAIN ─────────────────────────────────────────────────────
export default function ProgrammePage() {
    const params = useParams()
    const router = useRouter()
    const { darkMode, toggleTheme, T } = useTheme()

    const progId = Array.isArray(params.id) ? params.id[0] : params.id as string

    const [programme, setProgramme] = useState<Programme | null>(null)
    const [ready, setReady] = useState(false)
    const [notFound, setNotFound] = useState(false)
    const mainRef = useRef<HTMLElement>(null)

    useEffect(() => {
        if (!progId) { setNotFound(true); setReady(true); return }
        try {
            const list: Programme[] = JSON.parse(localStorage.getItem('vow-programmes') || '[]')
            const found = list.find(p => p.id === progId)
            if (found) setProgramme(found)
            else setNotFound(true)
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
            gsap.from('.vow-spine-line', {
                scaleY: 0, transformOrigin: 'top center',
                duration: 0.6, ease: 'power2.out',
                stagger: 0.08, delay: 0.4, clearProps: 'all',
            })
        }, mainRef)
        return () => ctx.revert()
    }, [ready, programme])

    // ── Loading ──────────────────────────────────────────────
    if (!ready) return (
        <div className="min-h-screen flex items-center justify-center"
            style={{ backgroundColor: T.bg }}>
            <div className="w-6 h-6 rounded-full animate-pulse"
                style={{ background: btnPrimary.bg }} />
        </div>
    )

    // ── Not found ────────────────────────────────────────────
    if (notFound || !programme) return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
            style={{ backgroundColor: T.bg }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5"
                style={{ backgroundColor: T.surface, border: `1px solid ${T.borderBrown}` }}>
                💍
            </div>
            <h1 className="text-lg font-bold mb-2" style={{ color: T.textPrimary }}>
                Programme not found
            </h1>
            <p className="text-sm mb-7 max-w-xs" style={{ color: T.textMuted }}>
                This programme may have been deleted or the link is invalid.
            </p>
            <button
                onClick={() => router.push('/dashboard')}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold
                   hover:scale-[1.02] transition-all duration-200 focus:outline-none"
                style={{ background: btnPrimary.bg, boxShadow: btnPrimary.shadow, color: btnPrimary.color }}>
                Back to Dashboard
            </button>
        </div>
    )

    const days = daysUntil(programme.dateFrom)
    const weddingDate = programme.dateFrom
        ? fmtDate(programme.dateFrom, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
        : null

    // ─── Short date for mobile ────────────────────────────
    const weddingDateShort = programme.dateFrom
        ? fmtDate(programme.dateFrom, { day: 'numeric', month: 'short', year: 'numeric' })
        : null

    return (
        <div className="min-h-screen font-sans antialiased"
            style={{ backgroundColor: T.bg, color: T.textPrimary }}>

            {/* ── Background z-0 ──────────────────────────────── */}
            <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} aria-hidden>
                <div className="absolute inset-0" style={{ background: T.heroBg }} />
                <div className="absolute top-0 left-1/2 -translate-x-1/2
                        w-[320px] sm:w-[520px] md:w-[700px]
                        h-[300px] sm:h-[400px] md:h-[500px]
                        rounded-full blur-3xl"
                    style={{ background: T.heroGlow }} />
            </div>

            {/* ── Header z-50 ─────────────────────────────────── */}
            <header
                className="flex items-center justify-between px-4 sm:px-6 lg:px-10 h-14 sm:h-16"
                style={{
                    position: 'sticky', top: 0, zIndex: 50,
                    backgroundColor: T.navBgScrolled,
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderBottom: `1px solid ${T.borderSubtle}`,
                }}>

                <button
                    onClick={() => router.push('/dashboard')}
                    className="flex items-center gap-1.5 sm:gap-2 text-sm font-medium
                     transition-colors duration-200 focus:outline-none group"
                    style={{ color: T.textMuted }}
                    onMouseEnter={e => (e.currentTarget.style.color = T.accentText)}
                    onMouseLeave={e => (e.currentTarget.style.color = T.textMuted)}>
                    <span className="group-hover:-translate-x-0.5 transition-transform duration-200">
                        <IconArrowLeft />
                    </span>
                    <span className="hidden sm:inline text-sm">Dashboard</span>
                </button>

                <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center"
                        style={{ background: btnPrimary.bg, boxShadow: btnPrimary.shadow, color: btnPrimary.color }}>
                        <IconRings />
                    </div>
                    <span className="font-semibold tracking-tight text-base sm:text-lg"
                        style={{ color: T.textPrimary }}>Vow</span>
                </div>

                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none"
                    style={{ backgroundColor: T.surface, border: `1px solid ${T.borderBrown}`, color: T.textMuted }}>
                    {darkMode ? <IconSun /> : <IconMoon />}
                </button>
            </header>

            {/* ── Main z-10 ───────────────────────────────────── */}
            <main
                ref={mainRef}
                className="relative max-w-2xl mx-auto
                   px-3 sm:px-4 md:px-6
                   pt-6 sm:pt-8 md:pt-10
                   pb-20 sm:pb-24
                   space-y-8 sm:space-y-10"
                style={{ zIndex: 10 }}>

                {/* ════════════════════════════════════════════════
            1. HERO CARD
        ════════════════════════════════════════════════ */}
                <div className="vow-section rounded-2xl overflow-hidden"
                    style={{
                        backgroundColor: T.surface,
                        border: `1px solid ${T.borderBrown}`,
                        boxShadow: darkMode
                            ? '0 24px 60px rgba(0,0,0,0.50), 0 0 0 1px rgba(160,120,72,0.06)'
                            : '0 8px 40px rgba(139,107,71,0.10), 0 1px 4px rgba(0,0,0,0.04)',
                    }}>

                    <div className="h-[3px] w-full" style={{ background: btnPrimary.bg }} />

                    <div className="px-5 sm:px-7 md:px-8 pt-6 sm:pt-7 pb-5 sm:pb-6">

                        {/* Label + countdown */}
                        <div className="flex items-start justify-between mb-5 sm:mb-6">
                            <p className="text-[10px] font-bold tracking-[0.16em] uppercase mt-0.5"
                                style={{ color: T.accentText }}>Wedding Programme</p>

                            {days !== null && days > 0 && (
                                <div className="flex items-baseline gap-1 sm:gap-1.5
                                px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl shrink-0"
                                    style={{ backgroundColor: T.surface2, border: `1px solid ${T.borderBrown}` }}>
                                    <span className="text-xl sm:text-2xl font-bold leading-none"
                                        style={{ color: T.accentText }}>{days}</span>
                                    <span className="text-[10px] sm:text-xs" style={{ color: T.textMuted }}>days</span>
                                </div>
                            )}
                            {days === 0 && (
                                <span className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0"
                                    style={{ backgroundColor: 'rgba(90,158,138,0.12)', border: '1px solid rgba(90,158,138,0.25)', color: '#7ABDB0' }}>
                                    🎉 Today!
                                </span>
                            )}
                            {days !== null && days < 0 && (
                                <span className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0"
                                    style={{ backgroundColor: 'rgba(90,158,138,0.12)', border: '1px solid rgba(90,158,138,0.25)', color: '#7ABDB0' }}>
                                    ✓ Complete
                                </span>
                            )}
                        </div>

                        {/* Title — scales down on mobile */}
                        <h1 className="text-[22px] sm:text-[26px] md:text-[28px]
                           font-bold tracking-tight leading-tight mb-1"
                            style={{ color: T.textPrimary }}>{programme.title}</h1>
                        <p className="text-sm font-semibold mb-5 sm:mb-7"
                            style={{ color: T.accentText }}>
                            {programme.coupleNameA} & {programme.coupleNameB}
                        </p>

                        {/* Meta pills — short date on mobile, full on sm+ */}
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-5">
                            {programme.dateFrom && (
                                <span className="flex items-center gap-1.5 text-xs px-2.5 sm:px-3 py-1.5 rounded-full"
                                    style={{ backgroundColor: T.surface2, border: `1px solid ${T.borderBrown}`, color: T.textMuted }}>
                                    <IconCalendar />
                                    <span className="sm:hidden">{weddingDateShort}</span>
                                    <span className="hidden sm:inline">{weddingDate}</span>
                                </span>
                            )}
                            {programme.region && (
                                <span className="flex items-center gap-1.5 text-xs px-2.5 sm:px-3 py-1.5 rounded-full"
                                    style={{ backgroundColor: T.surface2, border: `1px solid ${T.borderBrown}`, color: T.textMuted }}>
                                    <IconPin /> {programme.region}
                                </span>
                            )}
                            {programme.guestEstimate && (
                                <span className="flex items-center gap-1.5 text-xs px-2.5 sm:px-3 py-1.5 rounded-full"
                                    style={{ backgroundColor: T.surface2, border: `1px solid ${T.borderBrown}`, color: T.textMuted }}>
                                    <IconUsers /> {programme.guestEstimate}
                                    <span className="hidden sm:inline"> guests</span>
                                </span>
                            )}
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5">
                            {programme.format && (
                                <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold"
                                    style={{
                                        backgroundColor: darkMode ? 'rgba(139,107,71,0.18)' : 'rgba(139,107,71,0.10)',
                                        border: `1px solid ${BROWN_PRIMARY}`,
                                        color: T.accentText,
                                    }}>
                                    {FORMAT_LABELS[programme.format] ?? programme.format}
                                </span>
                            )}
                            {programme.cultures.map(c => (
                                <span key={c}
                                    className="text-[11px] px-2.5 py-1 rounded-full font-medium capitalize"
                                    style={{ backgroundColor: T.surface2, border: `1px solid ${T.borderBrown}`, color: T.textSecondary }}>
                                    {c}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Stats strip */}
                    <div className="grid grid-cols-3"
                        style={{ borderTop: `1px solid ${T.borderSubtle}` }}>
                        {[
                            { label: 'Events', value: String(programme.subEvents.length) },
                            { label: 'Guests', value: programme.guestEstimate || '—' },
                            {
                                label: 'Budget',
                                value: programme.budgetTarget
                                    ? `${programme.currency} ${Number(programme.budgetTarget).toLocaleString()}`
                                    : '—',
                            },
                        ].map((s, i) => (
                            <div key={s.label}
                                className="flex flex-col items-center py-4 sm:py-5"
                                style={{ borderRight: i < 2 ? `1px solid ${T.borderSubtle}` : undefined }}>
                                <p className="text-[15px] sm:text-[17px] font-bold leading-none mb-1
                               max-w-full px-1 truncate text-center"
                                    style={{ color: T.textPrimary }}>{s.value}</p>
                                <p className="text-[10px] sm:text-[11px]"
                                    style={{ color: T.textMuted }}>{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ════════════════════════════════════════════════
            2. PLANNING MODULES
            Mobile: 2-col  |  sm+: 3-col (4+4 / 3+3+2)
        ════════════════════════════════════════════════ */}
                <div className="vow-section space-y-3 sm:space-y-4">

                    <div className="flex items-end justify-between px-1">
                        <div>
                            <p className="text-[10px] font-bold tracking-[0.16em] uppercase mb-0.5"
                                style={{ color: T.accentText }}>Planning</p>
                            <h2 className="text-base font-bold" style={{ color: T.textPrimary }}>Your Modules</h2>
                        </div>
                        <span className="text-[11px] pb-0.5" style={{ color: T.textMuted }}>Coming soon</span>
                    </div>

                    {/* 2-col on mobile, 3-col on sm+ */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-2.5">
                        {MODULES.map((mod) => (
                            <div
                                key={mod.id}
                                className="flex flex-col items-center justify-center gap-2 sm:gap-2.5
                           px-2 py-4 sm:py-5 rounded-2xl text-center cursor-default
                           transition-colors duration-150"
                                style={{
                                    backgroundColor: T.surface,
                                    border: `1px solid ${T.borderBrown}`,
                                }}
                                onMouseEnter={e => {
                                    const el = e.currentTarget as HTMLDivElement
                                    el.style.backgroundColor = T.surface2
                                    el.style.borderColor = BROWN_PRIMARY
                                    gsap.to(el, { y: -3, duration: 0.2, ease: 'power2.out' })
                                }}
                                onMouseLeave={e => {
                                    const el = e.currentTarget as HTMLDivElement
                                    el.style.backgroundColor = T.surface
                                    el.style.borderColor = T.borderBrown
                                    gsap.to(el, { y: 0, duration: 0.2, ease: 'power2.out' })
                                }}>

                                {/* Icon bubble */}
                                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl
                                flex items-center justify-center text-lg sm:text-xl"
                                    style={{
                                        background: darkMode
                                            ? 'linear-gradient(135deg, rgba(160,120,72,0.18) 0%, rgba(110,84,50,0.08) 100%)'
                                            : 'linear-gradient(135deg, rgba(139,107,71,0.12) 0%, rgba(139,107,71,0.05) 100%)',
                                        border: `1px solid ${T.borderBrown}`,
                                    }}>
                                    {mod.emoji}
                                </div>

                                <p className="text-[11px] font-semibold leading-tight"
                                    style={{ color: T.textPrimary }}>
                                    {mod.label}
                                </p>

                                <span className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full"
                                    style={{
                                        backgroundColor: T.surface2,
                                        border: `1px solid ${T.borderSubtle}`,
                                        color: T.textMuted,
                                    }}>
                                    <IconLock /> Soon
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ════════════════════════════════════════════════
            3. DAY TIMELINE
            Spine shrinks on mobile, full cards on sm+
        ════════════════════════════════════════════════ */}
                {programme.subEvents.length > 0 && (
                    <div className="vow-section space-y-3 sm:space-y-4">

                        <div className="px-1">
                            <p className="text-[10px] font-bold tracking-[0.16em] uppercase mb-0.5"
                                style={{ color: T.accentText }}>Schedule</p>
                            <h2 className="text-base font-bold" style={{ color: T.textPrimary }}>Day Timeline</h2>
                        </div>

                        {/* Outer wrapper is the positioning context for the continuous spine line */}
                        <div className="relative">

                            {/* ── Continuous spine line — absolutely positioned behind all nodes ── */}
                            <div
                                className="absolute left-[13px] sm:left-[15px] top-4 bottom-4 w-px"
                                style={{
                                    background: darkMode
                                        ? 'rgba(160,120,72,0.30)'
                                        : 'rgba(139,107,71,0.22)',
                                    zIndex: 0,
                                }}
                            />

                            {/* ── Event rows ── */}
                            <div className="relative space-y-2.5 sm:space-y-3" style={{ zIndex: 1 }}>
                                {programme.subEvents.map((evt, i) => (
                                    <div key={evt.id} className="vow-timeline-item flex items-center gap-3 sm:gap-4">

                                        {/* Node — fixed size, sits on top of the spine line */}
                                        <div
                                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full shrink-0
                         flex items-center justify-center
                         text-[10px] sm:text-[11px] font-bold"
                                            style={{
                                                background: btnPrimary.bg,
                                                color: THEME.btn.text,
                                                zIndex: 2,
                                                boxShadow: `0 0 0 3px ${T.bg}, 0 0 0 4px ${darkMode ? 'rgba(160,120,72,0.28)' : 'rgba(139,107,71,0.22)'
                                                    }`,
                                            }}>
                                            {i + 1}
                                        </div>

                                        {/* Event card */}
                                        <div className="flex-1 min-w-0">
                                            <div
                                                className="rounded-xl sm:rounded-2xl px-4 sm:px-5 py-5 sm:py-6"
                                                style={{
                                                    backgroundColor: T.surface,
                                                    border: `1px solid ${T.borderBrown}`,
                                                    boxShadow: darkMode
                                                        ? '0 2px 16px rgba(0,0,0,0.22)'
                                                        : '0 2px 12px rgba(139,107,71,0.06)',
                                                }}>

                                                <div className="flex items-center justify-between gap-4">

                                                    {/* Left — event name */}
                                                    <p className="text-[15px] sm:text-base font-semibold leading-snug
                                flex-1 min-w-0 truncate"
                                                        style={{ color: T.textPrimary }}>
                                                        {evt.name || 'Unnamed event'}
                                                    </p>

                                                    {/* Right — date + time stacked */}
                                                    <div className="flex flex-col items-end gap-1 shrink-0">
                                                        {evt.date && (
                                                            <span className="flex items-center gap-1.5 text-[11px]"
                                                                style={{ color: T.textMuted }}>
                                                                <IconCalendar /> {fmtDate(evt.date)}
                                                            </span>
                                                        )}
                                                        {(evt.startTime || evt.endTime) && (
                                                            <span className="flex items-center gap-1.5 text-[11px]"
                                                                style={{ color: T.textMuted }}>
                                                                <IconClock />
                                                                {fmtTime(evt.startTime)}{evt.endTime ? ` – ${fmtTime(evt.endTime)}` : ''}
                                                            </span>
                                                        )}
                                                    </div>

                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ════════════════════════════════════════════════
            4. FOCUS + OVERVIEW
            Stack on mobile, side-by-side on sm+
        ════════════════════════════════════════════════ */}
                <div className="vow-section grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">

                    {/* Top Priorities */}
                    {programme.priorities.length > 0 && (
                        <div className="rounded-2xl overflow-hidden"
                            style={{
                                backgroundColor: T.surface,
                                border: `1px solid ${T.borderBrown}`,
                                boxShadow: darkMode
                                    ? '0 2px 20px rgba(0,0,0,0.22)'
                                    : '0 2px 12px rgba(139,107,71,0.06)',
                            }}>

                            <div className="px-5 sm:px-6 pt-5 pb-4"
                                style={{ borderBottom: `1px solid ${T.borderSubtle}` }}>
                                <div className="flex items-center gap-2.5">
                                    <div className="w-1 h-8 rounded-full shrink-0"
                                        style={{ background: btnPrimary.bg }} />
                                    <div>
                                        <p className="text-[10px] font-bold tracking-[0.16em] uppercase"
                                            style={{ color: T.accentText }}>Focus</p>
                                        <h2 className="text-sm font-bold" style={{ color: T.textPrimary }}>
                                            Top Priorities
                                        </h2>
                                    </div>
                                </div>
                            </div>

                            <div className="px-5 sm:px-6 py-4 space-y-3">
                                {programme.priorities.map((p, i) => (
                                    <div key={p} className="flex items-center gap-3">
                                        <span
                                            className="w-5 h-5 rounded-full flex items-center justify-center
                                 text-[10px] font-bold shrink-0"
                                            style={{
                                                backgroundColor: T.surface2,
                                                border: `1px solid ${T.borderBrown}`,
                                                color: T.accentText,
                                            }}>
                                            {i + 1}
                                        </span>
                                        <span className="text-xs font-medium flex-1 min-w-0"
                                            style={{ color: T.textPrimary }}>{p}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="px-5 sm:px-6 pb-4 pt-1">
                                <p className="text-[10px]" style={{ color: T.textMuted }}>
                                    {programme.priorities.length} priorit{programme.priorities.length !== 1 ? 'ies' : 'y'} defined
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Details */}
                    <div className="rounded-2xl overflow-hidden"
                        style={{
                            backgroundColor: T.surface,
                            border: `1px solid ${T.borderBrown}`,
                            boxShadow: darkMode
                                ? '0 2px 20px rgba(0,0,0,0.22)'
                                : '0 2px 12px rgba(139,107,71,0.06)',
                        }}>

                        <div className="px-5 sm:px-6 pt-5 pb-4"
                            style={{ borderBottom: `1px solid ${T.borderSubtle}` }}>
                            <div className="flex items-center gap-2.5">
                                <div className="w-1 h-8 rounded-full shrink-0"
                                    style={{ background: btnPrimary.bg }} />
                                <div>
                                    <p className="text-[10px] font-bold tracking-[0.16em] uppercase"
                                        style={{ color: T.accentText }}>Overview</p>
                                    <h2 className="text-sm font-bold" style={{ color: T.textPrimary }}>Details</h2>
                                </div>
                            </div>
                        </div>

                        <div className="px-5 sm:px-6 py-4 space-y-3.5">
                            {[
                                {
                                    label: 'Planner',
                                    value: programme.hasPlanner === true ? 'With planner'
                                        : programme.hasPlanner === false ? 'Self-planning' : '—',
                                },
                                { label: 'Format', value: (FORMAT_LABELS[programme.format] ?? programme.format) || '—' },
                                ...(programme.dateTo ? [{ label: 'End date', value: fmtDate(programme.dateTo) }] : []),
                                { label: 'Created', value: fmtDate(programme.createdAt) },
                            ].map(row => (
                                <div key={row.label} className="flex items-center justify-between gap-2">
                                    <span className="text-[11px]" style={{ color: T.textMuted }}>{row.label}</span>
                                    <span className="text-[11px] font-semibold" style={{ color: T.textPrimary }}>
                                        {row.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    )
}