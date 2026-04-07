'use client'

import { RefObject, useEffect, useRef } from 'react'
import { BROWN_PRIMARY, BROWN_PALE } from '@/lib/theme'
import { useTheme } from '@/context/ThemeContext'
import { loadGSAP } from '@/lib/Landing/useGSAP'

// ─── TYPES ───────────────────────────────────────────────────
interface Stat {
  id: string
  value: number
  suffix: string
  label: string
}

interface StatsSectionProps {
  statsRef: RefObject<HTMLElement | null>
  stats: Stat[]
}

// ─── COMPONENT ───────────────────────────────────────────────
const StatsSection = ({ statsRef, stats }: StatsSectionProps) => {
  const { T } = useTheme()
  const countersRef = useRef<(HTMLSpanElement | null)[]>([])
  const animated = useRef(false)

  useEffect(() => {
    loadGSAP().then(() => {
      if (!statsRef.current) return
      window.gsap.fromTo(
        statsRef.current.querySelectorAll('.stat-item'),
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: statsRef.current, start: 'top 75%' }
        }
      )
    })
  }, [])

  useEffect(() => {
    const container = statsRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || animated.current) return
        animated.current = true

        stats.forEach((stat, i) => {
          const el = countersRef.current[i]
          if (!el) return

          const duration = 1800
          const start = performance.now()

          const tick = (now: number) => {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            // ease out quad
            const eased = 1 - Math.pow(1 - progress, 2)
            el.textContent = Math.round(eased * stat.value).toString()
            if (progress < 1) requestAnimationFrame(tick)
          }

          requestAnimationFrame(tick)
        })
      },
      { threshold: 0.3 }
    )

    observer.observe(container)
    return () => observer.disconnect()
  }, [stats, statsRef])

  return (
    <section
      id="stats"
      ref={statsRef}
      className="py-20"
      style={{ borderTop: `1px solid ${T.borderBrown}` }}
      aria-label="Platform statistics"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {stats.map((stat, i) => (
            <div key={stat.id} id={`stat-${stat.id}`} className="stat-item text-center">

              <div
                className="text-5xl md:text-6xl font-bold tracking-tighter mb-2
                           bg-clip-text text-transparent"
                style={{ backgroundImage: `linear-gradient(135deg, ${BROWN_PRIMARY}, ${BROWN_PALE})` }}
              >
                <span
                  ref={(el) => { countersRef.current[i] = el }}
                  aria-label={`${stat.value}${stat.suffix}`}
                >
                  0
                </span>
                <span aria-hidden="true">{stat.suffix}</span>
              </div>

              <p className="text-sm font-medium" style={{ color: T.textMuted }}>
                {stat.label}
              </p>

            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsSection