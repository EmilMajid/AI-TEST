"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, MessageSquare, ArrowLeft, MapPin } from "lucide-react"
import { LanguageDropdown, Lang } from "@/components/language-dropdown"
import { Footer } from "@/components/layout/footer"
import { DEFAULT_LOCALE } from "@/lib/config"

interface ContactContentProps {
  initialLang?: Lang
}

export function ContactContent({ initialLang = DEFAULT_LOCALE }: ContactContentProps) {
  const [lang, setLang] = useState<Lang>(initialLang)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between">
      <div>
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap justify-between items-center gap-4">
            <Link href={lang === DEFAULT_LOCALE ? "/" : `/${lang}`} className="flex items-center gap-2 text-primary font-bold text-lg hover:opacity-80 transition-opacity">
              <ArrowLeft className="w-5 h-5" />
              <span>TESTAI.AZ</span>
            </Link>

            <div className="flex items-center gap-3">
              <Link
                href={lang === DEFAULT_LOCALE ? "/blog" : `/${lang}/blog`}
                className="text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                {lang === "az" ? "Bloq" : lang === "tr" ? "Blog" : lang === "ru" ? "Блог" : "Blog"}
              </Link>
              <LanguageDropdown currentLang={lang} onSelectLang={setLang} />
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 sm:p-10 space-y-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {lang === "az" && "Bizimlə Əlaqə"}
                {lang === "en" && "Contact Us"}
                {lang === "tr" && "İletişim"}
                {lang === "ru" && "Контакты"}
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                {lang === "az" && "Pedaqoji əməkdaşlıq, təklif və texniki dəstək üçün bizimlə əlaqə saxlayın."}
                {lang === "en" && "Reach out for educational partnerships, pedagogical inquiries, and technical support."}
                {lang === "tr" && "Eğitim ortaklıkları, sorularınız ve teknik destek için bizimle iletişime geçin."}
                {lang === "ru" && "Свяжитесь с нами по вопросам педагогического сотрудничества и технической поддержки."}
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {lang === "az" && "Rəsmi E-poçt"}
                    {lang === "en" && "Official Email"}
                    {lang === "tr" && "Resmi E-posta"}
                    {lang === "ru" && "Электронная почта"}
                  </h3>
                  <a href="mailto:aztestai.az@gmail.com" className="text-blue-600 text-xs sm:text-sm font-medium hover:underline break-all block mt-1">
                    aztestai.az@gmail.com
                  </a>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {lang === "az" && "Cavablandırma: 24 saat ərzində"}
                    {lang === "en" && "Response: Within 24 hours"}
                    {lang === "tr" && "Yanıt süresi: 24 saat içinde"}
                    {lang === "ru" && "Ответ: в течение 24 часов"}
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {lang === "az" && "Baş Qərargah & Məkan"}
                    {lang === "en" && "Location & Operations"}
                    {lang === "tr" && "Genel Merkez & Konum"}
                    {lang === "ru" && "Локация и Штаб-квартира"}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 mt-1">
                    {lang === "az" && "Bakı şəhəri, Azərbaycan"}
                    {lang === "en" && "Baku, Azerbaijan"}
                    {lang === "tr" && "Bakü, Azerbaycan"}
                    {lang === "ru" && "г. Баку, Азербайджан"}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {lang === "az" && "Onlayn Təhsil və AI Diaqnostika Platforması"}
                    {lang === "en" && "Educational AI & Diagnostic Assessment Platform"}
                    {lang === "tr" && "Eğitimsel Yapay Zeka ve Teşhis Platformu"}
                    {lang === "ru" && "Образовательная ИИ-платформа диагностики"}
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {lang === "az" && "Sosial Kanallar"}
                    {lang === "en" && "Social Channels"}
                    {lang === "tr" && "Sosyal Medya"}
                    {lang === "ru" && "Социальные сети"}
                  </h3>
                  <div className="text-xs text-slate-600 mt-1 space-y-1">
                    <p><a href="https://www.instagram.com/testai.az/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-600 transition-colors">Instagram: @testai.az</a></p>
                    <p><a href="https://www.facebook.com/profile.php?id=61594359745552" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">Facebook: TESTAI.AZ</a></p>
                    <p><a href="https://www.youtube.com/channel/UCSsFhuYKk6MHdLna05kfJrA" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors">YouTube: TESTAI.AZ</a></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer lang={lang} />
    </div>
  )
}
