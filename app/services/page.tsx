'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import { Gauge, Wrench, Zap, Shield, Clock, Award, ChevronRight, Zap as Battery, Wind, Lightbulb } from 'lucide-react'
import Image from 'next/image'

// ─── Pricing data ────────────────────────────────────────────────────────────

const tyrePricing = [
  { size: '14"', from: 35, to: 45 },
  { size: '15"', from: 40, to: 50 },
  { size: '16"', from: 60, to: 70 },
  { size: '17"', from: 65, to: 85 },
  { size: '18"', from: 70, to: 90 },
  { size: '19"', from: 80, to: 110 },
]

const servicingPricing = {
  petrol: [
    { cc: 'Up to 1000cc', interim: 105, full: 205 },
    { cc: 'Up to 1300cc', interim: 145, full: 205 },
    { cc: 'Up to 1600cc', interim: 155, full: 205 },
    { cc: 'Up to 2000cc', interim: 165, full: 245 },
    { cc: 'Up to 2500cc', interim: 175, full: 250 },
    { cc: 'Up to 3500cc', interim: 195, full: 265 },
  ],
  hybrid: [
    { cc: 'Up to 1000cc', interim: 140, full: 225 },
    { cc: 'Up to 1300cc', interim: 165, full: 235 },
    { cc: 'Up to 1600cc', interim: 175, full: 245 },
    { cc: 'Up to 2000cc', interim: 185, full: 255 },
    { cc: 'Up to 2500cc', interim: 195, full: 265 },
    { cc: 'Up to 3500cc', interim: 215, full: 285 },
    { cc: 'Up to 4500cc', interim: 235, full: 305 },
  ],
}

type ServiceKey =
  | 'mot'
  | 'servicing'
  | 'tyres'
  | 'brakes'
  | 'diagnostics'
  | 'aircon'
  | 'exhaust'
  | 'suspension'
  | 'battery'

interface ServiceDetail {
  title: string
  icon: React.ElementType
  description: string
  bookingHref: string
  bookingLabel: string
  features: string[]
  rows: { label: string; value: string }[]
  notes?: string[]
}

const serviceDetails: Record<ServiceKey, ServiceDetail> = {
  mot: {
    title: 'MOT Testing',
    icon: Gauge,
    description: 'DVSA-approved MOT testing for all vehicle classes. Full inspection with instant results and transparent pass/fail reporting.',
    bookingHref: '/booking?service=mot',
    bookingLabel: 'Book MOT',
    features: ['DVSA Approved', 'Expert Inspection', '30-Min Test', 'Instant Results'],
    rows: [
      { label: 'Class 4 (cars up to 8 seats)', value: 'From £45' },
      { label: 'Class 7 (commercial, up to 3,500kg)', value: 'From £55' },
      { label: 'Re-test (within 10 working days)', value: 'Free' },
    ],
    notes: [
      'Soonest available slots often same or next day.',
      'Free advisory report on all tested vehicles.',
    ],
  },
  servicing: {
    title: 'Car Servicing',
    icon: Wrench,
    description: 'Full and interim servicing with genuine parts. Prices vary by engine size and fuel type.',
    bookingHref: '/booking?service=servicing',
    bookingLabel: 'Book Car Service',
    features: ['Oil & Filter', 'Fluid Checks', 'Parts Inspection', 'Warranty Included'],
    rows: [],
    notes: ['Warranty included on all parts and labour.'],
  },
  tyres: {
    title: 'Tyres & Wheel Alignment',
    icon: Zap,
    description: 'Tyre fitting, balancing, rotation, and professional wheel alignment for all makes and models.',
    bookingHref: '/booking?service=tyres',
    bookingLabel: 'Book Tyre Fitting',
    features: ['Quality Tyres', 'Balancing', 'Alignment', 'Same Day Available'],
    rows: [],
    notes: [
      'Most common sizes available same day.',
      'Premium brands available on request.',
    ],
  },
  brakes: {
    title: 'Brake Service & Repairs',
    icon: Shield,
    description: 'Complete brake system inspection, pad and disc replacement, caliper service, and brake fluid change.',
    bookingHref: '/booking?service=brakes',
    bookingLabel: 'Book Brake Service',
    features: ['Pad Replacement', 'Disc Replacement', 'Caliper Service', 'Fluid Change'],
    rows: [
      { label: 'Brake pad replacement (per axle)', value: 'From £80' },
      { label: 'Brake disc & pad replacement (per axle)', value: 'From £150' },
      { label: 'Brake fluid change', value: 'From £45' },
      { label: 'Handbrake adjustment', value: 'From £35' },
      { label: 'Full brake inspection', value: 'Free with any repair' },
    ],
    notes: ['All brake work carries a 12-month / 12,000-mile warranty.'],
  },
  diagnostics: {
    title: 'Engine Diagnostics',
    icon: Clock,
    description: 'Advanced OBD diagnostic scanning to identify fault codes, engine management issues, and sensor failures across all makes.',
    bookingHref: '/booking?service=diagnostics',
    bookingLabel: 'Book Diagnostics',
    features: ['All Makes & Models', 'Live Data Scanning', 'Fault Code Reset', 'Expert Report'],
    rows: [
      { label: 'Full diagnostic scan', value: 'From £50' },
      { label: 'Advanced multi-system scan', value: 'From £75' },
      { label: 'Diagnostic + report + reset', value: 'From £85' },
    ],
    notes: [
      'Diagnostic fee redeemable against repair cost.',
      'Covers engine, ABS, airbag, gearbox & more.',
    ],
  },
  aircon: {
    title: 'Air Conditioning Service',
    icon: Award,
    description: 'Professional A/C regassing, leak detection, and full system service to keep your cabin cool and comfortable year-round.',
    bookingHref: '/booking?service=aircon',
    bookingLabel: 'Book A/C Service',
    features: ['A/C Regas', 'Leak Detection', 'Pollen Filter', 'System Sanitise'],
    rows: [
      { label: 'A/C regas (R134a refrigerant)', value: 'From £55' },
      { label: 'A/C regas (R1234yf refrigerant)', value: 'From £120' },
      { label: 'Full A/C service + sanitise', value: 'From £75' },
      { label: 'Pollen / cabin filter replacement', value: 'From £30' },
      { label: 'Leak detection', value: 'From £45' },
    ],
    notes: ['Most A/C regases completed same day, no appointment needed.'],
  },
  exhaust: {
    title: 'Exhaust System Service',
    icon: Wind,
    description: 'Exhaust repair, welding, and full replacement for all vehicles. We stock a wide range of systems for fast turnaround.',
    bookingHref: '/booking?service=exhaust',
    bookingLabel: 'Book Exhaust Service',
    features: ['Repairs & Welding', 'Full Replacement', 'Emissions Check', 'Quality Parts'],
    rows: [
      { label: 'Exhaust repair / weld', value: 'From £50' },
      { label: 'Back box replacement', value: 'From £120' },
      { label: 'Mid section replacement', value: 'From £150' },
      { label: 'Full system replacement', value: 'From £250' },
      { label: 'Emissions / smoke test', value: 'From £30' },
    ],
    notes: ['Prices vary by vehicle make and model — call for a quote.'],
  },
  suspension: {
    title: 'Suspension Service',
    icon: Lightbulb,
    description: 'Shock absorber and strut replacement, spring service, ARB bushes, and four-wheel alignment to restore ride quality and handling.',
    bookingHref: '/booking?service=suspension',
    bookingLabel: 'Book Suspension Service',
    features: ['Shock Absorbers', 'Spring Service', 'ARB Bushes', '4-Wheel Alignment'],
    rows: [
      { label: 'Shock absorber replacement (each)', value: 'From £80' },
      { label: 'Strut replacement (each)', value: 'From £120' },
      { label: 'Coil spring replacement (each)', value: 'From £90' },
      { label: 'ARB drop links (pair)', value: 'From £60' },
      { label: '4-wheel laser alignment', value: 'From £60' },
    ],
    notes: ['All suspension work includes a free visual safety check.'],
  },
  battery: {
    title: 'Battery Service',
    icon: Battery,
    description: 'Battery health testing, supply and fit, terminal cleaning, and charging system checks for all vehicle types including stop-start.',
    bookingHref: '/booking?service=battery',
    bookingLabel: 'Book Battery Service',
    features: ['Battery Testing', 'Supply & Fit', 'Stop-Start Compatible', 'Warranty'],
    rows: [
      { label: 'Battery health test', value: 'Free' },
      { label: 'Standard battery (supply & fit)', value: 'From £80' },
      { label: 'Stop-start / AGM battery (supply & fit)', value: 'From £130' },
      { label: 'Battery terminal clean & treat', value: 'From £20' },
      { label: 'Alternator / charging system check', value: 'From £40' },
    ],
    notes: ['All replacement batteries carry a 2-year warranty.'],
  },
}

const allServices: { icon: React.ElementType; title: string; description: string; price: string; features: string[]; serviceKey: ServiceKey }[] = [
  {
    icon: Gauge,
    title: 'MOT Testing Maidstone',
    description: 'Professional MOT testing with DVSA approval. Complete vehicle inspection and diagnostics.',
    price: 'From £45',
    features: ['DVSA Approved', 'Expert Inspection', '30-Min Test', 'Instant Results'],
    serviceKey: 'mot',
  },
  {
    icon: Wrench,
    title: 'Car Servicing',
    description: 'Full and interim servicing with genuine parts and comprehensive maintenance.',
    price: 'From £105',
    features: ['Oil & Filter', 'Fluid Checks', 'Parts Inspection', 'Warranty Included'],
    serviceKey: 'servicing',
  },
  {
    icon: Zap,
    title: 'Tyres & Wheel Alignment',
    description: 'Tyre fitting, balancing, rotation, and professional wheel alignment.',
    price: 'From £35',
    features: ['Quality Tyres', 'Balancing', 'Alignment', 'Same Day Available'],
    serviceKey: 'tyres',
  },
  {
    icon: Shield,
    title: 'Brake Service & Repairs',
    description: 'Complete brake system repairs, pad replacement, and safety inspections.',
    price: 'From £80',
    features: ['Pad Replacement', 'Rotor Service', 'Safety Check', 'Warranty'],
    serviceKey: 'brakes',
  },
  {
    icon: Clock,
    title: 'Engine Diagnostics',
    description: 'Advanced diagnostic equipment to identify and resolve engine issues.',
    price: 'From £50',
    features: ['Advanced Tech', 'Fast Results', 'Expert Advice', 'Transparent Pricing'],
    serviceKey: 'diagnostics',
  },
  {
    icon: Award,
    title: 'Air Conditioning Service',
    description: 'Professional air conditioning maintenance and refrigerant recharge.',
    price: 'From £55',
    features: ['A/C Recharge', 'System Check', 'Refrigerant', 'Leak Detection'],
    serviceKey: 'aircon',
  },
  {
    icon: Wind,
    title: 'Exhaust System Service',
    description: 'Exhaust repair, replacement, and maintenance. Professional welding and installation.',
    price: 'From £50',
    features: ['Repairs & Welding', 'Full Replacement', 'Emissions Check', 'Quality Parts'],
    serviceKey: 'exhaust',
  },
  {
    icon: Lightbulb,
    title: 'Suspension Service',
    description: 'Suspension repair, strut replacement, and wheel alignment services.',
    price: 'From £60',
    features: ['Strut Replacement', 'Spring Service', 'Alignment', 'Ride Quality'],
    serviceKey: 'suspension',
  },
  {
    icon: Battery,
    title: 'Battery Service',
    description: 'Battery testing, replacement, terminal cleaning, and charging services.',
    price: 'From £80',
    features: ['Battery Testing', 'Replacement', 'Terminal Cleaning', 'Warranty'],
    serviceKey: 'battery',
  },
]

// ─── Page component ───────────────────────────────────────────────────────────

export default function ServicesPage() {
  const [activeModal, setActiveModal] = useState<ServiceKey | null>(null)
  const [fuelType, setFuelType] = useState<'petrol' | 'hybrid'>('petrol')

  const detail = activeModal ? serviceDetails[activeModal] : null

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <section className="relative pt-32 pb-20 overflow-hidden flex items-center min-h-96">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/services-garage-interior.jpg"
            alt="Professional garage services at Titan Auto"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900/95 via-navy-900/90 to-navy-900/80" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Services</h1>
            <p className="text-xl text-gray-300 max-w-3xl">
              Comprehensive automotive solutions for all your car maintenance and repair needs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {allServices.map((service, idx) => {
              const Icon = service.icon
              return (
                <motion.div key={idx} variants={fadeInUp}>
                  <Card className="bg-navy-800 border-gold-500/20 hover:border-gold-500/50 transition p-8 h-full flex flex-col group hover:shadow-lg hover:shadow-gold-500/10">
                    <div className="mb-6">
                      <div className="w-16 h-16 bg-gold-500/10 rounded-lg flex items-center justify-center group-hover:bg-gold-500/20 transition">
                        <Icon className="w-8 h-8 text-gold-500" />
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-3">{service.title}</h3>
                    <p className="text-gray-400 mb-4">{service.description}</p>

                    <div className="mb-6">
                      <p className="text-gold-500 font-bold text-lg mb-4">{service.price}</p>
                      <div className="flex flex-wrap gap-2">
                        {service.features.map((feature, i) => (
                          <span key={i} className="text-xs bg-gold-500/10 text-gold-400 px-3 py-1 rounded-full">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={() => setActiveModal(service.serviceKey)}
                      className="w-full bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold mt-auto flex items-center justify-center gap-2 group/btn"
                    >
                      Learn More
                      <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition" />
                    </Button>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-navy-900/50 border-y border-gold-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Why Choose Titan Auto?</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We combine expertise, quality, and customer care to deliver exceptional service.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { title: 'Expert Technicians', description: 'ASE-certified mechanics with 25+ years of combined experience.' },
              { title: 'Genuine Parts', description: 'We use only quality OEM and genuine replacement parts.' },
              { title: 'Warranty Protection', description: 'Every service comes with comprehensive warranty coverage.' },
            ].map((item, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card className="bg-navy-800 border-gold-500/20 p-8">
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Single generic modal ─────────────────────────────────────────────── */}
      <Dialog open={activeModal !== null} onOpenChange={(open) => { if (!open) setActiveModal(null) }}>
        <DialogContent className="bg-navy-900 border border-gold-500/30 text-white max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {detail && (
            <>
              <DialogHeader className="mb-4">
                <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
                  <div className="w-10 h-10 bg-gold-500/20 rounded-lg flex items-center justify-center shrink-0">
                    <detail.icon className="w-5 h-5 text-gold-500" />
                  </div>
                  {detail.title}
</DialogTitle>
            <DialogDescription className="text-gray-300">
              {detail.description}
            </DialogDescription>
          </DialogHeader>

              {/* ── Car Servicing: fuel toggle + engine table ── */}
              {activeModal === 'servicing' && (
                <>
                  <div className="flex gap-2 mb-6 bg-navy-800 p-1 rounded-lg">
                    {(['petrol', 'hybrid'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setFuelType(t)}
                        className={`flex-1 py-2.5 rounded-md text-sm font-bold transition ${fuelType === t ? 'bg-gold-500 text-navy-950' : 'text-gray-400 hover:text-white'}`}
                      >
                        {t === 'petrol' ? 'Petrol / Diesel' : 'Hybrid'}
                      </button>
                    ))}
                  </div>
                  <div className="rounded-lg overflow-hidden border border-gold-500/20 mb-6">
                    <div className="grid grid-cols-3 bg-navy-800 px-4 py-3 text-sm font-bold text-gold-500">
                      <span>Engine Size</span>
                      <span className="text-center">Interim</span>
                      <span className="text-center">Full</span>
                    </div>
                    {servicingPricing[fuelType].map((row, i) => (
                      <div key={row.cc} className={`grid grid-cols-3 px-4 py-3 text-sm border-t border-gold-500/10 ${i % 2 === 0 ? 'bg-navy-900' : 'bg-navy-800/60'}`}>
                        <span className="text-gray-300">{row.cc}</span>
                        <span className="text-center text-white font-medium">£{row.interim}</span>
                        <span className="text-center text-white font-medium">£{row.full}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* ── Tyres: size grid ── */}
              {activeModal === 'tyres' && (
                <>
                  <h3 className="text-lg font-bold text-gold-500 mb-4">Tyre Fitting Price Guide</h3>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {tyrePricing.map((t) => (
                      <div key={t.size} className="bg-navy-800 border border-gold-500/20 rounded-lg p-4 text-center">
                        <p className="text-gold-500 font-bold text-2xl mb-1">{t.size}</p>
                        <p className="text-white text-sm font-medium">£{t.from} – £{t.to}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* ── All other services: price rows table ── */}
              {activeModal !== 'servicing' && activeModal !== 'tyres' && detail.rows.length > 0 && (
                <div className="rounded-lg overflow-hidden border border-gold-500/20 mb-6">
                  <div className="grid grid-cols-2 bg-navy-800 px-4 py-3 text-sm font-bold text-gold-500">
                    <span>Service</span>
                    <span className="text-right">Price</span>
                  </div>
                  {detail.rows.map((row, i) => (
                    <div key={i} className={`grid grid-cols-2 px-4 py-3 text-sm border-t border-gold-500/10 ${i % 2 === 0 ? 'bg-navy-900' : 'bg-navy-800/60'}`}>
                      <span className="text-gray-300">{row.label}</span>
                      <span className="text-right text-white font-medium">{row.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Notes */}
              {detail.notes && detail.notes.length > 0 && (
                <div className="bg-gold-500/10 border border-gold-500/30 rounded-lg p-4 space-y-1 mb-6">
                  {detail.notes.map((n, i) => (
                    <p key={i} className="text-gold-400 text-sm font-medium">{n}</p>
                  ))}
                </div>
              )}

              {/* Feature tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {detail.features.map((f) => (
                  <span key={f} className="text-xs bg-gold-500/10 text-gold-400 px-3 py-1 rounded-full">{f}</span>
                ))}
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild className="flex-1 bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold" onClick={() => setActiveModal(null)}>
                  <Link href={detail.bookingHref}>{detail.bookingLabel}</Link>
                </Button>
                <Button variant="outline" className="flex-1 border-gold-500/40 text-gray-300 hover:bg-navy-800" onClick={() => setActiveModal(null)}>
                  Close
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-navy-900 to-navy-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h2 className="text-4xl font-bold mb-6">Ready to Book?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Schedule your service appointment online or call us today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold">
              <Link href="/booking">Book Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-navy-950 font-bold">
              <a href="tel:01622438114">Call: 01622 438114</a>
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
