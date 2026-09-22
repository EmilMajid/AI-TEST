import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ContactContent } from "@/components/pages/contact-content"
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
    az: "Bizimlə Əlaqə | TESTAI.AZ",
    en: "Contact Us | TESTAI.AZ Educational Support",
    tr: "İletişim | TESTAI.AZ Destek ve Ortaklık",
    ru: "Контакты | Поддержка и сотрудничество TESTAI.AZ",
  }

  const descriptions: Record<Lang, string> = {
    az: "TESTAI.AZ platforması ilə əlaqə, rəsmi e-poçt və sosial media kanalları.",
    en: "Get in touch with the TESTAI.AZ team for educational partnerships, pedagogical inquiries, and technical support.",
    tr: "TESTAI.AZ ekibi ile eğitim ortaklıkları, öneriler ve teknik destek için iletişime geçin.",
    ru: "Свяжитесь с командой TESTAI.AZ по вопросам партнерства, педагогики и технической поддержки.",
  }

  return {
    title: titles[lang],
    description: descriptions[lang],
    alternates: {
      canonical: `https://testai.az/${lang}/contact`,
      languages: {
        az: "https://testai.az/contact",
        en: "https://testai.az/en/contact",
        tr: "https://testai.az/tr/contact",
        ru: "https://testai.az/ru/contact",
        "x-default": "https://testai.az/contact",
      },
    },
  }
}

export default function MultilingualContactPage({ params }: PageProps) {
  const lang = params.lang as Lang
  if (!VALID_LANGS.includes(lang)) {
    notFound()
  }

  return <ContactContent initialLang={lang} />
}
