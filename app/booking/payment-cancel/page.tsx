'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { XCircle } from 'lucide-react'

export default function PaymentCancelPage() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('bookingId')

  return (
    <div className="min-h-screen bg-navy-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-navy-800 border border-gold-500/20 rounded-2xl p-8 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          
          <h1 className="text-4xl font-bold text-white mb-2">Payment Cancelled</h1>
          <p className="text-gray-300 text-lg mb-6">
            Your payment was cancelled. Your booking has not been completed.
          </p>

          <div className="bg-red-950/30 border border-red-500/20 rounded-lg p-4 mb-8">
            <p className="text-red-200">
              If you encountered any issues during payment, please try again or contact our support team.
            </p>
          </div>

          {bookingId && (
            <div className="bg-navy-900 rounded-lg p-6 mb-8">
              <p className="text-gray-400">
                Booking Reference: <span className="text-white font-mono">{bookingId}</span>
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold"
            >
              <Link href="/booking">Try Again</Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-navy-950"
            >
              <Link href="/">Return Home</Link>
            </Button>
          </div>

          <div className="mt-8 pt-8 border-t border-gold-500/20">
            <p className="text-gray-400">
              Need help? <a href="tel:01622438114" className="text-gold-500 hover:text-gold-400">Call us at 01622 438114</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
