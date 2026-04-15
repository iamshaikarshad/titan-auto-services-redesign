import { NextRequest, NextResponse } from 'next/server'
import { Pool } from '@neondatabase/serverless'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  let client
  try {
    const awaitedParams = await params
    const bookingId = awaitedParams.id

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      )
    }

    // Connect to database
    const pool = new Pool({ connectionString: process.env.DATABASE_URL })
    client = await pool.connect()

    // Fetch booking details with customer and service info
    const result = await client.query(
      `SELECT 
        b.id, 
        b.customer_id, 
        b.service_id, 
        s.name as service_name, 
        b.total_price, 
        b.booking_date, 
        b.notes as booking_time,
        b.status, 
        CONCAT(c.first_name, ' ', c.last_name) as customer_name, 
        c.email as customer_email, 
        c.phone as customer_phone, 
        c.car_make as vehicle, 
        c.registration_number, 
        b.notes, 
        b.created_at
      FROM bookings b
      LEFT JOIN customers c ON b.customer_id = c.id
      LEFT JOIN services s ON b.service_id = s.id
      WHERE b.id = $1`,
      [bookingId]
    )

    if (result.rows.length === 0) {
      client.release()
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    const booking = result.rows[0]
    client.release()

    return NextResponse.json(booking, { status: 200 })
  } catch (error) {
    if (client) client.release()
    console.error('[v0] Error fetching booking:', error)
    return NextResponse.json(
      { error: 'Failed to fetch booking details' },
      { status: 500 }
    )
  }
}
