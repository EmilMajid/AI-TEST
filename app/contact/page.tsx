import type { Metadata } from "next"
import { ContactContent } from "@/components/pages/contact-content"
import { DEFAULT_LOCALE } from "@/lib/config"
import { Lang } from "@/components/language-dropdown"

const titles: Record<Lang, string> = {
  az: "Bizimlə Əlaqə | TESTAI.AZ",
  en: "Contact Us | TESTAI.AZ Educational AI Platform",
  tr: "İletişim | TESTAI.AZ Eğitim Platformu",
  ru: "Контакты | Платформа TESTAI.AZ",
}

const descriptions: Record<Lang, string> = {
  az: "TESTAI.AZ platforması ilə əlaqə, rəsmi e-poçt və sosial media kanalları.",
  en: "Get in touch with the TESTAI.AZ team, pedagogical inquiry, support, and institutional partnerships.",
  tr: "TESTAI.AZ platformu iletişim bilgileri, destek ve kurumsal işbirlikleri.",
  ru: "Свяжитесь с командой TESTAI.AZ по вопросам методики, поддержки и сотрудничества.",
}

export const metadata: Metadata = {
  title: titles[DEFAULT_LOCALE],
  description: descriptions[DEFAULT_LOCALE],
  alternates: {
    canonical: "https://testai.az/contact",
    languages: {
      az: "https://testai.az/contact",
      en: "https://testai.az/en/contact",
      tr: "https://testai.az/tr/contact",
      ru: "https://testai.az/ru/contact",
      "x-default": "https://testai.az/contact",
    },
  },
}

export default function ContactPage() {
  return <ContactContent initialLang={DEFAULT_LOCALE} />
}
