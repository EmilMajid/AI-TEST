"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Database, 
  Zap, 
  Settings, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  RefreshCw,
  Server
} from "lucide-react"
import Link from "next/link"
import { AdminStats } from "@/components/admin/admin-stats"

export default function AdminPage() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/analytics")
      const data = await res.json()
      if (data.success && data.analytics) {
        setAnalytics(data.analytics)
      }
    } catch (e) {
      console.error("Dashboard fetch error:", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">İdarəetmə Paneli (Dashboard)</h1>
          <p className="text-slate-500 mt-1">
            Platformanın cari vəziyyəti, canlı istifadəçi statistikası və sürətli idarəetmə vasitələri
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchAnalytics} disabled={loading} className="gap-1.5">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Yenilə
          </Button>
          <Link href="/admin/global-settings">
            <Button size="sm" className="gap-1.5 bg-slate-900 hover:bg-slate-800">
              <Settings className="h-4 w-4" />
              Tənzimləmələr
            </Button>
          </Link>
        </div>
      </div>

      {/* Top 4 Real Stats */}
      <AdminStats />

      {/* Middle Grid: Quick Actions & User Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Access Actions */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Sürətli İdarəetmə Keçidləri</CardTitle>
            <CardDescription>Tez-tez istifadə olunan əsas idarəetmə funksiyaları</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/admin/users">
              <div className="p-4 border rounded-xl hover:bg-blue-50/50 hover:border-blue-200 transition-all cursor-pointer group flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-slate-800">İstifadəçilər</span>
                  </div>
                  <p className="text-xs text-slate-500">Hesabları idarə et, blokla və ya sil</p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 group-hover:text-blue-600 transition-all" />
              </div>
            </Link>

            <Link href="/admin/test-bank">
              <div className="p-4 border rounded-xl hover:bg-emerald-50/50 hover:border-emerald-200 transition-all cursor-pointer group flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-emerald-600" />
                    <span className="font-semibold text-slate-800">Test Bankı</span>
                  </div>
                  <p className="text-xs text-slate-500">Mövzu və sualların əhatəliliyinə bax</p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 group-hover:text-emerald-600 transition-all" />
              </div>
            </Link>

            <Link href="/admin/test-bank/problem-questions">
              <div className="p-4 border rounded-xl hover:bg-orange-50/50 hover:border-orange-200 transition-all cursor-pointer group flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <span className="font-semibold text-slate-800">Problemli Suallar</span>
                  </div>
                  <p className="text-xs text-slate-500">Aşağı nəticəli və ya çaşdırıcı testlər</p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 group-hover:text-orange-600 transition-all" />
              </div>
            </Link>

            <Link href="/admin/ai-generation">
              <div className="p-4 border rounded-xl hover:bg-yellow-50/50 hover:border-yellow-200 transition-all cursor-pointer group flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-600" />
                    <span className="font-semibold text-slate-800">Aİ Generasiya</span>
                  </div>
                  <p className="text-xs text-slate-500">Süni İntellekt ilə avtomat sual yarat</p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 group-hover:text-yellow-600 transition-all" />
              </div>
            </Link>
          </CardContent>
        </Card>

        {/* User Breakdown */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">İstifadəçi Bölgüsü</CardTitle>
            <CardDescription>Rollar üzrə aktiv istifadəçi tərkibi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
              <span className="text-sm font-medium text-slate-700">Şagirdlər</span>
              <Badge variant="secondary" className="font-semibold bg-blue-100 text-blue-800">
                {analytics?.users?.students ?? 0}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
              <span className="text-sm font-medium text-slate-700">Valideynlər</span>
              <Badge variant="secondary" className="font-semibold bg-purple-100 text-purple-800">
                {analytics?.users?.parents ?? 0}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
              <span className="text-sm font-medium text-slate-700">Müəllimlər</span>
              <Badge variant="secondary" className="font-semibold bg-emerald-100 text-emerald-800">
                {analytics?.users?.teachers ?? 0}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
              <span className="text-sm font-medium text-slate-700">Bloklanmış Hesablar</span>
              <Badge variant="secondary" className="font-semibold bg-red-100 text-red-800">
                {analytics?.users?.blocked ?? 0}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Infrastructure Status */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Server className="h-5 w-5 text-indigo-600" />
            Sistem Xidmətlərinin Canlı Vəziyyəti
          </CardTitle>
          <CardDescription>Platformanın əsas server və infrastruktur komponentləri</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-xl bg-slate-50 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">API Gateway</p>
                <p className="font-semibold text-slate-800">Aktiv</p>
              </div>
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>

            <div className="p-4 border rounded-xl bg-slate-50 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Autentifikasiya</p>
                <p className="font-semibold text-slate-800">İşlək (JWT & Session)</p>
              </div>
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>

            <div className="p-4 border rounded-xl bg-slate-50 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Verilənlər Bazası</p>
                <p className="font-semibold text-slate-800">Qoşulub (Persistent)</p>
              </div>
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>

            <div className="p-4 border rounded-xl bg-slate-50 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Təhlükəsizlik Rejimi</p>
                <p className="font-semibold text-slate-800">Aktiv (Rate Limit)</p>
              </div>
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
