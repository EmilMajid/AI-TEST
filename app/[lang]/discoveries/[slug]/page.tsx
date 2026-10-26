import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getDiscoveryBySlug, getAllDiscoveries, getRelatedDiscoveries } from "@/lib/discoveries-data"
import { DiscoveryViewer } from "@/components/discoveries/discovery-viewer"
import { Lang } from "@/components/language-dropdown"
import { getEnrichedDiscovery } from "@/lib/discoveries-enrichment"

const VALID_LANGS: Lang[] = ["az", "en", "tr", "ru"]

interface PageProps {
  params: { lang: string; slug: string }
}

export function generateStaticParams() {
  const all = getAllDiscoveries()
  const paths: { lang: string; slug: string }[] = []
  for (const lang of VALID_LANGS) {
    for (const d of all) {
      paths.push({ lang, slug: d.slug })
    }
  }
  return paths
}

export function generateMetadata({ params }: PageProps): Metadata {
  const lang = params.lang as Lang
  if (!VALID_LANGS.includes(lang)) {
    return { title: "Kəşf tapılmadı - TESTAI.AZ" }
  }

  const rawDiscovery = getDiscoveryBySlug(params.slug)
  if (!rawDiscovery) {
    return { title: "Kəşf tapılmadı - TESTAI.AZ" }
  }

  const enriched = getEnrichedDiscovery(rawDiscovery, lang)
  const tr = enriched.translations[lang] || enriched.translations.az

  return {
    title: `${tr.title} | TESTAI.AZ`,
    description: tr.summary,
    keywords: [
      enriched.curriculumSubject,
      enriched.curriculumTopic,
      enriched.discoverer,
      enriched.isNobel ? "Nobel Mükafatı" : "Elmi Kəşf",
      "SİTG Standartı",
      "Məktəb Kurikulumu",
      "İnteraktiv Test",
    ],
    authors: [{ name: enriched.discoverer }],
    alternates: {
      canonical:
        lang === "en"
          ? `https://www.testai.az/discoveries/${rawDiscovery.slug}`
          : `https://www.testai.az/${lang}/discoveries/${rawDiscovery.slug}`,
      languages: {
        az: `https://www.testai.az/az/discoveries/${rawDiscovery.slug}`,
        en: `https://www.testai.az/discoveries/${rawDiscovery.slug}`,
        tr: `https://www.testai.az/tr/discoveries/${rawDiscovery.slug}`,
        ru: `https://www.testai.az/ru/discoveries/${rawDiscovery.slug}`,
        "x-default": `https://www.testai.az/discoveries/${rawDiscovery.slug}`,
      },
    },
    openGraph: {
      title: tr.title,
      description: tr.summary,
      url:
        lang === "en"
          ? `https://www.testai.az/discoveries/${rawDiscovery.slug}`
          : `https://www.testai.az/${lang}/discoveries/${rawDiscovery.slug}`,
      siteName: "TESTAI.AZ",
      type: "article",
    },
  }
}

export default function MultilingualDiscoveryDetailPage({ params }: PageProps) {
  const lang = params.lang as Lang
  if (!VALID_LANGS.includes(lang)) {
    notFound()
  }

  const rawDiscovery = getDiscoveryBySlug(params.slug)
  if (!rawDiscovery) {
    notFound()
  }

  const discovery = getEnrichedDiscovery(rawDiscovery, lang)
  const related = getRelatedDiscoveries(discovery.slug, 3)
  const tr = discovery.translations[lang] || discovery.translations.az

  const quizTitles: Record<Lang, string> = {
    az: `${tr.title} - Özünü Sına`,
    en: `${tr.title} - Interactive Quiz`,
    tr: `${tr.title} - Kendini Dene`,
    ru: `${tr.title} - Интерактивный тест`,
  }

  const quizDescriptions: Record<Lang, string> = {
    az: "SİTG standartı ilə hazırlanmış 3 suallıq qiymətləndirmə testi.",
    en: "Pedagogically aligned 3-question formative assessment test.",
    tr: "Pedagojik standartlara uygun 3 soruluk etkileşimli değerlendirme testi.",
    ru: "Педагогический интерактивный тест из 3 вопросов по стандартам таксономии Блума.",
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `https://www.testai.az/${lang === "en" ? "" : `${lang}/`}discoveries/${discovery.slug}#article`,
        headline: tr.title,
        description: tr.summary,
        author: {
          "@type": "Person",
          name: discovery.discoverer,
        },
        publisher: {
          "@type": "Organization",
          name: "TESTAI.AZ",
          url: "https://www.testai.az",
          logo: {
            "@type": "ImageObject",
            url: "https://www.testai.az/logo.jpg",
          },
        },
        mainEntityOfPage: `https://www.testai.az/${lang === "en" ? "" : `${lang}/`}discoveries/${discovery.slug}`,
      },
      {
        "@type": "Quiz",
        name: quizTitles[lang] || quizTitles.en,
        description: quizDescriptions[lang] || quizDescriptions.en,
        hasPart: discovery.quiz.map((q) => ({
          "@type": "Question",
          name: q.question,
          text: q.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: q.options.find((o) => o.id === q.correctOption)?.text,
            comment: {
              "@type": "Comment",
              text: q.explanation,
            },
          },
        })),
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DiscoveryViewer
        discovery={discovery}
        relatedDiscoveries={related}
        initialLang={lang}
      />
    </>
  )
}
