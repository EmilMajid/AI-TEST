import type { Metadata } from "next"
import { OpenTestEngine } from "@/components/open-tests/open-test-engine"

export const metadata: Metadata = {
  title: "Qeydiyyatsız Açıq Sınaqlar: İngilis, Alman, Rus və Fransız Dilləri | TESTAI.AZ",
  description:
    "1-ci sinifdən 11-ci sinfə qədər ingilis, alman, rus və fransız dilləri üzrə 1-ci bölmənin rəsmi dərslik testlərini qeydiyyatsız onlayn həll edin və AI diaqnostikanızı dərhal görün.",
  keywords: [
    "ingilis dili sınaq testləri",
    "alman dili testləri məktəb",
    "fransız dili sınaq",
    "rus dili dərslik testləri",
    "onlayn sınaq qeydiyyatsız",
    "testai açıq sınaqlar",
  ],
  alternates: {
    canonical: "https://testai.az/open-tests",
    languages: {
      az: "https://testai.az/open-tests",
      en: "https://testai.az/en/open-tests",
      tr: "https://testai.az/tr/open-tests",
      ru: "https://testai.az/ru/open-tests",
      "x-default": "https://testai.az/open-tests",
    },
  },
  openGraph: {
    title: "Qeydiyyatsız Açıq Xarici Dil Sınaqları | TESTAI.AZ",
    description:
      "4 xarici dildə (İngilis, Alman, Rus, Fransız) 1-ci bölmə testləri. Dərhal sınaqdan keçin!",
    url: "https://testai.az/open-tests",
    siteName: "TESTAI.AZ",
    type: "website",
  },
}

export default function OpenTestsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: "Açıq Xarici Dil Sınaqları - TESTAI.AZ",
    description:
      "1-ci mövzu üzrə ingilis, alman, rus və fransız dillərində interaktiv dərslik testləri.",
    educationalLevel: "Grades 1-11",
    inLanguage: ["en", "de", "fr", "ru", "az"],
    provider: {
      "@type": "Organization",
      name: "TESTAI.AZ",
      url: "https://testai.az",
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <OpenTestEngine initialLang="az" />
    </>
  )
}
