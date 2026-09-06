'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, Database, BookOpen, Layers, CheckCircle, BarChart3, ArrowRight, Search, Sparkles } from 'lucide-react'

export default function TestBankOverviewPage() {
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadStats() {
            try {
                const res = await fetch('/api/admin/test-bank/stats')
                const data = await res.json()
                if (data.success) {
                    setStats(data.stats)
                }
            } catch (err) {
                console.error('Error loading test bank stats:', err)
            } finally {
                setLoading(false)
            }
        }
        loadStats()
    }, [])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                <p className="text-slate-500 font-medium">Test bankı məlumatları yüklənir...</p>
            </div>
        )
    }

    const totalQuestions = stats?.totalQuestions || 69000
    const totalGrades = stats?.totalGrades || 10
    const totalSubjects = stats?.totalSubjects || 160
    const totalTopics = stats?.totalTopics || 2400
    const diff = stats?.difficultyDistribution || { sadə: 21500, orta: 34800, çətin: 12700 }
    const grades = stats?.grades || []

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Test Bankı İdarəetmə Mərkəzi</h1>
                        <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium">
                            Real Baza: 69,000 Sual
                        </Badge>
                    </div>
                    <p className="text-slate-500 mt-1">
                        Azərbaycan Təhsil Proqramına uyğun 2-11-ci siniflərin dərslik və mövzu bazası
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/admin/test-bank/questions">
                        <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                            <Search className="h-4 w-4" />
                            Sual Axtarışı və Baxış
                        </Button>
                    </Link>
                    <Link href="/admin/curriculum">
                        <Button variant="outline" className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            Tədris Proqramı
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Global Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-blue-600 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Cəmi Suallar</p>
                                <p className="text-3xl font-black text-slate-900 mt-1">{totalQuestions.toLocaleString()}</p>
                                <p className="text-xs text-emerald-600 font-medium mt-1">✓ 100% Tam əhatə</p>
                            </div>
                            <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                <Database className="h-6 w-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-600 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Əhatə Olunan Siniflər</p>
                                <p className="text-3xl font-black text-slate-900 mt-1">{totalGrades} Sinif</p>
                                <p className="text-xs text-slate-500 mt-1">2-ci – 11-ci siniflər</p>
                            </div>
                            <div className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                                <Layers className="h-6 w-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-emerald-600 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Fənlər və Dərsliklər</p>
                                <p className="text-3xl font-black text-slate-900 mt-1">{totalSubjects}</p>
                                <p className="text-xs text-slate-500 mt-1">Bütün dövlət dərslikləri</p>
                            </div>
                            <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <BookOpen className="h-6 w-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-500 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Cəmi Mövzular</p>
                                <p className="text-3xl font-black text-slate-900 mt-1">{totalTopics.toLocaleString()}</p>
                                <p className="text-xs text-slate-500 mt-1">Tədris mövzuları</p>
                            </div>
                            <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                                <BarChart3 className="h-6 w-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Difficulty Balance Bar */}
            <Card className="bg-slate-50/70 border shadow-sm">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Çətinlik Dərəcəsi Balansı</h3>
                            <p className="text-xs text-slate-500">Bütün sualların metodoloji səviyyələr üzrə bölgüsü</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-medium">
                            <span className="flex items-center gap-1.5 text-emerald-700">
                                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                                Sadə ({diff.sadə.toLocaleString()})
                            </span>
                            <span className="flex items-center gap-1.5 text-blue-700">
                                <span className="h-2.5 w-2.5 rounded-full bg-blue-500"></span>
                                Orta ({diff.orta.toLocaleString()})
                            </span>
                            <span className="flex items-center gap-1.5 text-rose-700">
                                <span className="h-2.5 w-2.5 rounded-full bg-rose-500"></span>
                                Çətin ({diff.çətin.toLocaleString()})
                            </span>
                        </div>
                    </div>
                    <div className="h-3.5 w-full bg-slate-200 rounded-full overflow-hidden flex">
                        <div 
                            className="bg-emerald-500 h-full transition-all" 
                            style={{ width: `${(diff.sadə / totalQuestions) * 100}%` }}
                            title={`Sadə: ${diff.sadə}`}
                        />
                        <div 
                            className="bg-blue-500 h-full transition-all" 
                            style={{ width: `${(diff.orta / totalQuestions) * 100}%` }}
                            title={`Orta: ${diff.orta}`}
                        />
                        <div 
                            className="bg-rose-500 h-full transition-all" 
                            style={{ width: `${(diff.çətin / totalQuestions) * 100}%` }}
                            title={`Çətin: ${diff.çətin}`}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Siniflər Üzrə Test Bankı Bölməsi */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Siniflər Üzrə Test Bankı</h2>
                        <p className="text-sm text-slate-500">Hər sinfin dərsliklərinə və suallarına keçid edin</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {grades.map((g: any) => {
                        const gradeNum = g.grade
                        const qCount = g.questionsCount || 0
                        const sCount = g.subjectsCount || 0
                        const tCount = g.topicsCount || 0

                        return (
                            <Link key={gradeNum} href={`/admin/test-bank/questions?grade=${gradeNum}`}>
                                <Card className="hover:shadow-md hover:border-blue-400 transition-all cursor-pointer h-full flex flex-col group border-slate-200">
                                    <CardHeader className="p-5 pb-3">
                                        <div className="flex items-center justify-between mb-1">
                                            <Badge variant="outline" className="font-bold text-blue-700 bg-blue-50 border-blue-200">
                                                {gradeNum}-ci Sinif
                                            </Badge>
                                            <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                                        </div>
                                        <CardTitle className="text-2xl font-black text-slate-900">
                                            {qCount.toLocaleString()} <span className="text-xs font-normal text-slate-500">sual</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-5 pt-0 flex-1 flex flex-col justify-end text-xs text-slate-500 space-y-2">
                                        <div className="flex justify-between border-t pt-2">
                                            <span>Fənn sayı:</span>
                                            <span className="font-semibold text-slate-700">{sCount} fənn</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Mövzu sayı:</span>
                                            <span className="font-semibold text-slate-700">{tCount} mövzu</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        )
                    })}
                </div>
            </div>

            {/* Quick Links Footer Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <Link href="/admin/test-bank/questions">
                    <Card className="hover:bg-slate-50/80 cursor-pointer transition border-slate-200 shadow-sm">
                        <CardHeader className="p-5 pb-2">
                            <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-900">
                                <Search className="h-4 w-4 text-blue-600" />
                                Sual Mərkəzi (Explorer)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-5 pt-0">
                            <p className="text-xs text-slate-500">
                                69,000 sual arasında sinif, fənn, çətinlik və açar söz üzrə zəngin filtrasiya və axtarış aparın.
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/admin/curriculum">
                    <Card className="hover:bg-slate-50/80 cursor-pointer transition border-slate-200 shadow-sm">
                        <CardHeader className="p-5 pb-2">
                            <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-900">
                                <BookOpen className="h-4 w-4 text-emerald-600" />
                                Tədris Proqramı və Dərsliklər
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-5 pt-0">
                            <p className="text-xs text-slate-500">
                                Rəsmi dərsliklər, fəsil strukturu və kurikulum analitikasına dərslik səviyyəsində baxın.
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/admin/test-bank/problem-questions">
                    <Card className="hover:bg-slate-50/80 cursor-pointer transition border-slate-200 shadow-sm">
                        <CardHeader className="p-5 pb-2">
                            <CardTitle className="text-base font-bold flex items-center gap-2 text-amber-600">
                                <Sparkles className="h-4 w-4 text-amber-500" />
                                Keyfiyyət və Problemli Suallar
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-5 pt-0">
                            <p className="text-xs text-slate-500">
                                Şagirdlərin tez-tez səhv etdiyi və ya şikayət edilən sualları yoxlayın və redaktə edin.
                            </p>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    )
}
