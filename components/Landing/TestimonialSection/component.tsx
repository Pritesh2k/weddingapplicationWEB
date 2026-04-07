'use client'

import React, { RefObject, useState, useEffect } from 'react'
import { BROWN_PRIMARY } from '@/lib/theme'
import { useTheme } from '@/context/ThemeContext'
import { loadGSAP } from '@/lib/Landing/useGSAP'

// ─── TYPES ───────────────────────────────────────────────────
export interface Testimonial {
  id: string
  quote: string
  name: string
  detail: string
  initials: string
  avatarBg: string
  avatarColor: string
}

interface TestimonialSectionProps {
  testimonialRef: RefObject<HTMLElement | null>
  testimonials: Testimonial[]
}

// ─── COMPONENT ───────────────────────────────────────────────
const TestimonialSection = ({ testimonialRef, testimonials }: TestimonialSectionProps) => {
  const { T } = useTheme()
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  useEffect(() => {
    loadGSAP().then(() => {
      if (!testimonialRef.current) return
      window.gsap.fromTo(
        testimonialRef.current.querySelector('.testimonial-card'),
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: testimonialRef.current, start: 'top 75%' }
        }
      )
    })
  }, [])

  // ── Auto-advance every 6s ─────────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [testimonials.length])

  return (
    <section
      id="testimonials"
      ref={testimonialRef}
      className="py-28 md:py-36"
      style={{ borderTop: `1px solid ${T.borderBrown}` }}
      aria-label="Testimonials"
    >
      <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center">

        <p className="section-heading text-xs font-semibold tracking-widest uppercase mb-4"
          style={{ color: T.accentText }}>
          Trusted by couples &amp; planners
        </p>
        <h2 className="section-heading text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-16"
          style={{ color: T.textPrimary }}>
          What people are saying.
        </h2>

        <div className="testimonial-card relative">

          {/* Quotes */}
          {testimonials.map((t, i) => (
            <blockquote
              key={t.id}
              id={`testimonial-${t.id}`}
              className={`transition-all duration-500 ${i === activeTestimonial ? 'opacity-100 block' : 'opacity-0 hidden'}`}
              aria-hidden={i !== activeTestimonial}
            >
              <div
                className="p-8 md:p-12 rounded-2xl mb-6"
                style={{ backgroundColor: T.surface, border: `1px solid ${T.borderBrown}` }}
              >
                <p className="text-xl md:text-2xl leading-relaxed font-medium italic mb-8"
                  style={{ color: T.textSecondary }}>
                  "{t.quote}"
                </p>
                <div className="flex items-center justify-center gap-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ backgroundColor: t.avatarBg, color: t.avatarColor }}
                    aria-hidden="true"
                  >
                    {t.initials}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-sm" style={{ color: T.textPrimary }}>{t.name}</p>
                    <p className="text-xs" style={{ color: T.textMuted }}>{t.detail}</p>
                  </div>
                </div>
              </div>
            </blockquote>
          ))}

          {/* Dot navigation */}
          <div className="flex items-center justify-center gap-2.5 mt-4"
            role="tablist" aria-label="Testimonial navigation">
            {testimonials.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setActiveTestimonial(i)}
                role="tab"
                aria-selected={i === activeTestimonial}
                aria-label={`Go to testimonial ${i + 1}`}
                className="rounded-full transition-all duration-300 focus:outline-none"
                style={i === activeTestimonial
                  ? { width: '24px', height: '8px', background: BROWN_PRIMARY }
                  : { width: '8px', height: '8px', backgroundColor: T.surface, border: `1px solid ${T.borderBrown}` }
                }
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

export default TestimonialSection