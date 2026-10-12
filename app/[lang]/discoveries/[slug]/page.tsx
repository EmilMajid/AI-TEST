import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getDiscoveryBySlug, getAllDiscoveries, getRelatedDiscoveries } from "@/lib/discoveries-data"
import { DiscoveryViewer } from "@/components/discoveries/discovery-viewer"
import { Lang } from "@/components/language-dropdown"

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

  const discovery = getDiscoveryBySlug(params.slug)
  if (!discovery) {
    return { title: "Kəşf tapılmadı - TESTAI.AZ" }
  }

  const tr = discovery.translations[lang] || discovery.translations.az

  return {
    title: `${tr.title} | TESTAI.AZ`,
    description: tr.summary,
    keywords: [
      discovery.curriculumSubject,
      discovery.curriculumTopic,
      discovery.discoverer,
      discovery.isNobel ? "Nobel Mükafatı" : "Elmi Kəşf",
      "SİTG Standartı",
      "Məktəb Kurikulumu",
      "İnteraktiv Test",
    ],
    authors: [{ name: discovery.discoverer }],
    alternates: {
      canonical:
        lang === "en"
          ? `https://www.testai.az/discoveries/${discovery.slug}`
          : `https://www.testai.az/${lang}/discoveries/${discovery.slug}`,
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
      url:
        lang === "en"
          ? `https://www.testai.az/discoveries/${discovery.slug}`
          : `https://www.testai.az/${lang}/discoveries/${discovery.slug}`,
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

  const discovery = getDiscoveryBySlug(params.slug)
  if (!discovery) {
    notFound()
  }

  const related = getRelatedDiscoveries(discovery.slug, 3)
  const tr = discovery.translations[lang] || discovery.translations.az

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
        name: `${tr.title} - Özünü Sına`,
        description: `SİTG standartı ilə hazırlanmış 3 suallıq qiymətləndirmə testi.`,
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
