import type { Metadata } from "next"
import { PrivacyContent } from "@/components/pages/privacy-content"

export const metadata: Metadata = {
  title: "Məxfilik Siyasəti | TESTAI.AZ",
  description:
    "TESTAI.AZ platformasının məxfilik siyasəti, Google AdSense və çərəzlər haqqında rəsmi məlumat.",
  alternates: {
    canonical: "https://testai.az/privacy",
    languages: {
      az: "https://testai.az/privacy",
      en: "https://testai.az/en/privacy",
      tr: "https://testai.az/tr/privacy",
      ru: "https://testai.az/ru/privacy",
      "x-default": "https://testai.az/privacy",
    },
  },
}

export default function PrivacyPage() {
  return <PrivacyContent initialLang="az" />
}
