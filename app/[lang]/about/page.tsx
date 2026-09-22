import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { AboutContent } from "@/components/pages/about-content"
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
    az: "TESTAI.AZ Haqqında və Pedaqoji Missiyamız | AI Təhsil Platforması",
    en: "About TESTAI.AZ & Our Pedagogical Mission | AI Educational Platform",
    tr: "TESTAI.AZ Hakkında ve Pedagojik Misyonumuz | Yapay Zeka Eğitim Platformu",
    ru: "О проекте TESTAI.AZ и Наша педагогическая миссия | Образовательная ИИ-платформа",
  }

  const descriptions: Record<Lang, string> = {
    az: "Azərbaycanın ilk dərslik əsaslı süni intellekt təhsil və diaqnostika platforması haqqında məlumat, SİTG standartı və pedaqoji missiya.",
    en: "Learn about TESTAI.AZ, Azerbaijan's premier curriculum-aligned AI assessment platform, SITG pedagogical standard, and learning diagnostics.",
    tr: "Azerbaycan'ın ilk müfredat odaklı yapay zeka eğitim ve teşhis platformu TESTAI.AZ, SİTG standardı ve pedagojik vizyonumuz.",
    ru: "Узнайте о TESTAI.AZ — первой ИИ-платформе тестирования и диагностики на базе официальных учебников, стандарте SITG и нашей миссии.",
  }

  return {
    title: titles[lang],
    description: descriptions[lang],
    alternates: {
      canonical: lang === "az" ? "https://testai.az/about" : `https://testai.az/${lang}/about`,
      languages: {
        az: "https://testai.az/about",
        en: "https://testai.az/en/about",
        tr: "https://testai.az/tr/about",
        ru: "https://testai.az/ru/about",
        "x-default": "https://testai.az/about",
      },
    },
  }
}

export default function MultilingualAboutPage({ params }: PageProps) {
  const lang = params.lang as Lang
  if (!VALID_LANGS.includes(lang)) {
    notFound()
  }

  return <AboutContent initialLang={lang} />
}
