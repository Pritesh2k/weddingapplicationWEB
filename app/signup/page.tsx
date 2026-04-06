// app/signup/page.tsx
'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useTheme } from '@/context/ThemeContext'
import { btnPrimary, BROWN_PRIMARY, THEME } from '@/lib/theme'

// ─── ICONS ───────────────────────────────────────────────────
const IconRings = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
    <circle cx="8" cy="12" r="5" /><circle cx="16" cy="12" r="5" />
  </svg>
)
const IconMoon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)
const IconSun = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
)
const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 7l10 7 10-7" />
  </svg>
)
const IconLock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)
const IconEye = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)
const IconEyeOff = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22" />
  </svg>
)
const IconGoogle = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
)
const IconArrowLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
)
const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
)
const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M20 6L9 17l-5-5" />
  </svg>
)

// ─── PASSWORD STRENGTH ────────────────────────────────────────
const getPasswordStrength = (pw: string): { score: number; label: string; color: string } => {
  if (!pw) return { score: 0, label: '', color: 'transparent' }
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  const map = [
    { score: 1, label: 'Weak', color: '#E05A4A' },
    { score: 2, label: 'Fair', color: '#D4AA66' },
    { score: 3, label: 'Good', color: '#7ABDB0' },
    { score: 4, label: 'Strong', color: '#5A9E8A' },
  ]
  return map[score - 1] ?? { score: 0, label: '', color: 'transparent' }
}

// ─── COMPONENT ───────────────────────────────────────────────
const Signup = () => {
  const { darkMode, toggleTheme, T } = useTheme()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldFocus, setFieldFocus] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const strength = getPasswordStrength(password)
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword

  useEffect(() => {
    if (!cardRef.current) return
    cardRef.current.style.opacity = '0'
    cardRef.current.style.transform = 'translateY(24px)'
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (!cardRef.current) return
        cardRef.current.style.transition = 'opacity 0.7s ease, transform 0.7s ease'
        cardRef.current.style.opacity = '1'
        cardRef.current.style.transform = 'translateY(0)'
      }, 80)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!fullName || !email || !password || !confirmPassword) { setError('Please fill in all fields.'); return }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return }
    if (strength.score < 2) { setError('Please choose a stronger password.'); return }
    if (!agreedToTerms) { setError('Please agree to the Terms of Service to continue.'); return }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1600))
    setLoading(false)
    setSubmitted(true)
  }

  const inputStyle = (field: string): React.CSSProperties => ({
    backgroundColor: T.inputBg,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: fieldFocus === field ? T.inputFocus : T.inputBorder,
    color: T.textPrimary,
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    boxShadow: fieldFocus === field
      ? `0 0 0 3px ${darkMode ? 'rgba(160,126,84,0.12)' : 'rgba(139,107,71,0.10)'}`
      : 'none',
  })

  // ── Success state ─────────────────────────────────────────
  if (submitted) {
    return (
      <div
        className="min-h-screen font-sans antialiased flex flex-col items-center justify-center px-4"
        style={{ backgroundColor: T.bg, color: T.textPrimary }}
      >
        <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0" style={{ background: T.heroBg }} />
        </div>
        <div
          className="relative z-10 w-full max-w-md rounded-2xl p-10 text-center"
          style={{
            backgroundColor: T.surface,
            border: `1px solid ${T.borderBrown}`,
            boxShadow: darkMode ? '0 24px 64px rgba(0,0,0,0.45)' : '0 12px 40px rgba(139,107,71,0.10)',
          }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(90,158,138,0.15)', border: '1px solid rgba(90,158,138,0.35)' }}
          >
            <IconCheck />
          </div>
          <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: T.accentText }}>
            Account created
          </p>
          <h1 className="text-2xl font-bold tracking-tight mb-3" style={{ color: T.textPrimary }}>
            Welcome to Vow
          </h1>
          <p className="text-sm leading-relaxed mb-8" style={{ color: T.textMuted }}>
            Your account is ready. Start building your wedding programme from your dashboard.
          </p>
          <Link
            href="/login"
            className="block w-full py-3.5 rounded-xl font-semibold text-sm text-center transition-all duration-300 hover:scale-[1.02] focus:outline-none"
            style={{ background: btnPrimary.bg, boxShadow: btnPrimary.shadow, color: btnPrimary.color }}
          >
            Sign in to your account
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen font-sans antialiased flex flex-col"
      style={{ backgroundColor: T.bg, color: T.textPrimary }}
    >
      {/* ── Background glow ──────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0" style={{ background: T.heroBg }} />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-3xl"
          style={{
            background: darkMode
              ? 'radial-gradient(ellipse, rgba(160,120,72,0.10) 0%, transparent 70%)'
              : 'radial-gradient(ellipse, rgba(139,107,71,0.08) 0%, transparent 70%)'
          }}
        />
      </div>

      {/* ── Header — clean, minimal ───────────────────────── */}
      <header
        className="relative z-10 flex items-center justify-between px-6 lg:px-10 h-16"
        style={{
          backgroundColor: T.navBg,
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${T.borderSubtle}`,
        }}
      >
        {/* Home link */}
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-medium transition-colors duration-200 focus:outline-none group"
          style={{ color: T.textMuted }}
          onMouseEnter={(e) => (e.currentTarget.style.color = T.accentText)}
          onMouseLeave={(e) => (e.currentTarget.style.color = T.textMuted)}
        >
          <span className="group-hover:-translate-x-0.5 transition-transform duration-200">
            <IconArrowLeft />
          </span>
          <span className="hidden sm:inline">Home</span>
        </Link>

        {/* Logo — centred */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 focus:outline-none">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: btnPrimary.bg, boxShadow: btnPrimary.shadow, color: btnPrimary.color }}
          >
            <IconRings />
          </div>
          <span className="font-semibold tracking-tight text-lg" style={{ color: T.textPrimary }}>Vow</span>
        </Link>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none"
          style={{ backgroundColor: T.surface, border: `1px solid ${T.borderBrown}`, color: T.textMuted }}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-pressed={darkMode}
        >
          {darkMode ? <IconSun /> : <IconMoon />}
        </button>
      </header>

      {/* ── Main ─────────────────────────────────────────── */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div ref={cardRef} className="w-full max-w-md">

          {/* ── Tab switcher — above card ─────────────────── */}
          <div
            className="flex items-center rounded-2xl p-1 mb-3 gap-1"
            style={{
              backgroundColor: T.surface,
              border: `1px solid ${T.borderBrown}`,
            }}
            role="tablist"
            aria-label="Authentication mode"
          >
            {/* Sign in tab — INACTIVE */}
            <Link
              href="/login"
              role="tab"
              aria-selected={false}
              className="flex-1 flex items-center justify-center py-2.5 rounded-xl text-sm font-semibold transition-all duration-250 focus:outline-none"
              style={{ color: T.textMuted }}
              onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = T.accentText}
              onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = T.textMuted}
            >
              Sign in
            </Link>
            {/* Create account tab — ACTIVE */}
            <Link
              href="/signup"
              role="tab"
              aria-selected={true}
              className="flex-1 flex items-center justify-center py-2.5 rounded-xl text-sm font-semibold transition-all duration-250 focus:outline-none"
              style={{ background: btnPrimary.bg, color: btnPrimary.color, boxShadow: btnPrimary.shadow }}
            >
              Create account
            </Link>
          </div>

          {/* ── Card ─────────────────────────────────────── */}
          <div
            className="rounded-2xl p-8 md:p-10"
            style={{
              backgroundColor: T.surface,
              border: `1px solid ${T.borderBrown}`,
              boxShadow: darkMode
                ? '0 24px 64px rgba(0,0,0,0.45), 0 0 0 1px rgba(160,120,72,0.06)'
                : '0 12px 40px rgba(139,107,71,0.10), 0 2px 8px rgba(0,0,0,0.05)',
            }}
          >
            {/* Heading */}
            <div className="mb-8">
              <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: T.accentText }}>
                Get started
              </p>
              <h1 className="text-2xl font-bold tracking-tight" style={{ color: T.textPrimary }}>
                Create your Vow account
              </h1>
              <p className="mt-1.5 text-sm" style={{ color: T.textMuted }}>
                Your wedding command centre starts here.
              </p>
            </div>

            {/* Google SSO */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.01] focus:outline-none mb-6"
              style={{ backgroundColor: T.surface2, border: `1px solid ${T.borderBrown}`, color: T.textPrimary }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = T.accentText)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = T.borderBrown)}
            >
              <IconGoogle />
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px" style={{ backgroundColor: T.borderSubtle }} />
              <span className="text-xs font-medium" style={{ color: T.textMuted }}>or sign up with email</span>
              <div className="flex-1 h-px" style={{ backgroundColor: T.borderSubtle }} />
            </div>

            {/* Error banner */}
            {error && (
              <div
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm mb-5"
                style={{ background: 'rgba(176,80,70,0.12)', border: '1px solid rgba(176,80,70,0.28)', color: '#D4847A' }}
                role="alert"
              >
                <span>⚠</span> {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">

              {/* Full name */}
              <div>
                <label htmlFor="fullName" className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: T.textMuted }}>
                  Full name
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: T.textMuted }}>
                    <IconUser />
                  </span>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    autoComplete="name"
                    placeholder="Your full name"
                    required
                    onChange={(e) => setFullName(e.target.value)}
                    onFocus={() => setFieldFocus('fullName')}
                    onBlur={() => setFieldFocus(null)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                    style={inputStyle('fullName')}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: T.textMuted }}>
                  Email address
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: T.textMuted }}>
                    <IconMail />
                  </span>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFieldFocus('email')}
                    onBlur={() => setFieldFocus(null)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                    style={inputStyle('email')}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: T.textMuted }}>
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: T.textMuted }}>
                    <IconLock />
                  </span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    autoComplete="new-password"
                    placeholder="Create a password"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFieldFocus('password')}
                    onBlur={() => setFieldFocus(null)}
                    className="w-full pl-10 pr-11 py-3 rounded-xl text-sm"
                    style={inputStyle('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 focus:outline-none"
                    style={{ color: T.textMuted }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onMouseEnter={(e) => (e.currentTarget.style.color = T.accentText)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = T.textMuted)}
                  >
                    {showPassword ? <IconEyeOff /> : <IconEye />}
                  </button>
                </div>

                {/* Password strength meter */}
                {password.length > 0 && (
                  <div className="mt-2.5">
                    <div className="flex gap-1 mb-1.5">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="flex-1 h-1 rounded-full transition-all duration-300"
                          style={{ backgroundColor: i <= strength.score ? strength.color : T.borderSubtle }}
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs" style={{ color: T.textMuted }}>
                        8+ chars · uppercase · number · symbol
                      </p>
                      {strength.label && (
                        <span className="text-xs font-semibold" style={{ color: strength.color }}>
                          {strength.label}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: T.textMuted }}>
                  Confirm password
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: T.textMuted }}>
                    <IconLock />
                  </span>
                  <input
                    id="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    autoComplete="new-password"
                    placeholder="Repeat your password"
                    required
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onFocus={() => setFieldFocus('confirmPassword')}
                    onBlur={() => setFieldFocus(null)}
                    className="w-full pl-10 pr-11 py-3 rounded-xl text-sm"
                    style={{
                      ...inputStyle('confirmPassword'),
                      borderColor: confirmPassword.length > 0
                        ? passwordsMatch
                          ? 'rgba(90,158,138,0.60)'
                          : 'rgba(176,80,70,0.50)'
                        : fieldFocus === 'confirmPassword'
                          ? T.inputFocus
                          : T.inputBorder,
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 focus:outline-none"
                    style={{ color: T.textMuted }}
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    onMouseEnter={(e) => (e.currentTarget.style.color = T.accentText)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = T.textMuted)}
                  >
                    {showConfirm ? <IconEyeOff /> : <IconEye />}
                  </button>

                  {/* Match indicator */}
                  {confirmPassword.length > 0 && (
                    <span
                      className="absolute right-10 top-1/2 -translate-y-1/2 text-xs font-semibold"
                      style={{ color: passwordsMatch ? '#5A9E8A' : '#E05A4A' }}
                    >
                      {passwordsMatch ? '✓' : '✗'}
                    </span>
                  )}
                </div>
              </div>

              {/* Terms agreement */}
              <div className="flex items-start gap-2.5 pt-1">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={agreedToTerms}
                  onClick={() => setAgreedToTerms(!agreedToTerms)}
                  className="rounded flex items-center justify-center transition-all duration-200 focus:outline-none shrink-0 mt-0.5"
                  style={{
                    width: '18px', height: '18px',
                    backgroundColor: agreedToTerms ? BROWN_PRIMARY : T.inputBg,
                    border: `1.5px solid ${agreedToTerms ? BROWN_PRIMARY : T.inputBorder}`,
                  }}
                >
                  {agreedToTerms && (
                    <svg viewBox="0 0 12 12" fill="none" stroke={THEME.btn.text} strokeWidth="2" className="w-2.5 h-2.5">
                      <path d="M2 6l3 3 5-5" />
                    </svg>
                  )}
                </button>
                <span className="text-sm leading-relaxed" style={{ color: T.textSecondary }}>
                  I agree to the{' '}
                  <Link href="/terms" className="font-semibold underline underline-offset-2 focus:outline-none" style={{ color: T.accentText }}>
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="font-semibold underline underline-offset-2 focus:outline-none" style={{ color: T.accentText }}>
                    Privacy Policy
                  </Link>
                </span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 focus:outline-none mt-2"
                style={{
                  background: loading ? T.surface2 : btnPrimary.bg,
                  boxShadow: loading ? 'none' : btnPrimary.shadow,
                  color: loading ? T.textMuted : btnPrimary.color,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
                onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Creating account…
                  </span>
                ) : 'Create account'}
              </button>
            </form>
          </div>

          {/* Trust line */}
          <p className="mt-5 text-center text-xs" style={{ color: T.textMuted }}>
            Secured by industry-standard encryption.{' '}
            <Link href="/privacy" className="underline underline-offset-2 focus:outline-none" style={{ color: T.textMuted }}>
              Privacy Policy
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}

export default Signup