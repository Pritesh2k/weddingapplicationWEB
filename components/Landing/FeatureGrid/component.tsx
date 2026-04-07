'use client'

import React, { RefObject, useEffect } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { loadGSAP } from '@/lib/Landing/useGSAP'

// ─── TYPES ───────────────────────────────────────────────────
interface IconStyle {
  bg: string
  color: string
}

interface Feature {
  id: string
  label: string
  title: string
  description: string
  icon: React.ReactElement
  accentDark: string
  accentLight: string
  borderDark: string
  borderLight: string
  iconDark: IconStyle
  iconLight: IconStyle
}

interface FeaturesGridProps {
  featuresRef: RefObject<HTMLElement | null>
  features: Feature[]
}

// ─── COMPONENT ───────────────────────────────────────────────
const FeaturesGrid = ({ featuresRef, features }: FeaturesGridProps) => {
  const { darkMode, T } = useTheme()

  useEffect(() => {
    loadGSAP().then(() => {
      if (!featuresRef.current) return
      window.gsap.fromTo(
        featuresRef.current.querySelectorAll('.feature-card'),
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: featuresRef.current, start: 'top 70%' }
        }
      )
    })
  }, [])

  return (
    <section
      id="features"
      ref={featuresRef}
      className="py-28 md:py-36"
      style={{ borderTop: `1px solid ${T.borderBrown}` }}
      aria-label="Platform features"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Header */}
        <div className="max-w-2xl mb-16">
          <p className="section-heading text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ color: T.accentText }}>
            Built for real wedding complexity
          </p>
          <h2 className="section-heading text-4xl md:text-5xl font-bold tracking-tight leading-tight"
            style={{ color: T.textPrimary }}>
            Every corner of your wedding, covered.
          </h2>
          <p className="section-heading mt-4 text-lg" style={{ color: T.textMuted }}>
            From guest households to ceremony scripts to live incident recovery — modelled,
            structured, and connected.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5" role="list">
          {features.map((f) => {
            const accent = darkMode ? f.accentDark : f.accentLight
            const border = darkMode ? f.borderDark : f.borderLight
            const iconStyle = darkMode ? f.iconDark : f.iconLight
            return (
              <article
                key={f.id}
                id={`feature-${f.id}`}
                className="feature-card group p-6 rounded-2xl hover:scale-[1.02] hover:shadow-2xl
                           transition-all duration-400 cursor-default"
                style={{ background: accent, border: `1px solid ${border}` }}
                role="listitem"
                aria-label={f.title}
              >
                <div
                  className="inline-flex items-center justify-center w-11 h-11 rounded-xl mb-5"
                  style={{ backgroundColor: iconStyle.bg, color: iconStyle.color }}
                  aria-hidden="true"
                >
                  {f.icon}
                </div>
                <span className="block text-xs font-semibold uppercase tracking-wider mb-2"
                  style={{ color: T.textMuted }}>
                  {f.label}
                </span>
                <h3 className="text-lg font-semibold mb-3 tracking-tight"
                  style={{ color: T.textPrimary }}>
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: T.textMuted }}>
                  {f.description}
                </p>
              </article>
            )
          })}
        </div>

      </div>
    </section>
  )
}

export default FeaturesGrid