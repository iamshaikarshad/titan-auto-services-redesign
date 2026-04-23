'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

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
  const [mounted, setMounted] = useState(false)

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

  const serviceNotes = booking.notes
    ? booking.notes.split('\n\n--- Additional Charges ---')[0]
    : ''

  const handlePrint = () => {
    window.print()
  }

  useEffect(() => {
    setMounted(true)
    
    // Inject print styles
    const styleId = 'bill-print-style'
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style')
      style.id = styleId
      style.innerHTML = `
        @media print {
          body > *:not(#print-portal-root) {
            display: none !important;
          }
          #print-portal-root {
            display: block !important;
          }
          #print-portal-root .no-print {
            display: none !important;
          }
          #print-portal-root .print-content {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            background: white !important;
            padding: 10mm !important;
            margin: 0 !important;
          }
          @page {
            margin: 10mm;
            size: A4;
          }
        }
      `
      document.head.appendChild(style)
    }

    // Create portal root if it doesn't exist
    let portalRoot = document.getElementById('print-portal-root')
    if (!portalRoot) {
      portalRoot = document.createElement('div')
      portalRoot.id = 'print-portal-root'
      document.body.appendChild(portalRoot)
    }

    return () => {
      const el = document.getElementById('bill-print-style')
      if (el) el.remove()
    }
  }, [])

  const invoiceContent = (
    <div className="fixed inset-0 z-[9999] flex flex-col" style={{ background: 'rgba(0,0,0,0.7)' }}>
      {/* Action bar - hidden during print */}
      <div className="no-print flex items-center justify-between bg-gray-100 px-6 py-4 shrink-0">
        <span className="text-gray-700 font-semibold text-sm">Invoice Preview — {invoiceNumber}</span>
        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="bg-gray-900 text-white px-5 py-2 rounded text-sm font-bold hover:bg-gray-800 transition"
          >
            Save as PDF
          </button>
          <button
            onClick={onClose}
            className="bg-white text-gray-700 hover:bg-gray-50 text-sm px-4 py-2 rounded border border-gray-300 font-medium"
          >
            Close
          </button>
        </div>
      </div>

      {/* Scrollable invoice preview - also wrapper for print */}
      <div className="no-print flex-1 overflow-y-auto p-4 flex justify-center">
        <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden my-4">
          <InvoiceBody
            booking={booking}
            basePrice={basePrice}
            additionalCharges={additionalCharges}
            total={total}
            formattedDate={formattedDate}
            invoiceNumber={invoiceNumber}
            issuedDate={issuedDate}
            serviceNotes={serviceNotes}
          />
        </div>
      </div>

      {/* Separate print-only version rendered directly */}
      <div className="print-content hidden print:block">
        <InvoiceBody
          booking={booking}
          basePrice={basePrice}
          additionalCharges={additionalCharges}
          total={total}
          formattedDate={formattedDate}
          invoiceNumber={invoiceNumber}
          issuedDate={issuedDate}
          serviceNotes={serviceNotes}
        />
      </div>
    </div>
  )

  if (!mounted) return null

  const portalRoot = document.getElementById('print-portal-root')
  if (!portalRoot) return null

  return createPortal(invoiceContent, portalRoot)
}

// Separate component for the invoice body to avoid duplication
function InvoiceBody({
  booking,
  basePrice,
  additionalCharges,
  total,
  formattedDate,
  invoiceNumber,
  issuedDate,
  serviceNotes,
}: {
  booking: BillPrintViewProps['booking']
  basePrice: number
  additionalCharges: Charge[]
  total: number
  formattedDate: string
  invoiceNumber: string
  issuedDate: string
  serviceNotes: string
}) {
  return (
    <div className="p-10 text-gray-800 bg-white" style={{ fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/titan-logo2.svg" 
              alt="Titan Auto" 
              className="h-10 w-auto"
              style={{ filter: 'grayscale(100%) brightness(0)' }} 
            />
            <div>
              <p style={{ fontWeight: 900, fontSize: '1.25rem', color: '#111', lineHeight: 1.2 }}>Titan Auto Services</p>
              <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Professional Vehicle Care</p>
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.75rem' }}>11 Waterloo Street, Maidstone, ME15 7UH</p>
          <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Tel: 01622 438114 | 07305 509999</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '1.5rem', fontWeight: 900, color: '#111' }}>INVOICE</p>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>{invoiceNumber}</p>
          <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>Issued: {issuedDate}</p>
          <span
            style={{
              display: 'inline-block',
              marginTop: '0.5rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              background: booking.status === 'completed' ? '#dcfce7' : booking.status === 'confirmed' ? '#dbeafe' : booking.status === 'cancelled' ? '#fee2e2' : '#fef9c3',
              color: booking.status === 'completed' ? '#15803d' : booking.status === 'confirmed' ? '#1d4ed8' : booking.status === 'cancelled' ? '#b91c1c' : '#a16207',
            }}
          >
            {booking.status}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: '2px solid #111', marginBottom: '2rem' }} />

      {/* Customer & Booking details */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
        <div>
          <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9ca3af', marginBottom: '0.5rem', fontWeight: 600 }}>Bill To</p>
          <p style={{ fontWeight: 700, color: '#111' }}>{booking.first_name} {booking.last_name}</p>
          <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>{booking.phone}</p>
          <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>{booking.email}</p>
        </div>
        <div>
          <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9ca3af', marginBottom: '0.5rem', fontWeight: 600 }}>Booking Details</p>
          <p style={{ fontSize: '0.875rem', color: '#1f2937' }}>
            <span style={{ fontWeight: 600 }}>Date:</span> {formattedDate}
          </p>
          {booking.car_make && (
            <p style={{ fontSize: '0.875rem', color: '#1f2937' }}>
              <span style={{ fontWeight: 600 }}>Vehicle:</span> {booking.car_make}
            </p>
          )}
          {booking.registration_number && (
            <p style={{ fontSize: '0.875rem', color: '#1f2937' }}>
              <span style={{ fontWeight: 600 }}>Registration:</span> {booking.registration_number.toUpperCase()}
            </p>
          )}
          {serviceNotes && (
            <p style={{ fontSize: '0.875rem', color: '#1f2937', marginTop: '0.25rem', whiteSpace: 'pre-wrap' }}>{serviceNotes}</p>
          )}
        </div>
      </div>

      {/* Line items table */}
      <table style={{ width: '100%', marginBottom: '2rem', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '0.75rem 0', fontSize: '0.875rem', fontWeight: 600, color: '#111', borderBottom: '1px solid #000' }}>Description</th>
            <th style={{ textAlign: 'right', padding: '0.75rem 0', fontSize: '0.875rem', fontWeight: 600, color: '#111', borderBottom: '1px solid #000' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {/* Service with check count */}
          <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
            <td style={{ padding: '1rem 0', fontSize: '0.875rem', fontWeight: 600, color: '#111' }}>
              {booking.service_name || 'Service'} {booking.service_name?.toLowerCase().includes('full') ? '60 Checks' : booking.service_name?.toLowerCase().includes('interim') ? '25 Checks' : ''}
            </td>
            <td style={{ padding: '1rem 0', fontSize: '0.875rem', fontWeight: 600, textAlign: 'right', color: '#111' }}>£{basePrice.toFixed(2)}</td>
          </tr>

          {/* Service Includes section for Interim/Full Service */}
          {booking.service_name && (booking.service_name.toLowerCase().includes('interim') || booking.service_name.toLowerCase().includes('full')) && (
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td colSpan={2} style={{ padding: '0.75rem 0', color: '#111' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#111', marginBottom: '0.5rem' }}>Service Includes:</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem 2rem', fontSize: '0.75rem', color: '#374151' }}>
                  {booking.service_name.toLowerCase().includes('interim') && (
                    <>
                      <p>• Oil Filter</p>
                      <p>• Engine Oil</p>
                      <p>• Brake Fluid</p>
                      <p>• Coolant</p>
                      <p>• Windscreen Additive</p>
                      <p>• Power Steering Fluid</p>
                      <p>• External Lights Check</p>
                      <p>• Instrument Warning Lights</p>
                      <p>• Horn Operation</p>
                      <p>• Visual Brake Pads Check</p>
                    </>
                  )}
                  {booking.service_name.toLowerCase().includes('full') && (
                    <>
                      <p>• Oil Filter</p>
                      <p>• Engine Oil</p>
                      <p>• Brake Fluid</p>
                      <p>• Coolant</p>
                      <p>• Windscreen Additive</p>
                      <p>• Power Steering Fluid</p>
                      <p>• External Lights Check</p>
                      <p>• Instrument Warning Lights</p>
                      <p>• Horn Operation</p>
                      <p>• Visual Brake Pads Check</p>
                      <p style={{ gridColumn: '1 / -1', marginTop: '0.25rem', fontWeight: 600 }}>• Change spark plugs (dependant upon age and mileage)</p>
                    </>
                  )}
                </div>
              </td>
            </tr>
          )}

          {/* Additional charges */}
          {additionalCharges.map((charge, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '0.75rem 0', fontSize: '0.875rem', color: '#374151' }}>{charge.description}</td>
              <td style={{ padding: '0.75rem 0', fontSize: '0.875rem', textAlign: 'right' }}>£{parseFloat(charge.amount).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '2rem', borderBottom: 'none', marginBottom: '2rem' }}>
        <p style={{ fontSize: '1rem', fontWeight: 700, color: '#111' }}>Total</p>
        <p style={{ fontSize: '1rem', fontWeight: 700, color: '#111' }}>£{total.toFixed(2)}</p>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Thank you for choosing Titan Auto Services.</p>
        <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>11 Waterloo Street, Maidstone, ME15 7UH • 01622 438114</p>
      </div>
    </div>
  )
}
