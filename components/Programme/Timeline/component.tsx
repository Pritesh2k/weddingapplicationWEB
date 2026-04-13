'use client'

import { useState } from 'react'
import { btnPrimary, THEME } from '@/lib/theme'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/Auth/AuthContext'
import { supabase } from '@/DB/client'
import type { SubEvent } from '@/lib/Programme/types'
import { fmtDate, fmtTime } from '@/lib/Programme/helpers'
import { IconCalendar, IconClock } from '@/lib/Programme/icons'

interface Props {
  subEvents: SubEvent[]
  programmeId: string
  onChange: (updated: SubEvent[]) => void
}

const EMPTY_EVENT = (): Omit<SubEvent, 'id'> => ({
  name: '', date: '', startTime: '', endTime: '',
})

export default function Timeline({ subEvents, programmeId, onChange }: Props) {
  const { darkMode, T } = useTheme()
  const { user } = useAuth()

  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<SubEvent[]>(subEvents)
  const [newEvent, setNewEvent] = useState(EMPTY_EVENT())
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Patch a single field on a draft event
  const patch = (id: string, field: keyof SubEvent, value: string) =>
    setDraft(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e))

  const openEdit = () => {
    setDraft(subEvents)
    setNewEvent(EMPTY_EVENT())
    setError('')
    setEditing(true)
  }

  const cancel = () => {
    setDraft(subEvents)
    setEditing(false)
    setError('')
  }

  const addRow = () => {
    if (!newEvent.name.trim()) return
    // Optimistically add with temp id — will be replaced on save
    setDraft(prev => [...prev, { ...newEvent, id: `temp_${Date.now()}` }])
    setNewEvent(EMPTY_EVENT())
  }

  const removeRow = (id: string) =>
    setDraft(prev => prev.filter(e => e.id !== id))

  const save = async () => {
    if (!user) return
    setSaving(true)
    setError('')

    try {
      const original = subEvents
      const originalIds = new Set(original.map(e => e.id))
      const draftIds = new Set(draft.filter(e => !e.id.startsWith('temp_')).map(e => e.id))

      // 1. Delete removed events
      const deleted = original.filter(e => !draftIds.has(e.id))
      for (const e of deleted) {
        const { error } = await supabase.rpc('delete_sub_event', {
          p_uid: user.uid, p_programme_id: programmeId, p_event_id: e.id,
        })
        if (error) throw error
      }

      // 2. Insert new events (temp ids) and collect returned ids
      const saved: SubEvent[] = []
      for (const e of draft) {
        if (e.id.startsWith('temp_')) {
          const { data, error } = await supabase.rpc('insert_sub_event', {
            p_uid:          user.uid,
            p_programme_id: programmeId,
            p_title:        e.name,
            p_event_date:   e.date   || null,
            p_start_time:   e.startTime || null,
            p_end_time:     e.endTime   || null,
          })
          if (error) throw error
          saved.push({ ...e, id: data as string })
        } else {
          // 3. Update existing events
          const { error } = await supabase.rpc('update_sub_event', {
            p_uid:          user.uid,
            p_programme_id: programmeId,
            p_event_id:     e.id,
            p_title:        e.name,
            p_event_date:   e.date       || null,
            p_start_time:   e.startTime  || null,
            p_end_time:     e.endTime    || null,
          })
          if (error) throw error
          saved.push(e)
        }
      }

      onChange(saved)
      setEditing(false)
    } catch (err: unknown) {
      setError(`Save failed: ${(err as { message?: string }).message ?? 'unknown error'}`)
    } finally {
      setSaving(false)
    }
  }

  if (!editing && !subEvents.length) return null

  return (
    <div className="vow-section space-y-4">
      {/* Header */}
      <div className="px-1 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase mb-0.5" style={{ color: T.accentText }}>
            Schedule
          </p>
          <h2 className="text-base font-bold" style={{ color: T.textPrimary }}>Day Timeline</h2>
        </div>
        {!editing && (
          <button
            onClick={openEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                       transition-all duration-200 hover:scale-[1.02] focus:outline-none"
            style={{ backgroundColor: 'rgba(139,107,71,0.08)', color: T.accentText }}
          >
            ✎ Edit
          </button>
        )}
      </div>

      {/* View Mode */}
      {!editing && (
        <div className="relative">
          <div className="absolute left-3.5 top-4 bottom-4 w-px"
            style={{ background: darkMode ? 'rgba(160,120,72,0.28)' : 'rgba(139,107,71,0.20)', zIndex: 0 }} />
          <div className="relative space-y-2.5 sm:space-y-3" style={{ zIndex: 1 }}>
            {subEvents.map((evt, i) => (
              <div key={evt.id} className="flex items-center gap-3 sm:gap-4">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full shrink-0 flex items-center
                               justify-center text-[10px] font-bold"
                  style={{ background: btnPrimary.bg, color: THEME.btn.text, zIndex: 2,
                    boxShadow: `0 0 0 3px ${T.bg}, 0 0 0 4px ${darkMode ? 'rgba(160,120,72,0.28)' : 'rgba(139,107,71,0.20)'}` }}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-4"
                  style={{ backgroundColor: T.surface, border: `1px solid ${T.borderSubtle}`,
                    boxShadow: darkMode ? '0 2px 12px rgba(0,0,0,0.18)' : '0 2px 10px rgba(139,107,71,0.05)' }}>
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-semibold leading-snug flex-1 min-w-0 truncate"
                      style={{ color: T.textPrimary }}>{evt.name || 'Unnamed event'}</p>
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
      )}

      {/* Edit Mode */}
      {editing && (
        <div className="rounded-2xl overflow-hidden"
          style={{ backgroundColor: T.surface, border: `1px solid ${T.borderSubtle}` }}>
          <div className="px-5 py-4 space-y-3">

            {/* Existing event rows */}
            {draft.map((evt) => (
              <div key={evt.id} className="grid gap-2"
                style={{ gridTemplateColumns: '1fr 110px 90px 90px 28px' }}>
                <input
                  value={evt.name}
                  onChange={e => patch(evt.id, 'name', e.target.value)}
                  placeholder="Event name"
                  className="px-3 py-2 rounded-xl text-xs focus:outline-none"
                  style={{ backgroundColor: T.inputBg, border: `1px solid ${T.inputBorder}`, color: T.textPrimary }}
                />
                <input type="date" value={evt.date}
                  onChange={e => patch(evt.id, 'date', e.target.value)}
                  className="px-2 py-2 rounded-xl text-xs focus:outline-none"
                  style={{ backgroundColor: T.inputBg, border: `1px solid ${T.inputBorder}`, color: T.textPrimary,
                    colorScheme: darkMode ? 'dark' : 'light' }}
                />
                <input type="time" value={evt.startTime}
                  onChange={e => patch(evt.id, 'startTime', e.target.value)}
                  className="px-2 py-2 rounded-xl text-xs focus:outline-none"
                  style={{ backgroundColor: T.inputBg, border: `1px solid ${T.inputBorder}`, color: T.textPrimary,
                    colorScheme: darkMode ? 'dark' : 'light' }}
                />
                <input type="time" value={evt.endTime}
                  onChange={e => patch(evt.id, 'endTime', e.target.value)}
                  className="px-2 py-2 rounded-xl text-xs focus:outline-none"
                  style={{ backgroundColor: T.inputBg, border: `1px solid ${T.inputBorder}`, color: T.textPrimary,
                    colorScheme: darkMode ? 'dark' : 'light' }}
                />
                <button onClick={() => removeRow(evt.id)}
                  className="flex items-center justify-center rounded-lg text-xs focus:outline-none
                             hover:opacity-60 transition-opacity"
                  style={{ color: T.textMuted }}>✕</button>
              </div>
            ))}

            {/* New event row */}
            <div className="pt-2" style={{ borderTop: `1px dashed ${T.borderSubtle}` }}>
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: T.textMuted }}>
                Add new event
              </p>
              <div className="grid gap-2" style={{ gridTemplateColumns: '1fr 110px 90px 90px 28px' }}>
                <input
                  value={newEvent.name}
                  onChange={e => setNewEvent(prev => ({ ...prev, name: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && addRow()}
                  placeholder="Event name *"
                  className="px-3 py-2 rounded-xl text-xs focus:outline-none"
                  style={{ backgroundColor: T.inputBg, border: `1px solid ${T.inputBorder}`, color: T.textPrimary }}
                />
                <input type="date" value={newEvent.date}
                  onChange={e => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                  className="px-2 py-2 rounded-xl text-xs focus:outline-none"
                  style={{ backgroundColor: T.inputBg, border: `1px solid ${T.inputBorder}`, color: T.textPrimary,
                    colorScheme: darkMode ? 'dark' : 'light' }}
                />
                <input type="time" value={newEvent.startTime}
                  onChange={e => setNewEvent(prev => ({ ...prev, startTime: e.target.value }))}
                  className="px-2 py-2 rounded-xl text-xs focus:outline-none"
                  style={{ backgroundColor: T.inputBg, border: `1px solid ${T.inputBorder}`, color: T.textPrimary,
                    colorScheme: darkMode ? 'dark' : 'light' }}
                />
                <input type="time" value={newEvent.endTime}
                  onChange={e => setNewEvent(prev => ({ ...prev, endTime: e.target.value }))}
                  className="px-2 py-2 rounded-xl text-xs focus:outline-none"
                  style={{ backgroundColor: T.inputBg, border: `1px solid ${T.inputBorder}`, color: T.textPrimary,
                    colorScheme: darkMode ? 'dark' : 'light' }}
                />
                <button onClick={addRow} disabled={!newEvent.name.trim()}
                  className="flex items-center justify-center rounded-lg text-xs font-bold focus:outline-none
                             disabled:opacity-30 hover:scale-110 transition-transform"
                  style={{ color: T.accentText }}>+</button>
              </div>
            </div>

            {error && <p className="text-xs" style={{ color: '#D4847A' }}>⚠ {error}</p>}

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <button onClick={save} disabled={saving}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200
                           hover:scale-[1.01] focus:outline-none disabled:opacity-50"
                style={{ background: btnPrimary.bg, color: btnPrimary.color, boxShadow: btnPrimary.shadow }}>
                {saving ? 'Saving…' : 'Save Timeline'}
              </button>
              <button onClick={cancel}
                className="px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-200
                           hover:scale-[1.01] focus:outline-none"
                style={{ backgroundColor: T.surface2, border: `1px solid ${T.borderSubtle}`, color: T.textMuted }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}