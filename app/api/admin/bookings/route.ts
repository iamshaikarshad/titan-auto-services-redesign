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
        b.created_at,
        b.updated_at,
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
        COALESCE(s.name, 'See Notes') as service_name,
        s.base_price as service_price
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
      { error: 'Failed to retrieve bookings', details: error instanceof Error ? error.message : String(error) },
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
    const { bookingId, status, totalPrice, notes } = body

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Missing bookingId' },
        { status: 400 }
      )
    }

    // Validate status if provided
    if (status) {
      const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled']
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: 'Invalid status' },
          { status: 400 }
        )
      }
    }

    client = await pool.connect()

    // Build dynamic update query based on provided fields
    const updates: string[] = []
    const values: (string | number | null)[] = []
    let paramIndex = 1

    if (status) {
      updates.push(`status = $${paramIndex}`)
      values.push(status)
      paramIndex++
    }

    if (totalPrice !== undefined) {
      updates.push(`total_price = $${paramIndex}`)
      values.push(totalPrice)
      paramIndex++
    }

    if (notes !== undefined) {
      updates.push(`notes = $${paramIndex}`)
      values.push(notes)
      paramIndex++
    }

    updates.push('updated_at = NOW()')
    values.push(bookingId)

    const query = `UPDATE bookings SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`
    const result = await client.query(query, values)

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    console.log('[v0] Booking updated:', bookingId, { status, totalPrice, notes: notes ? 'updated' : 'unchanged' })

    return NextResponse.json(
      {
        success: true,
        message: 'Booking updated successfully',
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
