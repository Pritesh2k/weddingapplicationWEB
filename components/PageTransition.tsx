// components/PageTransition.tsx
'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

interface Props { children: React.ReactNode }

export default function PageTransition({ children }: Props) {
  const pathname              = usePathname()
  const [display, setDisplay] = useState(children)
  const [phase, setPhase]     = useState<'idle' | 'out' | 'in'>('idle')
  const pendingChildren       = useRef(children)
  const prevPathname          = useRef(pathname)

  useEffect(() => {
    // Same page — no transition needed (e.g. hash change, searchParams)
    if (pathname === prevPathname.current) {
      setDisplay(children)
      return
    }

    prevPathname.current  = pathname
    pendingChildren.current = children

    // Phase 1 — fade + slide out
    setPhase('out')

    const outTimer = setTimeout(() => {
      // Swap content at the midpoint (page is invisible)
      setDisplay(pendingChildren.current)

      // Phase 2 — fade + slide in
      setPhase('in')

      const inTimer = setTimeout(() => {
        setPhase('idle')
      }, 400)

      return () => clearTimeout(inTimer)
    }, 300)

    return () => clearTimeout(outTimer)
  }, [pathname, children])

  const styles: Record<string, React.CSSProperties> = {
    idle: { opacity: 1,   transform: 'translateY(0px)',  transition: 'none' },
    out:  { opacity: 0,   transform: 'translateY(-8px)', transition: 'opacity 300ms cubic-bezier(0.4,0,0.2,1), transform 300ms cubic-bezier(0.4,0,0.2,1)' },
    in:   { opacity: 1,   transform: 'translateY(0px)',  transition: 'opacity 400ms cubic-bezier(0.0,0,0.2,1), transform 400ms cubic-bezier(0.0,0,0.2,1)' },
  }

  return (
    <div style={styles[phase]}>
      {display}
    </div>
  )
}