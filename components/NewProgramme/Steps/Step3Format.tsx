'use client'

import { BROWN_PRIMARY } from '@/lib/theme'
import { useTheme } from '@/context/ThemeContext'
import { FORMATS } from '@/lib/NewProgramme/constants'
import type { ProgrammeData, WeddingFormat } from '@/lib/NewProgramme/types'

interface Props {
  data: ProgrammeData
  patch: (f: Partial<ProgrammeData>) => void
}

export default function Step3Format({ data, patch }: Props) {
  const { darkMode, T } = useTheme()

  return (
    <div>
      <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: T.accentText }}>
        Step 3 · Format
      </p>
      <h2 className="text-2xl font-bold tracking-tight mb-1" style={{ color: T.textPrimary }}>
        What is your wedding format?
      </h2>
      <p className="text-sm mb-2" style={{ color: T.textMuted }}>
        This shapes how your timeline and events are structured.
      </p>
      <p className="text-xs mb-6" style={{ color: '#D4847A' }}>
        * Required — you must select one to continue.
      </p>

      <div className="space-y-3">
        {FORMATS.map(({ value, label, description }) => {
          const active = data.format === value

          return (
            <button
              key={value}
              type="button"
              onClick={() => patch({ format: value as WeddingFormat })}
              className="w-full text-left px-5 py-4 rounded-xl transition-all duration-200 focus:outline-none"
              style={{
                backgroundColor: active
                  ? darkMode ? 'rgba(139,107,71,0.18)' : 'rgba(139,107,71,0.10)'
                  : T.surface,
                border: `1.5px solid ${active ? BROWN_PRIMARY : T.borderSubtle}`,
                boxShadow: active ? `0 0 0 3px ${BROWN_PRIMARY}18` : 'none',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold" style={{ color: active ? T.accentText : T.textPrimary }}>
                  {label}
                </span>
                {active && (
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(139,107,71,0.15)', color: T.accentText }}
                  >
                    ✓
                  </span>
                )}
              </div>

              {description && (
                <p className="text-xs mt-1" style={{ color: T.textMuted }}>
                  {description}
                </p>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}