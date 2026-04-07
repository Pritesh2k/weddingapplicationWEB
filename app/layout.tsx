// app/layout.tsx
import type { Metadata } from 'next'
import { ThemeProvider } from '@/context/ThemeContext'
import PageTransition from '@/components/PageTransition'
import './globals.css'

export const metadata: Metadata = {
  title: 'Vow — Wedding Operating System',
  description: 'Plan the day. Run the day.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head suppressHydrationWarning />
      <body suppressHydrationWarning>

        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                try {
                  var s = localStorage.getItem('vow-theme');
                  var dark = s ? s === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
                  document.documentElement.classList.toggle('dark', dark);
                  document.documentElement.style.backgroundColor = dark ? '#1E1C1A' : '#F7F3ED';
                  document.body.style.backgroundColor = dark ? '#1E1C1A' : '#F7F3ED';
                } catch(e){}
              })();
            `,
          }}
        />

        <ThemeProvider>
          {/*
            ✅ PageTransition must NOT wrap the Navbar.
            Any transform/opacity animation on this wrapper breaks position:fixed.
            The Navbar lives in {children} (page.tsx) so it escapes PageTransition entirely
            by being rendered at the layout level instead.
          */}
          <PageTransition>
            {children}
          </PageTransition>
        </ThemeProvider>

      </body>
    </html>
  )
}