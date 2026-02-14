/**
 * Stripe Integration Utilities
 * 
 * This module provides utilities for Stripe payment processing integration.
 * 
 * Setup Instructions:
 * 1. Create a Stripe account at https://stripe.com
 * 2. Get your API keys from https://dashboard.stripe.com/apikeys
 * 3. Add these to your .env.local file:
 *    - STRIPE_SECRET_KEY=sk_live_... (or sk_test_... for testing)
 *    - STRIPE_PUBLISHABLE_KEY=pk_live_... (or pk_test_... for testing)
 *    - STRIPE_WEBHOOK_SECRET=whsec_...
 * 4. Set up webhooks in Stripe dashboard pointing to /api/webhooks/stripe
 * 
 * For testing, use Stripe test card: 4242 4242 4242 4242
 */

export interface CheckoutSessionParams {
  serviceId: string
  serviceName: string
  price: number
  bookingId: string
  customerEmail?: string
  customerName?: string
}

export interface PaymentIntentParams {
  amount: number // Amount in cents
  currency: string
  description: string
  metadata?: Record<string, string>
}

/**
 * Create a Stripe checkout session
 * This function should be called from the server (API route)
 */
export async function createCheckoutSession(params: CheckoutSessionParams) {
  // This function should be implemented in your API route
  // using the Stripe Node.js library
  //
  // Example:
  // import Stripe from 'stripe'
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  // 
  // const session = await stripe.checkout.sessions.create({
  //   payment_method_types: ['card'],
  //   line_items: [
  //     {
  //       price_data: {
  //         currency: 'usd',
  //         product_data: {
  //           name: params.serviceName,
  //           description: `Auto repair service: ${params.serviceName}`,
  //         },
  //         unit_amount: Math.round(params.price * 100),
  //       },
  //       quantity: 1,
  //     },
  //   ],
  //   mode: 'payment',
  //   customer_email: params.customerEmail,
  //   success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking?success=true`,
  //   cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking?canceled=true`,
  //   metadata: {
  //     serviceId: params.serviceId,
  //     bookingId: params.bookingId,
  //   },
  // })
  //
  // return session
}

/**
 * Format price for Stripe (convert to cents)
 */
export function formatPriceForStripe(price: number): number {
  return Math.round(price * 100)
}

/**
 * Format price for display (convert from cents)
 */
export function formatPriceForDisplay(priceCents: number): number {
  return priceCents / 100
}

/**
 * Verify webhook signature from Stripe
 * Use this in your webhook handler
 */
export function verifyStripeWebhookSignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  // This should be implemented using Stripe's webhook verification
  // Example:
  // import Stripe from 'stripe'
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  //
  // try {
  //   const event = stripe.webhooks.constructEvent(body, signature, secret)
  //   return true
  // } catch (err) {
  //   return false
  // }

  return false // Replace with actual implementation
}

/**
 * Stripe test credentials (for development)
 * Replace with production credentials in .env.local
 */
export const STRIPE_TEST_CARDS = {
  VISA: '4242 4242 4242 4242',
  VISA_DEBIT: '4000 0566 5566 5556',
  MASTERCARD: '5555 5555 5555 4444',
  AMEX: '3782 822463 10005',
  DISCOVER: '6011 1111 1111 1117',
  DECLINED: '4000 0000 0000 0002',
}

/**
 * Webhooks to handle:
 * - charge.succeeded - Payment successful
 * - charge.failed - Payment failed
 * - charge.refunded - Payment refunded
 * - customer.subscription.updated - Subscription changed
 * - customer.subscription.deleted - Subscription canceled
 */

export const STRIPE_WEBHOOK_EVENTS = {
  CHARGE_SUCCEEDED: 'charge.succeeded',
  CHARGE_FAILED: 'charge.failed',
  CHECKOUT_SESSION_COMPLETED: 'checkout.session.completed',
  PAYMENT_INTENT_SUCCEEDED: 'payment_intent.succeeded',
  PAYMENT_INTENT_PAYMENT_FAILED: 'payment_intent.payment_failed',
}
