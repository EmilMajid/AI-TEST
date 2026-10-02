"use client"

import Link from "next/link"
import { BookOpen, Network, GitBranch, HeartHandshake, CheckCircle2, ArrowRight, Sparkles, BrainCircuit } from "lucide-react"
import { Lang } from "@/components/language-dropdown"
import { DEFAULT_LOCALE } from "@/lib/config"

interface HomeMethodologyProps {
  lang: Lang
}

const METHODOLOGY_CONTENT = {
  az: {
    badge: "PEDAQOJİ İNTELLEKT VƏ ELMİ MEMARLIQ",
    title: "TESTAI.AZ Metodologiyası: RAG, KAG və Geriyə Xəritələnmə",
    subtitle:
      "Ənənəvi test saytlarından fərqli olaraq, TESTAI.AZ əzbərçiliyi deyil, dərin analitik düşüncəni və bilik zəncirini ölçən qabaqcıl süni intellekt arxitekturasına əsaslanır.",
    cards: [
      {
        icon: BookOpen,
        color: "text-emerald-600 bg-emerald-50 border-emerald-200",
        badge: "RAG Arxitekturası",
        title: "Dərslik Əsaslı Generasiya (Dəqiq Məzmun)",
        desc: "Sistem internetdən təsadüfi və ya yoxlanılmamış məlumatlar götürmür. Bütün test tapşırıqları Azərbaycan Respublikası Elm və Təhsil Nazirliyinin təsdiq etdiyi rəsmi dərsliklərə (e-derslik.edu.az) semantik olaraq bağlanır. Nəticədə kurikulumdan kənar sual və AI xətaları minimuma endirilir.",
        highlight: "Tədris proqramına uyğunluq nəzarəti ilə dərslik əsaslı qiymətləndirmə",
      },
      {
        icon: Network,
        color: "text-blue-600 bg-blue-50 border-blue-200",
        badge: "KAG Bilik Qrafları",
        title: "Konseptual və Fənlərarası Əlaqələr",
        desc: "Mövzular təcrid olunmuş şəkildə öyrədilmir. KAG sistemi fənlər və fəsillər arasında çoxölçülü bilik şəbəkəsi qurur. Məsələn, Fizikada Nyuton qanunu sualında şagirdin çətinliyi Riyaziyyatdakı vektor və koordinat anlayışlarının dərəcəsi ilə əlaqələndirilir.",
        highlight: "Fənlərarası zəncirvari inteqrasiya",
      },
      {
        icon: GitBranch,
        color: "text-indigo-600 bg-indigo-50 border-indigo-200",
        badge: "Geriyə Xəritələnmə",
        title: "Biliyin Geriyə Xəritələnməsi (Kök Səbəb Diaqnozu)",
        desc: "8-ci sinif şagirdi mürəkkəb tənlikdə və ya kimyəvi reaksiyada səhv etdikdə, problem çox vaxt həmin mövzuda deyil, 5-6-cı sinifdəki təməl kəsrlər və ya mənfi ədədlər qaydasındadır. Sistem səhvi geriyə izləyərək dəqiq hansı sinif və mövzuda boşluq olduğunu aşkar edir.",
        highlight: "Kök səbəblərin diaqnostik təhlili",
      },
      {
        icon: HeartHandshake,
        color: "text-rose-600 bg-rose-50 border-rose-200",
        badge: "Valideyn Kabineti",
        title: "Valideynə Real Dəyər: Hədəfli və Qısa Tədris Tövsiyələri",
        desc: "Valideynlərin saatlarla uşaqla dərs üstündə əsəb gərginliyi keçirməsinə və ya kor-koranə repetitor axtarışında vaxt və büdcə itirməsinə son qoyulur. Valideyn Paneli şagirdin potensial bilik boşluqlarının aşkar edilməsinə kömək edir və hədəfli qısa təkrar tövsiyələri ilə akademik inamı möhkəmləndirir.",
        highlight: "Stressiz və qənaətli təhsil nəzarəti",
      },
    ],
    demoTitle: "Diaqnostika Necə İşləyir? İllüstrativ Ssenari",
    demoStudentErr: "Şagirdin Səhvi: 8-ci sinif Fizika (Sıxlıq və Arximed Qüvvəsi düsturu hesablama tapşırığı)",
    demoRootCause: "İllüstrativ Diaqnostik Ssenari: Şagird Arximed qanununu anlayır, lakin 6-cı sinif Riyaziyyat kursundakı 'onluq kəsrlərin bölünməsi' qaydasında təməl boşluq müşahidə olunur.",
    demoAction: "Həll: 8-ci sinif dərsini təkrar oxumaq əvəzinə, təməl mövzunun hədəfli təkrarı ilə önkoşul riyazi bacarığın möhkəmləndirilməsi təmin edilir.",
    readBlogBtn: "Metodologiya Haqqında Ətraflı Məqalələr",
  },
  en: {
    badge: "PEDAGOGICAL INTELLIGENCE & ARCHITECTURE",
    title: "TESTAI.AZ Methodology: RAG, KAG & Backward Mapping",
    subtitle:
      "Unlike conventional quiz sites, TESTAI.AZ is engineered around foundational AI architectures designed to measure conceptual mastery rather than rote memorization.",
    cards: [
      {
        icon: BookOpen,
        color: "text-emerald-600 bg-emerald-50 border-emerald-200",
        badge: "RAG Architecture",
        title: "Curriculum-Anchored Retrieval (Hallucination-Minimized)",
        desc: "Our engine never ingests unverified web trivia. Every diagnostic test item is semantically grounded directly in official textbooks approved by the Ministry of Science and Education (e-derslik.edu.az), significantly minimizing hallucinated distractors and out-of-syllabus tangents.",
        highlight: "Textbook-grounded assessment with curriculum-alignment controls",
      },
      {
        icon: Network,
        color: "text-blue-600 bg-blue-50 border-blue-200",
        badge: "KAG Knowledge Graphs",
        title: "Cross-Subject Semantic Pre-requisites",
        desc: "Academic concepts are structured into an interconnected graph rather than isolated silos. If a student struggles with Newton's laws in Physics, KAG maps this deficit directly back to foundational mathematical vectors and algebraic representations.",
        highlight: "Multi-dimensional interdisciplinary links",
      },
      {
        icon: GitBranch,
        color: "text-indigo-600 bg-indigo-50 border-indigo-200",
        badge: "Backward Mapping",
        title: "Retroactive Cognitive Diagnosis (Root Cause Analysis)",
        desc: "When an 8th-grade student fails an advanced algebra or stoichiometry problem, the core bottleneck frequently stems from a 5th-grade fractional gap. Our diagnostic engine traces back the cognitive path to identify potential prerequisite cognitive gaps.",
        highlight: "Curriculum-guided prerequisite gap identification",
      },
      {
        icon: HeartHandshake,
        color: "text-rose-600 bg-rose-50 border-rose-200",
        badge: "Parent Intelligence",
        title: "Empowering Parents: Targeted Micro-Practice Recommendations",
        desc: "Parents no longer endure intense homework friction or waste resources on unfocused tutoring. The Parent Dashboard helps identify potential conceptual blockers and suggests targeted micro-practice recommendations to steadily rebuild academic confidence.",
        highlight: "Stress-free, targeted academic recovery",
      },
    ],
    demoTitle: "How Our Diagnosis Works: An Illustrative Case",
    demoStudentErr: "Observed Mistake: 8th Grade Physics (Buoyancy & Density computation problem)",
    demoRootCause: "Illustrative Diagnostic Scenario: In this case, the engine identifies that the student understands Archimedes' principle, but committed an error due to a 6th Grade Math decimal division prerequisite gap.",
    demoAction: "Targeted Action: Instead of blindly re-reading physics chapters, focused review of foundational decimal division strengthens the required prerequisite skill.",
    readBlogBtn: "Explore Pedagogical Research Articles",
  },
  tr: {
    badge: "PEDAGOJİK ZEKA VE MİMARİ",
    title: "TESTAI.AZ Metodolojisi: RAG, KAG ve Geriye Haritalama",
    subtitle:
      "TESTAI.AZ, ezberciliği değil analitik düşünceyi ölçen gelişmiş yapay zeka mimarisiyle resmi ders kitaplarına dayanır.",
    cards: [
      {
        icon: BookOpen,
        color: "text-emerald-600 bg-emerald-50 border-emerald-200",
        badge: "RAG Mimarisi",
        title: "Ders Kitabı Temelli Soru Üretimi (Yüksek Doğruluk)",
        desc: "İnternetteki doğrulanmamış kaynaklar yerine doğrudan Milli Eğitim Bakanlığı onaylı resmi ders kitaplarına (e-derslik.edu.az) bağlanır. Müfredat dışı sorular ve yanılsamalar asgariye indirilir.",
        highlight: "Müfredat uyum kontrolleriyle ders kitabı temelli değerlendirme",
      },
      {
        icon: Network,
        color: "text-blue-600 bg-blue-50 border-blue-200",
        badge: "KAG Bilgi Grafları",
        title: "Disiplinlerarası Kavramsal Bağlantılar",
        desc: "Konular birbirinden bağımsız incelenmez. Fizik dersindeki kuvvet konusundaki zorluklar, Matematik dersindeki vektör ve oran kavramlarıyla anında ilişkilendirilir.",
        highlight: "Çok boyutlu kavram haritalaması",
      },
      {
        icon: GitBranch,
        color: "text-indigo-600 bg-indigo-50 border-indigo-200",
        badge: "Geriye Haritalama",
        title: "Geriye Doğru Kök Neden Teşhisi",
        desc: "8. sınıf öğrencisi denklem çözemiyorsa, sorun 5. veya 6. sınıftaki kesirler veya negatif sayılar eksiğinden kaynaklanabilir. Sistem olası önkoşul eksikliklerini haritalandırır.",
        highlight: "Önkoşul eksikliklerinin tanısal analizi",
      },
      {
        icon: HeartHandshake,
        color: "text-rose-600 bg-rose-50 border-rose-200",
        badge: "Veli Rehberliği",
        title: "Veliler İçin Huzur: Hedefli ve Kısa Tekrar Önerileri",
        desc: "Ailelerin ders çalışırken yaşadığı gerginliğe ve verimsiz özel ders harcamalarına son. Veli Paneli olası kavramsal eksiklikleri tespit etmeye yardımcı olur ve kısa, odaklı tekrarlarla akademik özgüveni pekiştirir.",
        highlight: "Stresten uzak ve hedef odaklı takip",
      },
    ],
    demoTitle: "Teşhis Sistemi Nasıl Çalışır? Örnek Senaryo",
    demoStudentErr: "Öğrenci Hatası: 8. Sınıf Fizik (Kaldırma Kuvveti formül uygulaması)",
    demoRootCause: "Örnek Tanısal Senaryo: Öğrenci fizik kanununu biliyor, ancak 6. sınıf ondalık kesirler konusunda olası bir önkoşul eksiği tespit edilmektedir.",
    demoAction: "Çözüm: Fizik konusunu ezbere tekrar etmek yerine, temel ondalık kesir alıştırmalarıyla önkoşul becerisinin güçlendirilmesi hedeflenir.",
    readBlogBtn: "Metodoloji Makalelerini İnceleyin",
  },
  ru: {
    badge: "ПЕДАГОГИЧЕСКИЙ ИНТЕЛЛЕКТ И АРХИТЕКТУРА",
    title: "Методология TESTAI.AZ: RAG, KAG и Обратное Картирование",
    subtitle:
      "В отличие от сайтов-тестировщиков, TESTAI.AZ измеряет не механическую память, а аналитическое мышление на базе передовой ИИ-архитектуры.",
    cards: [
      {
        icon: BookOpen,
        color: "text-emerald-600 bg-emerald-50 border-emerald-200",
        badge: "Архитектура RAG",
        title: "Привязка к официальным учебникам (Точная верификация)",
        desc: "Система исключает непроверенные источники из сети. Все проверочные задания генерируются строго по официальным учебникам (e-derslik.edu.az), минимизируя риск галлюцинаций ИИ.",
        highlight: "Оценка на базе учебников с контролем соответствия программе",
      },
      {
        icon: Network,
        color: "text-blue-600 bg-blue-50 border-blue-200",
        badge: "Графы KAG",
        title: "Межпредметные концептуальные связи",
        desc: "Темы не изолированы друг от друга. Сложности по физике связываются с пробелами в базовом математическом аппарате (векторы, пропорции, координаты).",
        highlight: "Межпредметный анализ предпосылок",
      },
      {
        icon: GitBranch,
        color: "text-indigo-600 bg-indigo-50 border-indigo-200",
        badge: "Обратное картирование",
        title: "Ретроактивная диагностика первопричин",
        desc: "Если ученик 8 класса ошибается в сложной задаче, причина часто кроется в правилах дробей 5-6 класса. Алгоритм помогает выявить потенциальный первоначальный пробел.",
        highlight: "Диагностический анализ первопричин",
      },
      {
        icon: HeartHandshake,
        color: "text-rose-600 bg-rose-50 border-rose-200",
        badge: "Польза для родителей",
        title: "Спокойствие родителей: Точечные рекомендации для повторения",
        desc: "Родителям больше не нужно часами ссориться из-за уроков или нанимать дорогих репетиторов вслепую. Панель родителя помогает выявить возможные пробелы и предлагает краткие целевые упражнения для укрепления знаний.",
        highlight: "Осознанный контроль без стресса",
      },
    ],
    demoTitle: "Как работает диагностика: Иллюстративный сценарий",
    demoStudentErr: "Ошибка ученика: 8 класс, Физика (расчет силы Архимеда и плотности)",
    demoRootCause: "Иллюстративный сценарий: Ученик понимает принцип Архимеда, но допустил ошибку из-за пробела в базовом делении десятичных дробей за 6 класс.",
    demoAction: "Решение: Вместо заучивания параграфа по физике, целевое повторение темы десятичных дробей помогает устранить первоначальный пробел.",
    readBlogBtn: "Читать научные статьи по методологии",
  },
}

export function HomeMethodology({ lang }: HomeMethodologyProps) {
  const content = METHODOLOGY_CONTENT[lang] || METHODOLOGY_CONTENT.en
  const blogLink = lang === DEFAULT_LOCALE ? "/blog" : `/${lang}/blog`

  return (
    <section className="mb-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100/70 text-indigo-800 text-xs font-bold uppercase tracking-wider mb-3 border border-indigo-200/50">
          <BrainCircuit className="w-3.5 h-3.5 text-indigo-600" />
          <span>{content.badge}</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
          {content.title}
        </h3>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          {content.subtitle}
        </p>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {content.cards.map((card, idx) => {
          const Icon = card.icon
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${card.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {card.badge}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-slate-900">
                  {card.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {card.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{card.highlight}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Interactive Practical Demo Showcase */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-lg border border-indigo-900/40 mb-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>{content.demoTitle}</span>
          </div>
          <div className="space-y-2.5 text-xs sm:text-sm text-slate-200">
            <p className="flex items-start gap-2">
              <span className="font-bold text-rose-400 shrink-0">❌</span>
              <span>{content.demoStudentErr}</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="font-bold text-blue-400 shrink-0">🔍</span>
              <span>{content.demoRootCause}</span>
            </p>
            <p className="flex items-start gap-2 bg-white/10 p-3 rounded-xl border border-white/10 text-emerald-300 font-medium">
              <span className="font-bold text-emerald-400 shrink-0">✅</span>
              <span>{content.demoAction}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Button to Blog */}
      <div className="text-center">
        <Link
          href={blogLink}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm transition-all shadow-sm"
        >
          <span>{content.readBlogBtn}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  )
}
