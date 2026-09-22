import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { BlogListView } from "@/components/blog/blog-list-view"
import { Lang } from "@/components/language-dropdown"

const VALID_LANGS: Lang[] = ["az", "en", "tr", "ru"]

interface PageProps {
  params: { lang: string }
}

export function generateStaticParams() {
  return VALID_LANGS.map((lang) => ({ lang }))
}

export function generateMetadata({ params }: PageProps): Metadata {
  const lang = params.lang as Lang
  if (!VALID_LANGS.includes(lang)) {
    return { title: "TESTAI.AZ" }
  }

  const titles: Record<Lang, string> = {
    az: "Bloq və Pedaqoji Metodologiya | TESTAI.AZ",
    en: "Educational Research & AI Methodology Blog | TESTAI.AZ",
    tr: "Blog ve Pedagojik Metodoloji | TESTAI.AZ",
    ru: "Блог и педагогическая методология | TESTAI.AZ",
  }

  const descriptions: Record<Lang, string> = {
    az: "Süni intellekt əsaslı müasir testologiya, SİTG standartı, dərslik inteqrasiyası və müəllim-şagird inkişaf bələdçiləri.",
    en: "Explore research on AI test generation standards, Bloom's cognitive taxonomy, diagnostic assessment, and modern educational psychology.",
    tr: "Yapay zeka destekli yeni nesil testoloji, SİTG standardı, pedagojik teşhis ve öğretmen-öğrenci rehberleri.",
    ru: "Современная тестология на базе ИИ, стандарт SITG, таксономия Блума и практические рекомендации для педагогов.",
  }

  return {
    title: titles[lang],
    description: descriptions[lang],
    alternates: {
      canonical: `https://testai.az/${lang}/blog`,
      languages: {
        az: "https://testai.az/blog",
        en: "https://testai.az/en/blog",
        tr: "https://testai.az/tr/blog",
        ru: "https://testai.az/ru/blog",
        "x-default": "https://testai.az/blog",
      },
    },
  }
}

export default function MultilingualBlogPage({ params }: PageProps) {
  const lang = params.lang as Lang
  if (!VALID_LANGS.includes(lang)) {
    notFound()
  }

  return <BlogListView initialLang={lang} />
}
