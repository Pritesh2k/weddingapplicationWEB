// app/new-programme/page.tsx
'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'
import { btnPrimary, BROWN_PRIMARY, BROWN_PALE, THEME } from '@/lib/theme'

// ─── TYPES ───────────────────────────────────────────────────
type WeddingFormat = 'single-day' | 'multi-day' | 'destination' | 'custom'
type CultureModule = 'hindu' | 'muslim' | 'christian' | 'civil' | 'blended'

interface SubEvent {
  id: string
  name: string
  date: string
  startTime: string
  endTime: string
}

interface ProgrammeData {
  step: number
  coupleNameA: string
  coupleNameB: string
  title: string
  dateFrom: string
  dateTo: string
  region: string
  currency: string
  format: WeddingFormat | ''
  cultures: CultureModule[]
  subEvents: SubEvent[]
  guestEstimate: string
  budgetTarget: string
  priorities: string[]
  hasPlanner: boolean | null
}

const EMPTY: ProgrammeData = {
  step: 1,
  coupleNameA: '', coupleNameB: '',
  title: '', dateFrom: '', dateTo: '',
  region: '', currency: 'GBP',
  format: '',
  cultures: [],
  subEvents: [],
  guestEstimate: '', budgetTarget: '',
  priorities: [], hasPlanner: null,
}

const SUGGESTED_EVENTS: Record<CultureModule, string[]> = {
  hindu:    ['Mehendi', 'Haldi', 'Sangeet', 'Wedding Ceremony', 'Reception'],
  muslim:   ['Nikah', 'Walima', 'Family Gathering'],
  christian:['Rehearsal & Blessing', 'Wedding Ceremony', 'Reception'],
  civil:    ['Legal Ceremony', 'Reception', 'Celebration'],
  blended:  ['Opening Gathering', 'Ceremony Stream A', 'Ceremony Stream B', 'Combined Reception'],
}

const CURRENCIES = ['GBP', 'USD', 'EUR', 'AED', 'INR', 'CAD', 'AUD']
const PRIORITIES = ['Guest Experience', 'Budget Control', 'Cultural Authenticity', 'Vendor Quality', 'Timeline Precision', 'Decor & Aesthetics']

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
const IconArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
)
const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
    <path d="M20 6L9 17l-5-5" />
  </svg>
)
const IconPlus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
    <path d="M12 5v14M5 12h14" />
  </svg>
)
const IconTrash = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
  </svg>
)
const IconSparkle = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
  </svg>
)

const STEPS = [
  { n: 1, label: 'Couple'    },
  { n: 2, label: 'Programme' },
  { n: 3, label: 'Format'    },
  { n: 4, label: 'Traditions'},
  { n: 5, label: 'Events'    },
  { n: 6, label: 'Constraints'},
]
const TOTAL_STEPS = STEPS.length

export default function NewProgramme() {
  const router = useRouter()
  const { darkMode, toggleTheme, T } = useTheme()
  const [data, setData]       = useState<ProgrammeData>(EMPTY)
  const [error, setError]     = useState('')
  const [animDir, setAnimDir] = useState<'forward' | 'back'>('forward')
  const [visible, setVisible] = useState(true)
  const cardRef               = useRef<HTMLDivElement>(null)
  const submittedRef          = useRef(false)
  const draftKey              = 'vow-programme-draft'

  // ── Rehydrate once on mount ───────────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem(draftKey)
      if (saved && !submittedRef.current) {
        const parsed: ProgrammeData = JSON.parse(saved)
        // Only restore if it has meaningful data
        if (parsed.coupleNameA || parsed.coupleNameB || parsed.step > 1) {
          setData(parsed)
        }
      }
    } catch {}
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auto-save draft — gated by submittedRef ───────────────
  useEffect(() => {
    // Do nothing if submitted or if data is completely empty (avoid overwriting a real draft)
    if (submittedRef.current) return
    if (!data.coupleNameA && !data.coupleNameB && data.step === 1) return
    try {
      localStorage.setItem(draftKey, JSON.stringify(data))
    } catch {}
  }, [data])

  // ── Step transition ───────────────────────────────────────
  const goTo = (next: number, dir: 'forward' | 'back' = 'forward') => {
    setError('')
    setAnimDir(dir)
    setVisible(false)
    setTimeout(() => {
      setData(d => ({ ...d, step: next }))
      setVisible(true)
    }, 220)
  }

  const patch = (fields: Partial<ProgrammeData>) =>
    setData(d => ({ ...d, ...fields }))

  // ── Per-step validation ───────────────────────────────────
  const validate = (): boolean => {
    switch (data.step) {
      case 1:
        if (!data.coupleNameA.trim() || !data.coupleNameB.trim()) {
          setError('Please enter both names.'); return false
        }
        break
      case 2:
        if (!data.title.trim() || !data.dateFrom) {
          setError('Please enter a programme title and start date.'); return false
        }
        break
      case 3:
        if (!data.format) {
          setError('Please select a wedding format.'); return false
        }
        break
      case 4:
        if (data.cultures.length === 0) {
          setError('Please select at least one tradition.'); return false
        }
        break
      case 5:
        if (data.subEvents.length === 0) {
          setError('Please add at least one event to your programme.'); return false
        }
        break
      case 6:
        if (!data.guestEstimate || !data.budgetTarget) {
          setError('Please fill in guest estimate and budget.'); return false
        }
        break
    }
    return true
  }

  // ── Next / Submit ─────────────────────────────────────────
  const next = () => {
    if (!validate()) return
    if (data.step < TOTAL_STEPS) { goTo(data.step + 1, 'forward'); return }

    // ── Build clean final object ──────────────────────────
    const id = `prog_${Date.now()}`
    const final = {
      id,
      coupleNameA:   data.coupleNameA,
      coupleNameB:   data.coupleNameB,
      title:         data.title,
      dateFrom:      data.dateFrom,
      dateTo:        data.dateTo,
      region:        data.region,
      currency:      data.currency,
      format:        data.format,
      cultures:      data.cultures,
      subEvents:     data.subEvents,
      guestEstimate: data.guestEstimate,
      budgetTarget:  data.budgetTarget,
      priorities:    data.priorities,
      hasPlanner:    data.hasPlanner,
      createdAt:     new Date().toISOString(),
    }

    // ── Persist to array FIRST ────────────────────────────
    try {
      const raw      = localStorage.getItem('vow-programmes')
      const existing = raw ? JSON.parse(raw) : []
      existing.push(final)
      localStorage.setItem('vow-programmes', JSON.stringify(existing))
    } catch {
      localStorage.setItem('vow-programmes', JSON.stringify([final]))
    }

    // ── Kill draft BEFORE any React state update ──────────
    submittedRef.current = true
    localStorage.removeItem(draftKey)
    localStorage.removeItem('vow-programme') // legacy

    // ── Navigate immediately — do NOT call setData here ──
    // Calling setData(EMPTY) triggers the auto-save effect
    // before submittedRef is read in the same tick on some
    // React versions. Skip it entirely — navigation unmounts
    // the component anyway.
    router.push(`/programme/${id}`)
  }

  const back = () => { if (data.step > 1) goTo(data.step - 1, 'back') }

  // ── Sub-event helpers ─────────────────────────────────────
  const suggestEvents = () => {
    const names = new Set<string>()
    data.cultures.forEach(c => SUGGESTED_EVENTS[c]?.forEach(e => names.add(e)))
    patch({
      subEvents: Array.from(names).map((name, i) => ({
        id: `evt_${Date.now()}_${i}`,
        name,
        date:      data.dateFrom || '',
        startTime: '',
        endTime:   '',
      }))
    })
  }

  const addEvent = () => patch({
    subEvents: [...data.subEvents, {
      id:        `evt_${Date.now()}`,
      name:      '',
      date:      data.dateFrom || '',
      startTime: '',
      endTime:   '',
    }]
  })

  const removeEvent = (id: string) =>
    patch({ subEvents: data.subEvents.filter(e => e.id !== id) })

  const updateEvent = (id: string, field: keyof SubEvent, value: string) =>
    patch({ subEvents: data.subEvents.map(e => e.id === id ? { ...e, [field]: value } : e) })

  const toggleCulture = (c: CultureModule) => {
    const next = data.cultures.includes(c)
      ? data.cultures.filter(x => x !== c)
      : [...data.cultures, c]
    patch({ cultures: next, subEvents: [] })
  }

  const togglePriority = (p: string) => {
    const next = data.priorities.includes(p)
      ? data.priorities.filter(x => x !== p)
      : data.priorities.length < 3 ? [...data.priorities, p] : data.priorities
    patch({ priorities: next })
  }

  // ── Styles ────────────────────────────────────────────────
  const cardStyle: React.CSSProperties = {
    opacity:    visible ? 1 : 0,
    transform:  visible ? 'translateX(0px)' : animDir === 'forward' ? 'translateX(16px)' : 'translateX(-16px)',
    transition: 'opacity 220ms ease, transform 220ms ease',
  }

  const inp = (): React.CSSProperties => ({
    backgroundColor: T.inputBg,
    border:          `1px solid ${T.inputBorder}`,
    color:           T.textPrimary,
    outline:         'none',
    borderRadius:    '12px',
    padding:         '12px 14px',
    fontSize:        '14px',
    width:           '100%',
    transition:      'border-color 0.2s',
  })

  const progress = ((data.step - 1) / (TOTAL_STEPS - 1)) * 100

    return (
        <div className="min-h-screen font-sans antialiased flex flex-col"
            style={{ backgroundColor: T.bg, color: T.textPrimary }}>

            {/* Background */}
            <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
                <div className="absolute inset-0" style={{ background: T.heroBg }} />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-175 h-100 rounded-full blur-3xl"
                    style={{
                        background: darkMode
                            ? 'radial-gradient(ellipse, rgba(160,120,72,0.10) 0%, transparent 70%)'
                            : 'radial-gradient(ellipse, rgba(139,107,71,0.08) 0%, transparent 70%)'
                    }} />
            </div>

            {/* Header */}
            <header className="relative z-10 flex items-center justify-between px-6 lg:px-10 h-16"
                style={{ backgroundColor: T.navBgScrolled, backdropFilter: 'blur(20px)', borderBottom: `1px solid ${T.borderSubtle}` }}>

                {/* Back to dashboard */}
                <button
                    onClick={() => router.push('/dashboard')}
                    className="flex items-center gap-2 text-sm font-medium transition-colors duration-200 focus:outline-none group"
                    style={{ color: T.textMuted }}
                    onMouseEnter={e => (e.currentTarget.style.color = T.accentText)}
                    onMouseLeave={e => (e.currentTarget.style.color = T.textMuted)}>
                    <span className="group-hover:-translate-x-0.5 transition-transform duration-200"><IconArrowLeft /></span>
                    <span className="hidden sm:inline">Dashboard</span>
                </button>

                {/* Logo centre */}
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center"
                        style={{ background: btnPrimary.bg, boxShadow: btnPrimary.shadow, color: btnPrimary.color }}>
                        <IconRings />
                    </div>
                    <span className="font-semibold tracking-tight text-lg" style={{ color: T.textPrimary }}>Vow</span>
                </div>

                <button onClick={toggleTheme}
                    className="p-2 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none"
                    style={{ backgroundColor: T.surface, border: `1px solid ${T.borderBrown}`, color: T.textMuted }}
                    aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
                    {darkMode ? <IconSun /> : <IconMoon />}
                </button>
            </header>

            {/* Progress bar */}
            <div className="relative z-10 h-0.5" style={{ backgroundColor: T.borderSubtle }}>
                <div className="h-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%`, background: btnPrimary.bg }} />
            </div>

            {/* Main */}
            <main className="relative z-10 flex-1 flex items-start justify-center px-4 py-10">
                <div className="w-full max-w-xl">

                    {/* Step indicator */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            {STEPS.map((s, i) => (
                                <React.Fragment key={s.n}>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                                            style={{
                                                backgroundColor: data.step >= s.n ? BROWN_PRIMARY : T.surface2,
                                                color: data.step >= s.n ? THEME.btn.text : T.textMuted,
                                                border: `1.5px solid ${data.step >= s.n ? BROWN_PRIMARY : T.borderBrown}`,
                                                transform: data.step === s.n ? 'scale(1.15)' : 'scale(1)',
                                            }}>
                                            {data.step > s.n ? <IconCheck /> : s.n}
                                        </div>
                                        <span className="hidden sm:block text-xs font-medium transition-colors duration-200"
                                            style={{ color: data.step === s.n ? T.accentText : T.textMuted }}>
                                            {s.label}
                                        </span>
                                    </div>
                                    {i < STEPS.length - 1 && (
                                        <div className="w-4 h-px transition-colors duration-300"
                                            style={{ backgroundColor: data.step > s.n ? BROWN_PRIMARY : T.borderBrown }} />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                        <span className="text-xs font-medium" style={{ color: T.textMuted }}>
                            {data.step} of {TOTAL_STEPS}
                        </span>
                    </div>

                    {/* Card */}
                    <div ref={cardRef} style={cardStyle}>
                        <div className="rounded-2xl p-8 md:p-10"
                            style={{
                                backgroundColor: T.surface,
                                border: `1px solid ${T.borderBrown}`,
                                boxShadow: darkMode
                                    ? '0 24px 64px rgba(0,0,0,0.45), 0 0 0 1px rgba(160,120,72,0.06)'
                                    : '0 12px 40px rgba(139,107,71,0.10), 0 2px 8px rgba(0,0,0,0.05)',
                            }}>

                            {/* Error */}
                            {error && (
                                <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm mb-6"
                                    style={{ background: 'rgba(176,80,70,0.12)', border: '1px solid rgba(176,80,70,0.28)', color: '#D4847A' }}
                                    role="alert">
                                    <span>⚠</span> {error}
                                </div>
                            )}

                            {/* ── STEP 1 ── */}
                            {data.step === 1 && (
                                <div>
                                    <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: T.accentText }}>Step 1 · The couple</p>
                                    <h2 className="text-2xl font-bold tracking-tight mb-1" style={{ color: T.textPrimary }}>Who is getting married?</h2>
                                    <p className="text-sm mb-8" style={{ color: T.textMuted }}>This names your programme and personalises your experience.</p>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: T.textMuted }}>Partner one</label>
                                            <input type="text" placeholder="First name" value={data.coupleNameA}
                                                onChange={e => patch({ coupleNameA: e.target.value })} style={inp()} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: T.textMuted }}>Partner two</label>
                                            <input type="text" placeholder="First name" value={data.coupleNameB}
                                                onChange={e => patch({ coupleNameB: e.target.value })} style={inp()} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── STEP 2 ── */}
                            {data.step === 2 && (
                                <div>
                                    <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: T.accentText }}>Step 2 · The programme</p>
                                    <h2 className="text-2xl font-bold tracking-tight mb-1" style={{ color: T.textPrimary }}>Name your programme</h2>
                                    <p className="text-sm mb-8" style={{ color: T.textMuted }}>Set the title, dates, region, and currency for your wedding.</p>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: T.textMuted }}>Programme title</label>
                                            <input type="text"
                                                placeholder={`${data.coupleNameA || 'A'} & ${data.coupleNameB || 'B'}'s Wedding`}
                                                value={data.title} onChange={e => patch({ title: e.target.value })} style={inp()} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: T.textMuted }}>Start date</label>
                                                <input type="date" value={data.dateFrom}
                                                    onChange={e => patch({ dateFrom: e.target.value })}
                                                    style={{ ...inp(), colorScheme: darkMode ? 'dark' : 'light' }} />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: T.textMuted }}>End date</label>
                                                <input type="date" value={data.dateTo} min={data.dateFrom}
                                                    onChange={e => patch({ dateTo: e.target.value })}
                                                    style={{ ...inp(), colorScheme: darkMode ? 'dark' : 'light' }} />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: T.textMuted }}>Region / City</label>
                                                <input type="text" placeholder="e.g. London" value={data.region}
                                                    onChange={e => patch({ region: e.target.value })} style={inp()} />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: T.textMuted }}>Currency</label>
                                                <select value={data.currency} onChange={e => patch({ currency: e.target.value })}
                                                    style={{ ...inp(), cursor: 'pointer' }}>
                                                    {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── STEP 3 ── */}
                            {data.step === 3 && (
                                <div>
                                    <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: T.accentText }}>Step 3 · Format</p>
                                    <h2 className="text-2xl font-bold tracking-tight mb-1" style={{ color: T.textPrimary }}>What kind of wedding?</h2>
                                    <p className="text-sm mb-8" style={{ color: T.textMuted }}>This shapes your programme structure, logistics, and planning model.</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        {([
                                            { id: 'single-day', label: 'Single Day', desc: 'One main event, optional micro-events' },
                                            { id: 'multi-day', label: 'Multi-Day', desc: 'Linked events over several days' },
                                            { id: 'destination', label: 'Destination', desc: 'Travel, accommodation & logistics focus' },
                                            { id: 'custom', label: 'Custom', desc: 'Start from a blank structure' },
                                        ] as { id: WeddingFormat; label: string; desc: string }[]).map(f => {
                                            const active = data.format === f.id
                                            return (
                                                <button key={f.id} type="button" onClick={() => patch({ format: f.id })}
                                                    className="text-left p-4 rounded-xl transition-all duration-200 focus:outline-none"
                                                    style={{
                                                        backgroundColor: active ? (darkMode ? 'rgba(139,107,71,0.18)' : 'rgba(139,107,71,0.10)') : T.surface2,
                                                        border: `1.5px solid ${active ? BROWN_PRIMARY : T.borderBrown}`,
                                                        transform: active ? 'scale(1.02)' : 'scale(1)',
                                                    }}>
                                                    <div className="flex items-start justify-between mb-1">
                                                        <span className="text-sm font-semibold" style={{ color: active ? T.accentText : T.textPrimary }}>{f.label}</span>
                                                        {active && (
                                                            <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                                                                style={{ background: btnPrimary.bg, color: THEME.btn.text }}>
                                                                <IconCheck />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="text-xs leading-relaxed" style={{ color: T.textMuted }}>{f.desc}</p>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* ── STEP 4 ── */}
                            {data.step === 4 && (
                                <div>
                                    <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: T.accentText }}>Step 4 · Traditions</p>
                                    <h2 className="text-2xl font-bold tracking-tight mb-1" style={{ color: T.textPrimary }}>Which traditions apply?</h2>
                                    <p className="text-sm mb-8" style={{ color: T.textMuted }}>Select all that apply. We'll suggest sub-events based on your selection.</p>
                                    <div className="space-y-2.5">
                                        {([
                                            { id: 'hindu', label: 'Hindu / Indian', events: 'Mehendi · Haldi · Sangeet · Ceremony · Reception' },
                                            { id: 'muslim', label: 'Muslim', events: 'Nikah · Walima · Family Gathering' },
                                            { id: 'christian', label: 'Christian', events: 'Rehearsal · Ceremony · Reception' },
                                            { id: 'civil', label: 'Civil', events: 'Legal Ceremony · Reception' },
                                            { id: 'blended', label: 'Blended / Interfaith', events: 'Custom multi-tradition streams' },
                                        ] as { id: CultureModule; label: string; events: string }[]).map(c => {
                                            const active = data.cultures.includes(c.id)
                                            return (
                                                <button key={c.id} type="button" onClick={() => toggleCulture(c.id)}
                                                    className="w-full text-left flex items-center justify-between p-4 rounded-xl transition-all duration-200 focus:outline-none"
                                                    style={{
                                                        backgroundColor: active ? (darkMode ? 'rgba(139,107,71,0.15)' : 'rgba(139,107,71,0.08)') : T.surface2,
                                                        border: `1.5px solid ${active ? BROWN_PRIMARY : T.borderBrown}`,
                                                    }}>
                                                    <div>
                                                        <p className="text-sm font-semibold mb-0.5" style={{ color: active ? T.accentText : T.textPrimary }}>{c.label}</p>
                                                        <p className="text-xs" style={{ color: T.textMuted }}>{c.events}</p>
                                                    </div>
                                                    <div className="w-5 h-5 rounded flex items-center justify-center shrink-0 ml-4 transition-all duration-200"
                                                        style={{
                                                            backgroundColor: active ? BROWN_PRIMARY : T.inputBg,
                                                            border: `1.5px solid ${active ? BROWN_PRIMARY : T.inputBorder}`,
                                                        }}>
                                                        {active && <svg viewBox="0 0 12 12" fill="none" stroke={THEME.btn.text} strokeWidth="2.5" className="w-2.5 h-2.5"><path d="M2 6l3 3 5-5" /></svg>}
                                                    </div>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* ── STEP 5 ── */}
                            {data.step === 5 && (
                                <div>
                                    <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: T.accentText }}>Step 5 · Events</p>
                                    <h2 className="text-2xl font-bold tracking-tight mb-1" style={{ color: T.textPrimary }}>Build your programme</h2>
                                    <p className="text-sm mb-5" style={{ color: T.textMuted }}>Add or adjust the events in your wedding programme.</p>

                                    {data.cultures.length > 0 && data.subEvents.length === 0 && (
                                        <button type="button" onClick={suggestEvents}
                                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold mb-4 transition-all duration-200 hover:scale-[1.01] focus:outline-none"
                                            style={{ backgroundColor: T.surface2, border: `1.5px dashed ${T.borderBrown}`, color: T.accentText }}>
                                            <IconSparkle /> Suggest events from your traditions
                                        </button>
                                    )}

                                    <div className="space-y-3 mb-4 max-h-80 overflow-y-auto pr-1">
                                        {data.subEvents.map((evt, i) => (
                                            <div key={evt.id} className="rounded-xl p-3 space-y-2"
                                                style={{ backgroundColor: T.surface2, border: `1px solid ${T.borderBrown}` }}>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold w-5 text-center shrink-0" style={{ color: T.textMuted }}>{i + 1}</span>
                                                    <input type="text" placeholder="Event name" value={evt.name}
                                                        onChange={e => updateEvent(evt.id, 'name', e.target.value)}
                                                        style={{ ...inp(), padding: '8px 12px' }} />
                                                    <button type="button" onClick={() => removeEvent(evt.id)}
                                                        className="shrink-0 p-1.5 rounded-lg transition-colors focus:outline-none"
                                                        style={{ color: T.textMuted }}
                                                        onMouseEnter={e => (e.currentTarget.style.color = '#D4847A')}
                                                        onMouseLeave={e => (e.currentTarget.style.color = T.textMuted)}>
                                                        <IconTrash />
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-3 gap-2 pl-7">
                                                    <input type="date" value={evt.date}
                                                        onChange={e => updateEvent(evt.id, 'date', e.target.value)}
                                                        style={{ ...inp(), padding: '7px 10px', fontSize: '12px', colorScheme: darkMode ? 'dark' : 'light' }} />
                                                    <input type="time" value={evt.startTime}
                                                        onChange={e => updateEvent(evt.id, 'startTime', e.target.value)}
                                                        style={{ ...inp(), padding: '7px 10px', fontSize: '12px', colorScheme: darkMode ? 'dark' : 'light' }} />
                                                    <input type="time" value={evt.endTime}
                                                        onChange={e => updateEvent(evt.id, 'endTime', e.target.value)}
                                                        style={{ ...inp(), padding: '7px 10px', fontSize: '12px', colorScheme: darkMode ? 'dark' : 'light' }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <button type="button" onClick={addEvent}
                                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.01] focus:outline-none"
                                        style={{ backgroundColor: T.surface2, border: `1px dashed ${T.borderBrown}`, color: T.textMuted }}>
                                        <IconPlus /> Add event
                                    </button>
                                </div>
                            )}

                            {/* ── STEP 6 ── */}
                            {data.step === 6 && (
                                <div>
                                    <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: T.accentText }}>Step 6 · Constraints</p>
                                    <h2 className="text-2xl font-bold tracking-tight mb-1" style={{ color: T.textPrimary }}>Set your foundations</h2>
                                    <p className="text-sm mb-8" style={{ color: T.textMuted }}>These shape your planning model, task generation, and recommendations.</p>
                                    <div className="space-y-5">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: T.textMuted }}>Guest estimate</label>
                                                <input type="number" placeholder="e.g. 150" value={data.guestEstimate}
                                                    onChange={e => patch({ guestEstimate: e.target.value })} style={inp()} />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: T.textMuted }}>
                                                    Budget target ({data.currency})
                                                </label>
                                                <input type="number" placeholder="e.g. 30000" value={data.budgetTarget}
                                                    onChange={e => patch({ budgetTarget: e.target.value })} style={inp()} />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: T.textMuted }}>
                                                Top priorities <span className="normal-case font-normal">(pick up to 3)</span>
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {PRIORITIES.map(p => {
                                                    const active = data.priorities.includes(p)
                                                    const maxed = data.priorities.length >= 3 && !active
                                                    return (
                                                        <button key={p} type="button" onClick={() => togglePriority(p)} disabled={maxed}
                                                            className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 focus:outline-none"
                                                            style={{
                                                                backgroundColor: active ? (darkMode ? 'rgba(139,107,71,0.25)' : 'rgba(139,107,71,0.14)') : T.surface2,
                                                                border: `1px solid ${active ? BROWN_PRIMARY : T.borderBrown}`,
                                                                color: active ? T.accentText : maxed ? T.textMuted : T.textSecondary,
                                                                opacity: maxed ? 0.45 : 1,
                                                                cursor: maxed ? 'not-allowed' : 'pointer',
                                                            }}>
                                                            {p}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: T.textMuted }}>
                                                Are you working with a wedding planner?
                                            </label>
                                            <div className="flex gap-3">
                                                {([true, false] as const).map(val => {
                                                    const active = data.hasPlanner === val
                                                    return (
                                                        <button key={String(val)} type="button" onClick={() => patch({ hasPlanner: val })}
                                                            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 focus:outline-none"
                                                            style={{
                                                                backgroundColor: active ? (darkMode ? 'rgba(139,107,71,0.18)' : 'rgba(139,107,71,0.10)') : T.surface2,
                                                                border: `1.5px solid ${active ? BROWN_PRIMARY : T.borderBrown}`,
                                                                color: active ? T.accentText : T.textSecondary,
                                                            }}>
                                                            {val ? 'Yes' : 'No, self-planning'}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Navigation */}
                            <div className={`flex items-center mt-8 ${data.step > 1 ? 'justify-between' : 'justify-end'}`}>
                                {data.step > 1 && (
                                    <button type="button" onClick={back}
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02] focus:outline-none"
                                        style={{ backgroundColor: T.surface2, border: `1px solid ${T.borderBrown}`, color: T.textSecondary }}>
                                        <IconArrowLeft /> Back
                                    </button>
                                )}
                                <button type="button" onClick={next}
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-[1.03] focus:outline-none"
                                    style={{ background: btnPrimary.bg, boxShadow: btnPrimary.shadow, color: btnPrimary.color }}>
                                    {data.step === TOTAL_STEPS ? 'Create Programme' : 'Continue'}
                                    {data.step < TOTAL_STEPS && <IconArrowRight />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <p className="mt-5 text-center text-xs" style={{ color: T.textMuted }}>
                        Progress is saved automatically. You can leave and return at any time.
                    </p>
                </div>
            </main>
        </div>
    )
}