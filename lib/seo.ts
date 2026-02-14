import { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://sleekspec.com'

export const createMetadata = (
  title: string,
  description: string,
  path: string = '',
  ogImage?: string
): Metadata => {
  const url = `${baseUrl}${path}`

  return {
    title,
    description,
    canonical: url,
    robots: {
      index: true,
      follow: true,
      googleBot: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      images: ogImage ? [{ url: ogImage }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'AutoRepair',
  name: 'SleekSpec Auto Garage',
  url: baseUrl,
  logo: `${baseUrl}/logo.png`,
  image: `${baseUrl}/garage.jpg`,
  description: 'Professional auto repair and maintenance services.',
  telephone: '(123) 456-7890',
  email: 'info@sleekspec.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '123 Main Street',
    addressLocality: 'City',
    addressRegion: 'State',
    postalCode: '12345',
    addressCountry: 'US',
  },
  priceRange: '$50-$200',
  areaServed: {
    '@type': 'City',
    name: 'City',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '18:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '09:00',
      closes: '16:00',
    },
  ],
  sameAs: [
    'https://www.facebook.com/sleekspec',
    'https://www.instagram.com/sleekspec',
    'https://www.google.com/maps/place/sleekspec',
  ],
}

export const serviceSchema = (serviceName: string, price: number) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: serviceName,
  provider: {
    '@type': 'AutoRepair',
    name: 'SleekSpec Auto Garage',
  },
  offers: {
    '@type': 'Offer',
    price: price.toString(),
    priceCurrency: 'USD',
  },
})

export const reviewSchema = (
  author: string,
  rating: number,
  reviewBody: string,
  datePublished: string
) => ({
  '@context': 'https://schema.org',
  '@type': 'Review',
  author: {
    '@type': 'Person',
    name: author,
  },
  reviewRating: {
    '@type': 'Rating',
    ratingValue: rating.toString(),
    bestRating: '5',
    worstRating: '1',
  },
  reviewBody,
  datePublished,
})
