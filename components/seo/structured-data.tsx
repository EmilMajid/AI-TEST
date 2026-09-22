import { Lang } from "@/components/language-dropdown"

interface StructuredDataProps {
  lang?: Lang
}

export function StructuredData({ lang = "az" }: StructuredDataProps) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "TESTAI.AZ",
    alternateName: "Azerbaijan Educational AI Platform",
    url: "https://testai.az",
    logo: "https://testai.az/logo.jpg",
    email: "aztestai.az@gmail.com",
    sameAs: [
      "https://www.instagram.com/testai.az/",
      "https://www.facebook.com/profile.php?id=61594359745552",
      "https://www.youtube.com/channel/UCSsFhuYKk6MHdLna05kfJrA",
    ],
    description:
      "Azərbaycan Respublikası Elm və Təhsil Nazirliyinin təsdiq etdiyi rəsmi dərsliklər əsasında fəaliyyət göstərən süni intellekt təhsil və diaqnostika platforması.",
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "TESTAI.AZ",
    url: "https://testai.az",
    inLanguage: ["az", "en", "tr", "ru"],
    potentialAction: {
      "@type": "SearchAction",
      target: "https://testai.az/open-tests",
      "query-input": "required name=search_term_string",
    },
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "TESTAI.AZ platformasında test nəticəsi nə deməkdir?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "TESTAI.AZ-da toplanan xallar və nəticələr sırf diaqnostik xarakter daşıyır. Məqsəd şagirdin hansı mövzuda boşluğu olduğunu aşkar etməkdir; rəsmi məktəb qiymətini və ya DİM attestasiyasını əvəz etmir.",
        },
      },
      {
        "@type": "Question",
        name: "Test sualları hansı dərsliklər əsasında hazırlanır?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Bütün test tapşırıqları Azərbaycan Respublikası Elm və Təhsil Nazirliyinin e-derslik.edu.az portalında təsdiq olunmuş rəsmi dövlət dərslikləri əsasında hazırlanır.",
        },
      },
      {
        "@type": "Question",
        name: "Valideyn Kabineti (Parent Dashboard) evdə necə kömək edir?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sistem uşağın zəif və güclü mövzularını dəqiqələr ərzində analiz edib valideynə çatdırır, saatlarla dərs öyrədərkən yaranan əsəb gərginliyini aradan qaldırır.",
        },
      },
      {
        "@type": "Question",
        name: "Şagirdlərin şəxsi məlumatları necə qorunur?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Məlumatlar şifrələnmiş bazada saxlanılır, AI modellərinə şəxsi məlumatlar ötürülmür və heç bir halda üçüncü tərəflərə satılmır.",
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  )
}
