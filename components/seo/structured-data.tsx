import { Lang } from "@/components/language-dropdown"
import { DEFAULT_LOCALE } from "@/lib/config"

interface StructuredDataProps {
  lang?: Lang
}

const DESCRIPTIONS: Record<Lang, string> = {
  en: "TESTAI.AZ is an AI-powered educational testing, diagnostic assessment, and learning analytics platform grounded in authorized curriculum textbooks.",
  az: "Azərbaycan Respublikası Elm və Təhsil Nazirliyinin təsdiq etdiyi rəsmi dərsliklər əsasında fəaliyyət göstərən süni intellekt təhsil və diaqnostika platforması.",
  tr: "Resmi ders kitapları temelinde çalışan yapay zeka destekli eğitim ve tanısal değerlendirme platformu.",
  ru: "Образовательная ИИ-платформа тестирования и диагностики на основе официальных школьных учебников.",
}

const FAQ_DATA: Record<Lang, { q: string; a: string }[]> = {
  en: [
    {
      q: "What do the assessment scores on TESTAI.AZ signify?",
      a: "Scores on TESTAI.AZ are supplementary diagnostic evaluations created to identify conceptual learning gaps and strengths. They do not constitute official school grades or Ministry diplomas.",
    },
    {
      q: "Which textbooks are the questions derived from?",
      a: "All topics and assessment items are strictly aligned with authorized curriculum textbooks approved by educational authorities (e-derslik.edu.az).",
    },
    {
      q: "How does the Parent Dashboard support home learning?",
      a: "The dashboard analyzes topic-specific strengths and weaknesses in minutes, delivering actionable pedagogical feedback to support student progress without study stress.",
    },
    {
      q: "How is student personal data safeguarded?",
      a: "Data is encrypted in transit and at rest. No identifying personal data is dispatched to external AI models, and user records are never sold to third parties.",
    },
  ],
  az: [
    {
      q: "TESTAI.AZ platformasında test nəticəsi nə deməkdir?",
      a: "TESTAI.AZ-da toplanan xallar və nəticələr sırf diaqnostik xarakter daşıyır. Məqsəd şagirdin hansı mövzuda boşluğu olduğunu aşkar etməkdir; rəsmi məktəb qiymətini və ya DİM attestasiyasını əvəz etmir.",
    },
    {
      q: "Test sualları hansı dərsliklər əsasında hazırlanır?",
      a: "Bütün test tapşırıqları Azərbaycan Respublikası Elm və Təhsil Nazirliyinin e-derslik.edu.az portalında təsdiq olunmuş rəsmi dövlət dərslikləri əsasında hazırlanır.",
    },
    {
      q: "Valideyn Kabineti (Parent Dashboard) evdə necə kömək edir?",
      a: "Sistem uşağın zəif və güclü mövzularını dəqiqələr ərzində analiz edib valideynə çatdırır, saatlarla dərs öyrədərkən yaranan əsəb gərginliyini aradan qaldırır.",
    },
    {
      q: "Şagirdlərin şəxsi məlumatları necə qorunur?",
      a: "Məlumatlar şifrələnmiş bazada saxlanılır, AI modellərinə şəxsi məlumatlar ötürülmür və heç bir halda üçüncü tərəflərə satılmır.",
    },
  ],
  tr: [
    {
      q: "TESTAI.AZ platformundaki sınav sonuçları ne anlama gelir?",
      a: "Sonuçlar tamamen tanı ve gelişim amaçlıdır. Öğrencinin eksik olduğu konuları belirlemeyi hedefler; resmi okul notu niteliği taşımaz.",
    },
    {
      q: "Sorular hangi ders kitaplarına dayanmaktadır?",
      a: "Tüm sorular resmi müfredat ders kitapları temel alınarak üretilir.",
    },
    {
      q: "Veli Paneli ailelere nasıl yardımcı olur?",
      a: "Sistem öğrencinin güçlü ve zayıf konularını birkaç dakika içinde velinin ekranına raporlar.",
    },
    {
      q: "Öğrenci verileri nasıl korunmaktadır?",
      a: "Veriler şifrelenmiş veritabanında korunur ve üçüncü taraflara satılmaz.",
    },
  ],
  ru: [
    {
      q: "Что означают результаты тестирования на TESTAI.AZ?",
      a: "Оценки на TESTAI.AZ носят исключительно диагностический характер для выявления пробелов в знаниях и не заменяют официальные школьные оценки.",
    },
    {
      q: "На основе каких учебников составлены тесты?",
      a: "Все задания составлены строго на основе официальных школьных учебников (e-derslik.edu.az).",
    },
    {
      q: "Как родительский контроль помогает в учебе?",
      a: "Система за считанные минуты анализирует сильные и слабые темы ученика и предоставляет наглядный отчет родителям.",
    },
    {
      q: "Как защищены персональные данные учащихся?",
      a: "Данные зашифрованы, личные сведения не передаются внешним ИИ-моделям и никогда не передаются третьим лицам.",
    },
  ],
}

export function StructuredData({ lang = DEFAULT_LOCALE }: StructuredDataProps) {
  const currentLang = lang || DEFAULT_LOCALE
  const faqs = FAQ_DATA[currentLang] || FAQ_DATA.en

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "TESTAI.AZ",
    alternateName: "AI Educational & Diagnostic Testing Platform",
    url: "https://www.testai.az",
    logo: "https://www.testai.az/logo.jpg",
    email: "aztestai.az@gmail.com",
    sameAs: [
      "https://www.instagram.com/testai.az/",
      "https://www.facebook.com/profile.php?id=61594359745552",
      "https://www.youtube.com/channel/UCSsFhuYKk6MHdLna05kfJrA",
    ],
    description: DESCRIPTIONS[currentLang] || DESCRIPTIONS.en,
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "TESTAI.AZ",
    url: "https://www.testai.az",
    inLanguage: ["en", "az", "tr", "ru"],
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.testai.az/open-tests",
      "query-input": "required name=search_term_string",
    },
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
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
