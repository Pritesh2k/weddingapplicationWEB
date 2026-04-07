// app/layout.tsx
import type { Metadata } from 'next'
import { ThemeProvider } from '@/context/ThemeContext'
import { NavigationProvider } from '@/context/NavigationContext'
import PageTransition from '@/components/PageTransition'
import './globals.css'

export const metadata: Metadata = {
  title: 'Vow — Wedding Operating System',
  description: 'Plan the day. Run the day.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
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
                  var bg = dark ? '#1E1C1A' : '#F7F3ED';
                  document.documentElement.style.backgroundColor = bg;
                  document.body.style.backgroundColor = bg;
                  // ── NEW: stamp colour on first child div before React hydrates ──
                  document.addEventListener('DOMContentLoaded', function() {
                    var wrapper = document.querySelector('[data-page-wrapper]');
                    if (wrapper) wrapper.style.backgroundColor = bg;
                  });
                } catch(e){}
              })();
            `,
          }}
        />

        <ThemeProvider>
          <NavigationProvider>
            <PageTransition>
              {children}
            </PageTransition>
          </NavigationProvider>
        </ThemeProvider>

      </body>
    </html>
  )
}