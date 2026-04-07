// context/ThemeContext.tsx
'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { getTheme, type ThemeMode } from '@/lib/theme'

interface ThemeContextValue {
  darkMode: boolean
  toggleTheme: () => void
  T: ThemeMode
  mounted: boolean
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {

  // ── Always false on server — prevents SSR/client mismatch ──
  const [darkMode, setDarkMode] = useState(false)
  const [mounted, setMounted]   = useState(false)

  // ── After mount, read real preference from localStorage ───
  useEffect(() => {
    const stored = localStorage.getItem('vow-theme')
    if (stored) {
      setDarkMode(stored === 'dark')
    } else {
      setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
    setMounted(true)
  }, [])

  // ── Sync html class + bg whenever darkMode changes ────────
  useEffect(() => {
    if (!mounted) return
    document.documentElement.classList.toggle('dark', darkMode)
    document.documentElement.style.backgroundColor = darkMode ? '#1E1C1A' : '#F7F3ED'
    localStorage.setItem('vow-theme', darkMode ? 'dark' : 'light')
  }, [darkMode, mounted])

  const toggleTheme = () => setDarkMode((prev) => !prev)
  const T = getTheme(darkMode)

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme, T, mounted }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within <ThemeProvider>')
  return ctx
}