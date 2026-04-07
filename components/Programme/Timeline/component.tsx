'use client'

import { btnPrimary, THEME } from '@/lib/theme'
import { useTheme } from '@/context/ThemeContext'
import type { SubEvent } from '@/lib/Programme/types'
import { fmtDate, fmtTime } from '@/lib/Programme/helpers'
import { IconCalendar, IconClock } from '@/lib/Programme/icons'

interface Props { subEvents: SubEvent[] }

export default function Timeline({ subEvents }: Props) {
  const { darkMode, T } = useTheme()
  if (!subEvents.length) return null

  return (
    <div className="vow-section space-y-4">
      <div className="px-1">
        <p className="text-[10px] font-bold tracking-[0.18em] uppercase mb-0.5" style={{ color: T.accentText }}>
          Schedule
        </p>
        <h2 className="text-base font-bold" style={{ color: T.textPrimary }}>Day Timeline</h2>
      </div>

      <div className="relative">
        {/* Spine */}
        <div
          className="absolute left-3.5 top-4 bottom-4 w-px"
          style={{
            background: darkMode ? 'rgba(160,120,72,0.28)' : 'rgba(139,107,71,0.20)',
            zIndex: 0,
          }}
        />

        <div className="relative space-y-2.5 sm:space-y-3" style={{ zIndex: 1 }}>
          {subEvents.map((evt, i) => (
            <div key={evt.id} className="flex items-center gap-3 sm:gap-4">
              {/* Node */}
              <div
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full shrink-0 flex items-center
                           justify-center text-[10px] font-bold"
                style={{
                  background:  btnPrimary.bg,
                  color:       THEME.btn.text,
                  zIndex:      2,
                  boxShadow:   `0 0 0 3px ${T.bg}, 0 0 0 4px ${darkMode ? 'rgba(160,120,72,0.28)' : 'rgba(139,107,71,0.20)'}`,
                }}
              >
                {i + 1}
              </div>

              {/* Card */}
              <div
                className="flex-1 min-w-0 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-4"
                style={{
                  backgroundColor: T.surface,
                  border:          `1px solid ${T.borderSubtle}`,
                  boxShadow:       darkMode
                    ? '0 2px 12px rgba(0,0,0,0.18)'
                    : '0 2px 10px rgba(139,107,71,0.05)',
                }}
              >
                <div className="flex items-center justify-between gap-4">
                  <p
                    className="text-sm font-semibold leading-snug flex-1 min-w-0 truncate"
                    style={{ color: T.textPrimary }}
                  >
                    {evt.name || 'Unnamed event'}
                  </p>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {evt.date && (
                      <span className="flex items-center gap-1.5 text-[11px]" style={{ color: T.textMuted }}>
                        <IconCalendar /> {fmtDate(evt.date)}
                      </span>
                    )}
                    {(evt.startTime || evt.endTime) && (
                      <span className="flex items-center gap-1.5 text-[11px]" style={{ color: T.textMuted }}>
                        <IconClock />
                        {fmtTime(evt.startTime)}{evt.endTime ? ` – ${fmtTime(evt.endTime)}` : ''}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}