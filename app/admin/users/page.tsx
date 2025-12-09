'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Search, Loader2, Eye } from 'lucide-react'
import Link from 'next/link'

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")

    useEffect(() => {
        async function fetchUsers() {
            try {
                const res = await fetch('/api/admin/users')
                const data = await res.json()
                if (data.success) {
                    setUsers(data.users)
                } else if (Array.isArray(data)) {
                    // Check if API returned array directly
                    setUsers(data)
                }
            } catch (err) {
                console.error("Failed to load users", err)
            } finally {
                setLoading(false)
            }
        }
        fetchUsers()
    }, [])

    const filteredUsers = users.filter(u =>
        u.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        u.lastName?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    )

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
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">İstifadəçilər</h2>
                <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Axtar..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Ad Soyad</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Rol</TableHead>
                                <TableHead>Məktəb / Region</TableHead>
                                <TableHead className="text-right">Əməliyyatlar</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-500" />
                                    </TableCell>
                                </TableRow>
                            ) : filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">İstifadəçi tapılmadı</TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.firstName} {user.lastName}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                                        <TableCell>{user.school || "-"} / {user.region || "-"}</TableCell>
                                        <TableCell className="text-right">
                                            <Link href={`/admin/users/${user.id}`}>
                                                <Button size="sm" variant="ghost">
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    Bax
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
