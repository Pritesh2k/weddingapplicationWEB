'use client'

import { RefObject, useEffect } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { loadGSAP } from '@/lib/Landing/useGSAP'

// ─── TYPES ───────────────────────────────────────────────────
export interface Stakeholder {
  id: string
  role: string
  tagline: string
  description: string
  lightBg: string
  lightBorder: string
  lightDot: string
  lightLabel: string
  darkBg: string
  darkBorder: string
  darkDot: string
  darkLabel: string
}

interface StakeholderSectionProps {
  stakeholderRef: RefObject<HTMLElement | null>
  stakeholders: Stakeholder[]
}

// ─── COMPONENT ───────────────────────────────────────────────
const StakeholderSection = ({ stakeholderRef, stakeholders }: StakeholderSectionProps) => {
  const { darkMode, T } = useTheme()

  useEffect(() => {
    loadGSAP().then(() => {
      if (!stakeholderRef.current) return
      window.gsap.fromTo(
        stakeholderRef.current.querySelectorAll('.stakeholder-card'),
        { y: 40, opacity: 0, scale: 0.96 },
        {
          y: 0, opacity: 1, scale: 1, duration: 0.75, ease: 'power3.out', stagger: 0.08,
          scrollTrigger: { trigger: stakeholderRef.current, start: 'top 70%' }
        }
      )
    })
  }, [])

  return (
    <section
      id="stakeholders"
      ref={stakeholderRef}
      className="py-28 md:py-36"
      style={{ borderTop: `1px solid ${T.borderBrown}` }}
      aria-label="One platform, every stakeholder"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Header */}
        <div className="max-w-2xl mb-16">
          <p className="section-heading text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ color: T.accentText }}>
            Every stakeholder
          </p>
          <h2 className="section-heading text-4xl md:text-5xl font-bold tracking-tight leading-tight"
            style={{ color: T.textPrimary }}>
            One platform. Every role. Zero confusion.
          </h2>
          <p className="section-heading mt-4 text-lg" style={{ color: T.textMuted }}>
            Vow gives every person in your wedding a role-appropriate experience — from couple
            to coordinator, family lead to vendor.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5" role="list">
          {stakeholders.map((s) => {
            const bg = darkMode ? s.darkBg : s.lightBg
            const border = darkMode ? s.darkBorder : s.lightBorder
            const dot = darkMode ? s.darkDot : s.lightDot
            const label = darkMode ? s.darkLabel : s.lightLabel
            return (
              <article
                key={s.id}
                id={`stakeholder-${s.id}`}
                className="stakeholder-card p-6 rounded-2xl hover:scale-[1.02] transition-all duration-300"
                style={{ backgroundColor: bg, borderWidth: '1px', borderStyle: 'solid', borderColor: border }}
                role="listitem"
                aria-label={`${s.role} — ${s.tagline}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: dot }} aria-hidden="true" />
                  <span className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: label }}>{s.role}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 tracking-tight"
                  style={{ color: T.textPrimary }}>{s.tagline}</h3>
                <p className="text-sm leading-relaxed"
                  style={{ color: T.textMuted }}>{s.description}</p>
              </article>
            )
          })}
        </div>

      </div>
    </section>
  )
}

export default StakeholderSection