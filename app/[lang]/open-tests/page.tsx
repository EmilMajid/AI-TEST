import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Script from "next/script"
import { OpenTestEngine } from "@/components/open-tests/open-test-engine"
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
    az: "Qeydiyyatsız Açıq Sınaqlar: İngilis, Alman, Rus və Fransız Dilləri | TESTAI.AZ",
    en: "Free Foreign Language Diagnostic Tests (English, German, French, Russian) | TESTAI.AZ",
    tr: "Kayıtsız Ücretsiz Yabancı Dil Sınavları (İngilizce, Almanca, Fransızca, Rusça) | TESTAI.AZ",
    ru: "Бесплатные диагностические тесты по иностранным языкам (Английский, Немецкий, Французский, Русский) | TESTAI.AZ",
  }

  const descriptions: Record<Lang, string> = {
    az: "1-ci sinifdən 11-ci sinfə qədər ingilis, alman, rus və fransız dilləri üzrə 1-ci bölmənin rəsmi dərslik testlərini qeydiyyatsız həll edin.",
    en: "Practice Unit 1 curriculum-aligned tests for English, German, French, and Russian across grades 1-11 without registration. Real-time AI diagnostic feedback.",
    tr: "1-11. sınıflar için İngilizce, Almanca, Fransızca ve Rusça 1. ünite ders kitabı sınavlarını kaydolmadan anında çözün.",
    ru: "Решайте тесты 1-й темы по английскому, немецкому, французскому и русскому языкам для 1-11 классов без регистрации.",
  }

  return {
    title: titles[lang],
    description: descriptions[lang],
    alternates: {
      canonical: `https://testai.az/${lang}/open-tests`,
      languages: {
        az: "https://testai.az/open-tests",
        en: "https://testai.az/en/open-tests",
        tr: "https://testai.az/tr/open-tests",
        ru: "https://testai.az/ru/open-tests",
        "x-default": "https://testai.az/open-tests",
      },
    },
  }
}

export default function MultilingualOpenTestsPage({ params }: PageProps) {
  const lang = params.lang as Lang
  if (!VALID_LANGS.includes(lang)) {
    notFound()
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: "Open Foreign Language Diagnostic Tests - TESTAI.AZ",
    description:
      "Interactive curriculum-aligned tests in English, German, French, and Russian without registration.",
    educationalLevel: "Grades 1-11",
    inLanguage: ["en", "de", "fr", "ru"],
    provider: {
      "@type": "Organization",
      name: "TESTAI.AZ",
      url: "https://testai.az",
    },
  }

  return (
    <>
      <Script
        id={`schema-open-tests-${lang}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <OpenTestEngine initialLang={lang} />
    </>
  )
}
