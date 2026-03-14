'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import { Gauge, Wrench, Zap, Shield, Clock, Award, ChevronRight, ChevronDown, Zap as Battery, Wind, Lightbulb } from 'lucide-react'
import Image from 'next/image'

const tyrePricing = [
  { size: '14"', from: 35, to: 45 },
  { size: '15"', from: 40, to: 50 },
  { size: '16"', from: 60, to: 70 },
  { size: '17"', from: 65, to: 85 },
  { size: '18"', from: 70, to: 90 },
  { size: '19"', from: 80, to: 110 },
]

const allServices = [
  {
    icon: Gauge,
    title: 'MOT Testing Maidstone',
    description: 'Professional MOT testing with DVSA approval. Complete vehicle inspection and diagnostics.',
    price: 'From £45',
    features: ['DVSA Approved', 'Expert Inspection', '30-Min Test', 'Instant Results'],
    href: '/services/mot',
    isTyres: false,
  },
  {
    icon: Wrench,
    title: 'Car Servicing',
    description: 'Full and interim servicing with genuine parts and comprehensive maintenance.',
    price: 'From £150',
    features: ['Oil & Filter', 'Fluid Checks', 'Parts Inspection', 'Warranty Included'],
    href: '/services/servicing',
    isTyres: false,
  },
  {
    icon: Zap,
    title: 'Tyres & Wheel Alignment',
    description: 'Tyre fitting, balancing, rotation, and professional wheel alignment.',
    price: 'From £35',
    features: ['Quality Tyres', 'Balancing', 'Alignment', 'Same Day Available'],
    href: '/services/tyres',
    isTyres: true,
  },
  {
    icon: Shield,
    title: 'Brake Service & Repairs',
    description: 'Complete brake system repairs, pad replacement, and safety inspections.',
    price: 'From £80',
    features: ['Pad Replacement', 'Rotor Service', 'Safety Check', 'Warranty'],
    href: '/services/brakes',
    isTyres: false,
  },
  {
    icon: Clock,
    title: 'Engine Diagnostics',
    description: 'Advanced diagnostic equipment to identify and resolve engine issues.',
    price: 'From £50',
    features: ['Advanced Tech', 'Fast Results', 'Expert Advice', 'Transparent Pricing'],
    href: '/services/diagnostics',
    isTyres: false,
  },
  {
    icon: Award,
    title: 'Air Conditioning Service',
    description: 'Professional air conditioning maintenance and refrigerant recharge.',
    price: 'From £75',
    features: ['A/C Recharge', 'System Check', 'Refrigerant', 'Leak Detection'],
    href: '/services/air-con',
    isTyres: false,
  },
  {
    icon: Wind,
    title: 'Exhaust System Service',
    description: 'Exhaust repair, replacement, and maintenance. Professional welding and installation.',
    price: 'From £120',
    features: ['Repairs & Welding', 'Full Replacement', 'Emissions Check', 'Quality Parts'],
    href: '/services/exhaust',
    isTyres: false,
  },
  {
    icon: Lightbulb,
    title: 'Suspension Service',
    description: 'Suspension repair, strut replacement, and wheel alignment services.',
    price: 'From £150',
    features: ['Strut Replacement', 'Spring Service', 'Alignment', 'Ride Quality'],
    href: '/services/suspension',
    isTyres: false,
  },
  {
    icon: Battery,
    title: 'Battery Service',
    description: 'Battery testing, replacement, terminal cleaning, and charging services.',
    price: 'From £60',
    features: ['Battery Testing', 'Replacement', 'Terminal Cleaning', 'Warranty'],
    href: '/services/battery',
    isTyres: false,
  },
]

export default function ServicesPage() {
  const [tyresExpanded, setTyresExpanded] = useState(false)

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
                <motion.div key={idx} variants={fadeInUp} className={service.isTyres ? 'md:col-span-2 lg:col-span-3' : ''}>
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
                      <>
                        <Button
                          onClick={() => setTyresExpanded(!tyresExpanded)}
                          className="w-full bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold flex items-center justify-center gap-2 mb-4"
                        >
                          Learn More
                          <ChevronDown size={18} className={`transition-transform duration-300 ${tyresExpanded ? 'rotate-180' : ''}`} />
                        </Button>

                        <AnimatePresence>
                          {tyresExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="border-t border-gold-500/20 pt-6">
                                <h4 className="text-xl font-bold text-white mb-4">Tyre Fitting Price Guide</h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
                                  {tyrePricing.map((t) => (
                                    <div key={t.size} className="bg-navy-700 border border-gold-500/20 rounded-lg p-4 text-center">
                                      <p className="text-gold-500 font-bold text-xl mb-1">{t.size}</p>
                                      <p className="text-white text-sm font-medium">£{t.from} – £{t.to}</p>
                                    </div>
                                  ))}
                                </div>
                                <div className="bg-gold-500/10 border border-gold-500/30 rounded-lg p-4 space-y-1">
                                  <p className="text-gold-400 text-sm font-medium">Most common sizes available same day.</p>
                                  <p className="text-gold-400 text-sm font-medium">Premium brands also available on request.</p>
                                </div>
                                <Button
                                  asChild
                                  className="w-full mt-5 bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold"
                                >
                                  <Link href="/booking?service=tyres">Book Tyre Fitting</Link>
                                </Button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
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
