'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { LogOut, Eye, EyeOff } from 'lucide-react'

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'bookings' | 'reviews'>('bookings')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Simple client-side authentication
    // In production, this should be server-side with proper sessions
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_KEY || 'admin123'
    
    if (password === adminPassword) {
      setIsAuthenticated(true)
      setPassword('')
      localStorage.setItem('adminAuth', 'true')
    } else {
      setError('Invalid password')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('adminAuth')
  }

  useEffect(() => {
    // Check if already authenticated
    if (typeof window !== 'undefined') {
      const auth = localStorage.getItem('adminAuth')
      if (auth === 'true') {
        setIsAuthenticated(true)
      }
    }
  }, [])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
          <p className="text-slate-600 mb-6">Sign in to access the admin panel</p>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Sign In
            </Button>
          </form>

          <p className="text-xs text-slate-600 mt-4">
            Demo password: admin123
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 font-semibold border-b-2 transition ${
              activeTab === 'bookings'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Bookings
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 font-semibold border-b-2 transition ${
              activeTab === 'reviews'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Google Reviews
          </button>
        </div>

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-6">Manage Bookings</h2>
            <Card className="p-8 text-center">
              <p className="text-slate-600 mb-4">
                Bookings management features will be available once the database is connected.
              </p>
              <p className="text-sm text-slate-500">
                Connect PostgreSQL to enable full booking management with customer details, service history, and confirmation emails.
              </p>
            </Card>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-6">Google Reviews</h2>
            <Card className="p-8 text-center">
              <p className="text-slate-600 mb-4">
                Google Reviews integration will be available once the database is connected.
              </p>
              <p className="text-sm text-slate-500">
                Connect Google Places API and PostgreSQL to display and manage customer reviews.
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
