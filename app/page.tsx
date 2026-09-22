import type { Metadata } from "next"
import { HomeContent } from "@/components/pages/home-content"

export const metadata: Metadata = {
  title: "TESTAI.AZ - AI Test Platforması | Azərbaycan Dərslikləri Əsasında",
  description:
    "Azərbaycan dərslikləri əsasında hazırlanmış süni intellekt dəstəkli test və bilik analiz platforması. Şagirdlər və valideynlər üçün fərdi sınaqlar.",
  keywords: [
    "testai",
    "testai.az",
    "ai test",
    "azərbaycan dərslikləri",
    "onlayn sınaq imtahanı",
    "süni intellekt təhsil",
    "valideyn nəzarəti",
    "məktəb testləri",
  ],
  alternates: {
    canonical: "https://testai.az",
    languages: {
      az: "https://testai.az",
      en: "https://testai.az/en",
      tr: "https://testai.az/tr",
      ru: "https://testai.az/ru",
      "x-default": "https://testai.az",
    },
  },
}

export default function HomePage() {
  return <HomeContent initialLang="az" />
}
