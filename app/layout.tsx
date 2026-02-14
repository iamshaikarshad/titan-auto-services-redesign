import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Titan Auto Service - Professional Car Repair & Maintenance',
  description: 'Professional auto repair and maintenance services in Maidstone. Expert mechanics, genuine parts, warranty on all work. Book online today.',
  generator: 'v0.app',
  keywords: ['auto repair', 'car maintenance', 'mechanics', 'MOT', 'brake service', 'tire service', 'Maidstone'],
  openGraph: {
    title: 'Titan Auto Service',
    description: 'Professional auto repair and maintenance services',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
