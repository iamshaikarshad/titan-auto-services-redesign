'use client'

import { useEffect, useRef } from 'react'

interface Charge {
  description: string
  amount: string
}

interface BillPrintViewProps {
  booking: {
    id: number
    first_name: string
    last_name: string
    email: string
    phone: string
    car_make?: string
    registration_number?: string
    service_name?: string
    booking_date: string
    status: string
    notes?: string
    total_price?: number
  }
  basePrice: number
  additionalCharges: Charge[]
  total: number
  onClose: () => void
}

export function BillPrintView({ booking, basePrice, additionalCharges, total, onClose }: BillPrintViewProps) {
  const printRef = useRef<HTMLDivElement>(null)

  const formattedDate = new Date(booking.booking_date).toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const invoiceNumber = `TAS-${String(booking.id).padStart(5, '0')}`
  const issuedDate = new Date().toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Parse service-specific notes (session, tyre size, engine, etc.)
  const serviceNotes = booking.notes
    ? booking.notes.split('\n\n--- Additional Charges ---')[0]
    : ''

  const handlePrint = () => {
    window.print()
  }

  useEffect(() => {
    // Inject print styles once
    const styleId = 'bill-print-style'
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style')
      style.id = styleId
      style.innerHTML = `
        @media print {
          body > * { display: none !important; }
          #bill-print-portal { display: block !important; }
          #bill-print-portal * { display: revert !important; }
          @page { margin: 16mm; size: A4; }
        }
      `
      document.head.appendChild(style)
    }
    return () => {
      const el = document.getElementById('bill-print-style')
      if (el) el.remove()
    }
  }, [])

  return (
    /* Full-screen overlay */
    <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
      {/* Printable area portal target */}
      <div id="bill-print-portal" className="hidden" />

      <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden">
        {/* Action bar — hidden during print */}
        <div className="flex items-center justify-between bg-gray-100 px-6 py-3 print:hidden">
          <span className="text-gray-700 font-semibold text-sm">Invoice Preview — {invoiceNumber}</span>
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="bg-navy-950 text-white px-5 py-2 rounded text-sm font-bold hover:bg-navy-800 transition"
            >
              Print / Save as PDF
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-sm px-3 py-2 rounded border border-gray-300"
            >
              Close
            </button>
          </div>
        </div>

        {/* Invoice body */}
        <div ref={printRef} className="p-10 text-gray-800 font-sans" id="invoice-content">
          {/* Header */}
          <div className="flex items-start justify-between mb-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/titan-icon4.svg" alt="Titan Auto" className="w-10 h-10" />
                <div>
                  <p className="font-black text-xl text-gray-900 leading-tight">Titan Auto Services</p>
                  <p className="text-xs text-gray-500">Professional Vehicle Care</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">11 Waterloo Street, Maidstone, ME15 7UH</p>
              <p className="text-xs text-gray-500">Tel: 01622 438114 | 07305 509999</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-gray-900 tracking-tight">INVOICE</p>
              <p className="text-sm text-gray-500 mt-1">{invoiceNumber}</p>
              <p className="text-xs text-gray-400 mt-1">Issued: {issuedDate}</p>
              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                  booking.status === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : booking.status === 'confirmed'
                    ? 'bg-blue-100 text-blue-700'
                    : booking.status === 'cancelled'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {booking.status}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t-2 border-gray-900 mb-8" />

          {/* Customer & Booking details */}
          <div className="grid grid-cols-2 gap-8 mb-10">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-2 font-semibold">Bill To</p>
              <p className="font-bold text-gray-900">{booking.first_name} {booking.last_name}</p>
              <p className="text-sm text-gray-600">{booking.phone}</p>
              <p className="text-sm text-gray-600">{booking.email}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-2 font-semibold">Booking Details</p>
              <p className="text-sm text-gray-800">
                <span className="font-semibold">Date:</span> {formattedDate}
              </p>
              {booking.car_make && (
                <p className="text-sm text-gray-800">
                  <span className="font-semibold">Vehicle:</span> {booking.car_make}
                </p>
              )}
              {booking.registration_number && (
                <p className="text-sm text-gray-800">
                  <span className="font-semibold">Registration:</span> {booking.registration_number.toUpperCase()}
                </p>
              )}
              {serviceNotes && (
                <p className="text-sm text-gray-800 mt-1 whitespace-pre-wrap leading-relaxed">{serviceNotes}</p>
              )}
            </div>
          </div>

          {/* Line items table */}
          <table className="w-full mb-8" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr className="bg-gray-900 text-white text-sm">
                <th className="text-left px-4 py-3 rounded-tl font-semibold">Description</th>
                <th className="text-right px-4 py-3 rounded-tr font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {/* Base service */}
              <tr className="border-b border-gray-200">
                <td className="px-4 py-3 text-sm">{booking.service_name || 'Service'}</td>
                <td className="px-4 py-3 text-sm text-right">£{basePrice.toFixed(2)}</td>
              </tr>
              {/* Additional charges */}
              {additionalCharges.map((charge, idx) => (
                <tr key={idx} className="border-b border-gray-200">
                  <td className="px-4 py-3 text-sm text-gray-700">{charge.description}</td>
                  <td className="px-4 py-3 text-sm text-right">£{parseFloat(charge.amount).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100">
                <td className="px-4 py-3 font-black text-right text-gray-900">Total</td>
                <td className="px-4 py-3 font-black text-right text-gray-900 text-lg">£{total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-6 text-center">
            <p className="text-xs text-gray-400">Thank you for choosing Titan Auto Services.</p>
            <p className="text-xs text-gray-400">11 Waterloo Street, Maidstone, ME15 7UH &bull; 01622 438114</p>
          </div>
        </div>
      </div>
    </div>
  )
}
