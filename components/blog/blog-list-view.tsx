"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, BookOpen, Clock, Tag, Sparkles, ChevronRight } from "lucide-react"
import { LanguageDropdown, Lang } from "@/components/language-dropdown"
import { BLOG_POSTS } from "@/lib/blog-data"
import { DEFAULT_LOCALE } from "@/lib/config"

interface BlogListViewProps {
  initialLang?: Lang
}

export function BlogListView({ initialLang = DEFAULT_LOCALE }: BlogListViewProps) {
  const [lang, setLang] = useState<Lang>(initialLang)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const uiTexts = {
    az: {
      tagline: "Elmi-Pedaqoji Tədqiqatlar və Bələdçilər",
      title: "TESTAI.AZ Bloq və Metodologiya",
      subtitle:
        "Süni intellekt əsaslı müasir testologiya, SİTG standartı, dərslik inteqrasiyası və müəllim-şagird inkişaf bələdçiləri.",
      allTags: "Bütün Mövzular",
      readArticle: "Məqaləni oxu",
      publishedOn: "Nəşr tarixi",
    },
    en: {
      tagline: "Educational Research & Methodological Insights",
      title: "TESTAI.AZ Blog & Methodology",
      subtitle:
        "Deep dives into AI test generation standards, Bloom's cognitive taxonomy, diagnostic assessment, and modern educational psychology.",
      allTags: "All Topics",
      readArticle: "Read full article",
      publishedOn: "Published on",
    },
    tr: {
      tagline: "Bilimsel ve Pedagojik Araştırmalar",
      title: "TESTAI.AZ Blog ve Metodoloji",
      subtitle:
        "Yapay zeka destekli yeni nesil testoloji, SİTG standardı, pedagojik teşhis ve öğretmen-öğrenci rehberleri.",
      allTags: "Tüm Konular",
      readArticle: "Makaleyi oku",
      publishedOn: "Yayın tarihi",
    },
    ru: {
      tagline: "Научно-педагогические исследования и руководства",
      title: "Блог и методология TESTAI.AZ",
      subtitle:
        "Современная тестология на базе искусственного интеллекта, стандарт SITG, таксономия Блума и практические рекомендации для педагогов.",
      allTags: "Все темы",
      readArticle: "Читать статью",
      publishedOn: "Дата публикации",
    },
  }[lang]

  const allTags = Array.from(new Set(BLOG_POSTS.flatMap((p) => p.tags)))

  const filteredPosts = selectedTag
    ? BLOG_POSTS.filter((p) => p.tags.includes(selectedTag))
    : BLOG_POSTS

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap justify-between items-center gap-4">
          <Link
            href={lang === DEFAULT_LOCALE ? "/" : `/${lang}`}
            className="flex items-center gap-2 text-primary font-bold text-lg hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>TESTAI.AZ</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href={lang === DEFAULT_LOCALE ? "/about" : `/${lang}/about`}
              className="text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors hidden sm:inline-block"
            >
              {lang === "az" ? "Haqqımızda" : lang === "tr" ? "Hakkımızda" : lang === "ru" ? "О нас" : "About"}
            </Link>
            <LanguageDropdown currentLang={lang} onSelectLang={setLang} />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div className="bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-semibold uppercase tracking-wider text-blue-200">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              <span>{uiTexts.tagline}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              {uiTexts.title}
            </h1>
            <p className="text-base sm:text-lg text-blue-100 font-light leading-relaxed">
              {uiTexts.subtitle}
            </p>
          </div>
        </div>

        {/* Tags filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer ${
              selectedTag === null
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            {uiTexts.allTags}
          </button>
          {allTags.map((tag) => {
            const isSelected = selectedTag === tag
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                #{tag}
              </button>
            )
          })}
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredPosts.map((post) => {
            const tr = post.translations[lang] || post.translations.az
            const articleLink = lang === "az" ? `/blog/${post.slug}` : `/${lang}/blog/${post.slug}`
            return (
              <article
                key={post.slug}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group hover:border-blue-300"
              >
                <div className="p-6 sm:p-8 space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-semibold">
                      <BookOpen className="w-3.5 h-3.5" />
                      {tr.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      {tr.readTime}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                    <Link href={articleLink}>
                      {tr.title}
                    </Link>
                  </h2>

                  <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                    {tr.summary}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md"
                      >
                        <Tag className="w-2.5 h-2.5" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="px-6 sm:px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800 leading-none">
                        {post.author.name}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {post.publishDate}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={articleLink}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <span>{uiTexts.readArticle}</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      </main>
    </div>
  )
}
