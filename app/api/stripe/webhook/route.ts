import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const bookingId = session.client_reference_id
      const customerEmail = session.customer_email
      const amount = session.amount_total! / 100 // Convert pence to pounds

      console.log('[v0] Payment successful for booking:', bookingId, 'Amount:', amount)

      if (bookingId) {
        // Update booking status to 'paid' in database
        const { error } = await supabase
          .from('bookings')
          .update({
            payment_status: 'paid',
            payment_amount: amount,
            stripe_session_id: session.id,
            status: 'confirmed', // Auto-confirm booking after payment
          })
          .eq('id', bookingId)

        if (error) {
          console.error('[v0] Failed to update booking:', error)
        } else {
          console.log('[v0] Booking updated successfully:', bookingId)
        }
      }

      return NextResponse.json({ received: true }, { status: 200 })
    }

    if (event.type === 'charge.failed') {
      const charge = event.data.object as Stripe.Charge
      const bookingId = charge.metadata?.bookingId

      console.log('[v0] Payment failed for booking:', bookingId)

      if (bookingId) {
        // Update booking status to 'payment_failed'
        await supabase
          .from('bookings')
          .update({
            payment_status: 'failed',
            stripe_session_id: charge.id,
          })
          .eq('id', bookingId)
      }

      return NextResponse.json({ received: true }, { status: 200 })
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error('[v0] Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
