import { NextRequest, NextResponse } from 'next/server'
import { Pool } from '@neondatabase/serverless'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function GET() {
  let client
  try {
    client = await pool.connect()

    // Get all users
    const result = await client.query(`
      SELECT 
        id,
        email,
        role,
        password_hash,
        LENGTH(password_hash) as hash_length,
        SUBSTRING(password_hash, 1, 30) as hash_prefix,
        created_at
      FROM users
      ORDER BY created_at DESC
    `)

    const users = result.rows.map(row => ({
      id: row.id,
      email: row.email,
      role: row.role,
      hash_length: row.hash_length,
      hash_prefix: row.hash_prefix,
      hash_exists: !!row.password_hash,
      created_at: row.created_at,
      full_hash: row.password_hash // Include full hash for verification
    }))

    return NextResponse.json(
      {
        success: true,
        total_users: users.length,
        users: users
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Verification error:', error)
    return NextResponse.json(
      {
        error: 'Failed to retrieve user data',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  } finally {
    if (client) {
      client.release()
    }
  }
}
