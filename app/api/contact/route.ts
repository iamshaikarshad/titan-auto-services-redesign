import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const { name, email, subject, message, phone } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // TODO: Send email using Resend when available
    // await resend.emails.send({
    //   from: 'contact@sleekspec.com',
    //   to: 'info@sleekspec.com',
    //   replyTo: email,
    //   subject: `New contact form submission: ${subject}`,
    //   html: `
    //     <p><strong>Name:</strong> ${name}</p>
    //     <p><strong>Email:</strong> ${email}</p>
    //     ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
    //     <p><strong>Message:</strong></p>
    //     <p>${message.replace(/\n/g, '<br>')}</p>
    //   `
    // })

    console.log('[v0] Contact message received:', {
      name,
      email,
      phone,
      subject,
      message,
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Your message has been sent successfully. We will contact you soon.',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[v0] Contact form error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
