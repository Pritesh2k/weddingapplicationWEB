// context/Auth/AuthContext.tsx
'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  User,
} from 'firebase/auth'
import { auth, googleProvider } from '@/Auth/client'

// ─── Types ────────────────────────────────────────────────────
interface AuthContextValue {
  user:         User | null
  loading:      boolean
  signInGoogle: () => Promise<void>
  signInEmail:  (email: string, password: string) => Promise<void>
  signUpEmail:  (email: string, password: string, fullName: string) => Promise<void>
  logout:       () => Promise<void>
}

// ─── Context ──────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null)
  const [loading, setLoading] = useState(true)   // true until Firebase resolves initial state

  // Listen for auth state changes on mount
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsub
  }, [])

  // ── Google sign-in / sign-up (same flow) ────────────────────
  const signInGoogle = async () => {
    setLoading(true)
    try {
      await signInWithPopup(auth, googleProvider)
      // onAuthStateChanged will update user automatically
    } finally {
      setLoading(false)
    }
  }

  // ── Email sign-in ────────────────────────────────────────────
  const signInEmail = async (email: string, password: string) => {
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } finally {
      setLoading(false)
    }
  }

  // ── Email sign-up ─────────────────────────────────────────────
  // 1. Creates the user in Firebase Auth with email + password
  // 2. Immediately writes displayName so user.displayName is populated
  const signUpEmail = async (email: string, password: string, fullName: string) => {
    setLoading(true)
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(credential.user, { displayName: fullName })
      // Force a refresh so the updated profile is reflected immediately
      setUser({ ...credential.user, displayName: fullName } as User)
    } finally {
      setLoading(false)
    }
  }

  // ── Sign out ──────────────────────────────────────────────────
  const logout = async () => {
    setLoading(true)
    try {
      await signOut(auth)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInGoogle, signInEmail, signUpEmail, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}