"use client"

import { useState, useEffect } from "react"
import { Award, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AdBanner } from "@/components/ads/ad-banner"

interface TestInterstitialAdProps {
  isOpen: boolean
  onComplete: () => void
}

export function TestInterstitialAd({ isOpen, onComplete }: TestInterstitialAdProps) {
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    if (!isOpen) return

    setCountdown(3)
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          onComplete()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen, onComplete])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-card border border-border max-w-lg w-full rounded-2xl shadow-2xl overflow-hidden text-center p-6 space-y-5">
        {/* Başlıq və Təbrik */}
        <div className="space-y-1">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-2">
            <Award className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Testi Uğurla Tamamladınız! 🎉
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Nəticələriniz və süni intellekt analizi hesablanır...
          </p>
        </div>

        {/* Sponsor / Brend Əməkdaşlığı Bloku */}
        <div className="my-2">
          <AdBanner
            slot="test-interstitial-slot"
            format="rectangle"
            label="Sponsorluq və Brend Əməkdaşlığı"
            className="border-primary/20 shadow-sm"
          />
        </div>

        {/* Nəticəyə Keçid Düyməsi və Sayğac */}
        <div className="pt-1 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">
            {countdown > 0 ? `Avtomatik keçid: ${countdown} saniyə` : "Hazırdır!"}
          </span>
          <Button
            onClick={onComplete}
            className="w-full sm:w-auto font-medium gap-2 px-6"
            size="default"
          >
            Nəticələri Gör
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
