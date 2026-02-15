import { NextRequest, NextResponse } from 'next/server'
import { Pool } from '@neondatabase/serverless'
import bcrypt from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(request: NextRequest) {
  let client
  try {
    const body = await request.json()
    const { email, password } = body

    console.log('[v0] TEST LOGIN: Attempting with email:', email, 'password:', password)

    client = await pool.connect()

    // Get the user
    const result = await client.query(
      'SELECT id, email, role, password_hash FROM users WHERE email = $1',
      [email]
    )

    console.log('[v0] TEST: Query returned', result.rows.length, 'rows')

    if (result.rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'User not found',
        email,
      })
    }

    const user = result.rows[0]
    console.log('[v0] TEST: Found user:', user.email, 'role:', user.role)
    console.log('[v0] TEST: Password hash prefix:', user.password_hash?.substring(0, 30))
    console.log('[v0] TEST: Password hash length:', user.password_hash?.length)

    // Test bcrypt
    console.log('[v0] TEST: Starting bcrypt compare...')
    const isValid = await bcrypt.compare(password, user.password_hash)
    console.log('[v0] TEST: bcrypt result:', isValid)

    return NextResponse.json({
      success: isValid,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      hash: {
        type: typeof user.password_hash,
        length: user.password_hash?.length,
        prefix: user.password_hash?.substring(0, 30),
      },
      bcryptResult: isValid,
    })
  } catch (error) {
    console.error('[v0] TEST ERROR:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    )
  } finally {
    if (client) {
      client.release()
    }
  }
}
