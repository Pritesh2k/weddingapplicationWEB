'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTheme } from '@/context/ThemeContext'
import { btnPrimary, BROWN_PALE, BROWN_PRIMARY, THEME } from '@/lib/theme'

// ─── TYPES ───────────────────────────────────────────────────
interface SubEvent {
  id: string
  name: string
  date: string
  startTime: string
  endTime: string
}

interface Programme {
  id: string
  coupleNameA: string
  coupleNameB: string
  title: string
  dateFrom: string
  dateTo: string
  region: string
  currency: string
  format: string
  cultures: string[]
  subEvents: SubEvent[]
  guestEstimate: string
  budgetTarget: string
  priorities: string[]
  hasPlanner: boolean | null
  createdAt: string
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
const IconPlus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
    <path d="M12 5v14M5 12h14" />
  </svg>
)
const IconChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
    <path d="M9 18l6-6-6-6" />
  </svg>
)
const IconCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
)
const IconUsers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)
const IconTrash = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
  </svg>
)
const IconEmpty = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-12 h-12">
    <circle cx="8" cy="12" r="5" /><circle cx="16" cy="12" r="5" />
    <path d="M12 7v10M9 9l3-2 3 2" strokeWidth="0.75" strokeDasharray="2 2" />
  </svg>
)

const FORMAT_LABELS: Record<string, string> = {
  'single-day':  'Single Day',
  'multi-day':   'Multi-Day',
  'destination': 'Destination',
  'custom':      'Custom',
}

// ─── HELPERS ─────────────────────────────────────────────────
function loadAllProgrammes(): Programme[] {
  try {
    const raw = localStorage.getItem('vow-programmes')
    if (raw) return JSON.parse(raw) as Programme[]

    // Migrate legacy single-programme key
    const legacy = localStorage.getItem('vow-programme')
    if (legacy) {
      const p = JSON.parse(legacy) as Programme
      const list = [p]
      localStorage.setItem('vow-programmes', JSON.stringify(list))
      localStorage.removeItem('vow-programme')
      return list
    }
  } catch {}
  return []
}

function saveAllProgrammes(list: Programme[]) {
  localStorage.setItem('vow-programmes', JSON.stringify(list))
}

function daysUntil(dateStr: string): number | null {
  if (!dateStr) return null
  const d = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86_400_000)
  return d
}

// ─── MAIN ─────────────────────────────────────────────────────
export default function Dashboard() {
  const router = useRouter()
  const { darkMode, toggleTheme, T } = useTheme()
  const [programmes, setProgrammes] = useState<Programme[]>([])
  const [ready, setReady] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    const list = loadAllProgrammes()
    setProgrammes(list)
    setReady(true)
  }, [])

  const deleteProgramme = (id: string) => {
    const updated = programmes.filter(p => p.id !== id)
    setProgrammes(updated)
    saveAllProgrammes(updated)
    setDeleteConfirm(null)
  }

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: T.bg }}>
        <div className="w-7 h-7 rounded-full animate-pulse" style={{ background: btnPrimary.bg }} />
      </div>
    )
  }

  return (
    <div className="min-h-screen font-sans antialiased" style={{ backgroundColor: T.bg, color: T.textPrimary }}>

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0" style={{ background: T.heroBg }} />
      </div>

      {/* Header */}
      <header className="relative z-10 sticky top-0 flex items-center justify-between px-6 lg:px-10 h-16"
        style={{
          backgroundColor: T.navBgScrolled,
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${T.borderSubtle}`,
        }}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: btnPrimary.bg, boxShadow: btnPrimary.shadow, color: btnPrimary.color }}>
            <IconRings />
          </div>
          <span className="font-semibold tracking-tight text-lg" style={{ color: T.textPrimary }}>Vow</span>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={toggleTheme}
            className="p-2 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none"
            style={{ backgroundColor: T.surface, border: `1px solid ${T.borderBrown}`, color: T.textMuted }}>
            {darkMode ? <IconSun /> : <IconMoon />}
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-10">

        {/* Page title */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: T.accentText }}>
              My Programmes
            </p>
            <h1 className="text-3xl font-bold tracking-tight" style={{ color: T.textPrimary }}>
              Wedding Dashboard
            </h1>
          </div>

          <button
            onClick={() => router.push('/new-programme')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                       hover:scale-105 transition-all duration-200 focus:outline-none"
            style={{ background: btnPrimary.bg, boxShadow: btnPrimary.shadow, color: btnPrimary.color }}>
            <IconPlus />
            New Programme
          </button>
        </div>

        {/* Empty state */}
        {programmes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-6 opacity-30" style={{ color: T.accentText }}>
              <IconEmpty />
            </div>
            <h2 className="text-xl font-semibold mb-2" style={{ color: T.textPrimary }}>
              No programmes yet
            </h2>
            <p className="text-sm mb-8 max-w-xs" style={{ color: T.textMuted }}>
              Create your first wedding programme to get started. It only takes a few minutes.
            </p>
            <button
              onClick={() => router.push('/new-programme')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold
                         hover:scale-105 transition-all duration-200 focus:outline-none"
              style={{ background: btnPrimary.bg, boxShadow: btnPrimary.shadow, color: btnPrimary.color }}>
              <IconPlus />
              Create Wedding Programme
            </button>
          </div>
        )}

        {/* Programme grid */}
        {programmes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {programmes.map(p => {
              const days = daysUntil(p.dateFrom)
              const weddingDate = p.dateFrom
                ? new Date(p.dateFrom).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })
                : null

              return (
                <div key={p.id} className="relative group rounded-2xl overflow-hidden transition-all duration-200
                                            hover:scale-[1.01]"
                  style={{
                    backgroundColor: T.surface,
                    border: `1px solid ${T.borderBrown}`,
                    boxShadow: darkMode
                      ? '0 2px 16px rgba(0,0,0,0.3)'
                      : '0 2px 12px rgba(139,107,71,0.08)',
                  }}>

                  {/* Card top accent bar */}
                  <div className="h-1 w-full" style={{ background: btnPrimary.bg }} />

                  <div className="p-5">
                    {/* Title row */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="min-w-0">
                        <h2 className="font-bold text-lg tracking-tight truncate" style={{ color: T.textPrimary }}>
                          {p.title}
                        </h2>
                        <p className="text-sm mt-0.5" style={{ color: T.accentText }}>
                          {p.coupleNameA} & {p.coupleNameB}
                        </p>
                      </div>

                      {/* Days badge */}
                      {days !== null && days > 0 && (
                        <div className="shrink-0 flex flex-col items-center px-3 py-1.5 rounded-xl"
                          style={{ backgroundColor: T.surface2, border: `1px solid ${T.borderBrown}` }}>
                          <span className="text-lg font-bold leading-none" style={{ color: T.accentText }}>
                            {days}
                          </span>
                          <span className="text-xs" style={{ color: T.textMuted }}>days</span>
                        </div>
                      )}
                      {days !== null && days <= 0 && (
                        <span className="shrink-0 text-xs px-2.5 py-1 rounded-full font-semibold"
                          style={{ backgroundColor: 'rgba(90,158,138,0.15)', color: '#7ABDB0', border: '1px solid rgba(90,158,138,0.30)' }}>
                          {days === 0 ? 'Today! 🎉' : 'Complete'}
                        </span>
                      )}
                    </div>

                    {/* Meta row */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {weddingDate && (
                        <span className="flex items-center gap-1.5 text-xs" style={{ color: T.textMuted }}>
                          <IconCalendar /> {weddingDate}
                        </span>
                      )}
                      {p.region && (
                        <span className="text-xs" style={{ color: T.textMuted }}>· 📍 {p.region}</span>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {p.format && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ backgroundColor: T.surface2, border: `1px solid ${T.borderBrown}`, color: T.accentText }}>
                          {FORMAT_LABELS[p.format] ?? p.format}
                        </span>
                      )}
                      {p.cultures.map(c => (
                        <span key={c} className="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
                          style={{ backgroundColor: T.surface2, border: `1px solid ${T.borderBrown}`, color: T.textSecondary }}>
                          {c}
                        </span>
                      ))}
                    </div>

                    {/* Stats strip */}
                    <div className="flex gap-4 pb-4 mb-4"
                      style={{ borderBottom: `1px solid ${T.borderSubtle}` }}>
                      <div>
                        <p className="text-xs" style={{ color: T.textMuted }}>Events</p>
                        <p className="text-sm font-bold" style={{ color: T.textPrimary }}>{p.subEvents.length}</p>
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: T.textMuted }}>Guests</p>
                        <p className="text-sm font-bold" style={{ color: T.textPrimary }}>{p.guestEstimate || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: T.textMuted }}>Budget</p>
                        <p className="text-sm font-bold" style={{ color: T.textPrimary }}>
                          {p.budgetTarget ? `${p.currency} ${Number(p.budgetTarget).toLocaleString()}` : '—'}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setDeleteConfirm(p.id)}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg
                                   transition-colors duration-200 focus:outline-none"
                        style={{ color: T.textMuted, border: `1px solid ${T.borderSubtle}` }}
                        onMouseEnter={e => {
                          e.currentTarget.style.color = '#E8867A'
                          e.currentTarget.style.borderColor = 'rgba(232,134,122,0.35)'
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.color = T.textMuted
                          e.currentTarget.style.borderColor = T.borderSubtle
                        }}>
                        <IconTrash /> Delete
                      </button>

                      <button
                        onClick={() => router.push(`/programme/${p.id}`)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold
                                   hover:scale-105 transition-all duration-200 focus:outline-none"
                        style={{ background: btnPrimary.bg, boxShadow: btnPrimary.shadow, color: btnPrimary.color }}>
                        Open <IconChevronRight />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setDeleteConfirm(null)}>
          <div className="w-full max-w-sm p-6 rounded-2xl"
            style={{ backgroundColor: T.surface, border: `1px solid ${T.borderBrown}` }}
            onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-semibold mb-2" style={{ color: T.textPrimary }}>
              Delete this programme?
            </h3>
            <p className="text-sm mb-6" style={{ color: T.textMuted }}>
              This is permanent and cannot be undone. All data for this programme will be removed.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium focus:outline-none"
                style={{ backgroundColor: T.surface2, border: `1px solid ${T.borderBrown}`, color: T.textSecondary }}>
                Cancel
              </button>
              <button onClick={() => deleteProgramme(deleteConfirm)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold focus:outline-none"
                style={{ backgroundColor: 'rgba(232,134,122,0.15)', border: '1px solid rgba(232,134,122,0.35)', color: '#E8867A' }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}