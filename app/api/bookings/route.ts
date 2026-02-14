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

    // TODO: Save to database when POSTGRES_URL is available
    // For now, just return success
    console.log('[v0] Booking received:', {
      service,
      date,
      time,
      name,
      email,
      phone,
      vehicle,
      notes,
      createdAt: new Date().toISOString(),
    })

    // In production, send confirmation email using Resend
    // await resend.emails.send({
    //   from: 'bookings@sleekspec.com',
    //   to: email,
    //   subject: 'Booking Confirmation - SleekSpec Auto Garage',
    //   html: `<p>Your booking has been confirmed for ${date} at ${time}</p>`
    // })

    return NextResponse.json(
      {
        success: true,
        message: 'Booking created successfully',
        bookingId: `BK${Date.now()}`,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[v0] Booking error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
