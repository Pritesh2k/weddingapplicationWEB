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
  user: User | null
  loading: boolean
  signInGoogle: () => Promise<void>
  signInEmail: (email: string, password: string) => Promise<void>
  signUpEmail: (email: string, password: string, fullName: string) => Promise<void>
  logout: () => Promise<void>
}

// ─── Context ──────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const syncUserToSupabase = async (firebaseUser: User) => {
    await fetch('/api/auth/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
      }),
    })
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await syncUserToSupabase(firebaseUser) // ← ensures user exists in public.users
        await firebaseUser.getIdToken(true)    // ← force refresh for role claim
      }
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsub
  }, [])

  const signInGoogle = async () => {
    setLoading(true)
    try {
      await signInWithPopup(auth, googleProvider)
      await auth.currentUser?.getIdToken(true)
    } finally {
      setLoading(false)
    }
  }

  const signInEmail = async (email: string, password: string) => {
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      await auth.currentUser?.getIdToken(true)
    } finally {
      setLoading(false)
    }
  }

  const signUpEmail = async (email: string, password: string, fullName: string) => {
    setLoading(true)
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(credential.user, { displayName: fullName })
      setUser({ ...credential.user, displayName: fullName } as User)
    } finally {
      setLoading(false)
    }
  }

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

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}