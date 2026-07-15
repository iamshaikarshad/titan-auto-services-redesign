import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { Pool } from '@neondatabase/serverless'

export async function POST(request: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
  })

  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    console.error('[v0] No stripe-signature header')
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('[v0] Webhook signature verification failed:', error)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  console.log('[v0] Stripe webhook event received:', event.type, event.id)

  let client
  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL })
    client = await pool.connect()

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const bookingId = session.client_reference_id
      const amount = session.amount_total ? session.amount_total / 100 : 0

      console.log('[v0] Payment successful - Session ID:', session.id)
      console.log('[v0] Booking ID from session:', bookingId)
      console.log('[v0] Amount paid:', amount)
      console.log('[v0] Customer email:', session.customer_email)
      console.log('[v0] Session metadata:', session.metadata)

      if (bookingId) {
        // Update booking by ID
        const result = await client.query(
          `UPDATE bookings 
           SET payment_status = $1, 
               payment_amount = $2, 
               stripe_session_id = $3, 
               status = $4
           WHERE id = $5
           RETURNING id, payment_status, payment_amount`,
          ['paid', amount, session.id, 'confirmed', parseInt(bookingId, 10)]
        )

        if (result.rowCount && result.rowCount > 0) {
          console.log('[v0] Booking updated successfully:', result.rows[0])
        } else {
          console.log('[v0] No booking found with ID:', bookingId)
          // Try to find by customer email as fallback - most recent pending booking
          if (session.customer_email) {
            const fallbackResult = await client.query(
              `UPDATE bookings b
               SET payment_status = 'paid', 
                   payment_amount = $1, 
                   stripe_session_id = $2, 
                   status = 'confirmed'
               FROM customers c
               WHERE b.customer_id = c.id 
               AND c.email = $3
               AND b.payment_status IS NULL OR b.payment_status = 'pending'
               AND b.id = (
                 SELECT id FROM bookings b2 
                 JOIN customers c2 ON b2.customer_id = c2.id 
                 WHERE c2.email = $3 
                 ORDER BY b2.created_at DESC LIMIT 1
               )
               RETURNING b.id, b.payment_status, b.payment_amount`,
              [amount, session.id, session.customer_email]
            )
            if (fallbackResult.rowCount && fallbackResult.rowCount > 0) {
              console.log('[v0] Booking updated via email fallback:', fallbackResult.rows[0])
            } else {
              console.log('[v0] No pending booking found for email:', session.customer_email)
            }
          }
        }
      } else {
        console.log('[v0] No booking ID in session, cannot update')
      }

      client.release()
      return NextResponse.json({ received: true }, { status: 200 })
    }

    if (event.type === 'charge.failed') {
      const charge = event.data.object as Stripe.Charge
      const bookingId = charge.metadata?.bookingId

      console.log('[v0] Payment failed for booking:', bookingId)

      if (bookingId) {
        await client.query(
          `UPDATE bookings 
           SET payment_status = $1, 
               stripe_session_id = $2
           WHERE id = $3`,
          ['failed', charge.id, parseInt(bookingId, 10)]
        )
      }

      client.release()
      return NextResponse.json({ received: true }, { status: 200 })
    }

    client.release()
    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    if (client) client.release()
    console.error('[v0] Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
