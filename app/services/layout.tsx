import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Auto Services | Titan Auto Service',
  description: 'Professional auto repair and maintenance services. Oil changes, brake service, tire service, MOT, suspension, and more. Book your service at Titan Auto Service.',
  keywords: ['auto repair', 'car maintenance', 'oil change', 'brake service', 'tire service', 'MOT', 'Maidstone'],
  openGraph: {
    title: 'Auto Services | Titan Auto Service',
    description: 'Professional auto repair and maintenance services',
    type: 'website',
  },
}

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
