'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2, AlertTriangle, CheckCircle, XCircle, Flag, MessageSquare, Send, ShieldAlert, Sparkles } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ProblemQuestionsPage() {
    const [reports, setReports] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [resolvingId, setResolvingId] = useState<string | null>(null)
    const [adminNotes, setAdminNotes] = useState<Record<string, string>>({})
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'resolved' | 'rejected'>('pending')
    const [actionMsg, setActionMsg] = useState<{ id: string; msg: string; type: 'success' | 'error' } | null>(null)

    const loadReports = async () => {
        try {
            setLoading(true)
            const res = await fetch('/api/admin/test-bank/problem-reports')
            const data = await res.json()
            setReports(data.reports || [])
        } catch (err) {
            console.error('Error loading reports:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadReports()
    }, [])

    const handleAction = async (reportId: string, action: 'resolve' | 'reject') => {
        setResolvingId(reportId)
        setActionMsg(null)
        try {
            const customNote = adminNotes[reportId] || ''
            const res = await fetch('/api/admin/test-bank/problem-reports', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    reportId,
                    action,
                    adminResponse: customNote
                })
            })
            const data = await res.json()
            if (!res.ok) {
                setActionMsg({ id: reportId, msg: data.error || 'Xəta baş verdi', type: 'error' })
            } else {
                setActionMsg({
                    id: reportId,
                    msg: action === 'resolve' 
                        ? 'Problem təsdiqləndi! Şagirdin mesaj qutusuna bildiriş göndərildi.' 
                        : 'Müraciət əsassız kimi rədd edildi.',
                    type: 'success'
                })
                loadReports()
            }
        } catch (err: any) {
            setActionMsg({ id: reportId, msg: err.message || 'Xəta baş verdi', type: 'error' })
        } finally {
            setResolvingId(null)
        }
    }

    const filteredReports = reports.filter(r => {
        if (statusFilter === 'all') return true
        return r.status === statusFilter
    })

    const pendingCount = reports.filter(r => r.status === 'pending').length
    const resolvedCount = reports.filter(r => r.status === 'resolved').length
    const rejectedCount = reports.filter(r => r.status === 'rejected').length

    const getIssueTypeBadge = (type: string) => {
        switch (type) {
            case 'wrong_key':
                return <Badge className="bg-red-600 hover:bg-red-700 text-white">Cavab Açarı Səhvi</Badge>
            case 'contradictory_explanation':
                return <Badge className="bg-amber-600 hover:bg-amber-700 text-white">İzah Ziddiyyəti</Badge>
            case 'unclear_question':
                return <Badge className="bg-blue-600 hover:bg-blue-700 text-white">Qeyri-Aydın Sual</Badge>
            default:
                return <Badge variant="outline">Digər Qüsur</Badge>
        }
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
                        <ShieldAlert className="h-7 w-7 text-amber-600" />
                        Şagird Problemli Sual Bildirişləri
                    </h2>
                    <p className="text-sm text-slate-600 mt-1">
                        Şagirdlərin Sual-cavab Təhlilində bildirdiyi xətaların idarəetmə və cavablandırma masası
                    </p>
                </div>
                <div className="flex gap-2">
                    <Badge variant="outline" className="px-3 py-1.5 text-sm font-semibold border-amber-300 bg-amber-50 text-amber-800">
                        {pendingCount} Gözləyən
                    </Badge>
                    <Badge variant="outline" className="px-3 py-1.5 text-sm font-semibold border-green-300 bg-green-50 text-green-800">
                        {resolvedCount} Həll Edilən
                    </Badge>
                </div>
            </div>

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="border-amber-200 bg-amber-50/50">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider">Baxış Gözləyən</p>
                            <h3 className="text-2xl font-bold text-amber-900 mt-1">{pendingCount}</h3>
                        </div>
                        <AlertTriangle className="h-8 w-8 text-amber-500 opacity-80" />
                    </CardContent>
                </Card>
                <Card className="border-green-200 bg-green-50/50">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-green-800 uppercase tracking-wider">Təsdiq Edilmiş</p>
                            <h3 className="text-2xl font-bold text-green-900 mt-1">{resolvedCount}</h3>
                        </div>
                        <CheckCircle className="h-8 w-8 text-green-500 opacity-80" />
                    </CardContent>
                </Card>
                <Card className="border-slate-200 bg-slate-50/50">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Rədd Edilmiş</p>
                            <h3 className="text-2xl font-bold text-slate-800 mt-1">{rejectedCount}</h3>
                        </div>
                        <XCircle className="h-8 w-8 text-slate-400 opacity-80" />
                    </CardContent>
                </Card>
            </div>

            {/* Filter Tabs */}
            <div className="flex justify-between items-center">
                <div className="flex gap-2">
                    <Button 
                        size="sm" 
                        variant={statusFilter === 'pending' ? 'default' : 'outline'}
                        className={statusFilter === 'pending' ? 'bg-amber-600 hover:bg-amber-700 text-white' : ''}
                        onClick={() => setStatusFilter('pending')}
                    >
                        Gözləyənlər ({pendingCount})
                    </Button>
                    <Button 
                        size="sm" 
                        variant={statusFilter === 'resolved' ? 'default' : 'outline'}
                        className={statusFilter === 'resolved' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
                        onClick={() => setStatusFilter('resolved')}
                    >
                        Təsdiqlənənlər ({resolvedCount})
                    </Button>
                    <Button 
                        size="sm" 
                        variant={statusFilter === 'rejected' ? 'default' : 'outline'}
                        onClick={() => setStatusFilter('rejected')}
                    >
                        Rədd Edilənlər ({rejectedCount})
                    </Button>
                    <Button 
                        size="sm" 
                        variant={statusFilter === 'all' ? 'default' : 'outline'}
                        onClick={() => setStatusFilter('all')}
                    >
                        Bütün Müraciətlər ({reports.length})
                    </Button>
                </div>
                <Button size="sm" variant="ghost" onClick={loadReports}>
                    Yenilə 🔄
                </Button>
            </div>

            {/* Content List */}
            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
                </div>
            ) : filteredReports.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="p-12 text-center">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                        <h4 className="text-base font-semibold text-slate-800">Bu kateqoriyada müraciət yoxdur!</h4>
                        <p className="text-xs text-slate-500 mt-1">Bütün şagird bildirişləri vaxtında araşdırılıb.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {filteredReports.map((rep) => {
                        const isActionRunning = resolvingId === rep.id

                        return (
                            <Card key={rep.id} className={`border-l-4 ${rep.status === 'pending' ? 'border-l-amber-500 border-amber-200' : rep.status === 'resolved' ? 'border-l-green-500 border-green-200' : 'border-l-slate-400 border-slate-200'}`}>
                                <CardHeader className="pb-3">
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                                        <div className="space-y-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                {getIssueTypeBadge(rep.issueType)}
                                                <Badge variant="outline" className="font-medium">{rep.subject} ({rep.grade}-ci sinif)</Badge>
                                                <span className="text-xs text-slate-500">
                                                    {new Date(rep.reportedAt).toLocaleString('az-AZ')}
                                                </span>
                                            </div>
                                            <CardTitle className="text-base font-semibold text-slate-900 mt-2">
                                                {rep.questionText}
                                            </CardTitle>
                                            <p className="text-xs text-muted-foreground">
                                                <strong>Mövzu:</strong> {rep.topic} | <strong>ID:</strong> {rep.passportId || rep.questionId}
                                            </p>
                                        </div>
                                        <Badge className={rep.status === 'pending' ? 'bg-amber-100 text-amber-800 border-amber-300' : rep.status === 'resolved' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-slate-100 text-slate-700'}>
                                            {rep.status === 'pending' ? 'Gözləyir' : rep.status === 'resolved' ? 'Həll Edildi' : 'Rədd Edildi'}
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4 pt-0">
                                    {/* Student Comment Box */}
                                    <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1.5 text-xs">
                                        <div className="flex justify-between items-center text-slate-600 font-semibold">
                                            <span>🧑‍🎓 Şagirdin Şərhi ({rep.studentName} - {rep.studentEmail || 'anon'}):</span>
                                        </div>
                                        <p className="text-slate-800 italic leading-relaxed whitespace-pre-wrap">
                                            "{rep.comment}"
                                        </p>
                                    </div>

                                    {/* Status Message */}
                                    {actionMsg && actionMsg.id === rep.id && (
                                        <div className={`p-3 text-xs rounded-xl border ${actionMsg.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                                            {actionMsg.msg}
                                        </div>
                                    )}

                                    {/* Resolved Notes if already handled */}
                                    {rep.adminResponse && (
                                        <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl text-xs text-blue-900">
                                            <strong>Admin Cavabı:</strong> {rep.adminResponse}
                                        </div>
                                    )}

                                    {/* Pending Actions for Admin */}
                                    {rep.status === 'pending' && (
                                        <div className="space-y-3 pt-2 border-t">
                                            <div>
                                                <label className="text-xs font-semibold text-slate-700 block mb-1">
                                                    Şagirdə göndəriləcək fərdi cavab (istəyə görə):
                                                </label>
                                                <input
                                                    type="text"
                                                    value={adminNotes[rep.id] || ''}
                                                    onChange={(e) => setAdminNotes({ ...adminNotes, [rep.id]: e.target.value })}
                                                    placeholder="Məsələn: Təşəkkür edirik, dərsliklə müqayisə edildi və cavab açarı B variantına dəyişdirildi."
                                                    className="w-full text-xs border rounded-lg p-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                />
                                            </div>

                                            <div className="flex flex-wrap items-center justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    disabled={isActionRunning}
                                                    onClick={() => handleAction(rep.id, 'reject')}
                                                    className="text-slate-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <XCircle className="h-4 w-4 mr-1.5" />
                                                    Əsassızdır (Rədd Et)
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    disabled={isActionRunning}
                                                    onClick={() => handleAction(rep.id, 'resolve')}
                                                    className="bg-green-600 hover:bg-green-700 text-white font-medium shadow-sm"
                                                >
                                                    {isActionRunning ? (
                                                        <>
                                                            <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                                                            İcra Edilir...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CheckCircle className="h-4 w-4 mr-1.5" />
                                                            Təsdiq Et və Şagirdə Mesaj Göndər
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
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
