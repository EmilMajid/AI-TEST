import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { HomeContent } from "@/components/pages/home-content"
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
    az: "TESTAI.AZ - AI Test Platforması | Azərbaycan Dərslikləri Əsasında",
    en: "TESTAI.AZ - AI Educational & Diagnostic Testing Platform",
    tr: "TESTAI.AZ - Yapay Zeka Destekli Eğitim ve Teşhis Platformu",
    ru: "TESTAI.AZ - Образовательная ИИ-платформа тестирования и диагностики",
  }

  const descriptions: Record<Lang, string> = {
    az: "Azərbaycan dərslikləri əsasında hazırlanmış süni intellekt dəstəkli test və bilik analiz platforması. Şagirdlər və valideynlər üçün fərdi sınaqlar.",
    en: "Official curriculum-aligned AI educational testing and diagnostic assessment platform. Practice topic-aligned tests and elevate academic performance.",
    tr: "Resmi ders kitapları temelinde geliştirilmiş yapay zeka eğitim ve teşhis platformu. Öğrenciler ve veliler için kişiselleştirilmiş sınavlar.",
    ru: "Образовательная ИИ-платформа тестирования и диагностики на основе официальных учебников. Индивидуальные тесты для учащихся и родителей.",
  }

  return {
    title: titles[lang],
    description: descriptions[lang],
    alternates: {
      canonical: lang === "az" ? "https://testai.az" : `https://testai.az/${lang}`,
      languages: {
        az: "https://testai.az",
        en: "https://testai.az/en",
        tr: "https://testai.az/tr",
        ru: "https://testai.az/ru",
        "x-default": "https://testai.az",
      },
    },
  }
}

export default function MultilingualHomePage({ params }: PageProps) {
  const lang = params.lang as Lang
  if (!VALID_LANGS.includes(lang)) {
    notFound()
  }

  return <HomeContent initialLang={lang} />
}
