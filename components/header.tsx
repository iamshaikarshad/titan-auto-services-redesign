'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/titan-icon4.svg" alt="Titan Auto Service" className="w-14 h-14" />
          <img src="/titan-banner.svg" alt="Titan Auto" className="h-8 hidden sm:inline" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-slate-700 hover:text-slate-900 transition">
            Home
          </Link>
          <Link href="/services" className="text-slate-700 hover:text-slate-900 transition">
            Services
          </Link>
          <Link href="/booking" className="text-slate-700 hover:text-slate-900 transition">
            Book Now
          </Link>
          <Link href="/about" className="text-slate-700 hover:text-slate-900 transition">
            About
          </Link>
          <Link href="/contact" className="text-slate-700 hover:text-slate-900 transition">
            Contact
          </Link>
        </nav>

        {/* Desktop CTA Button */}
        <div className="hidden md:flex gap-3">
          <Button asChild variant="outline">
            <Link href="/contact">Call Us</Link>
          </Button>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/booking">Book Service</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link
              href="/"
              className="text-slate-700 hover:text-slate-900 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/services"
              className="text-slate-700 hover:text-slate-900 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              href="/booking"
              className="text-slate-700 hover:text-slate-900 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Book Now
            </Link>
            <Link
              href="/about"
              className="text-slate-700 hover:text-slate-900 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-slate-700 hover:text-slate-900 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="flex gap-3 pt-4">
              <Button asChild variant="outline" className="flex-1">
                <Link href="/contact">Call Us</Link>
              </Button>
              <Button asChild className="flex-1 bg-blue-600 hover:bg-blue-700">
                <Link href="/booking">Book</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
