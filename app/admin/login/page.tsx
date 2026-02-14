'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Lock } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Invalid credentials')
        return
      }

      console.log('[v0] Login successful')
      // Redirect to admin dashboard
      router.push('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
      console.error('[v0] Login error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="bg-navy-900 border-gold-500/20 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gold-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-gold-500" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
            <p className="text-gray-400">Titan Auto - Booking Management</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500/30 rounded-lg p-3"
              >
                <p className="text-red-400 text-sm">{error}</p>
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-navy-800 border border-gold-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !password}
              className="w-full bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold py-3 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-8 border-t border-gold-500/20">
            <p className="text-center text-xs text-gray-500">
              Protected Admin Area • Titan Auto Booking System
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
