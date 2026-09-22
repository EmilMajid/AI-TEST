import type { Metadata } from "next"
import { AboutContent } from "@/components/pages/about-content"

export const metadata: Metadata = {
  title: "TESTAI.AZ Haqqında və Pedaqoji Missiyamız | AI Təhsil Platforması",
  description:
    "Azərbaycanın ilk rəsmi dərslik əsaslı süni intellekt təhsil və diaqnostika platforması haqqında ətraflı məlumat, SİTG standartı və pedaqoji missiya.",
  alternates: {
    canonical: "https://testai.az/about",
    languages: {
      az: "https://testai.az/about",
      en: "https://testai.az/en/about",
      tr: "https://testai.az/tr/about",
      ru: "https://testai.az/ru/about",
      "x-default": "https://testai.az/about",
    },
  },
}

export default function AboutPage() {
  return <AboutContent initialLang="az" />
}
