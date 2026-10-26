"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  Award,
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  HelpCircle,
  Lightbulb,
  RotateCcw,
  Share2,
  Sparkles,
  User,
  XCircle,
  ChevronRight,
  GraduationCap
} from "lucide-react"
import { ScientificDiscovery, DiscoveryQuizQuestion } from "@/lib/discoveries-types"
import { LanguageDropdown, Lang } from "@/components/language-dropdown"
import { DEFAULT_LOCALE } from "@/lib/config"
import { Footer } from "@/components/layout/footer"
import { getEnrichedDiscovery, getLocalizedGrade } from "@/lib/discoveries-enrichment"

interface DiscoveryViewerProps {
  discovery: ScientificDiscovery
  relatedDiscoveries?: ScientificDiscovery[]
  initialLang?: Lang
}

export function DiscoveryViewer({
  discovery,
  relatedDiscoveries = [],
  initialLang = DEFAULT_LOCALE
}: DiscoveryViewerProps) {
  const [lang, setLang] = useState<Lang>(initialLang)
  const [copied, setCopied] = useState(false)

  // Quiz state: record of questionId -> selectedOptionId
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, "A" | "B" | "C" | "D">>({})
  const [showResults, setShowResults] = useState(false)

  // Enriched discovery with deep text and localized quiz
  const enriched = useMemo(() => getEnrichedDiscovery(discovery, lang), [discovery, lang])
  const tr = enriched.translations[lang] || enriched.translations[DEFAULT_LOCALE] || enriched.translations.az

  const handleSelectAnswer = (questionId: string, optionId: "A" | "B" | "C" | "D") => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId
    }))
  }

  const handleResetQuiz = () => {
    setSelectedAnswers({})
    setShowResults(false)
  }

  const correctCount = enriched.quiz.reduce((acc, q) => {
    return selectedAnswers[q.id] === q.correctOption ? acc + 1 : acc
  }, 0)

  const allAnswered = enriched.quiz.every((q) => selectedAnswers[q.id] !== undefined)

  const handleShare = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const uiTexts = {
    az: {
      backToCatalog: "Bütün Kəşflərə Qayıt",
      share: "Paylaş",
      copied: "Link kopyalandı!",
      nobelAwardLabel: "Nobel Mükafatı",
      discoveryYearLabel: "Kəşf İli:",
      discovererLabel: "Kəşf edən alim(lər):",
      subjectAndTopicLabel: "Məktəb fənni və mövzusu:",
      nobelBannerTitle: "Nobel Mükafatı Təltifi",
      laureatesLabel: "Laureatlar:",
      citationLabel: "Rəsmi Təltif:",
      ahaMomentTitle: "Evrika! (Kəşf Hekayəsi)",
      howItWorksTitle: "Elmi Prinsip: Necə İşləyir?",
      impactTitle: "Həyatımıza Təsiri və Real Tətbiqi",
      curriculumTitle: "Məktəb Dərslikləri və İmtahanlar ilə Əlaqəsi",
      funFactsTitle: "Bilmirdinizmi? Maraqlı Faktlar",
      quizTitle: "Özünü Sına: Pedaqoji Mini-Sınaq",
      quizSubtitle: "SİTG standartına uyğun 3 sualla bu elmi kəşf üzrə biliklərinizi yoxlayın.",
      resetQuiz: "Yenidən Sına",
      correctText: "Doğru cavab!",
      incorrectText: "Yanlış cavab.",
      scoreSummary: `Nəticəniz: 3 sualdan ${correctCount}-ü doğru!`,
      relatedTitle: "Oxşar Elmi Kəşflər",
      practiceButton: "Açıq Testlərdə İştirak Et",
      questionWord: "Sual",
      bloomLabel: "Bloom:",
      pedagogicalExplanationLabel: "SİTG İzahı:",
      sitgVerified: "SİTG Standartı Təsdiqli",
      readWord: "Oxu",
    },
    en: {
      backToCatalog: "Back to Discoveries",
      share: "Share",
      copied: "Link copied!",
      nobelAwardLabel: "Nobel Prize",
      discoveryYearLabel: "Discovery Year:",
      discovererLabel: "Discoverer(s):",
      subjectAndTopicLabel: "Curriculum Subject & Topic:",
      nobelBannerTitle: "Nobel Prize Citation",
      laureatesLabel: "Laureates:",
      citationLabel: "Official Citation:",
      ahaMomentTitle: "Eureka! Discovery Story",
      howItWorksTitle: "Scientific Principles: How It Works",
      impactTitle: "Real-World Impact and Applications",
      curriculumTitle: "School Curriculum & Examination Alignment",
      funFactsTitle: "Did You Know? Fast Facts",
      quizTitle: "Self-Assessment: Interactive Mini-Quiz",
      quizSubtitle: "Test your understanding with 3 pedagogical questions aligned with cognitive taxonomy.",
      resetQuiz: "Retry Quiz",
      correctText: "Correct answer!",
      incorrectText: "Incorrect choice.",
      scoreSummary: `Your Score: ${correctCount} of 3 correct!`,
      relatedTitle: "Related Discoveries",
      practiceButton: "Practice Open Tests",
      questionWord: "Question",
      bloomLabel: "Bloom Level:",
      pedagogicalExplanationLabel: "Pedagogical Explanation:",
      sitgVerified: "SITG Standard Verified",
      readWord: "Read",
    },
    tr: {
      backToCatalog: "Tüm Keşiflere Dön",
      share: "Paylaş",
      copied: "Bağlantı kopyalandı!",
      nobelAwardLabel: "Nobel Ödülü",
      discoveryYearLabel: "Keşif Yılı:",
      discovererLabel: "Keşfeden Bilim İnsanı:",
      subjectAndTopicLabel: "Müfredat Dersi ve Konu:",
      nobelBannerTitle: "Nobel Ödülü Gerekçesi",
      laureatesLabel: "Ödül Sahipleri:",
      citationLabel: "Resmi Gerekçe:",
      ahaMomentTitle: "Evreka! Keşif Hikayesi",
      howItWorksTitle: "Bilimsel İlke: Nasıl Çalışır?",
      impactTitle: "Gerçek Hayattaki Etkisi ve Uygulamaları",
      curriculumTitle: "Müfredat ve Sınav Kazanımlarıyla Bağlantısı",
      funFactsTitle: "Biliyor muydunuz? İlginç Gerçekler",
      quizTitle: "Kendini Dene: Pedagojik Mini Test",
      quizSubtitle: "Bu bilimsel keşif hakkındaki bilginizi 3 soruyla hemen test edin.",
      resetQuiz: "Testi Tekrarla",
      correctText: "Doğru cevap!",
      incorrectText: "Yanlış cevap.",
      scoreSummary: `Sonuç: 3 sorudan ${correctCount} tanesi doğru!`,
      relatedTitle: "Benzer Bilimsel Keşifler",
      practiceButton: "Açık Testleri Çöz",
      questionWord: "Soru",
      bloomLabel: "Bloom Seviyesi:",
      pedagogicalExplanationLabel: "Pedagojik Açıklama:",
      sitgVerified: "SİTG Standardı Onaylı",
      readWord: "Oku",
    },
    ru: {
      backToCatalog: "Ко всем открытиям",
      share: "Поделиться",
      copied: "Ссылка скопирована!",
      nobelAwardLabel: "Нобелевская премия",
      discoveryYearLabel: "Год открытия:",
      discovererLabel: "Первооткрыватель(и):",
      subjectAndTopicLabel: "Школьный предмет и тема:",
      nobelBannerTitle: "Нобелевская премия",
      laureatesLabel: "Лауреаты:",
      citationLabel: "Формулировка:",
      ahaMomentTitle: "Эврика! История открытия",
      howItWorksTitle: "Научный принцип: как это работает",
      impactTitle: "Значение для науки и повседневной жизни",
      curriculumTitle: "Связь со школьной программой и экзаменами",
      funFactsTitle: "Знаете ли вы? Интересные факты",
      quizTitle: "Проверьте себя: интерактивный мини-тест",
      quizSubtitle: "3 педагогических вопроса для закрепления материала.",
      resetQuiz: "Пройти снова",
      correctText: "Верно!",
      incorrectText: "Неверно.",
      scoreSummary: `Ваш результат: ${correctCount} из 3 правильно!`,
      relatedTitle: "Похожие открытия",
      practiceButton: "Пройти открытые тесты",
      questionWord: "Вопрос",
      bloomLabel: "Уровень Блума:",
      pedagogicalExplanationLabel: "Педагогическое пояснение:",
      sitgVerified: "Стандарт SİTG подтвержден",
      readWord: "Читать",
    },
  }

  const t = uiTexts[lang] || uiTexts[DEFAULT_LOCALE]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Sticky Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={lang === DEFAULT_LOCALE ? "/" : `/${lang}`} className="flex items-center gap-2">
              <div className="relative h-8 w-8">
                <Image src="/logo.webp" alt="TESTAI.AZ" fill className="object-contain rounded-lg" />
              </div>
              <span className="font-bold text-slate-900 text-lg tracking-tight">TESTAI.AZ</span>
            </Link>
            <span className="text-slate-300">/</span>
            <Link
              href={lang === DEFAULT_LOCALE ? "/discoveries" : `/${lang}/discoveries`}
              className="text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors hidden sm:inline"
            >
              {t.backToCatalog}
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <LanguageDropdown currentLang={lang} onSelectLang={setLang} />
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">{t.copied}</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{t.share}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full">
        {/* Back Link */}
        <Link
          href={lang === DEFAULT_LOCALE ? "/discoveries" : `/${lang}/discoveries`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backToCatalog}</span>
        </Link>

        {/* Article Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {enriched.isNobel ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                <Award className="w-3.5 h-3.5 text-amber-700" />
                <span>{t.nobelAwardLabel} ({enriched.nobelPrize?.year})</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>{t.discoveryYearLabel} {enriched.discoveryYear}</span>
              </span>
            )}

            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
              <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
              <span>{enriched.curriculumGrade}</span>
            </span>

            <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{enriched.readTime}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            {tr.title}
          </h1>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-6 font-normal">
            {tr.summary}
          </p>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
            <div>
              <span className="text-slate-400 block mb-0.5">{t.discovererLabel}</span>
              <span className="font-bold text-slate-900">👤 {enriched.discoverer}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">{t.subjectAndTopicLabel}</span>
              <span className="font-bold text-slate-900">
                📚 {enriched.curriculumSubject} — {enriched.curriculumTopic}
              </span>
            </div>
          </div>
        </div>

        {/* Nobel Banner (if applicable) */}
        {enriched.isNobel && enriched.nobelPrize && (
          <div className="bg-linear-to-r from-amber-50 via-amber-100/60 to-yellow-50 rounded-3xl border border-amber-200/80 p-6 sm:p-7 mb-8 shadow-xs">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-2xl bg-amber-500 text-white shrink-0 shadow-xs">
                <Award className="w-6 h-6" />
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-amber-950 uppercase tracking-wider">
                    {t.nobelBannerTitle} ({enriched.nobelPrize.year} — {enriched.nobelPrize.category})
                  </h3>
                </div>
                <p className="text-xs text-amber-900 font-medium">
                  <span className="font-bold">{t.laureatesLabel}</span> {enriched.nobelPrize.laureates.join(", ")}
                </p>
                {enriched.nobelPrize.citation ? (
                  <p className="text-xs text-amber-800 italic leading-relaxed pt-1 border-t border-amber-200/60">
                    &ldquo;{enriched.nobelPrize.citation}&rdquo;
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        )}

        {/* Section 1: Aha Moment / Eureka Story */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">{t.ahaMomentTitle}</h2>
          </div>
          <div className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed">
            <p>{tr.ahaMoment}</p>
          </div>
        </section>

        {/* Section 2: How It Works / Scientific Principle */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <BookOpen className="w-5 h-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">{t.howItWorksTitle}</h2>
          </div>
          <div className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed">
            <p>{tr.howItWorks}</p>
          </div>
        </section>

        {/* Section 3: Real World Impact */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">{t.impactTitle}</h2>
          </div>
          <div className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed">
            <p>{tr.realWorldImpact}</p>
          </div>
        </section>

        {/* Section 4: Curriculum Connection */}
        <section className="bg-linear-to-br from-indigo-50/70 to-blue-50/70 rounded-3xl border border-indigo-200/80 p-6 sm:p-8 shadow-xs mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-indigo-950">{t.curriculumTitle}</h2>
          </div>
          <div className="prose prose-indigo max-w-none text-indigo-950 text-sm sm:text-base leading-relaxed">
            <p>{tr.curriculumConnection}</p>
          </div>
        </section>

        {/* Section 5: Fast Facts */}
        {tr.funFacts && tr.funFacts.length > 0 && (
          <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-10">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span>🎯 {t.funFactsTitle}</span>
            </h2>
            <ul className="space-y-3">
              {tr.funFacts.map((fact, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Section 6: Interactive Pedagogical Quiz */}
        {enriched.quiz && enriched.quiz.length > 0 && (
          <section className="bg-white rounded-3xl border-2 border-blue-500/80 p-6 sm:p-8 shadow-md mb-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>{t.sitgVerified}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">{t.quizTitle}</h2>
                <p className="text-xs text-slate-500 mt-1">{t.quizSubtitle}</p>
              </div>

              {Object.keys(selectedAnswers).length > 0 && (
                <button
                  onClick={handleResetQuiz}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t.resetQuiz}</span>
                </button>
              )}
            </div>

            {/* Quiz Questions List */}
            <div className="space-y-8">
              {enriched.quiz.map((q, idx) => {
                const selected = selectedAnswers[q.id]
                const isAnswered = selected !== undefined
                const isCorrect = selected === q.correctOption

                return (
                  <div key={q.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                        {t.questionWord} {idx + 1} / 3 • {t.bloomLabel} {q.bloomLevel}
                      </span>
                      {isAnswered && (
                        <span
                          className={`inline-flex items-center gap-1 text-2xs font-bold px-2 py-0.5 rounded-full ${
                            isCorrect ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {isCorrect ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              {t.correctText}
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 text-rose-600" />
                              {t.incorrectText}
                            </>
                          )}
                        </span>
                      )}
                    </div>

                    <p className="text-sm sm:text-base font-bold text-slate-900 mb-4 leading-snug">
                      {q.question}
                    </p>

                    {/* Options */}
                    <div className="space-y-2 mb-4">
                      {q.options.map((opt) => {
                        const isOptionSelected = selected === opt.id
                        const isOptionCorrect = opt.id === q.correctOption

                        let optionStyle =
                          "bg-white border-slate-200 text-slate-800 hover:border-blue-400 hover:bg-blue-50/50"

                        if (isAnswered) {
                          if (isOptionCorrect) {
                            optionStyle = "bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold"
                          } else if (isOptionSelected && !isOptionCorrect) {
                            optionStyle = "bg-rose-50 border-rose-400 text-rose-900"
                          } else {
                            optionStyle = "bg-white border-slate-200 text-slate-400 opacity-60"
                          }
                        }

                        return (
                          <button
                            key={opt.id}
                            onClick={() => handleSelectAnswer(q.id, opt.id)}
                            className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 cursor-pointer ${optionStyle}`}
                          >
                            <span
                              className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                                isAnswered && isOptionCorrect
                                  ? "bg-emerald-600 text-white"
                                  : isAnswered && isOptionSelected
                                  ? "bg-rose-600 text-white"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {opt.id}
                            </span>
                            <span className="flex-1 pt-0.5 leading-relaxed">{opt.text}</span>
                          </button>
                        )
                      })}
                    </div>

                    {/* Pedagogical Explanation Box */}
                    {isAnswered && (
                      <div className="mt-3 p-3.5 rounded-xl bg-blue-50/80 border border-blue-200/80 text-xs text-blue-950 leading-relaxed flex items-start gap-2.5">
                        <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-blue-900 block mb-0.5">{t.pedagogicalExplanationLabel}</span>
                          <span>{q.explanation}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Quiz Summary Banner */}
            {allAnswered && (
              <div className="mt-8 p-4 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
                <div>
                  <h4 className="font-bold text-sm sm:text-base">{t.scoreSummary}</h4>
                  <p className="text-2xs sm:text-xs text-blue-100 mt-0.5">
                    {correctCount === 3
                      ? "Əla nəticə! Mövzunun konseptual mahiyyətini tam mənimsəmisiniz."
                      : "Yaxşı cəhddir! Dərslik mövzusu ilə təkrar tanış olaraq biliklərinizi möhkəmləndirə bilərsiniz."}
                  </p>
                </div>
                <Link
                  href={lang === DEFAULT_LOCALE ? "/open-tests" : `/${lang}/open-tests`}
                  className="px-4 py-2 bg-white text-blue-700 font-bold rounded-xl text-xs hover:bg-blue-50 transition-colors shrink-0 shadow-xs"
                >
                  {t.practiceButton}
                </Link>
              </div>
            )}
          </section>
        )}

        {/* Section 7: Related Discoveries */}
        {relatedDiscoveries && relatedDiscoveries.length > 0 && (
          <div className="border-t border-slate-200 pt-10">
            <h3 className="text-lg font-bold text-slate-900 mb-6">{t.relatedTitle}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedDiscoveries.map((rel) => {
                const relTr = rel.translations[lang] || rel.translations[DEFAULT_LOCALE] || rel.translations.az
                const relHref =
                  lang === DEFAULT_LOCALE ? `/discoveries/${rel.slug}` : `/${lang}/discoveries/${rel.slug}`

                return (
                  <Link
                    key={rel.id}
                    href={relHref}
                    className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-xs transition-all flex flex-col group"
                  >
                    <span className="text-2xs font-bold text-blue-600 mb-1">{getLocalizedGrade(rel.curriculumGrade, lang)}</span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                      {relTr.title}
                    </h4>
                    <span className="text-2xs text-slate-400 mt-auto flex items-center gap-1 font-medium">
                      <span>{t.readWord}</span>
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </main>

      <Footer lang={lang} />
    </div>
  )
}
