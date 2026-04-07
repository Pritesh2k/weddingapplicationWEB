'use client'

import React, { RefObject, useEffect } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { loadGSAP } from '@/lib/Landing/useGSAP'

// ─── TYPES ───────────────────────────────────────────────────
interface ProblemCard {
  label: string
  before: string
  after: string
  accentColor: string
}

interface ProblemSectionProps {
  problemRef: RefObject<HTMLElement | null>
  cards: ProblemCard[]
}

// ─── COMPONENT ───────────────────────────────────────────────
const ProblemSection = ({ problemRef, cards }: ProblemSectionProps) => {
  const { T } = useTheme()

  useEffect(() => {
    loadGSAP().then(() => {
      if (!problemRef.current) return
      window.gsap.fromTo(
        problemRef.current.querySelectorAll('.problem-reveal'),
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.15,
          scrollTrigger: { trigger: problemRef.current, start: 'top 75%' }
        }
      )
    })
  }, [])

  return (
    <section
      id="about"
      ref={problemRef}
      className="py-28 md:py-36 max-w-7xl mx-auto px-6 lg:px-10"
      aria-label="Product philosophy"
    >
      <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

        {/* Left — copy */}
        <div>
          <p className="problem-reveal text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ color: T.accentText }}>
            Not just a planner
          </p>
          <h2 className="problem-reveal section-heading text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-6"
            style={{ color: T.textPrimary }}>
            A command centre for your entire wedding.
          </h2>
          <p className="problem-reveal text-lg leading-relaxed mb-6"
            style={{ color: T.textSecondary }}>
            Most wedding apps help you build lists. Vow helps you <em>run</em> a wedding. It's
            the only platform that bridges meticulous pre-event planning and real-time day-of
            orchestration in a single system.
          </p>
          <p className="problem-reveal text-base leading-relaxed"
            style={{ color: T.textMuted }}>
            Whether you're managing a single-day ceremony or a five-day multicultural celebration
            across multiple venues, every stakeholder — couple, coordinator, family leads, vendors,
            guests — works from one source of truth.
          </p>
        </div>

        {/* Right — comparison cards */}
        <div className="grid grid-cols-1 gap-3">
          {cards.map((item) => (
            <div
              key={item.label}
              className="problem-reveal group relative overflow-hidden rounded-2xl p-5
                 transition-all duration-300 hover:scale-[1.01]"
              style={{
                backgroundColor: T.surface,
                border: `1px solid ${T.borderSubtle}`,
                boxShadow: `0 1px 3px rgba(0,0,0,0.04)`,
              }}
            >
              {/* Left accent bar */}
              <div
                className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full"
                style={{ backgroundColor: item.accentColor }}
              />

              {/* Label */}
              <p
                className="text-[10px] font-bold uppercase tracking-widest mb-3 pl-3"
                style={{ color: item.accentColor }}
              >
                {item.label}
              </p>

              {/* Before row */}
              <div
                className="flex items-start gap-2.5 mb-2 pl-3 py-2 rounded-lg"
                style={{ backgroundColor: `${T.borderSubtle}60` }}
              >
                <span
                  className="mt-0.5 shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                  style={{ backgroundColor: 'rgba(180,60,60,0.12)', color: 'rgba(180,60,60,0.70)' }}
                >
                  ✕
                </span>
                <span className="text-sm leading-snug" style={{ color: T.textMuted }}>
                  {item.before}
                </span>
              </div>

              {/* After row */}
              <div
                className="flex items-start gap-2.5 pl-3 py-2 rounded-lg"
                style={{ backgroundColor: `${item.accentColor}12` }}
              >
                <span
                  className="mt-0.5 shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                  style={{ backgroundColor: `${item.accentColor}25`, color: item.accentColor }}
                >
                  ✓
                </span>
                <span className="text-sm font-medium leading-snug" style={{ color: T.textPrimary }}>
                  {item.after}
                </span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default ProblemSection