// app/login/page.tsx
'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useTheme } from '@/context/ThemeContext'
import { btnPrimary, BROWN_PRIMARY, THEME } from '@/lib/theme'
import { useRouter, useSearchParams } from 'next/navigation'   // ← replaces useNavigate for auth redirects
import { useNavigate } from '@/context/NavigationContext'

import { useAuth } from '@/context/Auth/AuthContext'
import { getFriendlyError } from '@/components/Auth/shared'

// ─── ICONS (unchanged) ───────────────────────────────────────
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

// ─── COMPONENT ───────────────────────────────────────────────
const Login = () => {
  const { darkMode, toggleTheme, T } = useTheme()
  const { navigate }                 = useNavigate()
  const router                       = useRouter()
  const searchParams                 = useSearchParams()
  const redirect                     = searchParams.get('redirect') || '/dashboard'

  // ── Auth ────────────────────────────────────────────────
  const { signInGoogle, signInEmail, loading: authLoading } = useAuth()

  const [email,         setEmail]         = useState('')
  const [password,      setPassword]      = useState('')
  const [showPassword,  setShowPassword]  = useState(false)
  const [rememberMe,    setRememberMe]    = useState(false)
  const [error,         setError]         = useState('')
  const [fieldFocus,    setFieldFocus]    = useState<string | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  // Card entrance animation (unchanged)
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

  // ── Google sign-in ──────────────────────────────────────
  const handleGoogle = async () => {
    setError('')
    try {
      await signInGoogle()
      router.push(redirect)
    } catch (e: any) {
      setError(getFriendlyError(e.code))
    }
  }

  // ── Email sign-in ───────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please fill in all fields.'); return }
    try {
      await signInEmail(email, password)
      router.push(redirect)
    } catch (e: any) {
      setError(getFriendlyError(e.code))
    }
  }

  const inputStyle = (field: string) => ({
    backgroundColor: T.inputBg,
    border: `1px solid ${fieldFocus === field ? T.inputFocus : T.inputBorder}`,
    color: T.textPrimary,
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    boxShadow: fieldFocus === field
      ? `0 0 0 3px ${darkMode ? 'rgba(160,126,84,0.12)' : 'rgba(139,107,71,0.10)'}`
      : 'none',
  })

  return (
    <div
      className="min-h-screen font-sans antialiased flex flex-col"
      style={{ backgroundColor: T.bg, color: T.textPrimary }}
    >
      {/* Background glow — unchanged */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0" style={{ background: T.heroBg }} />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-175 h-100 rounded-full blur-3xl"
          style={{
            background: darkMode
              ? 'radial-gradient(ellipse, rgba(160,120,72,0.10) 0%, transparent 70%)'
              : 'radial-gradient(ellipse, rgba(139,107,71,0.08) 0%, transparent 70%)'
          }}
        />
      </div>

      {/* Header — unchanged */}
      <header
        className="relative z-10 flex items-center justify-between px-6 lg:px-10 h-16"
        style={{
          backgroundColor: T.navBg,
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${T.borderSubtle}`,
        }}
      >
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

        <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 focus:outline-none">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: btnPrimary.bg, boxShadow: btnPrimary.shadow, color: btnPrimary.color }}
          >
            <IconRings />
          </div>
          <span className="font-semibold tracking-tight text-lg" style={{ color: T.textPrimary }}>Vow</span>
        </Link>

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

      {/* Main */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div ref={cardRef} className="w-full max-w-md">

          {/* Tab switcher — unchanged */}
          <div
            className="flex items-center rounded-2xl p-1 mb-3 gap-1"
            style={{ backgroundColor: T.surface, border: `1px solid ${T.borderBrown}` }}
            role="tablist"
            aria-label="Authentication mode"
          >
            <Link
              href="/login"
              role="tab"
              aria-selected={true}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-250 focus:outline-none"
              style={{ background: btnPrimary.bg, color: btnPrimary.color, boxShadow: btnPrimary.shadow }}
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              role="tab"
              aria-selected={false}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-250 focus:outline-none"
              style={{ color: T.textMuted }}
              onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = T.accentText}
              onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = T.textMuted}
            >
              Create account
            </Link>
          </div>

          {/* Card */}
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
            <div className="mb-8">
              <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: T.accentText }}>
                Welcome back
              </p>
              <h1 className="text-2xl font-bold tracking-tight" style={{ color: T.textPrimary }}>
                Sign in to Vow
              </h1>
              <p className="mt-1.5 text-sm" style={{ color: T.textMuted }}>
                Continue planning your perfect day.
              </p>
            </div>

            {/* ── Google button — now wired ─────────────── */}
            <button
              type="button"
              onClick={handleGoogle}
              disabled={authLoading}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl
                         text-sm font-semibold transition-all duration-200
                         hover:scale-[1.01] focus:outline-none mb-6
                         disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: T.surface2,
                border: `1px solid ${T.borderBrown}`,
                color: T.textPrimary,
              }}
              onMouseEnter={(e) => { if (!authLoading) (e.currentTarget.style.borderColor = T.accentText) }}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = T.borderBrown)}
            >
              <IconGoogle />
              {authLoading ? 'Signing in…' : 'Continue with Google'}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px" style={{ backgroundColor: T.borderSubtle }} />
              <span className="text-xs font-medium" style={{ color: T.textMuted }}>or sign in with email</span>
              <div className="flex-1 h-px" style={{ backgroundColor: T.borderSubtle }} />
            </div>

            {/* Error banner */}
            {error && (
              <div
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm mb-5"
                style={{
                  background: 'rgba(176,80,70,0.12)',
                  border: '1px solid rgba(176,80,70,0.28)',
                  color: '#D4847A',
                }}
                role="alert"
              >
                <span>⚠</span> {error}
              </div>
            )}

            {/* Form — unchanged except onSubmit */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">

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

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider" style={{ color: T.textMuted }}>
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium transition-colors duration-200 focus:outline-none"
                    style={{ color: T.accentText }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.75')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: T.textMuted }}>
                    <IconLock />
                  </span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    autoComplete="current-password"
                    placeholder="••••••••"
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
              </div>

              {/* Remember me — unchanged */}
              <div className="flex items-center gap-2.5 pt-1">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={rememberMe}
                  onClick={() => setRememberMe(!rememberMe)}
                  className="rounded flex items-center justify-center transition-all duration-200 focus:outline-none shrink-0"
                  style={{
                    width: '18px', height: '18px',
                    backgroundColor: rememberMe ? BROWN_PRIMARY : T.inputBg,
                    border: `1.5px solid ${rememberMe ? BROWN_PRIMARY : T.inputBorder}`,
                  }}
                >
                  {rememberMe && (
                    <svg viewBox="0 0 12 12" fill="none" stroke={THEME.btn.text} strokeWidth="2" className="w-2.5 h-2.5">
                      <path d="M2 6l3 3 5-5" />
                    </svg>
                  )}
                </button>
                <span className="text-sm" style={{ color: T.textSecondary }}>Remember me for 30 days</span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 focus:outline-none mt-2 disabled:cursor-not-allowed"
                style={{
                  background:  authLoading ? T.surface2 : btnPrimary.bg,
                  boxShadow:   authLoading ? 'none'      : btnPrimary.shadow,
                  color:       authLoading ? T.textMuted : btnPrimary.color,
                }}
                onMouseEnter={(e) => { if (!authLoading) (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
              >
                {authLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Signing in…
                  </span>
                ) : 'Sign in'}
              </button>
            </form>
          </div>

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

export default Login