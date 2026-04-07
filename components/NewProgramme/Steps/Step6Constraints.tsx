'use client'

import { BROWN_PRIMARY } from '@/lib/theme'
import { useTheme } from '@/context/ThemeContext'
import { PRIORITIES } from '@/lib/NewProgramme/constants'
import type { ProgrammeData } from '@/lib/NewProgramme/types'

interface Props {
  data:           ProgrammeData
  patch:          (f: Partial<ProgrammeData>) => void
  inp:            () => React.CSSProperties
  togglePriority: (p: string) => void
}

export default function Step6Constraints({ data, patch, inp, togglePriority }: Props) {
  const { darkMode, T } = useTheme()
  return (
    <div>
      <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: T.accentText }}>
        Step 6 · Constraints
      </p>
      <h2 className="text-2xl font-bold tracking-tight mb-1" style={{ color: T.textPrimary }}>
        Set your foundations
      </h2>
      <p className="text-sm mb-8" style={{ color: T.textMuted }}>
        These shape your planning model, task generation, and recommendations.
      </p>

      <div className="space-y-6">
        {/* Guest + Budget */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: T.textMuted }}>
              Guest estimate
            </label>
            <input
              type="number"
              placeholder="e.g. 150"
              value={data.guestEstimate}
              onChange={(e) => patch({ guestEstimate: e.target.value })}
              style={inp()}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: T.textMuted }}>
              Budget target ({data.currency})
            </label>
            <input
              type="number"
              placeholder="e.g. 30000"
              value={data.budgetTarget}
              onChange={(e) => patch({ budgetTarget: e.target.value })}
              style={inp()}
            />
          </div>
        </div>

        {/* Priorities */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: T.textMuted }}>
            Top priorities{' '}
            <span className="normal-case font-normal opacity-70">(pick up to 3)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {PRIORITIES.map((p) => {
              const active = data.priorities.includes(p)
              const maxed  = data.priorities.length >= 3 && !active
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePriority(p)}
                  disabled={maxed}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold
                             transition-all duration-200 focus:outline-none"
                  style={{
                    backgroundColor: active
                      ? darkMode ? 'rgba(139,107,71,0.25)' : 'rgba(139,107,71,0.14)'
                      : T.surface,
                    border:  `1px solid ${active ? BROWN_PRIMARY : T.borderSubtle}`,
                    color:   active ? T.accentText : maxed ? T.textMuted : T.textSecondary,
                    opacity: maxed ? 0.4 : 1,
                    cursor:  maxed ? 'not-allowed' : 'pointer',
                  }}
                >
                  {p}
                </button>
              )
            })}
          </div>
        </div>

        {/* Planner toggle */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: T.textMuted }}>
            Working with a wedding planner?
          </label>
          <div className="grid grid-cols-2 gap-3">
            {([true, false] as const).map((val) => {
              const active = data.hasPlanner === val
              return (
                <button
                  key={String(val)}
                  type="button"
                  onClick={() => patch({ hasPlanner: val })}
                  className="py-3 rounded-xl text-sm font-semibold
                             transition-all duration-200 focus:outline-none"
                  style={{
                    backgroundColor: active
                      ? darkMode ? 'rgba(139,107,71,0.18)' : 'rgba(139,107,71,0.10)'
                      : T.surface,
                    border: `1.5px solid ${active ? BROWN_PRIMARY : T.borderSubtle}`,
                    color:  active ? T.accentText : T.textSecondary,
                    boxShadow: active ? `0 0 0 3px ${BROWN_PRIMARY}15` : 'none',
                  }}
                >
                  {val ? 'Yes, I have a planner' : 'No, self-planning'}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}