'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookOpen, Settings, LogOut, ShieldAlert, Users, Database, Zap, Globe } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AdminLayout({ children }: { children: ReactNode }) {
    const router = useRouter()

    const handleLogout = () => {
        localStorage.removeItem('user')
        router.push('/login')
    }

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar - Distinct Red/Dark Theme for Admin */}
            <aside className="w-64 bg-slate-900 text-white">
                <div className="p-6">
                    <div className="flex items-center gap-2">
                        <ShieldAlert className="h-8 w-8 text-red-500" />
                        <div>
                            <h1 className="text-xl font-bold">Admin Panel</h1>
                            <p className="text-xs text-slate-400">Super User</p>
                        </div>
                    </div>
                </div>

                <nav className="space-y-2 px-4 mt-4">
                    <Link href="/admin/users">
                        <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800">
                            <Users className="h-4 w-4 mr-2" />
                            İstifadəçilər
                        </Button>
                    </Link>

                    <Link href="/admin/topics">
                        <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800">
                            <BookOpen className="h-4 w-4 mr-2" />
                            Mövzu İdarəetməsi
                        </Button>
                    </Link>

                    <Link href="/admin/curriculum">
                        <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800">
                            <BookOpen className="h-4 w-4 mr-2" />
                            Tədris Proqramı (Analitika)
                        </Button>
                    </Link>

                    <Link href="/admin/test-bank">
                        <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800">
                            <Database className="h-4 w-4 mr-2" />
                            Test Bankı
                        </Button>
                    </Link>

                    <Link href="/admin/ai-generation">
                        <Button variant="ghost" className="w-full justify-start text-yellow-400 hover:text-yellow-300 hover:bg-slate-800">
                            <Zap className="h-4 w-4 mr-2" />
                            Aİ Generasiya
                        </Button>
                    </Link>

                    <Link href="/admin/global-settings">
                        <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800">
                            <Globe className="h-4 w-4 mr-2" />
                            Qlobal Tənzimləmələr
                        </Button>
                    </Link>

                    <Link href="/admin/access-control">
                        <Button variant="ghost" className="w-full justify-start text-blue-400 hover:text-blue-300 hover:bg-slate-800">
                            <Settings className="h-4 w-4 mr-2" />
                            İcazə İdarəetməsi
                        </Button>
                    </Link>

                    <div className="border-t border-slate-700 my-4 pt-4">
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-slate-800"
                            onClick={handleLogout}
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Çıxış
                        </Button>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    )
}
