'use client'

import { BROWN_PRIMARY, THEME } from '@/lib/theme'
import { useTheme } from '@/context/ThemeContext'
import type { ProgrammeData, CultureModule } from '@/lib/NewProgramme/types'

const CULTURES: { id: CultureModule; label: string; sub: string; events: string }[] = [
  { id: 'hindu',     label: 'Hindu / Indian',    sub: '5 sub-events', events: 'Mehendi · Haldi · Sangeet · Ceremony · Reception' },
  { id: 'muslim',    label: 'Muslim',             sub: '3 sub-events', events: 'Nikah · Walima · Family Gathering'                 },
  { id: 'christian', label: 'Christian',          sub: '3 sub-events', events: 'Rehearsal · Ceremony · Reception'                  },
  { id: 'civil',     label: 'Civil',              sub: '2 sub-events', events: 'Legal Ceremony · Reception'                        },
  { id: 'blended',   label: 'Blended / Interfaith', sub: 'Custom',     events: 'Multi-tradition streams'                           },
]

interface Props {
  data:          ProgrammeData
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
        Which traditions apply?
      </h2>
      <p className="text-sm mb-8" style={{ color: T.textMuted }}>
        Select all that apply. Sub-events will be suggested based on your selection.
      </p>
      <div className="space-y-2.5">
        {CULTURES.map((c) => {
          const active = data.cultures.includes(c.id)
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => toggleCulture(c.id)}
              className="w-full text-left flex items-center gap-4 p-4 rounded-2xl
                         transition-all duration-200 focus:outline-none hover:scale-[1.005]"
              style={{
                backgroundColor: active
                  ? darkMode ? 'rgba(139,107,71,0.15)' : 'rgba(139,107,71,0.08)'
                  : T.surface,
                border:    `1.5px solid ${active ? BROWN_PRIMARY : T.borderSubtle}`,
                boxShadow: active ? `0 0 0 3px ${BROWN_PRIMARY}15` : 'none',
              }}
            >
              {/* Checkbox */}
              <div
                className="w-5 h-5 rounded-md flex items-center justify-center shrink-0
                           transition-all duration-200"
                style={{
                  backgroundColor: active ? BROWN_PRIMARY : T.surface,
                  border:          `1.5px solid ${active ? BROWN_PRIMARY : T.borderBrown}`,
                }}
              >
                {active && (
                  <svg viewBox="0 0 12 12" fill="none" stroke={THEME.btn.text} strokeWidth="2.5" className="w-2.5 h-2.5">
                    <path d="M2 6l3 3 5-5" />
                  </svg>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-bold" style={{ color: active ? T.accentText : T.textPrimary }}>
                    {c.label}
                  </p>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{
                      backgroundColor: active
                        ? darkMode ? 'rgba(139,107,71,0.25)' : 'rgba(139,107,71,0.15)'
                        : T.surface,
                      border: `1px solid ${active ? BROWN_PRIMARY : T.borderSubtle}`,
                      color:  active ? T.accentText : T.textMuted,
                    }}
                  >
                    {c.sub}
                  </span>
                </div>
                <p className="text-xs truncate" style={{ color: T.textMuted }}>{c.events}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}