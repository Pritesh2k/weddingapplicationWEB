// app/page.tsx
// ============================================================
// VOW — Wedding Operating System | Landing Page
// Stack: Next.js (App Router) · TailwindCSS · GSAP
// ============================================================
// COMPONENT MAP (future extraction targets):
//   <Navbar />             — Fixed top navigation + dark/light toggle
//   <HeroSection />        — Full-screen hero with animated headline
//   <LogoStrip />          — Scrolling trust / supported-formats bar
//   <ProblemSection />     — "Not just a planner" narrative block
//   <FeaturesGrid />       — Six-card feature grid
//   <StatsSection />       — Animated counters
//   <CommandCentre />      — Live mode showcase (split layout)
//   <StakeholderSection /> — Role-based experience grid
//   <TraditionSection />   — Cultural modules showcase
//   <TestimonialSection /> — Testimonial carousel
//   <WaitlistSection />    — Email capture CTA
//   <Footer />             — Footer with nav links
// ============================================================

'use client'

import React, { useEffect, useRef, useState } from 'react'

declare global {
  interface Window { gsap: any; ScrollTrigger: any }
}

// ─── ICONS ───────────────────────────────────────────────────
const IconRings = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
    <circle cx="8" cy="12" r="5" /><circle cx="16" cy="12" r="5" />
  </svg>
)
const IconCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
    <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
)
const IconUsers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)
const IconVendor = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)
const IconCeremony = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
    <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
)
const IconTask = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
    <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
)
const IconBudget = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
)
const IconMoon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)
const IconSun = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
)
const IconArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
)
const IconChevronDown = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
    <path d="M6 9l6 6 6-6" />
  </svg>
)

// ============================================================
// ─── THEME CONFIG
// ─── Edit ONLY this object to retheme the entire site.
// ─── Dark: charcoal-espresso with warm brown undertones.
// ─── Light: warm ivory/linen — unchanged.
// ============================================================
const THEME = {
  dark: {
    // ── Backgrounds ───────────────────────────────────────────
    // Charcoal with a warm brown undertone — dark elegance
    bg: '#1E1C1A',   // ← page base. Shift here to go warmer/cooler
    surface: '#272320',   // ← cards, nav
    surface2: '#2F2B28',   // ← elevated surfaces
    // ── Text ─────────────────────────────────────────────────
    textPrimary: '#F2EDE6',   // warm off-white, never cold
    textSecondary: '#C9BFB2',   // warm light grey
    textMuted: '#8A7E74',   // warm mid-grey brown
    // ── Borders ──────────────────────────────────────────────
    borderSubtle: 'rgba(242,237,230,0.07)',
    borderBrown: 'rgba(160,126,84,0.20)',
    // ── Accent ───────────────────────────────────────────────
    accentText: '#C4A882',   // champagne — readable on dark
    // ── Hero ─────────────────────────────────────────────────
    heroBg: 'radial-gradient(ellipse 130% 85% at 50% -15%, #302620 0%, #272320 45%, #1E1C1A 100%)',
    heroGlow: 'radial-gradient(ellipse, rgba(160,120,72,0.13) 0%, rgba(110,84,50,0.05) 55%, transparent 75%)',
    heroGrid: 'rgba(160,120,72,0.45)',
    heroVignette: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 48%, rgba(10,8,6,0.58) 100%)',
    // ── Command Centre card ───────────────────────────────────
    cmdBg: '#1E1C1A',
    cmdBorder: '#38302A',
    cmdHeaderBorder: 'rgba(56,48,42,0.9)',
    cmdRowDefault: '#272320',
    cmdVendorBg: '#2F2B28',
    cmdVendorBorder: '#38302A',
    // ── Nav backdrop ─────────────────────────────────────────
    navBgScrolled: 'rgba(30,28,26,0.92)',
    mobileDrawerBg: 'rgba(30,28,26,0.96)',
  },
  light: {
    // ── Backgrounds — UNCHANGED ───────────────────────────────
    bg: '#F7F3ED',
    surface: '#EDE8E0',
    surface2: '#E4DDD3',
    textPrimary: '#1C1510',
    textSecondary: '#3D2E1E',
    textMuted: '#7A6A58',
    borderSubtle: 'rgba(0,0,0,0.08)',
    borderBrown: 'rgba(139,107,71,0.18)',
    accentText: '#8B6B47',
    heroBg: 'radial-gradient(ellipse 120% 80% at 50% -10%, #F0E8D8 0%, #EDE8E0 40%, #F7F3ED 100%)',
    heroGlow: 'radial-gradient(ellipse, rgba(139,107,71,0.10) 0%, transparent 70%)',
    heroGrid: 'rgba(139,107,71,0.5)',
    heroVignette: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 50%, rgba(247,243,237,0.4) 100%)',
    cmdBg: '#F0E8DA',
    cmdBorder: 'rgba(139,107,71,0.25)',
    cmdHeaderBorder: 'rgba(139,107,71,0.18)',
    cmdRowDefault: '#EAE2D8',
    cmdVendorBg: '#E8E0D4',
    cmdVendorBorder: 'rgba(139,107,71,0.18)',
    navBgScrolled: 'rgba(247,243,237,0.92)',
    mobileDrawerBg: 'rgba(247,243,237,0.96)',
  },
  // ── Primary CTA button — change these 2 hex values to restyle ALL buttons ──
  btn: {
    from: '#8B6B47',
    to: '#6E5438',
    text: '#F7F3ED',
    shadow: 'rgba(139,107,71,0.28)',
  },
}

// ── Derived constants — do not edit, computed from THEME ──────
const BROWN_PRIMARY = THEME.btn.from
const BROWN_DARK = THEME.btn.to
const BROWN_LIGHT = '#A07E5A'
const BROWN_PALE = '#C4A882'

const btnPrimary = {
  bg: `linear-gradient(135deg, ${THEME.btn.from} 0%, ${THEME.btn.to} 100%)`,
  shadow: `0 4px 20px ${THEME.btn.shadow}`,
  color: THEME.btn.text,
}

// ─── FEATURES DATA ───────────────────────────────────────────
const features = [
  {
    id: 'programme-builder', icon: <IconCalendar />, label: 'Programme Builder',
    title: 'Wedding Programme Builder',
    description: 'Model your wedding as a connected programme of sub-events — mehendi, nikah, sangeet, ceremony, reception — each with its own venue, guest scope, dress code, and vendor dependencies.',
    accentDark: 'rgba(139,107,71,0.12)', accentLight: 'rgba(139,107,71,0.07)',
    borderDark: 'rgba(139,107,71,0.25)', borderLight: 'rgba(139,107,71,0.20)',
    iconDark: { bg: 'rgba(139,107,71,0.15)', color: BROWN_PALE },
    iconLight: { bg: 'rgba(139,107,71,0.12)', color: BROWN_PRIMARY },
  },
  {
    id: 'guest-crm', icon: <IconUsers />, label: 'Guest CRM',
    title: 'Guest & Household CRM',
    description: 'Manage households, event-specific invitations, RSVP tracking, dietary needs, seating, and live guest flow — all linked to your programme structure.',
    accentDark: 'rgba(176,100,90,0.10)', accentLight: 'rgba(176,100,90,0.06)',
    borderDark: 'rgba(176,100,90,0.22)', borderLight: 'rgba(176,100,90,0.18)',
    iconDark: { bg: 'rgba(176,100,90,0.14)', color: '#D4847A' },
    iconLight: { bg: 'rgba(176,100,90,0.10)', color: '#AA5A50' },
  },
  {
    id: 'vendor-intelligence', icon: <IconVendor />, label: 'Vendor Intelligence',
    title: 'Vendor Intelligence',
    description: 'Track every supplier from shortlist to signed contract. Manage payment milestones, deliverables, arrival windows, and backup vendors per category.',
    accentDark: 'rgba(160,130,80,0.10)', accentLight: 'rgba(160,130,80,0.06)',
    borderDark: 'rgba(160,130,80,0.22)', borderLight: 'rgba(160,130,80,0.18)',
    iconDark: { bg: 'rgba(160,130,80,0.14)', color: '#D4AA66' },
    iconLight: { bg: 'rgba(160,130,80,0.10)', color: '#9A7A38' },
  },
  {
    id: 'ceremony-builder', icon: <IconCeremony />, label: 'Ceremony Builder',
    title: 'Ceremony & Ritual Builder',
    description: 'Configure ceremony steps, vows, readings, music cues, ritual items, and required witnesses — for any tradition or blended combination.',
    accentDark: 'rgba(90,140,130,0.10)', accentLight: 'rgba(90,140,130,0.06)',
    borderDark: 'rgba(90,140,130,0.22)', borderLight: 'rgba(90,140,130,0.18)',
    iconDark: { bg: 'rgba(90,140,130,0.14)', color: '#7ABDB0' },
    iconLight: { bg: 'rgba(90,140,130,0.10)', color: '#4A8A80' },
  },
  {
    id: 'task-engine', icon: <IconTask />, label: 'Task Engine',
    title: 'Task & Milestone Engine',
    description: 'Generate tasks from wedding templates, set dependencies and blockers, assign owners, and track readiness across every domain at once.',
    accentDark: 'rgba(100,120,160,0.10)', accentLight: 'rgba(100,120,160,0.06)',
    borderDark: 'rgba(100,120,160,0.22)', borderLight: 'rgba(100,120,160,0.18)',
    iconDark: { bg: 'rgba(100,120,160,0.14)', color: '#8AACCF' },
    iconLight: { bg: 'rgba(100,120,160,0.10)', color: '#4A6A9A' },
  },
  {
    id: 'budget-tracker', icon: <IconBudget />, label: 'Budget Tracker',
    title: 'Budget & Finance Tracker',
    description: 'Set category allocations, log actuals, track deposits and staged payments, and manage gratuity plans — with live variance reporting.',
    accentDark: 'rgba(110,140,100,0.10)', accentLight: 'rgba(110,140,100,0.06)',
    borderDark: 'rgba(110,140,100,0.22)', borderLight: 'rgba(110,140,100,0.18)',
    iconDark: { bg: 'rgba(110,140,100,0.14)', color: '#8ABF7A' },
    iconLight: { bg: 'rgba(110,140,100,0.10)', color: '#4A7A38' },
  },
]

// ─── STAKEHOLDER DATA ─────────────────────────────────────────
const stakeholders = [
  {
    id: 'couple', role: 'Couple', tagline: 'Calm by default',
    description: "See your readiness score, this week's key decisions, and live event status — without the operational noise.",
    lightBg: '#F5EDE0', lightBorder: '#D4B896', lightDot: '#8B6B47', lightLabel: '#8B6B47',
    darkBg: 'rgba(139,107,71,0.12)', darkBorder: 'rgba(139,107,71,0.25)', darkDot: BROWN_PALE, darkLabel: BROWN_PALE,
  },
  {
    id: 'coordinator', role: 'Day-of Coordinator', tagline: 'Command everything',
    description: 'Role-based run sheets, vendor check-in, incident logging, escalation chains, and timeline recovery — in one console.',
    lightBg: '#F5E8E6', lightBorder: '#D4A09A', lightDot: '#AA5A50', lightLabel: '#AA5A50',
    darkBg: 'rgba(176,100,90,0.12)', darkBorder: 'rgba(176,100,90,0.25)', darkDot: '#D4847A', darkLabel: '#D4847A',
  },
  {
    id: 'planner', role: 'Wedding Planner', tagline: 'Full operational control',
    description: 'Cross-event status, vendor balances, blocked tasks, finalization gaps, and live command centre access.',
    lightBg: '#F5EFE0', lightBorder: '#D4BC8C', lightDot: '#9A7A38', lightLabel: '#9A7A38',
    darkBg: 'rgba(160,130,80,0.12)', darkBorder: 'rgba(160,130,80,0.25)', darkDot: '#D4AA66', darkLabel: '#D4AA66',
  },
  {
    id: 'family', role: 'Family Lead', tagline: 'Scoped and clear',
    description: 'Assigned responsibilities, ritual item tracking, communication threads, and just enough visibility for your role.',
    lightBg: '#E8F2EE', lightBorder: '#90C4B4', lightDot: '#4A8A80', lightLabel: '#4A8A80',
    darkBg: 'rgba(90,140,130,0.12)', darkBorder: 'rgba(90,140,130,0.25)', darkDot: '#7ABDB0', darkLabel: '#7ABDB0',
  },
  {
    id: 'vendor', role: 'Vendor', tagline: 'Briefed and confirmed',
    description: 'Arrival windows, deliverables, contact details, and real-time updates — no chasing required.',
    lightBg: '#E8EDF5', lightBorder: '#90A8D4', lightDot: '#4A6A9A', lightLabel: '#4A6A9A',
    darkBg: 'rgba(100,120,160,0.12)', darkBorder: 'rgba(100,120,160,0.25)', darkDot: '#8AACCF', darkLabel: '#8AACCF',
  },
  {
    id: 'guest', role: 'Guest', tagline: 'Informed and welcomed',
    description: 'Event itineraries, venue maps, RSVP, dress code, transport details, and live announcements.',
    lightBg: '#EBF0E8', lightBorder: '#A4C49A', lightDot: '#4A7A38', lightLabel: '#4A7A38',
    darkBg: 'rgba(110,140,100,0.12)', darkBorder: 'rgba(110,140,100,0.25)', darkDot: '#8ABF7A', darkLabel: '#8ABF7A',
  },
]

// ─── TRADITIONS DATA ──────────────────────────────────────────
const traditions = [
  {
    id: 'hindu', label: 'Hindu / Indian',
    events: ['Mehendi', 'Haldi', 'Sangeet', 'Ceremony', 'Reception'],
    activeTabBg: 'rgba(160,120,60,0.15)', activeTabBorder: 'rgba(160,120,60,0.50)', activeTabText: '#B8924A',
    tagBg: 'rgba(160,120,60,0.12)', tagBorder: 'rgba(160,120,60,0.30)', tagText: '#B8924A',
    lightActiveTabBg: 'rgba(139,107,47,0.10)', lightActiveTabBorder: 'rgba(139,107,47,0.40)', lightActiveTabText: '#7A5A28',
    lightTagBg: 'rgba(139,107,47,0.08)', lightTagBorder: 'rgba(139,107,47,0.25)', lightTagText: '#7A5A28',
  },
  {
    id: 'muslim', label: 'Muslim',
    events: ['Nikah', 'Walima', 'Family Gathering'],
    activeTabBg: 'rgba(80,140,130,0.15)', activeTabBorder: 'rgba(80,140,130,0.50)', activeTabText: '#5AADA0',
    tagBg: 'rgba(80,140,130,0.12)', tagBorder: 'rgba(80,140,130,0.30)', tagText: '#5AADA0',
    lightActiveTabBg: 'rgba(60,110,100,0.10)', lightActiveTabBorder: 'rgba(60,110,100,0.40)', lightActiveTabText: '#3A7A70',
    lightTagBg: 'rgba(60,110,100,0.08)', lightTagBorder: 'rgba(60,110,100,0.25)', lightTagText: '#3A7A70',
  },
  {
    id: 'christian', label: 'Christian',
    events: ['Rehearsal', 'Ceremony', 'Blessing', 'Reception'],
    activeTabBg: 'rgba(90,120,170,0.15)', activeTabBorder: 'rgba(90,120,170,0.50)', activeTabText: '#7A9FCC',
    tagBg: 'rgba(90,120,170,0.12)', tagBorder: 'rgba(90,120,170,0.30)', tagText: '#7A9FCC',
    lightActiveTabBg: 'rgba(70,100,150,0.10)', lightActiveTabBorder: 'rgba(70,100,150,0.40)', lightActiveTabText: '#4A70A0',
    lightTagBg: 'rgba(70,100,150,0.08)', lightTagBorder: 'rgba(70,100,150,0.25)', lightTagText: '#4A70A0',
  },
  {
    id: 'civil', label: 'Civil',
    events: ['Legal Ceremony', 'Reception', 'Celebration'],
    activeTabBg: 'rgba(130,110,170,0.15)', activeTabBorder: 'rgba(130,110,170,0.50)', activeTabText: '#A890CC',
    tagBg: 'rgba(130,110,170,0.12)', tagBorder: 'rgba(130,110,170,0.30)', tagText: '#A890CC',
    lightActiveTabBg: 'rgba(100,85,140,0.10)', lightActiveTabBorder: 'rgba(100,85,140,0.40)', lightActiveTabText: '#6A5598',
    lightTagBg: 'rgba(100,85,140,0.08)', lightTagBorder: 'rgba(100,85,140,0.25)', lightTagText: '#6A5598',
  },
  {
    id: 'blended', label: 'Blended / Interfaith',
    events: ['Custom Streams', 'Multi-tradition', 'Combined Program'],
    activeTabBg: 'rgba(139,107,71,0.18)', activeTabBorder: 'rgba(139,107,71,0.55)', activeTabText: BROWN_PALE,
    tagBg: 'rgba(139,107,71,0.14)', tagBorder: 'rgba(139,107,71,0.35)', tagText: BROWN_PALE,
    lightActiveTabBg: 'rgba(110,84,50,0.12)', lightActiveTabBorder: 'rgba(110,84,50,0.45)', lightActiveTabText: BROWN_PRIMARY,
    lightTagBg: 'rgba(110,84,50,0.09)', lightTagBorder: 'rgba(110,84,50,0.28)', lightTagText: BROWN_PRIMARY,
  },
]

// ─── STATS DATA ───────────────────────────────────────────────
const stats = [
  { id: 'events', value: 12, suffix: '+', label: 'Event types supported' },
  { id: 'stakeholders', value: 6, suffix: '', label: 'Stakeholder roles' },
  { id: 'traditions', value: 5, suffix: '+', label: 'Cultural traditions' },
  { id: 'features', value: 13, suffix: '', label: 'Planning modules' },
]

// ─── TESTIMONIALS DATA ────────────────────────────────────────
const testimonials = [
  { id: 't1', quote: 'Vow turned what would have been a logistical nightmare into the most organised event I have ever coordinated. The live mode on the day was extraordinary.', name: 'Priya & James', detail: '3-day Hindu-Christian blended wedding, London', initials: 'PJ', avatarBg: 'rgba(139,107,71,0.18)', avatarColor: BROWN_PALE },
  { id: 't2', quote: "As a professional planner, I've tried every tool on the market. Nothing comes close to the operational depth Vow offers, especially for multi-venue events.", name: 'Sarah Okonkwo', detail: 'Wedding Planner, London', initials: 'SO', avatarBg: 'rgba(176,100,90,0.18)', avatarColor: '#D4847A' },
  { id: 't3', quote: 'We had a 5-day destination wedding across two venues. The fact that every family member, vendor, and coordinator had their own tailored view was a game-changer.', name: 'Aisha & Tariq', detail: 'Destination Nikah & Walima, Dubai', initials: 'AT', avatarBg: 'rgba(90,140,130,0.18)', avatarColor: '#7ABDB0' },
]

// ============================================================
// ─── MAIN PAGE COMPONENT ─────────────────────────────────────
// ============================================================
const page = () => {

  const [darkMode, setDarkMode] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [activeTradition, setActiveTradition] = useState(0)
  const [scrolled, setScrolled] = useState(false)

  const heroRef = useRef<HTMLElement>(null)
  const heroHeadlineRef = useRef<HTMLHeadingElement>(null)
  const heroSubRef = useRef<HTMLParagraphElement>(null)
  const heroCTARef = useRef<HTMLDivElement>(null)
  const heroScrollRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const problemRef = useRef<HTMLElement>(null)
  const featuresRef = useRef<HTMLElement>(null)
  const commandRef = useRef<HTMLElement>(null)
  const stakeholderRef = useRef<HTMLElement>(null)
  const traditionRef = useRef<HTMLElement>(null)
  const statsRef = useRef<HTMLElement>(null)
  const statCountersRef = useRef<HTMLSpanElement[]>([])
  const testimonialRef = useRef<HTMLElement>(null)
  const waitlistRef = useRef<HTMLElement>(null)
  const logoStripRef = useRef<HTMLDivElement>(null)
  const gsapLoaded = useRef(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (gsapLoaded.current) return
    gsapLoaded.current = true

    const loadGSAP = () => new Promise<void>((resolve) => {
      if (window.gsap) { resolve(); return }
      const s1 = document.createElement('script')
      s1.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js'
      s1.onload = () => {
        const s2 = document.createElement('script')
        s2.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js'
        s2.onload = () => resolve()
        document.head.appendChild(s2)
      }
      document.head.appendChild(s1)
    })

    loadGSAP().then(() => {
      const { gsap, ScrollTrigger } = window
      gsap.registerPlugin(ScrollTrigger)

      gsap.timeline({ delay: 0.2 })
        .fromTo(heroHeadlineRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: 'power4.out' })
        .fromTo(heroSubRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, '-=0.7')
        .fromTo(heroCTARef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' }, '-=0.5')
        .fromTo(heroScrollRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.3')

      if (heroRef.current) {
        gsap.to(heroRef.current.querySelector('.hero-bg'), {
          yPercent: 30, ease: 'none',
          scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
        })
      }

      if (logoStripRef.current) {
        gsap.to(logoStripRef.current.querySelector('.strip-inner'), { x: '-50%', ease: 'none', duration: 15, repeat: -1 })
      }

      if (problemRef.current) {
        gsap.fromTo(problemRef.current.querySelectorAll('.problem-reveal'),
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.15, scrollTrigger: { trigger: problemRef.current, start: 'top 75%' } }
        )
      }

      if (featuresRef.current) {
        gsap.fromTo(featuresRef.current.querySelectorAll('.feature-card'),
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.1, scrollTrigger: { trigger: featuresRef.current, start: 'top 70%' } }
        )
      }

      if (commandRef.current) {
        gsap.fromTo(commandRef.current.querySelectorAll('.command-reveal'),
          { x: -60, opacity: 0 },
          { x: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.15, scrollTrigger: { trigger: commandRef.current, start: 'top 70%' } }
        )
        gsap.fromTo(commandRef.current.querySelector('.command-visual'),
          { x: 60, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 1, ease: 'power3.out',
            clearProps: 'transform',
            scrollTrigger: { trigger: commandRef.current, start: 'top 70%' },
          }
        )
      }

      if (stakeholderRef.current) {
        gsap.fromTo(stakeholderRef.current.querySelectorAll('.stakeholder-card'),
          { y: 40, opacity: 0, scale: 0.96 },
          { y: 0, opacity: 1, scale: 1, duration: 0.75, ease: 'power3.out', stagger: 0.08, scrollTrigger: { trigger: stakeholderRef.current, start: 'top 70%' } }
        )
      }

      if (statsRef.current) {
        ScrollTrigger.create({
          trigger: statsRef.current, start: 'top 75%', once: true,
          onEnter: () => {
            stats.forEach((stat, i) => {
              const el = statCountersRef.current[i]
              if (!el) return
              gsap.fromTo({ val: 0 }, {
                val: stat.value, duration: 1.8, ease: 'power2.out',
                onUpdate: function () { el.textContent = Math.round(this.targets()[0].val).toString() },
              })
            })
          },
        })
        gsap.fromTo(statsRef.current.querySelectorAll('.stat-item'),
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.12, scrollTrigger: { trigger: statsRef.current, start: 'top 75%' } }
        )
      }

      if (traditionRef.current) {
        gsap.fromTo(traditionRef.current.querySelectorAll('.tradition-reveal'),
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.1, scrollTrigger: { trigger: traditionRef.current, start: 'top 75%' } }
        )
      }

      if (testimonialRef.current) {
        gsap.fromTo(testimonialRef.current.querySelector('.testimonial-card'),
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: testimonialRef.current, start: 'top 75%' } }
        )
      }

      if (waitlistRef.current) {
        gsap.fromTo(waitlistRef.current.querySelectorAll('.waitlist-reveal'),
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.15, scrollTrigger: { trigger: waitlistRef.current, start: 'top 75%' } }
        )
      }

      document.querySelectorAll('.section-heading').forEach((el) => {
        gsap.fromTo(el, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 80%' } })
      })

      if (heroScrollRef.current) {
        gsap.to(heroScrollRef.current.querySelector('.scroll-arrow'), { y: 8, repeat: -1, yoyo: true, duration: 0.9, ease: 'sine.inOut' })
      }
    })
  }, [])

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial((p) => (p + 1) % testimonials.length), 6000)
    return () => clearInterval(t)
  }, [])

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
    window.gsap?.fromTo('.waitlist-success', { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' })
  }

  const scrollTo = (id: string) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // ── Pull current mode tokens ─────────────────────────────────
  const T = darkMode ? THEME.dark : THEME.light

  const pageBg = T.bg
  const surfaceBg = T.surface
  const borderSubtle = T.borderSubtle
  const borderBrown = T.borderBrown
  const textPrimary = T.textPrimary
  const textSecondary = T.textSecondary
  const textMuted = T.textMuted
  const accentText = T.accentText

  const navBg = scrolled
    ? `${T.navBgScrolled}`
    : 'transparent'

  return (
    <>
      <noscript>
        <style>{`.gsap-hidden{opacity:1!important;transform:none!important}.hero-bg{transform:none!important}`}</style>
      </noscript>

      <div
        className="min-h-screen font-sans antialiased overflow-x-hidden transition-colors duration-500"
        style={{ backgroundColor: pageBg, color: textPrimary }}
      >

        {/* ════════════════════════════════════════════════════
            COMPONENT: <Navbar />
        ════════════════════════════════════════════════════ */}
        <nav
          ref={navRef}
          className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
          style={{
            backgroundColor: navBg,
            backdropFilter: scrolled ? 'blur(20px)' : 'none',
            borderBottom: scrolled ? `1px solid ${borderSubtle}` : 'none',
            boxShadow: scrolled ? (darkMode ? '0 4px 30px rgba(0,0,0,0.35)' : '0 4px 20px rgba(0,0,0,0.06)') : 'none',
          }}
          role="navigation"
          aria-label="Main navigation"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">

            <button
              onClick={() => scrollTo('hero')}
              className="flex items-center gap-2.5 group focus:outline-none rounded-sm"
              style={{ outline: 'none' }}
              aria-label="Vow — go to homepage"
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                style={{ background: btnPrimary.bg, boxShadow: btnPrimary.shadow, color: btnPrimary.color }}
              >
                <IconRings />
              </div>
              <span className="font-semibold tracking-tight text-lg" style={{ color: textPrimary }}>Vow</span>
            </button>

            <div className="hidden md:flex items-center gap-8" role="list">
              {[
                { label: 'Features', id: 'features' },
                { label: 'Live Mode', id: 'command-centre' },
                { label: 'Stakeholders', id: 'stakeholders' },
                { label: 'Traditions', id: 'traditions' },
              ].map((item) => (
                <button key={item.id} onClick={() => scrollTo(item.id)} role="listitem"
                  className="text-sm font-medium transition-colors duration-200 focus:outline-none"
                  style={{ color: textMuted }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = accentText)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = textMuted)}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none"
                style={{ backgroundColor: surfaceBg, border: `1px solid ${borderBrown}`, color: textMuted }}
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                aria-pressed={darkMode}
              >
                {darkMode ? <IconSun /> : <IconMoon />}
              </button>

              <button
                onClick={() => scrollTo('waitlist')}
                className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold hover:scale-[1.03] transition-all duration-300 focus:outline-none"
                style={{ background: btnPrimary.bg, boxShadow: btnPrimary.shadow, color: btnPrimary.color }}
              >
                Get started
              </button>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 rounded-lg focus:outline-none"
                style={{ backgroundColor: surfaceBg, border: `1px solid ${borderBrown}` }}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
              >
                <div className="w-5 h-5 flex flex-col justify-center gap-1.5">
                  {['', '', ''].map((_, i) => (
                    <span key={i}
                      className="block h-0.5 rounded-full transition-all duration-300"
                      style={{
                        backgroundColor: accentText,
                        transform: i === 0 && menuOpen ? 'rotate(45deg) translateY(8px)' : i === 2 && menuOpen ? 'rotate(-45deg) translateY(-8px)' : 'none',
                        opacity: i === 1 && menuOpen ? 0 : 1,
                      }}
                    />
                  ))}
                </div>
              </button>
            </div>
          </div>

          {/* Mobile drawer */}
          <div
            className="md:hidden overflow-hidden transition-all duration-400"
            style={{
              maxHeight: menuOpen ? '320px' : '0',
              opacity: menuOpen ? 1 : 0,
              backgroundColor: T.mobileDrawerBg,
              backdropFilter: 'blur(20px)',
              borderBottom: `1px solid ${borderBrown}`,
            }}
            aria-hidden={!menuOpen}
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {[
                { label: 'Features', id: 'features' },
                { label: 'Live Mode', id: 'command-centre' },
                { label: 'Stakeholders', id: 'stakeholders' },
                { label: 'Traditions', id: 'traditions' },
              ].map((item) => (
                <button key={item.id} onClick={() => scrollTo(item.id)}
                  tabIndex={menuOpen ? 0 : -1}
                  className="text-left text-base font-medium py-1 transition-colors focus:outline-none"
                  style={{ color: textSecondary }}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => scrollTo('waitlist')}
                tabIndex={menuOpen ? 0 : -1}
                className="mt-2 w-full py-3 rounded-xl font-semibold focus:outline-none"
                style={{ background: btnPrimary.bg, color: btnPrimary.color }}
              >
                Get started
              </button>
            </div>
          </div>
        </nav>
        {/* ════ END <Navbar /> ════ */}


        {/* ════════════════════════════════════════════════════
            COMPONENT: <HeroSection />
        ════════════════════════════════════════════════════ */}
        <section
          id="hero"
          ref={heroRef}
          className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16"
          aria-label="Hero — Plan the day. Run the day."
        >
          <div className="hero-bg absolute inset-0 pointer-events-none select-none" aria-hidden="true">
            {/* Base gradient — from THEME */}
            <div className="absolute inset-0" style={{ background: T.heroBg }} />
            {/* Warm glow — from THEME */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-3xl"
              style={{ background: T.heroGlow }} />
            <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[400px] rounded-full blur-3xl"
              style={{ background: 'radial-gradient(ellipse, rgba(176,100,90,0.05) 0%, transparent 70%)' }} />
            {/* Subtle grid — from THEME */}
            <div className="absolute inset-0" style={{
              opacity: darkMode ? 0.025 : 0.04,
              backgroundImage: `linear-gradient(${T.heroGrid} 1px, transparent 1px), linear-gradient(90deg, ${T.heroGrid} 1px, transparent 1px)`,
              backgroundSize: '80px 80px',
            }} />
            {/* Vignette — from THEME */}
            <div className="absolute inset-0" style={{ background: T.heroVignette }} />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase mb-8 backdrop-blur-sm"
              style={{ border: `1px solid rgba(139,107,71,0.35)`, background: `rgba(139,107,71,0.08)`, color: accentText }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: accentText }} aria-hidden="true" />
              Wedding Operating System
            </div>

            <h1 ref={heroHeadlineRef} className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.92] mb-8">
              <span className="block" style={{ color: textPrimary }}>Plan the day.</span>
              <span
                className="block bg-clip-text text-transparent"
                style={{ backgroundImage: `linear-gradient(90deg, ${BROWN_PRIMARY} 0%, ${BROWN_LIGHT} 40%, ${BROWN_PALE} 70%, #D4AA6E 100%)` }}
              >
                Run the day.
              </span>
            </h1>

            <p
              ref={heroSubRef}
              className="text-lg md:text-xl lg:text-2xl max-w-2xl mx-auto leading-relaxed mb-10"
              style={{ color: textSecondary }}
            >
              Vow unifies every fragment of your wedding — guests, vendors, ceremonies, logistics — into one intelligent system that guides you from first decision to last dance.
            </p>

            <div ref={heroCTARef} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => scrollTo('waitlist')}
                className="group flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-base hover:scale-[1.04] transition-all duration-300 focus:outline-none"
                style={{ background: btnPrimary.bg, boxShadow: btnPrimary.shadow, color: btnPrimary.color }}
              >
                Join the Waitlist
                <span className="group-hover:translate-x-1 transition-transform duration-200"><IconArrow /></span>
              </button>
              <button
                onClick={() => scrollTo('features')}
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-base hover:scale-[1.03] transition-all duration-300 focus:outline-none"
                style={{ backgroundColor: surfaceBg, border: `1px solid ${borderBrown}`, color: textSecondary }}
              >
                Explore Features
              </button>
            </div>

            <p className="mt-8 text-sm" style={{ color: textMuted }}>
              Built for single-day, multi-day, destination &amp; multicultural weddings
            </p>
          </div>

          <div ref={heroScrollRef} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" aria-hidden="true" style={{ color: textMuted }}>
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <span className="scroll-arrow"><IconChevronDown /></span>
          </div>

          <noscript><style>{`.gsap-hidden{opacity:1!important;transform:none!important}`}</style></noscript>
        </section>
        {/* ════ END <HeroSection /> ════ */}


        {/* ════════════════════════════════════════════════════
            COMPONENT: <LogoStrip />
        ════════════════════════════════════════════════════ */}
        <section
          aria-label="Supported wedding formats"
          className="py-10 overflow-hidden"
          style={{ borderTop: `1px solid ${borderBrown}`, borderBottom: `1px solid ${borderBrown}` }}
        >
          <div ref={logoStripRef} className="relative overflow-hidden">
            <div className="strip-inner flex items-center gap-16 whitespace-nowrap" aria-hidden="true">
              {[
                'Single-Day Weddings', 'Multi-Day Celebrations', 'Destination Weddings',
                'Hindu Ceremonies', 'Christian Ceremonies', 'Muslim Nikkah & Walima',
                'Civil Ceremonies', 'Blended-Faith Programs', 'Multi-Venue Events',
                'Single-Day Weddings', 'Multi-Day Celebrations', 'Destination Weddings',
                'Hindu Ceremonies', 'Christian Ceremonies', 'Muslim Nikkah & Walima',
                'Civil Ceremonies', 'Blended-Faith Programs', 'Multi-Venue Events',
              ].map((item, i) => (
                <span key={i} className="text-sm font-medium tracking-wide flex items-center gap-3" style={{ color: textMuted }}>
                  <span className="w-1 h-1 rounded-full inline-block" style={{ background: accentText, opacity: 0.6 }} />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>
        {/* ════ END <LogoStrip /> ════ */}


        {/* ════════════════════════════════════════════════════
            COMPONENT: <ProblemSection />
        ════════════════════════════════════════════════════ */}
        <section id="about" ref={problemRef} className="py-28 md:py-36 max-w-7xl mx-auto px-6 lg:px-10" aria-label="Product philosophy">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div>
              <p className="problem-reveal text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: accentText }}>
                Not just a planner
              </p>
              <h2 className="problem-reveal section-heading text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-6" style={{ color: textPrimary }}>
                A command centre for your entire wedding.
              </h2>
              <p className="problem-reveal text-lg leading-relaxed mb-6" style={{ color: textSecondary }}>
                Most wedding apps help you build lists. Vow helps you <em>run</em> a wedding. It's the only platform that bridges meticulous pre-event planning and real-time day-of orchestration in a single system.
              </p>
              <p className="problem-reveal text-base leading-relaxed" style={{ color: textMuted }}>
                Whether you're managing a single-day ceremony or a five-day multicultural celebration across multiple venues, every stakeholder — couple, coordinator, family leads, vendors, guests — works from one source of truth.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {[
                { label: 'Planning fragmentation', before: 'Spreadsheets, PDFs, WhatsApp threads, vendor emails', after: 'One structured system covering every domain', accentColor: BROWN_PRIMARY },
                { label: 'Day-of control', before: 'Reactive crisis management with no oversight', after: 'Live run sheets, incident logging, recovery playbooks', accentColor: '#AA5A50' },
                { label: 'Cultural flexibility', before: "Rigid templates that don't fit your tradition", after: 'Modular ceremony blocks for any culture or blend', accentColor: '#4A8A80' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="problem-reveal p-5 rounded-xl"
                  style={{
                    backgroundColor: surfaceBg,
                    borderTopWidth: '1px', borderRightWidth: '1px', borderBottomWidth: '1px', borderLeftWidth: '2px',
                    borderStyle: 'solid',
                    borderTopColor: borderSubtle, borderRightColor: borderSubtle, borderBottomColor: borderSubtle,
                    borderLeftColor: item.accentColor,
                  }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: textMuted }}>{item.label}</p>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
                    <span className="text-sm flex-1 line-through" style={{ color: textMuted }}>{item.before}</span>
                    <span className="text-xs font-bold shrink-0" style={{ color: accentText }}>→</span>
                    <span className="text-sm font-medium flex-1" style={{ color: textPrimary }}>{item.after}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* ════ END <ProblemSection /> ════ */}


        {/* ════════════════════════════════════════════════════
            COMPONENT: <FeaturesGrid />
        ════════════════════════════════════════════════════ */}
        <section
          id="features"
          ref={featuresRef}
          className="py-28 md:py-36"
          style={{ borderTop: `1px solid ${borderBrown}` }}
          aria-label="Platform features"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="max-w-2xl mb-16">
              <p className="section-heading text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: accentText }}>
                Built for real wedding complexity
              </p>
              <h2 className="section-heading text-4xl md:text-5xl font-bold tracking-tight leading-tight" style={{ color: textPrimary }}>
                Every corner of your wedding, covered.
              </h2>
              <p className="section-heading mt-4 text-lg" style={{ color: textMuted }}>
                From guest households to ceremony scripts to live incident recovery — modelled, structured, and connected.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5" role="list">
              {features.map((f) => {
                const accent = darkMode ? f.accentDark : f.accentLight
                const border = darkMode ? f.borderDark : f.borderLight
                const iconStyle = darkMode ? f.iconDark : f.iconLight
                return (
                  <article
                    key={f.id}
                    id={`feature-${f.id}`}
                    className="feature-card group p-6 rounded-2xl hover:scale-[1.02] hover:shadow-2xl transition-all duration-400 cursor-default"
                    style={{ background: accent, border: `1px solid ${border}` }}
                    role="listitem"
                    aria-label={f.title}
                  >
                    <div
                      className="inline-flex items-center justify-center w-11 h-11 rounded-xl mb-5"
                      style={{ backgroundColor: iconStyle.bg, color: iconStyle.color }}
                      aria-hidden="true"
                    >
                      {f.icon}
                    </div>
                    <span className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: textMuted }}>{f.label}</span>
                    <h3 className="text-lg font-semibold mb-3 tracking-tight" style={{ color: textPrimary }}>{f.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: textMuted }}>{f.description}</p>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
        {/* ════ END <FeaturesGrid /> ════ */}


        {/* ════════════════════════════════════════════════════
            COMPONENT: <StatsSection />
        ════════════════════════════════════════════════════ */}
        <section
          id="stats"
          ref={statsRef}
          className="py-20"
          style={{ borderTop: `1px solid ${borderBrown}` }}
          aria-label="Platform statistics"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
              {stats.map((stat, i) => (
                <div key={stat.id} id={`stat-${stat.id}`} className="stat-item text-center">
                  <div
                    className="text-5xl md:text-6xl font-bold tracking-tighter mb-2 bg-clip-text text-transparent"
                    style={{ backgroundImage: `linear-gradient(135deg, ${BROWN_PRIMARY}, ${BROWN_PALE})` }}
                  >
                    <span ref={(el) => { if (el) statCountersRef.current[i] = el }} aria-label={`${stat.value}${stat.suffix}`}>0</span>
                    <span aria-hidden="true">{stat.suffix}</span>
                  </div>
                  <p className="text-sm font-medium" style={{ color: textMuted }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* ════ END <StatsSection /> ════ */}


        {/* ════════════════════════════════════════════════════
            COMPONENT: <CommandCentre />
        ════════════════════════════════════════════════════ */}
        <section
          id="command-centre"
          ref={commandRef}
          className="py-28 md:py-36"
          style={{ borderTop: `1px solid ${borderBrown}` }}
          aria-label="Day-of command centre"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

              <div>
                <p className="command-reveal text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: accentText }}>
                  Day-of Live Mode
                </p>
                <h2 className="command-reveal section-heading text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-6" style={{ color: textPrimary }}>
                  The wedding day command centre.
                </h2>
                <p className="command-reveal text-lg leading-relaxed mb-8" style={{ color: textSecondary }}>
                  When the day arrives, Vow transforms into a live operations console. Coordinators get role-specific run sheets, real-time vendor check-in, incident logging, and recovery playbooks — all in one place.
                </p>

                <ul className="space-y-4" role="list" aria-label="Live mode features">
                  {[
                    { label: 'Role-based run sheets', desc: 'Every stakeholder sees only what they need to act on.' },
                    { label: 'Real-time vendor check-in', desc: 'Track arrivals, setup windows, and readiness at a glance.' },
                    { label: 'Incident logging & escalation', desc: 'Log issues with severity, owner, and resolution target instantly.' },
                    { label: 'Couple quiet mode', desc: 'Shield the couple from noise. Surface only what truly matters.' },
                  ].map((item) => (
                    <li key={item.label} className="command-reveal flex items-start gap-3" role="listitem">
                      <span
                        className="mt-1 w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: 'rgba(139,107,71,0.15)', border: `1px solid rgba(139,107,71,0.35)` }}
                        aria-hidden="true"
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: accentText }} />
                      </span>
                      <div>
                        <p className="font-semibold text-sm mb-0.5" style={{ color: textPrimary }}>{item.label}</p>
                        <p className="text-sm" style={{ color: textMuted }}>{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Live mode mock card — themed per mode via THEME tokens */}
              <div className="command-visual w-full max-w-lg mx-auto lg:max-w-none lg:mx-0 lg:w-auto" aria-hidden="true">
                {darkMode ? (
                  <div
                    className="relative rounded-2xl overflow-hidden p-6"
                    style={{
                      backgroundColor: T.cmdBg,
                      border: `1px solid ${T.cmdBorder}`,
                      boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(160,120,72,0.08)',
                    }}
                  >
                    <div className="flex items-center justify-between mb-1 pb-4" style={{ borderBottom: `1px solid ${T.cmdHeaderBorder}` }}>
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: BROWN_PALE }} />
                        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: BROWN_PALE }}>Live Mode Active</span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs" style={{ color: T.textMuted }}>14:32 · Day 2 of 3</p>
                        <p className="text-xs font-medium" style={{ color: BROWN_PALE }}>Wedding Ceremony · 15 June</p>
                      </div>
                    </div>
                    <div className="space-y-2 my-4">
                      {cmdRows.map((row) => <CmdRowDark key={row.time} row={row} />)}
                    </div>
                    <CmdVendorDark />
                  </div>
                ) : (
                  <div
                    className="relative rounded-2xl overflow-hidden p-6"
                    style={{
                      backgroundColor: T.cmdBg,
                      border: `1px solid ${T.cmdBorder}`,
                      boxShadow: '0 12px 40px rgba(139,107,71,0.12), 0 2px 8px rgba(0,0,0,0.06)',
                    }}
                  >
                    <div className="flex items-center justify-between mb-1 pb-4" style={{ borderBottom: `1px solid ${T.cmdHeaderBorder}` }}>
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: BROWN_PRIMARY }} />
                        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: BROWN_PRIMARY }}>Live Mode Active</span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs" style={{ color: '#9A8070' }}>14:32 · Day 2 of 3</p>
                        <p className="text-xs font-medium" style={{ color: BROWN_DARK }}>Wedding Ceremony · 15 June</p>
                      </div>
                    </div>
                    <div className="space-y-2 my-4">
                      {cmdRows.map((row) => <CmdRowLight key={row.time} row={row} />)}
                    </div>
                    <CmdVendorLight />
                  </div>
                )}
              </div>

            </div>
          </div>
        </section>
        {/* ════ END <CommandCentre /> ════ */}


        {/* ════════════════════════════════════════════════════
            COMPONENT: <StakeholderSection />
        ════════════════════════════════════════════════════ */}
        <section
          id="stakeholders"
          ref={stakeholderRef}
          className="py-28 md:py-36"
          style={{ borderTop: `1px solid ${borderBrown}` }}
          aria-label="One platform, every stakeholder"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="max-w-2xl mb-16">
              <p className="section-heading text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: accentText }}>
                Every stakeholder
              </p>
              <h2 className="section-heading text-4xl md:text-5xl font-bold tracking-tight leading-tight" style={{ color: textPrimary }}>
                One platform. Every role. Zero confusion.
              </h2>
              <p className="section-heading mt-4 text-lg" style={{ color: textMuted }}>
                Vow gives every person in your wedding a role-appropriate experience — from couple to coordinator, family lead to vendor.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5" role="list">
              {stakeholders.map((s) => {
                const bg = darkMode ? s.darkBg : s.lightBg
                const border = darkMode ? s.darkBorder : s.lightBorder
                const dot = darkMode ? s.darkDot : s.lightDot
                const label = darkMode ? s.darkLabel : s.lightLabel
                return (
                  <article
                    key={s.id}
                    id={`stakeholder-${s.id}`}
                    className="stakeholder-card p-6 rounded-2xl hover:scale-[1.02] transition-all duration-300"
                    style={{ backgroundColor: bg, borderWidth: '1px', borderStyle: 'solid', borderColor: border }}
                    role="listitem"
                    aria-label={`${s.role} — ${s.tagline}`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: dot }} aria-hidden="true" />
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: label }}>{s.role}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 tracking-tight" style={{ color: textPrimary }}>{s.tagline}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: textMuted }}>{s.description}</p>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
        {/* ════ END <StakeholderSection /> ════ */}


        {/* ════════════════════════════════════════════════════
            COMPONENT: <TraditionSection />
        ════════════════════════════════════════════════════ */}
        <section
          id="traditions"
          ref={traditionRef}
          className="py-28 md:py-36"
          style={{ borderTop: `1px solid ${borderBrown}` }}
          aria-label="Cultural tradition modules"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="grid lg:grid-cols-2 gap-16 items-start">

              <div>
                <p className="tradition-reveal text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: accentText }}>
                  Culture is modular
                </p>
                <h2 className="tradition-reveal section-heading text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-6" style={{ color: textPrimary }}>
                  Every tradition, honoured precisely.
                </h2>
                <p className="tradition-reveal text-lg leading-relaxed mb-8" style={{ color: textSecondary }}>
                  Ceremony modules adapt to your tradition — not the other way around. Mix, blend, and configure without constraint.
                </p>

                {/* Tradition tabs */}
                <div
                  className="tradition-reveal flex flex-wrap gap-2 mb-6"
                  role="tablist"
                  aria-label="Select wedding tradition"
                >
                  {traditions.map((t, i) => {
                    const isActive = activeTradition === i
                    const activeBg = darkMode ? t.activeTabBg : t.lightActiveTabBg
                    const activeBorder = darkMode ? t.activeTabBorder : t.lightActiveTabBorder
                    const activeText = darkMode ? t.activeTabText : t.lightActiveTabText
                    return (
                      <button
                        key={t.id}
                        onClick={() => {
                          setActiveTradition(i)
                          window.gsap?.fromTo('.tradition-events', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' })
                        }}
                        role="tab"
                        aria-selected={isActive}
                        aria-controls={`tradition-panel-${t.id}`}
                        className="whitespace-nowrap text-sm font-medium transition-all duration-200 focus:outline-none"
                        style={{
                          padding: '6px 14px',
                          borderRadius: '9999px',
                          ...(isActive
                            ? { backgroundColor: activeBg, borderWidth: '1px', borderStyle: 'solid', borderColor: activeBorder, color: activeText, fontWeight: 600 }
                            : { backgroundColor: surfaceBg, borderWidth: '1px', borderStyle: 'solid', borderColor: borderSubtle, color: textMuted }
                          )
                        }}
                        onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.borderColor = darkMode ? t.activeTabBorder : t.lightActiveTabBorder }}
                        onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.borderColor = borderSubtle }}
                      >
                        {t.label}
                      </button>
                    )
                  })}
                </div>

                {/* Active tradition event tags */}
                {traditions.map((t, i) => {
                  if (i !== activeTradition) return null
                  const tagBg = darkMode ? t.tagBg : t.lightTagBg
                  const tagBorder = darkMode ? t.tagBorder : t.lightTagBorder
                  const tagText = darkMode ? t.tagText : t.lightTagText
                  return (
                    <div
                      key={t.id}
                      id={`tradition-panel-${t.id}`}
                      className="tradition-events"
                      role="tabpanel"
                      aria-label={`${t.label} sub-events`}
                    >
                      <div className="flex flex-wrap gap-2">
                        {t.events.map((ev) => (
                          <span
                            key={ev}
                            className="px-4 py-2 rounded-full text-sm font-medium"
                            style={{ backgroundColor: tagBg, border: `1px solid ${tagBorder}`, color: tagText }}
                          >
                            {ev}
                          </span>
                        ))}
                      </div>
                      <p className="mt-5 text-sm" style={{ color: textMuted }}>
                        Add, remove, rename, or reorder any sub-event. Vow never forces a structure you don't need.
                      </p>
                    </div>
                  )
                })}
              </div>

              {/* Right: feature callout cards */}
              <div className="space-y-4 tradition-reveal">
                {[
                  { title: 'Faith-agnostic by design', desc: 'No single tradition is hardcoded. Select one or many cultural modules during programme setup.' },
                  { title: 'Ritual item tracking', desc: 'Every ceremony element — items, witnesses, officiants, readings, music cues — is tracked and assigned.' },
                  { title: 'Multi-stream support', desc: 'Running a Nikah and a Church ceremony in the same programme? Separate ritual streams, one system.' },
                  { title: 'Guest scoping per event', desc: 'Different guest sets for mehendi vs reception. Invitations, RSVPs, and seating stay separate.' },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="p-5 rounded-xl transition-colors duration-300"
                    style={{ backgroundColor: surfaceBg, border: `1px solid ${borderSubtle}` }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = borderBrown)}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = borderSubtle)}
                  >
                    <h4 className="font-semibold mb-1.5 text-sm" style={{ color: textPrimary }}>{item.title}</h4>
                    <p className="text-sm" style={{ color: textMuted }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        {/* ════ END <TraditionSection /> ════ */}


        {/* ════════════════════════════════════════════════════
            COMPONENT: <TestimonialSection />
        ════════════════════════════════════════════════════ */}
        <section
          id="testimonials"
          ref={testimonialRef}
          className="py-28 md:py-36"
          style={{ borderTop: `1px solid ${borderBrown}` }}
          aria-label="Testimonials"
        >
          <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center">
            <p className="section-heading text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: accentText }}>
              Trusted by couples &amp; planners
            </p>
            <h2 className="section-heading text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-16" style={{ color: textPrimary }}>
              What people are saying.
            </h2>

            <div className="testimonial-card relative">
              {testimonials.map((t, i) => (
                <blockquote
                  key={t.id}
                  id={`testimonial-${t.id}`}
                  className={`transition-all duration-500 ${i === activeTestimonial ? 'opacity-100 block' : 'opacity-0 hidden'}`}
                  aria-hidden={i !== activeTestimonial}
                >
                  <div
                    className="p-8 md:p-12 rounded-2xl mb-6"
                    style={{ backgroundColor: surfaceBg, border: `1px solid ${borderBrown}` }}
                  >
                    <p className="text-xl md:text-2xl leading-relaxed font-medium italic mb-8" style={{ color: textSecondary }}>"{t.quote}"</p>
                    <div className="flex items-center justify-center gap-4">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{ backgroundColor: t.avatarBg, color: t.avatarColor }}
                        aria-hidden="true"
                      >
                        {t.initials}
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-sm" style={{ color: textPrimary }}>{t.name}</p>
                        <p className="text-xs" style={{ color: textMuted }}>{t.detail}</p>
                      </div>
                    </div>
                  </div>
                </blockquote>
              ))}

              <div className="flex items-center justify-center gap-2.5 mt-4" role="tablist" aria-label="Testimonial navigation">
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
                      : { width: '8px', height: '8px', backgroundColor: surfaceBg, border: `1px solid ${borderBrown}` }
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
        {/* ════ END <TestimonialSection /> ════ */}


        {/* ════════════════════════════════════════════════════
            COMPONENT: <WaitlistSection />
        ════════════════════════════════════════════════════ */}
        <section
          id="waitlist"
          ref={waitlistRef}
          className="py-28 md:py-36 relative overflow-hidden"
          style={{ borderTop: `1px solid ${borderBrown}` }}
          aria-label="Join the waitlist"
        >
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full blur-3xl"
              style={{ background: 'radial-gradient(ellipse, rgba(139,107,71,0.08) 0%, transparent 70%)' }}
            />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
            <p className="waitlist-reveal text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: accentText }}>
              Early access
            </p>
            <h2 className="waitlist-reveal section-heading text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-6" style={{ color: textPrimary }}>
              Your wedding deserves a proper operating system.
            </h2>
            <p className="waitlist-reveal text-lg leading-relaxed mb-10" style={{ color: textSecondary }}>
              Join the waitlist and be among the first couples to plan, coordinate, and run the most important day of your lives — with complete confidence.
            </p>

            {!submitted ? (
              <form
                onSubmit={handleWaitlistSubmit}
                className="waitlist-reveal flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                aria-label="Waitlist signup form"
                noValidate
              >
                <label htmlFor="waitlist-email" className="sr-only">Email address</label>
                <input
                  id="waitlist-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  autoComplete="email"
                  className="flex-1 px-5 py-3.5 rounded-xl text-sm focus:outline-none transition-all duration-200"
                  style={{ backgroundColor: surfaceBg, border: `1px solid ${borderBrown}`, color: textPrimary }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = BROWN_PRIMARY)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = borderBrown)}
                />
                <button
                  type="submit"
                  className="px-7 py-3.5 rounded-xl font-semibold text-sm hover:scale-[1.04] transition-all duration-300 focus:outline-none whitespace-nowrap"
                  style={{ background: btnPrimary.bg, boxShadow: btnPrimary.shadow, color: btnPrimary.color }}
                >
                  Join Waitlist
                </button>
              </form>
            ) : (
              <div
                className="waitlist-success inline-flex items-center gap-3 px-7 py-4 rounded-xl font-semibold text-base"
                style={{ background: 'rgba(90,140,130,0.12)', border: '1px solid rgba(90,140,130,0.30)', color: '#5AADA0' }}
                role="status"
                aria-live="polite"
              >
                <span className="text-xl" aria-hidden="true">✓</span>
                You're on the list. We'll be in touch.
              </div>
            )}

            <p className="waitlist-reveal mt-5 text-xs" style={{ color: textMuted }}>
              No spam. No commitment. Unsubscribe anytime.
            </p>
          </div>
        </section>
        {/* ════ END <WaitlistSection /> ════ */}


        {/* ════════════════════════════════════════════════════
            COMPONENT: <Footer />
        ════════════════════════════════════════════════════ */}
        <footer
          className="py-12"
          style={{ borderTop: `1px solid ${borderBrown}` }}
          role="contentinfo"
          aria-label="Site footer"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: btnPrimary.bg, color: btnPrimary.color }}
                  aria-hidden="true"
                >
                  <IconRings />
                </div>
                <span className="font-semibold tracking-tight" style={{ color: textPrimary }}>Vow</span>
                <span className="text-xs ml-2" style={{ color: textMuted }}>Wedding Operating System</span>
              </div>

              <nav aria-label="Footer navigation">
                <ul className="flex flex-wrap items-center gap-6 justify-center">
                  {[
                    { label: 'Features', id: 'features' },
                    { label: 'Live Mode', id: 'command-centre' },
                    { label: 'Stakeholders', id: 'stakeholders' },
                    { label: 'Traditions', id: 'traditions' },
                    { label: 'Join Waitlist', id: 'waitlist' },
                  ].map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => scrollTo(item.id)}
                        className="text-sm transition-colors duration-200 focus:outline-none"
                        style={{ color: textMuted }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = accentText)}
                        onMouseLeave={(e) => (e.currentTarget.style.color = textMuted)}
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>

              <p className="text-xs" style={{ color: textMuted }}>© {new Date().getFullYear()} Vow. All rights reserved.</p>
            </div>
          </div>
        </footer>
        {/* ════ END <Footer /> ════ */}

      </div>
    </>
  )
}

// ─── COMMAND CENTRE SUB-COMPONENTS ───────────────────────────

const cmdRows = [
  { time: '14:00', label: 'Bridal party entrance', sub: 'Usher Team · Garden entrance', status: 'done' },
  { time: '14:15', label: 'Ceremony begins', sub: 'Officiant · String quartet cue', status: 'live' },
  { time: '14:45', label: 'Vows exchange', sub: 'Ceremony stage · 18 min est.', status: 'next' },
  { time: '15:20', label: 'Photography session', sub: 'Photographer — 8 min delayed', status: 'alert' },
  { time: '16:00', label: 'Cocktail hour opens', sub: 'Terrace · Catering team ready', status: 'confirmed' },
]

const CmdRowDark = ({ row }: { row: typeof cmdRows[0] }) => {
  const { time, label, sub, status } = row
  const isDone = status === 'done', isLive = status === 'live', isAlert = status === 'alert', isConfirmed = status === 'confirmed'
  const timeColor = isLive ? BROWN_PALE : isDone ? '#5A4A38' : status === 'next' ? BROWN_PALE : isAlert ? '#E8867A' : '#7A9E8A'
  const rowBg = isLive ? 'rgba(196,168,130,0.10)' : isAlert ? 'rgba(232,134,122,0.08)' : '#272320'
  const rowBorder = isLive ? 'rgba(196,168,130,0.30)' : isAlert ? 'rgba(232,134,122,0.22)' : '#38302A'
  const badge = isLive
    ? <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(196,168,130,0.20)', color: BROWN_PALE, border: `1px solid rgba(196,168,130,0.40)` }}>● LIVE</span>
    : isDone
      ? <span style={{ color: '#5A9E8A', fontSize: '16px' }}>✓</span>
      : status === 'next'
        ? <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(139,107,71,0.15)', color: BROWN_PALE, border: `1px solid rgba(139,107,71,0.30)` }}>Upcoming</span>
        : isAlert
          ? <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(232,134,122,0.20)', color: '#E8867A', border: `1px solid rgba(232,134,122,0.40)` }}>Alert</span>
          : <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(90,158,138,0.18)', color: '#7A9E8A', border: `1px solid rgba(90,158,138,0.35)` }}>Confirmed</span>
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: rowBg, border: `1px solid ${rowBorder}`, opacity: isDone ? 0.45 : 1 }}>
      <span className="text-xs font-mono w-10 shrink-0 font-semibold" style={{ color: timeColor }}>{time}</span>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: timeColor }} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium" style={{ color: isDone ? '#6B5A48' : '#F2EDE6' }}>{label}</p>
        <p className="text-xs truncate" style={{ color: '#8A7E74' }}>{sub}</p>
      </div>
      <div className="shrink-0">{badge}</div>
    </div>
  )
}

const CmdVendorDark = () => (
  <div className="p-4 rounded-xl mt-1" style={{ backgroundColor: '#2F2B28', border: '1px solid #38302A' }}>
    <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: BROWN_PALE }}>Vendor Check-in</p>
    <div className="flex flex-wrap gap-2">
      {[
        { name: 'Photographer', checked: true }, { name: 'Caterer', checked: true },
        { name: 'Florist', checked: true }, { name: 'DJ', checked: false }, { name: 'Transport', checked: true },
      ].map((v) => (
        <span key={v.name} className="text-xs px-2.5 py-1.5 rounded-full font-semibold"
          style={v.checked
            ? { background: 'rgba(90,158,138,0.18)', color: '#7A9E8A', border: '1px solid rgba(90,158,138,0.35)' }
            : { background: 'rgba(139,107,71,0.14)', color: BROWN_PALE, border: `1px solid rgba(139,107,71,0.32)` }
          }>
          {v.checked ? '✓ ' : '⏳ '}{v.name}
        </span>
      ))}
    </div>
  </div>
)

const CmdRowLight = ({ row }: { row: typeof cmdRows[0] }) => {
  const { time, label, sub, status } = row
  const isDone = status === 'done', isLive = status === 'live', isAlert = status === 'alert'
  const timeColor = isLive ? BROWN_PRIMARY : isDone ? '#B0A090' : status === 'next' ? BROWN_DARK : isAlert ? '#AA5040' : '#3A7A68'
  const rowBg = isLive ? 'rgba(139,107,71,0.10)' : isAlert ? 'rgba(170,80,64,0.06)' : '#EAE2D8'
  const rowBorder = isLive ? 'rgba(139,107,71,0.28)' : isAlert ? 'rgba(170,80,64,0.18)' : 'rgba(139,107,71,0.12)'
  const badge = isLive
    ? <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(139,107,71,0.14)', color: BROWN_PRIMARY, border: `1px solid rgba(139,107,71,0.35)` }}>● LIVE</span>
    : isDone
      ? <span style={{ color: '#3A7A68', fontSize: '16px' }}>✓</span>
      : status === 'next'
        ? <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(110,84,50,0.10)', color: BROWN_DARK, border: `1px solid rgba(110,84,50,0.28)` }}>Upcoming</span>
        : isAlert
          ? <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(170,80,64,0.12)', color: '#AA5040', border: `1px solid rgba(170,80,64,0.30)` }}>Alert</span>
          : <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(58,122,104,0.12)', color: '#3A7A68', border: `1px solid rgba(58,122,104,0.28)` }}>Confirmed</span>
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: rowBg, border: `1px solid ${rowBorder}`, opacity: isDone ? 0.45 : 1 }}>
      <span className="text-xs font-mono w-10 shrink-0 font-semibold" style={{ color: timeColor }}>{time}</span>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: timeColor }} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium" style={{ color: isDone ? '#9A8878' : '#1C1510' }}>{label}</p>
        <p className="text-xs truncate" style={{ color: '#9A8070' }}>{sub}</p>
      </div>
      <div className="shrink-0">{badge}</div>
    </div>
  )
}

const CmdVendorLight = () => (
  <div className="p-4 rounded-xl mt-1" style={{ backgroundColor: '#E8E0D4', border: '1px solid rgba(139,107,71,0.18)' }}>
    <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: BROWN_PRIMARY }}>Vendor Check-in</p>
    <div className="flex flex-wrap gap-2">
      {[
        { name: 'Photographer', checked: true },
        { name: 'Caterer', checked: true },
        { name: 'Florist', checked: true },
        { name: 'DJ', checked: false },
        { name: 'Transport', checked: true },
      ].map((v) => (
        <span
          key={v.name}
          className="text-xs px-2.5 py-1.5 rounded-full font-semibold"
          style={v.checked
            ? { background: 'rgba(58,122,104,0.12)', color: '#3A7A68', border: '1px solid rgba(58,122,104,0.28)' }
            : { background: 'rgba(139,107,71,0.12)', color: BROWN_PRIMARY, border: `1px solid rgba(139,107,71,0.28)` }
          }
        >
          {v.checked ? '✓ ' : '⏳ '}{v.name}
        </span>
      ))}
    </div>
  </div>
)

// ============================================================
// ─── EXPORT ──────────────────────────────────────────────────
// ============================================================
export default page