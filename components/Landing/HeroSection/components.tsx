'use client'

import React, { RefObject, useEffect } from 'react'
import { btnPrimary, BROWN_PRIMARY, BROWN_LIGHT, BROWN_PALE } from '@/lib/theme'
import { useTheme } from '@/context/ThemeContext'
import { loadGSAP } from '@/lib/Landing/useGSAP'
import Link from 'next/link'

// ─── TYPES ───────────────────────────────────────────────────
interface HeroSectionProps {
  scrollTo:        (id: string) => void
  heroRef:         RefObject<HTMLElement | null>
  heroHeadlineRef: RefObject<HTMLHeadingElement | null>
  heroSubRef:      RefObject<HTMLParagraphElement | null>
  heroCTARef:      RefObject<HTMLDivElement | null>
  heroScrollRef:   RefObject<HTMLDivElement | null>
  IconArrow:       () => React.ReactElement
  IconChevronDown: () => React.ReactElement
}

// ─── COMPONENT ───────────────────────────────────────────────
const HeroSection = ({
  scrollTo,
  heroRef,
  heroHeadlineRef,
  heroSubRef,
  heroCTARef,
  heroScrollRef,
  IconArrow,
  IconChevronDown,
}: HeroSectionProps) => {
  const { darkMode, T } = useTheme()

  // ── GSAP animations ──────────────────────────────────────
  useEffect(() => {
    loadGSAP().then(() => {
      const { gsap } = window

      // Entrance timeline
      gsap.timeline({ delay: 0.2 })
        .fromTo(heroHeadlineRef.current,
          { y: 60, opacity: 0 },
          { y: 0,  opacity: 1, duration: 1.1, ease: 'power4.out' })
        .fromTo(heroSubRef.current,
          { y: 30, opacity: 0 },
          { y: 0,  opacity: 1, duration: 0.9, ease: 'power3.out' }, '-=0.7')
        .fromTo(heroCTARef.current,
          { y: 20, opacity: 0 },
          { y: 0,  opacity: 1, duration: 0.7, ease: 'power2.out' }, '-=0.5')
        .fromTo(heroScrollRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.6 }, '-=0.3')

      // Parallax background
      if (heroRef.current) {
        gsap.to(heroRef.current.querySelector('.hero-bg'), {
          yPercent: 30,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start:   'top top',
            end:     'bottom top',
            scrub:   true,
          },
        })
      }

      // Scroll indicator bounce
      if (heroScrollRef.current) {
        gsap.to(heroScrollRef.current.querySelector('.scroll-arrow'), {
          y:        8,
          repeat:   -1,
          yoyo:     true,
          duration: 0.9,
          ease:     'sine.inOut',
        })
      }
    })
  }, [])

  return (
    <section
      suppressHydrationWarning
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16"
      aria-label="Hero — Plan the day. Run the day."
    >
      {/* Background */}
      <div className="hero-bg absolute inset-0 pointer-events-none select-none" aria-hidden="true">
        <div className="absolute inset-0" style={{ background: T.heroBg }} />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-225 h-125 rounded-full blur-3xl"
          style={{ background: T.heroGlow }}
        />
        <div
          className="absolute bottom-1/4 left-1/4 w-125 h-100 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(ellipse, rgba(176,100,90,0.05) 0%, transparent 70%)' }}
        />
        <div
          className="absolute inset-0"
          style={{
            opacity:         darkMode ? 0.025 : 0.04,
            backgroundImage: `linear-gradient(${T.heroGrid} 1px, transparent 1px), linear-gradient(90deg, ${T.heroGrid} 1px, transparent 1px)`,
            backgroundSize:  '80px 80px',
          }}
        />
        <div className="absolute inset-0" style={{ background: T.heroVignette }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs
                     font-medium tracking-widest uppercase mb-8 backdrop-blur-sm"
          style={{
            border:     '1px solid rgba(139,107,71,0.35)',
            background: 'rgba(139,107,71,0.08)',
            color:      T.accentText,
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: T.accentText }} aria-hidden="true" />
          Wedding Operating System
        </div>

        {/* Headline */}
        <h1
          ref={heroHeadlineRef}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.92] mb-8"
        >
          <span className="block" style={{ color: T.textPrimary }}>Plan the day.</span>
          <span
            className="block bg-clip-text text-transparent"
            style={{ backgroundImage: `linear-gradient(90deg, ${BROWN_PRIMARY} 0%, ${BROWN_LIGHT} 40%, ${BROWN_PALE} 70%, #D4AA6E 100%)` }}
          >
            Run the day.
          </span>
        </h1>

        {/* Subtext */}
        <p
          ref={heroSubRef}
          className="text-lg md:text-xl lg:text-2xl max-w-2xl mx-auto leading-relaxed mb-10"
          style={{ color: T.textSecondary }}
        >
          Vow unifies every fragment of your wedding — guests, vendors, ceremonies, logistics —
          into one intelligent system that guides you from first decision to last dance.
        </p>

        {/* CTAs */}
        <div ref={heroCTARef} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/login"
            className="group flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold
                       text-base hover:scale-[1.04] transition-all duration-300 focus:outline-none"
            style={{ background: btnPrimary.bg, boxShadow: btnPrimary.shadow, color: btnPrimary.color }}
          >
            Get Started
            <span className="group-hover:translate-x-1 transition-transform duration-200">
              <IconArrow />
            </span>
          </Link>
          <button
            onClick={() => scrollTo('features')}
            className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold
                       text-base hover:scale-[1.03] transition-all duration-300 focus:outline-none"
            style={{ backgroundColor: T.surface, border: `1px solid ${T.borderBrown}`, color: T.textSecondary }}
          >
            Explore Features
          </button>
        </div>

        <p className="mt-8 text-sm" style={{ color: T.textMuted }}>
          Built for single-day, multi-day, destination &amp; multicultural weddings
        </p>
      </div>

      {/* Scroll indicator */}
      <div
        ref={heroScrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        aria-hidden="true"
        style={{ color: T.textMuted }}
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <span className="scroll-arrow"><IconChevronDown /></span>
      </div>
    </section>
  )
}

export default HeroSection