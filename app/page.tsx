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
    canonical: "https://testai.az",
    languages: {
      az: "https://testai.az/az",
      en: "https://testai.az",
      tr: "https://testai.az/tr",
      ru: "https://testai.az/ru",
      "x-default": "https://testai.az",
    },
  },
}

export default function HomePage() {
  return <HomeContent initialLang={DEFAULT_LOCALE} />
}
