'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const resetToken = searchParams.get('token')
    if (!resetToken) {
      setError('Invalid reset link')
    } else {
      setToken(resetToken)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to reset password')
        return
      }

      setSuccess(true)
      console.log('[v0] Password reset successful')
      setTimeout(() => router.push('/admin/login'), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password')
      console.error('[v0] Reset password error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Card className="bg-navy-900 border-gold-500/20 p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="w-8 h-8 text-green-500" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-2">Password Reset Success!</h2>
            <p className="text-gray-400">Your password has been reset. Redirecting to login...</p>
          </Card>
        </motion.div>
      </div>
    )
  }

  if (error && !token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Card className="bg-navy-900 border-gold-500/20 p-8 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Invalid Link</h2>
            <p className="text-gray-400 mb-6">This reset link is invalid or has expired.</p>
            <Button
              onClick={() => router.push('/admin/forgot-password')}
              className="w-full bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold"
            >
              Request New Link
            </Button>
          </Card>
        </motion.div>
      </div>
    )
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
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gold-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-gold-500" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
            <p className="text-gray-400">Enter your new password below</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
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

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                disabled={isLoading}
                className="w-full px-4 py-3 bg-navy-800 border border-gold-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || !password || !confirmPassword}
              className="w-full bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold py-3 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 flex items-center justify-center p-4">
        <Card className="bg-navy-900 border-gold-500/20 p-8">
          <p className="text-gray-400">Loading...</p>
        </Card>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}
