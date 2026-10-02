import type { Metadata } from "next"
import { PrivacyContent } from "@/components/pages/privacy-content"
import { DEFAULT_LOCALE } from "@/lib/config"
import { Lang } from "@/components/language-dropdown"

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

export const metadata: Metadata = {
  title: titles[DEFAULT_LOCALE],
  description: descriptions[DEFAULT_LOCALE],
  alternates: {
    canonical: "https://www.testai.az/privacy",
    languages: {
      az: "https://www.testai.az/privacy",
      en: "https://www.testai.az/en/privacy",
      tr: "https://www.testai.az/tr/privacy",
      ru: "https://www.testai.az/ru/privacy",
      "x-default": "https://www.testai.az/privacy",
    },
  },
}

export default function PrivacyPage() {
  return <PrivacyContent initialLang={DEFAULT_LOCALE} />
}
