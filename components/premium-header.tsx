'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TitanLogo } from '@/components/titan-logo'
import { motion } from 'framer-motion'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'glass-effect' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <img src="/titan-icon4.svg" alt="Titan Auto" className="w-14 h-14" />
            </div>
            <img src="/titan-banner.svg" alt="Titan Auto" className="h-8 hidden sm:inline" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-300 hover:text-gold-500 transition font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden sm:block"
          >
            <Button
              asChild
              className="bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold"
            >
              <Link href="/booking">Book Now</Link>
            </Button>
          </motion.div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white hover:text-gold-500 transition"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden mt-4 pt-4 border-t border-gray-700 space-y-3"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-gray-300 hover:text-gold-500 transition py-2"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Button
              asChild
              className="w-full bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold mt-4"
            >
              <Link href="/booking" onClick={() => setIsOpen(false)}>
                Book Now
              </Link>
            </Button>
          </motion.nav>
        )}
      </div>
    </header>
  )
}
