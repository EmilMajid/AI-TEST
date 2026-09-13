"use client"

import { useState } from "react"
import Link from "next/link"
import { BookOpen, Sparkles, Target, Users, ArrowLeft, Award, ShieldCheck } from "lucide-react"
import { LanguageDropdown, Lang } from "@/components/language-dropdown"

export default function AboutPage() {
  const [lang, setLang] = useState<Lang>("az")

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap justify-between items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-primary font-bold text-lg hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5" />
            <span>TESTAI.AZ</span>
          </Link>

          {/* Açılıb-yığılan Language Dropdown */}
          <LanguageDropdown currentLang={lang} onSelectLang={setLang} />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 sm:p-10 space-y-8">
          <div className="border-b border-slate-100 pb-5">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              {lang === "az" && "Süni İntellekt Əsaslı Təhsil və Diaqnostika Platforması"}
              {lang === "en" && "AI-Powered Educational & Diagnostic Platform"}
              {lang === "tr" && "Yapay Zeka Destekli Eğitim ve Teşhis Platformu"}
              {lang === "ru" && "Образовательная ИИ-платформа тестирования и диагностики"}
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-1">
              {lang === "az" && "TESTAI.AZ Haqqında və Pedaqoji Missiyamız"}
              {lang === "en" && "About TESTAI.AZ & Our Pedagogical Mission"}
              {lang === "tr" && "TESTAI.AZ Hakkında ve Pedagojik Misyonumuz"}
              {lang === "ru" && "О проекте TESTAI.AZ и Наша педагогическая миссия"}
            </h1>
          </div>

          {/* AZERBAIJANI */}
          {lang === "az" && (
            <div className="space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed">
              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  1. Giriş və Platformanın Yaranma Zərurəti
                </h2>
                <p>
                  Müasir dünyada təhsilin əsas məqsədi faktları mexaniki şəkildə əzbərləmək deyil, qazanılan bilikləri real həyatda təhlil etmək və tətbiq etmək bacarığıdır. Uzun illərdir ki, şagirdlərimiz və valideynlərimiz məktəb proqramından kənara çıxan, dərsliklərlə uzlaşmayan və uşaqda əzbərçilik vərdişi formalaşdıran çoxsaylı test vəsaitləri arasında çaşqınlıq yaşayırlar.
                </p>
                <p className="mt-2">
                  <strong>TESTAI.AZ</strong> bu boşluğu aradan qaldırmaq, təhsilimizin keyfiyyət standartlarını yüksəltmək və hər bir məktəblinin fərdi inkişaf trayektoriyasını müəyyən etmək məqsədilə yaradılmış <strong>Azərbaycanın ilk dərslik əsaslı süni intellekt təhsil və diaqnostika platformasıdır</strong>.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                  2. Rəsmi Dərslik Bazasının Toxunulmazlığı (e-derslik.edu.az İnteqrasiyası)
                </h2>
                <p>
                  Platformamızın ən böyük üstünlüyü və fərqi onun <strong>100% rəsmi dövlət kurikulumuna əsaslanmasıdır</strong>. TESTAI.AZ sistemindəki bütün mövzular, anlayışlar və test tapşırıqları birbaşa Azərbaycan Respublikası Elm və Təhsil Nazirliyinin <strong>e-derslik.edu.az</strong> portalında təsdiq olunmuş rəsmi dərsliklər əsasında hazırlanır.
                </p>
                <p className="mt-2">
                  RAG (Retrieval-Augmented Generation) süni intellekt arxitekturası sayəsində sistem kənar və ya tədris olunmamış mövzulardan sual tərtib etmir («Zero-Hallucination» prinsipi). I sinifdən XI sinfə qədər bütün fənlər (Riyaziyyat, Azərbaycan dili, Ədəbiyyat, Xarici dillər, Tarix, Fizika, Kimya, Biologiya, Coğrafiya, Təbiət, İnformatika və s.) dərsliklərin ən son nəşrlərinə tam uyğunlaşdırılmışdır.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600" />
                  3. SİTG Standartı və Bloom Taksonomiyası: Əzbərçiliyə Son!
                </h2>
                <p>
                  Platformamız <strong>SİTG (Süni İntellekt Test Generasiya Standartı)</strong> üzrə fəaliyyət göstərir:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1.5">
                  <li><strong>Biliyi deyil, bacarığı ölçmək:</strong> Qaydaları sadəcə xatırlayan deyil, onu cümlədə, tənlikdə və ya məsələdə tətbiq edə bilən şagirdlər yetişdirmək.</li>
                  <li><strong>Bloom Taksonomiyasının Tətbiqi:</strong> Suallar dərəcələrə bölünür: Anlama → Tətbiqetmə → Təhliletmə → Dəyərləndirmə.</li>
                  <li><strong>Pedaqoji Distraktorlar:</strong> Test variantlarındakı yanlış cavablar təsadüfi deyil, şagirdlərin dərslik mövzularında ən çox etdikləri tipik düşüncə və hesablama səhvlərinə əsaslanır.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  4. Müəllim və Valideyn Əməkdaşlığı: Zəhmətin Evdəki Ən Böyük Qoruyucusu
                </h2>
                <p>
                  TESTAI.AZ platforması heç bir halda <strong>müəllimlərimizin və ya repetitorlarımızın əməyini əvəzləmir</strong>. Əksinə, onların sinif otaqlarında və fərdi dərslərdə çəkdiyi fədakar zəhmətin evdəki ən etibarlı dayağıdır:
                </p>
                <p className="mt-2">
                  Müəllim dərsi tədris edir və izah edir, TESTAI.AZ isə uşağın bu dərsi evdə necə qavradığını yoxlayır və möhkəmləndirir. Valideyn Kabineti (Parent Dashboard) sayəsində valideynlər saatlarla uşaqla məşğul olub əsəb gərginliyi yaşamır; sistem bir neçə dəqiqə ərzində uşağın zəif və güclü mövzularını analiz edib valideynə çatdırır.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" />
                  5. Texnoloji Təhlükəsizlik və Gələcəyə Baxış
                </h2>
                <p>
                  Şagirdlərin şəxsi məlumatları və test nəticələri yüksək təhlükəsizlik standartları ilə qorunur. Hədəfimiz paytaxtdan ucqar kəndlərə qədər hər bir Azərbaycan övladına qabaqcıl süni intellekt analitikası ilə bərabər və keyfiyyətli təhsil imkanı təqdim etməkdir.
                </p>
              </section>
            </div>
          )}

          {/* ENGLISH */}
          {lang === "en" && (
            <div className="space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed">
              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  1. Introduction & Background
                </h2>
                <p>
                  In the contemporary era, the true essence of education lies not in rote memorization, but in the cognitive ability to synthesize, analyze, and apply knowledge in real-world scenarios. For years, students and families faced confusion navigating disparate commercial test books that deviated from school curricula.
                </p>
                <p className="mt-2">
                  <strong>TESTAI.AZ</strong> is the premier AI-powered educational testing and diagnostic assessment platform built directly upon the official curriculum textbooks approved by the Ministry of Science and Education of the Republic of Azerbaijan (<strong>e-derslik.edu.az</strong>).
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                  2. Official Curriculum Integrity (e-derslik.edu.az)
                </h2>
                <p>
                  Every assessment item and conceptual metric on TESTAI.AZ is rooted in authorized Ministry textbooks. Leveraging advanced <strong>Retrieval-Augmented Generation (RAG)</strong>, our platform guarantees 100% textbook alignment with zero artificial hallucination across Grades 1 through 11.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600" />
                  3. SITG Standard & Bloom's Taxonomy
                </h2>
                <p>
                  Our pedagogical engine strictly complies with the AI Test Generation Standard (SITG):
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1.5">
                  <li><strong>Evaluating competence over recall:</strong> Focusing on mathematical computation, textual comprehension, and conceptual application.</li>
                  <li><strong>Cognitive Progression:</strong> Multi-tiered classification spanning Comprehension, Application, Analysis, and Evaluation.</li>
                  <li><strong>Pedagogical Distractors:</strong> Formulated according to authentic student misconceptions rather than arbitrary choices.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  4. Empowering Teachers & Supporting Parents
                </h2>
                <p>
                  TESTAI.AZ does not replace educators or tutors; it protects and reinforces their dedicated classroom instruction. Through real-time Parent Dashboards, parents do not have to struggle through study sessions under nervous tension; the system analyzes topic-specific strengths and weaknesses in minutes and delivers the findings directly to the parent.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" />
                  5. Educational Data Protection & Long-Term Vision
                </h2>
                <p>
                  We prioritize safe, equitable learning environments. Assessment data is encrypted and used solely for academic enhancement, expanding quality educational diagnostics to every learner across the country.
                </p>
              </section>
            </div>
          )}

          {/* TURKISH */}
          {lang === "tr" && (
            <div className="space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed">
              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  1. Giriş ve Kuruluş Amacımız
                </h2>
                <p>
                  Modern eğitimde amaç sadece bilgi depolamak değil, öğrenilen bilgiyi problem çözmede ve analitik düşünmede kullanabilmektir.
                </p>
                <p className="mt-2">
                  <strong>TESTAI.AZ</strong>, Azerbaycan Cumhuriyeti Bilim ve Eğitim Bakanlığı tarafından onaylanan resmi ders kitapları (<strong>e-derslik.edu.az</strong>) temelinde geliştirilmiş ilk yapay zeka destekli eğitim ve teşhis platformudur.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                  2. Resmi Müfredat Ders Kitapları Güvencesi
                </h2>
                <p>
                  Sistemimizdeki tüm sorular resmi <strong>e-derslik.edu.az</strong> ders kitapları esas alınarak üretilir. RAG yapay zeka mimarisi sayesinde müfredat dışı ve yanıltıcı içerikler tamamen engellenir. 1'den 11. sınıfa kadar tüm branşlar kapsanmaktadır.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600" />
                  3. SİTG Standardı ve Bloom Taksonomisi
                </h2>
                <p>
                  Ezberci yaklaşımı geride bırakan sistemimiz, öğrencilerin kavrama, uygulama ve analiz düzeylerini ölçer. Seçeneklerdeki çeldiriciler öğrencilerin konularda en sık yaptıkları yanılgılar üzerine kuruludur.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  4. Öğretmen ve Aile Dayanışması
                </h2>
                <p>
                  TESTAI.AZ öğretmen ve eğitmenlerin yerini almaz; onların sınıfta gösterdiği özverili emeği evde pekiştirir. Gelişmiş Veli Paneli sayesinde aileler çocukla ders çalışırken sinir gerginliği yaşamaz; sistem birkaç dakika içinde öğrencinin eksik ve güçlü olduğu konuları analiz ederek doğrudan veliye ulaştırır.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" />
                  5. Veri Güvenliği ve Gelecek Vizyonu
                </h2>
                <p>
                  Öğrenci verileri en yüksek güvenlik standartlarıyla korunur. Amacımız her öğrenciye yapay zeka destekli kaliteli eğitim desteğini eşit şekilde ulaştırmaktır.
                </p>
              </section>
            </div>
          )}

          {/* RUSSIAN */}
          {lang === "ru" && (
            <div className="space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed">
              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  1. Введение и предпосылки создания
                </h2>
                <p>
                  В современном мире ключевой целью образования является развитие критического мышления и способности применять знания на практике, а не механическое заучивание фактов.
                </p>
                <p className="mt-2">
                  <strong>TESTAI.AZ</strong> — передовая образовательная платформа на базе искусственного интеллекта, разработанная в полном соответствии с официальными учебниками Министерства науки и образования Азербайджанской Республики (<strong>e-derslik.edu.az</strong>).
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                  2. Интеграция с официальными учебниками (e-derslik.edu.az)
                </h2>
                <p>
                  Все тестовые задания и диагностические критерии строго базируются на утвержденных учебниках. Архитектура Retrieval-Augmented Generation (RAG) гарантирует полное соответствие учебной программе и исключает ложные факты для 1–11 классов по всем дисциплинам.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600" />
                  3. Стандарт SITG и таксономия Блума
                </h2>
                <p>
                  Платформа ориентирована на оценку практических компетенций: понимание, применение, анализ и оценка. Дистракторы формируются на основе психометрического анализа типичных ошибок школьников.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  4. Сотрудничество педагогов и родителей
                </h2>
                <p>
                  TESTAI.AZ не заменяет труд учителей и репетиторов, а выступает надежным домашним помощником для закрепления школьных уроков. Благодаря Личному кабинету родителя взрослые не испытывают нервного напряжения, занимаясь уроками с ребенком; система за считанные минуты анализирует сильные и слабые темы ученика и напрямую предоставляет аналитику родителю.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" />
                  5. Безопасность данных и долгосрочное видение
                </h2>
                <p>
                  Персональные данные учащихся надежно защищены. Наша цель — обеспечить равный доступ к передовой ИИ-диагностике и качественному образованию для каждого школьника страны.
                </p>
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
