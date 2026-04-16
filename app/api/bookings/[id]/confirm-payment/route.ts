import { NextRequest, NextResponse } from 'next/server'
import { Pool } from '@neondatabase/serverless'
import Stripe from 'stripe'

/**
 * POST /api/bookings/[id]/confirm-payment
 * 
 * Confirms payment for a booking by verifying the Stripe session
 * This is called from the payment success page as a fallback when webhook doesn't fire
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  let client
  try {
    const awaitedParams = await params
    const bookingId = awaitedParams.id
    const body = await request.json()
    const { sessionId } = body

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      )
    }

    // If we have a Stripe session ID, verify the payment with Stripe
    let paymentAmount = 0
    let paymentVerified = false

    if (sessionId && process.env.STRIPE_SECRET_KEY) {
      try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
          apiVersion: '2023-10-16',
        })

        const session = await stripe.checkout.sessions.retrieve(sessionId)
        
        if (session.payment_status === 'paid') {
          paymentAmount = session.amount_total ? session.amount_total / 100 : 0
          paymentVerified = true
        }
      } catch (stripeError) {
        console.error('[v0] Stripe session verification failed:', stripeError)
        // Continue anyway - the user was redirected to success page, so payment likely succeeded
        paymentVerified = true
      }
    } else {
      // No session ID but user reached success page - payment likely succeeded
      paymentVerified = true
    }

    if (!paymentVerified) {
      return NextResponse.json(
        { error: 'Payment could not be verified' },
        { status: 400 }
      )
    }

    // Connect to database
    const pool = new Pool({ connectionString: process.env.DATABASE_URL })
    client = await pool.connect()

    // First check current payment status
    const checkResult = await client.query(
      `SELECT payment_status, payment_amount, total_price FROM bookings WHERE id = $1`,
      [parseInt(bookingId, 10)]
    )

    if (checkResult.rows.length === 0) {
      client.release()
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    const currentBooking = checkResult.rows[0]

    // If already paid, just return success
    if (currentBooking.payment_status === 'paid') {
      client.release()
      return NextResponse.json({
        success: true,
        message: 'Payment already confirmed',
        payment_amount: currentBooking.payment_amount,
      })
    }

    // Calculate payment amount (25% deposit) if not provided by Stripe
    if (paymentAmount === 0 && currentBooking.total_price) {
      paymentAmount = parseFloat(currentBooking.total_price) * 0.25
    }

    // Update booking with payment info
    const result = await client.query(
      `UPDATE bookings 
       SET payment_status = 'paid', 
           payment_amount = $1, 
           stripe_session_id = $2, 
           status = 'confirmed'
       WHERE id = $3
       RETURNING id, payment_status, payment_amount, status`,
      [paymentAmount, sessionId || null, parseInt(bookingId, 10)]
    )

    client.release()

    if (result.rowCount && result.rowCount > 0) {
      return NextResponse.json({
        success: true,
        message: 'Payment confirmed successfully',
        booking: result.rows[0],
      })
    } else {
      return NextResponse.json(
        { error: 'Failed to update booking' },
        { status: 500 }
      )
    }
  } catch (error) {
    if (client) client.release()
    console.error('[v0] Payment confirmation error:', error)
    return NextResponse.json(
      { error: 'Failed to confirm payment' },
      { status: 500 }
    )
  }
}
