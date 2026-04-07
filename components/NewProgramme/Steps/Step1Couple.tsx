'use client'

import { useTheme } from '@/context/ThemeContext'
import type { ProgrammeData } from '@/lib/NewProgramme/types'

interface Props {
  data:  ProgrammeData
  patch: (f: Partial<ProgrammeData>) => void
  inp:   () => React.CSSProperties
}

export default function Step1Couple({ data, patch, inp }: Props) {
  const { T } = useTheme()
  return (
    <div>
      <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: T.accentText }}>
        Step 1 · The couple
      </p>
      <h2 className="text-2xl font-bold tracking-tight mb-1" style={{ color: T.textPrimary }}>
        Who is getting married?
      </h2>
      <p className="text-sm mb-8" style={{ color: T.textMuted }}>
        This names your programme and personalises your experience.
      </p>
      <div className="space-y-4">
        {[
          { label: 'Partner one', key: 'coupleNameA' as const, value: data.coupleNameA },
          { label: 'Partner two', key: 'coupleNameB' as const, value: data.coupleNameB },
        ].map(({ label, key, value }) => (
          <div key={key}>
            <label
              className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
              style={{ color: T.textMuted }}
            >
              {label}
            </label>
            <input
              type="text"
              placeholder="First name"
              value={value}
              onChange={(e) => patch({ [key]: e.target.value })}
              style={inp()}
            />
          </div>
        ))}
      </div>
    </div>
  )
}