'use client'

import { btnPrimary } from '@/lib/theme'
import { useTheme } from '@/context/ThemeContext'
import { useNavigate } from '@/context/NavigationContext'
import { IconPlus, IconRings } from '@/lib/Dashboard/icons'

export default function EmptyState() {
  const { T, darkMode } = useTheme()
  const { navigate }    = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      {/* Decorative rings */}
      <div
        className="relative w-20 h-20 mb-8"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 rounded-full blur-xl"
          style={{ background: `${btnPrimary.bg}`, opacity: 0.15 }}
        />
        <div
          className="relative w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: darkMode ? 'rgba(139,107,71,0.10)' : 'rgba(139,107,71,0.07)',
            border:          `1px solid ${darkMode ? 'rgba(139,107,71,0.20)' : 'rgba(139,107,71,0.15)'}`,
            color:           T.accentText,
          }}
        >
          <IconRings />
        </div>
      </div>

      <p
        className="text-xs font-bold tracking-widest uppercase mb-3"
        style={{ color: T.accentText }}
      >
        No programmes yet
      </p>
      <h2
        className="text-2xl font-bold tracking-tight mb-3"
        style={{ color: T.textPrimary }}
      >
        Your wedding awaits.
      </h2>
      <p
        className="text-sm leading-relaxed mb-10 max-w-xs"
        style={{ color: T.textMuted }}
      >
        Create your first wedding programme to start planning, coordinating, and running your day with confidence.
      </p>

      <button
        onClick={() => navigate('/new-programme')}
        className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold
                   hover:scale-[1.04] transition-all duration-200 focus:outline-none"
        style={{ background: btnPrimary.bg, boxShadow: btnPrimary.shadow, color: btnPrimary.color }}
      >
        <IconPlus />
        Create Wedding Programme
      </button>
    </div>
  )
}