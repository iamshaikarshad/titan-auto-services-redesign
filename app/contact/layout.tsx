import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us | Titan Auto Service',
  description: 'Get in touch with Titan Auto Service. Phone: 01622 438114. 11 Waterloo Street, Maidstone, ME15 7UH. Hours: Mon-Fri 8am-6pm, Sat 9am-2pm.',
  openGraph: {
    title: 'Contact Us | Titan Auto Service',
    description: 'Contact information for Titan Auto Service',
    type: 'website',
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
