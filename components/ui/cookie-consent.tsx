"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [lang, setLang] = useState<"en" | "az" | "tr" | "ru">("en")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname
      if (path.startsWith("/az")) setLang("az")
      else if (path.startsWith("/tr")) setLang("tr")
      else if (path.startsWith("/ru")) setLang("ru")
      else setLang("en")

      const consent = localStorage.getItem("testai_cookie_consent")
      if (!consent) {
        const t = setTimeout(() => setIsVisible(true), 1000)
        return () => clearTimeout(t)
      }
    }
  }, [])

  const handleConsent = (mode: "all" | "essential") => {
    if (typeof window !== "undefined") {
      localStorage.setItem("testai_cookie_consent", mode)
      setIsVisible(false)

      const w = window as any
      if (typeof w.gtag === "function") {
        if (mode === "all") {
          w.gtag("consent", "update", {
            ad_storage: "granted",
            analytics_storage: "granted",
            ad_user_data: "granted",
            ad_personalization: "granted",
          })
        } else {
          w.gtag("consent", "update", {
            ad_storage: "denied",
            analytics_storage: "denied",
            ad_user_data: "denied",
            ad_personalization: "denied",
          })
        }
      }
    }
  }

  if (!isVisible) return null

  const texts = {
    en: {
      title: "Cookie & Consent Preferences",
      desc: "We use cookies strictly to ensure educational site functionality, improve analytics, and deliver compliant contextual advertisements in accordance with Google Publisher Policies and our Privacy Policy.",
      accept: "Accept All",
      essential: "Essential Only",
      privacy: "Privacy Policy",
    },
    az: {
      title: "Çərəz və Məxfilik Qaydaları",
      desc: "TESTAI.AZ platformasında tədris alətlərinin düzgün işləməsini təmin etmək, analitikanı inkişaf etdirmək və Məxfilik Siyasətimizə uyğun kontekstual elanlar təqdim etmək üçün çərəzlərdən istifadə olunur.",
      accept: "Hamısını Qəbul Et",
      essential: "Yalnız Zəruri",
      privacy: "Məxfilik Siyasəti",
    },
    tr: {
      title: "Çerez ve Gizlilik Tercihleri",
      desc: "Eğitim araçlarının sürekliliğini sağlamak, analitiği geliştirmek ve Gizlilik Politikamıza uygun bağlamsal duyurular sunmak amacıyla çerezler kullanmaktayız.",
      accept: "Tümünü Kabul Et",
      essential: "Yalnızca Zorunlu",
      privacy: "Gizlilik Politikası",
    },
    ru: {
      title: "Политика использования Cookie",
      desc: "Мы используем файлы cookie для корректной работы образовательных сервисов, аналитики и показа контекстных объявлений в строгом соответствии с Политикой конфиденциальности.",
      accept: "Принять все",
      essential: "Только необходимые",
      privacy: "Политика конфиденциальности",
    },
  }[lang]

  return (
    <aside
      role="region"
      aria-label="Cookie Consent Banner"
      className="fixed bottom-0 inset-x-0 z-50 p-3 sm:p-4 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl transition-all"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3 max-w-3xl">
          <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5 border border-blue-500/30">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm1 4a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-4 5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm7 1a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-2 5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
              />
            </svg>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">{texts.title}</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                GDPR / CMP
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {texts.desc}{" "}
              <Link
                href="/privacy"
                className="text-blue-400 hover:text-blue-300 underline font-medium inline-block ml-1"
              >
                {texts.privacy}
              </Link>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0 justify-end">
          <button
            type="button"
            onClick={() => handleConsent("essential")}
            className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors border border-slate-700 cursor-pointer"
          >
            {texts.essential}
          </button>
          <button
            type="button"
            onClick={() => handleConsent("all")}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md transition-all cursor-pointer hover:scale-[1.02]"
          >
            {texts.accept}
          </button>
        </div>
      </div>
    </aside>
  )
}
