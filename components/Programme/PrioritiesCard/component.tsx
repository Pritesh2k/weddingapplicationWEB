'use client'

import { btnPrimary } from '@/lib/theme'
import { useTheme } from '@/context/ThemeContext'

interface Props { priorities: string[] }

export default function PrioritiesCard({ priorities }: Props) {
  const { T } = useTheme()
  if (!priorities.length) return null

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
              Focus
            </p>
            <h2 className="text-sm font-bold" style={{ color: T.textPrimary }}>Top Priorities</h2>
          </div>
        </div>
      </div>
      <div className="px-5 sm:px-6 py-4 space-y-3">
        {priorities.map((p, i) => (
          <div key={p} className="flex items-center gap-3">
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
              style={{
                backgroundColor: 'rgba(139,107,71,0.08)',
                border:          `1px solid ${T.borderSubtle}`,
                color:           T.accentText,
              }}
            >
              {i + 1}
            </span>
            <span className="text-xs font-medium flex-1" style={{ color: T.textPrimary }}>{p}</span>
          </div>
        ))}
      </div>
      <div className="px-5 sm:px-6 pb-4">
        <p className="text-[10px]" style={{ color: T.textMuted }}>
          {priorities.length} priorit{priorities.length !== 1 ? 'ies' : 'y'} defined
        </p>
      </div>
    </div>
  )
}