'use client'

import React, { RefObject, useEffect, useRef } from 'react'
import { btnPrimary, BROWN_PRIMARY, BROWN_PALE } from '@/lib/theme'
import { useTheme } from '@/context/ThemeContext'

// ─── TYPES ───────────────────────────────────────────────────
interface FooterLink {
  label: string
  id:    string
}

interface FooterProps {
  scrollTo:  (id: string) => void
  footerRef: RefObject<HTMLElement | null>
  navItems:  FooterLink[]
  IconRings: () => React.ReactElement
}

// ─── COMPONENT ───────────────────────────────────────────────
const Footer = ({ scrollTo, footerRef, navItems, IconRings }: FooterProps) => {
  const { T } = useTheme()
  const lineRef      = useRef<HTMLDivElement>(null)   // top border line
  const brandRef     = useRef<HTMLDivElement>(null)
  const navRef       = useRef<HTMLElement>(null)
  const copyrightRef = useRef<HTMLParagraphElement>(null)
  const glowRef      = useRef<HTMLDivElement>(null)
  const animated     = useRef(false)

  useEffect(() => {
    const footer = footerRef.current
    if (!footer) return

    // ── Set initial states ────────────────────────────────────
    const els = [lineRef, brandRef, navRef, copyrightRef, glowRef]
    els.forEach(r => {
      if (r.current) r.current.style.opacity = '0'
    })
    if (brandRef.current)     brandRef.current.style.transform     = 'translateX(-24px)'
    if (copyrightRef.current) copyrightRef.current.style.transform = 'translateX(24px)'
    if (navRef.current)       navRef.current.style.transform       = 'translateY(16px)'
    if (lineRef.current)      lineRef.current.style.transform      = 'scaleX(0)'
    if (glowRef.current)      glowRef.current.style.transform      = 'scaleX(0.3)'

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || animated.current) return
        animated.current = true

        if (typeof window !== 'undefined' && (window as any).gsap) {
          const gsap = (window as any).gsap
          const tl   = gsap.timeline({ defaults: { ease: 'power4.out' } })

          // 1. Border line draws across left → right
          tl.fromTo(lineRef.current,
            { scaleX: 0, opacity: 0, transformOrigin: 'left center' },
            { scaleX: 1, opacity: 1, duration: 0.9, ease: 'power3.inOut' }
          )

          // 2. Glow blooms from centre underneath the line
          tl.fromTo(glowRef.current,
            { scaleX: 0.3, opacity: 0 },
            { scaleX: 1,   opacity: 1, duration: 1.1, ease: 'power2.out' },
            '-=0.5'
          )

          // 3. Brand slides in from left, copyright from right — simultaneously
          tl.fromTo(brandRef.current,
            { x: -24, opacity: 0 },
            { x: 0,   opacity: 1, duration: 0.7, clearProps: 'transform' },
            '-=0.6'
          )
          tl.fromTo(copyrightRef.current,
            { x: 24,  opacity: 0 },
            { x: 0,   opacity: 1, duration: 0.7, clearProps: 'transform' },
            '<'  // same time as brand
          )

          // 4. Nav links rise up and stagger in
          tl.fromTo(navRef.current,
            { y: 16, opacity: 0 },
            { y: 0,  opacity: 1, duration: 0.6, clearProps: 'transform' },
            '-=0.4'
          )
          tl.fromTo(
            Array.from(navRef.current?.querySelectorAll<HTMLElement>('li') ?? []),
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.45, stagger: 0.07, clearProps: 'transform' },
            '-=0.4'
          )

          // 5. Logo icon does a satisfying little spin+scale pop
          const logoIcon = brandRef.current?.querySelector<HTMLElement>('.logo-icon')
          if (logoIcon) {
            tl.fromTo(logoIcon,
              { scale: 0.5, rotation: -180, opacity: 0 },
              { scale: 1,   rotation: 0,    opacity: 1, duration: 0.7, ease: 'back.out(1.7)' },
              '-=0.9'
            )
          }

        } else {
          // ── CSS fallback ──────────────────────────────────
          els.forEach(r => {
            if (!r.current) return
            r.current.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.16,1,0.3,1)'
            r.current.style.opacity    = '1'
            r.current.style.transform  = 'none'
          })
        }
      },
      { threshold: 0.2 }
    )

    observer.observe(footer)
    return () => observer.disconnect()
  }, [footerRef])

  return (
    <footer
      ref={footerRef}
      className="relative pt-12 pb-10 overflow-hidden"
      role="contentinfo"
      aria-label="Site footer"
    >
      {/* Animated top border line */}
      <div
        ref={lineRef}
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent 0%, ${BROWN_PRIMARY} 30%, ${BROWN_PALE} 60%, transparent 100%)` }}
      />

      {/* Glow bloom behind the line */}
      <div
        ref={glowRef}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-24 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 60% 100% at 50% 0%, rgba(139,107,71,0.12) 0%, transparent 100%)` }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Brand — slides in from left */}
          <div ref={brandRef} className="flex items-center gap-2.5">
            <div
              className="logo-icon w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: btnPrimary.bg, color: btnPrimary.color }}
              aria-hidden="true"
            >
              <IconRings />
            </div>
            <span className="font-semibold tracking-tight" style={{ color: T.textPrimary }}>
              Vow
            </span>
            <span className="text-xs ml-1" style={{ color: T.textMuted }}>
              Wedding Operating System
            </span>
          </div>

          {/* Nav — rises up */}
          <nav ref={navRef} aria-label="Footer navigation">
            <ul className="flex flex-wrap items-center gap-6 justify-center">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollTo(item.id)}
                    className="text-sm transition-colors duration-200 focus:outline-none"
                    style={{ color: T.textMuted }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = T.accentText)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = T.textMuted)}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Copyright — slides in from right */}
          <p ref={copyrightRef} className="text-xs" style={{ color: T.textMuted }}>
            © {new Date().getFullYear()} Vow. All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  )
}

export default Footer