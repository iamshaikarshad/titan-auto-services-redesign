'use client'

import Link from 'next/link'
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/titan-icon2.svg" alt="Titan Auto" className="w-12 h-12" />
              <img src="/titan-banner.svg" alt="Titan Auto" className="h-8" />
            </div>
            <p className="text-slate-400 text-sm">
              Professional auto repair and maintenance services in Maidstone. Honest, transparent, and reliable.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services" className="text-slate-400 hover:text-white transition">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/booking" className="text-slate-400 hover:text-white transition">
                  Book Now
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-400 hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-slate-400">
                <Phone className="w-4 h-4" />
                <a href="tel:01622438114" className="hover:text-white transition">
                  01622 438114
                </a>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Phone className="w-4 h-4" />
                <a href="tel:07305509999" className="hover:text-white transition">
                  07305 509999
                </a>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Mail className="w-4 h-4" />
                <a href="mailto:info@titanautoservices.co.uk" className="hover:text-white transition">
                  info@titanautoservices.co.uk
                </a>
              </li>
              <li className="flex items-start gap-2 text-slate-400">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <div className="text-sm">
                  <p>11 Waterloo Street</p>
                  <p>Maidstone, ME15 7UH</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-slate-400">
          <p>&copy; {currentYear} Titan Auto Service. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white transition">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
