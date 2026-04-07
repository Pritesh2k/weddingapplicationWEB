'use client'

import { useCallback } from 'react'
import { BROWN_PRIMARY, BROWN_LIGHT } from '@/lib/theme'
import { useTheme } from '@/context/ThemeContext'
import type { Programme } from '@/lib/Programme/types'
import { FORMAT_LABELS } from '@/lib/Programme/types'
import { daysUntil, fmtDate } from '@/lib/Programme/helpers'

interface Props {
  programme: Programme
  onChange:  (updated: Programme) => void
}

export default function HeroCardMobile({ programme: p, onChange }: Props) {
  const { darkMode, T } = useTheme()

  const days        = daysUntil(p.dateFrom)
  const weddingDate = p.dateFrom
    ? fmtDate(p.dateFrom, { day: 'numeric', month: 'short', year: 'numeric' })
    : null

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: T.surface,
        border:          `1px solid ${T.borderSubtle}`,
        boxShadow:       darkMode
          ? '0 8px 32px rgba(0,0,0,0.30)'
          : '0 4px 20px rgba(139,107,71,0.08)',
      }}
    >
      {/* Top gradient accent */}
      <div
        className="h-px w-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${BROWN_PRIMARY}88, ${BROWN_LIGHT}88, transparent)`,
        }}
      />

      {/* ── Main row: info left, countdown right ─────────── */}
      <div className="flex items-center justify-between px-5 py-4 gap-4">

        {/* Left — label, title, names */}
        <div className="flex-1 min-w-0">
          <p
            className="text-[9px] font-bold tracking-[0.18em] uppercase mb-1"
            style={{ color: T.accentText }}
          >
            Wedding Programme
          </p>
          <h1
            className="font-bold tracking-tight leading-tight truncate"
            style={{ color: T.textPrimary, fontSize: 'clamp(16px, 4vw, 20px)' }}
          >
            {p.title}
          </h1>
          <p className="text-xs font-semibold mt-0.5 truncate" style={{ color: T.accentText }}>
            {p.coupleNameA} & {p.coupleNameB}
          </p>
        </div>

        {/* Right — countdown or status */}
        <div className="flex flex-col items-center shrink-0">
          {days !== null && days > 0 && (
            <>
              <p
                className="font-bold leading-none tabular-nums"
                style={{
                  fontSize: 'clamp(36px, 8vw, 52px)',
                  color:    T.accentText,
                }}
              >
                {days}
              </p>
              <p className="text-[10px] font-medium mt-0.5" style={{ color: T.textMuted }}>
                days
              </p>
            </>
          )}
          {days === 0 && (
            <>
              <p className="text-3xl">🎉</p>
              <p className="text-[10px] font-semibold mt-0.5" style={{ color: '#7ABDB0' }}>Today!</p>
            </>
          )}
          {days !== null && days < 0 && (
            <>
              <p className="text-2xl font-bold" style={{ color: '#7ABDB0' }}>✓</p>
              <p className="text-[10px] font-semibold mt-0.5" style={{ color: '#7ABDB0' }}>Done</p>
            </>
          )}
          {days === null && (
            <p className="text-[10px] text-center max-w-16" style={{ color: T.textMuted }}>
              No date set
            </p>
          )}
        </div>
      </div>

      {/* ── Meta row: date, location, tags ───────────────── */}
      <div
        className="px-5 pb-4 flex flex-wrap items-center gap-1.5"
      >
        {/* Date */}
        {weddingDate && (
          <span
            className="text-[11px] px-2.5 py-1 rounded-full"
            style={{
              backgroundColor: T.surface,
              border:          `1px solid ${T.borderSubtle}`,
              color:           T.textMuted,
            }}
          >
            📅 {weddingDate}
          </span>
        )}

        {/* Location */}
        {p.region && (
          <span
            className="text-[11px] px-2.5 py-1 rounded-full"
            style={{
              backgroundColor: T.surface,
              border:          `1px solid ${T.borderSubtle}`,
              color:           T.textMuted,
            }}
          >
            📍 {p.region}
          </span>
        )}

        {/* Format */}
        {p.format && (
          <span
            className="text-[11px] px-2.5 py-1 rounded-full font-semibold"
            style={{
              backgroundColor: darkMode ? 'rgba(139,107,71,0.18)' : 'rgba(139,107,71,0.10)',
              border:          `1px solid ${BROWN_PRIMARY}`,
              color:           T.accentText,
            }}
          >
            {FORMAT_LABELS[p.format] ?? p.format}
          </span>
        )}

        {/* Cultures */}
        {p.cultures.map((c) => (
          <span
            key={c}
            className="text-[11px] px-2.5 py-1 rounded-full font-medium capitalize"
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

      {/* ── Stats strip ──────────────────────────────────── */}
      <div
        className="grid grid-cols-3"
        style={{ borderTop: `1px solid ${T.borderSubtle}` }}
      >
        <div
          className="flex flex-col items-center py-3"
          style={{ borderRight: `1px solid ${T.borderSubtle}` }}
        >
          <p className="text-sm font-bold leading-none mb-0.5" style={{ color: T.textPrimary }}>
            {p.subEvents.length}
          </p>
          <p className="text-[10px]" style={{ color: T.textMuted }}>Events</p>
        </div>
        <div
          className="flex flex-col items-center py-3"
          style={{ borderRight: `1px solid ${T.borderSubtle}` }}
        >
          <p className="text-sm font-bold leading-none mb-0.5" style={{ color: T.textPrimary }}>
            {p.guestEstimate || '—'}
          </p>
          <p className="text-[10px]" style={{ color: T.textMuted }}>Guests</p>
        </div>
        <div className="flex flex-col items-center py-3">
          <p className="text-sm font-bold leading-none mb-0.5 px-1 truncate max-w-full text-center"
            style={{ color: T.textPrimary }}>
            {p.budgetTarget
              ? `${p.currency} ${Number(p.budgetTarget).toLocaleString()}`
              : '—'}
          </p>
          <p className="text-[10px]" style={{ color: T.textMuted }}>Budget</p>
        </div>
      </div>
    </div>
  )
}