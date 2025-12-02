'use client'

import { ReactNode } from 'react'

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen">
      {/* Watermark Background */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center opacity-5 z-0">
        <div className="text-center">
          <h1 className="text-8xl font-bold text-gray-900 mb-4">Emil Məcidov</h1>
          <p className="text-4xl text-gray-600">Azerbaijan AI Platform</p>
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
