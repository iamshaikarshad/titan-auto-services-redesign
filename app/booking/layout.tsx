import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Book Your Service | Titan Auto Service',
  description: 'Schedule your auto repair appointment online. Quick and easy booking for all our services. Maidstone, UK.',
  openGraph: {
    title: 'Book Your Service | Titan Auto Service',
    description: 'Schedule your auto repair appointment online',
    type: 'website',
  },
}

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
