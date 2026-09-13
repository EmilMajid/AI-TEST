"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X, Sparkles, ArrowRight } from "lucide-react"
import { BRAND_SLOGANS } from "./ad-banner"

export function StickyBottomAd() {
  const [isVisible, setIsVisible] = useState(true)
  const [sloganIndex, setSloganIndex] = useState(0)
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || ""

  useEffect(() => {
    // Təsadüfi cümlə seçimi
    setSloganIndex(Math.floor(Math.random() * BRAND_SLOGANS.length))

    if (typeof window !== "undefined" && adsenseClientId) {
      try {
        const adsbygoogle = (window as any).adsbygoogle || []
        adsbygoogle.push({})
      } catch (e) {
        // Safe ignore
      }
    }
  }, [adsenseClientId])

  if (!isVisible) return null

  const slogan = BRAND_SLOGANS[sloganIndex]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-indigo-500/20 shadow-2xl transition-all duration-300">
      <div className="max-w-6xl mx-auto relative px-3 py-2 flex items-center justify-between min-h-[55px]">
        {/* Bağlama Düyməsi (X) */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute -top-3 right-3 bg-slate-800 border border-slate-700 text-slate-400 hover:text-white rounded-full p-1 shadow-md hover:scale-110 transition-transform cursor-pointer"
          title="Bağla"
          aria-label="Bağla"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* AdSense və ya Brend Promo Məzmunu */}
        <div className="w-full flex items-center justify-between gap-3 overflow-hidden">
          {adsenseClientId ? (
            <ins
              className="adsbygoogle"
              style={{
                display: "inline-block",
                width: "100%",
                maxWidth: "728px",
                height: "50px",
                textAlign: "center",
              }}
              data-ad-client={adsenseClientId}
              data-ad-slot="sticky-bottom-slot"
              data-ad-format="horizontal"
              data-full-width-responsive="true"
            />
          ) : (
            <div className="flex items-center justify-between w-full text-xs text-white">
              <div className="flex items-center gap-3 overflow-hidden">
                {/* Rəsmi Loqo */}
                <div className="relative w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-lg overflow-hidden border border-white/20 shadow-xs bg-slate-950">
                  <Image
                    src="/brand-promo.jpg"
                    alt="AI TEST Emil Məcidov"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="truncate">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> Sponsorluq Fürsəti
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-white truncate">
                    "{slogan}"
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <a
                  href="mailto:aztestai.az@gmail.com?subject=Brend%20%C6%8Fm%C9%99kda%C5%9Fl%C4%B1%C4%9F%C4%B1%20TESTAI.AZ"
                  className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-sm hover:scale-105"
                >
                  <span className="hidden sm:inline">Bizimlə Əlaqə</span>
                  <span className="sm:hidden">Əlaqə</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
