'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

const services = [
  { id: 'oil-change', name: 'Oil Change', price: 49.99 },
  { id: 'brake-service', name: 'Brake Service', price: 129.99 },
  { id: 'tire-service', name: 'Tire Service', price: 79.99 },
  { id: 'engine-diagnostics', name: 'Engine Diagnostics', price: 89.99 },
  { id: 'battery-replacement', name: 'Battery Replacement', price: 99.99 },
  { id: 'transmission-service', name: 'Transmission Service', price: 149.99 },
  { id: 'ac-service', name: 'AC Service', price: 119.99 },
  { id: 'suspension-repair', name: 'Suspension Repair', price: 159.99 },
]

const timeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM'
]

interface BookingFormData {
  service: string
  date: string
  time: string
  name: string
  email: string
  phone: string
  vehicle: string
  notes: string
}

export default function BookingPage() {
  const [step, setStep] = useState<'service' | 'datetime' | 'contact' | 'confirmation'>('service')
  const [formData, setFormData] = useState<BookingFormData>({
    service: '',
    date: '',
    time: '',
    name: '',
    email: '',
    phone: '',
    vehicle: '',
    notes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Get service from URL params if available
    const params = new URLSearchParams(window.location.search)
    const serviceParam = params.get('service')
    if (serviceParam && services.find(s => s.id === serviceParam)) {
      setFormData(prev => ({ ...prev, service: serviceParam }))
    }
  }, [])

  const selectedService = services.find(s => s.id === formData.service)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to create booking')
      }

      setStep('confirmation')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isStepValid = {
    service: formData.service !== '',
    datetime: formData.date !== '' && formData.time !== '',
    contact: formData.name !== '' && formData.email !== '' && formData.phone !== '' && formData.vehicle !== '',
  }

  const handlePayment = async () => {
    if (!selectedService) return

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: formData.service,
          serviceName: selectedService.name,
          price: selectedService.price * 0.25, // 25% deposit
          bookingId: `BK${Date.now()}`,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const data = await response.json()
      
      // In production, redirect to Stripe checkout
      if (data.sessionId) {
        window.location.href = `https://checkout.stripe.com/pay/${data.sessionId}`
      } else {
        alert('Payment processing is not yet configured. Please pay in person at the garage.')
      }
    } catch (err) {
      alert('Error processing payment. Please try again or pay in person.')
      console.error('[v0] Payment error:', err)
    }
  }

  return (
    <>
      <Header />
      <main>
        {/* Page Header */}
        <section className="py-12 md:py-16 bg-slate-900 text-white">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Book Your Service</h1>
            <p className="text-xl text-slate-300">
              Schedule your appointment in just a few steps.
            </p>
          </div>
        </section>

        {/* Booking Form */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 max-w-2xl">
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-12">
              {(['service', 'datetime', 'contact', 'confirmation'] as const).map((s, idx) => (
                <div key={s} className="flex items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      step === s
                        ? 'bg-blue-600 text-white'
                        : ['service', 'datetime', 'contact'].includes(s) && ['service', 'datetime', 'contact'].indexOf(s) < ['service', 'datetime', 'contact'].indexOf(step)
                        ? 'bg-green-600 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {['service', 'datetime', 'contact'].indexOf(s) < ['service', 'datetime', 'contact'].indexOf(step) && s !== 'confirmation' ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  {idx < 3 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        ['service', 'datetime', 'contact', 'confirmation'].indexOf(s) < ['service', 'datetime', 'contact', 'confirmation'].indexOf(step)
                          ? 'bg-green-600'
                          : 'bg-slate-200'
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>

            {/* Step 1: Select Service */}
            {step === 'service' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-slate-900">Select Service</h2>
                <div className="grid grid-cols-1 gap-4 mb-8">
                  {services.map((service) => (
                    <Card
                      key={service.id}
                      className={`p-4 cursor-pointer transition border-2 ${
                        formData.service === service.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      onClick={() => setFormData({ ...formData, service: service.id })}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-slate-900">{service.name}</h3>
                          <p className="text-sm text-slate-600">Professional service included</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-blue-600">${service.price.toFixed(2)}</p>
                          <p className="text-sm text-slate-600">est. 30-120 min</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                <Button
                  onClick={() => setStep('datetime')}
                  disabled={!isStepValid.service}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  Continue
                </Button>
              </div>
            )}

            {/* Step 2: Select Date & Time */}
            {step === 'datetime' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-slate-900">
                  Choose Date & Time
                </h2>
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-slate-900 mb-3">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-semibold text-slate-900 mb-3">
                    Preferred Time
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setFormData({ ...formData, time })}
                        className={`py-2 px-3 rounded-lg border-2 transition text-sm font-medium ${
                          formData.time === time
                            ? 'border-blue-600 bg-blue-50 text-blue-600'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() => setStep('service')}
                    variant="outline"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep('contact')}
                    disabled={!isStepValid.datetime}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Contact Information */}
            {step === 'contact' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-slate-900">
                  Contact Information
                </h2>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <p className="text-red-800">{error}</p>
                  </div>
                )}

                <div className="space-y-4 mb-8">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="(123) 456-7890"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Vehicle (Make & Model)
                    </label>
                    <input
                      type="text"
                      value={formData.vehicle}
                      onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="2020 Toyota Camry"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Any additional information about your vehicle or service needs..."
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() => setStep('datetime')}
                    variant="outline"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!isStepValid.contact || isSubmitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Booking...' : 'Confirm Booking'}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {step === 'confirmation' && (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold mb-4 text-slate-900">
                  Booking Confirmed!
                </h2>
                <p className="text-lg text-slate-600 mb-6">
                  Thank you for scheduling with SleekSpec. A confirmation email has been sent to{' '}
                  <span className="font-semibold">{formData.email}</span>.
                </p>

                <Card className="p-6 mb-8 bg-slate-50 border-0">
                  <div className="text-left space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                      <span className="text-slate-600">Service</span>
                      <span className="font-semibold text-slate-900">{selectedService?.name}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                      <span className="text-slate-600">Date</span>
                      <span className="font-semibold text-slate-900">
                        {new Date(formData.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                      <span className="text-slate-600">Time</span>
                      <span className="font-semibold text-slate-900">{formData.time}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Price</span>
                      <span className="font-bold text-blue-600">
                        ${selectedService?.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </Card>

                <div className="space-y-4">
                  <div className="border-t border-slate-200 pt-6">
                    <h3 className="font-semibold text-slate-900 mb-4">Payment Options</h3>
                    <div className="space-y-2">
                      <p className="text-sm text-slate-600">
                        A 25% deposit is required to confirm your booking. Pay online via Stripe or pay in person at the garage.
                      </p>
                      <p className="text-lg font-bold text-blue-600">
                        Deposit: ${(selectedService ? selectedService.price * 0.25 : 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handlePayment()}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Pay Deposit via Stripe
                  </Button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <Button asChild variant="outline" className="flex-1">
                    <Link href="/">Return Home</Link>
                  </Button>
                  <Button asChild className="flex-1 bg-slate-600 hover:bg-slate-700">
                    <Link href="/services">View More Services</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
