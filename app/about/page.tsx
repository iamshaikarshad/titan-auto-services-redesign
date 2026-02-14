'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import { CheckCircle2, Star, Users, Zap } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900 to-navy-950 -z-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">About Titan Auto Service</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            25+ years of trusted automotive excellence. Strength you can trust.
          </p>
        </motion.div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-gradient-to-br from-gold-500/20 to-gold-500/5 rounded-lg p-8 border border-gold-500/20">
                <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
                <p className="text-gray-300 mb-4 leading-relaxed">
                  Founded in 1998, Titan Auto Service has been serving the Maidstone community for over 25 years. What started as a small family garage has grown into one of the most trusted automotive service centres in Kent.
                </p>
                <p className="text-gray-300 mb-4 leading-relaxed">
                  Our commitment to excellence, honest pricing, and quality workmanship has earned us thousands of loyal customers. We believe in transparency, integrity, and putting our customers first.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Today, our team of highly skilled ASE-certified technicians uses state-of-the-art diagnostic equipment to service and repair all makes and models of vehicles.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-6"
            >
              {[
                { value: '25+', label: 'Years Experience' },
                { value: '5000+', label: 'Happy Customers' },
                { value: '8', label: 'Expert Technicians' },
                { value: '100%', label: 'Satisfaction Guarantee' },
              ].map((stat, idx) => (
                <Card key={idx} className="bg-navy-800 border-gold-500/20 p-6 text-center">
                  <p className="text-3xl font-bold text-gold-500 mb-2">{stat.value}</p>
                  <p className="text-gray-400">{stat.label}</p>
                </Card>
              ))}
            </motion.div>
          </div>
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
              We combine expertise, quality, and genuine care for our customers.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {[
              {
                icon: CheckCircle2,
                title: 'Expert Technicians',
                description: 'ASE-certified mechanics with extensive experience on all vehicle types.',
              },
              {
                icon: Star,
                title: 'Genuine Parts',
                description: 'Only OEM and quality replacement parts used on every vehicle.',
              },
              {
                icon: Zap,
                title: 'Modern Equipment',
                description: 'Advanced diagnostic tools and technology for accurate repairs.',
              },
              {
                icon: Users,
                title: 'Customer First',
                description: 'Transparent pricing, honest advice, and exceptional service.',
              },
            ].map((item, idx) => {
              const Icon = item.icon
              return (
                <motion.div key={idx} variants={fadeInUp}>
                  <Card className="bg-navy-800 border-gold-500/20 p-8 hover:border-gold-500/50 transition">
                    <Icon className="w-12 h-12 text-gold-500 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-gray-400">{item.description}</p>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Meet Our Team</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Skilled, dedicated professionals committed to your vehicle's health.
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
                name: 'John Smith',
                role: 'Head Mechanic',
                experience: '18 years',
              },
              {
                name: 'Mike Johnson',
                role: 'Diagnostic Specialist',
                experience: '15 years',
              },
              {
                name: 'David Brown',
                role: 'Brake & Suspension',
                experience: '12 years',
              },
            ].map((member, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card className="bg-navy-800 border-gold-500/20 p-8 text-center">
                  <div className="w-20 h-20 bg-gold-500/20 rounded-full mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                  <p className="text-gold-500 font-bold mb-2">{member.role}</p>
                  <p className="text-gray-400 text-sm">{member.experience} of experience</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-navy-900 to-navy-800 border-t border-gold-500/20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h2 className="text-4xl font-bold mb-6">Experience the Difference</h2>
          <p className="text-xl text-gray-300 mb-8">
            Trust Titan Auto Service for all your automotive needs.
          </p>

          <Button
            asChild
            size="lg"
            className="bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold"
          >
            <Link href="/booking">Book Your Service Today</Link>
          </Button>
        </motion.div>
      </section>
    </div>
  )
}
