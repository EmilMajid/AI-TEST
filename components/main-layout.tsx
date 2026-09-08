'use client'

import { ReactNode } from 'react'

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen">
      {/* Watermark Background */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center opacity-5 z-0 overflow-hidden">
        <div className="text-center select-none max-w-full overflow-hidden px-4">
          <h1 className="text-3xl sm:text-6xl md:text-8xl font-bold text-gray-900 mb-2 sm:mb-4 truncate">Emil Məcidov</h1>
          <p className="text-lg sm:text-2xl md:text-4xl text-gray-600 truncate">Azerbaijan AI Platform</p>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

export default MainLayout
