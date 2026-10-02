import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { TermsContent } from "@/components/pages/terms-content"
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
    az: "İstifadə Şərtləri | TESTAI.AZ",
    en: "Terms of Service | TESTAI.AZ Educational AI Platform",
    tr: "Kullanım Şartları | TESTAI.AZ Eğitim Platformu",
    ru: "Условия использования | Платформа TESTAI.AZ",
  }

  const descriptions: Record<Lang, string> = {
    az: "TESTAI.AZ platformasının rəsmi istifadə şərtləri, istifadəçi razılaşması və hüquqi qaydaları.",
    en: "Official Terms of Service, User Agreement, and educational use disclaimers for TESTAI.AZ.",
    tr: "TESTAI.AZ platformunun resmi kullanım şartları, kullanıcı sözleşmesi ve yasal bildirimler.",
    ru: "Официальные условия использования, пользовательское соглашение и правила сервиса TESTAI.AZ.",
  }

  return {
    title: titles[lang],
    description: descriptions[lang],
    alternates: {
      canonical: lang === "az" ? "https://www.testai.az/terms" : `https://www.testai.az/${lang}/terms`,
      languages: {
        az: "https://www.testai.az/terms",
        en: "https://www.testai.az/en/terms",
        tr: "https://www.testai.az/tr/terms",
        ru: "https://www.testai.az/ru/terms",
        "x-default": "https://www.testai.az/terms",
      },
    },
  }
}

export default function MultilingualTermsPage({ params }: PageProps) {
  const lang = params.lang as Lang
  if (!VALID_LANGS.includes(lang)) {
    notFound()
  }

  return <TermsContent initialLang={lang} />
}
