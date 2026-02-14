import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if this is an admin route (but not login, api, or static)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login') && !pathname.startsWith('/api')) {
    // Check for admin auth cookie
    const adminAuth = request.cookies.get('adminAuth')

    if (!adminAuth) {
      console.log('[v0] Admin access denied - no auth cookie, redirecting to login')
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
