// context/ThemeContext.tsx
'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { getTheme, type ThemeMode } from '@/lib/theme'

interface ThemeContextValue {
  darkMode: boolean
  toggleTheme: () => void
  T: ThemeMode
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {

  // ── Single source of truth — read once from localStorage ──
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true
    const stored = localStorage.getItem('vow-theme')
    if (stored) return stored === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  // ── Sync html class + bg whenever darkMode changes ────────
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    document.documentElement.style.backgroundColor = darkMode ? '#1E1C1A' : '#F7F3ED'
    localStorage.setItem('vow-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  const toggleTheme = () => setDarkMode((prev) => !prev)

  const T = getTheme(darkMode)

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme, T }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within <ThemeProvider>')
  return ctx
}