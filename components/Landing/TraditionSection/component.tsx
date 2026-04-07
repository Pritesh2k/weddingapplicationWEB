'use client'

import React, { RefObject, useEffect, useState } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { loadGSAP } from '@/lib/Landing/useGSAP'

// ─── TYPES ───────────────────────────────────────────────────
export interface Tradition {
  id: string
  label: string
  events: string[]
  activeTabBg: string
  activeTabBorder: string
  activeTabText: string
  lightActiveTabBg: string
  lightActiveTabBorder: string
  lightActiveTabText: string
  tagBg: string
  tagBorder: string
  tagText: string
  lightTagBg: string
  lightTagBorder: string
  lightTagText: string
}

interface TraditionFeature {
  title: string
  desc: string
}

interface TraditionSectionProps {
  traditionRef: RefObject<HTMLElement | null>
  traditions: Tradition[]
  traditionFeatures: TraditionFeature[]
}

// ─── COMPONENT ───────────────────────────────────────────────
const TraditionSection = ({ traditionRef, traditions, traditionFeatures }: TraditionSectionProps) => {
  const { darkMode, T } = useTheme()
  const [activeTradition, setActiveTradition] = useState(0)

  useEffect(() => {
    loadGSAP().then(() => {
      if (!traditionRef.current) return
      window.gsap.fromTo(
        traditionRef.current.querySelectorAll('.tradition-reveal'),
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: traditionRef.current, start: 'top 75%' }
        }
      )
    })
  }, [])

  const handleTabClick = (i: number) => {
    setActiveTradition(i)
    // GSAP animate if available
    if (typeof window !== 'undefined' && (window as any).gsap) {
      ; (window as any).gsap.fromTo(
        '.tradition-events',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      )
    }
  }

  return (
    <section
      id="traditions"
      ref={traditionRef}
      className="py-28 md:py-36"
      style={{ borderTop: `1px solid ${T.borderBrown}` }}
      aria-label="Cultural tradition modules"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left — tabs + events */}
          <div>
            <p className="tradition-reveal text-xs font-semibold tracking-widest uppercase mb-4"
              style={{ color: T.accentText }}>
              Culture is modular
            </p>
            <h2 className="tradition-reveal section-heading text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-6"
              style={{ color: T.textPrimary }}>
              Every tradition, honoured precisely.
            </h2>
            <p className="tradition-reveal text-lg leading-relaxed mb-8"
              style={{ color: T.textSecondary }}>
              Ceremony modules adapt to your tradition — not the other way around. Mix, blend,
              and configure without constraint.
            </p>

            {/* Tabs */}
            <div
              className="tradition-reveal flex flex-wrap gap-2 mb-6"
              role="tablist"
              aria-label="Select wedding tradition"
            >
              {traditions.map((t, i) => {
                const isActive = activeTradition === i
                const activeBg = darkMode ? t.activeTabBg : t.lightActiveTabBg
                const activeBorder = darkMode ? t.activeTabBorder : t.lightActiveTabBorder
                const activeText = darkMode ? t.activeTabText : t.lightActiveTabText
                return (
                  <button
                    key={t.id}
                    onClick={() => handleTabClick(i)}
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`tradition-panel-${t.id}`}
                    className="whitespace-nowrap text-sm font-medium transition-all duration-200 focus:outline-none"
                    style={{
                      padding: '6px 14px',
                      borderRadius: '9999px',
                      ...(isActive
                        ? { backgroundColor: activeBg, borderWidth: '1px', borderStyle: 'solid', borderColor: activeBorder, color: activeText, fontWeight: 600 }
                        : { backgroundColor: T.surface, borderWidth: '1px', borderStyle: 'solid', borderColor: T.borderSubtle, color: T.textMuted }
                      ),
                    }}
                    onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.borderColor = darkMode ? t.activeTabBorder : t.lightActiveTabBorder }}
                    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.borderColor = T.borderSubtle }}
                  >
                    {t.label}
                  </button>
                )
              })}
            </div>

            {/* Active panel */}
            {traditions.map((t, i) => {
              if (i !== activeTradition) return null
              const tagBg = darkMode ? t.tagBg : t.lightTagBg
              const tagBorder = darkMode ? t.tagBorder : t.lightTagBorder
              const tagText = darkMode ? t.tagText : t.lightTagText
              return (
                <div
                  key={t.id}
                  id={`tradition-panel-${t.id}`}
                  className="tradition-events"
                  role="tabpanel"
                  aria-label={`${t.label} sub-events`}
                >
                  <div className="flex flex-wrap gap-2">
                    {t.events.map((ev) => (
                      <span
                        key={ev}
                        className="px-4 py-2 rounded-full text-sm font-medium"
                        style={{ backgroundColor: tagBg, border: `1px solid ${tagBorder}`, color: tagText }}
                      >
                        {ev}
                      </span>
                    ))}
                  </div>
                  <p className="mt-5 text-sm" style={{ color: T.textMuted }}>
                    Add, remove, rename, or reorder any sub-event. Vow never forces a structure you don't need.
                  </p>
                </div>
              )
            })}
          </div>

          {/* Right — feature cards */}
          <div className="space-y-4 tradition-reveal">
            {traditionFeatures.map((item) => (
              <div
                key={item.title}
                className="p-5 rounded-xl transition-colors duration-300"
                style={{ backgroundColor: T.surface, border: `1px solid ${T.borderSubtle}` }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = T.borderBrown)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = T.borderSubtle)}
              >
                <h4 className="font-semibold mb-1.5 text-sm" style={{ color: T.textPrimary }}>{item.title}</h4>
                <p className="text-sm" style={{ color: T.textMuted }}>{item.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

export default TraditionSection