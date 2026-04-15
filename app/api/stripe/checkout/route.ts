import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

/**
 * POST /api/stripe/checkout
 * 
 * Creates a Stripe Checkout session for service payment
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { serviceId, serviceName, price, bookingId, customerEmail, customerName } = body

    // Validate required fields
    if (!serviceId || !serviceName || !price || !bookingId) {
      return NextResponse.json(
        { error: 'Missing required fields: serviceId, serviceName, price, bookingId' },
        { status: 400 }
      )
    }

    // Validate price is a positive number
    if (typeof price !== 'number' || price <= 0) {
      return NextResponse.json(
        { error: 'Price must be a positive number' },
        { status: 400 }
      )
    }

    console.log('[v0] Stripe checkout session requested:', {
      serviceId,
      serviceName,
      price,
      bookingId,
      customerEmail,
    })

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('[v0] STRIPE_SECRET_KEY not configured')
      return NextResponse.json(
        { error: 'Payment processing not configured' },
        { status: 500 }
      )
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    })

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: serviceName,
              description: `Titan Auto Services: ${serviceName}`,
              metadata: {
                serviceId,
              },
            },
            unit_amount: Math.round(price * 100), // Convert pounds to pence
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: customerEmail,
      client_reference_id: bookingId,
      success_url: `${baseUrl}/booking/payment-success?bookingId=${bookingId}&sessionId={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/booking/payment-cancel?bookingId=${bookingId}`,
      metadata: {
        serviceId,
        serviceName,
        bookingId,
        customerName: customerName || 'Unknown',
      },
    })

    console.log('[v0] Stripe checkout session created:', session.id)

    // Return checkout session
    return NextResponse.json(
      {
        success: true,
        sessionId: session.id,
        url: session.url,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Stripe checkout error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    
    return NextResponse.json(
      { 
        error: 'Failed to create checkout session',
        details: errorMessage,
      },
      { status: 500 }
    )
  }
}

