// components/PageTransition.tsx
'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { useNavigate } from '@/context/NavigationContext'

interface Props { children: React.ReactNode }

const COVER_MS   = 275
const HOLD_MS    = 50
const UNCOVER_MS = 200

export default function PageTransition({ children }: Props) {
  const pathname          = usePathname()
  const router            = useRouter()
  const { darkMode }      = useTheme()
  const { registerCover } = useNavigate()

  const [display, setDisplay] = useState(children)
  const [phase, setPhase]     = useState<'idle' | 'covering' | 'covered' | 'uncovering'>('idle')

  const prevPathname    = useRef(pathname)
  const isTransitioning = useRef(false)

  // ── Cover + push — used by both click interceptor and programmatic nav ──
  const coverAndPush = useRef((href: string) => {
    if (isTransitioning.current) return
    isTransitioning.current = true
    setPhase('covering')
    setTimeout(() => router.push(href), COVER_MS)
  })

  // ── Register cover function so NavigationContext can call it ──
  useEffect(() => {
    registerCover((href) => coverAndPush.current(href))
  }, [registerCover])

  // ── Intercept <a> clicks ──────────────────────────────────
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a')
      if (!anchor) return
      const href = anchor.getAttribute('href')
      if (!href) return
      const isInternal = !href.startsWith('http') && !href.startsWith('//') && !href.startsWith('#')
      const isSamePage = href === window.location.pathname
      if (!isInternal || isSamePage) return

      e.preventDefault()
      coverAndPush.current(href)
    }

    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [])

  // ── Uncover when new page children arrive ─────────────────
  useEffect(() => {
    if (pathname === prevPathname.current) {
      setDisplay(children)
      return
    }

    prevPathname.current = pathname
    setDisplay(children)
    setPhase('covered')

    setTimeout(() => {
      setPhase('uncovering')
      setTimeout(() => {
        setPhase('idle')
        isTransitioning.current = false
      }, UNCOVER_MS)
    }, HOLD_MS)
  }, [pathname, children])

  const maskStyle: React.CSSProperties = {
    position:        'fixed',
    inset:           0,
    zIndex:          99998,
    pointerEvents:   phase === 'idle' ? 'none' : 'all',
    backgroundColor: darkMode ? '#1E1C1A' : '#F7F3ED',
    ...(phase === 'idle'      && { clipPath: 'inset(0 100% 0 0)', transition: 'none' }),
    ...(phase === 'covering'  && { clipPath: 'inset(0 0% 0 0)',   transition: `clip-path ${COVER_MS}ms cubic-bezier(0.76,0,0.24,1)` }),
    ...(phase === 'covered'   && { clipPath: 'inset(0 0% 0 0)',   transition: 'none' }),
    ...(phase === 'uncovering'&& { clipPath: 'inset(0 0% 0 100%)',transition: `clip-path ${UNCOVER_MS}ms cubic-bezier(0.76,0,0.24,1)` }),
  }

  return (
    <>
      <div style={maskStyle} aria-hidden="true" />
      {display}
    </>
  )
}