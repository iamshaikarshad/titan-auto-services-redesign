import { NextRequest, NextResponse } from 'next/server'
import { Pool } from '@neondatabase/serverless'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  let client
  try {
    const awaitedParams = await params
    const bookingId = parseInt(awaitedParams.id, 10)
    const body = await request.json()
    const { payment_status, payment_amount } = body

    if (!bookingId) {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 })
    }

    const pool = new Pool({ connectionString: process.env.DATABASE_URL })
    client = await pool.connect()

    const result = await client.query(
      `UPDATE bookings 
       SET payment_status = COALESCE($1, payment_status), 
           payment_amount = COALESCE($2, payment_amount)
       WHERE id = $3
       RETURNING id, payment_status, payment_amount, status`,
      [payment_status, payment_amount, bookingId]
    )

    client.release()

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      booking: result.rows[0] 
    }, { status: 200 })
  } catch (error) {
    if (client) client.release()
    console.error('[v0] Error updating payment status:', error)
    return NextResponse.json({ error: 'Failed to update payment status' }, { status: 500 })
  }
}
