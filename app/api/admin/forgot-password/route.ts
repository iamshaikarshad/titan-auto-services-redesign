import { NextRequest, NextResponse } from 'next/server'
import { Pool } from '@neondatabase/serverless'
import crypto from 'crypto'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(request: NextRequest) {
  let client
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    client = await pool.connect()

    // Check if admin user exists
    const userResult = await client.query(
      'SELECT id FROM users WHERE email = $1 AND role = $2',
      [email, 'admin']
    )

    if (userResult.rows.length === 0) {
      // Don't reveal if email exists for security
      console.log('[v0] Forgot password request for non-existent email:', email)
      return NextResponse.json(
        { success: true, message: 'If an admin account exists, a reset link will be sent' },
        { status: 200 }
      )
    }

    const user = userResult.rows[0]

    // Generate reset token (valid for 1 hour)
    const resetToken = crypto.randomBytes(32).toString('hex')
    const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Store token in database
    await client.query(
      'UPDATE users SET reset_token_hash = $1, reset_token_expires = $2 WHERE id = $3',
      [tokenHash, expiresAt, user.id]
    )

    // In production, you would send an email here with the reset link
    // For now, we'll log it and return the token for development
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/reset-password?token=${resetToken}`
    console.log('[v0] Password reset link:', resetLink)

    // TODO: Send email with reset link
    // await sendPasswordResetEmail(email, resetLink)

    return NextResponse.json(
      { success: true, message: 'Password reset link sent', resetLink }, // Remove resetLink in production
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Forgot password error:', error)
    return NextResponse.json(
      { error: 'Failed to process forgot password request' },
      { status: 500 }
    )
  } finally {
    if (client) {
      client.release()
    }
  }
}
