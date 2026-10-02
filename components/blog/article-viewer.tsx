"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Clock, Calendar, Share2, BookOpen, CheckCircle2, Quote, Sparkles, Check, ShieldCheck } from "lucide-react"
import { LanguageDropdown, Lang } from "@/components/language-dropdown"
import { BlogPost, DEFAULT_ACADEMIC_SOURCES } from "@/lib/blog-data"
import { Footer } from "@/components/layout/footer"
import { DEFAULT_LOCALE } from "@/lib/config"
import { AdBanner } from "@/components/ads/ad-banner"

interface ArticleViewerProps {
  post: BlogPost
  initialLang?: Lang
}

export function ArticleViewer({ post, initialLang = DEFAULT_LOCALE }: ArticleViewerProps) {
  const [lang, setLang] = useState<Lang>(initialLang)
  const [copied, setCopied] = useState(false)

  const tr = post.translations[lang] || post.translations[DEFAULT_LOCALE] || post.translations.az

  const uiTexts = {
    az: {
      backToBlog: "Bloqa qayıt",
      keyTakeawaysTitle: "Əsas Nəticələr və Xülasə",
      authorRole: "Pedaqoji Tədqiqat Qrupu",
      share: "Paylaş",
      copied: "Link kopyalandı!",
      explorePlatform: "Testləri Sınaqdan Keçir",
      exploreSubtitle: "SİTG Standartı ilə hazırlanmış sualları dərhal həll edin.",
      reviewedByTitle: "Elmi və Metodoloji Yoxlama",
      reviewedByName: "Educational Assessment Review Group",
      reviewedByRole: "Kurikulum və Testologiya Keyfiyyət Təminatı",
      referencesTitle: "Elmi Mənbələr və Ədəbiyyat",
      adLabel: "Təhsil Resursları Dəstəyi",
      lastReviewed: "Yeniləndi: Oktyabr 2026",
    },
    en: {
      backToBlog: "Back to Blog",
      keyTakeawaysTitle: "Key Takeaways & Core Findings",
      authorRole: "Educational Research Team",
      share: "Share",
      copied: "Link copied!",
      explorePlatform: "Explore Assessment Engine",
      exploreSubtitle: "Experience curriculum-aligned diagnostic tests instantly.",
      reviewedByTitle: "Editorial & Methodological Review",
      reviewedByName: "Educational Assessment Review Group",
      reviewedByRole: "Curricular & Testology Quality Assurance",
      referencesTitle: "Academic References & Sources",
      adLabel: "Educational Resources Support",
      lastReviewed: "Peer Reviewed: October 2026",
    },
    tr: {
      backToBlog: "Bloga Dön",
      keyTakeawaysTitle: "Öne Çıkan Sonuçlar ve Özet",
      authorRole: "Pedagojik Araştırma Ekibi",
      share: "Paylaş",
      copied: "Bağlantı kopyalandı!",
      explorePlatform: "Platformu Dene",
      exploreSubtitle: "SİTG standardı ile hazırlanan soruları hemen çözün.",
      reviewedByTitle: "Bilimsel ve Metodolojik İnceleme",
      reviewedByName: "Educational Assessment Review Group",
      reviewedByRole: "Müfredat ve Testoloji Kalite Güvencesi",
      referencesTitle: "Akademik Kaynaklar ve Referanslar",
      adLabel: "Eğitim Kaynakları Desteği",
      lastReviewed: "İncelendi: Ekim 2026",
    },
    ru: {
      backToBlog: "Вернуться в блог",
      keyTakeawaysTitle: "Ключевые выводы и резюме",
      authorRole: "Группа педагогических исследований",
      share: "Поделиться",
      copied: "Ссылка скопирована!",
      explorePlatform: "Попробовать тесты",
      exploreSubtitle: "Пройдите диагностические тесты по стандарту SITG прямо сейчас.",
      reviewedByTitle: "Научно-методологическая экспертиза",
      reviewedByName: "Educational Assessment Review Group",
      reviewedByRole: "Контроль качества куррикулума и тестологии",
      referencesTitle: "Академические источники и литература",
      adLabel: "Поддержка образовательных ресурсов",
      lastReviewed: "Обновлено: Октябрь 2026",
    },
  }[lang]

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between">
      <div>
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center gap-4">
          <Link
            href={lang === DEFAULT_LOCALE ? "/blog" : `/${lang}/blog`}
            className="flex items-center gap-2 text-slate-700 hover:text-blue-600 font-semibold text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{uiTexts.backToBlog}</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? uiTexts.copied : uiTexts.share}</span>
            </button>
            <LanguageDropdown currentLang={lang} onSelectLang={setLang} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <article className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-12 space-y-10">
          {/* Article Header */}
          <header className="space-y-4 border-b border-slate-100 pb-8">
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700">
                {tr.category}
              </span>
              <span className="inline-flex items-center gap-1 text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                {tr.readTime}
              </span>
              <span className="inline-flex items-center gap-1 text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                {post.publishDate}
              </span>
              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-medium text-[11px] border border-emerald-200/60">
                <Check className="w-3 h-3 text-emerald-600" />
                {uiTexts.lastReviewed}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {tr.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
              {tr.subtitle}
            </p>

            {/* Author & Editorial Reviewer Cards */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">{post.author.name}</div>
                  <div className="text-xs text-slate-500">{post.author.role}</div>
                </div>
              </div>

              <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/80">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="text-left">
                  <div className="text-[11px] font-bold text-slate-900">{uiTexts.reviewedByTitle}</div>
                  <div className="text-[10px] text-slate-500">{post.reviewedBy?.name || uiTexts.reviewedByName}</div>
                </div>
              </div>
            </div>
          </header>

          {/* Key Takeaways Box */}
          <div className="bg-gradient-to-br from-blue-50/70 to-indigo-50/50 border border-blue-100 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-sm uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>{uiTexts.keyTakeawaysTitle}</span>
            </div>
            <ul className="space-y-2.5">
              {tr.keyTakeaways.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Content Sections */}
          <div className="space-y-10 text-slate-700 leading-relaxed text-sm sm:text-base">
            {tr.sections.map((section, idx) => (
              <section key={idx} className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {section.heading}
                </h2>

                {section.content.map((paragraph, pIdx) => (
                  <p key={pIdx} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}

                {section.quote && (
                  <blockquote className="my-6 p-5 border-l-4 border-blue-600 bg-slate-50 rounded-r-2xl italic text-slate-800 font-medium text-sm sm:text-base flex items-start gap-3">
                    <Quote className="w-5 h-5 text-blue-500 shrink-0 mt-0.5 opacity-60" />
                    <span>{section.quote}</span>
                  </blockquote>
                )}

                {section.bullets && (
                  <ul className="list-disc pl-6 space-y-2 text-xs sm:text-sm bg-slate-50/80 p-4 rounded-xl border border-slate-100">
                    {section.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="leading-relaxed">
                        {b}
                      </li>
                    ))}
                  </ul>
                )}

                {section.content_after && section.content_after.map((paragraph, caIdx) => (
                  <p key={caIdx} className="leading-relaxed mt-3">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>

          {/* Academic References & Sources */}
          <div className="border-t border-slate-200/80 pt-8 space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>{uiTexts.referencesTitle}</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200/60 leading-relaxed">
              {(post.sources || DEFAULT_ACADEMIC_SOURCES[lang] || DEFAULT_ACADEMIC_SOURCES.en).map((source, sIdx) => (
                <li key={sIdx} className="flex items-start gap-2">
                  <span className="text-slate-400 font-mono text-[10px] shrink-0 mt-0.5">[{sIdx + 1}]</span>
                  <span>{source}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom Ad Banner (Clean, single, below editorial content) */}
          <div className="pt-2">
            <AdBanner slot="blog-article-footer" format="horizontal" label={uiTexts.adLabel} className="my-4" />
          </div>

          {/* CTA Box */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="font-bold text-lg text-white">{uiTexts.explorePlatform}</h3>
              <p className="text-xs sm:text-sm text-slate-300">{uiTexts.exploreSubtitle}</p>
            </div>
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs sm:text-sm text-white transition-colors shrink-0 shadow-md"
            >
              {uiTexts.explorePlatform}
            </Link>
          </div>
        </article>
      </main>
      </div>

      <Footer lang={lang} />
    </div>
  )
}
