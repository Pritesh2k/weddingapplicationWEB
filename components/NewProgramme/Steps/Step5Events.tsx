'use client'

import { BROWN_PRIMARY } from '@/lib/theme'
import { useTheme } from '@/context/ThemeContext'
import type { ProgrammeData, SubEvent } from '@/lib/NewProgramme/types'

interface Props {
  data:          ProgrammeData
  inp:           () => React.CSSProperties
  suggestEvents: () => void
  addEvent:      () => void
  removeEvent:   (id: string) => void
  updateEvent:   (id: string, field: keyof SubEvent, value: string) => void
}

export default function Step5Events({ data, inp, suggestEvents, addEvent, removeEvent, updateEvent }: Props) {
  const { darkMode, T } = useTheme()

  return (
    <div>
      <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: T.accentText }}>
        Step 5 · Events
      </p>
      <h2 className="text-2xl font-bold tracking-tight mb-1" style={{ color: T.textPrimary }}>
        Build your programme
      </h2>
      <p className="text-sm mb-2" style={{ color: T.textMuted }}>
        Add the key events in your wedding — ceremony, reception, pre-events and more.
      </p>
      <p className="text-xs mb-5" style={{ color: '#D4847A' }}>
        * At least one named event is required to continue.
      </p>

      {/* Suggest button */}
      {data.cultures.length > 0 && (
        <button
          type="button"
          onClick={suggestEvents}
          className="w-full py-2.5 rounded-xl text-sm font-semibold mb-5 transition-all duration-200
                     hover:scale-[1.01] focus:outline-none"
          style={{
            background: darkMode ? 'rgba(139,107,71,0.15)' : 'rgba(139,107,71,0.09)',
            border: `1.5px dashed ${BROWN_PRIMARY}`,
            color: T.accentText,
          }}
        >
          ✨ Suggest events from my traditions
        </button>
      )}

      {/* Event list */}
      <div className="space-y-4">
        {data.subEvents.map((evt, idx) => (
          <div
            key={evt.id}
            className="rounded-xl p-4 space-y-3"
            style={{
              backgroundColor: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(139,107,71,0.04)',
              border: `1px solid ${T.borderSubtle}`,
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: T.accentText }}>
                Event {idx + 1}
              </span>
              <button
                type="button"
                onClick={() => removeEvent(evt.id)}
                className="text-xs px-2.5 py-1 rounded-lg transition-all duration-200 hover:opacity-80 focus:outline-none"
                style={{
                  background: 'rgba(176,80,70,0.08)',
                  border: '1px solid rgba(176,80,70,0.2)',
                  color: '#D4847A',
                }}
              >
                Remove
              </button>
            </div>

            {/* Event name — required */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: T.textMuted }}>
                Event name <span style={{ color: '#D4847A' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Ceremony, Reception, Mehndi..."
                value={evt.name}
                onChange={(e) => updateEvent(evt.id, 'name', e.target.value)}
                style={inp()}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {/* Date — optional */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: T.textMuted }}>
                  Date <span style={{ opacity: 0.5, fontWeight: 400, fontSize: '10px', textTransform: 'none' }}>(opt)</span>
                </label>
                <input
                  type="date"
                  value={evt.date}
                  onChange={(e) => updateEvent(evt.id, 'date', e.target.value)}
                  style={{ ...inp(), colorScheme: darkMode ? 'dark' : 'light' }}
                />
              </div>
              {/* Start time — optional */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: T.textMuted }}>
                  Start <span style={{ opacity: 0.5, fontWeight: 400, fontSize: '10px', textTransform: 'none' }}>(opt)</span>
                </label>
                <input
                  type="time"
                  value={evt.startTime}
                  onChange={(e) => updateEvent(evt.id, 'startTime', e.target.value)}
                  style={{ ...inp(), colorScheme: darkMode ? 'dark' : 'light' }}
                />
              </div>
              {/* End time — optional */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: T.textMuted }}>
                  End <span style={{ opacity: 0.5, fontWeight: 400, fontSize: '10px', textTransform: 'none' }}>(opt)</span>
                </label>
                <input
                  type="time"
                  value={evt.endTime}
                  onChange={(e) => updateEvent(evt.id, 'endTime', e.target.value)}
                  style={{ ...inp(), colorScheme: darkMode ? 'dark' : 'light' }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add event */}
      <button
        type="button"
        onClick={addEvent}
        className="w-full mt-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                   hover:scale-[1.01] focus:outline-none"
        style={{
          background: 'transparent',
          border: `1.5px dashed ${T.borderBrown}`,
          color: T.accentText,
        }}
      >
        + Add event
      </button>

      {data.subEvents.length > 0 && (
        <p className="mt-3 text-xs text-center" style={{ color: T.textMuted }}>
          {data.subEvents.length} event{data.subEvents.length !== 1 ? 's' : ''} added
        </p>
      )}
    </div>
  )
}