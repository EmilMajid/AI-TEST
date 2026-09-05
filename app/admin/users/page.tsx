'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { Search, Loader2, Eye, Trash2, Lock, Unlock, AlertTriangle, ShieldAlert } from 'lucide-react'
import Link from 'next/link'
import { getUserUniqueId } from '@/lib/profile-utils'

export default function AdminUsersPage() {
    const { toast } = useToast()
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [sourceFilter, setSourceFilter] = useState<"all" | "real" | "mock">("all")
    const [actionLoading, setActionLoading] = useState<string | number | null>(null)

    // Modals state
    const [confirmDeleteUser, setConfirmDeleteUser] = useState<any | null>(null)
    const [confirmBlockUser, setConfirmBlockUser] = useState<any | null>(null)


    async function fetchUsers() {
        try {
            // Check if there are local registered users / links in localStorage to sync to server
            let localRegUsers: any[] = []
            let localLinks: any[] = []
            try {
                localRegUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
                localLinks = JSON.parse(localStorage.getItem('all_student_links') || '[]')
            } catch (e) {}

            if (localRegUsers.length > 0 || localLinks.length > 0) {
                fetch('/api/admin/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        users: localRegUsers,
                        links: localLinks,
                    })
                }).catch(() => {})
            }

            const res = await fetch('/api/admin/users')
            const data = await res.json()
            let serverUsers = (data.success && Array.isArray(data.users)) ? data.users : (Array.isArray(data) ? data : [])

            // Merge any local registered users so newly created students show up immediately
            if (localRegUsers.length > 0) {
                const userMap = new Map<string, any>()
                serverUsers.forEach((u: any) => {
                    const key = (u.email || String(u.id)).toLowerCase()
                    userMap.set(key, u)
                })
                localRegUsers.forEach((lu: any) => {
                    const key = (lu.email || String(lu.id)).toLowerCase()
                    if (!userMap.has(key)) {
                        userMap.set(key, {
                            ...lu,
                            source: "real",
                            status: lu.status || "active",
                            isBlocked: lu.isBlocked || false,
                            uniqueId: lu.uniqueId || getUserUniqueId(lu),
                        })
                    }
                })
                serverUsers = Array.from(userMap.values())
            }

            setUsers(serverUsers)
        } catch (err) {
            console.error("Failed to load users", err)
            toast({
                title: "Xəta",
                description: "İstifadəçilər siyahısı yüklənərkən xəta baş verdi",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const handleExecuteBlock = async (user: any, block: boolean) => {
        try {
            setActionLoading(user.id)
            const res = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: user.id,
                    action: block ? 'block' : 'unblock',
                    isBlocked: block
                })
            })
            const data = await res.json()

            if (res.ok && data.success) {
                toast({
                    title: block ? "İstifadəçi Bloklandı 🔒" : "İstifadəçi Blokdan Çıxarıldı 🔓",
                    description: data.message || (block ? "İstifadəçi uğurla bloklandı" : "İstifadəçi uğurla aktivləşdirildi")
                })
                // Update local state immediately
                setUsers(prev => prev.map(u => {
                    if (String(u.id) === String(user.id) || (u.email && u.email.toLowerCase() === user.email?.toLowerCase())) {
                        return {
                            ...u,
                            isBlocked: block,
                            status: block ? 'blocked' : 'active'
                        }
                    }
                    return u
                }))
            } else {
                throw new Error(data.error || "Əməliyyat uğursuz oldu")
            }
        } catch (err: any) {
            toast({
                title: "Xəta",
                description: err.message || "Əməliyyat icra olunarkən xəta baş verdi",
                variant: "destructive"
            })
        } finally {
            setActionLoading(null)
            setConfirmBlockUser(null)
        }
    }

    const handleExecuteDelete = async () => {
        if (!confirmDeleteUser) return
        const user = confirmDeleteUser

        try {
            setActionLoading(user.id)
            const res = await fetch(`/api/admin/users?id=${encodeURIComponent(user.id)}`, {
                method: 'DELETE'
            })
            const data = await res.json()

            if (res.ok && data.success) {
                toast({
                    title: "İstifadəçi Silindi 🗑️",
                    description: data.message || "İstifadəçi sistemdən tamamilə silindi"
                })
                // Remove from local list immediately
                setUsers(prev => prev.filter(u => String(u.id) !== String(user.id) && u.email?.toLowerCase() !== user.email?.toLowerCase()))
            } else {
                throw new Error(data.error || "İstifadəçi silinmədi")
            }
        } catch (err: any) {
            toast({
                title: "Xəta",
                description: err.message || "İstifadəçi silinərkən xəta baş verdi",
                variant: "destructive"
            })
        } finally {
            setActionLoading(null)
            setConfirmDeleteUser(null)
        }
    }

    const filteredUsers = users.filter(u => {
        const query = search.toLowerCase().trim()
        const fullName = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase()
        const email = (u.email || '').toLowerCase()
        const uniqueId = (u.uniqueId || '').toLowerCase()
        const school = (u.school || '').toLowerCase()
        const matchesSearch = fullName.includes(query) || email.includes(query) || uniqueId.includes(query) || school.includes(query)

        // Source filtr
        let matchesSource = true
        if (sourceFilter === "real") {
            matchesSource = u.source === "real" || u.source === "admin"
        } else if (sourceFilter === "mock") {
            matchesSource = u.source === "mock" || (!u.source && !u.email?.endsWith("@testai.az"))
        }

        return matchesSearch && matchesSource
    })

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin': return <Badge className="bg-red-600 hover:bg-red-700">Admin</Badge>
            case 'director': return <Badge className="bg-purple-600 hover:bg-purple-700">Direktor</Badge>
            case 'teacher': return <Badge className="bg-blue-600 hover:bg-blue-700">Müəllim</Badge>
            case 'student': return <Badge className="bg-green-600 hover:bg-green-700">Şagird</Badge>
            case 'parent': return <Badge className="bg-orange-600 hover:bg-orange-700">Valideyn</Badge>
            default: return <Badge variant="outline">{role}</Badge>
        }
    }

    const getSourceBadge = (user: any) => {
        if (user.source === "admin") return null // admin-lər üçün ayrıca badge lazım deyil
        if (user.source === "real") {
            return <span className="ml-1 text-[10px] bg-emerald-100 text-emerald-700 border border-emerald-300 px-1.5 py-0.5 rounded-full font-medium">Real</span>
        }
        return <span className="ml-1 text-[10px] bg-slate-100 text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded-full font-medium">Demo</span>
    }

    const isRootAdmin = (user: any) => {
        return user.id === 'admin-main' || user.email === 'admin@edu.az' || user.role === 'admin'
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">İstifadəçilər</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Sistemdəki bütün profillərin idarə edilməsi, bloklanması və silinməsi
                    </p>
                </div>
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Ad, soyad, email və ya ID..."
                        className="pl-9 bg-white"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Source filtr düymələri */}
            <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-slate-500 font-medium mr-1">Filtr:</span>
                <Button
                    size="sm"
                    variant={sourceFilter === "all" ? "default" : "outline"}
                    className={sourceFilter === "all" ? "bg-slate-800 text-white hover:bg-slate-900" : "border-slate-300 text-slate-700"}
                    onClick={() => setSourceFilter("all")}
                >
                    Hamısı
                    <span className="ml-1.5 text-[11px] opacity-70">({users.length})</span>
                </Button>
                <Button
                    size="sm"
                    variant={sourceFilter === "real" ? "default" : "outline"}
                    className={sourceFilter === "real" ? "bg-emerald-600 text-white hover:bg-emerald-700" : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"}
                    onClick={() => setSourceFilter("real")}
                >
                    <span className="h-1.5 w-1.5 rounded-full bg-current mr-1.5 opacity-80" />
                    Yalnız Real
                    <span className="ml-1.5 text-[11px] opacity-70">({users.filter(u => u.source === "real" || u.source === "admin").length})</span>
                </Button>
                <Button
                    size="sm"
                    variant={sourceFilter === "mock" ? "default" : "outline"}
                    className={sourceFilter === "mock" ? "bg-slate-500 text-white hover:bg-slate-600" : "border-slate-300 text-slate-500 hover:bg-slate-50"}
                    onClick={() => setSourceFilter("mock")}
                >
                    Yalnız Demo
                    <span className="ml-1.5 text-[11px] opacity-70">({users.filter(u => u.source === "mock" || (!u.source && !u.email?.endsWith("@testai.az"))).length})</span>
                </Button>
            </div>

            <Card className="shadow-sm border-slate-200">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/80">
                                <TableHead className="font-semibold">Ad Soyad</TableHead>
                                <TableHead className="font-semibold">Email / Şagird ID</TableHead>
                                <TableHead className="font-semibold">Rol</TableHead>
                                <TableHead className="font-semibold">Status</TableHead>
                                <TableHead className="font-semibold">Məktəb / Region</TableHead>
                                <TableHead className="text-right font-semibold pr-6">Əməliyyatlar</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-2">
                                            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                                            <span className="text-sm text-muted-foreground">İstifadəçilər yüklənir...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                        Axtarışa uyğun istifadəçi tapılmadı
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers.map((user) => {
                                    const isBlocked = Boolean(user.isBlocked || user.status === 'blocked')
                                    const isProtected = isRootAdmin(user)

                                    return (
                                        <TableRow
                                            key={user.id}
                                            className={isBlocked ? "bg-red-50/40 hover:bg-red-50/60 transition-colors" : "hover:bg-slate-50/70 transition-colors"}
                                        >
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <span>{user.firstName} {user.lastName}</span>
                                                    {getSourceBadge(user)}
                                                    {user.class && (
                                                        <span className="text-[11px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                                                            {user.class}-ci sinif
                                                        </span>
                                                    )}
                                                </div>
                                                {user.linkedParent && (
                                                    <div className="text-[11px] text-slate-500 font-normal mt-0.5 flex items-center gap-1">
                                                        <span className="text-slate-400">Valideyn:</span>
                                                        <Link href={`/admin/users/${user.linkedParent.id}`} className="text-blue-600 hover:underline font-medium">
                                                            {user.linkedParent.name}
                                                        </Link>
                                                        {user.linkedParent.email && (
                                                            <span className="text-slate-400 font-mono text-[10px]">({user.linkedParent.email})</span>
                                                        )}
                                                    </div>
                                                )}
                                                {user.linkedChildren && user.linkedChildren.length > 0 && (
                                                    <div className="text-[11px] text-slate-500 font-normal mt-0.5 flex items-center gap-1 flex-wrap">
                                                        <span className="text-slate-400">Övlad:</span>
                                                        {user.linkedChildren.map((child: any, idx: number) => (
                                                            <span key={child.id || idx}>
                                                                {idx > 0 && ", "}
                                                                <Link href={`/admin/users/${child.id}`} className="text-emerald-700 hover:underline font-medium">
                                                                    {child.name} {child.class ? `(${child.class}-ci sinif)` : ''}
                                                                </Link>
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col text-xs">
                                                    <span className="font-mono text-slate-900">{user.email || "-"}</span>
                                                    <span className="text-blue-600 font-mono text-[11px] font-semibold">{user.uniqueId || getUserUniqueId(user)}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{getRoleBadge(user.role || user.accountType)}</TableCell>
                                            <TableCell>
                                                {isBlocked ? (
                                                    <Badge variant="outline" className="bg-rose-100 text-rose-800 border-rose-200 gap-1 font-semibold">
                                                        <Lock className="h-3 w-3" />
                                                        Bloklanıb
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                                        Aktiv
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-slate-600 text-sm">
                                                {user.school || "-"} {user.region ? `• ${user.region}` : ""}
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    {/* Bax Button */}
                                                    <Link href={`/admin/users/${user.id}`}>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-8 px-2.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                            title="Profili göstər"
                                                        >
                                                            <Eye className="h-4 w-4 mr-1" />
                                                            Bax
                                                        </Button>
                                                    </Link>

                                                    {/* Blokla / Blokdan çıxart Button */}
                                                    {isBlocked ? (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-8 px-2.5 border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 font-medium"
                                                            onClick={() => handleExecuteBlock(user, false)}
                                                            disabled={actionLoading === user.id}
                                                            title="İstifadəçini blokdan çıxart"
                                                        >
                                                            {actionLoading === user.id ? (
                                                                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                                                            ) : (
                                                                <Unlock className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                                                            )}
                                                            Blokdan çıxart
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-8 px-2.5 border-amber-300 text-amber-700 hover:bg-amber-50 hover:text-amber-800 font-medium"
                                                            onClick={() => setConfirmBlockUser(user)}
                                                            disabled={actionLoading === user.id || isProtected}
                                                            title={isProtected ? "Admin hesabı bloklana bilməz" : "İstifadəçini blokla"}
                                                        >
                                                            <Lock className="h-3.5 w-3.5 mr-1 text-amber-600" />
                                                            Blokla
                                                        </Button>
                                                    )}

                                                    {/* Sil Button */}
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        className="h-8 px-2.5 bg-red-600 hover:bg-red-700 text-white font-medium"
                                                        onClick={() => setConfirmDeleteUser(user)}
                                                        disabled={actionLoading === user.id || isProtected}
                                                        title={isProtected ? "Admin hesabı silinə bilməz" : "İstifadəçini tamamilə sil"}
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                                                        Sil
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Confirmation Dialog for Block */}
            <Dialog open={!!confirmBlockUser} onOpenChange={(open) => !open && setConfirmBlockUser(null)}>
                <DialogContent className="sm:max-w-[460px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-amber-600">
                            <Lock className="h-5 w-5 text-amber-600" />
                            İstifadəçini Blokla
                        </DialogTitle>
                        <DialogDescription className="pt-2 text-slate-700">
                            <strong>{confirmBlockUser?.firstName} {confirmBlockUser?.lastName}</strong> ({confirmBlockUser?.email || confirmBlockUser?.uniqueId}) adlı istifadəçini bloklamaq istədiyinizdən əminsiniz?
                        </DialogDescription>
                    </DialogHeader>

                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 space-y-1">
                        <p className="font-semibold flex items-center gap-1">
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                            Nə baş verəcək:
                        </p>
                        <p>• İstifadəçi sayta daxil ola bilməyəcək və sistem girişinə icazə verilməyəcək.</p>
                        <p>• İstədiyiniz zaman &quot;Blokdan çıxart&quot; düyməsi ilə istifadəçini yenidən aktivləşdirə bilərsiniz.</p>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0 mt-2">
                        <Button
                            variant="outline"
                            onClick={() => setConfirmBlockUser(null)}
                            disabled={actionLoading !== null}
                        >
                            İmtina
                        </Button>
                        <Button
                            className="bg-amber-600 hover:bg-amber-700 text-white"
                            onClick={() => confirmBlockUser && handleExecuteBlock(confirmBlockUser, true)}
                            disabled={actionLoading !== null}
                        >
                            {actionLoading !== null ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Bəli, Blokla
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Confirmation Dialog for Delete */}
            <Dialog open={!!confirmDeleteUser} onOpenChange={(open) => !open && setConfirmDeleteUser(null)}>
                <DialogContent className="sm:max-w-[460px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <ShieldAlert className="h-5 w-5 text-red-600" />
                            İstifadəçini Tamamilə Sil
                        </DialogTitle>
                        <DialogDescription className="pt-2 text-slate-700">
                            <strong>{confirmDeleteUser?.firstName} {confirmDeleteUser?.lastName}</strong> ({confirmDeleteUser?.email || confirmDeleteUser?.uniqueId}) adlı istifadəçini tamamilə silmək istədiyinizdən əminsiniz?
                        </DialogDescription>
                    </DialogHeader>

                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 space-y-1">
                        <p className="font-semibold flex items-center gap-1">
                            <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
                            Diqqət: Bu əməliyyat geri qaytarıla bilməz!
                        </p>
                        <p>• İstifadəçinin bütün profili, əlaqələri və imtahan nəticələri daimi olaraq silinəcək.</p>
                        <p>• Əgər şagird valideynə bağlıdırsa, həmin bağlantı da ləğv olunacaq.</p>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0 mt-2">
                        <Button
                            variant="outline"
                            onClick={() => setConfirmDeleteUser(null)}
                            disabled={actionLoading !== null}
                        >
                            İmtina
                        </Button>
                        <Button
                            variant="destructive"
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={handleExecuteDelete}
                            disabled={actionLoading !== null}
                        >
                            {actionLoading !== null ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Bəli, Həmişəlik Sil
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
