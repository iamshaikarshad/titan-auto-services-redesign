'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, Gauge, Wrench, Zap, Shield, Clock, Award, Wind, Lightbulb, Battery, HelpCircle, Loader2 } from 'lucide-react'

const services = [
  { id: 'mot',         name: 'PreMOT',              price: 45,  icon: Gauge,       priceLabel: 'From £45' },
  { id: 'servicing',   name: 'Car Servicing',       price: 105, icon: Wrench,      priceLabel: 'From £105' },
  { id: 'tyres',       name: 'Tyres & Alignment',   price: 35,  icon: Zap,         priceLabel: 'From £35' },
  { id: 'brakes',      name: 'Brake Service',       price: 80,  icon: Shield,      priceLabel: 'From £80' },
  { id: 'diagnostics', name: 'Engine Diagnostics',  price: 50,  icon: Clock,       priceLabel: 'From £50' },
  { id: 'aircon',      name: 'General Repairs',     price: 40,  icon: Award,       priceLabel: 'From £40' },
  { id: 'exhaust',     name: 'Exhaust System',      price: 120, icon: Wind,        priceLabel: 'From £120' },
  { id: 'suspension',  name: 'Suspension',          price: 150, icon: Lightbulb,   priceLabel: 'From £150' },
  { id: 'battery',     name: 'Battery',             price: 60,  icon: Battery,     priceLabel: 'From £60' },
  { id: 'other',       name: 'Other',               price: 0,   icon: HelpCircle,  priceLabel: 'Get a quote' },
]

const tyreSizes = [
  { label: '14" — from £35 to £45', value: '14"' },
  { label: '15" — from £40 to £50', value: '15"' },
  { label: '16" — from £60 to £70', value: '16"' },
  { label: '17" — from £65 to £85', value: '17"' },
  { label: '18" — from £70 to £90', value: '18"' },
  { label: '19" — from £80 to £110', value: '19"' },
]

const servicingEngineSizes = {
  petrol: [
    { label: 'Up to 1000cc', value: 'Up to 1000cc' },
    { label: 'Up to 1300cc', value: 'Up to 1300cc' },
    { label: 'Up to 1600cc', value: 'Up to 1600cc' },
    { label: 'Up to 2000cc', value: 'Up to 2000cc' },
    { label: 'Up to 2500cc', value: 'Up to 2500cc' },
    { label: 'Up to 3500cc', value: 'Up to 3500cc' },
  ],
  hybrid: [
    { label: 'Up to 1000cc', value: 'Up to 1000cc' },
    { label: 'Up to 1300cc', value: 'Up to 1300cc' },
    { label: 'Up to 1600cc', value: 'Up to 1600cc' },
    { label: 'Up to 2000cc', value: 'Up to 2000cc' },
    { label: 'Up to 2500cc', value: 'Up to 2500cc' },
    { label: 'Up to 3500cc', value: 'Up to 3500cc' },
    { label: 'Up to 4500cc', value: 'Up to 4500cc' },
  ],
}

// Price lookup: [fuelType][engineSize][serviceType]
const servicingPrices: Record<string, Record<string, { interim: number; full: number }>> = {
  petrol: {
    'Up to 1000cc': { interim: 105, full: 205 },
    'Up to 1300cc': { interim: 145, full: 205 },
    'Up to 1600cc': { interim: 155, full: 205 },
    'Up to 2000cc': { interim: 165, full: 245 },
    'Up to 2500cc': { interim: 175, full: 250 },
    'Up to 3500cc': { interim: 195, full: 265 },
  },
  hybrid: {
    'Up to 1000cc': { interim: 140, full: 225 },
    'Up to 1300cc': { interim: 165, full: 235 },
    'Up to 1600cc': { interim: 175, full: 245 },
    'Up to 2000cc': { interim: 185, full: 255 },
    'Up to 2500cc': { interim: 195, full: 265 },
    'Up to 3500cc': { interim: 215, full: 285 },
    'Up to 4500cc': { interim: 235, full: 305 },
  },
}

function getServicingPrice(fuelType: string, engineSize: string, serviceType: 'interim' | 'full'): number | null {
  const fuel = servicingPrices[fuelType]
  if (!fuel) return null
  const engine = fuel[engineSize]
  if (!engine) return null
  return engine[serviceType]
}

const sessions = [
  {
    id: 'morning',
    label: 'Morning Session',
    time: '09:00 – 12:00',
    description: 'Drop off between 9am and 12pm',
  },
  {
    id: 'afternoon',
    label: 'Afternoon Session',
    time: '13:00 – 17:00',
    description: 'Drop off between 1pm and 5pm',
  },
]

interface BookingFormData {
  service: string
  date: string
  time: string
  name: string
  email: string
  phone: string
  vehicle: string
  registrationNumber: string
  tyreSize: string
  fuelType: string
  engineSize: string
  otherDescription: string
  notes: string
}

// Returns the minimum bookable date: today + 2 days (skip 1 day buffer)
function getMinBookingDate(): Date {
  const d = new Date()
  d.setDate(d.getDate() + 2)
  d.setHours(0, 0, 0, 0)
  return d
}

function toDateString(d: Date): string {
  return d.toISOString().split('T')[0]
}

function isSunday(dateStr: string): boolean {
  if (!dateStr) return false
  const d = new Date(dateStr + 'T00:00:00')
  return d.getDay() === 0
}

function isDateDisabled(dateStr: string): boolean {
  if (!dateStr) return false
  const selected = new Date(dateStr + 'T00:00:00')
  const min = getMinBookingDate()
  return selected < min || selected.getDay() === 0
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validatePhone(phone: string): boolean {
  return /^[\d\s\+\-\(\)]{7,}$/.test(phone.trim())
}

function RegWidget() {
  const [reg, setReg] = useState('')

  const handleGetPrice = () => {
    if (!reg.trim()) return
    const url = `https://bookmygarage.com/garage-detail/titan-auto-services_bt/me157uh/book/?ref=www.titanautoservices.co.uk&vrm=${encodeURIComponent(reg.trim().toUpperCase())}&referrer=widget`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="mt-8 max-w-2xl mx-auto">
      <p className="text-gray-300 text-center mb-3">Get an instant price for your MOT or service and book for free.</p>
      <div className="flex items-stretch gap-3">
        <div className="flex flex-1 rounded-lg overflow-hidden shadow-lg shadow-black/40 min-w-0">
          <div className="flex flex-col items-center justify-center bg-[#003087] px-3 py-2 gap-0.5 shrink-0">
            <span className="text-xl leading-none">🇬🇧</span>
            <span className="text-white text-[10px] font-bold leading-none tracking-widest">UK</span>
          </div>
          <input
            type="text"
            value={reg}
            onChange={(e) => setReg(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && handleGetPrice()}
            placeholder="ENTER YOUR REG"
            maxLength={8}
            spellCheck={false}
            className="font-plate flex-1 min-w-0 bg-[#F5C500] text-navy-950 placeholder-navy-950/50 text-xl px-4 py-3 focus:outline-none uppercase"
            aria-label="Enter your car registration number"
          />
        </div>
        <button
          onClick={handleGetPrice}
          className="bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold text-base px-6 py-3 rounded-lg transition whitespace-nowrap shrink-0 shadow-lg shadow-black/30"
        >
          Get a price now &rsaquo;
        </button>
      </div>
    </div>
  )
}

function BookingPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [step, setStep] = useState<'service' | 'datetime' | 'contact' | 'confirmation'>('service')
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [serviceType, setServiceType] = useState<'full' | 'interim' | null>(null)
  const [formData, setFormData] = useState<BookingFormData>({
    service: searchParams.get('service') || '',
    date: '',
    time: '',
    name: '',
    email: '',
    phone: '',
    vehicle: '',
    registrationNumber: '',
    tyreSize: '',
    fuelType: 'petrol',
    engineSize: '',
    otherDescription: '',
    notes: '',
  })
  const [contactErrors, setContactErrors] = useState<Partial<Record<keyof BookingFormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const minDate = toDateString(getMinBookingDate())

  const selectedService = services.find((s) => s.id === formData.service)
  const isTyresSelected = formData.service === 'tyres'
  const isServicingSelected = formData.service === 'servicing'
  const isOtherSelected = formData.service === 'other'
  const isStepValid = {
    service: formData.service !== ''
      && (!isTyresSelected || formData.tyreSize !== '')
      && (!isServicingSelected || (formData.engineSize !== '' && serviceType !== null))
      && (!isOtherSelected || formData.otherDescription.trim() !== ''),
    datetime: formData.date !== '' && formData.time !== '' && !isDateDisabled(formData.date),
    contact: formData.name !== '' && formData.email !== '' && formData.phone !== '' && formData.vehicle !== '',
  }

  const validateContactStep = (): boolean => {
    const errors: Partial<Record<keyof BookingFormData, string>> = {}
    if (!formData.name.trim()) errors.name = 'Full name is required.'
    if (!formData.email.trim()) {
      errors.email = 'Email is required.'
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address.'
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required.'
    } else if (!validatePhone(formData.phone)) {
      errors.phone = 'Please enter a valid phone number.'
    }
    if (!formData.vehicle.trim()) errors.vehicle = 'Vehicle details are required.'
    setContactErrors(errors)
    return Object.keys(errors).length === 0
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
        : isServicingSelected && formData.engineSize && serviceType
        ? `Service Type: ${serviceType === 'full' ? 'Full Service' : 'Interim Service'} | Fuel Type: ${formData.fuelType === 'petrol' ? 'Petrol/Diesel' : 'Hybrid'} | Engine: ${formData.engineSize}${formData.notes ? ` | ${formData.notes}` : ''}`
        : isOtherSelected && formData.otherDescription
        ? `Service Description: ${formData.otherDescription}${formData.notes ? ` | ${formData.notes}` : ''}`
        : formData.notes
      
      // Determine which service to book (servicing maps to full or interim based on selection)
      const bookingService = isServicingSelected && serviceType 
        ? (serviceType === 'full' ? 'full-servicing' : 'interim-servicing')
        : formData.service
      
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          service: bookingService,
          notes: notesWithTyre,
          serviceType: isServicingSelected ? serviceType : undefined,
        }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Booking failed')
      }
      setBookingSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Auto-redirect to home after successful booking
  useEffect(() => {
    if (bookingSuccess) {
      const timer = setTimeout(() => {
        router.push('/')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [bookingSuccess, router])

  // Show success screen after booking is confirmed
  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-gold-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-gold-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Booking Confirmed!</h1>
          <p className="text-gray-300 text-lg mb-8">
            Your request has been registered. We will get in touch with you shortly to confirm your appointment. Thank you for choosing Titan Auto Services!
          </p>
          <p className="text-gray-500 text-sm mb-6">Redirecting to home page in a few seconds...</p>
          <Button
            onClick={() => router.push('/')}
            className="bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold px-8"
          >
            Go to Home
          </Button>
        </motion.div>
      </div>
    )
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

          <RegWidget />

          {/* OR divider */}
          <div className="flex items-center gap-4 mt-10 max-w-2xl mx-auto">
            <div className="flex-1 h-px bg-gold-500/20" />
            <span className="text-gray-400 font-bold tracking-widest text-sm">OR</span>
            <div className="flex-1 h-px bg-gold-500/20" />
          </div>
          <p className="text-gray-400 mt-4 text-sm">Fill in the form below to book directly with us</p>
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
                      onClick={() => setFormData({ ...formData, service: service.id, tyreSize: '', engineSize: '', fuelType: 'petrol', otherDescription: '' })}
                      className={`p-6 cursor-pointer transition border-2 ${
                        formData.service === service.id
                          ? 'border-gold-500 bg-navy-800'
                          : 'border-gold-500/20 bg-navy-800 hover:border-gold-500/50'
                      }`}
                    >
                      <Icon className="w-6 h-6 text-gold-500 mb-3" />
                      <h3 className="font-bold text-white mb-1">{service.name}</h3>
                      <p className="text-gold-500 font-bold">{service.priceLabel}</p>
                    </Card>
                  )
                })}
              </div>

              {/* Servicing options - shown only when Car Servicing selected */}
              {isServicingSelected && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mb-6"
                >
                  <Card className="bg-navy-800 border-gold-500/30 p-6 space-y-5">
                    <div>
                      <label className="block text-white font-bold mb-3">
                        Fuel Type <span className="text-gold-500">*</span>
                      </label>
                      <div className="flex gap-2 bg-navy-700 p-1 rounded-lg">
                        {[{ label: 'Petrol / Diesel', value: 'petrol' }, { label: 'Hybrid', value: 'hybrid' }].map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, fuelType: opt.value, engineSize: '' })}
                            className={`flex-1 py-2.5 rounded-md text-sm font-bold transition ${
                              formData.fuelType === opt.value
                                ? 'bg-gold-500 text-navy-950'
                                : 'text-gray-400 hover:text-white'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-white font-bold mb-3">
                        Engine Size <span className="text-gold-500">*</span>
                      </label>
                      <select
                        value={formData.engineSize}
                        onChange={(e) => setFormData({ ...formData, engineSize: e.target.value })}
                        className="w-full bg-navy-700 border border-gold-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 text-base"
                      >
                        <option value="">-- Select engine size --</option>
                        {servicingEngineSizes[formData.fuelType as 'petrol' | 'hybrid'].map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Service Type Selection - Full vs Interim */}
                    {formData.engineSize && (
                      <div>
                        <label className="block text-white font-bold mb-3">
                          Service Type <span className="text-gold-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { type: 'interim' as const, label: 'Interim Service', desc: 'Oil and filter change with basic checks' },
                            { type: 'full' as const, label: 'Full Service', desc: 'Comprehensive maintenance and checks' }
                          ].map((opt) => {
                            const price = getServicingPrice(formData.fuelType, formData.engineSize, opt.type)
                            return (
                              <button
                                key={opt.type}
                                type="button"
                                onClick={() => setServiceType(opt.type)}
                                className={`p-4 rounded-lg border-2 transition text-left ${
                                  serviceType === opt.type
                                    ? 'border-gold-500 bg-navy-700'
                                    : 'border-gold-500/20 bg-navy-800 hover:border-gold-500/50'
                                }`}
                              >
                                <p className="font-bold text-white">{opt.label}</p>
                                <p className="text-sm text-gray-400 mt-1">{opt.desc}</p>
                                {price && <p className="text-gold-500 font-bold mt-2">£{price.toFixed(2)}</p>}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </Card>
                </motion.div>
              )}

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

              {/* Other — free-text description */}
              {isOtherSelected && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mb-8"
                >
                  <Card className="bg-navy-800 border-gold-500/30 p-6">
                    <label className="block text-white font-bold mb-3">
                      Describe what you need <span className="text-gold-500">*</span>
                    </label>
                    <textarea
                      value={formData.otherDescription}
                      onChange={(e) => setFormData({ ...formData, otherDescription: e.target.value })}
                      placeholder="Please describe the issue or service you require and we will get back to you with a quote..."
                      rows={4}
                      className="w-full bg-navy-700 border border-gold-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gold-500 text-base resize-none"
                    />
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
                    min={minDate}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value, time: '' })}
                    className={`w-full bg-navy-700 border rounded px-4 py-2 text-white focus:outline-none focus:border-gold-500 ${
                      formData.date && isDateDisabled(formData.date)
                        ? 'border-red-500/70'
                        : 'border-gold-500/20'
                    }`}
                  />
                  {formData.date && isSunday(formData.date) && (
                    <p className="mt-2 text-red-400 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      We are closed on Sundays. Please select another day.
                    </p>
                  )}
                  {formData.date && !isSunday(formData.date) && isDateDisabled(formData.date) && (
                    <p className="mt-2 text-red-400 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      Bookings must be made at least 2 days in advance.
                    </p>
                  )}
                  {!formData.date && (
                    <p className="mt-2 text-gray-500 text-sm">Earliest available: {new Date(minDate + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  )}
                </div>
                <div className="mb-8">
                  <label className="block text-white font-bold mb-3">Preferred Session</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {sessions.map((session) => (
                      <button
                        key={session.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, time: session.id })}
                        className={`p-5 rounded-lg border-2 text-left transition ${
                          formData.time === session.id
                            ? 'border-gold-500 bg-gold-500/10'
                            : 'border-gold-500/20 bg-navy-700 hover:border-gold-500/50'
                        }`}
                      >
                        <p className={`font-bold text-lg mb-1 ${formData.time === session.id ? 'text-gold-500' : 'text-white'}`}>
                          {session.label}
                        </p>
                        <p className="text-gold-400 font-mono text-sm mb-1">{session.time}</p>
                        <p className="text-gray-400 text-sm">{session.description}</p>
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
                    { label: 'Full Name', key: 'name', type: 'text', placeholder: 'John Smith' },
                    { label: 'Email', key: 'email', type: 'email', placeholder: 'john@example.com' },
                    { label: 'Phone', key: 'phone', type: 'tel', placeholder: '07700 900000' },
                    { label: 'Vehicle (Make & Model)', key: 'vehicle', type: 'text', placeholder: 'Ford Focus' },
                    { label: 'Registration Number', key: 'registrationNumber', type: 'text', placeholder: 'AB12 CDE' },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-white font-bold mb-2">{field.label}</label>
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={formData[field.key as keyof BookingFormData]}
                        onChange={(e) => {
                          setFormData({ ...formData, [field.key]: e.target.value })
                          if (contactErrors[field.key as keyof BookingFormData]) {
                            setContactErrors({ ...contactErrors, [field.key]: undefined })
                          }
                        }}
                        className={`w-full bg-navy-700 border rounded px-4 py-2 text-white focus:outline-none focus:border-gold-500 placeholder:text-gray-600 ${
                          contactErrors[field.key as keyof BookingFormData]
                            ? 'border-red-500/70'
                            : 'border-gold-500/20'
                        }`}
                      />
                      {contactErrors[field.key as keyof BookingFormData] && (
                        <p className="mt-1.5 text-red-400 text-sm flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                          {contactErrors[field.key as keyof BookingFormData]}
                        </p>
                      )}
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
                  onClick={() => {
                    if (validateContactStep()) setStep('confirmation')
                  }}
                  className="flex-1 bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold"
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
                    ...(isServicingSelected && formData.engineSize ? [
                      { label: 'Fuel Type', value: formData.fuelType === 'petrol' ? 'Petrol / Diesel' : 'Hybrid' },
                      { label: 'Engine Size', value: formData.engineSize },
                    ] : []),
                    ...(isOtherSelected && formData.otherDescription ? [
                      { label: 'Description', value: formData.otherDescription },
                    ] : []),
                    { label: 'Date', value: new Date(formData.date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) },
                    { label: 'Session', value: sessions.find(s => s.id === formData.time)?.label + ' (' + sessions.find(s => s.id === formData.time)?.time + ')' },
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
