import type { Metadata } from "next"
import { OpenTestEngine } from "@/components/open-tests/open-test-engine"
import { DEFAULT_LOCALE } from "@/lib/config"
import { Lang } from "@/components/language-dropdown"

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

export const metadata: Metadata = {
  title: titles[DEFAULT_LOCALE],
  description: descriptions[DEFAULT_LOCALE],
  keywords: [
    "language tests online",
    "english diagnostic quiz",
    "school test practice",
    "open diagnostic tests",
    "testai open tests",
  ],
  alternates: {
    canonical: "https://www.testai.az/open-tests",
    languages: {
      az: "https://www.testai.az/open-tests",
      en: "https://www.testai.az/en/open-tests",
      tr: "https://www.testai.az/tr/open-tests",
      ru: "https://www.testai.az/ru/open-tests",
      "x-default": "https://www.testai.az/open-tests",
    },
  },
  openGraph: {
    title: titles[DEFAULT_LOCALE],
    description: descriptions[DEFAULT_LOCALE],
    url: "https://www.testai.az/open-tests",
    siteName: "TESTAI.AZ",
    type: "website",
  },
}

export default function OpenTestsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: "Open Diagnostic Language Tests - TESTAI.AZ",
    description:
      "Interactive curriculum-aligned language diagnostics for English, German, French, and Russian.",
    educationalLevel: "Grades 1-11",
    inLanguage: ["en", "de", "fr", "ru", "az"],
    provider: {
      "@type": "Organization",
      name: "TESTAI.AZ",
      url: "https://www.testai.az",
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <OpenTestEngine initialLang={DEFAULT_LOCALE} />
    </>
  )
}
