import type { Metadata } from "next"
import { TermsContent } from "@/components/pages/terms-content"
import { DEFAULT_LOCALE } from "@/lib/config"
import { Lang } from "@/components/language-dropdown"

const titles: Record<Lang, string> = {
  az: "İstifadə Şərtləri | TESTAI.AZ",
  en: "Terms of Service | TESTAI.AZ Educational AI Platform",
  tr: "Kullanım Koşulları | TESTAI.AZ Eğitim Platformu",
  ru: "Условия использования | Платформа TESTAI.AZ",
}

const descriptions: Record<Lang, string> = {
  az: "TESTAI.AZ platformasının rəsmi istifadə şərtləri, istifadəçi razılaşması və hüquqi qaydaları.",
  en: "Terms of service, user agreements, and educational guidelines for TESTAI.AZ AI diagnostic platform.",
  tr: "TESTAI.AZ platformu kullanım şartları, kullanıcı sözleşmesi ve yasal bildirimler.",
  ru: "Официальные условия использования, пользовательское соглашение и правила платформы TESTAI.AZ.",
}

export const metadata: Metadata = {
  title: titles[DEFAULT_LOCALE],
  description: descriptions[DEFAULT_LOCALE],
  alternates: {
    canonical: "https://www.testai.az/terms",
    languages: {
      az: "https://www.testai.az/az/terms",
      en: "https://www.testai.az/terms",
      tr: "https://www.testai.az/tr/terms",
      ru: "https://www.testai.az/ru/terms",
      "x-default": "https://www.testai.az/terms",
    },
  },
}

export default function TermsPage() {
  return <TermsContent initialLang={DEFAULT_LOCALE} />
}
