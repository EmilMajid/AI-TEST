import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getDiscoveryBySlug, getAllDiscoveries, getRelatedDiscoveries } from "@/lib/discoveries-data"
import { DiscoveryViewer } from "@/components/discoveries/discovery-viewer"
import { Lang } from "@/components/language-dropdown"
import { DEFAULT_LOCALE } from "@/lib/config"
import { getEnrichedDiscovery } from "@/lib/discoveries-enrichment"

interface PageProps {
  params: { slug: string }
  searchParams: { lang?: string }
}

export function generateStaticParams() {
  const all = getAllDiscoveries()
  return all.map((d) => ({
    slug: d.slug,
  }))
}

export function generateMetadata({ params, searchParams }: PageProps): Metadata {
  const discovery = getDiscoveryBySlug(params.slug)
  if (!discovery) {
    return { title: "Kəşf tapılmadı - TESTAI.AZ" }
  }

  const requestedLang = (searchParams?.lang as Lang) || DEFAULT_LOCALE
  const enriched = getEnrichedDiscovery(discovery, requestedLang)
  const tr = enriched.translations[requestedLang] || enriched.translations[DEFAULT_LOCALE] || enriched.translations.az

  const suffixMap: Record<Lang, string> = {
    en: "TESTAI.AZ Scientific Encyclopedia",
    az: "TESTAI.AZ Elmi Ensiklopediya",
    tr: "TESTAI.AZ Bilimsel Ansiklopedi",
    ru: "TESTAI.AZ Научная энциклопедия",
  }

  return {
    title: `${tr.title} | ${suffixMap[requestedLang] || suffixMap.en}`,
    description: tr.summary,
    keywords: [
      enriched.discoverer,
      enriched.curriculumSubject,
      enriched.curriculumTopic,
      requestedLang === "en" ? "Scientific Discovery" : "Elmi Kəşf",
      requestedLang === "en" ? "Interactive Quiz" : "İnteraktiv Test",
    ],
    authors: [{ name: enriched.discoverer }],
    alternates: {
      canonical: `https://www.testai.az/discoveries/${discovery.slug}`,
      languages: {
        az: `https://www.testai.az/az/discoveries/${discovery.slug}`,
        en: `https://www.testai.az/discoveries/${discovery.slug}`,
        tr: `https://www.testai.az/tr/discoveries/${discovery.slug}`,
        ru: `https://www.testai.az/ru/discoveries/${discovery.slug}`,
        "x-default": `https://www.testai.az/discoveries/${discovery.slug}`,
      },
    },
    openGraph: {
      title: tr.title,
      description: tr.summary,
      url: `https://www.testai.az/discoveries/${discovery.slug}`,
      siteName: "TESTAI.AZ",
      type: "article",
    },
  }
}

export default function DiscoveryDetailPage({ params, searchParams }: PageProps) {
  const rawDiscovery = getDiscoveryBySlug(params.slug)
  if (!rawDiscovery) {
    notFound()
  }

  const lang = (searchParams?.lang as Lang) || DEFAULT_LOCALE
  const discovery = getEnrichedDiscovery(rawDiscovery, lang)
  const related = getRelatedDiscoveries(discovery.slug, 3)

  const tr = discovery.translations[lang] || discovery.translations[DEFAULT_LOCALE] || discovery.translations.az

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

  // Schema.org Article & Quiz structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `https://www.testai.az/discoveries/${discovery.slug}#article`,
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
        mainEntityOfPage: `https://www.testai.az/discoveries/${discovery.slug}`,
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
