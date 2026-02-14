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
        c.phone,
        c.car_make,
        c.car_model,
        c.car_year,
        c.registration_number,
        c.address,
        c.city,
        c.postal_code,
        s.name as service_name,
        s.price as service_price
      FROM bookings b
      JOIN customers c ON b.customer_id = c.id
      LEFT JOIN services s ON b.service_id = s.id
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

export async function PUT(request: NextRequest) {
  let client
  try {
    const body = await request.json()
    const { bookingId, status } = body

    if (!bookingId || !status) {
      return NextResponse.json(
        { error: 'Missing bookingId or status' },
        { status: 400 }
      )
    }

    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    client = await pool.connect()

    const query = 'UPDATE bookings SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *'
    const result = await client.query(query, [status, bookingId])

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    console.log('[v0] Booking status updated:', bookingId, 'to', status)

    return NextResponse.json(
      {
        success: true,
        message: 'Booking status updated successfully',
        booking: result.rows[0],
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Update booking error:', error)
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    )
  } finally {
    if (client) {
      client.release()
    }
  }
}
