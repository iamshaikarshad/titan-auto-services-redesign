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
        { error: 'Email and password required' },
        { status: 400 }
      )
    }

    // Generate correct bcrypt hash
    console.log('[v0] Generating bcrypt hash for password:', password)
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)
    
    console.log('[v0] Generated hash:', passwordHash)

    client = await pool.connect()

    // Update user with new hash
    const result = await client.query(
      'UPDATE users SET password_hash = $1 WHERE email = $2 AND role = $3 RETURNING *',
      [passwordHash, email, 'admin']
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Admin user not found' },
        { status: 404 }
      )
    }

    console.log('[v0] Updated admin password for:', email)

    // Now verify the hash works
    const verifyTest = await bcrypt.compare(password, passwordHash)
    console.log('[v0] Verification test:', verifyTest)

    return NextResponse.json(
      {
        success: true,
        message: 'Admin password updated successfully',
        email: result.rows[0].email,
        hash: passwordHash,
        verification: verifyTest
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Setup error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Setup failed' },
      { status: 500 }
    )
  } finally {
    if (client) {
      client.release()
    }
  }
}
