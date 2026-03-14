'use client'

import Link from 'next/link'
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PremiumFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-navy-900 border-t border-gold-500/20 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/titan-icon2.svg" alt="Titan Auto" className="w-14 h-14" />
              <img src="/titan-banner.svg" alt="Titan Auto" className="h-8" />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              A reliable, family-run garage located in the heart of Maidstone. Honest, professional, and affordable automotive services.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { label: 'Home', href: '/' },
                { label: 'Services', href: '/services' },
                { label: 'About', href: '/about' },
                { label: 'Booking', href: '/booking' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-gold-500 transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-white mb-4">Services</h3>
            <ul className="space-y-2">
              {[
                { label: 'MOT Testing', href: '/services/mot' },
                { label: 'Car Servicing', href: '/services/servicing' },
                { label: 'Tyres & Alignment', href: '/services/tyres' },
                { label: 'Brake Service', href: '/services/brakes' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-gold-500 transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-gray-400">
                <Phone className="w-4 h-4 text-gold-500" />
                <a href="tel:01622438114" className="hover:text-gold-500 transition">
                  01622 438114
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Mail className="w-4 h-4 text-gold-500" />
                <a href="mailto:info@titanautoservices.co.uk" className="hover:text-gold-500 transition">
                  info@titanautoservices.co.uk
                </a>
              </li>
              <li className="flex items-start gap-2 text-gray-400">
                <MapPin className="w-4 h-4 text-gold-500 mt-1 flex-shrink-0" />
                <div>
                  <p>11 Waterloo Street</p>
                  <p>Maidstone, ME15 7UH</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Social & Bottom */}
        <div className="border-t border-gold-500/20 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} Titan Auto Service. All rights reserved.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Facebook, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Instagram, href: '#' },
              ].map((social, idx) => {
                const Icon = social.icon
                return (
                  <a
                    key={idx}
                    href={social.href}
                    className="w-10 h-10 rounded-full bg-navy-800 hover:bg-gold-500 text-gold-500 hover:text-navy-950 transition flex items-center justify-center"
                  >
                    <Icon size={18} />
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
