'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TitanLogo } from '@/components/titan-logo'

export function IntroAnimation() {
  const [showIntro, setShowIntro] = useState(true)

  useEffect(() => {
    // Show intro and hide after 3 seconds
    const timer = setTimeout(() => {
      setShowIntro(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence mode="wait">
      {showIntro && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] bg-navy-950 flex items-center justify-center"
        >
          <div className="text-center">
            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.8,
                ease: 'easeOut',
                delay: 0.2,
              }}
              className="mb-8"
            >
              <TitanLogo className="w-32 h-32 mx-auto" />
            </motion.div>

            {/* Tagline Animation */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: 'easeOut',
                delay: 1,
              }}
              className="text-4xl md:text-5xl font-bold text-gold-500 mb-4"
            >
              Titan Auto Service
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.8,
                ease: 'easeOut',
                delay: 1.4,
              }}
              className="text-xl text-gray-300"
            >
              Strength You Can Trust
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
