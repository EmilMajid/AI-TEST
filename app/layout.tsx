import type React from "react"
import type { Metadata, Viewport } from "next"
import Script from "next/script"
import { DEFAULT_LOCALE } from "@/lib/config"
import { Toaster } from "@/components/ui/toaster"
import { StickyBottomAd } from "@/components/ads/sticky-bottom-ad"
import { CookieConsent } from "@/components/ui/cookie-consent"
import "./globals.css"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  title: "TESTAI.AZ - AI Educational & Diagnostic Testing Platform",
  description:
    "Curriculum-aligned AI educational testing, diagnostic assessment, and personalized learning analytics for students, parents, and educators.",
  keywords: [
    "testai",
    "testai.az",
    "ai educational testing",
    "diagnostic assessment",
    "curriculum-aligned tests",
    "educational AI platform",
    "parent dashboard",
    "formative assessment",
  ],
  authors: [{ name: "TESTAI.AZ", url: "https://www.testai.az" }],
  creator: "TESTAI.AZ",
  metadataBase: new URL("https://www.testai.az"),
  openGraph: {
    title: "TESTAI.AZ - AI Educational & Diagnostic Testing Platform",
    description:
      "Curriculum-aligned AI educational testing, diagnostic assessment, and personalized learning analytics for students, parents, and educators.",
    url: "https://www.testai.az",
    siteName: "TESTAI.AZ",
    locale: "az_AZ",
    type: "website",
    images: [
      {
        url: "https://www.testai.az/brand-promo.jpg",
        width: 1200,
        height: 630,
        alt: "TESTAI.AZ — AI Təhsil və Diaqnostika Platforması",
      },
    ],
  },
  icons: {
    icon: [
      { url: "/logo.webp" },
      { url: "/logo.jpg" },
    ],
    apple: [{ url: "/logo.webp" },
      { url: "/logo.jpg" }],
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://www.testai.az",
    languages: {
      az: "https://www.testai.az/az",
      en: "https://www.testai.az",
      tr: "https://www.testai.az/tr",
      ru: "https://www.testai.az/ru",
      "x-default": "https://www.testai.az",
    },
  },
  other: {
    "google-adsense-account": "ca-pub-1166444768651699",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-1166444768651699"

  return (
    <html lang={DEFAULT_LOCALE} className="notranslate" translate="no">
      <head>
        <meta name="google" content="notranslate" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://connect.facebook.net" crossOrigin="anonymous" />
      </head>
      <body className="pb-16 sm:pb-20">
        {/* Google Consent Mode v2 Default Directive */}
        <Script
          id="google-consent-mode-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'analytics_storage': 'denied'
              });
            `,
          }}
        />
        {/* Google AdSense Script */}
        <Script
          id="adsbygoogle-init"
          strategy="lazyOnload"
          crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
        />
        {/* Schema.org Structured Data */}
        <Script
          id="schema-organization"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              name: "TESTAI.AZ",
              url: "https://www.testai.az",
              logo: "https://www.testai.az/logo.jpg",
              description:
                "Curriculum-aligned AI educational testing, diagnostic assessment, and personalized learning analytics platform grounded in official school textbooks.",
              email: "aztestai.az@gmail.com",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Baku",
                addressCountry: "AZ",
              },
              sameAs: [
                "https://www.instagram.com/testai.az/",
                "https://www.facebook.com/profile.php?id=61594359745552",
                "https://www.youtube.com/channel/UCSsFhuYKk6MHdLna05kfJrA",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                email: "aztestai.az@gmail.com",
                contactType: "customer support",
                availableLanguage: ["English", "Azerbaijani", "Turkish", "Russian"],
              },
            }),
          }}
        />
        {/* Meta Pixel Code */}
        <Script
          id="meta-pixel"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];
              var loadScript=function(){
                t=b.createElement(e);t.async=!0;t.src=v;
                s=b.getElementsByTagName(e)[0];
                if(s&&s.parentNode){s.parentNode.insertBefore(t,s);}
              };
              if('requestIdleCallback' in window){
                requestIdleCallback(function(){setTimeout(loadScript,1200);});
              }else{
                setTimeout(loadScript,1500);
              }
              }(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '2027404764555987');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=2027404764555987&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {children}
        <Toaster />
        <StickyBottomAd />
        <CookieConsent />
      </body>
    </html>
  )
}
