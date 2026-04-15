import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { Pool } from '@neondatabase/serverless'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

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

  console.log('[v0] Stripe webhook event received:', event.type)

  let client
  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL })
    client = await pool.connect()

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const bookingId = session.client_reference_id
      const customerEmail = session.customer_email
      const amount = session.amount_total! / 100 // Convert pence to pounds

      console.log('[v0] Payment successful for booking:', bookingId, 'Amount:', amount)

      if (bookingId) {
        // Update booking status to 'confirmed' and payment info in database
        await client.query(
          `UPDATE bookings 
           SET payment_status = $1, 
               payment_amount = $2, 
               stripe_session_id = $3, 
               status = $4,
               updated_at = NOW()
           WHERE id = $5`,
          ['paid', amount, session.id, 'confirmed', bookingId]
        )

        console.log('[v0] Booking updated successfully:', bookingId)
      }

      client.release()
      return NextResponse.json({ received: true }, { status: 200 })
    }

    if (event.type === 'charge.failed') {
      const charge = event.data.object as Stripe.Charge
      const bookingId = charge.metadata?.bookingId

      console.log('[v0] Payment failed for booking:', bookingId)

      if (bookingId) {
        // Update booking status to 'payment_failed'
        await client.query(
          `UPDATE bookings 
           SET payment_status = $1, 
               stripe_session_id = $2,
               updated_at = NOW()
           WHERE id = $3`,
          ['failed', charge.id, bookingId]
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
