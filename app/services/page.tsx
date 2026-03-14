'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import { Gauge, Wrench, Zap, Shield, Clock, Award, ChevronRight, X, Zap as Battery, Wind, Lightbulb } from 'lucide-react'
import Image from 'next/image'

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

const allServices = [
  {
    icon: Gauge,
    title: 'MOT Testing Maidstone',
    description: 'Professional MOT testing with DVSA approval. Complete vehicle inspection and diagnostics.',
    price: 'From £45',
    features: ['DVSA Approved', 'Expert Inspection', '30-Min Test', 'Instant Results'],
    href: '/services/mot',
    isTyres: false,
    isServicing: false,
  },
  {
    icon: Wrench,
    title: 'Car Servicing',
    description: 'Full and interim servicing with genuine parts and comprehensive maintenance.',
    price: 'From £105',
    features: ['Oil & Filter', 'Fluid Checks', 'Parts Inspection', 'Warranty Included'],
    href: '/services/servicing',
    isTyres: false,
    isServicing: true,
  },
  {
    icon: Zap,
    title: 'Tyres & Wheel Alignment',
    description: 'Tyre fitting, balancing, rotation, and professional wheel alignment.',
    price: 'From £35',
    features: ['Quality Tyres', 'Balancing', 'Alignment', 'Same Day Available'],
    href: '/services/tyres',
    isTyres: true,
    isServicing: false,
  },
  {
    icon: Shield,
    title: 'Brake Service & Repairs',
    description: 'Complete brake system repairs, pad replacement, and safety inspections.',
    price: 'From £80',
    features: ['Pad Replacement', 'Rotor Service', 'Safety Check', 'Warranty'],
    href: '/services/brakes',
    isTyres: false,
    isServicing: false,
  },
  {
    icon: Clock,
    title: 'Engine Diagnostics',
    description: 'Advanced diagnostic equipment to identify and resolve engine issues.',
    price: 'From £50',
    features: ['Advanced Tech', 'Fast Results', 'Expert Advice', 'Transparent Pricing'],
    href: '/services/diagnostics',
    isTyres: false,
    isServicing: false,
  },
  {
    icon: Award,
    title: 'Air Conditioning Service',
    description: 'Professional air conditioning maintenance and refrigerant recharge.',
    price: 'From £75',
    features: ['A/C Recharge', 'System Check', 'Refrigerant', 'Leak Detection'],
    href: '/services/air-con',
    isTyres: false,
    isServicing: false,
  },
  {
    icon: Wind,
    title: 'Exhaust System Service',
    description: 'Exhaust repair, replacement, and maintenance. Professional welding and installation.',
    price: 'From £120',
    features: ['Repairs & Welding', 'Full Replacement', 'Emissions Check', 'Quality Parts'],
    href: '/services/exhaust',
    isTyres: false,
    isServicing: false,
  },
  {
    icon: Lightbulb,
    title: 'Suspension Service',
    description: 'Suspension repair, strut replacement, and wheel alignment services.',
    price: 'From £150',
    features: ['Strut Replacement', 'Spring Service', 'Alignment', 'Ride Quality'],
    href: '/services/suspension',
    isTyres: false,
    isServicing: false,
  },
  {
    icon: Battery,
    title: 'Battery Service',
    description: 'Battery testing, replacement, terminal cleaning, and charging services.',
    price: 'From £60',
    features: ['Battery Testing', 'Replacement', 'Terminal Cleaning', 'Warranty'],
    href: '/services/battery',
    isTyres: false,
    isServicing: false,
  },
]

export default function ServicesPage() {
  const [tyresModalOpen, setTyresModalOpen] = useState(false)
  const [servicingModalOpen, setServicingModalOpen] = useState(false)
  const [fuelType, setFuelType] = useState<'petrol' | 'hybrid'>('petrol')

  return (
    <div className="min-h-screen">
      {/* Header Section with Background Image */}
      <section className="relative pt-32 pb-20 overflow-hidden flex items-center min-h-96">
        {/* Background Image */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/services-garage-interior.jpg"
            alt="Professional garage services at Titan Auto"
            fill
            className="object-cover"
          />
          {/* Dark Overlay */}
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

                    {service.isTyres ? (
                      <Button
                        onClick={() => setTyresModalOpen(true)}
                        className="w-full bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold mt-auto flex items-center justify-center gap-2 group/btn"
                      >
                        Learn More
                        <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition" />
                      </Button>
                    ) : service.isServicing ? (
                      <Button
                        onClick={() => setServicingModalOpen(true)}
                        className="w-full bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold mt-auto flex items-center justify-center gap-2 group/btn"
                      >
                        Learn More
                        <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition" />
                      </Button>
                    ) : (
                      <Button
                        asChild
                        className="w-full bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold group/btn mt-auto"
                      >
                        <Link href={service.href} className="flex items-center justify-center gap-2">
                          Learn More
                          <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition" />
                        </Link>
                      </Button>
                    )}
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
              {
                title: 'Expert Technicians',
                description: 'ASE-certified mechanics with 25+ years of combined experience.',
              },
              {
                title: 'Genuine Parts',
                description: 'We use only quality OEM and genuine replacement parts.',
              },
              {
                title: 'Warranty Protection',
                description: 'Every service comes with comprehensive warranty coverage.',
              },
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

      {/* Car Servicing Modal */}
      <Dialog open={servicingModalOpen} onOpenChange={setServicingModalOpen}>
        <DialogContent className="bg-navy-900 border border-gold-500/30 text-white max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-gold-500/20 rounded-lg flex items-center justify-center">
                <Wrench className="w-5 h-5 text-gold-500" />
              </div>
              Car Servicing Price Guide
            </DialogTitle>
          </DialogHeader>

          <p className="text-gray-300 mb-6">
            Full and interim servicing with genuine parts. Prices vary by engine size and fuel type.
          </p>

          {/* Fuel type toggle */}
          <div className="flex gap-2 mb-6 bg-navy-800 p-1 rounded-lg">
            <button
              onClick={() => setFuelType('petrol')}
              className={`flex-1 py-2.5 rounded-md text-sm font-bold transition ${
                fuelType === 'petrol'
                  ? 'bg-gold-500 text-navy-950'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Petrol / Diesel
            </button>
            <button
              onClick={() => setFuelType('hybrid')}
              className={`flex-1 py-2.5 rounded-md text-sm font-bold transition ${
                fuelType === 'hybrid'
                  ? 'bg-gold-500 text-navy-950'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Hybrid
            </button>
          </div>

          {/* Pricing table */}
          <div className="rounded-lg overflow-hidden border border-gold-500/20 mb-6">
            <div className="grid grid-cols-3 bg-navy-800 px-4 py-3 text-sm font-bold text-gold-500">
              <span>Engine Size</span>
              <span className="text-center">Interim Service</span>
              <span className="text-center">Full Service</span>
            </div>
            {servicingPricing[fuelType].map((row, i) => (
              <div
                key={row.cc}
                className={`grid grid-cols-3 px-4 py-3 text-sm border-t border-gold-500/10 ${
                  i % 2 === 0 ? 'bg-navy-900' : 'bg-navy-850'
                }`}
              >
                <span className="text-gray-300">{row.cc}</span>
                <span className="text-center text-white font-medium">£{row.interim}</span>
                <span className="text-center text-white font-medium">£{row.full}</span>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-2 mb-6">
            {['Oil & Filter', 'Fluid Checks', 'Parts Inspection', 'Warranty Included'].map((f) => (
              <span key={f} className="text-xs bg-gold-500/10 text-gold-400 px-3 py-1 rounded-full">{f}</span>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              asChild
              className="flex-1 bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold"
              onClick={() => setServicingModalOpen(false)}
            >
              <Link href="/booking?service=servicing">Book Car Service</Link>
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-gold-500/40 text-gray-300 hover:bg-navy-800"
              onClick={() => setServicingModalOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tyres & Wheel Alignment Modal */}
      <Dialog open={tyresModalOpen} onOpenChange={setTyresModalOpen}>
        <DialogContent className="bg-navy-900 border border-gold-500/30 text-white max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-gold-500/20 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-gold-500" />
              </div>
              Tyres &amp; Wheel Alignment
            </DialogTitle>
          </DialogHeader>

          <p className="text-gray-300 mb-6">
            Tyre fitting, balancing, rotation, and professional wheel alignment for all makes and models.
          </p>

          {/* Pricing table */}
          <h3 className="text-lg font-bold text-gold-500 mb-4">Tyre Fitting Price Guide</h3>
          <div className="grid grid-cols-3 gap-3 mb-5">
            {tyrePricing.map((t) => (
              <div key={t.size} className="bg-navy-800 border border-gold-500/20 rounded-lg p-4 text-center">
                <p className="text-gold-500 font-bold text-2xl mb-1">{t.size}</p>
                <p className="text-white text-sm font-medium">£{t.from} – £{t.to}</p>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div className="bg-gold-500/10 border border-gold-500/30 rounded-lg p-4 space-y-1 mb-6">
            <p className="text-gold-400 text-sm font-medium">Most common sizes available same day.</p>
            <p className="text-gold-400 text-sm font-medium">Premium brands also available on request.</p>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-2 mb-6">
            {['Quality Tyres', 'Balancing', 'Alignment', 'Same Day Available'].map((f) => (
              <span key={f} className="text-xs bg-gold-500/10 text-gold-400 px-3 py-1 rounded-full">{f}</span>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              asChild
              className="flex-1 bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold"
              onClick={() => setTyresModalOpen(false)}
            >
              <Link href="/booking?service=tyres">Book Tyre Fitting</Link>
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-gold-500/40 text-gray-300 hover:bg-navy-800"
              onClick={() => setTyresModalOpen(false)}
            >
              Close
            </Button>
          </div>
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
            <Button
              asChild
              size="lg"
              className="bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold"
            >
              <Link href="/booking">Book Now</Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-navy-950 font-bold"
            >
              <a href="tel:01622438114">Call: 01622 438114</a>
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
