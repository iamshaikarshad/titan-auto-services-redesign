'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, Gauge, Wrench, Zap, Shield, Clock, Award, Loader2 } from 'lucide-react'

const services = [
  { id: 'mot', name: 'MOT Testing', price: 45, icon: Gauge },
  { id: 'servicing', name: 'Car Servicing', price: 150, icon: Wrench },
  { id: 'tyres', name: 'Tyres & Alignment', price: 35, icon: Zap },
  { id: 'brakes', name: 'Brake Service', price: 80, icon: Shield },
  { id: 'diagnostics', name: 'Engine Diagnostics', price: 50, icon: Clock },
  { id: 'aircon', name: 'Air Con Service', price: 75, icon: Award },
]

const tyreSizes = [
  { label: '14" — from £35 to £45', value: '14"' },
  { label: '15" — from £40 to £50', value: '15"' },
  { label: '16" — from £60 to £70', value: '16"' },
  { label: '17" — from £65 to £85', value: '17"' },
  { label: '18" — from £70 to £90', value: '18"' },
  { label: '19" — from £80 to £110', value: '19"' },
]

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'
]

interface BookingFormData {
  service: string
  date: string
  time: string
  name: string
  email: string
  phone: string
  vehicle: string
  tyreSize: string
  notes: string
}

function BookingPageContent() {
  const searchParams = useSearchParams()
  const [step, setStep] = useState<'service' | 'datetime' | 'contact' | 'confirmation'>('service')
  const [formData, setFormData] = useState<BookingFormData>({
    service: searchParams.get('service') || '',
    date: '',
    time: '',
    name: '',
    email: '',
    phone: '',
    vehicle: '',
    tyreSize: '',
    notes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectedService = services.find((s) => s.id === formData.service)
  const isTyresSelected = formData.service === 'tyres'
  const isStepValid = {
    service: formData.service !== '' && (!isTyresSelected || formData.tyreSize !== ''),
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
          price: selectedService.price * 0.25,
          bookingId: `BK${Date.now()}`,
        }),
      })
      if (!response.ok) throw new Error('Payment failed')
      const data = await response.json()
      if (data.sessionId) {
        window.location.href = `https://checkout.stripe.com/pay/${data.sessionId}`
      } else {
        alert('Payment processing pending. Please pay in person.')
      }
    } catch {
      alert('Error processing payment')
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)
    try {
      const notesWithTyre = isTyresSelected && formData.tyreSize
        ? `Tyre Size: ${formData.tyreSize}${formData.notes ? ` | ${formData.notes}` : ''}`
        : formData.notes
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, notes: notesWithTyre }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Booking failed')
      }
      setStep('confirmation')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy-950">
      {/* Header */}
      <div className="pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Book Your Service</h1>
          <p className="text-xl text-gray-300">Fast, reliable, professional servicing in Maidstone.</p>
        </motion.div>
      </div>

      {/* Booking Form */}
      <section className="pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Steps */}
          <div className="flex justify-between mb-12">
            {['Service', 'Date & Time', 'Details', 'Confirmation'].map((label, idx) => (
              <div key={idx} className="flex-1 text-center">
                <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${
                  idx < ['service', 'datetime', 'contact', 'confirmation'].indexOf(step)
                    ? 'bg-gold-500 text-navy-950'
                    : ['service', 'datetime', 'contact', 'confirmation'].indexOf(step) === idx
                    ? 'bg-gold-500 text-navy-950'
                    : 'bg-navy-800 text-gray-400'
                }`}>
                  {idx + 1}
                </div>
                <p className="text-sm text-gray-400">{label}</p>
              </div>
            ))}
          </div>

          {error && (
            <Card className="bg-red-500/10 border-red-500/50 p-4 mb-8 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-400">{error}</p>
            </Card>
          )}

          {/* Step 1: Service Selection */}
          {step === 'service' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {services.map((service) => {
                  const Icon = service.icon
                  return (
                    <Card
                      key={service.id}
                      onClick={() => setFormData({ ...formData, service: service.id, tyreSize: '' })}
                      className={`p-6 cursor-pointer transition border-2 ${
                        formData.service === service.id
                          ? 'border-gold-500 bg-navy-800'
                          : 'border-gold-500/20 bg-navy-800 hover:border-gold-500/50'
                      }`}
                    >
                      <Icon className="w-6 h-6 text-gold-500 mb-3" />
                      <h3 className="font-bold text-white mb-1">{service.name}</h3>
                      <p className="text-gold-500 font-bold">From £{service.price}</p>
                    </Card>
                  )
                })}
              </div>

              {/* Tyre size dropdown - shown only when Tyres selected */}
              {isTyresSelected && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mb-8"
                >
                  <Card className="bg-navy-800 border-gold-500/30 p-6">
                    <label className="block text-white font-bold mb-3">
                      Select Tyre Size <span className="text-gold-500">*</span>
                    </label>
                    <select
                      value={formData.tyreSize}
                      onChange={(e) => setFormData({ ...formData, tyreSize: e.target.value })}
                      className="w-full bg-navy-700 border border-gold-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 text-base"
                    >
                      <option value="">-- Choose a tyre size --</option>
                      {tyreSizes.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                    <div className="mt-3 bg-gold-500/10 border border-gold-500/20 rounded-lg p-3 space-y-1">
                      <p className="text-gold-400 text-sm">Most common sizes available same day.</p>
                      <p className="text-gold-400 text-sm">Premium brands also available on request.</p>
                    </div>
                  </Card>
                </motion.div>
              )}

              <Button
                onClick={() => setStep('datetime')}
                disabled={!isStepValid.service}
                className="w-full bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-navy-950 font-bold"
              >
                Continue to Date & Time
              </Button>
            </motion.div>
          )}

          {/* Step 2: Date & Time */}
          {step === 'datetime' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-navy-800 border-gold-500/20 p-8 mb-8">
                <div className="mb-8">
                  <label className="block text-white font-bold mb-3">Preferred Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-navy-700 border border-gold-500/20 rounded px-4 py-2 text-white focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div className="mb-8">
                  <label className="block text-white font-bold mb-3">Preferred Time</label>
                  <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setFormData({ ...formData, time })}
                        className={`py-2 rounded transition text-sm font-bold ${
                          formData.time === time
                            ? 'bg-gold-500 text-navy-950'
                            : 'bg-navy-700 text-gray-300 hover:bg-gold-500/20'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>
              <div className="flex gap-4">
                <Button
                  onClick={() => setStep('service')}
                  variant="outline"
                  className="flex-1 border-gold-500 text-gold-500 hover:bg-gold-500/10"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep('contact')}
                  disabled={!isStepValid.datetime}
                  className="flex-1 bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-navy-950 font-bold"
                >
                  Continue to Details
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Contact Details */}
          {step === 'contact' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-navy-800 border-gold-500/20 p-8 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {[
                    { label: 'Full Name', key: 'name', type: 'text' },
                    { label: 'Email', key: 'email', type: 'email' },
                    { label: 'Phone', key: 'phone', type: 'tel' },
                    { label: 'Vehicle', key: 'vehicle', type: 'text' },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-white font-bold mb-2">{field.label}</label>
                      <input
                        type={field.type}
                        value={formData[field.key as keyof BookingFormData]}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                        className="w-full bg-navy-700 border border-gold-500/20 rounded px-4 py-2 text-white focus:outline-none focus:border-gold-500"
                      />
                    </div>
                  ))}
                </div>
                <div className="mb-6">
                  <label className="block text-white font-bold mb-2">Special Requests (Optional)</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-navy-700 border border-gold-500/20 rounded px-4 py-2 text-white focus:outline-none focus:border-gold-500 h-24"
                  />
                </div>
              </Card>
              <div className="flex gap-4">
                <Button
                  onClick={() => setStep('datetime')}
                  variant="outline"
                  className="flex-1 border-gold-500 text-gold-500 hover:bg-gold-500/10"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep('confirmation')}
                  disabled={!isStepValid.contact}
                  className="flex-1 bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-navy-950 font-bold"
                >
                  Review Booking
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Confirmation */}
          {step === 'confirmation' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-navy-800 border-gold-500/20 p-8 mb-8">
                <div className="flex items-center gap-4 mb-6">
                  <CheckCircle2 className="w-8 h-8 text-gold-500" />
                  <h2 className="text-2xl font-bold text-white">Confirm Your Booking</h2>
                </div>

                <div className="space-y-4 mb-8">
                  {[
                    { label: 'Service', value: selectedService?.name },
                    ...(isTyresSelected && formData.tyreSize ? [{ label: 'Tyre Size', value: formData.tyreSize }] : []),
                    { label: 'Date', value: formData.date },
                    { label: 'Time', value: formData.time },
                    { label: 'Name', value: formData.name },
                    { label: 'Email', value: formData.email },
                    { label: 'Phone', value: formData.phone },
                    { label: 'Vehicle', value: formData.vehicle },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between py-2 border-b border-gold-500/10">
                      <span className="text-gray-400">{item.label}</span>
                      <span className="text-white font-bold">{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() => setStep('contact')}
                    variant="outline"
                    className="flex-1 border-gold-500 text-gold-500 hover:bg-gold-500/10"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-navy-950 font-bold"
                  >
                    {isSubmitting ? 'Booking...' : 'Confirm Booking'}
                  </Button>
                </div>
              </Card>

              {selectedService && (
                <Card className="bg-gold-500/10 border-gold-500/30 p-8">
                  <p className="text-gold-400 mb-4">Deposit (25% of service cost)</p>
                  <p className="text-3xl font-bold text-gold-500 mb-6">£{(selectedService.price * 0.25).toFixed(2)}</p>
                  <Button
                    onClick={handlePayment}
                    className="w-full bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold"
                  >
                    Pay Deposit via Stripe
                  </Button>
                </Card>
              )}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-navy-950">
        <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
      </div>
    }>
      <BookingPageContent />
    </Suspense>
  )
}
