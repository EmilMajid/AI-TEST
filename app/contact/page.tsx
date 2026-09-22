import type { Metadata } from "next"
import { ContactContent } from "@/components/pages/contact-content"

export const metadata: Metadata = {
  title: "Bizimlə Əlaqə | TESTAI.AZ",
  description:
    "TESTAI.AZ platforması ilə əlaqə, rəsmi e-poçt və sosial media kanalları.",
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
  return <ContactContent initialLang="az" />
}
