'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2, Search, Edit, Trash2 } from 'lucide-react'

export default function TestBankQuestionsPage() {
    const [questions, setQuestions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [difficultyFilter, setDifficultyFilter] = useState("all")
    const [bloomFilter, setBloomFilter] = useState("all")

    useEffect(() => {
        async function loadQuestions() {
            try {
                const res = await fetch('/api/test-bank/questions')
                const data = await res.json()
                setQuestions(Array.isArray(data) ? data : [])
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        loadQuestions()
    }, [])

    const filteredQuestions = questions.filter(q => {
        const matchesSearch = q.question?.toLowerCase().includes(search.toLowerCase())
        const matchesDifficulty = difficultyFilter === "all" || q.difficulty === difficultyFilter
        const matchesBloom = bloomFilter === "all" || q.bloomLevel === bloomFilter
        return matchesSearch && matchesDifficulty && matchesBloom
    })

    const getDifficultyBadge = (difficulty: string) => {
        const colors: Record<string, string> = {
            'asan': 'bg-green-600',
            'orta': 'bg-blue-600',
            'çətin': 'bg-orange-600',
            'qarışıq': 'bg-purple-600'
        }
        return <Badge className={colors[difficulty] || 'bg-gray-600'}>{difficulty}</Badge>
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">Sual İdarəetməsi</h2>
                <Badge variant="outline">{filteredQuestions.length} sual</Badge>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Sual axtar..."
                                className="pl-8"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Çətinlik" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Hamısı</SelectItem>
                                <SelectItem value="asan">Asan</SelectItem>
                                <SelectItem value="orta">Orta</SelectItem>
                                <SelectItem value="çətin">Çətin</SelectItem>
                                <SelectItem value="qarışıq">Qarışıq</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={bloomFilter} onValueChange={setBloomFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Bloom Səviyyəsi" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Hamısı</SelectItem>
                                <SelectItem value="xatırlama">Xatırlama</SelectItem>
                                <SelectItem value="anlama">Anlama</SelectItem>
                                <SelectItem value="tətbiq">Tətbiq</SelectItem>
                                <SelectItem value="təhlil">Təhlil</SelectItem>
                                <SelectItem value="qiymətləndirmə">Qiymətləndirmə</SelectItem>
                                <SelectItem value="yaradıcılıq">Yaradıcılıq</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Questions Table */}
            <Card>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : filteredQuestions.length === 0 ? (
                        <div className="p-8 text-center text-slate-400">
                            {questions.length === 0 ? "Hələ sual yoxdur" : "Heç bir sual tapılmadı"}
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Sual</TableHead>
                                    <TableHead>Mövzu</TableHead>
                                    <TableHead>Çətinlik</TableHead>
                                    <TableHead>Bloom</TableHead>
                                    <TableHead>İstifadə</TableHead>
                                    <TableHead>Uğur %</TableHead>
                                    <TableHead className="text-right">Əməliyyatlar</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredQuestions.map((q) => (
                                    <TableRow key={q.id}>
                                        <TableCell className="max-w-md">
                                            <p className="truncate">{q.question}</p>
                                        </TableCell>
                                        <TableCell className="text-sm text-slate-600">{q.subject}</TableCell>
                                        <TableCell>{getDifficultyBadge(q.difficulty)}</TableCell>
                                        <TableCell className="text-sm">{q.bloomLevel}</TableCell>
                                        <TableCell>{q.usageCount || 0}</TableCell>
                                        <TableCell>
                                            {q.successRate !== undefined ? `${q.successRate.toFixed(0)}%` : '-'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button size="sm" variant="ghost">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button size="sm" variant="ghost" className="text-red-600">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
