'use client'

import { btnPrimary } from '@/lib/theme'
import { useTheme } from '@/context/ThemeContext'
import { useNavigate } from '@/context/NavigationContext'
import { IconRings, IconMoon, IconSun, IconArrowLeft } from '@/lib/Programme/icons'

export default function ProgrammeHeader() {
  const { darkMode, toggleTheme, T } = useTheme()
  const { navigate } = useNavigate()

  return (
    <header
      className="flex items-center justify-between px-4 sm:px-6 lg:px-10 h-14 sm:h-16"
      style={{
        position:             'sticky',
        top:                  0,
        zIndex:               50,
        backdropFilter:       'blur(20px) saturate(160%)',
        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
        backgroundColor:      darkMode ? 'rgba(12,9,6,0.82)' : 'rgba(252,248,243,0.88)',
        borderBottom:         `1px solid ${T.borderSubtle}`,
      }}
    >
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-sm font-medium transition-all duration-200
                   focus:outline-none group"
        style={{ color: T.textMuted }}
        onMouseEnter={(e) => (e.currentTarget.style.color = T.accentText)}
        onMouseLeave={(e) => (e.currentTarget.style.color = T.textMuted)}
      >
        <span className="group-hover:-translate-x-0.5 transition-transform duration-200">
          <IconArrowLeft />
        </span>
        <span className="hidden sm:inline">Dashboard</span>
      </button>

      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: btnPrimary.bg, boxShadow: btnPrimary.shadow, color: btnPrimary.color }}
        >
          <IconRings />
        </div>
        <span className="font-semibold tracking-tight text-base" style={{ color: T.textPrimary }}>
          Vow
        </span>
      </div>

      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg transition-all duration-200 hover:scale-110 focus:outline-none"
        style={{
          backgroundColor: darkMode ? 'rgba(139,107,71,0.10)' : 'rgba(139,107,71,0.07)',
          border:          `1px solid ${darkMode ? 'rgba(139,107,71,0.18)' : 'rgba(139,107,71,0.13)'}`,
          color:           T.textMuted,
        }}
        aria-label="Toggle theme"
      >
        {darkMode ? <IconSun /> : <IconMoon />}
      </button>
    </header>
  )
}