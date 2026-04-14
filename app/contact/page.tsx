'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import Image from 'next/image'

export default function ContactPage() {
  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      details: '01622 438114',
      link: 'tel:01622438114',
    },
    {
      icon: Mail,
      title: 'Email',
      details: 'info@titanautoservices.co.uk',
      link: 'mailto:info@titanautoservices.co.uk',
    },
    {
      icon: MapPin,
      title: 'Location',
      details: '11 Waterloo Street, Maidstone, ME15 7UH',
      link: '#',
    },
    {
      icon: Clock,
      title: 'Hours',
      details: 'Mon - Fri: 8:00 AM - 6:00 PM',
      link: '#',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative pt-32 pb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900 to-navy-950 -z-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Get In Touch</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Have questions? We're here to help. Contact us today.
          </p>
        </motion.div>
      </section>

      {/* Contact Information */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
          >
            {contactInfo.map((item, idx) => {
              const Icon = item.icon
              return (
                <motion.div key={idx} variants={fadeInUp}>
                  <Card className="bg-navy-800 border-gold-500/20 p-8 text-center h-full hover:border-gold-500/50 transition">
                    <Icon className="w-12 h-12 text-gold-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                    <a
                      href={item.link}
                      className="text-gray-400 hover:text-gold-500 transition text-sm"
                    >
                      {item.details}
                    </a>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Map and Contact Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-navy-800 border-gold-500/20 overflow-hidden h-96 lg:h-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2491.5699998891507!2d0.5270529!3d51.272569!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d5a63f7f5f5f5f%3A0x5f5f5f5f5f5f5f5f!2s11%20Waterloo%20Street%2C%20Maidstone%20ME15%207UH!5e0!3m2!1sen!2suk!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </Card>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-navy-800 border-gold-500/20 p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>

                <form className="space-y-6">
                  <div>
                    <label className="block text-white font-bold mb-2">Full Name</label>
                    <input
                      type="text"
                      placeholder="Your name"
                      className="w-full bg-navy-700 border border-gold-500/20 rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-gold-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-bold mb-2">Email</label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className="w-full bg-navy-700 border border-gold-500/20 rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-gold-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-bold mb-2">Phone</label>
                    <input
                      type="tel"
                      placeholder="01622 000000"
                      className="w-full bg-navy-700 border border-gold-500/20 rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-gold-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-bold mb-2">Message</label>
                    <textarea
                      placeholder="Your message..."
                      rows={5}
                      className="w-full bg-navy-700 border border-gold-500/20 rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-gold-500 transition resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold"
                  >
                    Send Message
                  </Button>
                </form>
              </Card>
            </motion.div>
          </div>
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
          <h2 className="text-4xl font-bold mb-6">Ready to Book?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Schedule your service appointment online today.
          </p>

          <Button
            asChild
            size="lg"
            className="bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold"
          >
            <Link href="/booking">Book Your Service</Link>
          </Button>
        </motion.div>
      </section>
    </div>
  )
}
