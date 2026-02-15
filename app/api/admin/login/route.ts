import { NextRequest, NextResponse } from 'next/server'
import { Pool } from '@neondatabase/serverless'
import bcrypt from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(request: NextRequest) {
  let client
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    client = await pool.connect()

    console.log('[v0] Login attempt with email:', email)

    // Get admin user from database
    const result = await client.query(
      'SELECT id, email, password_hash FROM users WHERE email = $1 AND role = $2',
      [email, 'admin']
    )

    console.log('[v0] Query result rows:', result.rows.length)

    if (result.rows.length === 0) {
      console.log('[v0] Admin user not found:', email)
      // Try without role check to debug
      const debugResult = await client.query(
        'SELECT id, email, role, password_hash FROM users WHERE email = $1',
        [email]
      )
      console.log('[v0] Debug - All users with this email:', debugResult.rows)
      
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const user = result.rows[0]
    console.log('[v0] User found:', user.email, 'Password hash length:', user.password_hash?.length)

    // Verify password against bcrypt hash
    const isPasswordValid = await bcrypt.compare(password, user.password_hash)
    console.log('[v0] Password valid:', isPasswordValid)

    if (!isPasswordValid) {
      console.log('[v0] Invalid password attempt for:', email)
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    console.log('[v0] Admin login successful:', email)

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
  } finally {
    if (client) {
      client.release()
    }
  }
}
