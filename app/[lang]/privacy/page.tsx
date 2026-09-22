import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PrivacyContent } from "@/components/pages/privacy-content"
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
    az: "Məxfilik Siyasəti | TESTAI.AZ",
    en: "Privacy Policy | TESTAI.AZ Educational AI Platform",
    tr: "Gizlilik Politikası | TESTAI.AZ Eğitim Platformu",
    ru: "Политика конфиденциальности | Платформа TESTAI.AZ",
  }

  const descriptions: Record<Lang, string> = {
    az: "TESTAI.AZ platformasının məxfilik siyasəti, Google AdSense və çərəzlər haqqında rəsmi məlumat.",
    en: "Privacy policy, Google AdSense compliance, cookie usage, and educational data protection terms of TESTAI.AZ.",
    tr: "TESTAI.AZ platformunun gizlilik politikası, Google AdSense uyumluluğu, çerezler ve veri güvenliği ilkeleri.",
    ru: "Политика конфиденциальности TESTAI.AZ, использование Google AdSense, файлов cookie и защита данных учащихся.",
  }

  return {
    title: titles[lang],
    description: descriptions[lang],
    alternates: {
      canonical: lang === "az" ? "https://testai.az/privacy" : `https://testai.az/${lang}/privacy`,
      languages: {
        az: "https://testai.az/privacy",
        en: "https://testai.az/en/privacy",
        tr: "https://testai.az/tr/privacy",
        ru: "https://testai.az/ru/privacy",
        "x-default": "https://testai.az/privacy",
      },
    },
  }
}

export default function MultilingualPrivacyPage({ params }: PageProps) {
  const lang = params.lang as Lang
  if (!VALID_LANGS.includes(lang)) {
    notFound()
  }

  return <PrivacyContent initialLang={lang} />
}
