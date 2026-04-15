import { NextRequest, NextResponse } from 'next/server'
import { Pool } from '@neondatabase/serverless'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  let client
  try {
    const bookingId = params.id

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      )
    }

    // Connect to database
    const pool = new Pool({ connectionString: process.env.DATABASE_URL })
    client = await pool.connect()

    // Fetch booking details from database
    const result = await client.query(
      `SELECT 
        id, 
        customer_id, 
        service_id, 
        service_name, 
        total_price, 
        booking_date, 
        booking_time, 
        status, 
        customer_name, 
        customer_email, 
        customer_phone, 
        vehicle, 
        registration_number, 
        notes, 
        created_at,
        payment_status,
        payment_amount,
        stripe_session_id
      FROM bookings 
      WHERE id = $1`,
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
