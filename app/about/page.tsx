'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import { Car, UserCheck, Coffee, BadgeDollarSign, Heart, MapPin, Phone, Clock, CheckCircle } from 'lucide-react'

const whyChooseUs = [
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
]

const values = [
  'Honest and transparent service',
  'Quality workmanship on every job',
  'Fair and competitive pricing',
  'Building lasting customer relationships',
  'Supporting our local community',
  'Continuous improvement and training',
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Background Image */}
      <section className="relative min-h-[60vh] pt-24 pb-20 overflow-hidden flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 -z-10">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/titin-workshop-0WU73m4UMiEfRIFQ2vB7CUhbK8Edfe.jpg"
            alt="Titan Auto Services workshop"
            className="w-full h-full object-cover object-center"
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900/95 via-navy-900/85 to-navy-900/60" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              About{' '}
              <span className="bg-gradient-to-r from-[#D6C29C] to-[#BFA46F] bg-clip-text text-transparent">
                Titan Auto Services
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-2xl">
              Your trusted, family-run garage in the heart of Maidstone — honest, professional, and proud to serve our community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-20 bg-navy-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Who We Are</h2>
              <div className="space-y-4 text-lg text-gray-300 leading-relaxed">
                <p>
                  Titan Auto Services is a reliable, family-run garage located in the heart of Maidstone. 
                  We are committed to providing the local community with honest, professional, and affordable 
                  automotive services.
                </p>
                <p>
                  Whether you need a routine service, MOT, or a complex repair, our experienced team is here 
                  to help. We take pride in treating every customer like family and every vehicle like our own.
                </p>
                <p>
                  Our mission is simple: to deliver quality workmanship, transparent pricing, and exceptional 
                  customer service. We believe in building lasting relationships with our customers based on 
                  trust and reliability.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold"
                >
                  <Link href="/booking">Book a Service</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-navy-950 font-bold"
                >
                  <a href="tel:01622438114">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Us
                  </a>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-navy-800 border-gold-500/20 p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Our Values</h3>
                <ul className="space-y-4">
                  {values.map((value, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-gold-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-lg">{value}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-16 bg-navy-950 border-y border-gold-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={fadeInUp} className="text-center">
              <div className="w-14 h-14 bg-gold-500/20 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <MapPin className="w-7 h-7 text-gold-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Our Location</h3>
              <p className="text-gray-300">
                11 Waterloo Street<br />
                Maidstone, ME15 7UH
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="text-center">
              <div className="w-14 h-14 bg-gold-500/20 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Phone className="w-7 h-7 text-gold-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Contact Us</h3>
              <p className="text-gray-300">
                <a href="tel:01622438114" className="hover:text-gold-500 transition">01622 438114</a><br />
                <a href="tel:07305509999" className="hover:text-gold-500 transition">07305 509999</a>
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="text-center">
              <div className="w-14 h-14 bg-gold-500/20 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Clock className="w-7 h-7 text-gold-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Opening Hours</h3>
              <p className="text-gray-300">
                Mon - Fri: 8:00am - 6:00pm<br />
                Saturday: 9:00am - 2:00pm
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-b from-navy-900/50 to-navy-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Choose Us?</h2>
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
            {whyChooseUs.map((item, idx) => {
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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-navy-900 to-navy-800 border-t border-gold-500/20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Experience the Difference?</h2>
          <p className="text-2xl text-gray-300 mb-8 leading-relaxed">
            Book your service today and see why Maidstone drivers trust Titan Auto Services.
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
