'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import { CheckCircle, Clock, AlertCircle, Calendar, RefreshCw } from 'lucide-react'

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
}

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    fetchBookings()
  }, [])

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-400 mt-1">Manage bookings and customers</p>
            </div>
            <Button
              onClick={fetchBookings}
              className="bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
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
                  <Card className="bg-navy-800 border-gold-500/20 hover:border-gold-500/50 transition p-6">
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
                          {booking.notes && (
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
                          <p className="text-xl font-bold text-gold-500">£{booking.total_price.toFixed(2)}</p>
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
    </div>
  )
}
