// components/Auth/shared.tsx
'use client'

import { useTheme } from '@/context/ThemeContext'

// ── Google SVG Mark ───────────────────────────────────────────
export function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.8 13.6-4.7l-6.3-5.2C29.4 35.6 26.8 36 24 36c-5.2 0-9.7-2.9-11.9-7.2l-6.6 5.1C9.5 39.4 16.3 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.5-2.6 4.6-4.8 6l6.3 5.2C40.9 35.5 44 30.2 44 24c0-1.3-.1-2.7-.4-4z"/>
    </svg>
  )
}

// ── Or divider ────────────────────────────────────────────────
export function Divider() {
  const { T } = useTheme()
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px" style={{ backgroundColor: T.borderSubtle }} />
      <span className="text-[11px]" style={{ color: T.textMuted }}>or</span>
      <div className="flex-1 h-px" style={{ backgroundColor: T.borderSubtle }} />
    </div>
  )
}

// ── Firebase error → human readable ──────────────────────────
export function getFriendlyError(code: string): string {
  const map: Record<string, string> = {
    'auth/user-not-found':         'No account found with this email.',
    'auth/wrong-password':         'Incorrect password.',
    'auth/invalid-credential':     'Invalid email or password.',
    'auth/email-already-in-use':   'An account with this email already exists.',
    'auth/weak-password':          'Password must be at least 8 characters.',
    'auth/invalid-email':          'Please enter a valid email address.',
    'auth/too-many-requests':      'Too many attempts. Please wait a moment.',
    'auth/popup-closed-by-user':   'Sign-in window was closed. Please try again.',
    'auth/network-request-failed': 'Network error. Check your connection.',
    'auth/cancelled-popup-request':'Only one sign-in window allowed at a time.',
  }
  return map[code] ?? 'Something went wrong. Please try again.'
}