import type { Metadata } from "next"
import { HomeContent } from "@/components/pages/home-content"
import { DEFAULT_LOCALE } from "@/lib/config"

export const metadata: Metadata = {
  title: "TESTAI.AZ - AI Educational & Diagnostic Testing Platform",
  description:
    "Curriculum-aligned AI educational testing, diagnostic assessment, and personalized learning analytics for students, parents, and educators.",
  keywords: [
    "testai",
    "testai.az",
    "ai educational testing",
    "diagnostic assessment",
    "curriculum-aligned tests",
    "educational AI platform",
    "parent dashboard",
    "formative assessment",
  ],
  alternates: {
    canonical: "https://www.testai.az",
    languages: {
      az: "https://www.testai.az/az",
      en: "https://www.testai.az",
      tr: "https://www.testai.az/tr",
      ru: "https://www.testai.az/ru",
      "x-default": "https://www.testai.az",
    },
  },
}

export default function HomePage() {
  return <HomeContent initialLang={DEFAULT_LOCALE} />
}
