'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import { CheckCircle, Clock, AlertCircle, Calendar, RefreshCw, X, LogOut, Lock, Printer } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ChangePasswordModal } from '@/components/change-password-modal'
import { BillPrintView } from '@/components/bill-print-view'

interface Booking {
  id: number
  customer_id: number
  service_id: number
  booking_date: string
  assigned_technician_id: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  total_price: number
  notes: string
  first_name: string
  last_name: string
  email: string
  phone: string
  car_make?: string
  car_model?: string
  car_year?: number
  registration_number?: string
  address?: string
  city?: string
  postal_code?: string
  service_name?: string
  service_price?: number
  payment_status?: 'pending' | 'paid' | 'failed' | null
  payment_amount?: number | null
  stripe_session_id?: string | null
}

export default function AdminPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false)
  const [editingPrice, setEditingPrice] = useState(false)
  const [priceInput, setPriceInput] = useState('')
  const [additionalCharges, setAdditionalCharges] = useState<{description: string, amount: string}[]>([])
  const [newChargeDesc, setNewChargeDesc] = useState('')
  const [newChargeAmount, setNewChargeAmount] = useState('')
  const [showBill, setShowBill] = useState(false)

  useEffect(() => {
    fetchBookings()
  }, [])

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error('Logout failed')
      }

      console.log('[v0] Logout successful')
      // Redirect to login page
      router.push('/admin/login')
    } catch (err) {
      console.error('[v0] Logout error:', err)
      // Fallback to login page anyway
      router.push('/admin/login')
    }
  }

  const fetchBookings = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/admin/bookings')
      if (!response.ok) throw new Error('Failed to fetch bookings')
      const data = await response.json()
      setBookings(data.bookings || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bookings')
      console.error('[v0] Error fetching bookings:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId: number, newStatus: string) => {
    setIsUpdating(true)
    setUpdateError(null)
    try {
      const response = await fetch('/api/admin/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, status: newStatus }),
      })

      if (!response.ok) throw new Error('Failed to update booking')

      // Update local state
      setBookings(bookings.map(b => 
        b.id === bookingId ? { ...b, status: newStatus as any } : b
      ))

      // Update selected booking
      if (selectedBooking && selectedBooking.id === bookingId) {
        setSelectedBooking({ ...selectedBooking, status: newStatus as any })
      }

      console.log('[v0] Booking status updated:', bookingId, newStatus)
    } catch (err) {
      setUpdateError(err instanceof Error ? err.message : 'Failed to update booking')
      console.error('[v0] Error updating booking:', err)
    } finally {
      setIsUpdating(false)
    }
  }

  const updateBookingPrice = async (bookingId: number, newPrice: number, newNotes?: string) => {
    setIsUpdating(true)
    setUpdateError(null)
    try {
      const response = await fetch('/api/admin/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          bookingId, 
          totalPrice: newPrice,
          ...(newNotes !== undefined && { notes: newNotes })
        }),
      })

      if (!response.ok) throw new Error('Failed to update price')

      // Update local state
      setBookings(bookings.map(b => 
        b.id === bookingId ? { ...b, total_price: newPrice, ...(newNotes !== undefined && { notes: newNotes }) } : b
      ))

      // Update selected booking
      if (selectedBooking && selectedBooking.id === bookingId) {
        setSelectedBooking({ 
          ...selectedBooking, 
          total_price: newPrice,
          ...(newNotes !== undefined && { notes: newNotes })
        })
      }

      setEditingPrice(false)
      console.log('[v0] Booking price updated:', bookingId, newPrice)
    } catch (err) {
      setUpdateError(err instanceof Error ? err.message : 'Failed to update price')
      console.error('[v0] Error updating price:', err)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleAddCharge = () => {
    if (!newChargeDesc.trim() || !newChargeAmount.trim()) return
    setAdditionalCharges([...additionalCharges, { description: newChargeDesc, amount: newChargeAmount }])
    setNewChargeDesc('')
    setNewChargeAmount('')
  }

  const handleRemoveCharge = (index: number) => {
    setAdditionalCharges(additionalCharges.filter((_, i) => i !== index))
  }

  const calculateTotalWithCharges = () => {
    const basePrice = parseFloat(priceInput) || 0
    const chargesTotal = additionalCharges.reduce((sum, charge) => sum + (parseFloat(charge.amount) || 0), 0)
    return basePrice + chargesTotal
  }

  const handleSavePriceWithCharges = async () => {
    if (!selectedBooking) return
    
    const totalPrice = calculateTotalWithCharges()
    
    // Build notes with charges breakdown
    let chargesNote = ''
    if (additionalCharges.length > 0) {
      chargesNote = '\n\n--- Additional Charges ---\n'
      chargesNote += additionalCharges.map(c => `${c.description}: £${parseFloat(c.amount).toFixed(2)}`).join('\n')
      chargesNote += `\nBase Service: £${parseFloat(priceInput).toFixed(2)}`
      chargesNote += `\nTotal: £${totalPrice.toFixed(2)}`
    }
    
    // Append charges to existing notes
    const existingNotes = selectedBooking.notes || ''
    const notesWithoutOldCharges = existingNotes.split('\n\n--- Additional Charges ---')[0]
    const newNotes = notesWithoutOldCharges + chargesNote
    
    await updateBookingPrice(selectedBooking.id, totalPrice, newNotes)
    setAdditionalCharges([])
  }

  // Initialize price input and parse charges when selecting a booking
  useEffect(() => {
    if (selectedBooking) {
      setPriceInput(String(selectedBooking.total_price || selectedBooking.service_price || 0))
      setEditingPrice(false)
      
      // Parse existing charges from notes
      const notes = selectedBooking.notes || ''
      const chargesSection = notes.split('\n\n--- Additional Charges ---')[1]
      if (chargesSection) {
        const chargeLines = chargesSection.split('\n').filter(l => l.includes(': £') && !l.startsWith('Base Service') && !l.startsWith('Total'))
        const parsedCharges = chargeLines.map(line => {
          const [desc, amt] = line.split(': £')
          return { description: desc.trim(), amount: amt?.trim() || '0' }
        })
        setAdditionalCharges(parsedCharges)
      } else {
        setAdditionalCharges([])
      }
    }
  }, [selectedBooking])

  const filteredBookings = filterStatus === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filterStatus)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-blue-500" />
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'cancelled':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'confirmed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const stats = [
    {
      label: 'Total Bookings',
      value: bookings.length,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/20',
    },
    {
      label: 'Pending',
      value: bookings.filter(b => b.status === 'pending').length,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/20',
    },
    {
      label: 'Confirmed',
      value: bookings.filter(b => b.status === 'confirmed').length,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/20',
    },
    {
      label: 'Completed',
      value: bookings.filter(b => b.status === 'completed').length,
      color: 'text-green-500',
      bgColor: 'bg-green-500/20',
    },
  ]

  return (
    <div className="min-h-screen bg-navy-950">
      {/* Header */}
      <div className="bg-navy-900 border-b border-gold-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-400 text-sm md:text-base mt-1">Manage bookings and customers</p>
            </div>
            <div className="flex items-center gap-2 md:gap-3 flex-wrap">
              <Button
                onClick={() => setShowChangePasswordModal(true)}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-4"
              >
                <Lock className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Change </span>Password
              </Button>
              <Button
                onClick={fetchBookings}
                size="sm"
                className="bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold flex items-center gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-4"
              >
                <RefreshCw className="w-3 h-3 md:w-4 md:h-4" />
                Refresh
              </Button>
              <Button
                onClick={handleLogout}
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-4"
              >
                <LogOut className="w-3 h-3 md:w-4 md:h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Cards */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {stats.map((stat, idx) => (
            <motion.div key={idx} variants={fadeInUp}>
              <Card className={`${stat.bgColor} border-gold-500/20 p-6`}>
                <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
                <p className={`${stat.color} text-4xl font-bold`}>{stat.value}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters */}
        <div className="mb-8">
          <div className="flex gap-3 flex-wrap">
            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition capitalize ${
                  filterStatus === status
                    ? 'bg-gold-500 text-navy-950'
                    : 'bg-navy-800 text-gray-300 hover:bg-navy-700 border border-gold-500/20'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings Table */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Loading bookings...</p>
          </div>
        ) : error ? (
          <Card className="bg-red-500/20 border-red-500/30 p-6">
            <p className="text-red-400">{error}</p>
            <Button onClick={fetchBookings} className="mt-4 bg-gold-500 hover:bg-gold-600 text-navy-950">
              Retry
            </Button>
          </Card>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="space-y-4"
          >
            {filteredBookings.length === 0 ? (
              <Card className="bg-navy-800 border-gold-500/20 p-8 text-center">
                <p className="text-gray-400">No bookings found</p>
              </Card>
            ) : (
              filteredBookings.map((booking) => (
                <motion.div key={booking.id} variants={fadeInUp}>
                  <Card 
                    onClick={() => setSelectedBooking(booking)}
                    className="bg-navy-800 border-gold-500/20 hover:border-gold-500/50 transition p-6 cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-6 flex-wrap">
                      {/* Left Section - Customer Info */}
                      <div className="flex-1 min-w-64">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gold-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-6 h-6 text-gold-500" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white">
                              {booking.first_name} {booking.last_name}
                            </h3>
                            <p className="text-sm text-gray-400">{booking.email}</p>
                            <p className="text-sm text-gray-400">{booking.phone}</p>
                          </div>
                        </div>
                      </div>

                      {/* Center Section - Booking Details */}
                      <div className="flex-1 min-w-64">
                        <div className="space-y-2">
                          <p className="text-sm text-gray-400">Booking Date</p>
                          <p className="font-semibold text-white">
                            {new Date(booking.booking_date).toLocaleString('en-GB', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                          {booking.notes?.startsWith('Tyre Size:') && (
                            <span className="inline-block mt-2 text-xs bg-gold-500/20 text-gold-400 px-2 py-0.5 rounded-full font-medium">
                              Tyre: {booking.notes.split('|')[0].replace('Tyre Size:', '').trim()}
                            </span>
                          )}
                          {booking.notes && !booking.notes.startsWith('Tyre Size:') && (
                            <p className="text-xs text-gray-500 mt-2 italic">"{booking.notes}"</p>
                          )}
                        </div>
                      </div>

                      {/* Right Section - Status & Price */}
                      <div className="flex flex-col items-end gap-4">
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusBadgeColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          <span className="capitalize text-sm font-medium">{booking.status}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-400">Total</p>
                          <p className="text-xl font-bold text-gold-500">£{parseFloat(String(booking.total_price)).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-navy-900 border border-gold-500/30 rounded-lg max-w-2xl w-full max-h-[85vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="bg-navy-800 border-b border-gold-500/20 px-6 py-4 flex items-center justify-between sticky top-0">
              <h2 className="text-2xl font-bold text-white">Booking Details</h2>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-gray-400 hover:text-white transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="text-lg font-bold text-gold-500 mb-3">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Name</p>
                    <p className="text-white font-medium">{selectedBooking.first_name} {selectedBooking.last_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="text-white font-medium">{selectedBooking.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Phone</p>
                    <p className="text-white font-medium">{selectedBooking.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Registration</p>
                    <p className="text-white font-medium">{selectedBooking.registration_number || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Vehicle Info */}
              {selectedBooking.car_make && (
                <div>
                  <h3 className="text-lg font-bold text-gold-500 mb-3">Vehicle Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Make</p>
                      <p className="text-white font-medium">{selectedBooking.car_make}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Model</p>
                      <p className="text-white font-medium">{selectedBooking.car_model || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Year</p>
                      <p className="text-white font-medium">{selectedBooking.car_year || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Booking Info */}
              <div>
                <h3 className="text-lg font-bold text-gold-500 mb-3">Booking Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Date & Time</p>
                    <p className="text-white font-medium">
                      {new Date(selectedBooking.booking_date).toLocaleString('en-GB', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Service</p>
                    <p className="text-white font-medium">{selectedBooking.service_name || `Service #${selectedBooking.service_id}`}</p>
                  </div>
                  {/* Tyre size - parsed from notes if present */}
                  {selectedBooking.notes?.startsWith('Tyre Size:') && (
                    <div>
                      <p className="text-sm text-gray-400">Tyre Size</p>
                      <p className="text-gold-500 font-bold text-lg">
                        {selectedBooking.notes.split('|')[0].replace('Tyre Size:', '').trim()}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-400">Current Status</p>
                    <div className={`flex items-center gap-2 px-2 py-1 rounded-full border w-fit ${getStatusBadgeColor(selectedBooking.status)}`}>
                      {getStatusIcon(selectedBooking.status)}
                      <span className="capitalize text-xs font-medium">{selectedBooking.status}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price & Charges Section */}
              <div>
                <h3 className="text-lg font-bold text-gold-500 mb-3">Pricing</h3>
                <div className="bg-navy-800 rounded-lg p-4 space-y-4">
                  {/* Base Price */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Base Service Price</span>
                    {editingPrice ? (
                      <div className="flex items-center gap-2">
                        <span className="text-white">£</span>
                        <input
                          type="number"
                          value={priceInput}
                          onChange={(e) => setPriceInput(e.target.value)}
                          className="w-24 bg-navy-700 border border-gold-500/30 rounded px-2 py-1 text-white text-right"
                          step="0.01"
                          min="0"
                        />
                      </div>
                    ) : (
                      <span className="text-white font-bold">£{parseFloat(priceInput || '0').toFixed(2)}</span>
                    )}
                  </div>

                  {/* Additional Charges */}
                  {additionalCharges.map((charge, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-gray-400">{charge.description}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold">£{parseFloat(charge.amount).toFixed(2)}</span>
                        {editingPrice && (
                          <button
                            onClick={() => handleRemoveCharge(idx)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Add New Charge (when editing) */}
                  {editingPrice && (
                    <div className="border-t border-gold-500/20 pt-4 space-y-3">
                      <p className="text-sm text-gray-400">Add Additional Charge</p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Description (e.g. Labour, Parts)"
                          value={newChargeDesc}
                          onChange={(e) => setNewChargeDesc(e.target.value)}
                          className="flex-1 bg-navy-700 border border-gold-500/30 rounded px-3 py-2 text-white text-sm placeholder-gray-500"
                        />
                        <div className="flex items-center gap-1">
                          <span className="text-white">£</span>
                          <input
                            type="number"
                            placeholder="0.00"
                            value={newChargeAmount}
                            onChange={(e) => setNewChargeAmount(e.target.value)}
                            className="w-20 bg-navy-700 border border-gold-500/30 rounded px-2 py-2 text-white text-sm text-right"
                            step="0.01"
                            min="0"
                          />
                        </div>
                        <Button
                          onClick={handleAddCharge}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Total */}
                  <div className="border-t border-gold-500/20 pt-3 flex items-center justify-between">
                    <span className="text-gold-500 font-bold">Total</span>
                    <span className="text-gold-500 font-bold text-xl">£{calculateTotalWithCharges().toFixed(2)}</span>
                  </div>

                  {/* Payment Received via Stripe */}
                  {selectedBooking.payment_status === 'paid' && selectedBooking.payment_amount && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-green-400 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Deposit Paid (Stripe)
                        </span>
                        <span className="text-green-400 font-bold">-£{parseFloat(String(selectedBooking.payment_amount)).toFixed(2)}</span>
                      </div>
                      <div className="border-t border-gold-500/20 pt-3 flex items-center justify-between">
                        <span className="text-white font-bold">Remaining Balance</span>
                        <span className="text-white font-bold text-xl">
                          £{Math.max(0, calculateTotalWithCharges() - parseFloat(String(selectedBooking.payment_amount))).toFixed(2)}
                        </span>
                      </div>
                    </>
                  )}

                  {/* Payment Status Badge */}
                  {selectedBooking.payment_status && (
                    <div className="pt-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                        selectedBooking.payment_status === 'paid' 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : selectedBooking.payment_status === 'failed'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}>
                        {selectedBooking.payment_status === 'paid' && <CheckCircle className="w-3 h-3" />}
                        {selectedBooking.payment_status === 'failed' && <AlertCircle className="w-3 h-3" />}
                        {selectedBooking.payment_status === 'pending' && <Clock className="w-3 h-3" />}
                        Payment: {selectedBooking.payment_status.charAt(0).toUpperCase() + selectedBooking.payment_status.slice(1)}
                      </span>
                    </div>
                  )}

                  {/* Edit / Save buttons */}
                  <div className="flex gap-2 pt-2 flex-wrap">
                    {editingPrice ? (
                      <>
                        <Button
                          onClick={handleSavePriceWithCharges}
                          disabled={isUpdating}
                          className="flex-1 bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold"
                        >
                          {isUpdating ? 'Saving...' : 'Save Price'}
                        </Button>
                        <Button
                          onClick={() => {
                            setEditingPrice(false)
                            setPriceInput(String(selectedBooking.total_price || selectedBooking.service_price || 0))
                            setAdditionalCharges([])
                          }}
                          className="bg-navy-700 hover:bg-navy-600 text-gray-300 border border-gold-500/20"
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => setEditingPrice(true)}
                        className="bg-navy-700 hover:bg-navy-600 text-gray-300 border border-gold-500/20"
                      >
                        Edit Price / Add Charges
                      </Button>
                    )}
                    {!editingPrice && (
                      <Button
                        onClick={() => setShowBill(true)}
                        className="bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold flex items-center gap-2"
                      >
                        <Printer className="w-4 h-4" />
                        Print / Download Bill
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes - show remaining notes after tyre size if present */}
              {selectedBooking.notes && (
                <div>
                  <h3 className="text-lg font-bold text-gold-500 mb-3">Notes</h3>
                  <p className="text-gray-300 bg-navy-800 p-3 rounded-lg whitespace-pre-wrap">
                    {selectedBooking.notes.split('\n\n--- Additional Charges ---')[0]}
                  </p>
                </div>
              )}

              {/* Status Update */}
              <div>
                <h3 className="text-lg font-bold text-gold-500 mb-3">Update Status</h3>
                {updateError && (
                  <p className="text-red-400 text-sm mb-3">{updateError}</p>
                )}
                <div className="flex gap-2 flex-wrap">
                  {['pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                    <Button
                      key={status}
                      onClick={() => updateBookingStatus(selectedBooking.id, status)}
                      disabled={isUpdating || selectedBooking.status === status}
                      className={`capitalize ${
                        selectedBooking.status === status
                          ? 'bg-gold-500 text-navy-950 cursor-default'
                          : 'bg-navy-800 text-gray-300 hover:bg-navy-700 border border-gold-500/20'
                      }`}
                    >
                      {isUpdating && selectedBooking.status === status ? 'Updating...' : status}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-navy-800 border-t border-gold-500/20 px-6 py-4 flex justify-end">
              <Button
                onClick={() => setSelectedBooking(null)}
                className="bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold"
              >
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        onSuccess={() => {
          setShowChangePasswordModal(false)
        }}
      />

      {/* Bill / Invoice print overlay */}
      {showBill && selectedBooking && (
        <BillPrintView
          booking={selectedBooking}
          basePrice={parseFloat(priceInput) || 0}
          additionalCharges={additionalCharges}
          total={calculateTotalWithCharges()}
          onClose={() => setShowBill(false)}
        />
      )}
    </div>
  )
}
