import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/stripe/checkout
 * 
 * Creates a Stripe Checkout session for service payment
 * 
 * Request body:
 * {
 *   serviceId: string,
 *   serviceName: string,
 *   price: number,
 *   bookingId: string,
 *   customerEmail?: string,
 *   customerName?: string
 * }
 * 
 * Setup Instructions:
 * 1. Install Stripe: npm install stripe
 * 2. Add STRIPE_SECRET_KEY to .env.local
 * 3. Uncomment the Stripe code below
 * 4. Set up webhooks at https://dashboard.stripe.com/webhooks
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

    // TODO: Uncomment once Stripe is configured
    // To enable this, follow these steps:
    // 1. npm install stripe
    // 2. Add STRIPE_SECRET_KEY to .env.local
    // 3. Add NEXT_PUBLIC_BASE_URL to .env.local (e.g., https://yourdomain.com)
    // 4. Uncomment the code below

    /*
    import Stripe from 'stripe'

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
            currency: 'usd',
            product_data: {
              name: serviceName,
              description: `SleekSpec Auto Service: ${serviceName}`,
              metadata: {
                serviceId,
              },
            },
            unit_amount: Math.round(price * 100), // Convert dollars to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: customerEmail,
      client_reference_id: bookingId,
      success_url: `${baseUrl}/booking?success=true&bookingId=${bookingId}`,
      cancel_url: `${baseUrl}/booking?canceled=true&bookingId=${bookingId}`,
      metadata: {
        serviceId,
        serviceName,
        bookingId,
        customerName: customerName || 'Unknown',
      },
    })

    // Return checkout session
    return NextResponse.json(
      {
        success: true,
        sessionId: session.id,
        url: session.url,
      },
      { status: 200 }
    )
    */

    // Temporary response while Stripe is not configured
    return NextResponse.json(
      {
        success: false,
        message: 'Stripe is not yet configured. Please add STRIPE_SECRET_KEY to enable payments.',
        bookingId,
        amount: price,
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

