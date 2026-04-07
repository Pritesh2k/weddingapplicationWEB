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
        <div className="grid grid-cols-1 gap-4">
          {cards.map((item) => (
            <div
              key={item.label}
              className="problem-reveal p-5 rounded-xl"
              style={{
                backgroundColor: T.surface,
                borderTopWidth: '1px',
                borderRightWidth: '1px',
                borderBottomWidth: '1px',
                borderLeftWidth: '2px',
                borderStyle: 'solid',
                borderTopColor: T.borderSubtle,
                borderRightColor: T.borderSubtle,
                borderBottomColor: T.borderSubtle,
                borderLeftColor: item.accentColor,
              }}
            >
              <p className="text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: T.textMuted }}>
                {item.label}
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
                <span className="text-sm flex-1 line-through" style={{ color: T.textMuted }}>
                  {item.before}
                </span>
                <span className="text-xs font-bold shrink-0" style={{ color: T.accentText }}>→</span>
                <span className="text-sm font-medium flex-1" style={{ color: T.textPrimary }}>
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