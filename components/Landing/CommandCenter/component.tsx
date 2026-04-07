'use client'

import { RefObject, useEffect } from 'react'
import { BROWN_PRIMARY, BROWN_PALE, BROWN_DARK } from '@/lib/theme'
import { useTheme } from '@/context/ThemeContext'
import { loadGSAP } from '@/lib/Landing/useGSAP'

// ─── TYPES ───────────────────────────────────────────────────
export interface CmdRowData {
  time: string
  label: string
  sub: string
  status: 'done' | 'live' | 'next' | 'alert' | 'confirmed'
}

interface Vendor {
  name: string
  checked: boolean
}

interface LiveFeature {
  label: string
  desc: string
}

interface CommandCentreProps {
  commandRef: RefObject<HTMLElement | null>
  cmdRows: CmdRowData[]
  vendors: Vendor[]
  liveFeatures: LiveFeature[]
}

// ─── CMD ROW ─────────────────────────────────────────────────
const CmdRow = ({ row, dark }: { row: CmdRowData; dark: boolean }) => {
  const { time, label, sub, status } = row
  const isDone = status === 'done'
  const isLive = status === 'live'
  const isAlert = status === 'alert'
  const isNext = status === 'next'
  const isConfirmed = status === 'confirmed'

  const timeColor = dark
    ? isLive ? BROWN_PALE : isDone ? '#5A4A38' : isNext ? BROWN_PALE : isAlert ? '#E8867A' : '#7A9E8A'
    : isLive ? BROWN_PRIMARY : isDone ? '#B0A090' : isNext ? BROWN_DARK : isAlert ? '#AA5040' : '#3A7A68'

  const rowBg = dark
    ? isLive ? 'rgba(196,168,130,0.10)' : isAlert ? 'rgba(232,134,122,0.08)' : '#272320'
    : isLive ? 'rgba(139,107,71,0.10)' : isAlert ? 'rgba(170,80,64,0.06)' : '#EAE2D8'

  const rowBorder = dark
    ? isLive ? 'rgba(196,168,130,0.30)' : isAlert ? 'rgba(232,134,122,0.22)' : '#38302A'
    : isLive ? 'rgba(139,107,71,0.28)' : isAlert ? 'rgba(170,80,64,0.18)' : 'rgba(139,107,71,0.12)'

  const textMain = dark
    ? isDone ? '#6B5A48' : '#F2EDE6'
    : isDone ? '#9A8878' : '#1C1510'

  const badge = (() => {
    if (isLive) return (
      <span className="text-xs font-bold px-2 py-0.5 rounded-full"
        style={dark
          ? { background: 'rgba(196,168,130,0.20)', color: BROWN_PALE, border: '1px solid rgba(196,168,130,0.40)' }
          : { background: 'rgba(139,107,71,0.14)', color: BROWN_PRIMARY, border: '1px solid rgba(139,107,71,0.35)' }}>
        ● LIVE
      </span>
    )
    if (isDone) return (
      <span style={{ color: dark ? '#5A9E8A' : '#3A7A68', fontSize: '16px' }}>✓</span>
    )
    if (isNext) return (
      <span className="text-xs font-bold px-2 py-0.5 rounded-full"
        style={dark
          ? { background: 'rgba(139,107,71,0.15)', color: BROWN_PALE, border: '1px solid rgba(139,107,71,0.30)' }
          : { background: 'rgba(110,84,50,0.10)', color: BROWN_DARK, border: '1px solid rgba(110,84,50,0.28)' }}>
        Upcoming
      </span>
    )
    if (isAlert) return (
      <span className="text-xs font-bold px-2 py-0.5 rounded-full"
        style={dark
          ? { background: 'rgba(232,134,122,0.20)', color: '#E8867A', border: '1px solid rgba(232,134,122,0.40)' }
          : { background: 'rgba(170,80,64,0.12)', color: '#AA5040', border: '1px solid rgba(170,80,64,0.30)' }}>
        Alert
      </span>
    )
    if (isConfirmed) return (
      <span className="text-xs font-bold px-2 py-0.5 rounded-full"
        style={dark
          ? { background: 'rgba(90,158,138,0.18)', color: '#7A9E8A', border: '1px solid rgba(90,158,138,0.35)' }
          : { background: 'rgba(58,122,104,0.12)', color: '#3A7A68', border: '1px solid rgba(58,122,104,0.28)' }}>
        Confirmed
      </span>
    )
  })()

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl"
      style={{ backgroundColor: rowBg, border: `1px solid ${rowBorder}`, opacity: isDone ? 0.45 : 1 }}>
      <span className="text-xs font-mono w-10 shrink-0 font-semibold" style={{ color: timeColor }}>
        {time}
      </span>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: timeColor }} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium" style={{ color: textMain }}>{label}</p>
        <p className="text-xs truncate" style={{ color: dark ? '#8A7E74' : '#9A8070' }}>{sub}</p>
      </div>
      <div className="shrink-0">{badge}</div>
    </div>
  )
}

// ─── CMD VENDOR ───────────────────────────────────────────────
const CmdVendor = ({ vendors, dark }: { vendors: Vendor[]; dark: boolean }) => (
  <div className="p-4 rounded-xl mt-1"
    style={dark
      ? { backgroundColor: '#2F2B28', border: '1px solid #38302A' }
      : { backgroundColor: '#E8E0D4', border: '1px solid rgba(139,107,71,0.18)' }}>
    <p className="text-xs font-bold uppercase tracking-widest mb-3"
      style={{ color: dark ? BROWN_PALE : BROWN_PRIMARY }}>
      Vendor Check-in
    </p>
    <div className="flex flex-wrap gap-2">
      {vendors.map((v) => (
        <span key={v.name} className="text-xs px-2.5 py-1.5 rounded-full font-semibold"
          style={v.checked
            ? dark
              ? { background: 'rgba(90,158,138,0.18)', color: '#7A9E8A', border: '1px solid rgba(90,158,138,0.35)' }
              : { background: 'rgba(58,122,104,0.12)', color: '#3A7A68', border: '1px solid rgba(58,122,104,0.28)' }
            : dark
              ? { background: 'rgba(139,107,71,0.14)', color: BROWN_PALE, border: '1px solid rgba(139,107,71,0.32)' }
              : { background: 'rgba(139,107,71,0.12)', color: BROWN_PRIMARY, border: '1px solid rgba(139,107,71,0.28)' }
          }>
          {v.checked ? '✓ ' : '⏳ '}{v.name}
        </span>
      ))}
    </div>
  </div>
)

// ─── MAIN COMPONENT ───────────────────────────────────────────
const CommandCentre = ({ commandRef, cmdRows, vendors, liveFeatures }: CommandCentreProps) => {
  const { darkMode, T } = useTheme()

  useEffect(() => {
    loadGSAP().then(() => {
      if (!commandRef.current) return
      const { gsap } = window
      gsap.fromTo(
        commandRef.current.querySelectorAll('.command-reveal'),
        { x: -60, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.15,
          scrollTrigger: { trigger: commandRef.current, start: 'top 70%' }
        }
      )
      gsap.fromTo(
        commandRef.current.querySelector('.command-visual'),
        { x: 60, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 1, ease: 'power3.out', clearProps: 'transform',
          scrollTrigger: { trigger: commandRef.current, start: 'top 70%' }
        }
      )
    })
  }, [])

  return (
    <section
      id="command-centre"
      ref={commandRef}
      className="py-28 md:py-36"
      style={{ borderTop: `1px solid ${T.borderBrown}` }}
      aria-label="Day-of command centre"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left — copy */}
          <div>
            <p className="command-reveal text-xs font-semibold tracking-widest uppercase mb-4"
              style={{ color: T.accentText }}>
              Day-of Live Mode
            </p>
            <h2 className="command-reveal section-heading text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-6"
              style={{ color: T.textPrimary }}>
              The wedding day command centre.
            </h2>
            <p className="command-reveal text-lg leading-relaxed mb-8"
              style={{ color: T.textSecondary }}>
              When the day arrives, Vow transforms into a live operations console. Coordinators
              get role-specific run sheets, real-time vendor check-in, incident logging, and
              recovery playbooks — all in one place.
            </p>

            <ul className="space-y-4" role="list" aria-label="Live mode features">
              {liveFeatures.map((item) => (
                <li key={item.label} className="command-reveal flex items-start gap-3" role="listitem">
                  <span
                    className="mt-1 w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(139,107,71,0.15)', border: '1px solid rgba(139,107,71,0.35)' }}
                    aria-hidden="true"
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: T.accentText }} />
                  </span>
                  <div>
                    <p className="font-semibold text-sm mb-0.5" style={{ color: T.textPrimary }}>{item.label}</p>
                    <p className="text-sm" style={{ color: T.textMuted }}>{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — live mode visual */}
          <div className="command-visual w-full max-w-lg mx-auto lg:max-w-none lg:mx-0 lg:w-auto"
            aria-hidden="true">
            <div
              className="relative rounded-2xl overflow-hidden p-6"
              style={{
                backgroundColor: T.cmdBg,
                border: `1px solid ${T.cmdBorder}`,
                boxShadow: darkMode
                  ? '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(160,120,72,0.08)'
                  : '0 12px 40px rgba(139,107,71,0.12), 0 2px 8px rgba(0,0,0,0.06)',
              }}
            >
              <div className="flex items-center justify-between mb-1 pb-4"
                style={{ borderBottom: `1px solid ${T.cmdHeaderBorder}` }}>
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full animate-pulse"
                    style={{ background: darkMode ? BROWN_PALE : BROWN_PRIMARY }} />
                  <span className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: darkMode ? BROWN_PALE : BROWN_PRIMARY }}>
                    Live Mode Active
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: darkMode ? T.textMuted : '#9A8070' }}>
                    14:32 · Day 2 of 3
                  </p>
                  <p className="text-xs font-medium" style={{ color: darkMode ? BROWN_PALE : BROWN_DARK }}>
                    Wedding Ceremony · 15 June
                  </p>
                </div>
              </div>

              <div className="space-y-2 my-4">
                {cmdRows.map((row) => (
                  <CmdRow key={row.time} row={row} dark={darkMode} />
                ))}
              </div>

              <CmdVendor vendors={vendors} dark={darkMode} />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default CommandCentre