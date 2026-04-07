// context/NavigationContext.tsx
'use client'

import { createContext, useContext, useRef, useCallback, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface NavigationContextValue {
  navigate: (href: string) => void
  registerCover: (fn: (href: string) => void) => void
}

const NavigationContext = createContext<NavigationContextValue>({
  navigate:      (href) => { window.location.href = href },
  registerCover: () => {},
})

export const useNavigate = () => useContext(NavigationContext)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const router      = useRouter()
  const coverFnRef  = useRef<((href: string) => void) | null>(null)

  const registerCover = useCallback((fn: (href: string) => void) => {
    coverFnRef.current = fn
  }, [])

  const navigate = useCallback((href: string) => {
    if (coverFnRef.current) {
      coverFnRef.current(href)   // triggers cover, then router.push internally
    } else {
      router.push(href)
    }
  }, [router])

  return (
    <NavigationContext.Provider value={{ navigate, registerCover }}>
      {children}
    </NavigationContext.Provider>
  )
}