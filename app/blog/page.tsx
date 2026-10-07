import type { Metadata } from "next"
import { BlogListView } from "@/components/blog/blog-list-view"
import { DEFAULT_LOCALE } from "@/lib/config"
import { Lang } from "@/components/language-dropdown"

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

export const metadata: Metadata = {
  title: titles[DEFAULT_LOCALE],
  description: descriptions[DEFAULT_LOCALE],
  alternates: {
    canonical: "https://www.testai.az/blog",
    languages: {
      az: "https://www.testai.az/az/blog",
      en: "https://www.testai.az/blog",
      tr: "https://www.testai.az/tr/blog",
      ru: "https://www.testai.az/ru/blog",
      "x-default": "https://www.testai.az/blog",
    },
  },
}

export default function BlogPage() {
  return <BlogListView initialLang={DEFAULT_LOCALE} />
}
