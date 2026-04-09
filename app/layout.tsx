import type { Metadata } from 'next'
import { ThemeProvider }      from '@/context/ThemeContext'
import { NavigationProvider } from '@/context/NavigationContext'
import { AuthProvider }       from '@/context/Auth/AuthContext'
import PageTransition         from '@/components/PageTransition'
import './globals.css'

export const metadata: Metadata = {
  title:       'Vow — Wedding Operating System',
  description: 'Plan the day. Run the day.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head suppressHydrationWarning />
      <body className="bg-background text-foreground antialiased">

        <ThemeProvider>
          <AuthProvider>
            <NavigationProvider>
              <PageTransition>
                {children}
              </PageTransition>
            </NavigationProvider>
          </AuthProvider>
        </ThemeProvider>

      </body>
    </html>
  )
}