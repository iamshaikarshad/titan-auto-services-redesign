'use client'

import Image from 'next/image'

export function TitanLogo({ className = 'w-12 h-12' }: { className?: string }) {
  return (
    <div className={className}>
      <Image
        src="/titan-logo.png"
        alt="Titan Auto Service"
        width={200}
        height={200}
        className="w-full h-full object-contain"
        priority
      />
    </div>
  )
}
