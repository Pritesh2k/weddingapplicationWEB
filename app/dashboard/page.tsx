'use client'

import { useEffect, useState, useCallback } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { btnPrimary } from '@/lib/theme'
import { useNavigate } from '@/context/NavigationContext'
import { useAuth } from '@/context/Auth/AuthContext'
import { supabase } from '@/DB/client'

import DashboardHeader from '@/components/Dashboard/Header/component'
import EmptyState from '@/components/Dashboard/EmptyState/component'
import ProgrammeCard from '@/components/Dashboard/ProgrammeCard/component'
import DeleteModal from '@/components/Dashboard/DeleteModal/components'
import { IconPlus } from '@/lib/Dashboard/icons'

import type { SupabaseProgramme } from '@/lib/Dashboard/types'

export default function Dashboard() {
  const { T } = useTheme()
  const { navigate } = useNavigate()
  const { user } = useAuth()

  const [programmes, setProgrammes] = useState<SupabaseProgramme[]>([])
  const [ready, setReady] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  

  // ── FETCH PROGRAMMES ────────────────────────────────────────
  const fetchProgrammes = useCallback(async () => {
    if (!user) return

    setReady(false)

    const { data, error } = await supabase
      .from('wedding_programs')
      .select(`
        id, owner_id, title, format,
        date_start, date_end, region, currency,
        couple_name_a, couple_name_b,
        guest_estimate, budget_target
      `)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[Dashboard] fetch failed:', error.message)
      setProgrammes([])
    } else {
      const mapped: SupabaseProgramme[] = (data ?? []).map((p: any) => ({
        id: p.id,
        title: p.title,
        format: p.format,
        date_start: p.date_start ?? null,
        date_end: p.date_end ?? null,
        region: p.region ?? null,
        currency: p.currency ?? 'GBP',
        couple_name_a: p.couple_name_a ?? null,
        couple_name_b: p.couple_name_b ?? null,
        guest_estimate: Number(p.guest_estimate) || null,
        budget_target: Number(p.budget_target) || null,
        event_count: 0,
      }))
      setProgrammes(mapped)
    }

    setReady(true)
  }, [user])

  useEffect(() => {
    fetchProgrammes()
  }, [fetchProgrammes])

  // ── DELETE PROGRAMME ────────────────────────────────────────
  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('wedding_programs')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      console.error('[Dashboard] delete failed:', error.message)
    } else {
      setProgrammes((prev) => prev.filter((p) => p.id !== id))
    }
    setDeleteConfirm(null)
  }

  // ── LOADING ─────────────────────────────────────────────────
  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: T.bg }}>
        <div className="w-6 h-6 rounded-full animate-pulse"
          style={{ background: btnPrimary.bg }} />
      </div>
    )
  }

  // ── PAGE ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen font-sans antialiased"
      style={{ backgroundColor: T.bg, color: T.textPrimary }}>

      <div className="fixed inset-0 pointer-events-none" aria-hidden="true"
        style={{ background: T.heroBg }} />

      <DashboardHeader />

      <main className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10 py-12">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-2"
              style={{ color: T.accentText }}>
              Dashboard
            </p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight"
              style={{ color: T.textPrimary }}>
              {programmes.length > 0
                ? `${programmes.length} Wedding Programme${programmes.length === 1 ? '' : 's'}`
                : 'Wedding Dashboard'
              }
            </h1>
          </div>

          {programmes.length > 0 && (
            <button
              onClick={() => navigate('/new-programme')}
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl
                         text-sm font-semibold transition-all duration-200
                         hover:scale-[1.03] focus:outline-none"
              style={{
                background: btnPrimary.bg,
                boxShadow: btnPrimary.shadow,
                color: btnPrimary.color,
              }}
            >
              <IconPlus />
              New Programme
            </button>
          )}
        </div>

        {programmes.length === 0 && <EmptyState />}

        {programmes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {programmes.map((p) => (
              <ProgrammeCard
                key={p.id}
                programme={p}
                onDeleteClick={setDeleteConfirm}
              />
            ))}
          </div>
        )}
      </main>

      {deleteConfirm && (
        <DeleteModal
          onConfirm={() => handleDelete(deleteConfirm)}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  )
}