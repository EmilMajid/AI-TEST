"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, Activity, ShieldCheck, Database, CheckCircle2 } from "lucide-react"

export function AdminStats() {
    const [analytics, setAnalytics] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch("/api/admin/analytics")
                const data = await res.json()
                if (data.success && data.analytics) {
                    setAnalytics(data.analytics)
                }
            } catch (err) {
                console.error("Failed to fetch admin stats:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    const totalUsers = analytics?.users?.total ?? "..."
    const realUsers = analytics?.users?.realCount ?? "..."
    const totalQuestions = analytics?.testBank?.totalQuestions ?? "..."
    const coverageRate = analytics?.testBank?.coverageRate ? `${analytics.testBank.coverageRate}%` : "..."
    const completedTopics = analytics?.testBank?.completedTopics ?? "..."
    const totalTopics = analytics?.testBank?.totalTopics ?? "..."

    const stats = [
        {
            title: "Cəmi İstifadəçi",
            value: totalUsers,
            subtitle: `${realUsers} real qeydiyyat`,
            icon: Users,
            color: "text-blue-500",
        },
        {
            title: "Test Bankı Sualları",
            value: totalQuestions,
            subtitle: `${completedTopics} / ${totalTopics} mövzu tamamlandı`,
            icon: Database,
            color: "text-emerald-500",
        },
        {
            title: "Mövzu Əhatəliliyi",
            value: coverageRate,
            subtitle: "Dərslik mövzuları üzrə",
            icon: CheckCircle2,
            color: "text-purple-500",
        },
        {
            title: "Sistem Statusu",
            value: analytics?.systemStatus?.uptime || "99.98%",
            subtitle: "Bütün xidmətlər aktivdir",
            icon: ShieldCheck,
            color: "text-green-500",
        },
    ]

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <Card key={stat.title} className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-700">{stat.title}</CardTitle>
                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                        <p className="text-xs text-slate-500 mt-1">{stat.subtitle}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
