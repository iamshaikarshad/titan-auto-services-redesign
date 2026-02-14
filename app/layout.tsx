import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SleekSpec Auto Garage - Professional Car Repair & Maintenance',
  description: 'Premium auto repair and maintenance services. Book your appointment online. Expert mechanics, genuine parts, warranty on all work.',
  generator: 'v0.app',
  keywords: ['auto repair', 'car maintenance', 'mechanics', 'oil change', 'brake service', 'tire service'],
  openGraph: {
    title: 'SleekSpec Auto Garage',
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
