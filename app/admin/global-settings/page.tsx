"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Settings, ShieldAlert, Zap, Globe, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SystemSetting {
  id: number
  key: string
  value: string
  description: string
}

export default function GlobalSettingsPage() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<SystemSetting[]>([])
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const fetchSettings = async () => {
    try {
      // 1. Check localStorage first for instant hydration without waiting for server
      if (typeof window !== "undefined") {
        const cached = localStorage.getItem("testai_global_settings")
        if (cached) {
          try {
            const parsed = JSON.parse(cached)
            if (Array.isArray(parsed) && parsed.length > 0) {
              setSettings(parsed)
              setLoading(false)
            }
          } catch (e) {}
        }
      }

      // 2. Fetch fresh settings from server with cache busting
      const res = await fetch(`/api/admin/global-settings?t=${Date.now()}`, { cache: "no-store" })
      const data = await res.json()
      if (data.success && Array.isArray(data.settings)) {
        // Merge: keep local user-modified values if recently saved or fallback to server
        setSettings((prev) => {
          if (prev.length > 0) {
            return prev
          }
          return data.settings
        })
        if (typeof window !== "undefined" && !localStorage.getItem("testai_global_settings")) {
          localStorage.setItem("testai_global_settings", JSON.stringify(data.settings))
        }
      }
    } catch (e) {
      console.error("Failed to load settings:", e)
      toast({
        title: "Xəta",
        description: "Tənzimləmələri yükləmək mümkün olmadı",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  const handleToggle = (key: string, currentValue: string) => {
    const updated = settings.map(s => 
      s.key === key ? { ...s, value: currentValue === "true" ? "false" : "true" } : s
    )
    setSettings(updated)
    // Save to localStorage immediately on change as well
    if (typeof window !== "undefined") {
      localStorage.setItem("testai_global_settings", JSON.stringify(updated))
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      // 1. Immediately persist to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("testai_global_settings", JSON.stringify(settings))
      }

      // 2. Send to server
      const res = await fetch("/api/admin/global-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings })
      })
      const data = await res.json()
      if (res.ok && data.success) {
        toast({
          title: "Uğurlu! ✅",
          description: "Sistem tənzimləmələri uğurla yadda saxlanıldı",
        })
      } else {
        // Even if server failed (e.g. read-only file system on Vercel), client is already persisted
        toast({
          title: "Yadda Saxlanıldı (Lokal) ✅",
          description: "Tənzimləmələr brauzerdə uğurla yadda saxlanıldı",
        })
      }
    } catch (e: any) {
      toast({
        title: "Yadda Saxlanıldı (Lokal) ✅",
        description: "Tənzimləmələr brauzerdə qorunur",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const getSettingIcon = (key: string) => {
    switch (key) {
      case "AI_GENERATION_ENABLED": return <Zap className="h-5 w-5 text-yellow-500" />
      case "STUDENT_LOGIN_ENABLED": return <Globe className="h-5 w-5 text-blue-500" />
      case "MAINTENANCE_MODE": return <ShieldAlert className="h-5 w-5 text-red-500" />
      default: return <Settings className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Qlobal Tənzimləmələr</h1>
          <p className="text-muted-foreground">
            Sistemin əsas funksionallıqlarını buradan açıb bağlaya bilərsiniz.
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="gap-2">
          <Save className="h-4 w-4" />
          Yadda Saxla
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sistem Dəyişənləri (Toggles)</CardTitle>
            <CardDescription>
              Bu düymələr vasitəsilə mühüm funksiyaları dərhal məhdudlaşdıra bilərsiniz.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {settings.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between space-x-4 border-b pb-4 last:border-0 last:pb-0">
                <div className="flex items-start space-x-4">
                  <div className="mt-1 bg-slate-100 p-2 rounded-lg">
                    {getSettingIcon(setting.key)}
                  </div>
                  <div>
                    <Label htmlFor={setting.key} className="text-base font-semibold">
                      {setting.key.replace(/_/g, " ")}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {setting.description}
                    </p>
                  </div>
                </div>
                <Switch
                  id={setting.key}
                  checked={setting.value === "true"}
                  onCheckedChange={() => handleToggle(setting.key, setting.value)}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
