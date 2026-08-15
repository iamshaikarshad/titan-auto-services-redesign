import { NextRequest, NextResponse } from 'next/server'
import { Pool } from '@neondatabase/serverless'
import { sendBookingNotification, sendBookingConfirmation } from '@/lib/email'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

// Map frontend service IDs to exact database service names
const serviceNames: Record<string, string> = {
  mot: 'PreMOT',
  servicing: 'Full Car Servicing',
  'full-servicing': 'Full Car Servicing',
  'interim-servicing': 'Interim Servicing',
  tyres: 'Tyre & Wheel Alignment',
  brakes: 'Brake Service & Repairs',
  diagnostics: 'Engine Diagnostics',
  aircon: 'General Repairs',
  exhaust: 'Exhaust System',
  suspension: 'Suspension',
  battery: 'Battery',
  other: null as any, // "other" doesn't have a predefined service in DB, will be stored in notes only
}

// Map session IDs to readable time slots
const sessionTimes: Record<string, string> = {
  morning: '09:00 – 12:00 (Morning Session)',
  afternoon: '13:00 – 17:00 (Afternoon Session)',
}

// Dynamic pricing for servicing based on fuel type, engine size, and service type
const servicingPrices: Record<string, Record<string, { interim: number; full: number }>> = {
  petrol: {
    'Up to 1000cc': { interim: 105, full: 205 },
    'Up to 1300cc': { interim: 145, full: 205 },
    'Up to 1600cc': { interim: 155, full: 205 },
    'Up to 2000cc': { interim: 165, full: 245 },
    'Up to 2500cc': { interim: 175, full: 250 },
    'Up to 3500cc': { interim: 195, full: 265 },
  },
  hybrid: {
    'Up to 1000cc': { interim: 140, full: 225 },
    'Up to 1300cc': { interim: 165, full: 235 },
    'Up to 1600cc': { interim: 175, full: 245 },
    'Up to 2000cc': { interim: 185, full: 255 },
    'Up to 2500cc': { interim: 195, full: 265 },
    'Up to 3500cc': { interim: 215, full: 285 },
    'Up to 4500cc': { interim: 235, full: 305 },
  },
}

function getServicingPrice(fuelType: string, engineSize: string, serviceType: 'interim' | 'full'): number | null {
  const fuel = servicingPrices[fuelType]
  if (!fuel) return null
  const engine = fuel[engineSize]
  if (!engine) return null
  return engine[serviceType]
}

export async function POST(request: NextRequest) {
  let client
  try {
    const body = await request.json()
    const { 
      service, 
      date, 
      time, 
      name, 
      email, 
      phone, 
      vehicle,
      registrationNumber,
      notes,
      tyreSize,
      fuelType,
      engineSize,
      serviceType,
      otherDescription
    } = body

    console.log('[v0] Booking request received:', { service, date, time, name, email, phone, vehicle, registrationNumber, fuelType, engineSize, serviceType })

    // Validate required fields
    if (!service || !date || !time || !name || !email || !phone || !vehicle) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate service type
    if (!serviceNames[service]) {
      return NextResponse.json(
        { error: 'Invalid service type' },
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

    // Validate date is in the future (at least 2 days ahead)
    const bookingDate = new Date(date)
    const minDate = new Date()
    minDate.setDate(minDate.getDate() + 2)
    minDate.setHours(0, 0, 0, 0)
    if (bookingDate < minDate) {
      return NextResponse.json(
        { error: 'Please select a date at least 2 days in advance' },
        { status: 400 }
      )
    }

    // Validate not a Sunday
    if (bookingDate.getDay() === 0) {
      return NextResponse.json(
        { error: 'We are closed on Sundays. Please select another day.' },
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
          'UPDATE customers SET first_name = $1, last_name = $2, phone = $3, car_make = $4, registration_number = $5, updated_at = NOW() WHERE id = $6',
          [firstName, lastName, phone, vehicle, registrationNumber || null, customerId]
        )
      } else {
        console.log('[v0] Creating new customer')
        
        // Create new customer
        const newCustomer = await client.query(
          'INSERT INTO customers (first_name, last_name, email, phone, car_make, registration_number) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
          [firstName, lastName, email, phone, vehicle, registrationNumber || null]
        )
        customerId = newCustomer.rows[0].id
        console.log('[v0] New customer created:', customerId)
      }

      // Build comprehensive notes with all service-specific details
      const serviceName = serviceNames[service]
      const sessionTime = sessionTimes[time] || time
      
      // Look up service_id from services table
      let serviceId = null
      let servicePrice = null
      
      if (serviceName) {
        const serviceResult = await client.query(
          'SELECT id, base_price FROM services WHERE name = $1',
          [serviceName]
        )
        
        if (serviceResult.rows.length > 0) {
          serviceId = serviceResult.rows[0].id
          // Use dynamic pricing for servicing based on fuel type, engine size, and service type
          const isServicing = service === 'full-servicing' || service === 'interim-servicing' || service === 'servicing'
          console.log('[v0] Price calculation check:', { isServicing, fuelType, engineSize, serviceType })
          if (isServicing && fuelType && engineSize && serviceType) {
            const dynamicPrice = getServicingPrice(fuelType, engineSize, serviceType as 'interim' | 'full')
            console.log('[v0] Dynamic price lookup result:', dynamicPrice)
            if (dynamicPrice !== null) {
              servicePrice = dynamicPrice
              console.log('[v0] Dynamic servicing price calculated:', servicePrice, 'for', fuelType, engineSize, serviceType)
            } else {
              // Fallback to database price if dynamic lookup fails
              servicePrice = serviceResult.rows[0].base_price
              console.log('[v0] Fallback to DB price (dynamic lookup returned null):', servicePrice)
            }
          } else {
            // Use database price for non-servicing services
            servicePrice = serviceResult.rows[0].base_price
            console.log('[v0] Using DB base price (not servicing or missing params):', servicePrice)
          }
          console.log('[v0] Service found:', serviceName, 'id:', serviceId, 'price:', servicePrice)
        } else {
          console.log('[v0] Service not found in database:', serviceName)
        }
      } else {
        // For "other" service type, we don't have a predefined service
        console.log('[v0] Service type is "other" - no predefined service_id')
      }
      
      let fullNotes = `Session: ${sessionTime}`
      
      if (service === 'tyres' && tyreSize) {
        fullNotes += `\nTyre Size: ${tyreSize}`
      }
      
      const isServicing = service === 'full-servicing' || service === 'interim-servicing' || service === 'servicing'
      if (isServicing && engineSize) {
        fullNotes += `\nService Type: ${serviceType === 'full' ? 'Full Service' : 'Interim Service'}`
        fullNotes += `\nFuel Type: ${fuelType === 'petrol' ? 'Petrol/Diesel' : 'Hybrid'}`
        fullNotes += `\nEngine Size: ${engineSize}`
      }
      
      if (service === 'other' && otherDescription) {
        fullNotes += `\nDescription: ${otherDescription}`
      }
      
      if (notes) {
        fullNotes += `\nAdditional Notes: ${notes}`
      }

      console.log('[v0] Creating booking for customer:', customerId, 'service:', service, 'service_id:', serviceId)

      // Set booking time based on session (use start of session for sorting)
      const sessionStartTime = time === 'morning' ? '09:00' : '13:00'
      const bookingDateTime = new Date(`${date}T${sessionStartTime}:00`)
      
      // Create booking with service_id and total_price
      const bookingResult = await client.query(
        'INSERT INTO bookings (customer_id, service_id, booking_date, notes, status, total_price) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, booking_date, total_price',
        [customerId, serviceId, bookingDateTime, fullNotes, 'pending', servicePrice]
      )

      const booking = bookingResult.rows[0]
      console.log('[v0] Booking created:', booking.id)

      // Commit transaction
      await client.query('COMMIT')

      // Fire off both booking emails — one internal notification to the
      // business inboxes, one confirmation to the customer. These are
      // intentionally awaited (rather than left unhandled) so both log
      // lines always complete before the serverless function is frozen,
      // but any failure inside either function is caught internally and
      // will never affect the booking response below.
      const emailPayload = {
        bookingId: booking.id,
        name,
        email,
        phone,
        vehicle,
        registrationNumber,
        serviceName: serviceName || 'Other',
        sessionTime,
        bookingDate: bookingDateTime,
        servicePrice,
        notes: fullNotes,
      }
      await Promise.all([
        sendBookingNotification(emailPayload),
        sendBookingConfirmation(emailPayload),
      ])

      return NextResponse.json(
        {
          success: true,
          bookingId: booking.id,
          message: 'Booking confirmed! We will contact you shortly.',
          booking: {
            id: booking.id,
            date: booking.booking_date,
            service: serviceName,
            session: sessionTime,
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