"use client"

import Link from "next/link"
import { BookOpen, Clock, ArrowRight, Sparkles, Tag } from "lucide-react"
import { Lang } from "@/components/language-dropdown"
import { BLOG_POSTS } from "@/lib/blog-data"
import { DEFAULT_LOCALE } from "@/lib/config"

interface HomeFeaturedPostsProps {
  lang: Lang
}

const FEATURED_SLUGS = [
  "rag-in-education-eliminating-ai-hallucinations-via-textbook-anchoring",
  "kag-knowledge-graphs-cross-subject-prerequisite-mapping",
  "backward-knowledge-mapping-retroactive-cognitive-diagnosis",
  "parent-diagnostic-guide-academic-tracking-grade-anxiety",
]

const UI_TEXTS = {
  az: {
    badge: "ELMİ TƏDQİQATLAR VƏ METODOLOGİYA",
    title: "Pedaqoji Bloq və Təhsil Tədqiqatları",
    subtitle:
      "TESTAI.AZ elmi qrupu tərəfindən hazırlanmış süni intellekt testologiyası, RAG arxitekturası və valideyn bələdçiləri.",
    viewAll: "Bütün 15 Məqaləni Oxu",
    readMore: "Məqaləni oxu",
  },
  en: {
    badge: "EDUCATIONAL RESEARCH & METHODOLOGY",
    title: "Pedagogical Blog & Academic Research",
    subtitle:
      "Original papers and operational guides on curriculum RAG, cognitive Bloom taxonomies, and parent diagnostic intelligence.",
    viewAll: "Explore All 15 Articles",
    readMore: "Read article",
  },
  tr: {
    badge: "BİLİMSEL ARAŞTIRMALAR VE METODOLOJİ",
    title: "Pedagojik Blog ve Eğitim Araştırmaları",
    subtitle:
      "Müfredat temelli RAG, KAG kavram haritaları ve veli teşhis rehberleri üzerine kapsamlı pedagojik makaleler.",
    viewAll: "Tüm 15 Makaleyi İncele",
    readMore: "Makaleyi oku",
  },
  ru: {
    badge: "НАУЧНЫЕ ИССЛЕДОВАНИЯ И МЕТОДОЛОГИЯ",
    title: "Педагогический блог и научные исследования",
    subtitle:
      "Исследования Института TESTAI.AZ по архитектуре RAG, когнитивным таксономиям Блума и практической диагностике.",
    viewAll: "Читать все 15 статей",
    readMore: "Читать статью",
  },
}

export function HomeFeaturedPosts({ lang }: HomeFeaturedPostsProps) {
  const ui = UI_TEXTS[lang] || UI_TEXTS.en
  const blogLink = lang === DEFAULT_LOCALE ? "/blog" : `/${lang}/blog`

  const featuredPosts = BLOG_POSTS.filter((post) => FEATURED_SLUGS.includes(post.slug))

  return (
    <section className="mb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/70 text-blue-800 text-xs font-bold uppercase tracking-wider mb-2 border border-blue-200/50">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>{ui.badge}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {ui.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            {ui.subtitle}
          </p>
        </div>

        <Link
          href={blogLink}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors self-start sm:self-auto shrink-0"
        >
          <span>{ui.viewAll}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {featuredPosts.map((post) => {
          const tr = post.translations[lang] || post.translations[DEFAULT_LOCALE] || post.translations.az
          const articleUrl =
            lang === DEFAULT_LOCALE ? `/blog/${post.slug}` : `/${lang}/blog/${post.slug}`

          return (
            <article
              key={post.slug}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group hover:border-blue-300"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-semibold text-[11px]">
                    <BookOpen className="w-3.5 h-3.5" />
                    {tr.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-slate-600 text-xs font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    {tr.readTime}
                  </span>
                </div>

                <h4 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                  <Link href={articleUrl}>{tr.title}</Link>
                </h4>

                <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                  {tr.summary}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-200/80 px-2 py-0.5 rounded-md"
                    >
                      <Tag className="w-2.5 h-2.5" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-600">{post.publishDate}</span>
                <Link
                  href={articleUrl}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>{ui.readMore}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
