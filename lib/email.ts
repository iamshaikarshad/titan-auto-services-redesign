import nodemailer from 'nodemailer'

// Reuses a single transporter across invocations (serverless functions
// stay warm between requests, so we don't want to recreate this every time)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

// Everyone on the business side who should be notified of a new booking
const BUSINESS_NOTIFICATION_RECIPIENTS = [
  'info@titanautoservices.co.uk',
  'Titan.auto2025@gmail.com',
]

interface BookingNotificationData {
  bookingId: number | string
  name: string
  email: string
  phone: string
  vehicle: string
  registrationNumber?: string | null
  serviceName: string
  sessionTime: string
  bookingDate: Date
  servicePrice: number | null
  notes: string
}

export async function sendBookingNotification(data: BookingNotificationData) {
  const {
    bookingId,
    name,
    email,
    phone,
    vehicle,
    registrationNumber,
    serviceName,
    sessionTime,
    bookingDate,
    servicePrice,
    notes,
  } = data

  const formattedDate = bookingDate.toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const html = `
    <div style="font-family: sans-serif; max-width: 600px;">
      <h2 style="margin-bottom: 4px;">New Booking Received</h2>
      <p style="color: #555; margin-top: 0;">Booking #${bookingId}</p>

      <table style="border-collapse: collapse; width: 100%; margin-bottom: 16px;">
        <tr><td style="padding: 4px 8px; font-weight: bold;">Service</td><td style="padding: 4px 8px;">${serviceName}</td></tr>
        <tr><td style="padding: 4px 8px; font-weight: bold;">Date</td><td style="padding: 4px 8px;">${formattedDate}</td></tr>
        <tr><td style="padding: 4px 8px; font-weight: bold;">Session</td><td style="padding: 4px 8px;">${sessionTime}</td></tr>
        ${servicePrice ? `<tr><td style="padding: 4px 8px; font-weight: bold;">Price</td><td style="padding: 4px 8px;">£${servicePrice}</td></tr>` : ''}
      </table>

      <h3 style="margin-bottom: 4px;">Customer Details</h3>
      <table style="border-collapse: collapse; width: 100%; margin-bottom: 16px;">
        <tr><td style="padding: 4px 8px; font-weight: bold;">Name</td><td style="padding: 4px 8px;">${name}</td></tr>
        <tr><td style="padding: 4px 8px; font-weight: bold;">Email</td><td style="padding: 4px 8px;">${email}</td></tr>
        <tr><td style="padding: 4px 8px; font-weight: bold;">Phone</td><td style="padding: 4px 8px;">${phone}</td></tr>
        <tr><td style="padding: 4px 8px; font-weight: bold;">Vehicle</td><td style="padding: 4px 8px;">${vehicle}</td></tr>
        ${registrationNumber ? `<tr><td style="padding: 4px 8px; font-weight: bold;">Registration</td><td style="padding: 4px 8px;">${registrationNumber}</td></tr>` : ''}
      </table>

      <h3 style="margin-bottom: 4px;">Notes</h3>
      <pre style="white-space: pre-wrap; font-family: inherit; background: #f5f5f5; padding: 12px; border-radius: 6px;">${notes}</pre>
    </div>
  `

  try {
    await transporter.sendMail({
      from: `"Titan Auto Services" <${process.env.GMAIL_USER}>`,
      to: BUSINESS_NOTIFICATION_RECIPIENTS,
      replyTo: email,
      subject: `New Booking #${bookingId} — ${serviceName} — ${name}`,
      html,
      priority: 'high',
    })
    console.log('[v0] Booking notification email sent for booking:', bookingId)
  } catch (error) {
    // Deliberately swallow the error here: a failed email should never
    // roll back or fail the booking itself, since the booking is already
    // safely committed to the database at this point.
    console.error('[v0] Failed to send booking notification email:', error)
  }
}

export async function sendBookingConfirmation(data: BookingNotificationData) {
  const {
    bookingId,
    name,
    email,
    serviceName,
    sessionTime,
    bookingDate,
    servicePrice,
  } = data

  const formattedDate = bookingDate.toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Just the customer's first name for a friendlier greeting
  const firstName = name.trim().split(' ')[0]

  const html = `
    <div style="font-family: sans-serif; max-width: 600px;">
      <h2 style="margin-bottom: 4px;">Thanks, ${firstName} — your booking is confirmed!</h2>
      <p style="color: #555;">Booking reference: #${bookingId}</p>

      <table style="border-collapse: collapse; width: 100%; margin: 16px 0;">
        <tr><td style="padding: 4px 8px; font-weight: bold;">Service</td><td style="padding: 4px 8px;">${serviceName}</td></tr>
        <tr><td style="padding: 4px 8px; font-weight: bold;">Date</td><td style="padding: 4px 8px;">${formattedDate}</td></tr>
        <tr><td style="padding: 4px 8px; font-weight: bold;">Session</td><td style="padding: 4px 8px;">${sessionTime}</td></tr>
        ${servicePrice ? `<tr><td style="padding: 4px 8px; font-weight: bold;">Estimated Price</td><td style="padding: 4px 8px;">£${servicePrice}</td></tr>` : ''}
      </table>

      <p>We'll be in touch shortly to confirm the details. If anything above looks wrong, just reply to this email or give us a call.</p>
      <p style="margin-top: 24px;">— Titan Auto Services</p>
    </div>
  `

  try {
    await transporter.sendMail({
      from: `"Titan Auto Services" <${process.env.GMAIL_USER}>`,
      to: email,
      replyTo: BUSINESS_NOTIFICATION_RECIPIENTS[0],
      subject: `Your booking is confirmed — #${bookingId}`,
      html,
      priority: 'high',
    })
    console.log('Booking confirmation email sent to customer for booking:', bookingId)
  } catch (error) {
    // Same reasoning as above — never let this break the booking response
    console.error('Failed to send booking confirmation email:', error)
  }
}