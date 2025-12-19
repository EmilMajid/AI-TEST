'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2, AlertTriangle, TrendingDown, Edit } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { TestBankFilters, FilterState } from '@/components/admin/test-bank-filters'

export default function ProblemQuestionsPage() {
    const [questions, setQuestions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    // Filters
    const [filters, setFilters] = useState<FilterState>({})

    useEffect(() => {
        async function loadQuestions() {
            try {
                const res = await fetch('/api/test-bank/questions')
                const data = await res.json()
                const allQuestions = Array.isArray(data) ? data : []

                // Filter only problem questions
                const problemQuestions = allQuestions.filter(q => q.isProblemDetected)
                setQuestions(problemQuestions)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        loadQuestions()
    }, [])

    const getProblemTypeBadge = (type: string) => {
        const types: Record<string, { label: string, color: string }> = {
            'misleading_option': { label: 'Aldadıcı Variant', color: 'bg-orange-600' },
            'teaching_gap': { label: 'Tədris Problemi', color: 'bg-red-600' },
            'unclear_question': { label: 'Qeyri-Aydın Sual', color: 'bg-yellow-600' }
        }
        const config = types[type] || { label: type, color: 'bg-gray-600' }
        return <Badge className={config.color}>{config.label}</Badge>
    }

    const getWrongAnswerDistribution = (q: any) => {
        if (!q.wrongAnswerStats) return null

        const stats = q.wrongAnswerStats
        const total = Object.values(stats).reduce((sum: number, count: any) => sum + (count || 0), 0)

        if (total === 0) return null

        return [0, 1, 2, 3].map(i => ({
            option: i,
            count: stats[`option${i}`] || 0,
            percentage: total > 0 ? ((stats[`option${i}`] || 0) / total) * 100 : 0,
            isCorrect: i === q.correctAnswer
        }))
    }

    const filteredQuestions = questions.filter(q => {
        if (filters.class && q.class !== filters.class) return false
        if (filters.subject && q.subject !== filters.subject) return false
        if (filters.textbook && q.textbook !== filters.textbook) return false
        if (filters.topic && q.topic !== filters.topic) return false
        return true
    })

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-orange-600">Problemli Suallar</h2>
                <Badge variant="outline" className="text-orange-600 border-orange-600">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {filteredQuestions.length} problem
                </Badge>
            </div>

            <TestBankFilters onFilterChange={setFilters} />

            {loading ? (
                <div className="flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : filteredQuestions.length === 0 ? (
                <Card>
                    <CardContent className="p-8 text-center">
                        <div className="text-green-600 mb-2">
                            <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
                            <p className="text-lg font-medium">Problemli sual yoxdur!</p>
                            <p className="text-sm text-slate-500 mt-2">Bütün suallar yaxşı işləyir.</p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {filteredQuestions.map((q) => {
                        const distribution = getWrongAnswerDistribution(q)

                        return (
                            <Card key={q.id} className="border-orange-200">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <CardTitle className="text-base">{q.question}</CardTitle>
                                            <div className="flex gap-2 mt-2">
                                                {getProblemTypeBadge(q.problemType)}
                                                <Badge variant="outline">{q.subject}</Badge>
                                                <Badge variant="outline">{q.difficulty}</Badge>
                                            </div>
                                        </div>
                                        <Button size="sm" variant="outline">
                                            <Edit className="h-4 w-4 mr-2" />
                                            Redaktə
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Statistics */}
                                        <div>
                                            <h4 className="text-sm font-medium mb-3">Statistika</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-slate-500">İstifadə sayı:</span>
                                                    <span className="font-medium">{q.usageCount || 0}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-500">Uğur faizi:</span>
                                                    <span className={`font-medium ${(q.successRate || 0) < 20 ? 'text-red-600' : ''}`}>
                                                        {q.successRate !== undefined ? `${q.successRate.toFixed(1)}%` : '-'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-500">Düzgün cavab:</span>
                                                    <span className="font-medium">Variant {q.correctAnswer}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Answer Distribution */}
                                        {distribution && (
                                            <div>
                                                <h4 className="text-sm font-medium mb-3">Cavab Bölgüsü</h4>
                                                <div className="space-y-2">
                                                    {distribution.map((item) => (
                                                        <div key={item.option} className="space-y-1">
                                                            <div className="flex justify-between text-xs">
                                                                <span className={item.isCorrect ? 'font-medium text-green-600' : ''}>
                                                                    Variant {item.option} {item.isCorrect && '(Düzgün)'}
                                                                </span>
                                                                <span className="text-slate-600">
                                                                    {item.count} ({item.percentage.toFixed(0)}%)
                                                                </span>
                                                            </div>
                                                            <Progress
                                                                value={item.percentage}
                                                                className={item.isCorrect ? 'bg-green-100' : item.percentage > 40 ? 'bg-red-100' : 'bg-slate-100'}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Admin Notes */}
                                    {q.adminNotes && (
                                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
                                            <strong>Admin Qeydi:</strong> {q.adminNotes}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
