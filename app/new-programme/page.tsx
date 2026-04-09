'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { btnPrimary } from '@/lib/theme'
import { useNavigate } from '@/context/NavigationContext'
import { useAuth } from '@/context/Auth/AuthContext'
import { supabase } from '@/DB/client'

import NewProgrammeHeader from '@/components/NewProgramme/Header/component'
import StepIndicator from '@/components/NewProgramme/StepIndicator/component'
import StepNavigation from '@/components/NewProgramme/Navigation/component'
import Step1Couple from '@/components/NewProgramme/Steps/Step1Couple'
import Step2Programme from '@/components/NewProgramme/Steps/Step2Programme'
import Step3Format from '@/components/NewProgramme/Steps/Step3Format'
import Step4Traditions from '@/components/NewProgramme/Steps/Step4Traditions'
import Step5Events from '@/components/NewProgramme/Steps/Step5Events'
import Step6Constraints from '@/components/NewProgramme/Steps/Step6Constraints'

import { EMPTY, TOTAL_STEPS, SUGGESTED_EVENTS } from '@/lib/NewProgramme/constants'
import type { ProgrammeData, CultureModule, SubEvent } from '@/lib/NewProgramme/types'

const DRAFT_KEY = 'vow-programme-draft'

export default function NewProgramme() {
  const { darkMode, T } = useTheme()
  const { navigate } = useNavigate()
  const { user } = useAuth()

  const [data, setData] = useState<ProgrammeData>(EMPTY)
  const [error, setError] = useState('')
  const [animDir, setAnimDir] = useState<'forward' | 'back'>('forward')
  const [visible, setVisible] = useState(true)
  const [saving, setSaving] = useState(false)
  const submittedRef = useRef(false)

  // ── Rehydrate draft ───────────────────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY)
      if (saved && !submittedRef.current) {
        const parsed: ProgrammeData = JSON.parse(saved)
        if (parsed.coupleNameA || parsed.coupleNameB || parsed.step > 1) setData(parsed)
      }
    } catch { }
  }, [])

  // ── Auto-save draft ───────────────────────────────────────
  useEffect(() => {
    if (submittedRef.current) return
    if (!data.coupleNameA && !data.coupleNameB && data.step === 1) return
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(data)) } catch { }
  }, [data])

  const patch = (fields: Partial<ProgrammeData>) => setData((d) => ({ ...d, ...fields }))

  const goTo = (next: number, dir: 'forward' | 'back') => {
    setError('')
    setAnimDir(dir)
    setVisible(false)
    setTimeout(() => { setData((d) => ({ ...d, step: next })); setVisible(true) }, 220)
  }

  // ── Validation ────────────────────────────────────────────
  const validate = (): boolean => {
    const fail = (msg: string) => { setError(msg); return false }
    switch (data.step) {
      case 1: return (data.coupleNameA.trim() && data.coupleNameB.trim()) ? true : fail('Please enter both names.')
      case 2: return (data.title.trim() && data.dateFrom) ? true : fail('Please enter a title and start date.')
      case 3: return data.format ? true : fail('Please select a wedding format.')
      case 4: return data.cultures.length > 0 ? true : fail('Please select at least one tradition.')
      case 5: return data.subEvents.length > 0 ? true : fail('Please add at least one event.')
      case 6: return (data.guestEstimate && data.budgetTarget) ? true : fail('Please fill in guest estimate and budget.')
    }
    return true
  }

  // ── Next / Submit ─────────────────────────────────────────
  const next = async () => {
    if (!validate()) return

    if (data.step < TOTAL_STEPS) {
      goTo(data.step + 1, 'forward')
      return
    }

    // ── Final step: save to Supabase ──────────────────────
    if (!user) return
    setSaving(true)
    setError('')
    submittedRef.current = true

    // Re-set UID immediately before insert — session vars are transaction-scoped
    await supabase.rpc('set_firebase_uid', { uid: user.uid })

    // 1. Create programme + member atomically via RPC
    const { data: programId, error: progError } = await supabase
      .rpc('create_wedding_programme', {
        p_uid: user.uid,
        p_title: data.title.trim(),
        p_format: data.format,
        p_couple_name_a: data.coupleNameA || null,
        p_couple_name_b: data.coupleNameB || null,
        p_date_start: data.dateFrom || null,
        p_date_end: data.dateTo || null,
        p_region: data.region || null,
        p_currency: data.currency || 'GBP',
        p_guest_estimate: data.guestEstimate || null,
        p_budget_target: data.budgetTarget || null,
        p_priorities: data.priorities,
      })

    if (progError || !programId) {
      submittedRef.current = false
      setSaving(false)
      setError('Failed to save programme. Please try again.')
      console.error('[NewProgramme]', progError?.message)
      return
    }

    // 2. Insert sub-events
    if (data.subEvents.length > 0) {
      await supabase.from('events').insert(
        data.subEvents.map((e, i) => ({
          program_id: programId,
          title: e.name || `Event ${i + 1}`,
          event_date: e.date || null,
          start_time: e.startTime || null,
          end_time: e.endTime || null,
          sort_order: i,
        }))
      )
    }

    // 3. Clean up draft
    localStorage.removeItem(DRAFT_KEY)
    localStorage.removeItem('vow-programme')

    setSaving(false)
    navigate(`/programme/${programId}`)
  }

  const back = () => { if (data.step > 1) goTo(data.step - 1, 'back') }

  // ── Sub-event helpers ─────────────────────────────────────
  const suggestEvents = () => {
    const names = new Set<string>()
    data.cultures.forEach((c) => SUGGESTED_EVENTS[c]?.forEach((e) => names.add(e)))
    patch({
      subEvents: Array.from(names).map((name, i) => ({
        id: `evt_${Date.now()}_${i}`, name,
        date: data.dateFrom || '', startTime: '', endTime: '',
      })),
    })
  }

  const addEvent = () => patch({
    subEvents: [...data.subEvents, {
      id: `evt_${Date.now()}`, name: '',
      date: data.dateFrom || '', startTime: '', endTime: '',
    }],
  })

  const removeEvent = (id: string) =>
    patch({ subEvents: data.subEvents.filter((e) => e.id !== id) })

  const updateEvent = (id: string, field: keyof SubEvent, value: string) =>
    patch({ subEvents: data.subEvents.map((e) => (e.id === id ? { ...e, [field]: value } : e)) })

  const toggleCulture = (c: CultureModule) => {
    const next = data.cultures.includes(c)
      ? data.cultures.filter((x) => x !== c)
      : [...data.cultures, c]
    patch({ cultures: next, subEvents: [] })
  }

  const togglePriority = (p: string) => {
    const next = data.priorities.includes(p)
      ? data.priorities.filter((x) => x !== p)
      : data.priorities.length < 3 ? [...data.priorities, p] : data.priorities
    patch({ priorities: next })
  }

  // ── Shared input style ────────────────────────────────────
  const inp = (): React.CSSProperties => ({
    backgroundColor: T.inputBg,
    border: `1px solid ${T.inputBorder}`,
    color: T.textPrimary,
    outline: 'none',
    borderRadius: '12px',
    padding: '12px 14px',
    fontSize: '14px',
    width: '100%',
    transition: 'border-color 0.2s',
  })

  const progress = ((data.step - 1) / (TOTAL_STEPS - 1)) * 100

  const cardStyle: React.CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateX(0)' : animDir === 'forward' ? 'translateX(16px)' : 'translateX(-16px)',
    transition: 'opacity 220ms ease, transform 220ms ease',
  }

  return (
    <div
      className="min-h-screen font-sans antialiased flex flex-col"
      style={{ backgroundColor: T.bg, color: T.textPrimary }}
    >
      {/* Ambient bg */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden>
        <div className="absolute inset-0" style={{ background: T.heroBg }} />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-175 h-100 rounded-full blur-3xl"
          style={{
            background: darkMode
              ? 'radial-gradient(ellipse, rgba(160,120,72,0.10) 0%, transparent 70%)'
              : 'radial-gradient(ellipse, rgba(139,107,71,0.08) 0%, transparent 70%)',
          }}
        />
      </div>

      <NewProgrammeHeader progress={progress} />

      <main className="relative z-10 flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-xl">
          <StepIndicator currentStep={data.step} />

          {/* Card */}
          <div style={cardStyle}>
            <div
              className="rounded-2xl p-8 md:p-10"
              style={{
                backgroundColor: T.surface,
                border: `1px solid ${T.borderBrown}`,
                boxShadow: darkMode
                  ? '0 24px 64px rgba(0,0,0,0.45)'
                  : '0 12px 40px rgba(139,107,71,0.10)',
              }}
            >
              {/* Error */}
              {error && (
                <div
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm mb-6"
                  style={{
                    background: 'rgba(176,80,70,0.10)',
                    border: '1px solid rgba(176,80,70,0.25)',
                    color: '#D4847A',
                  }}
                  role="alert"
                >
                  <span>⚠</span> {error}
                </div>
              )}

              {data.step === 1 && <Step1Couple data={data} patch={patch} inp={inp} />}
              {data.step === 2 && <Step2Programme data={data} patch={patch} inp={inp} />}
              {data.step === 3 && <Step3Format data={data} patch={patch} />}
              {data.step === 4 && <Step4Traditions data={data} toggleCulture={toggleCulture} />}
              {data.step === 5 && (
                <Step5Events
                  data={data} inp={inp}
                  suggestEvents={suggestEvents}
                  addEvent={addEvent}
                  removeEvent={removeEvent}
                  updateEvent={updateEvent}
                />
              )}
              {data.step === 6 && (
                <Step6Constraints
                  data={data} patch={patch} inp={inp}
                  togglePriority={togglePriority}
                />
              )}

              <StepNavigation step={data.step} onBack={back} onNext={next} loading={saving} />
            </div>
          </div>

          <p className="mt-5 text-center text-xs" style={{ color: T.textMuted }}>
            Progress is saved automatically. You can leave and return at any time.
          </p>
        </div>
      </main>
    </div>
  )
}