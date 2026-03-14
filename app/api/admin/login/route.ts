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

    console.log('[v0] ===== LOGIN ATTEMPT =====')
    console.log('[v0] Email:', email)
    console.log('[v0] Password length:', password.length)

    client = await pool.connect()

    // First, get ALL users to see what we have
    const allUsersResult = await client.query(
      'SELECT id, email, role, password_hash FROM users'
    )
    console.log('[v0] Total users in database:', allUsersResult.rows.length)
    allUsersResult.rows.forEach((row: any) => {
      console.log('[v0] User:', row.email, 'Role:', row.role, 'Hash length:', row.password_hash?.length)
    })

    // Now get the specific user
    const result = await client.query(
      'SELECT id, email, role, password_hash FROM users WHERE email = $1',
      [email]
    )

    console.log('[v0] Query for email returned:', result.rows.length, 'rows')

    if (result.rows.length === 0) {
      console.log('[v0] User not found')
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const user = result.rows[0]
    console.log('[v0] User found:')
    console.log('[v0]   - Email:', user.email)
    console.log('[v0]   - Role:', user.role)
    console.log('[v0]   - Hash exists:', !!user.password_hash)
    console.log('[v0]   - Hash length:', user.password_hash?.length)
    console.log('[v0]   - Hash prefix:', user.password_hash?.substring(0, 30))

    // Check role
    if (user.role !== 'admin') {
      console.log('[v0] User role is not admin:', user.role)
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check if hash exists
    if (!user.password_hash) {
      console.log('[v0] No password hash found for user')
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    console.log('[v0] Starting bcrypt comparison...')
    let isPasswordValid = false
    
    try {
      const hash = await bcrypt.hash('admin123', 10)
      console.log(hash)
      isPasswordValid = await bcrypt.compare(password, user.password_hash)
      console.log('[v0] bcrypt.compare result:', isPasswordValid)
    } catch (bcryptError) {
      console.error('[v0] bcrypt error:', bcryptError instanceof Error ? bcryptError.message : String(bcryptError))
      throw bcryptError
    }

    if (!isPasswordValid) {
      console.log('[v0] Password is invalid')
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    console.log('[v0] LOGIN SUCCESS')

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
      maxAge: 24 * 60 * 60,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('[v0] Login error:', error instanceof Error ? error.message : String(error))
    console.error('[v0] Error stack:', error instanceof Error ? error.stack : 'No stack')
    return NextResponse.json(
      { 
        error: 'Login failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    if (client) {
      client.release()
    }
  }
}
