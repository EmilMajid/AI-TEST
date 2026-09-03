"use client"

import { useEffect, useRef, useState } from "react"
import { Sparkles, ExternalLink, GraduationCap, Award, BookOpen, Rocket, CheckCircle2, Gift } from "lucide-react"

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
  label = "Reklam",
}: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Demo reklam məzmunları (AdSense aktiv olmadıqda və ya sınaq üçün)
  const sampleAds = [
    {
      title: "DİM Qəbul İmtahanlarına Hazırlıq Proqramı",
      subtitle: "Xüsusi 30% Endirim Kampaniyası Başladı!",
      desc: "9-11-ci siniflər üçün xüsusi proqram. Peşəkar müəllim heyəti, hər həftə DİM formatında sınaq imtahanları və fərdi inkişaf planı.",
      features: ["Həftəlik Sınaq İmtahanı", "Fərdi Müəllim Nəzarəti", "Onlayn və Əyani Dərslər"],
      cta: "Endirimlə Qeydiyyatdan Keç",
      badge: "Özəl Təklif",
      icon: GraduationCap,
      color: "from-blue-600 via-indigo-600 to-purple-700",
      stats: "98% Tələbə Qəbulu",
      offer: "-30% ENDİRİM",
    },
    {
      title: "Respublika Fənn Olimpiadalarına Hazırlıq",
      subtitle: "Riyaziyyat, Məntiq və İnformatika üzrə İntensiv Kurs",
      desc: "Olimpiada suallarının xüsusi həll metodları. Respublika və beynəlxalq müsabiqələrdə qalib olmaq şansı qazan!",
      features: ["Olimpiada Tapşırıqları", "Ekspert Mentorlar", "Sertifikat və Mükafatlar"],
      cta: "Qeydiyyatdan Keç",
      badge: "Olimpiada",
      icon: Award,
      color: "from-emerald-600 via-teal-600 to-cyan-700",
      stats: "Qeydiyyat Açıqdır",
      offer: "PULSUZ SINAQ",
    },
    {
      title: "Xarici Dillər Mərkəzi: IELTS & General English",
      subtitle: "İlk Dərs Tamamilə Ödənişsizdir!",
      desc: "Native speaker müəllimlərlə ingilis, alman və rus dili dərsləri. Qısa müddətdə sərbəst danışıq və yüksək imtahan balları.",
      features: ["Speaking Club", "IELTS Mock Test", "Pulsuz Tədris Vəsaitləri"],
      cta: "Ödənişsiz Sınaq Dərsi Al",
      badge: "Xarici Dil",
      icon: BookOpen,
      color: "from-violet-600 via-purple-600 to-indigo-800",
      stats: "IELTS 7.5+ Zəmanəti",
      offer: "1-Cİ DƏRS ÖDƏNİŞSİZ",
    },
    {
      title: "EduTech: Python, Süni İntellekt və Robototexnika",
      subtitle: "Gələcəyin İT Mütəxəssisləri üçün Praktiki Dərslər",
      desc: "Məktəblilər üçün praktiki kodlaşdırma və AI dərsləri. Sıfırdan öz oyunlarını və süni intellekt layihələrini hazırla!",
      features: ["Praktiki Layihələr", "AI & Data Science", "Beynəlxalq Sertifikat"],
      cta: "İT Kursuna Qoşul",
      badge: "İT Təhsil",
      icon: Rocket,
      color: "from-amber-600 via-orange-600 to-red-700",
      stats: "Beynəlxalq Sertifikat",
      offer: "XÜSUSİ TƏQAÜD",
    },
  ]

  // Demo reklamı refreshKey dəyişdikcə dinamik dəyişmək üçün
  const getIndex = () => {
    if (typeof refreshKey === "number") return Math.abs(refreshKey) % sampleAds.length
    if (typeof refreshKey === "string") {
      const match = refreshKey.match(/\d+/)
      const base = match ? parseInt(match[0], 10) : 0
      const offset = refreshKey.includes("right") ? 1 : refreshKey.includes("completed") ? 2 : 0
      return (base + offset) % sampleAds.length
    }
    return 0
  }

  const currentAdIndex = getIndex()
  const activeDemoAd = sampleAds[currentAdIndex]
  const AdIcon = activeDemoAd.icon
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID

  useEffect(() => {
    setIsRefreshing(true)
    const timeout = setTimeout(() => setIsRefreshing(false), 200)

    if (adsenseClientId && typeof window !== "undefined") {
      try {
        const adsbygoogle = (window as any).adsbygoogle || []
        adsbygoogle.push({})
      } catch (e) {
        console.warn("AdSense push xətası:", e)
      }
    }

    return () => clearTimeout(timeout)
  }, [refreshKey, adsenseClientId])

  const isVertical = format === "vertical"
  const isLarge = format === "large-banner"

  return (
    <div
      ref={adRef}
      className={`w-full overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm transition-all duration-300 ${
        isRefreshing ? "opacity-40 scale-[0.99]" : "opacity-100 scale-100"
      } ${className}`}
    >
      {/* Reklam Başlıq Zolağı */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-muted/50 border-b border-border/60 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5 font-medium tracking-wide">
          <Sparkles className="w-3 h-3 text-primary" />
          {label}
        </span>
        <span className="text-[10px] opacity-75">TESTAI Ads</span>
      </div>

      {/* AdSense İnteqrasiyası */}
      {adsenseClientId ? (
        <div className={`p-2 flex justify-center items-center ${isVertical ? "min-h-[400px]" : isLarge ? "min-h-[220px]" : "min-h-[90px]"}`}>
          <ins
            className="adsbygoogle"
            style={{ display: "block", textAlign: "center" }}
            data-ad-client={adsenseClientId}
            data-ad-slot={slot}
            data-ad-format={isVertical ? "vertical" : isLarge ? "rectangle" : format === "rectangle" ? "rectangle" : "horizontal"}
            data-full-width-responsive="true"
          />
        </div>
      ) : isVertical ? (
        /* Şaquli (Vertical / Yan Panel) Reklam Formatı */
        <div className={`p-5 bg-gradient-to-b ${activeDemoAd.color} text-white flex flex-col justify-between min-h-[420px]`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/20 text-white backdrop-blur-xs">
                {activeDemoAd.badge}
              </span>
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                <AdIcon className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-base font-bold leading-snug drop-shadow-xs">
                {activeDemoAd.title}
              </h4>
              <p className="text-xs text-white/90 leading-relaxed">
                {activeDemoAd.desc}
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-white/20">
            <div className="text-[11px] font-medium text-white/80 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-yellow-300" />
              {activeDemoAd.stats}
            </div>
            <button
              onClick={() => {}}
              className="w-full py-2.5 bg-white text-gray-900 font-bold text-xs rounded-xl shadow-lg hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{activeDemoAd.cta}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </button>
          </div>
        </div>
      ) : isLarge ? (
        /* Böyük / Genişləndirilmiş Nəticə Reklam Formatı (Large Banner) */
        <div className={`p-6 sm:p-7 bg-gradient-to-r ${activeDemoAd.color} text-white flex flex-col md:flex-row items-center justify-between gap-6`}>
          <div className="flex-1 space-y-3 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-xs shadow-xs">
                <Gift className="w-3.5 h-3.5 text-yellow-300" />
                {activeDemoAd.offer}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white/90">
                {activeDemoAd.badge}
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-extrabold tracking-tight drop-shadow-sm">
                {activeDemoAd.title}
              </h3>
              <p className="text-xs sm:text-sm font-medium text-white/90">
                {activeDemoAd.subtitle}
              </p>
            </div>

            <p className="text-xs text-white/80 line-clamp-2 max-w-2xl leading-relaxed">
              {activeDemoAd.desc}
            </p>

            {/* Xüsusiyyətlər nişanları */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-1">
              {activeDemoAd.features.map((feat, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 text-[11px] text-white/90 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  {feat}
                </span>
              ))}
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-center gap-2">
            <button
              onClick={() => {}}
              className="px-6 py-3.5 bg-white text-gray-900 font-extrabold text-sm rounded-xl shadow-xl hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>{activeDemoAd.cta}</span>
              <ExternalLink className="w-4 h-4 text-gray-700" />
            </button>
            <span className="text-[11px] text-white/80 font-medium">
              ⭐ {activeDemoAd.stats}
            </span>
          </div>
        </div>
      ) : (
        /* Standart Üfüqi (Horizontal) Reklam Formatı */
        <div className={`p-4 bg-gradient-to-r ${activeDemoAd.color} text-white flex flex-col sm:flex-row items-center justify-between gap-3`}>
          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/20 text-white backdrop-blur-xs">
              <span>{activeDemoAd.badge}</span>
            </div>
            <h4 className="text-sm sm:text-base font-bold leading-tight drop-shadow-xs">
              {activeDemoAd.title}
            </h4>
            <p className="text-xs text-white/90 line-clamp-1 max-w-xl">
              {activeDemoAd.desc}
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={() => {}}
              className="px-4 py-2 bg-white text-gray-900 font-semibold text-xs rounded-lg shadow-md hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>{activeDemoAd.cta}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
