'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import { Wrench, Zap, Shield, Clock, Award, Gauge, Star } from 'lucide-react'
import Image from 'next/image'

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
    title: '25+ Years',
    description: 'Family-run garage trusted by thousands of customers in Maidstone.',
  },
  {
    title: 'Expert Mechanics',
    description: 'ASE-certified technicians trained on latest automotive technology.',
  },
  {
    title: 'Warranty',
    description: 'Comprehensive warranty on all parts and labour for complete peace of mind.',
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
  return (
    <div className="min-h-screen">
      {/* Hero Section - Fixed */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900 to-navy-950 -z-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Premium Car Servicing in
                <br />
                <span className="bg-gradient-to-r from-[#D6C29C] to-[#BFA46F] bg-clip-text text-transparent inline-block">
                  Maidstone
                </span>
              </h1>


              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl text-balance">
                Expert mechanics. Genuine parts. Transparent pricing. Strength you can trust.
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

            {/* Right Side - Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-96 lg:h-full rounded-lg overflow-hidden"
            >
              <Image
                src="/hero-car-service.jpg"
                alt="Professional car servicing at Titan Auto"
                fill
                className="object-cover rounded-lg"
                priority
              />
              <div className="absolute inset-0 rounded-lg border-2 border-gold-500/30" />
            </motion.div>
          </div>
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
                <h3 className="text-2xl font-bold text-gold-500 mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
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
                  <p className="text-gray-300 mb-4 text-sm italic">"{review.text}"</p>
                  <p className="text-gold-500 font-semibold text-sm">— {review.author}</p>
                </Card>
              </motion.div>
            ))}
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
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Comprehensive automotive solutions for all your car maintenance and repair needs.
            </p>
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
                    <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                    <p className="text-gray-400">{service.description}</p>
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
          <p className="text-xl text-gray-300 mb-8">
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
  )
}
