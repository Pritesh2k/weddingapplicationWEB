'use client'

import React, { RefObject, useEffect } from 'react'
import { btnPrimary, BROWN_PRIMARY, BROWN_LIGHT, BROWN_PALE } from '@/lib/theme'
import { useTheme } from '@/context/ThemeContext'
import Link from 'next/link'
import { loadGSAP } from '@/lib/Landing/useGSAP'

// ─── TYPES ───────────────────────────────────────────────────
interface GetStartedSectionProps {
  sectionRef: RefObject<HTMLElement | null>
}

// ─── COMPONENT ───────────────────────────────────────────────
const GetStartedSection = ({ sectionRef }: GetStartedSectionProps) => {
  const { T } = useTheme()

  // ── GSAP scroll reveal ────────────────────────────────────
  useEffect(() => {
    loadGSAP().then(() => {
      const section = sectionRef.current
      if (!section) return
      const els = Array.from(section.querySelectorAll<HTMLElement>('.gs-reveal')).filter(Boolean)
      if (!els.length) return
      window.gsap.fromTo(
        els,
        { opacity: 0, y: 30 },
        {
          opacity:  1,
          y:        0,
          duration: 0.7,
          ease:     'power3.out',
          stagger:  0.12,
          scrollTrigger: { trigger: section, start: 'top 75%' },
        }
      )
    })
  }, [])

  return (
    <section
      id="waitlist"
      ref={sectionRef}
      className="py-28 md:py-36 relative overflow-hidden"
      style={{ borderTop: `1px solid ${T.borderBrown}` }}
      aria-label="Get started"
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                     w-200 h-125 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(ellipse, rgba(139,107,71,0.10) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${BROWN_PRIMARY}44, transparent)` }}
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">

        {/* Badge */}
        <div
          className="gs-reveal inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                     text-xs font-medium tracking-widest uppercase mb-8 backdrop-blur-sm"
          style={{
            border:     '1px solid rgba(139,107,71,0.35)',
            background: 'rgba(139,107,71,0.08)',
            color:      T.accentText,
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: T.accentText }} aria-hidden="true" />
          Get started today
        </div>

        {/* Headline */}
        <h2
          className="gs-reveal text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter
                     leading-[0.95] mb-6 bg-clip-text text-transparent"
          style={{ backgroundImage: `linear-gradient(135deg, ${BROWN_PRIMARY} 0%, ${BROWN_LIGHT} 50%, ${BROWN_PALE} 100%)` }}
        >
          Your wedding deserves a proper operating system.
        </h2>

        {/* Subtext */}
        <p
          className="gs-reveal text-lg md:text-xl leading-relaxed mb-10 max-w-xl mx-auto"
          style={{ color: T.textSecondary }}
        >
          Plan, coordinate, and run the most important day of your lives —
          with complete confidence and zero chaos.
        </p>

        {/* CTAs */}
        <div className="gs-reveal flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <Link
            href="/login"
            className="group flex items-center gap-2.5 px-8 py-4 rounded-xl font-semibold
                       text-base hover:scale-[1.04] transition-all duration-300 focus:outline-none"
            style={{ background: btnPrimary.bg, boxShadow: btnPrimary.shadow, color: btnPrimary.color }}
          >
            Get Started — It's Free
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
              className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold
                       text-base hover:scale-[1.03] transition-all duration-300 focus:outline-none"
            style={{
              backgroundColor: T.surface,
              border:          `1px solid ${T.borderBrown}`,
              color:           T.textSecondary,
            }}
          >
            Book a Demo
          </Link>
        </div>

        {/* Trust strip */}
        <div className="gs-reveal flex flex-wrap items-center justify-center gap-6">
          {['✓ Free to start', '✓ No credit card required', '✓ Works for any tradition', '✓ Cancel anytime'].map((item) => (
            <span key={item} className="text-xs font-medium" style={{ color: T.textMuted }}>
              {item}
            </span>
          ))}
        </div>

      </div>
    </section>
  )
}

export default GetStartedSection