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
  { src: '/images/titan-workshop.jpg', alt: 'Titan Auto Services workshop with hydraulic lifts and tyre storage' },
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
    author: 'Peugeot 508 Owner',
    rating: 5,
    text: 'I went to Titan garages today because I had an engine management light come up and my car was only reaching a maximum speed of 65mph. The garage done a thorough check and they also cleaned every sensor in the engine regarding to an airflow problem. Nothing was too much and just a great garage, really friendly, very knowledgeable and I would recommend them to all my friends.',
    date: '24 Feb 2026',
    dateSort: 18,
    service: 'Engine Diagnostics',
    vehicle: 'Peugeot 508',
  },
  {
    author: 'VW Polo Owner',
    rating: 5,
    text: 'Very helpful and great customer service. Would definitely recommend!',
    date: '17 Feb 2026',
    dateSort: 25,
    service: 'Car Service',
    vehicle: 'Volkswagen Polo',
  },
  {
    author: 'Ford Fiesta Owner',
    rating: 5,
    text: 'Good service, honest pricing and detailed explanation before service. I was happy with the service as they offered to fix my exhaust for much lower price than initially quoted at another garage. The issue was fixed and my car passed the MOT as well. Simple, quick and urgent works done at ease. Can depend on them for urgent works and service.',
    date: '12 Feb 2026',
    dateSort: 30,
    service: 'MOT & Exhaust',
    vehicle: 'Ford Fiesta',
  },
  {
    author: 'James H.',
    rating: 5,
    text: 'Excellent garage! They were honest about what needed doing and what could wait. Fair prices and quality workmanship. Will definitely be back.',
    date: '5 Feb 2026',
    dateSort: 37,
    service: 'Full Service',
    vehicle: 'BMW 3 Series',
  },
  {
    author: 'Sarah M.',
    rating: 5,
    text: 'Took my car in for new tyres and wheel alignment. Quick turnaround, competitive prices, and the staff were really friendly. Highly recommend!',
    date: '28 Jan 2026',
    dateSort: 45,
    service: 'Tyres & Alignment',
    vehicle: 'Audi A3',
  },
  {
    author: 'David K.',
    rating: 5,
    text: 'Best garage in Maidstone! Been using them for over a year now and never been disappointed. Always honest and upfront about costs.',
    date: '20 Jan 2026',
    dateSort: 53,
    service: 'MOT',
    vehicle: 'Toyota Yaris',
  },
  {
    author: 'Emma W.',
    rating: 5,
    text: 'Professional service from start to finish. They diagnosed the issue quickly and had my car back on the road the same day. Great communication throughout.',
    date: '15 Jan 2026',
    dateSort: 58,
    service: 'Brake Repair',
    vehicle: 'Honda Civic',
  },
  {
    author: 'Michael T.',
    rating: 5,
    text: 'Brilliant service! Air con recharge was done quickly and at a fair price. The team really know their stuff. Would recommend to anyone.',
    date: '8 Jan 2026',
    dateSort: 65,
    service: 'Air Con Service',
    vehicle: 'Mercedes A-Class',
  },
]

const reviewStats = {
  totalReviews: 91,
  averageRating: 4.9,
}

type ReviewFilter = 'relevant' | 'newest' | 'top'

function ReviewsSection() {
  const [filter, setFilter] = useState<ReviewFilter>('relevant')

  const sortedReviews = [...googleReviews].sort((a, b) => {
    if (filter === 'newest') return a.dateSort - b.dateSort
    if (filter === 'top') return b.rating - a.rating || a.dateSort - b.dateSort
    // 'relevant' - mix of rating and recency
    return (b.rating * 10 - b.dateSort) - (a.rating * 10 - a.dateSort)
  })

  const filters: { key: ReviewFilter; label: string }[] = [
    { key: 'relevant', label: 'Most Relevant' },
    { key: 'newest', label: 'Newest' },
    { key: 'top', label: 'Top Rated' },
  ]

  return (
    <section className="py-20 bg-navy-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Trusted by Our Customers</h2>
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 ${i < Math.floor(reviewStats.averageRating) ? 'text-gold-500 fill-gold-500' : 'text-gold-500/30 fill-gold-500/30'}`}
                />
              ))}
            </div>
            <span className="text-2xl text-white font-bold">{reviewStats.averageRating}</span>
          </div>
          <p className="text-gray-400">Based on {reviewStats.totalReviews} Google Reviews</p>
        </motion.div>

        {/* Filter tabs */}
        <div className="flex justify-center gap-2 mb-10">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition ${
                filter === f.key
                  ? 'bg-gold-500 text-navy-950'
                  : 'bg-navy-800 text-gray-300 hover:bg-navy-700 border border-gold-500/20'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <motion.div
          key={filter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {sortedReviews.map((review, idx) => (
            <motion.div
              key={review.author}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
            >
              <Card className="bg-navy-800 border-gold-500/20 p-6 h-full hover:border-gold-500/50 transition flex flex-col">
                {/* Header with avatar and info */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-gold-500/20 rounded-full flex items-center justify-center text-gold-500 font-bold text-lg shrink-0">
                    {review.author.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-semibold truncate">{review.author}</p>
                    <p className="text-gray-500 text-sm">{review.date}</p>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex gap-0.5 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-gold-500 fill-gold-500" />
                  ))}
                </div>

                {/* Review text */}
                <p className="text-gray-300 text-sm leading-relaxed flex-grow">"{review.text}"</p>

                {/* Service & vehicle tags */}
                <div className="mt-4 pt-4 border-t border-gold-500/10 flex flex-wrap gap-2">
                  <span className="text-xs bg-gold-500/10 text-gold-400 px-2 py-1 rounded-full">
                    {review.service}
                  </span>
                  {review.vehicle && (
                    <span className="text-xs bg-navy-700 text-gray-400 px-2 py-1 rounded-full">
                      {review.vehicle}
                    </span>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Google badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 text-center"
        >
          <a
            href="https://www.google.com/search?q=Titan+Auto+Services+Reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition text-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            View all reviews on Google
          </a>
        </motion.div>
      </div>
    </section>
  )
}

function RegWidget() {
  const [reg, setReg] = useState('')

  const handleGetPrice = () => {
    if (!reg.trim()) return
    const url = `https://bookmygarage.com/garage-detail/titan-auto-services_bt/me157uh/book/?ref=www.titanautoservices.co.uk&vrm=${encodeURIComponent(reg.trim().toUpperCase())}&referrer=widget`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="mt-10 max-w-2xl"
    >
      <p className="text-white font-bold text-lg mb-3">Get an instant price for your MOT or service and book for free.</p>

      <div className="flex items-stretch gap-3">
        {/* Flag + input joined flush */}
        <div className="flex flex-1 rounded-lg overflow-hidden shadow-lg shadow-black/40 min-w-0">
          {/* UK flag badge */}
          <div className="flex flex-col items-center justify-center bg-[#003087] px-3 py-2 gap-0.5 shrink-0">
            <span className="text-xl leading-none">🇬🇧</span>
            <span className="text-white text-[10px] font-bold leading-none tracking-widest">UK</span>
          </div>
          {/* Reg input */}
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

        {/* CTA button — separated by gap-3 */}
        <button
          onClick={handleGetPrice}
          className="bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold text-base px-6 py-3 rounded-lg transition whitespace-nowrap shrink-0 shadow-lg shadow-black/30"
        >
          Get a price now &rsaquo;
        </button>
      </div>
    </motion.div>
  )
}

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

            {/* Instant price widget */}
            <RegWidget />
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
      <ReviewsSection />

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
