'use client'

export function TitanLogo({ className = 'w-12 h-12' }: { className?: string }) {
  return (
    <div className={className}>
      <img
        src="/titan-logo.svg"
        alt="Titan Auto Service"
        className="w-full h-full object-contain"
      />
    </div>
  )
}
