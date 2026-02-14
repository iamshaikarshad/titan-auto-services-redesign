'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CheckCircle2, Star, Clock, Wrench, Shield, Users } from 'lucide-react'

export default function Page() {
  const services = [
    { icon: Wrench, title: 'Oil Changes', description: 'Professional oil and filter changes' },
    { icon: Wrench, title: 'Brake Service', description: 'Brake pad replacement and servicing' },
    { icon: Wrench, title: 'Tire Service', description: 'Tire rotation, balancing, and repair' },
    { icon: Wrench, title: 'Engine Diagnostics', description: 'Computer diagnostics and repairs' },
  ]

  const features = [
    { icon: CheckCircle2, title: 'Expert Mechanics', description: 'Certified and experienced technicians' },
    { icon: Shield, title: 'Quality Guarantee', description: 'Warranty on all work performed' },
    { icon: Clock, title: 'Quick Service', description: 'Fast turnaround times' },
    { icon: Star, title: 'Customer Focused', description: 'Transparent pricing and communication' },
  ]

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-slate-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
                Expert Auto Repair You Can Trust
              </h1>
              <p className="text-xl text-slate-300 mb-8 text-balance">
                Get professional car maintenance and repair services from certified mechanics. Book your appointment online today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Link href="/booking">Book Service Now</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900">
                  <Link href="/services">View Services</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Services Preview */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-slate-900">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, idx) => {
                const Icon = service.icon
                return (
                  <Card key={idx} className="p-6 hover:shadow-lg transition">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 text-slate-900">{service.title}</h3>
                    <p className="text-slate-600 text-sm">{service.description}</p>
                  </Card>
                )
              })}
            </div>
            <div className="text-center mt-12">
              <Button asChild size="lg" variant="outline">
                <Link href="/services">Explore All Services</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 md:py-24 bg-slate-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-slate-900">Why Choose SleekSpec?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, idx) => {
                const Icon = feature.icon
                return (
                  <div key={idx} className="text-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 text-slate-900">{feature.title}</h3>
                    <p className="text-slate-600">{feature.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
              Ready to Book Your Service?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Schedule your appointment online and get professional service from our expert mechanics.
            </p>
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-slate-100">
              <Link href="/booking">Book Now</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
