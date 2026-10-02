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
  ChevronRight,
} from "lucide-react"
import { LanguageDropdown, Lang } from "@/components/language-dropdown"
import { DEFAULT_LOCALE } from "@/lib/config"
import {
  OPEN_LANGUAGE_TESTS,
  ForeignLang,
  getAvailableGrades,
  getTestForGradeAndLang,
  GradeLanguageTest,
} from "@/lib/open-language-tests-data"

const FOREIGN_LANGUAGES: {
  code: ForeignLang
  names: Record<Lang, string>
  flag: string
}[] = [
  {
    code: "en",
    flag: "🇬🇧",
    names: {
      az: "İngilis dili",
      en: "English",
      tr: "İngilizce",
      ru: "Английский",
    },
  },
  {
    code: "de",
    flag: "🇩🇪",
    names: {
      az: "Alman dili",
      en: "German",
      tr: "Almanca",
      ru: "Немецкий",
    },
  },
  {
    code: "fr",
    flag: "🇫🇷",
    names: {
      az: "Fransız dili",
      en: "French",
      tr: "Fransızca",
      ru: "Французский",
    },
  },
  {
    code: "ru",
    flag: "🇷🇺",
    names: {
      az: "Rus dili",
      en: "Russian",
      tr: "Rusça",
      ru: "Русский",
    },
  },
]

interface OpenTestEngineProps {
  initialLang?: Lang
}

export function OpenTestEngine({ initialLang = DEFAULT_LOCALE }: OpenTestEngineProps) {
  const [uiLang, setUiLang] = useState<Lang>(initialLang)
  const availableGrades = getAvailableGrades()
  const [selectedGrade, setSelectedGrade] = useState<number>(5)
  const [selectedLang, setSelectedLang] = useState<ForeignLang>("en")

  // Current Test state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0)
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({})
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

  // Localized UI Dictionary
  const ui = {
    az: {
      topBadge: "Qeydiyyatsız Açıq Demo Sınaq",
      heroBadge: "Dərslik Əsaslı Xarici Dil Sınaqları",
      heroTitle: "Sinif və Xarici Dil Seçərək Dərhal Sınağa Başla!",
      heroSubtitle:
        "Heç bir qeydiyyat və şifrə tələb olunmur. İstədiyiniz sinfi və dili seçin, 1-ci bölmənin rəsmi dərslik suallarını həll edərək bilik səviyyənizi və AI diaqnostikanızı anında görün.",
      step1: "1. Sinifi Seçin:",
      gradeLabel: (g: number) => `${g}-ci Sinif`,
      step2: "2. Xarici Dili Seçin (4 Beynəlxalq Dil):",
      unitLabel: "1-ci Mövzu",
      questionOf: (curr: number, total: number) => `Sual ${curr} / ${total}`,
      bloomLevel: "Bloom Səviyyəsi:",
      prevBtn: "Əvvəlki",
      nextBtn: "Növbəti Sual",
      finishBtn: "Nəticəni Gör",
      scoreTitle: "Sınaq Nəticəniz:",
      completedSummary: (g: number, lName: string, correct: number, total: number) =>
        `${g}-ci sinif ${lName} üzrə 1-ci mövzunu tamamladınız. (${correct}/${total} doğru cavab)`,
      aiDiagnosisTitle: "Süni İntellekt (AI) Pedaqoji Diaqnozu:",
      aiHigh:
        "Əla göstərici! Şagird 1-ci bölmənin fundamental qrammatik qaydalarını və lüğət ehtiyatını yüksək dərəcədə mənimsəmişdir. Tətbiqetmə və təhlil refleksləri rəsmi kurikulum standartlarına tam cavab verir.",
      aiModerate:
        "Yaxşı cəhddir! Bəzi suallarda qrammatik fərqlər və ya tələffüz/məntiq incəliklərində tərəddüd müşahidə olunur. Mövzu təkrarı ilə nəticəni 100%-ə qaldırmaq mümkündür.",
      reviewTitle: "Sualların İzahlı Təhlili:",
      correctAnswerLabel: "Doğru cavab:",
      explanationLabel: "Pedaqoji izah:",
      ctaBadge: "Növbəti Addım",
      ctaTitle: "Bütün Mövzuları və Digər Fənləri İndi Açın!",
      ctaDesc:
        "Siz hazırda yalnız 1-ci mövzunu yoxladınız. Riyaziyyat, Azərbaycan dili, Tarix, Fizika, Kimya və xarici dillərin bütün qalan mövzuları üzrə minlərlə testi həll etmək üçün indi pulsuz qeydiyyatdan keçin.",
      signUpBtn: "Pulsuz Qeydiyyatdan Keç",
      retryBtn: "Yenidən Sına",
      blogLink: "Bloq",
      aboutLink: "Haqqımızda",
    },
    en: {
      topBadge: "Free Open Diagnostic Demo",
      heroBadge: "Curriculum-Aligned Foreign Language Tests",
      heroTitle: "Select Grade & Language to Start Testing Instantly!",
      heroSubtitle:
        "No registration or password required. Choose any grade and foreign language, solve Unit 1 curriculum questions, and receive instant AI diagnostic feedback.",
      step1: "1. Select Grade:",
      gradeLabel: (g: number) => `Grade ${g}`,
      step2: "2. Select Foreign Language (4 International Languages):",
      unitLabel: "Unit 1",
      questionOf: (curr: number, total: number) => `Question ${curr} of ${total}`,
      bloomLevel: "Bloom Cognitive Level:",
      prevBtn: "Previous",
      nextBtn: "Next Question",
      finishBtn: "View Diagnostic Results",
      scoreTitle: "Your Test Result:",
      completedSummary: (g: number, lName: string, correct: number, total: number) =>
        `Completed Unit 1 for Grade ${g} ${lName}. (${correct}/${total} correct answers)`,
      aiDiagnosisTitle: "Artificial Intelligence (AI) Pedagogical Diagnosis:",
      aiHigh:
        "Outstanding achievement! The student demonstrates strong mastery of foundational grammar and vocabulary for Unit 1. Cognitive application and analytical skills align with curriculum standards.",
      aiModerate:
        "Good effort! Slight hesitation observed in nuanced grammatical applications. Targeted reinforcement of Unit 1 will easily elevate retention to 100%.",
      reviewTitle: "Detailed Question Analysis:",
      correctAnswerLabel: "Correct answer:",
      explanationLabel: "Pedagogical explanation:",
      ctaBadge: "Next Step",
      ctaTitle: "Unlock All Units & Complete School Subjects!",
      ctaDesc:
        "You have only tested Unit 1. To access thousands of questions across Mathematics, Sciences, Humanities, and advanced language units, create a free account today.",
      signUpBtn: "Sign Up for Free",
      retryBtn: "Try Again",
      blogLink: "Blog",
      aboutLink: "About Us",
    },
    tr: {
      topBadge: "Kayıtsız Ücretsiz Deneme Sınavı",
      heroBadge: "Müfredat Tabanlı Yabancı Dil Sınavları",
      heroTitle: "Sınıf ve Yabancı Dil Seçerek Hemen Sınava Başlayın!",
      heroSubtitle:
        "Kayıt veya şifre gerekmez. İstediğiniz sınıfı ve yabancı dili seçin, 1. ünite ders kitabı sorularını çözerek anında yapay zeka analizini görün.",
      step1: "1. Sınıfı Seçin:",
      gradeLabel: (g: number) => `${g}. Sınıf`,
      step2: "2. Yabancı Dili Seçin (4 Uluslararası Dil):",
      unitLabel: "1. Ünite",
      questionOf: (curr: number, total: number) => `Soru ${curr} / ${total}`,
      bloomLevel: "Bloom Taksonomisi:",
      prevBtn: "Önceki",
      nextBtn: "Sonraki Soru",
      finishBtn: "Sonucu Gör",
      scoreTitle: "Sınav Sonucunuz:",
      completedSummary: (g: number, lName: string, correct: number, total: number) =>
        `${g}. sınıf ${lName} 1. üniteyi tamamladınız. (${correct}/${total} doğru cevap)`,
      aiDiagnosisTitle: "Yapay Zeka (AI) Pedagojik Teşhisi:",
      aiHigh:
        "Harika performans! Öğrenci 1. ünitenin temel dilbilgisi kurallarını ve kelime dağarcığını üst düzeyde kavramış durumdadır. Analiz refleksleri müfredat standartlarıyla tam örtüşmektedir.",
      aiModerate:
        "Güzel bir deneme! Bazı sorularda kavramsal ince ayrıntılarda tereddüt gözlemlendi. Kısa bir konu tekrarı ile başarı rahatlıkla %100'e taşınabilir.",
      reviewTitle: "Soruların Açıklamalı İncelemesi:",
      correctAnswerLabel: "Doğru cevap:",
      explanationLabel: "Pedagojik açıklama:",
      ctaBadge: "Sonraki Adım",
      ctaTitle: "Tüm Üniteleri ve Diğer Dersleri Şimdi Açın!",
      ctaDesc:
        "Şu anda sadece 1. üniteyi denediniz. Matematik, Fen, Edebiyat ve yabancı dillerin tüm kalan ünitelerindeki binlerce soruya ulaşmak için ücretsiz üye olun.",
      signUpBtn: "Ücretsiz Kayıt Olun",
      retryBtn: "Tekrar Dene",
      blogLink: "Blog",
      aboutLink: "Hakkımızda",
    },
    ru: {
      topBadge: "Открытый демо-тест без регистрации",
      heroBadge: "Тесты по иностранным языкам по учебникам",
      heroTitle: "Выберите класс и язык, чтобы начать тест прямо сейчас!",
      heroSubtitle:
        "Регистрация и пароль не требуются. Выберите любой класс и иностранный язык, решите вопросы темы 1 и мгновенно получите диагностику ИИ.",
      step1: "1. Выберите класс:",
      gradeLabel: (g: number) => `${g} класс`,
      step2: "2. Выберите иностранный язык (4 международных языка):",
      unitLabel: "Тема 1",
      questionOf: (curr: number, total: number) => `Вопрос ${curr} из ${total}`,
      bloomLevel: "Уровень Блума:",
      prevBtn: "Назад",
      nextBtn: "Следующий вопрос",
      finishBtn: "Посмотреть результат",
      scoreTitle: "Ваш результат:",
      completedSummary: (g: number, lName: string, correct: number, total: number) =>
        `Вы завершили тему 1 по предмету ${lName} (${g} класс). (${correct}/${total} правильных ответов)`,
      aiDiagnosisTitle: "Педагогическая диагностика ИИ:",
      aiHigh:
        "Отличный результат! Учащийся демонстрирует уверенное владение базовой грамматикой и словарным запасом темы 1. Аналитические навыки соответствуют стандартам куррикулума.",
      aiModerate:
        "Хорошая попытка! Замечены небольшие колебания в сложных грамматических конструкциях. Повторение материала позволит легко достичь 100%.",
      reviewTitle: "Подробный разбор вопросов:",
      correctAnswerLabel: "Правильный ответ:",
      explanationLabel: "Педагогическое пояснение:",
      ctaBadge: "Следующий шаг",
      ctaTitle: "Откройте все темы и остальные школьные предметы!",
      ctaDesc:
        "Вы протестировали только тему 1. Чтобы получить доступ к тысячам тестов по математике, точным и гуманитарным наукам, зарегистрируйтесь бесплатно.",
      signUpBtn: "Зарегистрироваться бесплатно",
      retryBtn: "Попробовать снова",
      blogLink: "Блог",
      aboutLink: "О нас",
    },
  }[uiLang]

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

  // Language name in selected UI lang
  const currentForeignLangItem = FOREIGN_LANGUAGES.find((f) => f.code === selectedLang)
  const localizedForeignLangName =
    currentForeignLangItem?.names[uiLang] || activeTest.languageName

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Top Bar with Language Selector */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap justify-between items-center gap-4">
          <Link
            href={uiLang === DEFAULT_LOCALE ? "/" : `/${uiLang}`}
            className="flex items-center gap-2 text-primary font-bold text-lg hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>TESTAI.AZ</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {ui.topBadge}
            </span>
            <Link
              href={uiLang === DEFAULT_LOCALE ? "/blog" : `/${uiLang}/blog`}
              className="text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors hidden md:inline-block"
            >
              {ui.blogLink}
            </Link>
            <Link
              href={uiLang === DEFAULT_LOCALE ? "/about" : `/${uiLang}/about`}
              className="text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors hidden md:inline-block"
            >
              {ui.aboutLink}
            </Link>
            {/* Multilingual Switcher (AZ, EN, TR, RU) */}
            <LanguageDropdown currentLang={uiLang} onSelectLang={setUiLang} />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
        {/* Hero Card */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-blue-200 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              <span>{ui.heroBadge}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {ui.heroTitle}
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 font-light leading-relaxed">
              {ui.heroSubtitle}
            </p>
          </div>
        </div>

        {/* Grade & Language Selectors */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-7 space-y-5">
          {/* 1. Sinif Seçimi */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              {ui.step1}
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
                    {ui.gradeLabel(g)}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 2. Dil Seçimi */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              {ui.step2}
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
                    <span>{langItem.names[uiLang]}</span>
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
                    {ui.gradeLabel(activeTest.grade)} | {localizedForeignLangName}
                  </span>
                </div>
                <p className="text-xs text-blue-600 font-medium mt-0.5">
                  {activeTest.unitName}: {activeTest.topicTitle} ({ui.unitLabel})
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
                <span>{ui.questionOf(currentQuestionIndex + 1, questions.length)}</span>
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
                <span>{ui.bloomLevel} {currentQuestion.bloomLevel}</span>
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
                {ui.prevBtn}
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={userAnswers[currentQuestionIndex] === undefined}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-sm flex items-center gap-1.5"
              >
                <span>
                  {currentQuestionIndex === questions.length - 1 ? ui.finishBtn : ui.nextBtn}
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
                {ui.scoreTitle} {scorePercent}%
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                {ui.completedSummary(activeTest.grade, localizedForeignLangName, correctCount, questions.length)}
              </p>
            </div>

            {/* AI Diagnostic Breakdown */}
            <div className="bg-gradient-to-br from-blue-50/70 to-indigo-50/60 border border-blue-100 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>{ui.aiDiagnosisTitle}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {scorePercent >= 80 ? ui.aiHigh : ui.aiModerate}
              </p>
            </div>

            {/* Detailed Answers Review */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                {ui.reviewTitle}
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
                          <strong>{ui.correctAnswerLabel}</strong> {q.options[q.correctIndex]}
                        </p>
                        <p className="text-slate-500 italic">
                          <strong>{ui.explanationLabel}</strong> {q.explanation}
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
                  {ui.ctaBadge}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {ui.ctaTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                  {ui.ctaDesc}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/register"
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs sm:text-sm text-white transition-all shadow-md flex items-center gap-2"
                >
                  <span>{ui.signUpBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 font-semibold text-xs sm:text-sm text-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{ui.retryBtn}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Educational Standards & Pedagogical Context Box */}
        <div className="mt-12 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600 shrink-0" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {uiLang === "az" && "Bu Açıq Sınaqlar Nəyi Ölçür və Necə Qiymətləndirilir?"}
              {uiLang === "en" && "What Do These Open Diagnostic Tests Measure?"}
              {uiLang === "tr" && "Bu Açık Deneme Sınavları Neyi Ölçer ve Nasıl Değerlendirilir?"}
              {uiLang === "ru" && "Что измеряют эти открытые диагностические тесты?"}
            </h3>
          </div>
          <div className="grid md:grid-cols-3 gap-5 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
              <h4 className="font-bold text-slate-900">
                {uiLang === "az" && "1. CEFR & Dərslik Uyğunluğu"}
                {uiLang === "en" && "1. CEFR & Curriculum Alignment"}
                {uiLang === "tr" && "1. CEFR ve Müfredat Uyumu"}
                {uiLang === "ru" && "1. CEFR и соответствие учебникам"}
              </h4>
              <p>
                {uiLang === "az" && "Suallar e-derslik.edu.az portalında dərc olunan 1-11-ci sinif dərsliklərinə və Avropa Şurasının CEFR (A1-B2) beynəlxalq dil standartlarına tam uyğundur."}
                {uiLang === "en" && "Items are calibrated to official textbooks on e-derslik.edu.az and Council of Europe CEFR (A1–B2) international language proficiency benchmarks."}
                {uiLang === "tr" && "Sorular, e-derslik.edu.az portalındaki resmi ders kitaplarına ve Avrupa Konseyi CEFR (A1-B2) standartlarına tam uyumludur."}
                {uiLang === "ru" && "Задания соответствуют официальным учебникам с портала e-derslik.edu.az и международной шкале владения языком CEFR (A1–B2)."}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
              <h4 className="font-bold text-slate-900">
                {uiLang === "az" && "2. Elmi Distraktorlar (SİTG)"}
                {uiLang === "en" && "2. Pedagogical Distractor Engineering"}
                {uiLang === "tr" && "2. Pedagojik Çeldiriciler (SİTG)"}
                {uiLang === "ru" && "2. Педагогические дистракторы (SITG)"}
              </h4>
              <p>
                {uiLang === "az" && "Yanlış variantlar təsadüfi deyil; şagirdlərin ən çox yol verdiyi tipik qrammatik və orfoqrafik xətalara əsaslanaraq dərindən analiz aparmağa imkan verir."}
                {uiLang === "en" && "Distractors are systematically engineered around authentic learner cognitive pitfalls and grammar confusions rather than arbitrary tricks."}
                {uiLang === "tr" && "Yanlış seçenekler rastgele değil; öğrencilerin en sık yaptığı dilbilgisi ve imla hatalarına göre bilimsel olarak modellenmiştir."}
                {uiLang === "ru" && "Неверные варианты ответов основаны на типичных грамматических и лексических ошибках учащихся, что обеспечивает точную диагностику."}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
              <h4 className="font-bold text-slate-900">
                {uiLang === "az" && "3. Formativ Diaqnostika"}
                {uiLang === "en" && "3. Formative Remediation"}
                {uiLang === "tr" && "3. Biçimlendirici Teşhis"}
                {uiLang === "ru" && "3. Формативная диагностика"}
              </h4>
              <p>
                {uiLang === "az" && "Sınaq cəzalandırıcı qiymət deyil, şagirdin zəif tərəflərini bir neçə dəqiqə ərzində göstərib 15 dəqiqəlik hədəfli təkrar ilə nəticəni bərpa edən bələdçidir."}
                {uiLang === "en" && "Rather than a punitive grade, the test serves as a formative mirror that isolates prerequisite gaps and prescribes 15-minute targeted remediation."}
                {uiLang === "tr" && "Sınav cezalandırıcı bir not vermek için değil; eksik noktayı hızla tespit edip 15 dakikalık odaklı tekrarla başarıyı artırmak içindir."}
                {uiLang === "ru" && "Тест не ставит карательную оценку, а быстро выявляет пробелы и дает ориентир для 15-минутного точечного повторения материала."}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
