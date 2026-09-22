"use client"

import { useState } from "react"
import { ChevronDown, HelpCircle } from "lucide-react"
import { Lang } from "@/components/language-dropdown"

interface FAQItem {
  q: string
  a: string
}

interface FAQSectionProps {
  lang: Lang
}

export function FAQSection({ lang }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx)
  }

  const faqs: Record<Lang, FAQItem[]> = {
    az: [
      {
        q: "TESTAI.AZ platformasında test nəticəsi nə deməkdir?",
        a: "TESTAI.AZ-da toplanan xallar və nəticələr sırf diaqnostik xarakter daşıyır. Məqsəd şagirdin hansı mövzuda boşluğu olduğunu aşkar etmək və fərdi inkişaf trayektoriyası qurmaqdır. Bu nəticələr rəsmi məktəb qiymətini və ya DİM attestasiyasını əvəz etmir.",
      },
      {
        q: "Valideyn Kabineti (Parent Dashboard) evdə necə kömək edir?",
        a: "Valideynlər saatlarla uşaqla dərs hazırlayıb əsəb gərginliyi yaşamırlar. Sistem bir neçə dəqiqə ərzində uşağın mövzular üzrə güclü və zəif tərəflərini, suallara düşünmə vaxtını və tipik düşüncə xətalarını təhlil edib birbaşa valideynin ekranına çatdırır.",
      },
      {
        q: "Test sualları hansı dərsliklər əsasında hazırlanır?",
        a: "Platformadakı bütün mövzu və test bazası birbaşa Azərbaycan Respublikası Elm və Təhsil Nazirliyinin e-derslik.edu.az portalında təsdiq olunmuş rəsmi dərsliklərin ən son nəşrləri əsasında tərtib edilir.",
      },
      {
        q: "SİTG metodologiyası nədir və əzbərçiliyin qarşısını necə alır?",
        a: "SİTG (Süni İntellekt Test Generasiya Metodologiyası) TESTAI.AZ tərəfindən formalaşdırılmış pedaqoji yanaşmadır. Yenilənmiş Bloom Taksonomiyasına əsaslanaraq qaydanı əzbərdən xatırlayan deyil, onu cümlədə, tənlikdə və ya məsələdə tətbiq və təhlil edə bilən şagirdlərin bacarığını ölçür.",
      },
      {
        q: "Şagirdlərin şəxsi məlumatları necə qorunur?",
        a: "Məlumatlar beynəlxalq təhlükəsizlik sertifikatlı şifrələnmiş bazada (Supabase) qorunur. Süni İntellekt modellərinə şagirdlərin heç bir adı, soyadı və ya əlaqə vasitəsi ötürülmür (yalnız dərslik konteksti göndərilir) və məlumatlar heç vaxt kənar şirkətlərə satılmır.",
      },
      {
        q: "Qeydiyyatsız açıq sınaq etmək mümkündürmü?",
        a: "Bəli! Saytın 'Açıq Sınaqlar' bölməsində I, V, IX və XI siniflər üzrə 4 xarici dildə (İngilis, Alman, Rus, Fransız) 1-ci mövzular üzrə heç bir qeydiyyat tələb olunmadan dərhal diaqnostik test işləmək mümkündür.",
      },
    ],
    en: [
      {
        q: "What do the assessment scores on TESTAI.AZ signify?",
        a: "Scores and performance metrics on TESTAI.AZ are supplementary diagnostic evaluations created to identify conceptual learning gaps. They do not constitute official school grades or Ministry diplomas.",
      },
      {
        q: "How does the Parent Dashboard support home learning?",
        a: "Parents avoid stressful multi-hour study sessions. In minutes, the dashboard pinpoints which topics need reinforcement, how much time the learner took, and delivers actionable pedagogical feedback.",
      },
      {
        q: "Which textbooks are the questions derived from?",
        a: "All topics and assessment items are strictly aligned with authorized curriculum textbooks approved by the Ministry of Science and Education of Azerbaijan (e-derslik.edu.az).",
      },
      {
        q: "What is the SITG methodology?",
        a: "SITG (AI Test Generation Methodology) is our proprietary pedagogical framework grounded in Revised Bloom's Taxonomy, designed to evaluate real-world competence and conceptual application rather than rote recall.",
      },
      {
        q: "How is student personal data safeguarded?",
        a: "Data is encrypted in transit and at rest. No identifying personal data (names, contact details) is ever dispatched to AI language models, and user records are never sold or rented.",
      },
      {
        q: "Can users take diagnostic tests without registration?",
        a: "Yes! Our 'Open Diagnostic Tests' section allows anyone to select a grade and foreign language (English, German, French, Russian) and immediately practice Topic 1 without signing up.",
      },
    ],
    tr: [
      {
        q: "TESTAI.AZ platformundaki sınav sonuçları ne anlama gelir?",
        a: "Sonuçlar tamamen tanı ve gelişim amaçlıdır. Öğrencinin eksik olduğu konuları belirlemeyi hedefler; resmi okul notu veya diploma niteliği taşımaz.",
      },
      {
        q: "Veli Paneli ailelere nasıl yardımcı olur?",
        a: "Veliler çocuklarıyla ders çalışırken saatlerce süren gerginlik yaşamaz. Sistem öğrencinin güçlü ve zayıf konularını birkaç dakika içinde velinin ekranına raporlar.",
      },
      {
        q: "Sorular hangi ders kitaplarına dayanmaktadır?",
        a: "Tüm sorular e-derslik.edu.az portalında yer alan Azerbaycan Cumhuriyeti resmi müfredat ders kitapları temel alınarak üretilir.",
      },
      {
        q: "Öğrenci verileri nasıl korunmaktadır?",
        a: "Veriler şifreli sunucularda saklanır. Yapay zekâ sorgularına hiçbir kişisel veri aktarılmaz ve ticari amaçla satılmaz.",
      },
    ],
    ru: [
      {
        q: "Что означают результаты тестирования на TESTAI.AZ?",
        a: "Результаты носят исключительно диагностический характер для выявления пробелов в знаниях и не заменяют официальные школьные оценки или государственные аттестаты.",
      },
      {
        q: "Как Кабинет Родителя помогает в обучении?",
        a: "Родителям больше не нужно часами сидеть над уроками в стрессе. Система за считанные минуты анализирует сильные и слабые стороны ученика и выводит объективный отчет.",
      },
      {
        q: "На каких учебниках основаны тесты?",
        a: "Все задания разрабатываются строго на базе официальных учебников Министерства науки и образования Азербайджана (e-derslik.edu.az).",
      },
      {
        q: "Как защищены данные учащихся?",
        a: "Данные зашифрованы и не передаются в сторонние модели ИИ при формировании запросов. Продажа или передача данных третьим лицам исключена.",
      },
    ],
  }

  const currentFaqs = faqs[lang] || faqs.az

  const sectionTitles: Record<Lang, { badge: string; title: string; subtitle: string }> = {
    az: {
      badge: "TEZ-TEZ VERİLƏN SUALLAR (FAQ)",
      title: "Valideynlər və Şagirdlər Üçün Ən Vacib Cavablar",
      subtitle: "TESTAI.AZ platformasının fəaliyyəti, tədris metodologiyası və təhlükəsizlik qaydaları haqqında məlumat.",
    },
    en: {
      badge: "FREQUENTLY ASKED QUESTIONS",
      title: "Everything Parents & Students Need to Know",
      subtitle: "Learn how TESTAI.AZ empowers learners, ensures curriculum fidelity, and safeguards personal privacy.",
    },
    tr: {
      badge: "SIKÇA SORULAN SORULAR",
      title: "Veliler ve Öğrenciler İçin Temel Sorular",
      subtitle: "Platformun işleyişi, müfredat uyumluluğu ve veri güvenliği ilkeleri.",
    },
    ru: {
      badge: "ЧАСТО ЗАДАВАЕМЫЕ ВОПРОСЫ",
      title: "Все, что важно знать родителям и школьникам",
      subtitle: "Информация о методике тестирования, привязке к учебникам и защите личных данных.",
    },
  }

  const t = sectionTitles[lang] || sectionTitles.az

  return (
    <section className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 sm:p-10 mb-16">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3 border border-blue-100">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{t.badge}</span>
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">{t.title}</h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{t.subtitle}</p>
      </div>

      <div className="max-w-3xl mx-auto divide-y divide-slate-200">
        {currentFaqs.map((faq, idx) => {
          const isOpen = openIndex === idx
          return (
            <div key={idx} className="py-4 sm:py-5">
              <button
                onClick={() => toggle(idx)}
                className="w-full flex items-center justify-between gap-4 text-left font-bold text-slate-900 hover:text-primary transition-colors cursor-pointer text-sm sm:text-base"
                aria-expanded={isOpen}
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-primary" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed pl-1 pr-4 animate-in fade-in duration-200">
                  {faq.a}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
