import { NextRequest, NextResponse } from 'next/server'
import { Pool } from '@neondatabase/serverless'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(request: NextRequest) {
  let client
  try {
    const body = await request.json()
    const { service, date, time, name, email, phone, vehicle, notes } = body

    console.log('[v0] Booking request received:', { service, date, time, name, email, phone, vehicle })

    // Validate required fields
    if (!service || !date || !time || !name || !email || !phone || !vehicle) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Validate phone format (basic)
    const phoneRegex = /^[\d\s\-\(\)]+$/
    if (!phoneRegex.test(phone) || phone.replace(/\D/g, '').length < 10) {
      return NextResponse.json(
        { error: 'Invalid phone number' },
        { status: 400 }
      )
    }

    // Validate date is in the future
    const bookingDate = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (bookingDate < today) {
      return NextResponse.json(
        { error: 'Please select a future date' },
        { status: 400 }
      )
    }

    console.log('[v0] Connecting to database...')
    client = await pool.connect()
    console.log('[v0] Database connected')
    
    // Start transaction
    await client.query('BEGIN')

    try {
      // Split name into first and last
      const nameParts = name.trim().split(' ')
      const firstName = nameParts[0]
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : ''

      console.log('[v0] Checking for existing customer:', email)
      
      // Check if customer exists, if not create one
      const customerResult = await client.query(
        'SELECT id FROM customers WHERE email = $1',
        [email]
      )

      let customerId
      if (customerResult.rows.length > 0) {
        customerId = customerResult.rows[0].id
        console.log('[v0] Existing customer found:', customerId)
        
        // Update existing customer
        await client.query(
          'UPDATE customers SET first_name = $1, last_name = $2, phone = $3, car_make = $4, updated_at = NOW() WHERE id = $5',
          [firstName, lastName, phone, vehicle, customerId]
        )
      } else {
        console.log('[v0] Creating new customer')
        
        // Create new customer
        const newCustomer = await client.query(
          'INSERT INTO customers (first_name, last_name, email, phone, car_make) VALUES ($1, $2, $3, $4, $5) RETURNING id',
          [firstName, lastName, email, phone, vehicle]
        )
        customerId = newCustomer.rows[0].id
        console.log('[v0] New customer created:', customerId)
      }

      console.log('[v0] Creating booking for customer:', customerId, 'service:', service)

      // Combine date and time into a timestamp
      const bookingDateTime = new Date(`${date}T${time}`)
      
      // Create booking
      const bookingResult = await client.query(
        'INSERT INTO bookings (customer_id, service_id, booking_date, booking_time, notes, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, booking_date',
        [customerId, parseInt(service), bookingDateTime, time, notes || null, 'pending']
      )

      const booking = bookingResult.rows[0]
      console.log('[v0] Booking created:', booking.id)

      // Commit transaction
      await client.query('COMMIT')

      return NextResponse.json(
        {
          success: true,
          bookingId: booking.id,
          message: 'Booking confirmed! We will contact you shortly.',
          booking: {
            id: booking.id,
            date: booking.booking_date,
          },
        },
        { status: 201 }
      )
    } catch (error) {
      console.log('[v0] Error in transaction, rolling back:', error)
      await client.query('ROLLBACK')
      throw error
    }
  } catch (error) {
    console.error('[v0] Booking error:', error instanceof Error ? error.message : error)
    console.error('[v0] Full error:', error)
    return NextResponse.json(
      { error: 'Failed to create booking. Please try again.' },
      { status: 500 }
    )
  } finally {
    if (client) {
      client.release()
    }
  }
}

export async function GET(request: NextRequest) {
  let client
  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customerId')

    client = await pool.connect()

    let query = 'SELECT b.*, c.first_name, c.last_name, c.email, c.phone FROM bookings b JOIN customers c ON b.customer_id = c.id'
    const params = []

    if (customerId) {
      query += ' WHERE b.customer_id = $1'
      params.push(customerId)
    }

    query += ' ORDER BY b.booking_date DESC'

    const result = await client.query(query, params)

    return NextResponse.json(
      {
        success: true,
        count: result.rows.length,
        bookings: result.rows,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Booking retrieval error:', error)
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

