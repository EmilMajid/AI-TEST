'use client'

import { ReactNode, useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookOpen, Settings, LogOut, ShieldAlert, Users, Database, Zap, Globe, LayoutDashboard, AlertTriangle, Activity, Sparkles, Loader2 } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'

export default function AdminLayout({ children }: { children: ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

    useEffect(() => {
        try {
            const rawUser = localStorage.getItem('user')
            if (!rawUser) {
                setIsAuthorized(false)
                router.replace('/login?error=admin_required')
                return
            }
            const user = JSON.parse(rawUser)
            const role = (user.role || user.accountType || '').toLowerCase()
            const email = (user.email || '').toLowerCase()
            const id = String(user.id || '').toLowerCase()

            const isAdmin = role === 'admin' || email === 'admin@edu.az' || id === 'admin-main'

            if (!isAdmin) {
                setIsAuthorized(false)
                router.replace('/login?error=admin_required')
                return
            }

            setIsAuthorized(true)
        } catch {
            setIsAuthorized(false)
            router.replace('/login?error=admin_required')
        }
    }, [router, pathname])

    const handleLogout = () => {
        localStorage.removeItem('user')
        localStorage.removeItem('session')
        localStorage.removeItem('userData')
        document.cookie = 'token=; Max-Age=0; path=/;'
        document.cookie = 'user_role=; Max-Age=0; path=/;'
        router.push('/login')
    }

    const isActive = (path: string) => {
        if (path === '/admin') return pathname === '/admin' || pathname === '/admin/dashboard'
        return pathname.startsWith(path)
    }

    if (isAuthorized === null || isAuthorized === false) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-950 text-white">
                <div className="flex flex-col items-center gap-4 text-center max-w-md p-6">
                    <div className="relative">
                        <ShieldAlert className="h-16 w-16 text-red-500 animate-pulse" />
                    </div>
                    <h2 className="text-xl font-bold">Admin İcazəsi Yoxlanılır...</h2>
                    <p className="text-sm text-slate-400">
                        Bu bölməyə yalnız səlahiyyətli administratorlar daxil ola bilər. Giriş yoxlanılır.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                        <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                        Təhlükəsizlik protokolu aktivdir
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar - Distinct Red/Dark Theme for Admin */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between">
                <div>
                    <div className="p-6 border-b border-slate-800">
                        <Link href="/admin" className="flex items-center gap-2">
                            <ShieldAlert className="h-8 w-8 text-red-500" />
                            <div>
                                <h1 className="text-xl font-bold">Admin Panel</h1>
                                <p className="text-xs text-slate-400">Super User • testai.az</p>
                            </div>
                        </Link>
                    </div>

                    <nav className="space-y-1.5 px-3 mt-4 overflow-y-auto max-h-[calc(100vh-140px)]">
                        <Link href="/admin">
                            <Button 
                                variant="ghost" 
                                className={`w-full justify-start ${isActive('/admin') ? 'bg-slate-800 text-white font-medium' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
                            >
                                <LayoutDashboard className="h-4 w-4 mr-2 text-indigo-400" />
                                Dashboard
                            </Button>
                        </Link>

                        <Link href="/admin/users">
                            <Button 
                                variant="ghost" 
                                className={`w-full justify-start ${isActive('/admin/users') ? 'bg-slate-800 text-white font-medium' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
                            >
                                <Users className="h-4 w-4 mr-2 text-blue-400" />
                                İstifadəçilər
                            </Button>
                        </Link>

                        <Link href="/admin/test-bank">
                            <Button 
                                variant="ghost" 
                                className={`w-full justify-start ${pathname === '/admin/test-bank' ? 'bg-slate-800 text-white font-medium' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
                            >
                                <Database className="h-4 w-4 mr-2 text-emerald-400" />
                                Test Bankı
                            </Button>
                        </Link>

                        <Link href="/admin/test-bank/problem-questions">
                            <Button 
                                variant="ghost" 
                                className={`w-full justify-start ${isActive('/admin/test-bank/problem-questions') ? 'bg-slate-800 text-white font-medium' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
                            >
                                <AlertTriangle className="h-4 w-4 mr-2 text-orange-400" />
                                Problemli Suallar
                            </Button>
                        </Link>

                        <Link href="/admin/ai-generation">
                            <Button 
                                variant="ghost" 
                                className={`w-full justify-start ${isActive('/admin/ai-generation') ? 'bg-slate-800 text-white font-medium' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
                            >
                                <Zap className="h-4 w-4 mr-2 text-yellow-400" />
                                Aİ Generasiya
                            </Button>
                        </Link>

                        <Link href="/admin/curriculum">
                            <Button 
                                variant="ghost" 
                                className={`w-full justify-start ${isActive('/admin/curriculum') ? 'bg-slate-800 text-white font-medium' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
                            >
                                <BookOpen className="h-4 w-4 mr-2 text-cyan-400" />
                                Tədris Proqramı (Analitika)
                            </Button>
                        </Link>

                        <Link href="/admin/discussion-textbooks">
                            <Button 
                                variant="ghost" 
                                className={`w-full justify-start ${isActive('/admin/discussion-textbooks') ? 'bg-slate-800 text-white font-medium' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
                            >
                                <Sparkles className="h-4 w-4 mr-2 text-purple-400" />
                                Müzakirə Dərslikləri (TRİMS)
                            </Button>
                        </Link>

                        <Link href="/admin/topics">
                            <Button 
                                variant="ghost" 
                                className={`w-full justify-start ${isActive('/admin/topics') ? 'bg-slate-800 text-white font-medium' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
                            >
                                <BookOpen className="h-4 w-4 mr-2 text-purple-400" />
                                Mövzu İdarəetməsi
                            </Button>
                        </Link>

                        <Link href="/admin/global-settings">
                            <Button 
                                variant="ghost" 
                                className={`w-full justify-start ${isActive('/admin/global-settings') ? 'bg-slate-800 text-white font-medium' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
                            >
                                <Globe className="h-4 w-4 mr-2 text-teal-400" />
                                Qlobal Tənzimləmələr
                            </Button>
                        </Link>

                        <Link href="/admin/access-control">
                            <Button 
                                variant="ghost" 
                                className={`w-full justify-start ${isActive('/admin/access-control') ? 'bg-slate-800 text-white font-medium' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
                            >
                                <Settings className="h-4 w-4 mr-2 text-sky-400" />
                                İcazə İdarəetməsi
                            </Button>
                        </Link>

                        <Link href="/admin/production-metrics">
                            <Button 
                                variant="ghost" 
                                className={`w-full justify-start ${isActive('/admin/production-metrics') ? 'bg-slate-800 text-white font-medium' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
                            >
                                <Activity className="h-4 w-4 mr-2 text-pink-400" />
                                Sistem Metrikləri
                            </Button>
                        </Link>
                    </nav>
                </div>

                <div className="p-4 border-t border-slate-800">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-slate-800"
                        onClick={handleLogout}
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        Çıxış
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    )
}
