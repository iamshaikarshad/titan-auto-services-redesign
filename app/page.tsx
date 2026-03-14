'use client'

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import { Wrench, Zap, Shield, Clock, Award, Gauge, Star, UserCheck, Package, ShieldCheck, BadgeDollarSign, Car, Coffee, Heart, MapPin } from 'lucide-react'
import Image from 'next/image'
import { IntroAnimation } from '@/components/intro-animation'

const heroImages = [
  { src: '/hero-car-service.jpg', alt: 'Professional car servicing at Titan Auto' },
  { src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/titin-workshop-0WU73m4UMiEfRIFQ2vB7CUhbK8Edfe.jpg', alt: 'Titan Auto Services workshop with hydraulic lifts and tyre storage' },
  { src: '/images/titan-workshop2.jpg', alt: 'BMW on hydraulic lift at Titan Auto Services workshop' },
]

const services = [
  {
    icon: Gauge,
    title: 'MOT Testing',
    description: 'Professional MOT testing with DVSA approval. Expert inspection and diagnostics.',
  },
  {
    icon: Wrench,
    title: 'Car Servicing',
    description: 'Full and interim servicing with genuine parts and comprehensive maintenance.',
  },
  {
    icon: Zap,
    title: 'Tyres & Wheels',
    description: 'Tyre fitting, balancing, rotation, and wheel alignment services.',
  },
  {
    icon: Shield,
    title: 'Brake Service',
    description: 'Complete brake repairs, pad replacement, and safety inspections.',
  },
  {
    icon: Clock,
    title: 'Engine Diagnostics',
    description: 'Advanced diagnostic equipment to identify and resolve engine issues.',
  },
  {
    icon: Award,
    title: 'Air Con Service',
    description: 'Professional air conditioning maintenance and recharge services.',
  },
]

const features = [
  {
    title: 'Family-Run',
    description: 'A reliable, family-run garage located in the heart of Maidstone since day one.',
  },
  {
    title: 'Local Experts',
    description: 'Professional technicians who know your community and your vehicles.',
  },
  {
    title: 'Honest Service',
    description: 'Transparent pricing with no hidden fees - just quality work you can trust.',
  },
]

const googleReviews = [
  {
    author: 'David Thompson',
    rating: 5,
    text: 'Excellent service! The team at Titan Auto was professional, honest, and gave me great advice. Highly recommended!',
  },
  {
    author: 'Sarah Mitchell',
    rating: 5,
    text: 'Great experience. Fair prices and outstanding customer service. They explained everything clearly.',
  },
  {
    author: 'James Peterson',
    rating: 5,
    text: 'Very reliable garage. Been a customer for years. Always deliver quality work on time.',
  },
  {
    author: 'Emma Collins',
    rating: 5,
    text: 'Professional mechanics. Got my MOT done quickly and they identified issues before they became expensive.',
  },
]

export default function HomePage() {
  const [heroIndex, setHeroIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <>
      <IntroAnimation />
      <div className="min-h-screen">
      {/* Hero Section - Background Image */}
      <section className="relative min-h-screen pt-24 pb-20 overflow-hidden flex items-center">
        {/* Background Image Slideshow */}
        <div className="absolute inset-0 -z-10">
          <AnimatePresence initial={false}>
            <motion.div
              key={heroIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
              <Image
                src={heroImages[heroIndex].src}
                alt={heroImages[heroIndex].alt}
                fill
                className="object-cover"
                priority={heroIndex === 0}
              />
            </motion.div>
          </AnimatePresence>
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900/95 via-navy-900/85 to-navy-900/70" />

          {/* Dot indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {heroImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === heroIndex ? 'bg-gold-500 w-6' : 'bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Your Local, Family-Run
              <br />
              <span className="bg-gradient-to-r from-[#D6C29C] to-[#BFA46F] bg-clip-text text-transparent inline-block">
                Garage in Maidstone
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl text-balance">
              Titan Auto Services is a reliable, family-run garage located in the heart of Maidstone. We offer honest, professional service with transparent pricing.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  asChild
                  size="lg"
                  className="bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold"
                >
                  <Link href="/booking">Book MOT</Link>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  asChild
                  size="lg"
                  className="bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold"
                >
                  <Link href="/booking">Book Service</Link>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-navy-950 font-bold"
                >
                  <Link href="/services">View All Services</Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 bg-navy-900/50 backdrop-blur-sm border-y border-gold-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {features.map((feature, idx) => (
              <motion.div key={idx} variants={fadeInUp} className="text-center">
                <h3 className="text-3xl font-bold text-gold-500 mb-2">{feature.title}</h3>
                <p className="text-gray-300 text-lg">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Google Reviews Section */}
      <section className="py-20 bg-navy-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Trusted by Our Customers</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto flex items-center justify-center gap-2">
              <Star className="w-6 h-6 text-gold-500 fill-gold-500" />
              5 Star Google Reviews
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {googleReviews.map((review, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card className="bg-navy-800 border-gold-500/20 p-6 h-full hover:border-gold-500/50 transition">
                  <div className="flex gap-1 mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-gold-500 fill-gold-500"
                      />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4 text-base italic leading-relaxed">"{review.text}"</p>
                  <p className="text-gold-500 font-semibold text-base">— {review.author}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gradient-to-b from-navy-900/50 to-navy-950/50 border-y border-gold-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Choose Titan Auto?</h2>
            <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We are committed to providing the Maidstone community with reliable, honest, and professional automotive services.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Car,
                title: 'Local Pickup & Drop-off',
                description: 'We offer convenient local pickup and drop-off services within Maidstone to make your experience hassle-free.',
              },
              {
                icon: UserCheck,
                title: 'Professional Technicians',
                description: 'Our skilled mechanics are trained to handle a wide range of vehicles with precision and care.',
              },
              {
                icon: Coffee,
                title: 'Comfortable Waiting Area',
                description: 'Relax in our welcoming waiting area with complimentary refreshments while we service your vehicle.',
              },
              {
                icon: BadgeDollarSign,
                title: 'Honest & Transparent',
                description: 'We believe in clear communication and fair pricing - no hidden fees, no unnecessary upsells.',
              },
              {
                icon: Heart,
                title: 'Family-Operated',
                description: 'As a family-run business, we treat every customer like one of our own and take pride in building lasting relationships.',
              },
              {
                icon: MapPin,
                title: 'Community First',
                description: 'We are proud to serve the Maidstone community and are dedicated to keeping local drivers safe on the road.',
              },
            ].map((item, idx) => {
              const Icon = item.icon
              return (
                <motion.div key={idx} variants={fadeInUp}>
                  <Card className="bg-navy-800 border-gold-500/20 p-8 hover:border-gold-500/50 transition h-full group">
                    <div className="w-14 h-14 bg-gold-500/20 rounded-lg mb-5 flex items-center justify-center group-hover:bg-gold-500/30 transition">
                      <Icon className="w-7 h-7 text-gold-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-gray-300 text-lg leading-relaxed">{item.description}</p>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h2>
            <p className="text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Comprehensive automotive solutions for all your car maintenance and repair needs.
            </p>
          </motion.div>

          {/* Workshop image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-16 rounded-2xl overflow-hidden border border-gold-500/20 shadow-xl shadow-gold-500/5"
          >
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/titin-workshop-0WU73m4UMiEfRIFQ2vB7CUhbK8Edfe.jpg"
              alt="Titan Auto Services workshop - professional garage with hydraulic lifts and tyre storage"
              className="w-full h-72 md:h-96 object-cover object-center"
            />
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {services.map((service, idx) => {
              const Icon = service.icon
              return (
                <motion.div key={idx} variants={fadeInUp}>
                  <Card className="bg-navy-800 border-gold-500/20 hover:border-gold-500/50 transition p-8 h-full hover:shadow-lg hover:shadow-gold-500/10 group cursor-pointer">
                    <div className="mb-6">
                      <div className="w-16 h-16 bg-gold-500/10 rounded-lg flex items-center justify-center group-hover:bg-gold-500/20 transition">
                        <Icon className="w-8 h-8 text-gold-500" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">{service.title}</h3>
                    <p className="text-gray-300 text-lg leading-relaxed">{service.description}</p>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <Button
              asChild
              size="lg"
              className="bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold"
            >
              <Link href="/services">Explore All Services</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-navy-900 to-navy-800 border-y border-gold-500/20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Book Your Service Today</h2>
          <p className="text-2xl text-gray-300 mb-8 leading-relaxed">
            Fast, reliable, and professional car servicing. Book online or give us a call.
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
    </>
  )
}
