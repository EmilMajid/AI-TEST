"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Lock, Sparkles, School, MapPin, Users, Loader2, CheckCircle2 } from "lucide-react"
import { getCurrentUser, updateUserData } from "@/lib/profile-utils"

const regionsList = [
  "Bakı", "Gəncə", "Sumqayıt", "Mingəçevir", "Naftalan", "Şirvan", "Şəki", "Yevlax",
  "Abşeron", "Ağcabədi", "Ağdam", "Ağdaş", "Ağstafa", "Ağsu", "Astara", "Balakən",
  "Bərdə", "Beyləqan", "Biləsuvar", "Cəbrayıl", "Cəlilabad", "Culfa", "Daşkəsən",
  "Füzuli", "Gədəbəy", "Goranboy", "Göyçay", "Göygöl", "Hacıqabul", "İmişli",
  "İsmayıllı", "Kəlbəcər", "Kürdəmir", "Laçın", "Lerik", "Masallı", "Neftçala",
  "Oğuz", "Ordubad", "Qax", "Qazax", "Qəbələ", "Qobustan", "Quba", "Qubadlı",
  "Qusar", "Saatlı", "Sabirabad", "Şabran", "Şahbuz", "Şəmkir", "Şərur", "Şuşa",
  "Tərtər", "Tovuz", "Ucar", "Xaçmaz", "Xankəndi", "Xızı", "Xocalı", "Xocavənd",
  "Yardımlı", "Zəngilan", "Zaqatala", "Zərdab"
]

interface LockedResultsModalProps {
  isOpen: boolean
  onClose?: () => void
  onSuccess?: () => void
}

export function LockedResultsModal({ isOpen, onClose, onSuccess }: LockedResultsModalProps) {
  const [region, setRegion] = useState("Bakı")
  const [school, setSchool] = useState("")
  const [fatherName, setFatherName] = useState("")
  const [parentEmail, setParentEmail] = useState("")
  const [parentEmail2, setParentEmail2] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!region) {
      setError("Zəhmət olmasa rayonunuzu seçin")
      return
    }
    if (!school.trim()) {
      setError("Zəhmət olmasa məktəb nömrənizi qeyd edin (məs: 161 saylı məktəb)")
      return
    }

    setIsLoading(true)
    try {
      const currentUser = getCurrentUser()
      const res = await fetch("/api/auth/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          region,
          school,
          fatherName,
          parentEmail,
          parentEmail2,
          userIdOrEmail: currentUser?.id || currentUser?.email,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Xəta baş verdi")
        return
      }

      // Update local storage
      updateUserData({
        region,
        school,
        fatherName,
        isProfileDone: true,
        profileWarningsCount: 0,
      })

      setIsSuccess(true)
      setTimeout(() => {
        if (onSuccess) onSuccess()
        if (onClose) onClose()
        window.location.reload()
      }, 900)
    } catch (err) {
      setError("Şəbəkə xətası baş verdi")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      // Don't close if forced
      if (!open && onClose) onClose()
    }}>
      <DialogContent className="max-w-lg p-6 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-blue-200 dark:border-blue-900 animate-in zoom-in-95">
        <DialogHeader className="text-center space-y-2">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-red-500 flex items-center justify-center text-white shadow-xl shadow-amber-500/25">
            <Lock className="w-7 h-7 animate-pulse" />
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Nəticəniz Hazırdır! 🔒
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Balınızı, səhv sualların düzgün izahını və sertifikatınızı görmək üçün cəmi 2 məlumatı tamamlayın:
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-950/50 rounded-xl border border-red-200 dark:border-red-900">
            {error}
          </div>
        )}

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600 dark:text-green-400 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Profiliniz Tamamlandı!</h4>
            <p className="text-sm text-slate-500">Test nəticələriniz açılır...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            {/* Rayon */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" /> Rayon / Şəhər <span className="text-red-500">*</span>
              </Label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue placeholder="Rayon seçin" />
                </SelectTrigger>
                <SelectContent className="max-h-56">
                  {regionsList.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Məktəb */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <School className="w-3.5 h-3.5 text-blue-600" /> Məktəb nömrəsi və ya adı <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Məsələn: 161 saylı tam orta məktəb"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="h-11 rounded-xl"
                required
              />
            </div>

            {/* Ata adı (İstəyə bağlı) */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Ata adı <span className="text-slate-400 font-normal">(istəyə bağlı)</span>
              </Label>
              <Input
                placeholder="Ata adınız"
                value={fatherName}
                onChange={(e) => setFatherName(e.target.value)}
                className="h-11 rounded-xl"
              />
            </div>

            {/* Valideynlər (Həm Ata, Həm Ana dəstəyi) */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Users className="w-4 h-4 text-blue-600" /> Valideyn Əlaqəsi (İstəyə bağlı)
              </div>
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="1-ci Valideyn (Ata və ya Ana) Email ünvanı"
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  className="h-9 text-xs rounded-lg bg-white dark:bg-slate-900"
                />
                <Input
                  type="email"
                  placeholder="2-ci Valideyn (İkinci valideyn) Email ünvanı"
                  value={parentEmail2}
                  onChange={(e) => setParentEmail2(e.target.value)}
                  className="h-9 text-xs rounded-lg bg-white dark:bg-slate-900"
                />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                Valideynləriniz Google ilə daxil olduqda nəticələrinizi canlı izləyə biləcəklər.
              </p>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all text-sm sm:text-base"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" /> Nəticəni Göstər və Kilidi Aç
                </span>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
