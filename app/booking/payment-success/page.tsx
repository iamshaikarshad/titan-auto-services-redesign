'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle, Loader } from 'lucide-react'

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('bookingId')
  const sessionId = searchParams.get('sessionId')
  const [loading, setLoading] = useState(true)
  const [bookingDetails, setBookingDetails] = useState<any>(null)

  useEffect(() => {
    if (bookingId) {
      // Fetch booking details
      fetch(`/api/bookings/${bookingId}`)
        .then((res) => res.json())
        .then((data) => {
          setBookingDetails(data)
          setLoading(false)
        })
        .catch((error) => {
          console.error('Failed to fetch booking:', error)
          setLoading(false)
        })
    }
  }, [bookingId])

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <Loader className="w-8 h-8 text-gold-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-navy-800 border border-gold-500/20 rounded-2xl p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          
          <h1 className="text-4xl font-bold text-white mb-2">Payment Successful!</h1>
          <p className="text-gray-300 text-lg mb-6">
            Thank you for your payment. Your booking has been confirmed.
          </p>

          {bookingDetails && (
            <div className="bg-navy-900 rounded-lg p-6 mb-8 text-left">
              <h2 className="text-xl font-bold text-white mb-4">Booking Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Booking ID:</span>
                  <span className="text-white font-mono">{bookingId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Service:</span>
                  <span className="text-white">{bookingDetails.service_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount Paid:</span>
                  <span className="text-gold-500 font-bold">£{bookingDetails.total_price?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Booking Date:</span>
                  <span className="text-white">
                    {new Date(bookingDetails.booking_date).toLocaleDateString('en-GB', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-950/50 border border-blue-500/20 rounded-lg p-4 mb-8">
            <p className="text-blue-200">
              A confirmation email has been sent to your email address with all the booking details.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold"
            >
              <Link href="/booking">Make Another Booking</Link>
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
        </div>
      </div>
    </div>
  )
}
