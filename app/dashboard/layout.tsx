'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookOpen } from 'lucide-react'
import { AdBanner } from '@/components/ads/ad-banner'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen md:h-screen bg-background">
      {/* 1-ci BLOK (Mobildə): TESTAI.AZ və Yuxarı Reklam Zolağı */}
      <header className="md:hidden bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 py-3 space-y-2 sticky top-0 z-30 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <BookOpen className="h-5 w-5" />
            </div>
            <h1 className="text-lg font-extrabold text-gray-900 tracking-tight">TESTAI.AZ</h1>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-primary/10 text-primary rounded-full">
            Şagird Kabineti
          </span>
        </div>

        {/* Yuxarı Zərif Reklam Zolağı */}
        <div className="pt-1">
          <AdBanner
            slot="dashboard-mobile-top"
            format="horizontal"
            refreshKey="dash-top"
            label="Təhsil Tərəfdaşlığı"
          />
        </div>
      </header>

      {/* Desktop Sidebar (Yalnız Desktop ekranlarda görünür) */}
      <aside className="hidden md:flex w-64 border-r bg-card flex-col justify-between p-4 shrink-0">
        <div>
          <div className="p-2 mb-4 flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold">TESTAI.AZ</h1>
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

        {/* Sol Sidebar Reklam Bloku */}
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
      <main className="flex-1 md:overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
