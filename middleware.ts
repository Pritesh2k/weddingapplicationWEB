// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/', '/login', '/signup']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isPublic     = PUBLIC_PATHS.some((p) =>
    pathname === p || pathname.startsWith('/api/auth')
  )
  const session      = request.cookies.get('firebase-session')?.value

  if (!isPublic && !session) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)   // preserve intended destination
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}