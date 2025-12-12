'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'

export default function TestBankTopicsPage() {
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

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold">Mövzu Əhatəlilik</h2>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Mövzu</TableHead>
                                <TableHead>Hədəf</TableHead>
                                <TableHead>Cari</TableHead>
                                <TableHead>Tamamlanma</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {topics.map((topic: any) => {
                                const percentage = topic.targetQuestions > 0
                                    ? Math.round((topic.currentCount / topic.targetQuestions) * 100)
                                    : 0

                                return (
                                    <TableRow key={topic.topicKey}>
                                        <TableCell className="font-medium">{topic.topicName}</TableCell>
                                        <TableCell>{topic.targetQuestions} sual</TableCell>
                                        <TableCell>{topic.currentCount} sual</TableCell>
                                        <TableCell className="w-64">
                                            <div className="flex items-center gap-2">
                                                <Progress value={percentage} className="flex-1" />
                                                <span className="text-sm text-slate-600 w-12">{percentage}%</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {topic.isComplete ? (
                                                <Badge className="bg-green-600">
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                    Tamamlandı
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-orange-600 border-orange-600">
                                                    <AlertCircle className="h-3 w-3 mr-1" />
                                                    Davam edir
                                                </Badge>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Metrics Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {topics.map((topic: any) => (
                    <Card key={topic.topicKey}>
                        <CardHeader>
                            <CardTitle className="text-sm">{topic.topicName}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Səhifə sayı:</span>
                                    <span className="font-medium">{topic.metrics?.totalPages || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Alt-mövzu:</span>
                                    <span className="font-medium">{topic.metrics?.subtopicCount || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Hədəf sual:</span>
                                    <span className="font-medium">{topic.targetQuestions}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
