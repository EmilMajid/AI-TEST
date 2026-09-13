"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, MessageSquare, Globe, ArrowLeft } from "lucide-react"

type Lang = "az" | "en" | "tr" | "ru"

export default function ContactPage() {
  const [lang, setLang] = useState<Lang>("az")

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap justify-between items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-primary font-bold text-lg">
            <ArrowLeft className="w-5 h-5" />
            <span>TESTAI.AZ</span>
          </Link>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <Globe className="w-4 h-4 ml-2 mr-1 text-slate-500" />
            {(["az", "en", "tr", "ru"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg uppercase transition-all cursor-pointer ${
                  lang === l ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 sm:p-10 space-y-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {lang === "az" && "Bizimlə Əlaqə"}
              {lang === "en" && "Contact Us"}
              {lang === "tr" && "İletişim"}
              {lang === "ru" && "Контакты"}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {lang === "az" && "Suallarınız, təklifləriniz və əməkdaşlıq üçün bizə müraciət edin."}
              {lang === "en" && "Reach out for educational partnerships, pedagogical inquiries, and technical support."}
              {lang === "tr" && "Eğitim ortaklıkları, sorularınız ve önerileriniz için bize ulaşın."}
              {lang === "ru" && "Свяжитесь с нами по любым вопросам сотрудничества и технической поддержки."}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
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
                <a href="mailto:aztestai.az@gmail.com" className="text-blue-600 text-sm font-medium hover:underline break-all">
                  aztestai.az@gmail.com
                </a>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  {lang === "az" && "Sosial Şəbəkələr"}
                  {lang === "en" && "Social Channels"}
                  {lang === "tr" && "Sosyal Medya"}
                  {lang === "ru" && "Социальные сети"}
                </h3>
                <p className="text-xs text-slate-600 mt-1">Instagram: @testai.az</p>
                <p className="text-xs text-slate-600">Facebook: TESTAI.AZ</p>
                <p className="text-xs text-slate-600">YouTube: TESTAI.AZ</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
