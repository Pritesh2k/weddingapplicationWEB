'use client'

import { btnPrimary, BROWN_PRIMARY, BROWN_LIGHT } from '@/lib/theme'
import { useTheme } from '@/context/ThemeContext'
import { useNavigate } from '@/context/NavigationContext'
import type { Programme } from '@/lib/Dashboard/types'
import { FORMAT_LABELS } from '@/lib/Dashboard/types'
import { daysUntil, formatWeddingDate } from '@/lib/Dashboard/helpers'
import {
  IconCalendar, IconMapPin, IconUsers,
  IconChevronRight, IconTrash,
} from '@/lib/Dashboard/icons'

interface Props {
  programme:     Programme
  onDeleteClick: (id: string) => void
}

export default function ProgrammeCard({ programme: p, onDeleteClick }: Props) {
  const { darkMode, T } = useTheme()
  const { navigate }    = useNavigate()

  const days        = daysUntil(p.dateFrom)
  const weddingDate = formatWeddingDate(p.dateFrom)
  const isPast      = days !== null && days <= 0
  const isToday     = days === 0

  return (
    <article
      className="group relative rounded-2xl overflow-hidden transition-all duration-300
                 hover:scale-[1.015] hover:-translate-y-0.5 cursor-pointer"
      style={{
        backgroundColor: T.surface,
        border:          `1px solid ${T.borderSubtle}`,
        boxShadow:       darkMode
          ? '0 2px 20px rgba(0,0,0,0.25)'
          : '0 2px 12px rgba(139,107,71,0.06)',
      }}
      onClick={() => navigate(`/programme/${p.id}`)}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = darkMode ? 'rgba(139,107,71,0.30)' : 'rgba(139,107,71,0.25)'
        e.currentTarget.style.boxShadow   = darkMode
          ? '0 8px 40px rgba(0,0,0,0.35)'
          : '0 8px 32px rgba(139,107,71,0.10)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = T.borderSubtle
        e.currentTarget.style.boxShadow   = darkMode
          ? '0 2px 20px rgba(0,0,0,0.25)'
          : '0 2px 12px rgba(139,107,71,0.06)'
      }}
    >
      {/* Top gradient bar */}
      <div
        className="h-px w-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${BROWN_PRIMARY}88, ${BROWN_LIGHT}88, transparent)`,
        }}
      />

      <div className="p-6">

        {/* Header row */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="min-w-0">
            {/* Couple names */}
            <p
              className="text-xs font-bold tracking-widest uppercase mb-1.5"
              style={{ color: T.accentText }}
            >
              {p.coupleNameA} & {p.coupleNameB}
            </p>
            {/* Programme title */}
            <h2
              className="font-bold text-xl tracking-tight leading-tight truncate"
              style={{ color: T.textPrimary }}
            >
              {p.title}
            </h2>
          </div>

          {/* Countdown / status badge */}
          {days !== null && !isPast && (
            <div
              className="shrink-0 text-center px-3.5 py-2 rounded-xl"
              style={{
                background:  darkMode ? 'rgba(139,107,71,0.10)' : 'rgba(139,107,71,0.07)',
                border:      `1px solid ${darkMode ? 'rgba(139,107,71,0.22)' : 'rgba(139,107,71,0.16)'}`,
              }}
            >
              <p
                className="text-xl font-bold leading-none"
                style={{ color: T.accentText }}
              >
                {days}
              </p>
              <p className="text-[10px] font-medium mt-0.5" style={{ color: T.textMuted }}>
                days
              </p>
            </div>
          )}
          {isPast && (
            <span
              className="shrink-0 text-xs px-3 py-1.5 rounded-full font-semibold"
              style={{
                backgroundColor: 'rgba(90,158,138,0.12)',
                color:           '#7ABDB0',
                border:          '1px solid rgba(90,158,138,0.25)',
              }}
            >
              {isToday ? '🎉 Today' : 'Complete'}
            </span>
          )}
        </div>

        {/* Meta strip */}
        <div
          className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-5 pb-5"
          style={{ borderBottom: `1px solid ${T.borderSubtle}` }}
        >
          {weddingDate && (
            <span className="flex items-center gap-1.5 text-xs" style={{ color: T.textMuted }}>
              <IconCalendar /> {weddingDate}
            </span>
          )}
          {p.region && (
            <span className="flex items-center gap-1.5 text-xs" style={{ color: T.textMuted }}>
              <IconMapPin /> {p.region}
            </span>
          )}
          {p.guestEstimate && (
            <span className="flex items-center gap-1.5 text-xs" style={{ color: T.textMuted }}>
              <IconUsers /> {p.guestEstimate} guests
            </span>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Events',  value: String(p.subEvents.length) },
            { label: 'Guests',  value: p.guestEstimate || '—'     },
            {
              label: 'Budget',
              value: p.budgetTarget
                ? `${p.currency} ${Number(p.budgetTarget).toLocaleString()}`
                : '—',
            },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="px-3 py-2.5 rounded-xl"
              style={{
                backgroundColor: darkMode ? 'rgba(139,107,71,0.06)' : 'rgba(139,107,71,0.04)',
                border:          `1px solid ${T.borderSubtle}`,
              }}
            >
              <p className="text-[10px] font-medium uppercase tracking-wider mb-1" style={{ color: T.textMuted }}>
                {label}
              </p>
              <p className="text-sm font-bold truncate" style={{ color: T.textPrimary }}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Tags */}
        {(p.format || p.cultures.length > 0) && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {p.format && (
              <span
                className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{
                  backgroundColor: darkMode ? 'rgba(139,107,71,0.12)' : 'rgba(139,107,71,0.08)',
                  border:          `1px solid ${darkMode ? 'rgba(139,107,71,0.22)' : 'rgba(139,107,71,0.16)'}`,
                  color:           T.accentText,
                }}
              >
                {FORMAT_LABELS[p.format] ?? p.format}
              </span>
            )}
            {p.cultures.map((c) => (
              <span
                key={c}
                className="text-xs px-2.5 py-1 rounded-full font-medium capitalize"
                style={{
                  backgroundColor: T.surface,
                  border:          `1px solid ${T.borderSubtle}`,
                  color:           T.textSecondary,
                }}
              >
                {c}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={(e) => { e.stopPropagation(); onDeleteClick(p.id) }}
            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg
                       transition-all duration-200 focus:outline-none"
            style={{
              color:           T.textMuted,
              border:          `1px solid transparent`,
              backgroundColor: 'transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color           = '#E8867A'
              e.currentTarget.style.borderColor     = 'rgba(232,134,122,0.30)'
              e.currentTarget.style.backgroundColor = 'rgba(232,134,122,0.08)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color           = T.textMuted
              e.currentTarget.style.borderColor     = 'transparent'
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            <IconTrash /> Delete
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/programme/${p.id}`) }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold
                       transition-all duration-200 hover:scale-[1.03] focus:outline-none"
            style={{ background: btnPrimary.bg, boxShadow: btnPrimary.shadow, color: btnPrimary.color }}
          >
            Open <IconChevronRight />
          </button>
        </div>
      </div>
    </article>
  )
}