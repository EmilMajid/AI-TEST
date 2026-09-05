'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Save, Lock, Unlock } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function MonetizationControl({ topic, grade }: { topic: string, grade: string }) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  
  // State representing what data is paid/premium (true = paid/premium, false = free)
  const [permissions, setPermissions] = useState({
    basicStats: false, // false = free, true = paid
    itemAnalysis: true, // paid by default
    behaviorAnalysis: true, // paid by default
    clusterAnalysis: true, // paid by default
    detailedReportExport: true,
  })

  // Hydrate from localStorage and API on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('testai_monetization_rules')
        if (cached) {
          const parsed = JSON.parse(cached)
          setPermissions(prev => ({ ...prev, ...parsed }))
        }
      } catch (e) {}
    }

    fetch(`/api/admin/access-control?t=${Date.now()}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.globalSettings)) {
          const apiPerms: any = {}
          data.globalSettings.forEach((s: any) => {
            if (s.id in permissions) {
              // isFree === true means not paid (false in permissions)
              apiPerms[s.id] = !s.isFree
            }
          })
          setPermissions(prev => {
            const merged = { ...prev, ...apiPerms }
            if (typeof window !== 'undefined') {
              const cached = localStorage.getItem('testai_monetization_rules')
              if (cached) {
                return { ...merged, ...JSON.parse(cached) }
              }
            }
            return merged
          })
        }
      })
      .catch(() => {})
  }, [])

  const handleToggle = (key: keyof typeof permissions) => {
    setPermissions(prev => {
      const updated = {
        ...prev,
        [key]: !prev[key]
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('testai_monetization_rules', JSON.stringify(updated))
      }
      return updated
    })
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('testai_monetization_rules', JSON.stringify(permissions))
      }

      // Also map to globalSettings in access-control API
      const settingsPayload = Object.entries(permissions).map(([id, isPaid]) => ({
        id,
        isFree: !isPaid
      }))

      await fetch('/api/admin/access-control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'global',
          globalSettings: settingsPayload
        })
      }).catch(() => {})

      toast({
        title: 'Uğurlu! ✅',
        description: 'Ödənişli/Ödənişsiz siyasət (Monetization rules) müvəffəqiyyətlə yadda saxlanıldı.',
      })
    } catch (e) {
      toast({
        title: 'Yadda saxlanıldı (Lokal) ✅',
        description: 'Qaydalar brauzerdə saxlanıldı.',
      })
    } finally {
      setLoading(false)
    }
  }

  const renderSettingRow = (key: keyof typeof permissions, title: string, description: string) => (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-white">
      <div className="space-y-0.5">
        <div className="flex items-center gap-2">
          <span className="font-medium text-base">{title}</span>
          {permissions[key] ? (
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Premium
            </Badge>
          ) : (
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center gap-1">
              <Unlock className="w-3 h-3" /> Ödənişsiz (Free)
            </Badge>
          )}
        </div>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      <div className="flex items-center space-x-2">
        <Switch 
          checked={permissions[key]} 
          onCheckedChange={() => handleToggle(key)} 
        />
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ödənişli Xidmət İdarəetməsi (Monetization & Access Control)</CardTitle>
          <CardDescription>
            Valideynlərin və digər istifadəçilərin (Premium abunəçilər istisna olmaqla) hansı test analitikası məlumatlarını görə biləcəyini təyin edin.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 bg-slate-50 p-6">
          
          {renderSettingRow(
            'basicStats', 
            'İlkin Təhlil (Descriptive Statistics)', 
            'Tələbənin topladığı bal, ümumi ortalama, doğru və səhv cavabların nisbəti.'
          )}

          {renderSettingRow(
            'itemAnalysis', 
            'Element Analizi (Item Analysis)', 
            'Tələbənin çətin və ya problemli suallarda göstərdiyi nəticə, ayıredicilik indeksi müqayisəsi.'
          )}

          {renderSettingRow(
            'behaviorAnalysis', 
            'Zaman və Davranış (Behavior)', 
            'Hər suala sərf edilən zaman, tələsmə və ya tərk etmə göstəriciləri.'
          )}

          {renderSettingRow(
            'clusterAnalysis', 
            'Öyrənmə Profili (Clustering Persona)', 
            'Süni intellekt tərəfindən təyin edilmiş "Sürətli və Dəqiq", "Tələskən" kimi psixoloji-tədris profilləri.'
          )}

          <div className="pt-4 flex justify-end">
            <Button onClick={handleSave} disabled={loading} className="gap-2">
              {loading ? <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <Save className="w-4 h-4" />}
              Dəyişiklikləri Yadda Saxla
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
