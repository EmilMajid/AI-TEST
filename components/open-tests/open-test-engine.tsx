"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Sparkles,
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
} from "lucide-react"
import {
  OPEN_LANGUAGE_TESTS,
  ForeignLang,
  getAvailableGrades,
  getTestForGradeAndLang,
  GradeLanguageTest,
} from "@/lib/open-language-tests-data"

const FOREIGN_LANGUAGES: { code: ForeignLang; name: string; flag: string }[] = [
  { code: "en", name: "İngilis dili", flag: "🇬🇧" },
  { code: "de", name: "Alman dili", flag: "🇩🇪" },
  { code: "fr", name: "Fransız dili", flag: "🇫🇷" },
  { code: "ru", name: "Rus dili", flag: "🇷🇺" },
]

export function OpenTestEngine() {
  const availableGrades = getAvailableGrades()
  const [selectedGrade, setSelectedGrade] = useState<number>(5)
  const [selectedLang, setSelectedLang] = useState<ForeignLang>("en")

  // Current Test state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0)
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({})
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

  // Find active test or fallback
  const activeTest: GradeLanguageTest =
    getTestForGradeAndLang(selectedGrade, selectedLang) ||
    OPEN_LANGUAGE_TESTS.find((t) => t.language === selectedLang) ||
    OPEN_LANGUAGE_TESTS[0]

  const questions = activeTest.questions
  const currentQuestion = questions[currentQuestionIndex]

  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted) return
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionIndex,
    }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      setIsSubmitted(true)
    }
  }

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const handleReset = () => {
    setUserAnswers({})
    setCurrentQuestionIndex(0)
    setIsSubmitted(false)
  }

  const handleGradeChange = (grade: number) => {
    setSelectedGrade(grade)
    handleReset()
  }

  const handleLangChange = (lang: ForeignLang) => {
    setSelectedLang(lang)
    handleReset()
  }

  // Calculate score
  const correctCount = questions.filter(
    (q, idx) => userAnswers[idx] === q.correctIndex
  ).length
  const scorePercent = Math.round((correctCount / questions.length) * 100)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Top Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap justify-between items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-primary font-bold text-lg hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>TESTAI.AZ</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Qeydiyyatsız Açıq Demo Sınaq
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
        {/* Hero Card */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-blue-200 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              <span>Dərslik Əsaslı Xarici Dil Sınaqları</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Sinif və Xarici Dil Seçərək Dərhal Sınağa Başla!
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 font-light leading-relaxed">
              Heç bir qeydiyyat və şifrə tələb olunmur. İstədiyiniz sinfi və dili seçin, 1-ci bölmənin rəsmi dərslik suallarını həll edərək bilik səviyyənizi və AI diaqnostikanızı anında görün.
            </p>
          </div>
        </div>

        {/* Grade & Language Selectors */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-7 space-y-5">
          {/* Sinif Seçimi */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              1. Sinifi Seçin:
            </label>
            <div className="flex flex-wrap gap-2">
              {availableGrades.map((g) => {
                const isSelected = selectedGrade === g
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => handleGradeChange(g)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-sm scale-105"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {g}-ci Sinif
                  </button>
                )
              })}
            </div>
          </div>

          {/* Dil Seçimi */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              2. Xarici Dili Seçin (4 Beynəlxalq Dil):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {FOREIGN_LANGUAGES.map((langItem) => {
                const isSelected = selectedLang === langItem.code
                return (
                  <button
                    key={langItem.code}
                    type="button"
                    onClick={() => handleLangChange(langItem.code)}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-blue-50/80 border-blue-500 text-blue-800 shadow-xs scale-102"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-xl">{langItem.flag}</span>
                    <span>{langItem.name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Active Test Card / Test Engine */}
        {!isSubmitted ? (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-6">
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{activeTest.flag}</span>
                  <span className="font-extrabold text-slate-900 text-base sm:text-lg">
                    {activeTest.grade}-ci Sinif | {activeTest.languageName}
                  </span>
                </div>
                <p className="text-xs text-blue-600 font-medium mt-0.5">
                  {activeTest.unitName}: {activeTest.topicTitle} (1-ci Mövzu)
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
                <span>Sual {currentQuestionIndex + 1} / {questions.length}</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-300"
                style={{
                  width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                }}
              />
            </div>

            {/* Question Stem */}
            <div className="space-y-3 pt-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[11px] font-semibold border border-amber-200">
                <BookOpen className="w-3 h-3 text-amber-600" />
                <span>Bloom Səviyyəsi: {currentQuestion.bloomLevel}</span>
              </div>

              <h2 className="text-base sm:text-xl font-bold text-slate-900 leading-snug whitespace-pre-line">
                {currentQuestion.question}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-2.5 pt-2">
              {currentQuestion.options.map((opt, optIdx) => {
                const isSelected = userAnswers[currentQuestionIndex] === optIdx
                const optionLetter = String.fromCharCode(65 + optIdx) // A, B, C, D

                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full flex items-center justify-between p-3.5 sm:p-4 rounded-xl border text-left text-xs sm:text-sm transition-all cursor-pointer ${
                      isSelected
                        ? "bg-blue-50 border-blue-600 text-blue-900 font-bold shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                          isSelected
                            ? "bg-blue-600 text-white"
                            : "bg-white text-slate-600 border border-slate-200"
                        }`}
                      >
                        {optionLetter}
                      </span>
                      <span>{opt}</span>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Nav buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                Əvvəlki
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={userAnswers[currentQuestionIndex] === undefined}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-sm flex items-center gap-1.5"
              >
                <span>
                  {currentQuestionIndex === questions.length - 1 ? "Nəticəni Gör" : "Növbəti Sual"}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Result Screen */
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-10 space-y-8 animate-in fade-in-50 duration-200">
            <div className="text-center max-w-md mx-auto space-y-3">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
                <Award className="w-8 h-8" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Sınaq Nəticəniz: {scorePercent}%
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                {activeTest.grade}-ci sinif {activeTest.languageName} üzrə 1-ci mövzunu tamamladınız. ({correctCount}/{questions.length} doğru cavab)
              </p>
            </div>

            {/* AI Diagnostic Breakdown */}
            <div className="bg-gradient-to-br from-blue-50/70 to-indigo-50/60 border border-blue-100 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Süni İntellekt (AI) Pedaqoji Diaqnozu:</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {scorePercent >= 80
                  ? "Əla göstərici! Şagird 1-ci bölmənin fundamental qrammatik qaydalarını və lüğət ehtiyatını yüksək dərəcədə mənimsəmişdir. Tətbiqetmə və təhlil refleksləri rəsmi kurikulum standartlarına tam cavab verir."
                  : "Yaxşı cəhddir! Bəzi suallarda qrammatik fərqlər və ya tələffüz/məntiq incəliklərində tərəddüd müşahidə olunur. Mövzu təkrarı ilə nəticəni 100%-ə qaldırmaq mümkündür."}
              </p>
            </div>

            {/* Detailed Answers Review */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Sualların İzahlı Təhlili:
              </h3>
              <div className="space-y-3">
                {questions.map((q, idx) => {
                  const isCorrect = userAnswers[idx] === q.correctIndex
                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-xl border text-xs sm:text-sm space-y-2 ${
                        isCorrect
                          ? "bg-emerald-50/50 border-emerald-200"
                          : "bg-red-50/50 border-red-200"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-semibold text-slate-900 flex items-start gap-2">
                          {isCorrect ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                          )}
                          <span>
                            {idx + 1}. {q.question}
                          </span>
                        </div>
                      </div>

                      <div className="pl-6 space-y-1 text-xs">
                        <p className="text-slate-600">
                          <strong>Doğru cavab:</strong> {q.options[q.correctIndex]}
                        </p>
                        <p className="text-slate-500 italic">
                          <strong>Pedaqoji izah:</strong> {q.explanation}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* HIGH CONVERSION CALL TO ACTION */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
                  Növbəti Addım
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Bütün Mövzuları və Digər Fənləri İndi Açın!
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                  Siz hazırda yalnız 1-ci mövzunu yoxladınız. Riyaziyyat, Azərbaycan dili, Tarix, Fizika, Kimya və xarici dillərin <strong>bütün qalan mövzuları</strong> üzrə minlərlə testi həll etmək və Valideyn/Şagird Analitikasını izləmək üçün dərhal qeydiyyatdan keçin.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/register"
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs sm:text-sm text-white transition-all shadow-md flex items-center gap-2"
                >
                  <span>Pulsuz Qeydiyyatdan Keç</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 font-semibold text-xs sm:text-sm text-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Yenidən Sına</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
