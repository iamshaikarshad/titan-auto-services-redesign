import { NextRequest, NextResponse } from 'next/server'
import { Pool } from '@neondatabase/serverless'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function GET(request: NextRequest) {
  let client
  try {
    client = await pool.connect()
    
    const query = `
      SELECT 
        b.id,
        b.customer_id,
        b.service_id,
        b.booking_date,
        b.assigned_technician_id,
        b.status,
        b.total_price,
        b.notes,
        c.first_name,
        c.last_name,
        c.email,
        c.phone
      FROM bookings b
      JOIN customers c ON b.customer_id = c.id
      ORDER BY b.booking_date DESC
    `
    
    const result = await client.query(query)
    
    console.log('[v0] Fetched bookings:', result.rows.length)
    
    return NextResponse.json(
      {
        success: true,
        count: result.rows.length,
        bookings: result.rows,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Admin bookings error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve bookings' },
      { status: 500 }
    )
  } finally {
    if (client) {
      client.release()
    }
  }
}
