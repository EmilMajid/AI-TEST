"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Sparkles, Award, BookOpen, Clock, ChevronRight, CheckCircle2, Filter } from "lucide-react"
import { ScientificDiscovery, DiscoveryCategory } from "@/lib/discoveries-types"
import { LanguageDropdown, Lang } from "@/components/language-dropdown"
import { DEFAULT_LOCALE } from "@/lib/config"
import { Footer } from "@/components/layout/footer"
import { getLocalizedGrade, getLocalizedReadTime } from "@/lib/discoveries-enrichment"

interface DiscoveriesCatalogProps {
  discoveries: ScientificDiscovery[]
  initialLang?: Lang
}

export function DiscoveriesCatalog({ discoveries, initialLang = DEFAULT_LOCALE }: DiscoveriesCatalogProps) {
  const [lang, setLang] = useState<Lang>(initialLang)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedGrade, setSelectedGrade] = useState<string>("all")

  const t = useMemo(() => {
    const dict = {
      az: {
        pageTitle: "Elmi Kəşflər və İxtiralar Ensiklopediyası",
        pageSubtitle: "Bəşəriyyəti dəyişən 62 böyük elmi kəşf, 2020-2024 Nobel Mükafatları və məktəb kurikulumu ilə əlaqəli interaktiv sınaqlar.",
        heroBadge: "62 Fundamental Elmi Kəşf & Nobel İnqilabı",
        blogLink: "Bloq",
        openTestsLink: "Açıq Testlər",
        searchPlaceholder: "Kəşf, alim, Nobel və ya kurikulum mövzusu axtarın...",
        allCategories: "Bütün Kəşflər",
        nobelCategory: "🏆 Nobel Mükafatları",
        physicsCategory: "⚛️ Fizika",
        chemistryCategory: "🧪 Kimya",
        biologyCategory: "🧬 Biologiya",
        mathCategory: "📐 Riyaziyyat",
        csCategory: "💻 İnformatika",
        gradeFilterLabel: "Sinif üzrə:",
        allGrades: "Bütün Siniflər",
        readMore: "Kəşfi Oxu və Sınaqdan Keç",
        quizBadge: "3 Sual SİTG Sınağı",
        curriculumBadge: "Dərslik Mövzusu",
        resultsCount: "kəşf tapıldı",
        noResults: "Axtarışınıza uyğun elmi kəşf tapılmadı.",
        noResultsSub: "Axtarış sözünü dəyişdirin və ya filtrləri sıfırlayın.",
        resetFilters: "Bütün Kəşfləri Göstər",
        readMoreLabel: "Ətraflı",
        homeLink: "Ana Səhifə",
        discoveriesLink: "Elmi Kəşflər",
      },
      en: {
        pageTitle: "Scientific Discoveries & Inventions Encyclopedia",
        pageSubtitle: "62 monumental discoveries that shaped civilization, featuring recent Nobel Prizes (2020-2024) and curriculum-aligned interactive quizzes.",
        heroBadge: "62 Foundational Scientific Discoveries & Nobel Breakthroughs",
        blogLink: "Blog",
        openTestsLink: "Open Diagnostic Tests",
        searchPlaceholder: "Search discoveries, laureates, Nobel or curriculum topics...",
        allCategories: "All Discoveries",
        nobelCategory: "🏆 Nobel Prizes",
        physicsCategory: "⚛️ Physics",
        chemistryCategory: "🧪 Chemistry",
        biologyCategory: "🧬 Biology",
        mathCategory: "📐 Mathematics",
        csCategory: "💻 Computer Science",
        gradeFilterLabel: "By Grade:",
        allGrades: "All Grades",
        readMore: "Read Discovery & Take Quiz",
        quizBadge: "3-Question Quiz",
        curriculumBadge: "Curriculum Topic",
        resultsCount: "discoveries found",
        noResults: "No scientific discoveries match your criteria.",
        noResultsSub: "Change search keywords or reset active filters.",
        resetFilters: "Show All Discoveries",
        readMoreLabel: "Explore",
        homeLink: "Home",
        discoveriesLink: "Discoveries",
      },
      tr: {
        pageTitle: "Bilimsel Keşifler ve İcatlar Ansiklopedisi",
        pageSubtitle: "Uygarlığı değiştiren 62 anıtsal keşif, 2020-2024 Nobel Ödülleri ve müfredatla bağlantılı etkileşimli testler.",
        heroBadge: "62 Temel Bilimsel Keşif & Nobel Devrimi",
        blogLink: "Blog",
        openTestsLink: "Açık Sınavlar",
        searchPlaceholder: "Keşif, bilim insanı, Nobel veya müfredat konusu ara...",
        allCategories: "Tüm Keşifler",
        nobelCategory: "🏆 Nobel Ödülleri",
        physicsCategory: "⚛️ Fizik",
        chemistryCategory: "🧪 Kimya",
        biologyCategory: "🧬 Biyoloji",
        mathCategory: "📐 Matematik",
        csCategory: "💻 Bilişim",
        gradeFilterLabel: "Sınıf:",
        allGrades: "Tüm Sınıflar",
        readMore: "Keşfi İncele ve Testi Çöz",
        quizBadge: "3 Soruluk Test",
        curriculumBadge: "Müfredat Konusu",
        resultsCount: "keşif bulundu",
        noResults: "Aramanıza uygun bilimsel keşif bulunamadı.",
        noResultsSub: "Arama terimini değiştirin veya filtreleri sıfırlayın.",
        resetFilters: "Tüm Keşifleri Göster",
        readMoreLabel: "İncele",
        homeLink: "Ana Sayfa",
        discoveriesLink: "Keşifler",
      },
      ru: {
        title: "Энциклопедия научных открытий и изобретений",
        pageTitle: "Энциклопедия научных открытий и изобретений",
        pageSubtitle: "62 величайших открытия человечества, Нобелевские премии 2020-2024 годов и интерактивные тесты по школьной программе.",
        heroBadge: "62 фундаментальных научных открытия и прорыва",
        blogLink: "Блог",
        openTestsLink: "Открытые тесты",
        searchPlaceholder: "Поиск открытий, лауреатов, тем школьной программы...",
        allCategories: "Все открытия",
        nobelCategory: "🏆 Нобелевские премии",
        physicsCategory: "⚛️ Физика",
        chemistryCategory: "🧪 Химия",
        biologyCategory: "🧬 Биология",
        mathCategory: "📐 Математика",
        csCategory: "💻 Информатика",
        gradeFilterLabel: "Класс:",
        allGrades: "Все классы",
        readMore: "Читать и пройти тест",
        quizBadge: "Тест из 3 вопросов",
        curriculumBadge: "Тема программы",
        resultsCount: "открытий найдено",
        noResults: "По вашему запросу открытий не найдено.",
        noResultsSub: "Измените поисковый запрос или сбросьте фильтры.",
        resetFilters: "Показать все открытия",
        readMoreLabel: "Подробнее",
        homeLink: "Главная",
        discoveriesLink: "Открытия",
      },
    }
    return dict[lang] || dict[DEFAULT_LOCALE]
  }, [lang])

  const categories = [
    { id: "all", label: t.allCategories },
    { id: "nobel", label: t.nobelCategory },
    { id: "fizika", label: t.physicsCategory },
    { id: "kimya", label: t.chemistryCategory },
    { id: "biologiya", label: t.biologyCategory },
    { id: "riyaziyyat", label: t.mathCategory },
    { id: "informatika", label: t.csCategory },
  ]

  const grades = [
    { id: "all", label: t.allGrades },
    { id: "7", label: "7-ci sinif" },
    { id: "8", label: "8-ci sinif" },
    { id: "9", label: "9-cu sinif" },
    { id: "10", label: "10-cu sinif" },
    { id: "11", label: "11-ci sinif" },
  ]

  const filteredDiscoveries = useMemo(() => {
    return discoveries.filter((item) => {
      // Category filter
      if (selectedCategory === "nobel" && !item.isNobel) return false
      if (selectedCategory !== "all" && selectedCategory !== "nobel" && item.category !== selectedCategory) {
        return false
      }

      // Grade filter
      if (selectedGrade !== "all" && !item.curriculumGrade.includes(selectedGrade)) {
        return false
      }

      // Search query
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase()
        const tr = item.translations[lang] || item.translations[DEFAULT_LOCALE]
        const matchTitle = tr.title.toLowerCase().includes(query)
        const matchSummary = tr.summary.toLowerCase().includes(query)
        const matchDiscoverer = item.discoverer.toLowerCase().includes(query)
        const matchSubject = item.curriculumSubject.toLowerCase().includes(query)
        const matchTopic = item.curriculumTopic.toLowerCase().includes(query)
        const matchNobel = item.nobelPrize?.laureates.some((l) => l.toLowerCase().includes(query)) || false

        if (!matchTitle && !matchSummary && !matchDiscoverer && !matchSubject && !matchTopic && !matchNobel) {
          return false
        }
      }

      return true
    })
  }, [discoveries, selectedCategory, selectedGrade, searchQuery, lang])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={lang === DEFAULT_LOCALE ? "/" : `/${lang}`} className="flex items-center gap-2">
              <div className="relative h-8 w-8">
                <Image src="/logo.webp" alt="TESTAI.AZ" fill className="object-contain rounded-lg" />
              </div>
              <span className="font-bold text-slate-900 text-lg tracking-tight">TESTAI.AZ</span>
            </Link>
            <span className="hidden sm:inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {t.discoveriesLink}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <LanguageDropdown currentLang={lang} onSelectLang={setLang} />
            <Link
              href={lang === DEFAULT_LOCALE ? "/blog" : `/${lang}/blog`}
              className="text-xs font-medium text-slate-600 hover:text-blue-600 transition-colors hidden sm:inline"
            >
              {t.blogLink}
            </Link>
            <Link
              href={lang === DEFAULT_LOCALE ? "/open-tests" : `/${lang}/open-tests`}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-xs"
            >
              {t.openTestsLink}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-linear-to-b from-slate-950 via-slate-900 to-indigo-950 text-white py-14 sm:py-20 overflow-hidden border-b border-indigo-900/40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-600/15 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 text-blue-300 text-xs font-bold mb-5 border border-blue-400/30 shadow-xs backdrop-blur-xs">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>{t.heroBadge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4 max-w-4xl mx-auto text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
            {t.pageTitle}
          </h1>

          <p className="text-slate-200 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed mb-8 font-normal drop-shadow-xs">
            {t.pageSubtitle}
          </p>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/95 text-slate-900 text-sm placeholder-slate-400 focus:outline-hidden focus:ring-3 focus:ring-blue-400 shadow-lg border border-white/20"
            />
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-14 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat.id
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Grade Filter Dropdown */}
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                {t.gradeFilterLabel}
              </span>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="text-xs bg-slate-100 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                {grades.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Discoveries Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1">
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs sm:text-sm font-medium text-slate-600">
            <span className="font-bold text-slate-900">{filteredDiscoveries.length}</span> {t.resultsCount}
          </p>
        </div>

        {filteredDiscoveries.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800 mb-1">{t.noResults}</h3>
            <p className="text-sm text-slate-500 mb-4">{t.noResultsSub}</p>
            <button
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
                setSelectedGrade("all")
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors"
            >
              {t.resetFilters}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDiscoveries.map((discovery) => {
              const tr = discovery.translations[lang] || discovery.translations[DEFAULT_LOCALE] || discovery.translations.az
              const itemHref =
                lang === DEFAULT_LOCALE
                  ? `/discoveries/${discovery.slug}`
                  : `/${lang}/discoveries/${discovery.slug}`

              return (
                <article
                  key={discovery.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group"
                >
                  {/* Top Badge Strip */}
                  <div className="p-5 pb-3">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      {discovery.isNobel ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-2xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          <Award className="w-3 h-3 text-amber-700" />
                          <span>Nobel {discovery.nobelPrize?.year}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-2xs font-bold bg-slate-100 text-slate-700">
                          <span>{discovery.discoveryYear}</span>
                        </span>
                      )}

                      <span className="text-2xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                        {getLocalizedGrade(discovery.curriculumGrade, lang)}
                      </span>
                    </div>

                    <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug mb-2">
                      <Link href={itemHref}>{tr.title}</Link>
                    </h2>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-3">
                      {tr.summary}
                    </p>
                  </div>

                  {/* Curriculum & Discoverer Meta */}
                  <div className="mt-auto px-5 pb-4 pt-2 border-t border-slate-100 bg-slate-50/50">
                    <div className="flex items-center justify-between text-2xs text-slate-500 mb-3">
                      <span className="font-medium text-slate-700 truncate max-w-[180px]">
                        👤 {discovery.discoverer}
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3 h-3" />
                        {getLocalizedReadTime(discovery.readTime, lang)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 text-2xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {t.quizBadge}
                      </span>

                      <Link
                        href={itemHref}
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 group-hover:translate-x-0.5 transition-all"
                      >
                        <span>{t.readMoreLabel}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </main>

      <Footer lang={lang} />
    </div>
  )
}
