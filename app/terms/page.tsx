import type { Metadata } from "next"
import { TermsContent } from "@/components/pages/terms-content"

export const metadata: Metadata = {
  title: "İstifadə Şərtləri | TESTAI.AZ",
  description:
    "TESTAI.AZ platformasının rəsmi istifadə şərtləri, istifadəçi razılaşması və hüquqi qaydaları.",
  alternates: {
    canonical: "https://testai.az/terms",
    languages: {
      az: "https://testai.az/terms",
      en: "https://testai.az/en/terms",
      tr: "https://testai.az/tr/terms",
      ru: "https://testai.az/ru/terms",
      "x-default": "https://testai.az/terms",
    },
  },
}

export default function TermsPage() {
  return <TermsContent initialLang="az" />
}
