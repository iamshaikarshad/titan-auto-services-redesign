'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CheckCircle2 } from 'lucide-react'

const servicesData = [
  {
    id: 'oil-change',
    title: 'Oil Change',
    price: '$49.99',
    duration: '30 minutes',
    description: 'Regular oil and filter changes to keep your engine running smoothly.',
    features: ['Synthetic or conventional oil', 'New oil filter', 'Fluid level check', 'Multi-point inspection'],
  },
  {
    id: 'brake-service',
    title: 'Brake Service',
    price: '$129.99',
    duration: '1-2 hours',
    description: 'Brake pad replacement, rotor servicing, and brake fluid checks.',
    features: ['Brake pad replacement', 'Rotor inspection and servicing', 'Brake fluid check', 'System testing'],
  },
  {
    id: 'tire-service',
    title: 'Tire Service',
    price: '$79.99',
    duration: '45 minutes',
    description: 'Tire rotation, balancing, alignment, and repair services.',
    features: ['Tire rotation', 'Balancing', 'Alignment check', 'Pressure adjustment'],
  },
  {
    id: 'engine-diagnostics',
    title: 'Engine Diagnostics',
    price: '$89.99',
    duration: '1 hour',
    description: 'Computer diagnostics to identify engine issues and problems.',
    features: ['Full system scan', 'Error code reading', 'Diagnostic report', 'Repair recommendations'],
  },
  {
    id: 'battery-replacement',
    title: 'Battery Replacement',
    price: '$99.99',
    duration: '30 minutes',
    description: 'Battery testing, replacement, and terminal cleaning.',
    features: ['Battery testing', 'New battery installation', 'Terminal cleaning', '2-year warranty'],
  },
  {
    id: 'transmission-service',
    title: 'Transmission Service',
    price: '$149.99',
    duration: '2-3 hours',
    description: 'Transmission fluid change and filter replacement.',
    features: ['Fluid flush', 'Filter replacement', 'System inspection', 'Performance testing'],
  },
  {
    id: 'ac-service',
    title: 'AC Service',
    price: '$119.99',
    duration: '1.5 hours',
    description: 'Air conditioning system service, recharge, and repair.',
    features: ['System inspection', 'Refrigerant recharge', 'Belt and hose check', 'Performance test'],
  },
  {
    id: 'suspension-repair',
    title: 'Suspension Repair',
    price: '$159.99',
    duration: '2-3 hours',
    description: 'Suspension system inspection, repair, and replacement.',
    features: ['Spring and shock inspection', 'Strut replacement', 'Alignment adjustment', 'Road test'],
  },
]

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main>
        {/* Page Header */}
        <section className="py-12 md:py-16 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
            <p className="text-xl text-slate-300">
              Professional auto repair and maintenance solutions you can rely on.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 gap-4">
              {servicesData.map((service) => (
                <Card
                  key={service.id}
                  className="p-4 cursor-pointer transition border-2 border-slate-200 hover:border-blue-600 hover:shadow-lg"
                  onClick={() => window.location.href = `/booking?service=${service.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-slate-900 mb-1">{service.title}</h3>
                      <p className="text-sm text-slate-600 mb-3">{service.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-slate-600"><span className="font-semibold">Duration:</span> {service.duration}</span>
                        <span className="text-blue-600 font-semibold">{service.price}</span>
                      </div>
                    </div>
                    <Button asChild className="bg-blue-600 hover:bg-blue-700 ml-4">
                      <Link href={`/booking?service=${service.id}`}>Book</Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Info */}
        <section className="py-16 md:py-24 bg-slate-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-slate-900">
              What Makes Our Service Special
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-bold mb-3 text-slate-900">Certified Technicians</h3>
              <p className="text-slate-600">
                All our mechanics are ASE certified and continuously trained on the latest automotive technology.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-bold mb-3 text-slate-900">Genuine Parts</h3>
              <p className="text-slate-600">
                We use only genuine and OEM-quality parts to ensure your vehicle's longevity and reliability.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-bold mb-3 text-slate-900">Warranty Protection</h3>
              <p className="text-slate-600">
                Every service comes with a comprehensive warranty on parts and labor for your peace of mind.
              </p>
            </div>
          </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Schedule Your Service?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Book your appointment online today and experience the Titan Auto Service difference.
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
