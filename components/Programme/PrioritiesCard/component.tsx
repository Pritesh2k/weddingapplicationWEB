'use client'

import { useState } from 'react'
import { btnPrimary } from '@/lib/theme'
import { useTheme } from '@/context/ThemeContext'
import { supabase } from '@/DB/client'
import { useAuth } from '@/context/Auth/AuthContext'
import { PRIORITIES as PRESETS } from '@/lib/NewProgramme/constants'

interface Props {
  priorities: string[]
  programmeId: string
  onChange?: (updated: string[]) => void
}

const IconPlus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
    <path d="M12 5v14M5 12h14" />
  </svg>
)
const IconX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
)
const IconEdit = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)

export default function PrioritiesCard({ priorities, programmeId, onChange }: Props) {
  const { T, darkMode } = useTheme()
  const { user } = useAuth()
  const [editing, setEditing]         = useState(false)
  const [selected, setSelected]       = useState<string[]>(priorities)
  const [customInput, setCustomInput] = useState('')
  const [saving, setSaving]           = useState(false)
  const [saveError, setSaveError]     = useState('')

  const toggle = (p: string) => {
    setSelected(prev =>
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    )
  }

  const addCustom = () => {
    const trimmed = customInput.trim()
    if (!trimmed || selected.includes(trimmed)) return
    setSelected(prev => [...prev, trimmed])
    setCustomInput('')
  }

  const save = async () => {
    if (!user) return
    setSaving(true)
    setSaveError('')

    const { error } = await supabase.rpc('update_wedding_programme', {
      p_uid:          user.uid,
      p_programme_id: programmeId,
      p_priorities:   selected,
    })

    setSaving(false)

    if (error) {
      console.error('[PrioritiesCard] save failed:', error.message)
      setSaveError('Failed to save. Please try again.')
      return
    }

    setEditing(false)
    onChange?.(selected)
  }

  const cancel = () => {
    setSelected(priorities)
    setCustomInput('')
    setSaveError('')
    setEditing(false)
  }

  // All presets + any custom ones not in presets
  const allOptions = [
    ...PRESETS,
    ...selected.filter(s => !PRESETS.includes(s)),
  ]

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: T.surface,
        border: `1px solid ${T.borderSubtle}`,
        boxShadow: '0 2px 12px rgba(139,107,71,0.06)',
      }}
    >
      {/* Header */}
      <div className="px-5 sm:px-6 pt-5 pb-4 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${T.borderSubtle}` }}>
        <div className="flex items-center gap-2.5">
          <div className="w-0.5 h-8 rounded-full shrink-0" style={{ background: btnPrimary.bg }} />
          <div>
            <p className="text-[10px] font-bold tracking-[0.18em] uppercase" style={{ color: T.accentText }}>
              Focus
            </p>
            <h2 className="text-sm font-bold" style={{ color: T.textPrimary }}>Top Priorities</h2>
          </div>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                       transition-all duration-200 hover:scale-[1.02] focus:outline-none"
            style={{ backgroundColor: 'rgba(139,107,71,0.08)', color: T.accentText }}
          >
            <IconEdit />
            {selected.length === 0 ? 'Add Focus' : 'Edit'}
          </button>
        )}
      </div>

      {/* View mode */}
      {!editing && (
        <div className="px-5 sm:px-6 py-4">
          {selected.length === 0 ? (
            <p className="text-xs" style={{ color: T.textMuted }}>
              No priorities set yet. Click <span style={{ color: T.accentText }}>Add Focus</span> to define what matters most.
            </p>
          ) : (
            <div className="space-y-3">
              {selected.map((p, i) => (
                <div key={p} className="flex items-center gap-3">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                    style={{
                      backgroundColor: 'rgba(139,107,71,0.08)',
                      border: `1px solid ${T.borderSubtle}`,
                      color: T.accentText,
                    }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-xs font-medium flex-1" style={{ color: T.textPrimary }}>{p}</span>
                </div>
              ))}
              <p className="text-[10px] pt-1" style={{ color: T.textMuted }}>
                {selected.length} priorit{selected.length !== 1 ? 'ies' : 'y'} defined
              </p>
            </div>
          )}
        </div>
      )}

      {/* Edit mode */}
      {editing && (
        <div className="px-5 sm:px-6 py-4 space-y-4">

          {/* Preset chips */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: T.textMuted }}>
              Select from presets
            </p>
            <div className="flex flex-wrap gap-2">
              {allOptions.map(p => {
                const active = selected.includes(p)
                return (
                  <button
                    key={p}
                    onClick={() => toggle(p)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200
                               hover:scale-[1.02] focus:outline-none"
                    style={{
                      backgroundColor: active
                        ? 'rgba(139,107,71,0.15)'
                        : darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                      border: `1px solid ${active ? 'rgba(139,107,71,0.4)' : T.borderSubtle}`,
                      color: active ? T.accentText : T.textMuted,
                    }}
                  >
                    {active && <span className="mr-1">✓</span>}
                    {p}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Custom input */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: T.textMuted }}>
              Or add your own
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={customInput}
                onChange={e => setCustomInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCustom()}
                placeholder="e.g. Stress-free planning..."
                className="flex-1 px-3 py-2 rounded-xl text-xs focus:outline-none"
                style={{
                  backgroundColor: T.inputBg,
                  border: `1px solid ${T.inputBorder}`,
                  color: T.textPrimary,
                }}
              />
              <button
                onClick={addCustom}
                disabled={!customInput.trim()}
                className="px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5
                           transition-all duration-200 hover:scale-[1.02] focus:outline-none
                           disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: btnPrimary.bg, color: btnPrimary.color }}
              >
                <IconPlus /> Add
              </button>
            </div>
          </div>

          {/* Selected list with remove */}
          {selected.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: T.textMuted }}>
                Selected ({selected.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {selected.map(p => (
                  <span
                    key={p}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: 'rgba(139,107,71,0.12)',
                      border: `1px solid rgba(139,107,71,0.3)`,
                      color: T.accentText,
                    }}
                  >
                    {p}
                    <button
                      onClick={() => toggle(p)}
                      className="hover:opacity-60 transition-opacity focus:outline-none"
                      aria-label={`Remove ${p}`}
                    >
                      <IconX />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {saveError && (
            <p className="text-xs" style={{ color: '#D4847A' }}>⚠ {saveError}</p>
          )}

          {/* Save / Cancel */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={save}
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200
                         hover:scale-[1.01] focus:outline-none disabled:opacity-50"
              style={{ background: btnPrimary.bg, color: btnPrimary.color, boxShadow: btnPrimary.shadow }}
            >
              {saving ? 'Saving…' : 'Save Priorities'}
            </button>
            <button
              onClick={cancel}
              className="px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-200
                         hover:scale-[1.01] focus:outline-none"
              style={{ backgroundColor: T.surface2, border: `1px solid ${T.borderSubtle}`, color: T.textMuted }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
