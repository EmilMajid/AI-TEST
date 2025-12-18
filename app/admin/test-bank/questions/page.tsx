'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Loader2, Search, Edit, Trash2, Check, X, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { TestBankFilters, FilterState } from '@/components/admin/test-bank-filters'

export default function TestBankQuestionsPage() {
    const [questions, setQuestions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [difficultyFilter, setDifficultyFilter] = useState("all")
    const [bloomFilter, setBloomFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState("active") // active, pending, all

    // Test Bank Filters
    const [filters, setFilters] = useState<FilterState>({})

    async function loadQuestions() {
        try {
            const res = await fetch('/api/test-bank/questions')
            const data = await res.json()
            setQuestions(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error(err)
            toast.error("Sualları yükləyərkən xəta baş verdi")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadQuestions()
    }, [])

    const handleApprove = async (id: string) => {
        try {
            const res = await fetch('/api/test-bank/questions', {
                method: 'PATCH',
                body: JSON.stringify({ id, status: 'active', isPending: false })
            })
            if (!res.ok) throw new Error()
            toast.success("Sual təsdiqləndi")
            loadQuestions()
        } catch (e) {
            toast.error("Xəta baş verdi")
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Sualı silmək istədiyinizə əminsiniz?")) return
        try {
            const res = await fetch(`/api/test-bank/questions?id=${id}`, {
                method: 'DELETE'
            })
            if (!res.ok) throw new Error()
            toast.success("Sual silindi")
            loadQuestions()
        } catch (e) {
            toast.error("Xəta baş verdi")
        }
    }

    const filteredQuestions = questions.filter(q => {
        // Test Bank Filters
        if (filters.class && q.class !== filters.class) return false
        if (filters.subject && q.subject !== filters.subject) return false
        // Precise topic match (if mock data supports it)
        if (filters.topic && q.topic !== filters.topic) return false

        const matchesSearch = q.question?.toLowerCase().includes(search.toLowerCase())
        const matchesDifficulty = difficultyFilter === "all" || q.difficulty === difficultyFilter
        const matchesBloom = bloomFilter === "all" || q.bloomLevel === bloomFilter

        let matchesStatus = true
        if (statusFilter === 'active') matchesStatus = !q.isPending
        if (statusFilter === 'pending') matchesStatus = q.isPending
        // if 'all', matchesStatus is true

        return matchesSearch && matchesDifficulty && matchesBloom && matchesStatus
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

            <TestBankFilters onFilterChange={setFilters} />

            <Tabs defaultValue="active" onValueChange={setStatusFilter}>
                <TabsList>
                    <TabsTrigger value="active">Aktiv</TabsTrigger>
                    <TabsTrigger value="pending" className="relative">
                        Gözləmədə
                        {questions.filter(q => q.isPending).length > 0 && (
                            <span className="ml-2 flex h-2 w-2 rounded-full bg-orange-500" />
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="all">Bütün</TabsTrigger>
                </TabsList>
            </Tabs>

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
                                    <TableHead>Sinif / Fənn</TableHead>
                                    <TableHead>Çətinlik</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Əməliyyatlar</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredQuestions.map((q) => (
                                    <TableRow key={q.id}>
                                        <TableCell className="max-w-md">
                                            <p className="truncate font-medium">{q.question}</p>
                                            <p className="text-xs text-slate-500 mt-1">
                                                Düzgün: {q.options[q.correctAnswer]}
                                            </p>
                                        </TableCell>
                                        <TableCell className="text-sm text-slate-600">
                                            {/* Show mapped name or key */}
                                            {q.topicKey}
                                        </TableCell>
                                        <TableCell className="text-xs text-slate-500">
                                            {q.class && `${q.class}-ci sinif`} <br />
                                            {q.subject}
                                        </TableCell>
                                        <TableCell>{getDifficultyBadge(q.difficulty)}</TableCell>
                                        <TableCell>
                                            {q.isPending ? (
                                                <Badge variant="outline" className="text-orange-600 border-orange-600">
                                                    <AlertCircle className="h-3 w-3 mr-1" />
                                                    Gözləmədə
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-green-600">Aktiv</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {q.isPending && (
                                                    <Button
                                                        size="sm"
                                                        className="bg-green-600 hover:bg-green-700 h-8 w-8 p-0"
                                                        onClick={() => handleApprove(q.id)}
                                                        title="Təsdiqlə"
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0 text-slate-500"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => handleDelete(q.id)}
                                                    title={q.isPending ? "İmtina et" : "Sil"}
                                                >
                                                    {q.isPending ? <X className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
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
