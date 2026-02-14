import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    // Get admin password from environment variable
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

    // Verify password
    if (password !== adminPassword) {
      console.log('[v0] Invalid admin password attempt')
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    console.log('[v0] Admin login successful')

    // Create response with success message
    const response = NextResponse.json(
      { success: true, message: 'Login successful' },
      { status: 200 }
    )

    // Set HTTP-only cookie for session (24 hours)
    response.cookies.set('adminAuth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    })

    return response
  } catch (error) {
    console.error('[v0] Login error:', error)
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}
