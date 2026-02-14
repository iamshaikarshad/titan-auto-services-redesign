import { NextRequest, NextResponse } from 'next/server'
import { Pool } from '@neondatabase/serverless'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(request: NextRequest) {
  let client
  try {
    const body = await request.json()
    const { token, password } = body

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    client = await pool.connect()

    // Hash the token to find the user
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

    // Find user with valid reset token
    const userResult = await client.query(
      'SELECT id FROM users WHERE reset_token_hash = $1 AND reset_token_expires > NOW()',
      [tokenHash]
    )

    if (userResult.rows.length === 0) {
      console.log('[v0] Invalid or expired reset token')
      return NextResponse.json(
        { error: 'Reset link is invalid or has expired' },
        { status: 401 }
      )
    }

    const user = userResult.rows[0]

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Update password and clear reset token
    await client.query(
      'UPDATE users SET password_hash = $1, reset_token_hash = NULL, reset_token_expires = NULL WHERE id = $2',
      [hashedPassword, user.id]
    )

    console.log('[v0] Password reset successful for user:', user.id)

    return NextResponse.json(
      { success: true, message: 'Password reset successful' },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Reset password error:', error)
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    )
  } finally {
    if (client) {
      client.release()
    }
  }
}
