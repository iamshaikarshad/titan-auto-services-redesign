'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Award, Users, Clock, Heart } from 'lucide-react'

export default function AboutPage() {
  const teamMembers = [
    { name: 'John Smith', role: 'Owner & Lead Mechanic', experience: '20+ years' },
    { name: 'Sarah Johnson', role: 'Service Manager', experience: '15+ years' },
    { name: 'Mike Chen', role: 'Master Technician', experience: '18+ years' },
    { name: 'Lisa Rodriguez', role: 'Diagnostic Specialist', experience: '12+ years' },
  ]

  return (
    <>
      <Header />
      <main>
        {/* Page Header */}
        <section className="py-12 md:py-16 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Titan Auto Service</h1>
            <p className="text-xl text-slate-300">
              Your trusted partner in automotive excellence since 2000.
            </p>
          </div>
        </section>

        {/* About Content */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-slate-900">Our Story</h2>
              <p className="text-lg text-slate-700 mb-4 leading-relaxed">
                Titan Auto Service was founded with a simple mission: to provide honest, professional, and reliable auto repair services in Maidstone. What started as a local family-run garage has grown into a trusted institution serving the community with quality, integrity, and transparent service.
              </p>
              <p className="text-lg text-slate-700 mb-4 leading-relaxed">
                We believe in treating every vehicle like it's our own. Our team of ASE-certified mechanics takes pride in delivering exceptional service, transparent communication, and fair pricing without pushy upselling.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed">
                Today, we're still committed to the same values: honesty, expertise, and genuine customer care. We're proud to be part of the Maidstone community.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <Card className="p-6 text-center">
                <Clock className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                <h3 className="font-bold text-slate-900 mb-2">23+ Years</h3>
                <p className="text-sm text-slate-600">In the automotive industry</p>
              </Card>
              <Card className="p-6 text-center">
                <Users className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                <h3 className="font-bold text-slate-900 mb-2">5,000+</h3>
                <p className="text-sm text-slate-600">Satisfied customers</p>
              </Card>
              <Card className="p-6 text-center">
                <Award className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                <h3 className="font-bold text-slate-900 mb-2">ASE Certified</h3>
                <p className="text-sm text-slate-600">All technicians certified</p>
              </Card>
              <Card className="p-6 text-center">
                <Heart className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                <h3 className="font-bold text-slate-900 mb-2">100%</h3>
                <p className="text-sm text-slate-600">Satisfaction guaranteed</p>
              </Card>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-slate-900">Our Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900">Integrity</h3>
                  <p className="text-slate-700">
                    We believe in honest communication, transparent pricing, and never pressuring customers into
                    unnecessary work.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900">Excellence</h3>
                  <p className="text-slate-700">
                    We stay current with the latest automotive technology and continuously train our team to deliver
                    the best service.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900">Customer Focus</h3>
                  <p className="text-slate-700">
                    Your satisfaction is our top priority. We treat every customer with respect and go the extra mile.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 md:py-24 bg-slate-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold mb-12 text-center text-slate-900">Our Expert Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {teamMembers.map((member, idx) => (
                <Card key={idx} className="p-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-full mb-4"></div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-semibold mb-2">{member.role}</p>
                  <p className="text-slate-600">{member.experience} of experience</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Experience the Titan Auto Service Difference
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Schedule your appointment today and discover why we're trusted by families and businesses in Maidstone.
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
