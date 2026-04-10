'use client'

import { BROWN_PRIMARY } from '@/lib/theme'
import { useTheme } from '@/context/ThemeContext'
import { CULTURES } from '@/lib/NewProgramme/constants'
import type { ProgrammeData, CultureModule } from '@/lib/NewProgramme/types'

interface Props {
  data: ProgrammeData
  toggleCulture: (c: CultureModule) => void
}

export default function Step4Traditions({ data, toggleCulture }: Props) {
  const { darkMode, T } = useTheme()

  return (
    <div>
      <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: T.accentText }}>
        Step 4 · Traditions
      </p>
      <h2 className="text-2xl font-bold tracking-tight mb-1" style={{ color: T.textPrimary }}>
        What traditions will you celebrate?
      </h2>
      <p className="text-sm mb-2" style={{ color: T.textMuted }}>
        Select all that apply. This unlocks the right events, vendors, and tasks for your celebration.
      </p>
      <p className="text-xs mb-6" style={{ color: '#D4847A' }}>
        * At least one tradition is required to continue.
      </p>

      <div className="flex flex-wrap gap-2.5">
        {CULTURES.map(({ value, label, emoji }) => {
          const active = data.cultures.includes(value)

          return (
            <button
              key={value}
              type="button"
              onClick={() => toggleCulture(value)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 focus:outline-none"
              style={{
                backgroundColor: active
                  ? darkMode ? 'rgba(139,107,71,0.22)' : 'rgba(139,107,71,0.12)'
                  : T.surface,
                border: `1.5px solid ${active ? BROWN_PRIMARY : T.borderSubtle}`,
                color: active ? T.accentText : T.textSecondary,
                boxShadow: active ? `0 0 0 3px ${BROWN_PRIMARY}18` : 'none',
              }}
            >
              <span>{emoji}</span>
              <span>{label}</span>
              {active && <span style={{ fontSize: '10px' }}>✓</span>}
            </button>
          )
        })}
      </div>

      {data.cultures.length > 0 && (
        <p className="mt-4 text-xs" style={{ color: T.textMuted }}>
          {data.cultures.length} tradition{data.cultures.length !== 1 ? 's' : ''} selected
        </p>
      )}
    </div>
  )
}