import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us | Titan Auto Service',
  description: 'Learn about Titan Auto Service. Family-run garage in Maidstone with years of professional auto repair experience. Honest, transparent service.',
  openGraph: {
    title: 'About Us | Titan Auto Service',
    description: 'Professional auto garage with certified mechanics',
    type: 'website',
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
