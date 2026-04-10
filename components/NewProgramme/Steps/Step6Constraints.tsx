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

const Required = () => <span style={{ color: '#D4847A', marginLeft: '2px' }}>*</span>

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
      <p className="text-sm mb-2" style={{ color: T.textMuted }}>
        These shape your planning model, task generation, and recommendations.
      </p>
      <p className="text-xs mb-6" style={{ color: '#D4847A' }}>
        * All fields on this step are required.
      </p>

      <div className="space-y-6">
        {/* Guest + Budget */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: T.textMuted }}>
              Guest estimate<Required />
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
              Budget target ({data.currency})<Required />
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
            Top priorities<Required />{' '}
            <span className="normal-case font-normal opacity-70">(pick at least one)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {PRIORITIES.map((p) => {
              const active = data.priorities.includes(p)
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePriority(p)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold
                 transition-all duration-200 focus:outline-none"
                  style={{
                    backgroundColor: active
                      ? darkMode ? 'rgba(139,107,71,0.25)' : 'rgba(139,107,71,0.14)'
                      : T.surface,
                    border: `1px solid ${active ? BROWN_PRIMARY : T.borderSubtle}`,
                    color: active ? T.accentText : T.textSecondary,
                  }}
                >
                  {active && <span className="mr-1">✓</span>}
                  {p}
                </button>
              )
            })}
          </div>
          {data.priorities.length > 0 && (
            <p className="mt-2 text-xs" style={{ color: T.textMuted }}>
              {data.priorities.length} priorit{data.priorities.length !== 1 ? 'ies' : 'y'} selected
            </p>
          )}
        </div>

        {/* Planner toggle */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: T.textMuted }}>
            Working with a wedding planner?<Required />
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
                    color: active ? T.accentText : T.textSecondary,
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
