'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, User, GraduationCap, School, Users as UsersIcon, BarChart3, Mail } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export default function AdminUserProfilePage() {
    const params = useParams()
    const router = useRouter()
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`/api/admin/users/${params.id}`)
                if (res.ok) {
                    const json = await res.json()
                    setData(json)
                }
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [params.id])

    if (loading) return <div className="p-8">Yüklənir...</div>
    if (!data || !data.user) return <div className="p-8">İstifadəçi tapılmadı</div>

    const { user, stats, relations } = data

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin': return <Badge className="bg-red-600">Admin</Badge>
            case 'director': return <Badge className="bg-purple-600">Direktor</Badge>
            case 'teacher': return <Badge className="bg-blue-600">Müəllim</Badge>
            case 'student': return <Badge className="bg-green-600">Şagird</Badge>
            case 'parent': return <Badge className="bg-orange-600">Valideyn</Badge>
            default: return <Badge variant="outline">{role}</Badge>
        }
    }

    return (
        <div className="space-y-6">
            <Button variant="ghost" onClick={() => router.back()} className="pl-0">
                <ArrowLeft className="mr-2 h-4 w-4" /> Geri
            </Button>

            {/* Header Profile Card */}
            <Card>
                <CardContent className="p-6 flex items-start gap-6">
                    <div className="h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center border-2 border-slate-200">
                        <User className="h-12 w-12 text-slate-400" />
                    </div>
                    <div className="space-y-2 flex-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold">{user.firstName} {user.lastName}</h1>
                                <div className="flex items-center gap-2 text-slate-500 mt-1">
                                    <Mail className="h-4 w-4" /> {user.email}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {user.source === "admin" || user.accountType === "admin" || user.role === "admin" ? null : (user.source === "real" && !user.email?.endsWith("@test.com") && !user.email?.endsWith("@example.com")) ? (
                                    <span className="text-xs bg-emerald-100 text-emerald-700 border border-emerald-300 px-2.5 py-1 rounded-full font-semibold">
                                        Real İstifadəçi
                                    </span>
                                ) : (
                                    <span className="text-xs bg-slate-100 text-slate-500 border border-slate-200 px-2.5 py-1 rounded-full font-medium">
                                        Demo İstifadəçi
                                    </span>
                                )}
                                {getRoleBadge(user.role)}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                            <div className="flex flex-col">
                                <span className="text-slate-400">Ata adı</span>
                                <span className="font-medium">{user.fatherName || "-"}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-slate-400">Məktəb</span>
                                <div className="flex items-center gap-1 font-medium">
                                    <School className="h-3 w-3" /> {user.school}
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-slate-400">Region</span>
                                <span className="font-medium">{user.region}</span>
                            </div>
                            {user.class && (
                                <div className="flex flex-col">
                                    <span className="text-slate-400">Sinif</span>
                                    <span className="font-medium">{user.class}-ci sinif</span>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Analytics Card (Only for Students) */}
                {user.role === 'student' && stats && (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className={`h-5 w-5 ${stats.isReal ? "text-emerald-600" : "text-blue-500"}`} />
                                    Statistika
                                </CardTitle>
                                {stats.isReal ? (
                                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300 hover:bg-emerald-100 font-medium">
                                        Real Məlumat
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="bg-slate-100 text-slate-500 border-slate-200">
                                        Demo
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className={`${stats.isReal ? "bg-emerald-50 border border-emerald-100" : "bg-blue-50"} p-4 rounded-xl text-center`}>
                                    <div className={`text-3xl font-bold ${stats.isReal ? "text-emerald-700" : "text-blue-700"}`}>{stats.averageScore}</div>
                                    <div className={`text-xs ${stats.isReal ? "text-emerald-600" : "text-blue-600"} font-medium uppercase tracking-wider mt-1`}>Ortalama Bal</div>
                                </div>
                                <div className={`${stats.isReal ? "bg-emerald-50 border border-emerald-100" : "bg-green-50"} p-4 rounded-xl text-center`}>
                                    <div className={`text-3xl font-bold ${stats.isReal ? "text-emerald-700" : "text-green-700"}`}>{stats.totalTests}</div>
                                    <div className={`text-xs ${stats.isReal ? "text-emerald-600" : "text-green-600"} font-medium uppercase tracking-wider mt-1`}>İşlənmiş Testlər</div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium mb-3 text-sm text-slate-500">Son Fəaliyyət</h4>
                                {stats.recentActivity && stats.recentActivity.length > 0 ? (
                                    <div className="space-y-3">
                                        {stats.recentActivity.map((act: any) => (
                                            <div key={act.id} className="flex justify-between items-center text-sm p-2 bg-slate-50 rounded border">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-slate-800">{act.testName}</span>
                                                    {act.date && <span className="text-[11px] text-slate-400">{act.date}</span>}
                                                </div>
                                                <Badge variant={act.score >= 80 ? "default" : "secondary"}>{act.score} bal</Badge>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-6 bg-slate-50 border border-dashed border-slate-200 rounded-lg text-center text-slate-500 text-xs">
                                        <p className="font-medium text-slate-600 text-sm mb-1">Hələ heç bir test işlənməyib</p>
                                        <p>Şagird test işlədikdə nəticələr burada real vaxt rejimində əks olunacaq.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Relations Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UsersIcon className="h-5 w-5 text-purple-500" />
                            Əlaqələr
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Parent View (Övladlar) */}
                        {((user.role === 'parent' || user.accountType === 'parent') && relations.children && relations.children.length > 0) && (
                            <div>
                                <h4 className="text-sm font-medium text-slate-500 mb-2">Övladlar ({relations.children.length})</h4>
                                {relations.children.map((child: any) => (
                                    <div key={child.id} className="flex items-center gap-3 p-3 border rounded-lg mb-2 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                                        <div className="h-9 w-9 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-sm shrink-0">
                                            {child.firstName?.[0] || 'Ş'}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="font-medium text-slate-900 truncate">{child.firstName} {child.lastName}</div>
                                            <div className="text-xs text-slate-500 truncate">
                                                {child.class ? `${child.class}-ci sinif` : 'Şagird'}
                                                {child.school ? ` • ${child.school}` : ''}
                                                {child.email ? ` • ${child.email}` : ''}
                                            </div>
                                        </div>
                                        <Button size="sm" variant="outline" className="ml-auto text-blue-600 hover:text-blue-700 hover:bg-blue-50 shrink-0" onClick={() => router.push(`/admin/users/${child.id}`)}>
                                            Profilə Bax
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Student View (Valideyn və Müəllim) */}
                        {(user.role === 'student' || user.accountType === 'student') && (
                            <>
                                {relations.parent && (
                                    <div>
                                        <h4 className="text-sm font-medium text-slate-500 mb-2">Valideyn</h4>
                                        <div className="flex items-center gap-3 p-3 border rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors">
                                            <div className="h-9 w-9 bg-orange-100 rounded-full flex items-center justify-center text-orange-700 font-bold text-sm shrink-0">
                                                {relations.parent.firstName?.[0] || 'V'}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="font-medium text-slate-900 truncate">{relations.parent.firstName} {relations.parent.lastName}</div>
                                                <div className="text-xs text-slate-500 truncate">
                                                    Valideyn
                                                    {relations.parent.email ? ` • ${relations.parent.email}` : ''}
                                                    {relations.parent.school ? ` • ${relations.parent.school}` : ''}
                                                </div>
                                            </div>
                                            <Button size="sm" variant="outline" className="ml-auto text-blue-600 hover:text-blue-700 hover:bg-blue-50 shrink-0" onClick={() => router.push(`/admin/users/${relations.parent.id}`)}>
                                                Profilə Bax
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {relations.teacher && (
                                    <div className="mt-4">
                                        <h4 className="text-sm font-medium text-slate-500 mb-2">Sinif Rəhbəri</h4>
                                        <div className="flex items-center gap-3 p-3 border rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors">
                                            <div className="h-9 w-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
                                                {relations.teacher.firstName?.[0] || 'M'}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="font-medium text-slate-900 truncate">{relations.teacher.firstName} {relations.teacher.lastName}</div>
                                                <div className="text-xs text-slate-500 truncate">Müəllim</div>
                                            </div>
                                            <Button size="sm" variant="outline" className="ml-auto text-blue-600 hover:text-blue-700 hover:bg-blue-50 shrink-0" onClick={() => router.push(`/admin/users/${relations.teacher.id}`)}>
                                                Profilə Bax
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {(!relations.children || relations.children.length === 0) && !relations.parent && !relations.teacher && (
                            <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-lg text-center text-slate-400 italic text-sm">
                                Heç bir əlaqəli şəxs (valideyn və ya övlad) tapılmadı
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
