import type { Metadata } from "next"
import { BlogListView } from "@/components/blog/blog-list-view"

export const metadata: Metadata = {
  title: "Bloq və Pedaqoji Metodologiya | TESTAI.AZ",
  description:
    "Süni intellekt əsaslı müasir testologiya, SİTG standartı, dərslik inteqrasiyası və müəllim-şagird inkişaf bələdçiləri.",
  alternates: {
    canonical: "https://testai.az/blog",
    languages: {
      az: "https://testai.az/blog",
      en: "https://testai.az/en/blog",
      tr: "https://testai.az/tr/blog",
      ru: "https://testai.az/ru/blog",
      "x-default": "https://testai.az/blog",
    },
  },
}

export default function BlogPage() {
  return <BlogListView initialLang="az" />
}
