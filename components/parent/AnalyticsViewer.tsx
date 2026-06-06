'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Lock, Unlock, BarChart, Loader2 } from 'lucide-react'
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
}

export default function AnalyticsViewer({ topic, grade, isPremiumUser, customOverrides = [] }: AnalyticsViewerProps) {
  const [permissions, setPermissions] = useState({
    basicStats: true,
    itemAnalysis: false,
    behaviorAnalysis: false,
    clusterAnalysis: false,
    bloomAnalysis: false,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/admin/access-control?t=${Date.now()}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data && data.globalSettings) {
          const perms: any = {}
          data.globalSettings.forEach((setting: any) => {
            // setting.isFree = true means free user CAN access it
            perms[setting.id] = setting.isFree
          })
          setPermissions(perms)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const renderPremiumOverlay = (title: string, description: string) => (
    <Card className="relative overflow-hidden border-amber-200 bg-amber-50/50">
      <div className="absolute inset-0 backdrop-blur-[2px] bg-white/40 z-10 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
          <Lock className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Premium Xüsusiyyət: {title}</h3>
        <p className="text-slate-600 max-w-md mb-6">{description}</p>
        <Button className="bg-amber-500 hover:bg-amber-600 text-white gap-2">
          <Unlock className="w-4 h-4" /> Premium Hesaba Keçid Et
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

  const canAccess = (featureId: string, isPremiumFeature: boolean) => {
    if (isPremiumUser) return true; // Premium user sees everything
    if (customOverrides.includes(featureId)) return true; // User specifically has access
    return !isPremiumFeature; // Free user sees only free features
  }

  return (
    <div className="space-y-8">
      {/* Basic Stats */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-2xl font-bold">Övladınızın Nəticələri</h2>
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Ödənişsiz Səviyyə</Badge>
        </div>
        {canAccess('basicStats', !permissions.basicStats) ? (
          <DescriptiveStats topic={topic} grade={grade} />
        ) : (
          renderPremiumOverlay("İlkin Təhlil", "Övladınızın topladığı bal və ümumi statistikaları görmək üçün premium hesaba keçid edin.")
        )}
      </div>

      {/* Item Analysis */}
      <div className="pt-6 border-t">
        <h2 className="text-2xl font-bold mb-4">Sual (Element) Analizi</h2>
        {canAccess('itemAnalysis', !permissions.itemAnalysis) ? (
          <ItemAnalysis topic={topic} grade={grade} />
        ) : (
          renderPremiumOverlay(
            "Sual Analizi", 
            "Övladınızın hansı çətinlik səviyyəsindəki suallarda zəif olduğunu və hansı cavablarda yanıldığını öyrənin."
          )
        )}
      </div>

      {/* Behavior Analysis */}
      <div className="pt-6 border-t">
        <h2 className="text-2xl font-bold mb-4">Davranış və Zaman Analizi</h2>
        {canAccess('behaviorAnalysis', !permissions.behaviorAnalysis) ? (
          <BehaviorAnalysis topic={topic} grade={grade} />
        ) : (
          renderPremiumOverlay(
            "Zaman və Davranış", 
            "Övladınızın hansı suallarda çox vaxt itirdiyini və diqqətinin harada yayındığını görmək üçün hesabınızı yüksəldin."
          )
        )}
      </div>

      {/* Cluster Analysis / Persona */}
      <div className="pt-6 border-t">
        <h2 className="text-2xl font-bold mb-4">Süni İntellekt Öyrənmə Profili</h2>
        {canAccess('clusterAnalysis', !permissions.clusterAnalysis) ? (
          <ClusterAnalysis topic={topic} grade={grade} />
        ) : (
          renderPremiumOverlay(
            "Öyrənmə Profili", 
            "Övladınızın 'Sürətli və Dəqiq' yoxsa 'Tələskən' kimi hansı öyrənmə tipinə aid olduğunu öyrənin."
          )
        )}
      </div>

      {/* Bloom Analysis */}
      <div className="pt-6 border-t">
        <h2 className="text-2xl font-bold mb-4">Bloom Taksonomiyası</h2>
        {canAccess('bloomAnalysis', !permissions.bloomAnalysis) ? (
          <BloomAnalysis topic={topic} grade={grade} />
        ) : (
          renderPremiumOverlay(
            "Koqnitiv Səviyyə (Bloom)", 
            "Tələbənin əzbərçilik yoxsa tənqidi analiz səviyyəsində güclü olduğunu öyrənmək üçün hesabınızı yüksəldin."
          )
        )}
      </div>
    </div>
  )
}
