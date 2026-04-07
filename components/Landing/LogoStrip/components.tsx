'use client'

import React, { RefObject, useEffect } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { loadGSAP } from '@/lib/Landing/useGSAP'

// ─── TYPES ───────────────────────────────────────────────────
interface LogoStripProps {
  logoStripRef: RefObject<HTMLDivElement | null>
  items:        string[]
}

// ─── COMPONENT ───────────────────────────────────────────────
const LogoStrip = ({ logoStripRef, items }: LogoStripProps) => {
  const { T } = useTheme()

  useEffect(() => {
  loadGSAP().then(() => {
    if (!logoStripRef.current) return
    window.gsap.to(logoStripRef.current.querySelector('.strip-inner'),
      { x: '-50%', ease: 'none', duration: 15, repeat: -1 }
    )
  })
}, [])

  return (
    <section suppressHydrationWarning 
      aria-label="Supported wedding formats"
      className="py-10 overflow-hidden"
      style={{ borderTop: `1px solid ${T.borderBrown}`, borderBottom: `1px solid ${T.borderBrown}` }}
    >
      <div id="logo-strip" ref={logoStripRef} className="relative overflow-hidden">
        <div className="strip-inner flex items-center gap-16 whitespace-nowrap" aria-hidden="true">
          {[...items, ...items].map((item, i) => (
            <span
              key={i}
              className="text-sm font-medium tracking-wide flex items-center gap-3"
              style={{ color: T.textMuted }}
            >
              <span
                className="w-1 h-1 rounded-full inline-block"
                style={{ background: T.accentText, opacity: 0.6 }}
              />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LogoStrip