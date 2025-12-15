'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle, AlertCircle, Sparkles } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

export default function TestBankTopicsPage() {
    const [coverage, setCoverage] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [generating, setGenerating] = useState<string | null>(null)
    const [autoApprove, setAutoApprove] = useState(false) // Default to pending review
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedTopic, setSelectedTopic] = useState<any>(null)

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

    useEffect(() => {
        loadCoverage()
    }, [])

    const handleGenerate = async () => {
        if (!selectedTopic) return

        setGenerating(selectedTopic.topicKey)
        setDialogOpen(false) // Close dialog immediately or keep open for progress? Let's close and show toast loading

        const promise = fetch('/api/test-bank/generate', {
            method: 'POST',
            body: JSON.stringify({
                topicKey: selectedTopic.topicKey,
                count: 10, // Request batch of 10 as per user request
                autoApprove: autoApprove
            })
        }).then(async (res) => {
            if (!res.ok) throw new Error('Failed')
            const data = await res.json()
            // Reload validation
            await loadCoverage()
            return data
        })

        toast.promise(promise, {
            loading: 'AI suallar yaradır...',
            success: (data) => `${data.generated} sual yaradıldı! (${autoApprove ? 'Aktiv' : 'Təsdiq gözləyir'})`,
            error: 'Xəta baş verdi'
        })

        try {
            await promise
        } catch (e) {
            console.error(e)
        } finally {
            setGenerating(null)
            setSelectedTopic(null)
        }
    }

    const openGenerateDialog = (topic: any) => {
        setSelectedTopic(topic)
        setDialogOpen(true)
    }

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
                                <TableHead>Əməliyyat</TableHead>
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
                                        <TableCell>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openGenerateDialog(topic)}
                                                disabled={generating === topic.topicKey}
                                            >
                                                {generating === topic.topicKey ? (
                                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                ) : (
                                                    <Sparkles className="h-4 w-4 mr-2 text-purple-600" />
                                                )}
                                                AI Yarat
                                            </Button>
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

            {/* Generate Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>AI ilə Sual Yaratma</DialogTitle>
                    </DialogHeader>

                    <div className="py-4 space-y-4">
                        <div className="p-3 bg-slate-100 rounded text-sm">
                            <strong>Mövzu:</strong> {selectedTopic?.topicName} <br />
                            <strong>Axtarılan say:</strong> {selectedTopic ? (selectedTopic.targetQuestions - selectedTopic.currentCount) : 0} sual
                        </div>

                        <div className="flex items-center justify-between space-x-2 border p-3 rounded-lg">
                            <div className="space-y-0.5">
                                <Label className="text-base">Avtomatik Təsdiq</Label>
                                <p className="text-xs text-slate-500">
                                    Aktiv etsəniz suallar dərhal istifadəyə veriləcək.
                                    Söndürsəniz "Gözləmədə" (Pending) statusunda olacaq.
                                </p>
                            </div>
                            <Switch
                                checked={autoApprove}
                                onCheckedChange={setAutoApprove}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setDialogOpen(false)}>Ləğv et</Button>
                        <Button onClick={handleGenerate} className="bg-purple-600 hover:bg-purple-700 text-white">
                            <Sparkles className="h-4 w-4 mr-2" />
                            Yarat (5 ədəd)
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
