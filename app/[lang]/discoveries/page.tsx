import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { DiscoveriesCatalog } from "@/components/discoveries/discoveries-catalog"
import { getAllDiscoveries } from "@/lib/discoveries-data"
import { Lang } from "@/components/language-dropdown"

const VALID_LANGS: Lang[] = ["az", "en", "tr", "ru"]

interface PageProps {
  params: { lang: string }
}

export function generateStaticParams() {
  return VALID_LANGS.map((lang) => ({ lang }))
}

const titles: Record<Lang, string> = {
  az: "Elmi Kəşflər və İxtiralar Ensiklopediyası (50 Kəşf) | TESTAI.AZ",
  en: "Scientific Discoveries & Inventions Encyclopedia (50 Breakthroughs) | TESTAI.AZ",
  tr: "Bilimsel Keşifler ve İcatlar Ansiklopedisi (50 Keşif) | TESTAI.AZ",
  ru: "Энциклопедия научных открытий и изобретений (50 открытий) | TESTAI.AZ",
}

const descriptions: Record<Lang, string> = {
  az: "Bəşəriyyətin 50 ən böyük elmi kəşfi, 2020-2024 Nobel Mükafatları (AlphaFold, Kvant Nöqtələri, Neyron Şəbəkələri), məktəb kurikulumu əlaqələri və interaktiv SİTG sınaqları.",
  en: "Explore 50 monumental scientific discoveries and recent Nobel breakthroughs (AlphaFold, Neural Networks, Quantum Dots) with curriculum ties and interactive quizzes.",
  tr: "Uygarlığı değiştiren 50 bilimsel keşif, 2020-2024 Nobel Ödülleri (AlphaFold, Kuantum Noktaları) ve müfredatla bağlantılı pedagojik testler.",
  ru: "50 великих научных открытий, новейшие Нобелевские премии 2020-2024 (AlphaFold, квантовые точки, нейросети), связь со школьной программой и интерактивные тесты.",
}

export function generateMetadata({ params }: PageProps): Metadata {
  const lang = params.lang as Lang
  if (!VALID_LANGS.includes(lang)) {
    return { title: "TESTAI.AZ" }
  }

  return {
    title: titles[lang],
    description: descriptions[lang],
    alternates: {
      canonical: lang === "en" ? "https://www.testai.az/discoveries" : `https://www.testai.az/${lang}/discoveries`,
      languages: {
        az: "https://www.testai.az/az/discoveries",
        en: "https://www.testai.az/discoveries",
        tr: "https://www.testai.az/tr/discoveries",
        ru: "https://www.testai.az/ru/discoveries",
        "x-default": "https://www.testai.az/discoveries",
      },
    },
    openGraph: {
      title: titles[lang],
      description: descriptions[lang],
      url: lang === "en" ? "https://www.testai.az/discoveries" : `https://www.testai.az/${lang}/discoveries`,
      siteName: "TESTAI.AZ",
      type: "website",
    },
  }
}

export default function MultilingualDiscoveriesPage({ params }: PageProps) {
  const lang = params.lang as Lang
  if (!VALID_LANGS.includes(lang)) {
    notFound()
  }

  const discoveries = getAllDiscoveries()
  return <DiscoveriesCatalog discoveries={discoveries} initialLang={lang} />
}
