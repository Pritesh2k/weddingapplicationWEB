// app/page.tsx
'use client'

import { useRef } from 'react'
import { useTheme } from '@/context/ThemeContext'

import Navbar from '@/components/Landing/NavBar/component'
import HeroSection from '@/components/Landing/HeroSection/components'
import LogoStrip from '@/components/Landing/LogoStrip/components'
import ProblemSection from '@/components/Landing/ProblemSection/component'
import FeaturesGrid from '@/components/Landing/FeatureGrid/component'
import StatsSection from '@/components/Landing/StatsSection/component'
import CommandCentre from '@/components/Landing/CommandCenter/component'
import StakeholderSection from '@/components/Landing/StakeholderSection/component'
import TraditionSection from '@/components/Landing/TraditionSection/component'
import TestimonialSection from '@/components/Landing/TestimonialSection/component'
import GetStartedSection from '@/components/Landing/GetStartedSection/component'
import Footer from '@/components/Landing/Footer/component'

import {
  NAV_ITEMS, FOOTER_NAV_ITEMS, LOGO_STRIP_ITEMS,
  PROBLEM_CARDS, STATS, CMD_ROWS, CMD_VENDORS,
  LIVE_FEATURES, STAKEHOLDERS, TRADITIONS,
  TRADITION_FEATURES, TESTIMONIALS,
} from '@/lib/Landing/data'
import { FEATURES } from '@/lib/Landing/features'

import {
  IconRings, IconMoon, IconSun,
  IconArrow, IconChevronDown,
} from '@/lib/Landing/icons'

declare global {
  interface Window { gsap: any; ScrollTrigger: any }
}

const Page = () => {
  const { T } = useTheme()

  const heroRef = useRef<HTMLElement>(null)
  const heroHeadlineRef = useRef<HTMLHeadingElement>(null)
  const heroSubRef = useRef<HTMLParagraphElement>(null)
  const heroCTARef = useRef<HTMLDivElement>(null)
  const heroScrollRef = useRef<HTMLDivElement>(null)
  const logoStripRef = useRef<HTMLDivElement>(null)
  const problemRef = useRef<HTMLElement>(null)
  const featuresRef = useRef<HTMLElement>(null)
  const statsRef = useRef<HTMLElement>(null)
  const commandRef = useRef<HTMLElement>(null)
  const stakeholderRef = useRef<HTMLElement>(null)
  const traditionRef = useRef<HTMLElement>(null)
  const testimonialRef = useRef<HTMLElement>(null)
  const waitlistRef = useRef<HTMLElement>(null)
  const footerRef = useRef<HTMLElement>(null)

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <>
      <noscript>
        <style>{`.hero-bg{transform:none!important}`}</style>
      </noscript>

      <div
        suppressHydrationWarning
        className="min-h-screen font-sans antialiased transition-colors duration-500"
        style={{ backgroundColor: T.bg, color: T.textPrimary }}
      >
        <Navbar scrollTo={scrollTo} navItems={NAV_ITEMS} IconRings={IconRings} IconMoon={IconMoon} IconSun={IconSun} />
        <HeroSection scrollTo={scrollTo} heroRef={heroRef} heroHeadlineRef={heroHeadlineRef} heroSubRef={heroSubRef} heroCTARef={heroCTARef} heroScrollRef={heroScrollRef} IconArrow={IconArrow} IconChevronDown={IconChevronDown} />
        <LogoStrip logoStripRef={logoStripRef} items={LOGO_STRIP_ITEMS} />
        <ProblemSection problemRef={problemRef} cards={PROBLEM_CARDS} />
        <FeaturesGrid featuresRef={featuresRef} features={FEATURES} />
        <StatsSection statsRef={statsRef} stats={STATS} />
        <CommandCentre commandRef={commandRef} cmdRows={CMD_ROWS} vendors={CMD_VENDORS} liveFeatures={LIVE_FEATURES} />
        <StakeholderSection stakeholderRef={stakeholderRef} stakeholders={STAKEHOLDERS} />
        <TraditionSection traditionRef={traditionRef} traditions={TRADITIONS} traditionFeatures={TRADITION_FEATURES} />
        <TestimonialSection testimonialRef={testimonialRef} testimonials={TESTIMONIALS} />
        <GetStartedSection sectionRef={waitlistRef} />
        <Footer scrollTo={scrollTo} footerRef={footerRef} navItems={FOOTER_NAV_ITEMS} IconRings={IconRings} />
      </div>
    </>
  )
}

export default Page