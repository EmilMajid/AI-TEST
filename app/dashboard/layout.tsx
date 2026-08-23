'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookOpen } from 'lucide-react'
import { AdBanner } from '@/components/ads/ad-banner'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card flex flex-col justify-between p-4 shrink-0">
        <div>
          <div className="p-2 mb-4 flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold">EduTest</h1>
          </div>

          <nav className="space-y-2">
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full justify-start font-semibold text-primary bg-primary/10">
                <BookOpen className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
          </nav>
        </div>

        {/* Sol Sidebar Reklam Bloku (Qırmızı çərçivəyə alınan sahə) */}
        <div className="pt-4 mt-auto">
          <AdBanner
            slot="sidebar-left-ad"
            format="vertical"
            refreshKey="sidebar-ad"
            label="Sponsorlu Təhsil"
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
