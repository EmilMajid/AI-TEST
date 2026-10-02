import type { Metadata } from "next"
import { AboutContent } from "@/components/pages/about-content"
import { DEFAULT_LOCALE } from "@/lib/config"
import { Lang } from "@/components/language-dropdown"

const titles: Record<Lang, string> = {
  az: "TESTAI.AZ Haqqında və Pedaqoji Missiyamız | AI Təhsil Platforması",
  en: "About TESTAI.AZ & Our Pedagogical Mission | AI Educational Platform",
  tr: "TESTAI.AZ Hakkında ve Pedagojik Misyonumuz | Yapay Zeka Eğitim Platformu",
  ru: "О проекте TESTAI.AZ и Наша педагогическая миссия | Образовательная ИИ-платформа",
}

const descriptions: Record<Lang, string> = {
  az: "Azərbaycanın ilk dərslik əsaslı süni intellekt təhsil və diaqnostika platforması haqqında məlumat, SİTG standartı və pedaqoji missiya.",
  en: "Learn about TESTAI.AZ, an innovative curriculum-aligned AI assessment platform, SITG pedagogical standard, and learning diagnostics.",
  tr: "Azerbaycan'ın ilk müfredat odaklı yapay zeka eğitim ve teşhis platformu TESTAI.AZ, SİTG standardı ve pedagojik vizyonumuz.",
  ru: "Узнайте о TESTAI.AZ — первой ИИ-платформе тестирования и диагностики на базе официальных учебников, стандарте SITG и нашей миссии.",
}

export const metadata: Metadata = {
  title: titles[DEFAULT_LOCALE],
  description: descriptions[DEFAULT_LOCALE],
  alternates: {
    canonical: "https://testai.az/about",
    languages: {
      az: "https://testai.az/about",
      en: "https://testai.az/en/about",
      tr: "https://testai.az/tr/about",
      ru: "https://testai.az/ru/about",
      "x-default": "https://testai.az/about",
    },
  },
}

export default function AboutPage() {
  return <AboutContent initialLang={DEFAULT_LOCALE} />
}
