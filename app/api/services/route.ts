import { NextResponse } from 'next/server'
import { Pool } from '@neondatabase/serverless'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function GET() {
  let client
  try {
    client = await pool.connect()
    
    const result = await client.query(
      'SELECT id, name, description, price FROM services ORDER BY name ASC'
    )

    return NextResponse.json(
      {
        success: true,
        services: result.rows,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Services retrieval error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve services' },
      { status: 500 }
    )
  } finally {
    if (client) {
      client.release()
    }
  }
}
