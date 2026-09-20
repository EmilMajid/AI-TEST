"use client"

import React from "react"
import { AlertTriangle, Info, ShieldAlert, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProfileCompletionBannerProps {
  warningsCount: number
  onOpenCompleteModal: () => void
}

export function ProfileCompletionBanner({ warningsCount, onOpenCompleteModal }: ProfileCompletionBannerProps) {
  if (warningsCount <= 0 || warningsCount >= 4) return null

  // 1/3: Sarı / Info
  if (warningsCount === 1) {
    return (
      <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-900 dark:text-amber-200 shadow-sm animate-in fade-in">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg text-amber-600 dark:text-amber-300 shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-sm sm:text-base flex items-center gap-2">
              <span>Profilinizi tamamlayın</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-800 font-bold">1 / 3 xəbərdarlıq</span>
            </div>
            <p className="text-xs sm:text-sm text-amber-700 dark:text-amber-300/80">
              Məktəbinizin reytinqində yer almaq və zəif mövzularınızı izləmək üçün rayon və məktəbinizi qeyd edin. (3 pulsuz sınaq qaldı)
            </p>
          </div>
        </div>
        <Button
          size="sm"
          onClick={onOpenCompleteModal}
          className="bg-amber-600 hover:bg-amber-700 text-white font-medium shrink-0 rounded-lg shadow-sm"
        >
          Tamamla <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    )
  }

  // 2/3: Narıncı / Alert
  if (warningsCount === 2) {
    return (
      <div className="mb-6 p-4 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-orange-900 dark:text-orange-200 shadow-sm animate-in fade-in">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg text-orange-600 dark:text-orange-300 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-sm sm:text-base flex items-center gap-2">
              <span>Xatırlatma: Profiliniz natamamdır</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-orange-200 dark:bg-orange-800 font-bold">2 / 3 xəbərdarlıq</span>
            </div>
            <p className="text-xs sm:text-sm text-orange-700 dark:text-orange-300/80">
              Cəmi 2 test sonra nəticələriniz kilidlənəcək. İndi məktəbinizi daxil edin.
            </p>
          </div>
        </div>
        <Button
          size="sm"
          onClick={onOpenCompleteModal}
          className="bg-orange-600 hover:bg-orange-700 text-white font-medium shrink-0 rounded-lg shadow-sm"
        >
          Profili Tamamla <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    )
  }

  // 3/3: Qırmızı / Urgent Warning
  return (
    <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border-2 border-red-300 dark:border-red-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-red-900 dark:text-red-200 shadow-md animate-bounce-short">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg text-red-600 dark:text-red-300 shrink-0 animate-pulse">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <div className="font-bold text-sm sm:text-base flex items-center gap-2">
            <span>⚠️ SONUNCU XƏBƏRDARLIQ!</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-red-200 dark:bg-red-800 font-extrabold text-red-900 dark:text-red-100">3 / 3</span>
          </div>
          <p className="text-xs sm:text-sm text-red-700 dark:text-red-300/90 font-medium">
            Növbəti testdə nəticələriniz, balınız və səhvlərinizin izahı görünməyəcək və kilidlənəcək.
          </p>
        </div>
      </div>
      <Button
        size="sm"
        onClick={onOpenCompleteModal}
        className="bg-red-600 hover:bg-red-700 text-white font-bold shrink-0 rounded-lg shadow-md"
      >
        İndi Tamamla <Sparkles className="w-4 h-4 ml-1" />
      </Button>
    </div>
  )
}
