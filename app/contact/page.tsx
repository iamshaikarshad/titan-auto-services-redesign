'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Mail, Phone, MapPin, Clock, AlertCircle, CheckCircle2 } from 'lucide-react'

interface ContactFormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      setSubmitStatus('success')
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      setTimeout(() => setSubmitStatus('idle'), 5000)
    } catch (err) {
      setSubmitStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Header />
      <main>
        {/* Page Header */}
        <section className="py-12 md:py-16 bg-slate-900 text-white">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-slate-300">
              Get in touch with our team. We're here to help.
            </p>
          </div>
        </section>

        {/* Contact Info & Form */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {/* Contact Info Cards */}
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Phone</h3>
                    <a href="tel:01622438114" className="text-blue-600 hover:text-blue-700 block">
                      01622 438114
                    </a>
                    <a href="tel:07305509999" className="text-blue-600 hover:text-blue-700 block">
                      07305 509999
                    </a>
                    <p className="text-sm text-slate-600 mt-2">Mon-Fri 8am-6pm, Sat 9am-2pm</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Email</h3>
                    <a href="mailto:info@titanautoservices.co.uk" className="text-blue-600 hover:text-blue-700">
                      info@titanautoservices.co.uk
                    </a>
                    <p className="text-sm text-slate-600 mt-1">Response within 24 hours</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Address</h3>
                    <p className="text-slate-700 font-semibold">Titan Auto Service</p>
                    <p className="text-slate-700">11 Waterloo Street</p>
                    <p className="text-slate-700">Maidstone, ME15 7UH</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Hours Card */}
            <Card className="p-6 mb-12 bg-slate-50 border-0">
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                  <h3 className="font-bold text-slate-900 mb-4">Business Hours</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-slate-700"><span className="font-semibold">Monday - Friday:</span> 8:00 AM - 6:00 PM</p>
                      <p className="text-slate-700"><span className="font-semibold">Saturday:</span> 9:00 AM - 2:00 PM</p>
                      <p className="text-slate-700"><span className="font-semibold">Sunday:</span> Closed</p>
                    </div>
                    <div className="text-slate-600 text-sm">
                      <p>Closed on major holidays.</p>
                      <p className="mt-2">Call ahead for emergency services.</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Contact Form */}
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-slate-900">Send us a Message</h2>

              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-800">Message sent successfully!</p>
                    <p className="text-green-700">We'll get back to you as soon as possible.</p>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-800">Failed to send message</p>
                    <p className="text-red-700">{errorMessage}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="John Doe"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="(123) 456-7890"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Message
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                    placeholder="Tell us more about your inquiry..."
                    rows={5}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Schedule Your Service?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Book your appointment online for a faster, more convenient experience.
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
