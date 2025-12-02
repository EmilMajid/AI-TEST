'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookOpen, Settings, LogOut, BarChart3, Users } from 'lucide-react'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card">
        <div className="p-6">
          <div className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold">EduTest</h1>
          </div>
        </div>

        <nav className="space-y-2 px-4">
          <Link href="/dashboard">
            <Button variant="ghost" className="w-full justify-start">
              <BookOpen className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          <Link href="/dashboard/results">
            <Button variant="ghost" className="w-full justify-start">
              <BarChart3 className="h-4 w-4 mr-2" />
              Nəticələr
            </Button>
          </Link>
          <Link href="/dashboard/pdfs">
            <Button variant="ghost" className="w-full justify-start">
              <Users className="h-4 w-4 mr-2" />
              Dərsliklərim
            </Button>
          </Link>
          <Link href="/admin/rag">
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="h-4 w-4 mr-2" />
              Şəxsi Ayarlar
            </Button>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
