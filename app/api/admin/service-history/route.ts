import { NextRequest, NextResponse } from 'next/server'
import { Pool } from '@neondatabase/serverless'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const regNumber = searchParams.get('reg')

  if (!regNumber || regNumber.trim().length < 2) {
    return NextResponse.json(
      { error: 'Registration number is required (min 2 characters)' },
      { status: 400 }
    )
  }

  let client
  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL })
    client = await pool.connect()

    // Search for all bookings associated with this registration number
    const query = `
      SELECT 
        b.id,
        b.booking_date,
        b.status,
        b.total_price,
        b.notes,
        b.payment_status,
        b.payment_amount,
        b.created_at,
        c.first_name,
        c.last_name,
        c.email,
        c.phone,
        c.car_make,
        c.car_model,
        c.car_year,
        c.registration_number,
        COALESCE(s.name, 'See Notes') as service_name,
        s.base_price as service_price
      FROM bookings b
      JOIN customers c ON b.customer_id = c.id
      LEFT JOIN services s ON b.service_id = s.id
      WHERE UPPER(REPLACE(c.registration_number, ' ', '')) LIKE UPPER(REPLACE($1, ' ', ''))
      ORDER BY b.booking_date DESC
    `

    const result = await client.query(query, [`%${regNumber.trim()}%`])
    client.release()

    if (result.rows.length === 0) {
      return NextResponse.json({
        serviceHistory: [],
        vehicle: null,
        message: 'No service history found for this registration number'
      })
    }

    // Extract vehicle info from the first result
    const firstRecord = result.rows[0]
    const vehicle = {
      registration_number: firstRecord.registration_number,
      car_make: firstRecord.car_make,
      car_model: firstRecord.car_model,
      car_year: firstRecord.car_year,
      owner_name: `${firstRecord.first_name} ${firstRecord.last_name}`,
      owner_email: firstRecord.email,
      owner_phone: firstRecord.phone,
    }

    return NextResponse.json({
      serviceHistory: result.rows,
      vehicle,
      totalServices: result.rows.length
    })
  } catch (error) {
    if (client) client.release()
    console.error('[v0] Service history search error:', error)
    return NextResponse.json(
      { error: 'Failed to search service history' },
      { status: 500 }
    )
  }
}
