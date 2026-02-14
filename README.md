# SleekSpec Auto Garage - Booking & Management System

A modern, professional auto garage website with online booking system, built with Next.js 16, TypeScript, Tailwind CSS, and shadcn/ui.

## 🚀 Features

- **Homepage** - Professional landing page with service overview and CTA
- **Services Page** - Detailed service listings with pricing and features
- **Online Booking System** - Multi-step booking flow with date/time selection
- **Contact & About Pages** - Information pages with contact forms
- **Admin Dashboard** - Manage bookings and customer interactions
- **Email Notifications** - Booking confirmations and reminders (ready for Resend integration)
- **Payment Processing** - Stripe integration for service deposits
- **SEO Optimized** - Metadata, sitemap, robots.txt, and schema.org markup
- **Responsive Design** - Mobile-first approach, works on all devices
- **Professional UI** - Built with shadcn/ui components and Tailwind CSS

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Database**: PostgreSQL (via Vercel Postgres)
- **Email**: Resend
- **Payments**: Stripe
- **Icons**: Lucide React

## 📋 Prerequisites

Before getting started, ensure you have:

- Node.js 18+ installed
- pnpm package manager (or npm/yarn)
- A Vercel account (for PostgreSQL and deployment)
- Stripe account (for payment processing)
- Resend account (for email services)

## 🚀 Getting Started

### 1. Clone or Download the Project

```bash
git clone <repository-url>
cd sleekspec-auto-garage
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Variables Setup

Create a `.env.local` file in the root directory:

```env
# Database
POSTGRES_URL=postgresql://user:password@host:5432/database

# Email Service
RESEND_API_KEY=your_resend_api_key

# Payment Processing
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Admin
ADMIN_PASSWORD=your_secure_admin_password

# Optional: Google Reviews Integration
GOOGLE_REVIEWS_API_KEY=your_google_api_key

# Base URL (for production)
NEXT_PUBLIC_BASE_URL=https://sleekspec.com
```

### 4. Set Up Database

The project includes a database migration script. Once you have `POSTGRES_URL` configured:

```bash
pnpm run migrate
```

This will create all necessary tables:
- `services` - Service listings
- `customers` - Customer information
- `bookings` - Service bookings
- `reviews` - Customer reviews
- `operating_hours` - Business hours
- `admin_users` - Admin authentication

### 5. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
sleekspec-auto-garage/
├── app/
│   ├── layout.tsx              # Root layout with metadata
│   ├── page.tsx                # Homepage
│   ├── services/               # Services page
│   ├── booking/                # Booking system
│   ├── about/                  # About page
│   ├── contact/                # Contact page
│   ├── admin/                  # Admin dashboard
│   ├── api/
│   │   ├── bookings/           # Booking API endpoint
│   │   ├── contact/            # Contact form API
│   │   └── stripe/             # Stripe integration
│   └── sitemap.ts              # SEO sitemap
├── components/
│   ├── header.tsx              # Navigation header
│   ├── footer.tsx              # Footer
│   └── ui/                     # shadcn/ui components
├── lib/
│   ├── seo.ts                  # SEO utilities and schemas
│   └── utils.ts                # Utility functions
├── public/
│   ├── robots.txt              # SEO robots file
│   └── images/                 # Image assets
├── scripts/
│   └── init-db.sql             # Database initialization
└── styles/
    └── globals.css             # Global styles
```

## 🔑 Key Pages & Routes

| Route | Purpose |
|-------|---------|
| `/` | Homepage |
| `/services` | Service listings |
| `/booking` | Online booking system |
| `/about` | About the business |
| `/contact` | Contact form |
| `/admin` | Admin dashboard |

## 🔐 Admin Dashboard

Access the admin dashboard at `/admin`:

- **Default Password**: `admin123` (change this in production!)
- View and manage bookings
- Manage customer reviews
- System configuration

**Important**: Replace the default password in production with a secure one.

## 💳 Payment Integration (Stripe)

The booking system supports Stripe for service deposits:

1. Add your Stripe keys to `.env.local`
2. Update the booking page to include payment option
3. Implement webhook handling for payment confirmations

Example checkout code is ready in `/app/api/stripe/checkout/route.ts`

## 📧 Email Integration (Resend)

Set up Resend for automated emails:

1. Add `RESEND_API_KEY` to environment variables
2. Email templates are ready in the API routes
3. Implement booking confirmation and reminder emails

## 🔍 SEO Features

- ✅ Dynamic metadata for all pages
- ✅ XML sitemap generation
- ✅ robots.txt configuration
- ✅ OpenGraph tags for social sharing
- ✅ Schema.org structured data
- ✅ Mobile-first responsive design
- ✅ Fast Core Web Vitals

## 📱 Responsive Design

The site is fully responsive and optimized for:
- Mobile phones (320px and up)
- Tablets (768px and up)
- Desktop (1024px and up)
- Large screens (1280px and up)

## 🎨 Customization

### Colors
Update the color scheme in `app/globals.css` and `tailwind.config.ts`

### Services
Modify the services list in:
- `/app/services/page.tsx` - Services display
- `/app/booking/page.tsx` - Booking options

### Business Info
Update business details in:
- `/components/header.tsx` - Company name and logo
- `/components/footer.tsx` - Contact information
- `/lib/seo.ts` - Business schema data

## 🚀 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Vercel will automatically deploy

### Pre-deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations completed
- [ ] Stripe account verified and keys added
- [ ] Resend account set up with email domain
- [ ] Admin password changed from default
- [ ] Business information updated
- [ ] Contact details verified

## 🐛 Troubleshooting

### Database Connection Issues
- Check `POSTGRES_URL` is correctly set
- Ensure database server is running
- Verify network access is allowed

### Email Not Sending
- Verify `RESEND_API_KEY` is correct
- Check email address is verified in Resend
- Review API response in server logs

### Stripe Errors
- Confirm `STRIPE_SECRET_KEY` is set
- Check Stripe dashboard for webhook configuration
- Ensure webhook secret matches

## 📚 Documentation

For detailed documentation:
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Stripe Docs](https://stripe.com/docs)
- [Resend Docs](https://resend.com/docs)

## 📝 License

This project is available for use under the MIT License.

## 🤝 Support

For issues, questions, or improvements:
1. Check the troubleshooting section above
2. Review the code comments for implementation details
3. Consult the official documentation for third-party services

## 🎯 Next Steps

1. **Set up integrations** - Configure Vercel Postgres, Stripe, and Resend
2. **Customize content** - Update business info, services, and branding
3. **Test thoroughly** - Verify booking flow and email notifications
4. **Deploy** - Push to Vercel and monitor in production
5. **Monitor** - Track bookings, reviews, and system performance

---

Built with ❤️ for modern auto service businesses.
