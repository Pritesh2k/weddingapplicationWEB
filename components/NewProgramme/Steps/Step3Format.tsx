'use client'

import { btnPrimary, BROWN_PRIMARY, THEME } from '@/lib/theme'
import { useTheme } from '@/context/ThemeContext'
import type { ProgrammeData, WeddingFormat } from '@/lib/NewProgramme/types'
import { IconCheck } from '@/lib/NewProgramme/icons'

const FORMATS: { id: WeddingFormat; label: string; desc: string; icon: string }[] = [
  { id: 'single-day',  label: 'Single Day',   icon: '☀️', desc: 'One main event, optional micro-events'     },
  { id: 'multi-day',   label: 'Multi-Day',    icon: '📅', desc: 'Linked events over several days'           },
  { id: 'destination', label: 'Destination',  icon: '✈️', desc: 'Travel, accommodation & logistics focus'   },
  { id: 'custom',      label: 'Custom',       icon: '✦',  desc: 'Start from a blank structure'              },
]

interface Props { data: ProgrammeData; patch: (f: Partial<ProgrammeData>) => void }

export default function Step3Format({ data, patch }: Props) {
  const { darkMode, T } = useTheme()
  return (
    <div>
      <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: T.accentText }}>
        Step 3 · Format
      </p>
      <h2 className="text-2xl font-bold tracking-tight mb-1" style={{ color: T.textPrimary }}>
        What kind of wedding?
      </h2>
      <p className="text-sm mb-8" style={{ color: T.textMuted }}>
        This shapes your programme structure, logistics, and planning model.
      </p>
      <div className="grid grid-cols-2 gap-3">
        {FORMATS.map((f) => {
          const active = data.format === f.id
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => patch({ format: f.id })}
              className="group relative text-left p-4 rounded-2xl transition-all duration-200
                         focus:outline-none hover:scale-[1.02]"
              style={{
                backgroundColor: active
                  ? darkMode ? 'rgba(139,107,71,0.18)' : 'rgba(139,107,71,0.10)'
                  : T.surface,
                border:    `1.5px solid ${active ? BROWN_PRIMARY : T.borderSubtle}`,
                boxShadow: active
                  ? `0 0 0 3px ${BROWN_PRIMARY}18`
                  : '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              {/* Check badge */}
              {active && (
                <div
                  className="absolute top-3 right-3 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: btnPrimary.bg, color: THEME.btn.text }}
                >
                  <IconCheck />
                </div>
              )}
              <span className="text-xl mb-2 block">{f.icon}</span>
              <p className="text-sm font-bold mb-1" style={{ color: active ? T.accentText : T.textPrimary }}>
                {f.label}
              </p>
              <p className="text-xs leading-relaxed" style={{ color: T.textMuted }}>{f.desc}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}