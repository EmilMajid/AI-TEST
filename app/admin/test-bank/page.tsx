'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Database, CheckCircle, AlertTriangle } from 'lucide-react'

export default function TestBankOverviewPage() {
    const [coverage, setCoverage] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadCoverage() {
            try {
                const res = await fetch('/api/test-bank/coverage')
                const data = await res.json()
                setCoverage(data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        loadCoverage()
    }, [])

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    const topics = Object.values(coverage || {})
    const totalTopics = topics.length
    const completedTopics = topics.filter((t: any) => t.isComplete).length
    const totalQuestions = topics.reduce((sum: number, t: any) => sum + t.currentCount, 0)
    const targetQuestions = topics.reduce((sum: number, t: any) => sum + t.targetQuestions, 0)

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold">Test Bankı - Ümumi Baxış</h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Cəmi Mövzu</p>
                                <p className="text-3xl font-bold">{totalTopics}</p>
                            </div>
                            <Database className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Tamamlanmış</p>
                                <p className="text-3xl font-bold">{completedTopics}</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Cəmi Suallar</p>
                                <p className="text-3xl font-bold">{totalQuestions}</p>
                            </div>
                            <Database className="h-8 w-8 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Hədəf</p>
                                <p className="text-3xl font-bold">{targetQuestions}</p>
                            </div>
                            <AlertTriangle className="h-8 w-8 text-orange-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/admin/test-bank/topics">
                    <Card className="hover:bg-slate-50 cursor-pointer transition">
                        <CardHeader>
                            <CardTitle className="text-lg">Mövzu Əhatəlilik</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-600">Hər mövzunun tamamlanma vəziyyətini görün</p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/admin/test-bank/questions">
                    <Card className="hover:bg-slate-50 cursor-pointer transition">
                        <CardHeader>
                            <CardTitle className="text-lg">Sual İdarəetməsi</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-600">Bütün sualları axtarın və redaktə edin</p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/admin/test-bank/problem-questions">
                    <Card className="hover:bg-slate-50 cursor-pointer transition border-orange-200">
                        <CardHeader>
                            <CardTitle className="text-lg text-orange-600">Problemli Suallar</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-600">Səhv cavabları çox seçilən suallar</p>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    )
}
