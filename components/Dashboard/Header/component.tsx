'use client'

import { btnPrimary } from '@/lib/theme'
import { useTheme } from '@/context/ThemeContext'
import { useNavigate } from '@/context/NavigationContext'
import { IconRings, IconMoon, IconSun, IconPlus } from '@/lib/Dashboard/icons'

export default function DashboardHeader() {
  const { darkMode, toggleTheme, T } = useTheme()
  const { navigate } = useNavigate()

  return (
    <header
      className="sticky top-0 z-20"
      style={{
        backdropFilter:       'blur(20px) saturate(160%)',
        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
        backgroundColor:      darkMode ? 'rgba(12,9,6,0.82)' : 'rgba(252,248,243,0.88)',
        borderBottom:         `1px solid ${T.borderSubtle}`,
        boxShadow:            darkMode
          ? '0 1px 24px rgba(0,0,0,0.30)'
          : '0 1px 16px rgba(139,107,71,0.06)',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2.5">
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

        {/* Right */}
        <div className="flex items-center gap-2">
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
        </div>
      </div>
    </header>
  )
}