import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const { service, date, time, name, email, phone, vehicle, notes } = body

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
    if (bookingDate < new Date()) {
      return NextResponse.json(
        { error: 'Please select a future date' },
        { status: 400 }
      )
    }

    // Create booking record
    const bookingId = `BK${Date.now()}`
    const booking = {
      id: bookingId,
      service,
      date,
      time,
      name,
      email,
      phone,
      vehicle,
      notes,
      createdAt: new Date().toISOString(),
      status: 'pending',
    }

    console.log('[v0] Booking created:', booking)

    // TODO: In production with database:
    // 1. Save to database
    // 2. Send confirmation email via Resend
    // 3. Send admin notification email
    // 4. Schedule reminder email for 24 hours before

    return NextResponse.json(
      {
        success: true,
        bookingId,
        message: 'Booking confirmed! Confirmation email sent.',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[v0] Booking error:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Bookings API',
    methods: ['POST'],
  })
}

