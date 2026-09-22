import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Script from "next/script"
import { getBlogPostBySlug, BLOG_POSTS } from "@/lib/blog-data"
import { ArticleViewer } from "@/components/blog/article-viewer"
import { Lang } from "@/components/language-dropdown"

const VALID_LANGS: Lang[] = ["az", "en", "tr", "ru"]

interface PageProps {
  params: { lang: string; slug: string }
}

export function generateStaticParams() {
  const paths: { lang: string; slug: string }[] = []
  for (const lang of VALID_LANGS) {
    for (const post of BLOG_POSTS) {
      paths.push({ lang, slug: post.slug })
    }
  }
  return paths
}

export function generateMetadata({ params }: PageProps): Metadata {
  const lang = params.lang as Lang
  if (!VALID_LANGS.includes(lang)) {
    return { title: "Məqalə tapılmadı - TESTAI.AZ" }
  }

  const post = getBlogPostBySlug(params.slug)
  if (!post) {
    return { title: "Məqalə tapılmadı - TESTAI.AZ" }
  }

  const tr = post.translations[lang] || post.translations.az

  return {
    title: `${tr.title} | TESTAI.AZ`,
    description: tr.summary,
    keywords: post.tags,
    authors: [{ name: post.author.name }],
    alternates: {
      canonical: `https://testai.az/${lang}/blog/${post.slug}`,
      languages: {
        az: `https://testai.az/blog/${post.slug}`,
        en: `https://testai.az/en/blog/${post.slug}`,
        tr: `https://testai.az/tr/blog/${post.slug}`,
        ru: `https://testai.az/ru/blog/${post.slug}`,
        "x-default": `https://testai.az/blog/${post.slug}`,
      },
    },
    openGraph: {
      title: tr.title,
      description: tr.summary,
      url: `https://testai.az/${lang}/blog/${post.slug}`,
      siteName: "TESTAI.AZ",
      type: "article",
      publishedTime: post.publishDate,
      authors: [post.author.name],
      tags: post.tags,
    },
  }
}

export default function MultilingualBlogPostPage({ params }: PageProps) {
  const lang = params.lang as Lang
  if (!VALID_LANGS.includes(lang)) {
    notFound()
  }

  const post = getBlogPostBySlug(params.slug)
  if (!post) {
    notFound()
  }

  const tr = post.translations[lang] || post.translations.az

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: tr.title,
    description: tr.summary,
    datePublished: post.publishDate,
    author: {
      "@type": "Organization",
      name: post.author.name,
      url: "https://testai.az",
    },
    publisher: {
      "@type": "Organization",
      name: "TESTAI.AZ",
      url: "https://testai.az",
      logo: {
        "@type": "ImageObject",
        url: "https://testai.az/logo.jpg",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://testai.az/${lang}/blog/${post.slug}`,
    },
  }

  return (
    <>
      <Script
        id={`schema-blog-${lang}-${post.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleViewer post={post} initialLang={lang} />
    </>
  )
}
