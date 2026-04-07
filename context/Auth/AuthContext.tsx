// context/AuthContext.tsx
'use client'

import {
  createContext, useContext, useEffect, useState, useCallback,
  type ReactNode,
} from 'react'
import {
  onAuthStateChanged, signInWithPopup, signOut,
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  updateProfile,
  type User,
} from 'firebase/auth'
import { auth, googleProvider } from '@/Auth/client'

// ── Cookie helpers ────────────────────────────────────────────
const SESSION_COOKIE = 'firebase-session'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7   // 7 days in seconds

function setSessionCookie() {
  document.cookie = [
    `${SESSION_COOKIE}=1`,
    'path=/',
    `max-age=${COOKIE_MAX_AGE}`,
    'SameSite=Lax',
    // Add 'Secure' in production — omit for localhost
    process.env.NODE_ENV === 'production' ? 'Secure' : '',
  ].filter(Boolean).join('; ')
}

function clearSessionCookie() {
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`
}

// ── Types ─────────────────────────────────────────────────────
interface AuthState {
  user:         User | null
  idToken:      string | null
  loading:      boolean
  signInGoogle: () => Promise<void>
  signInEmail:  (email: string, password: string) => Promise<void>
  signUpEmail:  (email: string, password: string, name: string) => Promise<void>
  logout:       () => Promise<void>
  refreshToken: () => Promise<string | null>
}

const AuthContext = createContext<AuthState | null>(null)

// ── Provider ──────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null)
  const [idToken, setIdToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // ── Token refresh ─────────────────────────────────────────
  const refreshToken = useCallback(async (): Promise<string | null> => {
    if (!auth.currentUser) return null
    const token = await auth.currentUser.getIdToken(true)
    setIdToken(token)
    return token
  }, [])

  // ── Auth state listener ───────────────────────────────────
  // Runs once on mount — sets user + token + cookie from
  // any existing Firebase session (e.g. page refresh)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken()
        setUser(firebaseUser)
        setIdToken(token)
        setSessionCookie()        // restore cookie if session already exists
      } else {
        setUser(null)
        setIdToken(null)
        clearSessionCookie()      // clean up if Firebase session expired
      }
      setLoading(false)
    })
    return unsub
  }, [])

  // ── Auto-refresh every 55 min ─────────────────────────────
  useEffect(() => {
    if (!user) return
    const interval = setInterval(refreshToken, 55 * 60 * 1000)
    return () => clearInterval(interval)
  }, [user, refreshToken])

  // ── Sign in: Google OAuth ─────────────────────────────────
  const signInGoogle = async () => {
    setLoading(true)
    try {
      await signInWithPopup(auth, googleProvider)
      setSessionCookie()
    } finally {
      setLoading(false)
    }
  }

  // ── Sign in: Email + Password ─────────────────────────────
  const signInEmail = async (email: string, password: string) => {
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      setSessionCookie()
    } finally {
      setLoading(false)
    }
  }

  // ── Sign up: Email + Password ─────────────────────────────
  const signUpEmail = async (email: string, password: string, name: string) => {
    setLoading(true)
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(user, { displayName: name })
      setSessionCookie()
    } finally {
      setLoading(false)
    }
  }

  // ── Logout ────────────────────────────────────────────────
  const logout = async () => {
    await signOut(auth)
    setUser(null)
    setIdToken(null)
    clearSessionCookie()
  }

  return (
    <AuthContext.Provider value={{
      user, idToken, loading,
      signInGoogle, signInEmail, signUpEmail,
      logout, refreshToken,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// ── Hook ──────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}