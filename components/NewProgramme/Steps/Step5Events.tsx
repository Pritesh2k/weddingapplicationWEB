'use client'

import { useTheme } from '@/context/ThemeContext'
import type { ProgrammeData, SubEvent } from '@/lib/NewProgramme/types'
import { IconPlus, IconTrash, IconSparkle } from '@/lib/NewProgramme/icons'

interface Props {
  data:        ProgrammeData
  inp:         () => React.CSSProperties
  suggestEvents: () => void
  addEvent:    () => void
  removeEvent: (id: string) => void
  updateEvent: (id: string, field: keyof SubEvent, value: string) => void
}

export default function Step5Events({ data, inp, suggestEvents, addEvent, removeEvent, updateEvent }: Props) {
  const { darkMode, T } = useTheme()
  const dateStyle = { ...inp(), padding: '7px 10px', fontSize: '12px', colorScheme: darkMode ? 'dark' as const : 'light' as const }

  return (
    <div>
      <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: T.accentText }}>
        Step 5 · Events
      </p>
      <h2 className="text-2xl font-bold tracking-tight mb-1" style={{ color: T.textPrimary }}>
        Build your programme
      </h2>
      <p className="text-sm mb-5" style={{ color: T.textMuted }}>
        Add or adjust the events in your wedding programme.
      </p>

      {/* Suggest button */}
      {data.cultures.length > 0 && data.subEvents.length === 0 && (
        <button
          type="button"
          onClick={suggestEvents}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                     text-sm font-semibold mb-4 transition-all duration-200
                     hover:scale-[1.01] focus:outline-none"
          style={{
            backgroundColor: T.surface,
            border:          `1.5px dashed ${T.borderBrown}`,
            color:           T.accentText,
          }}
        >
          <IconSparkle /> Suggest events from your traditions
        </button>
      )}

      {/* Events list */}
      <div className="space-y-2.5 mb-4 max-h-72 overflow-y-auto pr-0.5">
        {data.subEvents.map((evt, i) => (
          <div
            key={evt.id}
            className="rounded-xl p-3 space-y-2"
            style={{ backgroundColor: T.surface, border: `1px solid ${T.borderSubtle}` }}
          >
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-bold w-5 text-center shrink-0 tabular-nums"
                style={{ color: T.accentText }}
              >
                {i + 1}
              </span>
              <input
                type="text"
                placeholder="Event name"
                value={evt.name}
                onChange={(e) => updateEvent(evt.id, 'name', e.target.value)}
                style={{ ...inp(), padding: '8px 12px' }}
              />
              <button
                type="button"
                onClick={() => removeEvent(evt.id)}
                className="shrink-0 p-1.5 rounded-lg transition-colors focus:outline-none"
                style={{ color: T.textMuted }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#D4847A')}
                onMouseLeave={(e) => (e.currentTarget.style.color = T.textMuted)}
              >
                <IconTrash />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 pl-7">
              <input type="date"  value={evt.date}      onChange={(e) => updateEvent(evt.id, 'date', e.target.value)}      style={dateStyle} />
              <input type="time"  value={evt.startTime} onChange={(e) => updateEvent(evt.id, 'startTime', e.target.value)} style={dateStyle} placeholder="Start" />
              <input type="time"  value={evt.endTime}   onChange={(e) => updateEvent(evt.id, 'endTime', e.target.value)}   style={dateStyle} placeholder="End"   />
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addEvent}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                   text-sm font-medium transition-all duration-200
                   hover:scale-[1.01] focus:outline-none"
        style={{
          backgroundColor: T.surface,
          border:          `1px dashed ${T.borderSubtle}`,
          color:           T.textMuted,
        }}
      >
        <IconPlus /> Add event
      </button>
    </div>
  )
}