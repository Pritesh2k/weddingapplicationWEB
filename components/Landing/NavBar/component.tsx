'use client'

import React, { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { btnPrimary } from '@/lib/theme'
import Link from 'next/link'
import { useTheme } from '@/context/ThemeContext'

// ─── TYPES ───────────────────────────────────────────────────
interface NavItem { label: string; id: string }
interface NavbarProps {
  scrollTo: (id: string) => void
  navItems: NavItem[]
  IconRings: () => React.ReactElement
  IconMoon: () => React.ReactElement
  IconSun: () => React.ReactElement
}

// ─── COMPONENT ───────────────────────────────────────────────
const Navbar = ({ scrollTo, navItems = [], IconRings, IconMoon, IconSun }: NavbarProps) => {
  const { darkMode, toggleTheme, T, mounted } = useTheme()

  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeId, setActiveId] = useState('')

  const ticking = useRef(false)
  const visibleIdsRef = useRef<Set<string>>(new Set())

  // ── Portal: only available client-side after mount ────────
  useEffect(() => { setPortalEl(document.body) }, [])

  // ── Scroll: intensify background after 20px ───────────────
  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return
      ticking.current = true
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 20)
        ticking.current = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── Active section: highlight the lowest visible nav item ─
  useEffect(() => {
    if (!navItems.length) return
    const observers: IntersectionObserver[] = []

    const recalculate = () => {
      const last = [...navItems].reverse().find(({ id }) => visibleIdsRef.current.has(id))
      setActiveId(last?.id ?? '')
    }

    navItems.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          entry.isIntersecting
            ? visibleIdsRef.current.add(id)
            : visibleIdsRef.current.delete(id)
          recalculate()
        },
        { rootMargin: '-20% 0px -20% 0px', threshold: 0 }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => {
      observers.forEach((o) => o.disconnect())
      visibleIdsRef.current.clear()
    }
  }, [navItems])

  // ── Close mobile menu on viewport resize ─────────────────
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const handleScrollTo = (id: string) => {
    setMenuOpen(false)
    scrollTo(id)
  }

  // ─────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────
  if (!portalEl) return null

  return createPortal(
    <header
      suppressHydrationWarning
      role="banner"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        backgroundColor: scrolled
          ? darkMode ? 'rgba(12,9,6,0.82)' : 'rgba(252,248,243,0.85)'
          : darkMode ? 'rgba(12,9,6,0.40)' : 'rgba(252,248,243,0.40)',
        borderBottom: scrolled
          ? `1px solid ${darkMode ? 'rgba(139,107,71,0.18)' : 'rgba(139,107,71,0.14)'}`
          : '1px solid transparent',
        boxShadow: scrolled
          ? darkMode ? '0 4px 32px rgba(0,0,0,0.40)' : '0 4px 24px rgba(139,107,71,0.08)'
          : 'none',
        transition: 'background-color 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease',
      }}
    >
      {/* ── Main bar ──────────────────────────────────────── */}
      <nav
        className="max-w-7xl mx-auto px-5 lg:px-10 h-16 flex items-center justify-between relative"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <button
          onClick={() => handleScrollTo('hero')}
          className="flex items-center gap-2.5 group focus:outline-none shrink-0"
          aria-label="Vow — scroll to top"
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center
                       group-hover:scale-110 transition-transform duration-300"
            style={{ background: btnPrimary.bg, boxShadow: btnPrimary.shadow, color: btnPrimary.color }}
          >
            <IconRings />
          </div>
          <span className="font-semibold tracking-tight text-base" style={{ color: T.textPrimary }}>
            Vow
          </span>
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2" role="list">
          {navItems.map(({ id, label }) => {
            const isActive = activeId === id
            return (
              <button
                key={id}
                onClick={() => handleScrollTo(id)}
                role="listitem"
                className="relative px-4 py-2 rounded-lg text-sm font-medium focus:outline-none transition-colors duration-200"
                style={{ color: isActive ? T.accentText : T.textMuted }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = T.textPrimary }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = T.textMuted }}
              >
                <span
                  className="absolute inset-0 rounded-lg transition-all duration-300"
                  style={{
                    opacity: isActive ? 1 : 0,
                    background: darkMode ? 'rgba(139,107,71,0.14)' : 'rgba(139,107,71,0.10)',
                    border: `1px solid ${darkMode ? 'rgba(139,107,71,0.24)' : 'rgba(139,107,71,0.18)'}`,
                  }}
                />
                <span className="relative z-10">{label}</span>
              </button>
            )
          })}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg transition-all duration-200 hover:scale-110 focus:outline-none"
            style={{
              backgroundColor: darkMode ? 'rgba(139,107,71,0.10)' : 'rgba(139,107,71,0.07)',
              border: `1px solid ${darkMode ? 'rgba(139,107,71,0.18)' : 'rgba(139,107,71,0.13)'}`,
              color: T.textMuted,
            }}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-pressed={darkMode}
            suppressHydrationWarning
          >
            {mounted && (darkMode ? <IconSun /> : <IconMoon />)}
          </button>

          {/* Sign in — desktop only */}
          <Link
            href="/login"
            className="hidden md:flex items-center px-4 py-2 rounded-lg text-sm font-medium
                       transition-all duration-200 hover:scale-[1.03] focus:outline-none"
            style={{
              backgroundColor: darkMode ? 'rgba(139,107,71,0.10)' : 'rgba(139,107,71,0.07)',
              border: `1px solid ${darkMode ? 'rgba(139,107,71,0.20)' : 'rgba(139,107,71,0.16)'}`,
              color: T.accentText,
            }}
          >
            Sign in
          </Link>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg focus:outline-none transition-colors duration-200"
            style={{
              backgroundColor: darkMode ? 'rgba(139,107,71,0.10)' : 'rgba(139,107,71,0.07)',
              border: `1px solid ${darkMode ? 'rgba(139,107,71,0.18)' : 'rgba(139,107,71,0.13)'}`,
            }}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <div className="w-4 h-4 relative flex flex-col items-center justify-center gap-1.25">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="absolute block rounded-full transition-all duration-300"
                  style={{
                    height: '1.5px',
                    width: '100%',
                    backgroundColor: T.accentText,
                    // Bar 0: rests at -5px, rotates to +45deg on open
                    // Bar 2: rests at +5px, rotates to -45deg on open
                    top: '50%',
                    left: 0,
                    transform:
                      i === 0
                        ? menuOpen
                          ? 'translateY(-50%) rotate(45deg)'
                          : 'translateY(calc(-50% - 5px))'
                        : i === 2
                          ? menuOpen
                            ? 'translateY(-50%) rotate(-45deg)'
                            : 'translateY(calc(-50% + 5px))'
                          : 'translateY(-50%)',
                    opacity: i === 1 && menuOpen ? 0 : 1,
                  }}
                />
              ))}
            </div>
          </button>
        </div>
      </nav>

      {/* ── Mobile drawer ─────────────────────────────────── */}
      <div
        className="md:hidden overflow-hidden"
        style={{
          maxHeight: menuOpen ? '320px' : '0',
          opacity: menuOpen ? 1 : 0,
          transition: 'max-height 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.25s ease',
        }}
        aria-hidden={!menuOpen}
      >
        <div style={{ height: '1px', margin: '0 20px', background: darkMode ? 'rgba(139,107,71,0.14)' : 'rgba(139,107,71,0.12)' }} />
        <div className="px-5 py-3 flex flex-col gap-1">
          {navItems.map(({ id, label }) => {
            const isActive = activeId === id
            return (
              <button
                key={id}
                onClick={() => handleScrollTo(id)}
                tabIndex={menuOpen ? 0 : -1}
                className="text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none"
                style={{
                  color: isActive ? T.accentText : T.textSecondary,
                  backgroundColor: isActive
                    ? darkMode ? 'rgba(139,107,71,0.12)' : 'rgba(139,107,71,0.08)'
                    : 'transparent',
                }}
              >
                {label}
              </button>
            )
          })}
          <div className="mt-2 pt-3" style={{ borderTop: `1px solid ${darkMode ? 'rgba(139,107,71,0.12)' : 'rgba(139,107,71,0.10)'}` }}>
            <Link
              href="/login"
              tabIndex={menuOpen ? 0 : -1}
              className="flex items-center justify-center w-full py-2.5 rounded-lg text-sm font-semibold
                         transition-all duration-200 focus:outline-none"
              style={{ background: btnPrimary.bg, color: btnPrimary.color, boxShadow: btnPrimary.shadow }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </header>,
    portalEl
  )
}

export default Navbar