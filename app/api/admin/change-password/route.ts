import { NextRequest, NextResponse } from 'next/server'
import { Pool } from '@neondatabase/serverless'
import bcrypt from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(request: NextRequest) {
  let client
  try {
    const body = await request.json()
    const { currentPassword, newPassword } = body

    // Get email from cookie/auth
    const authCookie = request.cookies.get('adminAuth')
    
    if (!authCookie) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current and new passwords are required' },
        { status: 400 }
      )
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'New password must be at least 8 characters' },
        { status: 400 }
      )
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        { error: 'New password must be different from current password' },
        { status: 400 }
      )
    }

    // For this API, we need a way to identify the user
    // In a real app, you'd store user_id in the auth cookie or use a session store
    // For now, we'll assume only one admin user exists
    client = await pool.connect()

    const result = await client.query(
      'SELECT id, password_hash FROM users WHERE role = $1 LIMIT 1',
      ['admin']
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Admin user not found' },
        { status: 404 }
      )
    }

    const user = result.rows[0]

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash)

    if (!isCurrentPasswordValid) {
      console.log('[v0] Invalid current password attempt')
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      )
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // Update password
    await client.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [hashedPassword, user.id]
    )

    console.log('[v0] Password changed successfully')

    return NextResponse.json(
      { success: true, message: 'Password changed successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Change password error:', error)
    return NextResponse.json(
      { error: 'Failed to change password' },
      { status: 500 }
    )
  } finally {
    if (client) {
      client.release()
    }
  }
}
