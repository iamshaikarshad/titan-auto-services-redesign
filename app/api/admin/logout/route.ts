import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('[v0] Admin logout initiated')

    const response = NextResponse.json(
      { success: true, message: 'Logout successful' },
      { status: 200 }
    )

    // Clear the admin auth cookie
    response.cookies.set('adminAuth', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Immediately expire
      path: '/',
    })

    return response
  } catch (error) {
    console.error('[v0] Logout error:', error)
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    )
  }
}
