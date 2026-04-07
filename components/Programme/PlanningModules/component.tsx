'use client'

import { BROWN_PRIMARY } from '@/lib/theme'
import { useTheme } from '@/context/ThemeContext'
import { MODULES } from '@/lib/Programme/types'
import { IconLock } from '@/lib/Programme/icons'
import gsap from 'gsap'

export default function PlanningModules() {
  const { darkMode, T } = useTheme()

  return (
    <div className="vow-section space-y-4">
      <div className="flex items-end justify-between px-1">
        <div>
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase mb-0.5" style={{ color: T.accentText }}>
            Planning
          </p>
          <h2 className="text-base font-bold" style={{ color: T.textPrimary }}>Your Modules</h2>
        </div>
        <span className="text-[11px] pb-0.5" style={{ color: T.textMuted }}>Coming soon</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
        {MODULES.map((mod) => (
          <div
            key={mod.id}
            className="flex flex-col items-center justify-center gap-2 px-2 py-5
                       rounded-2xl text-center cursor-default transition-colors duration-150"
            style={{ backgroundColor: T.surface, border: `1px solid ${T.borderSubtle}` }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLDivElement
              el.style.borderColor     = BROWN_PRIMARY
              el.style.backgroundColor = T.surface
              gsap.to(el, { y: -3, duration: 0.2, ease: 'power2.out' })
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLDivElement
              el.style.borderColor     = T.borderSubtle
              el.style.backgroundColor = T.surface
              gsap.to(el, { y: 0, duration: 0.2, ease: 'power2.out' })
            }}
          >
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
              style={{
                background: darkMode
                  ? 'linear-gradient(135deg, rgba(160,120,72,0.18) 0%, rgba(110,84,50,0.08) 100%)'
                  : 'linear-gradient(135deg, rgba(139,107,71,0.12) 0%, rgba(139,107,71,0.05) 100%)',
                border: `1px solid ${T.borderSubtle}`,
              }}
            >
              {mod.emoji}
            </div>
            <p className="text-[11px] font-semibold leading-tight" style={{ color: T.textPrimary }}>
              {mod.label}
            </p>
            <span
              className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: T.surface, border: `1px solid ${T.borderSubtle}`, color: T.textMuted }}
            >
              <IconLock /> Soon
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}