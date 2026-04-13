'use client'

import { btnPrimary } from '@/lib/theme'
import { useTheme } from '@/context/ThemeContext'
import type { Programme } from '@/lib/Programme/types'
import { FORMAT_LABELS } from '@/lib/Programme/types'
import { fmtDate } from '@/lib/Programme/helpers'

// Add these props to DetailsCard
interface Props {
  programme: Programme
  onChange: (updated: Programme) => void  // ADD THIS
}

export default function DetailsCard({ programme: p }: Props) {
  const { T } = useTheme()

  const rows = [
    { label: 'Planner', value: p.hasPlanner === true ? 'With planner' : p.hasPlanner === false ? 'Self-planning' : '—' },
    { label: 'Format',  value: (FORMAT_LABELS[p.format] ?? p.format) || '—' },
    ...(p.dateTo ? [{ label: 'End date', value: fmtDate(p.dateTo) }] : []),
    { label: 'Created', value: fmtDate(p.createdAt) },
  ]

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: T.surface,
        border:          `1px solid ${T.borderSubtle}`,
        boxShadow:       '0 2px 12px rgba(139,107,71,0.06)',
      }}
    >
      <div className="px-5 sm:px-6 pt-5 pb-4" style={{ borderBottom: `1px solid ${T.borderSubtle}` }}>
        <div className="flex items-center gap-2.5">
          <div className="w-0.5 h-8 rounded-full shrink-0" style={{ background: btnPrimary.bg }} />
          <div>
            <p className="text-[10px] font-bold tracking-[0.18em] uppercase" style={{ color: T.accentText }}>
              Overview
            </p>
            <h2 className="text-sm font-bold" style={{ color: T.textPrimary }}>Details</h2>
          </div>
        </div>
      </div>
      <div className="px-5 sm:px-6 py-4 space-y-3.5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-2">
            <span className="text-[11px]" style={{ color: T.textMuted }}>{row.label}</span>
            <span className="text-[11px] font-semibold" style={{ color: T.textPrimary }}>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}