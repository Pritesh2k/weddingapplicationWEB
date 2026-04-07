'use client'

import { useEffect, useState } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { btnPrimary } from '@/lib/theme'

import DashboardHeader  from '@/components/Dashboard/Header/component'
import EmptyState       from '@/components/Dashboard/EmptyState/component'
import ProgrammeCard    from '@/components/Dashboard/ProgrammeCard/component'
import DeleteModal      from '@/components/Dashboard/DeleteModal/components'
import { IconPlus }     from '@/lib/Dashboard/icons'
import { useNavigate }  from '@/context/NavigationContext'

import type { Programme } from '@/lib/Dashboard/types'
import { loadAllProgrammes, saveAllProgrammes } from '@/lib/Dashboard/helpers'

export default function Dashboard() {
  const { T }           = useTheme()
  const { navigate }    = useNavigate()
  const [programmes, setProgrammes]   = useState<Programme[]>([])
  const [ready, setReady]             = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    setProgrammes(loadAllProgrammes())
    setReady(true)
  }, [])

  const handleDelete = (id: string) => {
    const updated = programmes.filter((p) => p.id !== id)
    setProgrammes(updated)
    saveAllProgrammes(updated)
    setDeleteConfirm(null)
  }

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: T.bg }}>
        <div className="w-6 h-6 rounded-full animate-pulse" style={{ background: btnPrimary.bg }} />
      </div>
    )
  }

  return (
    <div className="min-h-screen font-sans antialiased" style={{ backgroundColor: T.bg, color: T.textPrimary }}>

      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true"
        style={{ background: T.heroBg }} />

      <DashboardHeader />

      <main className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10 py-12">

        {/* Page heading */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p
              className="text-xs font-bold tracking-widest uppercase mb-2"
              style={{ color: T.accentText }}
            >
              Dashboard
            </p>
            <h1
              className="text-3xl md:text-4xl font-bold tracking-tight"
              style={{ color: T.textPrimary }}
            >
              {programmes.length > 0
                ? `${programmes.length} Wedding Programme${programmes.length > 1 ? 's' : ''}`
                : 'Wedding Dashboard'
              }
            </h1>
          </div>

          {programmes.length > 0 && (
            <button
              onClick={() => navigate('/new-programme')}
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl
                         text-sm font-semibold transition-all duration-200 hover:scale-[1.03] focus:outline-none"
              style={{ background: btnPrimary.bg, boxShadow: btnPrimary.shadow, color: btnPrimary.color }}
            >
              <IconPlus />
              New Programme
            </button>
          )}
        </div>

        {/* Empty state */}
        {programmes.length === 0 && <EmptyState />}

        {/* Grid */}
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

      {/* Delete confirmation */}
      {deleteConfirm && (
        <DeleteModal
          onConfirm={() => handleDelete(deleteConfirm)}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  )
}