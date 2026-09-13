"use client"

import { useState, useEffect } from "react"
import { X, Sparkles } from "lucide-react"

export function StickyBottomAd() {
  const [isVisible, setIsVisible] = useState(true)
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || ""

  useEffect(() => {
    // If AdSense is present, request ad
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

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border shadow-2xl transition-all duration-300">
      <div className="container max-w-4xl mx-auto relative px-2 py-1.5 flex items-center justify-center min-h-[55px] sm:min-h-[65px]">
        {/* Bağlama Düyməsi (X) */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute -top-3 right-2 bg-background border border-border text-muted-foreground hover:text-foreground rounded-full p-1 shadow-md hover:scale-110 transition-transform cursor-pointer"
          title="Reklamı bağla"
          aria-label="Reklamı bağla"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* AdSense və ya Promo Məzmunu */}
        <div className="w-full flex items-center justify-center overflow-hidden">
          {adsenseClientId ? (
            <ins
              className="adsbygoogle"
              style={{ display: "inline-block", width: "100%", maxWidth: "728px", height: "50px", textAlign: "center" }}
              data-ad-client={adsenseClientId}
              data-ad-slot="sticky-bottom-slot"
              data-ad-format="horizontal"
              data-full-width-responsive="true"
            />
          ) : (
            <div className="flex items-center justify-between w-full px-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 font-semibold text-primary">
                  <Sparkles className="w-3 h-3" /> TESTAI Tərəfdaş
                </span>
                <span className="hidden sm:inline">| DİM və Respublika Olimpiadalarına xüsusi hazırlıq proqramı</span>
              </div>
              <span className="text-[11px] bg-primary/10 text-primary font-medium px-2 py-0.5 rounded-full">Özəl Təklif</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
