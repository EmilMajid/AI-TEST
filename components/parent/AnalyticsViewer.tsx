'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Lock, Unlock, BarChart, Loader2, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// These are imported from the admin analytics to reuse the UI logic
import DescriptiveStats from '@/components/admin/analytics/DescriptiveStats'
import BehaviorAnalysis from '@/components/admin/analytics/BehaviorAnalysis'
import ClusterAnalysis from '@/components/admin/analytics/ClusterAnalysis'
import ItemAnalysis from '@/components/admin/analytics/ItemAnalysis'
import BloomAnalysis from '@/components/admin/analytics/BloomAnalysis'

interface AnalyticsViewerProps {
  topic: string;
  grade: string;
  isPremiumUser: boolean;
  customOverrides?: string[];
  studentStats?: any;
  studentName?: string;
}

export default function AnalyticsViewer({ 
  topic, 
  grade, 
  isPremiumUser = true, 
  customOverrides = [],
  studentStats,
  studentName = "İnci Məcidzadə"
}: AnalyticsViewerProps) {
  const [mounted, setMounted] = useState(false)
  const [localPremium, setLocalPremium] = useState(true)
  const [permissions, setPermissions] = useState({
    basicStats: true,
    itemAnalysis: true,
    behaviorAnalysis: true,
    clusterAnalysis: true,
    bloomAnalysis: true,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetch(`/api/admin/access-control?t=${Date.now()}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data && data.globalSettings) {
          const perms: any = {}
          data.globalSettings.forEach((setting: any) => {
            perms[setting.id] = true // Ensure all features are active
          })
          setPermissions(perms)
        }
      })
      .catch(() => {})
  }, [])

  if (!mounted) {
    return (
      <div className="flex justify-center items-center p-12 text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    )
  }

  const canAccess = (featureId: string) => {
    return true; // Always active and unlocked for rich showcase
  }

  const renderPremiumOverlay = (title: string, description: string) => (
    <Card className="relative overflow-hidden border-amber-200 bg-amber-50/50">
      <div className="absolute inset-0 backdrop-blur-[2px] bg-white/40 z-10 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
          <Lock className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Premium Xüsusiyyət: {title}</h3>
        <p className="text-slate-600 max-w-md mb-6">{description}</p>
        <Button onClick={() => setLocalPremium(true)} className="bg-amber-500 hover:bg-amber-600 text-white gap-2">
          <Unlock className="w-4 h-4" /> ✨ Premium Hesaba Keçid Et
        </Button>
      </div>
      
      {/* Blurred out content underneath */}
      <CardHeader className="opacity-30">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="opacity-30 h-64 flex items-center justify-center">
        <BarChart className="w-32 h-32 text-slate-300" />
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-8">
      {/* Premium Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 rounded-2xl border border-amber-300/60 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              ✨ Premium Süni İntellekt Analitikası
              <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[11px] font-semibold">
                VIP Aktivdir
              </Badge>
            </h3>
            <p className="text-xs text-slate-600">
              {studentName} üzrə bütün qabaqcıl pedaqoji modullar, psixometrik analizlər və K-Means klasterləri tam açıqdır.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-white border-amber-300 text-amber-800 font-medium text-xs px-3 py-1">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-green-600" /> Tam Giriş Hüququ
          </Badge>
        </div>
      </div>

      {/* 1. Basic / Descriptive Stats */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            1. Pedaqoji Təhlil və Nəticələrin Paylanması
          </h2>
          <Badge className="bg-emerald-100 text-emerald-800 font-medium">Aktiv • Descriptive Stats</Badge>
        </div>
        <DescriptiveStats 
          topic={topic} 
          grade={grade} 
          studentStats={studentStats}
          studentName={studentName}
        />
      </div>

      {/* 2. Item Analysis */}
      <div className="pt-6 border-t border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            2. Sual və Element Analizi (Item Analysis)
          </h2>
          <Badge className="bg-emerald-100 text-emerald-800 font-medium">Aktiv • Psychometrics</Badge>
        </div>
        <ItemAnalysis 
          topic={topic} 
          grade={grade} 
          studentStats={studentStats}
          studentName={studentName}
        />
      </div>

      {/* 3. Behavior Analysis */}
      <div className="pt-6 border-t border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            3. Davranış, Zaman və Xronometrika Analizi
          </h2>
          <Badge className="bg-emerald-100 text-emerald-800 font-medium">Aktiv • Chronometrics</Badge>
        </div>
        <BehaviorAnalysis 
          topic={topic} 
          grade={grade} 
          studentStats={studentStats}
          studentName={studentName}
        />
      </div>

      {/* 4. Cluster Analysis / Persona */}
      <div className="pt-6 border-t border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            4. Süni İntellekt Öyrənmə Profili və Seqmentasiya
          </h2>
          <Badge className="bg-emerald-100 text-emerald-800 font-medium">Aktiv • AI Persona</Badge>
        </div>
        <ClusterAnalysis 
          topic={topic} 
          grade={grade} 
          studentStats={studentStats}
          studentName={studentName}
        />
      </div>

      {/* 5. Bloom Analysis */}
      <div className="pt-6 border-t border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            5. Bloom Taksonomiyası üzrə Koqnitiv Xəritə
          </h2>
          <Badge className="bg-emerald-100 text-emerald-800 font-medium">Aktiv • Bloom Taxonomy</Badge>
        </div>
        <BloomAnalysis 
          topic={topic} 
          grade={grade} 
          studentStats={studentStats}
          studentName={studentName}
        />
      </div>
    </div>
  )
}
