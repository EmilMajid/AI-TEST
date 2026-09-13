"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Sparkles, Mail, ArrowRight } from "lucide-react"

export const BRAND_SLOGANS = [
  "Brendiniz savadlı gələcəyin formalaşdığı məkanda",
  "Gələcəyin təhsilli nəsli ilə brendinizi birləşdirin.",
  "Gələcəyin auditoriyasında sizin brendinizə yer var",
  "Brendinizin gələcəyi burada başlayır.",
]

interface AdBannerProps {
  slot?: string
  format?: "horizontal" | "rectangle" | "vertical" | "large-banner" | "auto"
  refreshKey?: string | number
  className?: string
  label?: string
}

export function AdBanner({
  slot = "1234567890",
  format = "horizontal",
  refreshKey,
  className = "",
  label = "Sponsorluq və Brend Əməkdaşlığı",
}: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null)
  const [sloganIndex, setSloganIndex] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || ""

  // Təsadüfi cümlə seçimi (Random slogan selection)
  useEffect(() => {
    setIsRefreshing(true)
    const randomIndex = Math.floor(Math.random() * BRAND_SLOGANS.length)
    setSloganIndex(randomIndex)

    const timeout = setTimeout(() => setIsRefreshing(false), 150)

    if (adsenseClientId && typeof window !== "undefined") {
      try {
        const adsbygoogle = (window as any).adsbygoogle || []
        adsbygoogle.push({})
      } catch (e) {
        // Safe ignore
      }
    }

    return () => clearTimeout(timeout)
  }, [refreshKey, adsenseClientId])

  const currentSlogan = BRAND_SLOGANS[sloganIndex]
  const isVertical = format === "vertical"
  const isLarge = format === "large-banner"

  return (
    <div
      ref={adRef}
      className={`w-full max-w-full overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900 shadow-md transition-all duration-300 ${
        isRefreshing ? "opacity-60 scale-[0.99]" : "opacity-100 scale-100"
      } ${className}`}
    >
      {/* Başlıq Zolağı */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800/80 border-b border-slate-700/60 text-[11px] text-slate-300">
        <span className="flex items-center gap-1.5 font-medium tracking-wide">
          <Sparkles className="w-3 h-3 text-blue-400" />
          {label}
        </span>
        <span className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider">
          TESTAI Partnyor
        </span>
      </div>

      {/* AdSense İnteqrasiyası (Aktiv olduqda) və ya Rəsmi Brend Banneri */}
      {adsenseClientId ? (
        <div
          className={`p-2 flex justify-center items-center w-full max-w-full overflow-hidden ${
            isVertical ? "min-h-[400px]" : isLarge ? "min-h-[220px]" : "min-h-[90px]"
          }`}
        >
          <ins
            className="adsbygoogle"
            style={{
              display: "block",
              textAlign: "center",
              width: "100%",
              maxWidth: "100%",
              overflow: "hidden",
            }}
            data-ad-client={adsenseClientId}
            data-ad-slot={slot}
            data-ad-format={
              isVertical
                ? "vertical"
                : isLarge
                ? "rectangle"
                : format === "rectangle"
                ? "rectangle"
                : "horizontal"
            }
            data-full-width-responsive="true"
          />
        </div>
      ) : isVertical ? (
        /* Şaquli Format (Yan Panellər üçün) */
        <div className="p-5 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col justify-between items-center text-center min-h-[420px]">
          <div className="w-full flex flex-col items-center space-y-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              <Sparkles className="w-3 h-3 text-blue-400" />
              Sponsorluq Fürsəti
            </span>

            {/* Rəsmi Loqo */}
            <div className="relative w-32 h-32 rounded-2xl overflow-hidden shadow-2xl border-2 border-indigo-400/30 group-hover:scale-105 transition-transform bg-slate-950">
              <Image
                src="/brand-promo.jpg"
                alt="AI TEST Emil Məcidov"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Təsadüfi Cümlə */}
            <div className="space-y-2 px-1">
              <h4 className="text-base sm:text-lg font-extrabold text-white leading-snug tracking-tight">
                "{currentSlogan}"
              </h4>
              <p className="text-xs text-indigo-200/80 leading-relaxed">
                Brendinizi minlərlə məktəbli, valideyn və müəllimdən ibarət savadlı auditoriyaya çatdırın.
              </p>
            </div>
          </div>

          <div className="w-full space-y-2 pt-4 border-t border-slate-800">
            <a
              href="mailto:aztestai.az@gmail.com?subject=Brend%20%C6%8Fm%C9%99kda%C5%9Fl%C4%B1%C4%9F%C4%B1%20TESTAI.AZ"
              className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Bizimlə Əlaqə</span>
            </a>
            <span className="text-[11px] text-slate-400 block break-all">
              aztestai.az@gmail.com
            </span>
          </div>
        </div>
      ) : isLarge ? (
        /* Böyük / Genişləndirilmiş Format (Nəticə və alt sahələr üçün) */
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 text-center sm:text-left">
            {/* Rəsmi Loqo */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-2xl overflow-hidden shadow-2xl border-2 border-indigo-400/30 bg-slate-950">
              <Image
                src="/brand-promo.jpg"
                alt="AI TEST Emil Məcidov"
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="space-y-1.5 max-w-xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                Sponsorluq və Brend Əməkdaşlığı
              </span>
              <h3 className="text-base sm:text-xl font-extrabold text-white tracking-tight leading-snug">
                "{currentSlogan}"
              </h3>
              <p className="text-xs sm:text-sm text-indigo-200/80 leading-relaxed">
                Azərbaycanın ilk dərslik əsaslı süni intellekt platformasında brendinizi savadlı gələcək nəsillə birləşdirin.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-center sm:items-end gap-1.5">
            <a
              href="mailto:aztestai.az@gmail.com?subject=Brend%20%C6%8Fm%C9%99kda%C5%9Fl%C4%B1%C4%9F%C4%B1%20TESTAI.AZ"
              className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xl transition-all flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
            >
              <Mail className="w-4 h-4" />
              <span>Bizimlə Əlaqə</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <span className="text-[11px] text-slate-400 font-medium">
              aztestai.az@gmail.com
            </span>
          </div>
        </div>
      ) : (
        /* Standart Üfüqi (Horizontal / Rectangle / Auto) Format */
        <div className="p-3.5 sm:p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left flex-col sm:flex-row">
            {/* Rəsmi Loqo */}
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-xl overflow-hidden shadow-lg border border-indigo-400/30 bg-slate-950">
              <Image
                src="/brand-promo.jpg"
                alt="AI TEST Emil Məcidov"
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-0.5">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                <Sparkles className="w-2.5 h-2.5" />
                Sponsorluq Fürsəti
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
                "{currentSlogan}"
              </h4>
              <p className="text-[11px] text-indigo-200/70 hidden md:block">
                Brendinizi gələcəyin təhsilli nəsli ilə birləşdirin • aztestai.az@gmail.com
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <a
              href="mailto:aztestai.az@gmail.com?subject=Brend%20%C6%8Fm%C9%99kda%C5%9Fl%C4%B1%C4%9F%C4%B1%20TESTAI.AZ"
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105"
            >
              <span>Bizimlə Əlaqə</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
