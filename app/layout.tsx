import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'
import { IntroAnimation } from '@/components/intro-animation'
import { Header } from '@/components/premium-header'
import { PremiumFooter } from '@/components/premium-footer'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Titan Auto Service - Professional Car Repair & Maintenance in Maidstone',
  description: 'Professional auto repair and maintenance services in Maidstone. MOT testing, car servicing, tyres, brakes, and more. Expert mechanics, genuine parts, warranty on all work. Book online today.',
  generator: 'v0.app',
  keywords: [
    'auto repair Maidstone',
    'car servicing Maidstone',
    'MOT Maidstone',
    'car maintenance',
    'mechanics',
    'brake service',
    'tyre service',
    'garage near me',
  ],
  openGraph: {
    title: 'Titan Auto Service - Professional Car Repair',
    description: 'Professional auto repair and maintenance services in Maidstone',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0e1a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth">
      <body className="font-sans antialiased bg-navy-950 text-white">
        <IntroAnimation />
        <Header />
        <main className="pt-20">
          {children}
        </main>
        <PremiumFooter />
      </body>
    </html>
  )
}
