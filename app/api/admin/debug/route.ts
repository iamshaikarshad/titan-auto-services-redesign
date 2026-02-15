import { NextRequest, NextResponse } from 'next/server'
import { Pool } from '@neondatabase/serverless'
import bcrypt from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function GET() {
  let client
  try {
    client = await pool.connect()

    console.log('[v0] Debug: Checking users table...')

    // Check all users
    const allUsers = await client.query('SELECT id, email, role, password_hash FROM users LIMIT 10')
    console.log('[v0] All users:', allUsers.rows)

    // Check admin users specifically
    const adminUsers = await client.query('SELECT id, email, role, password_hash FROM users WHERE role = $1', ['admin'])
    console.log('[v0] Admin users:', adminUsers.rows)

    // Test bcrypt with known hash
    const testPassword = 'admin123'
    if (adminUsers.rows.length > 0) {
      const user = adminUsers.rows[0]
      console.log('[v0] Testing bcrypt with user:', user.email)
      console.log('[v0] Password hash from DB:', user.password_hash)
      console.log('[v0] Password hash type:', typeof user.password_hash)
      console.log('[v0] Password hash length:', user.password_hash?.length)

      const isValid = await bcrypt.compare(testPassword, user.password_hash)
      console.log('[v0] bcrypt.compare result:', isValid)

      return NextResponse.json({
        success: true,
        debug: {
          usersCount: allUsers.rows.length,
          adminUsersCount: adminUsers.rows.length,
          adminUser: {
            id: user.id,
            email: user.email,
            role: user.role,
            passwordHashType: typeof user.password_hash,
            passwordHashLength: user.password_hash?.length,
            passwordHashPrefix: user.password_hash?.substring(0, 20),
          },
          bcryptTest: {
            testPassword,
            passwordMatches: isValid,
          },
        },
        allUsers: allUsers.rows.map(u => ({
          id: u.id,
          email: u.email,
          role: u.role,
          hashLength: u.password_hash?.length,
        })),
      })
    }

    return NextResponse.json({
      success: false,
      message: 'No admin users found',
      allUsers: allUsers.rows,
    })
  } catch (error) {
    console.error('[v0] Debug error:', error)
    return NextResponse.json(
      { error: 'Debug failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  } finally {
    if (client) {
      client.release()
    }
  }
}
